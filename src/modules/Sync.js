import ButtonSet from '../class/ButtonSet';
import Checkbox from '../class/Checkbox';
import Popup from '../class/Popup';
import { utils } from '../lib/jsUtils';
import { container } from '../class/Container';

const
  parseHtml = utils.parseHtml.bind(utils)
;

async function runSilentSync(parameters) {
  const button = container.common.addHeaderButton(`fa-refresh fa-spin`, `active`, `ESGST is syncing your data... Please do not close this window.`);
  container.esgst.parameters = Object.assign(container.esgst.parameters, container.common.getParameters(`?autoSync=true&${parameters.replace(/&$/, ``)}`));
  const syncer = await setSync(false, true);
  button.button.addEventListener(`click`, () => syncer.popup.open());
  container.esgst.isSyncing = true;
  await sync(syncer);
  container.esgst.isSyncing = false;
  button.changeIcon(`fa-check`);
  button.changeState(`inactive`);
  button.changeTitle(`ESGST has finished syncing, click here to see the results.`);
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
 * @returns {Promise<void>}
 */
async function setSync(isPopup = false, isSilent = false) {
  let syncer = {};
  syncer.canceled = false;
  syncer.isSilent = isSilent || container.esgst.firstInstall;
  if (container.esgst.parameters.autoSync) {
    syncer.parameters = container.esgst.parameters;
  }
  let containerr = null;
  let context = null;
  let popup = null;
  if (isPopup || syncer.isSilent) {
    syncer.popup = popup = new Popup({
      addScrollable: `left`,
      settings: true
    });
    containerr = popup.description;
    context = popup.scrollable;
    if (!syncer.isSilent || container.esgst.openAutoSyncPopup) {
      popup.open();
    }
  } else {
    containerr = context = container.esgst.sidebar.nextElementSibling;
    containerr.innerHTML = ``;
  }
  const heading = container.common.createPageHeading(containerr, `afterBegin`, {
    items: [
      {
        name: `ESGST`,
        url: container.esgst.settingsUrl
      },
      {
        name: `Sync`,
        url: container.esgst.syncUrl
      }
    ]
  });
  if (!isPopup && !syncer.isSilent) {
    container.esgst.mainPageHeading = heading;
  }
  if (syncer.isSilent) {
    syncer.area = container.common.createElements_v2(context, `beforeEnd`, [[`div`]]);
  } else {
    container.common.createElements_v2(context, `beforeEnd`, [
      [`div`, { class: `esgst-menu-split` }, [
        [`div`, { class: `esgst-sync-options` }],
        [`div`, { class: `esgst-sync-area` }]
      ]]
    ]);
    context.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: ``,
      icon2: ``,
      title1: `Save Changes`,
      title2: `Saving...`,
      callback1: async () => {
        await container.common.lockAndSaveSettings();
        if (isPopup) {
          popup.close();
        } else {
          window.location.reload();
        }
      }
    }).set);
    syncer.container = context.querySelector(`.esgst-sync-options`);
    syncer.area = context.querySelector(`.esgst-sync-area`);
    syncer.notificationArea = container.common.createElements_v2(syncer.area, `beforeEnd`, [[`div`]]);
    syncer.manual = {
      check: true,
      content: [],
      name: `Manual`
    };
    syncer.automatic = {
      check: true,
      content: [],
      name: `Automatic`
    };
    syncer.switchesKeys = {
      syncGroups: {
        dependencies: [],
        key: `Groups`,
        name: `Groups`
      },
      syncWhitelist: {
        dependencies: [],
        key: `Whitelist`,
        name: `Whitelist`
      },
      syncBlacklist: {
        dependencies: [],
        key: `Blacklist`,
        name: `Blacklist`
      },
      syncHiddenGames: {
        dependencies: [],
        key: `HiddenGames`,
        name: `Hidden Games`
      },
      syncGames: {
        dependencies: [],
        key: `Games`,
        name: `Owned/Wishlisted/Ignored Games`
      },
      syncFollowedGames: {
        dependencies: [],
        key: `FollowedGames`,
        name: `Followed Games`
      },
      syncWonGames: {
        dependencies: [],
        key: `WonGames`,
        name: `Won Games`
      },
      syncReducedCvGames: {
        dependencies: [],
        key: `ReducedCvGames`,
        name: `Reduced CV Games`
      },
      syncNoCvGames: {
        dependencies: [],
        key: `NoCvGames`,
        name: `No CV Games`
      },
      syncHltbTimes: {
        dependencies: [],
        key: `HltbTimes`,
        name: `HLTB Times`
      },
      syncDelistedGames: {
        dependencies: [],
        key: `DelistedGames`,
        name: `Delisted Games`
      },
      syncGiveaways: {
        dependencies: [],
        key: `Giveaways`,
        name: `Giveaways`
      }
    };
    syncer.switches = {};
    for (const type in container.esgst.features) {
      for (const id in container.esgst.features[type].features) {
        getDependencies(syncer, container.esgst.features[type].features[id], id);
      }
    }
    for (let id in syncer.switchesKeys) {
      if (syncer.switchesKeys.hasOwnProperty(id)) {
        const info = syncer.switchesKeys[id];
        const checkbox = new Checkbox(null, container.esgst[id]);
        checkbox.onChange = () => {
          container.esgst.settings[`sync${info.key}`] = container.esgst[id] = checkbox.value
        };
        syncer.switches[id] = checkbox;
        syncer.manual.content.push(
          [`div`, [
            [`i`, { class: `fa fa-question-circle`, title: `This is required for the following features:\n\n${info.dependencies.map(x => container.common.getFeatureName(null, x)).join(`\n`)}` }],
            ` `,
            checkbox.checkbox,
            ` `,
            [`span`, info.name]
          ]]
        );
        setAutoSync(info.key, info.name, syncer);
        container.common.createFormNotification(syncer.notificationArea, `beforeEnd`, {
          name: info.name,
          success: !!container.esgst[`lastSync${info.key}`],
          date: container.esgst[`lastSync${info.key}`]
        });
      }
    }
    syncer.set = new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-refresh`,
      icon2: `fa-times`,
      title1: `Sync`,
      title2: `Cancel`,
      callback1: sync.bind(null, syncer),
      callback2: cancelSync.bind(null, syncer)
    });
    syncer.manual.content.push(
      [`div`, { class: `esgst-button-group` }, [
        [`span`, `Select:`],
        new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-square`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `All`,
          title2: ``,
          callback1: container.common.selectSwitches.bind(container.common, syncer.switches, `check`, false)
        }).set,
        new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-square-o`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `None`,
          title2: ``,
          callback1: container.common.selectSwitches.bind(container.common, syncer.switches, `uncheck`, false)
        }).set,
        new ButtonSet({
          color1: `grey`,
          color2: `grey`,
          icon1: `fa-plus-square-o`,
          icon2: `fa-circle-o-notch fa-spin`,
          title1: `Inverse`,
          title2: ``,
          callback1: container.common.selectSwitches.bind(container.common, syncer.switches, `toggle`, false)
        }).set
      ]],
      syncer.set.set
    );
    syncer.automatic.content.push(
      [`div`, { class: `esgst-description` }, `Select how often you want the automatic sync to run (in days) or 0 to disable it.`]
    );
    container.common.createFormRows(syncer.container, `beforeEnd`, { items: [syncer.manual, syncer.automatic] });
    if (container.esgst.at) {
      container.esgst.modules.generalAccurateTimestamp.at_getTimestamps(syncer.notificationArea);
    }
  }
  syncer.progress = container.common.createElements(syncer.area, `beforeEnd`, [{
    attributes: {
      class: `esgst-hidden esgst-popup-progress`
    },
    type: `div`
  }]);
  syncer.results = container.common.createElements(syncer.area, `beforeEnd`, [{
    type: `div`
  }]);
  if (!syncer.isSilent && !container.esgst.isSyncing && syncer.parameters && syncer.set) {
    syncer.set.trigger();
  }
  return syncer;
}

function updateSyncDates(syncer) {
  syncer.notificationArea.innerHTML = ``;
  for (let id in syncer.switchesKeys) {
    if (syncer.switchesKeys.hasOwnProperty(id)) {
      const info = syncer.switchesKeys[id];
      container.common.createFormNotification(syncer.notificationArea, `beforeEnd`, {
        name: info.name,
        success: !!container.esgst[`lastSync${info.key}`],
        date: container.esgst[`lastSync${info.key}`]
      });
    }
  }
  if (container.esgst.at) {
    container.esgst.modules.generalAccurateTimestamp.at_getTimestamps(syncer.notificationArea);
  }
}

function setAutoSync(key, name, syncer) {
  let days = [];
  for (let i = 0; i < 31; ++i) {
    days.push([`option`, i === container.esgst[`autoSync${key}`] ? { selected: true } : null, i]);
  }
  syncer.automatic.content.push(
    [`div`, null, [
      [`select`, { class: `esgst-auto-sync`, onchange: event => container.esgst.settings[`autoSync${key}`] = container.esgst[`autoSync${key}`] = parseInt(event.currentTarget.value) }, days],
      [`span`, null, name]
    ]]
  );
}

function cancelSync(syncer) {
  if (syncer.process) {
    syncer.process.stop();
  }
  syncer.canceled = true;
}

/**
 * @param {EsgstSyncer} syncer
 */
//use: syncer.results, syncer.progress, syncer.parameters
async function sync(syncer) {
  if (!container.esgst.firstInstall) {
    await container.common.setSetting(`lastSync`, Date.now());
    syncer.results.innerHTML = ``;
    syncer.progress.classList.remove(`esgst-hidden`);
    container.common.createElements(syncer.progress, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      type: `span`
    }]);
  }

  // if this is the user's fist time using the script, only sync steam id and stop
  if (container.esgst.firstInstall) {
    return;
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync groups
  if (container.esgst.sg && ((syncer.parameters && syncer.parameters.Groups) || (!syncer.parameters && container.esgst.settings.syncGroups))) {
    syncer.progress.lastElementChild.textContent = `Syncing your Steam groups...`;
    syncer.groups = {};
    let savedGroups = JSON.parse(await container.common.getValue(`groups`));
    if (!Array.isArray(savedGroups)) {
      let newGroups, savedGiveaways;
      newGroups = [];
      for (let key in savedGroups) {
        if (savedGroups.hasOwnProperty(key)) {
          newGroups.push(savedGroups[key]);
        }
      }
      savedGroups = newGroups;
      await container.common.setValue(`groups`, JSON.stringify(savedGroups));
      savedGiveaways = JSON.parse(await container.common.getValue(`giveaways`));
      for (let key in savedGiveaways) {
        if (savedGiveaways.hasOwnProperty(key)) {
          delete savedGiveaways[key].groups;
        }
      }
      await container.common.setValue(`giveaways`, JSON.stringify(savedGiveaways));
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
      responseHtml = parseHtml((await container.common.request({
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
          steamId = parseHtml((await container.common.request({
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
    await container.common.lockAndSaveGroups(syncer.groups, true);
    let missing, neww;
    missing = [];
    neww = [];
    for (let id in syncer.currentGroups) {
      if (syncer.currentGroups.hasOwnProperty(id)) {
        if (!syncer.newGroups[id]) {
          missing.push(
            [`a`, { href: `http://steamcommunity.com/gid/${id}` }, syncer.currentGroups[id]],
            `, `
          );
        }
      }
    }
    for (let id in syncer.newGroups) {
      if (syncer.newGroups.hasOwnProperty(id)) {
        if (!syncer.currentGroups[id]) {
          neww.push(
            [`a`, { href: `http://steamcommunity.com/gid/${id}` }, syncer.newGroups[id]],
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
        [`div`, [
          [`span`, { class: `esgst-bold` }, `Missing groups:`],
          ...missing
        ]]
      );
    }
    if (neww.length) {
      syncer.html.push(
        [`div`, [
          [`span`, { class: `esgst-bold` }, `New groups:`],
          ...neww
        ]]
      );
    }
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Groups synced.`],
      ...syncer.html
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync whitelist and blacklist
  if ((syncer.parameters && (syncer.parameters.Whitelist || syncer.parameters.Blacklist)) || (!syncer.parameters && (container.esgst.settings.syncWhitelist || container.esgst.settings.syncBlacklist))) {
    if ((syncer.parameters && syncer.parameters.Whitelist && syncer.parameters.Blacklist) || (!syncer.parameters && container.esgst.settings.syncWhitelist && container.esgst.settings.syncBlacklist)) {
      await container.common.deleteUserValues([`whitelisted`, `whitelistedDate`, `blacklisted`, `blacklistedDate`]);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`
      await syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
      syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
      await syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
    } else if ((syncer.parameters && syncer.parameters.Whitelist) || (!syncer.parameters && container.esgst.settings.syncWhitelist)) {
      await container.common.deleteUserValues([`whitelisted`, `whitelistedDate`]);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = `Syncing your whitelist...`;
      await syncWhitelistBlacklist(`whitelisted`, syncer, `https://www.steamgifts.com/account/manage/whitelist/search?page=`);
    } else {
      await container.common.deleteUserValues([`blacklisted`, `blacklistedDate`]);
      syncer.users = [];
      syncer.progress.lastElementChild.textContent = `Syncing your blacklist...`;
      await syncWhitelistBlacklist(`blacklisted`, syncer, `https://www.steamgifts.com/account/manage/blacklist/search?page=`);
    }
    syncer.progress.lastElementChild.textContent = `Saving your whitelist/blacklist (this may take a while)...`;
    await container.common.saveUsers(syncer.users);
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Whitelist/blacklist synced.`]
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync hidden games
  if ((syncer.parameters && syncer.parameters.HiddenGames) || (!syncer.parameters && container.esgst.settings.syncHiddenGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing your hidden games...`;
    syncer.hiddenGames = {
      apps: [],
      subs: []
    };
    let nextPage = 1;
    let pagination = null;
    do {
      let elements, responseHtml;
      responseHtml = parseHtml((await container.common.request({
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
    let deleteLock = await container.common.createLock(`gameLock`, 300);
    let savedGames = JSON.parse(await container.common.getValue(`games`));
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
    await container.common.setValue(`games`, JSON.stringify(savedGames));
    deleteLock();
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Hidden games synced.`]
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync wishlisted/owned/ignored games
  if ((syncer.parameters && syncer.parameters.Games) || (!syncer.parameters && container.esgst.settings.syncGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing your wishlisted/owned/ignored games...`;
    syncer.html = [];
    let apiResponse = null;
    if (container.esgst.steamApiKey) {
      apiResponse = await container.common.request({
        method: `GET`,
        url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${container.esgst.steamApiKey}&steamid=${container.esgst.steamId}&format=json`
      });
    }
    let storeResponse = await container.common.request({
      method: `GET`,
      url: `http://store.steampowered.com/dynamicstore/userdata?${Math.random().toString().split(`.`)[1]}`
    });
    await syncGames(null, syncer, apiResponse, storeResponse);
    if (container.esgst.settings.gc_o_altAccounts) {
      for (let i = 0, n = container.esgst.settings.gc_o_altAccounts.length; !syncer.canceled && i < n; i++) {
        let altAccount = container.esgst.settings.gc_o_altAccounts[i];
        apiResponse = await container.common.request({
          method: `GET`,
          url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${container.esgst.steamApiKey}&steamid=${altAccount.steamId}&format=json`
        });
        await syncGames(altAccount, syncer, apiResponse);
      }
      await container.common.setSetting(`gc_o_altAccounts`, container.esgst.settings.gc_o_altAccounts);
    }
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Owned/wishlisted/ignored games synced.`],
      ...syncer.html
    ]);
    if (container.esgst.getSyncGameNames) {
      // noinspection JSIgnoredPromiseFromCall
      container.common.getGameNames(syncer.results);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync followed games
  if ((syncer.parameters && syncer.parameters.FollowedGames) || (!syncer.parameters && container.esgst.settings.syncFollowedGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing your followed games...`;
    const response = await container.common.request({
      method: `GET`,
      url: `https://steamcommunity.com/my/followedgames/`
    });
    const responseHtml = parseHtml(response.responseText);
    const elements = responseHtml.querySelectorAll(`.gameListRow.followed`);
    const savedGames = JSON.parse(await container.common.getValue(`games`));
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
    await container.common.lockAndSaveGames(savedGames);
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Followed games synced.`]
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync won games
  if ((syncer.parameters && syncer.parameters.WonGames) || (!syncer.parameters && container.esgst.settings.syncWonGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing your won games...`;
    await container.common.getWonGames(`0`, syncer);
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Won games synced.`]
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync reduced cv games
  if ((syncer.parameters && syncer.parameters.ReducedCvGames) || (!syncer.parameters && container.esgst.settings.syncReducedCvGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing reduced CV games...`;
    let result = JSON.parse((await container.common.request({
      method: `GET`,
      url: `https://script.google.com/macros/s/AKfycbwJK-7RBh5ghaKprEsmx4DQ6CyXc_3_9eYiOCu3yhI6W4B3W4YN/exec`
    })).responseText);
    if (result.error) {
      container.common.createElements_v2(syncer.results, `beforeEnd`, [
        `Unable to sync reduced CV games: ${result.error}`
      ]);
    } else {
      result = result.success;
      for (const id in container.esgst.games.apps) {
        if (container.esgst.games.apps.hasOwnProperty(id)) {
          container.esgst.games.apps[id].reducedCV = null;
        }
      }
      for (const id in container.esgst.games.subs) {
        if (container.esgst.games.subs.hasOwnProperty(id)) {
          container.esgst.games.subs[id].reducedCV = null;
        }
      }
      for (const id in result.apps) {
        if (result.apps.hasOwnProperty(id)) {
          if (!container.esgst.games.apps[id]) {
            container.esgst.games.apps[id] = {};
          }
          container.esgst.games.apps[id].reducedCV = result.apps[id].reducedCV;
        }
      }
      for (const id in result.subs) {
        if (result.subs.hasOwnProperty(id)) {
          if (!container.esgst.games.subs[id]) {
            container.esgst.games.subs[id] = {};
          }
          container.esgst.games.subs[id].reducedCV = result.subs[id].reducedCV;
        }
      }
      await container.common.lockAndSaveGames(container.esgst.games);
      container.common.createElements_v2(syncer.results, `beforeEnd`, [
        [`div`, `Reduced CV games synced.`]
      ]);
    }
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync no cv games
  if ((syncer.parameters && syncer.parameters.NoCvGames) || (!syncer.parameters && container.esgst.settings.syncNoCvGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing no CV games...`;
    await container.common.lockAndSaveGames(JSON.parse((await container.common.request({
      method: `GET`,
      url: `https://script.google.com/macros/s/AKfycbym0nzeyr3_b93ViuiZRivkBMl9PBI2dTHQxNC0rtgeQSlCTI-P/exec`
    })).responseText).success);
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `No CV games synced.`]
    ]);
  }

  // sync hltb times
  if ((syncer.parameters && syncer.parameters.HltbTimes) || (!syncer.parameters && container.esgst.settings.syncHltbTimes)) {
    syncer.progress.lastElementChild.textContent = `Syncing HLTB times...`;
    try {
      const responseText = (await container.common.request({
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
      let cache = JSON.parse(container.common.getLocalValue(`gcCache`, `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`));
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
      container.common.setLocalValue(`gcCache`, JSON.stringify(cache));
    } catch (e) {
      window.console.log(e);
    }
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `HLTB times synced.`]
    ]);
  }

  // if sync has been canceled stop
  if (syncer.canceled) {
    return;
  }

  // sync delisted games
  if ((syncer.parameters && syncer.parameters.DelistedGames) || (!syncer.parameters && container.esgst.settings.syncDelistedGames)) {
    syncer.progress.lastElementChild.textContent = `Syncing delisted games...`;
    const response = await container.common.request({ method: `GET`, url: `https://steam-tracker.com/api?action=GetAppListV3` });
    try {
      const json = JSON.parse(response.responseText);
      if (json.success) {
        const banned = json.removed_apps.filter(x => x.type === `game` && x.category === `Banned`).map(x => parseInt(x.appid));
        const removed = json.removed_apps.filter(x => x.type === `game` && x.category === `Delisted`).map(x => parseInt(x.appid));
        await container.common.setValue(`delistedGames`, JSON.stringify({ banned, removed }));
      }
      container.common.createElements_v2(syncer.results, `beforeEnd`, [
        [`div`, `Delisted games synced.`]
      ]);
    } catch (error) {
      container.common.createElements_v2(syncer.results, `beforeEnd`, [
        [`div`, `Failed to sync delisted games (check the console log for more info).`]
      ]);
      window.console.log(error);
    }
  }

  if (syncer.canceled) {
    return;
  }

  // sync giveaways
  if (((syncer.parameters && syncer.parameters.Giveaways) || (!syncer.parameters && container.esgst.settings.syncGiveaways)) && container.esgst.sg) {
    syncer.progress.lastElementChild.textContent = `Syncing your giveaways...`;
    const key = `sent`;
    const user = {
      steamId: container.esgst.steamId,
      username: container.esgst.username
    };
    syncer.process = await container.esgst.modules.usersUserGiveawayData.ugd_add(null, key, user, syncer);
    await syncer.process.start();
    container.common.createElements_v2(syncer.results, `beforeEnd`, [
      [`div`, `Giveaways synced.`]
    ]);
  }

  // finish sync
  if (!container.esgst.firstInstall) {
    syncer.progress.lastElementChild.textContent = `Updating last sync date...`;
    const currentTime = Date.now();
    let keys = [`Groups`, `Whitelist`, `Blacklist`, `HiddenGames`, `Games`, `FollowedGames`, `WonGames`, `ReducedCvGames`, `NoCvGames`, `HltbTimes`, `DelistedGames`, `Giveaways`];
    for (let i = keys.length - 1; i > -1; i--) {
      let key = keys[i];
      let id = `sync${key}`;
      if ((syncer.parameters && syncer.parameters[key]) || (!syncer.parameters && container.esgst.settings[id])) {
        await container.common.setSetting(`lastSync${key}`, currentTime);
        container.esgst[`lastSync${key}`] = currentTime;
      }
    }
    container.common.createElements_v2(syncer.progress, `inner`, [`Synced!`]);
    container.common.delLocalValue(`isSyncing`);
  }
  if (!syncer.isSilent) {
    updateSyncDates(syncer);
  }
}

async function syncWhitelistBlacklist(key, syncer, url) {
  let nextPage = 1;
  let pagination = null;
  do {
    let elements, responseHtml;
    responseHtml = parseHtml((await container.common.request({ method: `GET`, url: `${url}${nextPage}` })).responseText);
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
  if (((altAccount && !container.esgst.steamApiKey) || (!altAccount && container.esgst.steamApiKey)) && !hasApi) {
    syncer.html.push(
      [`div`, [
        altAccount ? [`span`, { class: `esgst-bold` }, `${altAccount.name}: `] : null,
        `Unable to sync through the Steam API. Check if you have a valid Steam API key set in the settings menu.`,
        altAccount ? `Also check the privacy settings of your alt account.` : null
      ]]
    );
  }
  if (!altAccount && !hasStore) {
    syncer.html.push(
      `Unable to sync through the Steam store. Check if you are logged in to Steam on your current browser session. If you are, try again later. Some games may not be available through the Steam API (if you have a Steam API key set).`
    );
  }
  window.console.log(hasApi, hasStore);
  if ((!hasApi || !container.esgst.fallbackSteamApi) && !hasStore) {
    return;
  }

  // delete old data
  const savedGames = (altAccount && altAccount.games) || JSON.parse(await container.common.getValue(`games`)),
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

    if (numOwned !== (await container.common.getValue(`ownedGames`, 0))) {
      await container.common.setValue(`ownedGames`, numOwned);
    }

    // get the wishlisted dates
    try {
      const responseText = (await container.common.request({
        method: `GET`,
        url: `http://store.steampowered.com/wishlist/profiles/${container.esgst.steamId}?l=en`
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

    await container.common.lockAndSaveGames(savedGames);
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
      removedOwned.apps.push(
        [`a`, { href: `http://store.steampowered.com/app/${id}` }, id],
        `, `
      );
    }
  });
  oldOwned.subs.forEach(id => {
    if (newOwned.subs.indexOf(id) < 0) {
      removedOwned.subs.push(
        [`a`, { href: `http://store.steampowered.com/sub/${id}` }, id],
        `, `
      );
    }
  });
  newOwned.apps.forEach(id => {
    if (oldOwned.apps.indexOf(id) < 0) {
      addedOwned.apps.push(
        [`a`, { href: `http://store.steampowered.com/app/${id}` }, id],
        `, `
      );
    }
  });
  newOwned.subs.forEach(id => {
    if (oldOwned.subs.indexOf(id) < 0) {
      addedOwned.subs.push(
        [`a`, { href: `http://store.steampowered.com/sub/${id}` }, id],
        `, `
      );
    }
  });
  if (altAccount && (removedOwned.apps.length > 0 || removedOwned.subs.length > 0 || addedOwned.apps.length > 0 || addedOwned.subs.length > 0)) {
    syncer.html.push(
      [`br`],
      [`div`, { class: `esgst-bold` }, `Alt Account - ${altAccount.name}`],
      [`br`]
    );
  }
  removedOwned.apps.pop();
  removedOwned.subs.pop();
  addedOwned.apps.pop();
  addedOwned.subs.pop();
  if (removedOwned.apps.length > 0) {
    syncer.html.push(
      [`div`, [
        [`span`, { class: `esgst-bold` }, `Removed apps:`],
        ...removedOwned.apps
      ]]
    );
  }
  if (removedOwned.subs.length > 0) {
    syncer.html.push(
      [`div`, [
        [`span`, { class: `esgst-bold` }, `Removed packages:`],
        ...removedOwned.subs
      ]]
    );
  }
  if (addedOwned.apps.length > 0) {
    syncer.html.push(
      [`div`, [
        [`span`, { class: `esgst-bold` }, `Added apps:`],
        ...addedOwned.apps
      ]]
    );
  }
  if (addedOwned.subs.length > 0) {
    syncer.html.push(
      [`div`, [
        [`span`, { class: `esgst-bold` }, `Added packages:`],
        ...addedOwned.subs
      ]]
    );
  }
}

export {
  runSilentSync,
  setSync
};