import { ButtonSet } from '../class/ButtonSet';
import { Checkbox } from '../class/Checkbox';
import { Popup } from '../class/Popup';
import { Shared } from '../class/Shared';
import { elementBuilder } from '../lib/SgStUtils/ElementBuilder';
import { Settings } from '../class/Settings';
import { permissions } from '../class/Permissions';
import { Logger } from '../class/Logger';
import { DOM } from '../class/DOM';
import { LocalStorage } from '../class/LocalStorage';

let toSave = {};

const SYNC_KEYS = {
  syncGroups: {
    dependencies: [],
    key: 'Groups',
    name: 'Groups'
  },
  syncWhitelist: {
    dependencies: [],
    key: 'Whitelist',
    name: 'Whitelist'
  },
  syncBlacklist: {
    dependencies: [],
    key: 'Blacklist',
    name: 'Blacklist'
  },
  syncSteamFriends: {
    dependencies: [],
    key: 'SteamFriends',
    name: `Steam Friends (requires Steam API key)`
  },
  syncHiddenGames: {
    dependencies: [],
    key: 'HiddenGames',
    name: 'Hidden Games'
  },
  syncGames: {
    dependencies: [],
    key: 'Games',
    name: 'Owned/Wishlisted/Ignored Games'
  },
  syncFollowedGames: {
    dependencies: [],
    key: 'FollowedGames',
    name: 'Followed Games'
  },
  syncWonGames: {
    dependencies: [],
    key: 'WonGames',
    name: 'Won Games'
  },
  syncReducedCvGames: {
    dependencies: [],
    key: 'ReducedCvGames',
    name: 'Reduced CV Games'
  },
  syncNoCvGames: {
    dependencies: [],
    key: 'NoCvGames',
    name: 'No CV Games'
  },
  syncHltbTimes: {
    dependencies: [],
    key: 'HltbTimes',
    name: 'HLTB Times'
  },
  syncDelistedGames: {
    dependencies: [],
    key: 'DelistedGames',
    name: 'Delisted Games'
  },
  syncGiveaways: {
    dependencies: [],
    key: 'Giveaways',
    name: 'Giveaways'
  },
  syncWonGiveaways: {
    dependencies: [],
    key: 'WonGiveaways',
    name: 'Won Giveaways'
  }
};

async function runSilentSync(parameters) {
  const button = Shared.header.addButtonContainer({
    buttonIcon: 'fa fa-refresh fa-spin',
    buttonName: 'ESGST Sync',
    isActive: true,
    isNotification: true,
    side: 'right',
  });

  button.nodes.buttonIcon.title = 'ESGST is syncing your data... Please do not close this window.';

  Shared.esgst.parameters = Object.assign(Shared.esgst.parameters, Shared.common.getParameters(`?autoSync=true&${parameters.replace(/&$/, '')}`));
  const syncer = await setSync(false, true);
  button.nodes.outer.addEventListener('click', () => syncer.popup.open());
  Shared.esgst.isSyncing = true;
  await sync(syncer);
  Shared.esgst.isSyncing = false;

  button.nodes.outer.classList.remove('nav__button-container--active');
  button.nodes.outer.classList.add('nav__button-container--inactive');
  button.nodes.buttonIcon.className = 'fa fa-check';
  button.nodes.buttonIcon.title = 'ESGST has finished syncing, click here to see the results.';
}

function getDependencies(syncer, feature, id) {
  if (feature.syncKeys) {
    for (const key of feature.syncKeys) {
      syncer.switchesKeys[`sync${key}`].dependencies.push(id);
    }
  }
  if (feature.features) {
    for (const subId in feature.features) {
      getDependencies(syncer, feature.features[subId], subId);
    }
  }
}

/**
 * @returns {Promise<Object>}
 */
