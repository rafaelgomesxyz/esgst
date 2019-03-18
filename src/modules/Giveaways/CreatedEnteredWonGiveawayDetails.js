import Module from '../../class/Module';
import Popup from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  createLock = common.createLock.bind(common),
  endless_load = common.endless_load.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  request = common.request.bind(common),
  setValue = common.setValue.bind(common)
  ;

class GiveawaysCreatedEnteredWonGiveawayDetails extends Module {
  constructor() {
    super();
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
      id: `cewgd`,
      load: this.cewgd,
      name: `Created/Entered/Won Giveaway Details`,
      sg: true,
      type: `giveaways`
    };
  }

  cewgd() {
    if (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath) return;
    this.esgst.endlessFeatures.push(this.cewgd_addHeading.bind(this));
    this.esgst.giveawayFeatures.push(this.cewgd_getDetails_pre.bind(this));
  }

  cewgd_addHeading(context, main, source, endless) {
    if (!main) return;
    const table = context.querySelector(`${endless ? `.esgst-es-page-${endless} .table__heading, .esgst-es-page-${endless}.table__heading` : `.table__heading`}`);
    if (!table || table.getElementsByClassName(`esgst-cewgd-heading`)[0]) return;
    const items = [{
      attributes: {
        class: `table__column--width-small text-center esgst-cewgd-heading`
      },
      text: `Type`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center esgst-cewgd-heading`
      },
      text: `Level`,
      type: `div`
    }];
    if (this.esgst.createdPath) {
      items.push({
        attributes: {
          class: `table__column--width-small text-center esgst-cewgd-heading`
        },
        text: `Winner(s)`,
        type: `div`
      });
    }
    createElements(table.firstElementChild, `afterEnd`, items);
  }

  cewgd_getDetails_pre(giveaways, main) {
    // noinspection JSIgnoredPromiseFromCall
    this.cewgd_getDetails(giveaways, main);
  }

  async cewgd_getDetails(giveaways, main) {
    if (!main) return;
    let cewgd = {
      giveaways: [],
      savedGiveaways: JSON.parse(getValue(`giveaways`, `{}`))
    };
    let promises = [];
    for (let i = 0, n = giveaways.length; i < n; ++i) {
      promises.push(this.cewgd_getDetail(cewgd, giveaways, i));
    }
    await Promise.all(promises);
    let deleteLock = await createLock(`giveawayLock`, 300);
    for (let i = 0, n = cewgd.giveaways.length; i < n; ++i) {
      let currentGiveaway = cewgd.giveaways[i];
      if (cewgd.savedGiveaways[currentGiveaway.code]) {
        for (let key in currentGiveaway) {
          if (currentGiveaway.hasOwnProperty(key)) {
            cewgd.savedGiveaways[currentGiveaway.code][key] = currentGiveaway[key];
          }
        }
      } else {
        cewgd.savedGiveaways[currentGiveaway.code] = currentGiveaway;
      }
    }
    await setValue(`giveaways`, JSON.stringify(cewgd.savedGiveaways));
    deleteLock();
    if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
      this.esgst.modules.filters.filters_filter(this.esgst.gf);
    }
    if (this.esgst.gfPopup && this.esgst.gfPopup.filteredCount && this.esgst[`gf_enable${this.esgst.gfPopup.type}`]) {
      this.esgst.modules.filters.filters_filter(this.esgst.gfPopup);
    }
  }

  async cewgd_getDetail(cewgd, giveaways, i) {
    let giveaway = giveaways[i];
    let code = giveaway.code;
    let j = 0;
    if (this.esgst.createdPath && cewgd.savedGiveaways[code] && cewgd.savedGiveaways[code].gameSteamId && Array.isArray(cewgd.savedGiveaways[code].winners) && cewgd.savedGiveaways[code].winners.length) {
      for (j = cewgd.savedGiveaways[code].winners.length - 1; j > -1; j--) {
        let winner = cewgd.savedGiveaways[code].winners[j];
        if (winner.status !== `Received` && winner.status !== `Not Received`) {
          break;
        }
      }
    }
    if (giveaway.deleted) {
      if (giveaway.id) {
        this.cewgd_addDetails(giveaway);
      } else {
        createElements(giveaway.panel || giveaway.innerWrap.querySelector(`.table__column--width-fill`), `afterEnd`, new Array(this.esgst.createdPath ? 3 : 2).fill({
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `-`,
          type: `div`
        }));
      }
    } else if (cewgd.savedGiveaways[code] && cewgd.savedGiveaways[code].gameSteamId && (!this.esgst.createdPath || j < 0) && (!this.esgst.wonPath || cewgd.savedGiveaways[code].creator !== this.esgst.username)) {
      this.cewgd_addDetails(giveaway, cewgd.savedGiveaways[code]);
    } else if (this.esgst.createdPath && (!cewgd.savedGiveaways[code] || !cewgd.savedGiveaways[code].deleted)) {
      let currentGiveaway = null;
      let nextPage = 1;
      let pagination = null;
      do {
        let response = await request({ method: `GET`, url: `${giveaway.url}/winners/search?page=${nextPage}` });
        let responseHtml = parseHtml(response.responseText);
        if (!currentGiveaway) {
          let currentGiveaways = await this.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl);
          if (currentGiveaways.length > 0) {
            currentGiveaway = currentGiveaways[0];
            currentGiveaway.winners = [];
          }
        }
        if (currentGiveaway) {
          let elements = responseHtml.getElementsByClassName(`table__row-inner-wrap`);
          for (let i = 0, n = elements.length; i < n; ++i) {
            let element = elements[i];
            currentGiveaway.winners.push({
              status: element.lastElementChild.textContent.trim(),
              username: element.firstElementChild.nextElementSibling.firstElementChild.textContent.trim()
            });
          }
          pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
        } else {
          if (giveaway.id) {
            this.cewgd_addDetails(giveaway);
          } else {
            createElements(giveaway.panel || giveaway.innerWrap.querySelector(`.table__column--width-fill`), `afterEnd`, new Array(this.esgst.createdPath ? 3 : 2).fill({
              attributes: {
                class: `table__column--width-small text-center`
              },
              text: `-`,
              type: `div`
            }));
          }
          pagination = null;
        }
        nextPage += 1;
      } while (pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      if (currentGiveaway) {
        cewgd.giveaways.push(currentGiveaway);
        this.cewgd_addDetails(giveaway, currentGiveaway);
      }
    } else {
      let response = await request({ method: `GET`, url: giveaway.url });
      let responseHtml = parseHtml(response.responseText);
      let currentGiveaways = await this.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl);
      if (currentGiveaways.length > 0) {
        let currentGiveaway = currentGiveaways[0];
        cewgd.giveaways.push(currentGiveaway);
        this.cewgd_addDetails(giveaway, currentGiveaway);
        cewgd.count += 1;
      } else if (giveaway.id) {
        this.cewgd_addDetails(giveaway);
      } else {
        createElements(giveaway.panel || giveaway.innerWrap.querySelector(`.table__column--width-fill`), `afterEnd`, new Array(this.esgst.createdPath ? 3 : 2).fill({
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `-`,
          type: `div`
        }));
      }
    }
  }

  cewgd_addDetails(giveaway, details) {
    let type, typeColumn;
    if (!giveaway.id) {
      const steamGiftCard = giveaway.name.match(/^\$(.+?)\sSteam\sGift\sCard$/);
      if (steamGiftCard) {
        giveaway.points = parseInt(steamGiftCard[1].replace(/,/g, ``));
        giveaway.id = `SteamGiftCard${giveaway.points}`;
        giveaway.type = `apps`;
      } else if (details.gameSteamId && details.gameType) {
        giveaway.id = details.gameSteamId;
        giveaway.type = details.gameType;
      } else {
        const humbleBundle = giveaway.name.match(/^Humble.+?Bundle/);
        if (humbleBundle) {
          giveaway.id = giveaway.name.replace(/\s/g, ``);
          giveaway.type = `apps`;
        }
      }
      if (this.esgst.games && this.esgst.games[giveaway.type][giveaway.id]) {
        const keys = [`owned`, `wishlisted`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
        for (const key of keys) {
          if (this.esgst.games[giveaway.type][giveaway.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
            giveaway[key] = true;
          }
        }
      }
    }
    if (details) {
      giveaway.points = details.points;
      giveaway.level = details.level;
    } else {
      const gcCache = JSON.parse(common.getLocalValue(`gcCache`, `{}`));
      const data = gcCache && gcCache[giveaway.type] && gcCache[giveaway.type][giveaway.id];
      if (data && data.price > -1) {
        giveaway.points = data.price;
      }
    }
    if (giveaway.gwcContext) {
      giveaway.chancePerPoint = Math.round(giveaway.chance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.projectedChancePerPoint = Math.round(giveaway.projectedChance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.gwcContext.title = getFeatureTooltip(`gwc`, `Giveaway Winning Chance (${giveaway.chancePerPoint}% per point)`);
    }
    if (giveaway.gptwContext) {
      this.esgst.modules.giveawaysGiveawayPointsToWin.gptw_addPoint(giveaway);
    }
    /**
     * @type {ElementsArrayItem[]}
     */
    const items = [{
      text: ` (${details || giveaway.points > 0 ? giveaway.points : `?`}P)`,
      type: `span`
    }];
    if (giveaway.id) {
      items.push({
        attributes: {
          class: `giveaway__icon`,
          href: `http://store.steampowered.com/${giveaway.type.slice(0, -1)}/${giveaway.id}`,
          target: `_blank`
        },
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-steam`
          },
          type: `i`
        }]
      });
    }
    createElements(giveaway.headingName, `afterEnd`, items);
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
      if (child.getAttribute(`href`) && child.getAttribute(`href`).match(/store.steampowered.com/)) {
        child.setAttribute(`data-draggable-id`, `steam`);
        continue;
      }
      if (child.getAttribute(`href`) && child.getAttribute(`href`).match(/\/giveaways\/search/)) {
        child.setAttribute(`data-draggable-id`, `search`);
      }
    }
    if (details) {
      giveaway.inviteOnly = details.inviteOnly;
      giveaway.regionRestricted = details.regionRestricted;
      giveaway.group = details.group;
      giveaway.whitelist = details.whitelist;
      giveaway.public = !giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist;
    } else if (giveaway.deleted) {
      giveaway.public = false;
    } else {
      giveaway.blacklist = true;
    }
    if (this.esgst.cgb) {
      this.esgst.modules.giveawaysCustomGiveawayBackground.color([giveaway]);
    }
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
    const items2 = [{
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: type,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: details ? giveaway.level : `-`,
      type: `div`
    }];
    if (this.esgst.createdPath) {
      items2.push({
        attributes: {
          class: `table__column--width-small text-center`
        },
        type: `div`
      });
    }
    typeColumn = createElements(giveaway.panel || giveaway.innerWrap.querySelector(`.table__column--width-fill`), `afterEnd`, items2);
    if (this.esgst.createdPath) {
      let n, winner, winnersColumn;
      winnersColumn = typeColumn.nextElementSibling.nextElementSibling;
      n = (details && details.winners.length) || 0;
      if (n > 0) {
        if (n > 1) {
          winner = details.winners[0].username;
          createElements(winnersColumn, `inner`, [{
            attributes: {
              class: `table__column__secondary-link`,
              href: `/user/${winner}`
            },
            text: winner,
            type: `a`
          }, {
            attributes: {
              class: `esgst-clickable table__column__secondary-link`
            },
            text: ` (+${n - 1} more)`,
            type: `span`
          }]);
          winnersColumn.lastElementChild.addEventListener(`click`, this.cewgd_openWinnersPopup.bind(this, details));
          let received = 0;
          for (const winner of details.winners) {
            if (winner.status === `Received`) {
              received += 1;
            }
          }
          giveaway.innerWrap.lastElementChild.insertAdjacentText("beforeend", ` (${received}/${n})`);
        } else {
          winner = details.winners[0].username;
          createElements(winnersColumn, `inner`, [{
            attributes: {
              class: `table__column__secondary-link`,
              href: `/user/${winner}`
            },
            text: winner,
            type: `a`
          }]);
        }
      } else {
        winnersColumn.textContent = `-`;
      }
    } else if (this.esgst.enteredPath || this.esgst.wonPath) {
      createElements(giveaway.endTimeColumn, `beforeEnd`, [{
        text: ` by `,
        type: `node`
      }, details ? {
        attributes: {
          class: `table__column__secondary-link`,
          href: `/user/${details.creator}`
        },
        text: details.creator,
        type: `a`
      } : {
        text: `?`,
        type: `node`
      }]);
      if (details) {
        giveaway.creator = details.creator;
        giveaway.creators.push(giveaway.creator.toLowerCase());
      }
    }
    if (giveaway.group && this.esgst.ggl) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.giveawaysGiveawayGroupLoader.ggl_getGiveaways([giveaway]);
    }
  }

  cewgd_openWinnersPopup(details) {
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
    endless_load(popup.getScrollable(html));
  }
}

export default GiveawaysCreatedEnteredWonGiveawayDetails;