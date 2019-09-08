import dateFns_format from 'date-fns/format';
import dateFns_formatDistanceStrict from 'date-fns/formatDistanceStrict';
import dateFns_isSameWeek from 'date-fns/isSameWeek';
import IntersectionObserver from 'intersection-observer-polyfill';
import JSZip from 'jszip';
import { browser } from '../browser';
import { ButtonSet } from '../class/ButtonSet';
import { Module } from '../class/Module';
import { Popout } from '../class/Popout';
import { Popup } from '../class/Popup';
import { Scope } from '../class/Scope';
import { shared } from '../class/Shared';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { utils } from '../lib/jsUtils';
import { settingsModule } from './Settings';
import { loadDataCleaner, loadDataManagement } from './Storage';
import { runSilentSync, setSync } from './Sync';
import { elementBuilder } from '../lib/SgStUtils/ElementBuilder';
import 'bootstrap/dist/js/bootstrap';
import '../lib/bootstrap-tourist/bootstrap-tourist.js';
import '../lib/bootstrap-tourist/bootstrap-tourist.css';
import { gSettings } from '../class/Globals';
import { permissions } from '../class/Permissions';
import { logger } from '../class/Logger';

const
  isSet = utils.isSet.bind(utils),
  parseHtml = utils.parseHtml.bind(utils)
  ;

class Common extends Module {
  constructor() {
    super();
    this.info = {
      id: 'common',
      name: 'Common',
      type: 'general'
    };
  }

  minimizePanel_add() {
    if (!this.esgst.pageOuterWrap) {
      return;
    }

    this.esgst.minimizePanel = this.createElements(this.esgst.pageOuterWrap, 'beforeEnd', [{
      attributes: {
        class: 'esgst-minimize-panel'
      },
      type: 'div',
      children: [{
        attributes: {
          class: 'esgst-minimize-container markdown'
        },
        type: 'div',
        children: [{
          text: `Minimized Popups:`,
          type: 'h3'
        }, {
          type: 'hr'
        }, {
          attributes: {
            class: 'esgst-minimize-list'
          },
          type: 'ul'
        }]
      }]
    }]);
    this.esgst.minimizeList = this.esgst.minimizePanel.firstElementChild.lastElementChild;
  }

  minimizePanel_addItem(popup) {
    if (!this.esgst.minimizeList) {
      return;
    }

    popup.minimizeItem = this.createElements(this.esgst.minimizeList, 'beforeEnd', [{
      attributes: {
        class: 'esgst-minimize-item'
      },
      type: 'li',
      children: [{
        attributes: {
          href: `javascript:void(0);`
        },
        text: popup.title.textContent.replace(/:$/, ''),
        type: 'a'
      }]
    }]);
    popup.minimizeLink = popup.minimizeItem.firstElementChild;
    popup.minimizeItem.addEventListener('click', this.minimizePanel_openItem.bind(this, popup));
  }

  minimizePanel_openItem(popup) {
    popup.open();
    popup.minimizeItem.remove();
    popup.minimizeItem = null;
    if (!this.esgst.minimizePanel.getElementsByClassName('alert').length) {
      this.esgst.minimizePanel.classList.remove('alert');
    }
  }

  minimizePanel_alert(popup) {
    if (popup.minimizeItem) {
      popup.minimizeItem.classList.add('alert');
    }
    if (gSettings.minimizePanel) {
      this.esgst.minimizePanel.classList.add('alert');
    }
  }

  setSidebarActive(id) {
    const selected = this.esgst.sidebar.querySelector('.is-selected');
    selected.querySelector('.fa-caret-right').remove();
    selected.classList.remove('is-selected');
    const newSelected = document.querySelector(`#${id}`);
    newSelected.classList.add('is-selected');
    this.createElements_v2(newSelected.querySelector('.sidebar__navigation__item__link'), 'afterBegin', [
      ['i', { class: 'fa fa-caret-right' }]
    ]);
  }

  /**
   *
   * @param {Object} modules
   * @returns {Promise<void>}
   */
  async loadFeatures(modules) {  
    logger.info(this.esgst.games.apps[269650]);
    if (this.isCurrentPath('Account')) {
      this.createSidebarNavigation(this.esgst.sidebar, 'beforeEnd', {
        name: 'ESGST',
        items: [
          {
            id: 'settings',
            name: 'Settings',
            url: this.esgst.settingsUrl
          },
          {
            id: 'sync',
            name: 'Sync',
            url: this.esgst.syncUrl
          },
          {
            id: 'backup',
            name: 'Backup',
            url: this.esgst.backupUrl
          },
          {
            id: 'restore',
            name: 'Restore',
            url: this.esgst.restoreUrl
          },
          {
            id: 'delete',
            name: 'Delete',
            url: this.esgst.deleteUrl
          },
          {
            id: 'clean',
            name: 'Clean',
            url: this.esgst.cleanUrl
          },
          {
            id: 'data-management',
            name: 'Data Management',
            url: this.esgst.dataManagementUrl
          }
        ]
      });
      if (this.esgst.parameters.esgst === 'debug') {
        let textArea;
        this.createElements_v2(document.body, 'inner', [
          ['textarea', { ref: ref => textArea = ref }],
          ['button', { onclick: () => Function('"use strict";' + textArea.value + '').call(shared) }, 'Debug']
        ]);
        return;
      } else if (this.esgst.parameters.esgst === 'settings') {
        this.setSidebarActive('settings');
        settingsModule.loadMenu();
      } else if (this.esgst.parameters.esgst === 'sync') {
        this.setSidebarActive('sync');
        await setSync();
      } else if (this.esgst.parameters.esgst === 'backup') {
        this.setSidebarActive('backup');
        loadDataManagement('export');
      } else if (this.esgst.parameters.esgst === 'restore') {
        this.setSidebarActive('restore');
        loadDataManagement('import');
      } else if (this.esgst.parameters.esgst === 'delete') {
        this.setSidebarActive('delete');
        loadDataManagement('delete');
      } else if (this.esgst.parameters.esgst === 'clean') {
        this.setSidebarActive('clean');
        loadDataCleaner();
      } else if (this.esgst.parameters.esgst === 'data-management') {
        this.setSidebarActive('data-management');
        this.loadDM();
      }
    }

    if (gSettings.minimizePanel) {
      this.minimizePanel_add();
    }

    if (this.esgst.mainPageHeading) {
      this.esgst.leftMainPageHeadingButtons = this.createElements_v2(this.esgst.mainPageHeading, 'afterBegin', [
        ['div', { class: 'esgst-page-heading esgst-page-heading-buttons' }]
      ]);
      this.esgst.rightMainPageHeadingButtons = this.createElements_v2(this.esgst.mainPageHeading, 'beforeEnd', [
        ['div', { class: 'esgst-page-heading esgst-page-heading-buttons' }]
      ]);
    }

    let hideButtonsLeft, hideButtonsRight;
    hideButtonsLeft = document.createElement('div');
    hideButtonsLeft.className = 'esgst-heading-button';
    this.createElements_v2(hideButtonsLeft, 'inner', [
      ['i', { class: 'fa fa-ellipsis-v' }]
    ]);
    this.esgst.leftButtons = this.createElements(new Popout('esgst-hidden-buttons', hideButtonsLeft, 0, true).popout, 'beforeEnd', [{
      attributes: {
        class: 'esgst-page-heading'
      },
      type: 'div'
    }]);
    hideButtonsRight = document.createElement('div');
    hideButtonsRight.className = 'esgst-heading-button';
    this.createElements_v2(hideButtonsRight, 'inner', [
      ['i', { class: 'fa fa-ellipsis-v' }]
    ]);
    this.esgst.rightButtons = this.createElements(new Popout('esgst-hidden-buttons', hideButtonsRight, 0, true).popout, 'beforeEnd', [{
      attributes: {
        class: 'esgst-page-heading'
      },
      type: 'div'
    }]);

    const batchSize = 10;
    let currentBatchIndex = 0;

    for (const key in modules) {
      const mod = modules[key];
      if (!mod.info || (!mod.info.endless && !gSettings[mod.info.id])) {
        continue;
      }
      if (mod.info.featureMap) {
        for (const type in mod.info.featureMap) {
          if (!mod.info.featureMap.hasOwnProperty(type)) {
            continue;
          }
          const map = mod.info.featureMap[type];
          if (Array.isArray(map)) {
            for (const item of map) {
              this.esgst[`${type}Features`].push(item);
            }
          } else {
            this.esgst[`${type}Features`].push(map);
          }
        }
      }
      try {
        await mod.init();
        /*currentBatchIndex += 1;
        if (currentBatchIndex > batchSize) {
          currentBatchIndex = 0;
          await this.timeout(0);
        }*/
      } catch (e) {
        logger.warning(`${mod.info.name} failed to load:`);
        logger.error(e.stack);
      }
    }

    const customPage = this.esgst.customPages[this.esgst.parameters.esgst];
    if (customPage && customPage.check) {
      await customPage.load();
    } else if (!shared.esgst.parameters.esgst || shared.esgst.parameters.esgst !== 'ge') {
      await this.endless_load(document, !this.esgst.parameters.esgst || this.esgst.parameters.esgst === 'guide');
    }

    if (this.esgst.wbcButton && !this.esgst.scopes.main.users.length) {
      this.esgst.wbcButton.classList.add('esgst-hidden');
    }
    if (this.esgst.uscButton && !this.esgst.scopes.main.users.length) {
      this.esgst.uscButton.classList.add('esgst-hidden');
    }

    this.esgst.style.insertAdjacentText("beforeend", `
      .esgst-menu-split-fixed {
        max-height: calc(100vh - ${this.esgst.commentsTop + 55 + (gSettings.ff ? 39 : 0)}px);
        top: ${this.esgst.commentsTop + 25}px;
      }
    `);

    if (gSettings.updateHiddenGames) {
      const hideButton = document.getElementsByClassName('js__submit-hide-games')[0];
      if (hideButton) {
        hideButton.addEventListener('click', () => this.updateHiddenGames(this.esgst.hidingGame.id, this.esgst.hidingGame.type, false));
      }
    }

    if (this.esgst.newGiveawayPath) {
      // when the user searches for a game in the new giveaway page, wait until the results appear and load the game features for them
      let rows = document.getElementsByClassName('form__rows')[0];
      if (rows) {
        window.setTimeout(() => this.checkNewGiveawayInput(document.getElementsByClassName('js__autocomplete-data')[0]), 1000);
      }
    }

    if (this.esgst.mainPageHeading) {
      if (!this.esgst.leftMainPageHeadingButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        this.esgst.leftMainPageHeadingButtons.classList.add('esgst-hidden');
      }
      if (!this.esgst.rightMainPageHeadingButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        this.esgst.rightMainPageHeadingButtons.classList.add('esgst-hidden');
      }
      if (!this.esgst.leftButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hideButtonsLeft.classList.add('esgst-hidden');
      }
      if (!this.esgst.rightButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hideButtonsRight.classList.add('esgst-hidden');
      }
      this.esgst.mainPageHeading.insertBefore(hideButtonsLeft, this.esgst.mainPageHeading.firstElementChild);
      this.esgst.mainPageHeading.appendChild(hideButtonsRight);
    }
    this.reorderButtons(this.esgst);
    if (document.readyState === 'complete') {
      this.processHash();
    } else {
      document.addEventListener('readystatechange', () => this.processHash());
    }
    window.addEventListener('beforeunload', this.checkBusy.bind(this));
    window.addEventListener('hashchange', this.goToComment.bind(this, null, null, false));

    if (shared.esgst.replyBox && gSettings.jumpToReplyBox) {
      shared.esgst.replyBox.querySelector('textarea').focus();
    }

    for (const key in this.esgst.documentEvents) {
      if (this.esgst.documentEvents.hasOwnProperty(key)) {
        document.addEventListener(key, this.processEvent.bind(this, this.esgst.documentEvents[key]), true);
      }
    }

    this.esgst.modules = modules;

    if (shared.esgst.parameters.esgst === 'guide') {
      if (shared.esgst.parameters.id === 'welcome') {
        shared.esgst.guideSteps = [
          ['#esgst .esgst-header-menu-button.arrow', 'Click here to open the ESGST dropdown.', { reflex: true, reflexOnly: true }],
          ['#esgst .esgst-header-menu-absolute-dropdown', 'Here you can find a bunch of useful links / information related to the extension.', { preventInteraction: true }],
          [`#esgst .esgst-header-menu-button:not(.arrow)`, 'Click here to open the ESGST settings menu.', { reflex: true, reflexOnly: true }],
          ['.esgst-popup .page__heading', `The page heading allows you to access many useful functionalities (sync data, backup data, restore data, delete data, clean old data), as well as save any changes you have made.`, { preventInteraction: true }],
          [`.esgst-popup .page__heading__button[title="Sync data"]`, 'Some features require you to sync specific parts of your data in order to work properly. The sync menu is accessible through this button.', { preventInteraction: true }],
          [`.esgst-popup .page__heading__button[title="Backup data"]`, 'It is very important to back up your data often to prevent data loss. The backup menu is accessible through this button.', { preventInteraction: true }],
          [`.esgst-popup .page__heading__button[title="Restore data"]`, `In the event of data loss, you can restore a previous backup to get your data back. The restore menu is accessible through this button.`, { preventInteraction: true }],
          ['#esgst_plt', `To enable a feature, simply toggle the [SG] switch for SteamGifts or the [ST] switch for SteamTrades.`, { preventInteraction: true }],
          [`[data-id="plt"]`, `You can click on the name of the feature to get more details about it, such as what it does, additional settings for it, what data you need to sync in order for it to work properly (if any), and you can also specify where exactly you want it to run, instead of letting it run everywhere. Click here to procceed.`, { reflex: true, reflexOnly: true }],
          ['.esgst-settings-menu-feature', 'Here you can see the details.', { preventInteraction: true }],
          ['.esgst-menu-layer + .esgst-popup-actions .esgst-popup-close', `Remember to always save your changes, otherwise they will not persist. Now let's close the settings menu. Click here.`, { reflex: true, reflexOnly: true }],
          [`.sidebar > .sidebar__navigation:last-of-type`, `If you do not like popups, you can access the settings menu and all of the functionalities accessible from it through these links in the sidebar, which will open a new page with the content instead of a popup in the same page.`, { preventInteraction: true }],
          ['', `And that's the basics! ESGST can be very overwhelming with the huge number of features it has, but we want to make it as easy-to-use as possible, so make sure to leave your feedback in the SG thread. And please do not hesitate to report bugs. Enjoy!`]
        ];
      } else {
        for (const type in shared.esgst.features) {
          for (const id in shared.esgst.features[type].features) {
            const feature = this.findFeature(shared.esgst.features[type].features[id], id);
            if (feature) {
              shared.esgst.guideSteps = feature.guideSteps;
              break;
            }
          }
        }
      }
    }

    if (shared.esgst.guideSteps) {
      this.displayGuide();
    }
  }

  displayGuide() {
    // @ts-ignore
    const guide = new Tour({
      backdrop: true,
      orphan: true,
      showProgressBar: false,
      showProgressText: false,
      storage: false,
      template: `
        <div class="popover" role="tooltip">
          <div class="arrow"></div>
          <h3 class="popover-title"></h3>
          <div class="popover-content"></div>
          <div class="popover-navigation">
            <div class="btn-group">
              <button class="btn btn-sm btn-primary" data-role="next">Next</button>
            </div>
            <button class="btn btn-sm btn-default" data-role="end">End</button>
          </div>
        </div>
      `
    });
    for (let i = 0, n = shared.esgst.guideSteps.length; i < n; i++) {
      const [element, content, options] = shared.esgst.guideSteps[i];
      const step = {
        placement: 'auto'
      };
      if (options) {
        if (options.reflexOnly || i + 1 === n) {
          step.content = content;
        } else {
          step.content = `${content}<br><br>When you are ready to continue, click "Next".`;
        }
        if (options.isDynamic) {
          step.element = () => $(document).find(element);
          delete options.isDynamic;
        } else {
          step.element = element;
        }
        Object.assign(step, options);
      } else {
        if (i + 1 === n) {
          step.content = content;
        } else {
          step.content = `${content}<br><br>When you are ready to continue, click "Next".`;
        }
        step.element = element;
      }
      guide.addStep(step);   
    }
    guide.start();
    if (shared.esgst.parameters.step) {
      guide.goTo(parseInt(shared.esgst.parameters.step));
    }
  }

  findFeature(feature, id) {
    if (id === shared.esgst.parameters.id) {
      return feature;
    }

    if (feature.features) {
      for (const subId in feature.features) {
        const result = this.findFeature(feature.features[subId], subId);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  processHash() {
    this.goToComment(this.esgst.originalHash, null, false);        
    if (this.esgst.parameters.esgst && this.esgst.parameters.esgst !== 'guide' && this.esgst.parameters.id) {
      const element = document.querySelector(`[data-id="${this.esgst.parameters.id}"]`);
      if (element) {
        const hiddenSection = element.closest(`.esgst-form-row-indent.esgst-hidden:not(.SMFeatures)`);
        if (hiddenSection) {
          hiddenSection.previousElementSibling.firstElementChild.click();
        }
        this.goToComment(`#${this.esgst.parameters.id}`, element);
      }
    }
  }

  processEvent(functions, event) {
    for (const fun of functions) {
      fun(event);
    }
  }

  async getElements() {
    if (this.esgst.sg) {
      this.esgst.pageOuterWrapClass = 'page__outer-wrap';
      this.esgst.pageHeadingClass = 'page__heading';
      this.esgst.pageHeadingBreadcrumbsClass = 'page__heading__breadcrumbs';
      this.esgst.footer = document.getElementsByClassName('footer__outer-wrap')[0];
      this.esgst.replyBox = document.getElementsByClassName('comment--submit')[0];
      this.esgst.cancelButtonClass = 'comment__cancel-button';
      this.esgst.paginationNavigationClass = 'pagination__navigation';
      this.esgst.hiddenClass = 'is-hidden';
      this.esgst.selectedClass = 'is-selected';
      this.esgst.giveawaysDropdown = document.querySelector(`.nav__button--is-dropdown[href="/"]`).parentElement.querySelector('.nav__relative-dropdown');
      this.esgst.discussionsDropdown = document.querySelector(`.nav__button--is-dropdown[href="/discussions"]`).parentElement.querySelector('.nav__relative-dropdown');
      this.esgst.supportDropdown = document.querySelector(`.nav__button--is-dropdown[href="/support"]`).parentElement.querySelector('.nav__relative-dropdown');
      this.esgst.helpDropdown = document.querySelector(`.nav__button--is-dropdown[href="/about/faq"]`).parentElement.querySelector('.nav__relative-dropdown');
      this.esgst.accountDropdown = document.querySelector(`.nav__button--is-dropdown[href="/account"]`).parentElement.querySelector('.nav__relative-dropdown');
    } else {
      this.esgst.pageOuterWrapClass = 'page_outer_wrap';
      this.esgst.pageHeadingClass = 'page_heading';
      this.esgst.pageHeadingBreadcrumbsClass = 'page_heading_breadcrumbs';
      this.esgst.footer = /** @type {HTMLElement} */ document.getElementsByTagName('footer')[0];
      this.esgst.replyBox = /** @type {HTMLElement} */ document.getElementsByClassName('reply_form')[0];
      this.esgst.cancelButtonClass = 'btn_cancel';
      this.esgst.paginationNavigationClass = 'pagination_navigation';
      this.esgst.hiddenClass = 'is_hidden';
      this.esgst.selectedClass = 'is_selected';
    }
    const pageMatch = shared.esgst.locationHref.match(/page=(\d+)/);
    if (pageMatch) {
      this.esgst.currentPage = parseInt(pageMatch[1]);
    } else {
      this.esgst.currentPage = 1;
    }
    let url = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace('/search', '');
    this.esgst.originalUrl = url;
    this.esgst.favicon = document.querySelector(`[rel="shortcut icon"]`);
    this.esgst.originalTitle = document.title;
    if (this.esgst.mainPath) {
      url += this.esgst.sg ? 'giveaways' : 'trades';
    }
    url += '/search?';
    let parameters = window.location.search.replace(/^\?/, '').split(/&/);
    for (let i = 0, n = parameters.length; i < n; ++i) {
      if (parameters[i] && !parameters[i].match(/page/)) {
        url += `${parameters[i]}&`;
      }
    }
    if (window.location.search) {
      this.esgst.originalUrl = url.replace(/&$/, '');
      if (this.esgst.currentPage > 1) {
        this.esgst.originalUrl += `&page=${this.esgst.currentPage}`;
      }
    }
    url += `page=`;
    this.esgst.searchUrl = url;
    await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
    this.esgst.header = /** @type {HTMLElement} */ document.getElementsByTagName('header')[0];
    this.esgst.headerNavigationLeft = /** @type {HTMLElement} */ document.getElementsByClassName('nav__left-container')[0];
    this.esgst.pagination = /** @type {HTMLElement} */ document.getElementsByClassName('pagination')[0];
    this.esgst.featuredContainer = /** @type {HTMLElement} */ document.getElementsByClassName('featured__container')[0];
    this.esgst.pageOuterWrap = /** @type {HTMLElement} */ document.getElementsByClassName(this.esgst.pageOuterWrapClass)[0];
    this.esgst.paginationNavigation = /** @type {HTMLElement} */ document.getElementsByClassName(this.esgst.paginationNavigationClass)[0];
    this.esgst.sidebar = /** @type {HTMLElement} */ document.getElementsByClassName('sidebar')[0];
    if (this.esgst.sidebar) {
      this.esgst.enterGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName('sidebar__entry-insert')[0];
      this.esgst.leaveGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName('sidebar__entry-delete')[0];
      this.esgst.giveawayErrorButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName('sidebar__error')[0];
      const headings = document.querySelectorAll('.sidebar__heading');
      // @ts-ignore
      for (const heading of headings) {
        this.esgst.sidebarGroups.push({
          heading: heading,
          navigation: heading.nextElementSibling
        });
      }
    }
    const discussionHeading = document.querySelector(`.homepage_heading[href="/discussions"]`);
    this.esgst.activeDiscussions = /** @type {HTMLElement} */ discussionHeading && discussionHeading.closest('.widget-container--margin-top');
    this.esgst.pinnedGiveaways = /** @type {HTMLElement} */ document.getElementsByClassName('pinned-giveaways__outer-wrap')[0];
    let mainPageHeadingIndex;
    if (this.esgst.commentsPath) {
      mainPageHeadingIndex = 1;
    } else {
      mainPageHeadingIndex = 0;
    }
    this.esgst.pageHeadings = document.querySelectorAll(`.${this.esgst.pageHeadingClass}`);
    this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[mainPageHeadingIndex];
    if (!this.esgst.mainPageHeading && mainPageHeadingIndex === 1) {
      this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[0];
    }
    if (this.esgst.logoutButton) {
      this.esgst.xsrfToken = this.esgst.logoutButton.getAttribute('data-form').match(/xsrf_token=(.+)/)[1];
    }
  }

  async checkNewGiveawayInput(context) {
    if (context.style.opacity === '1') {
      if (!context.getAttribute('data-esgst')) {
        context.setAttribute('data-esgst', true);
        await this.loadNewGiveawayFeatures(context);
      }
    } else {
      context.removeAttribute('data-esgst');
    }
    window.setTimeout(() => this.checkNewGiveawayInput(context), 1000);
  }

  async loadNewGiveawayFeatures(context) {
    // check if there are no cv games in the results and if they are already in the database
    const games = {
      apps: {},
      subs: {}
    };
    let found = false;
    let elements = context.getElementsByClassName('table__row-outer-wrap');
    for (const element of elements) {
      const info = await this.esgst.modules.games.games_getInfo(element);
      if (!info) {
        continue;
      }
      const dateElement = element.querySelector(`[data-ui-tooltip*="Zero contributor value since..."]`);
      if (dateElement) {
        const rows = JSON.parse(dateElement.getAttribute('data-ui-tooltip')).rows;
        const date = rows[rows.length - 1].columns[1].name;
        if (!this.esgst.games[info.type][info.id] || !utils.isSet(this.esgst.games[info.type][info.id].noCV) || this.esgst.games[info.type][info.id].noCV !== date) {
          games[info.type][info.id] = {
            name: element.getElementsByClassName('table__column__heading')[0].firstChild.textContent.trim(),
            effective_date: date
          };
          found  = true;
        }
      } else if (this.esgst.games[info.type][info.id] && utils.isSet(this.esgst.games[info.type][info.id].noCV)) {
        games[info.type][info.id] = {
          name: element.getElementsByClassName('table__column__heading')[0].firstChild.textContent.trim(),
          effective_date: null
        };
        found = true;
      }
    }
    if (this.noCvButton) {
      this.noCvButton.remove();
      this.noCvButton = null;
    }
    if (found) {
      this.noCvButton = this.createElements(context.closest('.form__row__indent').previousElementSibling, 'beforeEnd', [{
        attributes: {
          class: 'esgst-no-cv-button'
        },
        type: 'span',
        children: [{
          attributes: {
            class: 'fa fa-calendar-times-o esgst-blinking esgst-bold esgst-clickable esgst-red',
            title: this.getFeatureTooltip(null, 'Update CV games database')
          },
          type: 'i'
        }]
      }]);
      if (gSettings.addNoCvGames) {
        // noinspection JSIgnoredPromiseFromCall
        this.addNoCvGames(games);
      } else {
        this.noCvButton.firstElementChild.addEventListener('click', this.addNoCvGames.bind(this, games));
      }
    }

    await this.esgst.modules.games.games_load(document, true);
  }

  async addNoCvGames(games, event) {
    if (!(await permissions.requestUi([['googleWebApp']], 'ncv', !event))) {
      return;
    }

    this.createElements(this.noCvButton, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin',
        title: `Updating database (${Object.keys(games.apps).map(x => `${games.apps[x].effective_date ? 'add' : 'remove'} app ${x}`).join(`, `)}${Object.keys(games.subs).map(x => `${games.subs[x].effective_date ? 'add' : 'remove'} subs ${x}`).join(`, `)})...`
      },
      type: 'i'
    }]);
    await this.request({
      data: JSON.stringify(games),
      method: 'POST',
      url: `https://script.google.com/macros/s/AKfycbz2IWN7I79WsbGELQk2rbQQSPI8XNWvDt3mEO-3nLEWqHiQmeo/exec?action=ncv`
    });
    for (let id in games.apps) {
      if (games.apps.hasOwnProperty(id)) {
        delete games.apps[id].name;
        games.apps[id].noCV = games.apps[id].effective_date;
        delete games.apps[id].effective_date;
      }
    }
    for (let id in games.subs) {
      if (games.subs.hasOwnProperty(id)) {
        delete games.subs[id].name;
        games.subs[id].noCV = games.subs[id].effective_date;
        delete games.subs[id].effective_date;
      }
    }
    await this.lockAndSaveGames(games);
    this.createElements(this.noCvButton, 'inner', [{
      attributes: {
        class: 'fa fa-check-circle esgst-green',
        title: `Database updated! (${Object.keys(games.apps).map(x => `${games.apps[x].noCV ? 'added' : 'removed'} app ${x}`).join(`, `)}${Object.keys(games.subs).map(x => `${games.subs[x].noCV ? 'added' : 'removed'} subs ${x}`).join(`, `)})`
      },
      type: 'i'
    }]);
  }