async function setSync(isPopup = false, isSilent = false) {
  let syncer = {};
  syncer.canceled = false;
  syncer.isSilent = isSilent || Shared.esgst.firstInstall;
  if (Shared.esgst.parameters.autoSync) {
    syncer.parameters = Shared.esgst.parameters;
  }
  let containerr = null;
  let context = null;
  let popup = null;
  if (isPopup || syncer.isSilent) {
    syncer.popup = popup = new Popup({
      addScrollable: 'left',
      settings: true
    });
    containerr = popup.description;
    context = popup.scrollable;
    if (!Shared.esgst.firstInstall && (!syncer.isSilent || Settings.openAutoSyncPopup)) {
      popup.open();
    }
  } else {
    containerr = context = Shared.esgst.sidebar.nextElementSibling;
    containerr.innerHTML = '';
    context.setAttribute('data-esgst-popup', 'true');
  }
  const heading = new elementBuilder[Shared.esgst.name].pageHeading({
    context: containerr,
    position: 'afterBegin',
    breadcrumbs: [
      {
        name: 'ESGST',
        url: Shared.esgst.settingsUrl
      },
      {
        name: 'Sync',
        url: Shared.esgst.syncUrl
      }
    ]
  }).pageHeading;
  if (!isPopup && !syncer.isSilent) {
    Shared.esgst.mainPageHeading = heading;
  }
  if (syncer.isSilent) {
    syncer.area = DOM.build(context, 'beforeEnd', [['div']]);
  } else {
    DOM.build(context, 'beforeEnd', [
      ['div', { class: 'esgst-menu-split' }, [
        ['div', { class: 'esgst-sync-options' }],
        ['div', { class: 'esgst-sync-area' }]
      ]]
    ]);
    context.appendChild(new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: '',
      icon2: '',
      title1: 'Save Changes',
      title2: 'Saving...',
      callback1: async () => {
        await Shared.common.lockAndSaveSettings(toSave);
        toSave = {};
        if (isPopup) {
          popup.close();
        } else {
          window.location.reload();
        }
      }
    }).set);
    syncer.container = context.querySelector('.esgst-sync-options');
    syncer.area = context.querySelector('.esgst-sync-area');
    syncer.notificationArea = DOM.build(syncer.area, 'beforeEnd', [['div']]);
    syncer.manual = {
      check: true,
      content: [],
      name: 'Manual'
    };
    syncer.automatic = {
      check: true,
      content: [],
      name: 'Automatic'
    };
    syncer.switchesKeys = SYNC_KEYS;
    syncer.switches = {};
    for (const type in Shared.esgst.features) {
      for (const id in Shared.esgst.features[type].features) {
        getDependencies(syncer, Shared.esgst.features[type].features[id], id);
      }
    }
    for (let id in syncer.switchesKeys) {
      if (syncer.switchesKeys.hasOwnProperty(id)) {
        const info = syncer.switchesKeys[id];
        const checkbox = new Checkbox(null, Settings[id]);
        checkbox.onChange = () => {
          toSave[`sync${info.key}`] = checkbox.value;
          Settings[`sync${info.key}`] = checkbox.value;
        };
        syncer.switches[id] = checkbox;
        syncer.manual.content.push(
          ['div', [
            ['i', { class: 'fa fa-question-circle', title: `This is required for the following features:\n\n${info.dependencies.map(x => Shared.common.getFeatureName(null, x)).join('\n')}` }],
            ' ',
            checkbox.checkbox,
            ' ',
            ['span', info.name]
          ]]
        );
        setAutoSync(info.key, info.name, syncer);
        Shared.common.createFormNotification(syncer.notificationArea, 'beforeEnd', {
          name: info.name,
          success: !!Settings[`lastSync${info.key}`],
          date: Settings[`lastSync${info.key}`]
        });
      }
    }
    syncer.set = new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-refresh',
      icon2: 'fa-times',
      title1: 'Sync',
      title2: 'Cancel',
      callback1: sync.bind(null, syncer),
      callback2: cancelSync.bind(null, syncer)
    });
    syncer.manual.content.push(
      ['div', { class: 'esgst-button-group' }, [
        ['span', `Select:`],
        new ButtonSet({
          color1: 'grey',
          color2: 'grey',
          icon1: 'fa-square',
          icon2: 'fa-circle-o-notch fa-spin',
          title1: 'All',
          title2: '',
          callback1: Shared.common.selectSwitches.bind(Shared.common, syncer.switches, 'check', null)
        }).set,
        new ButtonSet({
          color1: 'grey',
          color2: 'grey',
          icon1: 'fa-square-o',
          icon2: 'fa-circle-o-notch fa-spin',
          title1: 'None',
          title2: '',
          callback1: Shared.common.selectSwitches.bind(Shared.common, syncer.switches, 'uncheck', null)
        }).set,
        new ButtonSet({
          color1: 'grey',
          color2: 'grey',
          icon1: 'fa-plus-square-o',
          icon2: 'fa-circle-o-notch fa-spin',
          title1: 'Inverse',
          title2: '',
          callback1: Shared.common.selectSwitches.bind(Shared.common, syncer.switches, 'toggle', null)
        }).set
      ]],
      syncer.set.set
    );
    syncer.automatic.content.push(
      ['div', { class: 'esgst-description' }, `Select how often you want the automatic sync to run (in days) or 0 to disable it.`]
    );
    Shared.common.createFormRows(syncer.container, 'beforeEnd', { items: [syncer.manual, syncer.automatic] });
    if (Settings.at) {
      Shared.esgst.modules.generalAccurateTimestamp.at_getTimestamps(syncer.notificationArea);
    }
  }
  syncer.progress = Shared.common.createElements(syncer.area, 'beforeEnd', [{
    attributes: {
      class: 'esgst-hidden esgst-popup-progress'
    },
    type: 'div'
  }]);
  syncer.results = Shared.common.createElements(syncer.area, 'beforeEnd', [{
    type: 'div'
  }]);
  if (!syncer.isSilent && !Shared.esgst.isSyncing && syncer.parameters && syncer.set) {
    syncer.set.trigger();
  }
  return syncer;
}

function updateSyncDates(syncer) {
  syncer.notificationArea.innerHTML = '';
  for (let id in syncer.switchesKeys) {
    if (syncer.switchesKeys.hasOwnProperty(id)) {
      const info = syncer.switchesKeys[id];
      Shared.common.createFormNotification(syncer.notificationArea, 'beforeEnd', {
        name: info.name,
        success: !!Settings[`lastSync${info.key}`],
        date: Settings[`lastSync${info.key}`]
      });
    }
  }
  if (Settings.at) {
    Shared.esgst.modules.generalAccurateTimestamp.at_getTimestamps(syncer.notificationArea);
  }
}

