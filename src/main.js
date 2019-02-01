`use strict`;

// that will append styles to page in runtime
import './assets/css';

import 'jquery';

// jQuery QueryBuilder want global interact object
import interact from 'interactjs/dist/interact.min';

window.interact = interact;

import 'jQuery-QueryBuilder/dist/js/query-builder.standalone.min';

import browser from './browser';

import {utils} from './lib/jsUtils';
import esgst from './class/Esgst';

import { addStyle } from './modules/Style';
import { runSilentSync } from './modules/Sync';

(() => {
  const
    common = esgst.modules.common
  ;

  if (!window.NodeList.prototype[Symbol.iterator]) {
    window.NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

  if (!window.HTMLCollection.prototype[Symbol.iterator]) {
    window.HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  }

  const theme = common.getLocalValue(`theme`);
  if (theme) {
    const style = document.createElement(`style`);
    style.id = `esgst-theme`;
    style.textContent = theme;
    document.documentElement.appendChild(style);
  }
  const customTheme = common.getLocalValue(`customTheme`);
  if (customTheme) {
    const style = document.createElement(`style`);
    style.id = `esgst-custom-theme`;
    style.textContent = customTheme;
    document.documentElement.appendChild(style);
  }

  // initialize esgst
  async function init() {
    if (document.getElementById(`esgst`)) {
      // esgst is already running
      return;
    }
    
    esgst.markdownParser.setBreaksEnabled(true);
    esgst.markdownParser.setMarkupEscaped(true);
    esgst.name = esgst.sg ? `sg` : `st`;

    browser.runtime.onMessage.addListener(message => {
      let key;
      message = JSON.parse(message);
      switch (message.action) {
        case `delValues`:
          message.values.forEach(value => delete esgst.storage[value]);
          break;
        case `setValues`:
          for (key in message.values) {
            if (message.values.hasOwnProperty(key)) {
              esgst.storage[key] = message.values[key];
            }
          }
          break;
        case `update`:
          common.createConfirmation(
            `Hi! A new version of ESGST (${message.values.version}) is available. Do you want to force an update now? If you choose to force an update, ESGST will stop working in any SteamGifts/SteamTrades tab that is open, along with any operation that you might be performing (such as syncing, checking something etc), so you will have to refresh them. If you choose not to force an update, your browser will automatically update the extension when you are not using it (for example, when you restart the browser).`,
            () => {
              browser.runtime.sendMessage({ action: `reload` }).then(() => {})
            },
            () => {}
          );
          break;
      }
    });

    let toDelete, toSet;

    // set default values or correct values
    /**
     * @property {object} esgst.storage.Emojis
     * @property {object} esgst.storage.filterPresets
     * @property {object} esgst.storage.dfPresets
     */
    esgst.storage = await getStorage();
    toDelete = [];
    toSet = {};
    if (utils.isSet(esgst.storage.users)) {
      esgst.users = JSON.parse(esgst.storage.users);
      let changed = false;
      for (let key in esgst.users.users) {
        if (esgst.users.users.hasOwnProperty(key)) {
          let wbc = esgst.users.users[key].wbc;
          if (wbc && wbc.result && wbc.result !== `whitelisted` && wbc.result !== `blacklisted`) {
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
    if (!utils.isSet(esgst.storage[`${esgst.name}RfiCache`])) {
      toSet[`${esgst.name}RfiCache`] = common.getLocalValue(`replies`, `{}`);
      common.delLocalValue(`replies`);
    }
    if (utils.isSet(esgst.storage.emojis)) {
      const fixed = common.fixEmojis(esgst.storage.emojis);
      if (esgst.storage.emojis !== fixed) {
        toSet.emojis = fixed;
      } else if (!esgst.storage.emojis) {
        toSet.emojis = `[]`;
      }
    } else {
      toSet.emojis = utils.isSet(esgst.storage.Emojis) ? common.fixEmojis(esgst.storage.Emojis) : `[]`;
      toDelete.push(`Emojis`);
    }
    esgst.emojis = JSON.parse(toSet.emojis || esgst.storage.emojis);
    if (esgst.sg) {
      if (!utils.isSet(esgst.storage.templates)) {
        toSet.templates = common.getLocalValue(`templates`, `[]`);
        common.delLocalValue(`templates`);
      }
      if (!utils.isSet(esgst.storage.stickiedCountries)) {
        toSet.stickiedCountries = common.getLocalValue(`stickiedCountries`, `[]`);
        common.delLocalValue(`stickiedCountries`);
      }
      if (utils.isSet(esgst.storage.giveaways)) {
        esgst.giveaways = JSON.parse(esgst.storage.giveaways);
      } else {
        toSet.giveaways = common.getLocalValue(`giveaways`, `{}`);
        esgst.giveaways = JSON.parse(toSet.giveaways);
        common.delLocalValue(`giveaways`);
      }
      if (utils.isSet(esgst.storage.decryptedGiveaways)) {
        esgst.decryptedGiveaways = esgst.storage.decryptedGiveaways;
        if (typeof esgst.decryptedGiveaways === `string`) {
          esgst.decryptedGiveaways = JSON.parse(esgst.decryptedGiveaways);
        } else {
          toSet.decryptedGiveaways = JSON.stringify(esgst.decryptedGiveaways);
        }
      } else {
        toSet.decryptedGiveaways = `{}`;
        esgst.decryptedGiveaways = {};
      }
      if (utils.isSet(esgst.storage.discussions)) {
        esgst.discussions = JSON.parse(esgst.storage.discussions);
      } else {
        toSet.discussions = common.getLocalValue(`discussions`, `{}`);
        esgst.discussions = JSON.parse(toSet.discussions);
        common.delLocalValue(`discussions`);
      }
      if (utils.isSet(esgst.storage.tickets)) {
        esgst.tickets = JSON.parse(esgst.storage.tickets);
      } else {
        toSet.tickets = common.getLocalValue(`tickets`, `{}`);
        esgst.tickets = JSON.parse(toSet.tickets);
        common.delLocalValue(`tickets`);
      }
      common.delLocalValue(`gFix`);
      common.delLocalValue(`dFix`);
      common.delLocalValue(`tFix`);
      if (utils.isSet(esgst.storage.groups)) {
        esgst.groups = JSON.parse(esgst.storage.groups);
      } else {
        toSet.groups = common.getLocalValue(`groups`, `[]`);
        esgst.groups = JSON.parse(toSet.groups);
        common.delLocalValue(`groups`);
      }
      if (!utils.isSet(esgst.storage.entries)) {
        toSet.entries = common.getLocalValue(`entries`, `[]`);
        common.delLocalValue(`entries`);
      }
      if (utils.isSet(esgst.storage.rerolls)) {
        esgst.rerolls = JSON.parse(esgst.storage.rerolls);
      } else {
        toSet.rerolls = common.getLocalValue(`rerolls`, `[]`);
        esgst.rerolls = JSON.parse(toSet.rerolls);
        common.delLocalValue(`rerolls`);
      }
      if (utils.isSet(esgst.storage.winners)) {
        esgst.winners = JSON.parse(esgst.storage.winners);
      } else {
        toSet.winners = common.getLocalValue(`winners`, `{}`);
        esgst.winners = JSON.parse(toSet.winners);
        common.delLocalValue(`winners`);
      }
    } else {
      if (utils.isSet(esgst.storage.trades)) {
        esgst.trades = JSON.parse(esgst.storage.trades);
      } else {
        toSet.trades = common.getLocalValue(`trades`, `{}`);
        esgst.trades = JSON.parse(toSet.trades);
        common.delLocalValue(`trades`);
      }
      common.delLocalValue(`tFix`);
    }
    let cache = JSON.parse(common.getLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`));
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
    common.setLocalValue(`gdtttCache`, `{"giveaways":[],"discussions":[],"tickets":[],"trades":[]}`);
    if (utils.isSet(esgst.storage.games)) {
      esgst.games = JSON.parse(esgst.storage.games);
    } else {
      esgst.games = {
        apps: {},
        subs: {}
      };
      toSet.games = JSON.stringify(esgst.games);
    }
    if (utils.isSet(esgst.storage.delistedGames)) {
      esgst.delistedGames = JSON.parse(esgst.storage.delistedGames);
    } else {
      esgst.delistedGames = {
        banned: [],
        removed: []
      };
      toSet.delistedGames = JSON.stringify(esgst.delistedGames);
    }
    if (utils.isSet(esgst.storage.settings)) {
      esgst.settings = JSON.parse(esgst.storage.settings);
    } else {
      esgst.settings = {};
    }
    for (let key in esgst.settings) {
      let match = key.match(new RegExp(`(.+?)_${esgst.name}$`));
      if (match) {
        esgst[match[1]] = esgst.settings[key];
      }
    }
    for (let key in esgst.oldValues) {
      if (esgst.oldValues.hasOwnProperty(key)) {
        let localKey = key.replace(new RegExp(`(.+?)_${esgst.name}$`), `$1`);
        if (typeof esgst[localKey] === `undefined`) {
          esgst[localKey] = common.getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
        }
      }
    }
    for (let key in esgst.defaultValues) {
      if (esgst.defaultValues.hasOwnProperty(key)) {
        let localKey = key.replace(new RegExp(`(.+?)_${esgst.name}$`), `$1`);
        if (!utils.isSet(esgst[localKey])) {
          esgst[localKey] = common.getSetting(key, key.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/));
        }
      }
    }
    if (utils.isSet(esgst.storage.filterPresets)) {
      esgst.gf_presets = esgst.gf_presets.concat(
        esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(esgst.storage.filterPresets))
      );
      esgst.settings.gf_presets = esgst.gf_presets;
      esgst.settingsChanged = true;
      toSet.old_gf_presets = esgst.storage.filterPresets;
      toDelete.push(`filterPresets`);
    }
    if (utils.isSet(esgst.storage.dfPresets)) {
      esgst.df_presets = esgst.df_presets.concat(
        esgst.modules.giveawaysGiveawayFilters.filters_convert(JSON.parse(esgst.storage.dfPresets))
      );
      esgst.settings.df_presets = esgst.df_presets;
      esgst.settingsChanged = true;
      toSet.old_df_presets = esgst.storage.dfPresets;
      toDelete.push(`dfPresets`);
    }

    esgst.features = common.getFeatures();
    for (let type in esgst.features) {
      if (esgst.features.hasOwnProperty(type)) {
        for (let id in esgst.features[type].features) {
          if (esgst.features[type].features.hasOwnProperty(id)) {
            common.dismissFeature(esgst.features[type].features[id], id);
            common.getFeatureSetting(esgst.features[type].features[id], id);
          }
        }
      }
    }

    [
      {id: `cec`, side: `left`},
      {id: `esContinuous`, side: `right`},
      {id: `esNext`, side: `right`},
      {id: `glwc`, side: `left`},
      {id: `mm`, side: `right`},
      {id: `stbb`, side: `right`},
      {id: `sttb`, side: `right`},
      {id: `ust`, side: `left`},
      {id: `wbm`, side: `left`}
    ].forEach(item => {
      if (esgst.leftButtonIds.indexOf(item.id) < 0 && esgst.rightButtonIds.indexOf(item.id) < 0 && esgst.leftMainPageHeadingIds.indexOf(item.id) < 0 && esgst.rightMainPageHeadingIds.indexOf(item.id) < 0) {
        esgst[`${item.side}MainPageHeadingIds`].push(item.id);
        esgst.settings.leftMainPageHeadingIds = esgst.leftMainPageHeadingIds;
        esgst.settings.rightMainPageHeadingIds = esgst.rightMainPageHeadingIds;
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
    if (esgst.gc_categories_ids.indexOf(`gc_f`) < 0) {
      esgst.gc_categories_ids.push(`gc_f`);
      esgst.settings.gc_categories_ids = esgst.gc_categories_ids;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_ids.indexOf(`gc_bvg`) < 0) {
      esgst.gc_categories_ids.push(`gc_bvg`);
      esgst.settings.gc_categories_ids = esgst.gc_categories_ids;
      esgst.settingsChanged = true;
    }
    if (esgst.gc_categories_ids.indexOf(`gc_bd`) < 0) {
      esgst.gc_categories_ids.push(`gc_bd`);
      esgst.settings.gc_categories_ids = esgst.gc_categories_ids;
      esgst.settingsChanged = true;
    }
    [`gc_categories`, `gc_categories_gv`, `gc_categories_ids`].forEach(key => {
      let bkpLength = esgst[key].length;
      esgst[key] = Array.from(new Set(esgst[key]));
      if (bkpLength !== esgst[key].length) {
        esgst.settings[key] = esgst[key];
        esgst.settingsChanged = true;
      }
    });
    if (esgst.settings.elementOrdering !== `1`) {
      const oldLeftButtonIds = JSON.stringify(esgst.leftButtonIds);
      const oldRightButtonIds = JSON.stringify(esgst.rightButtonIds);
      const oldLeftMainPageHeadingIds = JSON.stringify(esgst.leftMainPageHeadingIds);
      const oldRightMainPageHeadingIds = JSON.stringify(esgst.rightMainPageHeadingIds);
      for (let i = esgst.leftButtonIds.length - 1; i > -1; i--) {
        const id = esgst.leftButtonIds[i];
        if (!esgst.settings[`hideButtons_${id}_sg`]) {
          esgst.leftMainPageHeadingIds.push(id);
          esgst.leftButtonIds.splice(i, 1);
        } else if (esgst.rightButtonIds.indexOf(id) > -1) {
          esgst.leftButtonIds.splice(i, 1);
        }
      }
      for (let i = esgst.rightButtonIds.length - 1; i > -1; i--) {
        const id = esgst.rightButtonIds[i];
        if (!esgst.settings[`hideButtons_${id}_sg`]) {
          esgst.rightMainPageHeadingIds.push(id);
          esgst.rightButtonIds.splice(i, 1);
        } else if (esgst.leftButtonIds.indexOf(id) > -1) {
          esgst.rightButtonIds.splice(i, 1);
        }
      }
      for (let i = esgst.leftMainPageHeadingIds.length - 1; i > -1; i--) {
        const id = esgst.leftMainPageHeadingIds[i];
        if (esgst.settings[`hideButtons_${id}_sg`]) {
          esgst.leftButtonIds.push(id);
          esgst.leftMainPageHeadingIds.splice(i, 1);
        } else if (esgst.rightMainPageHeadingIds.indexOf(id) > -1) {
          esgst.leftMainPageHeadingIds.splice(i, 1);
        }
      }
      for (let i = esgst.rightMainPageHeadingIds.length - 1; i > -1; i--) {
        const id = esgst.rightMainPageHeadingIds[i];
        if (esgst.settings[`hideButtons_${id}_sg`]) {
          esgst.rightButtonIds.push(id);
          esgst.rightMainPageHeadingIds.splice(i, 1);
        } else if (esgst.leftMainPageHeadingIds.indexOf(id) > -1) {
          esgst.rightMainPageHeadingIds.splice(i, 1);
        }
      }
      esgst.leftButtonIds = Array.from(/** @type {ArrayLike} **/ new Set(esgst.leftButtonIds));
      esgst.rightButtonIds = Array.from(/** @type {ArrayLike} **/ new Set(esgst.rightButtonIds));
      esgst.leftMainPageHeadingIds = Array.from(new Set(esgst.leftMainPageHeadingIds));
      esgst.rightMainPageHeadingIds = Array.from(new Set(esgst.rightMainPageHeadingIds));
      if (oldLeftButtonIds !== JSON.stringify(esgst.leftButtonIds)) {
        esgst.settings.leftButtonIds = esgst.leftButtonIds;
      }
      if (oldRightButtonIds !== JSON.stringify(esgst.rightButtonIds)) {
        esgst.settings.rightButtonIds = esgst.rightButtonIds;
      }
      if (oldLeftMainPageHeadingIds !== JSON.stringify(esgst.leftMainPageHeadingIds)) {
        esgst.settings.leftMainPageHeadingIds = esgst.leftMainPageHeadingIds;
      }
      if (oldRightMainPageHeadingIds !== JSON.stringify(esgst.rightMainPageHeadingIds)) {
        esgst.settings.rightMainPageHeadingIds = esgst.rightMainPageHeadingIds;
      }
      esgst.settings.elementOrdering = `1`;
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
    addStyle();
    if (esgst.sg) {
      try {
        let avatar = document.getElementsByClassName(`nav__avatar-inner-wrap`)[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.avatar = esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.getElementsByClassName(`nav__avatar-outer-wrap`)[0].href.match(/\/user\/(.+)/)[1];
        if (esgst.settings.username_sg !== username) {
          esgst.username = esgst.settings.username_sg = username;
          esgst.settingsChanged = true;
        }
        if (!esgst.settings.registrationDate_sg || !esgst.settings.steamId) {
          let responseHtml = utils.parseHtml((await common.request({
            method: `GET`,
            url: `https://www.steamgifts.com/user/${esgst.settings.username_sg}`
          })).responseText);
          let elements = responseHtml.getElementsByClassName(`featured__table__row__left`);
          for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            if (element.textContent === `Registered`) {
              esgst.registrationDate = esgst.settings.registrationDate_sg = parseInt(element.nextElementSibling.firstElementChild.getAttribute(`data-timestamp`));
              break;
            }
          }
          esgst.steamId = esgst.settings.steamId = responseHtml.querySelector(`a[href*="/profiles/"]`).getAttribute(`href`).match(/\d+/)[0];
          esgst.settingsChanged = true;
        }
      } catch (e) { /**/
      }
    } else {
      try {
        let avatar = document.getElementsByClassName(`nav_avatar`)[0].style.backgroundImage.match(/\("(.+)"\)/)[1];
        if (esgst.settings.avatar !== avatar) {
          esgst.avatar = esgst.settings.avatar = avatar;
          esgst.settingsChanged = true;
        }
        let username = document.querySelector(`.author_name[href*="/user/${esgst.settings.steamId}"], .underline[href*="/user/${esgst.settings.steamId}"]`).textContent;
        if (esgst.settings.username_st !== username) {
          esgst.username = esgst.settings.username_st = username;
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
    if (esgst.urlr && window.location.pathname.match(/^\/(giveaway|discussion|support\/ticket|trade)\/.{5}$/)) {
      window.location.href = `${window.location.href}/`;
    }

    if (esgst.accountPath && window.location.href.match(/state=dropbox/)) {
      await common.setValue(`dropboxToken`, window.location.hash.match(/access_token=(.+?)&/)[1]);
      window.close();
    } else if (esgst.accountPath && window.location.href.match(/state=google-drive/)) {
      await common.setValue(`googleDriveToken`, window.location.hash.match(/access_token=(.+?)&/)[1]);
      window.close();
    } else if (esgst.accountPath && window.location.href.match(/state=onedrive/)) {
      await common.setValue(`oneDriveToken`, window.location.hash.match(/access_token=(.+?)&/)[1]);
      window.close();
    } else if (esgst.accountPath && window.location.href.match(/state=imgur/)) {
      await common.setValue(`imgurToken`, window.location.hash.match(/access_token=(.+?)&/)[1]);
      window.close();
    } else {
      esgst.logoutButton = document.querySelector(`.js__logout, .js_logout`);
      if (!esgst.logoutButton) {
        // user is not logged in
        return;
      }
      if (esgst.st && !esgst.settings.esgst_st) {
        // esgst is not enabled for steamtrades
        return;
      }
      esgst.lastPage = esgst.modules.generalLastPageLink.lpl_getLastPage(document, true);
      await common.getElements();
      if (esgst.sg) {
        // noinspection JSIgnoredPromiseFromCall
        common.checkSync();
      }
      if (esgst.autoBackup) {
        common.checkBackup();
      }
      if (esgst.profilePath && esgst.autoSync) {
        const el = document.getElementsByClassName(`form__sync-default`)[0];
        if (el) {
          el.addEventListener(`click`, () => runSilentSync(`Games=1&Groups=1`));
        }
      }

      await common.addHeaderMenu();
      common.checkNewVersion();
      await common.loadFeatures(esgst.modules);
    }
  }
  
  function getStorage() {
    return new Promise(resolve =>
      browser.runtime.sendMessage({
        action: `getStorage`
      }).then(storage => resolve(JSON.parse(storage)))
    );
  }

  // noinspection JSIgnoredPromiseFromCall
  init();
})();