  async endless_load(context, main, source, endless, mainEndless) {
    this.purgeRemovedElements();
    for (let feature of this.esgst.endlessFeatures) {
      try {
        await feature(context, main, source, endless, mainEndless);
      } catch (e) {
        logger.error(e.stack);
      }
    }
  }

  purgeRemovedElements() {    
    // there are more elements that need to be purged,
    // but for now these are the most critical ones
    for (const scopeKey in this.esgst.scopes) {
      const scope = this.esgst.scopes[scopeKey];
      for (const dataKey in scope.data) {
        for (let i = scope.data[dataKey].length - 1; i > -1; i--) {
          if (document.contains(scope.data[dataKey][i].outerWrap)) continue;
          scope.data[dataKey].splice(i, 1);
        }
      }
    }
    const keys = ['attachedImages', 'tsTables'];
    for (const key of keys) {
      for (let i = this.esgst[key].length - 1; i > -1; i--) {
        if (document.contains(this.esgst[key][i].outerWrap)) continue;
        this.esgst[key].splice(i, 1);
      }
    }
    for (const key in this.esgst.apPopouts) {
      if (this.esgst.apPopouts.hasOwnProperty(key)) {
        if (document.contains(this.esgst.apPopouts[key].popout)) continue;
        delete this.esgst.apPopouts[key];
      }
    }
    for (const key in this.esgst.currentUsers) {
      if (this.esgst.currentUsers.hasOwnProperty(key)) {
        const elements = this.esgst.currentUsers[key].elements;
        for (let i = elements.length - 1; i > -1; i--) {
          if (document.contains(elements[i])) continue;
          elements.splice(i, 1);
        }
        if (elements.length) continue;
        delete this.esgst.currentUsers[key];
      }
    }
  }

  // Helper