function setAutoSync(key, name, syncer) {
  let days = [];
  for (let i = 0; i < 31; ++i) {
    days.push(['option', i === Settings[`autoSync${key}`] ? { selected: true } : null, i]);
  }
  syncer.automatic.content.push(
    ['div', null, [
      ['select', { class: 'esgst-auto-sync', onchange: event => { Settings[`autoSync${key}`] = parseInt(event.currentTarget.value); toSave[`autoSync${key}`] = parseInt(event.currentTarget.value); }}, days],
      ['span', null, name]
    ]]
  );
}

function cancelSync(syncer) {
  if (syncer.process) {
    syncer.process.stop();
  }
  syncer.canceled = true;
}

//use: syncer.results, syncer.progress, syncer.parameters
async function sync(syncer) {
  if (!Shared.esgst.firstInstall) {
    await Shared.common.setSetting('lastSync', Date.now());
    syncer.results.innerHTML = '';
    syncer.progress.classList.remove('esgst-hidden');
    Shared.common.createElements(syncer.progress, 'inner', [{
      attributes: {
        class: 'fa fa-circle-o-notch fa-spin'
      },
      type: 'i'
    }, {
      type: 'span'
    }]);
  }

  // if this is the user's fist time using the script, only sync steam id and stop
  if (Shared.esgst.firstInstall) {
    return;
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  syncer.failed = {};

  // sync groups
  if (Shared.esgst.sg && ((syncer.parameters && syncer.parameters.Groups) || (!syncer.parameters && Settings.syncGroups))) {
    syncer.progress.lastElementChild.textContent = 'Syncing your Steam groups...';
    syncer.groups = {};
    let savedGroups = JSON.parse(Shared.common.getValue('groups'));
    if (!Array.isArray(savedGroups)) {
      let newGroups, savedGiveaways;
      newGroups = [];
      for (let key in savedGroups) {
        if (savedGroups.hasOwnProperty(key)) {
          newGroups.push(savedGroups[key]);
        }
      }
      savedGroups = newGroups;
      await Shared.common.setValue('groups', JSON.stringify(savedGroups));
      savedGiveaways = JSON.parse(Shared.common.getValue('giveaways'));
      for (let key in savedGiveaways) {
        if (savedGiveaways.hasOwnProperty(key)) {
          delete savedGiveaways[key].groups;
        }
      }
      await Shared.common.setValue('giveaways', JSON.stringify(savedGiveaways));
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
      responseHtml = DOM.parse((await Shared.common.request({
        method: 'GET',
        url: `https://www.steamgifts.com/account/steam/groups/search?page=${nextPage}`
      })).responseText);
      elements = responseHtml.getElementsByClassName('table__row-outer-wrap');
      for (let i = 0, n = elements.length; !syncer.canceled && i < n; i++) {
        let code, element, heading, name;
        element = elements[i];
        heading = element.getElementsByClassName('table__column__heading')[0];
        code = heading.getAttribute('href').match(/\/group\/(.+?)\/(.+)/)[1];
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
          avatar = element.getElementsByClassName('table_image_avatar')[0].style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1];
          steamId = DOM.parse((await Shared.common.request({
            method: 'GET',
            url: `/group/${code}/`
          })).responseText).getElementsByClassName('sidebar__shortcut-inner-wrap')[0].firstElementChild.getAttribute('href').match(/\d+/)[0];
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
      pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
      nextPage += 1;
    } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains('is-selected'));
    await Shared.common.lockAndSaveGroups(syncer.groups, true);
    let missing, neww;
    missing = [];
    neww = [];
    for (let id in syncer.currentGroups) {
      if (syncer.currentGroups.hasOwnProperty(id)) {
        if (!syncer.newGroups[id]) {
          missing.push(
            ['a', { href: `http://steamcommunity.com/gid/${id}` }, syncer.currentGroups[id]],
            `, `
          );
        }
      }
    }
    for (let id in syncer.newGroups) {
      if (syncer.newGroups.hasOwnProperty(id)) {
        if (!syncer.currentGroups[id]) {
          neww.push(
            ['a', { href: `http://steamcommunity.com/gid/${id}` }, syncer.newGroups[id]],
            `, `
          );
        }
      }
    }
    missing.pop();
    neww.pop();
    syncer.html = [];
    if (missing.length) {
      syncer.html.push(
        ['div', [
          ['span', { class: 'esgst-bold' }, `Missing groups:`],
          ...missing
        ]]
      );
    }
    if (neww.length) {
      syncer.html.push(
        ['div', [
          ['span', { class: 'esgst-bold' }, `New groups:`],
          ...neww
        ]]
      );
    }
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Groups synced.'],
      ...syncer.html
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync whitelist and blacklist
  if ((syncer.parameters && (syncer.parameters.Whitelist || syncer.parameters.Blacklist)) || (!syncer.parameters && (Settings.syncWhitelist || Settings.syncBlacklist))) {
    if ((syncer.parameters && syncer.parameters.Whitelist && syncer.parameters.Blacklist) || (!syncer.parameters && Settings.syncWhitelist && Settings.syncBlacklist)) {
      await Shared.common.deleteUserValues(['whitelisted', 'whitelistedDate', 'blacklisted', 'blacklistedDate']);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = 'Syncing your whitelist...'
      await syncWhitelistBlacklist('whitelisted', syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
      syncer.progress.lastElementChild.textContent = 'Syncing your blacklist...';
      await syncWhitelistBlacklist('blacklisted', syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
    } else if ((syncer.parameters && syncer.parameters.Whitelist) || (!syncer.parameters && Settings.syncWhitelist)) {
      await Shared.common.deleteUserValues(['whitelisted', 'whitelistedDate']);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = 'Syncing your whitelist...';
      await syncWhitelistBlacklist('whitelisted', syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
    } else {
      await Shared.common.deleteUserValues(['blacklisted', 'blacklistedDate']);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = 'Syncing your blacklist...';
      await syncWhitelistBlacklist('blacklisted', syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
    }
    syncer.progress.lastElementChild.textContent = `Saving your whitelist/blacklist (this may take a while)...`;
    await Shared.common.saveUsers(syncer.users);
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Whitelist/blacklist synced.']
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync steam friends
  if ((syncer.parameters && syncer.parameters.SteamFriends) || (!syncer.parameters && Settings.syncSteamFriends)) {
    const isPermitted = await permissions.contains([['steamApi']]);
    if (isPermitted) {
      try {
        const users = [];
        syncer.progress.lastElementChild.textContent = 'Syncing your Steam friends...';
        await Shared.common.deleteUserValues(['steamFriend']);
        const response = await Shared.common.request({
          method: 'GET',
          url: `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${Settings.steamApiKey}&steamid=${Settings.steamId}&relationship=friend`
        });
        const json = JSON.parse(response.responseText);
        for (const friend of json.friendslist.friends) {
          users.push({
            steamId: friend.steamid,
            values: {
              steamFriend: friend.friend_since
            }
          });
        }
        syncer.progress.lastElementChild.textContent = `Saving your Steam friends (this may take a while)...`;
        await Shared.common.saveUsers(users);
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', 'Steam friends synced.']
        ]);
      } catch (e) {
        syncer.failed.SteamFriends = true;
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', 'Failed to sync your Steam friends. Check if you have a valid Steam API key set or if your profile is public.']
        ]);
      }
    } else {
      syncer.failed.SteamFriends = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', permissions.getMessage([['steamApi']])]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync hidden games
  if ((syncer.parameters && syncer.parameters.HiddenGames) || (!syncer.parameters && Settings.syncHiddenGames)) {
    syncer.progress.lastElementChild.textContent = 'Syncing your hidden games...';
    syncer.hiddenGames = {
      apps: [],
      subs: []
    };
    let nextPage = 1;
    let pagination = null;
    do {
      let elements, responseHtml;
      responseHtml = DOM.parse((await Shared.common.request({
        method: 'GET',
        url: `https://www.steamgifts.com/account/settings/giveaways/filters/search?page=${nextPage}`
      })).responseText);
      elements = responseHtml.querySelectorAll(`.table__column__secondary-link[href*="store.steampowered.com"]`);
      for (let i = 0, n = elements.length; i < n; ++i) {
        let match = elements[i].getAttribute('href').match(/(app|sub)\/(\d+)/);
        if (match) {
          syncer.hiddenGames[`${match[1]}s`].push(match[2]);
        }
      }
      pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
      nextPage += 1;
    } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains('is-selected'));
    let deleteLock = await Shared.common.createLock('gameLock', 300);
    let savedGames = JSON.parse(Shared.common.getValue('games'));
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
    await Shared.common.setValue('games', JSON.stringify(savedGames));
    deleteLock();
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Hidden games synced.']
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  if (Settings.hgm_s) {
    syncer.hgm = {
      toAdd: { apps: new Set(), subs: new Set() },
      toRemove: { apps: new Set(), subs: new Set() }
    };
  }

  // sync wishlisted/owned/ignored games
  if ((syncer.parameters && syncer.parameters.Games) || (!syncer.parameters && Settings.syncGames)) {
    const isPermitted = await permissions.contains([['steamApi'], ['steamStore']]);
    if (isPermitted) {
      if (Settings.hgm_s && Settings.permissionsDenied.indexOf('revadike') < 0) {
        await permissions.requestUi([['revadike']], 'sync', true, true);
      }
      syncer.progress.lastElementChild.textContent = 'Syncing your wishlisted/owned/ignored games...';
      syncer.html = [];
      let apiResponse = null;
      if (Settings.steamApiKey) {
        apiResponse = await Shared.common.request({
          method: 'GET',
          url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${Settings.steamApiKey}&steamid=${Settings.steamId}&format=json`
        });
      }
      let storeResponse = await Shared.common.request({
        method: 'GET',
        url: `http://store.steampowered.com/dynamicstore/userdata?${Math.random().toString().split('.')[1]}`
      });
      await syncGames(null, syncer, apiResponse, storeResponse);
      if (Settings.gc_o_altAccounts) {
        for (let i = 0, n = Settings.gc_o_altAccounts.length; !syncer.canceled && i < n; i++) {
          let altAccount = Settings.gc_o_altAccounts[i];
          apiResponse = await Shared.common.request({
            method: 'GET',
            url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${Settings.steamApiKey}&steamid=${altAccount.steamId}&format=json`
          });
          await syncGames(altAccount, syncer, apiResponse);
        }
        await Shared.common.setSetting('gc_o_altAccounts', Settings.gc_o_altAccounts);
      }
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', 'Owned/wishlisted/ignored games synced.'],
        ...syncer.html
      ]);
      if (Settings.getSyncGameNames) {
        // noinspection JSIgnoredPromiseFromCall
        Shared.common.getGameNames(syncer.results);
      }
    } else {
      syncer.failed.Games = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', permissions.getMessage([['steamApi'], ['steamStore']])]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync followed games
  if ((syncer.parameters && syncer.parameters.FollowedGames) || (!syncer.parameters && Settings.syncFollowedGames)) {
    const isPermitted = await permissions.contains([['steamCommunity']]);
    if (isPermitted) {
      syncer.progress.lastElementChild.textContent = 'Syncing your followed games...';
      const response = await Shared.common.request({
        method: 'GET',
        url: `https://steamcommunity.com/my/followedgames/`
      });
      const responseHtml = DOM.parse(response.responseText);
      const elements = responseHtml.querySelectorAll('.gameListRow.followed');
      const savedGames = JSON.parse(Shared.common.getValue('games'));
      for (const id in savedGames.apps) {
        if (savedGames.apps.hasOwnProperty(id)) {
          savedGames.apps[id].followed = null;
        }
      }
      for (const element of elements) {
        const id = parseInt(element.getAttribute('data-appid'));
        if (!savedGames.apps[id]) {
          savedGames.apps[id] = {};
        }
        savedGames.apps[id].followed = true;
      }
      await Shared.common.lockAndSaveGames(savedGames);
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', 'Followed games synced.']
      ]);
    } else {
      syncer.failed.FollowedGames = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', permissions.getMessage([['steamCommunity']])]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync won games
  if ((syncer.parameters && syncer.parameters.WonGames) || (!syncer.parameters && Settings.syncWonGames)) {
    syncer.progress.lastElementChild.textContent = 'Syncing your won games...';
    await Shared.common.getWonGames(syncer);
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Won games synced.']
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync reduced cv games
  if ((syncer.parameters && syncer.parameters.ReducedCvGames) || (!syncer.parameters && Settings.syncReducedCvGames)) {
    const isPermitted = await permissions.contains([['server'], ['googleWebApp']]);
    if (isPermitted) {
      syncer.progress.lastElementChild.textContent = 'Syncing reduced CV games...';
      try {
        await syncReducedCvGames();
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', [
            ['i', { class: 'fa fa-check' }],
            'Reduced CV games synced.'
          ]]
        ]);
      } catch (e) {
        syncer.failed.ReducedCvGames = true;
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', [
            ['i', { class: 'fa fa-times' }],
            'Failed to sync reduced CV games.'
          ]]
        ]);
      }
    } else {
      syncer.failed.ReducedCvGames = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', [
          ['i', { class: 'fa fa-times' }],
          permissions.getMessage([['server'], ['googleWebApp']])
        ]]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync no cv games
  if ((syncer.parameters && syncer.parameters.NoCvGames) || (!syncer.parameters && Settings.syncNoCvGames)) {
    const isPermitted = await permissions.contains([['googleWebApp']]);
    if (isPermitted) {
      syncer.progress.lastElementChild.textContent = 'Syncing no CV games...';
      try {
        await syncNoCvGames();
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', [
            ['i', { class: 'fa fa-check' }],
            'No CV games synced.'
          ]]
        ]);
      } catch (e) {
        syncer.failed.NoCvGames = true;
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', [
            ['i', { class: 'fa fa-times' }],
            'Failed to sync no CV games.'
          ]]
        ]);
      }
    } else {
      syncer.failed.NoCvGames = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', [
          ['i', { class: 'fa fa-times' }],
          permissions.getMessage([['googleWebApp']])
        ]]
      ]);
    }
  }

  // sync hltb times
  if ((syncer.parameters && syncer.parameters.HltbTimes) || (!syncer.parameters && Settings.syncHltbTimes)) {
    const isPermitted = await permissions.contains([['googleWebApp']]);
    if (isPermitted) {
      syncer.progress.lastElementChild.textContent = 'Syncing HLTB times...';
      try {
        const responseText = (await Shared.common.request({
          method: 'GET',
          url: `https://script.google.com/macros/s/AKfycbysBF72c0VNylStaslLlOL7X4M0KQIgY0VVv6Q0x2vh72iGAtE/exec`
        })).responseText;
        const games = JSON.parse(responseText);
        const hltb = {};
        for (const game of games) {
          if (game.steamId) {
            hltb[game.steamId] = game;
          }
        }
        let cache = JSON.parse(LocalStorage.get('gcCache', `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`));
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
        LocalStorage.set('gcCache', JSON.stringify(cache));
      } catch (e) {
        Logger.warning(e.stack);
      }
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', 'HLTB times synced.']
      ]);
    } else {
      syncer.failed.HltbTimes = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', permissions.getMessage([['googleWebApp']])]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync delisted games
  if ((syncer.parameters && syncer.parameters.DelistedGames) || (!syncer.parameters && Settings.syncDelistedGames)) {
    const isPermitted = await permissions.contains([['steamTracker']]);
    if (isPermitted) {
      if (Settings.hgm_s && Settings.permissionsDenied.indexOf('revadike') < 0) {
        await permissions.requestUi([['revadike']], 'sync', true, true);
      }
      syncer.progress.lastElementChild.textContent = 'Syncing delisted games...';
      const response = await Shared.common.request({ method: 'GET', url: `https://steam-tracker.com/api?action=GetAppListV3` });
      try {
        const json = JSON.parse(response.responseText);
        if (json.success) {
          const banned = json.removed_apps.filter(x => x.type === 'game' && x.category === 'Banned').map(x => parseInt(x.appid));
          const removed = json.removed_apps.filter(x => x.type === 'game' && x.category === 'Delisted').map(x => parseInt(x.appid));
          await Shared.common.setValue('delistedGames', JSON.stringify({ banned, removed }));
          if (Settings.hgm_s) {
            if (Settings.hgm_addBanned) {
              for (const id of banned) {
                syncer.hgm.toAdd.apps.add(id);
              }
            } else if (Settings.hgm_removeBanned) {
              for (const id of banned) {
                syncer.hgm.toRemove.apps.add(id);
              }
            }
          }
        }
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', 'Delisted games synced.']
        ]);
      } catch (error) {
        DOM.build(syncer.results, 'beforeEnd', [
          ['div', `Failed to sync delisted games (check the console log for more info).`]
        ]);
        Logger.warning(error.stack);
      }
    } else {
      syncer.failed.DelistedGames = true;
      DOM.build(syncer.results, 'beforeEnd', [
        ['div', permissions.getMessage([['steamTracker']])]
      ]);
    }
  }

  if (syncer.canceled) {
    return;
  }

  if (Settings.hgm_s) {
    const result = await Shared.common.hideGames({ appIds: syncer.hgm.toAdd.apps, subIds: syncer.hgm.toAdd.subs, update: message => syncer.progress.lastElementChild.textContent = message });
    const tmpResult =  await Shared.common.hideGames({ appIds: syncer.hgm.toRemove.apps, subIds: syncer.hgm.toRemove.subs, update: message => syncer.progress.lastElementChild.textContent = message }, true);
    result.apps = result.apps.concat(tmpResult.apps);
    result.subs = result.subs.concat(tmpResult.subs);
    let message = '';
    if (result.apps.length) {
      message += `The following apps were not found and therefore not hidden / unhidden (they are most likely internal apps, such as demos, game editors etc): ${result.apps.join(`, `)}\n`;
    }
    if (result.subs.length) {
      message += `The following subs were not found and therefore not hidden / unhidden: ${result.subs.join(`, `)}\n`;
    }
    if (message) {
      window.alert(message);
    }
  }

  if (syncer.canceled) {
    return;
  }

  // sync giveaways
  if (((syncer.parameters && syncer.parameters.Giveaways) || (!syncer.parameters && Settings.syncGiveaways)) && Shared.esgst.sg) {
    syncer.progress.lastElementChild.textContent = 'Syncing your giveaways...';
    const key = 'sent';
    const user = {
      steamId: Settings.steamId,
      username: Settings.username
    };
    syncer.process = await Shared.esgst.modules.usersUserGiveawayData.ugd_add(null, key, user, syncer);
    await syncer.process.start();
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Giveaways synced.']
    ]);
  }

  // sync won giveaways
  if (((syncer.parameters && syncer.parameters.WonGiveaways) || (!syncer.parameters && Settings.syncWonGiveaways)) && Shared.esgst.sg) {
    syncer.progress.lastElementChild.textContent = 'Syncing your won giveaways...';
    const key = 'won';
    const user = {
      steamId: Settings.steamId,
      username: Settings.username
    };
    syncer.process = await Shared.esgst.modules.usersUserGiveawayData.ugd_add(null, key, user, syncer);
    await syncer.process.start();
    DOM.build(syncer.results, 'beforeEnd', [
      ['div', 'Won giveaways synced.']
    ]);
  }

  // finish sync
  if (!Shared.esgst.firstInstall) {
    syncer.progress.lastElementChild.textContent = 'Updating last sync date...';
    const currentTime = Date.now();
    let keys = ['Groups', 'Whitelist', 'Blacklist', 'SteamFriends', 'HiddenGames', 'Games', 'FollowedGames', 'WonGames', 'ReducedCvGames', 'NoCvGames', 'HltbTimes', 'DelistedGames', 'Giveaways', 'WonGiveaways'];
    for (let i = keys.length - 1; i > -1; i--) {
      let key = keys[i];
      let id = `sync${key}`;
      if (!syncer.failed[key] && ((syncer.parameters && syncer.parameters[key]) || (!syncer.parameters && Settings[id]))) {
        Settings[`lastSync${key}`] = currentTime;
        toSave[`lastSync${key}`] = currentTime;
      }
    }
    await Shared.common.lockAndSaveSettings(toSave);
    toSave = {};
    DOM.build(syncer.progress, 'inner', ['Synced!']);
    LocalStorage.delete('isSyncing');
  }
  if (!syncer.isSilent) {
    updateSyncDates(syncer);
  }
}

