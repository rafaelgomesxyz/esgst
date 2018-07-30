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
    if (esgst.gc && (!esgst.menuPath || esgst.gbPath || esgst.gedPath || esgst.gePath)) {
      gc_getGames(games, endless);
    }
    if (esgst.mm_enableGames && esgst.mm_enable) {
      esgst.mm_enable(esgst[main ? `mainGames` : `popupGames`], `Games`);
    }
  }

  function games_get(context, main, savedGames, endless) {
    let game, games, i, id, info, matches, n, headingQuery, matchesQuery, type;
    games = {
      apps: {},
      subs: {}
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
        if (esgst.updateHiddenGames && location.pathname.match(/^\/account\/settings\/giveaways\/filters/) && main) {
          const removeButton = game.container.getElementsByClassName(`table__remove-default`)[0];
          if (removeButton) {
            removeButton.addEventListener(`click`, updateHiddenGames.bind(null, id, type, true));
          }
        }
        if (!games[type][id]) {
          games[type][id] = [];
        }
        if (esgst.wishlistPath && main && esgst.cwsl) {
          let giveawayCount = game.heading.parentElement.nextElementSibling.nextElementSibling;
          createElements(giveawayCount, `inner`, [{
            attributes: {
              class: `table__column__secondary-link`,
              href: `/giveaways/search?${type.slice(0, -1)}=${id}`
            },
            type: `a`,
            children: [...(Array.from(giveawayCount.childNodes).map(x => {
              return {
                context: x
              };
            }))]
          }]);
        }
        if (esgst.egh) {
          if (esgst.giveawayPath) {
            let button = document.querySelector(`.sidebar__entry-insert`);
            if (button) {
              button.addEventListener(`click`, egh_saveGame.bind(null, id, type));
            }
          }
          if (!esgst.menuPath && savedGames[type][id] && savedGames[type][id].entered && !game.container.getElementsByClassName(`esgst-egh-button`)[0]) {
            createElements((game.container.closest(`.poll`) && game.container.getElementsByClassName(`table__column__heading`)[0]) || game.headingName, `beforeBegin`, [{
              attributes: {
                class: `esgst-egh-button`,
                title: getFeatureTooltip(`egh`, `You have entered giveaways for this game before. Click to unhighlight it`)
              },
              type: `a`,
              children: [{
                attributes: {
                  class: `fa fa-star esgst-egh-icon`
                },
                type: `i`
              }]
            }]).addEventListener(`click`, egh_unhighlightGame.bind(null, id, type));
          }
        }
        if (esgst.gt) {
          if (!game.container.getElementsByClassName(`esgst-gt-button`)[0]) {
            createElements((game.container.closest(`.poll`) && game.container.getElementsByClassName(`table__column__heading`)[0]) || game.heading.lastElementChild || game.heading, `afterEnd`, [{
              attributes: {
                class: `esgst-faded esgst-gt-button`,
                title: getFeatureTooltip(`gt`, `Edit game tags`)
              },
              type: `a`,
              children: [{
                attributes: {
                  class: `fa fa-tag`
                },
                type: `i`
              }, {
                attributes: {
                  class: `esgst-gt-tags`
                },
                type: `span`
              }]
            }]).addEventListener(`click`, gt_openPopup.bind(null, id, game.name, type));
          }
          if (savedGames[type][id] && savedGames[type][id].tags) {
            gt_addTags([game], id, savedGames[type][id].tags, type);
          }
        }
        games[type][id].push(game);
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