  async saveComment(context, tradeCode, parentId, description, url, status, goToLocation) {
    const obj = {
      context,
      comment: description
    };
    await this.esgst.onBeforeCommentSubmit(obj);
    description = obj.comment;
    const data = `xsrf_token=${this.esgst.xsrfToken}&do=${this.esgst.sg ? 'comment_new' : 'comment_insert'}&trade_code=${tradeCode}&parent_id=${parentId}&description=${encodeURIComponent(description)}`;
    let id = null;
    let response = await this.request({ data, method: 'POST', url });
    let responseHtml = null;
    let success = true;
    if (this.esgst.sg) {
      if (response.redirected) {
        responseHtml = parseHtml(response.responseText);
        if (parentId) {
          id = responseHtml.querySelector(`[data-comment-id="${parentId}"]`).getElementsByClassName('comment__children')[0].lastElementChild.getElementsByClassName('comment__summary')[0].id;
        } else {
          const elements = responseHtml.getElementsByClassName('comments');
          id = elements[elements.length - 1].lastElementChild.getElementsByClassName('comment__summary')[0].id;
        }
      } else {
        success = false;
      }
    } else {
      const responseJson = JSON.parse(response.responseText);
      if (responseJson.success) {
        responseHtml = parseHtml(responseJson.html);
        id = responseHtml.getElementsByClassName('comment_outer')[0].id;
      } else {
        success = false;
      }
    }
    if (!success) {
      this.createElements(status, 'inner', [{
        attributes: {
          class: 'fa fa-times-circle'
        },
        type: 'i'
      }, {
        text: 'Failed!',
        type: 'span'
      }]);
      return { id: null, response: null, status };
    }
    if (gSettings.ch) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.commentsCommentHistory.ch_saveComment(id, Date.now());
    }
    if (!goToLocation) {
      return { id, response, status };
    }
    await this.esgst.modules.giveawaysGiveawayEncrypterDecrypter.ged_saveGiveaways(this.esgst.sg ? responseHtml.getElementById(id).closest('.comment') : responseHtml.getElementById(id), id);
    window.location.href = `/go/comment/${id}`;
  }

  getFeatures() {
    const features = {
      general: {
        features: {}
      },
      giveaways: {
        features: {}
      },
      discussions: {
        features: {}
      },
      trades: {
        features: {}
      },
      comments: {
        features: {}
      },
      users: {
        features: {}
      },
      groups: {
        features: {}
      },
      games: {
        features: {}
      },
      others: {
        features: {
          notifyLogs: {
            name: 'Notify about console logs.',
            sg: true,
            st: true
          },
          jumpToReplyBox: {
            name: 'Jump to the reply box when loading a page that has one.',
            sg: true,
            st: true
          },
          removeSidebarInFeaturePages: {
            name: `Remove sidebar in feature pages (for example, Giveaway Extractor, Group/Library Wishlist Checker etc).`,
            sg: true
          },
          openSettingsInTab: {
            name: 'Open settings menu in a new tab.',
            sg: true,
            st: true
          },
          activateTab: {
            description: [
              ['ul', [
                ['li', `When a browser session is restored, you have to activate a tab so that it can be loaded. With this option enabled, ESGST automatically activates the first SG/ST tab open so that the extension can be injected immediately.`]
              ]]
            ],
            extensionOnly: true,
            name: 'Activate the first SG/ST tab if a browser session was restored.',
            sg: true,
            st: true
          },
          manipulateCookies: {
            description: [
              ['ul', [
                ['li', `You should enable this option if you use a single Firefox container for the common sites requested by ESGST that require you to be logged in (SteamGifts, SteamTrades, Steam, SGTools, etc...). With it enabled, ESGST will manipulate your cookies to make sure that requests are sent using the cookies from the current container you are on.`],
                ['li', `For example: you are only logged in on SteamGifts and Steam in the personal container. With this option disabled, when you try to sync your owned games on ESGST it will fail because it will use the default cookies (where you are not logged in). With this option enabled, the sync will succeed because the container cookies will be used instead (where you are logged in).`],
                ['li', `If you are concerned about what exactly is done, you can check out the source code of the eventPage.js file, where the manipulation occurs. Basically what happens is: the default cookies are backed up and replaced by the container cookies while the request is being made, and after the request is done the default cookies are restored. This is not a pretty solution, but it does the job until a better and more permanent solution comes along.`]
              ]]
            ],
            extensionOnly: true,
            name: 'Allow ESGST to manipulate your cookies when using Firefox containers.',
            sg: true,
            st: true,
            permissions: ['cookies']
          },
          addNoCvGames: {
            name: 'Automatically add no CV games to the database when searching for games in the new giveaway page.',
            sg: true
          },
          askFileName: {
            name: 'Ask for file name when backing up data.',
            sg: true,
            st: true
          },
          autoBackup: {
            inputItems: [
              {
                id: 'autoBackup_days',
                prefix: `Days: `
              }
            ],
            name: 'Automatically backup your data every specified number of days.',
            options: {
              title: `Backup to:`,
              values: ['Computer', 'Dropbox', 'Google Drive', 'OneDrive']
            },
            sg: true,
            st: true
          },
          openAutoBackupNewTab: {
            name: 'Open automatic backup in a new tab.',
            sg: true,
            st: true
          },
          autoSync: {
            name: 'Automatically sync games/groups when syncing through SteamGifts.',
            sg: true
          },
          openAutoSyncPopup: {
            name: 'Open sync popup when automatically syncing by default.',
            sg: true
          },
          openAutoSyncNewTab: {
            name: 'Open automatic sync in a new tab.',
            sg: true
          },
          updateHiddenGames: {
            description: [
              ['ul', [
                ['li', `With this enabled, you no longer have to sync your hidden games every time you add/remove a game to/from the list.`]
              ]]
            ],
            name: 'Automatically update hidden games when adding/removing a game to/from the list.',
            sg: true
          },
          updateWhitelistBlacklist: {
            description: [
              ['ul', [
                ['li', `With this enabled, you no longer have to sync your whitelist/blacklist every time you add/remove a user to/from those lists.`]
              ]]
            ],
            name: 'Automatically update whitelist/blacklist when adding/removing a user to/from those lists.',
            sg: true
          },
          calculateDelete: {
            name: 'Calculate and show data sizes when opening the delete menu.',
            sg: true,
            st: true
          },
          backupZip: {
            name: `Backup data as a .zip file (smaller, but slower) instead of a .json file (larger, but faster).`,
            sg: true,
            st: true
          },
          calculateExport: {
            name: 'Calculate and show data sizes when opening the backup menu.',
            sg: true,
            st: true
          },
          calculateImport: {
            name: 'Calculate and show data sizes when opening the restore menu.',
            sg: true,
            st: true
          },
          notifyNewVersion: {
            name: 'Notify when a new ESGST version is available.',
            featureOnly: true,
            sg: true,
            st: true
          },
          makeSectionsCollapsible: {
            description: [
              ['ul', [
                ['li', 'The state of the sections is remembered if you save the settings after collapsing/expanding them.']
              ]]
            ],
            name: 'Make sections in the settings menu collapsible.',
            sg: true,
            st: true
          },
          esgst: {
            name: 'Enable ESGST for SteamTrades/SGTools.',
            st: true,
            sgtools: true
          },
          enableByDefault: {
            name: 'Enable new features and functionalities by default.',
            sg: true,
            st: true
          },
          fallbackSteamApi: {
            description: [
              ['ul', [
                ['li', `With this option enabled, if you sync your games without being logged in to Steam, the Steam API will be used instead (less complete, so some of your games will be removed until you sync while logged in).`]
              ]]
            ],
            name: 'Fallback to Steam API when syncing without being logged in.',
            sg: true,
            st: true
          },
          static_popups: {
            name: `Make popups static (they are fixed at the top left corner of the page instead of being automatically centered).`,
            sg: true,
            st: true
          },
          minimizePanel: {
            description: [
              ['ul', [
                ['li', `When you close a non-temporary popup, it will be minimized to a panel that can be accessed by moving your mouse to the left corner of the window in any page. There you can quickly find and re-open all of the popups that you minimized.`],
                ['li', `A non-temporary popup is a popup that does not get destroyed when you close it. For example, the settings popup is a temporary popup - when you close it, the popup is destroyed, and when you click on the button to open the settings again, a new popup is created. The Whitelist/Blacklist Checker popup is an example of a non-temporary popup - if you close it and re-open it, it will be the exact same popup.`],
                ['li', `With this option enabled, the sync/backup popups become non-temporary, which allows you to close them and keep navigating through the page while ESGST is performing the sync/backup, without having to wait for it to finish.`],
                ['li', `Some popups will notify you when they are done. When this happens, a red bar will flash at the left side of the screen that only disappears when you open the minimize panel and re-open the popup that is requiring your attention.`]
              ]]
            ],
            name: 'Minimize non-temporary popups to a panel when closing them.',
            sg: true,
            st: true
          },
          getSyncGameNames: {
            description: [
              ['ul', [
                ['li', `With this disabled, only the app/sub ids of the games will appear.`],
                ['li', `This can lead to lots of requests to the Steam store, so only enable it if you truly need to see the names of the games that were added/removed.`]
              ]]
            ],
            name: 'Retrieve game names when syncing.',
            sg: true,
            st: true
          },
          showChangelog: {
            name: 'Show changelog from the new version when updating.',
            sg: true,
            st: true
          },
          showFeatureNumber: {
            name: 'Show the feature number in the tooltips of elements added by ESGST.',
            sg: true,
            st: true
          }
        }
      },
      themes: {
        features: {
          sgDarkGrey: {
            name: [
              ['a', { class: 'esgst-bold', href: `https://www.steamgifts.com/discussion/3rINT/` }, 'SG Dark Grey'],
              ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`
            ],
            sg: true,
            st: true,
            sgtools: true,
            theme: `https://userstyles.org/styles/141670.css`
          },
          sgv2Dark: {
            name: [
              ['a', { class: 'esgst-bold', href: `https://www.steamgifts.com/discussion/iO230/` }, 'SGv2 Dark'],
              ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`
            ],
            sg: true,
            st: true,
            sgtools: true,
            theme: `https://userstyles.org/styles/109810.css`
          },
          steamGiftiesBlack: {
            name: [
              ['a', { class: 'esgst-bold', href: `https://www.steamgifts.com/discussion/62TRf/` }, 'SteamGifties Black'],
              ` by Mully (Medium compatibility with ESGST elements)`
            ],
            sg: true,
            theme: `https://userstyles.org/styles/110675.css`
          },
          steamGiftiesBlue: {
            name: [
              ['a', { class: 'esgst-bold', href: `https://www.steamgifts.com/discussion/62TRf/` }, 'SteamGifties Blue'],
              ` by Mully (Medium compatibility with ESGST elements)`
            ],
            sg: true,
            theme: `https://userstyles.org/styles/110491.css`
          },
          steamTradiesBlackBlue: {
            name: [
              ['a', { class: 'esgst-bold', href: `https://www.steamgifts.com/discussion/FIdCm/` }, 'SteamTradies Black/Blue'],
              ` by Mully (No compatibility with ESGST elements)`
            ],
            st: true,
            theme: `https://userstyles.org/styles/134348.css`
          },
          customTheme: {
            name: `Custom Theme (Add your own CSS rules)`,
            sg: true,
            st: true,
            sgtools: true,
            theme: true
          }
        }
      }
    };
    for (const type in features) {
      if (features.hasOwnProperty(type)) {
        if (type.match(/^(others|themes)$/)) {
          continue;
        }
        const typeModules = Object.keys(this.esgst.modules).filter(x => this.esgst.modules[x].info && this.esgst.modules[x].info.type === type).sort((x, y) => {
          return this.esgst.modules[x].info.id.localeCompare(this.esgst.modules[y].info.id, { sensitivity: 'base' });
        });
        for (const key of typeModules) {
          const module = this.esgst.modules[key];
          features[type].features[module.info.id] = module.info;
        }
      }
    }
    return features;
  }

  getFeaturesById() {
    const features = {};
    for (const type in shared.esgst.features) {
      for (const id in shared.esgst.features[type].features) {
        const feature = shared.esgst.features[type].features[id];
        this.getFeatureById(feature, id, features);
      }
    }
    return features;
  }

  getFeatureById(feature, id, features) {
    features[id] = feature;
    if (feature.features) {
      for (const subId in feature.features) {
        const subFeature = feature.features[subId];
        this.getFeatureById(subFeature, subId, features);
      }
    }
  }

  checkBusy(event) {
    if (document.getElementsByClassName('esgst-busy')[0] || this.esgst.busy) {
      event.returnValue = true;
      return true;
    }
  }

  setMouseEvent(element, id, url, callback) {
    let isDragging = -1;
    let startingPos = [0, 0];
    element.addEventListener('mousedown', event => {
      if (event.button === 2) return; // right click, do nothing
      if (event.button === 1) { // middle click
        event.preventDefault();
      }
      isDragging = event.button;
      startingPos = [event.pageX, event.pageY];
    });
    element.addEventListener('mousemove', event => {
      if (isDragging === -1 || (event.pageX === startingPos[0] && event.pageY === startingPos[1])) return;
      isDragging = -1;
    });
    element.addEventListener('mouseup', () => {
      if (isDragging === -1) return;
      if (gSettings[id] || isDragging === 1) {
        window.open(url);
      } else {
        callback();
      }
      isDragging = -1;
      startingPos = [0, 0];
    });
  }

  createHeadingButton(details) {
    let context = details.context;
    const id = details.orderId || details.id;
    if (!context) {
      if (gSettings.leftButtonIds.indexOf(id) > -1) {
        context = this.esgst.leftButtons;
      } else if (gSettings.rightButtonIds.indexOf(id) > -1) {
        context = this.esgst.rightButtons;
      } else if (gSettings.leftMainPageHeadingIds.indexOf(id) > -1) {
        context = this.esgst.leftMainPageHeadingButtons;
      } else {
        context = this.esgst.rightMainPageHeadingButtons;
      }
    }
    if (details.element) {
      context.appendChild(details.element);
      return context.lastElementChild;
    }
    const children = [];
    if (details.isSwitch) {
      children.push({
        type: 'span'
      });
    }
    for (const icon of details.icons) {
      children.push({
        attributes: {
          class: `fa ${icon}`
        },
        type: 'i'
      });
    }
    return this.createElements(context, 'beforeEnd', [{
      attributes: {
        class: 'esgst-heading-button',
        ['data-draggable-id']: id,
        id: `esgst-${details.id}`,
        title: this.getFeatureTooltip(details.featureId || details.id, details.title)
      },
      type: 'div',
      children
    }]);
  }

  async checkNewVersion(isFirstRun, isUpdate) {
    if (isFirstRun) {
      this.esgst.firstInstall = true;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting('dismissedOptions', this.esgst.toDismiss);
      let popup = new Popup({
        addScrollable: true, icon: 'fa-smile-o', isTemp: true, title: [
          ['i', { class: 'fa fa-circle-o-notch fa-spin' }],
          ` Hi! ESGST is retrieving your avatar, username and Steam ID. This will not take long...`
        ]
      });
      popup.open();
      await this.checkSync(true);
      popup.close();
      this.createConfirmation(`All done, ${gSettings.username}! Would you like to see an interactive guide showing you how to get started using ESGST?`, () => window.open(`https://www.steamgifts.com/account/settings/profile?esgst=guide&id=welcome`));
    } else if (isUpdate && gSettings.showChangelog) {
      new Popup({
        icon: 'fa-star',
        isTemp: true,
        title: [
          'ESGST has updated, to view the changelog go to ',
          ['a', { href: 'https://github.com/rafaelgssa/esgst/releases' }, 'https://github.com/rafaelgssa/esgst/releases']
        ]
      }).open();
    }
  }

  async parseMarkdown(context, string) {
    const obj = {
      context,
      comment: string
    };
    await this.esgst.onBeforeCommentSubmit(obj);
    string = obj.comment;
    return Array.from(parseHtml(this.esgst.markdownParser.text(string)).body.children);
  }

  async addGiveawayToStorage() {
    let giveaway, ggiveaways, i, key, n, popup, ugd, user;
    popup = new Popup({
      addScrollable: true,
      icon: 'fa-circle-o-notch fa-spin',
      isTemp: true,
      title: 'Please wait... ESGST is adding this giveaway to the storage...'
    });
    popup.open();
    const giveawaysres = await this.esgst.modules.giveaways.giveaways_get(document, true, shared.esgst.locationHref);
    if (giveawaysres.length) {
      giveaway = giveawaysres[0];
      ggiveaways = {};
      ggiveaways[giveaway.code] = giveaway;
      user = {
        steamId: gSettings.steamId,
        username: gSettings.username,
        values: {}
      };
      const savedUser = await this.getUser(null, user);
      let giveaways = null;
      if (savedUser) {
        giveaways = savedUser.giveaways;
      }
      if (!giveaways) {
        giveaways = {
          sent: {
            apps: {},
            subs: {}
          },
          won: {
            apps: {},
            subs: {}
          },
          sentTimestamp: 0,
          wonTimestamp: 0
        };
        if (savedUser) {
          ugd = savedUser.ugd;
          if (ugd) {
            if (ugd.sent) {
              for (key in ugd.sent.apps) {
                if (ugd.sent.apps.hasOwnProperty(key)) {
                  giveaways.sent.apps[key] = [];
                  for (i = 0, n = ugd.sent.apps[key].length; i < n; ++i) {
                    ggiveaways[ugd.sent.apps[key][i].code] = ugd.sent.apps[key][i];
                    giveaways.sent.apps[key].push(ugd.sent.apps[key][i].code);
                  }
                }
              }
              for (key in ugd.sent.subs) {
                if (ugd.sent.subs.hasOwnProperty(key)) {
                  giveaways.sent.subs[key] = [];
                  for (i = 0, n = ugd.sent.subs[key].length; i < n; ++i) {
                    ggiveaways[ugd.sent.subs[key][i].code] = ugd.sent.subs[key][i];
                    giveaways.sent.subs[key].push(ugd.sent.subs[key][i].code);
                  }
                }
              }
              giveaways.sentTimestamp = ugd.sentTimestamp;
            }
            if (ugd.won) {
              for (key in ugd.won.apps) {
                if (ugd.won.apps.hasOwnProperty(key)) {
                  giveaways.won.apps[key] = [];
                  for (i = 0, n = ugd.won.apps[key].length; i < n; ++i) {
                    ggiveaways[ugd.won.apps[key][i].code] = ugd.won.apps[key][i];
                    giveaways.won.apps[key].push(ugd.won.apps[key][i].code);
                  }
                }
              }
              for (key in ugd.won.subs) {
                if (ugd.won.subs.hasOwnProperty(key)) {
                  giveaways.won.subs[key] = [];
                  for (i = 0, n = ugd.won.subs[key].length; i < n; ++i) {
                    ggiveaways[ugd.won.subs[key][i].code] = ugd.won.subs[key][i];
                    giveaways.won.subs[key].push(ugd.won.subs[key][i].code);
                  }
                }
              }
              giveaways.wonTimestamp = ugd.wonTimestamp;
            }
          }
        }
      }
      if (!giveaways.sent[giveaway.gameType][giveaway.gameSteamId]) {
        giveaways.sent[giveaway.gameType][giveaway.gameSteamId] = [];
      }
      if (giveaways.sent[giveaway.gameType][giveaway.gameSteamId].indexOf(giveaway.code) < 0) {
        giveaways.sent[giveaway.gameType][giveaway.gameSteamId].push(giveaway.code);
      }
      user.values = {
        giveaways: giveaways
      };
      await this.lockAndSaveGiveaways(ggiveaways);
      await this.saveUser(null, null, user);
      popup.close();
    }
  }

  /**
   * @param details
   * @param [key]
   * @returns {*}
   */
  generateHeaderMenuItem(details, key) {
    if (details.icon) {
      let icon = details.icon;
      if (details.color) {
        icon += ` icon-${details.color}`;
      }
      if (details.url) {
        return [{
          attributes: {
            class: `esgst-header-menu-row${details.className || ''}`,
            ['data-link-id']: details.id,
            ['data-link-key']: key,
            href: details.url,
            title: details.title || ''
          },
          type: 'a',
          children: [{
            attributes: {
              class: `fa fa-fw ${icon}`
            },
            type: 'i'
          }, {
            type: 'div',
            children: [{
              attributes: {
                class: 'esgst-header-menu-name'
              },
              text: details.name,
              type: 'p'
            }, details.description ? {
              attributes: {
                class: 'esgst-header-menu-description'
              },
              text: details.description,
              type: 'p'
            } : null]
          }]
        }];
      }
      return [{
        attributes: {
          class: `esgst-header-menu-row${details.className || ''}`,
          ['data-link-id']: details.id,
          ['data-link-key']: key,
          title: details.title || ''
        },
        type: 'div',
        children: [{
          attributes: {
            class: `fa fa-fw ${icon}`
          },
          type: 'i'
        }, {
          type: 'div',
          children: [{
            attributes: {
              class: 'esgst-header-menu-name'
            },
            text: details.name,
            type: 'p'
          }, details.description ? {
            attributes: {
              class: 'esgst-header-menu-description'
            },
            text: details.description,
            type: 'p'
          } : null]
        }]
      }];
    }
    if (this.esgst.sg) {
      return [{
        attributes: {
          class: `nav__row${details.className || ''}`,
          ['data-link-id']: details.id,
          ['data-link-key']: key,
          href: details.url,
          title: details.title || ''
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'nav__row__summary'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'nav__row__summary__name'
            },
            text: details.name,
            type: 'p'
          }, details.description ? {
            attributes: {
              class: 'esgst-header-menu-description'
            },
            text: details.description,
            type: 'p'
          } : null]
        }]
      }];
    } else {
      return [{
        attributes: {
          class: `dropdown_btn${details.className || ''}`,
          ['data-link-id']: details.id,
          ['data-link-key']: key,
          href: details.url,
          title: details.title || ''
        },
        type: 'a',
        children: [{
          text: details.name,
          type: 'span'
        }]
      }];
    }
  }

  reorderButtons(obj) {
    const items = [{
      context: obj.leftButtons,
      id: 'leftButtonIds'
    }, {
      context: obj.rightButtons,
      id: 'rightButtonIds'
    }, {
      context: obj.leftMainPageHeadingButtons,
      id: 'leftMainPageHeadingIds'
    }, {
      context: obj.rightMainPageHeadingButtons,
      id: 'rightMainPageHeadingIds'
    }];
    for (const item of items) {
      if (!item.context) {
        continue;
      }
      for (const id of gSettings[item.id]) {
        const elements = (obj.mainPageHeading || obj.outerWrap).querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          item.context.appendChild(element);
        }
      }
    }
  }

  async lockAndSaveSettings(settingsObj) {
    const deleteLock = await this.createLock('settingsLock', 100);
    const settings = JSON.parse(this.getValue('settings', '{}'));
    for (const key in settingsObj) {
      if (settingsObj[key] === null) {
        if (utils.isSet(settings[key])) {
          delete settings[key];
        }
      } else {
        settings[key] = settingsObj[key];
      }
    }
    await this.setValue('settings', JSON.stringify(settings));
    deleteLock();
  }

  async setSetting() {
    const deleteLock = await this.createLock('settingsLock', 100);
    const settings = JSON.parse(this.getValue('settings', '{}'));
    const values = Array.isArray(arguments[0])
      ? arguments[0]
      : [
        {
          id: arguments[0],
          value: arguments[1],
          sg: arguments[2],
          st: arguments[3]
        }
      ];
    for (const value of values) {
      if (value.sg) {
        value.id = `${value.id}_sg`;
      } else if (value.st) {
        value.id = `${value.id}_st`;
      }      
      gSettings[value.id] = value.value;
      settings[value.id] = value.value;
    }
    await this.setValue('settings', JSON.stringify(settings));
    deleteLock();
  }

  getSetting(id, namespace, inverse) {
    let value = shared.esgst.settings[id];
    if (typeof value === 'undefined') {
      let defaultValue = shared.esgst.defaultValues[id];
      if (typeof defaultValue === 'undefined') {
        defaultValue = shared.esgst[`enableByDefault_${namespace}`] || false;
      }
      let oldId = shared.esgst.oldValues[id];
      if (typeof oldId === 'function') {
        value = oldId();
      } else if (typeof oldId !== 'undefined') {
        value = shared.esgst.settings[oldId];
        if (inverse) {
          value = !value;
        }
      }
      if (typeof value === 'undefined') {
        value = defaultValue;
      }
    }
    return value;
  }

  validateValue(value) {
    return typeof value === 'undefined' || value;
  }

  getOldValues(id, namespace, setting) {
    // noinspection FallThroughInSwitchStatementJS
    switch (id) {
      case 'cl':
        if (namespace !== 'sg') return;
        setting.enabled = 
          this.esgst.settings.ap_sg ||
          this.esgst.settings.gcl_sg ||
          this.esgst.settings.ggl_sg;
        setting.enabled = (typeof setting.enabled === 'object' ? setting.enabled.enabled : setting.enabled) ? 1 : 0;
        return;
      case 'at':
        if (namespace !== 'sg') return;
        setting.exclude = [
          {
            enabled: this.validateValue(this.esgst.settings.at_g_sg) ? 0 : 1,
            pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
          }
        ];
        return;
      case 'egh':
        if (namespace !== 'sg') return;
        setting.exclude = [
          { enabled: this.validateValue(this.esgst.settings.egh_t_sg) ? 0 : 1, pattern: '^/discussion/' }
        ];
        return;
      case 'es_pd':
        setting.enabled = namespace === 'sg' ? this.esgst.settings.es_l_d_sg || this.esgst.settings.es_c_d_sg || this.esgst.settings.es_d_d_sg || this.esgst.settings.es_g_d_sg : this.esgst.settings.es_l_d_st || this.esgst.settings.es_c_d_st || this.esgst.settings.es_t_d_st;
        setting.enabled = setting.enabled ? 1 : 0;
      case 'es':
        if (namespace === 'sg') {
          if (this.validateValue(this.esgst.settings[id === 'es' ? 'es_l_sg' : 'es_l_d_sg'])) {
            setting.exclude = [
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_c_sg' : 'es_c_d_sg']) ? 0 : 1,
                pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_d_sg' : 'es_d_d_sg']) ? 0 : 1,
                pattern: `^/(discussions|support/tickets)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_g_sg' : 'es_g_d_sg']) ? 0 : 1,
                pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
              }
            ];
          } else {
            setting.include = [
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_c_sg' : 'es_c_d_sg']) ? 1 : 0,
                pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_d_sg' : 'es_d_d_sg']) ? 1 : 0,
                pattern: `^/(discussions|support/tickets)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_g_sg' : 'es_g_d_sg']) ? 1 : 0,
                pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
              }
            ];
          }
        } else {
          if (this.validateValue(this.esgst.settings[id === 'es' ? 'es_l_st' : 'es_l_d_st'])) {
            setting.exclude = [
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_c_st' : 'es_c_d_st']) ? 0 : 1,
                pattern: '^/trade/'
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_t_st' : 'es_t_d_st']) ? 0 : 1,
                pattern: `^/($|trades)`
              }
            ];
          } else {
            setting.include = [
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_c_st' : 'es_c_d_st']) ? 1 : 0,
                pattern: '^/trade/'
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === 'es' ? 'es_t_st' : 'es_t_d_st']) ? 1 : 0,
                pattern: `^/($|trades)`
              }
            ];
          }
        }
        return;
      case 'gc':
        if (namespace !== 'sg') return;
        setting.exclude = [
          { enabled: this.validateValue(this.esgst.settings.gc_t_sg) ? 0 : 1, pattern: '^/discussion/' }
        ];
        return;
      case 'gc_gi':
        if (namespace !== 'sg') return;
        if (this.validateValue(this.esgst.settings.gc_gi_t_sg)) {
          setting.include = [
            { enabled: 1, pattern: '^/discussion' }
          ];
        } else if (this.validateValue(this.esgst.settings.gc_gi_cew_sg)) {
          setting.include = [
            { enabled: 1, pattern: `^/giveaways/(created|entered|won)/` }
          ];
        }
        return;
      case 'gc_o_a':
        if (namespace !== 'sg') return;
        setting.enabled = this.esgst.settings.gc_o_altAccounts && this.esgst.settings.gc_o_altAccounts.length > 0 ? 1 : 0;
        if (this.validateValue(this.esgst.settings.gc_o_t_sg)) {
          setting.include = [
            { enabled: 1, pattern: '^/discussion' }
          ];
        }
        return;
      case 'gt':
        if (namespace !== 'sg') return;
        setting.exclude = [
          { enabled: this.validateValue(this.esgst.settings.gt_t_sg) ? 0 : 1, pattern: '^/discussion/' }
        ];
        return;
      case 'vai':
        setting.exclude = [
          { enabled: this.validateValue(this.esgst.settings[`vai_i_${namespace}`]) ? 1 : 0, pattern: '^/messages' }
        ];
        return;
      default:
        return;
    }
  }

  getFeaturePath(feature, id, namespace) {
    if (!feature) {
      feature = shared.esgst.featuresById[id];
    }
    const key = `${id}_${namespace}`;
    let setting = shared.esgst.settings[key];
    if (typeof setting === 'undefined' || !setting.include || !Array.isArray(setting.include)) {
      setting = {
        enabled: this.getSetting(key, namespace, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/)) ? 1 : 0,
        include: [],
        exclude: [],
        new: typeof setting === 'undefined'
      };
      if (feature[namespace].include) {
        setting.include = feature[namespace].include;
        if (feature[namespace].exclude) {
          setting.exclude = feature[namespace].exclude;
        }
      } else {
        setting.include = [{ enabled: setting.enabled, pattern: '.*' }];
      }
      if (setting.new) {
        this.getOldValues(id, namespace, setting);
        if (setting.enabled) {
          setting.include[0].enabled = 1;
        }
      }
    }
    return setting;
  }

  dismissFeature(feature, id) {
    this.esgst.toDismiss.push(id);
    if (id.match(/^(chfl|sk_)/)) {
      this.esgst.toDismiss.push(feature.inputItems);
    }
    if (id.match(/^hr_.+_s$/)) {
      this.esgst.toDismiss.push(`${id}_sound`);
    }
    if (Array.isArray(feature.inputItems)) {
      for (const item of feature.inputItems) {
        this.esgst.toDismiss.push(item.id);
      }
    }
    if (feature.features) {
      for (const subId in feature.features) {
        if (feature.features.hasOwnProperty(subId)) {
          this.dismissFeature(feature.features[subId], subId);
        }
      }
    }
  }

  getFeatureSetting(feature, id, namespace, path) {
    let setting = null;
    let value = false;
    if (feature[namespace]) {
      setting = this.getFeaturePath(feature, id, namespace);
      if (setting.enabled) {
        if (!path) {
          path = `${window.location.pathname}${window.location.search}`;
        }
        let i = setting.include.length - 1;
        while (i > -1 && (!setting.include[i].enabled || !path.match(new RegExp(setting.include[i].pattern)))) i--;
        if (i > -1) {
          value = setting.include[i] || true;
        }
        i = setting.exclude.length - 1;
        while (i > -1 && (!setting.exclude[i].enabled || !path.match(new RegExp(setting.exclude[i].pattern)))) i--;
        if (i > -1) {
          value = false;
        }
      }
    }
    return {
      full: setting,
      current: value
    };
  }
  
  initGlobalSettings() {
    for (const key in shared.esgst.settings) {
      const match = key.match(/(.+?)_(sg|st|sgt)$/);
      if (match) {
        if (match[2] === shared.esgst.name) {
          gSettings[key] = gSettings[match[1]] = shared.esgst.settings[key];
        }
      } else {
        gSettings[key] = shared.esgst.settings[key];
      }
    }
    for (const key in shared.esgst.oldValues) {
      if (shared.esgst.oldValues.hasOwnProperty(key)) {
        const localKey = key.replace(new RegExp(`(.+?)_${shared.esgst.name}$`), `$1`);
        if (!utils.isSet(gSettings[localKey])) {
          gSettings[key] = gSettings[localKey] = common.getSetting(key, shared.esgst.name, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
        }
      }
    }
    for (const key in shared.esgst.defaultValues) {
      if (shared.esgst.defaultValues.hasOwnProperty(key)) {
        const localKey = key.replace(new RegExp(`(.+?)_${shared.esgst.name}$`), `$1`);
        if (!utils.isSet(gSettings[localKey])) {
          gSettings[key] = gSettings[localKey] = common.getSetting(key, shared.esgst.name, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
        }
      }
    }
    for (const id in shared.esgst.featuresById) {
      if (shared.esgst.featuresById.hasOwnProperty(id)) {
        const feature = shared.esgst.featuresById[id];
        this.dismissFeature(feature, id);
        if (feature.sg) {
          const result = this.getFeatureSetting(feature, id, 'sg');
          gSettings[`${id}_sg`] = result.current;
          gSettings.full[`${id}_sg`] = result.full;
        }
        if (feature.st) {
          const result = this.getFeatureSetting(feature, id, 'st');
          gSettings[`${id}_st`] = result.current;
          gSettings.full[`${id}_st`] = result.full;
        }
        if (feature.sgtools) {
          const result = this.getFeatureSetting(feature, id, 'sgtools');
          gSettings[`${id}_sgtools`] = result.current;
          gSettings.full[`${id}_sgtools`] = result.full;
        }
        gSettings[id] = gSettings[`${id}_${shared.esgst.name}`];
        gSettings.full[id] = gSettings.full[`${id}_${shared.esgst.name}`];
      }
    }
  }
  
  getGlobalSetting(id, namespace = shared.esgst.name, path = '') {
    let value;
    const key = this.getGlobalSettingKey(id, namespace, path);
    if (utils.isSet(gSettings[key])) {
      value = gSettings[key];
    } else {
      const feature = shared.esgst.featuresById[id];
      if (feature) {
        const result = this.getFeatureSetting(feature, id, namespace, path);
        value = result.current;
        if (namespace === shared.esgst.name) {
          gSettings.full[id] = result.full;
        }
      } else {
        const namespaced = shared.esgst.settings[`${id}_${namespace}`];
        if (namespaced) {
          value = this.getSetting(`${id}_${namespace}`, namespace);
        } else {
          value = this.getSetting(id, namespace);
        }
      }
      gSettings[key] = value;
      if (namespace === shared.esgst.name) {
        gSettings[id] = value;
      }
    }
    return value;
  }
  
  setGlobalSetting(id, value, namespace = shared.esgst.name, path = '') {
    const key = this.getGlobalSettingKey(id, namespace, path);
    gSettings[key] = value;
    if (namespace === shared.esgst.name) {
      gSettings[id] = value;
    }
  }
  
  getGlobalSettingKey(id, namespace, path) {
    return `${id}_${namespace}_${path}`.replace(/\s/g, '');
  }

  toggleHeaderMenu(arrow, dropdown) {
    if (this.esgst.sg) {
      let buttons = document.querySelectorAll('nav .nav__button');
      // @ts-ignore
      for (let button of buttons) {
        button.classList.remove('is-selected');
      }
      let dropdowns = document.querySelectorAll('nav .nav__relative-dropdown');
      // @ts-ignore
      for (let dropdown of dropdowns) {
        dropdown.classList.add('is-hidden');
      }
    } else {
      let buttons = document.querySelectorAll(`.nav_btn_dropdown, .page_heading_btn_dropdown`);
      // @ts-ignore
      for (let button of buttons) {
        button.classList.remove('is_selected');
      }
      let dropdowns = document.querySelectorAll('.dropdown');
      // @ts-ignore
      for (let dropdown of dropdowns) {
        dropdown.classList.add('is_hidden');
      }
    }
    arrow.classList.toggle('selected');
    dropdown.classList.toggle('esgst-hidden');
  }

  addHeaderButton(icon, state, title) {
    const [query, position] = this.esgst.sg ? ['.nav__left-container', 'afterEnd'] : ['.nav_logo', 'afterEnd'];
    const button = this.createElements_v2(document.querySelector(query), position, [
      ['div', { class: shared.esgst.sg ? `nav__button-container nav__button-container--notification nav__button-container--${state}` : 'nav_btn_container' }, [
        ['span', { class: shared.esgst.sg ? 'nav__button' : 'nav_btn', title }, [
          ['i', { class: `fa ${icon}` }]
        ]]
      ]]
    ]);
    return {
      button,
      changeIcon(icon) {
        button.firstElementChild.firstElementChild.className = `fa ${icon}`;
      },
      changeState(state) {
        button.classList.remove('nav__button-container--active', 'nav__button-container--inactive');
        button.classList.add(`nav__button-container--${state}`)
      },
      changeTitle(title) {
        button.firstElementChild.title = title;
      }
    };
  }

  getFeatureTooltip(id, title = '') {
    if (gSettings.showFeatureNumber) {
      if (title) {
        return `${title}\n\nThis element was added by ESGST${id ? ` (${this.getFeatureNumber(id).number})` : ''}`;
      }
      return `This element was added by ESGST${id ? ` (${this.getFeatureNumber(id).number})` : ''}`;
    }
    return title;
  }

  getFeatureName(fullMatch, match) {
    let feature = this.getFeatureNumber(match);
    return `${feature.number} ${feature.name}`;
  }

  getFeatureNumber(queryId) {
    let n = 1;
    for (let type in this.esgst.features) {
      if (this.esgst.features.hasOwnProperty(type)) {
        let i = 1;
        for (let id in this.esgst.features[type].features) {
          if (this.esgst.features[type].features.hasOwnProperty(id)) {
            let feature = this.esgst.features[type].features[id];
            let result = this.getFeatureNumber_2(feature, id, i, n, queryId);
            if (result) {
              return result;
            }
            if (feature.sg || gSettings.esgst_st || gSettings.esgst_sgtools) {
              i += 1;
            }
          }
        }
        if (type !== 'trades' || gSettings.esgst_st || gSettings.esgst_sgtools) {
          n += 1;
        }
      }
    }
    return {
      name: '',
      number: ''
    };
  }

  getFeatureNumber_2(feature, id, i, n, queryId) {
    if (id === queryId) {
      return {
        name: feature.name,
        number: `${n}.${i}`
      };
    }
    if (feature.features) {
      let j = 1;
      for (let id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          let subFeature = feature.features[id];
          let result = this.getFeatureNumber_2(subFeature, id, j, `${n}.${i}`, queryId);
          if (result) {
            return result;
          }
          if (subFeature.sg || gSettings.esgst_st || gSettings.esgst_sgtools) {
            j += 1;
          }
        }
      }
    }
    return null;
  }

  async getUser(savedUsers, user) {
    let savedUser = null;
    if (!savedUsers) {
      savedUsers = JSON.parse(this.getValue('users'));
    }
    if (user.steamId) {
      savedUser = savedUsers.users[user.steamId];
      if (savedUser) {
        if (!user.id) {
          user.id = savedUser.id;
        }
        if (!user.username) {
          user.username = savedUser.username;
        }
      }
    } else if (user.username) {
      let steamId = savedUsers.steamIds[user.username];
      if (steamId) {
        user.steamId = steamId;
        savedUser = savedUsers.users[steamId];
      }
    }
    return savedUser;
  }

  async saveUser(list, savedUsers, user) {
    if (!savedUsers) {
      savedUsers = JSON.parse(this.getValue('users'));
    }
    let savedUser = await this.getUser(savedUsers, user);
    if (savedUser) {
      if (list) {
        if (!user.steamId) {
          user.steamId = savedUsers.steamIds[user.username];
        }
        list.existing.push(user);
      } else {
        let deleteLock = await this.createLock('userLock', 300);
        this.checkUsernameChange(savedUsers, user);
        for (let key in user.values) {
          if (user.values.hasOwnProperty(key)) {
            if (key !== 'tags') {
              if (user.values[key] === null) {
                delete savedUsers.users[user.steamId][key];
              } else {
                savedUsers.users[user.steamId][key] = user.values[key];
              }
            }
          }
        }
        await this.setValue('users', JSON.stringify(savedUsers));
        deleteLock();
      }
    } else {
      if (user.steamId && user.username) {
        if (list) {
          list.new.push(user);
        } else {
          await this.addUser(user);
        }
      } else if (user.steamId) {
        await this.getUsername(list, true, user);
      } else {
        await this.getSteamId(list, true, null, user);
      }
    }
  }

  checkUsernameChange(savedUsers, user) {
    let i, n;
    if (typeof savedUsers.users[user.steamId].username !== 'undefined' && savedUsers.users[user.steamId].username !== user.username) {
      delete savedUsers.steamIds[savedUsers.users[user.steamId].username];
      savedUsers.users[user.steamId].username = user.username;
      savedUsers.steamIds[user.username] = user.steamId;
      if (user.values.tags) {
        if (!savedUsers.users[user.steamId].tags) {
          savedUsers.users[user.steamId].tags = [];
        }
        for (i = 0, n = user.values.tags.length; i < n; ++i) {
          if (savedUsers.users[user.steamId].tags.indexOf(user.values.tags[i]) < 0) {
            savedUsers.users[user.steamId].tags.push(user.values.tags[i]);
          }
        }
      }
      return true;
    } else if (typeof user.values.tags !== 'undefined') {
      savedUsers.users[user.steamId].tags = user.values.tags;
    }
    if (!savedUsers.users[user.steamId].tags) {
      delete savedUsers.users[user.steamId].tags;
    }
  }

  async addUser(user) {
    let deleteLock, savedUser, savedUsers;
    deleteLock = await this.createLock('userLock', 300);
    savedUsers = JSON.parse(this.getValue('users'));
    savedUser = await this.getUser(savedUsers, user);
    if (!savedUser) {
      savedUsers.users[user.steamId] = {};
    }
    if (user.id) {
      savedUsers.users[user.steamId].id = user.id;
    }
    this.checkUsernameChange(savedUsers, user);
    if (user.username) {
      savedUsers.users[user.steamId].username = user.username;
      savedUsers.steamIds[user.username] = user.steamId;
    }
    for (let key in user.values) {
      if (user.values.hasOwnProperty(key)) {
        if (key !== 'tags') {
          if (user.values[key] === null) {
            delete savedUsers.users[user.steamId][key];
          } else {
            savedUsers.users[user.steamId][key] = user.values[key];
          }
        }
      }
    }
    await this.setValue('users', JSON.stringify(savedUsers));
    deleteLock();
  }

  async getUsername(list, save, user) {
    let match, response, responseHtml;
    response = await this.request({ method: 'GET', url: `https://www.steamgifts.com/go/user/${user.steamId}` });
    match = response.finalUrl.match(/\/user\/(.+)/);
    responseHtml = parseHtml(response.responseText);
    if (match) {
      user.username = match[1];
      let input = responseHtml.querySelector(`[name="child_user_id"]`);
      if (input) {
        user.id = input.value;
      }
    }
    if (save) {
      if (list) {
        list.new.push(user);
      } else {
        await this.addUser(user);
      }
    }
  }

  async getSteamId(list, save, savedUsers, user) {
    let input, responseHtml;
    if (!save) {
      if (!savedUsers) {
        savedUsers = JSON.parse(this.getValue('users'));
      }
      let steamId = savedUsers.steamIds[user.username];
      if (steamId) {
        user.steamId = steamId;
        user.id = savedUsers.users[steamId].id;
        return;
      }
    }
    const response = await this.request({
      method: 'GET',
      url: `https://www.steamgifts.com/user/${user.username}`
    });
    if (!response.finalUrl.match(/\/user\//)) {
      return;
    }
    responseHtml = parseHtml(response.responseText);
    const profileLink = responseHtml.querySelector(`[href*="/profiles/"]`);
    if (!profileLink) {
      return;
    }
    user.steamId = profileLink.getAttribute('href').match(/\d+/)[0];
    input = responseHtml.querySelector(`[name="child_user_id"]`);
    if (input) {
      user.id = input.value;
    }
    if (save) {
      if (list) {
        list.new.push(user);
      } else {
        await this.addUser(user);
      }
    }
  }

  /**
   * @param users
   * @returns {Promise<void>}
   */
  async saveUsers(users) {
    let list, promises, savedUsers;
    list = {
      existing: [],
      new: []
    };
    promises = [];
    savedUsers = JSON.parse(this.getValue('users'));
    for (let i = 0, n = users.length; i < n; i++) {
      promises.push(this.saveUser(list, savedUsers, users[i]));
    }
    await Promise.all(promises);
    let deleteLock = await this.createLock('userLock', 300);
    savedUsers = JSON.parse(this.getValue('users'));
    for (let i = 0, n = list.new.length; i < n; ++i) {
      let savedUser, user;
      user = list.new[i];
      savedUser = await this.getUser(savedUsers, user);
      if (!savedUser) {
        savedUsers.users[user.steamId] = {};
      }
      if (user.id) {
        savedUsers.users[user.steamId].id = user.id;
      }
      this.checkUsernameChange(savedUsers, user);
      if (user.username) {
        savedUsers.users[user.steamId].username = user.username;
        savedUsers.steamIds[user.username] = user.steamId;
      }
      for (let key in user.values) {
        if (user.values.hasOwnProperty(key)) {
          if (key !== 'tags') {
            if (user.values[key] === null) {
              delete savedUsers.users[user.steamId][key];
            } else {
              savedUsers.users[user.steamId][key] = user.values[key];
            }
          }
        }
      }
    }
    for (let i = 0, n = list.existing.length; i < n; ++i) {
      let user = list.existing[i];
      this.checkUsernameChange(savedUsers, user);
      for (let key in user.values) {
        if (user.values.hasOwnProperty(key)) {
          if (key !== 'tags') {
            if (user.values[key] === null) {
              delete savedUsers.users[user.steamId][key];
            } else {
              savedUsers.users[user.steamId][key] = user.values[key];
            }
          }
        }
      }
    }
    await this.setValue('users', JSON.stringify(savedUsers));
    deleteLock();
  }

  async deleteUserValues(values) {
    let deleteLock, savedUsers;
    deleteLock = await this.createLock('userLock', 300);
    savedUsers = JSON.parse(this.getValue('users'));
    for (let key in savedUsers.users) {
      if (savedUsers.users.hasOwnProperty(key)) {
        for (let i = 0, n = values.length; i < n; ++i) {
          delete savedUsers.users[key][values[i]];
        }
      }
    }
    await this.setValue('users', JSON.stringify(savedUsers));
    deleteLock();
  }

  async getUserId(user) {
    if (user.username) {
      await this.getSteamId(null, false, null, user);
    } else {
      await this.getUsername(null, false, user);
    }
  }

  async checkSync(menu) {
    let currentDate = Date.now();
    let isSyncing = this.getLocalValue('isSyncing');
    if (menu) {
      await setSync();
    } else if (!isSyncing || currentDate - isSyncing > 1800000) {
      let parameters = '';
      this.setLocalValue('isSyncing', currentDate);
      ['Groups', 'Whitelist', 'Blacklist', 'SteamFriends', 'HiddenGames', 'Games', 'FollowedGames', 'WonGames', 'ReducedCvGames', 'NoCvGames', 'HltbTimes', 'DelistedGames', 'Giveaways', 'WonGiveaways'].forEach(key => {
        if (gSettings[`autoSync${key}`] && currentDate - gSettings[`lastSync${key}`] > gSettings[`autoSync${key}`] * 86400000) {
          parameters += `${key}=1&`;
        }
      });
      if (parameters) {
        if (gSettings.openAutoSyncNewTab) {
          window.open(`${shared.esgst.syncUrl}&autoSync=true&${parameters}`);
        } else {
          runSilentSync(parameters);
        }
      } else {
        this.delLocalValue('isSyncing');
      }
    }
  }

  async runSilentBackup() {
    const button = this.addHeaderButton('fa-sign-out fa-spin', 'active', 'ESGST is backing up your data... Please do not close this window.');
    this.esgst.parameters = Object.assign(this.esgst.parameters, { autoBackup: true });
    loadDataManagement('export', false, () => {
      button.changeIcon('fa-check');
      button.changeState('inactive');
      button.changeTitle('ESGST has finished backing up.');
    });
  }

  async getGameNames(context) {
    const elements = context.getElementsByTagName('a');
    for (let i = elements.length - 1; i > -1; --i) {
      const element = elements[i],
        match = element.getAttribute('href').match(/\/(app|sub)\/(.+)/);
      if (!match) continue;
      const id = match[2],
        response = await this.request({
          method: 'GET',
          url: `http://store.steampowered.com/api/${match[1] === 'app' ? 'appdetails?appids' : 'packagedetails?packageids'}=${id}&filters=basic`
        });
      try {
        element.textContent = JSON.parse(response.responseText)[id].data.name;
      } catch (e) {
        element.classList.add('esgst-red');
        element.title = 'Unable to retrieve name for this game';
      }
    }
  }

  async lock_and_save_giveaways(giveaways, firstRun) {
    return this.lockAndSaveGiveaways(giveaways, firstRun);
  }

  async lockAndSaveGiveaways(giveaways, firstRun) {
    if (!Object.keys(giveaways).length) return;

    let deleteLock;
    let savedGiveaways;
    if (firstRun) {
      savedGiveaways = this.esgst.giveaways;
    } else {
      deleteLock = await this.createLock('giveawayLock', 300);
      savedGiveaways = JSON.parse(this.getValue('giveaways', '{}'));
    }
    for (let key in giveaways) {
      if (giveaways.hasOwnProperty(key)) {
        if (savedGiveaways[key]) {
          for (let subKey in giveaways[key]) {
            if (giveaways[key].hasOwnProperty(subKey)) {
              if (subKey === null) {
                delete savedGiveaways[key][subKey];
              } else {
                savedGiveaways[key][subKey] = giveaways[key][subKey];
              }
            }
          }
        } else {
          savedGiveaways[key] = giveaways[key];
        }
      }
    }
    if (!firstRun) {
      await this.setValue('giveaways', JSON.stringify(savedGiveaways));
      deleteLock();
    }
  }

  async lockAndSaveDiscussions(discussions) {
    let deleteLock = await this.createLock('discussionLock', 300),
      savedDiscussions = JSON.parse(this.getValue('discussions', '{}'));
    for (let key in discussions) {
      if (discussions.hasOwnProperty(key)) {
        if (savedDiscussions[key]) {
          for (let subKey in discussions[key]) {
            if (discussions[key].hasOwnProperty(subKey)) {
              if (discussions[key][subKey] === null) {
                delete savedDiscussions[key][subKey];
              } else {
                savedDiscussions[key][subKey] = discussions[key][subKey];
              }
            }
          }
        } else {
          savedDiscussions[key] = discussions[key];
        }
        if (!savedDiscussions[key].readComments) {
          savedDiscussions[key].readComments = {};
        }
      }
    }
    await this.setValue('discussions', JSON.stringify(savedDiscussions));
    deleteLock();
  }

  async lockAndSaveTickets(items) {
    const deleteLock = await this.createLock('ticketLock', 300);
    const saved = JSON.parse(this.getValue('tickets', '{}'));
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        if (saved[key]) {
          for (const subKey in items[key]) {
            if (items[key].hasOwnProperty(subKey)) {
              if (items[key][subKey] === null) {
                delete saved[key][subKey];
              } else {
                saved[key][subKey] = items[key][subKey];
              }
            }
          }
        } else {
          saved[key] = items[key];
        }
        if (!saved[key].readComments) {
          saved[key].readComments = {};
        }
      }
    }
    await this.setValue('tickets', JSON.stringify(saved));
    deleteLock();
  }

  async lockAndSaveTrades(items) {
    const deleteLock = await this.createLock('tradeLock', 300);
    const saved = JSON.parse(this.getValue('trades', '{}'));
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        if (saved[key]) {
          for (const subKey in items[key]) {
            if (items[key].hasOwnProperty(subKey)) {
              if (items[key][subKey] === null) {
                delete saved[key][subKey];
              } else {
                saved[key][subKey] = items[key][subKey];
              }
            }
          }
        } else {
          saved[key] = items[key];
        }
        if (!saved[key].readComments) {
          saved[key].readComments = {};
        }
      }
    }
    await this.setValue('trades', JSON.stringify(saved));
    deleteLock();
  }

  async lockAndSaveGroups(groups, sync) {
    const deleteLock = await this.createLock('groupLock', 300);
    let savedGroups = JSON.parse(this.getValue('groups', '[]'));
    if (!Array.isArray(savedGroups)) {
      const newGroups = [];
      for (const key in savedGroups) {
        if (savedGroups.hasOwnProperty(key)) {
          newGroups.push(savedGroups[key]);
        }
      }
      savedGroups = newGroups;
    }
    if (sync) {
      for (const group of savedGroups) {
        if (group) {
          delete group.member;
        }
      }
    }
    for (const code in groups) {
      if (groups.hasOwnProperty(code)) {
        const group = groups[code];
        let savedGroup = savedGroups.filter(item => item.code === code)[0];
        if (savedGroup) {
          for (const key in group) {
            if (group.hasOwnProperty(key)) {
              savedGroup[key] = group[key];
            }
          }
        } else {
          savedGroup = group;
          savedGroups.push(savedGroup);
        }
        if (!savedGroup.avatar || !savedGroup.steamId) {
          const html = parseHtml((await this.request({ method: 'GET', url: `/group/${code}/` })).responseText);
          savedGroup.avatar = html.getElementsByClassName('global__image-inner-wrap')[0].style.backgroundImage.match(/\/avatars\/(.+)_full/)[1];
          savedGroup.steamId = html.getElementsByClassName('sidebar__shortcut-inner-wrap')[0].firstElementChild.getAttribute('href').match(/\d+/)[0];
        }
      }
    }
    await this.setValue('groups', JSON.stringify(savedGroups));
    deleteLock();
  }

  lookForPopups(response) {
    const popup = (response.html || parseHtml(response.responseText)).querySelector(`.popup--gift-sent, .popup--gift-received`);
    if (!popup) {
      return;
    }
    document.body.appendChild(popup);
    new Popup({ addScrollable: true, icon: '', isTemp: true, title: '', popup: popup }).open();
    if (!this.esgst.st) {
      return;
    }
    const links = popup.querySelectorAll('a');
    for (const link of links) {
      const url = link.getAttribute('href');
      if (!url) {
        continue;
      }
      link.setAttribute('href', url.replace(/^\//, `https://www.steamgifts.com/`));
    }
  }

  async getWonGames(syncer) {
    const savedGames = JSON.parse(this.getValue('games'));
    const to_save = { apps: {}, subs: {} };
    for (const id in savedGames.apps) {
      if (savedGames.apps.hasOwnProperty(id)) {
        if (savedGames.apps[id].won) {
          to_save.apps[id] = { won: null };
        }
      }
    }
    for (const id in savedGames.subs) {
      if (savedGames.subs.hasOwnProperty(id)) {
        if (savedGames.subs[id].won) {
          to_save.subs[id] = { won: null };
        }
      }
    }
    let lastPage = null,
      nextPage = 1,
      pagination = null;
    do {
      syncer.progress.lastElementChild.textContent = `Syncing your won games (page ${nextPage}${lastPage ? ` of ${lastPage}` : ''})...`;
      const responseHtml = parseHtml((await this.request({
        method: 'GET',
        url: `/giveaways/won/search?page=${nextPage}`
      })).responseText),
        elements = responseHtml.getElementsByClassName('table__row-outer-wrap');
      if (!lastPage) {
        lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(responseHtml);
      }
      for (const element of elements) {
        if (element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden)`)) {
          continue;
        }
        const info = await this.esgst.modules.games.games_getInfo(element);
        if (!info) {
          continue;
        }
        to_save[info.type][info.id] = { won: parseInt(element.querySelector(`[data-timestamp]`).getAttribute('data-timestamp')) * 1e3 };
      }
      nextPage += 1;
      pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
    } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains('is-selected'));
    await this.lockAndSaveGames(to_save);
  }

  saveAndSortContent(array, key, options) {
    this.sortContent(array, options.value);
    // noinspection JSIgnoredPromiseFromCall
    this.setSetting(key, options.value);
  }

  observeChange(context, id, save = null, key = 'value', event = 'change') {
    context.addEventListener(event, () => {
      let value = context[key];
      gSettings[id] = value;
      if (save) {
        if (typeof save === 'object') {
          save[id] = value;
        } else {
          this.setSetting(id, value);
        }
      }
    });
  }

  observeNumChange(context, id, save = null, key = 'value') {
    gSettings[id] = parseFloat(gSettings[id]);
    context.addEventListener('change', () => {
      let value = parseFloat(context[key]);
      // noinspection JSIgnoredPromiseFromCall
      gSettings[id] = value;
      if (save) {
        if (typeof save === 'object') {
          save[id] = value;
        } else {
          this.setSetting(id, value);
        }
      }
    });
  }

  async checkMissingDiscussions(refresh, callback) {
    let rows = document.getElementsByClassName('table__rows');
    let numDiscussions = 0;
    let numDeals = 0;
    let filteredDiscussions = 0;
    let filteredDeals = 0;
    if (refresh) {
      rows[0].innerHTML = '';
      rows[1].innerHTML = '';
    } else {
      let preset = null;
      if (gSettings.df && gSettings.df_m && gSettings.df_enable) {
        let name = gSettings.df_preset;
        if (name) {
          let i;
          for (i = gSettings.df_presets.length - 1; i > -1 && gSettings.df_presets[i].name !== name; i--) {
          }
          if (i > -1) {
            preset = gSettings.df_presets[i];
          }
        }
      }
      if (preset) {
        const filters = this.esgst.modules.discussionsDiscussionFilters.getFilters();
        (await this.esgst.modules.discussions.discussions_get(rows[0], true)).forEach(discussion => {
          if (!this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(filters, discussion, preset.rules)) {
            // @ts-ignore
            discussion.outerWrap.remove();
            filteredDiscussions += 1;
          } else {
            numDiscussions += 1;
          }
        });
        (await this.esgst.modules.discussions.discussions_get(rows[1], true)).forEach(deal => {
          if (!this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(filters, deal, preset.rules)) {
            // @ts-ignore
            deal.outerWrap.remove();
            filteredDeals += 1;
          } else {
            numDeals += 1;
          }
        });
      } else {
        numDiscussions = (await this.esgst.modules.discussions.discussions_get(rows[0], true)).length;
        numDeals = (await this.esgst.modules.discussions.discussions_get(rows[1], true)).length;
      }
    }
    if (numDiscussions < 5 || numDeals < 5) {
      let [response1, response2] = await Promise.all([
        this.request({ method: 'GET', url: '/discussions' }),
        this.request({ method: 'GET', url: '/discussions/deals' })
      ]);
      let response1Html = parseHtml(response1.responseText);
      let response2Html = parseHtml(response2.responseText);
      let revisedElements = [];
      let preset = null;
      if (gSettings.df && gSettings.df_m && gSettings.df_enable) {
        let name = gSettings.df_preset;
        if (name) {
          let i;
          for (i = gSettings.df_presets.length - 1; i > -1 && gSettings.df_presets[i].name !== name; i--) {
          }
          if (i > -1) {
            preset = gSettings.df_presets[i];
          }
        }
      }
      (await this.esgst.modules.discussions.discussions_get(response1Html, true)).forEach(element => {
        // @ts-ignore
        if (element.category !== 'Deals') {
          revisedElements.push(element);
        }
      });
      const filters = this.esgst.modules.discussionsDiscussionFilters.getFilters();
      let i = revisedElements.length - (numDiscussions + filteredDiscussions + 1);
      while (numDiscussions < 5 && i > -1) {
        if (!preset || this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(filters, revisedElements[i], preset.rules)) {
          this.setMissingDiscussion(revisedElements[i]);
          rows[0].appendChild(revisedElements[i].outerWrap);
          numDiscussions += 1;
        }
        i -= 1;
      }
      let elements = await this.esgst.modules.discussions.discussions_get(response2Html, true);
      i = elements.length - (numDeals + filteredDeals + 1);
      while (numDeals < 5 && i > -1) {
        if (!preset || this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(filters, elements[i], preset.rules)) {
          this.setMissingDiscussion(elements[i]);
          // @ts-ignore
          rows[1].appendChild(elements[i].outerWrap);
          numDeals += 1;
        }
        i -= 1;
      }
      if (gSettings.adots) {
        this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load(refresh);
      } else if (gSettings.radb && !refresh) {
        this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
      }
      if (refresh) {
        await this.endless_load(this.esgst.activeDiscussions);
      }
      if (callback) {
        callback();
      }
    } else {
      if (gSettings.adots) {
        this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load();
      } else if (gSettings.radb && !refresh) {
        this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
      }
      if (callback) {
        callback();
      }
    }
  }

  loadDM() {
    const options = {
      items: [
        {
          check: true,
          name: 'View recent username changes',
          callback: this.setSMRecentUsernameChanges.bind(this)
        },
        {
          check: gSettings.uf,
          name: 'See list of filtered users',
          callback: this.setSMManageFilteredUsers.bind(this)
        },
        {
          check: this.esgst.sg && gSettings.gf && gSettings.gf_s,
          name: 'Manage hidden giveaways',
          callback: this.setSMManageFilteredGiveaways.bind(this)
        },
        {
          click: true,
          check: this.esgst.sg && gSettings.df && gSettings.df_s,
          name: 'Manage hidden discussions',
          callback: this.esgst.modules.discussionsDiscussionFilters.df_menu.bind(this.esgst.modules.discussionsDiscussionFilters, {})
        },
        {
          click: true,
          check: this.esgst.st && gSettings.tf && gSettings.tf_s,
          name: 'Manage hidden trades',
          callback: this.esgst.modules.tradesTradeFilters.tf_menu.bind(this.esgst.modules.tradesTradeFilters, {})
        },
        {
          check: this.esgst.sg && gSettings.dt,
          name: 'Manage discussion tags',
          callback: this.openManageDiscussionTagsPopup.bind(this)
        },
        {
          check: this.esgst.sg && gSettings.ut,
          name: 'Manage user tags',
          callback: this.openManageUserTagsPopup.bind(this)
        },
        {
          check: gSettings.gt,
          name: 'Manage game tags',
          callback: this.openManageGameTagsPopup.bind(this)
        },
        {
          check: gSettings.gpt,
          name: 'Manage group tags',
          callback: this.openManageGroupTagsPopup.bind(this)
        },
        {
          click: true,
          check: gSettings.wbc,
          name: 'Manage Whitelist / Blacklist Checker caches',
          callback: this.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton.bind(this.esgst.modules.usersWhitelistBlacklistChecker, false)
        },
        {
          click: true,
          check: gSettings.namwc,
          name: 'Manage Not Activated / Multiple Wins Checker caches',
          callback: this.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup.bind(this.esgst.modules.usersNotActivatedMultipleWinChecker)
        }
      ]
    };
    const context = this.esgst.sidebar.nextElementSibling;
    context.setAttribute('data-esgst-popup', true);
    context.innerHTML = '';
    this.esgst.mainPageHeading = new elementBuilder[shared.esgst.name].pageHeading({
      context,
      position: 'beforeEnd',
      breadcrumbs: [
        {
          name: 'ESGST',
          url: this.esgst.settingsUrl
        },
        {
          name: 'Data Management',
          url: this.esgst.dataManagementUrl
        }
      ]
    }).pageHeading;
    for (const item of options.items) {
      const set = new ButtonSet({
        color1: 'green',
        color2: 'grey',
        icon1: '',
        icon2: '',
        title1: 'Open',
        title2: '',
        callback1: item.click ? null : () => item.callback(set)
      }).set;
      if (item.click) {
        item.callback(set);
      }
      item.content = [
        set
      ];
    }
    this.createFormRows(context, 'beforeEnd', options);
  }

  async setSMManageFilteredGiveaways() {
    let gfGiveaways, giveaway, hidden, i, key, n, popup, set;
    popup = new Popup({ addScrollable: true, icon: 'fa-gift', isTemp: true, title: 'Hidden Giveaways' });
    hidden = [];
    const now = Date.now();
    for (key in this.esgst.giveaways) {
      if (this.esgst.giveaways.hasOwnProperty(key)) {
        giveaway = this.esgst.giveaways[key];
        if (giveaway.hidden && giveaway.code && giveaway.endTime) {
          if (now >= giveaway.endTime) {
            delete giveaway.hidden;
          } else {
            hidden.push(giveaway);
          }
        } else {
          delete giveaway.hidden;
        }
      }
    }
    hidden = hidden.sort((a, b) => {
      if (a.hidden > b.hidden) {
        return -1;
      } else if (a.hidden < b.hidden) {
        return 1;
      } else {
        return 0;
      }
    });
    // noinspection JSIgnoredPromiseFromCall
    this.setValue('giveaways', JSON.stringify(this.esgst.giveaways));
    i = 0;
    n = hidden.length;
    gfGiveaways = this.createElements(popup.scrollable, 'beforeEnd', [{
      attributes: {
        class: 'esgst-text-left'
      },
      type: 'div'
    }]);
    if (n > 0) {
      set = new ButtonSet({
        color1: 'green',
        color2: 'grey',
        icon1: 'fa-plus',
        icon2: 'fa-circle-o-notch fa-spin',
        title1: 'Load more...',
        title2: 'Loading more...',
        callback1: () => {
          return new Promise(resolve => {
            // noinspection JSIgnoredPromiseFromCall
            this.loadGfGiveaways(i, i + 5, hidden, gfGiveaways, popup, value => {
              i = value;
              if (i > n) {
                set.set.remove();
              } else if (gSettings.es_gf && popup.scrollable.scrollHeight <= popup.scrollable.offsetHeight) {
                set.trigger();
              }
              resolve();
            });
          });
        }
      });
      popup.description.appendChild(set.set);
      popup.open();
      set.trigger();
      if (gSettings.es_gf) {
        popup.scrollable.addEventListener('scroll', () => {
          if ((popup.scrollable.scrollTop + popup.scrollable.offsetHeight) >= popup.scrollable.scrollHeight && !set.busy) {
            set.trigger();
          }
        });
      }
    } else {
      gfGiveaways.textContent = 'No hidden giveaways found.';
      popup.open();
    }
  }

  async loadGfGiveaways(i, n, hidden, gfGiveaways, popup, callback) {
    let giveaway;
    if (i < n) {
      if (hidden[i]) {
        let response = await this.request({
          method: 'GET',
          queue: true,
          url: `https://www.steamgifts.com/giveaway/${hidden[i].code}/`
        });
        giveaway = await this.buildGiveaway(parseHtml(response.responseText), response.finalUrl);
        if (giveaway) {
          this.createElements(gfGiveaways, 'beforeEnd', giveaway.html);
          await this.endless_load(gfGiveaways.lastElementChild, false, 'gf');
          window.setTimeout(() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
        } else {
          window.setTimeout(() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
        }
      } else {
        callback(i + 1);
      }
    } else {
      callback(i);
    }
  }

  async openManageDiscussionTagsPopup() {
    let context, input, popup, savedDiscussion, savedDiscussions, discussions;
    popup = new Popup({ addScrollable: true, icon: 'fa-tags', isTemp: true, title: `Manage discussion tags:` });
    input = this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        type: 'text'
      },
      type: 'input'
    }]);
    this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        class: 'esgst-description'
      },
      text: 'Type tags below to filter the discussions by.',
      type: 'div'
    }]);
    let heading = this.createElements(popup.description, 'beforeBegin', [{
      attributes: {
        class: 'page__heading'
      },
      type: 'div'
    }]);
    if (gSettings.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedDiscussions = JSON.parse(this.getValue('discussions'));
    discussions = {};
    for (const key in savedDiscussions) {
      if (savedDiscussions.hasOwnProperty(key)) {
        savedDiscussion = savedDiscussions[key];
        if (savedDiscussion.tags && (savedDiscussion.tags.length > 1 || (savedDiscussion.tags[0] && savedDiscussion.tags[0].trim()))) {
          context = this.createElements(popup.scrollable, 'beforeEnd', [{
            type: 'div',
            children: [{
              attributes: {
                class: 'esgst-dt-menu',
                href: `https://www.steamgifts.com/discussion/${key}/`
              },
              text: savedDiscussion.name || key,
              type: 'a'
            }]
          }]);
          discussions[key] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener('input', this.filterDiscussionTags.bind(this, discussions));
    popup.open();
  }

  filterDiscussionTags(discussions, event) {
    let i, tags, key, userTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
      for (key in discussions) {
        if (discussions.hasOwnProperty(key)) {
          userTags = discussions[key].context.getElementsByClassName('esgst-tags')[0];
          for (i = tags.length - 1; i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            discussions[key].context.classList.add('esgst-hidden');
          } else {
            discussions[key].context.classList.remove('esgst-hidden');
          }
        }
      }
    } else {
      for (key in discussions) {
        if (discussions.hasOwnProperty(key)) {
          discussions[key].context.classList.remove('esgst-hidden');
        }
      }
    }
  }

  async openManageUserTagsPopup() {
    let context, input, popup, savedUser, savedUsers, users;
    popup = new Popup({ addScrollable: true, icon: 'fa-tags', isTemp: true, title: `Manage user tags:` });
    input = this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        type: 'text'
      },
      type: 'input'
    }]);
    this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        class: 'esgst-description'
      },
      text: 'Type tags below to filter the users by.',
      type: 'div'
    }]);
    let heading = this.createElements(popup.description, 'beforeBegin', [{
      attributes: {
        class: 'page__heading'
      },
      type: 'div'
    }]);
    if (gSettings.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedUsers = JSON.parse(this.getValue('users'));
    users = {};
    for (const steamId in savedUsers.users) {
      if (savedUsers.users.hasOwnProperty(steamId)) {
        savedUser = savedUsers.users[steamId];
        if (savedUser.tags && (savedUser.tags.length > 1 || (savedUser.tags[0] && savedUser.tags[0].trim()))) {
          const attributes = {};
          if (savedUser.username) {
            attributes['data-sg'] = true;
            attributes.href = `https://www.steamgifts.com/user/${savedUser.username}`;
          } else {
            attributes['data-st'] = true;
            attributes.href = `https://www.steamtrades.com/user/${steamId}`;
          }
          context = this.createElements(popup.scrollable, 'beforeEnd', [{
            type: 'div',
            children: [{
              attributes,
              text: savedUser.username || steamId,
              type: 'a'
            }]
          }]);
          users[savedUser.username || steamId] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener('input', this.filterUserTags.bind(this, users));
    popup.open();
  }

  filterUserTags(users, event) {
    let i, tags, username, userTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
      for (username in users) {
        if (users.hasOwnProperty(username)) {
          userTags = users[username].context.getElementsByClassName('esgst-tags')[0];
          for (i = tags.length - 1; i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            users[username].context.classList.add('esgst-hidden');
          } else {
            users[username].context.classList.remove('esgst-hidden');
          }
        }
      }
    } else {
      for (username in users) {
        if (users.hasOwnProperty(username)) {
          users[username].context.classList.remove('esgst-hidden');
        }
      }
    }
  }

  async openManageGameTagsPopup() {
    let context, games, input, popup, savedGame, savedGames;
    popup = new Popup({ addScrollable: true, icon: 'fa-tags', isTemp: true, title: `Manage game tags:` });
    input = this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        type: 'text'
      },
      type: 'input'
    }]);
    this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        class: 'esgst-description'
      },
      text: 'Type tags below to filter the games by.',
      type: 'div'
    }]);
    let heading = this.createElements(popup.description, 'beforeBegin', [{
      attributes: {
        class: 'page__heading'
      },
      type: 'div'
    }]);
    if (gSettings.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedGames = JSON.parse(this.getValue('games'));
    games = {
      apps: {},
      subs: {}
    };
    for (const id in savedGames.apps) {
      if (savedGames.apps.hasOwnProperty(id)) {
        savedGame = savedGames.apps[id];
        if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
          context = this.createElements(popup.scrollable, 'beforeEnd', [{
            attributes: {
              class: 'table__row-outer-wrap'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'table__column__heading',
                href: `http://store.steampowered.com/app/${id}`
              },
              text: `App - ${id}`,
              type: 'a'
            }]
          }]);
          games.apps[id] = {
            context: context
          };
        }
      }
    }
    for (const id in savedGames.subs) {
      if (savedGames.subs.hasOwnProperty(id)) {
        savedGame = savedGames.subs[id];
        if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
          context = this.createElements(popup.scrollable, 'beforeEnd', [{
            attributes: {
              class: 'table__row-outer-wrap'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'table__column__heading',
                href: `http://store.steampowered.com/sub/${id}`
              },
              text: `Sub - ${id}`,
              type: 'a'
            }]
          }]);
          games.subs[id] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener('input', this.filterGameTags.bind(this, games));
    popup.open();
  }

  filterGameTags(games, event) {
    let gameTags, i, id, tags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
      for (id in games.apps) {
        if (games.apps.hasOwnProperty(id)) {
          gameTags = games.apps[id].context.getElementsByClassName('esgst-tags')[0];
          for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            games.apps[id].context.classList.add('esgst-hidden');
          } else {
            games.apps[id].context.classList.remove('esgst-hidden');
          }
        }
      }
      for (id in games.subs) {
        if (games.subs.hasOwnProperty(id)) {
          gameTags = games.subs[id].context.getElementsByClassName('esgst-tags')[0];
          for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            games.subs[id].context.classList.add('esgst-hidden');
          } else {
            games.subs[id].context.classList.remove('esgst-hidden');
          }
        }
      }
    } else {
      for (id in games.apps) {
        if (games.apps.hasOwnProperty(id)) {
          games.apps[id].context.classList.remove('esgst-hidden');
        }
      }
      for (id in games.subs) {
        if (games.subs.hasOwnProperty(id)) {
          games.subs[id].context.classList.remove('esgst-hidden');
        }
      }
    }
  }

  async openManageGroupTagsPopup() {
    let context, input, popup, savedGroups, groups;
    popup = new Popup({ addScrollable: true, icon: 'fa-tags', isTemp: true, title: `Manage group tags:` });
    input = this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        type: 'text'
      },
      type: 'input'
    }]);
    this.createElements(popup.description, 'afterBegin', [{
      attributes: {
        class: 'esgst-description'
      },
      text: 'Type tags below to filter the groups by.',
      type: 'div'
    }]);
    let heading = this.createElements(popup.description, 'beforeBegin', [{
      attributes: {
        class: 'page__heading'
      },
      type: 'div'
    }]);
    if (gSettings.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedGroups = JSON.parse(this.getValue('groups'));
    groups = {};
    for (const savedGroup of savedGroups) {
      if (!savedGroup || !savedGroup.tags || (savedGroup.tags.length < 2 && (!savedGroup.tags[0] || !savedGroup.tags[0].trim()))) {
        continue;
      }
      context = this.createElements(popup.scrollable, 'beforeEnd', [{
        type: 'div',
        children: [{
          attributes: {
            href: `https://www.steamgifts.com/group/${savedGroup.code}/`
          },
          text: savedGroup.name,
          type: 'a'
        }]
      }]);
      groups[savedGroup.code] = {
        context: context
      };
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener('input', this.filterGroupTags.bind(this, groups));
    popup.open();
  }

  filterGroupTags(groups, event) {
    let i, tags, code, groupTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
      for (code in groups) {
        if (groups.hasOwnProperty(code)) {
          groupTags = groups[code].context.getElementsByClassName('esgst-tags')[0];
          for (i = tags.length - 1; i >= 0 && !groupTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            groups[code].context.classList.add('esgst-hidden');
          } else {
            groups[code].context.classList.remove('esgst-hidden');
          }
        }
      }
    } else {
      for (code in groups) {
        if (groups.hasOwnProperty(code)) {
          groups[code].context.classList.remove('esgst-hidden');
        }
      }
    }
  }

  async setSMRecentUsernameChanges() {
    if (!(await permissions.requestUi([['googleWebApp']], 'uh'))) {
      return;
    }

    const popup = new Popup({ addScrollable: true, icon: 'fa-comments', title: 'Recent Username Changes' });
    popup.progress = this.createElements(popup.description, 'beforeEnd', [{
      type: 'div',
      children: [{
        attributes: {
          class: 'fa fa-circle-o-notch fa-spin'
        },
        type: 'i'
      }, {
        text: 'Loading recent username changes...',
        type: 'span'
      }]
    }]);
    popup.results = this.createElements(popup.scrollable, 'beforeEnd', [{
      attributes: {
        class: 'esgst-uh-popup'
      },
      type: 'div'
    }]);
    popup.open();
    const recentChanges = await this.getRecentChanges();
    popup.progress.innerHTML = '';
    const items = [];
    for (const change of recentChanges) {
      items.push({
        type: 'div',
        children: [{
          text: `${change[0]} changed to `,
          type: 'node'
        }, {
          attributes: {
            class: 'esgst-bold',
            href: `/user/${change[1]}`
          },
          text: change[1],
          type: 'a'
        }]
      });
    }
    this.createElements(popup.results, 'inner', items);
    if (this.esgst.sg) {
      // noinspection JSIgnoredPromiseFromCall
      this.endless_load(popup.results);
    }
  }

  async getRecentChanges() {
    const response = JSON.parse((await this.request({
      method: 'GET',
      url: `https://script.google.com/macros/s/AKfycbz2IWN7I79WsbGELQk2rbQQSPI8XNWvDt3mEO-3nLEWqHiQmeo/exec?action=uh&code=1`
    })).responseText);

    /** @property {Object} response.recent */
    return response.recent;
  }

  updateWhitelistBlacklist(key, profile, event) {
    let user;
    user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username,
      values: {}
    };
    if (!event || event.currentTarget.classList.contains('is-selected')) {
      user.values[key] = false;
    } else {
      user.values[key] = true;
      user.values[`${key}Date`] = Date.now();
    }
    // noinspection JSIgnoredPromiseFromCall
    this.saveUser(null, null, user);
  }

  /**
   * @param id
   * @param type
   * @param [unhide]
   * @returns {Promise<void>}
   */
  async updateHiddenGames(id, type, unhide) {
    if (!gSettings.updateHiddenGames) {
      return;
    }
    const games = {
      apps: {},
      subs: {}
    };
    games[type][id] = {
      hidden: unhide ? null : true
    };
    await this.lockAndSaveGames(games);
  }

  checkBackup() {
    let currentDate = Date.now();
    let isBackingUp = parseInt(this.getLocalValue('isBackingUp'));
    if ((!isBackingUp || currentDate - isBackingUp > 1800000) && currentDate - gSettings.lastBackup > gSettings.autoBackup_days * 86400000) {
      this.setLocalValue('isBackingUp', currentDate);
      if (gSettings.openAutoBackupNewTab) {
        window.open(`${shared.esgst.backupUrl}&autoBackupIndex=${gSettings.autoBackup_index}`);
      } else {
        this.runSilentBackup();
      }
    }
  }

  async downloadZip(data, fileName, zipName) {
    this.downloadFile(null, zipName, await this.getZip(JSON.stringify(data), fileName));
  }

  async getZip(data, fileName, type = 'blob') {
    const zip = new JSZip();
    zip.file(fileName, data);
    return (await zip.generateAsync({
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9
      },
      // @ts-ignore
      type: type
    }));
  }

  async readZip(data) {
    const zip = new JSZip();

    //** @type {ZipFile} */
    const contents = await zip.loadAsync(data);
    const keys = Object.keys(contents.files),
      output = [];
    for (const key of keys) {
      output.push({
        name: key,
        value: await zip.file(key).async('text')
      });
    }
    return output;
  }

  downloadFile(data, fileName, blob) {
    const url = window.URL.createObjectURL(blob || new Blob([data])),
      file = document.createElement('a');
    file.download = fileName;
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    window.URL.revokeObjectURL(url);
  }

  async createLock(key, threshold, v2Obj) {
    const lock = {
      key,
      threshold,
      uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, utils.createUuid.bind(utils)),
      ...v2Obj
    };
    const wasLocked = await this.do_lock(lock);
    const deleteLock = this.do_unlock.bind(this, lock);
    if (v2Obj) {
      return { deleteLock, lock, wasLocked };
    }
    return deleteLock;
  }

  async lockAndSaveGames(games) {
    let deleteLock = await this.createLock('gameLock', 300);
    let saved = JSON.parse(this.getValue('games'));
    if (games.apps) {
      for (let key in games.apps) {
        if (games.apps.hasOwnProperty(key)) {
          if (saved.apps[key]) {
            for (let subKey in games.apps[key]) {
              if (games.apps[key].hasOwnProperty(subKey)) {
                if (games.apps[key][subKey] === null) {
                  delete saved.apps[key][subKey];
                } else {
                  saved.apps[key][subKey] = games.apps[key][subKey];
                }
              }
            }
          } else {
            saved.apps[key] = games.apps[key];
          }
          if (!saved.apps[key].tags) {
            delete saved.apps[key].tags;
          }
        }
      }
    }
    if (games.subs) {
      for (let key in games.subs) {
        if (games.subs.hasOwnProperty(key)) {
          if (saved.subs[key]) {
            for (let subKey in games.subs[key]) {
              if (games.subs[key].hasOwnProperty(subKey)) {
                if (games.subs[key][subKey] === null) {
                  delete saved.subs[key][subKey];
                } else {
                  saved.subs[key][subKey] = games.subs[key][subKey];
                }
              }
            }
          } else {
            saved.subs[key] = games.subs[key];
          }
          if (!saved.subs[key].tags) {
            delete saved.subs[key].tags;
          }
        }
      }
    }
    await this.setValue('games', JSON.stringify(saved));
    deleteLock();
  }

  async setThemeVersion(id, version, theme) {
    if (!theme) {
      theme = this.getValue(id);
    }
    let match = (theme || '').match(/(v|black\s|blue\s|steamtrades\s)([.\d]+?)\*/);
    version.textContent = `v${(match && match[2]) || 'Unknown'}`;
  }

  async setSMManageFilteredUsers() {
    /** @type {Popup} */
    let popup;
    if (popup) {
      popup.open();
    } else {
      popup = new Popup({ addScrollable: true, icon: 'fa-eye-slash', title: 'Filtered Users' });
      let users = JSON.parse(this.getValue('users'));
      let filtered = [];
      for (let key in users.users) {
        if (users.users.hasOwnProperty(key)) {
          const data = shared.esgst.modules.usersUserFilters.fixData(users.users[key].uf);
          if (data && (data.giveawayPosts || data.giveaways || data.discussionPosts || data.discussions)) {
            filtered.push(users.users[key]);
          }
        }
      }
      filtered.sort((a, b) => {
        if (a.username > b.username) {
          return -1;
        } else {
          return 1;
        }
      });
      let table = this.createElements(popup.scrollable, 'beforeEnd', [{
        attributes: {
          class: 'table'
        },
        type: 'div',
        children: [{
          attributes: {
            class: 'table__heading'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'table__column--width-fill'
            },
            text: 'Username',
            type: 'div'
          }, {
            attributes: {
              class: 'table__column--width-small'
            },
            text: 'Discussions Hidden',
            type: 'div'
          }, {
            attributes: {
              class: 'table__column--width-small'
            },
            text: 'Discussion Posts Hidden',
            type: 'div'
          }, {
            attributes: {
              class: 'table__column--width-small'
            },
            text: 'Giveaways Hidden',
            type: 'div'
          }, {
            attributes: {
              class: 'table__column--width-small'
            },
            text: 'Giveaway Posts Hidden',
            type: 'div'
          }]
        }, {
          attributes: {
            class: 'table__rows'
          },
          type: 'div'
        }]
      }]);
      for (let i = 0, n = filtered.length; i < n; ++i) {
        const discussionsIcon = filtered[i].uf.discussions ? 'fa fa-check' : '';
        const discussionPostsIcon = filtered[i].uf.discussionPosts ? 'fa fa-check' : '';
        const giveawaysIcon = filtered[i].uf.giveaways ? 'fa fa-check' : '';
        const giveawayPostsIcon = filtered[i].uf.giveawayPosts ? 'fa fa-check' : '';
        this.createElements(table.lastElementChild, 'beforeEnd', [{
          attributes: {
            class: 'table__row-outer-wrap'
          },
          type: 'div',
          children: [{
            attributes: {
              class: 'table__row-inner-wrap'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'table__column--width-fill'
              },
              type: 'div',
              children: [{
                attributes: {
                  href: `/user/${filtered[i].username}`
                },
                text: filtered[i].username,
                type: 'a'
              }]
            }, {
              attributes: {
                class: 'table__column--width-small'
              },
              type: 'div',
              children: discussionsIcon ? [{
                attributes: {
                  class: discussionsIcon
                },
                type: 'i'
              }] : null
            }, {
              attributes: {
                class: 'table__column--width-small'
              },
              type: 'div',
              children: discussionPostsIcon ? [{
                attributes: {
                  class: discussionPostsIcon
                },
                type: 'i'
              }] : null
            }, {
              attributes: {
                class: 'table__column--width-small'
              },
              type: 'div',
              children: giveawaysIcon ? [{
                attributes: {
                  class: giveawaysIcon
                },
                type: 'i'
              }] : null
            }, {
              attributes: {
                class: 'table__column--width-small'
              },
              type: 'div',
              children: giveawayPostsIcon ? [{
                attributes: {
                  class: giveawayPostsIcon
                },
                type: 'i'
              }] : null
            }]
          }]
        }]);
      }
      popup.open();
    }
  }

  multiChoice(choice1Color, choice1Icon, choice1Title, choice2Color, choice2Icon, choice2Title, title, onChoice1, onChoice2) {
    if (gSettings.cfh_img_remember) {
      if (gSettings.cfh_img_choice === 1) {
        onChoice1();
      } else {
        onChoice2();
      }
    } else {
      let popup = new Popup({ addScrollable: true, icon: 'fa-list', isTemp: true, title: title });
      new ToggleSwitch(popup.description, 'cfh_img_remember', false, 'Never ask again.', false, false, 'Remembers which option you choose forever.', gSettings.cfh_img_remember);
      popup.description.appendChild(new ButtonSet({
        color1: choice1Color,
        color2: '',
        icon1: choice1Icon,
        icon2: '',
        title1: choice1Title,
        title2: '',
        callback1: () => {
          return new Promise(resolve => {
            if (gSettings.cfh_img_remember) {
              // noinspection JSIgnoredPromiseFromCall
              this.setSetting('cfh_img_choice', 1);
            }
            resolve();
            popup.close();
            onChoice1();
          });
        }
      }).set);
      popup.description.appendChild(new ButtonSet({
        color1: choice2Color,
        color2: '',
        icon1: choice2Icon,
        icon2: '',
        title1: choice2Title,
        title2: '',
        callback1: () => {
          return new Promise(resolve => {
            if (gSettings.cfh_img_remember) {
              // noinspection JSIgnoredPromiseFromCall
              this.setSetting('cfh_img_choice', 2);
            }
            resolve();
            popup.close();
            onChoice2();
          });
        }
      }).set);
      popup.open();
    }
  }

  async exportSettings() {
    //** @type {EsgstSettings} */
    let settings = JSON.parse(this.getValue('settings', '{}'));
    let data = { settings, v: shared.esgst.storage.v };

    delete data.settings.avatar;
    delete data.settings.lastSync;
    delete data.settings.steamApiKey;
    delete data.settings.steamId;
    delete data.settings.syncFrequency;
    delete data.settings.username_sg;
    delete data.settings.username_st;
    const name = `${gSettings.askFileName ? window.prompt(`Enter the name of the file:`, `esgst_settings_${new Date().toISOString().replace(/:/g, '_')}`) : `esgst_settings_${new Date().toISOString().replace(/:/g, '_')}`}.json`;
    if (name === 'null.json') return;
    this.downloadFile(JSON.stringify(data), name);
  }

  async selectSwitches(switches, type, settings) {
    const toSave = [];
    for (const key in switches) {
      if (switches.hasOwnProperty(key)) {
        const toggleSwitch = switches[key];
        if (Array.isArray(toggleSwitch)) {
          toSave.push({
            id: toggleSwitch[0].id,
            value: await toggleSwitch[0][type](settings),
            sg: toggleSwitch[0].sg,
            st: toggleSwitch[0].st
          });
        } else if (!toggleSwitch.checkbox || toggleSwitch.checkbox.offsetParent) {
          toSave.push({
            id: toggleSwitch.id,
            value: await toggleSwitch[type](settings),
            sg: toggleSwitch.sg,
            st: toggleSwitch.st
          });
        }
      }
    }
    if (settings) {
      const message = this.createElements_v2(settings, 'beforeEnd', [
        ['div', { class: 'esgst-description esgst-bold' }, [
          ['i', { class: 'fa fa-circle-o-notch fa-spin', title: 'Saving...' }]
        ]]
      ]);
      await this.setSetting(toSave);
      message.classList.add('esgst-green');
      this.createElements_v2(message, 'inner', [
        ['i', { class: 'fa fa-check', title: 'Saved!' }]
      ]);
      window.setTimeout(() => message.remove(), 2500);
    }
  }

  async setTheme() {
    if (this.esgst.theme) {
      this.esgst.theme.remove();
      this.esgst.theme = null;
    }
    if (this.esgst.customThemeElement) {
      this.esgst.customThemeElement.remove();
      this.esgst.customThemeElement = null;
    }
    let keys = Object.keys(this.esgst.features.themes.features);
    for (let i = 0, n = keys.length; i < n; i++) {
      let key = keys[i];
      if (key === 'customTheme') continue;
      if (gSettings[key] && this.checkThemeTime(key)) {
        const theme = this.getValue(key, '');
        if (!theme) continue;
        const css = this.getThemeCss(JSON.parse(theme));
        this.esgst.theme = this.createElements(document.head, 'beforeEnd', [{
          attributes: {
            id: 'esgst-theme'
          },
          text: css,
          type: 'style'
        }]);
        const revisedCss = css.replace(/!important;/g, ';').replace(/;/g, '!important;');
        if (revisedCss !== this.getLocalValue('theme')) {
          this.setLocalValue('theme', revisedCss);
        }
        break;
      }
    }
    if (gSettings.customTheme && this.checkThemeTime('customTheme')) {
      const css = JSON.parse(this.getValue('customTheme', ''));
      this.esgst.customThemeElement = this.createElements(document.head, 'beforeEnd', [{
        attributes: {
          id: 'esgst-custom-theme'
        },
        text: css,
        type: 'style'
      }]);
      const revisedCss = css.replace(/!important;/g, ';').replace(/;/g, '!important;');
      if (revisedCss !== this.getLocalValue('customTheme')) {
        this.setLocalValue('customTheme', revisedCss);
      }
    }
  }

  checkThemeTime(id) {
    let startParts = gSettings[`${id}_startTime`].split(`:`),
      endParts = gSettings[`${id}_endTime`].split(`:`),
      startDate = new Date(),
      startHours = parseInt(startParts[0]),
      startMinutes = parseInt(startParts[1]),
      endDate = new Date(),
      endHours = parseInt(endParts[0]),
      endMinutes = parseInt(endParts[1]),
      currentDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(0);
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(0);
    currentDate.setSeconds(0);
    if (endDate < startDate) {
      if (currentDate < startDate) {
        startDate.setDate(startDate.getDate() - 1);
      } else {
        endDate.setDate(endDate.getDate() + 1);
      }
    }
    if (currentDate >= startDate && currentDate <= endDate) {
      window.setTimeout(() => this.setTheme(), endDate.getTime() - currentDate.getTime());
      return true;
    }
  }

  async request(details) {
    if (!details.headers) {
      details.headers = {};
    }
    details.headers['From'] = 'esgst.extension@gmail.com';
    details.headers['Esgst-Version'] = (await browser.runtime.getManifest()).version;
    if (!details.headers['Content-Type']) {
      details.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (details.queue) {
      let deleteLock = await this.createLock('requestLock', 1000);
      let response = await this.continueRequest(details);
      deleteLock();
      return response;
    } else if (details.url.match(/^https?:\/\/store.steampowered.com/)) {
      const deleteLock = await this.createLock('steamStore', 200);
      const response = await this.continueRequest(details);
      deleteLock();
      return response;
    } else {
      return await this.continueRequest(details);
    }
  }

  hideGame(button, id, name, steamId, steamType) {
    let elements, i, popup;
    popup = new Popup({
      addScrollable: true, icon: 'fa-eye-slash', title: [
        'Would you like to hide all giveaways for ',
        ['span', { class: 'esgst-bold' }, name],
        '?'
      ]
    });
    popup.description.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-check-circle',
      icon2: 'fa-refresh fa-spin',
      title1: 'Yes',
      title2: 'Please wait...',
      callback1: async () => {
        await this.request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${id}`,
          method: 'POST',
          url: '/ajax.php'
        });
        await this.updateHiddenGames(steamId, steamType);
        elements = document.querySelectorAll(`.giveaway__row-outer-wrap[data-game-id="${id}"]`);
        for (i = elements.length - 1; i > -1; --i) {
          elements[i].remove();
        }
        button.remove();
        popup.close();
      }
    }).set);
    this.createElements(popup.actions.firstElementChild, 'outer', [{
      attributes: {
        href: '/account/settings/giveaways/filters'
      },
      text: 'View Hidden Games',
      type: 'a'
    }]);
    popup.open();
  }

  unhideGame(button, id, name, steamId, steamType) {
    let popup;
    popup = new Popup({
      addScrollable: true, icon: 'fa-eye-slash', isTemp: true, title: [
        'Would you like to unhide all giveaways for ',
        ['span', { class: 'esgst-bold' }, name],
        '?'
      ]
    });
    popup.description.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-check-circle',
      icon2: 'fa-refresh fa-spin',
      title1: 'Yes',
      title2: 'Please wait...',
      callback1: async () => {
        await this.request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${id}`,
          method: 'POST',
          url: '/ajax.php'
        });
        await this.updateHiddenGames(steamId, steamType, true);
        button.remove();
        popup.close();
      }
    }).set);
    this.createElements(popup.actions.firstElementChild, 'outer', [{
      attributes: {
        href: '/account/settings/giveaways/filters'
      },
      text: 'View Hidden Games',
      type: 'a'
    }]);
    popup.open();
  }

  draggable_set(obj) {
    if (!obj.values) {
      obj.values = {};
    }
    obj.context.setAttribute('data-draggable-key', obj.id);
    for (const element of obj.context.children) {
      if (element.getAttribute('draggable') || !element.getAttribute('data-draggable-id')) {
        continue;
      }
      element.setAttribute('draggable', true);
      element.addEventListener('dragstart', this.draggable_start.bind(this, obj));
      element.addEventListener('dragenter', this.draggable_enter.bind(this, obj));
      element.addEventListener('dragend', this.draggable_end.bind(this, obj));
    }
  }

  async draggable_start(obj, event) {
    event.dataTransfer.setData('text/plain', '');
    this.esgst.draggable.dragged = event.currentTarget;
    this.esgst.draggable.source = this.esgst.draggable.dragged.parentElement;
    this.esgst.draggable.destination = null;
    if (obj.addTrash) {
      this.draggable_setTrash(obj);
    }
  }

  draggable_enter(obj, event) {
    if (!this.esgst.draggable.dragged) {
      return;
    }
    const element = event.currentTarget;
    if (
      element === this.esgst.draggable.dragged
      || element.getAttribute('data-draggable-id') === this.esgst.draggable.dragged.getAttribute('data-draggable-id')
    ) {
      return;
    }
    if (element === obj.context) {
      if (obj.context.children.length < 1) {
        obj.context.appendChild(this.esgst.draggable.dragged);
        this.esgst.draggable.destination = obj.context;
      }
      return;
    }
    if (element.getAttribute('data-draggable-group') !== this.esgst.draggable.dragged.getAttribute('data-draggable-group')) {
      window.alert('Cannot move this element to this group.');
      return;
    }
    let current = this.esgst.draggable.dragged;
    do {
      current = current.previousElementSibling;
      if (current && current === element) {
        element.parentElement.insertBefore(this.esgst.draggable.dragged, element);
        this.esgst.draggable.destination = this.esgst.draggable.dragged.parentElement;
        return;
      }
    } while (current);
    element.parentElement.insertBefore(this.esgst.draggable.dragged, element.nextElementSibling);
    this.esgst.draggable.destination = this.esgst.draggable.dragged.parentElement;
  }

  async draggable_end(obj) {
    if (this.esgst.draggable.awaitingConfirmation) {
      return;
    }
    if (this.esgst.draggable.trash) {
      this.esgst.draggable.trash.remove();
      this.esgst.draggable.trash = null;
    }
    if (this.esgst.draggable.destination === obj.item.columns || this.esgst.draggable.destination === obj.item.gvIcons) {
      if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/elgb|gp/)) {
        this.esgst.draggable.dragged.classList.add('esgst-giveaway-column-button');
      }
      if (this.esgst.draggable.dragged.getAttribute('data-color')) {
        this.esgst.draggable.dragged.classList.add(this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column');
        this.esgst.draggable.dragged.firstElementChild.style.color = this.esgst.draggable.dragged.getAttribute('data-bgColor');
        this.esgst.draggable.dragged.style.color = '';
        this.esgst.draggable.dragged.style.backgroundColor = '';
      }
    } else {
      if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/elgb|gp/)) {
        this.esgst.draggable.dragged.classList.remove('esgst-giveaway-column-button');
      }
      if (this.esgst.draggable.dragged.getAttribute('data-color')) {
        this.esgst.draggable.dragged.classList.remove(this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column');
        this.esgst.draggable.dragged.style.color = this.esgst.draggable.dragged.getAttribute('data-color');
        this.esgst.draggable.dragged.style.backgroundColor = this.esgst.draggable.dragged.getAttribute('data-bgColor');
      }
    }
    if (this.esgst.draggable.destination === obj.item.heading) {
      if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/steam|search|hideGame/)) {
        this.esgst.draggable.dragged.classList.add('giveaway__icon');
      }
    } else if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/steam|search|hideGame/)) {
      this.esgst.draggable.dragged.classList.remove('giveaway__icon');
    }
    if (this.esgst.draggable.deleted) {
      this.esgst.draggable.dragged.remove();
    }
    const sources = [this.esgst.draggable.source];
    if (this.esgst.draggable.source !== this.esgst.draggable.destination) {
      sources.push(this.esgst.draggable.destination);
    }
    for (const element of sources) {
      if (!element) {
        continue;
      }
      const key = `${element.getAttribute('data-draggable-key')}${obj.item.gvIcons ? '_gv' : ''}`;
      obj.values[key] = [];
      for (const child of element.children) {
        const id = child.getAttribute('data-draggable-id');
        if (id) {
          if (child.getAttribute('data-draggable-obj')) {
            obj.values[key].push(JSON.parse(child.getAttribute('data-draggable-obj')));
          } else {
            obj.values[key].push(id);
          }
        }
      }
      if (key === 'emojis') {
        await this.setValue(key, JSON.stringify(obj.values[key]));
      }
    }
    if (obj.onDragEnd) {
      obj.onDragEnd(obj.values);
    }
    this.esgst.draggable.dragged = null;
    this.esgst.draggable.source = null;
    this.esgst.draggable.destination = null;
  }

  draggable_setTrash(obj) {
    /**
     * @property {HTMLElement} obj.trashContext
     */
    this.esgst.draggable.trash = this.createElements(obj.trashContext || obj.context, 'afterEnd', [{
      attributes: {
        class: 'esgst-draggable-trash'
      },
      type: 'div',
      children: [{
        attributes: {
          class: 'fa fa-trash'
        },
        type: 'i'
      }]
    }]);
    this.esgst.draggable.trash.style.width = `${(obj.trashContext || obj.context).offsetWidth}px`;
    this.esgst.draggable.trash.addEventListener('dragenter', this.draggable_delete.bind(this, obj));
  }

  async draggable_delete(obj) {
    this.esgst.draggable.awaitingConfirmation = true;
    this.esgst.draggable.deleted = false;
    if (
      !this.esgst.draggable.dragged
      || !window.confirm('Are you sure you want to delete this item?')
    ) {
      this.esgst.draggable.awaitingConfirmation = false;
      return;
    }
    this.esgst.draggable.awaitingConfirmation = false;
    this.esgst.draggable.deleted = true;
    await this.draggable_end(obj);
    this.esgst.draggable.deleted = false;
  }

  setCountdown(context, totalSeconds, callback, initialDate = Date.now()) {
    const seconds = totalSeconds - Math.floor((Date.now() - initialDate) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    context.textContent = `${`0${m}`.slice(-2)}:${`0${s}`.slice(-2)}`;
    if (seconds > -1) {
      window.setTimeout(this.setCountdown.bind(this), 1000, context, totalSeconds, callback, initialDate);
    } else if (callback) {
      callback();
    }
  }

  round(number, decimals = 2) {
    const multiplier = Math.pow(10, decimals);
    return Math.round(number * multiplier) / multiplier;
  }

  getTextNodesIn(elem, opt_fnFilter) {
    let textNodes = [];
    if (elem) {
      for (let nodes = elem.childNodes, i = 0, n = nodes.length; i < n; i++) {
        let node = nodes[i], nodeType = node.nodeType;
        if (nodeType === 3) {
          if (!opt_fnFilter || opt_fnFilter(node, elem)) {
            textNodes.push(node);
          }
        }
        else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
          textNodes = textNodes.concat(this.getTextNodesIn(node, opt_fnFilter));
        }
      }
    }
    return textNodes;
  }

  setClearButton(input) {
    const button = input.nextElementSibling;
    input.addEventListener('input', this.toggleClearButton.bind(this, button, input));
    input.addEventListener('change', this.toggleClearButton.bind(this, button, input));
    input.nextElementSibling.addEventListener('click', this.clearInput.bind(this, input));
  }

  toggleClearButton(button, input) {
    if (input.value) {
      if (button.classList.contains('esgst-hidden')) {
        button.classList.remove('esgst-hidden');
      }
    } else if (!button.classList.contains('esgst-hidden')) {
      button.classList.add('esgst-hidden');
    }
  }

  clearInput(input) {
    input.value = '';
    input.dispatchEvent(new Event('change'));
  }

  fixEmojis(emojis) {
    const matches = emojis.split(/<\/span>/);
    if (matches.length < 2) return emojis;
    matches.pop();
    return JSON.stringify(matches.map(this.fixEmoji));
  }

  fixEmoji(emoji) {
    const match = emoji.match(/title="(.+?)"/);
    emoji = emoji.replace(/<span.+?>/, '');
    if (match) {
      return this.getEmojiHtml(emoji);
    }
    let fixed = '';
    for (let i = 0, n = emoji.length; i < n; i++) {
      fixed += this.getEmojiHtml(emoji[i]);
    }
    return fixed;
  }

  getEmojiHtml(emoji) {
    return `&#x${this.getEmojiUnicode(emoji).toString('16').toUpperCase()}`;
  }

  getEmojiUnicode(emoji) {
    if (emoji.length === 1) {
      return emoji.charCodeAt(0);
    }
    const code = (emoji.charCodeAt(0) - 0xD800) * 0x400 + (emoji.charCodeAt(1) - 0xDC00) + 0x10000;
    if (code < 0) {
      return emoji.charCodeAt(0);
    }
    return code;
  }

  triggerOnEnter(callback, event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  }

  getChildByClassName(element, className) {
    let i;
    if (!element) return;
    for (i = element.children.length - 1; i > -1 && !element.children[i].classList.contains(className); i--) {
    }
    if (i > -1) return element.children[i];
  }

  escapeMarkdown(string) {
    return string.replace(/([[\]()*~!.`\->#|])/g, `\\$1`);
  }

  removeDuplicateNotes(notes) {
    let output = [];
    notes.split(/\n/).forEach(part => {
      if (output.indexOf(part) < 0) {
        output.push(part);
      }
      output.push('\n');
    });
    return output.join('').trim().replace(/\n\n+/g, '\n\n');
  }

  capitalizeFirstLetter(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  getTimestamp(seconds, is24Clock, isShowSeconds) {
    return dateFns_format(seconds, `MMM d, yyyy, ${is24Clock ? 'H' : 'h'}:mm${isShowSeconds ? `:ss` : ''}${is24Clock ? '' : ' a'}`);
  }

  /**
   * @param timestamp
   * @param [until]
   * @returns {string}
   */
  getTimeSince(timestamp, until) {
    let n, s;
    s = Math.floor((until ? (timestamp - Date.now()) : (Date.now() - timestamp)) / 1000);
    n = Math.floor(s / 31104000);
    if (n >= 1) {
      return `${n} year${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 2592000);
    if (n >= 1) {
      return `${n} month${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 86400);
    if (n >= 1) {
      return `${n} day${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 3600);
    if (n >= 1) {
      return `${n} hour${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 60);
    if (n >= 1) {
      return `${n} minute${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s);
    return `${n} second${n === 1 ? '' : 's'}`;
  }

  setLocalValue(key, value) {
    window.localStorage.setItem(`esgst_${key}`, value);
  }

  getLocalValue(key, value = undefined) {
    return window.localStorage.getItem(`esgst_${key}`) || value;
  }

  delLocalValue(key) {
    window.localStorage.removeItem(`esgst_${key}`);
  }

  closeHeaderMenu(arrow, dropdown, menu, event) {
    if (!menu.contains(event.target) && arrow.classList.contains('selected')) {
      arrow.classList.remove('selected');
      dropdown.classList.add('esgst-hidden');
    }
  }

  setSiblingsOpacity(element, Opacity) {
    let Siblings, I, N;
    Siblings = element.parentElement.children;
    for (I = 0, N = Siblings.length; I < N; ++I) {
      if (Siblings[I] !== element) {
        Siblings[I].style.opacity = Opacity;
      }
    }
  }

  setHoverOpacity(element, EnterOpacity, LeaveOpacity) {
    element.addEventListener('mouseenter', () => {
      element.style.opacity = EnterOpacity;
    });
    element.addEventListener('mouseleave', () => {
      element.style.opacity = LeaveOpacity;
    });
  }

  timeout(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  createTooltip(context, message, noMarkdown) {
    let popout;
    popout = new Popout(`esgst-feature-description ${noMarkdown ? '' : 'markdown'}`, context, 100);
    popout.popout.style.maxHeight = '300px';
    popout.popout.style.overflow = 'auto';
    this.createElements(popout.popout, 'inner', [...(Array.from(parseHtml(message).body.childNodes).map(x => {
      return {
        context: x
      };
    }))]);
    return popout;
  }

  createOptions(options) {
    let context, elements, id, switches;
    context = document.createElement('div');
    elements = {};
    switches = {};
    options.forEach(option => {
      if (option.check) {
        id = option.id;
        elements[id] = this.createElements(context, 'beforeEnd', [{
          type: 'div'
        }]);
        switches[id] = new ToggleSwitch(elements[id], id, false, option.description, false, false, option.tooltip, gSettings[id]);
      }
    });
    options.forEach(option => {
      let enabled = gSettings[option.id];
      if (switches[option.id]) {
        if (option.dependencies) {
          option.dependencies.forEach(dependency => {
            if (elements[dependency]) {
              switches[option.id].dependencies.push(elements[dependency]);
              if (!enabled) {
                elements[dependency].classList.add('esgst-hidden');
              }
            }
          });
        }
        if (option.exclusions) {
          option.exclusions.forEach(exclusion => {
            if (elements[exclusion]) {
              switches[option.id].exclusions.push(elements[exclusion]);
              if (enabled) {
                elements[exclusion].classList.add('esgst-hidden');
              }
            }
          });
        }
      }
    });
    return context;
  }

  createResults(context, element, results) {
    for (const result of results) {
      const key = result.Key;
      element[key] = this.createElements(context, 'beforeEnd', [{
        attributes: {
          class: 'esgst-hidden'
        },
        type: 'div',
        children: [{
          attributes: {
            class: result.Icon
          },
          type: 'i'
        }, {
          attributes: {
            class: 'esgst-bold'
          },
          type: 'span',
          children: [{
            text: `${result.Description} (`,
            type: 'node'
          }, {
            text: '0',
            type: 'span'
          }, {
            text: `):`,
            type: 'node'
          }]
        }, {
          attributes: {
            class: 'esgst-popup-actions'
          },
          type: 'span'
        }]
      }]);
      element[`${key}Count`] = element[key].firstElementChild.nextElementSibling.firstElementChild;
      element[`${key}Users`] = element[key].lastElementChild;
    }
  }

  goToComment(hash, element, noPermalink) {
    if (!hash) {
      hash = window.location.hash;
    }
    let id = hash.replace(/#/, '');
    if ((!id && !element) || (window.location.pathname.match(/^\/account/) && !this.esgst.parameters.esgst)) return;
    if (id && !element) {
      element = document.getElementById(id);
    }
    if (!element) return;
    window.scrollTo(0, element.offsetTop);
    window.scrollBy(0, -this.esgst.commentsTop);
    if (noPermalink) return;
    let permalink = document.querySelector(`.is_permalink, .author_permalink`);
    if (permalink) {
      permalink.remove();
    }
    element = element.querySelector(`.comment__username, .author_avatar`);
    if (!element) return;
    this.createElements(element, this.esgst.sg ? 'beforeBegin' : 'afterEnd', [{
      attributes: {
        class: 'fa fa-share is_permalink author_permalink'
      },
      type: 'i'
    }]);
  }

  sortContent(array, option) {
    let after, before, divisor, divisors, i, key, n, name;
    name = option.split(/_/);
    key = name[0];
    if (name[1] === 'asc') {
      before = -1;
      after = 1;
    } else {
      before = 1;
      after = -1;
    }
    array.sort((a, b) => {
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return (a[key].toLowerCase().localeCompare(b[key].toLowerCase()) * after);
      } else {
        const aValue = a[key] || 0;
        const bValue = b[key] || 0;
        if (aValue < bValue) {
          return before;
        } else if (aValue > bValue) {
          return after;
        } else {
          return 0;
        }
      }
    });
    let context = null;
    if (array[0].outerWrap) {
      const popup = array[0].outerWrap.closest(`.esgst-popup, [data-esgst-popup]`);
      if (popup) {
        context = popup.getElementsByClassName('esgst-gv-view')[0] || array[0].outerWrap.parentElement.parentElement;
      }
    }
    for (i = 0, n = array.length; i < n; ++i) {
      if (!array[i].outerWrap.parentElement) continue;

      if (context) {
        context.appendChild(array[i].outerWrap.parentElement);
      } else {
        array[i].outerWrap.parentElement.appendChild(array[i].outerWrap);
      }
    }
    for (i = array.length - 1; i > -1; i--) {
      if (array[i].isPinned) {
        array[i].outerWrap.parentElement.insertBefore(array[i].outerWrap, array[i].outerWrap.parentElement.firstElementChild);
      }
    }
    if (key === 'sortIndex') {
      divisors = document.getElementsByClassName('esgst-es-page-divisor');
      for (i = divisors.length - 1; i > -1; --i) {
        divisor = divisors[i];
        divisor.classList.remove('esgst-hidden');
        divisor.parentElement.insertBefore(divisor, document.getElementsByClassName(`esgst-es-page-${i + 2}`)[0]);
      }
    } else {
      divisors = document.querySelectorAll(`.esgst-es-page-divisor:not(.esgst-hidden)`);
      for (i = divisors.length - 1; i > -1; --i) {
        divisors[i].classList.add('esgst-hidden');
      }
    }
  }

  rot(string, n) {
    return string.replace(/[a-zA-Z]/g, char => {
      return String.fromCharCode(((char <= 'Z') ? 90 : 122) >= ((char = char.charCodeAt(0) + n)) ? char : (char - 26));
    });
  }

  async buildGiveaway(context, url, errorMessage, blacklist) {
    let ended, avatar, code, column, columns, comments, counts, endTime, endTimeColumn, entered, entries, giveaway,
      heading, headingName, i, id, icons, image, n, removeEntryButton, started, startTimeColumn, thinHeadings;
    giveaway = context.getElementsByClassName('featured__outer-wrap--giveaway')[0];
    if (giveaway) {
      let match = url.match(/giveaway\/(.+?)\//),
        sgTools = false;
      if (match) {
        code = match[1];
      } else {
        match = url.match(/giveaways\/(.+)/);
        if (match) {
          code = match[1];
          sgTools = true;
        }
      }
      id = giveaway.getAttribute('data-game-id');
      heading = giveaway.getElementsByClassName('featured__heading')[0];
      icons = heading.getElementsByTagName('a');
      for (i = 0, n = icons.length; i < n; ++i) {
        icons[i].classList.add('giveaway__icon');
      }
      headingName = heading.firstElementChild;
      this.createElements(headingName, 'outer', [{
        attributes: {
          class: 'giveaway__heading__name',
          href: url
        },
        type: 'a',
        children: [...(Array.from(headingName.childNodes).map(x => {
          return {
            context: x
          };
        }))]
      }]);
      thinHeadings = heading.getElementsByClassName('featured__heading__small');
      for (i = 0, n = thinHeadings.length; i < n; ++i) {
        this.createElements(thinHeadings[0], 'outer', [{
          attributes: {
            class: 'giveaway__heading__thin'
          },
          type: 'span',
          children: [...(Array.from(thinHeadings[0].childNodes).map(x => {
            return {
              context: x
            };
          }))]
        }]);
      }
      columns = heading.nextElementSibling;
      endTimeColumn = columns.firstElementChild;
      endTimeColumn.classList.remove('featured__column');
      if (sgTools) {
        let info = await this.esgst.modules.games.games_getInfo(giveaway);
        if (info) {
          this.createElements(heading, 'beforeEnd', [{
            attributes: {
              class: 'giveaway__icon',
              href: `https://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}/`,
              rel: 'nofollow',
              target: '_blank'
            },
            type: 'a',
            children: [{
              attributes: {
                class: 'fa fa-steam'
              },
              type: 'i'
            }]
          }, {
            attributes: {
              class: 'giveaway__icon',
              href: `/giveaways/search?${info.type.slice(0, -1)}=${info.id}`
            },
            type: 'a',
            children: [{
              attributes: {
                class: 'fa fa-search'
              },
              type: 'i'
            }]
          }]);
        }
        let date = new Date(`${endTimeColumn.lastElementChild.textContent}Z`).getTime();
        ended = Date.now() > date;
        const items = [];
        if (ended) {
          items.push({
            text: 'Ended',
            type: 'node'
          });
        }
        items.push({
          attributes: {
            ['data-timestamp']: date / 1e3
          },
          text: ended ? this.getTimeSince(date) : this.getTimeSince(date, true),
          type: 'span'
        }, {
            text: ended ? ' ago ' : ' remaining ',
            type: 'node'
          });
        this.createElements(endTimeColumn.lastElementChild, 'outer', items);
      }
      endTime = parseInt(endTimeColumn.lastElementChild.getAttribute('data-timestamp')) * 1000;
      startTimeColumn = endTimeColumn.nextElementSibling;
      startTimeColumn.classList.remove('featured__column', 'featured__column--width-fill');
      startTimeColumn.classList.add('giveaway__column--width-fill');
      if (sgTools) {
        let date = new Date(`${startTimeColumn.firstElementChild.textContent}Z`).getTime();
        const items = [];
        if (ended) {
          items.push({
            text: 'Ended ',
            type: 'node'
          });
        }
        items.push({
          attributes: {
            ['data-timestamp']: date / 1e3
          },
          text: this.getTimeSince(date),
          type: 'span'
        }, {
            text: ' ago ',
            type: 'node'
          });
        this.createElements(startTimeColumn.firstElementChild, 'outer', items);
      }
      avatar = columns.lastElementChild;
      if (sgTools) {
        avatar.className = 'giveaway_image_avatar';
      }
      avatar.remove();
      startTimeColumn.querySelector(`[style]`).removeAttribute('style');
      column = startTimeColumn.nextElementSibling;
      while (column) {
        column.classList.remove('featured__column');
        column.className = column.className.replace(/featured/g, 'giveaway');
        column = column.nextElementSibling;
      }
      removeEntryButton = context.getElementsByClassName('sidebar__entry-delete')[0];
      if (removeEntryButton && !removeEntryButton.classList.contains('is-hidden')) {
        entered = 'is-faded';
      } else {
        entered = '';
      }
      counts = context.getElementsByClassName('sidebar__navigation__item__count');
      if (counts.length > 1) {
        entries = counts[1].textContent;
        comments = counts[0].textContent;
        started = true;
      } else if (counts.length > 0) {
        entries = 0;
        comments = counts[0].textContent;
        started = false;
      } else {
        entries = 0;
        comments = 0;
      }
      image = giveaway.getElementsByClassName('global__image-outer-wrap--game-large')[0].firstElementChild.getAttribute('src');
      const attributes = {
        class: 'giveaway__row-outer-wrap',
        ['data-game-id']: id
      };
      if (errorMessage) {
        attributes['data-error'] = errorMessage;
      }
      if (blacklist) {
        attributes['data-blacklist'] = true;
      }
      const errorButton = context.getElementsByClassName('sidebar__error is-disabled')[0];
      if (!errorButton || errorButton.textContent.trim() === 'Not Enough Points') {
        attributes['data-enterable'] = true;
      }
      if (context.getElementsByClassName('sidebar__entry-insert')[0]) {
        attributes['data-currently-enterable'] = true;
      }
      heading.className = 'giveaway__heading';
      columns.className = 'giveaway__columns';
      return {
        code,
        html: [{
          type: 'div',
          children: [{
            attributes,
            type: 'div',
            children: [{
              attributes: {
                class: `giveaway__row-inner-wrap ${entered}`
              },
              type: 'div',
              children: [{
                attributes: {
                  class: 'giveaway__summary'
                },
                children: [{
                  context: heading
                }, {
                  context: columns
                }, {
                  attributes: {
                    class: 'giveaway__links'
                  },
                  type: 'div',
                  children: [{
                    attributes: {
                      href: `${url}/entries`
                    },
                    type: 'a',
                    children: [{
                      attributes: {
                        class: 'fa fa-tag'
                      },
                      type: 'i'
                    }, {
                      text: `${entries} entries`,
                      type: 'span'
                    }]
                  }, {
                    attributes: {
                      href: `${url}/comment`
                    },
                    type: 'a',
                    children: [{
                      attributes: {
                        class: 'fa fa-comment'
                      },
                      type: 'i'
                    }, {
                      text: `${comments} comments`,
                      type: 'span'
                    }]
                  }]
                }]
              }, {
                context: avatar,
              }, {
                attributes: {
                  class: 'giveaway_image_thumbnail',
                  href: url,
                  style: `background-image: url(${image})`
                },
                type: 'a'
              }]
            }]
          }]
        }],
        points: parseInt(heading.textContent.match(/\((\d+)P\)/)[1]),
        started,
        timestamp: endTime
      };
    } else {
      return null;
    }
  }

  getCopyIcon(value) {
    return ['i', { class: 'esgst-clickable fa fa-copy', title: 'Copy', onclick: event => this.copyValue(event.currentTarget, value) }];
  }

  copyValue(icon, value) {
    let textArea = this.createElements(document.body, 'beforeEnd', [{
      type: 'textarea'
    }]);
    textArea.value = value;
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    if (icon) {
      icon.classList.add('esgst-green');
      window.setTimeout(() => icon.classList.remove('esgst-green'), 2000);
    }
  }

  getParameters(source) {
    let parameters = {};
    (source || window.location.search).replace(/^\?/, '').split(/&/).forEach(item => {
      const items = item.split(/=/);
      parameters[items[0]] = items[1];
    });
    return parameters;
  }

  setMissingDiscussion(context) {
    if (context) {
      this.createElements(context.outerWrap, 'inner', [{
        attributes: {
          class: 'table__row-outer-wrap',
          style: `padding: 15px 0;`
        },
        type: 'div',
        children: [{
          attributes: {
            class: 'table__row-inner-wrap'
          },
          type: 'div',
          children: [{
            type: 'div',
            children: [{
              attributes: {
                class: 'table_image_avatar',
                href: `/user/${context.author}`,
                style: `background-image:${context.avatar.style.backgroundImage.replace(/"/g, '\'')};`
              },
              type: 'a'
            }]
          }, {
            attributes: {
              class: 'table__column--width-fill'
            },
            type: 'div',
            children: [{
              attributes: {
                style: `margin-bottom: 2px;`
              },
              type: 'h3',
              children: [{
                attributes: {
                  class: 'homepage_table_column_heading',
                  href: context.url
                },
                text: context.title,
                type: 'a'
              }]
            }, {
              type: 'p',
              children: context.lastPostTime ? [{
                attributes: {
                  class: 'table__column__secondary-link',
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: 'a'
              }, {
                text: ' - Last post ',
                type: 'node'
              }, {
                attributes: {
                  ['data-timestamp']: context.lastPostTimestamp
                },
                text: context.lastPostTime,
                type: 'span'
              }, {
                text: ' ago by ',
                type: 'node'
              }, {
                attributes: {
                  class: 'table__column__secondary-link',
                  href: `/user/${context.lastPostAuthor}`
                },
                text: context.lastPostAuthor,
                type: 'a'
              }, {
                attributes: {
                  class: 'icon-green table__last-comment-icon',
                  href: `/go/comment/${context.lastPostCode}`
                },
                type: 'a',
                children: [{
                  attributes: {
                    class: 'fa fa-chevron-circle-right'
                  },
                  type: 'i'
                }]
              }] : [{
                attributes: {
                  class: 'table__column__secondary-link',
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: 'a'
              }, {
                text: ' - Created ',
                type: 'node'
              }, {
                attributes: {
                  ['data-timestamp']: context.createdTimestamp
                },
                text: context.createdTime,
                type: 'span'
              }, {
                text: ' ago by ',
                type: 'node'
              }, {
                attributes: {
                  class: 'table__column__secondary-link',
                  href: `/user/${context.author}`
                },
                text: context.author,
                type: 'a'
              }]
            }]
          }]
        }]
      }]);
      context.outerWrap = context.outerWrap.firstElementChild;
    }
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  }

  triggerSetOnEnter(set, event) {
    if (event.key === 'Enter') {
      set.trigger();
      return true;
    }
  }

  formatTags(fullMatch, match1, offset, string) {
    return (((offset === 0) || (offset === (string.length - fullMatch.length))) ? '' : `, `);
  }

  animateScroll(y, callback) {
    // From https://stackoverflow.com/a/26808520/8115112

    let currentTime, time;
    currentTime = 0;
    if (y > 0) {
      y -= this.esgst.commentsTop;
    }
    time = Math.max(0.1, Math.min(Math.abs(window.scrollY - y) / 2000, 0.8));

    function tick() {
      let p;
      currentTime += 1 / 60;
      p = currentTime / time;
      if (p < 1) {
        window.requestAnimationFrame(tick);
        window.scrollTo(0, window.scrollY + ((y - window.scrollY) * ((p /= 0.5) < 1 ? 0.5 * Math.pow(p, 5) : 0.5 * (Math.pow((p - 2), 5) + 2))));
      } else {
        window.scrollTo(0, y);
        if (callback) {
          callback();
        }
      }
    }

    tick();
  }

  reverseComments(context) {
    let i, n;
    let frag = document.createDocumentFragment();
    for (i = 0, n = context.children.length; i < n; ++i) {
      frag.appendChild(context.lastElementChild);
    }
    context.appendChild(frag);
  }

  createAlert(message) {
    let popup;
    popup = new Popup({ addScrollable: true, icon: 'fa-exclamation', isTemp: true, title: message });
    popup.open();
  }

  createConfirmation(message, onYes, onNo, event) {
    logger.info(message);
    let callback, popup;
    callback = onNo;
    popup = new Popup({ addScrollable: true, icon: 'fa-question', isTemp: true, title: message });
    popup.description.appendChild(new ButtonSet({
      color1: 'green', color2: '', icon1: 'fa-check', icon2: '', title1: 'Yes', title2: '', callback1: () => {
        callback = onYes;
        popup.close();
      }
    }).set);
    popup.description.appendChild(new ButtonSet({
      color1: 'red', color2: '', icon1: 'fa-times', icon2: '', title1: 'No', title2: '', callback1: () => {
        callback = onNo;
        popup.close();
      }
    }).set);
    popup.onClose = () => {
      if (callback) {
        callback(event);
      }
    };
    popup.open();
  }

  createFadeMessage(context, message) {
    context.textContent = message;
    window.setTimeout(() => {
      context.textContent = '';
    }, 10000);
  }

  openSmallWindow(url) {
    window.open(url, 'esgst', `height=600,left=${(window.screen.width - 600) / 2},top=${(window.screen.height - 600) / 2},width=600`);
  }

  convertBytes(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else {
      bytes /= 1024;
      if (bytes < 1024) {
        return `${Math.round(bytes * 100) / 100} KB`;
      } else {
        return `${Math.round(bytes / 1024 * 100) / 100} MB`;
      }
    }
  }

  getThemeCss(theme) {
    let separators = theme.match(/@-moz-document(.+?){/g);
    if (!separators) {
      return theme;
    }
    let css = [];
    separators.forEach(separator => {
      let check = false;
      for (const domain of (separator.match(/domain\(.+?\)/g) || [])) {
        if (window.location.hostname.match(domain.match(/\("(.+?)"\)/)[1])) {
          check = true;
          break;
        }
      }
      for (const url of (separator.match(/url(-prefix)?\(.+?\)/g) || [])) {
        if (shared.esgst.locationHref.match(url.match(/\("(.+?)"\)/)[1])) {
          check = true;
          break;
        }
      }
      if (!check) {
        return;
      }
      let index = theme.indexOf(separator) + separator.length,
        open = 1;
      do {
        let character = theme[index];
        if (character === '{') {
          open++;
        } else if (character === '}') {
          open--;
        }
        css.push(character);
        index++;
      } while (open > 0);
      css.pop();
    });
    return css.join('');
  }

  createFormNotification(context, position, options) {
    return this.createElements_v2(context, position, [
      ['div', { class: `notification notification--${options.loading ? 'default' : (options.success ? 'success' : 'warning')}` }, [
        ['i', { class: `fa ${options.loading ? 'fa-circle-o-notch fa-spin' : (options.success ? 'fa-check-circle' : 'fa-times-circle')}` }],
        ' ',
        ...(options.loading ? [
          'Syncing ',
          ['span', options.name]
        ] : (
            options.success ? [
              'Synced ',
              ['span', options.name],
              ' ',
              ['span', { 'data-timestamp': options.date / 1e3 }, dateFns_formatDistanceStrict(options.date, new Date())],
              ' ago.'
            ] : [
                'Never synced ',
                ['span', options.name]
              ]
          )
        )
      ]]
    ]);
  }

  createFormRows(context, position, options) {
    const items = [];
    let i = 1;
    for (const item of options.items) {
      if (!item.check) {
        continue;
      }
      items.push(
        ['div', { class: 'form__row' }, [
          ['div', { class: 'form__heading' }, [
            ['div', { class: 'form__heading__number' }, i++],
            ['div', { class: 'form__heading__text' }, item.name]
          ]],
          ['div', { class: 'form__row__indent', id: item.id || '' }, item.content]
        ]]
      );
    }
    return this.createElements_v2(context, position, [
      ['div', { class: 'form__rows' }, items]
    ]);
  }

  createSidebarNavigation(context, position, options) {
    const items = [];
    for (const item of options.items) {
      items.push(
        ['li', { class: 'sidebar__navigation__item', id: item.id || '' }, [
          [item.url ? 'a' : 'div', Object.assign({ class: 'sidebar__navigation__item__link' }, item.url ? { href: item.url } : null), [
            ['div', { class: 'sidebar__navigation__item__name' }, item.name],
            ['div', { class: 'sidebar__navigation__item__underline' }],
            isSet(item.count)
              ? ['div', { class: 'sidebar__navigation__item__count' }, item.count]
              : null
          ]]
        ]]
      );
    }
    return this.createElements_v2(context, position, [
      ['h3', { class: 'sidebar__heading' }, options.name],
      ['ul', { class: 'sidebar__navigation' }, items]
    ]);
  }

  createElements_v2(context, position, items) {
    try {
      if (Array.isArray(context)) {
        items = context;
        context = null;
      }
      if (position && position === 'inner') {
        context.innerHTML = '';
      }
      if (!items || !items.length) {
        return;
      }
      const fragment = document.createDocumentFragment();
      let element = null;
      this.buildElements_v2(fragment, items);
      if (!context) {
        return fragment;
      }
      switch (position) {
        case 'beforeBegin':
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          break;
        case 'afterBegin':
          context.insertBefore(fragment, context.firstElementChild);
          element = context.firstElementChild;
          break;
        case 'beforeEnd':
          context.appendChild(fragment);
          element = context.lastElementChild;
          break;
        case 'afterEnd':
          context.parentElement.insertBefore(fragment, context.nextElementSibling);
          element = context.nextElementSibling;
          break;
        case 'inner':
          context.appendChild(fragment);
          element = context.firstElementChild;
          break;
        case 'outer':
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          context.remove();
          break;
      }
      return element;
    } catch (error) {
      logger.error(error.stack);
    }
  }

  buildElements_v2(context, items) {
    for (const item of items) {
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        const node = document.createTextNode(item);
        context.appendChild(node);
        continue;
      } else if (!Array.isArray(item)) {
        context.appendChild(item);
        continue;
      }
      const element = document.createElement(item[0]);
      if (isSet(item[1])) {
        if (Array.isArray(item[1])) {
          this.buildElements_v2(element, item[1]);
        } else if (typeof item[1] === 'object') {
          for (const key in item[1]) {
            if (item[1].hasOwnProperty(key)) {
              if (key === 'ref') {
                item[1].ref(element);
              } else if (key === 'extend') {
                item[1].extend = item[1].extend.bind(null, element);
              } else if (key.match(/^on/)) {
                element.addEventListener(key.replace(/^on/, ''), item[1][key]);
              } else if (key === 'dataset') {
                for (const datasetKey in item[1][key]) {
                  element.dataset[datasetKey] = item[1][key][datasetKey];
                }
              } else if (key === 'style' && typeof item[1][key] === 'object') {
                for (const styleKey in item[1][key]) {
                  element.dataset[styleKey] = item[1][key][styleKey];
                }
              } else {
                element.setAttribute(key, item[1][key]);
              }
            }
          }
        } else {
          element.textContent = item[1];
        }
      }
      if (isSet(item[2])) {
        if (Array.isArray(item[2])) {
          this.buildElements_v2(element, item[2]);
        } else {
          element.textContent = item[2];
        }
      }
      context.appendChild(element);
    }
  }

  createElements(context, position, items) {
    try {
      if (position === 'inner') {
        context.innerHTML = '';
      }
      if (!items || !items.length) {
        return;
      }
      const fragment = document.createDocumentFragment();
      let element = null;
      this.buildElements(fragment, items);
      switch (position) {
        case 'beforeBegin':
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          break;
        case 'afterBegin':
          context.insertBefore(fragment, context.firstElementChild);
          element = context.firstElementChild;
          break;
        case 'beforeEnd':
          context.appendChild(fragment);
          element = context.lastElementChild;
          break;
        case 'afterEnd':
          context.parentElement.insertBefore(fragment, context.nextElementSibling);
          element = context.nextElementSibling;
          break;
        case 'inner':
          context.appendChild(fragment);
          element = context.firstElementChild;
          break;
        case 'outer':
          context.parentElement.insertBefore(fragment, context);
          element = context.previousElementSibling;
          context.remove();
          break;
      }
      return element;
    } catch (error) {
      logger.error(error.stack);
    }
  }

  buildElements(context, items) {
    for (const item of items) {
      if (!item) {
        continue;
      }
      if (isSet(item.context)) {
        context.appendChild(item.context);
        continue;
      }
      if (item.type === 'node') {
        const node = document.createTextNode(item.text);
        context.appendChild(node);
        continue;
      }
      const element = document.createElement(item.type);
      if (isSet(item.attributes)) {
        for (const key in item.attributes) {
          if (item.attributes.hasOwnProperty(key)) {
            element.setAttribute(key, item.attributes[key]);
          }
        }
      }
      if (isSet(item.text)) {
        element.textContent = item.text;
      }
      if (isSet(item.children)) {
        this.buildElements(element, item.children);
      }
      if (isSet(item.events)) {
        for (const key in item.events) {
          if (item.events.hasOwnProperty(key)) {
            element.addEventListener(key, item.events[key]);
          }
        }
      }
      if (item.type === 'i') {
        const node = document.createTextNode(' ');
        context.appendChild(node);
      }
      context.appendChild(element);
      if (item.type === 'i') {
        const node = document.createTextNode(' ');
        context.appendChild(node);
      }
    }
  }

  /**
   * @param appId
   * @param steamId
   */// @returns {PlayerAchievementsSteamApiResponse}
   //*/
  async getPlayerAchievements(appId, steamId) {
    const text = (await this.request({
      method: 'GET',
      url: `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${gSettings.steamApiKey}&steamid=${steamId}`
    })).responseText;
    return JSON.parse(text);
  }

  /**
   * @param steamIds
   */// @returns {SuspensionsApiResponse}
   //*/
  async getSuspensions(steamIds) {
    return JSON.parse((await this.request({
      method: 'GET',
      url: `https://script.google.com/macros/s/AKfycbwdKNormCJs-hEKV0GVwawgWj1a26oVtPylgmxOOvNk1Gf17A/exec?steamIds=${steamIds.join(`,`)}`
    })).responseText);
  }

  /**
   */// @param SMFeatures
   //*/
  updateTheme(id) {
    document.querySelector(`#${id}`).dispatchEvent(new Event('click'));
  }

  async submitComment(obj) {
    obj.status.innerHTML = '';

    if (!obj.commentUrl) {
      const result = await this.saveComment(
        obj.context,
        obj.tradeCode,
        obj.parentId.value,
        obj.description.value,
        obj.url,
        obj.status,
        !obj.callback
      );
      if (obj.callback) {
        obj.callback(result.id, result.response, result.status);
      }
      return;
    }

    const response = await this.request({
      method: 'GET',
      url: obj.commentUrl
    }),
      responseHtml = utils.parseHtml(response.responseText),
      comment = responseHtml.getElementById(obj.commentUrl.match(/\/comment\/(.+)/)[1]);
    obj.parentId = this.esgst.sg
      ? comment.closest('.comment').getAttribute('data-comment-id')
      : comment.getAttribute('data-id');
    obj.tradeCode = this.esgst.sg
      ? ''
      : response.finalUrl.match(/\/trade\/(.+?)\//)[1];
    obj.url = this.esgst.sg
      ? response.finalUrl.match(/(.+?)(#.+?)?$/)[1]
      : '/ajax.php';

    if (obj.checked || !gSettings.rfi_c) {
      const result = await this.saveComment(
        obj.context,
        obj.tradeCode,
        obj.parentId,
        obj.description.value,
        obj.url,
        obj.status,
        !obj.callback
      );
      if (obj.callback) {
        obj.callback(result.id, result.response, response.status);
      }
      return;
    }

    const comments = this.esgst.sg
      ? comment.closest('.comment').getElementsByClassName('comment__children')[0]
      : comment.getElementsByClassName('comment_children')[0];
    for (let i = comments.children.length - 1; i > -1; i--) {
      const comment = comments.children[i],
        id = comment.querySelector(`[href*="/go/comment/"]`)
          .getAttribute('href')
          .match(/\/go\/comment\/(.+)/)[1];
      if (obj.context.querySelector(`[href*="/go/comment/${id}"`)) {
        comment.remove();
      }
    }
    if (comments.children.length) {
      obj.context.appendChild(comments);
      await this.endless_load(comments);
      for (let i = comments.children.length - 1; i > -1; i--) {
        obj.context.appendChild(comments.children[i]);
      }
      comments.remove();
      obj.set.changeButton(1).setTitle('Confirm');
      this.createElements(obj.status, 'inner', [{
        attributes: {
          class: 'esgst-bold esgst-warning'
        },
        type: 'span',
        children: [{
          text: 'Somebody beat you to it!',
          type: 'node'
        }, {
          type: 'br'
        }, {
          text: 'There are other replies to this comment.',
          type: 'node'
        }, {
          type: 'br'
        }, {
          text: 'You can review them below before confirming your reply.',
          type: 'node'
        }]
      }]);
      obj.checked = true;
    } else {
      const result = await this.saveComment(
        obj.context,
        obj.tradeCode,
        obj.parentId,
        obj.description.value,
        obj.url,
        obj.status,
        !obj.callback
      );
      if (obj.callback) {
        obj.callback(result.id, result.response, result.status);
      }
    }
  }

  addReplyButton(context, commentUrl, callback) {
    const obj = {
      callback,
      checked: false,
      commentUrl,
      context: context.parentElement,
      description: context.querySelector(`[name="description"]`),
      parentId: context.querySelector(`[name="parent_id"]`),
      tradeCode: (context.querySelector(`[name="trade_code"]`) || { value: '' }).value,
      url: this.esgst.sg ? shared.esgst.locationHref.match(/(.+?)(#.+?)?$/)[1] : '/ajax.php'
    };
    const container = context.getElementsByClassName(this.esgst.sg
      ? 'align-button-container'
      : 'btn_actions'
    )[0];
    container.firstElementChild.remove();
    obj.button = this.createElements(container, 'afterBegin', [{
      attributes: {
        class: 'esgst-ded-button'
      },
      type: 'div'
    }]);
    obj.status = this.createElements(container, 'beforeEnd', [{
      attributes: {
        class: 'comment__actions action_list esgst-ded-status'
      },
      type: 'div'
    }]);
    obj.set = new ButtonSet({
      color1: 'grey',
      color2: 'grey',
      icon1: 'fa-send',
      icon2: 'fa-circle-o-notch fa-spin',
      title1: 'Submit',
      title2: 'Saving...',
      callback1: this.submitComment.bind(this, obj)
    });
    obj.button.appendChild(obj.set.set);
  }

  async hideGames(obj, unhide) {
    const isUsingRevadike = await permissions.contains([['revadike']]);
    let hasCacheChanged = false;
    let api = JSON.parse(this.getValue('sgdbCache', `{ "lastUpdate": 0 }`));
    if (!dateFns_isSameWeek(Date.now(), api.lastUpdate)) {
      if (isUsingRevadike) {
        obj.update && obj.update('Updating API cache...');

        api = { cache: JSON.parse((await this.request({ method: 'GET', url: `https://revadike.ga/sgdb.json` })).responseText), lastUpdate: Date.now() };
      } else {
        api = { cache: { appids: {}, subids: {} }, lastUpdate: Date.now() };
      }
      hasCacheChanged = true;
    }
    
    obj.update && obj.update('Retrieving ids from cache...');

    const games = { apps: {}, subs: {} };
    const ids = [];
    const appsToFetch = [];
    const appsNotFound = [];
    const subsToFetch = [];
    const subsNotFound = [];
    for (const appId of obj.appIds) {
      const savedGame = this.esgst.games.apps[appId];
      if (savedGame && ((unhide && !savedGame.hidden) || (!unhide && savedGame.hidden))) {
        continue;
      }
      const id = (savedGame && savedGame.sgId) || (api.cache && api.cache.appids && api.cache.appids[appId]);
      if (id) {
        ids.push(id);
        games.apps[appId] = { hidden: unhide ? null : true, sgId: id };
      } else if (id === 0) {
        appsNotFound.push(appId);
      } else {
        appsToFetch.push(appId);
      }
    }
    for (const subId of obj.subIds) {
      const savedGame = this.esgst.games.subs[subId];
      if (savedGame && ((unhide && !savedGame.hidden) || (!unhide && savedGame.hidden))) {
        continue;
      }
      const id = (savedGame && savedGame.sgId) || (api.cache && api.cache.subids && api.cache.subids[subId]);
      if (id) {
        ids.push(id);
        games.subs[subId] = { hidden: unhide ? null : true, sgId: id };
      } else if (id === 0) {
        subsNotFound.push(subId);
      } else {
        subsToFetch.push(subId);
      }
    }
    if (!isUsingRevadike) {
      for (let i = appsToFetch.length - 1; i > -1 && !obj.canceled; i--) {
        obj.update && obj.update(`Retrieving app ids from SteamGifts (${i} left)...`);

        const appId = appsToFetch[i];
        const id = await this.getGameSgId(appId, 'apps');
        if (id) {
          ids.push(id);
          games.apps[appId] = { hidden: unhide ? null : true, sgId: id };
        } else {
          api.cache.appids[appId] = 0;
          appsNotFound.push(id);
        }
      }
      for (let i = subsToFetch.length - 1; i > -1 && !obj.canceled; i--) {
        obj.update && obj.update(`Retrieving sub ids from SteamGifts (${i} left)...`);

        const subId = subsToFetch[i];
        const id = await this.getGameSgId(subId, 'subs');
        if (id) {
          ids.push(id);
          games.subs[subId] = { hidden: unhide ? null : true, sgId: id };
        } else {
          api.cache.subids[subId] = 0;
          subsNotFound.push(id);
        }
      }
    }

    if (obj.canceled) {
      return;
    }

    if (hasCacheChanged) {
      await this.setValue('sgdbCache', JSON.stringify(api));
    }

    const title = unhide ? 'Unhiding' : 'Hiding';

    obj.update && obj.update(`${title} games...`);

    const total = ids.length;
    for (const [index, id] of ids.entries()) {
      if (obj.canceled) {
        return;
      }

      obj.update && obj.update(`${title} games (${index} of ${total})...`);

      await this.request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=${unhide ? 'remove_filter' : 'hide_giveaways_by_game_id'}&game_id=${id}`,
        method: 'POST',
        url: '/ajax.php'
      });
    }

    if (obj.canceled) {
      return;
    }

    obj.update && obj.update('Saving...');
    await this.lockAndSaveGames(games);

    obj.update && obj.update('');

    return { apps: appsNotFound, subs: subsNotFound };
  }

  async getGameSgId(id, type) {
    const elements = parseHtml(JSON.parse((await this.request({
      data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent(id)}`,
      method: 'POST',
      url: '/ajax.php'
    })).responseText).html).querySelectorAll('.table__row-outer-wrap');
    for (const element of elements) {
      const info = await this.esgst.modules.games.games_getInfo(element);
      if (info && info.type === type && info.id === id) {
        return element.getAttribute('data-autocomplete-id');
      }
    }
  }

  setDatePickerDate(target, date) {
    const script = document.createElement('script');
    script.textContent = `
      function setDatePickerDate() {
        const input = document.querySelector('input[name="${target}"]');
        const actualInput = input.previousElementSibling;

        const datepicker = actualInput && actualInput.classList.contains('hasDatepicker') ? actualInput : input;

        $(datepicker).datetimepicker("setDate", new Date(${date.getTime()}));
      }

      setDatePickerDate();
    `;
    document.body.appendChild(script);
    script.remove();
  }

  testPath(name, namespace, path) {    
    const pathObj = this.esgst.paths[namespace].filter(x => x.name === name)[0];
    if (pathObj && this.getPath(path).match(pathObj.pattern)) {
      return true;
    }
    return false;
  }

  getPath(url) {
    return url.replace(/^https?:\/\/.+?\//, '/');
  }

  isCurrentPath(name) {
    return shared.esgst.currentPaths.indexOf(name) > -1;
  }

  getBrowserInfo() {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'getBrowserInfo'
    }).then(result => resolve(JSON.parse(result))));
  }

  getTds() {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'get-tds',
    }).then(data => resolve(JSON.parse(data))));
  }

  notifyTds(data) {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'notify-tds',
      data: JSON.stringify(data)
    }).then(() => resolve()));
  }

  do_lock(lock) {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'do_lock',
      lock: JSON.stringify(lock)
    }).then(result => resolve(JSON.parse(result))));
  }

  updateLock(lock) {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'update_lock',
      lock: JSON.stringify(lock)
    }).then(() => resolve()));
  }

  do_unlock(lock) {
    return new Promise(resolve => browser.runtime.sendMessage({
      action: 'do_unlock',
      lock: JSON.stringify(lock)
    }).then(() => resolve()));
  }

  setValues(values) {
    let key;
    return new Promise(resolve =>
      browser.storage.local.set(values).then(() => {
        for (key in values) {
          if (values.hasOwnProperty(key)) {
            this.esgst.storage[key] = values[key];
            try {
              this.esgst[key] = JSON.parse(values[key]);
            } catch (e) {
              this.esgst[key] = values[key];
            }
          }
        }
        resolve();
      }));
  }

  setValue(key, value) {
    return this.setValues({[key]: value});
  }

  getValue(key, value) {
    return utils.isSet(this.esgst.storage[key]) ? this.esgst.storage[key] : value;
  }

  getValues(values) {
    const output = {};
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        output[key] = utils.isSet(this.esgst.storage[key]) ? this.esgst.storage[key] : values[key];
      }
    }
    return output;
  }

  delValues(keys) {
    return new Promise(resolve =>
      browser.storage.local.remove(keys).then(() => {
        keys.forEach(key => delete this.esgst.storage[key]);
        resolve();
      })
    );
  }

  delValue(key) {
    return this.delValues([key]);
  }

  continueRequest(details) {
    return new Promise(async (resolve, reject) => {
      let isLocal = details.url.match(/^\//) || details.url.match(new RegExp(window.location.hostname));
      details.url = details.url.replace(/^\//, `https://${window.location.hostname}/`).replace(/^https?:/, shared.esgst.locationHref.match(/^http:/) ? 'http:' : 'https:');
      if (isLocal) {
        const requestOptions =  {
          body: details.data,
          credentials: /** @type {"omit"|"include"} */ details.anon ? 'omit' : 'include',
          headers: details.headers,
          method: details.method,
          redirect: "follow"
        };
        let response = null;
        let responseText = null;
        try {
          let _fetch;
          let _requestOptions;
          if ((await this.getBrowserInfo()).name === 'Firefox' && utils.isSet(window.wrappedJSObject)) {
            // @ts-ignore
            _fetch = XPCNativeWrapper(window.wrappedJSObject.fetch);
            // @ts-ignore
            window.wrappedJSObject.requestOptions = cloneInto(requestOptions, window);
            // @ts-ignore
            _requestOptions = XPCNativeWrapper(window.wrappedJSObject.requestOptions);
          } else {
            _fetch = window.fetch;
            _requestOptions = requestOptions;
          }
          response = await _fetch(details.url, _requestOptions);
          responseText = await response.text();
          if (!response.ok) {
            throw responseText;
          }
        } catch (error) {
          reject({ error });
          return;
        }
        response = {
          finalUrl: response.url,
          redirected: response.redirected,
          responseText
        };
        resolve(response);
        if (response.finalUrl.match(/www.steamgifts.com/)) {
          this.lookForPopups(response);
        }
      } else {
        browser.runtime.sendMessage({
          action: 'fetch',
          blob: details.blob,
          fileName: details.fileName,
          manipulateCookies: (await this.getBrowserInfo()).name === 'Firefox' && gSettings.manipulateCookies,
          parameters: JSON.stringify({
            body: details.data,
            credentials: details.anon ? 'omit' : 'include',
            headers: details.headers,
            method: details.method,
            redirect: 'follow'
          }),
          url: details.url
        }).then(response => {
          if (typeof response === 'string') {
            response = JSON.parse(response);
          }
          if (utils.isSet(response.error)) {
            reject(response);
            return;
          }
          resolve(response);
          if (response.finalUrl.match(/www.steamgifts.com/)) {
            this.lookForPopups(response);
          }
        });
      }
    });
  }

  async addHeaderMenu() {
    if (!this.esgst.header) {
      return;
    }
    let arrow, button, className, context, dropdown, menu, position;
    if (this.esgst.sg) {
      className = 'nav__left-container';
      position = 'beforeEnd';
    } else {
      className = 'nav_logo';
      position = 'afterEnd';
    }
    context = document.getElementsByClassName(className)[0];
    const manifest = await browser.runtime.getManifest();
    menu = this.createElements_v2(context, position, [
      ['div', { class: 'esgst-header-menu', id: 'esgst', title: this.getFeatureTooltip() }, [
        ['div', { class: 'esgst-header-menu-relative-dropdown esgst-hidden' }, [
          ['div', { class: 'esgst-header-menu-absolute-dropdown' }, [
            ['a', { class: 'esgst-header-menu-row', href: `https://github.com/rafaelgssa/esgst`, target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-github grey' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'GitHub'],
                ['p', { class: 'esgst-header-menu-description' }, 'Visit the GitHub page.']
              ]]
            ]],
            ['a', { class: 'esgst-header-menu-row', href: `https://github.com/rafaelgssa/esgst/issues`, target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-bug red' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Bugs / Suggestions'],
                ['p', { class: 'esgst-header-menu-description' }, 'Report bugs and / or make suggestions.']
              ]]
            ]],
            ['a', { class: 'esgst-header-menu-row', href: `https://github.com/rafaelgssa/esgst/milestones`, target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-map-signs blue' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Milestones'],
                ['p', { class: 'esgst-header-menu-description' }, 'Check out what\'s coming in the next versions.']
              ]]
            ]],
            ['a', { class: 'esgst-header-menu-row', href: `https://www.steamgifts.com/discussion/TDyzv/`, target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-commenting green' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Discussion'],
                ['p', { class: 'esgst-header-menu-description' }, 'Visit the discussion page.']
              ]]
            ]],
            ['a', { class: 'esgst-header-menu-row', href: `http://steamcommunity.com/groups/esgst`, target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-steam green' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Steam Group'],
                ['p', { class: 'esgst-header-menu-description' }, 'Visit / join the Steam group.']
              ]]
            ]],
            ['a', { class: 'esgst-header-menu-row', href: 'https://github.com/rafaelgssa/esgst/releases', target: '_blank' }, [
              ['i', { class: 'fa fa-fw fa-file-text-o yellow' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Changelog'],
                ['p', { class: 'esgst-header-menu-description' }, 'Check out the changelog.']
              ]]
            ]],
            ['div', { class: 'esgst-header-menu-row esgst-version-row' }, [
              ['i', { class: 'fa fa-fw fa-dollar green' }],
              ['div', [
                ['p', { class: 'esgst-header-menu-name' }, 'Donations'],
                ['p', { class: 'esgst-header-menu-description' }, [
                  ['br'],
                  ['div', [
                    ['a', { class: 'table__column__secondary-link', href: `https://www.patreon.com/rafaelgssa`, target: '_blank' }, [
                      ['strong', 'Patreon']
                    ]]
                  ]],
                  ['div', [
                    ['a', { class: 'table__column__secondary-link', href: `https://steamcommunity.com/tradeoffer/new/?partner=214244550&token=LW6Selqp`, target: '_blank' }, [
                      ['strong', 'Steam Trade']
                    ]]
                  ]],
                  ['div', [
                    ['strong', `Paypal: `],
                    'rafael.gssa@gmail.com ',
                    this.getCopyIcon('rafael.gssa@gmail.com')
                  ]],
                  ['div', [
                    ['strong', `Bitcoin: `],
                    '32WY96ch5MSZ3FNubL5f7QZ9K3WWNHNpV9 ',
                    this.getCopyIcon('32WY96ch5MSZ3FNubL5f7QZ9K3WWNHNpV9')
                  ]],
                  ['div', [
                    ['strong', `Monero: `],
                    '42Tw49nUAig3kk1tJh1y1ZP8vrkmY4EH3QW3SRijHxGggtBpDUn2TqJAVBJYBCybGXNninC4gGD9nhe3cttBaZ6u5NuhiLM ',
                    this.getCopyIcon('42Tw49nUAig3kk1tJh1y1ZP8vrkmY4EH3QW3SRijHxGggtBpDUn2TqJAVBJYBCybGXNninC4gGD9nhe3cttBaZ6u5NuhiLM')
                  ]],
                ]]
              ]]
            ]],
            ['div', { class: 'esgst-header-menu-row esgst-version-row' }, [
              ['div', [
                ['p', { class: 'esgst-header-menu-description' }, `Current Version: ${manifest.version_name || manifest.version}`]
              ]]
            ]]
          ]]
        ]],
        ['a', { class: 'esgst-header-menu-button', href: this.esgst.settingsUrl}, [
          ['i', { class: 'fa' }, [
            ['img', { src: this.esgst.icon }]
          ]],
          ' ESGST'
        ]],
        ['div', { class: 'esgst-header-menu-button arrow' }, [
          ['i', { class: 'fa fa-angle-down' }]
        ]]
      ]]
    ]);
    dropdown = /** @type {HTMLElement} */ menu.firstElementChild;
    button = dropdown.nextElementSibling;
    arrow = button.nextElementSibling;
    button.addEventListener('click', event => {
      if (!gSettings.openSettingsInTab) {
        event.preventDefault();
        settingsModule.loadMenu(true);
      }
    });
    arrow.addEventListener('click', this.toggleHeaderMenu.bind(this, arrow, dropdown));
    document.addEventListener('click', this.closeHeaderMenu.bind(this, arrow, dropdown, menu), true);
  }

  getSelectors(endless, selectors) {
    if (endless) {
      const newSelectors = [];
      for (const selector of selectors) {
        newSelectors.push(
          selector.replace(/X/, `.esgst-es-page-${endless} `),
          selector.replace(/X/, `.esgst-es-page-${endless}`)
        );
      }
      selectors = newSelectors.join(`, `);
    } else {
      selectors = selectors.map(x => x.replace(/X/, '')).join(`, `);
    }
    return selectors;
  }

  addScope(name, context) {
    const scope = new Scope(name, context);
    if (!this.esgst.scopes[scope.id]) {
      this.esgst.scopes[scope.id] = scope;
    }
    return scope.id;
  }

  removeScope(id) {
    if (this.esgst.scopes[id]) {
      delete this.esgst.scopes[id];
    }
  }

  setCurrentScope(id) {
    this.esgst.currentScope = this.esgst.scopes[id];
    this.esgst.scopeHistory.push(id);
    logger.info(`Current scope: `, this.esgst.currentScope.id);
  }

  resetCurrentScope() {
    this.esgst.scopeHistory.pop();
    const id = this.esgst.scopeHistory[this.esgst.scopeHistory.length - 1];
    this.esgst.currentScope = this.esgst.scopes[id];
    logger.info(`Current scope: `, this.esgst.currentScope.id);
  }

  getLevelFromCv(cv) {
    for (const [index, value] of shared.esgst.cvLevels.entries()) {
      if (cv < value) {
        const prevValue = shared.esgst.cvLevels[index - 1];
        return this.round((index - 1) + ((cv - prevValue) / (value - prevValue)));
      }
    }
  }

  getChanges(changes, areaName) {
    if (areaName !== 'local') {
      return;
    }
    for (const key in changes) {
      if (!changes.hasOwnProperty(key)) {
        continue;
      }
      const change = changes[key];
      if (!utils.isSet(change.newValue)) {
        continue;
      }
      shared.esgst.storage[key] = change.newValue;
      try {
        shared.esgst[key] = JSON.parse(shared.esgst.storage[key]);
      } catch (e) {
        shared.esgst[key] = shared.esgst.storage[key];
      }
    }
  }
}

// Singleton
const common = new Common();

shared.add({ common });

export { common };

