import { Module } from '../../class/Module';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';
import { DOM } from '../../class/DOM';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  request = common.request.bind(common)
  ;

class GeneralNotificationMerger extends Module {
  constructor() {
    super();
    this.info = {
      // by Royalgamer06
      description: [
        ['ul', [
          ['li', [
            `Adds a second inbox icon colored as red (`,
            ['i', { class: 'fa fa-envelope esgst-red' }],
            `) to the header of any page that allows you to be notified about messages from SteamTrades on SteamGifts and vice-versa.`
          ]],
          ['li', `This feature is compatible with [id=hr_b].`]
        ]]
      ],
      id: 'nm',
      name: 'Notification Merger',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    if (gSettings.hr) return;
    // noinspection JSIgnoredPromiseFromCall
    this.nm_getNotifications();
  }

  async nm_getNotifications() {
    if (this.esgst.sg) {
      let notification = DOM.parse((await request({
        method: 'GET',
        url: `https://www.steamtrades.com`
      })).responseText).getElementsByClassName('message_count')[0];
      if (!notification) {
        if (this.altInboxButton) {
          // hide the button, since there are no notifications
          this.altInboxButton.classList.add('esgst-hidden');
        }
        return;
      }
      if (this.altInboxButton) {
        // the button already exists, so simply unhide it and change the message count
        this.altInboxButton.classList.remove('esgst-hidden');
        this.altMessageCount.textContent = notification.textContent;
      } else {
        // the button does not exist yet, so add it and save it in a global variable
        this.altInboxButton = createElements(this.esgst.inboxButton, 'afterEnd', [{
          attributes: {
            class: 'nav__button-container nav__button-container--notification nav__button-container--active'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'nav__button',
              href: `https://www.steamtrades.com/messages`,
              title: getFeatureTooltip('nm', 'SteamTrades Messages')
            },
            type: 'a',
            children: [{
              attributes: {
                class: 'fa fa-envelope esgst-nm-icon'
              },
              type: 'i'
            }, {
              attributes: {
                class: 'nav__notification'
              },
              text: notification.textContent,
              type: 'div'
            }]
          }]
        }]);
        this.altMessageCount = this.altInboxButton.firstElementChild.lastElementChild;
      }
    } else {
      let notification = DOM.parse((await request({
        method: 'GET',
        url: `https://www.steamgifts.com`
      })).responseText).getElementsByClassName('nav__notification')[0];
      if (!notification) {
        if (this.altInboxButton) {
          // hide the button, since there are no notifications
          this.altInboxButton.classList.add('esgst-hidden');
        }
        return;
      }
      if (this.altInboxButton) {
        // the button already exists, so simply unhide it and change the message count
        this.altInboxButton.classList.remove('esgst-hidden');
        this.altMessageCount.textContent = notification.textContent;
      } else {
        // the button does not exist yet, so add it and save it in a global variable
        this.altInboxButton = createElements(this.esgst.inboxButton, 'afterEnd', [{
          attributes: {
            class: 'nav_btn_container',
            title: getFeatureTooltip('nm')
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'nav_btn',
              href: `https://www.steamgifts.com/messages`
            },
            type: 'a',
            children: [{
              attributes: {
                class: 'fa fa-envelope esgst-nm-icon'
              },
              type: 'i'
            }, {
              type: 'span',
              children: [{
                text: 'Messages ',
                type: 'node'
              }, {
                attributes: {
                  class: 'message_count'
                },
                text: notification.textContent,
                type: 'span'
              }]
            }]
          }]
        }]);
        this.altMessageCount = this.altInboxButton.firstElementChild.lastElementChild.lastElementChild;
      }
    }
  }
}

const generalNotificationMerger = new GeneralNotificationMerger();

export { generalNotificationMerger };