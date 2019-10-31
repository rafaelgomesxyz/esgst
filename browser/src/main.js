'use strict';

// that will append styles to page in runtime
// jQuery QueryBuilder want global interact object
import interact from 'interactjs/dist/interact.min';
import 'jquery';
import 'jQuery-QueryBuilder/dist/js/query-builder.standalone.min';
import './assets/styles';
import { browser } from './browser';
import { esgst } from './class/Esgst';
import { Utils } from './lib/jsUtils';
import { addStyle } from './modules/Style';
import { runSilentSync } from './modules/Sync';
import { Settings } from './class/Settings';
import { Shared } from './class/Shared';
import { Logger } from './class/Logger';
import { persistentStorage } from './class/PersistentStorage';
import { DOM } from './class/DOM';
import { Header } from './components/Header';
import { Session } from './class/Session';
import { Footer } from './components/Footer';
import { LocalStorage } from './class/LocalStorage';

// @ts-ignore
window.interact = interact;

(() => {
  const
    common = esgst.modules.common
  ;

// @ts-ignore
  if (!window.NodeList.prototype[Symbol.iterator]) {
    // @ts-ignore
    window.NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

// @ts-ignore
  if (!window.HTMLCollection.prototype[Symbol.iterator]) {
    // @ts-ignore
    window.HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

  const theme = LocalStorage.get('theme');
  if (theme) {
    const style = document.createElement('style');
    style.id = 'esgst-theme';
    style.textContent = theme;
    document.documentElement.appendChild(style);
  }
  const customTheme = LocalStorage.get('customTheme');
  if (customTheme) {
    const style = document.createElement('style');
    style.id = 'esgst-custom-theme';
    style.textContent = customTheme;
    document.documentElement.appendChild(style);
  }

  // initialize esgst
  async function init() {
    if (document.getElementById('esgst')) {
      // esgst is already running
      return;
    }

    esgst.markdownParser.setBreaksEnabled(true);
    esgst.markdownParser.setMarkupEscaped(true);
    esgst.name = esgst.sg ? 'sg' : 'st';

    browser.runtime.onMessage.addListener(message => {
      message = JSON.parse(message);
      switch (message.action) {
        case 'notify-tds':
          Shared.esgst.modules.generalThreadSubscription.updateItems(message.values);

          break;
        case 'isFirstRun':
          if (esgst.bodyLoaded) {
            Shared.common.checkNewVersion(true);
          } else {
            esgst.isFirstRun = true;
          }
          break;
        case 'isUpdate':
          if (esgst.bodyLoaded) {
            Shared.common.checkNewVersion(false, true);
          } else {
            esgst.isUpdate = true;
          }
          break;
        case 'storageChanged':
          Shared.common.getChanges(message.values.changes, message.values.areaName);
          break;
        case 'update':
          common.createConfirmation(
            `Hi! A new version of ESGST (${message.values.version}) is available. Do you want to force an update now? If you choose to force an update, ESGST will stop working in any SteamGifts/SteamTrades tab that is open, along with any operation that you might be performing (such as syncing, checking something etc), so you will have to refresh them. If you choose not to force an update, your browser will automatically update the extension when you are not using it (for example, when you restart the browser).`,
            () => {
              browser.runtime.sendMessage({ action: 'reload' }).then(() => {})
            },
            () => {}
          );
          break;
      }
    });

    browser.storage.onChanged.addListener(Shared.common.getChanges.bind(Shared.common));

    // set default values or correct values
    /**
     * @property {object} esgst.storage.Emojis
     * @property {object} esgst.storage.filterPresets
     * @property {object} esgst.storage.dfPresets
     */
    esgst.storage = await browser.storage.local.get(null);
    const toDelete = [];
    const toSet = {};
    if (Utils.isSet(esgst.storage.users)) {
      esgst.users = JSON.parse(esgst.storage.users);
      let changed = false;
      for (let key in esgst.users.users) {
        if (esgst.users.users.hasOwnProperty(key)) {
          let wbc = esgst.users.users[key].wbc;
          if (wbc && wbc.result && wbc.result !== 'whitelisted' && wbc.result !== 'blacklisted') {
            delete esgst.users.users[key].wbc;
            changed = true;
          }
        }
      }
      if (changed) {
        toSet.users = JSON.stringify(esgst.users);
      }
    } else {
      esgst.users = {
        steamIds: {},
        users: {}
      };
      toSet.users = JSON.stringify(esgst.users);
    }
    if (!Utils.isSet(esgst.storage[`${esgst.name}RfiCache`])) {
      toSet[`${esgst.name}RfiCache`] = LocalStorage.get('replies', '{}');
      LocalStorage.delete('replies');
    }
    if (Utils.isSet(esgst.storage.emojis)) {
      const fixed = common.fixEmojis(esgst.storage.emojis);
      if (esgst.storage.emojis !== fixed) {
        toSet.emojis = fixed;
      } else if (!esgst.storage.emojis) {
        toSet.emojis = '[]';
      }
    } else {
      toSet.emojis = Utils.isSet(esgst.storage.Emojis) ? common.fixEmojis(esgst.storage.Emojis) : '[]';
      toDelete.push('Emojis');
    }
    esgst.emojis = JSON.parse(toSet.emojis || esgst.storage.emojis);
    if (esgst.sg) {
      if (!Utils.isSet(esgst.storage.templates)) {
        toSet.templates = LocalStorage.get('templates', '[]');
        LocalStorage.delete('templates');
      }
      if (!Utils.isSet(esgst.storage.stickiedCountries)) {
        toSet.stickiedCountries = LocalStorage.get('stickiedCountries', '[]');
        LocalStorage.delete('stickiedCountries');
      }
      if (Utils.isSet(esgst.storage.giveaways)) {
        esgst.giveaways = JSON.parse(esgst.storage.giveaways);
      } else {
        toSet.giveaways = LocalStorage.get('giveaways', '{}');
        esgst.giveaways = JSON.parse(toSet.giveaways);
        LocalStorage.delete('giveaways');
      }
      if (Utils.isSet(esgst.storage.decryptedGiveaways)) {
        esgst.decryptedGiveaways = esgst.storage.decryptedGiveaways;
        if (typeof esgst.decryptedGiveaways === 'string') {
          esgst.decryptedGiveaways = JSON.parse(esgst.decryptedGiveaways);
        } else {
          toSet.decryptedGiveaways = JSON.stringify(esgst.decryptedGiveaways);
        }
      } else {
        toSet.decryptedGiveaways = '{}';
        esgst.decryptedGiveaways = {};
      }
      if (Utils.isSet(esgst.storage.tickets)) {
        esgst.tickets = JSON.parse(esgst.storage.tickets);
      } else {
        toSet.tickets = LocalStorage.get('tickets', '{}');
        esgst.tickets = JSON.parse(toSet.tickets);
        LocalStorage.delete('tickets');
      }
      LocalStorage.delete('gFix');
      LocalStorage.delete('tFix');
      if (Utils.isSet(esgst.storage.groups)) {
        esgst.groups = JSON.parse(esgst.storage.groups);
      } else {
        toSet.groups = LocalStorage.get('groups', '[]');
        esgst.groups = JSON.parse(toSet.groups);
        LocalStorage.delete('groups');
      }
      Logger.info(`GROUP: `, esgst.groups.filter(group => group.steamId === '103582791454597143')[0]);
      if (!Utils.isSet(esgst.storage.entries)) {
        toSet.entries = LocalStorage.get('entries', '[]');
        LocalStorage.delete('entries');
      }
      if (Utils.isSet(esgst.storage.rerolls)) {
        esgst.rerolls = JSON.parse(esgst.storage.rerolls);
      } else {
        toSet.rerolls = LocalStorage.get('rerolls', '[]');
        esgst.rerolls = JSON.parse(toSet.rerolls);
        LocalStorage.delete('rerolls');
      }
      if (Utils.isSet(esgst.storage.winners)) {
        esgst.winners = JSON.parse(esgst.storage.winners);
      } else {
        toSet.winners = LocalStorage.get('winners', '{}');
        esgst.winners = JSON.parse(toSet.winners);
        LocalStorage.delete('winners');
      }
    }
    if (Utils.isSet(esgst.storage.discussions)) {
      esgst.discussions = JSON.parse(esgst.storage.discussions);
    } else {
      toSet.discussions = LocalStorage.get('discussions', '{}');
      esgst.discussions = JSON.parse(toSet.discussions);
      LocalStorage.delete('discussions');
    }
    if (Utils.isSet(esgst.storage.trades)) {
      esgst.trades = JSON.parse(esgst.storage.trades);
    } else {
      toSet.trades = LocalStorage.get('trades', '{}');
      esgst.trades = JSON.parse(toSet.trades);
      LocalStorage.delete('trades');
    }
    let cache = JSON.parse(LocalStorage.get('gdtttCache', `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`));
    for (let type in cache) {
      if (cache.hasOwnProperty(type)) {
        let doSet = false;
        cache[type].forEach(code => {
          if (!esgst[type][code]) {
            esgst[type][code] = {
              readComments: {}
            };
          }
          if (!esgst[type][code].visited) {
            doSet = true;
            esgst[type][code].visited = true;
          }
        });
        if (doSet) {
          toSet[type] = JSON.stringify(esgst[type]);
        }
      }
    }
    LocalStorage.set('gdtttCache', `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`);
    if (Utils.isSet(esgst.storage.games)) {
      esgst.games = JSON.parse(esgst.storage.games);
    } else {
      esgst.games = {
        apps: {},
        subs: {}
      };
      toSet.games = JSON.stringify(esgst.games);
    }
    if (Utils.isSet(esgst.storage.delistedGames)) {
      esgst.delistedGames = JSON.parse(esgst.storage.delistedGames);
    } else {
      esgst.delistedGames = {
        banned: [],
        removed: []
      };
      toSet.delistedGames = JSON.stringify(esgst.delistedGames);
    }
    if (Utils.isSet(esgst.storage.settings)) {
      esgst.settings = JSON.parse(esgst.storage.settings);
    } else {
      esgst.settings = {};
    }
    if (esgst.settings.hasOwnProperty('avatar_sg')) {
      delete esgst.settings.avatar_sg;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.hasOwnProperty('avatar_st')) {
      delete esgst.settings.avatar_st;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.hasOwnProperty('username')) {
      delete esgst.settings.username;
      esgst.settingsChanged = true;
    }

    esgst.features = common.getFeatures();
    esgst.featuresById = common.getFeaturesById();

    persistentStorage.upgrade(esgst.settings, esgst.storage.v);

    Settings.init();

    if (Utils.isSet(esgst.storage.filterPresets)) {
      const presets = Settings.get('gf_presets').concat(
        esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(esgst.storage.filterPresets))
      );
      Settings.set('gf_presets', presets);
      esgst.settings.gf_presets = presets;
      esgst.settingsChanged = true;
      toSet.old_gf_presets = esgst.storage.filterPresets;
      toDelete.push('filterPresets');
    }
    if (Utils.isSet(esgst.storage.dfPresets)) {
      const presets = Settings.get('df_presets').concat(
        esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(esgst.storage.dfPresets))
      );
      Settings.set('df_presets', presets);
      esgst.settings.df_presets = presets;
      esgst.settingsChanged = true;
      toSet.old_df_presets = esgst.storage.dfPresets;
      toDelete.push('dfPresets');
    }

    [
      {id: 'cec', side: 'left'},
      {id: 'esContinuous', side: 'right'},
      {id: 'esNext', side: 'right'},
      {id: 'glwc', side: 'left'},
      {id: 'mm', side: 'right'},
      {id: 'stbb', side: 'right'},
      {id: 'sttb', side: 'right'},
      {id: 'usc', side: 'left'},
      {id: 'ust', side: 'left'},
      {id: 'wbm', side: 'left'},
      {id: 'df_s_s', side: 'left'},
      {id: 'gf_s_s', side: 'left'},
      {id: 'tf_s_s', side: 'left'},
      {id: 'uf_s_s', side: 'left'},
      {id: 'gmf', side: 'left'}
    ].forEach(item => {
      if (Settings.get('leftButtonIds').indexOf(item.id) < 0 && Settings.get('rightButtonIds').indexOf(item.id) < 0 && Settings.get('leftMainPageHeadingIds').indexOf(item.id) < 0 && Settings.get('rightMainPageHeadingIds').indexOf(item.id) < 0) {
        Settings.get(`${item.side}MainPageHeadingIds`).push(item.id);
        esgst.settings[`${item.side}MainPageHeadingIds`] = Settings.get(`${item.side}MainPageHeadingIds`);
        esgst.settingsChanged = true;
      }
    });
    if (esgst.settings.users) {
      delete esgst.settings.users;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.comments) {
      delete esgst.settings.comments;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.giveaways) {
      delete esgst.settings.giveaways;
      esgst.settingsChanged = true;
    }
    if (esgst.settings.groups) {
      delete esgst.settings.groups;
      esgst.settingsChanged = true;
    }
    if (Settings.get('gc_categories_ids') && Settings.get('gc_categories_ids').indexOf('gc_f') < 0) {
      Settings.get('gc_categories_ids').push('gc_f');
      esgst.settings.gc_categories_ids = Settings.get('gc_categories_ids');
      esgst.settingsChanged = true;
    }
    if (Settings.get('gc_categories_ids') && Settings.get('gc_categories_ids').indexOf('gc_bvg') < 0) {
      Settings.get('gc_categories_ids').push('gc_bvg');
      esgst.settings.gc_categories_ids = Settings.get('gc_categories_ids');
      esgst.settingsChanged = true;
    }
    if (Settings.get('gc_categories_ids') && Settings.get('gc_categories_ids').indexOf('gc_bd') < 0) {
      Settings.get('gc_categories_ids').push('gc_bd');
      esgst.settings.gc_categories_ids = Settings.get('gc_categories_ids');
      esgst.settingsChanged = true;
    }
    ['gc_categories', 'gc_categories_gv', 'gc_categories_ids'].forEach(key => {
      if (!Settings.get(key)) {
        return;
      }
      let bkpLength = Settings.get(key).length;
      Settings.set(key, Array.from(new Set(Settings.get(key))));
      if (bkpLength !== Settings.get(key).length) {
        esgst.settings[key] = Settings.get(key);
        esgst.settingsChanged = true;
      }
    });
    if (Settings.get('elementOrdering') !== '1') {
      const oldLeftButtonIds = JSON.stringify(Settings.get('leftButtonIds'));
      const oldRightButtonIds = JSON.stringify(Settings.get('rightButtonIds'));
      const oldLeftMainPageHeadingIds = JSON.stringify(Settings.get('leftMainPageHeadingIds'));
      const oldRightMainPageHeadingIds = JSON.stringify(Settings.get('rightMainPageHeadingIds'));
      if (Settings.get('leftButtonIds')) {
        for (let i = Settings.get('leftButtonIds').length - 1; i > -1; i--) {
          const id = Settings.get('leftButtonIds')[i];
          if (!Settings.get(`hideButtons_${id}_sg`)) {
            if (Settings.get('leftMainPageHeadingIds')) {
              Settings.get('leftMainPageHeadingIds').push(id);
            }
            Settings.get('leftButtonIds').splice(i, 1);
          } else if (Settings.get('rightButtonsIds') && Settings.get('rightButtonIds').indexOf(id) > -1) {
            Settings.get('leftButtonIds').splice(i, 1);
          }
        }
      }
      if (Settings.get('rightButtonIds')) {
        for (let i = Settings.get('rightButtonIds').length - 1; i > -1; i--) {
          const id = Settings.get('rightButtonIds')[i];
          if (!Settings.get(`hideButtons_${id}_sg`)) {
            if (Settings.get('rightMainPageHeadingIds')) {
              Settings.get('rightMainPageHeadingIds').push(id);
            }
            Settings.get('rightButtonIds').splice(i, 1);
          } else if (Settings.get('rightButtonIds') && Settings.get('rightButtonIds').indexOf(id) > -1) {
            Settings.get('rightButtonIds').splice(i, 1);
          }
        }
      }
      if (Settings.get('leftMainPageHeadingIds')) {
        for (let i = Settings.get('leftMainPageHeadingIds').length - 1; i > -1; i--) {
          const id = Settings.get('leftMainPageHeadingIds')[i];
          if (!Settings.get(`hideButtons_${id}_sg`)) {
            if (Settings.get('leftButtonIds')) {
              Settings.get('leftButtonIds').push(id);
            }
            Settings.get('leftMainPageHeadingIds').splice(i, 1);
          } else if (Settings.get('rightMainPageHeadingIds') && Settings.get('rightMainPageHeadingIds').indexOf(id) > -1) {
            Settings.get('leftMainPageHeadingIds').splice(i, 1);
          }
        }
      }
      if (Settings.get('rightMainPageHeadingIds')) {
        for (let i = Settings.get('rightMainPageHeadingIds').length - 1; i > -1; i--) {
          const id = Settings.get('rightMainPageHeadingIds')[i];
          if (!Settings.get(`hideButtons_${id}_sg`)) {
            if (Settings.get('rightButtonIds')) {
              Settings.get('rightButtonIds').push(id);
            }
            Settings.get('rightMainPageHeadingIds').splice(i, 1);
          } else if (Settings.get('leftMainPageHeadingIds') && Settings.get('leftMainPageHeadingIds').indexOf(id) > -1) {
            Settings.get('rightMainPageHeadingIds').splice(i, 1);
          }
        }
      }
      Settings.set('leftButtonIds', Array.from(new Set(Settings.get('leftButtonIds'))));
      Settings.set('rightButtonIds', Array.from(new Set(Settings.get('rightButtonIds'))));
      Settings.set('leftMainHeadingIds', Array.from(new Set(Settings.get('leftMainPageHeadingIds'))));
      Settings.set('rightMainHeadingIds', Array.from(new Set(Settings.get('rightMainPageHeadingIds'))));
      if (oldLeftButtonIds !== JSON.stringify(Settings.get('leftButtonIds'))) {
        esgst.settings.leftButtonIds = Settings.get('leftButtonIds');
      }
      if (oldRightButtonIds !== JSON.stringify(Settings.get('rightButtonIds'))) {
        esgst.settings.rightButtonIds = Settings.get('rightButtonIds');
      }
      if (oldLeftMainPageHeadingIds !== JSON.stringify(Settings.get('leftMainHeadingIds'))) {
        esgst.settings.leftMainPageHeadingIds = Settings.get('leftMainHeadingIds');
      }
      if (oldRightMainPageHeadingIds !== JSON.stringify(Settings.get('rightMainHeadingIds'))) {
        esgst.settings.rightMainPageHeadingIds = Settings.get('rightMainHeadingIds');
      }
      Settings.set('elementOrdering', '1');
      esgst.settings.elementOrdering = '1';
      esgst.settingsChanged = true;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', load.bind(null, toDelete, toSet));
    } else {
      // noinspection JSIgnoredPromiseFromCall
      load(toDelete, toSet);
    }
  }

  async function load(toDelete, toSet) {
    esgst.bodyLoaded = true;

    esgst.mainPageHeadingSize = 35;
    if (esgst.sg) {
      esgst.headerSize = 39;
      esgst.footerSize = 44;
    } else {
      if (Settings.get('fh')) {
        esgst.headerSize = 231;
      }
      esgst.headerSize = Settings.get('fh') ? 231 : 454;
      esgst.footerSize = Settings.get('ff') ? 44 : 64;
    }
    esgst.pageTop = Settings.get('fh') ? esgst.headerSize : 5;
    esgst.commentsTop = esgst.pageTop + (Settings.get('fmph') ? esgst.mainPageHeadingSize : 0) + 10;

    addStyle();

    if (esgst.sg) {
      try {
        let avatar = document.getElementsByClassName('nav__avatar-inner-wrap')[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.getElementsByClassName('nav__avatar-outer-wrap')[0].href.match(/\/user\/(.+)/)[1];
        if (esgst.settings.username_sg !== username) {
          esgst.settings.username_sg = username;
          esgst.settingsChanged = true;
        }
        if (!esgst.settings.registrationDate_sg || !esgst.settings.steamId) {
          let responseHtml = DOM.parse((await common.request({
            method: 'GET',
            url: `https://www.steamgifts.com/user/${esgst.settings.username_sg}`
          })).responseText);
          let elements = responseHtml.getElementsByClassName('featured__table__row__left');
          for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            if (element.textContent === 'Registered') {
              esgst.settings.registrationDate_sg = parseInt(element.nextElementSibling.firstElementChild.getAttribute('data-timestamp'));
              break;
            }
          }
          esgst.settings.steamId = responseHtml.querySelector(`a[href*="/profiles/"]`).getAttribute('href').match(/\d+/)[0];
          esgst.settingsChanged = true;
        }
      } catch (e) { /**/
      }
    } else {
      try {
        let avatar = document.getElementsByClassName('nav_avatar')[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.querySelector(`.author_name[href*="/user/${esgst.settings.steamId}"], .underline[href*="/user/${esgst.settings.steamId}"]`).textContent;
        if (esgst.settings.username_st !== username) {
          esgst.settings.username_st = username;
          esgst.settingsChanged = true;
        }
      } catch (e) { /**/
      }
    }
    if (esgst.settingsChanged) {
      toSet.settings = JSON.stringify(esgst.settings);
    }
    if (Object.keys(toSet).length) {
      await common.setValues(toSet);
    }
    if (Object.keys(toDelete).length) {
      await common.delValues(toDelete);
    }

    // now that all values are set esgst can begin to load

    /* [URLR] URL Redirector */
    if (Settings.get('urlr') && window.location.pathname.match(/^\/(giveaway|discussion|support\/ticket|trade)\/.{5}$/)) {
      window.location.href = `${window.location.href}/`;
    }

    for (const key in esgst.paths) {
      for (const item of esgst.paths[key]) {
        item.pattern = item.pattern
          .replace(/%steamId%/, Settings.get('steamId'));
      }
    }

    esgst.currentPaths = [];
    const effectivePath = common.getPath(window.location.href);
    for (const pathObj of esgst.paths[esgst.name]) {
      if (effectivePath.match(pathObj.pattern)) {
        esgst.currentPaths.push(pathObj.name);
      }
    }

    if (common.isCurrentPath('Account')) {
      if (window.location.href.match(/state=dropbox/)) {
        await common.setValue('dropboxToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
        window.close();
      } else if (window.location.href.match(/state=google-drive/)) {
        await common.setValue('googleDriveToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
        window.close();
      } else if (window.location.href.match(/state=onedrive/)) {
        await common.setValue('oneDriveToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
        window.close();
      } else if (window.location.href.match(/state=imgur/)) {
        await common.setValue('imgurToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
        window.close();
      }
    }

    Session.init();

    try {
      Shared.header = new Header();
      Shared.header.parse(document.body);

      Shared.footer = new Footer();
      Shared.footer.parse(document.body);
    } catch (e) {
      Logger.error(e.message);
    }

    if (!Session.isLoggedIn) {
      return;
    }

    if (esgst.st && !Settings.get('esgst_st')) {
      // esgst is not enabled for steamtrades
      return;
    }
    esgst.lastPage = esgst.modules.generalLastPageLink.lpl_getLastPage(document, true);
    await common.getElements();
    if (esgst.sg) {
      // noinspection JSIgnoredPromiseFromCall
      common.checkSync();
    }
    if (Settings.get('autoBackup')) {
      common.checkBackup();
    }
    if (esgst.profilePath && Settings.get('autoSync')) {
      const el = document.getElementsByClassName('form__sync-default')[0];
      if (el) {
        el.addEventListener('click', () => runSilentSync(`Games=1&Groups=1`));
      }
    }

    await common.addHeaderMenu();

    common.checkNewVersion(esgst.isFirstRun, esgst.isUpdate);
    esgst.isFirstRun = false;
    esgst.isUpdate = false;

    await common.loadFeatures(esgst.modules);
  }

  // noinspection JSIgnoredPromiseFromCall
  init();
})();
