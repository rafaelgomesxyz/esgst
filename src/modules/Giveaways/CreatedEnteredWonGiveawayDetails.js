import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

class GiveawaysCreatedEnteredWonGiveawayDetails extends Module {
  constructor() {
    super();

    this.currentId = null;
    this.created = null;
    this.entered = null;
    this.won = null;
    this.giveaways = null;

    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds more details to each giveaway in your `,
            [`a`, { href: `https://www.steamgifts.com/giveaways/created` }, `created`],
            `/`,
            [`a`, { href: `https://www.steamgifts.com/giveaways/entered` }, `entered`],
            `/`,
            [`a`, { href: `https://www.steamgifts.com/giveaways/won` }, `won`],
            ` pages:`
          ]],
          [`ul`, [
            [`li`, `How many points the giveaway is worth next to the game's name.`],
            [`li`, [
              `An icon (`,
              [`i`, { class: `fa fa-steam` }],
              `) next to the game's name that links to the game's Steam store page.`
            ]],
            [`li`, `For the entered/won pages only, the creator's username next to the giveaway's end time.`],
            [`li`, `A column "Type" containing the giveaway's type (public, invite only, group, whitelist or region restricted).`],
            [`li`, `A column "Level" containing the giveaway's level.`],
            [`li`, `For the created page only, a column "Winner(s)" containing the giveaway's winner(s) and how many of them have marked it as received/not received.`]
          ]]
        ]]
      ],
      features: {
        cewgd_c: {
          name: `Enable for Created pages.`,
          sg: true,
          features: {
            cewgd_c_p: {
              name: `Points`,
              sg: true
            },
            cewgd_c_sl: {
              name: `Steam Link`,
              sg: true
            },
            cewgd_c_t: {
              name: `Type`,
              sg: true
            },
            cewgd_c_l: {
              name: `Level`,
              sg: true
            },
            cewgd_c_w: {
              name: `Winners`,
              sg: true
            }
          }
        },
        cewgd_e: {
          name: `Enable for Entered pages.`,
          sg: true,
          features: {
            cewgd_e_p: {
              name: `Points`,
              sg: true
            },
            cewgd_e_sl: {
              name: `Steam Link`,
              sg: true
            },
            cewgd_e_t: {
              name: `Type`,
              sg: true
            },
            cewgd_e_l: {
              name: `Level`,
              sg: true
            }
          }
        },
        cewgd_w: {
          name: `Enable for Won pages.`,
          sg: true,
          features: {
            cewgd_w_p: {
              name: `Points`,
              sg: true
            },
            cewgd_w_sl: {
              name: `Steam Link`,
              sg: true
            },
            cewgd_w_t: {
              name: `Type`,
              sg: true
            },
            cewgd_w_l: {
              name: `Level`,
              sg: true
            },
            cewgd_w_e: {
              name: `Entries`,
              sg: true
            }            
          }
        }
      },
      id: `cewgd`,
      name: `Created/Entered/Won Giveaway Details`,
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    if (shared.common.isCurrentPath(`My Giveaways - Created`) && gSettings.cewgd_c) {
      this.currentId = `cewgd_c`;
      this.created = true;
    } else if (shared.common.isCurrentPath(`My Giveaways - Entered`) && gSettings.cewgd_e) {
      this.currentId = `cewgd_e`;
      this.entered = true;
    } else if (shared.common.isCurrentPath(`My Giveaways - Won`) && gSettings.cewgd_w) {
      this.currentId = `cewgd_w`;
      this.won = true;
    }
    if (!this.currentId) {
      return;
    }
    shared.esgst.endlessFeatures.push(this.addHeading.bind(this));
    shared.esgst.giveawayFeatures.push((...args) => this.getGiveaways(...args));
  }

  addHeading(context, main, source, endless) {
    if (!main) {
      return;
    }
    const tableHeading = context.querySelector(
      shared.common.getSelectors(endless, [
        `X.table__heading`
      ])
    );
    if (!tableHeading || tableHeading.querySelector(`.esgst-cewgd-heading`)) {
      return;
    }
    const items = [];
    if (gSettings[`${this.currentId}_t`]) {
      items.push(
        [`div`, { class: `table__column--width-small text-center esgst-cewgd-heading` }, `Type`]
      );
    }
    if (gSettings[`${this.currentId}_l`]) {
      items.push(
        [`div`, { class: `table__column--width-small text-center esgst-cewgd-heading` }, `Level`]
      );
    }
    if (this.created && gSettings[`${this.currentId}_w`]) {
      items.push(
        [`div`, { class: `table__column--width-small text-center esgst-cewgd-heading` }, `Winner(s)`]
      );
    }
    if (this.won && gSettings[`${this.currentId}_e`]) {
      items.push(
        [`div`, { class: `table__column--width-small text-center esgst-cewgd-heading` }, `Entries`]
      );
    }
    shared.common.createElements_v2(tableHeading.firstElementChild, `afterEnd`, items);
  }

  async getGiveaways(giveaways, main) {
    if (!main) {
      return;
    }
    this.giveaways = {};
    const promises = [];
    for (const giveaway of giveaways) {
      promises.push(this.getGiveaway(giveaway));
    }
    await Promise.all(promises);
    await shared.common.lockAndSaveGiveaways(this.giveaways);
    if (main && shared.esgst.gf && shared.esgst.gf.filteredCount && gSettings[`gf_enable${shared.esgst.gf.type}`]) {
      shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gf);
    }
    if (!main && shared.esgst.gfPopup && shared.esgst.gfPopup.filteredCount && gSettings[`gf_enable${shared.esgst.gfPopup.type}`]) {
      shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gfPopup);
    }
  }

  async getGiveaway(giveaway) {
    const details = shared.esgst.giveaways[giveaway.code];
    let shouldUpdateWinners = false;    
    if (!giveaway.deleted && details && details.gameSteamId && Array.isArray(details.winners)) {
      shouldUpdateWinners = details.v !== shared.esgst.CURRENT_GIVEAWAY_VERSION || !details.winners.length || details.winners.filter(x => x.status !== `Received` && x.status !== `Not Received`).length > 0;
    }
    if (this.created && shouldUpdateWinners) {
      await this.fetchWinners(giveaway);
    } else if (giveaway.deleted || (details && details.gameSteamId && (!this.won || details.creator !== gSettings.username))) {
      this.addDetails(giveaway, details);
    } else {
      await this.fetchDetails(giveaway);
    }
  }

  async fetchDetails(giveaway) {    
    const response = await shared.common.request({
      method: `GET`,
      url: giveaway.url
    });
    const responseHtml = utils.parseHtml(response.responseText);
    const giveaways = await shared.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl);
    if (giveaways.length > 0) {
      const details = giveaways[0];
      this.giveaways[giveaway.code] = details;
      this.addDetails(giveaway, details);
    } else {
      this.addDetails(giveaway);
    }
  }

  async fetchWinners(giveaway) {
    let nextPage = 1; 
    let details = null;
    let pagination = null;
    do {
      const response = await shared.common.request({
        method: `GET`,
        url: `${giveaway.url}/winners/search?page=${nextPage}`
      });
      const responseHtml = utils.parseHtml(response.responseText);
      if (!details) {
        const giveaways = await shared.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl);
        if (giveaways.length > 0) {
          details = giveaways[0];
          details.winners = [];
        }
      }
      if (!details) {        
        this.addDetails(giveaway);
        return;
      }
      const elements = responseHtml.querySelectorAll(`.table__row-inner-wrap`);
      for (const element of elements) {
        details.winners.push({
          status: element.lastElementChild.textContent.trim(),
          username: element.firstElementChild.nextElementSibling.firstElementChild.textContent.trim()
        });
      }
      nextPage += 1;
      pagination = responseHtml.querySelector(`.pagination__navigation`);
    } while (pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    this.giveaways[giveaway.code] = details;
    this.addDetails(giveaway, details);
  }

  addDetails(giveaway, details) {
    if (!giveaway.id) {
      const steamGiftCard = giveaway.name.match(/^\$(.+?)\sSteam\sGift\sCard$/);
      if (steamGiftCard) {
        giveaway.points = parseInt(steamGiftCard[1].replace(/,/g, ``));
        giveaway.id = `SteamGiftCard${giveaway.points}`;
        giveaway.type = `apps`;
      } else {
        const humbleBundle = giveaway.name.match(/^Humble.+?Bundle/);
        if (humbleBundle) {
          giveaway.id = giveaway.name.replace(/\s/g, ``);
          giveaway.type = `apps`;
        } else if (details && details.gameSteamId && details.gameType) {
          giveaway.id = details.gameSteamId;
          giveaway.type = details.gameType;
        }
      }
    }
    if (giveaway.id) {
      const savedGame = shared.esgst.games[giveaway.type][giveaway.id];
      if (savedGame) {
        const keys = [`hidden`, `ignored`, `noCV`, `owned`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `wishlisted`];
        for (const key of keys) {
          if (savedGame[key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
            giveaway[key] = true;
          }
        }
      }
    }

    if (!giveaway.points) {
      if (details) {
        giveaway.points = details.points;
      } else if (giveaway.id) {
        const gcCache = JSON.parse(shared.common.getLocalValue(`gcCache`, `{}`));
        const data = gcCache && gcCache[giveaway.type] && gcCache[giveaway.type][giveaway.id];
        if (data && data.price > -1) {
          giveaway.points = data.price;
        }
      }
    }

    const headingItems = [];
    if (gSettings[`${this.currentId}_p`]) {
      headingItems.push(
        [`span`, ` (${details ? giveaway.points || 0 : `?`}P)`]
      );
    }
    if (giveaway.id && gSettings[`${this.currentId}_sl`]) {
      headingItems.push(
        [`a`, { class: `giveaway__icon`, href: `http://store.steampowered.com/${giveaway.type.slice(0, -1)}/${giveaway.id}`, target: `_blank` }, [
          [`i`, { class: `fa fa-steam`}]
        ]]
      );
    }
    shared.common.createElements_v2(giveaway.headingName, `afterEnd`, headingItems);

    for (const child of giveaway.heading.children) {
      if (child === giveaway.headingName || child.classList.contains(`giveaway__heading__name`) || child.classList.contains(`featured__heading__medium`)) {
        child.setAttribute(`data-draggable-id`, `name`);
        continue;
      }
      if (child.textContent.match(/\(.+?\sCopies\)/)) {
        child.setAttribute(`data-draggable-id`, `copies`);
        continue;
      }
      if (child.textContent.match(/\(.+?P\)/)) {
        child.setAttribute(`data-draggable-id`, `points`);
        continue;
      }
      const url = child.getAttribute(`href`);
      if (url) {
        if (url.match(/store.steampowered.com/)) {
          child.setAttribute(`data-draggable-id`, `steam`);
          continue;
        }
        if (url.match(/\/giveaways\/search/)) {
          child.setAttribute(`data-draggable-id`, `search`);
        }
      }
    }

    if (details) {
      giveaway.inviteOnly = details.inviteOnly;
      giveaway.group = details.group;
      giveaway.regionRestricted = details.regionRestricted;
      giveaway.whitelist = details.whitelist;
      giveaway.public = !giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist;
      giveaway.level = details.level;
      if (!giveaway.entries) {
        giveaway.entries = details.entries;
      }
    } else if (giveaway.deleted) {
      giveaway.public = false;
    } else {
      giveaway.blacklist = true;
    }
    giveaway.creator = (details && details.creator) || `-`;
    if (giveaway.creators.indexOf(giveaway.creator.toLowerCase()) < 0) {
      giveaway.creators.push(giveaway.creator.toLowerCase());
    }

    if (this.entered || this.won) {
      shared.common.createElements_v2(giveaway.endTimeColumn, `beforeEnd`, [
        ` by `,
        details
          ? [`a`, { class: `table__column__secondary-link`, href: `/user/${giveaway.creator}` }, giveaway.creator]
          : `?`
      ]);
    }

    const columnItems = [];
    if (gSettings[`${this.currentId}_t`]) {
      let type;
      if (giveaway.deleted) {
        type = `Deleted`
      } else if (giveaway.blacklist) {
        type = `Blacklist`;
      } else if (giveaway.inviteOnly) {
        if (giveaway.regionRestricted) {
          type = `Invite + Region`;
        } else {
          type = `Invite`;
        }
      } else if (giveaway.group) {
        if (giveaway.whitelist) {
          if (giveaway.regionRestricted) {
            type = `Group + Whitelist + Region`;
          } else {
            type = `Group + Whitelist`;
          }
        } else if (giveaway.regionRestricted) {
          type = `Group + Region`;
        } else {
          type = `Group`;
        }
      } else if (giveaway.whitelist) {
        if (giveaway.regionRestricted) {
          type = `Whitelist + Region`;
        } else {
          type = `Whitelist`;
        }
      } else if (giveaway.regionRestricted) {
        type = `Region`;
      } else if (giveaway.public) {
        type = `Public`;
      } else {
        type = `-`;
      }
      columnItems.push(
        [`div`, { class: `table__column--width-small text-center` }, type]
      );
    }
    if (gSettings[`${this.currentId}_l`]) {
      columnItems.push(
        [`div`, { class: `table__column--width-small text-center` }, details && utils.isSet(giveaway.level) ? giveaway.level : `-`]
      );
    }
    if (this.created && gSettings[`${this.currentId}_w`]) {
      let winners;
      const numWinners = (details && details.winners && details.winners.length) || 0;
      if (numWinners > 0) {
        winners = [];
        const firstWinner = details.winners[0].username;
        winners.push(
          [`a`, { class: `table__column__secondary-link`, href: `/user/${firstWinner}` }, firstWinner]
        );
        if (numWinners > 1) {
          winners.push(
            [`span`, { class: `esgst-clickable table__column__secondary-link`, onclick: this.openWinnersPopup.bind(this, details) }, ` (+${numWinners - 1} more)`]
          );
          let received = 0;
          for (const winner of details.winners) {
            if (winner.status === `Received`) {
              received += 1;
            }
          }
          giveaway.innerWrap.lastElementChild.insertAdjacentText(`beforeend`, ` (${received}/${numWinners})`);
        }
      } else {
        winners = `-`;
      }
      columnItems.push(
        [`div`, { class: `table__column--width-small text-center` }, winners]
      );
    }
    if (this.won && gSettings[`${this.currentId}_e`]) {
      columnItems.push(
        [`div`, { class: `table__column--width-small text-center` }, details && utils.isSet(giveaway.entries) ? giveaway.entries : `-`]
      );
    }
    shared.common.createElements_v2(giveaway.panel || giveaway.innerWrap.querySelector(`.table__column--width-fill`), `afterEnd`, columnItems);

    if (giveaway.gwcContext) {
      giveaway.chancePerPoint = Math.round(giveaway.chance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.projectedChancePerPoint = Math.round(giveaway.projectedChance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.gwcContext.title = shared.common.getFeatureTooltip(`gwc`, `Giveaway Winning Chance (${giveaway.chancePerPoint}% per point)`);
    }
    if (giveaway.gptwContext) {
      shared.esgst.modules.giveawaysGiveawayPointsToWin.gptw_addPoint(giveaway);
    }
    if (gSettings.cgb) {
      shared.esgst.modules.giveawaysCustomGiveawayBackground.color([giveaway]);
    }
    if (giveaway.group && gSettings.cl && gSettings.ggl) {
      shared.esgst.modules.generalContentLoader.loadGiveawayGroups(true, `ggl`, [giveaway]);
    }
  }

  openWinnersPopup(details) {
    const popup = new Popup({
      icon: `fa-users`,
      title: `Winners`,
      addScrollable: `left`
    });
    let html = [
      [`div`, { class: `table__heading` }, [
        [`div`, { class: `table__column--width-small` }, `Winner`],
        [`div`, { class: `table__column--width-small` }, `Received`]
      ]],
      [`div`, { class: `table__rows` }, []]
    ];
    for (const winner of details.winners) {
      let className = ``;
      switch (winner.status) {
        case `Received`:
          className = `fa fa-check-circle esgst-green`;
          break;
        case `Not Received`:
          className = `fa fa-times-circle esgst-red`;
          break;
        case `Awaiting Feedback`:
          className = `fa fa-question-circle esgst-grey`;
          break;
        default:
          break;
      }
      // @ts-ignore
      html[1][2].push(
        [`div`, { class: `table__row-outer-wrap` }, [
          [`div`, { class: `table__row-inner-wrap` }, [
            [`div`, { class: `table__column--width-small` }, [
              [`a`, { class: `table__column__secondary-link`, href: `/user/${winner.username}` }, winner.username]
            ]],
            [`div`, { class: `table__column--width-small` }, [
              [`i`, { class: className }]
            ]]
          ]]
        ]]
      );
    }
    popup.open();
    shared.common.endless_load(popup.getScrollable(html));
  }
}

const giveawaysCreatedEnteredWonGiveawayDetails = new GiveawaysCreatedEnteredWonGiveawayDetails();

export { giveawaysCreatedEnteredWonGiveawayDetails };