async function syncReducedCvGames() {
  let result = null;
  try {
    result = JSON.parse((await Shared.common.request({
      method: 'GET',
      url: `https://rafaelgssa.com/esgst/games/rcv`
    })).responseText);
  } catch (e) {
    result = {
      error: e.message
    };
    result = JSON.parse((await Shared.common.request({
      method: 'GET',
      url: `https://script.google.com/macros/s/AKfycbz2IWN7I79WsbGELQk2rbQQSPI8XNWvDt3mEO-3nLEWqHiQmeo/exec?action=rcv`
    })).responseText);
  }
  if (!result || result.error) {
    throw new Error((result && result.error) || 'Error');
  } else {
    const games = result.success || result.result.found;
    for (const id in games.apps) {
      if (games.apps.hasOwnProperty(id)) {
        games.apps[id].reducedCV = games.apps[id].effective_date;
        delete games.apps[id].effective_date;
      }
    }
    for (const id in games.subs) {
      if (games.subs.hasOwnProperty(id)) {
        games.subs[id].reducedCV = games.subs[id].effective_date;
        delete games.subs[id].effective_date;
      }
    }
    for (const id in Shared.esgst.games.apps) {
      if (Shared.esgst.games.apps.hasOwnProperty(id) && !games.apps[id]) {
        games.apps[id] = {
          reducedCV: null
        };
      }
    }
    for (const id in Shared.esgst.games.subs) {
      if (Shared.esgst.games.subs.hasOwnProperty(id) && !games.subs[id]) {
        games.subs[id] = {
          reducedCV: null
        };
      }
    }
    await Shared.common.lockAndSaveGames(games);
  }
}

