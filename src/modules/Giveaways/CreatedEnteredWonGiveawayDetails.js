_MODULES.push({
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
    load: cewgd,
    name: `Created/Entered/Won Giveaway Details`,
    sg: true,
    type: `giveaways`
  });

  function cewgd() {
    if (!esgst.createdPath && !esgst.enteredPath && !esgst.wonPath) return;
    esgst.endlessFeatures.push(cewgd_addHeading);
    esgst.giveawayFeatures.push(cewgd_getDetails_pre);
  }

  function cewgd_addHeading(context, main, source, endless) {
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
    if (esgst.createdPath) {
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

  function cewgd_getDetails_pre(giveaways, main) {
    cewgd_getDetails(giveaways, main);
  }

  async function cewgd_getDetails(giveaways, main) {
    if (!main) return;
    let cewgd = {
      giveaways: [],
      savedGiveaways: JSON.parse(await getValue(`giveaways`, `{}`))
    };
    let promises = [];
    for (let i = 0, n = giveaways.length; i < n; ++i) {
      promises.push(cewgd_getDetail(cewgd, giveaways, i));
    }
    await Promise.all(promises);
    let deleteLock = await createLock(`giveawayLock`, 300);
    for (let i = 0, n = cewgd.giveaways.length; i < n; ++i) {
      let currentGiveaway = cewgd.giveaways[i];
      if (cewgd.savedGiveaways[currentGiveaway.code]) {
        for (let key in currentGiveaway) {
          cewgd.savedGiveaways[currentGiveaway.code][key] = currentGiveaway[key];
        }
      } else {
        cewgd.savedGiveaways[currentGiveaway.code] = currentGiveaway;
      }
    }
    await setValue(`giveaways`, JSON.stringify(cewgd.savedGiveaways));
    deleteLock();
  }

  async function cewgd_getDetail(cewgd, giveaways, i) {
    let giveaway = giveaways[i];
    let code = giveaway.code;
    let j;
    if (esgst.createdPath && cewgd.savedGiveaways[code] && cewgd.savedGiveaways[code].gameSteamId && Array.isArray(cewgd.savedGiveaways[code].winners)) {
      console.log(`ESGST Log: CEWGD 0`);
      for (j = cewgd.savedGiveaways[code].winners.length - 1; j > -1; j--) {
        let winner = cewgd.savedGiveaways[code].winners[j];
        if (winner.status !== `Received` && winner.status !== `Not Received`) {
          break;
        }
      }
    }
    if (cewgd.savedGiveaways[code] && cewgd.savedGiveaways[code].gameSteamId && (!esgst.createdPath || j < 0) && (!esgst.wonPath || cewgd.savedGiveaways[code].creator !== esgst.username)) {
      console.log(`ESGST Log: CEWGD 1`);
      cewgd_addDetails(giveaway, cewgd.savedGiveaways[code]);
    } else if (esgst.createdPath) {
      console.log(`ESGST Log: CEWGD 2`);
      console.log(`ESGST Log: Updating winners for ${code}...`);
      let currentGiveaway = null;
      let nextPage = 1;
      let pagination = null;
      do {
        let response = await request({method: `GET`, url: `${giveaway.url}/winners/search?page=${nextPage}`});
        let responseHtml = parseHtml(response.responseText);
        if (!currentGiveaway) {
          let currentGiveaways = await giveaways_get(responseHtml, false, response.finalUrl);
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
          createElements(giveaway.panel || (esgst.gm_enable && esgst.createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling), `afterEnd`, new Array(3).fill({
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
        cewgd.giveaways.push(currentGiveaway);
        cewgd_addDetails(giveaway, currentGiveaway);
      }
    } else {
      console.log(`ESGST Log: CEWGD 3`);
      let response = await request({method: `GET`, url: giveaway.url});
      let responseHtml = parseHtml(response.responseText);
      let currentGiveaways = await giveaways_get(responseHtml, false, response.finalUrl);
      if (currentGiveaways.length > 0) {
        let currentGiveaway = currentGiveaways[0];
        cewgd.giveaways.push(currentGiveaway);
        cewgd_addDetails(giveaway, currentGiveaway);
        cewgd.count += 1;
      } else {
        createElements(giveaway.panel || (esgst.gm_enable && esgst.createdPath ? giveaway.innerWrap.firstElementChild.nextElementSibling.nextElementSibling : giveaway.innerWrap.firstElementChild.nextElementSibling), `afterEnd`, new Array(3).fill({
          attributes: {
            class: `table__column--width-small text-center`
          },
          text: `-`,
          type: `div`
        }));
      }
    }
  }

  function cewgd_addDetails(giveaway, details) {
    let type, typeColumn;
    if (!giveaway.id) {
      giveaway.id = details.gameSteamId;
      giveaway.type = details.gameType;
      if (esgst.games && esgst.games[giveaway.type][giveaway.id]) {
        const keys = [`owned`, `wishlisted`, `hidden`, `ignored`, `previouslyEntered`, `previouslyWon`, `reducedCV`, `noCV`];
        for (const key of keys) {
          if (esgst.games[giveaway.type][giveaway.id][key === `previouslyEntered` ? `entered` : (key === `previouslyWon` ? `won` : key)]) {
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
    if (esgst.createdPath) {
      items2.push({
        attributes: {
          class: `table__column--width-small text-center`
        },
        type: `div`
      });
    }
    typeColumn = createElements(giveaway.panel || giveaway.innerWrap.firstElementChild.nextElementSibling, `afterEnd`, items2);
    if (esgst.createdPath) {
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
          winnersColumn.lastElementChild.addEventListener(`click`, cewgd_openWinnersPopup.bind(null, details));
          let received = 0;
          for (const winner of details.winners) {
            if (winner.status === `Received`) {
              received += 1;
            }
          }
          giveaway.innerWrap.lastElementChild.insertAdjacentText(`beforeEnd`, ` (${received}/${n})`);
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
    } else if (esgst.enteredPath || esgst.wonPath) {
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
    if (giveaway.group && esgst.ggl) {
      ggl_getGiveaways([giveaway]);
    }
  }

  function cewgd_openWinnersPopup(details) {
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

