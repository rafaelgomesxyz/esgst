_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-gift"></i> <i class="fa fa-send"></i>) to the main page heading of your <a href="https://www.steamgifts.com/giveaways/created">created</a> page that allows you to send all of your unsent gifts at once.</li>
        <li>You can limit which gifts are sent based on whether or not the winner has any not activated/multiple wins (using <a href="https://www.sgtools.info/">SGTools</a>), whether or not the winner is still a member of the group and has a certain gift difference for group giveaways, and whether or not the winner is on your whitelist/blacklist.</li>
      </ul>
    `,
    id: `ugs`,
    load: ugs,
    name: `Unsent Gift Sender`,
    sg: true,
    type: `giveaways`
  });

  function ugs() {
    if (esgst.createdPath) {
      let button = createHeadingButton({id: `ugs`, icons: [`fa-gift`, `fa-send`], title: `Send unsent gifts`});
      button.addEventListener(`click`, ugs_openPopup.bind(null, {button}));
    } else if (esgst.newTicketPath) {
      document.getElementsByClassName(`form__submit-button`)[0].addEventListener(`click`, ugs_saveReroll.bind(null, document.querySelector(`[name="category_id"]`), document.querySelector(`[name="reroll_winner_id"]`)));
    }
  }

  async function ugs_saveReroll(category, winner) {
    let rerolls;
    if (category.value === `1`) {
      const id = winner.value;
      if (id) {
        rerolls = JSON.parse(await getValue(`rerolls`));
        if (rerolls.indexOf(id) < 0) {
          rerolls.push(id);
          setValue(`rerolls`, JSON.stringify(rerolls));
        }
      }
    }
  }

  function ugs_openPopup(ugs) {
    let checkMemberSwitch, checkDifferenceSwitch;
    if (!ugs.popup) {
      ugs.popup = new Popup(`fa-gift`, `Send unsent gifts:`);
      new ToggleSwitch(ugs.popup.description, `ugs_checkRules`, false, `Do not send if the winner has any not activated/multiple wins.`, false, false, `The winners will be checked in real time.`, esgst.ugs_checkRules);
      checkMemberSwitch = new ToggleSwitch(ugs.popup.description, `ugs_checkMember`, false, `Do not send if the winner is no longer a member of at least one of the groups for group giveaways.`, false, false, `The winners will be checked in real time.`, esgst.ugs_checkMember);
      checkDifferenceSwitch = new ToggleSwitch(ugs.popup.description, `ugs_checkDifference`, false, [{
        text: `Do not send if the winner has a gift difference lower than `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-ugs-difference`,
          step: `0.1`,
          type: `number`,
          value: esgst.ugs_difference
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }], false, false, `The winners will be checked in real time.`, esgst.ugs_checkDifference);
      new ToggleSwitch(ugs.popup.description, `ugs_checkWhitelist`, false, `Do not send if the winner is not on your whitelist.`, false, false, `You must sync your whitelist through the settings menu. Whitelisted winners get a pass for broken rules, so if this option is enabled and the winner is whitelisted, the gift will be sent regardless of whether or not the first option is enabled.`, esgst.ugs_checkWhitelist);
      new ToggleSwitch(ugs.popup.description, `ugs_checkBlacklist`, false, `Do not send if the winner on your blacklist.`, false, false, `You must sync your blacklist through the settings menu. If the winner is blacklisted, but is a member of one of the groups, the gift will be sent anyway.`, esgst.ugs_checkBlacklist);
      if (!esgst.ugs_checkMember) {
        checkDifferenceSwitch.container.classList.add(`esgst-hidden`);
      }
      observeNumChange(checkDifferenceSwitch.name.firstElementChild, `ugs_setDifference`);
      checkMemberSwitch.dependencies.push(checkDifferenceSwitch.container);
      ugs.results = createElements(ugs.popup.scrollable, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden markdown`
        },
        type: `div`,
        children: [{
          type: `ul`,
          children: [{
            type: `li`,
            children: [{
              attributes: {
                class: `esgst-bold`
              },
              text: ``,
              type: `span`,
              children: [{
                text: `Successfully sent gifts to `,
                type: `node`
              }, {
                text: `0`,
                type: `span`
              }, {
                text: ` winners:`,
                type: `node`
              }, {
                type: `span`
              }]
            }]
          }, {
            type: `li`,
            children: [{
              attributes: {
                class: `esgst-bold`
              },
              text: ``,
              type: `span`,
              children: [{
                text: `Failed to send gifts to `,
                type: `node`
              }, {
                text: `0`,
                type: `span`
              }, {
                text: ` winners (check the tooltips to find out the cause of the failures):`,
                type: `node`
              }, {
                type: `span`
              }]
            }]
          }]
        }]
      }]);
      ugs.sent = ugs.results.firstElementChild.firstElementChild;
      ugs.sentCount = ugs.sent.firstElementChild.firstElementChild;
      ugs.sentGifts = ugs.sent.lastElementChild;
      ugs.unsent = ugs.sent.nextElementSibling;
      ugs.unsentCount = ugs.unsent.firstElementChild.firstElementChild;
      ugs.unsentGifts = ugs.unsent.lastElementChild;
      ugs.popup.description.appendChild(new ButtonSet_v2({color1: `green`, color2: `red`, icon1: `fa-send`, icon2: `fa-times-circle`, title1: `Send`, title2: `Cancel`, callback1: ugs_start.bind(null, ugs), callback2: ugs_cancel.bind(null, ugs)}).set);
      ugs.progress = createElements(ugs.popup.description, `beforeEnd`, [{
        type: `div`
      }]);
      ugs.overallProgress = createElements(ugs.popup.description, `beforeEnd`, [{
        type: `div`
      }]);
      ugs.popup.description.appendChild(ugs.popup.scrollable);
    }
    ugs.popup.open();
  }

  async function ugs_start(ugs) {
    // initialize/reset stuff
    ugs.isCanceled = false;
    ugs.giveaways = [];
    ugs.groups = {};
    ugs.button.classList.add(`esgst-busy`);
    ugs.results.classList.add(`esgst-hidden`);
    ugs.sent.classList.add(`esgst-hidden`);
    ugs.unsent.classList.add(`esgst-hidden`);
    ugs.sentGifts.innerHTML = ``;
    ugs.unsentGifts.innerHTML = ``;
    ugs.sentCount.textContent = ugs.unsentCount.textContent = `0`;
    ugs.progress.innerHTML = ``;
    ugs.overallProgress.textContent = ``;

    let unsent = esgst.createdButton.getElementsByClassName(`nav__notification`)[0];
    if (!unsent) {
      // there are no unsent giveaways
      ugs.button.classList.remove(`esgst-busy`);
      createElements(ugs.progress, `inner`, [{
        text: `You do not have any unsent gifts.`,
        type: `node`
      }]);
      return;
    }

    // retrieve unsent giveaways
    ugs.count = parseInt(unsent.textContent);
    let giveaways = [];
    let nextPage = 1;
    let pagination = null;
    let skipped = false;
    do {
      let context = null;
      skipped = false;
      if (nextPage === esgst.currentPage) {
        context = document;
      } else if (document.getElementsByClassName(`esgst-es-page-${nextPage}}`)[0]) {
        // page has been loaded with endless scrolling, so its giveaways were already retrieved when the context was the document
        skipped = true;
        continue;
      } else {
        context = parseHtml((await request({method: `GET`, url: `/giveaways/created/search?page=${nextPage}`})).responseText);
      }
      if (nextPage === 1) {
        ugs.lastPage = lpl_getLastPage(context);
        ugs.lastPage = ugs.lastPage === 999999999 ? `` : ` of ${ugs.lastPage}`;
      }
      createElements(ugs.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Searching for unsent gifts (page ${nextPage}${ugs.lastPage})...`,
        type: `span`
      }]);
      ugs.continue = false;
      let elements = context.getElementsByClassName(`table__row-outer-wrap`);
      for (let i = 0, n = elements.length; i < n; i++) {
        let element = elements[i];
        let unsent = element.getElementsByClassName(`fa icon-red fa-warning`)[0];
        if (unsent) {
          let heading = element.getElementsByClassName(`table__column__heading`)[0];
          let url = heading.getAttribute(`href`);
          giveaways.push({
            code: url.match(/\/giveaway\/(.+?)\//)[1],
            context: unsent,
            name: heading.firstChild.textContent.trim().match(/(.+?)(\s\(.+\sCopies\))?$/)[1],
            url: url
          });
          ugs.continue = true;
          ugs.count -= 1;
        }
      }
      pagination = context.getElementsByClassName(`pagination__navigation`)[0];
      nextPage += 1;
    } while (!ugs.isCanceled && (ugs.count > 0 || ugs.continue) && (skipped || (pagination && !pagination.lastElementChild.classList.contains(`is-selected`))));

    // retrieve the winners/groups of each giveaway
    for (let i = 0, n = giveaways.length; !ugs.isCanceled && i < n; i++) {
      ugs.overallProgress.textContent = `${i} of ${n} giveaways checked...`;
      let giveaway = giveaways[i];
      ugs.giveaways[giveaway.code] = {
        code: giveaway.code,
        context: giveaway.context,
        name: giveaway.name,
        url: giveaway.url,
        winners: []
      };

      // retrieve the winners of the giveaway
      let nextPage = 1;
      let pagination = null;
      do {
        let context = parseHtml((await request({method: `GET`, url: `${giveaway.url}/winners/search?page=${nextPage}`})).responseText);
        if (nextPage === 1) {
          ugs.lastWinnersPage = lpl_getLastPage(context);
          ugs.lastWinnersPage = ugs.lastWinnersPage === 999999999 ? `` : ` of ${ugs.lastWinnersPage}`;
        }
        createElements(ugs.progress, `inner`, [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: `i`
        }, {
          text: `Retrieving winners (page ${nextPage}${ugs.lastWinnersPage})...`,
          type: `span`
        }]);
        let elements = context.getElementsByClassName(`table__row-outer-wrap`);
        for (let i = 0, n = elements.length; i < n; i++) {
          let element = elements[i];
          if (element.querySelector(`.table__gift-not-sent:not(.is-hidden)`)) {
            ugs.giveaways[giveaway.code].winners.push({
              username: element.getElementsByClassName(`table__column__heading`)[0].textContent,
              values: {},
              winnerId: element.querySelector(`[name="winner_id"]`).value
            });
            ugs.count -= 1;
          }
        }
        if (!ugs.giveaways[giveaway.code].group) {
          ugs.giveaways[giveaway.code].group = context.getElementsByClassName(`featured__column--group`)[0];
        }
        if (!ugs.giveaways[giveaway.code].whitelist) {
          ugs.giveaways[giveaway.code].whitelist = context.getElementsByClassName(`featured__column--whitelist`)[0];
        }
        pagination = context.getElementsByClassName(`pagination__navigation`)[0];
        nextPage += 1;
      } while (!ugs.isCanceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));

      // retrieve the groups of the giveaway
      if (esgst.ugs_checkMember && ugs.giveaways[giveaway.code].group) {
        ugs.giveaways[giveaway.code].groups = [];
        let nextPage = 1;
        let pagination = null;
        do {
          let context = parseHtml((await request({method: `GET`, url: `${giveaway.url}/groups/search?page=${nextPage}`})).responseText);
          if (nextPage === 1) {
            ugs.lastGroupsPage = lpl_getLastPage(context);
            ugs.lastGroupsPage = ugs.lastGroupsPage === 999999999 ? `` : ` of ${ugs.lastGroupsPage}`;
          }
          createElements(ugs.progress, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: `Retrieving groups (page ${nextPage}${ugs.lastGroupsPage})...`,
            type: `span`
          }]);
          let elements = context.getElementsByClassName(`table__row-outer-wrap`);
          for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            let heading = element.getElementsByClassName(`table__column__heading`)[0];
            let match = heading.getAttribute(`href`).match(/\/group\/(.+?)\/(.+)/);
            ugs.giveaways[giveaway.code].groups.push({
              avatar: element.getElementsByClassName(`table_image_avatar`)[0].style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1],
              code: match[1],
              name: heading.textContent,
              urlName: match[2]
            });
          }
          pagination = context.getElementsByClassName(`pagination__navigation`)[0];
          nextPage += 1;
        } while (!ugs.isCanceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
      }
    }

    if (ugs.isCanceled) {
      // process canceled
      return;
    }

    let codes = Object.keys(ugs.giveaways);
    let n = codes.length;
    if (n > 0) {
      // send gifts
      ugs.rerolls = JSON.parse(esgst.storage.rerolls);
      ugs.sentWinners = {};
      ugs.winners = {};
      ugs.results.classList.remove(`esgst-hidden`);
      for (let i = 0; !ugs.isCanceled && i < n; i++) {
        ugs.overallProgress.textContent = `${i} of ${n} giveaways checked...`;
        let giveaway = ugs.giveaways[codes[i]];
        for (let j = 0, numWinners = giveaway.winners.length; j < numWinners; j++) {
          let winner = giveaway.winners[j];
          let savedUser = await getUser(esgst.users, winner);

          // check order:
          // 1. check if the winner is being rerolled
          // 2. check if the winner has not activated/multiple wins
          // 3. if passed and it's a group giveaway, check if the winner is still a group member, otherwise go to 3
          // 4. check if the winner is whitelisted, which would give them a pass for not activated/multiple wins
          // 5. finally check if the winner is blacklisted

          if (ugs.rerolls.indexOf(winner.winnerId) > -1) {
            // winner is being rerolled, cannot send gift
            winner.error = `${winner.username} is currently being rerolled.`;
          } else {
            if (esgst.ugs_checkRules) {
              // check if winner has not activated/multiple wins
              createElements(ugs.progress, `inner`, [{
                attributes: {
                  class: `fa fa-circle-o-notch fa-spin`
                },
                type: `i`
              }, {
                text: `Checking if ${winner.username} has not activated/multiple wins...`,
                type: `span`
              }]);
              winner.values.namwc = {
                lastCheck: Date.now(),
                results: {}
              };
              await namwc_checkNotActivated(ugs, winner);
              await namwc_checkMultiple(ugs, winner);
              let notActivated = Array.isArray(winner.values.namwc.results.notActivated) ? winner.values.namwc.results.notActivated.length : winner.values.namwc.results.notActivated;
              let multiple = Array.isArray(winner.values.namwc.results.multiple) ? winner.values.namwc.results.multiple.length : winner.values.namwc.results.multiple;
              if (notActivated && multiple) {
                winner.error = `${winner.username} has ${notActivated} not activated wins and ${multiple} multiple wins.`;
              } else if (notActivated) {
                winner.error = `${winner.username} has ${notActivated} not activated wins.`;
              } else if (multiple) {
                winner.error = `${winner.username} has ${multiple} multiple wins.`;
              }
            }

            if (esgst.ugs_checkMember && giveaway.group && !winner.error) {
              // check if winner is still a group member
              createElements(ugs.progress, `inner`, [{
                attributes: {
                  class: `fa fa-circle-o-notch fa-spin`
                },
                type: `i`
              }, {
                text: `Checking if ${winner.username} is a member of one of the groups...`,
                type: `span`
              }]);
              await getSteamId(null, false, esgst.users, winner);
              let member = false;
              for (let k = 0, numGroups = giveaway.groups.length; k < numGroups; k++) {
                let group = giveaway.groups[k];
                let code = group.code;
                if (!ugs.groups[code]) {
                  // retrieve group members and store them in case another giveaway has the same group
                  let l;
                  for (l = esgst.groups.length - 1; l > -1 && esgst.groups[l].code !== code; l--);
                  if (l < 0) {
                    esgst.groups.push({
                      avatar: group.avatar,
                      code: code,
                      name: group.name
                    });
                    l = esgst.groups.length - 1;
                  }
                  if (!esgst.groups[l].steamId) {
                    esgst.groups[l].steamId = parseHtml((await request({method: `GET`, url: `/group/${code}/`})).responseText).getElementsByClassName(`sidebar__shortcut-inner-wrap`)[0].firstElementChild.getAttribute(`href`).match(/\d+/)[0];
                  }
                  ugs.groups[code] = (await request({method: `GET`, url: `http://steamcommunity.com/gid/${esgst.groups[l].steamId}/memberslistxml?xml=1`})).responseText.match(/<steamID64>.+?<\/steamID64>/g);
                  for (l = ugs.groups[code].length - 1; l > -1; l--) {
                    ugs.groups[code][l] = ugs.groups[code][l].match(/<steamID64>(.+?)<\/steamID64>/)[1];
                  }
                }

                if (ugs.groups[code].indexOf(winner.steamId) < 0) {
                  // winner is not a member of this group, continue to check the next group
                  continue;
                }

                if (!esgst.ugs_checkDifference) {
                  // no need to check gift difference, gift can be sent
                  member = true;
                  break;
                }

                // check winner's gift difference
                createElements(ugs.progress, `inner`, [{
                  attributes: {
                    class: `fa fa-circle-o-notch fa-spin`
                  },
                  type: `i`
                }, {
                  text: `Checking if ${winner.username} has a gift difference higher than the one set...`,
                  type: `span`
                }]);
                let element = parseHtml((await request({method: `GET`, url: `/group/${code}/${group.urlName}/users/search?q=${winner.username}`})).responseText).getElementsByClassName(`table__row-outer-wrap`)[0];
                if (element && element.getElementsByClassName(`table__column__heading`)[0].textContent === winner.username) {
                  let difference = parseFloat(element.getElementsByClassName(`table__column--width-small`)[2].textContent);
                  if (difference >= esgst.ugs_difference) {
                    member = true;
                    break;
                  }
                  winner.error = `${winner.username} has a ${difference} gift difference.`;
                  break;
                }
              }
              if (!winner.error && !member) {
                winner.error = `${winner.username} is not a member of one of the groups.`;
              }
            }

            if (esgst.ugs_checkWhitelist) {
              // check if winner is whitelisted
              winner.error = savedUser && savedUser.whitelisted ? null : `${winner.username} is not whitelisted.`;
            }

            if (esgst.ugs_checkBlacklist && savedUser && savedUser.blacklisted && !winner.error) {
              // check if winner is blacklisted
              winner.error = `${winner.username} is blacklisted.`;
            }
          }

          // send gift to the winner or not, based on the previous checks
          if (!ugs.winners[winner.username]) {
            ugs.winners[winner.username] = [];
          }
          if (ugs.winners[winner.username].indexOf(giveaway.name) < 0) {
            if (winner.error) {
              ugs.unsent.classList.remove(`esgst-hidden`);
              ugs.unsentCount.textContent = parseInt(ugs.unsentCount.textContent) + 1;
              createElements(ugs.unsentGifts, `beforeEnd`, [{
                type: `span`,
                children: [{
                  attributes: {
                    href: `/user/${winner.username}`
                  },
                  text: winner.username,
                  type: `a`
                }, {
                  text: ` (`,
                  type: `node`
                }, {
                  attributes: {
                    href: `${giveaway.url}/winners`
                  },
                  text: giveaway.name,
                  type: `a`
                }, {
                  text: `) `,
                  type: `node`
                }, {
                  attributes: {
                    class: `fa fa-question-circle`,
                    title: winner.error
                  },
                  type: `i`
                }]
              }]);
            } else if (!ugs.isCanceled) {
              await request({data: `xsrf_token=${esgst.xsrfToken}&do=sent_feedback&action=1&winner_id=${winner.winnerId}`, method: `POST`, url: `/ajax.php`});
              if (!ugs.sentWinners[giveaway.code]) {
                ugs.sentWinners[giveaway.code] = [];
              }
              ugs.sent.classList.remove(`esgst-hidden`);
              ugs.sentWinners[giveaway.code].push(winner.username);
              ugs.sentCount.textContent = parseInt(ugs.sentCount.textContent) + 1;
              createElements(ugs.sentGifts, `beforeEnd`, [{
                type: `span`,
                children: [{
                  attributes: {
                    href: `/user/${winner.username}`
                  },
                  text: winner.username,
                  type: `a`
                }, {
                  text: ` (`,
                  type: `node`
                }, {
                  attributes: {
                    href: `${giveaway.url}/winners`
                  },
                  text: giveaway.name,
                  type: `a`
                }, {
                  text: `)`,
                  type: `node`
                }]
              }]);
              ugs.winners[winner.username].push(giveaway.name);
              if (document.body.contains(giveaway.context)) {
                giveaway.context.className = `fa fa-check-circle icon-green`;
                giveaway.context.nextElementSibling.textContent = `Sent`;
              }
            }
          } else {
            // exact same game has already been sent to this winner, meaning they won multiple copies of the same game, so extra gifts cannot be sent
            ugs.unsent.classList.remove(`esgst-hidden`);
            ugs.unsentCount.textContent = parseInt(ugs.unsentCount.textContent) + 1;
            createElements(ugs.unsentGifts, `beforeEnd`, [{
              type: `span`,
              children: [{
                attributes: {
                  href: `/user/${winner.username}`
                },
                text: winner.username,
                type: `a`
              }, {
                text: ` (`,
                type: `node`
              }, {
                attributes: {
                  href: `${giveaway.url}/winners`
                },
                text: giveaway.name,
                type: `a`
              }, {
                text: `) `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-question-circle`,
                  title: `${winner.username} already won ${giveaway.name} from another giveaway of yours`
                },
                type: `i`
              }]
            }]);
          }
        }
      }

      // finalize process
      let winners = JSON.parse(await getValue(`winners`, `{}`));
      for (let key in ugs.sentWinners) {
        if (!winners[key]) {
          winners[key] = [];
        }
        for (let i = 0, n = ugs.sentWinners[key].length; i < n; i++) {
          winners[key].push(ugs.sentWinners[key][i]);
        }
      }
      let savedUsers = [];
      for (let key in ugs.giveaways) {
        for (let i = 0, n = ugs.giveaways[key].winners.length; i < n; i++) {
          savedUsers.push(ugs.giveaways[key].winners[i]);
        }
      }
      createElements(ugs.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Saving data...`,
        type: `span`
      }]);
      ugs.overallProgress.textContent = ``;
      await Promise.all([setValue(`winners`, JSON.stringify(winners)), saveUsers(savedUsers), setValue(`groups`, JSON.stringify(esgst.groups))]);
      ugs.button.classList.remove(`esgst-busy`);
      ugs.progress.innerHTML = ``;
    } else {
      // there are no unsent gifts
      ugs.button.classList.remove(`esgst-busy`);
      createElements(ugs.progress, `inner`, [{
        text: `You do not have any unsent gifts.`,
        type: `node`
      }]);
    }
  }

  function ugs_cancel(ugs) {
    ugs.isCanceled = true;
    ugs.button.classList.remove(`esgst-busy`);
    ugs.progress.innerHTML = ``;
    ugs.overallProgress.textContent = ``;
  }
  