async function syncNoCvGames() {
  const games = JSON.parse((await Shared.common.request({
    method: 'GET',
    url: `https://script.google.com/macros/s/AKfycbz2IWN7I79WsbGELQk2rbQQSPI8XNWvDt3mEO-3nLEWqHiQmeo/exec?action=ncv`
  })).responseText).success;
  for (const id in games.apps) {
    if (games.apps.hasOwnProperty(id)) {
      games.apps[id].noCV = games.apps[id].effective_date;
      delete games.apps[id].effective_date;
    }
  }
  for (const id in games.subs) {
    if (games.subs.hasOwnProperty(id)) {
      games.subs[id].noCV = games.subs[id].effective_date;
      delete games.subs[id].effective_date;
    }
  }
  for (const id in Shared.esgst.games.apps) {
    if (Shared.esgst.games.apps.hasOwnProperty(id) && !games.apps[id]) {
      games.apps[id] = {
        noCV: null
      };
    }
  }
  for (const id in Shared.esgst.games.subs) {
    if (Shared.esgst.games.subs.hasOwnProperty(id) && !games.subs[id]) {
      games.subs[id] = {
        noCV: null
      };
    }
  }
  await Shared.common.lockAndSaveGames(games);
}

async function syncWhitelistBlacklist(key, syncer, url) {
  let nextPage = 1;
  let pagination = null;
  do {
    let elements, responseHtml;
    responseHtml = DOM.parse((await Shared.common.request({ method: 'GET', url: `${url}${nextPage}` })).responseText);
    elements = responseHtml.getElementsByClassName('table__row-outer-wrap');
    for (let i = 0, n = elements.length; i < n; ++i) {
      let element, user;
      element = elements[i];
      user = {
        id: element.querySelector(`[name="child_user_id"]`).value,
        username: element.getElementsByClassName('table__column__heading')[0].textContent,
        values: {}
      };
      user.values[key] = true;
      user.values[`${key}Date`] = parseInt(element.querySelector(`[data-timestamp]`).getAttribute('data-timestamp')) * 1e3;
      syncer.users.push(user);
    }
    pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
    nextPage += 1;
  } while (!syncer.canceled && pagination && !pagination.lastElementChild.classList.contains('is-selected'));
}

