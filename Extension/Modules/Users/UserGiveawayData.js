_MODULES.push({
    description: `
      <ul>
        <li>Adds 2 identical buttons (<i class="fa fa-bar-chart"></i>) to the "Gifts Won" and "Gifts Sent" rows of a user's <a href="https://www.steamgifts.com/user/cg">profile</a> page that allow you to gather data about their giveaways:</li>
        <ul>
          <li>The won data contains a table with the number and percentage of won giveaways per type/level, a list with the creators that the user has most won from and (optionally) 2 other tables with the user's playtime/achievement stats for the games (DLCs cannot be counted, but packages will be listed with playtime > 0 and achievements > 0 if one or more of the games in the package have playtime/achievements).</li>
          <li>The sent data contains a table with the number and percentage of sent giveaways per type/level and a list with the games that the user has most given away.</li>
        </ul>
        <li>Results are cached forever, so every time you check the same user again the feature will only retrieve the giveaways that they have created/won since the last check, unless you check them with the option to clear the cache enabled, in which case all of their giveaways will be retrieved again as if they were being checked for the first time.</li>
      </ul>
    `,
    features: {
      ugd_s: {
        name: `Display playtime/achievement stats in the user's profile page.`,
        sg: true
      }
    },
    id: `ugd`,
    load: ugd,
    name: `User Giveaway Data`,
    sg: true,
    type: `users`
  });

  function ugd() {
    esgst.profileFeatures.push(ugd_addButtons);
    if (esgst.ugd_s) {
      esgst.profileFeatures.push(ugd_addStats);
    }
  }

  async function ugd_addButtons(profile) {
    const user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username
    };
    await ugd_add(profile.wonRowLeft, `won`, user);
    await ugd_add(profile.sentRowLeft, `sent`, user);
  }

  function ugd_addStats(profile, savedUser) {
    if (!savedUser) {
      return;
    }

    const ugdCache = savedUser.ugdCache;
    if (!ugdCache) {
      return;
    }
    
    const context = createElements(profile.commentsRow, `afterEnd`, [{
      attributes: {
        class: `esgst-ugd featured__table__row`,
        title: getFeatureTooltip(`ugd`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `featured__table__row__left`
        },
        type: `div`,
        children: [{
          text: `Won Games Playtime > `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-ugd-input`,
            min: `0`,
            step: `0.1`,
            type: `number`,
            value: esgst.ugd_playtime
          },
          type: `input`
        }, {
          text: `hours`,
          type: `node`
        }]
      }, {
        attributes: {
          class: `featured__table__row__right`
        },
        type: `div`
      }]
    }, {
      attributes: {
        class: `esgst-ugd featured__table__row`,
        title: getFeatureTooltip(`ugd`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `featured__table__row__left`
        },
        type: `div`,
        children: [{
          text: `Won Games Achievements > `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-ugd-input`,
            max: `100`,
            min: `0`,
            step: `0.1`,
            type: `number`,
            value: esgst.ugd_achievements
          },
          type: `input`
        }, {
          text: `%`,
          type: `node`
        }]
      }, {
        attributes: {
          class: `featured__table__row__right`
        },
        type: `div`
      }]
    }, {
      attributes: {
        class: `esgst-ugd featured__table__row`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `featured__table__row__left`
        },
        type: `div`
      }, {
        attributes: {
          class: `featured__table__row__right`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-italic`
          },
          text: `Last checked ${formatDate(`[MMM] [DD], [YYYY], [HH]:[HMM]:[SS]`, ugdCache.lastCheck)}.`,
          type: `span`
        }]
      }]
    }]);
    const playtimeInput = context.firstElementChild.lastElementChild;
    const playtimeDisplay = context.lastElementChild;
    const achievementsInput = context.nextElementSibling.firstElementChild.lastElementChild;
    const achievementsDisplay = context.nextElementSibling.lastElementChild;
    playtimeInput.addEventListener(`change`, ugd_calculatePlaytime.bind(null, playtimeDisplay, playtimeInput, ugdCache, false));
    achievementsInput.addEventListener(`change`, ugd_calculateAchievements.bind(null, achievementsDisplay, achievementsInput, ugdCache, false));
    ugd_calculatePlaytime(playtimeDisplay, playtimeInput, ugdCache, true);
    ugd_calculateAchievements(achievementsDisplay, achievementsInput, ugdCache, true);
  }

  function ugd_calculatePlaytime(playtimeDisplay, playtimeInput, ugdCache, firstRun) {
    esgst.ugd_playtime = parseFloat(playtimeInput.value);
    let playtimes = 0;
    for (const key in ugdCache.playtimes) {
      const playtime = ugdCache.playtimes[key];
      if ((playtime[1] / 60) > esgst.ugd_playtime) {
        playtimes += 1;
      }
    }
    const totalPlaytimes = Object.keys(ugdCache.playtimes).length;
    playtimes = `${playtimes}/${totalPlaytimes} (${Math.round(playtimes / totalPlaytimes * 10000) / 100}%)`;
    playtimeDisplay.textContent = playtimes;
    if (!firstRun) {
      setSetting(`ugd_playtime`, esgst.ugd_playtime);
    }
  }

  function ugd_calculateAchievements(achievementsDisplay, achievementsInput, ugdCache, firstRun) {
    esgst.ugd_achievements = parseFloat(achievementsInput.value);
    let achievements = 0;
    for (const key in ugdCache.achievements) {
      const achievement = ugdCache.achievements[key];
      if (parseFloat(achievement.match(/\((.+?)%\)/)[1]) > esgst.ugd_achievements) {
        achievements += 1;
      }
    }
    const totalAchievements = Object.keys(ugdCache.achievements).length;
    achievements = `${achievements}/${totalAchievements} (${Math.round(achievements / totalAchievements * 10000) / 100}%)`;
    achievementsDisplay.textContent = achievements;
    if (!firstRun) {
      setSetting(`ugd_achievements`, esgst.ugd_achievements);
    }
  }

  async function ugd_add(context, key, user, mainPopup) {
    let button = null;
    if (context) {
      button = createElements(context, `beforeEnd`, [{
        attributes: {
          class: `esgst-ugd-button`,
          title: getFeatureTooltip(`ugd`, `Get ${key} giveaway data`)
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-bar-chart`
          },
          type: `i`
        }]
      }]);
    }
    const savedUser = await getUser(null, user);
    const ugdCache = savedUser && savedUser.ugdCache;
    const details = {
      button: button,
      popup: {
        icon: `fa-bar-chart`,
        title: `Get ${user.username}'s ${key} giveaway data:`,
        options: [
          {
            check: key === `won`,
            dependencies: [`ugd_forceUpdate`],
            description: `Get playtime stats.`,
            id: `ugd_getPlaytime`,
            tooltip: `Get playtime stats for each won game by this user (requires a Steam API Key inserted into the settings menu - does not check DLCs/packages).`
          }, {
            check: key === `won`,
            dependencies: [`ugd_forceUpdate`],
            description: `Get achievements stats.`,
            id: `ugd_getAchievements`,
            tooltip: `Get achievements stats for each won game by this user (slower - does not check DLCs/packages).`
          }, {
            check: key === `won`,
            description: `Force-update playtime/achievements stats.`,
            id: `ugd_forceUpdate`,
            tooltip: `Playtime/achievements stats are updated automatically if you re-check the user after a week. With this option enabled, they are force-updated.`
          }, {
            check: true,
            description: `Clear cache.`,
            id: `ugd_clearCache`,
            tooltip: `If enabled, the cache will be cleared and all giveaways will be retrieved again (slower).`
          }
        ],
        addProgress: true,
        addScrollable: `left`,
        scrollableContent: !mainPopup && ugdCache ? [{
          attributes: {
            class: `esgst-italic`
          },
          text: `Last checked ${formatDate(`[MMM] [DD], [YYYY], [HH]:[HMM]:[SS]`, ugdCache.lastCheck)}.`,
          type: `span`
        }] : null
      },
      mainPopup: mainPopup,
      init: ugd_init.bind(null, key, user),
      requests: [
        {
          url: `/user/${user.username}${key === `won` ? `/giveaways/won` : ``}/search?page=`,
          request: ugd_requestGiveaways
        },
        ugd_requestGiveawaysDone
      ]
    };
    return new Process(details);
  }

  async function ugd_init(key, user, obj) {
    obj.giveaways = {};
    obj.key = key;
    obj.requests = obj.requests.slice(0, 2);
    obj.user = user;

    const savedUser = await getUser(null, obj.user);
    obj.ugdCache = savedUser && savedUser.ugdCache;
    obj.userGiveaways = await ugd_getUserGiveaways(savedUser);
    if (obj.popup && esgst.ugd_clearCache) {
      obj.userGiveaways[obj.key] = null;
      if (obj.key === `won`) {
        obj.ugdCache = null;
      }
    }
    if (
      !obj.userGiveaways.sent || (
        obj.key === `sent` &&
        obj.userGiveaways.version !== `7.13.0`
      )
    ) {
      obj.userGiveaways.sent = {
        apps: {},
        subs: {}
      };
      obj.userGiveaways.sentTimestamp = 0;
      obj.userGiveaways.version = `7.13.0`;
    }
    if (!obj.userGiveaways.won) {
      obj.userGiveaways.won = {
        apps: {},
        subs: {}
      };
      obj.userGiveaways.wonTimestamp = 0;
    }
  }

  async function ugd_getUserGiveaways(savedUser) {
    let userGiveaways = savedUser && savedUser.giveaways;
    if (userGiveaways) {
      return userGiveaways;
    }

    userGiveaways = {
      sent: {
        apps: {},
        subs: {}
      },
      won: {
        apps: {},
        subs: {}
      },
      sentTimestamp: 0,
      wonTimestamp: 0,
      version: `7.13.0`
    };
    if (!savedUser) {
      return userGiveaways;
    }

    const ugd = savedUser.ugd;
    if (!ugd) {
      return userGiveaways;
    }

    let newGiveaways = {};
    const keys = [`sent`, `won`];
    const types = [`apps`, `subs`];
    for (const key of keys) {
      if (!ugd[key]) {
        continue;
      }

      for (const type of types) {
        const ids = ugd[key][type];
        for (const id of ids) {
          userGiveaways[key][type][id] = [];
          const giveaways = ugd[key][type][id];
          const n = giveaways.length;
          for (let i = 0; i < n; i++) {
            const giveaway = giveaways[i];
            const code = giveaway.code;
            newGiveaways[code] = giveaway;
            userGiveaways[key][type][id].push(code);
          }
        }
      }
      userGiveaways[`${key}Timestamp`] = ugd[`${key}Timestamp`];
    }
    if (Object.keys(newGiveaways).length) {
      await lockAndSaveGiveaways(newGiveaways);
    }
    return userGiveaways;
  }

  async function ugd_requestGiveaways(obj, details, response, responseHtml) {
    const msg = `Retrieving giveaways (page ${details.nextPage}${details.lastPage})...`;
    if (obj.popup) {
      obj.popup.setProgress(msg);
    } else {
      obj.mainPopup.progress.lastElementChild.textContent = msg;
    }

    let found = false;
    const currentTime = Date.now();
    const elements = responseHtml.getElementsByClassName(`giveaway__row-outer-wrap`);
    const n = elements.length;
    for (let i = 0; i < n; i++) {
      const giveawayObj = (
        await giveaways_getInfo(elements[i], document, obj.user.username, obj.key)
      );
      const giveawayRaw = giveawayObj.giveaway;
      const giveaway = giveawayObj.data;
      const endTime = giveaway.endTime;

      // giveaway has not ended yet, so cannot store it
      if (endTime >= currentTime) {
        continue;
      }

      if (!obj.timestamp) {
        obj.timestamp = endTime;
      }

      // giveaway has already been stored previously
      if (endTime <= obj.userGiveaways[`${obj.key}Timestamp`]) {
        found = true;
        break;
      }

      const id = giveaway.gameSteamId;
      if (!id) {
        continue;
      }

      const games = obj.userGiveaways[obj.key][giveaway.gameType];
      const code = giveaway.code;
      if (!games[id]) {
        games[id] = [];
      }
      if (code) {
        games[id].push(code);
        const savedGiveaway = esgst.giveaways[code];
        if (!savedGiveaway || !Array.isArray(savedGiveaway.winners)) {
          console.log(`ESGST Log: UGD 0`);
          obj.giveaways[code] = giveaway;          
          if (obj.key === `sent`) {
            console.log(`ESGST Log: UGD 1`);
            giveaway.winners = [];
            if (giveawayRaw.winners > 3) {
              console.log(`ESGST Log: UGD 2`);
              obj.requests.push({
                giveaway: giveaway,
                request: ugd_requestGiveaway,
                url: `/giveaway/${code}/_/winners/search?page=`
              });
            } else {
              console.log(`ESGST Log: UGD 3`);
              for (const key in giveawayRaw.winnerColumns) {
                const column = giveawayRaw.winnerColumns[key];
                if (!column.status || column.status === `Awaiting Feedback`) {
                  continue;
                }
                for (const winner of column.winners) {
                  giveaway.winners.push({
                    status: column.status,
                    username: winner
                  });
                }
              }
            }
          }
        }
      } else {
        games[id].push(giveaway);
      }
    }
    if (found) {
      return true;
    }
  }

  async function ugd_requestGiveawaysDone(obj) {
    if (obj.key !== `sent`) {
      await ugd_requestGiveawaysDone_2(obj);
      return;
    }

    // check if there are winners of a giveaway in the 'awaiting feedback' status so they can be updated
    const types = [`apps`, `subs`];
    for (const type of types) {
      const games = obj.userGiveaways.sent[type];
      for (const id in games) {
        const game = games[id];
        for (const item of game) {
          const giveaway = typeof item === `string` ? obj.giveaways[item] || esgst.giveaways[item] : item;
          if (!giveaway || !Array.isArray(giveaway.winners)) {
            break;
          }

          let i;
          for (i = giveaway.winners.length - 1; i > -1; i--) {
            const winner = giveaway.winners[i];
            if (winner.status !== `Received` && winner.status !== `Not Received`) {
              break;
            }
          }
          if (i > -1) {
            const code = giveaway.code;
            if (code) {
              obj.giveaways[code] = giveaway;
            }
            obj.requests.push({
              giveaway: giveaway,
              request: ugd_requestGiveaway,
              url: `/giveaway/${code}/_/winners/search?page=`
            });
          }
        }
      }
    }
    obj.requests.push(ugd_requestGiveawaysDone_2);
  }

  async function ugd_requestGiveawaysDone_2(obj) {
    const lpvCache = JSON.parse(getLocalValue(`lpvCache`, `{}`));
    lpvCache.difference = 0;
    setLocalValue(`lpvCache`, JSON.stringify(lpvCache));

    obj.userGiveaways[`${obj.key}Timestamp`] = obj.timestamp;
    await lockAndSaveGiveaways(obj.giveaways);

    obj.user.values = {
      giveaways: obj.userGiveaways,
      ugd: null
    };

    if (!obj.popup) {
      await saveUser(null, null, obj.user);
      return;
    }

    obj.popup.setProgress(`Calculating results...`);

    obj.games = obj.userGiveaways[obj.key];
    obj.perType = {};
    obj.typeTotal = {};
    obj.levelTotal = new Array(11).fill(0);
    obj.total = 0;
    obj.lists = {};
    if (obj.key === `sent`) {
      obj.lists.gameName = {
        name: `Most given away:`,
        values: []
      };
      obj.lists.username = {
        name: [{
          text: `Most sent to: `,
          type: `node`
        }, obj.user.username === esgst.username ? null : {
          attributes: {
            class: `fa fa-question-circle`,
            title: `This list might not be 100% accurate if the user has giveaways for more than 3 copies that you cannot access.`
          },
          type: `i`
        }],
        values: []
      };
    } else {
      obj.lists.creator = {
        name: `Most won from:`,
        values: []
      };
    }
    const types = {
      public: `Everyone`,
      regionRestricted: {
        name: `Region`,
        combo: [`inviteOnly`, `group`, `whitelist`]
      },
      inviteOnly: `Invite`,
      group: {
        name: `Group`,
        combo: [`whitelist`]
      },
      whitelist: `Whitelist`
    };
    const selectors = [];
    for (const key in types) {
      const type = types[key];
      if (typeof type === `string`) {
        selectors.push(type);
      } else {
        selectors.push(type.name);
        for (const combo of type.combo) {
          const comboType = types[combo];
          selectors.push(`${type.name}_${typeof comboType === `string` ? comboType : comboType.name}`);
          if (comboType.combo) {
            for (const subCombo of comboType.combo) {
              const subComboType = types[subCombo];
              selectors.push(`${type.name}_${typeof comboType === `string` ? comboType : comboType.name}_${typeof subComboType === `string` ? subComboType : subComboType.name}`);
            }
          }
        }
      }
    }
    for (const selector of selectors) {
      obj.perType[selector] = new Array(11).fill(0);
      obj.typeTotal[selector] = 0;
    }
    obj.savedGiveaways = JSON.parse(await getValue(`giveaways`));
    await ugd_count(obj, obj.games.apps, obj.savedGiveaways, types);
    await ugd_count(obj, obj.games.subs, obj.savedGiveaways, types);

    const results = obj.popup.getScrollable();

    const heading = [`Type`];
    for (let i = 0; i < 11; i++) {
      heading.push(`Level ${i}`);
    }
    heading.push(`Total`);
    const table = new Table([
      heading
    ]);
    for (const key in obj.perType) {
      const item = obj.perType[key];
      const columns = [key.replace(/_/g, ` + `)];
      for (let i = 0; i < 11; i++) {
        const value = item[i];
        columns.push(value);
      }
      const typeTotal = obj.typeTotal[key];
      const total = Math.round(typeTotal / obj.total * 10000) / 100;
      columns.push(`${typeTotal} (${total}%)`);
      table.addRow(columns);
    }
    const columns = [`Total`];
    for (let i = 0; i < 11; i++) {
      const levelTotal = obj.levelTotal[i];
      const total = Math.round(levelTotal / obj.total * 10000) / 100;
      columns.push(`${levelTotal} (${total}%)`);
    }
    columns.push(obj.total);
    table.addRow(columns);
    results.appendChild(table.table);

    for (const key in obj.lists) {
      const array = [];
      const list = obj.lists[key];
      const values = list.values;
      for (const selector in values) {
        const item = values[selector];
        item.name = selector;
        array.push(item);
      }
      list.values = sortArray(array, true, `value`);
    }

    if (
      obj.key !== `won` ||
      (!esgst.ugd_getPlaytime && !esgst.ugd_getAchievements) ||
      !esgst.steamApiKey
    ) {
      await ugd_complete(obj, results);
      await saveUser(null, null, obj.user);
      return;
    }

    obj.playtimeTable = new Table([
      [
        {
          alignment: `left`,
          size: `fill`,
          value: `Game`
        },
        `Playtime (Last 2 Weeks)`,
        `Playtime (Forever)`,
        `Achievements`,
        `Gifter`
      ]
    ]);
    if (!esgst.ugd_getPlaytime) {
      obj.playtimeTable.hideColumns(2, 3);
    }
    if (!esgst.ugd_getAchievements) {
      obj.playtimeTable.hideColumns(4);
    }

    obj.isUpdating = false;
    const currentTime = Date.now();
    if (
      !obj.ugdCache ||
      (currentTime - obj.ugdCache.lastCheck) > 604800000 ||
      (esgst.ugd_getPlaytime && !Object.keys(obj.ugdCache.playtimes).length) ||
      (esgst.ugd_getAchievements && !Object.keys(obj.ugdCache.achievements).length) ||
      esgst.ugd_forceUpdate
    ) {
      obj.isUpdating = true;
      if (!obj.ugdCache) {
        obj.ugdCache = {
          achievements: {},
          playtimes: {}
        };
      }
      obj.ugdCache.lastCheck = currentTime;
    }

    obj.playtimes = null;
    if (esgst.ugd_getPlaytime && obj.isUpdating) {
      obj.popup.setProgress(`Retrieving playtime stats...`);
      obj.ugdCache.playtimes = {};
      try {
        const response = await request({
          method: `GET`,
          url: `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${esgst.steamApiKey}&steamid=${obj.user.steamId}&format=json`
        });
        const responseText = response.responseText;
        obj.playtimes = JSON.parse(responseText).response.games;
      } catch (e) {
        console.log(e);
        alert(`An error ocurred when retrieving playtime stats. Please check your Steam API key in the settings menu or try again later.`);
        await ugd_complete(obj, results);
        await saveUser(null, null, obj.user);
        return;
      }
    }
    if (esgst.ugd_getAchievements && obj.isUpdating) {
      obj.ugdCache.achievements = {};
    }

    obj.playedCount = 0;
    obj.achievementCount = 0;
    obj.achievementTotal = 0;
    obj.appsTotal = Object.keys(obj.games.apps).length;
    obj.subsTotal = Object.keys(obj.games.subs).length;
    const total = obj.appsTotal + obj.subsTotal;
    for (const id in obj.games.apps) {
      await ugd_addGame(obj, id);
      obj.appsTotal--;
    }
    let gcCache = JSON.parse(getLocalValue(`gcCache`, `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`));
    if (gcCache.version !== 7) {
      gcCache = {
        apps: {},
        subs: {},
        hltb: gcCache.hltb,
        timestamp: 0,
        version: 7
      };
    }
    if (!gcCache.hltb) {
      gcCache.hltb = {};
    }
    for (const id in obj.games.subs) {
      let apps = gcCache.subs[id] && gcCache.subs[id].apps;
      if (!apps) {
        try {
          const response = await request({
            method: `GET`,
            url: `http://store.steampowered.com/api/packagedetails?packageids=${id}&filters=basic`
          });
          const responseText = response.responseText;
          const responseJson = JSON.parse(responseText);
          apps = responseJson[id].data.apps;
          if (!gcCache.subs[id]) {
            gcCache.subs[id] = {};
          }
          gcCache.subs[id].apps = apps.map(x => parseInt(x.id));
        } catch (e) { /**/ }
      }
      if (apps) {
        for (const app of apps) {
          obj.packagePlayed = false;
          obj.packageAchieved = false;
          await ugd_addGame(obj, app.id, id, app.name);
        }
      }
      obj.subsTotal--;
    }
    setLocalValue(`gcCache`, JSON.stringify(gcCache));

    results.appendChild(obj.playtimeTable.table);
    const items = [];
    if (esgst.ugd_getPlaytime) {
      items.push({
        attributes: {
          class: `esgst-bold`
        },
        text: `${obj.playedCount} out of ${total} games with more than 0 hours playtime (${Math.round(obj.playedCount / total * 10000) / 100}%)`,
        type: `div`
      });
    }
    if (esgst.ugd_getAchievements) {
      items.push({
        attributes: {
          class: `esgst-bold`
        },
        text: `${obj.achievementCount} out of ${obj.achievementTotal} games with more than 0 achievements (${Math.round(obj.achievementCount / Math.max(1, obj.achievementTotal) * 10000) / 100}%)`,
        type: `div`
      });
    }
    createElements(results, `beforeEnd`, items);

    await ugd_complete(obj, results);

    obj.user.values.ugdCache = obj.ugdCache;
    await saveUser(null, null, obj.user);
  }

  async function ugd_addGame(obj, id, packageId, name) {
    const appId = parseInt(id);
    let i;
    if (obj.playtimes) {
      for (i = obj.playtimes.length - 1; i > -1 && obj.playtimes[i].appid !== appId; i--);
    }
    const giveaways = obj.games[packageId ? `subs` : `apps`][packageId || id];
    const item = giveaways[0];
    const giveaway = typeof item === `string` ? obj.savedGiveaways[item] : item;
    let timestamp2Weeks = 0;
    let timestampForever = 0;
    let time2Weeks = 0;
    let timeForever = 0;
    let achievementsAttributes = null;
    let achievements = `?`;
    if (esgst.ugd_getPlaytime && (i > -1 || obj.ugdCache.playtimes[appId])) {
      if (obj.isUpdating) {
        const game = obj.playtimes[i];
        timestamp2Weeks = game.playtime_2weeks || 0;
        timestampForever = game.playtime_forever;
        obj.ugdCache.playtimes[appId] = [timestamp2Weeks, timestampForever];
      } else {
        [timestamp2Weeks, timestampForever] = obj.ugdCache.playtimes[appId];
      }
      if (timestampForever > 0 && (!packageId || !obj.packagePlayed)) {
        obj.playedCount += 1;
        obj.packagePlayed = true;
      }
      time2Weeks = timestamp2Weeks && timestamp2Weeks > 0 ? (
        timestamp2Weeks > 60
        ? `${Math.round(timestamp2Weeks / 60 * 100) / 100}h`
        : `${timestamp2Weeks}m`
      ) : `0`;
      timeForever = timestampForever > 0 ? (
        timestampForever > 60
          ? `${Math.round(timestampForever / 60 * 100) / 100}h`
          : `${timestampForever}m`
        ) : `0`;
    }
    let count = 0;
    let total = 0;
    if (esgst.ugd_getAchievements) {
      let achievementsData = obj.ugdCache && obj.ugdCache.achievements[appId];
      if (obj.isUpdating) {
        obj.popup.setProgress(`Retrieving achievement stats for ${giveaway.gameName || packageId} (${packageId ? `${obj.subsTotal} packages` : obj.appsTotal} left)...`);
        const response = await request({
          method: `GET`,
          url: `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${esgst.steamApiKey}&steamid=${obj.user.steamId}`
        });
        const responseText = response.responseText;
        const responseJson = JSON.parse(responseText).playerstats;
        if (responseJson.success) {
          achievementsData = responseJson.achievements;
        }
      }
      achievements = `0/0`;
      if (achievementsData) {
        if (obj.isUpdating) {
          for (const achievement of achievementsData) {
            if (achievement.achieved) {
              count += 1;
            }
            total += 1;
          }
          achievementsAttributes = Math.round(count / total * 10000) / 100;
          achievements = `${count}/${total} (${achievementsAttributes}%)`;
          obj.ugdCache.achievements[appId] = achievements;
        } else {
          const parts = achievementsData.match(/(.+?)\/(.+?)\s\((.+?)%\)/);
          count = parseInt(parts[1]);
          total = parseInt(parts[2]);
          achievementsAttributes = parseFloat(parts[3]);
          achievements = achievementsData;
        }
        if (!packageId || !obj.packageAchieved) {
          if (count > 0) {
            obj.achievementCount += 1;
          }
          obj.achievementTotal += 1;
          obj.packageAchieved = true;
        }
      }
    }
    let group = null;
    if (packageId) {
      group = obj.playtimeTable.getRowGroup(packageId);
      if (!group) {
        obj.playtimeTable.addRow([
          {
            alignment: `left`,
            size: `fill`,
            value: giveaway.gameName
          },
          {
            attributes: [`data-sort-value="0"`],
            value: `0`
          },
          {
            attributes: [`data-sort-value="0"`],
            value: `0`
          },
          {
            attributes: [`data-sort-value="0"`],
            value: `0/0 (0%)`
          },
          [{
            attributes: {
              class: `table__column__secondary-link`,
              href: `/user/${giveaway.creator}`
            },
            text: giveaway.creator,
            type: `a`
          }]
        ], packageId, true, false, `Hide contents of the package`, `Show contents of the package`);
      }
      group = obj.playtimeTable.getRowGroup(packageId);
      const packageTimestamp2Weeks = (parseFloat(group.columns[1].textContent) * 60) + timestamp2Weeks;
      const packageTime2Weeks = packageTimestamp2Weeks && packageTimestamp2Weeks > 0 ? (
        packageTimestamp2Weeks > 60
        ? `${Math.round(packageTimestamp2Weeks / 60 * 100) / 100}h`
        : `${packageTimestamp2Weeks}m`
      ) : `0`;
      group.columns[1].textContent = packageTime2Weeks;
      group.columns[1].setAttribute(`data-sort-value`, packageTimestamp2Weeks);
      const packageTimestampForever = (parseFloat(group.columns[2].textContent) * 60) + timestampForever;
      const packageTimeForever = packageTimestampForever && packageTimestampForever > 0 ? (
        packageTimestampForever > 60
        ? `${Math.round(packageTimestampForever / 60 * 100) / 100}h`
        : `${packageTimestampForever}m`
      ) : `0`;
      group.columns[2].textContent = packageTimeForever;
      group.columns[2].setAttribute(`data-sort-value`, packageTimestampForever);
      const packageParts = group.columns[3].textContent.match(/(.+?)\/(.+?)\s\((.+?)%\)/);
      const packageCount = parseInt(packageParts[1]) + count;
      const packageTotal = parseInt(packageParts[2]) + total;
      const packageAchievementsAttributes = Math.round(packageCount / packageTotal * 10000) / 100;
      const packageAchievements = `${packageCount}/${packageTotal} (${packageAchievementsAttributes}%)`;
      group.columns[3].textContent = packageAchievements;
      group.columns[3].setAttribute(`data-sort-value`, packageAchievementsAttributes);
    }
    obj.playtimeTable.addRow([
      {
        alignment: `left`,
        size: `fill`,
        value: packageId ? name : giveaway.gameName
      },
      {
        attributes: [`data-sort-value="${timestamp2Weeks}"`],
        value: time2Weeks
      },
      {
        attributes: [`data-sort-value="${timestampForever}"`],
        value: timeForever
      },
      {
        attributes: [`data-sort-value="${achievementsAttributes}"`],
        value: achievements
      },
      [{
        attributes: {
          class: `table__column__secondary-link`,
          href: `/user/${giveaway.creator}`
        },
        text: giveaway.creator,
        type: `a`
      }]
    ], packageId, false, true);
  }

  async function ugd_count(obj, games, savedGiveaways, types) {
    for (const id in games) {
      const giveaways = games[id];
      for (const item of giveaways) {
        const giveaway = typeof item === `string` ? savedGiveaways[item] : item;
        let selector = ``;
        for (const key in types) {
          const type = types[key];
          if (giveaway[key]) {
            selector += typeof type === `string` ? type : type.name;
            selector += `_`;
          }
        }
        selector = selector.slice(0, -1);
        if (!selector) {
          selector = `Everyone`;
        }
        const level = giveaway.level;
        const isArrayWinners = Array.isArray(giveaway.winners);
        const winners = isArrayWinners ? giveaway.winners.filter(x => x.status === `Received`) : giveaway.winners;
        const copies = obj.key === `sent` ? isArrayWinners ? winners.length : giveaway.copies : 1;
        obj.perType[selector][level] += copies;
        obj.typeTotal[selector] += copies;
        obj.levelTotal[level] += copies;
        obj.total += copies;
        for (const key in obj.lists) {
          const list = obj.lists[key];
          const values = list.values;
          const selectors = key === `username` ? winners : [giveaway];
          if (!Array.isArray(selectors)) {
            continue;
          }
          for (const selector of selectors) {
            const value = selector[key];
            if (!values[value]) {
              values[value] = {
                gameSteamId: giveaway.gameSteamId,
                gameType: giveaway.gameType,
                value: 0,
                values: []
              };
            }
            values[value].value += (key === `username` ? 1 : copies);
            values[value].values.push(giveaway.gameName);
          }
        }
      }
    }
  }

  async function ugd_requestGiveaway(obj, details, response, responseHtml) {
    console.log(`ESGST Log: UGD 4`);
    const msg = `Retrieving giveaway winners (${details.giveaway.gameName})...`;
    if (obj.popup) {
      obj.popup.setProgress(msg);
    } else {
      obj.mainPopup.progress.lastElementChild.textContent = msg;
    }

    if (responseHtml.getElementsByClassName(`table--summary`)[0]) {
      return true;
    }
    console.log(`ESGST Log: UGD 5`);

    const elements = responseHtml.getElementsByClassName(`table__row-inner-wrap`);
    const n = elements.length;
    for (let i = 0; i < n; i++) {
      const element = elements[i];
      details.giveaway.winners.push({
        status: element.lastElementChild.textContent.trim(),
        username: element.firstElementChild.nextElementSibling.firstElementChild.textContent.trim()
      });
    }
    if (details.nextPage === 1) {
      details.url = `${response.finalUrl}/search?page=`;
    }
  }

  async function ugd_complete(obj, results) {
    const items = [{
      attributes: {
        class: `esgst-ugd-lists esgst-text-center markdown`
      },
      type: `div`,
      children: []
    }];
    for (const key in obj.lists) {
      const list = obj.lists[key];
      const values = list.values;
      const listItems = [];
      for (const item of values) {
        listItems.push({
          type: `li`,
          children: [{
            text: `${item.name} - `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-bold`
            },
            text: item.value,
            type: `span`
          }, key === `username` ? {
            attributes: {
              class: `fa fa-question-circle`,
              title: item.values.join(`, `)
            },
            type: `i`
          } : null]
        });
      }
      items[0].children.push({
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: Array.isArray(list.name) ? `` : list.name,
          type: `div`,
          children: Array.isArray(list.name) ? list.name : null
        }, {
          type: `ol`,
          children: listItems
        }]
      });
    }
    createElements(results, `beforeEnd`, items);
    await endless_load(results);
  }

