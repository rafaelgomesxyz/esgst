import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';
import { logger } from '../../class/Logger';
import { FetchRequest } from '../../class/FetchRequest';
import { Popout } from '../../class/Popout';

class GeneralThreadSubscription extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Allows you to subscribe to threads so that you\'re notified when a new comment is posted.'],
          ['li', [
            'Adds a ',
            ['i', { class: 'fa fa-bell-o' }],
            ' button to the header that allows you to view your subscriptions.'
          ]]
        ]]
      ],
      id: 'tds',
      name: 'Thread Subscription',
      sg: true,
      st: true,
      type: 'general',
      features: {
        tds_n: {
          name: 'Show browser notifications when there are new comments in the subscriptions.',
          sg: true,
          st: true
        }
      },
      inputItems: [
        {
          attributes: {
            min: 0,
            type: 'number'
          },
          id: 'tds_minutes',
          prefix: 'Check every ',
          suffix: ' minutes'
        }
      ]
    };

    this.button = null;
    this.lockObj = null;
    this.minutes = null;
    this.popout = null;
    this.subscribedItems = [];
  }

  async init() {
    this.button = shared.common.addHeaderButton('fa-circle-o-notch fa-spin', 'inactive', 'Loading your subscriptions');

    this.popout = new Popout('esgst-tds-popout', this.button.button, 0, true);

    this.minutes = parseInt(gSettings.tds_minutes) * 60000;

    this.startDaemon();

    if (!shared.esgst.commentsPath) {
      return;
    }

    const match = window.location.pathname.match(/(discussion|ticket|trade)\/(.+?)\//);
    const type = `${match[1]}s`;
    const code = match[2];
    
    const context = document.querySelector('.page__heading, .page_heading');
    const name = context.querySelector('h1').textContent.trim();

    const heading = shared.esgst.mainPageHeading.querySelector('.page__heading__breadcrumbs, .page_heading_breadcrumbs').firstElementChild;    
    const count = parseInt(heading.textContent.replace(/,/g, '').match(/\d+/)[0]);

    if (shared.esgst.discussionPath || shared.esgst.tradePath) {
      const savedThread = shared.esgst[type][code];

      if (savedThread && typeof savedThread.subscribed !== 'undefined') {
        this.addUnsubscribeButton(null, code, context, count, name, type);
      } else {
        this.addSubscribeButton(null, code, context, count, name, type);
      }
    }
  }

  async dismissItem(event, item) {
    item.subscribed = item.count;
    item.diff = 0;

    await this.subscribe(item.code, item.count, item.name, item.type);

    event.target.remove();

    await shared.common.notifyTds(this.subscribedItems);
  }

  async unsubscribeItem(element, item) {
    delete item.subscribed;

    await this.unsubscribe(item.code, item.type);

    element.remove();

    await shared.common.notifyTds(this.subscribedItems);

    if (this.popout.isOpen) {
      this.popout.reposition();
    }
  }

  async updatePopout() {
    this.popout.popout.innerHTML = '';

    this.subscribedItems = this.subscribedItems.filter(item => typeof item.subscribed !== 'undefined');
    this.subscribedItems.sort((a, b) => a.diff > b.diff ? -1 : 1);

    for (const item of this.subscribedItems) {
      const element = shared.common.createElements_v2(this.popout.popout, 'beforeEnd', [
        ['div', { class: `esgst-tds-item ${item.diff ? 'esgst-tds-item-active' : ''}` }, [
          ['div', { class: 'esgst-tds-item-description' }, [
            ['a', { class: 'esgst-tds-item-name', href: item.type === 'discussions' ? `https://www.steamgifts.com/discussion/${item.code}/` : `https://www.steamtrades.com/${item.code}/` }, item.name],
            ['div', { class: 'esgst-tds-item-count' }, item.diff ? `${item.diff} new comments` : 'No new comments']
          ]],
          ['div', { class: 'esgst-tds-item-actions' }, [
            item.diff
              ? ['i', { class: 'fa fa-eye', title: 'Dismiss', onclick: event => this.dismissItem(event, item) }]
              : null,
            ['i', { class: 'fa fa-bell', title: 'Unsubscribe', onclick: () => this.unsubscribeItem(element, item) }]
          ]]
        ]]
      ]);
    }

    if (this.popout.isOpen) {
      this.popout.reposition();
    }
  }

  updateButton() {
    if (this.subscribedItems.filter(item => item.diff).length) {
      this.button.changeIcon('fa-bell');
      this.button.changeState('active');
      this.button.changeTitle('New comments in your subscriptions, click to see');
    } else {
      this.button.changeIcon('fa-bell-o');
      this.button.changeState('inactive');
      this.button.changeTitle('No new comments in your subscriptions');
    }

    this.updatePopout();
  }

  updateItems(items) {
    this.subscribedItems = items;

    this.updateButton();
  }

  async showNotification() {
    const result = await window.Notification.requestPermission();

    if (result !== 'granted') {
      return;
    }
     
    new Notification('ESGST Notification', {
      body: 'There are new comments in your subscriptions.',
      icon: 'https://dl.dropboxusercontent.com/s/lr3t3bxrxfxylqe/esgstIcon.ico?raw=1',
      tag: 'TDS'
    });
  }

  async runDaemon(firstRun) {
    //logger.info('Running TDS daemon...');

    await shared.common.updateLock(this.lockObj.lock);

    const oldDiff = this.subscribedItems.filter(item => item.diff)
      .reduce((sum, currentItem) => sum + currentItem.diff, 0);

    this.subscribedItems = [];

    for (const code in shared.esgst.discussions) {
      const discussion = shared.esgst.discussions[code];

      if (typeof discussion.subscribed !== 'undefined') {
        this.subscribedItems.push({
          code,
          count: discussion.subscribed,
          diff: 0,
          name: discussion.name,
          subscribed: discussion.subscribed,
          type: 'discussions'
        });
      }
    }

    for (const code in shared.esgst.trades) {
      const trade = shared.esgst.trades[code];

      if (typeof trade.subscribed !== 'undefined') {
        this.subscribedItems.push({
          code,
          count: trade.subscribed,
          diff: 0,
          name: trade.name,
          subscribed: trade.subscribed,
          type: 'trades'
        });
      }
    }

    for (const item of this.subscribedItems) {
      const response = await FetchRequest.get(item.type === 'discussions' ? `https://www.steamgifts.com/discussion/${item.code}/` : `https://www.steamtrades.com/trade/${item.code}/`);
      
      const mainPageHeading = response.html.querySelectorAll('.page__heading, .page_heading')[1];

      const heading = mainPageHeading.querySelector('.page__heading__breadcrumbs, .page_heading_breadcrumbs').firstElementChild;
      const count = parseInt(heading.textContent.replace(/,/g, '').match(/\d+/)[0]);

      if (count !== item.count) {
        item.diff = count - item.count;
        item.count = count;
      }
    }

    const newDiff = this.subscribedItems.filter(item => item.diff)
      .reduce((sum, currentItem) => sum + currentItem.diff, 0);

    if (gSettings.tds_n && !firstRun && oldDiff !== newDiff) {
      this.showNotification();
    }

    shared.common.notifyTds(this.subscribedItems);

    this.updateButton();

    window.setTimeout(this.runDaemon.bind(this, false), this.minutes);
  }

  async startDaemon() {
    this.lockObj = await shared.common.createLock('tdsLock', 300, {
      lockOrDie: true,
      timeout: this.minutes + 15000
    });

    if (!this.lockObj.wasLocked) {
      //logger.info('TDS Daemon already running....');

      this.updateItems(await shared.common.getTds());

      return;
    }

    await this.runDaemon(true);
  }

  async subscribe(code, count, name, type) {
    const savedThread = shared.esgst[type][code] || {};

    if (!savedThread.readComments) {
      savedThread.readComments = {};
    }

    savedThread.name = name;
    savedThread.subscribed = count;
    savedThread.lastUsed = Date.now();

    switch (type) {
      case 'discussions':
        await shared.common.lockAndSaveDiscussions({ [code]: savedThread });

        break;
      case 'trades':
        await shared.common.lockAndSaveTrades({ [code]: savedThread });

        break;
    }

    return true;
  }

  async unsubscribe(code, type) {
    const savedThread = shared.esgst[type][code] || {};
    
    savedThread.subscribed = null;
    savedThread.lastUsed = Date.now();

    switch (type) {
      case 'discussions':
        await shared.common.lockAndSaveDiscussions({ [code]: savedThread });

        break;
      case 'trades':
        await shared.common.lockAndSaveTrades({ [code]: savedThread });

        break;
    }
    
    return true;
  }

  addSubscribeButton(button, code, context, count, name, type) {
    if (!button) {
      button = shared.common.createElements_v2(context, 'afterBegin', [
        ['div', { class: 'esgst-tds-button page_heading_btn' }]
      ]);
    }

    shared.common.createElements_v2(button, 'inner', [
      ['i', { class: 'fa fa-bell-o', title: shared.common.getFeatureTooltip('tds', 'Subscribe') }]
    ]);

    let busy = false;

    button.addEventListener('click', async () => {
      if (busy) {
        return;
      }

      busy = true;

      shared.common.createElements_v2(button, 'inner', [
        ['i', { class: 'fa fa-circle-o-notch fa-spin' }]
      ]);
      
      await this.subscribe(code, count, name, type);

      this.addUnsubscribeButton(button, code, context, count, name, type);
    });
  }

  addUnsubscribeButton(button, code, context, count, name, type) {
    if (!button) {
      button = shared.common.createElements_v2(context, 'afterBegin', [
        ['div', { class: 'esgst-tds-button page_heading_btn' }]
      ]);
    }

    shared.common.createElements_v2(button, 'inner', [
      ['i', { class: 'fa fa-bell', title: shared.common.getFeatureTooltip('tds', 'Unsubscribe') }]
    ]);

    let busy = false;

    button.addEventListener('click', async () => {
      if (busy) {
        return;
      }

      busy = true;

      shared.common.createElements_v2(button, 'inner', [
        ['i', { class: 'fa fa-circle-o-notch fa-spin' }]
      ]);
      
      await this.unsubscribe(code, type);

      this.addSubscribeButton(button, code, context, count, name, type);
    });
  }
}

const generalThreadSubscription = new GeneralThreadSubscription();

export { generalThreadSubscription };