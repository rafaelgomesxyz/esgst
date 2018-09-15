_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-times-circle"></i>) to the "Gifts Sent" row of a user's <a href="https://www.steamgifts.com/user/cg">profile</a> page that allows you to find all of their created giveaways that were marked as not received.</li>
        <li>Giveaways for more than 3 copies that were marked as not received can only be found if the winner(s) that marked it as not received is(are) visible in the creator's profile page or if you can access the giveaway and the option to search inside of giveaways is enabled. If they are not found, a list with all of the creator's giveaways for more than 3 copies will be shown.</li>
        <li>Results are cached for 1 week, so if you check the same user again within that timeframe, their status will not change.</li>
      </ul>
    `,
    id: `nrf`,
    load: nrf,
    name: `Not Received Finder`,
    sg: true,
    type: `users`
  });

  function nrf() {
    esgst.profileFeatures.push(nrf_add);
  }

  function nrf_add(profile) {
    let NRF;
    NRF = {
      N: profile.notSent
    };
    if (NRF.N > 0) {
      NRF.I = 0;
      NRF.Multiple = [];
      createElements(profile.sentRowLeft, `beforeEnd`, [{
        attributes: {
          class: `esgst-nrf-button`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-times-circle`,
            title: getFeatureTooltip(`nrf`, `Find not received giveaways`)
          },
          type: `i`
        }]
      }]);
      nrf_setPopup(NRF, profile.sentRowLeft.lastElementChild, profile);
    }
  }

  function nrf_setPopup(NRF, NRFButton, profile) {
    let popup;
    popup = new Popup(`fa-times`, `Find ${profile.username}'s not received giveaways:`);
    popup.Options = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    popup.Options.appendChild(createOptions([{
      check: true,
      description: `Also search inside giveaways with multiple copies.`,
      id: `nrf_searchMultiple`,
      tooltip: `If disabled, only giveaways with visible not received copies will be found (faster).`
    }]));
    createElements(popup.Options, `afterEnd`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `If you're blacklisted / not whitelisted / not a member of the same Steam groups, not all giveaways will be found.`,
      type: `div`
    }]);
    popup.description.appendChild(new ButtonSet(`green`, `grey`, `fa-search`, `fa-times-circle`, `Find`, `Cancel`, Callback => {
      NRFButton.classList.add(`esgst-busy`);
      nrf_setSearch(NRF, profile, () => {
        NRF.Progress.innerHTML = ``;
        NRFButton.classList.remove(`esgst-busy`);
        Callback();
      });
    }, () => {
      clearInterval(NRF.Request);
      clearInterval(NRF.Save);
      NRF.Canceled = true;
      setTimeout(() => {
        NRF.Progress.innerHTML = ``;
      }, 500);
      NRFButton.classList.remove(`esgst-busy`);
    }).set);
    NRF.Progress = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    NRF.OverallProgress = createElements(popup.description, `beforeEnd`, [{ type: `div` }]);
    NRF.Results = createElements(popup.scrollable, `beforeEnd`, [{ type: `div` }]);
    NRF.popup = popup;
    NRFButton.addEventListener(`click`, () => {
      popup.open();
    });
  }

  async function nrf_setSearch(NRF, profile, Callback) {
    NRF.Progress.innerHTML = ``;
    NRF.OverallProgress.innerHTML = ``;
    NRF.Results.innerHTML = ``;
    NRF.Canceled = false;
    let user = {
      steamId: profile.steamId,
      id: profile.id,
      username: profile.username
    };
    let nrf;
    const savedUser = await getUser(null, user);
    if (savedUser) {
      nrf = savedUser.nrf;
    }
    if (!nrf) {
      nrf = {
        lastCheck: 0,
        found: 0,
        total: 0,
        results: ``
      };
    }
    if ((Date.now() - nrf.lastCheck) > 604800000) {
      nrf_searchUser(NRF, user.username, 1, 0, `/user/${user.username}/search?page=`, async () => {
        nrf.lastCheck = Date.now();
        nrf.found = NRF.I;
        nrf.total = NRF.N;
        nrf.results = NRF.Results.innerHTML;
        user.values = {
          nrf: nrf
        };
        await saveUser(null, null, user);
        await endless_load(NRF.Results);
        NRF.Progress.innerHTML = ``;
        Callback();
      });
    } else {
      createElements(NRF.Results, `inner`, [...(Array.from(parseHtml(nrf.results).body.childNodes).map(x => {
        return {
          context: x
        };
      }))]);
      createElements(NRF.OverallProgress, `inner`, [{
        text: `${nrf.found} of ${nrf.total} not received giveaways found...`,
        type: `node`
      }]);
      await endless_load(NRF.Results);
      Callback();
    }
  }

  async function nrf_searchUser(NRF, username, NextPage, CurrentPage, URL, Callback, Context) {
    let Matches, I, N, Match, Pagination;
    if (NRF.Canceled) return;
    if (Context) {
      if (NextPage === 2) {
        NRF.lastPage = lpl_getLastPage(Context, false, false, true);
        NRF.lastPage = NRF.lastPage === 999999999 ? `` : ` of ${NRF.lastPage}`;
      }
      createElements(NRF.Progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Searching ${username}'s giveaways (page ${NextPage - 1}${NRF.lastPage})...`,
        type: `span`
      }]);
      Matches = Context.querySelectorAll(`div.giveaway__column--negative`);
      for (I = 0, N = Matches.length; I < N; ++I) {
        NRF.I += Matches[I].querySelectorAll(`a[href*="/user/"]`).length;
        NRF.Results.appendChild(Matches[I].closest(`.giveaway__row-outer-wrap`).cloneNode(true));
      }
      createElements(NRF.OverallProgress, `inner`, [{
        text: `${NRF.I} of ${NRF.N} not received giveaways found...`,
        type: `node`
      }]);
      if (NRF.I < NRF.N) {
        if (esgst.nrf_searchMultiple) {
          Matches = Context.getElementsByClassName(`giveaway__heading__thin`);
          for (I = 0, N = Matches.length; I < N; ++I) {
            Match = Matches[I].textContent.match(/\((.+) Copies\)/);
            if (Match && (parseInt(Match[1]) > 3)) {
              NRF.Multiple.push(Matches[I].closest(`.giveaway__row-outer-wrap`).cloneNode(true));
            }
          }
        }
        Pagination = Context.getElementsByClassName(`pagination__navigation`)[0];
        if (Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
          setTimeout(() => nrf_searchUser(NRF, username, NextPage, CurrentPage, URL, Callback), 0);
        } else if (esgst.nrf_searchMultiple && NRF.Multiple.length) {
          setTimeout(() => nrf_searchMultiple(NRF, 0, NRF.Multiple.length, Callback), 0);
        } else {
          Callback();
        }
      } else {
        Callback();
      }
    } else if (!NRF.Canceled) {
      setTimeout(async () => nrf_searchUser(NRF, username, ++NextPage, CurrentPage, URL, Callback, parseHtml((await request({method: `GET`, queue: true, url: URL + NextPage})).responseText)), 0);
    }
  }

  function nrf_searchMultiple(NRF, I, N, Callback) {
    if (!NRF.Canceled) {
      createElements(NRF.Progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Searching inside giveaways with multiple copies (${I + 1} of ${N})...`,
        type: `span`
      }]);
      if (I < N) {
        nrf_searchGiveaway(NRF, `${NRF.Multiple[I].getElementsByClassName(`giveaway__heading__name`)[0].getAttribute(`href`)}/winners/search?page=`, 1, Found => {
          if (Found) {
            NRF.Results.appendChild(NRF.Multiple[I].cloneNode(true));
          }
          if (NRF.I < NRF.N) {
            setTimeout(() => nrf_searchMultiple(NRF, ++I, N, Callback), 0);
          } else {
            Callback();
          }
        });
      } else {
        Callback();
      }
    }
  }

  async function nrf_searchGiveaway(NRF, URL, NextPage, Callback) {
    if (NRF.Canceled) return;
    let ResponseHTML, Matches, I, N, Found, Pagination;
    ResponseHTML = parseHtml((await request({method: `GET`, queue: true, url: URL + NextPage})).responseText);
    Matches = ResponseHTML.getElementsByClassName(`table__column--width-small`);
    for (I = 0, N = Matches.length; I < N; ++I) {
      if (Matches[I].textContent.match(/Not Received/)) {
        Found = true;
        ++NRF.I;
        createElements(NRF.OverallProgress, `inner`, [{
          text: `${NRF.I} of ${NRF.N} not received giveaways found...`,
          type: `node`
        }]);
        if (NRF.I >= NRF.N) {
          break;
        }
      }
    }
    Pagination = ResponseHTML.getElementsByClassName(`pagination__navigation`)[0];
    if ((NRF.I < NRF.N) && Pagination && !Pagination.lastElementChild.classList.contains(`is-selected`)) {
      setTimeout(() => nrf_searchGiveaway(NRF, URL, ++NextPage, Callback), 0);
    } else {
      Callback(Found);
    }
  }
  
