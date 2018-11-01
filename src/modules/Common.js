import {container} from '../class/Container';
import Module from '../class/Module'
import ButtonSet from '../class/ButtonSet';
import Popout from '../class/Popout';
import Popup from '../class/Popup';
import ToggleSwitch from '../class/ToggleSwitch';
import {utils} from '../lib/jsUtils';
import JSZip from 'jszip';
import IntersectionObserver from 'intersection-observer-polyfill';
import {TextEncoder} from 'text-encoding/lib/encoding';

/**
 * @property {EnvironmentFunctions} envFunctions
 * @property {EnvironmentVariables} envVariables
 */

const
  formatDate = utils.formatDate.bind(utils),
  isSet = utils.isSet.bind(utils),
  parseHtml = utils.parseHtml.bind(utils),
  rgba2Hex = utils.rgba2Hex.bind(utils),
  hex2Rgba = utils.hex2Rgba.bind(utils),
  sortArray = utils.sortArray.bind(utils)
;

class Common extends Module {
  constructor() {
    super();
    this.info = {
      id: 'common',
      load: () => {
      },
      name: 'Common',
      type: 'general'
    };
    this._USER_INFO = null;
    this.browser = null;
    this.gm = null;
  }

  /**
   * @param {EnvironmentVariables} variables
   */
  setEnvironmentVariables(variables) {
    this._USER_INFO = variables._USER_INFO;
    this.browser = variables.browser;
    this.gm = variables.gm;
  }

  /**
   * @param {EnvironmentFunctions} functions
   */
  setEnvironmentFunctions(functions) {
    this.envFunctions = functions;
  }

  /**
   * @param key
   * @param value
   * @returns {Promise<void>}
   */
  setValue(key, value) {
    return this.envFunctions.setValue(key, value);
  }

  setValues(values) {
    return this.envFunctions.setValues(values);
  }

  getValue(key, value) {
    return this.envFunctions.getValue(key, value);
  }

  getValues(values) {
    return this.envFunctions.getValues(values);
  }

  delValue(key) {
    return this.envFunctions.delValue(key);
  }

  // noinspection JSUnusedGlobalSymbols
  delValues(keys) {
    return this.envFunctions.delValues(keys);
  }

  // noinspection JSUnusedGlobalSymbols -- delete? envFunctions.getStorage used only in main.js
  getStorage() {
    return this.envFunctions.getStorage();
  }

  notifyNewVersion(version) {
    return this.envFunctions.notifyNewVersion(version);
  }

  continueRequest(details) {
    return this.envFunctions.continueRequest(details);
  }

  // noinspection JSUnusedGlobalSymbols -- delete?
  addHeaderMenu() {
    return this.envFunctions.addHeaderMenu();
  }

  minimizePanel_add() {
    if (!this.esgst.pageOuterWrap) {
      return;
    }

    this.esgst.minimizePanel = this.createElements(this.esgst.pageOuterWrap, `beforeEnd`, [{
      attributes: {
        class: `esgst-minimize-panel`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-minimize-container markdown`
        },
        type: `div`,
        children: [{
          text: `Minimized Popups:`,
          type: `h3`
        }, {
          type: `hr`
        }, {
          attributes: {
            class: `esgst-minimize-list`
          },
          type: `ul`
        }]
      }]
    }]);
    this.esgst.minimizeList = /** @type {HTMLElement} */ this.esgst.minimizePanel.firstElementChild.lastElementChild;
  }

  minimizePanel_addItem(popup) {
    if (!this.esgst.minimizeList) {
      return;
    }

    popup.minimizeItem = this.createElements(this.esgst.minimizeList, `beforeEnd`, [{
      attributes: {
        class: `esgst-minimize-item`
      },
      type: `li`,
      children: [{
        attributes: {
          href: `javascript:void(0);`
        },
        text: popup.title.textContent.replace(/:$/, ``),
        type: `a`
      }]
    }]);
    popup.minimizeLink = popup.minimizeItem.firstElementChild;
    popup.minimizeItem.addEventListener(`click`, this.minimizePanel_openItem.bind(this, popup));
  }

  minimizePanel_openItem(popup) {
    popup.open();
    popup.minimizeItem.remove();
    popup.minimizeItem = null;
    if (!this.esgst.minimizePanel.getElementsByClassName(`alert`).length) {
      this.esgst.minimizePanel.classList.remove(`alert`);
    }
  }

  minimizePanel_alert(popup) {
    if (popup.minimizeItem) {
      popup.minimizeItem.classList.add(`alert`);
    }
    if (this.esgst.minimizePanel) {
      this.esgst.minimizePanel.classList.add(`alert`);
    }
  }

  /**
   *
   * @param {Object} modules
   * @returns {Promise<void>}
   */
  async loadFeatures(modules) {
    if (this.esgst.minimizePanel) {
      this.minimizePanel_add();
    }

    if (this.esgst.mainPageHeading) {
      this.esgst.leftMainPageHeadingButtons = this.createElements(this.esgst.mainPageHeading, `afterBegin`, [{
        attributes: {
          class: `esgst-page-heading esgst-page-heading-buttons`
        },
        type: `div`
      }]) ;
      this.esgst.rightMainPageHeadingButtons = this.createElements(this.esgst.mainPageHeading, `beforeEnd`, [{
        attributes: {
          class: `esgst-page-heading esgst-page-heading-buttons`
        },
        type: `div`
      }]) ;
    }

    let hideButtonsLeft, hideButtonsRight;
    hideButtonsLeft = document.createElement(`div`);
    hideButtonsLeft.className = `esgst-heading-button`;
    this.createElements(hideButtonsLeft, `inner`, [{
      attributes: {
        class: `fa fa-ellipsis-v`
      },
      type: `i`
    }]);
    this.esgst.leftButtons = this.createElements(new Popout(`esgst-hidden-buttons`, hideButtonsLeft, 0, true).popout, `beforeEnd`, [{
      attributes: {
        class: `esgst-page-heading`
      },
      type: `div`
    }]);
    hideButtonsRight = document.createElement(`div`);
    hideButtonsRight.className = `esgst-heading-button`;
    this.createElements(hideButtonsRight, `inner`, [{
      attributes: {
        class: `fa fa-ellipsis-v`
      },
      type: `i`
    }]);
    this.esgst.rightButtons = this.createElements(new Popout(`esgst-hidden-buttons`, hideButtonsRight, 0, true).popout, `beforeEnd`, [{
      attributes: {
        class: `esgst-page-heading`
      },
      type: `div`
    }]);

    for (const key in modules) {
      const module = modules[key];
      if (!module.info.endless && !this.esgst[module.info.id]) {
        continue;
      }
      if (module.info.featureMap) {
        for (const type in module.info.featureMap) {
          if (!module.info.featureMap.hasOwnProperty(type)) {
            continue;
          }
          const map = module.info.featureMap[type];
          if (Array.isArray(map)) {
            for (const item of map) {
              this.esgst[`${type}Features`].push(module[item].bind(module));
            }
          } else {
            this.esgst[`${type}Features`].push(module[map].bind(module));
          }
        }
      }
      try {
        await module.init();
      } catch (e) {
        console.log(e);
      }
    }

    if (this.esgst.updateHiddenGames) {
      const hideButton = document.getElementsByClassName(`js__submit-hide-games`)[0];
      if (hideButton) {
        hideButton.addEventListener(`click`, () => this.updateHiddenGames(this.esgst.hidingGame.id, this.esgst.hidingGame.type, false));
      }
    }

    this.observeStickyChanges();

    if (this.esgst.newGiveawayPath) {
      // when the user searches for a game in the new giveaway page, wait until the results appear and load the game features for them
      let rows = document.getElementsByClassName(`form__rows`)[0];
      if (rows) {
        setTimeout(() => this.checkNewGiveawayInput(document.getElementsByClassName(`js__autocomplete-data`)[0]), 1000);
      }
    }

    if (this.esgst.mainPageHeading) {
      if (!this.esgst.leftMainPageHeadingButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        this.esgst.leftMainPageHeadingButtons.classList.add(`esgst-hidden`);
      }
      if (!this.esgst.rightMainPageHeadingButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        this.esgst.rightMainPageHeadingButtons.classList.add(`esgst-hidden`);
      }
      if (!this.esgst.leftButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hideButtonsLeft.classList.add(`esgst-hidden`);
      }
      if (!this.esgst.rightButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
        hideButtonsRight.classList.add(`esgst-hidden`);
      }
      this.esgst.mainPageHeading.insertBefore(hideButtonsLeft, this.esgst.mainPageHeading.firstElementChild);
      this.esgst.mainPageHeading.appendChild(hideButtonsRight);
    }
    this.reorderButtons(this.esgst);
    if (document.readyState === `complete`) {
      this.goToComment(this.esgst.originalHash);
    } else {
      document.addEventListener(`readystatechange`, this.goToComment.bind(this, this.esgst.originalHash, null, false));
    }
    addEventListener(`beforeunload`, this.checkBusy.bind(this));
    addEventListener(`hashchange`, this.goToComment.bind(this, null, null, false));
    if (!this.esgst.staticPopups) {
      setTimeout(() => this.repositionPopups(), 2000);
    }

    for (const key in this.esgst.documentEvents) {
      if (this.esgst.documentEvents.hasOwnProperty(key)) {
        document.addEventListener(key, this.processEvent.bind(this, this.esgst.documentEvents[key]), true);
      }
    }

    this.esgst.modules = modules;
  }

  processEvent(functions, event) {
    for (const fun of functions) {
      fun(event);
    }
  }

  async getElements() {
    if (this.esgst.sg) {
      this.esgst.pageOuterWrapClass = `page__outer-wrap`;
      this.esgst.pageHeadingClass = `page__heading`;
      this.esgst.pageHeadingBreadcrumbsClass = `page__heading__breadcrumbs`;
      this.esgst.footer = document.getElementsByClassName(`footer__outer-wrap`)[0];
      this.esgst.replyBox = document.getElementsByClassName(`comment--submit`)[0];
      this.esgst.cancelButtonClass = `comment__cancel-button`;
      this.esgst.paginationNavigationClass = `pagination__navigation`;
      this.esgst.hiddenClass = `is-hidden`;
      this.esgst.selectedClass = `is-selected`;
    } else {
      this.esgst.pageOuterWrapClass = `page_outer_wrap`;
      this.esgst.pageHeadingClass = `page_heading`;
      this.esgst.pageHeadingBreadcrumbsClass = `page_heading_breadcrumbs`;
      this.esgst.footer = /** @type {HTMLElement} */ document.getElementsByTagName(`footer`)[0];
      this.esgst.replyBox = /** @type {HTMLElement} */ document.getElementsByClassName(`reply_form`)[0];
      this.esgst.cancelButtonClass = `btn_cancel`;
      this.esgst.paginationNavigationClass = `pagination_navigation`;
      this.esgst.hiddenClass = `is_hidden`;
      this.esgst.selectedClass = `is_selected`;
    }
    const pageMatch = location.href.match(/page=(\d+)/);
    if (pageMatch) {
      this.esgst.currentPage = parseInt(pageMatch[1]);
    } else {
      this.esgst.currentPage = 1;
    }
    let url = location.href.replace(location.search, ``).replace(location.hash, ``).replace(`/search`, ``);
    this.esgst.originalUrl = url;
    this.esgst.favicon = document.querySelector(`[rel="shortcut icon"]`);
    this.esgst.originalTitle = document.title;
    if (this.esgst.mainPath) {
      url += this.esgst.sg ? `giveaways` : `trades`;
    }
    url += `/search?`;
    let parameters = location.search.replace(/^\?/, ``).split(/&/);
    for (let i = 0, n = parameters.length; i < n; ++i) {
      if (parameters[i] && !parameters[i].match(/page/)) {
        url += `${parameters[i]}&`;
      }
    }
    if (location.search) {
      this.esgst.originalUrl = url.replace(/&$/, ``);
      if (this.esgst.currentPage > 1) {
        this.esgst.originalUrl += `&page=${this.esgst.currentPage}`;
      }
    }
    url += `page=`;
    this.esgst.searchUrl = url;
    if (!this.esgst.menuPath) {
      await this.esgst.modules.generalHeaderRefresher.hr_refreshHeaderElements(document);
    }
    this.esgst.header = /** @type {HTMLElement} */ document.getElementsByTagName(`header`)[0];
    this.esgst.headerNavigationLeft = /** @type {HTMLElement} */ document.getElementsByClassName(`nav__left-container`)[0];
    this.esgst.pagination = /** @type {HTMLElement} */ document.getElementsByClassName(`pagination`)[0];
    this.esgst.featuredContainer = /** @type {HTMLElement} */ document.getElementsByClassName(`featured__container`)[0];
    this.esgst.pageOuterWrap = /** @type {HTMLElement} */ document.getElementsByClassName(this.esgst.pageOuterWrapClass)[0];
    this.esgst.paginationNavigation = /** @type {HTMLElement} */ document.getElementsByClassName(this.esgst.paginationNavigationClass)[0];
    this.esgst.sidebar = /** @type {HTMLElement} */ document.getElementsByClassName(`sidebar`)[0];
    if (this.esgst.sidebar) {
      this.esgst.enterGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(`sidebar__entry-insert`)[0];
      this.esgst.leaveGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(`sidebar__entry-delete`)[0];
      this.esgst.giveawayErrorButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(`sidebar__error`)[0];
    }
    this.esgst.activeDiscussions = /** @type {HTMLElement} */ document.querySelector(`.widget-container--margin-top:last-of-type`);
    this.esgst.pinnedGiveaways = /** @type {HTMLElement} */ document.getElementsByClassName(`pinned-giveaways__outer-wrap`)[0];
    let mainPageHeadingIndex;
    if (this.esgst.commentsPath) {
      mainPageHeadingIndex = 1;
    } else {
      mainPageHeadingIndex = 0;
    }
    this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[mainPageHeadingIndex];
    if (!this.esgst.mainPageHeading && mainPageHeadingIndex === 1) {
      this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[0];
    }
    if (this.esgst.logoutButton) {
      this.esgst.xsrfToken = this.esgst.logoutButton.getAttribute(`data-form`).match(/xsrf_token=(.+)/)[1];
    }
  }

  async checkNewGiveawayInput(context) {
    if (context.style.opacity === `1`) {
      if (!context.getAttribute(`data-esgst`)) {
        context.setAttribute(`data-esgst`, true);
        await this.loadNewGiveawayFeatures(context);
      }
    } else {
      context.removeAttribute(`data-esgst`);
    }
    setTimeout(() => this.checkNewGiveawayInput(context), 1000);
  }

  async loadNewGiveawayFeatures(context) {
    // check if there are no cv games in the results and if they are already in the database
    let found = false;
    let games = {
      apps: {},
      subs: {}
    };
    let elements = context.getElementsByClassName(`table__row-outer-wrap`);
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      let date = element.querySelector(`[data-ui-tooltip*="Zero contributor value since..."]`);
      if (!date) continue;
      let info = await this.esgst.modules.games.games_getInfo(element);
      if (!info || (this.esgst.games[info.type][info.id] && this.esgst.games[info.type][info.id].noCV)) {
        continue;
      }
      date = JSON.parse(date.getAttribute(`data-ui-tooltip`)).rows;
      games[info.type][info.id] = {
        name: element.getElementsByClassName(`table__column__heading`)[0].firstChild.textContent.trim(),
        noCV: date[date.length - 1].columns[1].name
      };
      found = true;
    }
    if (this.esgst.noCvButton) {
      this.esgst.noCvButton.remove();
    }
    if (found) {
      this.esgst.noCvButton = this.createElements(context.closest(`.form__row__indent`).previousElementSibling, `beforeEnd`, [{
        attributes: {
          class: `esgst-no-cv-button`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-calendar-times-o esgst-blinking esgst-bold esgst-clickable esgst-red`,
            title: this.getFeatureTooltip(null, `Add no CV games to the database`)
          },
          type: `i`
        }]
      }]);
      if (this.esgst.addNoCvGames) {
        // noinspection JSIgnoredPromiseFromCall
        this.addNoCvGames(games);
      } else {
        this.esgst.noCvButton.firstElementChild.addEventListener(`click`, this.addNoCvGames.bind(this, games));
      }
    }

    await this.esgst.modules.games.games_load(document, true);
  }

  async addNoCvGames(games) {
    let button = this.esgst.noCvButton;
    this.esgst.noCvButton = null;
    this.createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`,
        title: `Adding no CV games to the database...`
      },
      type: `i`
    }]);
    await this.request({
      data: JSON.stringify(games),
      method: `POST`,
      url: `https://script.google.com/macros/s/AKfycbym0nzeyr3_b93ViuiZRivkBMl9PBI2dTHQxNC0rtgeQSlCTI-P/exec`
    });
    for (let id in games.apps) {
      if (games.apps.hasOwnProperty(id)) {
        delete games.apps[id].name;
      }
    }
    for (let id in games.subs) {
      if (games.subs.hasOwnProperty(id)) {
        delete games.subs[id].name;
      }
    }
    await this.lockAndSaveGames(games);
    button.remove();
  }

  async endless_load(context, main, source, endless, mainEndless) {
    if (!Object.keys(this.esgst.edited).length && !mainEndless) {
      this.esgst.edited = {};
      let values = await this.getValues({
        discussions: `{}`,
        games: `{"apps":{},"subs":{}}`,
        giveaways: `{}`,
        tickets: `{}`,
        trades: `{}`,
        users: `{"steamIds":{},"users":{}}`
      });
      this.esgst.discussions = JSON.parse(values.discussions);
      this.esgst.games = JSON.parse(values.games);
      this.esgst.giveaways = JSON.parse(values.giveaways);
      this.esgst.tickets = JSON.parse(values.tickets);
      this.esgst.trades = JSON.parse(values.trades);
      this.esgst.users = JSON.parse(values.users);
    }

    for (let feature of this.esgst.endlessFeatures) {
      try {
        await feature(context, main, source, endless, mainEndless);
      } catch (e) {
        console.log(e);
      }
    }

    if (!mainEndless) {
      const newValues = {};
      for (const key in this.esgst.edited) {
        if (this.esgst.edited.hasOwnProperty(key)) {
          newValues[key] = JSON.stringify(this.esgst[key]);
        }
      }
      this.esgst.edited = {};
      if (Object.keys(newValues).length) {
        this.setValues(newValues);
      }
    }
  }

// Helper

  async saveComment(tradeCode, parentId, description, url, status, goToLocation) {
    const data = `xsrf_token=${this.esgst.xsrfToken}&do=${this.esgst.sg ? `comment_new` : `comment_insert`}&trade_code=${tradeCode}&parent_id=${parentId}&description=${encodeURIComponent(description)}`;
    let id = null;
    let response = await this.request({data, method: `POST`, url});
    let responseHtml = null;
    let success = true;
    if (this.esgst.sg) {
      if ((response.redirected && url === response.finalUrl) || url !== response.finalUrl) {
        if (url !== response.finalUrl) {
          response = await this.request({data, method: `POST`, url: response.finalUrl});
        }
        responseHtml = parseHtml(response.responseText);
        if (parentId) {
          id = responseHtml.querySelector(`[data-comment-id="${parentId}"]`).getElementsByClassName(`comment__children`)[0].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        } else {
          const elements = responseHtml.getElementsByClassName(`comments`);
          id = elements[elements.length - 1].lastElementChild.getElementsByClassName(`comment__summary`)[0].id;
        }
      } else {
        success = false;
      }
    } else {
      const responseJson = JSON.parse(response.responseText);
      if (responseJson.success) {
        responseHtml = parseHtml(responseJson.html);
        id = responseHtml.getElementsByClassName(`comment_outer`)[0].id;
      } else {
        success = false;
      }
    }
    if (!success) {
      this.createElements(status, `inner`, [{
        attributes: {
          class: `fa fa-times-circle`
        },
        type: `i`
      }, {
        text: `Failed!`,
        type: `span`
      }]);
      return {id: null, response: null,status};
    }
    if (this.esgst.ch) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.commentsCommentHistory.ch_saveComment(id, Date.now());
    }
    if (!goToLocation) {
      return {id, response, status};
    }
    await this.esgst.modules.giveawaysGiveawayEncrypterDecrypter.ged_saveGiveaways(this.esgst.sg ? responseHtml.getElementById(id).closest(`.comment`) : responseHtml.getElementById(id), id);
    location.href = `/go/comment/${id}`;
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
          activateTab: {
            description: `
            <ul>
              <li>When a browser session is restored, you have to activate a tab so that it can be loaded. With this option enabled, ESGST automatically activates the first SG/ST tab open so that the extension can be injected immediately.</li>
            </ul>
          `,
            extensionOnly: true,
            name: `Activate the first SG/ST tab if a browser session was restored.`,
            sg: true,
            st: true
          },
          manipulateCookies: {
            description: `
            <ul>
              <li>You should enable this option if you use a single Firefox container for the common sites requested by ESGST that require you to be logged in (SteamGifts, SteamTrades, Steam, SGTools, etc...). With it enabled, ESGST will manipulate your cookies to make sure that requests are sent using the cookies from the current container you are on.</li>
              <li>For example: you are only logged in on SteamGifts and Steam in the personal container. With this option disabled, when you try to sync your owned games on ESGST it will fail because it will use the default cookies (where you are not logged in). With this option enabled, the sync will succeed because the container cookies will be used instead (where you are logged in).</li>
              <li>If you are concerned about what exactly is done, you can check out the source code of the eventPage.js file, where the manipulation occurs. Basically what happens is: the default cookies are backed up and replaced by the container cookies while the request is being made, and after the request is done the default cookies are restored. This is not a pretty solution, but it does the job until a better and more permanent solution comes along.</li>
            </ul>
          `,
            extensionOnly: true,
            name: `Allow ESGST to manipulate your cookies when using Firefox containers.`,
            sg: true,
            st: true
          },
          addNoCvGames: {
            name: `Automatically add no CV games to the database when searching for games in the new giveaway page.`,
            sg: true
          },
          askFileName: {
            name: `Ask for file name when backing up data.`,
            sg: true,
            st: true
          },
          autoBackup: {
            inputItems: [
              {
                id: `autoBackup_days`,
                prefix: `Days: `
              }
            ],
            name: `Automatically backup your data every specified number of days.`,
            options: {
              title: `Backup to:`,
              values: [`Computer`, `Dropbox`, `Google Drive`, `OneDrive`]
            },
            sg: true,
            st: true
          },
          autoSync: {
            name: `Automatically sync games/groups when syncing through SteamGifts.`,
            sg: true
          },
          updateHiddenGames: {
            description: `
            <ul>
              <li>With this enabled, you no longer have to sync your hidden games every time you add/remove a game to/from the list.</li>
            </ul>
          `,
            name: `Automatically update hidden games when adding/removing a game to/from the list.`,
            sg: true
          },
          updateWhitelistBlacklist: {
            description: `
            <ul>
              <li>With this enabled, you no longer have to sync your whitelist/blacklist every time you add/remove a user to/from those lists.</li>
            </ul>
          `,
            name: `Automatically update whitelist/blacklist when adding/removing a user to/from those lists.`,
            sg: true
          },
          calculateDelete: {
            name: `Calculate and show data sizes when opening the delete menu.`,
            sg: true,
            st: true
          },
          backupZip: {
            name: `Backup data as a .zip file (smaller, but slower) instead of a .json file (larger, but faster).`,
            sg: true,
            st: true
          },
          calculateExport: {
            name: `Calculate and show data sizes when opening the backup menu.`,
            sg: true,
            st: true
          },
          calculateImport: {
            name: `Calculate and show data sizes when opening the restore menu.`,
            sg: true,
            st: true
          },
          checkVersion: {
            name: `Check whether or not you are on the current version when visiting the ESGST discussion.`,
            sg: true
          },
          checkVersionMain: {
            name: `Check whether or not you are on the current version when visiting the main discussions page if the ESGST discussion is in the current page.`,
            sg: true
          },
          collapseSections: {
            name: `Collapse sections in the settings menu by default.`,
            sg: true,
            st: true
          },
          esgst: {
            name: `Enable ESGST for SteamTrades.`,
            st: true
          },
          enableByDefault: {
            name: `Enable new features and functionalities by default.`,
            sg: true,
            st: true
          },
          fallbackSteamApi: {
            description: `
              <ul>
                <li>With this option enabled, if you sync your games without being logged in to Steam, the Steam API will be used instead (less complete, so some of your games will be removed until you sync while logged in).</li>
              </ul>
            `,
            name: `Fallback to Steam API when syncing without being logged in.`,
            sg: true,
            st: true
          },
          staticPopups: {
            features: {
              staticPopups_f: {
                inputItems: [
                  {
                    id: `staticPopups_width`,
                    prefix: `Width: `
                  }
                ],
                name: `Define a fixed width for popups, so that they are centered horizontally.`,
                sg: true,
                st: true
              }
            },
            name: `Make popups static (they are fixed at the top left corner of the page instead of being automatically centered).`,
            sg: true,
            st: true
          },
          minimizePanel: {
            description: `
            <ul>
              <li>When you close a non-temporary popup, it will be minimized to a panel that can be accessed by moving your mouse to the left corner of the window in any page. There you can quickly find and re-open all of the popups that you minimized.</li>
              <li>A non-temporary popup is a popup that does not get destroyed when you close it. For example, the settings popup is a temporary popup - when you close it, the popup is destroyed, and when you click on the button to open the settings again, a new popup is created. The Whitelist/Blacklist Checker popup is an example of a non-temporary popup - if you close it and re-open it, it will be the exact same popup.</li>
              <li>With this option enabled, the sync/backup popups become non-temporary, which allows you to close them and keep navigating through the page while ESGST is performing the sync/backup, without having to wait for it to finish.</li>
              <li>Some popups will notify you when they are done. When this happens, a red bar will flash at the left side of the screen that only disappears when you open the minimize panel and re-open the popup that is requiring your attention.</li>
            </ul>
          `,
            name: `Minimize non-temporary popups to a panel when closing them.`,
            sg: true,
            st: true
          },
          getSyncGameNames: {
            description: `
            <ul>
              <li>With this disabled, only the app/sub ids of the games will appear.</li>
              <li>This can lead to lots of requests to the Steam store, so only enable it if you truly need to see the names of the games that were added/removed.</li>
            </ul>
          `,
            name: `Retrieve game names when syncing.`,
            sg: true,
            st: true
          },
          openSettingsInTab: {
            name: `Open settings menu in a separate tab.`,
            sg: true,
            st: true
          },
          openSyncInTab: {
            name: `Open the automatic sync in a new tab.`,
            sg: true,
            st: true
          },
          showChangelog: {
            name: `Show changelog from the new version when updating.`,
            sg: true,
            st: true
          },
          showFeatureNumber: {
            name: `Show the feature number in the tooltips of elements added by ESGST.`,
            sg: true,
            st: true
          }
        }
      },
      themes: {
        features: {
          sgDarkGrey: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/3rINT/`
              },
              text: `SG Dark Grey`,
              type: `a`
            }, {
              text: ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`,
              type: `node`
            }],
            sg: true,
            st: true,
            theme: `https://userstyles.org/styles/141670.css`
          },
          sgv2Dark: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/iO230/`
              },
              text: `SGv2 Dark`,
              type: `a`
            }, {
              text: ` by SquishedPotatoe (Very high compatibility with ESGST elements - recommended)`,
              type: `node`
            }],
            sg: true,
            st: true,
            theme: `https://userstyles.org/styles/109810.css`
          },
          steamGiftiesBlack: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/62TRf/`
              },
              text: `SteamGifties Black`,
              type: `a`
            }, {
              text: ` by Mully (Medium compatibility with ESGST elements)`,
              type: `node`
            }],
            sg: true,
            theme: `https://userstyles.org/styles/110675.css`
          },
          steamGiftiesBlue: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/62TRf/`
              },
              text: `SteamGifties Blue`,
              type: `a`
            }, {
              text: ` by Mully (Medium compatibility with ESGST elements)`,
              type: `node`
            }],
            sg: true,
            theme: `https://userstyles.org/styles/110491.css`
          },
          steamTradiesBlackBlue: {
            name: [{
              attributes: {
                class: `esgst-bold`,
                href: `https://www.steamgifts.com/discussion/FIdCm/`
              },
              text: `SteamTradies Black/Blue`,
              type: `a`
            }, {
              text: ` by Mully (No compatibility with ESGST elements)`,
              type: `node`
            }],
            st: true,
            theme: `https://userstyles.org/styles/134348.css`
          },
          customTheme: {
            name: `Custom Theme (Add your own CSS rules)`,
            sg: true,
            st: true,
            theme: true
          }
        }
      },
    };
    for (const type in features) {
      if (features.hasOwnProperty(type)) {
        if (type.match(/^(others|themes)$/)) {
          continue;
        }
        const typeModules = Object.keys(this.esgst.modules).filter(x => this.esgst.modules[x].info.type === type).sort((x, y) => {
          return this.esgst.modules[x].info.id.localeCompare(this.esgst.modules[y].info.id, {sensitivity: `base`});
        });
        for (const key of typeModules) {
          const module = this.esgst.modules[key];
          features[type].features[module.info.id] = module.info;
        }
      }
    }
    return features;
  }

  checkBusy(event) {
    if (document.getElementsByClassName(`esgst-busy`)[0] || this.esgst.busy) {
      event.returnValue = true;
      return true;
    }
  }

  async checkVersion(discussion) {
    if (discussion.code === `TDyzv` && ((this.esgst.checkVersion && this.esgst.discussionPath) || (this.esgst.checkVersionMain && !this.esgst.discussionPath))) {
      let version = discussion.title.match(/v(.+?)\s/)[1];
      if (version !== this.esgst.version && version !== await this.getValue(`dismissedVersion`)) {
        this.notifyNewVersion(version);
      }
    }
  }

  setMouseEvent(element, id, url, callback) {
    let isDragging = -1;
    let startingPos = [0, 0];
    element.addEventListener(`mousedown`, event => {
      if (event.button === 2) return; // right click, do nothing
      if (event.button === 1) { // middle click
        event.preventDefault();
      }
      isDragging = event.button;
      startingPos = [event.pageX, event.pageY];
    });
    element.addEventListener(`mousemove`, event => {
      if (isDragging === -1 || (event.pageX === startingPos[0] && event.pageY === startingPos[1])) return;
      isDragging = -1;
    });
    element.addEventListener(`mouseup`, () => {
      if (isDragging === -1) return;
      if (this.esgst[id] || isDragging === 1) {
        open(url);
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
      if (this.esgst.leftButtonIds.indexOf(id) > -1) {
        context = this.esgst.leftButtons;
      } else if (this.esgst.rightButtonIds.indexOf(id) > -1) {
        context = this.esgst.rightButtons;
      } else if (this.esgst.leftMainPageHeadingIds.indexOf(id) > -1) {
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
        type: `span`
      });
    }
    for (const icon of details.icons) {
      children.push({
        attributes: {
          class: `fa ${icon}`
        },
        type: `i`
      });
    }
    return this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-heading-button`,
        [`data-draggable-id`]: id,
        id: `esgst-${details.id}`,
        title: this.getFeatureTooltip(details.featureId || details.id, details.title)
      },
      type: `div`,
      children
    }]);
  }

  showPatreonNotice() {
    if (!this.esgst.storage.patreonNotice) {
      const popup = new Popup({
        addScrollable: true, icon: `fa-dollar`, isTemp: true, title: [{
          text: `Hi! ESGST now has a Patreon page. If you want to support ESGST, please check it out: `,
          type: `node`
        }, {
          attributes: {
            href: `https://www.patreon.com/gsrafael01`
          },
          text: `https://www.patreon.com/gsrafael01`,
          type: `a`
        }]
      });
      popup.onClose = this.setValue.bind(this, `patreonNotice`, true);
      popup.open();
    }
  }

  async checkNewVersion() {
    if (this.esgst.version !== this.esgst.currentVersion) {
      if (typeof this.esgst.version === `undefined`) {
        this.esgst.firstInstall = true;
        // noinspection JSIgnoredPromiseFromCall
        this.setSetting(`dismissedOptions`, this.esgst.toDismiss);
        this.esgst.dismissedOptions = this.esgst.toDismiss;
        let popup = new Popup({
          addScrollable: true, icon: `fa-smile-o`, isTemp: true, title: [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: ` Hi! ESGST is getting things ready for you. This will not take long...`,
            type: `node`
          }]
        });
        popup.open();
        await this.checkSync(true, true);
        this.createElements(popup.title, `inner`, [{
          attributes: {
            class: `fa fa-check`
          },
          type: `i`
        }, {
          text: ` Thanks for installing ESGST, `,
          type: `node`
        }, {
          text: this.esgst.username,
          type: `span`
        }, {
          text: `. You are ready to go! Click on the `,
          type: `node`
        }, {
          text: `Settings`,
          type: `span`
        }, {
          text: ` link below to choose which features you want to use.`,
          type: `node`
        }]);
      } else {
        if (this.esgst.showChangelog) {
          this.loadChangelog(this.esgst.version);
        }
      }
      this.esgst.version = this.esgst.currentVersion;
      // noinspection JSIgnoredPromiseFromCall
      this.setValue(`version`, this.esgst.version);
    }
    if (!this.esgst.settings.groupPopupDismissed) {
      let i;
      for (i = this.esgst.groups.length - 1; i > -1 && this.esgst.groups[i].steamId !== `103582791461018688`; i--) {
      }
      if (i < 0 || !this.esgst.groups[i] || !this.esgst.groups[i].member) {
        let popup = new Popup({
          addScrollable: true, icon: `fa-steam`, isTemp: true, title: [{
            text: `Hello! In case you were not aware ESGST now has a Steam group. If you want to join it, you must first send a request from the `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`,
              href: `http://steamcommunity.com/groups/esgst`
            },
            text: `Steam group`,
            type: `a`
          }, {
            text: ` page, then another request from the settings menu (last button in the heading). Have a good day. :)`,
            type: `node`
          }]
        });
        this.createElements(popup.description, `beforeEnd`, [{
          attributes: {
            class: `esgst-description`
          },
          text: `This popup will never show up again after you close it`,
          type: `div`
        }]);
        popup.open();
        popup.onClose = this.setSetting.bind(this, `groupPopupDismissed`, true);
      }
    }
  }

  parseMarkdown(string) {
    return [{
      type: `div`,
      children: [...Array.from(parseHtml(this.esgst.markdownParser.text(string)).body.children)].map(x => {
        return {
          context: x
        };
      })
    }];
  }

  async addGiveawayToStorage() {
    let giveaway, ggiveaways, i, key, n, popup, ugd, user;
    popup = new Popup({
      addScrollable: true,
      icon: `fa-circle-o-notch fa-spin`,
      isTemp: true,
      title: `Please wait... ESGST is adding this giveaway to the storage...`
    });
    popup.open();
    let giveaways = await this.esgst.modules.giveaways.giveaways_get(document, true, location.href);
    if (giveaways.length) {
      giveaway = giveaways[0];
      ggiveaways = {};
      ggiveaways[giveaway.code] = giveaway;
      user = {
        steamId: this.esgst.steamId,
        username: this.esgst.username
      };
      const savedUser = await this.getUser(null, user);
      giveaways = null;
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
            class: `esgst-header-menu-row${details.className || ``}`,
            [`data-link-id`]: details.id,
            [`data-link-key`]: key,
            href: details.url,
            title: details.title || ``
          },
          type: `a`,
          children: [{
            attributes: {
              class: `fa fa-fw ${icon}`
            },
            type: `i`
          }, {
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-header-menu-name`
              },
              text: details.name,
              type: `p`
            }, details.description ? {
              attributes: {
                class: `esgst-header-menu-description`
              },
              text: details.description,
              type: `p`
            } : null]
          }]
        }];
      }
      return [{
        attributes: {
          class: `esgst-header-menu-row${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          title: details.title || ``
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-fw ${icon}`
          },
          type: `i`
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-header-menu-name`
            },
            text: details.name,
            type: `p`
          }, details.description ? {
            attributes: {
              class: `esgst-header-menu-description`
            },
            text: details.description,
            type: `p`
          } : null]
        }]
      }];
    }
    if (this.esgst.sg) {
      return [{
        attributes: {
          class: `nav__row${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          href: details.url,
          title: details.title || ``
        },
        type: `a`,
        children: [{
          attributes: {
            class: `nav__row__summary`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `nav__row__summary__name`
            },
            text: details.name,
            type: `p`
          }, details.description ? {
            attributes: {
              class: `esgst-header-menu-description`
            },
            text: details.description,
            type: `p`
          } : null]
        }]
      }];
    } else {
      return [{
        attributes: {
          class: `dropdown_btn${details.className || ``}`,
          [`data-link-id`]: details.id,
          [`data-link-key`]: key,
          href: details.url,
          title: details.title || ``
        },
        type: `a`,
        children: [{
          text: details.name,
          type: `span`
        }]
      }];
    }
  }

  reorderButtons(obj) {
    const items = [{
      context: obj.leftButtons,
      id: `leftButtonIds`
    }, {
      context: obj.rightButtons,
      id: `rightButtonIds`
    }, {
      context: obj.leftMainPageHeadingButtons,
      id: `leftMainPageHeadingIds`
    }, {
      context: obj.rightMainPageHeadingButtons,
      id: `rightMainPageHeadingIds`
    }];
    for (const item of items) {
      if (!item.context) {
        continue;
      }
      for (const id of this.esgst[item.id]) {
        const elements = (obj.mainPageHeading || obj.outerWrap).querySelectorAll(`[data-draggable-id="${id}"]`);
        for (const element of elements) {
          item.context.appendChild(element);
        }
      }
    }
  }

  repositionPopups() {
    if (this.esgst.openPopups > 0) {
      this.esgst.popups.forEach(popup => popup.reposition());
      this.esgst.isRepositioning = true;
      setTimeout(() => this.repositionPopups(), 2000);
    } else {
      this.esgst.isRepositioning = false;
    }
  }

  async setSetting() {
    const deleteLock = await this.createLock(`settingsLock`, 100);
    const settings = JSON.parse(await this.getValue(`settings`, `{}`));
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
      settings[value.id] = value.value;
      this.esgst.settings[value.id] = value.value;
    }
    await this.setValue(`settings`, JSON.stringify(settings));
    deleteLock();
  }

  getSetting(key, inverse) {
    let value = this.esgst.settings[key];
    if (typeof value === `undefined`) {
      let defaultValue = this.esgst.defaultValues[key];
      if (typeof defaultValue === `undefined`) {
        defaultValue = this.esgst[`enableByDefault_${this.esgst.name}`] || false;
      }
      let oldKey = this.esgst.oldValues[key];
      if (typeof oldKey !== `undefined`) {
        value = inverse ? !this.esgst.settings[oldKey] : this.esgst.settings[oldKey];
      }
      if (typeof value === `undefined`) {
        value = defaultValue;
      }
    }
    return value;
  }

  getOldValues(id, name, setting) {
    // noinspection FallThroughInSwitchStatementJS
    switch (id) {
      case `at`:
        if (name !== `sg`) return;
        setting.exclude = [
          {
            enabled: this.validateValue(this.esgst.settings.at_g_sg) ? 0 : 1,
            pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
          }
        ];
        return;
      case `egh`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: this.validateValue(this.esgst.settings.egh_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `es_pd`:
        setting.enabled = name === `sg` ? this.esgst.settings.es_l_d_sg || this.esgst.settings.es_c_d_sg || this.esgst.settings.es_d_d_sg || this.esgst.settings.es_g_d_sg : this.esgst.settings.es_l_d_st || this.esgst.settings.es_c_d_st || this.esgst.settings.es_t_d_st;
        setting.enabled = setting.enabled ? 1 : 0;
      case `es`:
        if (name === `sg`) {
          if (this.validateValue(this.esgst.settings[id === `es` ? `es_l_sg` : `es_l_d_sg`])) {
            setting.exclude = [
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_c_sg` : `es_c_d_sg`]) ? 0 : 1,
                pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_d_sg` : `es_d_d_sg`]) ? 0 : 1,
                pattern: `^/(discussions|support/tickets)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_g_sg` : `es_g_d_sg`]) ? 0 : 1,
                pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
              }
            ];
          } else {
            setting.include = [
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_c_sg` : `es_c_d_sg`]) ? 1 : 0,
                pattern: `^/(giveaway/(?!.*/(entries|winners|groups|region-restrictions))|discussion/|support/ticket/)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_d_sg` : `es_d_d_sg`]) ? 1 : 0,
                pattern: `^/(discussions|support/tickets)`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_g_sg` : `es_g_d_sg`]) ? 1 : 0,
                pattern: `^/($|giveaways(?!/(new|wishlist|created|entered|won)))`
              }
            ];
          }
        } else {
          if (this.validateValue(this.esgst.settings[id === `es` ? `es_l_st` : `es_l_d_st`])) {
            setting.exclude = [
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_c_st` : `es_c_d_st`]) ? 0 : 1,
                pattern: `^/trade/`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_t_st` : `es_t_d_st`]) ? 0 : 1,
                pattern: `^/($|trades)`
              }
            ];
          } else {
            setting.include = [
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_c_st` : `es_c_d_st`]) ? 1 : 0,
                pattern: `^/trade/`
              },
              {
                enabled: this.validateValue(this.esgst.settings[id === `es` ? `es_t_st` : `es_t_d_st`]) ? 1 : 0,
                pattern: `^/($|trades)`
              }
            ];
          }
        }
        return;
      case `gc`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: this.validateValue(this.esgst.settings.gc_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `gc_gi`:
        if (name !== `sg`) return;
        if (this.validateValue(this.esgst.settings.gc_gi_t_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/discussion`}
          ];
        } else if (this.validateValue(this.esgst.settings.gc_gi_cew_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/giveaways/(created|entered|won)/`}
          ];
        }
        return;
      case `gc_o_a`:
        if (name !== `sg`) return;
        setting.enabled = this.esgst.settings.gc_o_altAccounts && this.esgst.settings.gc_o_altAccounts.length > 0 ? 1 : 0;
        if (this.validateValue(this.esgst.settings.gc_o_t_sg)) {
          setting.include = [
            {enabled: 1, pattern: `^/discussion`}
          ];
        }
        return;
      case `gt`:
        if (name !== `sg`) return;
        setting.exclude = [
          {enabled: this.validateValue(this.esgst.settings.gt_t_sg) ? 0 : 1, pattern: `^/discussion/`}
        ];
        return;
      case `vai`:
        setting.exclude = [
          {enabled: this.validateValue(this.esgst.settings[`vai_i_${name}`]) ? 1 : 0, pattern: `^/messages`}
        ];
        return;
      default:
        return;
    }
  }

  getFeaturePath(feature, id, name) {
    let key = `${id}_${name}`;
    let setting = this.esgst.settings[key];
    if (typeof setting === `undefined` || !setting.include || !Array.isArray(setting.include)) {
      setting = {
        enabled: this.getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/)) ? 1 : 0,
        include: [],
        exclude: [],
        new: typeof setting === `undefined`
      };
      if (feature[name].include) {
        setting.include = feature[name].include;
        if (feature[name].exclude) {
          setting.exclude = feature[name].exclude;
        }
      } else {
        setting.include = [{enabled: setting.enabled, pattern: `.*`}];
      }
      if (setting.new) {
        this.getOldValues(id, name, setting);
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

  getFeatureSetting(feature, id) {
    this.esgst[id] = false;
    if (feature[this.esgst.name]) {
      let setting = this.getFeaturePath(feature, id, this.esgst.name);
      if (!setting.enabled) return;
      let check = false;
      let path = `${location.pathname}${location.search}`;
      let i = setting.include.length - 1;
      while (i > -1 && (!setting.include[i].enabled || !path.match(new RegExp(setting.include[i].pattern)))) i--;
      if (i > -1) {
        this.esgst.currentSettings[id] = {
          current: setting.include[i],
          setting,
        };
        check = true;
      }
      i = setting.exclude.length - 1;
      while (i > -1 && (!setting.exclude[i].enabled || !path.match(new RegExp(setting.exclude[i].pattern)))) i--;
      if (i > -1) {
        check = false;
      }
      this.esgst[id] = check;
    }
    if (!this.esgst[id]) return;
    if (feature.features) {
      for (id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          this.getFeatureSetting(feature.features[id], id);
        }
      }
    }
  }

  getFeatureTooltip(id, title = ``) {
    if (this.esgst.showFeatureNumber) {
      if (title) {
        return `${title}\n\nThis element was added by ESGST${id ? ` (${this.getFeatureNumber(id).number})` : ``}`;
      }
      return `This element was added by ESGST${id ? ` (${this.getFeatureNumber(id).number})` : ``}`;
    }
    return title;
  }

  getFeatureName(fullMatch, match) {
    let feature = this.getFeatureNumber(match);
    return `${feature.number} "${feature.name}"`;
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
            if (feature.sg || this.esgst.settings.esgst_st) {
              i += 1;
            }
          }
        }
        if (type !== `trades` || this.esgst.settings.esgst_st) {
          n += 1;
        }
      }
    }
    return {
      name: ``,
      number: ``
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
          if (subFeature.sg || this.esgst.settings.esgst_st) {
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
      savedUsers = JSON.parse(await this.getValue(`users`));
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
      savedUsers = JSON.parse(await this.getValue(`users`));
    }
    let savedUser = await this.getUser(savedUsers, user);
    if (savedUser) {
      if (list) {
        if (!user.steamId) {
          user.steamId = savedUsers.steamIds[user.username];
        }
        list.existing.push(user);
      } else {
        let deleteLock = await this.createLock(`userLock`, 300);
        this.checkUsernameChange(savedUsers, user);
        for (let key in user.values) {
          if (user.values.hasOwnProperty(key)) {
            if (key !== `tags`) {
              if (user.values[key] === null) {
                delete savedUsers.users[user.steamId][key];
              } else {
                savedUsers.users[user.steamId][key] = user.values[key];
              }
            }
          }
        }
        await this.setValue(`users`, JSON.stringify(savedUsers));
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
    if (typeof savedUsers.users[user.steamId].username !== `undefined` && savedUsers.users[user.steamId].username !== user.username) {
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
    } else if (typeof user.values.tags !== `undefined`) {
      savedUsers.users[user.steamId].tags = user.values.tags;
    }
    if (!savedUsers.users[user.steamId].tags) {
      delete savedUsers.users[user.steamId].tags;
    }
  }

  async addUser(user) {
    let deleteLock, savedUser, savedUsers;
    deleteLock = await this.createLock(`userLock`, 300);
    savedUsers = JSON.parse(await this.getValue(`users`));
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
        if (key !== `tags`) {
          if (user.values[key] === null) {
            delete savedUsers.users[user.steamId][key];
          } else {
            savedUsers.users[user.steamId][key] = user.values[key];
          }
        }
      }
    }
    await this.setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async getUsername(list, save, user) {
    let match, response, responseHtml;
    response = await this.request({method: `GET`, url: `https://www.steamgifts.com/go/user/${user.steamId}`});
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
        savedUsers = JSON.parse(await this.getValue(`users`));
      }
      let steamId = savedUsers.steamIds[user.username];
      if (steamId) {
        user.steamId = steamId;
        user.id = savedUsers.users[steamId].id;
        return;
      }
    }
    const response = await this.request({
      method: `GET`,
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
    user.steamId = profileLink.getAttribute(`href`).match(/\d+/)[0];
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
    savedUsers = JSON.parse(await this.getValue(`users`));
    for (let i = 0, n = users.length; i < n; i++) {
      promises.push(this.saveUser(list, savedUsers, users[i]));
    }
    await Promise.all(promises);
    let deleteLock = await this.createLock(`userLock`, 300);
    savedUsers = JSON.parse(await this.getValue(`users`));
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
          if (key !== `tags`) {
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
          if (key !== `tags`) {
            if (user.values[key] === null) {
              delete savedUsers.users[user.steamId][key];
            } else {
              savedUsers.users[user.steamId][key] = user.values[key];
            }
          }
        }
      }
    }
    await this.setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async deleteUserValues(values) {
    let deleteLock, savedUsers;
    deleteLock = await this.createLock(`userLock`, 300);
    savedUsers = JSON.parse(await this.getValue(`users`));
    for (let key in savedUsers.users) {
      if (savedUsers.users.hasOwnProperty(key)) {
        for (let i = 0, n = values.length; i < n; ++i) {
          delete savedUsers.users[key][values[i]];
        }
      }
    }
    await this.setValue(`users`, JSON.stringify(savedUsers));
    deleteLock();
  }

  async getUserId(user) {
    if (user.username) {
      await this.getSteamId(null, false, null, user);
    } else {
      await this.getUsername(null, false, user);
    }
  }

  async checkSync(menu, callback) {
    let currentDate = Date.now();
    let isSyncing = this.getLocalValue(`isSyncing`);
    if (menu) {
      await this.setSync(false, callback);
    } else if (!isSyncing || currentDate - isSyncing > 1800000) {
      if (this.esgst.openSyncInTab) {
        let parameters = ``;
        this.setLocalValue(`isSyncing`, currentDate);
        [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `FollowedGames`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`].forEach(key => {
          if (this.esgst[`autoSync${key}`] && currentDate - this.esgst[`lastSync${key}`] > this.esgst[`autoSync${key}`] * 86400000) {
            parameters += `${key}=1&`;
          }
        });
        if (parameters) {
          if (this.esgst.sg) {
            open(`/esgst/sync?${parameters.replace(/&$/, ``)}`);
          } else {
            open(`/esgst/sync?${parameters.replace(/&$/, ``)}`);
          }
        } else {
          this.delLocalValue(`isSyncing`);
        }
      } else {
        let parameters = {};
        this.setLocalValue(`isSyncing`, currentDate);
        [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `FollowedGames`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`].forEach(key => {
          if (this.esgst[`autoSync${key}`] && currentDate - this.esgst[`lastSync${key}`] > this.esgst[`autoSync${key}`] * 86400000) {
            parameters[key] = 1;
          }
        });
        if (Object.keys(parameters).length > 0) {
          await this.setSync(false, null, parameters);
        } else {
          this.delLocalValue(`isSyncing`);
        }
      }
    }
  }

  /**
   * @param [autoSync]
   * @param [mainCallback]
   * @param [parameters]
   * @returns {Promise<void>}
   */
  async setSync(autoSync, mainCallback, parameters) {
    let syncer = {};
    syncer.autoSync = autoSync;
    syncer.canceled = false;
    if (this.esgst.firstInstall) {
      await this.sync(syncer);
    } else if (syncer.autoSync || mainCallback || parameters) {
      syncer.popup = new Popup({
        addScrollable: true,
        icon: parameters ? `fa-circle-o-notch fa-spin` : `fa-refresh`,
        settings: !this.esgst.minimizePanel,
        title: parameters ? `ESGST is syncing your data... ${this.esgst.minimizePanel ? `You can close this popup, ESGST will notify you when it is done through the minimize panel.` : `Please do not close this popup until it is done.`}` : `Sync`
      });
      if (!syncer.autoSync && !parameters) {
        this.createElements(syncer.popup.description, `afterBegin`, [{
          attributes: {
            class: `esgst-description`
          },
          text: `By selecting a number X in the dropdown menu next to each data other than 0, you are enabling automatic sync for that data (which means the data will be synced every X days).`,
          type: `div`
        }]);
        syncer.switches = {
          syncGroups: new ToggleSwitch(syncer.popup.scrollable, `syncGroups`, false, `Steam Groups`, false, false, null, this.esgst.syncGroups),
          syncWhitelist: new ToggleSwitch(syncer.popup.scrollable, `syncWhitelist`, false, `Whitelist`, false, false, null, this.esgst.syncWhitelist),
          syncBlacklist: new ToggleSwitch(syncer.popup.scrollable, `syncBlacklist`, false, `Blacklist`, false, false, null, this.esgst.syncBlacklist),
          syncHiddenGames: new ToggleSwitch(syncer.popup.scrollable, `syncHiddenGames`, false, `Hidden Games`, false, false, null, this.esgst.syncHiddenGames),
          syncGames: new ToggleSwitch(syncer.popup.scrollable, `syncGames`, false, `Owned/Wishlisted/Ignored Games`, false, false, null, this.esgst.syncGames),
          syncFollowedGames: new ToggleSwitch(syncer.popup.scrollable, `syncFollowedGames`, false, `Followed Games`, false, false, null, this.esgst.syncFollowedGames),
          syncWonGames: new ToggleSwitch(syncer.popup.scrollable, `syncWonGames`, false, `Won Games`, false, false, null, this.esgst.syncWonGames),
          syncReducedCvGames: new ToggleSwitch(syncer.popup.scrollable, `syncReducedCvGames`, false, `Reduced CV Games`, false, false, null, this.esgst.syncReducedCvGames),
          syncNoCvGames: new ToggleSwitch(syncer.popup.scrollable, `syncNoCvGames`, false, `No CV Games`, false, false, null, this.esgst.syncNoCvGames),
          syncHltbTimes: new ToggleSwitch(syncer.popup.scrollable, `syncHltbTimes`, false, `HLTB Times`, false, false, null, this.esgst.syncHltbTimes),
          syncGiveaways: new ToggleSwitch(syncer.popup.scrollable, `syncGiveaways`, false, `Giveaways`, false, false, null, this.esgst.syncGiveaways)
        };
        for (let id in syncer.switches) {
          if (syncer.switches.hasOwnProperty(id)) {
            this.setAutoSync(id, syncer.switches);
          }
        }
        let group = this.createElements(syncer.popup.description, `beforeEnd`, [{
          attributes: {
            class: `esgst-button-group`
          },
          type: `div`,
          children: [{
            text: `Select:`,
            type: `span`
          }]
        }]);
        group.appendChild(new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-square`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `All`,
          title2: ``,
          callback1: this.selectSwitches.bind(this, syncer.switches, `enable`, group)
        }).set);
        group.appendChild(new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-square-o`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `None`,
          title2: ``,
          callback1: this.selectSwitches.bind(this, syncer.switches, `disable`, group)
        }).set);
        group.appendChild(new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-plus-square-o`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Inverse`,
          title2: ``,
          callback1: this.selectSwitches.bind(this, syncer.switches, `toggle`, group)
        }).set);
      }
      syncer.progress = this.createElements(syncer.popup.description, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden esgst-popup-progress`
        },
        type: `div`
      }]);
      syncer.results = this.createElements(syncer.popup.scrollable, `afterBegin`, [{
        type: `div`
      }]);
      if (!parameters) {
        syncer.set = new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-refresh`,
          icon2: `fa-times`,
          title1: `Sync`,
          title2: `Cancel`,
          callback1: this.sync.bind(this, syncer),
          callback2: this.cancelSync.bind(this, syncer)
        });
        syncer.popup.description.appendChild(syncer.set.set);
      }
      syncer.popup.open();
      if (syncer.autoSync) {
        syncer.set.trigger();
      } else if (parameters) {
        syncer.parameters = parameters;
        await this.sync(syncer);
      }
    } else {
      this.esgst.mainContext.innerHTML = ``;
      let description = this.createElements(this.esgst.mainContext, `beforeEnd`, [{
        attributes: {
          class: `description`
        },
        type: `div`,
        children: [{
          type: `div`
        }, {
          attributes: {
            class: `esgst-hidden esgst-popup-progress`
          },
          type: `div`
        }]
      }]);
      syncer.results = description.firstElementChild;
      syncer.progress = description.lastElementChild;
      syncer.parameters = this.getParameters();
      await this.sync(syncer);
    }
  }

  setAutoSync(id, switches) {
    let html, i, key, select, toggleSwitch;
    key = id.replace(/^sync/, ``);
    toggleSwitch = switches[id];
    html = [{
      attributes: {
        class: `esgst-auto-sync`
      },
      type: `select`,
      children: []
    }];
    for (i = 0; i < 31; ++i) {
      html[0].children.push({
        text: i,
        type: `option`
      });
    }
    select = this.createElements(toggleSwitch.name, `beforeEnd`, html);
    select.selectedIndex = this.esgst[`autoSync${key}`];
    this.observeNumChange(select, `autoSync${key}`);
    if (this.esgst[`lastSync${key}`]) {
      toggleSwitch.date = this.createElements(toggleSwitch.name, `beforeEnd`, [{
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-check-circle`
          },
          type: `i`
        }, {
          text: ` Last synced ${new Date(this.esgst[`lastSync${key}`]).toLocaleString()}`,
          type: `node`
        }]
      }]);
    } else {
      toggleSwitch.date = this.createElements(toggleSwitch.name, `beforeEnd`, [{
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-times`
          },
          type: `i`
        }, {
          text: ` Never synced.`,
          type: `node`
        }]
      }]);
    }
  }

  cancelSync(syncer) {
    if (syncer.process) {
      syncer.process.stop();
    }
    syncer.canceled = true;
  }

  /**
   * @param {EsgstSyncer} syncer
   */
  async sync(syncer) {
    if (!this.esgst.firstInstall) {
      await this.setSetting(`lastSync`, Date.now());
      syncer.results.innerHTML = ``;
      syncer.progress.classList.remove(`esgst-hidden`);
      this.createElements(syncer.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        type: `span`
      }]);
    }

    // if this is the user's fist time using the script, only sync steam id and stop
    if (this.esgst.firstInstall) {
      return;
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync groups
    if (this.esgst.sg && ((syncer.parameters && syncer.parameters.Groups) || (!syncer.parameters && (this.esgst.settings.syncGroups || syncer.autoSync)))) {
      syncer.progress.lastElementChild.textContent = `Syncing your Steam groups...`;
      syncer.groups = {};
      let savedGroups = JSON.parse(await this.getValue(`groups`));
      if (!Array.isArray(savedGroups)) {
        let newGroups, savedGiveaways;
        newGroups = [];
        for (let key in savedGroups) {
          if (savedGroups.hasOwnProperty(key)) {
            newGroups.push(savedGroups[key]);
          }
        }
        savedGroups = newGroups;
        await this.setValue(`groups`, JSON.stringify(savedGroups));
        savedGiveaways = JSON.parse(await this.getValue(`giveaways`));
        for (let key in savedGiveaways) {
          if (savedGiveaways.hasOwnProperty(key)) {
            delete savedGiveaways[key].groups;
          }
        }
        await this.setValue(`giveaways`, JSON.stringify(savedGiveaways));
      }
      syncer.currentGroups = {};
      for (let i = 0, n = savedGroups.length; i < n; ++i) {
        if (savedGroups[i] && savedGroups[i].member && savedGroups[i].steamId) {
          syncer.currentGroups[savedGroups[i].steamId] = savedGroups[i].name;
        }
      }
      syncer.newGroups = {};
      syncer.savedGroups = savedGroups;
      let nextPage = 1;
      let pagination = null;
      do {
        let elements, responseHtml;
        responseHtml = parseHtml((await this.request({
          method: `GET`,
          url: `https://www.steamgifts.com/account/steam/groups/search?page=${nextPage}`
        })).responseText);
        elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
        for (let i = 0, n = elements.length; !syncer.canceled && i < n; i++) {
          let code, element, heading, name;
          element = elements[i];
          heading = element.getElementsByClassName(`table__column__heading`)[0];
          code = heading.getAttribute(`href`).match(/\/group\/(.+?)\/(.+)/)[1];
          name = heading.textContent;
          let j;
          for (j = syncer.savedGroups.length - 1; j >= 0 && syncer.savedGroups[j].code !== code; --j) {
          }
          if (j >= 0 && syncer.savedGroups[j].steamId) {
            syncer.groups[code] = {
              member: true
            };
            syncer.newGroups[syncer.savedGroups[j].steamId] = name;
          } else {
            let avatar, steamId;
            avatar = element.getElementsByClassName(`table_image_avatar`)[0].style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1];
            steamId = parseHtml((await this.request({
              method: `GET`,
              url: `/group/${code}/`
            })).responseText).getElementsByClassName(`sidebar__shortcut-inner-wrap`)[0].firstElementChild.getAttribute(`href`).match(/\d+/)[0];
            syncer.groups[code] = {
              avatar: avatar,
              code: code,
              member: true,
              name: name,
              steamId: steamId
            };
            syncer.newGroups[steamId] = name;
          }
        }
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
        nextPage += 1;
      } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      await this.lockAndSaveGroups(syncer.groups, true);
      let missing, neww;
      missing = [];
      neww = [];
      for (let id in syncer.currentGroups) {
        if (syncer.currentGroups.hasOwnProperty(id)) {
          if (!syncer.newGroups[id]) {
            missing.push({
              attributes: {
                href: `http://steamcommunity.com/gid/${id}`
              },
              text: syncer.currentGroups[id],
              type: `a`
            }, {
              text: `, `,
              type: `node`
            });
          }
        }
      }
      for (let id in syncer.newGroups) {
        if (syncer.newGroups.hasOwnProperty(id)) {
          if (!syncer.currentGroups[id]) {
            neww.push({
              attributes: {
                href: `http://steamcommunity.com/gid/${id}`
              },
              text: syncer.newGroups[id],
              type: `a`
            }, {
              text: `, `,
              type: `node`
            });
          }
        }
      }
      missing.pop();
      neww.pop();
      syncer.html = [];
      if (missing.length) {
        syncer.html.push({
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Missing groups:`,
            type: `span`
          }, ...missing]
        });
      }
      if (neww.length) {
        syncer.html.push({
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `New groups:`,
            type: `span`
          }, ...neww]
        });
      }
      this.createElements(syncer.results, `afterBegin`, syncer.html);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync whitelist and blacklist
    if (!syncer.autoSync && ((syncer.parameters && (syncer.parameters.Whitelist || syncer.parameters.Blacklist)) || (!syncer.parameters && (this.esgst.settings.syncWhitelist || this.esgst.settings.syncBlacklist)))) {
      if ((syncer.parameters && syncer.parameters.Whitelist && syncer.parameters.Blacklist) || (!syncer.parameters && this.esgst.settings.syncWhitelist && this.esgst.settings.syncBlacklist)) {
        await this.deleteUserValues([`whitelisted`, `whitelistedDate`, `blacklisted`, `blacklistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`;
        await this.syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
        syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
        await this.syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
      } else if ((syncer.parameters && syncer.parameters.Whitelist) || (!syncer.parameters && this.esgst.settings.syncWhitelist)) {
        await this.deleteUserValues([`whitelisted`, `whitelistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`;
        await this.syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
      } else {
        await this.deleteUserValues([`blacklisted`, `blacklistedDate`]);
        syncer.users = [];
        syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
        await this.syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
      }
      syncer.progress.lastElementChild.textContent = `Saving your whitelist/blacklist (this may take a while)...`;
      await this.saveUsers(syncer.users);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync hidden games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.HiddenGames) || (!syncer.parameters && this.esgst.settings.syncHiddenGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your hidden games...`;
      syncer.hiddenGames = {
        apps: [],
        subs: []
      };
      let nextPage = 1;
      let pagination = null;
      do {
        let elements, responseHtml;
        responseHtml = parseHtml((await this.request({
          method: `GET`,
          url: `https://www.steamgifts.com/account/settings/giveaways/filters/search?page=${nextPage}`
        })).responseText);
        elements = responseHtml.querySelectorAll(`.table__column__secondary-link[href*="store.steampowered.com"]`);
        for (let i = 0, n = elements.length; i < n; ++i) {
          let match = elements[i].getAttribute(`href`).match(/(app|sub)\/(\d+)/);
          if (match) {
            syncer.hiddenGames[`${match[1]}s`].push(match[2]);
          }
        }
        pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
        nextPage += 1;
      } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      let deleteLock = await this.createLock(`gameLock`, 300);
      let savedGames = JSON.parse(await this.getValue(`games`));
      for (let key in savedGames.apps) {
        if (savedGames.apps.hasOwnProperty(key)) {
          delete savedGames.apps[key].hidden;
        }
      }
      for (let key in savedGames.subs) {
        if (savedGames.subs.hasOwnProperty(key)) {
          delete savedGames.subs[key].hidden;
        }
      }
      for (let i = 0, n = syncer.hiddenGames.apps.length; i < n; ++i) {
        if (!savedGames.apps[syncer.hiddenGames.apps[i]]) {
          savedGames.apps[syncer.hiddenGames.apps[i]] = {};
        }
        savedGames.apps[syncer.hiddenGames.apps[i]].hidden = true;
      }
      for (let i = 0, n = syncer.hiddenGames.subs.length; i < n; ++i) {
        if (!savedGames.subs[syncer.hiddenGames.subs[i]]) {
          savedGames.subs[syncer.hiddenGames.subs[i]] = {};
        }
        savedGames.subs[syncer.hiddenGames.subs[i]].hidden = true;
      }
      await this.setValue(`games`, JSON.stringify(savedGames));
      deleteLock();
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync wishlisted/owned/ignored games
    if ((syncer.parameters && syncer.parameters.Games) || (!syncer.parameters && (syncer.autoSync || this.esgst.settings.syncGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your wishlisted/owned/ignored games...`;
      syncer.html = [];
      let apiResponse = null;
      if (this.esgst.steamApiKey) {
        apiResponse = await this.request({
          method: `GET`,
          url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.esgst.steamApiKey}&steamid=${this.esgst.steamId}&format=json`
        });
      }
      let storeResponse = await this.request({
        method: `GET`,
        url: `http://store.steampowered.com/dynamicstore/userdata?${Math.random().toString().split(`.`)[1]}`
      });
      await this.syncGames(null, syncer, apiResponse, storeResponse);
      if (this.esgst.settings.gc_o_altAccounts) {
        for (let i = 0, n = this.esgst.settings.gc_o_altAccounts.length; !syncer.canceled && i < n; i++) {
          let altAccount = this.esgst.settings.gc_o_altAccounts[i];
          apiResponse = await this.request({
            method: `GET`,
            url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${this.esgst.steamApiKey}&steamid=${altAccount.steamId}&format=json`
          });
          await this.syncGames(altAccount, syncer, apiResponse);
        }
        await this.setSetting(`gc_o_altAccounts`, this.esgst.settings.gc_o_altAccounts);
      }
      if (syncer.html.length) {
        this.createElements(syncer.results, `afterBegin`, syncer.html);
        if (this.esgst.getSyncGameNames) {
          // noinspection JSIgnoredPromiseFromCall
          this.getGameNames(syncer);
        }
      }
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync followed games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.FollowedGames) || (!syncer.parameters && this.esgst.settings.syncFollowedGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your followed games...`;
      const response = await this.request({
        method: `GET`,
        url: `https://steamcommunity.com/my/followedgames/`
      });
      const responseHtml = parseHtml(response.responseText);
      const elements = responseHtml.querySelectorAll(`.gameListRow.followed`);
      const savedGames = JSON.parse(await this.getValue(`games`));
      for (const id in savedGames.apps) {
        if (savedGames.apps.hasOwnProperty(id)) {
          savedGames.apps[id].followed = null;
        }
      }
      for (const element of elements) {
        const id = parseInt(element.getAttribute(`data-appid`));
        if (!savedGames.apps[id]) {
          savedGames.apps[id] = {};
        }
        savedGames.apps[id].followed = true;
      }
      await this.lockAndSaveGames(savedGames);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync won games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.WonGames) || (!syncer.parameters && this.esgst.settings.syncWonGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing your won games...`;
      await this.getWonGames(`0`, syncer);
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync reduced cv games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.ReducedCvGames) || (!syncer.parameters && this.esgst.settings.syncReducedCvGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing reduced CV games...`;
      let result = JSON.parse((await this.request({
        method: `GET`,
        url: `https://script.google.com/macros/s/AKfycbwJK-7RBh5ghaKprEsmx4DQ6CyXc_3_9eYiOCu3yhI6W4B3W4YN/exec`
      })).responseText);
      if (result.error) {
        this.createElements(syncer.results, `afterBegin`, [{
          text: `Unable to sync reduced CV games: ${result.error}`,
          type: `node`
        }]);
      } else {
        result = result.success;
        for (const id in this.esgst.games.apps) {
          if (this.esgst.games.apps.hasOwnProperty(id)) {
            this.esgst.games.apps[id].reducedCV = null;
          }
        }
        for (const id in this.esgst.games.subs) {
          if (this.esgst.games.subs.hasOwnProperty(id)) {
            this.esgst.games.subs[id].reducedCV = null;
          }
        }
        for (const id in result.apps) {
          if (result.apps.hasOwnProperty(id)) {
            if (!this.esgst.games.apps[id]) {
              this.esgst.games.apps[id] = {};
            }
            this.esgst.games.apps[id].reducedCV = result.apps[id].reducedCV;
          }
        }
        for (const id in result.subs) {
          if (result.subs.hasOwnProperty(id)) {
            if (!this.esgst.games.subs[id]) {
              this.esgst.games.subs[id] = {};
            }
            this.esgst.games.subs[id].reducedCV = result.subs[id].reducedCV;
          }
        }
        await this.lockAndSaveGames(this.esgst.games);
      }
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync no cv games
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.NoCvGames) || (!syncer.parameters && this.esgst.settings.syncNoCvGames))) {
      syncer.progress.lastElementChild.textContent = `Syncing no CV games...`;
      await this.lockAndSaveGames(JSON.parse((await this.request({
        method: `GET`,
        url: `https://script.google.com/macros/s/AKfycbym0nzeyr3_b93ViuiZRivkBMl9PBI2dTHQxNC0rtgeQSlCTI-P/exec`
      })).responseText).success);
    }

    // sync hltb times
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.HltbTimes) || (!syncer.parameters && this.esgst.settings.syncHltbTimes))) {
      syncer.progress.lastElementChild.textContent = `Syncing HLTB times...`;
      try {
        const responseText = (await this.request({
          method: `GET`,
          url: `https://script.google.com/macros/s/AKfycbysBF72c0VNylStaslLlOL7X4M0KQIgY0VVv6Q0x2vh72iGAtE/exec`
        })).responseText;
        const games = JSON.parse(responseText);
        const hltb = {};
        for (const game of games) {
          if (game.steamId) {
            hltb[game.steamId] = game;
          }
        }
        let cache = JSON.parse(this.getLocalValue(`gcCache`, `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`));
        if (cache.version !== 7) {
          cache = {
            apps: {},
            subs: {},
            hltb: cache.hltb,
            timestamp: 0,
            version: 7
          };
        }
        cache.hltb = hltb;
        this.setLocalValue(`gcCache`, JSON.stringify(cache));
      } catch (e) {
        console.log(e);
      }
    }

    // if sync has been canceled stop
    if (syncer.canceled) {
      return;
    }

    // sync giveaways
    if (!syncer.autoSync && ((syncer.parameters && syncer.parameters.Giveaways) || (!syncer.parameters && this.esgst.settings.syncGiveaways)) && this.esgst.sg) {
      syncer.progress.lastElementChild.textContent = `Syncing your giveaways...`;
      const key = `sent`;
      const user = {
        steamId: this.esgst.steamId,
        username: this.esgst.username
      };
      syncer.process = await this.esgst.modules.usersUserGiveawayData.ugd_add(null, key, user, syncer);
      await syncer.process.start();
    }

    // finish sync
    if (!this.esgst.firstInstall) {
      syncer.progress.lastElementChild.textContent = `Updating last sync date...`;
      let currentDate = new Date();
      const currentTime = currentDate.getTime();
      if (syncer.autoSync) {
        await this.setSetting(`lastSyncGroups`, currentTime);
        await this.setSetting(`lastSyncGames`, currentTime);
        this.esgst.lastSyncGroups = currentTime;
        this.esgst.lastSyncGames = currentTime;
      } else {
        let string = currentDate.toLocaleString();
        let keys = [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `FollowedGames`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `Giveaways`];
        for (let i = keys.length - 1; i > -1; i--) {
          let key = keys[i];
          let id = `sync${key}`;
          if ((syncer.parameters && syncer.parameters[key]) || (!syncer.parameters && this.esgst.settings[id])) {
            await this.setSetting(`lastSync${key}`, currentTime);
            this.esgst[`lastSync${key}`] = currentTime;
            if (syncer.switches && syncer.switches[id]) {
              this.createElements(syncer.switches[id].date, `inner`, [{
                attributes: {
                  class: `fa fa-check-circle`
                },
                type: `i`
              }, {
                text: ` Last synced ${string}`,
                type: `node`
              }]);
            }
          }
        }
      }
      this.createElements(syncer.progress, `inner`, [{
        text: `Synced!`,
        type: `node`
      }]);
      this.delLocalValue(`isSyncing`);
    }
    if (syncer.set && syncer.autoSync) {
      syncer.set.set.remove();
    }
    if (syncer.parameters && syncer.popup) {
      syncer.popup.icon.classList.remove(`fa-circle-o-notch`, `fa-spin`);
      syncer.popup.icon.classList.add(`fa-check`);
      syncer.popup.setTitle(`Sync done! You can close this popup now.`);
      syncer.popup.setDone(true);
    }
  }

  async syncWhitelistBlacklist(key, syncer, url) {
    let nextPage = 1;
    let pagination = null;
    do {
      let elements, responseHtml;
      responseHtml = parseHtml((await this.request({method: `GET`, url: `${url}${nextPage}`})).responseText);
      elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
      for (let i = 0, n = elements.length; i < n; ++i) {
        let element, user;
        element = elements[i];
        user = {
          id: element.querySelector(`[name="child_user_id"]`).value,
          username: element.getElementsByClassName(`table__column__heading`)[0].textContent,
          values: {}
        };
        user.values[key] = true;
        user.values[`${key}Date`] = parseInt(element.querySelector(`[data-timestamp]`).getAttribute(`data-timestamp`)) * 1e3;
        syncer.users.push(user);
      }
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      nextPage += 1;
    } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
  }

  async syncGames(altAccount, syncer, apiResponse, storeResponse) {
    let apiJson = null,
      storeJson = null;
    try {
      apiJson = JSON.parse(apiResponse.responseText);
    } catch (e) { /**/
    }
    try {
      storeJson = JSON.parse(storeResponse.responseText);
    } catch (e) { /**/
    }
    /** @property storeJson.rgOwnedApps */
    const hasApi = apiJson && apiJson.response && apiJson.response.games &&
      apiJson.response.games.length,
      hasStore = storeJson && storeJson.rgOwnedApps && storeJson.rgOwnedApps.length;
    if (((altAccount && !this.esgst.steamApiKey) || (!altAccount && this.esgst.steamApiKey)) && !hasApi) {
      const items = {
        type: `div`,
        children: []
      };
      if (altAccount) {
        items.children.push({
          attributes: {
            class: `esgst-bold`
          },
          text: `${altAccount.name}: `,
          type: `span`
        });
      }
      items.children.push({
        text: `Unable to sync through the Steam API. Check if you have a valid Steam API key set in the settings menu.`,
        type: `node`
      });
      if (altAccount) {
        items.children.push({
          text: ` Also check the privacy settings of your alt account.`,
          type: `node`
        });
      }
      syncer.html.push(items);
    }
    if (!altAccount && !hasStore) {
      syncer.html.push({
        text: `Unable to sync through the Steam store. Check if you are logged in to Steam on your current browser session. If you are, try again later. Some games may not be available through the Steam API (if you have a Steam API key set).`,
        type: `text`
      });
    }
    console.log(hasApi, hasStore);
    if ((!hasApi || !this.esgst.fallbackSteamApi) && !hasStore) {
      return;
    }

    // delete old data
    const savedGames = (altAccount && altAccount.games) || JSON.parse(await this.getValue(`games`)),
      oldOwned = {
        apps: [],
        subs: []
      };
    for (const id in savedGames.apps) {
      if (savedGames.apps.hasOwnProperty(id)) {
        if (savedGames.apps[id].owned) {
          oldOwned.apps.push(id);
          savedGames.apps[id].owned = null;
        }
        if (hasStore) {
          savedGames.apps[id].wishlisted = null;
          savedGames.apps[id].ignored = null;
        }
      }
    }
    if (hasStore) {
      for (const id in savedGames.subs) {
        if (savedGames.subs.hasOwnProperty(id)) {
          if (savedGames.subs[id].owned) {
            oldOwned.subs.push(id);
            savedGames.subs[id].owned = null;
          }
          savedGames.subs[id].wishlisted = null;
          savedGames.subs[id].ignored = null;
        }
      }
    }

    // add new data
    let newOwned = {
        apps: [],
        subs: []
      },
      numOwned = 0;
    if (hasApi) {
      apiJson.response.games.forEach(game => {
        const id = game.appid;
        if (!savedGames.apps[id]) {
          savedGames.apps[id] = {};
        }
        savedGames.apps[id].owned = true;
        newOwned.apps.push(id.toString());
        numOwned += 1;
      });
    }
    if (!altAccount) {
      if (hasStore) {
        [
          {
            jsonKey: `rgWishlist`,
            key: `wishlisted`,
            type: `apps`
          },
          {
            jsonKey: `rgOwnedApps`,
            key: `owned`,
            type: `apps`
          },
          {
            jsonKey: `rgOwnedPackages`,
            key: `owned`,
            type: `subs`
          },
          {
            jsonKey: `rgIgnoredApps`,
            key: `ignored`,
            type: `apps`
          },
          {
            jsonKey: `rgIgnoredPackages`,
            key: `ignored`,
            type: `subs`
          }
        ].forEach(item => {
          const jsonKey = item.jsonKey;
          const key = item.key;
          const type = item.type;
          let ids = [];
          if (Array.isArray(storeJson[jsonKey])) {
            ids = storeJson[jsonKey];
          } else {
            ids = Object.keys(storeJson[jsonKey]);
          }
          for (const id of ids) {
            if (!savedGames[type][id]) {
              savedGames[type][id] = {};
            }
            const value = savedGames[type][id][key];
            savedGames[type][id][key] = true;
            if (key === `owned` && !value) {
              newOwned[type].push(id.toString());
              numOwned += 1;
            }
          }
        });
      }

      if (numOwned !== (await this.getValue(`ownedGames`, 0))) {
        await this.setValue(`ownedGames`, numOwned);
      }

      // get the wishlisted dates
      try {
        const responseText = (await this.request({
            method: `GET`,
            url: `http://store.steampowered.com/wishlist/profiles/${this.esgst.steamId}?l=en`
          })).responseText,
          match = responseText.match(/g_rgWishlistData\s=\s(\[(.+?)]);/);
        if (match) {
          JSON.parse(match[1]).forEach(item => {
            /**
             * @property {string} item.appid
             * @property {boolean} item.added
             */
            const id = item.appid;
            if (!savedGames.apps[id]) {
              savedGames.apps[id] = {};
            }
            savedGames.apps[id].wishlisted = item.added;
          });
        }
      } catch (e) { /**/
      }

      await this.lockAndSaveGames(savedGames);
    }

    const removedOwned = {
      apps: [],
      subs: []
    };
    const addedOwned = {
      apps: [],
      subs: []
    };
    oldOwned.apps.forEach(id => {
      if (newOwned.apps.indexOf(id) < 0) {
        removedOwned.apps.push({
          attributes: {
            href: `http://store.steampowered.com/app/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    oldOwned.subs.forEach(id => {
      if (newOwned.subs.indexOf(id) < 0) {
        removedOwned.subs.push({
          attributes: {
            href: `http://store.steampowered.com/sub/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    newOwned.apps.forEach(id => {
      if (oldOwned.apps.indexOf(id) < 0) {
        addedOwned.apps.push({
          attributes: {
            href: `http://store.steampowered.com/app/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    newOwned.subs.forEach(id => {
      if (oldOwned.subs.indexOf(id) < 0) {
        addedOwned.subs.push({
          attributes: {
            href: `http://store.steampowered.com/sub/${id}`
          },
          text: id,
          type: `a`
        }, {
          text: `, `,
          type: `node`
        });
      }
    });
    if (altAccount && (removedOwned.apps.length > 0 || removedOwned.subs.length > 0 || addedOwned.apps.length > 0 || addedOwned.subs.length > 0)) {
      syncer.html.push({
        type: `br`,
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: `Alt Account - ${altAccount.name}`,
        type: `div`
      }, {
        type: `br`
      });
    }
    removedOwned.apps.pop();
    removedOwned.subs.pop();
    addedOwned.apps.pop();
    addedOwned.subs.pop();
    if (removedOwned.apps.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Removed apps:`,
          type: `span`
        }, ...removedOwned.apps]
      });
    }
    if (removedOwned.subs.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Removed packages:`,
          type: `span`
        }, ...removedOwned.subs]
      });
    }
    if (addedOwned.apps.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Added apps:`,
          type: `span`
        }, ...addedOwned.apps]
      });
    }
    if (addedOwned.subs.length > 0) {
      syncer.html.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Added packages:`,
          type: `span`
        }, ...addedOwned.subs]
      });
    }
  }

  async getGameNames(syncer) {
    const elements = syncer.results.getElementsByTagName(`a`);
    for (let i = elements.length - 1; i > -1; --i) {
      const element = elements[i],
        match = element.getAttribute(`href`).match(/\/(app|sub)\/(.+)/);
      if (!match) continue;
      const id = match[2],
        response = await this.request({
          method: `GET`,
          url: `http://store.steampowered.com/api/${match[1] === `app` ? `appdetails?appids` : `packagedetails?packageids`}=${id}&filters=basic`
        });
      try {
        element.textContent = JSON.parse(response.responseText)[id].data.name;
      } catch (e) {
        element.classList.add(`esgst-red`);
        element.title = `Unable to retrieve name for this game`;
      }
    }
  }

  async lockAndSaveGiveaways(giveaways, firstRun) {
    if (!Object.keys(giveaways).length) return;

    let deleteLock;
    let savedGiveaways;
    if (firstRun) {
      savedGiveaways = this.esgst.giveaways;
    } else {
      deleteLock = await this.createLock(`giveawayLock`, 300);
      savedGiveaways = JSON.parse(await this.getValue(`giveaways`, `{}`));
    }
    for (let key in giveaways) {
      if (giveaways.hasOwnProperty(key)) {
        if (savedGiveaways[key]) {
          for (let subKey in giveaways[key]) {
            if (giveaways[key].hasOwnProperty(subKey)) {
              savedGiveaways[key][subKey] = giveaways[key][subKey];
              this.esgst.edited.giveaways = true;
            }
          }
        } else {
          savedGiveaways[key] = giveaways[key];
          this.esgst.edited.giveaways = true;
        }
      }
    }
    if (!firstRun) {
      await this.setValue(`giveaways`, JSON.stringify(savedGiveaways));
      deleteLock();
    }
  }

  async lockAndSaveDiscussions(discussions) {
    let deleteLock = await this.createLock(`discussionLock`, 300),
      savedDiscussions = JSON.parse(await this.getValue(`discussions`, `{}`));
    for (let key in discussions) {
      if (discussions.hasOwnProperty(key)) {
        if (savedDiscussions[key]) {
          for (let subKey in discussions[key]) {
            if (discussions[key].hasOwnProperty(subKey)) {
              savedDiscussions[key][subKey] = discussions[key][subKey];
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
    await this.setValue(`discussions`, JSON.stringify(savedDiscussions));
    deleteLock();
  }

  async lockAndSaveGroups(groups, sync) {
    const deleteLock = await this.createLock(`groupLock`, 300);
    let savedGroups = JSON.parse(await this.getValue(`groups`, `[]`));
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
          const html = parseHtml((await this.request({method: `GET`, url: `/group/${code}/`})).responseText);
          savedGroup.avatar = html.getElementsByClassName(`global__image-inner-wrap`)[0].style.backgroundImage.match(/\/avatars\/(.+)_full/)[1];
          savedGroup.steamId = html.getElementsByClassName(`sidebar__shortcut-inner-wrap`)[0].firstElementChild.getAttribute(`href`).match(/\d+/)[0];
        }
      }
    }
    await this.setValue(`groups`, JSON.stringify(savedGroups));
    deleteLock();
  }

  lookForPopups(response) {
    const popup = parseHtml(response.responseText).querySelector(`.popup--gift-sent, .popup--gift-received`);
    if (!popup) {
      return;
    }
    document.body.appendChild(popup);
    new Popup({addScrollable: true, icon: ``, isTemp: true, title: ``, popup: popup}).open();
    if (!this.esgst.st) {
      return;
    }
    const links = popup.querySelectorAll(`a`);
    for (const link of links) {
      const url = link.getAttribute(`href`);
      if (!url) {
        continue;
      }
      link.setAttribute(`href`, url.replace(/^\//, `https://www.steamgifts.com/`));
    }
  }

  async getWonGames(count, syncer) {
    const savedGames = JSON.parse(await this.getValue(`games`));
    if (syncer) {
      for (const id in savedGames.apps) {
        if (savedGames.apps.hasOwnProperty(id)) {
          if (savedGames.apps[id].won) {
            savedGames.apps[id].won = null;
          }
        }
      }
      for (const id in savedGames.subs) {
        if (savedGames.subs.hasOwnProperty(id)) {
          if (savedGames.subs[id].won) {
            savedGames.subs[id].won = null;
          }
        }
      }
    }
    let lastPage = null,
      nextPage = 1,
      pagination = null;
    do {
      if (syncer) {
        syncer.progress.lastElementChild.textContent = `Syncing your won games (page ${nextPage}${lastPage ? ` of ${lastPage}` : ``})...`;
      }
      const responseHtml = parseHtml((await this.request({
          method: `GET`,
          url: `/giveaways/won/search?page=${nextPage}`
        })).responseText),
        elements = responseHtml.getElementsByClassName(`table__row-outer-wrap`);
      if (!lastPage) {
        lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(responseHtml);
      }
      for (const element of elements) {
        if (element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden), .table__column--gift-feedback .trigger-popup .icon-red`)) continue;
        const info = await this.esgst.modules.games.games_getInfo(element);
        if (!info) continue;
        if (!savedGames[info.type][info.id]) {
          savedGames[info.type][info.id] = {};
        }
        savedGames[info.type][info.id].won = 1;
      }
      nextPage += 1;
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
    } while (syncer && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    await this.lockAndSaveGames(savedGames);
    this.setLocalValue(`wonCount`, count);
  }

  saveAndSortContent(key, mainKey, options) {
    this.sortContent(this.esgst[mainKey], mainKey, options.value);
    // noinspection JSIgnoredPromiseFromCall
    this.setSetting(key, options.value);
  }

  observeChange(context, id, key = `value`, event = `change`) {
    context.addEventListener(event, () => {
      let value = context[key];
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(id, value);
      this.esgst[id] = value;
    });
  }

  observeNumChange(context, id, key = `value`) {
    this.esgst[id] = parseFloat(this.esgst[id]);
    context.addEventListener(`change`, () => {
      let value = parseFloat(context[key]);
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(id, value);
      this.esgst[id] = value;
    });
  }

  async checkMissingDiscussions(refresh, callback) {
    let rows = document.getElementsByClassName(`table__rows`);
    let numDiscussions = 0;
    let numDeals = 0;
    let filteredDiscussions = 0;
    let filteredDeals = 0;
    if (refresh) {
      rows[0].innerHTML = ``;
      rows[1].innerHTML = ``;
    } else {
      let preset = null;
      if (this.esgst.df && this.esgst.df_m && this.esgst.df_enable) {
        let name = this.esgst.df_preset;
        if (name) {
          let i;
          for (i = this.esgst.df_presets.length - 1; i > -1 && this.esgst.df_presets[i].name !== name; i--) {
          }
          if (i > -1) {
            preset = this.esgst.df_presets[i];
          }
        }
      }
      if (preset) {
        const filters = this.esgst.modules.discussionsDiscussionFilters.df_getFilters();
        (await this.esgst.modules.discussions.discussions_get(rows[0], true)).forEach(discussion => {
          if (!this.esgst.modules.filters.filters_filterItem(`df`, filters, discussion, preset.rules)) {
            discussion.outerWrap.remove();
            filteredDiscussions += 1;
          } else {
            numDiscussions += 1;
          }
        });
        (await this.esgst.modules.discussions.discussions_get(rows[1], true)).forEach(deal => {
          if (!this.esgst.modules.filters.filters_filterItem(`df`, filters, deal, preset.rules)) {
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
        this.request({method: `GET`, url: `/discussions`}),
        this.request({method: `GET`, url: `/discussions/deals`})
      ]);
      let response1Html = parseHtml(response1.responseText);
      let response2Html = parseHtml(response2.responseText);
      let revisedElements = [];
      let preset = null;
      if (this.esgst.df && this.esgst.df_m && this.esgst.df_enable) {
        let name = this.esgst.df_preset;
        if (name) {
          let i;
          for (i = this.esgst.df_presets.length - 1; i > -1 && this.esgst.df_presets[i].name !== name; i--) {
          }
          if (i > -1) {
            preset = this.esgst.df_presets[i];
          }
        }
      }
      (await this.esgst.modules.discussions.discussions_get(response1Html, true)).forEach(element => {
        if (element.category !== `Deals`) {
          revisedElements.push(element);
        }
      });
      const filters = this.esgst.modules.discussionsDiscussionFilters.df_getFilters();
      let i = revisedElements.length - (numDiscussions + filteredDiscussions + 1);
      while (numDiscussions < 5 && i > -1) {
        if (!preset || this.esgst.modules.filters.filters_filterItem(`df`, filters, revisedElements[i], preset.rules)) {
          this.setMissingDiscussion(revisedElements[i]);
          rows[0].appendChild(revisedElements[i].outerWrap);
          numDiscussions += 1;
        }
        i -= 1;
      }
      let elements = await this.esgst.modules.discussions.discussions_get(response2Html, true);
      i = elements.length - (numDeals + filteredDeals + 1);
      while (numDeals < 5 && i > -1) {
        if (!preset || this.esgst.modules.filters.filters_filterItem(`df`, filters, elements[i], preset.rules)) {
          this.setMissingDiscussion(elements[i]);
          rows[1].appendChild(elements[i].outerWrap);
          numDeals += 1;
        }
        i -= 1;
      }
      if (this.esgst.adots) {
        this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load(refresh);
      } else if (this.esgst.radb && !refresh) {
        this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
      }
      if (refresh) {
        await this.endless_load(this.esgst.activeDiscussions);
      }
      if (callback) {
        callback();
      }
    } else {
      if (this.esgst.adots) {
        this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load();
      } else if (this.esgst.radb && !refresh) {
        this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
      }
      if (callback) {
        callback();
      }
    }
  }

  loadMenu(tab) {
    let Container, SMManageFilteredUsers, popup, fixed;

    /** @type {HTMLInputElement} */
    let SMAPIKey;

    if (tab) {
      this.createElements(this.esgst.mainContext, `inner`, [{
        type: `div`
      }, {
        attributes: {
          class: `esgst-popup-scrollable`
        },
        type: `div`
      }]);
      fixed = this.esgst.mainContext.firstElementChild;
      Container = fixed.nextElementSibling;
    } else {
      popup = new Popup({addScrollable: true, icon: `fa-gear`, isTemp: true, settings: true, title: `Settings`});
      popup.description.classList.add(`esgst-text-left`);
      fixed = popup.description;
      Container = popup.scrollable;
    }
    this.createElements(fixed, `afterBegin`, [{
      attributes: {
        class: `esgst-page-heading`
      },
      type: `div`
    }, {
      attributes: {
        class: `esgst-clear-container`
      },
      type: `div`,
      children: [{
        attributes: {
          placeholder: `Filter features...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `esgst-clear-button esgst-hidden`,
          title: `Clear`
        },
        text: `X`,
        type: `span`
      }]
    }]);
    this.createElements(Container, `inner`, [{
      attributes: {
        class: `esgst-settings-menu`
      },
      type: `div`
    }]);
    const input = fixed.firstElementChild.nextElementSibling.firstElementChild;
    input.addEventListener(`input`, this.filterSm.bind(this));
    input.addEventListener(`change`, this.filterSm.bind(this));
    this.setClearButton(input);
    let heading = fixed.getElementsByClassName(`esgst-page-heading`)[0];
    this.createSMButtons(heading, [{
      Check: true,
      Icons: [`fa-refresh`],
      Name: `esgst-heading-button`,
      Title: `Sync data`
    }, {
      Check: true,
      Icons: [`fa-sign-in esgst-rotate-90`],
      Name: `esgst-heading-button`,
      Title: `Restore data`
    }, {
      Check: true,
      Icons: [`fa-sign-out esgst-rotate-270`],
      Name: `esgst-heading-button`,
      Title: `Backup data`
    }, {
      Check: true,
      Icons: [`fa-trash`],
      Name: `esgst-heading-button`,
      Title: `Delete data`
    }, {
      Check: true,
      Icons: [`fa-gear`, `fa-arrow-circle-down`],
      Name: `esgst-heading-button`,
      Title: `Download settings (downloads your settings to your computer without your personal data so you can easily share them with other users)`
    }, {
      Check: true,
      Icons: [`fa-paint-brush`],
      Name: `esgst-heading-button`,
      Title: `Clean old data`
    }, {
      Check: true,
      Icons: [`fa-user`, `fa-history`],
      Name: `SMViewUsernameChanges esgst-heading-button`,
      Title: `View recent username changes`
    }, {
      Check: this.esgst.uf,
      Icons: [`fa-user`, `fa-eye-slash`],
      Name: `SMManageFilteredUsers esgst-heading-button`,
      Title: `See list of filtered users`
    }, {
      Check: this.esgst.sg && this.esgst.gf && this.esgst.gf_s,
      Icons: [`fa-gift`, `fa-eye-slash`],
      Name: `SMManageFilteredGiveaways esgst-heading-button`,
      Title: `Manage hidden giveaways`
    }, {
      Check: this.esgst.sg && this.esgst.df && this.esgst.df_s,
      Icons: [`fa-comments`, `fa-eye-slash`],
      Name: `SMManageFilteredDiscussions esgst-heading-button`,
      Title: `Manage hidden discussions`
    }, {
      Check: this.esgst.sg && this.esgst.dt,
      Icons: [`fa-comments`, `fa-tags`],
      Name: `SMManageDiscussionTags esgst-heading-button`,
      Title: `Manage discussion tags`
    }, {
      Check: this.esgst.sg && this.esgst.ut,
      Icons: [`fa-user`, `fa-tags`],
      Name: `SMManageUserTags esgst-heading-button`,
      Title: `Manage user tags`
    }, {
      Check: this.esgst.gt,
      Icons: [`fa-gamepad`, `fa-tags`],
      Name: `SMManageGameTags esgst-heading-button`,
      Title: `Manage game tags`
    }, {
      Check: this.esgst.gpt,
      Icons: [`fa-users`, `fa-tags`],
      Name: `SMManageGroupTags esgst-heading-button`,
      Title: `Manage group tags`
    }, {
      Check: this.esgst.wbc,
      Icons: [`fa-heart`, `fa-ban`, `fa-cog`],
      Name: `esgst-wbc-button esgst-heading-button`,
      Title: `Manage Whitelist / Blacklist Checker caches`
    }, {
      Check: this.esgst.namwc,
      Icons: [`fa-trophy`, `fa-cog`],
      Name: `esgst-namwc-button esgst-heading-button`,
      Title: `Manage Not Activated / Multiple Wins Checker caches`
    }, {
      Check: true,
      Icons: [`fa-steam`],
      Name: `esgst-heading-button`,
      Title: `Request access to the Steam group`
    }]);
    Container.style.maxHeight = `${innerHeight - (Container.offsetTop + 69)}px`;
    let SMMenu = Container.getElementsByClassName(`esgst-settings-menu`)[0];
    let i, type;
    i = 1;
    for (type in this.esgst.features) {
      if (this.esgst.features.hasOwnProperty(type)) {
        if (type !== `trades` || this.esgst.settings.esgst_st) {
          let id, j, section, title, isNew = false;
          title = type.replace(/^./, m => {
            return m.toUpperCase()
          });
          section = this.createMenuSection(SMMenu, null, i, title, type);
          j = 1;
          for (id in this.esgst.features[type].features) {
            if (this.esgst.features[type].features.hasOwnProperty(id)) {
              let feature, ft;
              feature = this.esgst.features[type].features[id];
              if (!feature.extensionOnly || this._USER_INFO.extension) {
                ft = this.getSMFeature(feature, id, j);
                if (ft) {
                  if (ft.isNew) {
                    isNew = true;
                  }
                  section.lastElementChild.appendChild(ft.menu);
                  j += 1;
                }
              }
            }
          }
          if (isNew) {
            this.createElements(section.firstElementChild.lastElementChild, `afterBegin`, [{
              attributes: {
                class: `esgst-bold esgst-red`,
                title: `There is a new feature/option in this section`
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa fa-star`
                },
                type: `i`
              }]
            }]);
          }
          i += 1;
        }
      }
    }
    const elementOrdering = this.createMenuSection(SMMenu, null, i, `Element Ordering`);
    this.setElementOrderingSection(elementOrdering.lastElementChild);
    i += 1;
    this.createMenuSection(SMMenu, [{
      attributes: {
        class: `esgst-steam-api-key`,
        type: `text`
      },
      type: `input`
    }, {
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `This is optional for syncing owned games faster and required for syncing alt accounts. Get a Steam API Key `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`,
          href: `https://steamcommunity.com/dev/apikey`,
          target: `_blank`
        },
        text: `here`,
        type: `a`
      }, {
        text: `. You can enter any domain in there, it is irrelevant, for example, "https://www.steamgifts.com".`,
        type: `node`
      }]
    }], i, `Steam API Key`);
    SMManageFilteredUsers = fixed.getElementsByClassName(`SMManageFilteredUsers`)[0];
    let SMManageFilteredGiveaways = fixed.getElementsByClassName(`SMManageFilteredGiveaways`)[0];
    let SMManageFilteredDiscussions = fixed.getElementsByClassName(`SMManageFilteredDiscussions`)[0];
    let SMManageDiscussionTags = fixed.getElementsByClassName(`SMManageDiscussionTags`)[0];
    let SMManageUserTags = fixed.getElementsByClassName(`SMManageUserTags`)[0];
    let SMManageGameTags = fixed.getElementsByClassName(`SMManageGameTags`)[0];
    let SMManageGroupTags = fixed.getElementsByClassName(`SMManageGroupTags`)[0];
    let SMViewUsernameChanges = fixed.getElementsByClassName(`SMViewUsernameChanges`)[0];
    if (this.esgst.wbc) {
      this.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton(null, fixed.getElementsByClassName(`esgst-wbc-button`)[0]);
    }
    if (this.esgst.namwc) {
      this.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup({
        button: fixed.getElementsByClassName(`esgst-namwc-button`)[0],
        isMenu: true
      });
    }
    SMAPIKey = /** @type {HTMLInputElement} */ Container.getElementsByClassName(`esgst-steam-api-key`)[0];
    let key = this.esgst.steamApiKey;
    if (key) {
      SMAPIKey.value = key;
    }
    heading.firstElementChild.addEventListener(`click`, async () => {
      heading.firstElementChild.classList.add(`esgst-busy`);
      await this.checkSync(true, true);
      heading.firstElementChild.classList.remove(`esgst-busy`);
    });
    heading.firstElementChild.nextElementSibling.addEventListener(`click`, this.loadDataManagement.bind(this, false, `import`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.addEventListener(`click`, this.loadDataManagement.bind(this, false, `export`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, this.loadDataManagement.bind(this, false, `delete`, null));
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, this.exportSettings.bind(this));
    heading.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.addEventListener(`click`, this.loadDataCleaner.bind(this));
    if (this.esgst.groups) {
      for (i = this.esgst.groups.length - 1; i > -1 && this.esgst.groups[i].steamId !== `103582791461018688`; i--) {
      }
      if (i < 0 || !this.esgst.groups[i] || !this.esgst.groups[i].member) {
        heading.lastElementChild.addEventListener(`click`, this.requestGroupInvite.bind(this));
      } else {
        heading.lastElementChild.classList.add(`esgst-hidden`);
      }
    } else {
      heading.lastElementChild.classList.add(`esgst-hidden`);
    }
    if (SMManageDiscussionTags) {
      SMManageDiscussionTags.addEventListener(`click`, this.openManageDiscussionTagsPopup.bind(this));
    }
    if (SMManageUserTags) {
      SMManageUserTags.addEventListener(`click`, this.openManageUserTagsPopup.bind(this));
    }
    if (SMManageGameTags) {
      SMManageGameTags.addEventListener(`click`, this.openManageGameTagsPopup.bind(this));
    }
    if (SMManageGroupTags) {
      SMManageGroupTags.addEventListener(`click`, this.openManageGroupTagsPopup.bind(this));
    }
    if (SMManageFilteredUsers) {
      this.setSMManageFilteredUsers(SMManageFilteredUsers);
    }
    if (SMManageFilteredGiveaways) {
      this.setSMManageFilteredGiveaways(SMManageFilteredGiveaways);
    }
    if (SMManageFilteredDiscussions) {
      SMManageFilteredDiscussions.addEventListener(`click`, this.esgst.modules.discussionsDiscussionFilters.df_menu.bind(this.esgst.modules.discussionsDiscussionFilters, {}));
    }
    if (SMViewUsernameChanges) {
      this.setSMRecentUsernameChanges(SMViewUsernameChanges);
    }
    SMAPIKey.addEventListener(`input`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`steamApiKey`, SMAPIKey.value);
    });
    if (!tab) {
      popup.open();
      if (this.esgst.firstInstall) {
        let pp = new Popup({addScrollable: true, icon: `fa-check`, isTemp: true, title: `Getting Started`});
        this.createElements(pp.scrollable, `inner`, [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Here are some things you should know to help you get started:`,
          type: `div`
        }, {
          type: `br`
        }, {
          attributes: {
            class: `markdown`
          },
          type: `div`,
          children: [{
            type: `ul`,
            children: [{
              type: `li`,
              children: [{
                text: `Bugs and suggestions should be reported on the `,
                type: `node`
              }, {
                attributes: {
                  href: `https://github.com/gsrafael01/ESGST/issues`
                },
                text: `GitHub page`,
                type: `a`
              }, {
                text: `.`,
                type: `node`
              }]
            }, {
              text: `Make sure you backup your data using the backup button at the top of the menu every once in a while to prevent any data loss that might occur. It's also probably a good idea to disable automatic updates, since ESGST is in constant development.`,
              type: `node`
            }, {
              type: `li`,
              children: [{
                text: `Hover over the `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-question-circle`
                },
                type: `i`
              }, {
                text: ` icon next to each option that has it to learn more about it and how to use it. Some options are currently missing documentation, so feel free to ask about them in the official ESGST thread.`,
                type: `node`
              }]
            }, {
              type: `li`,
              children: [{
                text: `Some features rely on sync to work properly. These features have a `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-refresh esgst-negative`
                },
                type: `i`
              }, {
                text: ` icon next to their names, and when you hover over the icon you can see what type of data you have to sync. You should sync often to keep your data up-to-date. ESGST offers an option to automatically sync your data for you every amount of days so you don't have to do it manually. To enable the automatic sync, simply go to the sync section of the menu (section 1) and select the number of days in the dropdown.`,
                type: `node`
              }]
            }, {
              type: `li`,
              children: [{
                text: `ESGST uses 2 terms to define a window opened in the same page: `,
                type: `node`
              }, {
                text: `popout`,
                type: `strong`
              }, {
                text: ` is when the window opens up, down, left or right from the element you clicked/hovered over (like the one you get with the description of the features) and `,
                type: `node`
              }, {
                text: `popup`,
                type: `strong`
              }, {
                text: ` is when the window opens in the center of the screen with a modal background behind it (like this one).`,
                type: `node`
              }]
            }, {
              text: `That's all for now, you can close this.`,
              type: `li`
            }]
          }]
        }]);
        pp.open();
        this.esgst.firstInstall = false;
      }
    }
  }

  setElementOrderingSection(context) {
    const obj = {
      elementOrdering: true,
      outerWrap: this.createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-element-ordering-container`
        },
        type: `div`
      }])
    };
    const obj_gv = {
      elementOrdering: true,
      outerWrap: this.createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-element-ordering-container`
        },
        type: `div`
      }])
    };
    const items = [{
      includeGridView: true,
      group: `giveaways`,
      id: `gc_categories`,
      key: `gcPanel`,
      name: `Game Categories`,
      labels: {
        gc_fcv: `Full CV`,
        gc_rcv: `Reduced CV`,
        gc_ncv: `No CV`,
        gc_h: `Hidden`,
        gc_i: `Ignored`,
        gc_o: `Owned`,
        gc_w: `Wishlisted`,
        gc_f: `Followed`,
        gc_pw: `Previously Won`,
        gc_a: `Achievements`,
        gc_sp: `Singleplayer`,
        gc_mp: `Multiplayer`,
        gc_sc: `Steam Cloud`,
        gc_tc: `Trading Cards`,
        gc_l: `Linux`,
        gc_m: `Mac`,
        gc_ea: `Early Access`,
        gc_lg: `Learning`,
        gc_rm: `Removed`,
        gc_dlc: `DLC`,
        gc_p: `Package`,
        gc_gi: `Giveaway Info`,
        gc_r: `Rating`,
        gc_hltb: `HLTB`,
        gc_rd: `Release Date`,
        gc_g: `Genres`
      }
    }, {
      includeGridView: true,
      group: `giveaways`,
      id: `giveawayHeading`,
      key: `heading`,
      name: `Giveaway Heading`,
      labels: {
        gr: `Giveaway Recreator`,
        gb: `Giveaway Bookmarks`,
        gf: `Giveaway Filters`,
        egh: `Entered Game Highlighter`,
        name: `Game Name`,
        points: `Points`,
        copies: `Copies`,
        steam: `Steam Link`,
        search: `Search Link`,
        hideGame: `Hide Game`,
        gt: `Game Tags`
      }
    }, {
      group: `giveaways`,
      id: `giveawayColumns`,
      key: `columns`,
      name: `Giveaway Columns`,
      labels: {
        ged: `Giveaway Encrypter/Decrypter`,
        endTime: `End Time`,
        winners: `Winners`,
        startTime: `Start Time`,
        touhou: `Touhou`,
        inviteOnly: `Invite Only`,
        whitelist: `Whitelist`,
        group: `Group`,
        regionRestricted: `Region Restricted`,
        level: `Level`
      }
    }, {
      isGridView: true,
      group: `giveaways_gv`,
      id: `giveawayColumns_gv`,
      key: `gvIcons`,
      name: `Giveaway Columns`,
      labels: {
        sgTools: `SGTools`,
        ged: `Giveaway Encrypter/Decrypter`,
        time: `End/Start Time`,
        touhou: `Touhou`,
        inviteOnly: `Invite Only`,
        whitelist: `Whitelist`,
        group: `Group`,
        regionRestricted: `Region Restricted`,
        level: `Level`
      }
    }, {
      group: `giveaways`,
      id: `giveawayPanel`,
      key: `panel`,
      name: `Giveaway Panel`,
      labels: {
        ttec: `Time To Enter Calculator`,
        gwc: `Giveaway Winning Chance`,
        gwr: `Giveaway Winning Ratio`,
        gptw: `Giveaway Points To Win`,
        gp: `Giveaway Popup`,
        elgb: `Enter/Leave Giveaway Button`,
        sgTools: `SGTools`
      }
    }, {
      isGridView: true,
      group: `giveaways_gv`,
      id: `giveawayPanel_gv`,
      key: `panel`,
      name: `Giveaway Panel`,
      labels: {
        ttec: `Time To Enter Calculator`,
        gwc: `Giveaway Winning Chance`,
        gwr: `Giveaway Winning Ratio`,
        gptw: `Giveaway Points To Win`,
        gp: `Giveaway Popup`,
        elgb: `Enter/Leave Giveaway Button`
      }
    }, {
      includeGridView: true,
      group: `giveaways`,
      id: `giveawayLinks`,
      key: `links`,
      name: `Giveaway Links`,
      labels: {
        entries: `Entries`,
        winners_count: `Winners Count`,
        comments: `Comments`
      }
    }, {
      group: `mainPageHeading`,
      id: `leftButtonIds`,
      key: `leftButtons`,
      name: `Left Main Page Heading Buttons (Hidden)`,
      tooltip: `Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the left side of the heading.`,
      labels: {}
    }, {
      group: `mainPageHeading`,
      id: `rightButtonIds`,
      key: `rightButtons`,
      name: `Right Main Page Heading Buttons (Hidden)`,
      tooltip: `Moving an element to this group will hide it from the main page heading. It will be accessible by clicking on the button with the vertical ellipsis located at the  right side of the heading.`,
      labels: {}
    },{
      group: `mainPageHeading`,
      id: `leftMainPageHeadingIds`,
      key: `leftMainPageHeadingButtons`,
      name: `Left Main Page Heading Buttons`,
      labels: {
        aic: `Attached Images Carousel`,
        as:  `Archive Searcher`,
        cec: `Comment/Entry Checker`,
        cf: `Comment Filters`,
        cs: `Comment Searcher`,
        ctGo: `Comment Tracker (Go To Unread)`,
        ctRead: `Comment Tracker (Mark As Read)`,
        ctUnread: `Comment Tracker (Mark As Unread)`,
        df: `Discussion Filters`,
        ds: `Discussion Sorter`,
        gas: `Giveaway Sorter`,
        ge: `Giveaway Extractor`,
        gf: `Giveaway Filters`,
        glwc: `Group Library/Wishlist Checker`,
        gts: `Giveaway Templates`,
        gv: `Grid View`,
        hgr: `Hidden Games Remover`,
        mpp: `Main Post Popup`,
        namwc: `Not Activated/Multiple Wins Checker`,
        rbp: `Reply Box Popup`,
        sks: `Sent Keys Searcher`,
        tb: `Trade Bumper`,
        ugs: `Unsent Gifts Sender`,
        ust: `User Suspension Tracker`,
        wbc: `Whitelist/Blacklist Checker`,
        wbm: `Whitelist/Blacklist Manager`,
        wbsAsc: `Whitelist/Blacklist Sorter (Ascending)`,
        wbsDesc: `Whitelist/Blacklist Sorter (Descending)`
      }
    },{
      group: `mainPageHeading`,
      id: `rightMainPageHeadingIds`,
      key: `rightMainPageHeadingButtons`,
      name: `Right Main Page Heading Buttons`,
      labels: {
        esContinuous: `Endless Scrolling (Continuously Load)`,
        esNext: `Endless Scrolling (Load Next),`,
        esResume: `Endless Scrolling (Resume)`,
        esPause: `Endless Scrolling (Pause)`,
        esRefresh: `Endless Scrolling (Refresh)`,
        esRefreshAll: `Endless Scrolling (Refresh All)`,
        mm: `Multi-Manager`,
        stbb: `Scroll To Bottom Button`,
        sttb: `Scroll To Top Button`
      }
    }];
    for  (const item of items) {
      const children = [];
      for (const id in item.labels) {
        if (!item.labels.hasOwnProperty(id)) {
          continue;
        }
        children.push({
          attributes: {
            [`data-draggable-id`]: id,
            [`data-draggable-group`]: item.group
          },
          text: item.labels[id],
          type: `div`
        });
      }
      const section = this.createElements((item.isGridView ? obj_gv : obj).outerWrap, `beforeEnd`, [{
        text: `${item.name}${item.isGridView ? ` (Grid View)` : ``}`,
        type: `strong`
      }, item.tooltip ? {
        attributes: {
          class: `fa fa-question-circle`,
          title: item.tooltip
        },
        type: `i`
      } : null,{
        attributes: {
          class: `esgst-element-ordering-box`
        },
        type: `div`,
        children
      }]);
      (item.isGridView ? obj_gv : obj).outerWrap.insertBefore(new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-undo`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Reset`,
        title2: `Resetting`,
        callback1: this.resetElementOrdering.bind(this, item.id, obj, obj_gv)
      }).set, section);
      (item.isGridView ? obj_gv : obj)[item.key] = section;
      section.addEventListener(`dragenter`, this.draggable_enter.bind(this, {
        context: section,
        item: {
          outerWrap: section
        }
      }));
      this.draggable_set({
        context: section,
        id: item.id,
        item: {
          outerWrap: section
        }
      });
      if (item.includeGridView) {
        const children_gv = [];
        for (const id in item.labels) {
          if (!item.labels.hasOwnProperty(id)) {
            return;
          }
          children_gv.push({
            attributes: {
              [`data-draggable-id`]: id,
              [`data-draggable-group`]: `${item.group}_gv`
            },
            text: item.labels[id],
            type: `div`
          });
        }
        const section_gv = this.createElements(obj_gv.outerWrap, `beforeEnd`, [{
          text: `${item.name} (Grid View)`,
          type: `strong`
        }, {
          attributes: {
            class: `esgst-element-ordering-box`
          },
          type: `div`,
          children: children_gv
        }]);
        obj_gv.outerWrap.insertBefore(new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-undo`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Reset`,
          title2: `Resetting`,
          callback1: this.resetElementOrdering.bind(this, `${item.id}_gv`, obj, obj_gv)
        }).set, section_gv);
        obj_gv[item.key] = section_gv;
        section_gv.addEventListener(`dragenter`, this.draggable_enter.bind(this, {
          context: section_gv,
          item: {
            outerWrap: section_gv
          }
        }));
        this.draggable_set({
          context: section_gv,
          id: `${item.id}_gv`,
          item: {
            outerWrap: section_gv
          }
        });
      }
    }
    this.esgst.modules.giveaways.giveaways_reorder(obj);
    this.esgst.modules.giveaways.giveaways_reorder(obj_gv);
    this.reorderButtons(obj);
  }

  async resetElementOrdering(id, obj, obj_gv) {
    this.esgst[id] = this.esgst.settings[id] = this.esgst.defaultValues[id];
    await this.setValue(`settings`, JSON.stringify(this.esgst.settings));
    this.esgst.modules.giveaways.giveaways_reorder(obj);
    this.esgst.modules.giveaways.giveaways_reorder(obj_gv);
    this.reorderButtons(obj);
  }

  openPathsPopup(feature, id, name) {
    let obj = {
      excludeItems: [],
      includeItems: [],
      name: name,
      popup: new Popup({addScrollable: true, icon: `fa-gear`, title: `[${name.toUpperCase()}] ${feature.name}`})
    };
    obj.popup.description.classList.add(`esgst-text-left`);
    obj.include = this.createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `div`,
      children: [{
        text: `Include: `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Enter the paths where you want the feature to run here. You need to use regular expressions, so if you are not familiar with them, just to go to the page where you want the feature to run and click 'Add Current'. '.*' means that the feature runs everywhere possible.`
        },
        type: `i`
      }]
    }, {
      type: `div`
    }]);
    let group = this.createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-button-group`
      },
      type: `div`
    }]);
    group.appendChild(new ButtonSet({
      color1: `grey`,
      color2: ``,
      icon1: `fa-plus-circle`,
      icon2: ``,
      title1: `Add New`,
      title2: ``,
      callback1: this.addPath.bind(this, feature, `include`, obj, {enabled: 1, pattern: ``})
    }).set);
    group.appendChild(new ButtonSet({
      color1: `grey`,
      color2: ``,
      icon1: `fa-plus-circle`,
      icon2: ``,
      title1: `Add Current`,
      title2: ``,
      callback1: this.addPath.bind(this, feature, `include`, obj, {
        enabled: 1,
        pattern: `^${this.escapeRegExp(location.href.match(/\/($|giveaways(?!.*(new|wishlist|created|entered|won)))/) ? `/($|giveaways(?!.*(new|wishlist|created|entered|won)))` : location.pathname)}${this.escapeRegExp(location.search)}`
      })
    }).set);
    obj.exclude = this.createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `div`,
      children: [{
        text: `Exclude: `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Enter the paths where you do not want the feature to run here. This acts as an exception to the included paths, as in, the feature will run in every included path, except for the excluded paths. You need to use regular expressions, so if you are not familiar with them, just to go to the page where you do not want the feature to run and click 'Add Current'.`
        },
        type: `i`
      }]
    }, {
      type: `div`
    }]);
    group = this.createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-button-group`
      },
      type: `div`
    }]);
    group.appendChild(new ButtonSet({
      color1: `grey`,
      color2: ``,
      icon1: `fa-plus-circle`,
      icon2: ``,
      title1: `Add New`,
      title2: ``,
      callback1: this.addPath.bind(this, feature, `exclude`, obj, {enabled: 1, pattern: ``})
    }).set);
    group.appendChild(new ButtonSet({
      color1: `grey`,
      color2: ``,
      icon1: `fa-plus-circle`,
      icon2: ``,
      title1: `Add Current`,
      title2: ``,
      callback1: this.addPath.bind(this, feature, `exclude`, obj, {
        enabled: 1,
        pattern: `^${this.escapeRegExp(location.pathname)}${this.escapeRegExp(location.search)}`
      })
    }).set);
    obj.popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check-circle`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: this.savePaths.bind(this, id, obj)
    }).set);
    obj.setting = this.getFeaturePath(feature, id, obj.name);
    obj.setting.include.forEach(path => this.addPath(feature, `include`, obj, path));
    obj.setting.exclude.forEach(path => this.addPath(feature, `exclude`, obj, path));
    obj.popup.open();
  }

  addPath(feature, key, obj, path) {
    let item = {};
    item.container = this.createElements(obj[key], `beforeEnd`, [{
      type: `div`
    }]);
    item.switch = new ToggleSwitch(item.container, null, true, ``, false, false, null, path.enabled);
    item.input = this.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `esgst-switch-input esgst-switch-input-large`,
        type: `text`
      },
      type: `input`
    }]);
    item.input.value = path.pattern;
    item.input.addEventListener(`input`, this.validatePathRegex.bind(this, item));
    this.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-times-circle esgst-clickable`,
        title: `Remove`
      },
      type: `i`
    }]).addEventListener(`click`, this.removePath.bind(this, item, key, obj));
    item.invalid = this.createElements(item.container, `beforeEnd`, [{
      attributes: {
        class: `fa fa-exclamation esgst-hidden esgst-red`,
        title: `Invalid Regular Expression`
      },
      type: `i`
    }]);
    obj[`${key}Items`].push(item);
    if (key === `include` && feature.includeOptions) {
      item.options = [];
      const optionsContainer = this.createElements(item.container, `beforeEnd`, [{
        attributes: {
          class: `esgst-form-row-indent`
        },
        type: `div`
      }]);
      for (const option of feature.includeOptions) {
        item.options.push({
          id: option.id,
          switch: new ToggleSwitch(optionsContainer, null, true, option.name, false, false, null, !!(path.options && path.options[option.id]))
        });
      }
    }
    item.input.focus();
  }

  removePath(item, key, obj) {
    let i = obj[`${key}Items`].length - 1;
    if (i === 0 && key === `include`) {
      alert(`At least 1 include path is required!`);
      return;
    }
    while (i > -1 && obj[`${key}Items`][i].input.value !== item.input.value) i--;
    if (i > -1) {
      obj[`${key}Items`].splice(i, 1);
    }
    item.container.remove();
  }

  validatePathRegex(item) {
    item.invalid.classList.add(`esgst-hidden`);
    try {
      new RegExp(item.input.value);
    } catch (error) {
      console.log(error);
      item.invalid.classList.remove(`esgst-hidden`);
    }
  }

  savePaths(id, obj) {
    obj.setting.include = [];
    obj.setting.exclude = [];
    for (const item of obj.includeItems) {
      const setting = {
        enabled: item.switch.value ? 1 : 0,
        pattern: item.input.value
      };
      if (item.options) {
        setting.options = {};
        for (const option of item.options) {
          setting.options[option.id] = option.switch.value ? 1 : 0;
        }
      }
      obj.setting.include.push(setting);
    }
    for (const item of obj.excludeItems) {
      obj.setting.exclude.push({
        enabled: item.switch.value ? 1 : 0,
        pattern: item.input.value
      });
    }
    obj.popup.close();
    // noinspection JSIgnoredPromiseFromCall
    this.setSetting(`${id}_${obj.name}`, obj.setting);
  }

  dismissNewOption(id, event) {
    event.currentTarget.remove();
    if (this.esgst.dismissedOptions.indexOf(id) < 0) {
      this.esgst.dismissedOptions.push(id);
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`dismissedOptions`, this.esgst.dismissedOptions);
    }
  }

  getSMFeature(Feature, ID, aaa) {
    let Menu, SMFeatures, isMainNew = false;
    Menu = document.createElement(`div`);
    Menu.id = `esgst_${ID}`;
    this.createElements(Menu, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-small-number esgst-form-heading-number`
      },
      text: `${aaa}.`,
      type: `div`
    }]);
    let val, val1, val2;
    let siwtchSg, siwtchSt, set1, set2;
    if (Feature.sg) {
      set1 = this.getFeaturePath(Feature, ID, `sg`);
      val1 = set1.enabled;
      siwtchSg = new ToggleSwitch(Menu, ID, true, this.esgst.settings.esgst_st ? `[SG]` : ``, true, false, null, val1);
      this.createElements(Menu, `beforeEnd`, [{
        attributes: {
          class: `fa fa-gear esgst-clickable`,
          title: `Customize where the feature runs`
        },
        type: `i`
      }]).addEventListener(`click`, this.openPathsPopup.bind(this, Feature, ID, `sg`));
      if (Feature.conflicts) {
        siwtchSg.onEnabled = () => {
          for (let ci = 0, cn = Feature.conflicts.length; ci < cn; ++ci) {
            let setting = this.esgst.settings[`${Feature.conflicts[ci].id}_sg`];
            if ((setting.include && setting.enabled) || (!setting.include && setting)) {
              siwtchSg.disable();
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${Feature.conflicts[ci].name}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              ci = cn;
            }
          }
          if (Feature.theme && SMFeatures) {
            if (ID === `customTheme`) {
              // noinspection JSIgnoredPromiseFromCall
              this.setTheme();
            } else {
              this.updateTheme(SMFeatures);
            }
          }
        }
      } else if (Feature.theme) {
        siwtchSg.onEnabled = () => {
          if (SMFeatures) {
            if (ID === `customTheme`) {
              // noinspection JSIgnoredPromiseFromCall
              this.setTheme();
            } else {
              this.updateTheme(SMFeatures);
            }
          }
        }
      }
      if (Feature.theme) {
        siwtchSg.onDisabled = () => {
          if (ID === `customTheme`) {
            this.delLocalValue(`customTheme`);
          } else {
            this.delLocalValue(`theme`);
            this.delValue(ID);
          }
          // noinspection JSIgnoredPromiseFromCall
          this.setTheme();
        };
      }
    }
    if (Feature.st && (this.esgst.settings.esgst_st || ID === `esgst`)) {
      set2 = this.getFeaturePath(Feature, ID, `st`);
      val2 = set2.enabled;
      siwtchSt = new ToggleSwitch(Menu, ID, true, `[ST]`, false, true, null, val2);
      this.createElements(Menu, `beforeEnd`, [{
        attributes: {
          class: `fa fa-gear esgst-clickable`,
          title: `Customize where the feature runs`
        },
        type: `i`
      }]).addEventListener(`click`, this.openPathsPopup.bind(this, Feature, ID, `st`));
      if (Feature.conflicts) {
        siwtchSt.onEnabled = () => {
          for (let ci = 0, cn = Feature.conflicts.length; ci < cn; ++ci) {
            let setting = this.esgst.settings[`${Feature.conflicts[ci].id}_st`];
            if ((setting.include && setting.enabled) || (!setting.include && setting)) {
              siwtchSt.disable();
              new Popup({
                addScrollable: true,
                icon: `fa-exclamation`,
                isTemp: true,
                title: `This feature conflicts with ${Feature.conflicts[ci].name}. While that feature is enabled, this feature cannot be enabled.`
              }).open();
              ci = cn;
            }
          }
          if (Feature.theme && SMFeatures) {
            if (ID === `customTheme`) {
              // noinspection JSIgnoredPromiseFromCall
              this.setTheme();
            } else {
              this.updateTheme(SMFeatures);
            }
          }
        }
      } else if (Feature.theme) {
        siwtchSt.onEnabled = () => {
          if (SMFeatures) {
            if (ID === `customTheme`) {
              // noinspection JSIgnoredPromiseFromCall
              this.setTheme();
            } else {
              this.updateTheme(SMFeatures);
            }
          }
        }
      }
      if (Feature.theme) {
        siwtchSt.onDisabled = () => {
          if (ID !== `customTheme`) {
            this.delValue(ID);
          }
          // noinspection JSIgnoredPromiseFromCall
          this.setTheme();
        };
      }
    }
    if (!siwtchSg && !siwtchSt) {
      Menu.lastElementChild.remove();
      return null;
    }
    isMainNew = this.esgst.dismissedOptions.indexOf(ID) < 0 && (!set1 || set1.new) && (!set2 || set2.new);
    if (isMainNew) {
      this.createElements(Menu.firstElementChild, `afterEnd`, [{
        attributes: {
          class: `esgst-bold esgst-red esgst-clickable`,
          title: `This is a new feature/option. Click to dismiss.`
        },
        text: `[NEW]`,
        type: `span`
      }]).addEventListener(`click`, this.dismissNewOption.bind(this, ID));
    }
    val = val1 || val2;
    this.createElements(Menu, `beforeEnd`, [{
      text: typeof Feature.name === `string` ? `${this.esgst.settings.esgst_st ? `- ` : ``}${Feature.name} ` : ``,
      type: `span`,
      children: typeof Feature.name === `string` ? null : [this.esgst.settings.esgst_st ? {
        text: `- `,
        type: `node`
      } : null,
        ...Feature.name
      ]
    }, ...(Feature.features ? [{
      attributes: {
        class: `fa fa-ellipsis-h`,
        title: `This option has sub-options`
      },
      type: `i`
    }] : [null]), ...(Feature.sync ? [{
      attributes: {
        class: `esgst-negative fa fa-refresh`,
        title: `This feature requires ${Feature.sync} data to be synced (section 1 of this menu)`
      },
      type: `i`
    }] : [null]), ...(Feature.description ? [{
      attributes: {
        class: `fa fa-question-circle esgst-clickable`
      },
      type: `i`
    }] : [null]), {
      attributes: {
        class: `esgst-form-row-indent SMFeatures esgst-hidden`
      },
      type: `div`
    }]);
    SMFeatures = Menu.lastElementChild;
    if (Feature.description) {
      let popout = null;
      let tooltip = SMFeatures.previousElementSibling;
      tooltip.addEventListener(`mouseenter`, () => {
        if (popout) {
          popout.open(tooltip);
        } else {
          popout = new Popout(`esgst-feature-description markdown`, tooltip, 100);
          popout.popout.style.maxHeight = `300px`;
          popout.popout.style.overflow = `auto`;
          this.createElements(popout.popout, `inner`, [...(Array.from(parseHtml(Feature.description.replace(/\[id=(.+?)]/g, this.getFeatureName.bind(this))).body.childNodes).map(x => {
            return {
              context: x
            };
          }))]);
          popout.open(tooltip);
        }
      });
    }
    if (Feature.features) {
      let ft, i, id, isNew = false;
      i = 1;
      for (id in Feature.features) {
        if (Feature.features.hasOwnProperty(id)) {
          if (!Feature.features[id].extensionOnly || this._USER_INFO.extension) {
            ft = this.getSMFeature(Feature.features[id], id, i);
            if (ft) {
              if (ft.isNew) {
                isNew = true;
              }
              SMFeatures.appendChild(ft.menu);
              i += 1;
            }
          }
        }
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
      isMainNew = isMainNew || isNew;
      if (isNew) {
        this.createElements(Menu.firstElementChild, `afterEnd`, [{
          attributes: {
            class: `esgst-bold esgst-red`,
            title: `There is a new feature/option in this section`
          },
          type: `span`,
          children: [{
            attributes: {
              class: `fa fa-star`
            },
            type: `i`
          }]
        }]);
      }
    }
    if (ID === `gc`) {
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gch`) {
      this.addGwcrMenuPanel(SMFeatures, `gch_colors`, `copies`, true);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gwc`) {
      this.addGwcrMenuPanel(SMFeatures, `gwc_colors`, `chance`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gwr`) {
      this.addGwcrMenuPanel(SMFeatures, `gwr_colors`, `ratio`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gptw`) {
      this.addGwcrMenuPanel(SMFeatures, `gptw_colors`, `points to win`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `geth`) {
      this.addGwcrMenuPanel(SMFeatures, `geth_colors`, `hours`);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gc_r`) {
      this.addGcRatingPanel(SMFeatures);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (ID === `gc_o_a`) {
      this.addGcAltMenuPanel(SMFeatures);
      SMFeatures.classList.remove(`esgst-hidden`);
    } else if (Feature.colors || Feature.background) {
      if (typeof Feature.background === `boolean`) {
        Feature.colors = {
          bgColor: `Background`
        };
      } else if (typeof Feature.colors === `boolean`) {
        Feature.colors = {
          color: `Text`,
          bgColor: `Background`
        };
      }
      const children = [];
      for (const id in Feature.colors) {
        const color = rgba2Hex(this.esgst[`${ID}_${id}`]);
        children.push({
          text: `${Feature.colors[id]}: `,
          type: `strong`
        }, {
          type: `br`
        }, {
          attributes: {
            [`data-color-id`]: id,
            type: `color`,
            value: color.hex
          },
          type: `input`
        }, {
          text: ` Opacity: `,
          type: `node`
        }, {
          attributes: {
            max: `1.0`,
            min: `0.0`,
            step: `0.1`,
            type: `number`,
            value: color.alpha
          },
          type: `input`
        }, {
          text: ` `,
          type: `node`
        }, {
          attributes: {
            class: `form__saving-button esgst-sm-colors-default`
          },
          text: `Reset`,
          type: `div`
        }, {
          type: `br`
        });
      }
      const context = this.createElements(SMFeatures, `beforeEnd`, [{
        attributes: {
          class: `esgst-sm-colors`
        },
        type: `div`,
        children
      }]);
      const elements = context.querySelectorAll(`[data-color-id]`);
      for (const hexInput of elements) {
        const colorId =  hexInput.getAttribute(`data-color-id`);
        const alphaInput = hexInput.nextElementSibling;
        this.addColorObserver(hexInput, alphaInput, ID, colorId);
        alphaInput.nextElementSibling.addEventListener(`click`, this.resetColor.bind(this, hexInput, alphaInput, ID, colorId));
      }
      if (ID === `gc_g`) {
        let input = this.createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: `Only show the following genres: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: this.esgst.gc_g_filters
            },
            type: `input`
          }, {
            attributes: {
              class: `fa fa-question-circle`,
              title: `If you enter genres here, a genre category will only appear if the game has the listed genre. Separate genres with a comma, for example: Genre1, Genre2`
            },
            type: `i`
          }]
        }]);
        this.observeChange(input.firstElementChild, `gc_g_filters`);
        this.addGcMenuPanel(SMFeatures);
      }
      if (Feature.input) {
        let input = this.createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: `Icon: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: this.esgst[`${ID}Icon`]
            },
            type: `input`
          }, {
            attributes: {
              class: `esgst-clickable fa fa-question-circle`
            },
            type: `i`
          }, {
            type: `br`
          }, {
            text: `Label: `,
            type: `node`
          }, {
            attributes: {
              type: `text`,
              value: this.esgst[`${ID}Label`]
            },
            type: `input`
          }]
        }]);
        this.createTooltip(input.firstElementChild.nextElementSibling, `The name of the icon must be any name in this page: <a href="https://fontawesome.com/v4.7.0/icons/">https://fontawesome.com/v4.7.0/icons/</a>`);
        let icon = input.firstElementChild;
        let label = input.lastElementChild;
        this.observeChange(icon, `${ID}Icon`);
        this.observeChange(label, `${ID}Label`);
        if (ID === `gc_rd`) {
          this.createElements(input, `beforeEnd`, [{
            attributes: {
              class: `fa fa-question-circle`,
              title: `Enter the date format here, using the following keywords:\n\nDD - Day\nMM - Month in numbers (i.e. 1)\nMon - Month in short name (i.e. Jan)\nMonth - Month in full name (i.e. January)\nYYYY - Year`
            },
            type: `i`
          }]);
        }
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    } else if (Feature.inputItems) {
      let container = this.createElements(SMFeatures, `beforeEnd`, [{
        attributes: {
          class: `esgst-sm-colors`
        },
        type: `div`
      }]);
      if (ID.match(/^(chfl|sk_)/)) {
        Feature.inputItems = [
          {
            event: `keydown`,
            id: Feature.inputItems,
            shortcutKey: true,
            prefix: `Enter the key combo you want to use for this task: `
          }
        ]
      } else if (ID.match(/^hr_.+_s$/)) {
        Feature.inputItems = [
          {
            id: `${ID}_sound`,
            play: true
          }
        ];
      }
      Feature.inputItems.forEach(item => {
        const children = [];
        const attributes = item.attributes || {};
        if (item.play) {
          attributes.style = `width: 200px`;
          attributes.type = `file`;
          children.push({
            attributes,
            type: `input`
          }, {
            attributes: {
              class: `fa fa-play-circle esgst-clickable`
            },
            type: `i`
          });
        } else {
          attributes.class = `esgst-switch-input esgst-switch-input-large`;
          attributes.type = attributes.type || `text`;
          attributes.value = this.esgst[item.id];
          children.push({
            text: item.prefix || ``,
            type: `node`
          }, {
            attributes,
            type: `input`
          }, {
            text: item.suffix || ``,
            type: `node`
          });
          if (item.tooltip) {
            children.push({
              attributes: {
                class: `fa fa-question-circle`,
                title: item.tooltip
              },
              type: `i`
            });
          }
        }
        let input,
          value = ``,
          context = this.createElements(container, `beforeEnd`, [{
            type: `div`,
            children
          }]);
        input = context.firstElementChild;
        if (item.play) {
          input.nextElementSibling.addEventListener(`click`, async () => (await this.esgst.modules.generalHeaderRefresher.hr_createPlayer(this.esgst.settings[item.id] || this.esgst.modules.generalHeaderRefresher.hr_getDefaultSound())).play());
        }
        if (typeof this.esgst.settings[item.id] === `undefined` && this.esgst.dismissedOptions.indexOf(item.id) < 0) {
          isMainNew = true;
          this.createElements(context, `afterBegin`, [{
            attributes: {
              class: `esgst-bold esgst-red esgst-clickable`,
              title: `This is a new feature/option. Click to dismiss.`
            },
            text: `[NEW]`,
            type: `span`
          }]).addEventListener(`click`, this.dismissNewOption.bind(this, item.id));
        }
        input.addEventListener(item.event || `change`, event => {
          if (item.shortcutKey) {
            event.preventDefault();
            event.stopPropagation();
            if (!event.repeat) {
              value = ``;
              if (event.ctrlKey) {
                value += `ctrlKey + `;
              } else if (event.shiftKey) {
                value += `shiftKey + `;
              } else if (event.altKey) {
                value += `altKey + `;
              }
              value += event.key.toLowerCase();
            }
          } else if (item.play) {
            this.readHrAudioFile(ID, event);
          } else if (item.event === `keydown`) {
            event.preventDefault();
            // noinspection JSIgnoredPromiseFromCall
            this.setSetting(item.id, event.key);
            this.esgst[item.id] = event.key;
            input.value = event.key;
          } else {
            // noinspection JSIgnoredPromiseFromCall
            this.setSetting(item.id, input.value);
            this.esgst[item.id] = input.value;
          }
        }, item.shortcutKey || false);
        if (item.shortcutKey) {
          input.addEventListener(`keyup`, () => {
            // noinspection JSIgnoredPromiseFromCall
            this.setSetting(item.id, value);
            this.esgst[item.id] = value;
            input.value = value;
          });
        }
      });
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    } else if (Feature.theme) {
      const children = [{
        text: `Enabled from `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: this.esgst[`${ID}_startTime`]
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: this.esgst[`${ID}_endTime`]
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `You can specify here what time of the day you want the theme to be enabled. Use the HH:MM format.`
        },
        type: `i`
      }, {
        type: `br`
      }];
      if (ID === `customTheme`) {
        children.push({
          type: `textarea`
        });
      } else {
        children.push({
          attributes: {
            class: `form__saving-button esgst-sm-colors-default`
          },
          text: `Update`,
          type: `div`
        }, {
          type: `span`
        });
      }
      let container = this.createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children
        }]),
        startTime = container.firstElementChild,
        endTime = startTime.nextElementSibling;
      this.observeChange(startTime, `${ID}_startTime`);
      this.observeChange(endTime, `${ID}_endTime`);
      if (ID === `customTheme`) {
        let textArea = container.lastElementChild;
        this.getValue(ID).then(value => {
          if (!value) return;
          textArea.value = JSON.parse(value);
        });
        textArea.addEventListener(`change`, async () => {
          await this.setValue(ID, JSON.stringify(textArea.value));
          // noinspection JSIgnoredPromiseFromCall
          this.setTheme();
        });
      } else {
        let version = container.lastElementChild,
          button = version.previousElementSibling;
        // noinspection JSIgnoredPromiseFromCall
        this.setThemeVersion(ID, version);
        button.addEventListener(`click`, async () => {
          let url = await this.getThemeUrl(ID, Feature.theme);
          this.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: ` Updating...`,
            type: `node`
          }]);
          let theme = JSON.stringify((await this.request({method: `GET`, url})).responseText);
          await this.setValue(ID, theme);
          this.createElements(button, `inner`, [{
            text: `Update`,
            type: `node`
          }]);
          // noinspection JSIgnoredPromiseFromCall
          this.setThemeVersion(ID, version, theme);
          // noinspection JSIgnoredPromiseFromCall
          this.setTheme();
        });
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    }
    if (Feature.options) {
      const [key, options] = Array.isArray(Feature.options) ? [`_index_*`, Feature.options] : [`_index`, [Feature.options]];
      for (const [index, option] of options.entries()) {
        const currentKey = key.replace(/\*/, index);
        const selectedIndex = this.esgst[`${ID}${currentKey}`];
        const children = [];
        for (const value of option.values) {
          children.push({
            text: value,
            type: `option`
          });
        }
        const select = this.createElements(SMFeatures, `beforeEnd`, [{
          attributes: {
            class: `esgst-sm-colors`
          },
          type: `div`,
          children: [{
            text: option.title,
            type: `node`
          }, {
            type: `select`,
            children
          }]
        }]);
        select.firstElementChild.selectedIndex = selectedIndex;
        this.observeNumChange(select.firstElementChild, `${ID}${currentKey}`, `selectedIndex`);
      }
      if (siwtchSg) {
        siwtchSg.dependencies.push(SMFeatures);
      }
      if (siwtchSt) {
        siwtchSt.dependencies.push(SMFeatures);
      }
      if (val) {
        SMFeatures.classList.remove(`esgst-hidden`);
      }
    }
    return {
      isNew: isMainNew,
      menu: Menu
    };
  }

  readHrAudioFile(id, event) {
    let popup = new Popup({addScrollable: true, icon: `fa-circle-o-notch fa-spin`, title: `Uploading...`});
    popup.open();
    try {
      let reader = new FileReader();
      reader.onload = this.saveHrFile.bind(this, id, popup, reader);
      reader.readAsArrayBuffer(event.currentTarget.files[0]);
    } catch (e) {
      console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  async saveHrFile(id, popup, reader) {
    try {
      let bytes = new Uint8Array(reader.result);
      let binary = ``;
      for (let i = 0, n = reader.result.byteLength; i < n; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let string = btoa(binary);
      (await this.esgst.modules.generalHeaderRefresher.hr_createPlayer(string)).play();
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`${id}_sound`, string);
      popup.close();
    } catch (e) {
      console.log(e);
      popup.icon.classList.remove(`fa-circle-o-notch`);
      popup.icon.classList.remove(`fa-spin`);
      popup.icon.classList.add(`fa-times`);
      popup.title.textContent = `An error happened.`;
    }
  }

  setSmSource(child, sm, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    sm.source = child;
  }

  getSmSource(child, sm) {
    let current = sm.source;
    if (!current) return;
    do {
      current = current.previousElementSibling;
      if (current && current === child) {
        sm.panel.insertBefore(sm.source, child);
        return;
      }
    } while (current);
    sm.panel.insertBefore(sm.source, child.nextElementSibling);
  }

  saveSmSource(sm) {
    sm.source = null;
    this.esgst[sm.categoryKey] = [];
    for (let i = 0, n = sm.panel.children.length; i < n; i++) {
      this.esgst[sm.categoryKey].push(sm.panel.children[i].id);
    }
    // noinspection JSIgnoredPromiseFromCall
    this.setSetting(sm.categoryKey, this.esgst[sm.categoryKey]);
  }

  addGwcrMenuPanel(context, id, key, background) {
    let button, colors, i, n, panel;
    panel = this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Color Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to set different colors for different ${key} ranges.`
        },
        type: `i`
      }]
    }]);
    button = panel.firstElementChild;
    for (i = 0, n = this.esgst[id].length; i < n; ++i) {
      this.addGwcColorSetting(this.esgst[id][i], id, key, panel, background);
    }
    button.addEventListener(`click`, () => {
      colors = {
        color: `#ffffff`,
        lower: `0`,
        upper: `100`
      };
      if (background) {
        colors.bgColor = ``;
      }
      this.esgst[id].push(colors);
      this.addGwcColorSetting(colors, id, key, panel, background);
    });
  }

  addGwcColorSetting(colors, id, key, panel, background) {
    let bgColor, color, i, lower, n, remove, setting, upper;
    setting = this.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          step: `0.01`,
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: ` ${key}, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, ...(background ? [{
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }] : []), {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    lower = setting.firstElementChild;
    upper = lower.nextElementSibling;
    color = upper.nextElementSibling;
    if (background) {
      bgColor = color.nextElementSibling;
      remove = bgColor.nextElementSibling;
    } else {
      remove = color.nextElementSibling;
    }
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(id, this.esgst[id]);
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(id, this.esgst[id]);
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(id, this.esgst[id]);
    });
    if (bgColor) {
      bgColor.addEventListener(`change`, () => {
        colors.bgColor = bgColor.value;
        // noinspection JSIgnoredPromiseFromCall
        this.setSetting(id, this.esgst[id]);
      });
    }
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = this.esgst[id].length; i < n && this.esgst[id][i] !== colors; ++i) {
        }
        if (i < n) {
          this.esgst[id].splice(i, 1);
          // noinspection JSIgnoredPromiseFromCall
          this.setSetting(id, this.esgst[id]);
          setting.remove();
        }
      }
    });
  }

  addGcRatingPanel(context) {
    let panel = this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Rating Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to set different colors/icons for different rating ranges.`
        },
        type: `i`
      }]
    }]);
    let button = panel.firstElementChild;
    for (let i = 0, n = this.esgst.gc_r_colors.length; i < n; ++i) {
      this.addGcRatingColorSetting(this.esgst.gc_r_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      let colors = {
        color: ``,
        bgColor: ``,
        icon: ``,
        lower: ``,
        upper: ``
      };
      this.esgst.gc_r_colors.push(colors);
      this.addGcRatingColorSetting(colors, panel);
    });
  }

  addGcRatingColorSetting(colors, panel) {
    let setting = this.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `From: `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.lower
        },
        type: `input`
      }, {
        text: `% to `,
        type: `node`
      }, {
        attributes: {
          type: `number`,
          value: colors.upper
        },
        type: `input`
      }, {
        text: `% rating, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colors.bgColor
        },
        type: `input`
      }, {
        text: ` and the icon `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colors.icon
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-question-circle`
        },
        type: `i`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    let lower = setting.firstElementChild;
    let upper = lower.nextElementSibling;
    let color = upper.nextElementSibling;
    let bgColor = color.nextElementSibling;
    let icon = bgColor.nextElementSibling;
    let tooltip = icon.nextElementSibling;
    this.createTooltip(tooltip, `The name of the icon can be any name from <a href="https://fontawesome.com/v4.7.0/icons/">FontAwesome</a> or any text. For example, if you want to use alt symbols like ▲ (Alt + 3 + 0) and ▼ (Alt + 3 + 1), you can.`);
    let remove = tooltip.nextElementSibling;
    lower.addEventListener(`change`, () => {
      colors.lower = lower.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
    });
    upper.addEventListener(`change`, () => {
      colors.upper = upper.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
    });
    color.addEventListener(`change`, () => {
      colors.color = color.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
    });
    bgColor.addEventListener(`change`, () => {
      colors.bgColor = bgColor.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
    });
    icon.addEventListener(`change`, () => {
      colors.icon = icon.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        let i, n;
        for (i = 0, n = this.esgst.gc_r_colors.length; i < n && this.esgst.gc_r_colors[i] !== colors; ++i) {
        }
        if (i < n) {
          this.esgst.gc_r_colors.splice(i, 1);
          // noinspection JSIgnoredPromiseFromCall
          this.setSetting(`gc_r_colors`, this.esgst.gc_r_colors);
          setting.remove();
        }
      }
    });
  }

  addGcMenuPanel(context) {
    let button, colorSetting, i, n, panel;
    panel = this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Custom Genre Setting`,
          type: `span`
        }]
      }, {
        attributes: {
          class: `fa fa-question-circle`,
          title: `Allows you to color genres (colored genres will appear at the beginning of the list).`
        },
        type: `i`
      }]
    }]);
    button = panel.firstElementChild;
    for (i = 0, n = this.esgst.gc_g_colors.length; i < n; ++i) {
      this.addGcColorSetting(this.esgst.gc_g_colors[i], panel);
    }
    button.addEventListener(`click`, () => {
      colorSetting = {
        bgColor: `#7f8c8d`,
        color: `#ffffff`,
        genre: ``
      };
      this.esgst.gc_g_colors.push(colorSetting);
      this.addGcColorSetting(colorSetting, panel);
    });
  }

  addGcColorSetting(colorSetting, panel) {
    let bgColor, color, genre, i, n, remove, setting;
    setting = this.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For genre `,
        type: `node`
      }, {
        attributes: {
          type: `text`,
          value: colorSetting.genre
        },
        type: `input`
      }, {
        text: `, color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: colorSetting.bgColor
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    genre = setting.firstElementChild;
    color = genre.nextElementSibling;
    bgColor = color.nextElementSibling;
    remove = bgColor.nextElementSibling;
    genre.addEventListener(`change`, () => {
      colorSetting.genre = genre.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_g_colors`, this.esgst.gc_g_colors);
    });
    color.addEventListener(`change`, () => {
      colorSetting.color = color.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_g_colors`, this.esgst.gc_g_colors);
    });
    bgColor.addEventListener(`change`, () => {
      colorSetting.bgColor = bgColor.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_g_colors`, this.esgst.gc_g_colors);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = this.esgst.gc_g_colors.length; i < n && this.esgst.gc_g_colors[i] !== colorSetting; ++i) {
        }
        if (i < n) {
          this.esgst.gc_g_colors.splice(i, 1);
          // noinspection JSIgnoredPromiseFromCall
          this.setSetting(`gc_g_colors`, this.esgst.gc_g_colors);
          setting.remove();
        }
      }
    });
  }

  addGcAltMenuPanel(context) {
    let altSetting, button, i, n, panel;
    panel = this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `form__saving-button esgst-sm-colors-default`
        },
        type: `div`,
        children: [{
          text: `Add Alt Account`,
          type: `span`
        }]
      }]
    }]);
    button = panel.firstElementChild;
    this.createTooltip(this.createElements(panel, `beforeEnd`, [{
      attributes: {
        class: `fa fa-question-circle`
      },
      type: `i`
    }]), `
    <div>You must sync your owned games normally for the script to pick up the games owned by your alt accounts. Syncing with alt accounts only works with a Steam API Key though, so make sure one is set at the last section of this menu.</div>
    <br/>
    <div>Steam ID is the number that comes after "steamcommunity.com/profiles/" in your alt account's URL. If your alt account has a URL in the format "steamcommunity.com/id/" though, you can get your Steam ID <a href="https://steamid.io/">here</a> by entering your URL in the input (you want the steamID64 one).</div>
    <br/>
    <div>You must fill the fields relative to your settings. For example, if you have simplified version enabled with icons, you must fill the "icon" field. If you don't have simplified version enabled, you must fill the "label" field. The current text in the fields are simply placeholders.</div>
  `);
    for (i = 0, n = this.esgst.gc_o_altAccounts.length; i < n; ++i) {
      this.addGcAltSetting(this.esgst.gc_o_altAccounts[i], panel);
    }
    button.addEventListener(`click`, () => {
      altSetting = {
        bgColor: `#000000`,
        color: `#ffffff`,
        games: {
          apps: {},
          subs: {}
        },
        icon: ``,
        label: ``,
        name: ``,
        steamId: ``
      };
      this.esgst.gc_o_altAccounts.push(altSetting);
      this.addGcAltSetting(altSetting, panel);
    });
  }

  addGcAltSetting(altSetting, panel) {
    let color, bgColor, i, icon, label, n, name, remove, setting, steamId;
    setting = this.createElements(panel, `beforeEnd`, [{
      type: `div`,
      children: [{
        text: `For account with Steam ID `,
        type: `node`
      }, {
        attributes: {
          placeholder: `0000000000000000`,
          type: `text`,
          value: altSetting.steamId
        },
        type: `input`
      }, {
        text: `, using the nickname `,
        type: `node`
      }, {
        attributes: {
          placeholder: `alt1`,
          type: `text`,
          value: altSetting.name
        },
        type: `input`
      }, {
        text: `, `,
        type: `node`
      }, {
        type: `br`
      }, {
        text: `color it as `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.color
        },
        type: `input`
      }, {
        text: ` with the background `,
        type: `node`
      }, {
        attributes: {
          type: `color`,
          value: altSetting.bgColor
        },
        type: `input`
      }, {
        text: `, icon `,
        type: `node`
      }, {
        attributes: {
          placeholder: `folder`,
          type: `text`,
          value: altSetting.icon
        },
        type: `input`
      }, {
        text: ` and label `,
        type: `node`
      }, {
        attributes: {
          placeholder: `Owned by alt1`,
          type: `text`,
          value: altSetting.label
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }, {
        attributes: {
          class: `esgst-clickable fa fa-times`,
          title: `Delete this setting`
        },
        type: `i`
      }]
    }]);
    steamId = setting.firstElementChild;
    name = steamId.nextElementSibling;
    color = name.nextElementSibling.nextElementSibling;
    bgColor = color.nextElementSibling;
    icon = bgColor.nextElementSibling;
    label = icon.nextElementSibling;
    remove = label.nextElementSibling;
    steamId.addEventListener(`change`, () => {
      altSetting.steamId = steamId.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    name.addEventListener(`change`, () => {
      altSetting.name = name.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    color.addEventListener(`change`, () => {
      altSetting.color = color.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    bgColor.addEventListener(`change`, () => {
      altSetting.bgColor = bgColor.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    icon.addEventListener(`change`, () => {
      altSetting.icon = icon.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    label.addEventListener(`change`, () => {
      altSetting.label = label.value;
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
    });
    remove.addEventListener(`click`, () => {
      if (confirm(`Are you sure you want to delete this setting?`)) {
        for (i = 0, n = this.esgst.gc_o_altAccounts.length; i < n && this.esgst.gc_o_altAccounts[i] !== altSetting; ++i) {
        }
        if (i < n) {
          this.esgst.gc_o_altAccounts.splice(i, 1);
          // noinspection JSIgnoredPromiseFromCall
          this.setSetting(`gc_o_altAccounts`, this.esgst.gc_o_altAccounts);
          setting.remove();
        }
      }
    });
  }

  addColorObserver(hexInput, alphaInput, id, colorId) {
    hexInput.addEventListener(`change`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`${id}_${colorId}`, hex2Rgba(hexInput.value, alphaInput.value));
    });
    alphaInput.addEventListener(`change`, () => {
      // noinspection JSIgnoredPromiseFromCall
      this.setSetting(`${id}_${colorId}`, hex2Rgba(hexInput.value, alphaInput.value));
    });
  }

  setSMManageFilteredGiveaways(SMManageFilteredGiveaways) {
    let gfGiveaways, giveaway, hidden, i, key, n, popup, set;
    SMManageFilteredGiveaways.addEventListener(`click`, () => {
      popup = new Popup({addScrollable: true, icon: `fa-gift`, isTemp: true, title: `Hidden Giveaways`});
      hidden = [];
      for (key in this.esgst.giveaways) {
        if (this.esgst.giveaways.hasOwnProperty(key)) {
          giveaway = this.esgst.giveaways[key];
          if (giveaway.hidden && giveaway.code && giveaway.endTime) {
            if (Date.now() >= giveaway.endTime) {
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
      this.setValue(`giveaways`, JSON.stringify(this.esgst.giveaways));
      i = 0;
      n = hidden.length;
      gfGiveaways = this.createElements(popup.scrollable, `beforeEnd`, [{
        attributes: {
          class: `esgst-text-left`
        },
        type: `div`
      }]);
      if (n > 0) {
        set = new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-plus`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Load more...`,
          title2: `Loading more...`,
          callback1: () => {
            return new Promise(resolve => {
              // noinspection JSIgnoredPromiseFromCall
              this.loadGfGiveaways(i, i + 5, hidden, gfGiveaways, popup, value => {
                i = value;
                if (i > n) {
                  set.set.remove();
                } else if (this.esgst.es_gf && popup.scrollable.scrollHeight <= popup.scrollable.offsetHeight) {
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
        if (this.esgst.es_gf) {
          popup.scrollable.addEventListener(`scroll`, () => {
            if ((popup.scrollable.scrollTop + popup.scrollable.offsetHeight) >= popup.scrollable.scrollHeight && !set.busy) {
              set.trigger();
            }
          });
        }
      } else {
        gfGiveaways.textContent = `No hidden giveaways found.`;
        popup.open();
      }
    });
  }

  async loadGfGiveaways(i, n, hidden, gfGiveaways, popup, callback) {
    let giveaway;
    if (i < n) {
      if (hidden[i]) {
        let response = await this.request({
          method: `GET`,
          queue: true,
          url: `https://www.steamgifts.com/giveaway/${hidden[i].code}/`
        });
        giveaway = await this.buildGiveaway(parseHtml(response.responseText), response.finalUrl);
        if (giveaway) {
          this.createElements(gfGiveaways, `beforeEnd`, giveaway.html);
          await this.endless_load(gfGiveaways.lastElementChild, false, `gf`);
          setTimeout(() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
        } else {
          setTimeout(() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback), 0);
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
    popup = new Popup({addScrollable: true, icon: `fa-tags`, isTemp: true, title: `Manage discussion tags:`});
    input = this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the discussions by.`,
      type: `div`
    }]);
    let heading = this.createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (this.esgst.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedDiscussions = JSON.parse(await this.getValue(`discussions`));
    discussions = {};
    for (const key in savedDiscussions) {
      if (savedDiscussions.hasOwnProperty(key)) {
        savedDiscussion = savedDiscussions[key];
        if (savedDiscussion.tags && (savedDiscussion.tags.length > 1 || (savedDiscussion.tags[0] && savedDiscussion.tags[0].trim()))) {
          context = this.createElements(popup.scrollable, `beforeEnd`, [{
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-dt-menu`,
                href: `https://www.steamgifts.com/discussion/${key}/`
              },
              text: savedDiscussion.name || key,
              type: `a`
            }]
          }]);
          discussions[key] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener(`input`, this.filterDiscussionTags.bind(this, discussions));
    popup.open();
  }

  filterDiscussionTags(discussions, event) {
    let i, tags, key, userTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (key in discussions) {
        if (discussions.hasOwnProperty(key)) {
          userTags = discussions[key].context.getElementsByClassName(`esgst-tags`)[0];
          for (i = tags.length - 1; i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            discussions[key].context.classList.add(`esgst-hidden`);
          } else {
            discussions[key].context.classList.remove(`esgst-hidden`);
          }
        }
      }
    } else {
      for (key in discussions) {
        if (discussions.hasOwnProperty(key)) {
          discussions[key].context.classList.remove(`esgst-hidden`);
        }
      }
    }
  }

  async openManageUserTagsPopup() {
    let context, input, popup, savedUser, savedUsers, users;
    popup = new Popup({addScrollable: true, icon: `fa-tags`, isTemp: true, title: `Manage user tags:`});
    input = this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the users by.`,
      type: `div`
    }]);
    let heading = this.createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (this.esgst.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedUsers = JSON.parse(await this.getValue(`users`));
    users = {};
    for (const steamId in savedUsers.users) {
      if (savedUsers.users.hasOwnProperty(steamId)) {
        savedUser = savedUsers.users[steamId];
        if (savedUser.tags && (savedUser.tags.length > 1 || (savedUser.tags[0] && savedUser.tags[0].trim()))) {
          const attributes = {};
          if (savedUser.username) {
            attributes[`data-sg`] = true;
            attributes.href = `https://www.steamgifts.com/user/${savedUser.username}`;
          } else {
            attributes[`data-st`] = true;
            attributes.href = `https://www.steamtrades.com/user/${steamId}`;
          }
          context = this.createElements(popup.scrollable, `beforeEnd`, [{
            type: `div`,
            children: [{
              attributes,
              text: savedUser.username || steamId,
              type: `a`
            }]
          }]);
          users[savedUser.username || steamId] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener(`input`, this.filterUserTags.bind(this, users));
    popup.open();
  }

  filterUserTags(users, event) {
    let i, tags, username, userTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (username in users) {
        if (users.hasOwnProperty(username)) {
          userTags = users[username].context.getElementsByClassName(`esgst-tags`)[0];
          for (i = tags.length - 1; i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            users[username].context.classList.add(`esgst-hidden`);
          } else {
            users[username].context.classList.remove(`esgst-hidden`);
          }
        }
      }
    } else {
      for (username in users) {
        if (users.hasOwnProperty(username)) {
          users[username].context.classList.remove(`esgst-hidden`);
        }
      }
    }
  }

  async openManageGameTagsPopup() {
    let context, games, input, popup, savedGame, savedGames;
    popup = new Popup({addScrollable: true, icon: `fa-tags`, isTemp: true, title: `Manage game tags:`});
    input = this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the games by.`,
      type: `div`
    }]);
    let heading = this.createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (this.esgst.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedGames = JSON.parse(await this.getValue(`games`));
    games = {
      apps: {},
      subs: {}
    };
    for (const id in savedGames.apps) {
      if (savedGames.apps.hasOwnProperty(id)) {
        savedGame = savedGames.apps[id];
        if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
          context = this.createElements(popup.scrollable, `beforeEnd`, [{
            attributes: {
              class: `table__row-outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__heading`,
                href: `http://store.steampowered.com/app/${id}`
              },
              text: `App - ${id}`,
              type: `a`
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
          context = this.createElements(popup.scrollable, `beforeEnd`, [{
            attributes: {
              class: `table__row-outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__heading`,
                href: `http://store.steampowered.com/sub/${id}`
              },
              text: `Sub - ${id}`,
              type: `a`
            }]
          }]);
          games.subs[id] = {
            context: context
          };
        }
      }
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener(`input`, this.filterGameTags.bind(this, games));
    popup.open();
  }

  filterGameTags(games, event) {
    let gameTags, i, id, tags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (id in games.apps) {
        if (games.apps.hasOwnProperty(id)) {
          gameTags = games.apps[id].context.getElementsByClassName(`esgst-tags`)[0];
          for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            games.apps[id].context.classList.add(`esgst-hidden`);
          } else {
            games.apps[id].context.classList.remove(`esgst-hidden`);
          }
        }
      }
      for (id in games.subs) {
        if (games.subs.hasOwnProperty(id)) {
          gameTags = games.subs[id].context.getElementsByClassName(`esgst-tags`)[0];
          for (i = tags.length - 1; i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            games.subs[id].context.classList.add(`esgst-hidden`);
          } else {
            games.subs[id].context.classList.remove(`esgst-hidden`);
          }
        }
      }
    } else {
      for (id in games.apps) {
        if (games.apps.hasOwnProperty(id)) {
          games.apps[id].context.classList.remove(`esgst-hidden`);
        }
      }
      for (id in games.subs) {
        if (games.subs.hasOwnProperty(id)) {
          games.subs[id].context.classList.remove(`esgst-hidden`);
        }
      }
    }
  }

  async openManageGroupTagsPopup() {
    let context, input, popup, savedGroups, groups;
    popup = new Popup({addScrollable: true, icon: `fa-tags`, isTemp: true, title: `Manage group tags:`});
    input = this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        type: `text`
      },
      type: `input`
    }]);
    this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `Type tags below to filter the groups by.`,
      type: `div`
    }]);
    let heading = this.createElements(popup.description, `beforeBegin`, [{
      attributes: {
        class: `page__heading`
      },
      type: `div`
    }]);
    if (this.esgst.mm) {
      this.esgst.modules.generalMultiManager.mm(heading);
    }
    savedGroups = JSON.parse(await this.getValue(`groups`));
    groups = {};
    for (const savedGroup of savedGroups) {
      if (!savedGroup || !savedGroup.tags || (savedGroup.tags.length < 2 && (!savedGroup.tags[0] || !savedGroup.tags[0].trim()))) {
        continue;
      }
      context = this.createElements(popup.scrollable, `beforeEnd`, [{
        type: `div`,
        children: [{
          attributes: {
            href: `https://www.steamgifts.com/group/${savedGroup.code}/`
          },
          text: savedGroup.name,
          type: `a`
        }]
      }]);
      groups[savedGroup.code] = {
        context: context
      };
    }
    await this.endless_load(popup.scrollable);
    input.addEventListener(`input`, this.filterGroupTags.bind(this, groups));
    popup.open();
  }

  filterGroupTags(groups, event) {
    let i, tags, code, groupTags;
    if (event.currentTarget.value) {
      tags = event.currentTarget.value.replace(/,\s+/g, ``).split(/,\s/);
      for (code in groups) {
        if (groups.hasOwnProperty(code)) {
          groupTags = groups[code].context.getElementsByClassName(`esgst-tags`)[0];
          for (i = tags.length - 1; i >= 0 && !groupTags.innerHTML.match(new RegExp(`>${tags[i]}<`)); --i) {
          }
          if (i < 0) {
            groups[code].context.classList.add(`esgst-hidden`);
          } else {
            groups[code].context.classList.remove(`esgst-hidden`);
          }
        }
      }
    } else {
      for (code in groups) {
        if (groups.hasOwnProperty(code)) {
          groups[code].context.classList.remove(`esgst-hidden`);
        }
      }
    }
  }

  setSMRecentUsernameChanges(SMRecentUsernameChanges) {
    SMRecentUsernameChanges.addEventListener(`click`, async () => {
      const popup = new Popup({addScrollable: true, icon: `fa-comments`, title: `Recent Username Changes`});
      popup.progress = this.createElements(popup.description, `beforeEnd`, [{
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: `Loading recent username changes...`,
          type: `span`
        }]
      }]);
      popup.results = this.createElements(popup.scrollable, `beforeEnd`, [{
        attributes: {
          class: `esgst-uh-popup`
        },
        type: `div`
      }]);
      popup.open();
      const recentChanges = await this.getRecentChanges();
      popup.progress.innerHTML = ``;
      const items = [];
      for (const change of recentChanges) {
        items.push({
          type: `div`,
          children: [{
            text: `${change[0]} changed to `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`,
              href: `/user/${change[1]}`
            },
            text: change[1],
            type: `a`
          }]
        });
      }
      this.createElements(popup.results, `inner`, items);
      if (this.esgst.sg) {
        // noinspection JSIgnoredPromiseFromCall
        this.endless_load(popup.results);
      }
    });
  }

  async getRecentChanges() {
    const response = JSON.parse((await this.request({
      method: `GET`,
      url: `https://script.google.com/macros/s/AKfycbzvOuHG913mRIXOsqHIeAuQUkLYyxTHOZim5n8iP-k80iza6g0/exec?Action=2`
    })).responseText);

    /** @property {Object} response.RecentChanges */
    return response.RecentChanges;
  }

  updateWhitelistBlacklist(key, profile, event) {
    let user;
    user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username,
      values: {}
    };
    if (event.currentTarget.classList.contains(`is-selected`)) {
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
    if (!this.esgst.updateHiddenGames) {
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
    let isBackingUp = this.getLocalValue(`isBackingUp`);
    if ((!isBackingUp || currentDate - isBackingUp > 1800000) && currentDate - this.esgst.lastBackup > this.esgst.autoBackup_days * 86400000) {
      this.setLocalValue(`isBackingUp`, currentDate);
      this.loadDataManagement(false, `export`, true);
    }
  }

  loadDataManagement(openInTab, type, autoBackup) {
    let container, context, group1, group2, i, icon, n, onClick, option, prep, popup, section, title1, title2;
    let dm = {
      autoBackup: autoBackup,
      type: type
    };
    dm[type] = true;
    switch (type) {
      case `import`:
        icon = `fa-sign-in esgst-rotate-90`;
        onClick = this.loadImportFile.bind(this);
        prep = `from`;
        title1 = `Restore`;
        title2 = `Restoring`;
        dm.pastTense = `restored`;
        break;
      case `export`:
        icon = `fa-sign-out esgst-rotate-270`;
        onClick = this.manageData.bind(this);
        prep = `to`;
        title1 = `Backup`;
        title2 = `Backing up`;
        dm.pastTense = `backed up`;
        break;
      case `delete`:
        icon = `fa-trash`;
        onClick = this.confirmDataDeletion.bind(this);
        prep = `from`;
        title1 = `Delete`;
        title2 = `Deleting`;
        dm.pastTense = `deleted`;
        break;
    }
    if (openInTab) {
      context = container = this.esgst.mainContext;
      context.innerHTML = ``;
    } else {
      if (dm.autoBackup) {
        popup = new Popup({
          addScrollable: true,
          icon: `fa-circle-o-notch fa-spin`,
          isTemp: true,
          settings: !this.esgst.minimizePanel,
          title: `ESGST is backing up your data... ${this.esgst.minimizePanel ? `You can close this popup, ESGST will notify you when it is done through the minimize panel.` : `Please do not close this popup until it is done.`}`
        });
      } else {
        popup = new Popup({addScrollable: true, icon: icon, isTemp: true, settings: true, title: title1});
      }
      popup.description.classList.add(`esgst-text-left`);
      context = popup.scrollable;
      container = popup.description;
    }
    if (!dm.autoBackup) {
      dm.computerSpace = this.createElements(container, `afterBegin`, [{
        type: `div`,
        children: [{
          text: `Total: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          type: `span`
        }, {
          attributes: {
            class: `esgst-clickable fa fa-refresh`,
            title: `Calculate/refresh data sizes`
          },
          type: `i`
        }]
      }]);
      dm.computerSpaceCount = dm.computerSpace.firstElementChild;
      dm.computerSpaceCount.nextElementSibling.addEventListener(`click`, this.getDataSizes.bind(this, dm));
      section = this.createMenuSection(context, null, 1, title1);
    }
    dm.switches = {};
    dm.options = [
      {
        check: true,
        key: `decryptedGiveaways`,
        name: `Decrypted Giveaways`
      },
      {
        check: this.esgst.sg,
        key: `discussions`,
        name: `Discussions`,
        options: [
          {
            key: `discussions_main`,
            name: `Main`
          },
          {
            key: `discussions_ct`,
            name: `Comment Tracker`
          },
          {
            key: `discussions_df`,
            name: `Discussion Filters`
          },
          {
            key: `discussions_dh`,
            name: `Discussion Highlighter`
          },
          {
            key: `discussions_dt`,
            name: `Discussion Tags`
          },
          {
            key: `discussions_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `discussions_pm`,
            name: `Puzzle Marker`
          }
        ]
      },
      {
        check: true,
        key: `emojis`,
        name: `Emojis`
      },
      {
        check: this.esgst.sg,
        key: `entries`,
        name: `Entries`
      },
      {
        check: true,
        key: `games`,
        name: `Games`,
        options: [
          {
            key: `games_main`,
            name: `Main`
          },
          {
            key: `games_egh`,
            name: `Entered Game Highlighter`
          },
          {
            key: `games_gt`,
            name: `Game Tags`
          },
          {
            key: `games_itadi`,
            name: `IsThereAnyDeal Info`
          }
        ]
      },
      {
        check: this.esgst.sg,
        key: `giveaways`,
        name: `Giveaways`,
        options: [
          {
            key: `giveaways_main`,
            name: `Main`
          },
          {
            key: `giveaways_ct`,
            name: `Comment Tracker`
          },
          {
            key: `giveaways_gb`,
            name: `Giveaway Bookmarks`
          },
          {
            key: `giveaways_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `giveaways_gf`,
            name: `Giveaway Filters`
          },
          {
            key: `giveaways_ggl`,
            name: `Giveaway Group Loader`
          }
        ]
      },
      {
        check: this.esgst.sg,
        key: `groups`,
        name: `Groups`,
        options: [
          {
            key: `groups_main`,
            name: `Main`
          },
          {
            key: `groups_gpt`,
            name: `Group Tags`
          },
          {
            key: `groups_sgg`,
            name: `Stickied Giveaway Groups`
          }
        ]
      },
      {
        check: this.esgst.sg,
        key: `rerolls`,
        name: `Rerolls`
      },
      {
        check: true,
        key: `savedReplies`,
        name: `Saved Replies`
      },
      {
        check: true,
        key: `settings`,
        name: `Settings`
      },
      {
        check: true,
        key: `sgCommentHistory`,
        name: `SG Comment History`
      },
      {
        check: this.esgst.sg,
        key: `stickiedCountries`,
        name: `Stickied Giveaway Countries`
      },
      {
        check: this.esgst.sg,
        key: `templates`,
        name: `Templates`
      },
      {
        check: this.esgst.sg,
        key: `tickets`,
        name: `Tickets`,
        options: [
          {
            key: `tickets_main`,
            name: `Main`
          },
          {
            key: `tickets_ct`,
            name: `Comment Tracker`
          },
          {
            key: `tickets_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          },
          {
            key: `tickets_ust`,
            name: `User Suspension Tracker`
          }
        ]
      },
      {
        check: this.esgst.st,
        key: `trades`,
        name: `Trades`,
        options: [
          {
            key: `trades_main`,
            name: `Main`
          },
          {
            key: `trades_ct`,
            name: `Comment Tracker`
          },
          {
            key: `trades_gdttt`,
            name: `Giveaway/Discussion/Ticket/Trade Tracker`
          }
        ]
      },
      {
        check: true,
        key: `users`,
        name: `Users`,
        options: [
          {
            key: `users_main`,
            name: `Main`
          },
          {
            key: `users_namwc`,
            name: `Not Activated/Multiple Win  Checker`
          },
          {
            key: `users_nrf`,
            name: `Not Received Finder`
          },
          {
            key: `users_uf`,
            name: `User Filters`
          },
          {
            key: `users_giveaways`,
            name: `Giveaways Data`
          },
          {
            key: `users_notes`,
            name: `User Notes`
          },
          {
            key: `users_tags`,
            name: `User Tags`
          },
          {
            key: `users_wbc`,
            name: `Whitelist/Blacklist Checker`
          }
        ]
      },
      {
        check: this.esgst.sg,
        key: `winners`,
        name: `Winners`
      }
    ];
    if (dm.autoBackup) {
      let dropbox, googleDrive, oneDrive;
      switch (this.esgst.autoBackup_index) {
        case 0:
          break;
        case 1:
          dropbox = true;
          break;
        case 2:
          googleDrive = true;
          break;
        case 3:
          oneDrive = true;
          break;
      }
      popup.open();
      // noinspection JSIgnoredPromiseFromCall
      this.manageData(dm, dropbox, googleDrive, oneDrive, false, async () => {
        this.delLocalValue(`isBackingUp`);
        await this.setSetting(`lastBackup`, Date.now());
        popup.icon.classList.remove(`fa-circle-o-notch`, `fa-spin`);
        popup.icon.classList.add(`fa-check`);
        popup.setTitle(`Backup done! You can close this popup now.`);
        popup.setDone(true);
      });
    } else {
      for (i = 0, n = dm.options.length; i < n; ++i) {
        option = dm.options[i];
        if (option.check) {
          section.lastElementChild.appendChild(this.getDataMenu(option, dm.switches, type));
        }
      }
      if (type === `import` || type === `delete`) {
        if (type === `import`) {
          dm.input = this.createElements(container, `beforeEnd`, [{
            attributes: {
              type: `file`
            },
            type: `input`
          }]);
          new ToggleSwitch(container, `importAndMerge`, false, `Merge`, false, false, `Merges the current data with the backup instead of replacing it.`, this.esgst.settings.importAndMerge);
        }
        let select = new ToggleSwitch(container, `exportBackup`, false, [{
          text: `Backup to `,
          type: `node`
        }, {
          type: `select`,
          children: [{
            text: `Computer`,
            type: `option`
          }, {
            text: `Dropbox`,
            type: `option`
          }, {
            text: `Google Drive`,
            type: `option`
          }, {
            text: `OneDrive`,
            type: `option`
          }]
        }], false, false, `Backs up the current data to one of the selected places before restoring another backup.`, this.esgst.settings.exportBackup).name.firstElementChild;
        select.selectedIndex = this.esgst.settings.exportBackupIndex;
        select.addEventListener(`change`, () => {
          // noinspection JSIgnoredPromiseFromCall
          this.setSetting(`exportBackupIndex`, select.selectedIndex);
        });
      }
      if (type === `import` || type === `export`) {
        this.observeChange(new ToggleSwitch(container, `usePreferredGoogle`, false, [{
          text: `Use preferred Google account: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-switch-input esgst-switch-input-large`,
            placeholder: `example@gmail.com`,
            type: `text`
          },
          type: `input`
        }, {
          attributes: {
            class: `esgst-bold esgst-clickable`
          },
          events: {
            click: () => {
              alert(this.esgst.settings.preferredGoogle || `No email address defined`);
            }
          },
          text: `Reveal`,
          type: `span`
        }], false, false, `With this option enabled, you will not be prompted to select an account when restoring/backing up to Google Drive. The account associated with the email address entered here will be automatically selected if you're already logged in. For security purposes, the email address will not be visible if you re-open the menu. After that, you have to click on "Reveal" to see it.`, this.esgst.settings.usePreferredGoogle).name.firstElementChild, `preferredGoogle`) ;
        this.observeChange(new ToggleSwitch(container, `usePreferredMicrosoft`, false, [{
          text: `Use preferred Microsoft account: `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-switch-input esgst-switch-input-large`,
            placeholder: `example@outlook.com`,
            type: `text`
          },
          type: `input`
        }, {
          attributes: {
            class: `esgst-bold esgst-clickable`
          },
          events: {
            click: () => {
              alert(this.esgst.settings.preferredMicrosoft || `No email address defined`);
            }
          },
          text: `Reveal`,
          type: `span`
        }], false, false, `With this option enabled, you will not be prompted to select an account when restoring/backing up to OneDrive. The account associated with the email address entered here will be automatically selected if you're already logged in. For security purposes, the email address will not be visible if you re-open the menu. After that, you have to click on "Reveal" to see it.`, this.esgst.settings.usePreferredMicrosoft).name.firstElementChild, `preferredMicrosoft`) ;
      }
      dm.message = this.createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-description`
        },
        type: `div`
      }]);
      dm.warning = this.createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-warning`
        },
        type: `div`
      }]);
      group1 = this.createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-button-group`
        },
        type: `div`,
        children: [{
          text: `Select:`,
          type: `span`
        }]
      }]);
      group1.appendChild(new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-square`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `All`,
        title2: ``,
        callback1: this.selectSwitches.bind(this, dm.switches, `enable`, group1)
      }).set);
      group1.appendChild(new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-square-o`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `None`,
        title2: ``,
        callback1: this.selectSwitches.bind(this, dm.switches, `disable`, group1)
      }).set);
      group1.appendChild(new ButtonSet({
        color1: `grey`,
        color2: `grey`,
        icon1: `fa-plus-square-o`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Inverse`,
        title2: ``,
        callback1: this.selectSwitches.bind(this, dm.switches, `toggle`, group1)
      }).set);
      group2 = this.createElements(container, `beforeEnd`, [{
        attributes: {
          class: `esgst-button-group`
        },
        type: `div`,
        children: [{
          text: `${title1} ${prep}:`,
          type: `span`
        }]
      }]);
      group2.appendChild(new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-desktop`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Computer`,
        title2: title2,
        callback1: () => {
          return new Promise(resolve => {
            onClick(dm, false, false, false, false, () => {
              // noinspection JSIgnoredPromiseFromCall
              this.manageData(dm, false, false, false, true);
              resolve();
            });
          });
        }
      }).set);
      if (type !== `delete`) {
        group2.appendChild(new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-dropbox`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Dropbox`,
          title2: title2,
          callback1: () => {
            return new Promise(resolve => {
              onClick(dm, true, false, false, false, () => {
                // noinspection JSIgnoredPromiseFromCall
                this.manageData(dm, false, false, false, true);
                resolve();
              });
            });
          }
        }).set);
        group2.appendChild(new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-google`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Google Drive`,
          title2: title2,
          callback1: () => {
            return new Promise(resolve => {
              onClick(dm, false, true, false, false, () => {
                // noinspection JSIgnoredPromiseFromCall
                this.manageData(dm, false, false, false, true);
                resolve();
              });
            });
          }
        }).set);
        group2.appendChild(new ButtonSet({
          color1: `green`,
          color2: `grey`,
          icon1: `fa-windows`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `OneDrive`,
          title2: title2,
          callback1: () => {
            return new Promise(resolve => {
              onClick(dm, false, false, true, false, () => {
                // noinspection JSIgnoredPromiseFromCall
                this.manageData(dm, false, false, false, true);
                resolve();
              });
            });
          }
        }).set);
      }
      if (!openInTab) {
        popup.open();
      }
      if (this.esgst[`calculate${this.capitalizeFirstLetter(type)}`]) {
        this.getDataSizes(dm);
      }
    }
  }

  loadDataCleaner() {
    let popup = new Popup({addScrollable: true, icon: `fa-paint-brush`, title: `Clean old data:`});
    this.createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-bold esgst-description esgst-red`
      },
      text: `Make sure to backup your data before using the cleaner.`,
      type: `div`
    }]);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanDiscussions`, false, [{
      text: `Discussions data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanDiscussions_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Discussions data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, this.esgst.cleanDiscussions).name.firstElementChild, `cleanDiscussions_days`);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanEntries`, false, [{
      text: `Entries data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanEntries_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, ``, this.esgst.cleanEntries).name.firstElementChild, `cleanEntries_days`);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanGiveaways`, false, [{
      text: `Giveaways data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanGiveaways_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Some giveaways data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, this.esgst.cleanGiveaways).name.firstElementChild, `cleanGiveaways_days`);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanSgCommentHistory`, false, [{
      text: `SteamGifts comment history data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanSgCommentHistory_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, ``, this.esgst.cleanSgCommentHistory).name.firstElementChild, `cleanSgCommentHistory_days`);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanTickets`, false, [{
      text: `Tickets data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanTickets_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Tickets data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, this.esgst.cleanTickets).name.firstElementChild, `cleanTickets_days`);
    this.observeNumChange(new ToggleSwitch(popup.description, `cleanTrades`, false, [{
      text: `Trades data older than `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-switch-input`,
        type: `text`,
        value: this.esgst.cleanTrades_days
      },
      type: `input`
    }, {
      text: ` days.`,
      type: `node`
    }], false, false, `Trades data only started being date-tracked since v7.11.0, so not all old data may be cleaned.`, this.esgst.cleanTrades).name.firstElementChild, `cleanTrades_days`);
    new ToggleSwitch(popup.description, `cleanDuplicates`, false, `Duplicate data.`, false, false, `Cleans up any duplicate data it finds.`, this.esgst.cleanDuplicates);
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Clean`,
      title2: `Cleaning...`,
      callback1: async () => {
        const dm = {};
        dm.options = [
          {
            check: true,
            key: `decryptedGiveaways`,
            name: `Decrypted Giveaways`
          },
          {
            check: this.esgst.sg,
            key: `discussions`,
            name: `Discussions`,
            options: [
              {
                key: `discussions_main`,
                name: `Main`
              },
              {
                key: `discussions_ct`,
                name: `Comment Tracker`
              },
              {
                key: `discussions_df`,
                name: `Discussion Filters`
              },
              {
                key: `discussions_dh`,
                name: `Discussion Highlighter`
              },
              {
                key: `discussions_dt`,
                name: `Discussion Tags`
              },
              {
                key: `discussions_gdttt`,
                name: `Giveaway/Discussion/Ticket/Trade Tracker`
              },
              {
                key: `discussions_pm`,
                name: `Puzzle Marker`
              }
            ]
          },
          {
            check: true,
            key: `emojis`,
            name: `Emojis`
          },
          {
            check: this.esgst.sg,
            key: `entries`,
            name: `Entries`
          },
          {
            check: true,
            key: `games`,
            name: `Games`,
            options: [
              {
                key: `games_main`,
                name: `Main`
              },
              {
                key: `games_egh`,
                name: `Entered Game Highlighter`
              },
              {
                key: `games_gt`,
                name: `Game Tags`
              },
              {
                key: `games_itadi`,
                name: `IsThereAnyDeal Info`
              }
            ]
          },
          {
            check: this.esgst.sg,
            key: `giveaways`,
            name: `Giveaways`,
            options: [
              {
                key: `giveaways_main`,
                name: `Main`
              },
              {
                key: `giveaways_ct`,
                name: `Comment Tracker`
              },
              {
                key: `giveaways_gb`,
                name: `Giveaway Bookmarks`
              },
              {
                key: `giveaways_gdttt`,
                name: `Giveaway/Discussion/Ticket/Trade Tracker`
              },
              {
                key: `giveaways_gf`,
                name: `Giveaway Filters`
              },
              {
                key: `giveaways_ggl`,
                name: `Giveaway Group Loader`
              }
            ]
          },
          {
            check: this.esgst.sg,
            key: `groups`,
            name: `Groups`,
            options: [
              {
                key: `groups_main`,
                name: `Main`
              },
              {
                key: `groups_gpt`,
                name: `Group Tags`
              },
              {
                key: `groups_sgg`,
                name: `Stickied Giveaway Groups`
              }
            ]
          },
          {
            check: this.esgst.sg,
            key: `rerolls`,
            name: `Rerolls`
          },
          {
            check: true,
            key: `savedReplies`,
            name: `Saved Replies`
          },
          {
            check: true,
            key: `settings`,
            name: `Settings`
          },
          {
            check: true,
            key: `sgCommentHistory`,
            name: `SG Comment History`
          },
          {
            check: this.esgst.sg,
            key: `stickiedCountries`,
            name: `Stickied Giveaway Countries`
          },
          {
            check: this.esgst.sg,
            key: `templates`,
            name: `Templates`
          },
          {
            check: this.esgst.sg,
            key: `tickets`,
            name: `Tickets`,
            options: [
              {
                key: `tickets_main`,
                name: `Main`
              },
              {
                key: `tickets_ct`,
                name: `Comment Tracker`
              },
              {
                key: `tickets_gdttt`,
                name: `Giveaway/Discussion/Ticket/Trade Tracker`
              },
              {
                key: `tickets_ust`,
                name: `User Suspension Tracker`
              }
            ]
          },
          {
            check: this.esgst.st,
            key: `trades`,
            name: `Trades`,
            options: [
              {
                key: `trades_main`,
                name: `Main`
              },
              {
                key: `trades_ct`,
                name: `Comment Tracker`
              },
              {
                key: `trades_gdttt`,
                name: `Giveaway/Discussion/Ticket/Trade Tracker`
              }
            ]
          },
          {
            check: true,
            key: `users`,
            name: `Users`,
            options: [
              {
                key: `users_main`,
                name: `Main`
              },
              {
                key: `users_namwc`,
                name: `Not Activated/Multiple Win  Checker`
              },
              {
                key: `users_nrf`,
                name: `Not Received Finder`
              },
              {
                key: `users_uf`,
                name: `User Filters`
              },
              {
                key: `users_giveaways`,
                name: `Giveaways Data`
              },
              {
                key: `users_notes`,
                name: `User Notes`
              },
              {
                key: `users_tags`,
                name: `User Tags`
              },
              {
                key: `users_wbc`,
                name: `Whitelist/Blacklist Checker`
              }
            ]
          },
          {
            check: this.esgst.sg,
            key: `winners`,
            name: `Winners`
          }
        ];
        const oldSize = await this.manageData(dm, false, false, false, true);
        let currentTime = Date.now();
        let toSave = {};
        if (this.esgst.cleanDiscussions) {
          let days = this.esgst.cleanDiscussions_days * 86400000;
          toSave.discussions = JSON.parse(await this.getValue(`discussions`, `{}`));
          for (let code in toSave.discussions) {
            if (toSave.discussions.hasOwnProperty(code)) {
              let item = toSave.discussions[code];
              if (item.author !== this.esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
                delete toSave.discussions[code];
              }
            }
          }
        }
        if (this.esgst.cleanEntries) {
          let days = this.esgst.cleanEntries_days * 86400000;
          let items = JSON.parse(await this.getValue(`entries`, `[]`));
          toSave.entries = [];
          items.forEach(item => {
            if (currentTime - item.timestamp <= days) {
              toSave.entries.push(item);
            }
          });
        }
        if (this.esgst.cleanGiveaways) {
          let days = this.esgst.cleanGiveaways_days * 86400000;
          toSave.giveaways = JSON.parse(await this.getValue(`giveaways`, `{}`));
          for (let code in toSave.giveaways) {
            if (toSave.giveaways.hasOwnProperty(code)) {
              let item = toSave.giveaways[code];
              if (item.creator !== this.esgst.username && ((item.endTime && currentTime - item.endTime > days) || (item.lastUsed && currentTime - item.lastUsed > days))) {
                delete toSave.giveaways[code];
              }
            }
          }
        }
        if (this.esgst.cleanSgCommentHistory) {
          let days = this.esgst.cleanSgCommentHistory_days * 86400000;
          let items = JSON.parse(await this.getValue(`sgCommentHistory`, `[]`));
          toSave.sgCommentHistory = [];
          items.forEach(item => {
            if (currentTime - item.timestamp <= days) {
              toSave.sgCommentHistory.push(item);
            }
          });
        }
        if (this.esgst.cleanTickets) {
          let days = this.esgst.cleanTickets_days * 86400000;
          toSave.tickets = JSON.parse(await this.getValue(`tickets`, `{}`));
          for (let code in toSave.tickets) {
            if (toSave.tickets.hasOwnProperty(code)) {
              let item = toSave.tickets[code];
              if (item.author !== this.esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
                delete toSave.tickets[code];
              }
            }
          }
        }
        if (this.esgst.cleanTrades) {
          let days = this.esgst.cleanTrades_days * 86400000;
          toSave.trades = JSON.parse(await this.getValue(`trades`, `{}`));
          for (let code in toSave.trades) {
            if (toSave.trades.hasOwnProperty(code)) {
              let item = toSave.trades[code];
              if (item.author !== this.esgst.username && item.lastUsed && currentTime - item.lastUsed > days) {
                delete toSave.trades[code];
              }
            }
          }
        }
        if (this.esgst.cleanDuplicates) {
          toSave.users = JSON.parse(await this.getValue(`users`, `{"steamIds":{},"users":{}}`));
          for (let id in toSave.users.users) {
            if (toSave.users.users.hasOwnProperty(id)) {
              let giveaways = toSave.users.users[id].giveaways;
              if (giveaways) {
                [`sent`, `won`].forEach(mainType => {
                  [`apps`, `subs`].forEach(type => {
                    for (let code in giveaways[mainType][type]) {
                      if (giveaways[mainType][type].hasOwnProperty(code)) {
                        giveaways[mainType][type][code] = Array.from(/** @type {ArrayLike} */ new Set(giveaways[mainType][type][code]));
                      }
                    }
                  });
                });
              }
            }
          }
        }
        for (let key in toSave) {
          if (toSave.hasOwnProperty(key)) {
            toSave[key] = JSON.stringify(toSave[key]);
          }
        }
        await this.setValues(toSave);
        const newSize = await this.manageData(dm, false, false, false, true);
        const successPopup = new Popup({
          icon: `fa-check`,
          title: [{
            text: `Success! The selected data was cleaned.`,
            type: `node`
          }, {
            type: `br`
          }, {
            type: `br`
          }, {
            text: `Size before cleaning: `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`
            },
            text: this.convertBytes(oldSize),
            type: `span`
          }, {
            type: `br`
          }, {
            text: `Size after cleaning: `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`
            },
            text: this.convertBytes(newSize),
            type: `span`
          }, {
            type: `br`
          }, {
            type: `br`
          }, {
            text: `${Math.round((100 - (newSize / oldSize * 100)) * 100) / 100}% reduction`,
            type: `node`
          }]
        });
        successPopup.open();
      }
    }).set);
    popup.open();
  }

  async manageData(dm, dropbox, googleDrive, oneDrive, space, callback) {
    let data = {};
    let totalSize = 0;
    let mainUsernameFound;
    for (let i = 0, n = dm.options.length; i < n; i++) {
      let option = dm.options[i];
      let optionKey = option.key;
      if (!option.check || (!dm.autoBackup && !space && !this.esgst.settings[`${dm.type}_${optionKey}`])) {
        continue;
      }
      let values = null;
      let mainFound, mergedData, sizes;
      // noinspection FallThroughInSwitchStatementJS
      switch (optionKey) {
        case `decryptedGiveaways`:
        case `settings`:
          data[optionKey] = JSON.parse(await this.getValue(optionKey, `{}`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  mergedData = data[optionKey];
                  for (let newDataKey in newData) {
                    if (newData.hasOwnProperty(newDataKey)) {
                      mergedData[newDataKey] = newData[newDataKey];
                    }
                  }
                  await this.setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await this.setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `{}`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        case `discussions`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              df: [`hidden`],
              dh: [`highlighted`],
              dt: [`tags`],
              gdttt: [`visited`],
              pm: [`status`]
            };
          }
        case `giveaways`:
          if (!values) {
            values = {
              main: [`code`, `comments`, `copies`, `creator`, `endTime`, `entries`, `gameId`, `gameName`, `gameSteamId`, `gameType`, `group`, `inviteOnly`, `lastUsed`, `level`, `points`, `regionRestricted`, `started`, `startTime`, `whitelist`, `winners`],
              ct: [`count`, `readComments`],
              gb: [`bookmarked`],
              gdttt: [`visited`],
              gf: [`hidden`],
              ggl: [`groups`]
            };
          }
        case `tickets`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              gdttt: [`visited`],
              ust: [`sent`]
            };
          }
        case `trades`:
          if (!values) {
            values = {
              main: [`lastUsed`],
              ct: [`count`, `readComments`],
              gdttt: [`visited`]
            };
          }
          data[optionKey] = {};
          mergedData = JSON.parse(await this.getValue(optionKey, `{}`));
          sizes = {
            ct: 0,
            df: 0,
            dh: 0,
            dt: 0,
            gb: 0,
            gdttt: 0,
            gf: 0,
            ggl: 0,
            main: 0,
            pm: 0,
            total: 0,
            ust: 0
          };
          mainFound = false;
          for (let mergedDataKey in mergedData) {
            if (mergedData.hasOwnProperty(mergedDataKey)) {
              let newData = {};
              let toDelete = 0;
              let foundSub = 0;
              let deletedSub = 0;
              let found = null;
              let toExport = false;
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (this.esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                    toDelete += 1;
                  }
                  for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                    let valueKey = values[value][j];
                    let mergedDataValue = mergedData[mergedDataKey][valueKey];
                    if (typeof mergedDataValue !== `undefined`) {
                      if (value !== `main`) {
                        foundSub += 1;
                      }
                      if (dm.autoBackup || this.esgst.settings[`${dm.type}_${optionKey}_${value}`] || value === `main`) {
                        newData[valueKey] = mergedDataValue;
                        if (value !== `main`) {
                          toExport = true;
                        }
                      }
                      let size = (new TextEncoder().encode(`"${valueKey}":${JSON.stringify(mergedDataValue)},`)).length;
                      sizes[value] += size;
                      sizes.total += size;
                      found = value;
                      if (!space && dm.delete && this.esgst.settings[`${dm.type}_${optionKey}_${value}`] && value !== `main`) {
                        deletedSub += 1;
                        delete mergedData[mergedDataKey][valueKey];
                      }
                    }
                  }
                }
              }
              if (found) {
                sizes[found] -= 1;
                sizes.total -= 1;
              }
              if (dm.autoBackup || toExport || this.esgst.settings[`${dm.type}_${optionKey}_main`]) {
                data[optionKey][mergedDataKey] = newData;
                mainFound = true;
              }
              let size = (new TextEncoder().encode(`"${mergedDataKey}":{},`)).length;
              sizes.main += size;
              sizes.total += size;
              if (!space && dm.delete && ((this.esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
                delete mergedData[mergedDataKey];
              }
            }
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                for (let newDataKey in newData) {
                  if (newData.hasOwnProperty(newDataKey)) {
                    if (!mergedData[newDataKey]) {
                      mergedData[newDataKey] = {};
                    }
                    for (let value in values) {
                      if (values.hasOwnProperty(value)) {
                        if (this.esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                          if (this.esgst.settings.importAndMerge) {
                            for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                              let valueKey = values[value][j];
                              switch (valueKey) {
                                case `tags`:
                                  if (mergedData[newDataKey].tags) {
                                    let tags = newData[newDataKey].tags;
                                    for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                      let tag = tags[k];
                                      if (mergedData[newDataKey].tags.indexOf(tag) < 0) {
                                        mergedData[newDataKey].tags.push(tag);
                                      }
                                    }
                                  } else {
                                    mergedData[newDataKey].tags = newData[newDataKey].tags;
                                  }
                                  break;
                                case `readComments`:
                                  if (mergedData[newDataKey].readComments) {
                                    for (let id in mergedData[newDataKey].readComments) {
                                      if (mergedData[newDataKey].readComments.hasOwnProperty(id)) {
                                        if (newData[newDataKey].readComments[id] > mergedData[newDataKey].readComments[id]) {
                                          mergedData[newDataKey].readComments[id] = newData[newDataKey].readComments[id];
                                        }
                                      }
                                    }
                                  } else {
                                    mergedData[newDataKey].readComments = newData[newDataKey].readComments;
                                  }
                                  break;
                                default:
                                  mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
                                  break;
                              }
                            }
                          } else {
                            for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                              let valueKey = values[value][j];
                              mergedData[newDataKey][valueKey] = newData[newDataKey][valueKey];
                            }
                          }
                        }
                      }
                    }
                  }
                }
                await this.setValue(optionKey, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await this.setValue(optionKey, JSON.stringify(mergedData));
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":{}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (dm.switches[`${optionKey}_${value}`]) {
                    dm.switches[`${optionKey}_${value}`].size.textContent = this.convertBytes(sizes[value]);
                  }
                }
              }
              dm.switches[optionKey].size.textContent = this.convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `emojis`:
          data.emojis = JSON.parse(await this.getValue(`emojis`, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = JSON.stringify(dm.data.emojis);
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  await this.setValue(`emojis`, JSON.stringify(
                    Array.from(
                      new Set(
                        data.emojis.concat(
                          JSON.parse(this.fixEmojis(newData))
                        )
                      )
                    )
                  ));
                } else {
                  await this.setValue(`emojis`, this.fixEmojis(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(`emojis`);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `"[]"`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        case `entries`:
        case `templates`:
        case `savedReplies`:
          data[optionKey] = JSON.parse(await this.getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  let dataKey = optionKey === `entries` ? `timestamp` : `name`;
                  mergedData = data[optionKey];
                  for (let j = 0, numNew = newData.length; j < numNew; ++j) {
                    let newDataValue = newData[j];
                    let k, numMerged;
                    for (k = 0, numMerged = mergedData.length; k < numMerged && mergedData[k][dataKey] !== newDataValue[dataKey]; ++k) {
                    }
                    if (k < numMerged) {
                      mergedData[k] = newDataValue;
                    } else {
                      mergedData.push(newDataValue);
                    }
                  }
                  if (optionKey === `entries`) {
                    mergedData = sortArray(mergedData, false, `timestamp`);
                  }
                  await this.setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await this.setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        case `games`:
          values = {
            main: [`apps`, `packages`, `reducedCV`, `noCV`, `hidden`, `ignored`, `owned`, `wishlisted`, `followed`],
            gt: [`tags`],
            egh: [`entered`],
            itadi: [`itadi`]
          };
          data.games = {
            apps: {},
            subs: {}
          };
          mergedData = JSON.parse(await this.getValue(`games`, `{"apps":{},"subs":{}}`));
          sizes = {
            egh: 0,
            gt: 0,
            itadi: 0,
            main: 0,
            total: 0
          };
          mainFound = false;
          for (let mergedDataKey in mergedData.apps) {
            if (mergedData.apps.hasOwnProperty(mergedDataKey)) {
              let mergedDataValue = mergedData.apps[mergedDataKey];
              let newData = {};
              let toDelete = 0;
              let foundSub = 0;
              let deletedSub = 0;
              let found = null;
              let toExport = false;
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (this.esgst.settings[`${dm.type}_games_${value}`]) {
                    toDelete += 1;
                  }
                  for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                    let valueKey = values[value][j];
                    let newDataValue = mergedDataValue[valueKey];
                    if (typeof newDataValue !== `undefined`) {
                      if (value !== `main`) {
                        foundSub += 1;
                      }
                      if (dm.autoBackup || this.esgst.settings[`${dm.type}_games_${value}`] || value === `main`) {
                        newData[valueKey] = newDataValue;
                        if (value !== `main`) {
                          toExport = true;
                        }
                      }
                      let size = (new TextEncoder().encode(`"${valueKey}":${JSON.stringify(newDataValue)},`)).length;
                      sizes[value] += size;
                      sizes.total += size;
                      found = value;
                      if (!space && dm.delete && this.esgst.settings[`${dm.type}_games_${value}`] && value !== `main`) {
                        deletedSub += 1;
                        delete mergedDataValue[valueKey];
                      }
                    }
                  }
                }
              }
              if (found) {
                sizes[found] -= 1;
                sizes.total -= 1;
              }
              if (dm.autoBackup || toExport || this.esgst.settings[`${dm.type}_${optionKey}_main`]) {
                data.games.apps[mergedDataKey] = newData;
                mainFound = true;
              }
              let size = (new TextEncoder().encode(`"${mergedDataKey}":{},`)).length;
              sizes.main += size;
              sizes.total += size;
              if (!space && dm.delete && ((this.esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
                delete mergedData.apps[mergedDataKey];
              }
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          mainFound = false;
          for (let mergedDataKey in mergedData.subs) {
            if (mergedData.subs.hasOwnProperty(mergedDataKey)) {
              let mergedDataValue = mergedData.subs[mergedDataKey];
              let newData = {};
              let toDelete = 0;
              let foundSub = 0;
              let deletedSub = 0;
              let found = null;
              let toExport = false;
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (this.esgst.settings[`${dm.type}_games_${value}`]) {
                    toDelete += 1;
                  }
                  for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                    let valueKey = values[value][j];
                    let newDataValue = mergedDataValue[valueKey];
                    if (typeof newDataValue !== `undefined`) {
                      if (value !== `main`) {
                        foundSub += 1;
                      }
                      if (dm.autoBackup || this.esgst.settings[`${dm.type}_games_${value}`] || value === `main`) {
                        newData[valueKey] = newDataValue;
                        if (value !== `main`) {
                          toExport = true;
                        }
                      }
                      let size = (new TextEncoder().encode(`"${valueKey}":${JSON.stringify(newDataValue)},`)).length;
                      sizes[value] += size;
                      sizes.total += size;
                      found = value;
                      if (!space && dm.delete && this.esgst.settings[`${dm.type}_games_${value}`] && value !== `main`) {
                        deletedSub += 1;
                        delete mergedDataValue[valueKey];
                      }
                    }
                  }
                }
              }
              if (found) {
                sizes[found] -= 1;
                sizes.total -= 1;
              }
              if (dm.autoBackup || toExport || this.esgst.settings[`${dm.type}_${optionKey}_main`]) {
                data.games.subs[mergedDataKey] = newData;
                mainFound = true;
              }
              let size = (new TextEncoder().encode(`"${mergedDataKey}":{},`)).length;
              sizes.main += size;
              sizes.total += size;
              if (!space && dm.delete && ((this.esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
                delete mergedData.subs[mergedDataKey];
              }
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data.games;
              if (newData) {
                for (let newDataKey in newData.apps) {
                  if (newData.apps.hasOwnProperty(newDataKey)) {
                    let newDataValue = newData.apps[newDataKey];
                    if (!mergedData.apps[newDataKey]) {
                      mergedData.apps[newDataKey] = {};
                    }
                    let mergedDataValue = mergedData.apps[newDataKey];
                    for (let value in values) {
                      if (this.esgst.settings[`${dm.type}_games_${value}`]) {
                        for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                          let valueKey = values[value][j];
                          if (typeof newDataValue[valueKey] !== `undefined`) {
                            if (this.esgst.settings.importAndMerge) {
                              switch (valueKey) {
                                case `entered`:
                                  mergedDataValue.entered = true;
                                  break;
                                case `itadi`:
                                  if (mergedDataValue.itadi) {
                                    if (newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck) {
                                      mergedDataValue.itadi = newDataValue.itadi;
                                    }
                                  } else {
                                    mergedDataValue.itadi = newDataValue.itadi;
                                  }
                                  break;
                                case `tags`:
                                  if (mergedDataValue.tags) {
                                    let tags = newDataValue.tags;
                                    for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                      let tag = tags[k];
                                      if (mergedDataValue.tags.indexOf(tag) < 0) {
                                        mergedDataValue.tags.push(tag);
                                      }
                                    }
                                  } else {
                                    mergedDataValue.tags = newDataValue.tags;
                                  }
                                  break;
                                default:
                                  mergedDataValue[valueKey] = newDataValue[valueKey];
                                  break;
                              }
                            } else {
                              mergedDataValue[valueKey] = newDataValue[valueKey];
                            }
                          }
                        }
                      }
                    }
                  }
                }
                for (let newDataKey in newData.subs) {
                  if (newData.subs.hasOwnProperty(newDataKey)) {
                    let newDataValue = newData.subs[newDataKey];
                    if (!mergedData.subs[newDataKey]) {
                      mergedData.subs[newDataKey] = {};
                    }
                    let mergedDataValue = mergedData.subs[newDataKey];
                    for (let value in values) {
                      if (this.esgst.settings[`${dm.type}_games_${value}`]) {
                        for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                          let valueKey = values[value][j];
                          if (typeof newDataValue[valueKey] !== `undefined`) {
                            if (this.esgst.settings.importAndMerge) {
                              switch (valueKey) {
                                case `entered`:
                                  mergedDataValue.entered = true;
                                  break;
                                case `itadi`:
                                  if (mergedDataValue.itadi) {
                                    if (newDataValue.itadi.lastCheck > mergedDataValue.itadi.lastCheck) {
                                      mergedDataValue.itadi = newDataValue.itadi;
                                    }
                                  } else {
                                    mergedDataValue.itadi = newDataValue.itadi;
                                  }
                                  break;
                                case `tags`:
                                  if (mergedDataValue.tags) {
                                    let tags = newDataValue.tags;
                                    for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                      let tag = tags[k];
                                      if (mergedDataValue.tags.indexOf(tag) < 0) {
                                        mergedDataValue.tags.push(tag);
                                      }
                                    }
                                  } else {
                                    mergedDataValue.tags = newDataValue.tags;
                                  }
                                  break;
                                default:
                                  mergedDataValue[valueKey] = newDataValue[valueKey];
                                  break;
                              }
                            } else {
                              mergedDataValue[valueKey] = newDataValue[valueKey];
                            }
                          }
                        }
                      }
                    }
                  }
                }
                await this.setValue(`games`, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await this.setValue(`games`, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":{"apps":{},"subs":{}}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (dm.switches[`${optionKey}_${value}`]) {
                    dm.switches[`${optionKey}_${value}`].size.textContent = this.convertBytes(sizes[value]);
                  }
                }
              }
              dm.switches[optionKey].size.textContent = this.convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `groups`:
          values = {
            main: [`avatar`, `code`, `member`, `name`, `steamId`],
            gpt: [`tags`],
            sgg: [`stickied`]
          };
          mergedData = JSON.parse(await this.getValue(optionKey, `[]`));
          if (!Array.isArray(mergedData)) {
            let temp = [];
            for (let key in mergedData) {
              if (mergedData.hasOwnProperty(key)) {
                temp.push(mergedData[key]);
              }
            }
            mergedData = temp;
          }
          data[optionKey] = [];
          sizes = {
            main: 0,
            gpt: 0,
            sgg: 0,
            total: 0
          };
          mainFound = false;
          for (let j = mergedData.length - 1; j > -1; --j) {
            let newData = {};
            let toDelete = 0;
            let foundSub = 0;
            let deletedSub = 0;
            let found = null;
            let toExport = false;
            for (let value in values) {
              if (values.hasOwnProperty(value)) {
                if (this.esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                  toDelete += 1;
                }
                for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
                  let valueKey = values[value][k];
                  if (mergedData[j]) {
                    let mergedDataValue = mergedData[j][valueKey];
                    if (typeof mergedDataValue !== `undefined`) {
                      if (value !== `main`) {
                        foundSub += 1;
                      }
                      if (dm.autoBackup || this.esgst.settings[`${dm.type}_${optionKey}_${value}`] || value === `main`) {
                        newData[valueKey] = mergedDataValue;
                        if (value !== `main`) {
                          toExport = true;
                        }
                      }
                      let size = (new TextEncoder().encode(`"${valueKey}":${JSON.stringify(mergedDataValue)},`)).length;
                      sizes[value] += size;
                      sizes.total += size;
                      found = value;
                      if (!space && dm.delete && this.esgst.settings[`${dm.type}_${optionKey}_${value}`] && value !== `main`) {
                        deletedSub += 1;
                        delete mergedData[j][valueKey];
                      }
                    }
                  }
                }
              }
            }
            if (found) {
              sizes[found] -= 1;
              sizes.total -= 1;
            }
            if (dm.autoBackup || toExport || this.esgst.settings[`${dm.type}_${optionKey}_main`]) {
              data[optionKey].push(newData);
              mainFound = true;
            }
            let size = (new TextEncoder().encode(`{},`)).length;
            sizes.main += size;
            sizes.total += size;
            if (!space && dm.delete && ((this.esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
              mergedData.pop();
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (!Array.isArray(newData)) {
                let temp = [];
                for (let key in newData) {
                  if (newData.hasOwnProperty(key)) {
                    temp.push(newData[key]);
                  }
                }
                newData = temp;
              }
              if (newData) {
                for (let j = newData.length - 1; j > -1; --j) {
                  let code = newData[j].code;
                  let k, mergedDataValue;
                  for (k = mergedData.length - 1; k > -1 && mergedData[k].code !== code; --k) {
                  }
                  if (k > -1) {
                    mergedDataValue = mergedData[k];
                  } else {
                    mergedDataValue = {};
                    mergedData.push(mergedDataValue);
                  }
                  for (let value in values) {
                    if (values.hasOwnProperty(value)) {
                      if (this.esgst.settings[`${dm.type}_${optionKey}_${value}`]) {
                        for (let k = 0, numValues = values[value].length; k < numValues; ++k) {
                          let valueKey = values[value][k];
                          switch (valueKey) {
                            case `tags`:
                              if (mergedDataValue.tags) {
                                let tags = newData[j].tags;
                                for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                  let tag = tags[k];
                                  if (mergedDataValue.tags.indexOf(tag) < 0) {
                                    mergedDataValue.tags.push(tag);
                                  }
                                }
                              } else {
                                mergedDataValue.tags = newData[j].tags;
                              }
                              break;
                            default:
                              mergedDataValue[valueKey] = newData[j][valueKey];
                              break;
                          }
                        }
                      }
                    }
                  }
                }
                await this.setValue(optionKey, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await this.setValue(optionKey, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":[]}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (dm.switches[`${optionKey}_${value}`]) {
                    dm.switches[`${optionKey}_${value}`].size.textContent = this.convertBytes(sizes[value]);
                  }
                }
              }
              dm.switches[optionKey].size.textContent = this.convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `rerolls`:
        case `stickiedCountries`:
          data[optionKey] = JSON.parse(await this.getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  mergedData = data[optionKey];
                  for (let j = 0, numNew = newData.length; j < numNew; ++j) {
                    let newDataValue = newData[j];
                    if (mergedData.indexOf(newDataValue) < 0) {
                      mergedData.push(newDataValue);
                    }
                  }
                  await this.setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await this.setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        case `sgCommentHistory`:
          data[optionKey] = JSON.parse(await this.getValue(optionKey, `[]`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data[optionKey];
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  mergedData = [];
                  let oldData = data[optionKey];
                  let j = 0;
                  let k = 0;
                  let numNew = newData.length;
                  let numOld = oldData.length;
                  while (j < numOld && k < numNew) {
                    let oldDataValue = oldData[j];
                    let newDataValue = newData[k];
                    if (oldDataValue.timestamp > newDataValue.timestamp) {
                      mergedData.push(oldDataValue);
                      j += 1;
                    } else {
                      let l, numOld;
                      // noinspection JSUnusedAssignment
                      for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l) {
                      }
                      // noinspection JSUnusedAssignment
                      if (l >= numOld) {
                        mergedData.push(newDataValue);
                      }
                      k += 1;
                    }
                  }
                  while (j < numOld) {
                    mergedData.push(oldData[j]);
                    j += 1;
                  }
                  while (k < numNew) {
                    let newDataValue = newData[k];
                    let l, numOld;
                    // noinspection JSUnusedAssignment
                    for (l = 0; l < numOld && oldData[l].id !== newDataValue.id; ++l) {
                    }
                    // noinspection JSUnusedAssignment
                    if (l >= numOld) {
                      mergedData.push(newDataValue);
                    }
                    k += 1;
                  }
                  await this.setValue(optionKey, JSON.stringify(mergedData));
                } else {
                  await this.setValue(optionKey, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(optionKey);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `[]`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        case `users`:
          values = {
            main: [`whitelisted`, `whitelistedDate`, `blacklisted`, `blacklistedDate`],
            giveaways: [`giveaways`],
            namwc: [`namwc`],
            notes: [`notes`],
            nrf: [`nrf`],
            tags: [`tags`],
            uf: [`uf`],
            wbc: [`wbc`]
          };
          data.users = {
            steamIds: {},
            users: {}
          };
          mergedData = JSON.parse(await this.getValue(`users`, `{"steamIds":{},"users":{}}`));
          sizes = {
            giveaways: 0,
            namwc: 0,
            notes: 0,
            nrf: 0,
            main: 0,
            tags: 0,
            total: 0,
            uf: 0,
            wbc: 0
          };
          mainFound = false;
          mainUsernameFound = false;
          for (let mergedDataKey in mergedData.users) {
            if (mergedData.users.hasOwnProperty(mergedDataKey)) {
              let mergedDataValue = mergedData.users[mergedDataKey];
              let newData = {};
              let toDelete = 0;
              let foundSub = 0;
              let deletedSub = 0;
              let found = null;
              let toExport = false;
              for (let value in values) {
                if (values.hasOwnProperty(value)) {
                  if (this.esgst.settings[`${dm.type}_users_${value}`]) {
                    toDelete += 1;
                  }
                  for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                    let valueKey = values[value][j];
                    if (typeof mergedDataValue[valueKey] !== `undefined`) {
                      if (value !== `main`) {
                        foundSub += 1;
                      }
                      if (dm.autoBackup || this.esgst.settings[`${dm.type}_users_${value}`] || value === `main`) {
                        newData[valueKey] = mergedDataValue[valueKey];
                        if (value !== `main`) {
                          toExport = true;
                        }
                      }
                      let size = (new TextEncoder().encode(`"${valueKey}":${JSON.stringify(mergedDataValue[valueKey])},`)).length;
                      sizes[value] += size;
                      sizes.total += size;
                      found = value;
                      if (!space && dm.delete && this.esgst.settings[`${dm.type}_users_${value}`] && value !== `main`) {
                        deletedSub += 1;
                        delete mergedDataValue[valueKey];
                      }
                    }
                  }
                }
              }
              if (found) {
                sizes[found] -= 1;
                sizes.total -= 1;
              }
              let id = mergedDataValue.id;
              let username = mergedDataValue.username;
              let size = 0;
              if (id) {
                size += (new TextEncoder().encode(`"id":"${id}",`)).length;
              }
              if (username) {
                size += (new TextEncoder().encode(`"username":"${username}","${username}":"${mergedDataKey}",`)).length;
              }
              if (dm.autoBackup || toExport || this.esgst.settings[`${dm.type}_${optionKey}_main`]) {
                if (id) {
                  newData.id = id;
                }
                if (username) {
                  newData.username = username;
                  data.users.steamIds[username] = mergedDataKey;
                  mainUsernameFound = true;
                }
                data.users.users[mergedDataKey] = newData;
                mainFound = true;
              }
              size += (new TextEncoder().encode(`"${mergedDataKey}":{},`)).length;
              sizes.main += size;
              sizes.total += size;
              if (!space && dm.delete && ((this.esgst.settings[`${dm.type}_${optionKey}_main`] && foundSub === deletedSub) || toDelete === Object.keys(values).length)) {
                delete mergedData.steamIds[mergedDataValue.username];
                delete mergedData.users[mergedDataKey];
              }
            }
          }
          if (mainFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (mainUsernameFound) {
            sizes.main -= 1;
            sizes.total -= 1;
          }
          if (!space) {
            if (dm.import) {
              let newData = dm.data.users;
              if (newData) {
                for (let newDataKey in newData.users) {
                  if (newData.users.hasOwnProperty(newDataKey)) {
                    let newDataValue = newData.users[newDataKey];
                    if (!mergedData.users[newDataKey]) {
                      mergedData.users[newDataKey] = {
                        id: newDataValue.id,
                        username: newDataValue.username
                      };
                      mergedData.steamIds[newDataValue.username] = newDataKey;
                    }
                    let mergedDataValue = mergedData.users[newDataKey];
                    for (let value in values) {
                      if (values.hasOwnProperty(value)) {
                        if (this.esgst.settings[`${dm.type}_users_${value}`]) {
                          for (let j = 0, numValues = values[value].length; j < numValues; ++j) {
                            let valueKey = values[value][j];
                            if (newDataValue[valueKey]) {
                              if (this.esgst.settings.importAndMerge) {
                                switch (valueKey) {
                                  case `whitelisted`:
                                  case `whitelistedDate`:
                                  case `blacklisted`:
                                  case `blacklistedDate`:
                                    mergedDataValue[valueKey] = newDataValue[valueKey];
                                    break;
                                  case `notes`:
                                    mergedDataValue.notes = this.removeDuplicateNotes(mergedDataValue.notes ? `${mergedDataValue.notes}\n\n${newDataValue.notes}` : newDataValue.notes);
                                    break;
                                  case `tags`:
                                    if (mergedDataValue.tags) {
                                      let tags = newDataValue.tags;
                                      for (let k = 0, numTags = tags.length; k < numTags; ++k) {
                                        let tag = tags[k];
                                        if (mergedDataValue.tags.indexOf(tag) < 0) {
                                          mergedDataValue.tags.push(tag);
                                        }
                                      }
                                    } else {
                                      mergedDataValue.tags = newDataValue.tags;
                                    }
                                    break;
                                  case `giveaways`:
                                    if (mergedDataValue.giveaways) {
                                      if (newDataValue.giveaways.wonTimestamp > mergedDataValue.giveaways.wonTimestamp) {
                                        mergedDataValue.giveaways.won = newDataValue.giveaways.won;
                                        mergedDataValue.giveaways.wonTimestamp = newDataValue.giveaways.wonTimestamp;
                                      }
                                      if (newDataValue.giveaways.sentTimestamp > mergedDataValue.giveaways.sentTimestamp) {
                                        mergedDataValue.giveaways.sent = newDataValue.giveaways.sent;
                                        mergedDataValue.giveaways.sentTimestamp = newDataValue.giveaways.sentTimestamp;
                                      }
                                    } else {
                                      mergedDataValue.giveaways = newDataValue.giveaways;
                                    }
                                    break;
                                  default:
                                    if (mergedDataValue[valueKey]) {
                                      if (newDataValue[valueKey].lastCheck > mergedDataValue[valueKey].lastCheck) {
                                        mergedDataValue[valueKey] = newDataValue[valueKey];
                                      }
                                    } else {
                                      mergedDataValue[valueKey] = newDataValue[valueKey];
                                    }
                                    break;
                                }
                              } else {
                                mergedDataValue[valueKey] = newDataValue[valueKey];
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                await this.setValue(`users`, JSON.stringify(mergedData));
              }
            } else if (dm.delete) {
              await this.setValue(`users`, JSON.stringify(mergedData));
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":{"steamIds":{},"users":{}}}`)).length;
            sizes.main += size;
            sizes.total += size;
            if (dm.switches) {
              for (const value in values) {
                if (values.hasOwnProperty(value)) {
                  if (dm.switches[`${optionKey}_${value}`]) {
                    dm.switches[`${optionKey}_${value}`].size.textContent = this.convertBytes(sizes[value]);
                  }
                }
              }
              dm.switches[optionKey].size.textContent = this.convertBytes(sizes.total);
            }
            totalSize += sizes.total;
          }
          break;
        case `winners`:
          data.winners = JSON.parse(await this.getValue(`winners`, `{}`));
          if (!space) {
            if (dm.import) {
              let newData = dm.data.winners;
              if (newData) {
                if (this.esgst.settings.importAndMerge) {
                  mergedData = data.winners;
                  for (let newDataKey in newData) {
                    if (newData.hasOwnProperty(newDataKey)) {
                      if (!mergedData[newDataKey]) {
                        mergedData[newDataKey] = [];
                      }
                      for (let j = 0, numNew = newData[newDataKey].length; j < numNew; ++j) {
                        let newDataValue = newData[newDataKey][j];
                        if (mergedData[newDataKey].indexOf(newDataValue) < 0) {
                          mergedData[newDataKey].push(newDataValue);
                        }
                      }
                    }
                  }
                  await this.setValue(`winners`, JSON.stringify(mergedData));
                } else {
                  await this.setValue(`winners`, JSON.stringify(newData));
                }
              }
            } else if (dm.delete) {
              await this.delValue(`winners`);
            }
          }
          if (!dm.autoBackup) {
            let size = (new TextEncoder().encode(`{"${optionKey}":${await this.getValue(optionKey, `{}`)}}`)).length;
            totalSize += size;
            if (dm.switches) {
              dm.switches[optionKey].size.textContent = this.convertBytes(size);
            }
          }
          break;
        default:
          break;
      }
    }
    if (!dm.autoBackup && dm.computerSpaceCount) {
      dm.computerSpaceCount.textContent = this.convertBytes(totalSize);
    }
    if (space) {
      if (space.close) {
        space.close();
      }
      return totalSize;
    } else {
      if (dm.type === `export` || this.esgst.settings.exportBackup) {
        if (dropbox || (dm.type !== `export` && this.esgst.settings.exportBackupIndex === 1)) {
          await this.delValue(`dropboxToken`);
          this.openSmallWindow(`https://www.dropbox.com/oauth2/authorize?redirect_uri=https://www.steamgifts.com/esgst/dropbox&response_type=token&client_id=nix7kvchwa8wdvj`);
          // noinspection JSIgnoredPromiseFromCall
          this.checkDropboxComplete(data, dm, callback);
        } else if (googleDrive || (dm.type !== `export` && this.esgst.settings.exportBackupIndex === 2)) {
          await this.delValue(`googleDriveToken`);
          this.openSmallWindow(`https://accounts.google.com/o/oauth2/v2/auth?${this.esgst.settings.usePreferredGoogle ? `login_hint=${this.esgst.settings.preferredGoogle}&` : ``}redirect_uri=https://www.steamgifts.com/esgst/google-drive&response_type=token&client_id=102804278399-95kit5e09mdskdta7eq97ra7tuj20qps.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/drive.appdata`);
          // noinspection JSIgnoredPromiseFromCall
          this.checkGoogleDriveComplete(data, dm, callback);
        } else if (oneDrive || (dm.type !== `export` && this.esgst.settings.exportBackupIndex === 3)) {
          await this.delValue(`oneDriveToken`);
          this.openSmallWindow(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${this.esgst.settings.usePreferredMicrosoft ? `login_hint=${this.esgst.settings.preferredMicrosoft}&` : ``}redirect_uri=https://www.steamgifts.com/esgst/onedrive&response_type=token&client_id=1781429b-289b-4e6e-877a-e50015c0af21&scope=files.readwrite`);
          // noinspection JSIgnoredPromiseFromCall
          this.checkOneDriveComplete(data, dm, callback);
        } else {
          const name = `${this.esgst.askFileName ? prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`}`;
          if (name === `null`) {
            callback();
            return;
          }
          if (this.esgst.backupZip) {
            await this.downloadZip(data, `${name}.json`, `${name}.zip`);
          } else {
            this.downloadFile(JSON.stringify(data), `${name}.json`);
          }
          if (!dm.autoBackup) {
            this.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        }
      } else {
        this.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
        callback();
      }
    }
  }

  async downloadZip(data, fileName, zipName) {
    this.downloadFile(null, zipName, await this.getZip(JSON.stringify(data), fileName));
  }

  async getZip(data, fileName, type = `blob`) {
    const zip = new JSZip();
    zip.file(fileName, data);
    return (await zip.generateAsync({
      compression: `DEFLATE`,
      compressionOptions: {
        level: 9
      },
      type: type
    }));
  }

  async readZip(data) {
    const zip = new JSZip();

    /** @type {ZipFile} */
    const contents = await zip.loadAsync(data);
    const keys = Object.keys(contents.files),
      output = [];
    for (const key of keys) {
      output.push({
        name: key,
        value: await zip.file(key).async(`string`)
      });
    }
    return output;
  }

  downloadFile(data, fileName, blob) {
    const url = URL.createObjectURL(blob || new Blob([data])),
      file = document.createElement(`a`);
    file.download = fileName;
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    URL.revokeObjectURL(url);
  }

  getDataSizes(dm) {
    let spacePopup = new Popup({
      addScrollable: true,
      icon: `fa-circle-o-notch fa-spin`,
      title: `Calculating data sizes...`
    });
    spacePopup.open(this.manageData.bind(this, dm, false, false, false, spacePopup));
  }

  async loadImportFile(dm, dropbox, googleDrive, oneDrive, space, callback) {
    let file;
    if (dropbox) {
      await this.delValue(`dropboxToken`);
      this.openSmallWindow(`https://www.dropbox.com/oauth2/authorize?redirect_uri=https://www.steamgifts.com/esgst/dropbox&response_type=token&client_id=nix7kvchwa8wdvj`);
      // noinspection JSIgnoredPromiseFromCall
      this.checkDropboxComplete(null, dm, callback);
    } else if (googleDrive) {
      await this.delValue(`googleDriveToken`);
      this.openSmallWindow(`https://accounts.google.com/o/oauth2/v2/auth?${this.esgst.settings.usePreferredGoogle ? `login_hint=${this.esgst.settings.preferredGoogle}&` : ``}redirect_uri=https://www.steamgifts.com/esgst/google-drive&response_type=token&client_id=102804278399-95kit5e09mdskdta7eq97ra7tuj20qps.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/drive.appdata`);
      // noinspection JSIgnoredPromiseFromCall
      this.checkGoogleDriveComplete(null, dm, callback);
    } else if (oneDrive) {
      await this.delValue(`oneDriveToken`);
      this.openSmallWindow(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${this.esgst.settings.usePreferredMicrosoft ? `login_hint=${this.esgst.settings.preferredMicrosoft}&` : ``}redirect_uri=https://www.steamgifts.com/esgst/onedrive&response_type=token&client_id=1781429b-289b-4e6e-877a-e50015c0af21&scope=files.readwrite`);
      // noinspection JSIgnoredPromiseFromCall
      this.checkOneDriveComplete(null, dm, callback);
    } else {
      file = dm.input.files[0];
      if (file) {
        dm.reader = new FileReader();
        const blob = file.name.match(/\.zip$/) && file;
        if (blob) {
          // noinspection JSIgnoredPromiseFromCall
          this.readImportFile(dm, dropbox, googleDrive, oneDrive, space, blob, callback);
        } else {
          dm.reader.readAsText(file);
          dm.reader.onload = this.readImportFile.bind(this, dm, dropbox, googleDrive, oneDrive, space, null, callback);
        }
      } else {
        this.createFadeMessage(dm.warning, `No file was loaded!`);
        callback();
      }
    }
  }

  async readImportFile(dm, dropbox, googleDrive, oneDrive, space, blob, callback) {
    try {
      if (dm.reader) {
        dm.data = JSON.parse(blob
          ? (await this.readZip(blob))[0].value
          : dm.reader.result
        );
      }
      this.createConfirmation(`Are you sure you want to restore the selected data?`, this.manageData.bind(this, dm, dropbox, googleDrive, oneDrive, space, callback), callback);
    } catch (error) {
      this.createFadeMessage(dm.warning, `Cannot parse file!`);
      callback();
    }
  }

  confirmDataDeletion(dm, dropbox, googleDrive, oneDrive, space, callback) {
    this.createConfirmation(`Are you sure you want to delete the selected data?`, this.manageData.bind(this, dm, dropbox, googleDrive, oneDrive, space, callback), callback);
  }

  async checkDropboxComplete(data, dm, callback) {
    let value = await this.getValue(`dropboxToken`);
    if (value) {
      if (dm.type === `export` || (data && this.esgst.settings.exportBackup)) {
        const name = this.esgst.askFileName ? prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const response = await this.request({
            data: JSON.stringify(data),
            fileName: this.esgst.backupZip ? `${name}.json` : null,
            headers: {
              authorization: `Bearer ${value}`,
              [`Dropbox-API-Arg`]: this.esgst.backupZip ? `{"path": "/${name}.zip"}` : `{"path": "/${name}.json"}`,
              [`Content-Type`]: `application/octet-stream`
            },
            method: `POST`,
            url: `https://content.dropboxapi.com/2/files/upload`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            // noinspection ExceptionCaughtLocallyJS
            throw ``;
          }
          if (!dm.autoBackup) {
            this.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error occurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup({
          addScrollable: true,
          icon: `fa-dropbox`,
          isTemp: true,
          title: `Select a file to restore:`
        });
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
        let entries = this.createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await this.request({
          data: `{"path": ""}`,
          headers: {
            authorization: `Bearer ${value}`,
            [`Content-Type`]: `application/json`
          },
          method: `POST`,
          url: `https://api.dropboxapi.com/2/files/list_folder`
        })).responseText).entries.forEach(entry => {
          let item = this.createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${entry.name} - ${this.convertBytes(entry.size)}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            this.createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await this.request({
                blob: entry.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`,
                  [`Dropbox-API-Arg`]: `{"path": "/${entry.name}"}`,
                  [`Content-Type`]: `text/plain`
                },
                method: `GET`,
                url: `https://content.dropboxapi.com/2/files/download`
              })).responseText);
              // noinspection JSIgnoredPromiseFromCall
              this.manageData(dm, false, false, false, false, callback);
            });
          });
        });
      }
    } else {
      setTimeout(() => this.checkDropboxComplete(data, dm, callback), 250);
    }
  }

  async checkGoogleDriveComplete(data, dm, callback) {
    let value = await this.getValue(`googleDriveToken`);
    if (value) {
      if (dm.type === `export` || (data && this.esgst.settings.exportBackup)) {
        const name = this.esgst.askFileName ? prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const resourceResponse = await this.request({
            data: this.esgst.backupZip ? `{"name": "${name}.zip", "parents": ["appDataFolder"]}` : `{"name": "${name}.json", "parents": ["appDataFolder"]}`,
            headers: {
              authorization: `Bearer ${value}`,
              [`Content-Type`]: `application/json`
            },
            method: `POST`,
            url: `https://www.googleapis.com/drive/v3/files`
          });
          const response = await this.request({
            data: JSON.stringify(data),
            fileName: this.esgst.backupZip ? `${name}.json` : null,
            headers: {
              authorization: `Bearer ${value}`,
              [`Content-Type`]: this.esgst.backupZip ? `application/zip` : `text/plain`
            },
            method: `PATCH`,
            url: `https://www.googleapis.com/upload/drive/v3/files/${JSON.parse(resourceResponse.responseText).id}?uploadType=media`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            // noinspection ExceptionCaughtLocallyJS
            throw ``;
          }
          if (!dm.autoBackup) {
            this.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error occurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup({
          addScrollable: true,
          icon: `fa-google`,
          isTemp: true,
          title: `Select a file to restore:`
        });
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
        let entries = this.createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await this.request({
          headers: {
            authorization: `Bearer ${value}`
          },
          method: `GET`,
          url: `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder`
        })).responseText).files.forEach(file => {
          let item = this.createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${file.name}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            this.createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await this.request({
                blob: file.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`
                },
                method: `GET`,
                url: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`
              })).responseText);
              // noinspection JSIgnoredPromiseFromCall
              this.manageData(dm, false, false, false, false, callback);
            });
          });
        });
      }
    } else {
      setTimeout(() => this.checkGoogleDriveComplete(data, dm, callback), 250);
    }
  }

  async checkOneDriveComplete(data, dm, callback) {
    let value = await this.getValue(`oneDriveToken`);
    if (value) {
      if (dm.type === `export` || (data && this.esgst.settings.exportBackup)) {
        const name = this.esgst.askFileName ? prompt(`Enter the name of the file:`, `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_data_${new Date().toISOString().replace(/:/g, `_`)}`;
        if (name === null) {
          callback();
          return;
        }
        let responseText = ``;
        try {
          const response = await this.request({
            anon: true,
            data: JSON.stringify(data),
            fileName: this.esgst.backupZip ? `${name}.json` : null,
            headers: {
              Authorization: `bearer ${value}`,
              [`Content-Type`]: this.esgst.backupZip ? `application/zip` : `text/plain`
            },
            method: `PUT`,
            url: this.esgst.backupZip ? `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${name}.zip:/content` : `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${name}.json:/content`
          });
          responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          if (!responseJson.id) {
            // noinspection ExceptionCaughtLocallyJS
            throw ``;
          }
          if (!dm.autoBackup) {
            this.createFadeMessage(dm.message, `Data ${dm.pastTense} with success!`);
          }
          callback();
        } catch (e) {
          callback();
          alert(`An error occurred when uploading the file.\n\n${e}\n\n${responseText}`);
        }
      } else {
        let canceled = true;
        let popup = new Popup({
          addScrollable: true,
          icon: `fa-windows`,
          isTemp: true,
          title: `Select a file to restore:`
        });
        let entries = this.createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `popup__keys__list`
          },
          type: `div`
        }]);
        JSON.parse((await this.request({
          anon: true,
          headers: {
            Authorization: `bearer ${value}`
          },
          method: `GET`,
          url: `https://graph.microsoft.com/v1.0/me/drive/special/approot/children`
        })).responseText).value.forEach(file => {
          let item = this.createElements(entries, `beforeEnd`, [{
            attributes: {
              class: `esgst-clickable`
            },
            text: `${file.name} - ${this.convertBytes(file.size)}`,
            type: `div`
          }]);
          item.addEventListener(`click`, () => {
            this.createConfirmation(`Are you sure you want to restore the selected data?`, async () => {
              canceled = false;
              popup.close();
              dm.data = JSON.parse((await this.request({
                anon: true,
                blob: file.name.match(/\.zip$/),
                headers: {
                  authorization: `Bearer ${value}`
                },
                method: `GET`,
                url: `https://graph.microsoft.com/v1.0/me/drive/items/${file.id}/content`
              })).responseText);
              // noinspection JSIgnoredPromiseFromCall
              this.manageData(dm, false, false, false, false, callback);
            });
          });
        });
        popup.onClose = () => {
          if (canceled) {
            callback();
          }
        };
        popup.open();
      }
    } else {
      setTimeout(() => this.checkOneDriveComplete(data, dm, callback), 250);
    }
  }

  async createLock(key, threshold) {
    let lock = {
      key: key,
      threshold: threshold,
      uuid: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, this.createUuid.bind(this))
    };
    await this.checkLock(lock);
    return this.setValue.bind(this, key, `{}`);
  }

  async checkLock(lock) {
    let locked = JSON.parse(await this.getValue(lock.key, `{}`));
    if (!locked || !locked.uuid || locked.timestamp < Date.now() - (lock.threshold + 1000)) {
      await this.setValue(lock.key, JSON.stringify({
        timestamp: Date.now(),
        uuid: lock.uuid
      }));
      await this.timeout(lock.threshold / 2);
      locked = JSON.parse(await this.getValue(lock.key, `{}`));
      if (!locked || locked.uuid !== lock.uuid) {
        return this.checkLock(lock);
      }
    } else {
      await this.timeout(lock.threshold / 3);
      return this.checkLock(lock);
    }
  }

  async lockAndSaveGames(games) {
    let deleteLock = await this.createLock(`gameLock`, 300);
    let saved = JSON.parse(await this.getValue(`games`));
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
    await this.setValue(`games`, JSON.stringify(saved));
    deleteLock();
  }

  async setThemeVersion(id, version, theme) {
    if (!theme) {
      theme = await this.getValue(id);
    }
    let match = (theme || ``).match(/(v|black\s|blue\s|steamtrades\s)([.\d]+?)\*/);
    version.textContent = `v${(match && match[2]) || `Unknown`}`;
  }

  resetColor(hexInput, alphaInput, id, colorId) {
    const color = rgba2Hex(this.esgst.defaultValues[`${id}_${colorId}`]);
    hexInput.value = color.hex;
    alphaInput.value = color.alpha;
    // noinspection JSIgnoredPromiseFromCall
    this.setSetting(`${id}_${colorId}`, hex2Rgba(hexInput.value, alphaInput.value));
  }

  setSMManageFilteredUsers(SMManageFilteredUsers) {
    let popup;
    SMManageFilteredUsers.addEventListener(`click`, async () => {
      if (popup) {
        popup.open();
      } else {
        popup = new Popup({addScrollable: true, icon: `fa-eye-slash`, title: `Filtered Users`});
        let users = JSON.parse(await this.getValue(`users`));
        let filtered = [];
        for (let key in users.users) {
          if (users.users.hasOwnProperty(key)) {
            if (users.users[key].uf && (users.users[key].uf.posts || users.users[key].uf.giveaways || users.users[key].uf.discussions)) {
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
        let table = this.createElements(popup.scrollable, `beforeEnd`, [{
          attributes: {
            class: `table`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__heading`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column--width-fill`
              },
              text: `Username`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Posts Hidden`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Discussions Hidden`,
              type: `div`
            }, {
              attributes: {
                class: `table__column--width-small`
              },
              text: `Giveaways Hidden`,
              type: `div`
            }]
          }, {
            attributes: {
              class: `table__rows`
            },
            type: `div`
          }]
        }]);
        for (let i = 0, n = filtered.length; i < n; ++i) {
          const postsIcon = filtered[i].uf.posts ? `fa fa-check` : ``;
          const discussionsIcon = filtered[i].uf.discussions ? `fa fa-check` : ``;
          const giveawaysIcon = filtered[i].uf.giveaways ? `fa fa-check` : ``;
          this.createElements(table.lastElementChild, `beforeEnd`, [{
            attributes: {
              class: `table__row-outer-wrap`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__row-inner-wrap`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__column--width-fill`
                },
                type: `div`,
                children: [{
                  attributes: {
                    href: `/user/${filtered[i].username}`
                  },
                  text: filtered[i].username,
                  type: `a`
                }]
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: postsIcon ? [{
                  attributes: {
                    class: postsIcon
                  },
                  type: `i`
                }] : null
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: discussionsIcon ? [{
                  attributes: {
                    class: discussionsIcon
                  },
                  type: `i`
                }] : null
              }, {
                attributes: {
                  class: `table__column--width-small`
                },
                type: `div`,
                children: giveawaysIcon ? [{
                  attributes: {
                    class: giveawaysIcon
                  },
                  type: `i`
                }] : null
              }]
            }]
          }]);
        }
        popup.open();
      }
    });
  }

  multiChoice(choice1Color, choice1Icon, choice1Title, choice2Color, choice2Icon, choice2Title, title, onChoice1, onChoice2) {
    if (this.esgst.settings.cfh_img_remember) {
      if (this.esgst.cfh_img_choice === 1) {
        onChoice1();
      } else {
        onChoice2();
      }
    } else {
      let popup = new Popup({addScrollable: true, icon: `fa-list`, isTemp: true, title: title});
      new ToggleSwitch(popup.description, `cfh_img_remember`, false, `Never ask again.`, false, false, `Remembers which option you choose forever.`, this.esgst.settings.cfh_img_remember);
      popup.description.appendChild(new ButtonSet({
        color1: choice1Color,
        color2: ``,
        icon1: choice1Icon,
        icon2: ``,
        title1: choice1Title,
        title2: ``,
        callback1: () => {
          return new Promise(resolve => {
            if (this.esgst.settings.cfh_img_remember) {
              // noinspection JSIgnoredPromiseFromCall
              this.setValue(`cfh_img_choice`, 1);
              this.esgst.cfh_img_choice = 1;
            }
            resolve();
            popup.close();
            onChoice1();
          });
        }
      }).set);
      popup.description.appendChild(new ButtonSet({
        color1: choice2Color,
        color2: ``,
        icon1: choice2Icon,
        icon2: ``,
        title1: choice2Title,
        title2: ``,
        callback1: () => {
          return new Promise(resolve => {
            if (this.esgst.settings.cfh_img_remember) {
              // noinspection JSIgnoredPromiseFromCall
              this.setValue(`cfh_img_choice`, 2);
              this.esgst.cfh_img_choice = 2;
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
    /** @type {EsgstSettings} */
    let settings = JSON.parse(await this.getValue(`settings`, `{}`));
    let data = {settings};

    delete data.settings.avatar;
    delete data.settings.lastSync;
    delete data.settings.steamApiKey;
    delete data.settings.steamId;
    delete data.settings.syncFrequency;
    delete data.settings.username;
    const name = `${this.esgst.askFileName ? prompt(`Enter the name of the file:`, `esgst_settings_${new Date().toISOString().replace(/:/g, `_`)}`) : `esgst_settings_${new Date().toISOString().replace(/:/g, `_`)}`}.json`;
    if (name === `null.json`) return;
    this.downloadFile(JSON.stringify(data), name);
  }

  async selectSwitches(switches, type, settings) {
    for (let key in switches) {
      if (switches.hasOwnProperty(key)) {
        let toggleSwitch = switches[key];
        if (Array.isArray(toggleSwitch)) {
          toggleSwitch[0][type](settings);
        } else if (!toggleSwitch.checkbox || toggleSwitch.checkbox.offsetParent) {
          toggleSwitch[type](settings);
        }
      }
    }
    if (settings) {
      let message = this.createElements(settings, `beforeEnd`, [{
        attributes: {
          class: `esgst-description esgst-bold`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`,
            title: `Saving...`
          },
          type: `i`
        }]
      }]);
      await this.setValue(`settings`, JSON.stringify(this.esgst.settings));
      message.classList.add(`esgst-green`);
      this.createElements(message, `inner`, [{
        attributes: {
          class: `fa fa-check`,
          title: `Saved!`
        },
        type: `i`
      }]);
      setTimeout(() => message.remove(), 2500);
    }
  }

  addStyle() {
    let backgroundColor, color, colors, i, n, style;
    style = `
    :root {
      --esgst-gwc-highlight-width: ${this.esgst.gwc_h_width};
      --esgst-gwr-highlight-width: ${this.esgst.gwr_h_width};
    }
  `;
    colors = [
      {
        id: `gc_h`,
        key: `hidden`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_gi`,
        key: `giveawayInfo`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_fcv`,
        key: `fullCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rcv`,
        key: `reducedCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_ncv`,
        key: `noCV`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_hltb`,
        key: `hltb`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_w`,
        key: `wishlisted`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_f`,
        key: `followed`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_o`,
        key: `owned`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_pw`,
        key: `won`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_i`,
        key: `ignored`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_lg`,
        key: `learning`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rm`,
        key: `removed`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_ea`,
        key: `earlyAccess`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_tc`,
        key: `tradingCards`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_a`,
        key: `achievements`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_sp`,
        key: `singleplayer`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_mp`,
        key: `multiplayer`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_sc`,
        key: `steamCloud`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_l`,
        key: `linux`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_m`,
        key: `mac`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_dlc`,
        key: `dlc`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_p`,
        key: `package`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_rd`,
        key: `releaseDate`,
        mainKey: `esgst-gc`
      },
      {
        id: `gc_g`,
        key: `genres`,
        mainKey: `esgst-gc`
      }
    ];
    for (i = 0, n = colors.length; i < n; ++i) {
      color = this.esgst[`${colors[i].id}_color`];
      backgroundColor = this.esgst[`${colors[i].id}_bgColor`];
      style += `
      ${colors[i].key === `genres` ? `a` : ``}.${colors[i].mainKey}-${colors[i].key}:not(.giveaway__column):not(.featured__column) {
        background-color: ${backgroundColor};
        ${color ? `color: ${color};` : ``}
      }
      .${colors[i].mainKey}-${colors[i].key}.giveaway__column, .${colors[i].mainKey}-${colors[i].key}.featured__column {
        color: ${backgroundColor};
      }
    `;
    }
    colors = [
      {
        id: `wbh_w`,
        key: `whitelisted`,
        mainKey: `esgst-wbh-highlight`
      },
      {
        id: `wbh_b`,
        key: `blacklisted`,
        mainKey: `esgst-wbh-highlight`
      },
      {
        id: `ge_p`,
        key: `public`,
        mainKey: `esgst-ge`
      },
      {
        id: `ge_g`,
        key: `group`,
        mainKey: `esgst-ge`
      },
      {
        id: `ge_b`,
        key: `blacklist`,
        mainKey: `esgst-ge`
      }
    ];
    for (i = 0, n = colors.length; i < n; ++i) {
      color = this.esgst[`${colors[i].id}_color`];
      backgroundColor = this.esgst[`${colors[i].id}_bgColor`];
      style += `
      .${colors[i].mainKey}-${colors[i].key} {
        background-color: ${backgroundColor} !important;
        ${color ? `color: ${color} !important;` : ``}
      }
    `;
    }
    style += `
    .esgst-element-ordering-container, .esgst-element-ordering-container >* {
      margin: 5px;
    }
    
    .esgst-element-ordering-box {
      border: 2px solid #ccc;
      border-radius: 5px;
      padding: 5px;
    }
    
    .esgst-element-ordering-box >* {
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: move;
      display: inline-block;
      margin: 5px;
      padding: 5px;
    }
    
    .esgst-page-heading-buttons {
      background: none;
      border: none;
      margin: 0 !important;
      padding: 0;
    }
    
     .esgst-page-heading-buttons >* {
      margin-right: 5px;
    }
    
    .esgst-inline-list >*:not(:last-child) {
      margin-right: 15px;
    }

    .form_list_item_summary_name {
      display: inline-block;
    }

    .esgst-tag-suggestions {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      max-height: 200px;
      overflow: auto;
      position: absolute;
      width: 300px;
    }

    .esgst-tag-suggestion {
      cursor: pointer;
      font-weight: bold;
      padding: 5px;
      text-shadow: none;
    }

    .esgst-tag-suggestion:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }  

    .esgst-tag-suggestion.esgst-selected {
      background-color: #465670;
      color: #fff;
    }

    .table__row-inner-wrap .esgst-heading-button, .table__row-inner-wrap .esgst-ct-count, .table__row-inner-wrap .esgst-gdttt-button {
      margin-left: 3px !important;
    }

    .esgst-gc-panel >*, .esgst-toggle-switch {
      margin-right: 3px !important;
    }

    .esgst-ugd-input {
      background-color: inherit !important;
      border-color: inherit !important;
      color: inherit;
      display: inline-block;
      margin: 0 5px;
      padding: 0 2px !important;
      width: 50px;
    }

    .esgst-hwlc-panel {
      display: flex;
      justify-items: space-between;
    }

    .esgst-hwlc-section {
      margin: 25px;
      width: 300px;
    }

    .esgst-hwlc-section textarea {
      min-height: 200px;
    }

    @keyframes border-blink {
      50% {
        border-color: transparent;
      }
    }

    .esgst-minimize-panel {
      left: -198px;
      position: fixed;
      top: 0;
      width: 200px;
      z-index: 999999999;
    }

    .esgst-minimize-panel:hover {
      padding-left: 198px;
    }

    .esgst-minimize-container {
      background-color: #fff;
      height: 100vh;
      overflow-y: auto;
      padding: 5px;
      width: 188px;
    }

    .esgst-minimize-panel.alert {
      animation: border-blink 1s ease-in-out infinite;
      border-right: 10px solid #ff0000;
      left: -200px;
    }

    .esgst-minimize-panel.alert:hover {
      border: none;
      left: -198px;
    }

    .esgst-minimize-item.alert {
      animation: border-blink 1s ease-in-out infinite;
      border: 2px solid #ff0000;
    }

    :root {
      --esgst-body-bg-color: #f0f2f5;
    }

    .sticky_sentinel {
      left: 0;
      position: absolute;
      right: 0;
      visibility: hidden;
    }

    .esgst-gf-basic-filters {
      display: flex;
      justify-content: space-between;
    }

    .esgst-gf-basic-filters input {
      display: inline-block;
      padding: 2px;
      width: 100px;
    }

    .esgst-gf-basic-filters >* {
      margin: 5px;
    }

    .esgst-gf-number-filters {
      flex: 1;
    }

    .esgst-gf-number-filters >*, .esgst-gf-string-filters >* {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .esgst-gf-boolean-filters {
      column-count: 2;
      flex: 1;
    }

    .esgst-gf-basic-filters + div {
      font-size: 14px;
      font-weight: bold;
    }

    .esgst-gf-legend-panel {
      display: block;
      float: right;
      text-align: right;
      margin-top: 50px;
    }

    .esgst-ns * {
      max-width: 206px;
    }

    .esgst-clear-container {
      display: flex;
    }

    .esgst-clear-button {
      align-self: center;
      cursor: pointer;
      padding: 5px 10px;
    }

    .esgst-draggable-trash {
      background-color: #C11B17;
      border-radius: 5px;
      color: #E77471;
      position: absolute;
      text-align: center;
      text-shadow: none;
    }

    .esgst-draggable-trash i {
      font-size: 25px;
      margin: 5px;
    }

    .esgst-qiv-new {
      float: right;
      font-weight: bold;
      margin-right: 10px;
    }

    .esgst-mm-checkbox {
      display: inline-block;
      margin-right: 5px;
    }

    .esgst-mm-checkbox i {
      margin: 0;
    }

    .esgst-mm-popout {
      width: 550px;
    }

    .esgst-mm-popout textarea {
      height: 150px !important;
      overflow-y: auto !important;
    }

    .esgst-mm-popout .esgst-button-set >* {
      line-height: 25px;
      margin: 2px;
      padding-bottom: 0;
      padding-top: 0;
      width: 100px;
    }

    .esgst-mm-headings {
      display: flex;
      font-size: 0;
    }

    .esgst-mm-headings >* {
      background-color: #eee;
      border: 1px solid #ccc;
      cursor: pointer;
      flex: 1;
      font-size: 12px;
      font-weight: bold;
      padding: 5px;
      width: 150px;
    }

    .esgst-mm-headings .esgst-selected {
      background-color: #fff;
      border-bottom: 0;
    }

    .esgst-mm-sections {
      border-bottom: 1px solid #ccc;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      padding: 5px;
    }

    .esgst-mm-sections >* {
      display: none;
    }

    .esgst-mm-sections .esgst-selected {
      display: block;
    }

    .esgst-rotate-90 {
      transform: rotate(90deg);
    }

    .esgst-rotate-270 {
      transform: rotate(270deg);
    }

    .esgst-chfl-compact {
      padding: 8px 15px !important;
    }

    .footer__outer-wrap .esgst-chfl-panel, footer .esgst-chfl-panel {
      position: static !important;
    }

    .esgst-chfl-panel {
      position: absolute;
      right: 10px;
    }

    .esgst-chfl-panel i {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      color: #555 !important;
      cursor: pointer;
      font-size: 18px !important;
      margin: 0 !important;
      padding: 5px;
      width: auto !important;
    }

    .esgst-chfl-small i {
      font-size: 18px !important;
      width: 36px;
    }

    .esgst-mgc-table * {
      text-align: left;
    }

    .esgst-ochgb {
      display: inline-block;
    }

    .featured__heading .esgst-ochgb i, .featured__heading .esgst-gf-hide-button i, .featured__heading .esgst-gf-unhide-button i, .featured__heading .esgst-gb-button i {
      opacity: .6;
      transition: opacity .2s;
    }

    .featured__heading .esgst-ochgb i:hover, .featured__heading .esgst-gf-hide-button i:hover, .featured__heading .esgst-gf-unhide-button i:hover, .featured__heading .esgst-gb-button i:hover {
      opacity: 1;
    }

    @keyframes esgst-blinker {
      50% { opacity: 0; }
    }

    .esgst-blinking {
      animation: esgst-blinker 1s linear infinite;
    }

    .esgst-qiv-popout {
      max-height: 600px !important;
      overflow: hidden !important;
      width: 600px;
    }

    .esgst-qiv-comments {
      overflow-y: auto;
    }

    .esgst-giveaway-column-button {
      border: 0;
      padding: 0;
    }

    .esgst-giveaway-column-button >* {
      line-height: inherit;
    }

    .esgst-elgb-button .sidebar__error {
      margin-bottom: 0;
    }

    .esgst-mgc-preview {
      border: 1px solid #ccc;
      padding: 25px;
      width: 600px;
    }

    .esgst-mgc-input {
      display: inline-block;
      text-align: center;
      width: 75px;
    }

    .esgst-relative {
      position: relative;
    }

    .esgst-nm-icon {
      color: #ff0000 !important;
    }

    .esgst-disabled {
      cursor: default !important;
      opacity: 0.5;
    }

    .esgst-changelog img {
      max-width: 98%;
    }

    .esgst-radb-button {
      cursor: pointer;
      display: inline-block;
    }

    .esgst-radb-button.homepage_heading {
      margin-right: 5px;
    }

    :not(.page__heading) > .esgst-radb-button:not(.homepage_heading) {
      margin-left: 5px;
    }

    .esgst-radb-button + .homepage_heading {
      display: inline-block;
      width: calc(100% - 80px);
    }

    .esgst-cfh-preview {
      margin: 5px 0;
      text-align: left;
    }

    .esgst-qgs-container i {
      color: #AAB5C6;
    }

    .esgst-qgs-container {
      align-items: center;
      background-color: #fff;
      border-color: #c5cad7 #dee0e8 #dee0e8 #d2d4e0;
      border-radius: 4px;
      border-style: solid;
      border-width: 1px;
      display: flex;
      margin-right: 5px;
      padding: 5px 10px;
    }

    .esgst-qgs-container-expanded {
      position: absolute;
    }

    .esgst-qgs-container-expanded .esgst-qgs-input {
      width: 300px;
    }

    .esgst-qgs-container-expanded + .nav__button-container {
      margin-left: 40px;
    }

    .esgst-qgs-input {
      border: 0 !important;
      height: 100%;
      line-height: normal !important;
      padding: 0 !important;
      width: 0;
    }

    .esgst-sgc-results .table__row-outer-wrap {
      padding: 10px 5px;
    }

    .esgst-glwc-results {
      display: flex;
    }

    .esgst-glwc-results >* {
      flex: 1;
      margin: 10px;
    }

    .esgst-glwc-heading {
      font-family: "Open Sans";
      font-size: 25px;
      margin: 5px;
      text-align: center;
    }

    .esgst-stbb-button, .esgst-sttb-button {
      cursor: pointer;
    }

    .esgst-stbb-button-fixed, .esgst-sttb-button-fixed {
      bottom: ${this.esgst.ff ? 49 : 5}px;
      background-color: #fff;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      color: #4B72D4;
      padding: 5px 15px;
      position: fixed;
      right: 5px;
    }

    .esgst-stbb-button:not(.esgst-hidden) + .esgst-sttb-button {
      bottom: 79px;
    }

    .esgst-bold {
      font-weight: bold;
    }

    .esgst-italic {
      font-style: italic;
    }

    .esgst-es-page-divisor {
      margin: 5px 0;
    }

    .comment__parent .esgst-cerb-reply-button {
      margin-top: 54px;
      position: absolute;
      text-align: center;
      width: 44px;
    }

    .comment_inner .esgst-cerb-reply-button {
      margin-left: 21px;
      margin-top: 34px;
      position: absolute;
      text-align: center;
      width: 24px;
    }

    .esgst-page-heading {
      display: flex;
      align-items: flex-start;
      word-wrap: break-word;
    }

    .esgst-page-heading >* {
      background-image: linear-gradient(#fff 0%, rgba(255,255,255,0.4) 100%);
      display: flex;
      padding: 5px 10px;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      color: #4B72D4;
      font: 700 14px/22px "Open Sans", sans-serif;
    }

    .esgst-page-heading i {
      line-height: 22px;
    }

    .esgst-page-heading >*:not(.page__heading__breadcrumbs) {
      align-items: center;
    }

    .esgst-page-heading >*:not(:last-child) {
      margin-right: 5px;
    }

    .esgst-form-row {
      margin-bottom: 20px;
    }

    .esgst-form-row:first-of-type {
      margin-top: 14px;
    }

    .esgst-form-heading {
      align-items: center;
      display: flex;
      margin-bottom: 5px;
    }

    .esgst-form-heading > div:not(:last-child) {
      margin-right: 10px;
    }

    .esgst-form-heading-number {
      font: 300 14px "Open Sans", sans-serif;
      color:#6b7a8c;
    }

    .esgst-form-heading-text {
      font: 700 14px "Open Sans", sans-serif;
      color: #4B72D4;
    }

    .esgst-form-row-indent {
      padding: 3px 0 3px 20px;
      margin-left: 5px;
      border-left: 1px solid #d2d6e0;
      box-shadow: 1px 0 0 rgba(255,255,255,0.3) inset;
    }

    .esgst-form-sync {
      display: flex;
    }

    .esgst-form-sync-data {
      flex: 1;
    }

    .esgst-notification {
      border: 1px solid;
      border-radius: 4px;
      padding: 0 15px;
      font-size: 11px;
      line-height: 32px;
      overflow: hidden;
    }

    .esgst-notification a {
      text-decoration: underline;
    }

    .esgst-notification-success {
      background-image: linear-gradient(#f7fcf2 0%, #e7f6da 100%);
      border-color: #C5E9A5;
      color:#8fa47b;
    }

    .esgst-notification-warning {
      background-image: linear-gradient(#F6F6E6 0px, #F5F5DF 20px);
      border-color: #EDE5B2;
      color: #a59d7c;
    }

    .esgst-user-icon {
      display: inline-block;
      line-height: normal;
      margin: 0 5px 0 0;
    }

    .esgst-user-icon i {
      border: 0;
      line-height: normal;
      margin: 0;
      text-shadow: none !important;
    }

    .esgst-whitelist {
      color: #556da9 !important;
    }

    .esgst-blacklist {
      color: #a95570 !important;
    }

    .esgst-positive {
      color: #96c468 !important;
    }

    .esgst-negative {
      color: #ec8583 !important;
    }

    .esgst-unknown {
      color: #77899a !important;
    }

    .esgst-ugd-table .table__rows .table__row-outer-wrap:hover {
      background-color: rgba(119, 137, 154, 0.1);
    }

    .esgst-ugd-table .table__column--width-small {
      min-width: 0;
      width: 12%;
    }

    .esgst-ugd-lists {
      display: flex;
      justify-content: center;
    }

    .markdown {
      word-break: break-word;
    }

    .esgst-busy >* {
      opacity: 0.2;
    }

    .comment__actions .esgst-rml-link {
      margin: 0 0 0 10px;
    }

    .esgst-settings-menu .form__sync-default {
      margin: 0 5px;
    }

    .esgst-uh-popup a {
      border-bottom: 1px dotted;
    }

    .esgst-auto-sync {
      display: inline-block;
      margin: -5px 5px 0;
      padding: 2px;
      width: 50px;
    }

    .esgst-ap-popout .featured__table__row__left:not(.esgst-uh-title), .esgst-mr-reply, .esgst-mr-edit, .esgst-mr-delete, .esgst-mr-undelete {
      margin: 0 10px 0 0;
    }

    .esgst-ugd-button {
      cursor: pointer;
      display: inline-block;
    }

    .esgst-cfh-popout {
      font: 700 12px "Open Sans", sans-serif;
    }

    .esgst-cfh-panel span >:first-child >* {
      margin: 0 !important;
    }

    .esgst-cfh-popout input {
      width: auto;
    }

    .esgst-namwc-highlight {
      font-weight: bold;
    }

    .esgst-iwh-icon {
      margin: 0 0 0 5px;
    }

    .esgst-ap-suspended >* {
      color: #e9202a;
    }

    .esgst-ap-popout {
      border: none !important;
      border-radius: 5px;
      box-shadow: 0 0 10px 2px hsla(0, 0%, 0%, 0.8);
      min-width: 400px;
      padding: 0 !important;
      text-shadow: none;
    }

    .ui-tooltip {
      z-index: 99999;
    }

    .esgst-ap-popout .featured__outer-wrap:not(.esgst-uh-box) {
      border-radius: 5px;
      padding: 5px;
      width: auto;
      white-space: normal;
    }

    .esgst-ap-popout .featured__inner-wrap {
      align-items: flex-start;
      padding: 0 5px 0 0;
    }

    .esgst-ap-popout .featured__heading {
      margin: 0;
    }

    .esgst-ap-popout .featured__heading__medium {
      font-size: 18px;
    }

    .esgst-ap-link {
      width: 100px;
    }

    .esgst-ap-link .global__image-outer-wrap--avatar-large {
      box-sizing: content-box !important;
      height: 64px !important;
      margin: 5px;
      width: 64px !important;
    }

    .esgst-ap-popout .global__image-outer-wrap--avatar-large:hover {
      background-color: hsla(0, 0%, 25%, 0.2) !important;
    }

    .esgst-ap-link .global__image-inner-wrap {
      background-size: cover !important;
    }

    .esgst-ap-popout .sidebar__shortcut-outer-wrap {
      margin: 10px 0;
    }

    .esgst-ap-popout .sidebar__shortcut-inner-wrap i {
      height: 18px;
      font-size: 12px;
    }

    .esgst-ap-popout .sidebar__shortcut-inner-wrap * {
      line-height: 18px;
      vertical-align: middle;
    }

    .esgst-ap-popout .sidebar__shortcut-inner-wrap img {
      height: 16px;
      vertical-align: baseline !important;
      width: 16px;
    }

    .esgst-ap-popout .featured__table {
      display: inline-block;
      width: 100%;
    }

    .esgst-ap-popout .featured__table__row {
      padding: 2px;
    }

    .esgst-ap-popout .featured__table__row:nth-child(n + 3) {
      margin-left: -95px;
    }

    .esgst-ap-popout .featured__table__row:last-of-type .featured__table__row__right * {
      font-size: 11px;
    }

    .esgst-ct-comment-button {
      cursor: pointer;
    }

    .popup__keys__list .esgst-ggl-member, .esgst-dh-highlighted, .esgst-dh-highlighted.table__row-outer-wrap {
      background-color: rgba(150, 196, 104, 0.2) !important;
      padding: 5px !important;
    }

    .esgst-gb-highlighted.ending, .esgst-error-button, .esgst-error-button >*:hover {
      background-color: rgba(236, 133, 131, 0.8) !important;
      background-image: none !important;
    }

    .esgst-gb-highlighted.started {
      background-color: rgba(150, 196, 104, 0.8) !important;
      background-image: none !important;
    }

    .esgst-gb-highlighted.ending.started {
      background-color: rgba(193, 165, 118, 0.8) !important;
      background-image: none !important;
    }

    .esgst-ct-comment-read:hover, .esgst-ct-visited:hover {
      background-color: rgba(119, 137, 154, 0.1) !important;
    }

    .esgst-gf-hide-button, .esgst-gf-unhide-button, .esgst-gb-button, .esgst-gdttt-button {
      cursor: pointer; display: inline-block;
      margin: 0 5px 0 0;
    }

    .esgst-codb-button, .esgst-dh-button, .esgst-df-button {
      display: inline-block;
      margin: 0 5px 0 0;
      padding: 0;
    }

    .page__heading .esgst-codb-button >*, .page__heading .esgst-dh-button >*, .page__heading .esgst-df-button >* {
      padding: 5px 10px;
    }

    .esgst-ust-checkbox {
      cursor: pointer;
      margin-left: -17px;
      position: absolute;
      top: calc(50% - 7px);
    }

    .esgst-pm-button {
      margin-left: -17px;
      position: absolute;
      top: calc(50% - 7px);
    }

    .esgst-dh-highlighted .esgst-pm-button {
      margin-left: -22px;
    }

    .page__heading .esgst-pm-button {
      display: inline-block;
      margin: 0 5px 0 0;
      padding: 0;
      position: static;
    }

    .page__heading .esgst-pm-button >* {
      padding: 5px 10px;
    }

    .esgst-adots .esgst-pm-button {
      margin-left: -58px;
    }

    .comment__actions .esgst-ct-comment-button {
      margin: 0 0 0 10px;
    }

    .comment__actions >:first-child + .esgst-ct-comment-button {
      margin: 0;
    }

    .esgst-ct-comment-button >:not(:last-child) {
      margin: 0 10px 0 0;
    }

    .esgst-cfh-panel {
      margin: 0 0 2px;
      position: sticky;
      text-align: left;
    }

    .esgst-cfh-panel >* {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      display: inline-block;
      margin: 1px;
      opacity: 0.5;
      padding: 5px;
    }

    .esgst-cfh-panel >*:hover {
      opacity: 1;
    }

    .esgst-cfh-panel span >:not(:first-child), .esgst-ded-status {
      display: block;
    }

    .esgst-cfh-panel span i {
      line-height: 22px;
    }

    .esgst-cfh-panel .form__saving-button {
      display: inline-block;
      margin: 5px;
      min-width:0;
    }

    .esgst-cfh-panel table {
      display: block;
      max-height: 200px;
      max-width: 375px;
      overflow: auto;
    }

    .esgst-cfh-panel table td:first-child {
      min-width: 25px;
      text-align: center;
    }

    .esgst-cfh-panel table td:not(:first-child) {
      min-width: 75px;
      text-align: center;
    }

    .esgst-cfh-emojis {
      display: block !important;
      font-size: 18px;
      max-height: 200px;
      min-height: 30px;
      overflow: auto;
      text-align: center;
    }

    .esgst-cfh-emojis >* {
      cursor: pointer;
      display: inline-block;
      margin: 2px;
    }

    .esgst-cfh-popout {
      white-space: normal;
      width: 300px;
    }

    .esgst-mpp-popup {
      position: fixed !important;
    }

    .esgst-mpp-visible {
      padding: 0;
    }

    .esgst-mpp-hidden {
      display: none;
      max-height: 75%;
      overflow: auto;
      padding: 15px;
      position: absolute;
      width: 75%;
    }

    .esgst-ueg {
      opacity: 1 !important;
    }

    .esgst-fh {
      height: auto !important;
      position: sticky;
      top: 0;
      z-index: 999 !important;
    }

    .esgst-fs {
      overflow-y: hidden;
      position: sticky;
    }

    .esgst-fs.stuck {
      overflow-y: auto;
    }

    .esgst-fs.stuck .sidebar__mpu {
      display: none !important;
    }

    .esgst-fmph {
      background-color: var(--esgst-body-bg-color);
      margin-top: -5px;
      padding: 5px 0;
      position: sticky;
      z-index: 998;
    }

    .esgst-fmph + * {
      margin-top: -5px;
    }

    .esgst-ff {
      background-color: inherit;
      bottom: 0;
      padding: 0;
      position: sticky;
      z-index: 999;
    }

    .esgst-ff >* {
      padding: 15px 25px;
    }

    .esgst-sgac-button, .esgst-sgg-button {
      margin: 0 5px 0 0;
    }

    .esgst-ct-count {
      color: #e9202a;
      font-weight: bold;
    }

    .esgst-uh-box {
      background: linear-gradient(to bottom, #555, #222);
      border: 1px solid #888;
      margin: 5px 0 0;
      padding: 15px;
      position: absolute;
      text-align: center;
    }

    .esgst-uh-title {
      color: rgba(255, 255, 255, 0.6);
      font-weight: bold;
      margin: 0 0 15px;
    }

    .esgst-uh-list {
      color: rgba(255, 255, 255, 0.4);
    }

    .esgst-ugd-button, .esgst-wbc-button, .esgst-namwc-button, .esgst-nrf-button {
      cursor: pointer;
      margin: 0 0 0 5px;
    }

    .esgst-luc-value {
      margin: 0 0 0 5px;
    }

    .esgst-sgpb-container {
      display: flex;
    }

    .esgst-sgpb-container >* {
      flex: 1;
    }

    .esgst-sgpb-button {
      background-image: linear-gradient(rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%);
      border-color: #dde2ea #cdd4df #cbd1dc #d6dbe7;
      color: #6e7585;
      text-shadow: 1px 1px 1px #fff;
      transition: opacity 0.5s;
      border-radius: 3px;
      font: 700 13px 'Open Sans', sans-serif;
      margin: 0 0 0 5px;
      padding: 7px 15px;
      display: flex;
      align-items: center;
      border-width: 1px;
      border-style: solid;
      text-decoration: none;
    }

    .esgst-sgpb-button:active {
      background-image: linear-gradient(#e1e7eb 0%, #e6ebf0 50%, #ebeff2 100%) !important;
      box-shadow: 2px 2px 5px #ccd4db inset;
      text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.6);
      margin: 2px 0 0 7px !important;
      border: 0;
    }

    .esgst-sgpb-button:hover {
      background-image: linear-gradient(rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.3) 100%);
    }

    .esgst-sgpb-button i {
      height: 14px;
      margin: 0 10px 0;
      width: 14px;
    }

    .esgst-sgpb-button img {
      height: 14px;
      vertical-align: baseline;
      width: 14px;
    }

    .esgst-stpb-button img {
      vertical-align: top;
    }

    .esgst-gh-highlight, .esgst-green-highlight {
      background-color: rgba(150, 196, 104, 0.2);
    }

    .esgst-pgb-button, .esgst-gf-button {
      border: 1px solid #d2d6e0;
      border-top: none;
      background-color: #e1e6ef;
      background-image: linear-gradient(rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);color: #6b7a8c;
      cursor: pointer;
      margin-bottom: 15px;
      padding: 3px;
      text-align: center;
      border-radius: 0 0 4px 4px;
    }

    .esgst-gf-button {
      margin-bottom: 0 !important;
    }

    .esgst-pgb-button:hover, .esgst-gf-button:hover {
      background-image:linear-gradient(rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
    }

    .esgst-gm-giveaway {
      background-color: #fff;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      display: inline-block;
      margin: 5px 2px;
      padding: 2px 5px;
    }

    .esgst-feature-description {
      background-color: #fff;
      color: #465670;
      padding: 10px;
      width: 420px;
      border-radius: 4px;
    }

    .esgst-feature-description img {
      max-width: 400px;
    }

    .esgst-gm-giveaway.error {
      background-color: rgba(236, 133, 131, 0.5);
    }

    .esgst-gm-giveaway.success {
      background-color: rgba(150, 196, 104, 0.5);
    }

    .esgst-gm-giveaway.connected {
      text-decoration: line-through;
    }

    .esgst-gts-section >*, .esgst-gm-section >* {
      margin: 5px 0;
    }

    .esgst-gm-section .esgst-button-set {
      display: inline-block;
      margin: 5px;
    }

    .sidebar .esgst-button-set >* {
      margin-bottom: 5px;
      width: 304px;
    }

    .esgst-button-set .sidebar__entry-delete, .esgst-button-set .sidebar__error {
      display: inline-block;
    }

    .esgst-button-group {
      display: block;
    }

    .esgst-button-group >* {
      display: inline-block;
    }

    .esgst-button-group >*:not(:first-child) {
      margin-left: 5px;
    }

    .esgst-ggl-panel {
      color: #6b7a8c;
      font-size: 12px;
      padding: 5px;
    }

    .esgst-ggl-panel >* {
      display: inline-block;
    }

    .esgst-ggl-panel >*:not(:last-child) {
      margin-right: 10px;
    }

    .esgst-ggl-panel a:last-child {
      border-bottom: 1px dotted;
    }

    .esgst-ggl-panel .table_image_avatar {
      cursor: pointer;
      display: inline-block;
      height: 12px;
      width: 12px;
      vertical-align: middle;
    }

    .esgst-ggl-member {
      font-weight: bold;
    }

    .esgst-ggl-heading {
      font-weight: bold;
      line-weight: 22px;
      margin: 10px;
    }

    .esgst-gcl-popout, .esgst-ggl-popout {
      padding: 0 !important;
    }

    .esgst-gcl-popout .table__row-outer-wrap, .esgst-ggl-popout .table__row-outer-wrap {
      padding: 10px 5px;
    }

    .esgst-hidden-buttons {
      padding: 2px !important;
    }

    .esgst-popout {
      background-color: #fff;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      color: #465670;
      left: 0;
      overflow: auto;
      padding: 10px;
      position: absolute;
      top: 0;
      z-index: 99999;
    }

    .esgst-aic-carousel {
      align-items: center;
      cursor: default !important;
      display: flex;
      justify-content: center;
    }

    .esgst-aic-carousel >:last-child {
      border: 5px solid #fff;
      border-radius: 5px;
      max-width: 90%;
    }

    .esgst-aic-carousel img {
      display: block;
    }

    .esgst-aic-panel {
      color: #fff;
      position: absolute;
      text-align: center;
      top: 25px;
    }

    .esgst-aic-left-button, .esgst-aic-right-button {
      cursor: pointer;
      display: inline-block;
      margin: 10px;
      text-align: center;
      width: 25px;
    }

    .esgst-aic-left-button i, .esgst-aic-right-button i {
      font-size: 25px;
    }

    .esgst-aic-source {
      font-weight: bold;
      margin-top: 10px;
      text-decoration: underline;
    }

    .esgst-popup-modal {
      background-color: rgba(60, 66, 77, 0.7);
      bottom: 0;
      cursor: pointer;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
    }

    .esgst-popup-large {
      width: 75%;
    }

    .esgst-popup {
      background-color: var(--esgst-body-bg-color);
      border-radius: 4px;
      color: #465670;
      padding: 25px;
      position: fixed;
      text-align: center;
      text-shadow: 1px 1px rgba(255,255,255,0.94);
      transition: 500ms ease;
      ${this.esgst.staticPopups ? `
        max-width: calc(100% - 150px);
        top: 50px;
        ${this.esgst.staticPopups_f ? `
          left: 0;
          margin: 0 auto;
          right: 0;
          width: ${this.esgst.staticPopups_width};
        ` : `
          left: 50px;
        `}
      ` : `
        max-width: calc(90% - 50px);
      `}
    }

    .esgst-popout li:before, .esgst-popup li:before {
      margin-left: 0;
      padding-right: 10px;
      position: static;
      width: auto;
      text-align: left;
    }

    .esgst-popup-description >*:not(.esgst-tag-suggestions), .esgst-popup-scrollable >* {
      margin: 10px 0 0 !important;
    }

    .esgst-popup-actions {
      color: #4b72d4;
      margin-top: 15px;
    }

    .esgst-popup-actions >* {
      border-bottom: 1px dotted;
      box-shadow: 0 1px 0 #fff;
      cursor: pointer;
      display: inline-block;
    }

    .esgst-popup-actions >*:not(:last-child) {
      margin-right: 15px;
    }

    .esgst-popup-scrollable {
      overflow: auto;
    }

    .esgst-popup .popup__keys__list {
      max-height: none;
    }

    .esgst-heading-button {
      display: inline-block;
      cursor: pointer;
    }

    .esgst-popup-heading {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }

    .esgst-popup-icon {
      font-size: 25px;
      margin-right: 10px;
    }

    .esgst-popup-title {
      font: 300 18px 'Open Sans', sans-serif;
    }

    .esgst-popup-title span {
      font-weight: bold;
    }

    .esgst-text-left {
      text-align: left;
    }

    .esgst-text-center {
      text-align: center;
    }

    .esgst-hidden {
      display: none !important;
    }

    .esgst-clickable {
      cursor: pointer;
    }

    .fa img {
      height: 14px;
      width: 14px;
      vertical-align: middle;
    }

    .nav__left-container .fa img {
      vertical-align: baseline;
    }

    .esgst-checkbox, .esgst-hb-update, .esgst-hb-changelog, .esgst-dh-view-button {
      cursor: pointer;
    }

    .esgst-sm-small-number {
      font-size: 12px;
      display: inline-block;
    }

    .esgst-toggle-switch-container {
      margin: 2px;
    }

    .esgst-toggle-switch-container.inline {
      display: inline-block;
    }

    .page__heading .esgst-toggle-switch-container.inline, .page_heading .esgst-toggle-switch-container.inline, .esgst-page-heading .esgst-toggle-switch-container.inline {
      height: 16px;
      margin: 0 2px;
      line-height: normal;
      vertical-align: middle;
    }

    .esgst-toggle-switch {
      position: relative;
      display: inline-block;
      width: 26px;
      height: 14px;
      vertical-align: top;
    }

    .esgst-toggle-switch input {
      display: none !important;
    }

    .esgst-toggle-switch-slider {
      border-radius: 20px;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .esgst-toggle-switch-slider:before {
      border-radius: 50%;
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 1px;
      bottom: 1px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .esgst-toggle-switch-slider {
      background-color: #4B72D4;
    }

    input:focus + .esgst-toggle-switch-slider {
      box-shadow: 0 0 1px #4B72D4;
    }

    input:checked + .esgst-toggle-switch-slider:before {
      -webkit-transform: translateX(12px);
      -ms-transform: translateX(12px);
      transform: translateX(12px);
    }

    .esgst-adots, .esgst-rbot {
      margin-bottom: 25px;
    }

    .esgst-float-left {
      float: left;
    }

    .esgst-float-right {
      float: right;
    }

    .esgst-clear {
      clear: both;
    }

    .esgst-rbot .reply_form .btn_cancel {
      display: none;
    }

    .esgst-aas-button {
      cursor: pointer;
      display: inline-block;
    }

    .esgst-es-page-heading {
      margin-top: 25px;
    }

    .esgst-gc-border {
      display: flex;
      height: 5px;
      margin-left: 5px;
      width: ${this.esgst.ib ? `186px` : `174px`};
    }

    .esgst-gc-border >* {
      flex: 1;
    }

    .esgst-gc-panel {
      text-align: left;
    }

    .esgst-gc-panel a {
      text-decoration: none;
    }

    .esgst-gc-panel-inline {
      display: inline-block;
      margin: 0 0 0 5px;
    }

    .esgst-gch-highlight, .esgst-gc:not(.giveaway__column):not(.featured__column) {
      border-radius: 4px;
      display: inline-block;
      font-size: 10px;
      line-height: 10px;
      margin: 5px 0;
      padding: 2px 3px;
      text-shadow: none;
    }

    .esgst-gch-highlight {
      font-size: 14px;
      line-height: 14px;
      margin: 0 5px;
    }

    a.esgst-gc-genres {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;
    }

    .esgst-gf-container {
      position: sticky;
      text-align: left;
      z-index: 998;
    }

    .esgst-gf-container:not(.esgst-popup-scrollable) {
      background-color: #E8EAEF;
      border-radius: 4px;
    }

    .esgst-gf-container.esgst-popup-scrollable {
      min-width: 650px;
    }

    .esgst-gf-filters {
      display: flex;
      justify-content: space-between;
      overflow: auto;
      position: relative;
    }

    .esgst-gf-left-panel {
      flex: 1;
      max-height: 500px;
      overflow-y: auto;
    }

    .esgst-gf-right-panel .form__input-small {
      width: 100px !important;
    }

    .esgst-gf-filters >* {
      margin: 5px;
    }

    .esgst-gf-preset-panel {
      margin: 5px;
      text-align: right;
    }

    .esgst-gf-preset-panel >* {
      margin: 5px;
    }

    .esgst-gf-filter-count {
      background-color: #ddd;
      border-radius: 5px;
      font-size: 10px;
      padding: 2px;
      vertical-align: middle;
    }

    .esgst-gf-button {
      border-top: 1px;
    }

    .esgst-wbh-highlight {
      border: none !important;
      border-radius: 4px;
      padding: 2px 5px;
      text-shadow: none;
    }

    .page__heading__breadcrumbs .esgst-wbh-highlight {
      padding: 0 2px;
    }

    .esgst-sm-colors input {
      display: inline-block;
      padding: 0;
      width: 100px;
    }

    .esgst-sm-colors input[type=color] {
      width: 25px;
    }

    .esgst-sm-colors select {
      display: inline-block;
      padding: 0;
      width: 100px;
    }

    .esgst-sm-colors-default {
      line-height: normal;
      padding: 5px 15px;
    }

    .esgst-ged-icon {
      margin: 0 0 0 10px;
    }

    .esgst-pgb-container {
      border-radius: 0 !important;
      margin: 0! important;
    }

    .esgst-gf-box {
      background-color: #E8EAEF;
      border: 1px solid #d2d6e0;
      border-radius: 0 !important;
      margin: 0! important;
      padding: 0 15px;
    }

    .esgst-gr-button {
      cursor: pointer;
      display: inline-block;
    }

    .esgst-egh-icon {
      cursor: pointer;
    }

    .giveaway__row-outer-wrap .esgst-egh-button, .giveaway__row-outer-wrap .esgst-gr-button, .table__row-outer-wrap .esgst-egh-button, .table__row-outer-wrap .esgst-egh-button, .table__row-outer-wrap .esgst-gr-button {
      margin-right: 5px;
    }

    p.table__column__heading {
      display: inline-block;
    }

    .esgst-giveaway-links {
      float: left;
      margin: 2px;
    }

    .esgst-gv-box .esgst-giveaway-panel:empty {
      height: 0;
      width: 0;
    }

    .esgst-giveaway-panel:empty {
      height: 25px;
      width: 250px;
    }

    .esgst-giveaway-panel.giveaway__columns {
      float: right;
      margin: 2px;
    }

    .esgst-giveaway-panel .esgst-button-set {
      border: 0;
      padding: 0;
    }

    .esgst-giveaway-panel .esgst-button-set >* {
      line-height: inherit;
      margin:0;
    }

    .esgst-giveaway-panel >:first-child {
      margin: 0;
    }

    .esgst-giveaway-panel >*:not(:first-child) {
      margin: 0 0 0 5px;
    }

    .esgst-gv-popout .esgst-gwc, .esgst-gv-popout .esgst-gwr, .esgst-gv-popout .esgst-gptw, .esgst-gv-popout .esgst-ttec {
      display: inline-block;
      margin: 0 !important;
      padding: 0 5px !important;
      width: 67px !important;
      vertical-align: top;
    }

    .esgst-gv-popout .esgst-gp-button {
      display: inline-block;
      margin: 0 !important;
      width: auto !important;
      vertical-align: top;
    }

    .esgst-gv-popout .esgst-gp-button >* {
      padding: 0 5px !important;
      width: 67px !important;
    }

    .esgst-giveaway-panel .form__submit-button, .esgst-giveaway-panel .form__saving-button {
      margin-bottom: 0;
      min-width: 0;
    }

    .esgst-ged-source {
      font-weight: bold;
      margin: 5px 0;
    }

    .table__column--width-small {
      width: 8%;
    }

    .sidebar .table__row-outer-wrap {
      padding: 5px 0;
    }

    .esgst-adots-tab-heading {
      background-color: #2f3540;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      opacity: 0.5;
      padding: 5px 10px;
      text-shadow: none;
    }

    .esgst-adots-tab-heading.esgst-selected {
      opacity: 1;
    }

    .sidebar .esgst-adots {
      margin: 0;
      max-height: 300px;
      max-width: 336px;
      overflow: auto;
    }

    .sidebar .esgst-adots .esgst-dh-highlighted {
      padding: 0 !important;
      padding-bottom: 5px !important;
    }

    .sidebar .esgst-adots .table__column__heading, .esgst-adots .homepage_table_column_heading {
      display: inline-block;
      max-width: 225px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
      white-space: nowrap;
    }

    .esgst-ns .esgst-adots .table__column__heading, .esgst-ns .esgst-adots .homepage_table_column_heading {
      max-width: 100px;
    }

    .sidebar .esgst-adots .table__row-outer-wrap {
      padding: 0 !important;
      padding-bottom: 5px !important;
      border: 0;
      box-shadow: none;
    }

    .sidebar .esgst-adots .table__row-inner-wrap {
      display: block;
    }

    .sidebar .esgst-adots .table__row-inner-wrap >*:not(:last-child) {
      display: inline-block;
    }

    .esgst-faded {
      opacity: 0.5;
    }

    .esgst-sm-faded >*:not(.SMFeatures), .esgst-sm-faded > .SMFeatures > .esgst-sm-colors {
      opacity: 0.5;
    }

    .esgst-green {
      color: #96c468 !important;
    }

    .esgst-grey {
      color: #77899a !important;
    }

    .esgst-orange {
      color: #c1a576 !important;
    }

    .esgst-red {
      color: #ec8583 !important;
    }

    .esgst-yellow {
      color: #fecc66 !important;
    }

    .esgst-warning {
      color: #e9202a !important;
      font-weight: bold;
    }

    .esgst-toggle-switch-container .esgst-description, .esgst-button-group .esgst-description {
      display: inline-block;
      margin: 0;
    }

    .esgst-description {
      color: #6b7a8c;
      font-size: 11px;
      font-style: italic;
      margin-top: 10px;
    }

    .esgst-progress-bar {
      height: 10px;
      overflow: hidden;
      text-align: left;
    }

    .esgst-progress-bar .ui-progressbar-value {
      background-color: #96c468;
      height: 100%;
      margin: -1px;
    }

    .esgst-ib-user {
      background-color: #fff;
      background-position: 5px 5px;
      background-size: 32px;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      height: 44px;
      padding: 5px;
      width: 44px;
    }

    .featured__outer-wrap .esgst-ib-user {
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .esgst-ib-game {
      background-color: #fff;
      background-position: 5px 5px;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      padding: 5px;
    }

    .giveaway__row-outer-wrap .esgst-ib-game {
      background-size: 184px 69px;
      height: 81px;
      width: 196px;
    }

    .table__row-outer-wrap .esgst-ib-game {
      background-size: 85px 32px;
      height: 44px;
      width: 97px;
    }

    .esgst-oadd >* {
      padding-left: 0 !important;
      margin-left: 0 !important;
      border-left: none !important;
      box-shadow: none !important;
    }

    .esgst-gv-spacing {
      font-weight: bold;
      padding: 10px;
      text-align: center;
      width: 100px;
    }

    .esgst-gv-view {
      font-size: 0;
      padding: 5px 0;
      text-align: center;
    }

    .esgst-gv-view.pinned-giveaways__inner-wrap--minimized .giveaway__row-outer-wrap:nth-child(-n + 10) {
      display: inline-block;
    }

    .esgst-gv-container {
      border: 0 !important;
      box-shadow: none !important;
      display: inline-block;
      font-size: 12px;
      padding: 0;
      text-align: center;
      vertical-align: top;
      width: ${this.esgst.ib ? `196px` : `184px`};
    }

    .esgst-gv-box {
      display: block;
    }

    .esgst-gv-box >*:not(.giveaway__summary):not(.esgst-gv-icons) {
      margin: 0 !important;
    }

    .esgst-gv-box.is-faded:hover, .esgst-gv-box.esgst-faded:hover {
      opacity: 1;
    }

    .esgst-gv-icons {
      float: right;
      height: 18px;
      margin: -18px 0 0 !important;
    }

    .esgst-gv-icons .esgst-gc, .esgst-gv-icons .esgst-gwc, .esgst-gv-icons .esgst-gwr, .esgst-gv-icons .esgst-gptw, .esgst-gv-icons .esgst-ttec, .esgst-gv-time, .esgst-gv-icons .esgst-ged-source {
      background-color: #fff;
      padding: 2px !important;
    }

    .esgst-gv-icons .esgst-gp-button {
      background-color: #fff;
    }

    .esgst-ged-source {
      font-weight: bold;
    }

    .esgst-gv-time i {
      font-size: 12px;
      vertical-align: baseline;
    }

    .esgst-gv-icons >* {
      line-height: normal;
      margin: 0 !important;
    }

    .esgst-gv-icons >*:not(.esgst-giveaway-column-button) {
      padding: 1px 3px;
    }

    .esgst-gv-icons .giveaway__column--contributor-level {
      padding: 2px 5px !important;
    }

    .esgst-gv-popout {
      font-size: 11px;
      max-width: ${this.esgst.ib ? `174px` : `162px`};
      position: absolute;
      width: ${this.esgst.ib ? `174px` : `162px`};
      z-index: 1;
    }

    .esgst-gv-popout .giveaway__heading {
      display: flex;
      flex-wrap: wrap;
      height: auto;
    }

    .esgst-gv-popout .giveaway__heading__name {
      display: inline-block;
      font-size: 12px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }

    .esgst-gv-popout .giveaway__heading__thin {
      font-size: 11px;
    }

    .esgst-gv-popout .esgst-gc-panel {
      font-size: 11px;
      text-align: center;
    }

    .esgst-gv-popout .esgst-gc-panel i, .esgst-gv-popout .giveaway__links i, .esgst-gv-popout .esgst-gwc i, .esgst-gv-popout .esgst-gwr i, .esgst-gv-popout .esgst-gptw i, .esgst-gv-popout .esgst-ggl-panel, .esgst-gv-popout .esgst-ggl-panel i {
      font-size: 11px;
    }

    .esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel):not(.esgst-gv-icons) {
      display: block;
      float: left;
      width: calc(100% - 37px);
    }

    .esgst-gv-popout .giveaway__columns:not(.esgst-giveaway-panel):not(.esgst-gv-icons) >* {
      margin: 0;
      text-align: left;
    }

    .esgst-gv-popout .esgst-giveaway-panel {
      display: block;
      font-size: 11px;
    }

    .esgst-gv-popout .esgst-giveaway-panel >* {
      margin: 0;
    }

    .esgst-gv-popout .esgst-button-set {
      width: 100%;
    }

    .esgst-gv-popout .esgst-button-set >* {
      padding: 0;
      width: 100%;
    }
    .esgst-gv-popout .giveaway__links a:last-child {
      margin: 0 !important;
    }

    .esgst-gv-popout .giveaway_image_avatar, .esgst-gv-popout .featured_giveaway_image_avatar {
      margin: 5px;
      position: absolute;
      right: 5px;
    }

    .esgst-gv-popout .esgst-giveaway-links, .esgst-gv-popout .esgst-giveaway-panel {
      float: none;
    }

    .esgst-ags-panel {
      margin: 0 0 15px 0;
      max-width: 316px;
      text-align: center;
    }

    .esgst-ags-panel >* {
      display: inline-block;
    }

    .esgst-ags-filter {
      display: block;
      margin: 5px;
    }

    .esgst-ags-filter >* {
      padding: 0 5px !important;
      width: 125px;
    }

    .esgst-ags-checkbox-filter {
      margin: 5px;
    }

    .esgst-ugs-difference, .esgst-switch-input {
      display: inline-block;
      padding: 0 !important;
      width: 50px;
    }

    .esgst-switch-input-large {
      width: 150px;
    }

    .esgst-gas-popout {
      background-color: #fff;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      color: #465670;
      padding: 10px;
    }

    .esgst-ds-popout {
      background-color: #fff;
      border: 1px solid #d2d6e0;
      border-radius: 4px;
      color: #465670;
      padding: 10px;
    }

    .esgst-cfh-sr-container {
      max-height: 234px;
      overflow-y: auto;
    }

    .esgst-cfh-sr-box {
      position: relative;
    }

    .esgst-cfh-sr-summary {
      border-radius: 5px;
      cursor: pointer;
      padding: 5px;
      width: 200px;
    }

    .esgst-cfh-sr-box:not(:first-child) {
      border-top: 1px solid #ccc;
    }

    .esgst-cfh-sr-box:last-child) {
      border-bottom: 1px solid #ccc;
    }

    .esgst-cfh-sr-summary:hover {
      background-color: #465670;
      color: #fff;
    }

    .esgst-cfh-sr-name {
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 200px;
      white-space: nowrap;
    }

    .esgst-cfh-sr-description {
      opacity: 0.75;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 200px;
      white-space: nowrap;
    }

    .esgst-cfh-sr-controls {
      position: absolute;
      right: 5px;
      top: 10px;
    }

    .esgst-cfh-sr-controls >* {
      margin: 2px;
    }

    .giveaway__row-outer-wrap .esgst-tag-button, .table__row-outer-wrap .esgst-tag-button {
      margin-left: 5px;
    }

    .esgst-tag-list-button {
      padding: 8px;
      right: 25px;
      position: absolute;
    }

    .esgst-tag-list {
      font-weight: bold;
      text-align: left;
      text-shadow: none;
    }

    .esgst-tag-preview .esgst-tags {
      display: inline-block;
    }

    .esgst-tag-preview input[type=text] {
      display: inline-block;
      width: 100px;
      height: 15px;
    }

    .esgst-tag-preview input[type=color] {
      box-sizing: unset;
      height: 13px;
      line-height: normal;
      margin: 0;
      padding: 0;
      vertical-align: top;
      width: 15px;
    }

    .esgst-tag-button {
      border: 0! important;
      cursor: pointer;
      display: inline-block;
      line-height: normal;
      margin: 0 0 0 5px;
      text-decoration: none !important;
      transition: opacity 0.2s;
    }

    .esgst-tag-button:hover {
      opacity: 1;
    }

    .author_name + .esgst-tag-button {
      margin: 0 5px 0 0;
    }

    .esgst-tag-button i {
      margin: 0 !important;
    }

    .esgst-tags {
      font-size: 10px;
      font-weight: bold;
    }

    .esgst-tag {
      display: inline-block !important;
      height: auto;
      margin: 0;
      padding: 1px 2px;
      text-shadow: none;
      width: auto;
    }

    .esgst-tag:not(:first-child) {
      margin: 0 0 0 5px;
    }

    .esgst-gv-popout .esgst-tags, .esgst-adots .esgst-tags {
      display: none;
    }
  `;
    if (this.esgst.sg) {
      style += `
      .esgst-header-menu {
        box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.07) inset, 1px 1px 0 rgba(255, 255, 255, 0.02) inset;
        background-image: linear-gradient(#8a92a1 0px, #757e8f 8px, #4e5666 100%);
        border-radius: 4px;
        display: flex;
        margin-right: 5px;
      }

      .esgst-header-menu-relative-dropdown {
        position: relative;
      }

      .esgst-header-menu-absolute-dropdown {
        top: 34px;
        position: absolute;
        width: 275px;
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.02), 2px 2px 5px rgba(0, 0, 0, 0.05), 1px 1px 2px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 1;
      }

      .esgst-header-menu-row {
        cursor: pointer;
        background-image: linear-gradient(#fff 0%, #f6f7f9 100%);
        display: flex;
        padding: 12px 15px;
        text-shadow: 1px 1px #fff;
        align-items: center;
      }

      .esgst-version-row {
        cursor: default;
      }

      .esgst-header-menu-row:not(:first-child) {
        border-top: 1px dotted #d2d6e0;
      }

      .esgst-header-menu-row:not(.esgst-version-row):hover, .esgst.header-menu-button:hover + .esgst-header-menu-button {
        border-top-color: transparent;
      }

      .esgst-header-menu-row i {
        font-size: 28px;
        margin-right: 15px;
      }

      .esgst-header-menu-row:not(.esgst-version-row):hover i:not(.esgst-chfl-edit-button):not(.esgst-chfl-remove-button) {
        color: #fff !important;
      }

      .esgst-header-menu-row:not(.esgst-version-row):hover {
        background-image: linear-gradient(#63a0f4 0%, #63a0f4 100%);
        text-shadow: none;
      }

      .esgst-header-menu-row i.blue {
        color: #9dd9e1;
      }

      .esgst-header-menu-row i.green {
        color: #96c468;
      }

      .esgst-header-menu-row i.red {
        color: #ec8583;
      }

      .esgst-header-menu-row i.grey{
        color: #77899A;
      }

      .esgst-header-menu-row i.yellow{
        color: #FECC66;
      }

      .esgst-header-menu-name {
        color: #4B72D4;
        font: bold 11px/15px Arial, sans-serif;
      }

      .esgst-header-menu-description {
        color: #6b7a8c;
        font: 11px/13px Arial, sans-serif
      }

      .esgst-header-menu-row:not(.esgst-version-row):hover .esgst-header-menu-name {
        color: #fff;
      }

      .esgst-header-menu-row:not(.esgst-version-row):hover .esgst-header-menu-description {
        color: rgba(255, 255, 255, 0.7);
      }

      .esgst-header-menu-button {
        white-space: nowrap;
        color: #21262f;
        font: bold 11px/29px Arial, sans-serif;
        padding: 0 15px;
        cursor: pointer;
        text-shadow: 1px 1px rgba(255, 255, 255, 0.08);
        border-radius: 4px 0 0 4px;
      }

      .esgst-header-menu-button.arrow {
        border-radius: 0 4px 4px 0;
        padding: 0 10px;
      }

      .esgst-header-menu-button:hover {
        background-image: linear-gradient(#9ba2b0 0px, #8c94a3 8px, #596070 100%);
      }

      .esgst-header-menu-button.selected {
        background-image: linear-gradient(#4e525f 0px, #434857 5px, #2b2e3a 100%);
        box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3) inset;
        color: #aec5f3;
        text-shadow: 1px 1px rgba(0, 0, 0, 0.2);
      }

      .esgst-header-menu.selected .esgst-header-menu-button {
        background-image: linear-gradient(#d0d5de 0px, #c9cdd7 5px, #9097a6 100%);
        color: #3c465c;
        text-shadow: 1px 1px rgba(255, 255, 255, 0.2);
      }

      .esgst-header-menu.selected .esgst-header-menu-button:hover:not(.selected) {
        background-image: linear-gradient(#f0f1f5 0px, #d1d4de 100%);
      }
    `;
    } else {
      style += `
      .esgst-header-menu {
        display: flex;
        margin: 0 5px 0 0;
        box-shadow: 0 0 15px rgba(6, 52, 84, 0.07), 2px 2px 5px rgba(6, 52, 84, 0.07), 1px 1px 2px rgba(6, 52, 84, 0.07);
      }

      .esgst-header-menu-relative-dropdown > div {
        overflow: hidden;
        border-radius: 3px;
        background-color: #fff;
        position: absolute;
        margin-top: 39px;
        box-shadow: 0 0 15px rgba(59, 74, 84, 0.07), 2px 2px 5px rgba(59, 74, 84, 0.07), 1px 1px 2px rgba(59, 74, 84, 0.07);
        z-index: 10;
        width: 190px;
      }

      .esgst-header-menu-row {
        padding: 15px 20px;
        color: #557a93;
        display: flex;
        align-items: center;
        font: 700 12px 'Open Sans', sans-serif;
        transition: background-color 0.15s;
        cursor: pointer;
      }

      .esgst-version-row {
        cursor: default;
      }

      .esgst-header-menu-row:not(:last-child) {
        border-bottom: 1px solid #e1ebf2;
      }

      .esgst-header-menu-row.disabled {
        cursor: default
      }

      .esgst-header-menu-row > * {
        transition: opacity 0.15s;
      }

      .esgst-header-menu-row i {
        margin-right: 20px;
        font-size: 24px;
        transition: color 0.15s;
      }

      .esgst-header-menu-row:hover {
        background-color: #f0f3f5;
      }

      .esgst-header-menu-relative-dropdown:hover .esgst-header-menu-row:not(:hover) > * {
        opacity: 0.5;
      }

      .esgst-header-menu-relative-dropdown:hover .esgst-header-menu-row:not(:hover) i {
        color: #bdcbd5;
      }

      .esgst-header-menu-row i.blue {
        color: #9dd9e1;
      }

      .esgst-header-menu-row i.green {
        color: #96c468;
      }

      .esgst-header-menu-row i.red {
        color: #ec8583;
      }

      .esgst-header-menu-row i.grey{
        color: #77899a;
      }

      .esgst-header-menu-row i.yellow{
        color: #FECC66;
      }

      .esgst-header-menu-row:not(.esgst-version-row) .esgst-header-menu-description {
        display: none;
      }

      .esgst-header-menu-button {
        cursor: pointer;
        border-radius: 3px;
        display: flex;
        align-items: center;
        border: 1px solid;
        font: 700 11px 'Open Sans', sans-serif;
        padding: 8px 10px;
        white-space: nowrap;
        background-image: linear-gradient(#fff 0%, #dfe5f0 50%, #a5b2cc 100%);
        border-color: #fff #adb6c7 #909bb0 #cdd3df;
        color: #354a73;
        text-shadow: 1px 1px rgba(255, 255, 255, 0.3);
        transition: opacity 0.1s;
        opacity: 0.8;
        border-radius: 3px 0 0 3px;
        border-right: 0;
      }

      .esgst-header-menu-button:hover:not(.selected) {
        opacity: 1;
      }

      .esgst-header-menu-button.selected {
        opacity: 0.6;
      }

      .esgst-header-menu-button.arrow {
        border-radius: 0 3px 3px 0;
        border-left: 0;
      }

      .esgst-header-menu-button:not(.arrow) > i {
        margin-right: 10px;
      }

      .esgst-un-button, .page_heading .esgst-heading-button {
        background-image: linear-gradient(#fff 0%, rgba(255, 255, 255, 0.4) 100%);
        border: 1px solid #d2d6e0;
        border-radius: 3px;
        color: #4b72d4;
        cursor: pointer;
        display: inline-block;
        font: 700 14px/22px "Open Sans", sans-serif;
        padding: 5px 15px;
      }
    `;
    }
    this.esgst.style = this.createElements(document.head, `beforeEnd`, [{
      attributes: {
        id: `esgst-style`
      },
      text: style,
      type: `style`
    }]);
    this.esgst.theme = document.getElementById(`esgst-theme`);
    this.esgst.customThemeElement = document.getElementById(`esgst-custom-theme`);
    // noinspection JSIgnoredPromiseFromCall
    this.setTheme();
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
      if (key === `customTheme`) continue;
      if (this.esgst[key] && this.checkThemeTime(key)) {
        const theme = await this.getValue(key, ``);
        if (!theme) continue;
        const css = this.getThemeCss(JSON.parse(theme));
        this.esgst.theme = this.createElements(document.head, `beforeEnd`, [{
          attributes: {
            id: `esgst-theme`
          },
          text: css,
          type: `style`
        }]);
        const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
        if (revisedCss !== this.getLocalValue(`theme`)) {
          this.setLocalValue(`theme`, revisedCss);
        }
        break;
      }
    }
    if (this.esgst.customTheme && this.checkThemeTime(`customTheme`)) {
      const css = JSON.parse(await this.getValue(`customTheme`, ``));
      this.esgst.customThemeElement = this.createElements(document.head, `beforeEnd`, [{
        attributes: {
          id: `esgst-custom-theme`
        },
        text: css,
        type: `style`
      }]);
      const revisedCss = css.replace(/!important;/g, `;`).replace(/;/g, `!important;`);
      if (revisedCss !== this.getLocalValue(`customTheme`)) {
        this.setLocalValue(`customTheme`, revisedCss);
      }
    }
  }

  checkThemeTime(id) {
    let startParts = this.esgst[`${id}_startTime`].split(`:`),
      endParts = this.esgst[`${id}_endTime`].split(`:`),
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
      setTimeout(() => this.setTheme(), endDate - currentDate);
      return true;
    }
  }

  async request(details) {
    if (!details.headers) {
      details.headers = {};
    }
    if (!details.headers[`Content-Type`]) {
      details.headers[`Content-Type`] = `application/x-www-form-urlencoded`;
    }
    if (details.queue) {
      let deleteLock = await this.createLock(`requestLock`, 1000);
      let response = await this.continueRequest(details);
      deleteLock();
      return response;
    } else if (details.url.match(/^https?:\/\/store.steampowered.com/) && !details.notLimited) {
      const deleteLock = await this.createLock(`steamStore`, 200);
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
      addScrollable: true, icon: `fa-eye-slash`, title: [{
        text: `Would you like to hide all giveaways for `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: name,
        type: `span`
      }, {
        text: `?`,
        type: `node`
      }]
    });
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check-circle`,
      icon2: `fa-refresh fa-spin`,
      title1: `Yes`,
      title2: `Please wait...`,
      callback1: async () => {
        await this.request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${id}`,
          method: `POST`,
          url: `/ajax.php`
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
    this.createElements(popup.actions.firstElementChild, `outer`, [{
      attributes: {
        href: `/account/settings/giveaways/filters`
      },
      text: `View Hidden Games`,
      type: `a`
    }]);
    popup.open();
  }

  unhideGame(button, id, name, steamId, steamType) {
    let popup;
    popup = new Popup({
      addScrollable: true, icon: `fa-eye-slash`, isTemp: true, title: [{
        text: `Would you like to unhide all giveaways for `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: name,
        type: `span`
      }, {
        text: `?`,
        type: `node`
      }]
    });
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check-circle`,
      icon2: `fa-refresh fa-spin`,
      title1: `Yes`,
      title2: `Please wait...`,
      callback1: async () => {
        await this.request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${id}`,
          method: `POST`,
          url: `/ajax.php`
        });
        await this.updateHiddenGames(steamId, steamType, true);
        button.remove();
        popup.close();
      }
    }).set);
    this.createElements(popup.actions.firstElementChild, `outer`, [{
      attributes: {
        href: `/account/settings/giveaways/filters`
      },
      text: `View Hidden Games`,
      type: `a`
    }]);
    popup.open();
  }

  async requestGroupInvite() {
    let popup = new Popup({
      addScrollable: true,
      icon: `fa-circle-o-notch fa-spin`,
      isTemp: true,
      title: `Sending request...`
    });
    popup.open();
    if (this.esgst.username) {
      await this.request({
        data: `username=${this.esgst.username}`,
        method: `POST`,
        url: `https://script.google.com/macros/s/AKfycbw0odO9iXZBJmK54M_MUQ_IEv5l4RNzj7cEx_FWCZbrtNBNmQ/exec`
      });
      popup.icon.className = `fa fa-check`;
      this.createElements(popup.title, `inner`, [{
        text: `Request sent! If you have not done so already, you also need to send a request from the `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`,
          href: `http://steamcommunity.com/groups/esgst`
        },
        text: `Steam group`,
        type: `a`
      }, {
        text: ` page. After that you should be accepted in 24 hours at most.`,
        type: `node`
      }]);
    } else {
      popup.icon.className = `fa-times-circle`;
      popup.title.textContent = `Something went wrong, please try again later. If it continues to happen, please report the issue.`;
    }
  }

  async checkUpdate() {
    let version = (await this.request({
      method: `GET`,
      url: `https://raw.githubusercontent.com/gsrafael01/ESGST/master/ESGST.meta.js`
    })).responseText.match(/@version (.+)/);
    if (version && version[1] !== this.esgst.version) {
      location.href = `https://raw.githubusercontent.com/gsrafael01/ESGST/master/ESGST.user.js`;
    } else {
      alert(`No ESGST updates found!`);
    }
  }

  draggable_set(obj) {
    obj.context.setAttribute(`data-draggable-key`, obj.id);
    for (const element of obj.context.children) {
      if (element.getAttribute(`draggable`) || !element.getAttribute(`data-draggable-id`)) {
        continue;
      }
      element.setAttribute(`draggable`, true);
      element.addEventListener(`dragstart`, this.draggable_start.bind(this, obj));
      element.addEventListener(`dragenter`, this.draggable_enter.bind(this, obj));
      element.addEventListener(`dragend`, this.draggable_end.bind(this, obj));
    }
  }

  async draggable_start(obj, event) {
    event.dataTransfer.setData(`text/plain`, ``);
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
      || element.getAttribute(`data-draggable-id`) === this.esgst.draggable.dragged.getAttribute(`data-draggable-id`)
    ) {
      return;
    }
    if (element === obj.context) {
      if (obj.context.children.length < 1) {
        obj.context.appendChild(this.esgst.draggable.dragged);
      }
      return;
    }
    if (element.getAttribute(`data-draggable-group`) !== this.esgst.draggable.dragged.getAttribute(`data-draggable-group`)) {
      alert(`Cannot move this element to this group.`);
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
      if (this.esgst.draggable.dragged.getAttribute(`data-draggable-id`).match(/elgb|gp/)) {
        this.esgst.draggable.dragged.classList.add(`esgst-giveaway-column-button`);
      }
      if (this.esgst.draggable.dragged.getAttribute(`data-color`)) {
        this.esgst.draggable.dragged.classList.add(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
        this.esgst.draggable.dragged.firstElementChild.style.color = this.esgst.draggable.dragged.getAttribute(`data-bgColor`);
        this.esgst.draggable.dragged.style.color = ``;
        this.esgst.draggable.dragged.style.backgroundColor = ``;
      }
    } else {
      if (this.esgst.draggable.dragged.getAttribute(`data-draggable-id`).match(/elgb|gp/)) {
        this.esgst.draggable.dragged.classList.remove(`esgst-giveaway-column-button`);
      }
      if (this.esgst.draggable.dragged.getAttribute(`data-color`)) {
        this.esgst.draggable.dragged.classList.remove(this.esgst.giveawayPath ? `featured__column` : `giveaway__column`);
        this.esgst.draggable.dragged.style.color = this.esgst.draggable.dragged.getAttribute(`data-color`);
        this.esgst.draggable.dragged.style.backgroundColor = this.esgst.draggable.dragged.getAttribute(`data-bgColor`);
      }
    }
    if (this.esgst.draggable.destination === obj.item.heading) {
      if (this.esgst.draggable.dragged.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
        this.esgst.draggable.dragged.classList.add(`giveaway__icon`);
      }
    } else if (this.esgst.draggable.dragged.getAttribute(`data-draggable-id`).match(/steam|search|hideGame/)) {
      this.esgst.draggable.dragged.classList.remove(`giveaway__icon`);
    }
    if (this.esgst.draggable.deleted) {
      this.esgst.draggable.dragged.remove();
    }
    for (const element of [this.esgst.draggable.source, this.esgst.draggable.destination]) {
      if (!element) {
        continue;
      }
      const key = `${element.getAttribute(`data-draggable-key`)}${obj.item.gvIcons ? `_gv` : ``}`;
      this.esgst[key] = [];
      for (const child of element.children) {
        const id = child.getAttribute(`data-draggable-id`);
        if (id) {
          this.esgst[key].push(id);
        }
      }
      if (key === `emojis`) {
        await this.setValue(key, JSON.stringify(this.esgst[key]));
      } else {
        await this.setSetting(key, this.esgst[key]);
      }
    }
    this.esgst.draggable.dragged = null;
    this.esgst.draggable.source = null;
    this.esgst.draggable.destination = null;
  }

  draggable_setTrash(obj) {
    /**
     * @property {HTMLElement} obj.trashContext
     */
    this.esgst.draggable.trash = this.createElements(obj.trashContext || obj.context, `afterEnd`, [{
      attributes: {
        class: `esgst-draggable-trash`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-trash`
        },
        type: `i`
      }]
    }]);
    this.esgst.draggable.trash.style.width = `${(obj.trashContext || obj.context).offsetWidth}px`;
    this.esgst.draggable.trash.addEventListener(`dragenter`, this.draggable_delete.bind(this, obj));
  }

  async draggable_delete(obj) {
    this.esgst.draggable.awaitingConfirmation = true;
    this.esgst.draggable.deleted = false;
    if (
      !this.esgst.draggable.dragged
      || !confirm(`Are you sure you want to delete this item?`)
    ) {
      this.esgst.draggable.awaitingConfirmation = false;
      return;
    }
    this.esgst.draggable.awaitingConfirmation = false;
    this.esgst.draggable.deleted = true;
    await this.draggable_end(obj);
  }

  setCountdown(context, totalSeconds, callback, initialDate = Date.now()) {
    const seconds = totalSeconds - Math.floor((Date.now() - initialDate) / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    context.textContent = `${`0${m}`.slice(-2)}:${`0${s}`.slice(-2)}`;
    if (seconds > -1) {
      setTimeout(this.setCountdown.bind(this), 1000, context, totalSeconds, callback, initialDate);
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

  observeStickyChanges() {
    this.observeHeaders();
  }

  /**
   * Sets up an intersection observer to notify when elements with the class
   * `.sticky_sentinel--top` become visible/invisible at the top of the container.
   */
  observeHeaders() {
    const observer = new IntersectionObserver(records => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector(`.sticky`);
        const rootBoundsInfo = record.rootBounds;

        // Started sticking.
        if (targetInfo.bottom < rootBoundsInfo.top) {
          stickyTarget.classList.add(`stuck`);
        }

        // Stopped sticking.
        if (
          targetInfo.bottom >= rootBoundsInfo.top &&
          targetInfo.bottom < rootBoundsInfo.bottom
        ) {
          stickyTarget.classList.remove(`stuck`);
        }
      }
    }, {threshold: 0});

    // Add the top sentinels to each section and attach an observer.
    const sentinels = this.addSentinels(`sticky_sentinel--top`);
    sentinels.forEach(el => observer.observe(el));
  }

  addSentinels(className) {
    return Array.from(document.querySelectorAll(`.sticky`)).map(el => {
      const sentinel = document.createElement(`div`);
      sentinel.classList.add(`sticky_sentinel`, className);
      return el.parentElement.appendChild(sentinel);
    });
  }

  setClearButton(input) {
    const button = input.nextElementSibling;
    input.addEventListener(`input`, this.toggleClearButton.bind(this, button, input));
    input.addEventListener(`change`, this.toggleClearButton.bind(this, button, input));
    input.nextElementSibling.addEventListener(`click`, this.clearInput.bind(this, input));
  }

  toggleClearButton(button, input) {
    if (input.value) {
      if (button.classList.contains(`esgst-hidden`)) {
        button.classList.remove(`esgst-hidden`);
      }
    } else if (!button.classList.contains(`esgst-hidden`)) {
      button.classList.add(`esgst-hidden`);
    }
  }

  clearInput(input) {
    input.value = ``;
    input.dispatchEvent(new Event(`change`));
  }

  fixEmojis(emojis) {
    const matches = emojis.split(/<\/span>/);
    if (matches.length < 2) return emojis;
    matches.pop();
    return JSON.stringify(matches.map(this.fixEmoji));
  }

  fixEmoji(emoji) {
    const match = emoji.match(/title="(.+?)"/);
    emoji = emoji.replace(/<span.+?>/, ``);
    if (match) {
      return this.getEmojiHtml(emoji);
    }
    let fixed = ``;
    for (let i = 0, n = emoji.length; i < n; i++) {
      fixed += this.getEmojiHtml(emoji[i]);
    }
    return fixed;
  }

  getEmojiHtml(emoji) {
    return `&#x${this.getEmojiUnicode(emoji).toString(`16`).toUpperCase()}`;
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
    if (event.key === `Enter`) {
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
      output.push(`\n`);
    });
    return output.join(``).trim().replace(/\n\n+/g, `\n\n`);
  }

  capitalizeFirstLetter(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
  }

  getTimestamp(seconds, is24Clock, isShowSeconds) {
    if (is24Clock) {
      if (isShowSeconds) {
        return formatDate(`[MMM] [D], [YYYY], [H]:[HMM]:[SS]`, seconds);
      }
      return formatDate(`[MMM] [D], [YYYY], [H]:[HMM]`, seconds);
    }
    if (isShowSeconds) {
      return formatDate(`[MMM] [D], [YYYY], [H12]:[HMM]:[SS][XX]`, seconds);
    }
    return formatDate(`[MMM] [D], [YYYY], [H12]:[HMM][XX]`, seconds);
  }

  getRemainingTime(time) {
    let d, dif, h, m, s, w;
    dif = time - Date.now();
    if (dif < 0) {
      dif *= -1;
    }
    w = Math.floor(dif / 604800000);
    if (w > 0) {
      return `${w}w`;
    } else {
      d = Math.floor(dif / 86400000);
      if (d > 0) {
        return `${d}d`;
      } else {
        h = Math.floor(dif / 3600000);
        if (h > 0) {
          return `${h}h`;
        } else {
          m = Math.floor(dif / 60000);
          if (m > 0) {
            return `${m}m`;
          } else {
            s = Math.floor(dif / 1000);
            return `${s}s`;
          }
        }
      }
    }
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
      return `${n} year${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 2592000);
    if (n >= 1) {
      return `${n} month${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 86400);
    if (n >= 1) {
      return `${n} day${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 3600);
    if (n >= 1) {
      return `${n} hour${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s / 60);
    if (n >= 1) {
      return `${n} minute${n === 1 ? `` : `s`}`;
    }
    n = Math.floor(s);
    return `${n} second${n === 1 ? `` : `s`}`;
  }

  setLocalValue(key, value) {
    localStorage.setItem(`esgst_${key}`, value);
  }

  getLocalValue(key, value = undefined) {
    return localStorage.getItem(`esgst_${key}`) || value;
  }

  delLocalValue(key) {
    localStorage.removeItem(`esgst_${key}`);
  }

  validateValue(value) {
    return typeof value === `undefined` || value;
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
    element.addEventListener(`mouseenter`, () => {
      element.style.opacity = EnterOpacity;
    });
    element.addEventListener(`mouseleave`, () => {
      element.style.opacity = LeaveOpacity;
    });
  }

  createUuid(c) {
    let r, v;
    r = Math.random() * 16 | 0;
    v = c === `x` ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  createTooltip(context, message) {
    let popout;
    popout = new Popout(`esgst-feature-description markdown`, context, 100);
    popout.popout.style.maxHeight = `300px`;
    popout.popout.style.overflow = `auto`;
    this.createElements(popout.popout, `inner`, [...(Array.from(parseHtml(message).body.childNodes).map(x => {
      return {
        context: x
      };
    }))]);
  }

  createOptions(options) {
    let context, elements, id, switches;
    context = document.createElement(`div`);
    elements = {};
    switches = {};
    options.forEach(option => {
      if (option.check) {
        id = option.id;
        elements[id] = this.createElements(context, `beforeEnd`, [{
          type: `div`
        }]);
        switches[id] = new ToggleSwitch(elements[id], id, false, option.description, false, false, option.tooltip, this.esgst[id]);
      }
    });
    options.forEach(option => {
      let enabled = this.esgst[option.id];
      if (switches[option.id]) {
        if (option.dependencies) {
          option.dependencies.forEach(dependency => {
            if (elements[dependency]) {
              switches[option.id].dependencies.push(elements[dependency]);
              if (!enabled) {
                elements[dependency].classList.add(`esgst-hidden`);
              }
            }
          });
        }
        if (option.exclusions) {
          option.exclusions.forEach(exclusion => {
            if (elements[exclusion]) {
              switches[option.id].exclusions.push(elements[exclusion]);
              if (enabled) {
                elements[exclusion].classList.add(`esgst-hidden`);
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
      element[key] = this.createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden`
        },
        type: `div`,
        children: [{
          attributes: {
            class: result.Icon
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          type: `span`,
          children: [{
            text: `${result.Description} (`,
            type: `node`
          }, {
            text: `0`,
            type: `span`
          }, {
            text: `):`,
            type: `node`
          }]
        }, {
          attributes: {
            class: `esgst-popup-actions`
          },
          type: `span`
        }]
      }]);
      element[`${key}Count`] = element[key].firstElementChild.nextElementSibling.firstElementChild;
      element[`${key}Users`] = element[key].lastElementChild;
    }
  }

  goToComment(hash, element, noPermalink) {
    if (!hash) {
      hash = location.hash;
    }
    let id = hash.replace(/#/, ``);
    if ((!id && !element) || location.pathname.match(/^\/account/)) return;
    if (id && !element) {
      element = document.getElementById(id);
    }
    if (!element) return;
    scrollTo(0, element.offsetTop);
    scrollBy(0, -this.esgst.commentsTop);
    if (noPermalink) return;
    let permalink = document.querySelector(`.is_permalink, .author_permalink`);
    if (permalink) {
      permalink.remove();
    }
    element = element.querySelector(`.comment__username, .author_avatar`);
    if (!element) return;
    this.createElements(element, this.esgst.sg ? `beforeBegin` : `afterEnd`, [{
      attributes: {
        class: `fa fa-share is_permalink author_permalink`
      },
      type: `i`
    }]);
  }

  sortContent(array, mainKey, option) {
    let after, before, divisor, divisors, i, key, n, name;
    name = option.split(/_/);
    key = name[0];
    if (name[1] === `asc`) {
      before = -1;
      after = 1;
    } else {
      before = 1;
      after = -1;
    }
    array.sort((a, b) => {
      if (typeof a[key] === `string` && typeof b[key] === `string`) {
        return (a[key].toLowerCase().localeCompare(b[key].toLowerCase()) * after);
      } else {
        if (a[key] < b[key]) {
          return before;
        } else if (a[key] > b[key]) {
          return after;
        } else {
          return 0;
        }
      }
    });
    let context = null;
    if (mainKey === `popupGiveaways`) {
      context = array[0].outerWrap.closest(`.esgst-popup`).getElementsByClassName(`esgst-gv-view`)[0] || array[0].outerWrap.parentElement.parentElement;
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
    if (key === `sortIndex`) {
      divisors = document.getElementsByClassName(`esgst-es-page-divisor`);
      for (i = divisors.length - 1; i > -1; --i) {
        divisor = divisors[i];
        divisor.classList.remove(`esgst-hidden`);
        divisor.parentElement.insertBefore(divisor, document.getElementsByClassName(`esgst-es-page-${i + 2}`)[0]);
      }
    } else {
      divisors = document.querySelectorAll(`.esgst-es-page-divisor:not(.esgst-hidden)`);
      for (i = divisors.length - 1; i > -1; --i) {
        divisors[i].classList.add(`esgst-hidden`);
      }
    }
  }

  rot(string, n) {
    return string.replace(/[a-zA-Z]/g, char => {
      return String.fromCharCode(((char <= `Z`) ? 90 : 122) >= ((char = char.charCodeAt(0) + n)) ? char : (char - 26));
    });
  }

  async buildGiveaway(context, url, errorMessage, blacklist) {
    let ended, avatar, code, column, columns, comments, counts, endTime, endTimeColumn, entered, entries, giveaway,
      heading, headingName, i, id, icons, image, n, removeEntryButton, started, startTimeColumn, thinHeadings;
    giveaway = context.getElementsByClassName(`featured__outer-wrap--giveaway`)[0];
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
      id = giveaway.getAttribute(`data-game-id`);
      heading = giveaway.getElementsByClassName(`featured__heading`)[0];
      icons = heading.getElementsByTagName(`a`);
      for (i = 0, n = icons.length; i < n; ++i) {
        icons[i].classList.add(`giveaway__icon`);
      }
      headingName = heading.firstElementChild;
      this.createElements(headingName, `outer`, [{
        attributes: {
          class: `giveaway__heading__name`,
          href: url
        },
        type: `a`,
        children: [...(Array.from(headingName.childNodes).map(x => {
          return {
            context: x
          };
        }))]
      }]);
      thinHeadings = heading.getElementsByClassName(`featured__heading__small`);
      for (i = 0, n = thinHeadings.length; i < n; ++i) {
        this.createElements(thinHeadings[0], `outer`, [{
          attributes: {
            class: `giveaway__heading__thin`
          },
          type: `span`,
          children: [...(Array.from(thinHeadings[0].childNodes).map(x => {
            return {
              context: x
            };
          }))]
        }]);
      }
      columns = heading.nextElementSibling;
      endTimeColumn = columns.firstElementChild;
      endTimeColumn.classList.remove(`featured__column`);
      if (sgTools) {
        let info = await this.esgst.modules.games.games_getInfo(giveaway);
        if (info) {
          this.createElements(heading, `beforeEnd`, [{
            attributes: {
              class: `giveaway__icon`,
              href: `https://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}/`,
              rel: `nofollow`,
              target: `_blank`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-steam`
              },
              type: `i`
            }]
          }, {
            attributes: {
              class: `giveaway__icon`,
              href: `/giveaways/search?${info.type.slice(0, -1)}=${info.id}`
            },
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-search`
              },
              type: `i`
            }]
          }]);
        }
        let date = new Date(`${endTimeColumn.lastElementChild.textContent}Z`).getTime();
        ended = Date.now() > date;
        const items = [];
        if (ended) {
          items.push({
            text: `Ended`,
            type: `node`
          });
        }
        items.push({
          attributes: {
            [`data-timestamp`]: date / 1e3
          },
          text: ended ? this.getTimeSince(date) : this.getTimeSince(date, true),
          type: `span`
        }, {
          text: ended ? ` ago ` : ` remaining `,
          type: `node`
        });
        this.createElements(endTimeColumn.lastElementChild, `outer`, items);
      }
      endTime = parseInt(endTimeColumn.lastElementChild.getAttribute(`data-timestamp`)) * 1000;
      startTimeColumn = endTimeColumn.nextElementSibling;
      startTimeColumn.classList.remove(`featured__column`, `featured__column--width-fill`);
      startTimeColumn.classList.add(`giveaway__column--width-fill`);
      if (sgTools) {
        let date = new Date(`${startTimeColumn.firstElementChild.textContent}Z`).getTime();
        const items = [];
        if (ended) {
          items.push({
            text: `Ended `,
            type: `node`
          });
        }
        items.push({
          attributes: {
            [`data-timestamp`]: date / 1e3
          },
          text: this.getTimeSince(date),
          type: `span`
        }, {
          text: ` ago `,
          type: `node`
        });
        this.createElements(startTimeColumn.firstElementChild, `outer`, items);
      }
      avatar = columns.lastElementChild;
      if (sgTools) {
        avatar.className = `giveaway_image_avatar`;
      }
      avatar.remove();
      startTimeColumn.querySelector(`[style]`).removeAttribute(`style`);
      column = startTimeColumn.nextElementSibling;
      while (column) {
        column.classList.remove(`featured__column`);
        column.className = column.className.replace(/featured/g, `giveaway`);
        column = column.nextElementSibling;
      }
      removeEntryButton = context.getElementsByClassName(`sidebar__entry-delete`)[0];
      if (removeEntryButton && !removeEntryButton.classList.contains(`is-hidden`)) {
        entered = `is-faded`;
      } else {
        entered = ``;
      }
      counts = context.getElementsByClassName(`sidebar__navigation__item__count`);
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
      image = giveaway.getElementsByClassName(`global__image-outer-wrap--game-large`)[0].firstElementChild.getAttribute(`src`);
      const attributes = {
        class: `giveaway__row-outer-wrap`,
        [`data-game-id`]: id
      };
      if (errorMessage) {
        attributes[`data-error`] = errorMessage;
      }
      if (blacklist) {
        attributes[`data-blacklist`] = true;
      }
      if (context.getElementsByClassName(`sidebar__entry-insert`)[0]) {
        attributes[`data-enterable`] = true;
      }
      heading.className = `giveaway__heading`;
      columns.className = `giveaway__columns`;
      return {
        code,
        html: [{
          type: `div`,
          children: [{
            attributes,
            type: `div`,
            children: [{
              attributes: {
                class: `giveaway__row-inner-wrap ${entered}`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `giveaway__summary`
                },
                children: [{
                  context: heading
                }, {
                  context: columns
                }, {
                  attributes: {
                    class: `giveaway__links`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      href: `${url}/entries`
                    },
                    type: `a`,
                    children: [{
                      attributes: {
                        class: `fa fa-tag`
                      },
                      type: `i`
                    }, {
                      text: `${entries} entries`,
                      type: `span`
                    }]
                  }, {
                    attributes: {
                      href: `${url}/comment`
                    },
                    type: `a`,
                    children: [{
                      attributes: {
                        class: `fa fa-comment`
                      },
                      type: `i`
                    }, {
                      text: `${comments} comments`,
                      type: `span`
                    }]
                  }]
                }]
              }, {
                context: avatar,
              }, {
                attributes: {
                  class: `giveaway_image_thumbnail`,
                  href: url,
                  style: `background-image: url(${image})`
                },
                type: `a`
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

  copyValue(icon, value) {
    let textArea = this.createElements(document.body, `beforeEnd`, [{
      type: `textarea`
    }]);
    textArea.value = value;
    textArea.select();
    document.execCommand(`copy`);
    textArea.remove();
    if (icon) {
      icon.classList.add(`esgst-green`);
      setTimeout(() => icon.classList.remove(`esgst-green`), 2000);
    }
  }

  getParameters() {
    let parameters = {};
    location.search.replace(/^\?/, ``).split(/&/).forEach(item => {
      const items = item.split(/=/);
      parameters[items[0]] = items[1];
    });
    return parameters;
  }

  setMissingDiscussion(context) {
    if (context) {
      this.createElements(context.outerWrap, `inner`, [{
        attributes: {
          class: `table__row-outer-wrap`,
          style: `padding: 15px 0;`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            type: `div`,
            children: [{
              attributes: {
                class: `table_image_avatar`,
                href: `/user/${context.author}`,
                style: `background-image:${context.avatar.style.backgroundImage.replace(/"/g, `'`)};`
              },
              type: `a`
            }]
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              attributes: {
                style: `margin-bottom: 2px;`
              },
              type: `h3`,
              children: [{
                attributes: {
                  class: `homepage_table_column_heading`,
                  href: context.url
                },
                text: context.title,
                type: `a`
              }]
            }, {
              type: `p`,
              children: context.lastPostTime ? [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: `a`
              }, {
                text: ` - Last post `,
                type: `node`
              }, {
                attributes: {
                  [`data-timestamp`]: context.lastPostTimestamp
                },
                text: context.lastPostTime,
                type: `span`
              }, {
                text: ` ago by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: `/user/${context.lastPostAuthor}`
                },
                text: context.lastPostAuthor,
                type: `a`
              }, {
                attributes: {
                  class: `icon-green table__last-comment-icon`,
                  href: `/go/comment/${context.lastPostCode}`
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-chevron-circle-right`
                  },
                  type: `i`
                }]
              }] : [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: context.url
                },
                text: `${context.comments} Comments`,
                type: `a`
              }, {
                text: ` - Created `,
                type: `node`
              }, {
                attributes: {
                  [`data-timestamp`]: context.createdTimestamp
                },
                text: context.createdTime,
                type: `span`
              }, {
                text: ` ago by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: `/user/${context.author}`
                },
                text: context.author,
                type: `a`
              }]
            }]
          }]
        }]
      }]);
      context.outerWrap = context.outerWrap.firstElementChild;
    }
  }

  filterSm(event) {
    let collapse, element, expand, found, id, type, typeFound, value;
    value = event.currentTarget.value.toLowerCase().trim();
    for (type in this.esgst.features) {
      if (this.esgst.features.hasOwnProperty(type)) {
        found = false;
        typeFound = false;
        for (id in this.esgst.features[type].features) {
          if (this.esgst.features[type].features.hasOwnProperty(id)) {
            this.unfadeSmFeatures(this.esgst.features[type].features[id], id);
            found = this.filterSmFeature(this.esgst.features[type].features[id], id, value);
            if (found) {
              typeFound = true;
              this.unhideSmFeature(this.esgst.features[type].features[id], id);
            }
          }
        }
        element = document.getElementById(`esgst_${type}`);
        if (element) {
          if (typeFound) {
            element.classList.remove(`esgst-hidden`);
          } else {
            element.classList.add(`esgst-hidden`);
          }
          if (value) {
            expand = element.getElementsByClassName(`fa-plus-square`)[0];
            if (expand) {
              expand.click();
            }
          } else {
            collapse = element.getElementsByClassName(`fa-minus-square`)[0];
            if (collapse) {
              collapse.click();
            }
          }
        }
      }
    }
  }

  unfadeSmFeatures(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-sm-faded`);
    }
    if (feature.features) {
      for (id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          this.unfadeSmFeatures(feature.features[id], id);
        }
      }
    }
  }

  filterSmFeature(feature, id, value) {
    let element, found, subId;
    found = false;
    let exactFound = (typeof feature.name === `string` ? feature.name : JSON.stringify(feature.name)).toLowerCase().match(value);
    if (feature.features) {
      for (subId in feature.features) {
        if (feature.features.hasOwnProperty(subId)) {
          let result = this.filterSmFeature(feature.features[subId], subId, value);
          found = found || result;
        }
      }
      found = found || (feature.description && feature.description.toLowerCase().match(value)) || exactFound;
    } else {
      found = (feature.description && feature.description.toLowerCase().match(value)) || exactFound;
    }
    element = document.getElementById(`esgst_${id}`);
    if (element) {
      if (found) {
        element.classList.remove(`esgst-hidden`);
      } else {
        element.classList.add(`esgst-hidden`);
      }
      if (!exactFound) {
        element.classList.add(`esgst-sm-faded`);
      }
    }
    return found;
  }

  unhideSmFeature(feature, id) {
    let element = document.getElementById(`esgst_${id}`);
    if (element) {
      element.classList.remove(`esgst-hidden`);
    }
    if (feature.features) {
      for (id in feature.features) {
        if (feature.features.hasOwnProperty(id)) {
          this.unhideSmFeature(feature.features[id], id);
        }
      }
    }
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  }

  getThemeUrl(id, url) {
    return new Promise(this.openThemePopup.bind(this, id, url));
  }

  openThemePopup(id, url, resolve) {
    let obj = {
      resolve,
      url
    };
    obj.options = {
      sgv2Dark: [
        {
          default: 0,
          id: `ik-page width`,
          name: `Page width`,
          options: [
            {
              id: `ik-def page width`,
              name: `100%`
            },
            {
              id: `ik-fixed sg page width`,
              name: `Fixed (1440px)`
            }
          ]
        }
      ],
      steamGifties: [
        {
          default: 1,
          id: `ik-spoilertags`,
          name: `Remove spoiler tags`
        },
        {
          default: 1,
          id: `ik-hiddenlinks`,
          name: `Reveal hidden links`
        },
        {
          default: 0,
          id: `ik-sgppsupport`,
          name: `SG++ support`
        },
        {
          default: 0,
          id: `ik-whiteblacklist`,
          name: `Blacklist/Whitelist Indicator support`
        },
        {
          default: 0,
          id: `ik-easysteamgifts`,
          name: `Easy SteamGifts support`
        },
        {
          default: 0,
          id: `ik-visited-link`,
          name: `Highlight visited links`,
          options: [
            {
              id: `ik-1`,
              name: `Mark visited links`
            },
            {
              id: `ik-3`,
              name: `Mark visited links + threads in forum`
            },
            {
              id: `ik-2`,
              name: `No`
            }
          ]
        },
        {
          default: 0,
          id: `ik-touhou-style`,
          name: `TouHou Giveaways Helper support`
        },
        {
          default: 0,
          id: `ik-sg2os`,
          name: `SG2O support`
        },
        {
          default: 0,
          id: `ik-avatarsize`,
          name: `Avatar size`,
          options: [
            {
              id: `ik-1`,
              name: `Big (52px)`
            },
            {
              id: `ik-2`,
              name: `Normal`
            }
          ]
        },
        {
          default: 0,
          id: `ik-extendedsg`,
          name: `Extended SteamGifts support`
        },
        {
          default: 0,
          id: `ik-navbarbutton`,
          name: `Navigation bar button color`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `White`
            }
          ]
        },
        {
          default: 0,
          id: `ik-ESGST`,
          name: `ESGST support`
        },
        {
          default: 1,
          id: `ik-featurega`,
          name: `Featured giveaway`,
          options: [
            {
              id: `ik-1`,
              name: `No`
            },
            {
              id: `ik-2`,
              name: `Smaller banner`
            },
            {
              id: `ik-2`,
              name: `Hide banner`
            }
          ]
        },
        {
          default: 0,
          id: `ik-removepoll`,
          name: `Homepage poll`,
          options: [
            {
              id: `ik-1`,
              name: `Default`
            },
            {
              id: `ik-2`,
              name: `Remove poll`
            }
          ]
        }
      ],
      steamTradies: [
        {
          default: 0,
          id: `ik-color-sc`,
          name: `Color`,
          options: [
            {
              id: `ik-1`,
              name: `Dark blue`
            },
            {
              id: `ik-2`,
              name: `Black`
            }
          ]
        }
      ]
    };
    let binaryOptions = [
      {
        id: `ik-1`,
        name: `Yes`
      },
      {
        id: `ik-2`,
        name: `No`
      }
    ];
    let key = id.replace(/Black|Blue/g, ``);
    if (!obj.options[key]) {
      resolve(url);
      return;
    }
    obj.popup = new Popup({
      icon: `fa-gear`,
      title: `Select the options that you want:`,
      buttons: [
        {
          color1: `green`, color2: `grey`,
          icon1: `fa-gear`, icon2: `fa-circle-o-notch fa-spin`,
          title1: `Generate`, title2: `Generating...`,
          callback1: this.generateThemeUrl.bind(this, obj, key)
        }
      ],
      addScrollable: true
    });
    obj.popup.onClose = resolve.bind(this, url);
    let context = obj.popup.getScrollable([{
      attributes: {
        class: `esgst-sm-colors`
      },
      type: `div`
    }]).firstElementChild;
    obj.options[key].forEach(option => {
      option.select = this.createElements(context, `beforeEnd`, [{
        type: `div`,
        children: [{
          text: `${option.name} `,
          type: `node`
        }, {
          type: `select`
        }]
      }]).lastElementChild;
      (option.options || binaryOptions).forEach(subOption => {
        this.createElements(option.select, `beforeEnd`, [{
          attributes: {
            value: subOption.id
          },
          text: subOption.name,
          type: `option`
        }]);
      });
      option.select.selectedIndex = option.default;
    });
    obj.popup.open();
  }

  generateThemeUrl(obj, key) {
    obj.url += `?`;
    obj.options[key].forEach(option => {
      obj.url += `${option.id}=${option.select.value}&`;
    });
    obj.url = obj.url.slice(0, -1);
    obj.popup.onClose = null;
    obj.popup.close();
    obj.resolve(obj.url);
  }

  createMenuSection(context, html, number, title, type) {
    let section = this.createElements(context, `beforeEnd`, [{
      attributes: {
        class: `esgst-form-row`,
        id: `esgst_${type}`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-form-heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-form-heading-number`
          },
          text: `${number}.`,
          type: `div`
        }, {
          attributes: {
            class: `esgst-form-heading-text`
          },
          type: `div`,
          children: [{
            text: title,
            type: `span`
          }]
        }]
      }, {
        attributes: {
          class: `esgst-form-row-indent`
        },
        type: `div`,
        children: html
      }]
    }]);
    if (this.esgst.collapseSections && !title.match(/Backup|Restore|Delete/)) {
      let button, container, isExpanded;
      button = this.createElements(section.firstElementChild, `afterBegin`, [{
        attributes: {
          class: `esgst-clickable`,
          style: `margin-right: 5px;`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-plus-square`,
            title: `Expand section`
          },
          type: `i`
        }]
      }]);
      container = section.lastElementChild;
      container.classList.add(`esgst-hidden`);
      isExpanded = false;
      button.addEventListener(`click`, () => {
        if (isExpanded) {
          container.classList.add(`esgst-hidden`);
          this.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-plus-square`,
              title: `Expand section`
            },
            type: `i`
          }]);
          isExpanded = false;
        } else {
          container.classList.remove(`esgst-hidden`);
          this.createElements(button, `inner`, [{
            attributes: {
              class: `fa fa-minus-square`,
              title: `Collapse section`
            },
            type: `i`
          }]);
          isExpanded = true;
        }
      });
    }
    return section;
  }

  createSMButtons(heading, items) {
    for (const item of items) {
      if (!item.Check) {
        continue;
      }
      const icons = [];
      for (const icon of item.Icons) {
        icons.push({
          attributes: {
            class: `fa ${icon}`
          },
          type: `i`
        });
      }
      this.createElements(heading, `beforeEnd`, [{
        attributes: {
          class: item.Name,
          title: item.Title
        },
        type: `a`,
        children: icons
      }]);
    }
  }

  triggerSetOnEnter(set, event) {
    if (event.key === `Enter`) {
      set.trigger();
      return true;
    }
  }

  formatTags(fullMatch, match1, offset, string) {
    return (((offset === 0) || (offset === (string.length - fullMatch.length))) ? `` : `, `);
  }

  animateScroll(y, callback) {
    // From https://stackoverflow.com/a/26808520/8115112

    let currentTime, time;
    currentTime = 0;
    if (y > 0) {
      y -= this.esgst.commentsTop;
    }
    time = Math.max(0.1, Math.min(Math.abs(scrollY - y) / 2000, 0.8));

    function tick() {
      let p;
      currentTime += 1 / 60;
      p = currentTime / time;
      if (p < 1) {
        requestAnimationFrame(tick);
        scrollTo(0, scrollY + ((y - scrollY) * ((p /= 0.5) < 1 ? 0.5 * Math.pow(p, 5) : 0.5 * (Math.pow((p - 2), 5) + 2))));
      } else {
        scrollTo(0, y);
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
    popup = new Popup({addScrollable: true, icon: `fa-exclamation`, isTemp: true, title: message});
    popup.open();
  }

  createConfirmation(message, onYes, onNo, event) {
    let callback, popup;
    callback = onNo;
    popup = new Popup({addScrollable: true, icon: `fa-question`, isTemp: true, title: message});
    popup.description.appendChild(new ButtonSet({
      color1: `green`, color2: ``, icon1: `fa-check`, icon2: ``, title1: `Yes`, title2: ``, callback1: () => {
        callback = onYes;
        popup.close();
      }
    }).set);
    popup.description.appendChild(new ButtonSet({
      color1: `red`, color2: ``, icon1: `fa-times`, icon2: ``, title1: `No`, title2: ``, callback1: () => {
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
    setTimeout(() => {
      context.textContent = ``;
    }, 10000);
  }

  getDataMenu(option, switches, type) {
    let i, m, menu, n, options, toggleSwitch;
    menu = document.createElement(`div`);
    switches[option.key] = toggleSwitch = new ToggleSwitch(menu, `${type}_${option.key}`, false, option.name, false, false, null, this.esgst.settings[`${type}_${option.key}`]);
    switches[option.key].size = this.createElements(switches[option.key].name, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      type: `span`
    }]);
    if (option.name === `Main`) {
      this.createElements(switches[option.key].name, `beforeEnd`, [{
        attributes: {
          class: `fa fa-question-circle`,
          title: `Main data is the data that is needed by other sub-options. Because of that dependency, when deleting main data not all data may be deleted, but if you delete another sub-option first and then delete main data, all data that was required exclusively by that sub-option will be deleted.`
        },
        type: `i`
      }]);
    }
    if (option.options) {
      options = this.createElements(menu, `beforeEnd`, [{
        attributes: {
          class: `esgst-form-row-indent SMFeatures esgst-hidden`
        },
        type: `div`
      }]);
      for (i = 0, n = option.options.length; i < n; ++i) {
        m = this.getDataMenu(option.options[i], switches, type);
        options.appendChild(m);
        toggleSwitch.dependencies.push(m);
      }
      if (this.esgst.settings[`${type}_${option.key}`]) {
        options.classList.remove(`esgst-hidden`);
      }
    }
    toggleSwitch.onEnabled = () => {
      if (options) {
        options.classList.remove(`esgst-hidden`);
      }
    };
    toggleSwitch.onDisabled = () => {
      if (options) {
        options.classList.add(`esgst-hidden`);
      }
    };
    return menu;
  }

  openSmallWindow(url) {
    open(url, `esgst`, `height=600,left=${(screen.width - 600) / 2},top=${(screen.height - 600) / 2},width=600`);
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
        if (location.hostname.match(domain.match(/\("(.+?)"\)/)[1])) {
          check = true;
          break;
        }
      }
      for (const url of (separator.match(/url(-prefix)?\(.+?\)/g) || [])) {
        if (location.href.match(url.match(/\("(.+?)"\)/)[1])) {
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
        if (character === `{`) {
          open++;
        } else if (character === `}`) {
          open--;
        }
        css.push(character);
        index++;
      } while (open > 0);
      css.pop();
    });
    return css.join(``);
  }

  loadChangelog(version) {
    const changelog = [
      {
        date: `November 1, 2018`,
        version: `8.0.4`,
        changelog: {
          1007: `Fix a bug that happens when trying to recreate a giveaway in Giveaway Recreator`,
          1006: `Fix a bug that happens when trying to view the results in Multiple Giveaway Creator`,
          1005: `Add option to automatically unbookmark inaccessible giveaways to Giveaway Bookmarks`,
          1004: `Fix a bug that does not automatically unbookmark ended giveaways in Giveaway Bookmarks`,
          1003: `Fix a bug that happens when saving a template in Giveaway Templates`,
          1000: `Add option to remove only wishlisted games to Hidden Games Remover`,
          999: `Fix a bug that happens when trying to edit a giveaway in Multiple Giveaway Creator`,
          996: `Allow multiple checkbox selection with Shift key in Multi-Manager`,
          995: `Fix a bug that happens when applying a template in Giveaway Templates`,
          994: `Add option to fallback to the Steam API when syncing without being logged in`,
          993: `Automatically add panel to the first visible text area in Comment Formatting Helper`,
          992: `Fix a style issue in Grid View`,
          988: `Fix a style issue that increases the hide giveaway button opacity`,
          987: `Fix a bug that prevents game tags from being shown`
        }
      },

      {
        date: `October 16, 2018`,
        version: `8.0.3`,
        changelog: {
          985: `Fix a style conflict between jQuery UI' CSS and SteamGifts' CSS`,
          984: `Fix dragging system for giveaway pages`,
          983: `Fix a bug that does not highlight copies from pinned giveaways in Giveaway Copy Highlighter`,
          982: `Fix a style issue in Grid View`,
          981: `Fix a bug in Giveaway Winners Link`,
          980: `Fix a bug that duplicates game categories`,
          979: `Fix a style issue with game categories that are moved to the giveaway columns`,
          978: `Add option to use preferred Google/Microsoft account when restoring/backing up`,
          977: `Fix a style issue that decreases the opacity of giveaway icons in the giveaway page`,
          922: `Load package data without having to reload the page in Game Categories`
        }
      },

      {
        date: `October 12, 2018`,
        version: `8.0.2`,
        changelog: {
          975: `Fix style issues`,
          974: `Make Level Progress Visualizer and Points Visualizer bars dynamically adjust to the size of the button`,
          973: `Fix a style issue that lowers the opacity of the points/copies elements`,
          970: `Fix a bug that does not show replies in the inbox page with Reply From Inbox`,
          969: `Fix a bug that refreshes the page after commenting with Multi-Reply`,
          968: `Add option to change Level Progress Visualizer and Points Visualizer bar colors`,
          967: `Make Level Progress Visualizer and Points Visualizer compatible`,
          966: `Add a new feature: Visible Full Level`
        }
      },

      {
        date: `October 11, 2018`,
        version: `8.0.1`,
        changelog: {

        }
      },
      {
        date: `October 11, 2018`,
        version: `8.0.0`,
        changelog: {
          965: `Add "Winners" giveaway filter`,
          964: `Add option to categorize Steam games to Multi Manager`,
          963: `Extract ItsTooHard and Jigidi links with Giveaway Extractor`,
          962: `Add option to automatically bookmark giveaways when trying to enter them without enough points to Enter/Leave Giveaway Button`,
          961: `Add option to display time to point cap alongside with points at the header`,
          960: `Add new section to the settings menu to handle elements order and prevent them from being draggable in all pages`,
          959: `Add option to use different pause settings in Endless Scrolling depending on the include path`,
          958: `Add option to reset left/right main page heading buttons order`,
          957: `Extend new draggable system to left/right main page heading buttons`,
          956: `Add which games were won from the listed users to User Giveaway Data`,
          950: `Fix HTML in User Stats`,
          949: `Fix a bug that does not show giveaway info category for games with 0P`,
          946: `Add a button for 2.14.4 "Only extract from the current giveaway onward"`,
          937: `Add a new game category and giveaway filter: Followed`,
          936: `Make elements in the giveaway links draggable`,
          935: `Fix a bug that empties the header points when removing someone from the whitelist`,
          933: `Fix HTML in Multiple Giveaway Creator`,
          925: `Make elements in the giveaway heading draggable`,
          902: `Change Content-Type header in Dropbox requests to application/octet-stream`
        }
      },
      {
        date: `September 15, 2018`,
        version: `7.27.2`,
        changelog: {
          915: `Fix Received and Not Received filters`,
          916: `Improve the detection of ended giveaways`,
          917: `Fix a bug that does not sort some columns correctly in Table Sorter`,
          918: `Fix a bug that doesn't stop Endless Scrolling on group pages if the Ended filter is set to false and an ended giveaway was found`,
          920: `Fix a typo in the simplified label for the Hidden game category`,
          921: `Do not sync list of reduced CV games if the database has failed to update`,
          923: `Increase priority of Hidden Game's Enter Button Disabler over default buttons`,
          924: `Fix a bug that centers posts in Main Post Popup`,
          926: `Fix a bug that happens when cleaning old data`,
          930: `Fix a bug that does not filter public giveaways in the entered page`,
          931: `Add "Reviews" filter`
        }
      },
      {
        date: `September 2, 2018`,
        version: `7.27.1`,
        changelog: {
          914: `Remove detailed hidden game category for packages`,
          913: `Add support for GitHub Wiki SteamGifts Integration to Comment Formatting Helper`,
          912: `Fix HTML of group names in Multiple Giveaway Creator`,
          910: `Only show Not Received Finder button for won gifts if the user has won gifts marked as not received`,
          909: `Fix counter in User Giveaway Data`
        }
      },
      {
        date: `August 31, 2018`,
        version: `7.27.0`,
        changelog: {
          906: `Always reverse discussions regardless of where the user came from`,
          786: `Show game categories for packages of the items from the package`,
          905: `Fix a bug that shows the loading icon forever in Game Categories`,
          899: `Prevent the script from marking all features as new on first install`,
          884: `Add a feature: Discussion Tags`,
          903: `Fix a bug that happens when syncing ignored games`,
          895: `Extend Not Received Finder to won giveaways`,
          894: `Show the games won under "Most sent to" in User Giveaway Data`
        }
      },
      {
        date: `August 26, 2018`,
        version: `7.26.4`,
        changelog: {
          798: `Indicate leftover gifts/keys in Unsent Gifts Sender`,
          861: `Add option to activate the first SG/ST tab if a browser session was restored (extension only)`,
          883: `Fix a bug that does not sync games correctly`,
          891: `Fix bugs in Whitelist/Blacklist Checker`,
          893: `Fix HTML in User Giveaway Data`,
          897: `Prevent Cake Day Reminder from notifying about past cake day when installing the script`,
          900: `Fix HTML in the restore and delete menus`,
          901: `Fix a bug that happens when refreshing old active discussions on sidebar`
        }
      },
      {
        date: `August 15, 2018`,
        version: `7.26.3`,
        changelog: {
          889: `Fix some bugs in Trade Bumper`,
          888: `Fix a conflict with Do You Even Play, Bro?`,
          887: `Fix a bug that sometimes adds a loading icon to giveaways when it shouldn&#39;t in Game Categories`,
          886: `Fix a few syntax bugs`,
          885: `Fix a bug that happens when loading categories for giveaways that were unfiltered`
        }
      },
      {
        date: `August 10, 2018`,
        version: `7.26.2`,
        changelog: {
          881: `Add option to show game categories that do not need to be fetched from Steam instantly`,
          880: `Fix a bug that does not apply some themes`,
          879: `Add the feature to show tag suggestions while typing as an option`,
          878: `Load game categories for filtered giveaways on demand`
        }
      },
      {
        date: `August 8, 2018`,
        version: `7.26.1`,
        changelog: {
          877: `Fix a bug that does not sync Steam groups`,
          876: `Fix a bug that does not retrieve game categories correctly for non-US users`,
          873: `Implement global 200ms limit to Steam store API requests`,
          872: `Fix a bug where some features don&#39;t work correctly in ESGST-generated pages`,
          871: `Fix a bug that does not load emojis`,
          859: `Fix a bug that does not load Profile Links if one of the sub-options is disabled`,
          848: `Fix bugs introduced by v7.25.0`,
          806: `Add option to continuously load X more pages (max 10) when visiting any page to Endless Scrolling`
        }
      },
      {
        date: `August 6, 2018`,
        version: `7.26.0`,
        changelog: {
          870: `Add Learning game category`,
          869: `Add Singleplayer game category`,
          868: `Include online multiplayer, co-op and online co-op in the Multiplayer game category`,
          867: `Link to SGTools pages in the Unsent Gifts Sender results`,
          866: `Add Enterable filter to Giveaway Extractor`,
          864: `Add a feature: Group Tags`,
          862: `Add autocomplete feature to User Tags and Game Tags`
        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.4`,
        changelog: {}
      },
      {
        date: `August 2, 2018`,
        version: `7.25.3`,
        changelog: {}
      },
      {
        date: `August 2, 2018`,
        version: `7.25.2`,
        changelog: {
          857: `Add option to backup as .zip or .json`,
          854: `Move each module into a separate file`,
          853: `Move some generic functions to a separate file`
        }
      },
      {
        date: `August 2, 2018`,
        version: `7.25.2`,
        changelog: {
          857: `Add option to backup as .zip or .json`,
          854: `Move each module into a separate file`,
          853: `Move some generic functions to a separate file`
        }
      },
      {
        date: `July 27, 2018`,
        version: `7.25.1`,
        changelog: {
          848: `Fix bugs introduced by v7.25.0`,
          850: `Fix the extension's toolbar popup`,
          852: `Add a new game category: HLTB`
        }
      },
      {
        date: `July 27, 2018`,
        version: `7.25.0`,
        changelog: {
          845: `Fix the extension to comply with Mozilla requirements`
        }
      },
      {
        date: `July 24, 2018`,
        version: `7.24.1`,
        changelog: {
          844: `Show error message in the giveaway if game categories failed to load`,
          843: `Fix a bug that re-retrieves categories for games that were already recently retrieved`,
          842: `Fix Is There Any Deal? Info`,
          841: `Extend "Most sent to" list to other users in User Giveaway Data`,
          840: `Prevent User Giveaway Data from making useless requests if a giveaway has less than or equal to 3 winners`,
          839: `Fix a bug that happens sometimes when hovering over the input field in Quick Giveaway Search`,
          838: `Fix a bug that colors ended giveaways as green the first time they are found in Giveaway Encrypter/Decrypter`,
          836: `Open links from the header menu in a new tab`,
          834: `Enhance cookie manipulation in the extension to bypass age checks in requests to the Steam store`,
          833: `Fix a bug that happens when showing game categories in real time`,
          832: `Fix changelog link in the header menu`,
          828: `Add option to show the Giveaway Encrypter/Decrypter header button even if there are only ended giveaways in the page`,
          803: `Fix a bug that doesn't show groups containing HTML entities in Multiple Giveaway Creator`
        }
      },
      {
        date: `July 22, 2018`,
        version: `7.24.0`,
        changelog: {
          829: `Add options to limit requests to the Steam store and show categories in real time to Game Categories`,
          831: `Fix a bug that does not calculate average entries correctly in Entry Tracker`,
          830: `Fix a bug that identifies non-owned games as owned in Game Categories`,
          827: `Add a feature: Giveaway Points To Win`,
          826: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" to Giveaways Sorter`,
          805: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" giveaway filters`,
          808: `Fix a bug that does not remember the position of the winners column in group pages when dragging`,
          825: `Fix a style issue that shows two scrollbars in the settings menu`
        }
      },
      {
        date: `July 20, 2018`,
        version: `7.23.0`,
        changelog: {
          824: `Add enhancements to User Giveaway Data`,
          823: `Fix a bug that does not change SteamGifts filters through Giveaway Filters correctly`,
          822: `Fix a bug that does not pin highlighted discussions after sorting`,
          821: `Make SGTools filter ignore the Chance, Chance Per Point, Comments, Entries and Ratio filters`,
          820: `Fix the "Add Current" button for includes/excludes in the main page`,
          819: `Possible fix for endless spawning issue with Steam Activation Links`,
          818: `Use the featured heading of a user's profile page instead of the page heading`,
          817: `Add option to choose custom colors for Giveaway Copy Highlighter`,
          816: `Add option to automatically mark a user's own comments as read`,
          815: `Add option to enable tracking controls for a user's own comments`,
          814: `Add option to fade out read comments in Comment Tracker`,
          813: `Fix a bug that happens when refreshing active discussions on the sidebar`,
          812: `Fix a bug that happens when retrieving categories of discussions in the sidebar`,
          790: `Add option to automatically update hidden games adding/removing a game to/from the list`,
          811: `Show success message when cleaning data`,
          795: `Fix a bug that happens when cleaning data for features that the user hasn't used yet`,
          810: `Automatically detect username changes when visiting a user's profile page`,
          804: `Change resource references to the current version in the userscript version`,
          802: `Make the settings search bar stay always visible when scrolling`,
          797: `Add Public giveaway filter`,
          801: `Add a feature: Comment Filters`,
          147: `Add extension support for Microsoft Edge`,
          796: `Add countdown to the duplicate giveaway waiting period in Multiple Giveaway Creator`,
          794: `Add Patreon as an additional form of donation`,
          785: `Detect packages that contain owned/wishlisted games through Game Categories`,
          792: `Fix a bug that does not update the list of reduced CV games if a game was removed`,
          784: `Load themes faster`,
          646: `Extend header/footer to ESGST-generated pages`,
          672: `Add option to clean discussion (remove deleted comments from the database) to Comment Tracker`,
          783: `Open SGTools links in new tabs on Giveaway Extractor`
        }
      },
      {
        date: `June 24, 2018`,
        version: `7.22.0`,
        changelog: {
          545: `Add a feature: Have/Want List Checker`,
          572: `Fix a bug that does not predict the level in Level Progress Visualizer correctly`,
          690: `Fix a bug where Giveaway Group Loader fails in some pages`,
          702: `Extend Attached Image Carousel to Quick Inbox View`,
          722: `Improve performance when applying filter presets (removes live-search select box and invert rule)`,
          732: `Bring back filter counters`,
          768: `Save state of "create train" and "remove links" switches from Multiple Giveaway Creator with Giveaway Templates`,
          769: `Add polyfill for IntersectionObserver`,
          771: `Fix a bug that does not filter games without images after data being retrieved with Created/Entered/Won Giveaway Details`,
          772: `Fix domain for SteamGifts popups on SteamTrades`,
          773: `Fix Shared Group Checker for new Steam group page design`,
          775: `Save game name when it doesn't have an image for future use`,
          776: `Fix a bug that does not save an advanced filter preset after deleting the rules`,
          777: `Fix a bug that does not filter by Achievements or Linux`,
          778: `Add small manual for advanced filters`,
          779: `Fix conflict with Touhou script`,
          780: `Fix a bug that blinks the minimize popups panel if the popup was open when it ended`,
          781: `Fix a bug that does not allow restoring .zip files in Firefox`,
          782: `Fix a bug that skips the Quick Inbox View popout to the top when scrolling down`
        }
      },
      {
        date: `June 10, 2018`,
        version: `7.21.1`,
        changelog: {
          0: `Hotfix for v7.21.0.`
        }
      },
      {
        date: `June 10, 2018`,
        version: `7.21.0`,
        changelog: {
          765: `Fix a bug that does not allow restoring .zip files`,
          764: `Fix a bug that does not save filter settings if only basic filters are enabled`,
          763: `Fix a bug that does not retrieve all pages correctly in Whitelist/Blacklist Checker`,
          762: `Fix a bug that adds duplicate "Sticky group" buttons`,
          760: `Add SteamGifts' CSS file to the repository to prevent ESGST pages from being messed up if cg updates the CSS`,
          759: `Fix a bug that shows wrong list of users in Group Library/Wishlist Checker when searching by app ID`,
          758: `Fix a bug that only previews comments on user input`,
          757: `Fix a bug that does not load encrypted giveaways`,
          756: `Open settings menu when clicking on the extension icon`,
          755: `Add option to minimize non-temporary popups`,
          753: `Fix a bug that adds duplicate "Skip User" buttons to Whitelist/Blacklist Checker`,
          752: `Fix active discussions on narrow sidebar`,
          750: `Fix a bug that positions large popouts incorrectly in screens below 1440x900`,
          749: `Fix a bug that does not allow applying empty presets`,
          748: `Improve the scrolling`,
          747: `Fix a bug that applies discussion filter on the main page even when disabled`,
          746: `Add a feature: Points Visualizer`,
          745: `Fix a style issue in the filters`,
          744: `Add a new game category: DLC (Base Owned)`,
          743: `Bring back option to select which filters to appear`,
          742: `Fix a bug that does not load Multi-Manager in the regular pages`,
          711: `Fix a bug in Quick Inbox View`,
          671: `Add a feature: Giveaway End Time Highlighter`,
          573: `Completely revamp User Giveaway Data`
        }
      },
      {
        date: `May 28, 2018`,
        version: `7.20.5`,
        changelog: {
          0: `Hotfix for v7.20.4.`
        }
      },
      {
        date: `May 28, 2018`,
        version: `7.20.4`,
        changelog: {
          737: `Save paused state of filters to allow them to remain paused when refreshing the page`,
          736: `Fix a bug that deletes settings if saving a preset with some filters paused`,
          735: `Convert old presets to the new system`,
          734: `Fix a bug in Endless Scrolling`,
          731: `Fix a bug that does not apply presets`
        }
      },
      {
        date: `May 27, 2018`,
        version: `7.20.3`,
        changelog: {
          730: `Possible fix to massive CPU usage spikes`,
          728: `Increase max-height of filters area`,
          727: `Fix a bug that happens when backing up to Google Drive`,
          726: `Fix a bug in the filters`,
          723: `Change color of AND/OR filter buttons`,
          721: `Fix a bug that happens in Giveaway Encrypter/Decrypter because of filters`,
          720: `Bring back the core of the basic filters as an opt-out option`,
          718: `Add button to pause filter rules/groups to advanced filters`
        }
      },
      {
        date: `May 27, 2018`,
        version: `7.20.2`,
        changelog: {
          0: `Hotfix for v7.20.1.`
        }
      },
      {
        date: `May 26, 2018`,
        version: `7.20.1`,
        changelog: {
          0: `Hotfix for v7.20.0.`
        }
      },
      {
        date: `May 26, 2018`,
        version: `7.20.0`,
        changelog: {
          709: `Use jQuery QueryBuilder to configure filters`,
          715: `Add a feature: Narrow Sidebar`,
          708: `Fix a bug that does not load features correctly in new tabs`,
          667: `Fix a bug that does not load endless features correctly in some pages`,
          678: `Display ? instead of negative CV in Game Categories - Giveaway Info and get the price from the giveaway points when available`,
          707: `Do not go to comment in Quick Inbox View`,
          665: `Add other found replies to the comment instead of showing them in a popup in Reply From Inbox`,
          703: `Improve description variables explanation in Multiple Giveaway Creator`,
          706: `Fix a bug that reverses the pages of a discussion when there is a hash in the URL`,
          705: `Fix a bug that does not manage items inside of Grid View popouts in Multi-Manager`,
          704: `Add option to hide games to Multi-Manager`
        }
      },
      {
        date: `May 20, 2018`,
        version: `7.19.0`,
        changelog: {
          701: `Remove min-height requirement from Fixed Sidebar`,
          700: `Fix a bug that does not fix the sidebar after scrolling down a second time from the top`,
          699: `Fix a bug that does not display the sync page`,
          698: `Add option to choose the key combination to trigger the Custom Header/Footer Links editor`,
          695: `Fix a bug where sorting fails after hiding a single giveaway`,
          694: `Fix a style issue that does not position popouts above/below correctly`,
          693: `Fix a style issue that does not position popouts correctly if the window is scrolled horizontally`,
          692: `Remove min-height requirement from Fixed Main Page Heading`,
          691: `Change Giveaway Popup button to red if giveaway cannot be accessed`,
          689: `Add a button to clear the current query to the search field in the settings menu`,
          688: `Extend giveaway features to the archive page`,
          686: `Changes to how emojis are stored`,
          685: `Compress data when backing up`,
          684: `Add &quot;Last Bundled&quot; default link to Custom Header/Footer Links`,
          683: `Allow selected emojis to be re-ordered`,
          682: `Add option to retrieve game names when syncing`,
          681: `Fix a bug where filtering is applied when changing any filter options despite filtering being disabled`,
          680: `Add a feature: Visible Real CV`,
          679: `Add &quot;Previously Won&quot; game category`,
          677: `Fix a bug that does not persist some settings`,
          676: `Fix a bug that auto-backups to computer on every page load`,
          674: `Change how the NEW indicator works on Quick Inbox View`
        }
      },
      {
        date: `May 11, 2018`,
        version: `7.18.3`,
        changelog: {
          675: `Remove Comment History from SteamTrades`,
          673: `Fix a bug that happens when creating giveaways through either Giveaway Templates or Multiple Giveaway Creator`,
          670: `Fix a bug that does not return Endless Scrolling to a paused state after continuously loading pages`,
          667: `Fix a bug that does not load endless features correctly in some pages`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.2`,
        changelog: {
          668: `Hotfix for v7.18.1`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.1`,
        changelog: {
          666: `Hotfix for v7.18.0`
        }
      },
      {
        date: `May 07, 2018`,
        version: `7.18.0`,
        changelog: {
          664: `Fix a bug that does not decrypt giveaways containing the word bot in their name`,
          663: `Fix a bug that happens when importing giveaways with a description template for a train in Multiple Giveaway Creator`,
          662: `Fixate the Comment Formatting Helper panel without limiting the height of the text area`,
          661: `Fix a bug in Comment Formatting Helper that does not add a scrolling bar to the text area in the edit discussion page`,
          660: `Fix a bug that removes all games when syncing if both the store and the API methods failed`,
          659: `Fix a style issue that sometimes does not overlap popups/popouts correctly`,
          658: `Fix a bug that does not refresh Quick Inbox View correctly`,
          657: `Add infinite max filters to Giveaway/Discussion Filters`,
          655: `Fix a bug that does not load endless features correctly`,
          654: `Make SGTools link draggable in Giveaway Extractor`,
          653: `Add missing Steam and search links to SGTools giveaways in Giveaway Extractor`,
          651: `Update FontAwesome links`,
          650: `Limit requests to the Steam store when syncing to 1 per second`,
          647: `Changes to the structure of the code`,
          645: `Add a SGTools filter to Giveaway Filters`,
          644: `Fix a bug that does not delete table rows in Comment Formatting Helper`,
          642: `Add option to group all keys for the same game in Multiple Giveaway Creator`,
          641: `Add a new section to the settings menu: Themes`,
          640: `Fix tooltip in Multiple Giveaway Creator`,
          639: `Convert checkboxes from circles to squares`,
          638: `Fix some bugs that happen when marking comments as unread`,
          608: `Add a feature: Multi-Manager (remove Giveaway Manager and Multi-Tag)`,
          332: `Fix a bug that fails to create multiple giveaways for the same game in Multiple Giveaway Creator`
        }
      },
      {
        date: `April 19, 2018`,
        version: `7.17.8`,
        changelog: {
          637: `Fix a style issue in pages generated by ESGST open in a new tab`,
          636: `Fix a bug that calculates the wrong chance per point if a giveaway has 0 points`,
          635: `Bypass bot protections when extracting giveaways`,
          634: `Fix a bug that does not switch the colors of game category icons for alt accounts when moving them`,
          633: `Fix a bug that does not turn the decrypted giveaways icon to green when new giveaways are found`,
          628: `Add option to only search for comments in a specific page range to Comment Searcher`,
          599: `Extend Giveaways Sorter to popups`,
          567: `Add description variables to Multiple Giveaway Creator`
        }
      },
      {
        date: `April 14, 2018`,
        version: `7.17.7`,
        changelog: {
          632: `Add option to limit how many SGTools giveaways are opened when extracting`,
          631: `Add option to allow manipulation of cookies for Firefox containers`,
          630: `Add more details to error messages during alt accounts sync`,
          629: `Cancel backup when canceling file name input`,
          627: `Implement a method to make the process of adding new filters easier`,
          626: `Fix a bug that does not sync games if the user does not have alt accounts set`,
          625: `Integrate SGTools giveaways into Giveaway Extractor`,
          624: `Fix a bug that opens duplicate SGTools links when extracting giveaways`,
          623: `Add option to save backups without asking for a file name`,
          593: `Add Groups and Creators giveaway filters and Authors discussion filter`,
          592: `Fix a bug that does not load more pages in Endless Scrolling if there are deleted giveaways in the current page with the ended filter set to hide all`
        }
      },
      {
        date: `April 11, 2018`,
        version: `7.17.6`,
        changelog: {
          620: `Add more reliable methods of syncing and backing up`,
          619: `Fix a bug that does not add an Enter button when extracting giveaways with few points`,
          618: `Add option to open SGTools links when extracting giveaways`,
          617: `Fix a bug that does not sync owned games in alt accounts`,
          616: `Allow users to sync their games through the Steam API alone if the store method is unavailable`,
          615: `Fix a bug that does not reverse a discussion if endless scrolling is paused`,
          614: `Add option to reverse comments in a discussion by indicating it through a hash in the URL`,
          613: `Make blacklist checks an opt-out instead of an opt-in by default in Whitelist/Blacklist Checker`,
          611: `Add option to specify non-region restricted giveaways when importing in Multiple Giveaway Creator`,
          610: `Fix a bug that duplicates the permalink icon`,
          609: `Fix a bug that does not retrieve game names when syncing`,
          607: `Fix a bug that does not include the .zip download when notifying a new version in non-Firefox browsers`,
          604: `Fix a bug that prevents the script from loading`,
          603: `Fix a bug that can prevent some elements in the giveaway columns/panel from being moved`,
          600: `Fix a bug that does not show SG popups found when requesting data if static popups are enabled`
        }
      },
      {
        date: `April 05, 2018`,
        version: `7.17.5`,
        changelog: {
          605: `Fix a bug that does not set the correct default values for some settings`,
          602: `Add option to clean duplicate data to the data cleaner menu`,
          598: `Implement a method to automatically detect and highlight new features/options in the settings menu with the [NEW] tag`,
          597: `Fix a bug that shows Infinity% chance per point on the entered page`,
          596: `Replace the terms &quot;Import&quot; and &quot;Export&quot; with &quot;Restore&quot; and &quot;Backup&quot; and change the icons to avoid any confusion`,
          584: `Fix a bug that does not reload the extension in Chrome when updating`,
          555: `Add SteamGifts filters to Giveaway Filters`,
          538: `Add options to allow users to specify the format of the tab indicators in Header Refresher`,
          524: `Fix a but that shows the new version popup twice`,
          299: `Implement a method to better handle marking discussions as visited across multiple tabs`
        }
      },
      {
        date: `March 25, 2018`,
        version: `7.17.4`,
        changelog: {
          590: `Speed up retrieval of Game Categories for users that do not have ratings, removed and user-defined tags enabled`,
          588: `Fix a conflict between whitelist/blacklist/rule checks and Quick Inbox View`,
          587: `Prevent main page heading from being fixed if the page is too small`,
          586: `Add option to filter giveaways by chance per point`,
          585: `Fix a bug that duplicates user notes when importing and merging`,
          582: `Fix a couple bugs that prevent Game Categories from being retrieved correctly`
        }
      },
      {
        date: `March 20, 2018`,
        version: `7.17.3`,
        changelog: {
          583: `Revert #565`,
          580: `Fix a bug in Tables Sorter that does not sort sent/received group columns correctly`,
          579: `Rename Whitelist/Blacklist Links to Profile Links and add more options`
        }
      },
      {
        date: `March 15, 2018`,
        version: `7.17.2`,
        changelog: {
          0: `Split jQuery, jQuery UI and Parsedown into separate files`
        }
      },
      {
        date: `March 14, 2018`,
        version: `7.17.1`,
        changelog: {
          0: `Add extension to the Mozilla store`
        }
      },
      {
        date: `March 14, 2018`,
        version: `7.17.0`,
        changelog: {
          562: `Add descriptions to the precise options in Giveaway Templates`,
          563: `Add an option to specify the game when importing with Multiple Giveaway Creator`,
          564: `Fix a bug that does not extract the giveaway from the current page`,
          565: `Add minified version and set it as default`,
          566: `Add option to specify separate details for each imported giveaway in Multiple Giveaway Creator`,
          568: `Add an option to enable Giveaway Recreator for all created giveaways`,
          570: `Fix a bug in Chrome that does not open the giveaway extractor on first click`,
          571: `Include whether the giveaway is for a gift or a key in the template when using Giveaway Templates`,
          574: `Add a feature: Element Filters (remove Hidden Feature Container and Hidden Pinned Giveaways)`,
          575: `Move "Click here to see your review for this user" to the top of the page in Reply Box On Top on SteamTrades`,
          576: `Fix a bug that does not load features correctly in discussions that contain polls`,
          578: `Optimize the extension performance (Ongoing)`,
          353: `Convert all callback functions into promises and use async/await to deal with them (Ongoing)`
        }
      },
      {
        date: `March 4, 2018`,
        version: `7.16.5`,
        changelog: {
          353: `Convert all callback functions into promises and use async/await to deal with them (ongoing)`,
          552: `Fix a bug that does not allow the Giveaway Extractor button to be moved`,
          556: `Only load Attached Images Carousel for images that are actually in the page`,
          558: `Fix a bug that does not extract giveaways in a new tab`,
          560: `Fix a bug that does not load ESGST sometimes`,
          561: `Fix a bug that happens when performing requests in the userscript version`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.4`,
        changelog: {
          0: `Hotfix for v7.16.3 (Userscript version was still not working)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.3`,
        changelog: {
          0: `Hotfix for v7.16.2 (Userscript version was not working)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.2`,
        changelog: {
          0: `Hotfix for v7.16.1 (Forgot to change the version)`
        }
      },
      {
        date: `March 2, 2018`,
        version: `7.16.1`,
        changelog: {
          527: `Fix a bug that happens when loading highlighted discussions`,
          537: `Add option to delete days from Entry Tracker history`,
          539: `Fix a bug that happens when sending unsent gifts with the options to check if the winner is whitelisted/blacklisted`,
          540: `Fix some bugs with the reordering of heading buttons`,
          541: `Extend Inbox Winner Highlighter to Quick Inbox View`,
          542: `Add options to specify image border width when highlighting a giveaway with Giveaway Winning Chance/Ratio`,
          543: `Fix a bug that does not load some features correctly`,
          544: `Change the order of the elements in the Giveaway Bookmarks popup`,
          548: `Fix a bug that decrypts giveaway links from the Quick Inbox View popout`,
          549: `Add domain instructions to adding a Steam API key`,
          550: `Optimize storage usage in the script version`
        }
      }
    ];
    let index = 0;
    if (version) {
      let i, n;
      for (i = 0, n = changelog.length; i < n && changelog[i].version !== version; i++) {
      }
      index = i < n ? i - 1 : n - 1;
    }
    const html = [];
    while (index > -1) {
      const items = [];
      for (const key in changelog[index].changelog) {
        if (changelog[index].changelog.hasOwnProperty(key)) {
          const item = {
            type: `li`,
            children: []
          };
          if (key === `0`) {
            item.children.push({
              text: changelog[index].changelog[key],
              type: `node`
            });
          } else {
            item.children.push({
              attributes: {
                href: `https://github.com/gsrafael01/ESGST/issues/${key}`
              },
              text: `#${key}`,
              type: `a`
            }, {
              text: ` ${changelog[index].changelog[key]}`,
              type: `node`
            });
          }
          items.push(item);
        }
      }
      html.unshift({
        attributes: {
          class: `esgst-bold`
        },
        text: `v${changelog[index].version} (${changelog[index].date})`,
        type: `p`
      }, {
        type: `ul`,
        children: items
      });
      index -= 1;
    }
    const popup = new Popup({addScrollable: true, icon: `fa-file-text-o`, isTemp: true, title: `Changelog`});
    this.createElements(popup.scrollable, `afterBegin`, [{
      attributes: {
        class: `esgst-text-left markdown`
      },
      type: `div`,
      children: html
    }]);
    popup.open();
  }

  createElements(context, position, items) {
    if (position === `inner`) {
      context.innerHTML = ``;
    }
    if (!items || !items.length) {
      return;
    }
    const fragment = document.createDocumentFragment();
    let element = null;
    this.buildElements(fragment, items);
    switch (position) {
      case `beforeBegin`:
        context.parentElement.insertBefore(fragment, context);
        element = context.previousElementSibling;
        break;
      case `afterBegin`:
        context.insertBefore(fragment, context.firstElementChild);
        element = context.firstElementChild;
        break;
      case `beforeEnd`:
        context.appendChild(fragment);
        element = context.lastElementChild;
        break;
      case `afterEnd`:
        context.parentElement.insertBefore(fragment, context.nextElementSibling);
        element = context.nextElementSibling;
        break;
      case `inner`:
        context.appendChild(fragment);
        element = context.firstElementChild;
        break;
      case `outer`:
        context.parentElement.insertBefore(fragment, context);
        element = context.previousElementSibling;
        context.remove();
        break;
    }
    return element;
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
      if (item.type === `node`) {
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
      if (item.type === `i`) {
        const node = document.createTextNode(` `);
        context.appendChild(node);
      }
      context.appendChild(element);
      if (item.type === `i`) {
        const node = document.createTextNode(` `);
        context.appendChild(node);
      }
    }
  }

  /**
   * @param appId
   * @param steamId
   * @returns {PlayerAchievementsSteamApiResponse}
   */
  async getPlayerAchievements(appId, steamId) {
    return JSON.parse((await this.request({
      method: `GET`,
      url: `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${this.esgst.steamApiKey}&steamid=${steamId}`
    }).responseText));
  }

  /**
   * @param steamIds
   * @returns {SuspensionsApiResponse}
   */
  async getSuspensions(steamIds) {
    return JSON.parse((await this.request({
      method: `GET`,
      url: `https://script.google.com/macros/s/AKfycbwdKNormCJs-hEKV0GVwawgWj1a26oVtPylgmxOOvNk1Gf17A/exec?steamIds=${steamIds.join(`,`)}`
    })).responseText);
  }

  /**
   * @param SMFeatures
   */
  updateTheme(SMFeatures) {
    SMFeatures.firstElementChild.lastElementChild.previousElementSibling.dispatchEvent(new Event(`click`));
  }
}

export default Common;

// Singleton
let common = new Common;

container.add({common});

export {common};
