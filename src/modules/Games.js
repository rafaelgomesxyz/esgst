import {utils} from '../lib/jsUtils'
import Module from '../class/Module';

class Games extends Module {
  info = ({
    endless: true,
    id: `games`,
    load: this.games
  });

  games() {
    this.esgst.endlessFeatures.push(this.games_load);
  }

  async games_load(context, main, source, endless) {
    let games = this.games_get(context, main, endless ? this.esgst.games : JSON.parse(await getValue(`games`)), endless);
    if (!Object.keys(games.apps).length && !Object.keys(games.subs).length) return;
    [`apps`, `subs`].forEach(type => {
      for (let id in games[type]) {
        games[type][id].forEach(game => {
          this.esgst[main ? `mainGames` : `popupGames`].push({
            code: id,
            innerWrap: game.headingName,
            name: game.name,
            outerWrap: game.headingName,
            type: type
          });
        });
      }
    });
    for (const feature of this.esgst.gameFeatures) {
      await feature(games, main, source, endless, `apps`);
    }
    for (const id in games.apps) {
      games.apps[id].forEach(game => this.esgst.modules.giveaways.giveaways_reorder(game));
    }
    for (const id in games.subs) {
      games.subs[id].forEach(game => this.esgst.modules.giveaways.giveaways_reorder(game));
    }
  }

  games_get(context, main, savedGames, endless) {
    let game, games, i, id, info, matches, n, headingQuery, matchesQuery, type;
    games = {
      apps: {},
      subs: {},
      all: []
    };
    if (this.esgst.discussionPath && main) {
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
      game.outerWrap = game.container;
      game.columns = game.container.querySelector(`.giveaway__columns, .featured__columns`);
      game.table = game.container.closest(`table`) ? true : false;
      game.grid = game.container.closest(`.esgst-gv-view`);
      if (game.grid) {
        game.gvIcons = game.container.getElementsByClassName(`esgst-gv-icons`)[0];
      }
      game.panel = game.container.querySelector(`.esgst-giveaway-panel`);
      info = this.games_getInfo(game.container);
      game.heading = game.container.querySelector(headingQuery);
      if (info && game.heading) {
        game.headingName = game.heading.querySelector(`.featured__heading__medium, .giveaway__heading__name`) || game.heading;
        game.name = game.headingName.textContent;
        id = info.id;
        type = info.type;
        game.id = id;
        game.type = type;
        if (this.esgst.updateHiddenGames && location.pathname.match(/^\/account\/settings\/giveaways\/filters/) && main) {
          const removeButton = game.container.getElementsByClassName(`table__remove-default`)[0];
          if (removeButton) {
            removeButton.addEventListener(`click`, this.esgst.modules.common.updateHiddenGames.bind(null, id, type, true));
          }
        }
        if (!games[type][id]) {
          games[type][id] = [];
        }
        game.tagContext = (game.container.closest(`.poll`) && game.container.getElementsByClassName(`table__column__heading`)[0]) || game.heading.lastElementChild || game.heading;
        game.tagPosition = `afterEnd`;
        game.saved = this.esgst.games[type][id];
        games[type][id].push(game);
        games.all.push(game);
      }
    }
    return games;
  }

  games_getInfo(context) {
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
      for (const id in this.esgst.games.apps) {
        if (this.esgst.games.apps[id].name === name) {
          return {
            type: `apps`,
            id: id
          };
        }
      }
      for (const id in this.esgst.games.subs) {
        if (this.esgst.games.subs[id].name === name) {
          return {
            type: `subs`,
            id: id
          };
        }
      }
      this.esgst.modules.common.request({method: `GET`, url: heading.getAttribute(`href`)}).then(async response => {
        const html = utils.parseHtml(response.responseText);
        const giveaway = (await this.esgst.modules.giveaways.giveaways_get(html, false, response.finalUrl))[0];
        if (giveaway && giveaway.gameType && giveaway.gameSteamId) {
          const games = {
            apps: {},
            subs: {}
          };
          games[giveaway.gameType][giveaway.gameSteamId] = {
            name
          };
          this.esgst.mainGiveaways.map(x => {
            if (x.name !== name || x.id) {
              return x;
            }
            x.id = giveaway.gameSteamId;
            x.type = giveaway.gameType;
            if (this.esgst.games && this.esgst.games[x.type][x.id]) {
              const keys = [`owned`, `wishlisted`, `followed`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
              for (const key of keys) {
                if (this.esgst.games[x.type][x.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
                  x[key] = true;
                }
              }
            }
            return x;
          });
          if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
            this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf);
          }
          this.esgst.modules.common.lockAndSaveGames(games);
        }
      });
    } else {
      return null;
    }
  }
}

export default Games;