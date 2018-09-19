_MODULES.push({
    endless: true,
    id: `games`,
    load: games
  });

  function games() {
    esgst.endlessFeatures.push(games_load);
  }

  async function games_load(context, main, source, endless) {
    let games = games_get(context, main, endless ? esgst.games : JSON.parse(await getValue(`games`)), endless);
    if (!Object.keys(games.apps).length && !Object.keys(games.subs).length) return;
    [`apps`, `subs`].forEach(type => {
      for (let id in games[type]) {
        games[type][id].forEach(game => {
          esgst[main ? `mainGames` : `popupGames`].push({
            code: id,
            innerWrap: game.headingName,
            name: game.name,
            outerWrap: game.headingName,
            type: type
          });
        });
      }
    });
    for (const feature of esgst.gameFeatures) {
      await feature(games, main, source, endless, `apps`);
    }
  }

  function games_get(context, main, savedGames, endless) {
    let game, games, i, id, info, matches, n, headingQuery, matchesQuery, type;
    games = {
      apps: {},
      subs: {},
      all: []
    };
    if (esgst.discussionPath && main) {
      matchesQuery = `${endless ? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway` : `.featured__outer-wrap--giveaway`}, ${endless ? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap` : `.giveaway__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap` : `.table__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .markdown table td, .esgst-es-page-${endless}.markdown table td` : `.markdown table td`}`;
      headingQuery = `.featured__heading, .giveaway__heading, .table__column__heading, a`;
    } else {
      matchesQuery = `${endless ? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway` : `.featured__outer-wrap--giveaway`}, ${endless ? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap` : `.giveaway__row-outer-wrap`}, ${endless ? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap` : `.table__row-outer-wrap`}`;
      headingQuery = `.featured__heading, .giveaway__heading, .table__column__heading`;
    }
    matches = context.querySelectorAll(matchesQuery);
    for (i = 0, n = matches.length; i < n; ++i) {
      game = {
        container: matches[i]
      };
      game.columns = game.container.querySelector(`.giveaway__columns, .featured__columns`);
      game.table = game.container.closest(`table`) ? true : false;
      game.grid = game.container.closest(`.esgst-gv-view`);
      if (game.grid) {
        game.gvIcons = game.container.getElementsByClassName(`esgst-gv-icons`)[0];
      }
      info = games_getInfo(game.container);
      game.heading = game.container.querySelector(headingQuery);
      if (info && game.heading) {
        game.headingName = game.heading.querySelector(`.featured__heading__medium, .giveaway__heading__name`) || game.heading;
        game.name = game.headingName.textContent;
        id = info.id;
        type = info.type;
        game.id = id;
        game.type = type;
        if (esgst.updateHiddenGames && location.pathname.match(/^\/account\/settings\/giveaways\/filters/) && main) {
          const removeButton = game.container.getElementsByClassName(`table__remove-default`)[0];
          if (removeButton) {
            removeButton.addEventListener(`click`, updateHiddenGames.bind(null, id, type, true));
          }
        }
        if (!games[type][id]) {
          games[type][id] = [];
        }
        game.tagContext = (game.container.closest(`.poll`) && game.container.getElementsByClassName(`table__column__heading`)[0]) || game.heading.lastElementChild || game.heading;
        game.tagPosition = `afterEnd`;
        game.saved = esgst.games[type][id];
        games[type][id].push(game);
        games.all.push(game);
      }
    }
    return games;
  }

  function games_getInfo(context) {
    const missing = context.querySelector(`.table_image_thumbnail_missing`);
    const link = context.querySelector(`[href*="/app/"], [href*="/sub/"]`);
    const image = context.querySelector(`[style*="/apps/"], [style*="/subs/"]`);
    if (link || image) {
      const url = (link && link.getAttribute(`href`)) || (image && image.getAttribute(`style`));
      if (url) {
        const info = url.match(/\/(app|sub)s?\/(\d+)/);
        return {
          type: `${info[1]}s`,
          id: info[2]
        };
      } else {
        return null;
      }
    } else if (missing) {
      const heading = context.querySelector(`.table__column__heading`);
      if (!heading) {
        return null;
      }
      const name = heading.textContent.trim();
      for (const id in esgst.games.apps) {
        if (esgst.games.apps[id].name === name) {
          return {
            type: `apps`,
            id: id
          };
        }
      }
      for (const id in esgst.games.subs) {
        if (esgst.games.subs[id].name === name) {
          return {
            type: `subs`,
            id: id
          };
        }
      }
      request({method: `GET`, url: heading.getAttribute(`href`)}).then(async response => {
        const html = parseHtml(response.responseText);
        const giveaway = (await giveaways_get(html, false, response.finalUrl))[0];
        if (giveaway && giveaway.gameType && giveaway.gameSteamId) {
          const games = {
            apps: {},
            subs: {}
          };
          games[giveaway.gameType][giveaway.gameSteamId] = {
            name
          };
          esgst.mainGiveaways.map(x => {
            if (x.name !== name || x.id) {
              return x;
            }
            x.id = giveaway.gameSteamId;
            x.type = giveaway.gameType;
            if (esgst.games && esgst.games[x.type][x.id]) {
              const keys = [`owned`, `wishlisted`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
              for (const key of keys) {
                if (esgst.games[x.type][x.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
                  x[key] = true;
                }
              }
            }
            return x;
          });
          if (esgst.gf && esgst.gf.filteredCount && esgst[`gf_enable${esgst.gf.type}`]) {
            filters_filter(esgst.gf);
          }
          lockAndSaveGames(games);
        }
      });
    } else {
      return null;
    }
  }

