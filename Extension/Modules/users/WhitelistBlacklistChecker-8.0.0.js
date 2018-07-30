_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-heart"></i> <i class="fa fa-ban"></i> <i class="fa fa-question-circle"></i>) to the main page heading of any page that allows you to check which users in the page have whitelisted/blacklisted you.</li>
        <li>That information is retrieved by searching for whitelist giveaways in the user's <a href="https://www.steamgifts.com/user/cg">profile</a> page and checking if you can access them. If no whitelist giveaways are found, the feature searches for group + whitelist giveaways instead and checks if you can access them using the groups that you are a member of to determine whether you can access them for being a group member or for being in the user's whitelist.</li>
        <li>There are many options that allow you to narrow down the check: you can select which users to check, check only if the user has blacklisted you (which is faster than checking if they have whitelisted you because it does not need to find a whitelist giveaway), how many pages to check, whether or not to check again users that were already checked and whether or not to skip users that the feature is taking too long to find whitelist giveaways from.</li>
        <li>There are also options to return whitelists/blacklists, which means that if a user that has whitelisted/blacklisted you is found, they will be whitelisted/blacklisted back.</li>
        <li>Adds a button (<i class="fa fa-heart"></i> <i class="fa fa-ban"></i> <i class="fa fa-gear"></i>) to the page heading of this menu that allows you to view/update all of the users that have been checked.</li>
        <li>Results are cached for 24 hours, so if you check the same user again within that timeframe, their status will not change, unless you check them with the option to clear the cache enabled.</li>
      </ul>
    `,
    features: {
      wbc_h: {
        description: `
          <ul>
            <li>Adds an icon (<i class="fa fa-check esgst-whitelist"></i> if the user has whitelisted you and <i class="fa fa-times esgst-blacklist"></i> if they have blacklisted you) next to a checked user's username (in any page).</li>
            <li>If you hover over the icon, it shows the date when they were checked for the last time.</li>
          </ul>
        `,
        name: `Highlight checked users.`,
        sg: true,
        st: true
      },
      wbc_n: {
        description: `
          <ul>
            <li>If you have [id=un] enabled, a note will be saved for a user if they were whitelisted/blacklisted back.</li>
          </ul>
        `,
        name: `Save automatic notes when returning whitelists/blacklists.`,
        sg: true
      },
      wbc_hb: {
        description: `
          <ul>
            <li>With this option enabled, the feature will not tell you if a user has blacklisted you (in fact, the name of the feature will change to Whitelist Checker for you). If the feature finds a user that has blacklisted you, it will tell you that it could not determine their status.</li>
          </ul>
        `,
        name: `Hide blacklist information.`,
        sg: true
      }
    },
    id: `wbc`,
    load: wbc,
    name: `Whitelist/Blacklist Checker`,
    sg: true,
    sync: `Steam Groups`,
    type: `users`
  });

  function wbc() {
    if (!esgst.mainPageHeading) return;
    let [icons, title] = !esgst.wbc_hb ? [[`fa-heart`, `fa-ban`, `fa-question-circle`], `Check for whitelists/blacklists`] : [[`fa-heart`, `fa-question-circle`], `Check for whitelists`];
    esgst.wbcButton = createHeadingButton({id: `wbc`, icons, title});
    wbc_addButton(true, esgst.wbcButton);
  }

  function wbc_addButton(Context, WBCButton) {
    let checkAllSwitch, checkPagesSwitch, checkSingleSwitch, popup, skip, WBC;
    WBC = {
      Update: (Context ? false : true),
      B: !esgst.wbc_hb,
      Username: esgst.username
    };
    popup = new Popup(WBC.Update ? `fa-cog` : `fa-question`, WBC.Update ? `Manage Whitelist/Blacklist Checker caches:` : `Check for whitelists${WBC.B ? `/blacklists` : ``}:`);
    if (location.pathname.match(new RegExp(`^/user/(?!${WBC.Username})`))) {
      WBC.User = {
        Username: document.getElementsByClassName(`featured__heading__medium`)[0].textContent,
        ID: document.querySelector(`[name="child_user_id"]`).value,
        SteamID64: document.querySelector(`a[href*="/profiles/"]`).href.match(/\d+/)[0],
      };
    }
    popup.Options = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    if (WBC.User) {
      checkSingleSwitch = new ToggleSwitch(popup.Options, `wbc_checkSingle`, false, `Only check ${WBC.User ? WBC.User.Username : `current user`}.`, false, false, `If disabled, all users in the current page will be checked.`, esgst.wbc_checkSingle);
    }
    let feat = getFeatureNumber(`mm`);
    let checkSelectedSwitch = new ToggleSwitch(popup.Options, `wbc_checkSelected`, false, `Only check selected.`, false, false, `Use ${feat.number} ${feat.name} to select the users that you want to check. Then click the button 'Check WL/BL' in the Multi-Manager popout and you will be redirected here.`, esgst.wbc_checkSelected);
    if (WBC.B) {
      new ToggleSwitch(popup.Options, `wbc_checkBlacklist`, false, `Only check blacklist.`, false, false, `If enabled, a blacklist-only check will be performed (faster).`, esgst.wbc_checkBlacklist);
    }
    if (!WBC.Update && !location.pathname.match(/^\/(discussions|users|archive)/)) {
      checkAllSwitch = new ToggleSwitch(popup.Options, `wbc_checkAll`, false, `Check all pages.`, false, false, `If disabled, only the current page will be checked.`, esgst.wbc_checkAll);
      checkPagesSwitch = new ToggleSwitch(popup.Options, `wbc_checkPages`, false, [{
        text: `Check only pages from `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-switch-input`,
          min: `1`,
          type: `number`,
          value: esgst.wbc_minPage
        },
        type: `input`
      }, {
        text: ` to `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-switch-input`,
          min: `1`,
          type: `number`,
          value: esgst.wbc_maxPage
        },
        type: `input`
      }, {
        text: `.`,
        type: `node`
      }], false, false, null, esgst.wbc_checkPages);
      let minPage = checkPagesSwitch.name.firstElementChild;
      let maxPage = minPage.nextElementSibling;
      let lastPage = lpl_getLastPage(document, true);
      if (lastPage !== 999999999) {
        maxPage.setAttribute(`max`, lastPage);
      }
      observeNumChange(minPage, `wbc_minPage`);
      observeNumChange(maxPage, `wbc_maxPage`);
    }
    new ToggleSwitch(popup.Options, `wbc_returnWhitelists`, false, `Return whitelists.`, false, false, `If enabled, everyone who has whitelisted you will be whitelisted back.`, esgst.wbc_returnWhitelists);
    if (WBC.B) {
      new ToggleSwitch(popup.Options, `wbc_returnBlacklists`, false, `Return blacklists.`, false, false, `If enabled, everyone who has blacklisted you will be blacklisted back.`, esgst.wbc_returnBlacklists);
    }
    new ToggleSwitch(popup.Options, `wbc_checkNew`, false, `Only check users who have not whitelisted ${WBC.B ? `/blacklisted` : ``} you.`, false, false, `If enabled, everyone who has whitelisted ${WBC.B ? `/blacklisted` : ``} you will be ignored (might lead to outdated data if someone who had whitelisted ${WBC.B ? `/blacklisted` : ``} you in the past removed you from those lists).`, esgst.wbc_checkNew);
    observeNumChange(new ToggleSwitch(popup.Options, `wbc_skipUsers`, false, [{
      text: `Skip users after `,
      type: `node`
    }, {
      attributes: {
        class: `esgst-ugs-difference`,
        type: `number`,
        value: esgst.wbc_pages
      },
      type: `input`
    },
    {
      text: ` pages.`,
      type: `node`
    }], false, false, `If enabled, when a user check passes the number of pages specified, the user will be skipped.`, esgst.wbc_skipUsers).name.firstElementChild, `wbc_pages`);
    new ToggleSwitch(popup.Options, `wbc_clearCache`, false, `Clear caches.`, false, false, `If enabled, the caches of all checked users will be cleared (slower).`, esgst.wbc_clearCache);
    if (checkSingleSwitch || checkAllSwitch || checkPagesSwitch) {
      if (checkSingleSwitch) {
        if (checkAllSwitch) {
          checkSingleSwitch.exclusions.push(checkAllSwitch.container);
        }
        if (checkPagesSwitch) {
          checkSingleSwitch.exclusions.push(checkPagesSwitch.container);
        }
        checkSingleSwitch.exclusions.push(checkSelectedSwitch.container);
        checkSelectedSwitch.exclusions.push(checkSingleSwitch.container);
        if (esgst.wbc_checkSingle) {
          if (checkAllSwitch) {
            checkAllSwitch.container.classList.add(`esgst-hidden`);
          }
          if (checkPagesSwitch) {
            checkPagesSwitch.container.classList.add(`esgst-hidden`);
          }
          checkSelectedSwitch.container.classList.add(`esgst-hidden`);
        } else if (esgst.wbc_checkSelected) {
          checkSingleSwitch.container.classList.add(`esgst-hidden`);
        }
      }
      if (checkAllSwitch) {
        if (checkSingleSwitch) {
          checkAllSwitch.exclusions.push(checkSingleSwitch.container);
        }
        if (checkPagesSwitch) {
          checkAllSwitch.exclusions.push(checkPagesSwitch.container);
        }
        checkSelectedSwitch.exclusions.push(checkAllSwitch.container);
        checkAllSwitch.exclusions.push(checkSelectedSwitch.container);
        if (esgst.wbc_checkAll) {
          if (checkSingleSwitch) {
            checkSingleSwitch.container.classList.add(`esgst-hidden`);
          }
          if (checkPagesSwitch) {
            checkPagesSwitch.container.classList.add(`esgst-hidden`);
          }
          checkSelectedSwitch.container.classList.add(`esgst-hidden`);
        } else if (esgst.wbc_checkSelected) {
          checkAllSwitch.container.classList.add(`esgst-hidden`);
        }
      }
      if (checkPagesSwitch) {
        if (checkSingleSwitch) {
          checkPagesSwitch.exclusions.push(checkSingleSwitch.container);
        }
        if (checkAllSwitch) {
          checkPagesSwitch.exclusions.push(checkAllSwitch.container);
        }
        checkSelectedSwitch.exclusions.push(checkPagesSwitch.container);
        checkPagesSwitch.exclusions.push(checkSelectedSwitch.container);
        if (esgst.wbc_checkPages) {
          if (checkSingleSwitch) {
            checkSingleSwitch.container.classList.add(`esgst-hidden`);
          }
          if (checkAllSwitch) {
            checkAllSwitch.container.classList.add(`esgst-hidden`);
          }
          checkSelectedSwitch.container.classList.add(`esgst-hidden`);
        } else if (esgst.wbc_checkSelected) {
          checkPagesSwitch.container.classList.add(`esgst-hidden`);
        }
      }
    }
    createElements(popup.Options, `afterEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `If an user is highlighted, that means they have been either checked for the first time or updated.`,
      type: `div`
    }]);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, WBC.Update ? `fa-refresh` : `fa-question-circle`, `fa-times-circle`, WBC.Update ? `Update` : `Check`, `Cancel`, Callback => {
      WBC.ShowResults = false;
      WBCButton.classList.add(`esgst-busy`);
      wbc_setCheck(WBC, skip, () => {
        skip.innerHTML = ``;
        WBCButton.classList.remove(`esgst-busy`);
        Callback();
        WBC.popup.setDone();
      });
    }, () => {
      skip.innerHTML = ``;
      clearInterval(WBC.Request);
      clearInterval(WBC.Save);
      WBC.Canceled = true;
      setTimeout(() => {
        WBC.Progress.innerHTML = ``;
      }, 500);
      WBCButton.classList.remove(`esgst-busy`);
    }).set);
    skip = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    WBC.Progress = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    WBC.OverallProgress = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    popup.Results = createElements(popup.scrollable, `beforeEnd`, [{ type: `div` }]);
    createResults(popup.Results, WBC, [{
      Icon: `fa fa-heart esgst-whitelist`,
      Description: `You are whitelisted by`,
      Key: `whitelisted`
    }, {
      Icon: `fa fa-ban esgst-blacklist`,
      Description: `You are blacklisted by`,
      Key: `blacklisted`
    }, {
      Icon: `fa fa-check-circle`,
      Description: WBC.B ? "You are neither whitelisted nor blacklisted by" : `You are not whitelisted by`,
      Key: `none`
    }, {
      Icon: `fa fa-question-circle`,
      Description: `You are not blacklisted and there is not enough information to know if you are whitelisted by`,
      Key: `notBlacklisted`
    }, {
      Icon: `fa fa-question-circle`,
      Description: `There is not enough information to know if you are whitelisted${WBC.B ? ` or blacklisted` : ``} by`,
      Key: `unknown`
    }, {
      Icon: `fa fa-forward`,
      Description: `Skipped users`,
      Key: `skipped`
    }]);
    WBCButton.addEventListener(`click`, () => {
      if (WBCButton.getAttribute(`data-mm`)) {
        if (!esgst.wbc_checkSelected) {
          if (esgst.wbc_checkSingle && checkSingleSwitch) {
            let element = createElements(checkSingleSwitch.container, `afterBegin`, [{
              attributes: {
                class: `esgst-bold esgst-red`
              },
              text: `Disable this -->`,
              type: `span`
            }]);
            setTimeout(() => element.remove(), 5000);
          } else if (esgst.wbc_checkAll) {
            let element = createElements(checkAllSwitch.container, `afterBegin`, [{
              attributes: {
                class: `esgst-bold esgst-red`
              },
              text: `Disable this -->`,
              type: `span`
            }]);
            setTimeout(() => element.remove(), 5000);
          } else if (esgst.wbc_checkPages) {
            let element = createElements(checkPagesSwitch.container, `afterBegin`, [{
              attributes: {
                class: `esgst-bold esgst-red`
              },
              text: `Disable this -->`,
              type: `span`
            }]);
            setTimeout(() => element.remove(), 5000);
          }
          let element = createElements(checkSelectedSwitch.container, `afterBegin`, [{
            attributes: {
              class: `esgst-bold esgst-red`
            },
            text: `Enable this -->`,
            type: `span`
          }]);
          setTimeout(() => element.remove(), 5000);
        }
        WBCButton.removeAttribute(`data-mm`);
      }
      WBC.popup = popup;
      popup.open(() => {
        if (WBC.Update) {
          WBC.ShowResults = true;
          wbc_setCheck(WBC, skip);
        }
      });
    });
  }

  async function wbc_setCheck(WBC, skip, Callback) {
    let SavedUsers, I, N;
    WBC.Progress.innerHTML = ``;
    WBC.OverallProgress.innerHTML = ``;
    WBC.whitelisted.classList.add(`esgst-hidden`);
    WBC.blacklisted.classList.add(`esgst-hidden`);
    WBC.none.classList.add(`esgst-hidden`);
    WBC.notBlacklisted.classList.add(`esgst-hidden`);
    WBC.unknown.classList.add(`esgst-hidden`);
    WBC.skipped.classList.add(`esgst-hidden`);
    WBC.whitelistedCount.textContent = WBC.blacklistedCount.textContent = WBC.noneCount.textContent = WBC.notBlacklistedCount.textContent = WBC.unknownCount.textContent = WBC.skippedCount.textContent = `0`;
    WBC.whitelistedUsers.innerHTML = ``;
    WBC.blacklistedUsers.innerHTML = ``;
    WBC.noneUsers.innerHTML = ``;
    WBC.notBlacklistedUsers.innerHTML = ``;
    WBC.unknownUsers.innerHTML = ``;
    WBC.skippedUsers.innerHTML = ``;
    WBC.Users = [];
    WBC.Canceled = false;
    if (WBC.Update) {
      SavedUsers = JSON.parse(await getValue(`users`));
      for (I in SavedUsers.users) {
        if (SavedUsers.users[I].wbc && SavedUsers.users[I].wbc.result) {
          WBC.Users.push(SavedUsers.users[I].username);
        }
      }
      WBC.Users = sortArray(WBC.Users);
      if (WBC.ShowResults) {
        for (I = 0, N = WBC.Users.length; I < N; ++I) {
          let user = {
            steamId: SavedUsers.steamIds[WBC.Users[I]],
            id: SavedUsers.users[SavedUsers.steamIds[WBC.Users[I]]].id,
            username: WBC.Users[I]
          };
          wbc_setResult(WBC, user, SavedUsers.users[SavedUsers.steamIds[WBC.Users[I]]].wbc, SavedUsers.users[SavedUsers.steamIds[WBC.Users[I]]].notes, SavedUsers.users[SavedUsers.steamIds[WBC.Users[I]]].whitelisted, SavedUsers.users[SavedUsers.steamIds[WBC.Users[I]]].blacklisted, false);
        }
      } else {
        skip.appendChild(new ButtonSet(`green`, ``, `fa-forward`, ``, `Skip User`, ``, callback => {
          callback();
          WBC.manualSkip = true;
        }).set);
        wbc_checkUsers(WBC, 0, WBC.Users.length, Callback);
      }
    } else if (WBC.User && esgst.wbc_checkSingle) {
      WBC.Users.push(WBC.User.Username);
      wbc_checkUsers(WBC, 0, 1, Callback);
    } else {
      if (esgst.wbc_checkSelected) {
        WBC.Users = Array.from(esgst.mmWbcUsers);
      } else if (!esgst.wbc_checkPages) {
        let elements = esgst.pageOuterWrap.querySelectorAll(`a[href*="/user/"]`);
        for (let element of elements) {
          let match = element.getAttribute(`href`).match(/\/user\/(.+)/);
          if (!match) continue;
          let username = match[1];
          if (WBC.Users.indexOf(username) > -1 || username === esgst.username || username !== element.textContent || element.closest(`.markdown`)) continue;
          WBC.Users.push(username);
        }
      }
      if ((esgst.wbc_checkAll || esgst.wbc_checkPages) && ((((WBC.User && !esgst.wbc_checkSingle) || !WBC.User) && !WBC.Update && !location.pathname.match(/^\/(discussions|users|archive)/)))) {
        WBC.lastPage = esgst.wbc_checkPages ? `of ${esgst.wbc_maxPage}` : ``;
        wbc_getUsers(WBC, esgst.wbc_checkPages ? (esgst.wbc_minPage - 1) : 0, esgst.currentPage, esgst.searchUrl, () => {
          skip.appendChild(new ButtonSet(`green`, ``, `fa-forward`, ``, `Skip User`, ``, callback => {
            callback();
            WBC.manualSkip = true;
          }).set);
          WBC.Users = sortArray(WBC.Users);
          wbc_checkUsers(WBC, 0, WBC.Users.length, Callback);
        });
      } else {
        skip.appendChild(new ButtonSet(`green`, ``, `fa-forward`, ``, `Skip User`, ``, callback => {
          callback();
          WBC.manualSkip = true;
        }).set);
        WBC.Users = sortArray(WBC.Users);
        wbc_checkUsers(WBC, 0, WBC.Users.length, Callback);
      }
    }
  }

  function wbc_skipUser(wbc, username) {
    wbc.manualSkip = false;
    wbc.skipped.classList.remove(`esgst-hidden`);
    wbc.skippedCount.textContent = parseInt(wbc.skippedCount.textContent) + 1;
    createElements(wbc.skippedUsers, `beforeEnd`, [{
      attributes: {
        href: `/user/${username}`
      },
      text: username,
      type: `a`
    }]);
  }

  async function wbc_checkUsers(WBC, I, N, Callback) {
    let User, Result;
    if (!WBC.Canceled) {
      WBC.Progress.innerHTML = ``;
      WBC.OverallProgress.textContent = `${I} of ${N} users checked...`;
      if (I < N) {
        if (WBC.manualSkip) {
          wbc_skipUser(WBC, WBC.Users[I]);
          setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
        } else {
          User = (WBC.User && esgst.wbc_checkSingle) ? WBC.User : {
            Username: WBC.Users[I]
          };
          let user = {
            steamId: User.SteamID64,
            id: User.ID,
            username: User.Username
          };
          let notes, whitelisted, blacklisted, wbc;
          const savedUser = await getUser(null, user);
          if (savedUser) {
            notes = savedUser.notes;
            whitelisted = savedUser.whitelisted;
            blacklisted = savedUser.blacklisted;
            wbc = savedUser.wbc;
          }
          if (wbc && wbc.result) {
            Result = wbc.result;
          }
          if (!wbc || !esgst.wbc_checkNew) {
            wbc_checkUser(WBC, wbc, user.username, wbc => {
              if (wbc) {
                setTimeout(() => wbc_setResult(WBC, user, wbc, notes, whitelisted, blacklisted, (Result != wbc.result) ? true : false, I, N, Callback), 0);
              } else {
                wbc_skipUser(WBC, user.username);
                setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
              }
            });
          } else {
            setTimeout(() => wbc_setResult(WBC, user, wbc, notes, whitelisted, blacklisted, (Result != wbc.result) ? true : false, I, N, Callback), 0);
          }
        }
      } else if (Callback) {
        Callback();
      }
    }
  }

  async function wbc_setResult(WBC, user, wbc, notes, whitelisted, blacklisted, New, I, N, Callback) {
    let Key;
    if (!WBC.Canceled) {
      Key = ((wbc.result === `blacklisted` || wbc.result === `notBlacklisted`) && !WBC.B) ? `unknown` : wbc.result;
      WBC[Key].classList.remove(`esgst-hidden`);
      const attributes = {
        href: `href="/user/${user.username}`
      };
      if (New) {
        attributes.class = `esgst-bold esgst-italic`;
      }
      WBC[`${Key}Count`].textContent = parseInt(WBC[`${Key}Count`].textContent) + 1;
      createElements(WBC[`${Key}Users`], `beforeEnd`, [{
        attributes,
        text: user.username,
        type: `a`
      }]);
      if (!WBC.ShowResults) {
        if ((esgst.wbc_returnWhitelists && (wbc.result === `whitelisted`) && !whitelisted) || (WBC.B && esgst.wbc_returnBlacklists && (wbc.result === `blacklisted`) && !blacklisted)) {
          if (user.id) {
            wbc_returnWlBl(WBC, wbc, user.username, user.id, notes, async (success, notes) => {
              if (success) {
                user.values = {
                  wbc: wbc,
                  whitelisted: false,
                  blacklisted: false
                };
                if (notes) {
                  user.values.notes = notes;
                }
                user.values[wbc.result] = true;
                user.values[`${wbc.result}Date`] = Date.now();
              }
              await saveUser(null, null, user);
              setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
            });
          } else {
            await getUserId(user);
            wbc_returnWlBl(WBC, wbc, user.username, user.id, notes, async (success, notes) => {
              if (success) {
                user.values = {
                  wbc: wbc,
                  whitelisted: false,
                  blacklisted: false
                };
                if (notes) {
                  user.values.notes = notes;
                }
                user.values[wbc.result] = true;
                user.values[`${wbc.result}Date`] = Date.now();
              }
              await saveUser(null, null, user);
              setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
            });
          }
        } else if (wbc.result === `whitelisted` || wbc.result === `blacklisted` || whitelisted || blacklisted) {
          user.values = {
            wbc: wbc
          };
          await saveUser(null, null, user);
          setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
        } else if (New) {
          user.values = {
            wbc: null
          };
          await saveUser(null, null, user);
          setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
        } else {
          setTimeout(() => wbc_checkUsers(WBC, ++I, N, Callback), 0);
        }
      }
    }
  }

  async function wbc_returnWlBl(WBC, wbc, username, id, notes, Callback) {
    let Key, Type;
    if (!WBC.Canceled) {
      Key = wbc.result;
      Type = Key.match(/(.+)ed/)[1];
      createElements(WBC.Progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Returning ${Type} for ${username}...`,
        type: `span`
      }]);
      if (location.pathname.match(new RegExp(`^/user/${username}`))) {
        document.getElementsByClassName(`sidebar__shortcut__${Type}`)[0].click();
        if (esgst.wbc_n) {
          let msg = `Returned ${Type}.`;
          if (notes) {
            notes = `${msg}\n\n${notes}`;
          } else {
            notes = msg;
          }
        }
        Callback(true, notes);
      } else {
        let success = false;
        if (JSON.parse((await request({data: `xsrf_token=${esgst.xsrfToken}&do=${Type}&child_user_id=${id}&action=insert`, method: `POST`, queue: true, url: `/ajax.php`})).responseText).type === `success`) {
          success = true;
          if (esgst.wbc_n) {
            let msg = `${Key} in return.`;
            if (notes) {
              notes = `${msg}\n\n${notes}`;
            } else {
              notes = msg;
            }
          }
        }
        Callback(success, notes);
      }
    }
  }

  function wbc_checkUser(WBC, wbc, username, Callback) {
    let match;
    if (!WBC.Canceled) {
      if (WBC.manualSkip) {
        Callback();
      } else {
        if (esgst.wbc_clearCache) {
          wbc = null;
        }
        if (!wbc) {
          wbc = {
            lastCheck: 0,
            timestamp: 0
          };
        }
        if (wbc.giveaway) {
          match = wbc.giveaway.match(/\/giveaway\/(.+?)\//);
          if (match) {
            delete wbc.giveaway;
            wbc.ga = match[1];
          }
        }
        if (wbc.whitelistGiveaway) {
          match = wbc.whitelistGiveaway.match(/\/giveaway\/(.+?)\//);
          if (match) {
            delete wbc.whitelistGiveaway;
            wbc.wl_ga = match[1];
          }
        }
        if (wbc.groupGiveaways) {
          let key;
          for (key in wbc.groupGiveaways) {
            match = key.match(/^(.+?)\//);
            if (match) {
              if (!wbc.g_wl_gas) {
                wbc.g_wl_gas = {};
              }
              wbc.g_wl_gas[match[1]] = wbc.groupGiveaways[key];
              delete wbc.groupGiveaways[key];
            }
          }
          if (Object.keys(wbc.groupGiveaways).length === 0) {
            delete wbc.groupGiveaways;
          }
        }
        if (((Date.now() - wbc.lastCheck) > 86400000) || WBC.Update) {
          if (((!esgst.wbc_checkBlacklist || !WBC.B) && (wbc.wl_ga || wbc.g_wl_ga)) || (esgst.wbc_checkBlacklist && WBC.B && wbc.ga)) {
            WBC.Timestamp = wbc.timestamp;
            wbc_checkGiveaway(WBC, wbc, username, Callback);
          } else {
            WBC.Timestamp = 0;
            WBC.GroupGiveaways = [];
            match = location.href.match(new RegExp(`/user/${username}(/search?page=(\\d+))?`));
            wbc_getGiveaways(WBC, wbc, username, 1, match ? (match[2] ? parseInt(match[2]) : 1) : 0, `/user/${username}/search?page=`, Callback);
          }
        } else {
          Callback(wbc);
        }
      }
    }
  }

  async function wbc_checkGiveaway(WBC, wbc, username, Callback) {
    if (WBC.Canceled) return;
    let responseHtml = parseHtml((await request({method: `GET`, queue: true, url: `/giveaway/${wbc.wl_ga || wbc.g_wl_ga || wbc.ga}/`})).responseText);
    let errorMessage = responseHtml.getElementsByClassName(`table--summary`)[0];
    let stop;
    if (errorMessage) {
      errorMessage = errorMessage.textContent;
      if (errorMessage.match(/blacklisted the giveaway creator/)) {
        wbc.result = `notBlacklisted`;
        stop = true;
      } else if (errorMessage.match(/blacklisted by the giveaway creator/)) {
        wbc.result = `blacklisted`;
      } else if (errorMessage.match(/not a member of the giveaway creator's whitelist/)) {
        wbc.result = `none`;
      } else {
        wbc.result = `notBlacklisted`;
      }
      wbc.lastCheck = Date.now();
      wbc.timestamp = WBC.Timestamp;
      Callback(wbc, stop);
    } else if (wbc.wl_ga) {
      wbc.result = `whitelisted`;
      wbc.lastCheck = Date.now();
      wbc.timestamp = WBC.Timestamp;
      Callback(wbc, stop);
    } else if (wbc.g_wl_ga) {
      let found, groups, i, j, n;
      found = false;
      groups = JSON.parse(await getValue(`groups`, `[]`));
      for (i = 0, n = wbc.g_wl_gas[wbc.g_wl_ga].length; i < n && !found; ++i) {
        for (j = groups.length - 1; j > -1 && groups[j].code !== wbc.g_wl_gas[wbc.g_wl_ga][i]; --j);
        if (j > -1 && groups[j].member) {
          found = true;
        }
      }
      if (found) {
        WBC.Timestamp = 0;
        WBC.GroupGiveaways = [];
        let match = location.href.match(new RegExp(`/user/${username}(/search?page=(\\d+))?`));
        wbc_getGiveaways(WBC, wbc, username, 1, match ? (match[2] ? parseInt(match[2]) : 1) : 0, `/user/${username}/search?page=`, Callback);
      } else {
        wbc.result = `whitelisted`;
        wbc.lastCheck = Date.now();
        wbc.timestamp = WBC.Timestamp;
        Callback(wbc, stop);
      }
    } else {
      wbc.result = `notBlacklisted`;
      wbc.lastCheck = Date.now();
      wbc.timestamp = WBC.Timestamp;
      Callback(wbc, stop);
    }
  }

  async function wbc_getGiveaways(WBC, wbc, username, NextPage, CurrentPage, URL, Callback, Context) {
    let Giveaway, Pagination;
    if (WBC.Canceled) return;
    if (!esgst.wbc_skipUsers || NextPage - 1 <= esgst.wbc_pages) {
      if (WBC.manualSkip) {
        Callback();
      } else {
        if (Context) {
          if (NextPage === 2) {
            WBC.lastPage = lpl_getLastPage(Context, false, false, true);
            WBC.lastPage = WBC.lastPage === 999999999 ? `` : ` of ${WBC.lastPage}`;
          }
          createElements(WBC.Progress, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch fa-spin`
            },
            type: `i`
          }, {
            text: `Retrieving ${username}'s giveaways (page ${NextPage - 1}${WBC.lastPage})...`,
            type: `span`
          }]);
          if (!wbc.ga) {
            Giveaway = Context.querySelector(`[class="giveaway__heading__name"][href*="/giveaway/"]`);
            wbc.ga = Giveaway ? Giveaway.getAttribute(`href`).match(/\/giveaway\/(.+?)\//)[1] : null;
          }
          Pagination = Context.getElementsByClassName(`pagination__navigation`)[0];
          Giveaway = Context.getElementsByClassName(`giveaway__summary`)[0];
          if (Giveaway && (WBC.Timestamp === 0)) {
            WBC.Timestamp = parseInt(Giveaway.querySelector(`[data-timestamp]`).getAttribute(`data-timestamp`));
            if (WBC.Timestamp >= (new Date().getTime())) {
              WBC.Timestamp = 0;
            }
          }
          if (wbc.ga) {
            wbc_checkGiveaway(WBC, wbc, username, (wbc, stop) => {
              let WhitelistGiveaways, I, N, GroupGiveaway;
              if ((wbc.result === `notBlacklisted`) && !stop && (!esgst.wbc_checkBlacklist || !WBC.B)) {
                WhitelistGiveaways = Context.getElementsByClassName(`giveaway__column--whitelist`);
                for (I = 0, N = WhitelistGiveaways.length; (I < N) && !wbc.wl_ga; ++I) {
                  GroupGiveaway = WhitelistGiveaways[I].parentElement.getElementsByClassName(`giveaway__column--group`)[0];
                  if (GroupGiveaway) {
                    WBC.GroupGiveaways.push(GroupGiveaway.getAttribute(`href`).match(/\/giveaway\/(.+?)\//)[1]);
                  } else {
                    wbc.wl_ga = WhitelistGiveaways[I].closest(`.giveaway__summary`).getElementsByClassName(`giveaway__heading__name`)[0].getAttribute(`href`).match(/\/giveaway\/(.+?)\//)[1];
                  }
                }
                if (wbc.wl_ga) {
                  wbc_checkGiveaway(WBC, wbc, username, Callback);
                } else if (((WBC.Timestamp >= wbc.timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
                  setTimeout(() => wbc_getGiveaways(WBC, wbc, username, NextPage, CurrentPage, URL, Callback), 0);
                } else if ((wbc.g_wl_gas && Object.keys(wbc.g_wl_gas).length) || WBC.GroupGiveaways.length) {
                  wbc_getGroupGiveaways(WBC, 0, WBC.GroupGiveaways.length, wbc, username, async (wbc, Result) => {
                    let Groups, GroupGiveaways, Found;
                    if (wbc) {
                      if (Result) {
                        Callback(wbc);
                      } else {
                        Groups = JSON.parse(await getValue(`groups`, `[]`));
                        for (GroupGiveaway in wbc.g_wl_gas) {
                          Found = false;
                          GroupGiveaways = wbc.g_wl_gas[GroupGiveaway];
                          for (I = 0, N = GroupGiveaways.length; (I < N) && !Found; ++I) {
                            let i;
                            for (i = Groups.length - 1; i >= 0 && Groups[i].code !== GroupGiveaways[I]; --i);
                            if (i >= 0 && Groups[i].member) {
                              Found = true;
                            }
                          }
                          if (!Found) {
                            wbc.g_wl_ga = GroupGiveaway;
                            break;
                          }
                        }
                        if (Found) {
                          Callback(wbc);
                        } else {
                          wbc.result = `whitelisted`;
                          Callback(wbc);
                        }
                      }
                    } else {
                      Callback();
                    }
                  });
                } else {
                  Callback(wbc);
                }
              } else {
                Callback(wbc);
              }
            });
          } else if (((WBC.Timestamp >= wbc.timestamp) || (WBC.Timestamp === 0)) && Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
            setTimeout(() => wbc_getGiveaways(WBC, wbc, username, NextPage, CurrentPage, URL, Callback), 0);
          } else {
            wbc.result = `unknown`;
            wbc.lastCheck = Date.now();
            wbc.timestamp = WBC.Timestamp;
            Callback(wbc);
          }
        } else if (!WBC.Canceled) {
          if (CurrentPage != NextPage) {
            let Response = await request({method: `GET`, queue: true, url: URL + NextPage});
            if (Response.finalUrl.match(/\/user\//)) {
              setTimeout(() => wbc_getGiveaways(WBC, wbc, username, ++NextPage, CurrentPage, URL, Callback, parseHtml(Response.responseText)), 0);
            } else {
              wbc.result = `unknown`;
              wbc.lastCheck = Date.now();
              wbc.timestamp = WBC.Timestamp;
              Callback(wbc);
            }
          } else {
            setTimeout(() => wbc_getGiveaways(WBC, wbc, username, ++NextPage, CurrentPage, URL, Callback, document), 0);
          }
        }
      }
    } else {
      Callback();
    }
  }

  function wbc_getGroupGiveaways(WBC, I, N, wbc, username, callback) {
    if (!WBC.Canceled) {
      if (I < N) {
        if (WBC.manualSkip) {
          callback();
        } else {
          createElements(WBC.Progress, `inner`, [{
            attributes: {
              class: `fa fa-circle-o-notch`
            },
            type: `i`
          }, {
            text: `Retrieving ${username}'s group giveaways (${I + 1} of ${N})...`,
            type: `span`
          }]);
          if (wbc.groupGiveaways && wbc.groupGiveaways[WBC.GroupGiveaways[I]]) {
            setTimeout(() => wbc_getGroupGiveaways(WBC, ++I, N, wbc, username, callback), 0);
          } else {
            wbc_getGroups(WBC, `/giveaway/${WBC.GroupGiveaways[I]}/_/groups/search?page=`, 1, wbc, username, (wbc, Result) => {
              if (wbc) {
                if (Result) {
                  callback(wbc, Result);
                } else {
                  setTimeout(() => wbc_getGroupGiveaways(WBC, ++I, N, wbc, username, callback), 0);
                }
              } else {
                callback();
              }
            });
          }
        }
      } else {
        callback(wbc);
      }
    }
  }

  async function wbc_getGroups(WBC, URL, NextPage, wbc, username, Callback) {
    if (WBC.Canceled) return;
    if (WBC.manualSkip) {
      Callback();
    } else {
      let Response = await request({method: `GET`, queue: true, url: URL + NextPage});
      let ResponseText, ResponseHTML, Groups, N, GroupGiveaway, I, Group, Pagination;
      ResponseText = Response.responseText;
      ResponseHTML = parseHtml(ResponseText);
      Groups = ResponseHTML.getElementsByClassName(`table__column__heading`);
      N = Groups.length;
      if (N > 0) {
        if (!wbc.g_wl_gas) {
          wbc.g_wl_gas = {};
        }
        GroupGiveaway = URL.match(/\/giveaway\/(.+?)\//)[1];
        if (!wbc.g_wl_gas[GroupGiveaway]) {
          wbc.g_wl_gas[GroupGiveaway] = [];
        }
        for (I = 0; I < N; ++I) {
          Group = Groups[I].getAttribute(`href`).match(/\/group\/(.+?)\//)[1];
          if (wbc.g_wl_gas[GroupGiveaway].indexOf(Group) < 0) {
            wbc.g_wl_gas[GroupGiveaway].push(Group);
          }
        }
        Pagination = ResponseHTML.getElementsByClassName(`pagination__navigation`)[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
          setTimeout(() => wbc_getGroups(WBC, NextPage === 1 ? `${Response.finalUrl}/search?page=` : URL, ++NextPage, wbc, username, Callback), 0);
        } else {
          Callback(wbc);
        }
      } else {
        wbc.result = `none`;
        Callback(wbc, true);
      }
    }
  }

  async function wbc_getUsers(WBC, NextPage, CurrentPage, URL, Callback, Context) {
    let Matches, I, N, Match, Username, Pagination;
    if (WBC.Canceled) return;
    if (Context) {
      if (!WBC.lastPage) {
        WBC.lastPage = lpl_getLastPage(Context, true);
        WBC.lastPage = WBC.lastPage === 999999999 ? `` : ` of ${WBC.lastPage}`;
      }
      createElements(WBC.Progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Retrieving users (page ${NextPage}${WBC.lastPage})...`,
        type: `span`
      }]);
      Matches = Context.querySelectorAll(`a[href*="/user/"]`);
      for (I = 0, N = Matches.length; I < N; ++I) {
        Match = Matches[I].getAttribute(`href`).match(/\/user\/(.+)/);
        if (Match) {
          Username = Match[1];
          if ((WBC.Users.indexOf(Username) < 0) && (Username != WBC.Username) && (Username === Matches[I].textContent) && !Matches[I].closest(`.markdown`)) {
            WBC.Users.push(Username);
          }
        }
      }
      Pagination = Context.getElementsByClassName(`pagination__navigation`)[0];
      if (Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
        setTimeout(() => wbc_getUsers(WBC, NextPage, CurrentPage, URL, Callback), 0);
      } else {
        Callback();
      }
    } else if (!WBC.Canceled) {
      if (!esgst.wbc_checkPages || NextPage <= esgst.wbc_maxPage) {
        NextPage += 1;
        if (CurrentPage != NextPage) {
          setTimeout(async () => wbc_getUsers(WBC, NextPage, CurrentPage, URL, Callback, parseHtml((await request({method: `GET`, queue: true, url: URL + NextPage})).responseText)), 0);
        } else {
          setTimeout(() => wbc_getUsers(WBC, NextPage, CurrentPage, URL, Callback, esgst.pageOuterWrap), 0);
        }
      } else {
        Callback();
      }
    }
  }