async function syncGames(altAccount, syncer, apiResponse, storeResponse) {
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
  if (((altAccount && !Settings.steamApiKey) || (!altAccount && Settings.steamApiKey)) && !hasApi) {
    syncer.html.push(
      ['div', [
        altAccount ? ['span', { class: 'esgst-bold' }, `${altAccount.name}: `] : null,
        'Unable to sync through the Steam API. Check if you have a valid Steam API key set in the settings menu.',
        altAccount ? 'Also check the privacy settings of your alt account.' : null
      ]]
    );
  }
  if (!altAccount && !hasStore) {
    syncer.html.push(
      `Unable to sync through the Steam store. Check if you are logged in to Steam on your current browser session. If you are, try again later. Some games may not be available through the Steam API (if you have a Steam API key set).`
    );
  }
  Logger.info(hasApi, hasStore);
  if ((!hasApi || !Settings.fallbackSteamApi) && !hasStore) {
    return;
  }

  // delete old data
  const savedGames = (altAccount && altAccount.games) || JSON.parse(Shared.common.getValue('games'));
  const oldWishlisted = {
    apps: [],
    subs: []
  };
  const oldIgnored = {
    apps: [],
    subs: []
  };
  const oldOwned = {
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
        if (savedGames.apps[id].wishlisted) {
          oldWishlisted.apps.push(id);
          savedGames.apps[id].wishlisted = null;
        }
        if (savedGames.apps[id].ignored) {
          oldIgnored.apps.push(id);
          savedGames.apps[id].ignored = null;
        }
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
        if (savedGames.subs[id].wishlisted) {
          oldWishlisted.subs.push(id);
          savedGames.subs[id].wishlisted = null;
        }
        if (savedGames.subs[id].ignored) {
          oldIgnored.subs.push(id);
          savedGames.subs[id].ignored = null;
        }
      }
    }
  }

  // add new data
  const newWishlisted = {
    apps: [],
    subs: []
  };
  const newIgnored = {
    apps: [],
    subs: []
  };
  const newOwned = {
    apps: [],
    subs: []
  };
  let numOwned = 0;
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
          jsonKey: 'rgWishlist',
          key: 'wishlisted',
          type: 'apps'
        },
        {
          jsonKey: 'rgOwnedApps',
          key: 'owned',
          type: 'apps'
        },
        {
          jsonKey: 'rgOwnedPackages',
          key: 'owned',
          type: 'subs'
        },
        {
          jsonKey: 'rgIgnoredApps',
          key: 'ignored',
          type: 'apps'
        },
        {
          jsonKey: 'rgIgnoredPackages',
          key: 'ignored',
          type: 'subs'
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
          if (key === 'owned' && !value) {
            newOwned[type].push(id.toString());
            numOwned += 1;
          } else if (key === 'wishlisted') {
            newWishlisted[type].push(id.toString());
          } else if (key === 'ignored') {
            newIgnored[type].push(id.toString());
          }
        }
      });
    }

    if (numOwned !== (Shared.common.getValue('ownedGames', 0))) {
      await Shared.common.setValue('ownedGames', numOwned);
    }

    // get the wishlisted dates
    try {
      const responseText = (await Shared.common.request({
        method: 'GET',
        url: `http://store.steampowered.com/wishlist/profiles/${Settings.steamId}?cc=us&l=english`
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

    await Shared.common.lockAndSaveGames(savedGames);
  }

  const removedOwned = {};
  const addedOwned = {};
  const removedWishlisted = {};
  const addedWishlisted = {};
  const removedIgnored = {};
  const addedIgnored = {};
  for (const type of ['apps', 'subs']) {
    removedOwned[type] = oldOwned[type].filter(x => newOwned[type].indexOf(x) < 0);
    addedOwned[type] = newOwned[type].filter(x => oldOwned[type].indexOf(x) < 0);
    removedWishlisted[type] = oldWishlisted[type].filter(x => newWishlisted[type].indexOf(x) < 0);
    addedWishlisted[type] = newWishlisted[type].filter(x => oldWishlisted[type].indexOf(x) < 0);
    removedIgnored[type] = oldIgnored[type].filter(x => newIgnored[type].indexOf(x) < 0);
    addedIgnored[type] = newIgnored[type].filter(x => oldIgnored[type].indexOf(x) < 0);
    if (Settings.hgm_s) {
      if (Settings.hgm_addOwned) {
        for (const id of addedOwned[type]) {
          syncer.hgm.toAdd[type].add(id);
        }
        for (const id of removedOwned[type]) {
          syncer.hgm.toRemove[type].add(id);
        }
      } else if (Settings.hgm_removeOwned) {
        for (const id of addedOwned[type]) {
          syncer.hgm.toRemove[type].add(id);
        }
      }
      if (Settings.hgm_removeWishlisted) {
        for (const id of addedWishlisted[type]) {
          syncer.hgm.toRemove[type].add(id);
        }
      }
      if (Settings.hgm_addIgnored) {
        for (const id of addedIgnored[type]) {
          syncer.hgm.toAdd[type].add(id);
        }
        for (const id of removedIgnored[type]) {
          syncer.hgm.toRemove[type].add(id);
        }
      }
    }
  }
  if (altAccount && (removedOwned.apps.length > 0 || removedOwned.subs.length > 0 || addedOwned.apps.length > 0 || addedOwned.subs.length > 0)) {
    syncer.html.push(
      ['br'],
      ['div', { class: 'esgst-bold' }, `Alt Account - ${altAccount.name}`],
      ['br']
    );
  }
  if (removedOwned.apps.length > 0) {
    syncer.html.push(
      ['div', [
        ['span', { class: 'esgst-bold' }, `Removed apps:`],
        ...removedOwned.apps.map((x, i) => { x = ['a', { href: `http://store.steampowered.com/app/${x}` }, x]; return i < removedOwned.apps.length - 1 ? [x, `,`] : [x] }).reduce((a, b) => a.concat(b))
      ]]
    );
  }
  if (removedOwned.subs.length > 0) {
    syncer.html.push(
      ['div', [
        ['span', { class: 'esgst-bold' }, `Removed packages:`],
        ...removedOwned.subs.map((x, i) => { x = ['a', { href: `http://store.steampowered.com/sub/${x}` }, x]; return i < removedOwned.subs.length - 1 ? [x, `,`] : [x] }).reduce((a, b) => a.concat(b))
      ]]
    );
  }
  if (addedOwned.apps.length > 0) {
    syncer.html.push(
      ['div', [
        ['span', { class: 'esgst-bold' }, `Added apps:`],
        ...addedOwned.apps.map((x, i) => { x = ['a', { href: `http://store.steampowered.com/app/${x}` }, x]; return i < addedOwned.apps.length - 1 ? [x, `,`] : [x] }).reduce((a, b) => a.concat(b))
      ]]
    );
  }
  if (addedOwned.subs.length > 0) {
    syncer.html.push(
      ['div', [
        ['span', { class: 'esgst-bold' }, `Added packages:`],
        ...addedOwned.subs.map((x, i) => { x = ['a', { href: `http://store.steampowered.com/sub/${x}` }, x]; return i < addedOwned.subs.length - 1 ? [x, `,`] : [x] }).reduce((a, b) => a.concat(b))
      ]]
    );
  }
}

export { runSilentSync, setSync, SYNC_KEYS };

