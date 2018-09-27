import Module from '../../class/Module';
import Popup_v2 from '../../class/Popup_v2';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

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
      description: `
      <ul>
        <li>Adds more details to each giveaway in your <a href="https://www.steamgifts.com/giveaways/created">created</a>/<a href="https://www.steamgifts.com/giveaways/entered">entered</a>/<a href="https://www.steamgifts.com/giveaways/won">won</a> pages:</li>
        <ul>
          <li>How many points the giveaway is worth next to the game's name.</li>
          <li>An icon (<i class="fa fa-steam"></i>) next to the game's name that links to the game's Steam store page.</li>
          <li>For the entered/won pages only, the creator's username next to the giveaway's end time.</li>
          <li>A column "Type" containing the giveaway's type (public, invite only, group, whitelist or region restricted).</li>
          <li>A column "Level" containing the giveaway's level.</li>
          <li>For the created page only, a column "Winner(s)" containing the giveaway's winner(s) and how many of them have marked it as received/not received.</li>
        </ul>
      </ul>
    `,
      id: `cewgd`,
      load: this.cewgd.bind(this),
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
      savedGiveaways: JSON.parse(await getValue(`giveaways`, `{}`))
    };
    let promises = [];
    for (let i = 0, n = giveaways.length; i < n; ++i) {
      promises.push(this.cewgd_getDetail(cewgd, giveaways, i));
    }
    await Promise.all(promises);
    let deleteLock = await createLock(`giveawayLock`, 300);
    for (let i = 0, n = this.cewgd.giveaways.length; i < n; ++i) {
      let currentGiveaway = this.cewgd.giveaways[i];
      if (cewgd.savedGiveaways[currentGiveaway.code]) {
        for (let key in currentGiveaway) {
          if (currentGiveaway.hasOwnProperty(key)) {
            this.cewgd.savedGiveaways[currentGiveaway.code][key] = currentGiveaway[key];
          }
        }
      } else {
        this.cewgd.savedGiveaways[currentGiveaway.code] = currentGiveaway;
      }
    }
    await setValue(`giveaways`, JSON.stringify(cewgd.savedGiveaways));
    deleteLock();
    if (this.esgst.gf && this.esgst.gf.filteredCount && this.esgst[`gf_enable${this.esgst.gf.type}`]) {
      this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf);
    }
    if (this.esgst.gfPopup && this.esgst.gfPopup.filteredCount && this.esgst[`gf_enable${this.esgst.gfPopup.type}`]) {
      this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gfPopup);
    }
  }

  async cewgd_getDetail(cewgd, giveaways, i) {
    let giveaway = giveaways[i];
    let code = giveaway.code;
    let j;
    if (this.esgst.createdPath && this.cewgd.savedGiveaways[code] && this.cewgd.savedGiveaways[code].gameSteamId && Array.isArray(cewgd.savedGiveaways[code].winners)) {
      console.log(`ESGST Log: CEWGD 0`);
      for (j = this.cewgd.savedGiveaways[code].winners.length - 1; j > -1; j--) {
        let winner = this.cewgd.savedGiveaways[code].winners[j];
        if (winner.status !== `Received` && winner.status !== `Not Received`) {
          break;
        }
      }
    }
    if (cewgd.savedGiveaways[code] && this.cewgd.savedGiveaways[code].gameSteamId && (!this.esgst.createdPath || j < 0) && (!this.esgst.wonPath || this.cewgd.savedGiveaways[code].creator !== this.esgst.username)) {
      console.log(`ESGST Log: CEWGD 1`);
      this.cewgd_addDetails(giveaway, this.cewgd.savedGiveaways[code]);
    } else if (this.esgst.createdPath) {
      console.log(`ESGST Log: CEWGD 2`);
      console.log(`ESGST Log: Updating winners for ${code}...`);
      let currentGiveaway = null;
      let nextPage = 1;
      let pagination = null;
      do {
        let response = await request({method: `GET`, url: `${giveaway.url}/winners/search?page=${nextPage}`});
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
          createElements(giveaway.panel || (this.esgst.gm_enable && this.esgst.createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling), `afterEnd`, new Array(this.esgst.createdPath ? 3 : 2).fill({
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `-`,
            type: `div`
          }));
          pagination = null;
        }
        nextPage += 1;
      } while (pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      if (currentGiveaway) {
        this.cewgd.giveaways.push(currentGiveaway);
        this.cewgd_addDetails(giveaway, currentGiveaway);
      }
    } else {
      console.log(`ESGST Log: CEWGD 3`);
      let response = await request({method: `GET`, url: giveaway.url});
      let responseHtml = parseHtml(response.responseText);
      let currentGiveaways = await this.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl);
      if (currentGiveaways.length > 0) {
        let currentGiveaway = currentGiveaways[0];
        this.cewgd.giveaways.push(currentGiveaway);
        this.cewgd_addDetails(giveaway, currentGiveaway);
        this.cewgd.count += 1;
      } else {
        createElements(giveaway.panel || (this.esgst.gm_enable && this.esgst.createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling), `afterEnd`, new Array(this.esgst.createdPath ? 3 : 2).fill({
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
      giveaway.id = details.gameSteamId;
      giveaway.type = details.gameType;
      if (this.esgst.games && this.esgst.games[giveaway.type][giveaway.id]) {
        const keys = [`owned`, `wishlisted`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
        for (const key of keys) {
          if (this.esgst.games[giveaway.type][giveaway.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
            giveaway[key] = true;
          }
        }
      }
    }
    giveaway.points = details.points;
    if (giveaway.gwcContext) {
      giveaway.chancePerPoint = Math.round(giveaway.chance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.projectedChancePerPoint = Math.round(giveaway.projectedChance / Math.max(1, giveaway.points) * 100) / 100;
      giveaway.gwcContext.title = getFeatureTooltip(`gwc`, `Giveaway Winning Chance (${giveaway.chancePerPoint}% per point)`);
    }
    giveaway.level = details.level;
    /**
     * @type {ElementsArrayItem[]}
     */
    const items = [{
      text: ` (${details.points}P)`,
      type: `span`
    }];
    if (details.gameType) {
      items.push({
        attributes: {
          class: `giveaway__icon`,
          href: `http://store.steampowered.com/${details.gameType.slice(0, -1)}/${details.gameSteamId}`,
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
    createElements(giveaway.headingName, `beforeEnd`, items);
    giveaway.inviteOnly = details.inviteOnly;
    giveaway.regionRestricted = details.regionRestricted;
    giveaway.group = details.group;
    giveaway.whitelist = details.whitelist;
    giveaway.public = !giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist;
    if (details.inviteOnly) {
      if (details.regionRestricted) {
        type = `Invite + Region`;
      } else {
        type = `Invite`;
      }
    } else if (details.group) {
      if (details.whitelist) {
        if (details.regionRestricted) {
          type = `Group + Whitelist + Region`;
        } else {
          type = `Group + Whitelist`;
        }
      } else if (details.regionRestricted) {
        type = `Group + Region`;
      } else {
        type = `Group`;
      }
    } else if (details.whitelist) {
      if (details.regionRestricted) {
        type = `Whitelist + Region`;
      } else {
        type = `Whitelist`;
      }
    } else if (details.regionRestricted) {
      type = `Region`;
    } else {
      type = `Public`;
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
      text: details.level,
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
    typeColumn = createElements(giveaway.panel || giveaway.innerWrap.firstElementChild.nextElementSibling, `afterEnd`, items2);
    if (this.esgst.createdPath) {
      let n, winner, winnersColumn;
      winnersColumn = typeColumn.nextElementSibling.nextElementSibling;
      n = details.winners.length;
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
      }, {
        attributes: {
          class: `table__column__secondary-link`,
          href: `/user/${details.creator}`
        },
        text: details.creator,
        type: `a`
      }]);
      giveaway.creator = details.creator;
      giveaway.creators.push(giveaway.creator.toLowerCase());
    }
    if (giveaway.group && this.esgst.ggl) {
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.giveawaysGiveawayGroupLoader.ggl_getGiveaways([giveaway]);
    }
  }

  cewgd_openWinnersPopup(details) {
    const popup = new Popup_v2({
      icon: `fa-users`,
      title: `Winners`,
      addScrollable: `left`
    });
    let html = [{
      attributes: {
        class: `table__heading`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__column--width-small`
        },
        text: `Winner`,
        type: `div`
      }, {
        attributes: {
          class: `table__column--width-small`
        },
        text: `Received`,
        type: `div`
      }]
    }, {
      attributes: {
        class: `table__rows`
      },
      type: `div`,
      children: []
    }];
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
      html[1].children.push({
        attributes: {
          class: `table__row-outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__secondary-link`,
                href: `/user/${winner.username}`
              },
              text: winner.username,
              type: `a`
            }]
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            type: `div`,
            children: [{
              attributes: {
                class: className
              },
              type: `i`
            }]
          }]
        }]
      });
    }
    popup.open();
    endless_load(popup.getScrollable(html));
  }
}

export default GiveawaysCreatedEnteredWonGiveawayDetails;