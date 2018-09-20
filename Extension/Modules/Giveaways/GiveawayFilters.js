_MODULES.push({
    description: `
      <ul>
        <li>Allows you to filter giveaways.</li>
      </ul>
    `,
    features: {
      gf_s: {
        description: `
          <ul>
            <li>Adds a button (<i class="fa fa-eye"></i> if the giveaway is hidden and <i class="fa fa-eye-slash"></i> if it is not) next to a giveaway's game name (in any page) that allows you to hide the giveaway.</li>
            <li>Adds a button (<i class="fa fa-gift"></i> <i class="fa fa-eye-slash"></i>) to the page heading of this menu that allows you to view all of the giveaways that have been hidden.</li>
          </ul>
        `,
        name: `Single Filters`,
        sg: true
      },
      gf_m: {
        description: `
          <ul>
            <li>Allows you to hide multiple giveaways in a page using many different filters.</li>
            <li>Adds a toggle switch with a button (<i class="fa fa-sliders"></i>) to the main page heading of any <a href="https://www.steamgifts.com/giveaways">giveaways</a>/<a href="https://www.steamgifts.com/giveaways/created">created</a>/<a href="https://www.steamgifts.com/giveaways/entered">entered</a>/<a href="https://www.steamgifts.com/giveaways/won">won</a>/<a href="https://www.steamgifts.com/user/cg">user</a>/<a href="https://www.steamgifts.com/group/SJ7Bu/">group</a> page and some popups ([id=gb], [id=ged], [id=ge], etc...). The switch allows you to turn the filters on/off and the button allows you to manage your presets.</li>
            <li>Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 3 categories:</li>
            <ul>
              <li>Basic filters are related to a numeric value (such as the level of a giveaway) and have a slider that you can use to set the range of the filter (any giveaways that do not apply to the range will be hidden).</li>
              <li>Type filters are related to a boolean value (such as whether or not a giveaway was created by yourself) and have a checkbox that changes states when you click on it. The checkbox has 3 states:</li>
              <ul>
                <li>"Show all" (<i class="fa fa-check-square"></i>) does not hide any giveaways that apply to the filter (this is the default state).</li>
                <li>"Show only" (<i class="fa fa-square"></i>) hides any giveaways that do not apply to the filter.</li>
                <li>"Hide all" (<i class="fa fa-square-o"></i>) hides any giveaways that apply to the filter.</li>
              </ul>
              <li>Category filters are essentially the same thing as type filters, but for game categories ([id=gc]).</li>
            </ul>
            <li>A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:</li>
            <ul>
              <li>Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.</li>
              <li>Exception rules are the ones that you can change by clicking on the icon <i class="fa fa-gear"></i> in the filter panel. They are exceptions to the basic rules. For example, if you set the basic rule of the "Created" filter to "hide all" and you add an exception rule for the "Level" filter to the 0-5 range, none of your created giveaways that are for the levels 0-5 will be hidden, because they apply to the exception.</li>
              <li>Override rules are the ones that you can change by clicking on the icon (<i class="fa fa-exclamation esgst-faded"></i> if set to overridable and <i class="fa fa-exclamation"></i> if set to non-overridable) next to each filter. They are enforcements of the basic rules. Continuing the previous example, if you set the override rule of the "Created" filter to "non-overridable", then all of your created giveaways will be hidden, because even if they apply to the exception, the basic rule is being enforced by the override rule, so the exception cannot override it.</li>
            </ul>
            <li>Adds a text in parenthesis to the pagination of the page showing how many giveaways in the page are being filtered by the filters.</li>
          </ul>
        `,
        features: {
          gf_m_b: {
            name: `Hide basic filters.`,
            sg: true
          },
          gf_m_a: {
            name: `Hide advanced filters.`,
            sg: true
          },
          gf_level: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by level.</li>
              </ul>
            `,
            name: `Level`,
            sg: true
          },
          gf_entries: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by number of entries.</li>
              </ul>
            `,
            name: `Entries`,
            sg: true
          },
          gf_copies: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by number of copies.</li>
              </ul>
            `,
            name: `Copies`,
            sg: true
          },
          gf_points: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by how many points they cost.</li>
              </ul>
            `,
            name: `Points`,
            sg: true
          },
          gf_comments: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by number of comments.</li>
              </ul>
            `,
            name: `Comments`,
            sg: true
          },
          gf_minutesToEnd: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by how much time they have left.</li>
              </ul>
            `,
            name: `Minutes To End`,
            sg: true
          },
          gf_chance: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by chance (basic).</li>
                <li>This option requires [id=gwc] enabled to work.</li>
              </ul>
            `,
            name: `Chance`,
            sg: true
          },
          gf_projectedChance: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by projected chance (advanced).</li>
                <li>This option requires [id=gwc_a] enabled to work.</li>
              </ul>
            `,
            name: `Chance`,
            sg: true
          },
          gf_chancePerPoint: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by chance per point using the basic chance.</li>
                <li>This option requires [id=gwc] enabled to work.</li>
              </ul>
            `,
            name: `Chance Per Point`,
            sg: true
          },
          gf_projectedChancePerPoint: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by chance per point using the advanced chance.</li>
                <li>This option requires [id=gwc_a] enabled to work.</li>
              </ul>
            `,
            name: `Projected Chance Per Point`,
            sg: true
          },
          gf_ratio: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by ratio (basic).</li>
                <li>This option requires [id=gwr] enabled to work.</li>
              </ul>
            `,
            name: `Ratio`,
            sg: true
          },
          gf_projectedRatio: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by projected ratio (advanced).</li>
                <li>This option requires [id=gwr_a] enabled to work.</li>
              </ul>
            `,
            name: `Projected Ratio`,
            sg: true
          },
          gf_pointsToWin: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by points to win.</li>
                <li>This option requires [id=gptw] enabled to work.</li>
              </ul>
            `,
            name: `Points To Win`,
            sg: true
          },
          gf_rating: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by rating percentage of the game.</li>
                <li>This option requires [id=gc_r] enabled to work.</li>
              </ul>
            `,
            name: `Rating`,
            sg: true
          },
          gf_reviews: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by the number of reviews that the game has.</li>
                <li>This option requires [id=gc_r] enabled to work.</li>
              </ul>
            `,
            name: `Reviews`,
            sg: true
          },
          gf_releaseDate: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by release date of the game.</li>
                <li>This option requires [id=gc_rd] enabled to work.</li>
              </ul>
            `,
            name: `Release Date`,
            sg: true
          },
          gf_pinned: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are pinned.</li>
              </ul>
            `,
            name: `Pinned`,
            sg: true
          },
          gf_public: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are public.</li>
              </ul>
            `,
            name: `Public`,
            sg: true
          },
          gf_inviteOnly: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are invite only.</li>
              </ul>
            `,
            name: `Invite Only`,
            sg: true
          },
          gf_group: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are for groups.</li>
              </ul>
            `,
            name: `Group`,
            sg: true
          },
          gf_whitelist: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are for whitelist.</li>
              </ul>
            `,
            name: `Whitelist`,
            sg: true
          },
          gf_regionRestricted: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are region restricted.</li>
              </ul>
            `,
            name: `Region Restricted`,
            sg: true
          },
          gf_enterable: {
            description: `
              <ul>
                <li>Allows you filter giveaways that are enterable in [id=ge].</li>
              </ul>
            `,
            name: `Enterable`,
            sg: true            
          },
          gf_created: {
            description: `
              <ul>
                <li>Allows you to filter giveaways created by yourself.</li>
              </ul>
            `,
            name: `Created`,
            sg: true
          },
          gf_received: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that have been marked as received.</li>
              </ul>
            `,
            name: `Received`,
            sg: true
          },
          gf_notReceived: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that have been marked as not received.</li>
              </ul>
            `,
            name: `Not Received`,
            sg: true
          },
          gf_awaitingFeedback: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that are awaiting feedback.</li>
              </ul>
            `,
            name: `Awaiting Feedback`,
            sg: true
          },
          gf_entered: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that you have entered.</li>
              </ul>
            `,
            name: `Entered`,
            sg: true
          },
          gf_started: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that have started.</li>
              </ul>
            `,
            name: `Started`,
            sg: true
          },
          gf_ended: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that have ended.</li>
              </ul>
            `,
            name: `Ended`,
            sg: true
          },
          gf_deleted: {
            description: `
              <ul>
                <li>Allows you to filter giveaways that have been deleted.</li>
              </ul>
            `,
            name: `Deleted`,
            sg: true
          },
          gf_owned: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you own on Steam.</li>
              </ul>
            `,
            name: `Owned`,
            sg: true
          },
          gf_wishlisted: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have wishlisted on Steam.</li>
              </ul>
            `,
            name: `Wishlisted`,
            sg: true
          },
          gf_followed: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have followed on Steam.</li>
              </ul>
            `,
            name: `Followed`,
            sg: true
          },
          gf_hidden: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have hidden on SteamGifts.</li>
              </ul>
            `,
            name: `Hidden`,
            sg: true
          },
          gf_ignored: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have ignored on Steam.</li>
              </ul>
            `,
            name: `Ignored`,
            sg: true
          },
          gf_previouslyEntered: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have previously entered giveaways for.</li>
                <li>This option requires [id=egh] enabled to work.</li>
              </ul>
            `,
            name: `Previously Entered`,
            sg: true
          },
          gf_previouslyWon: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that you have previously won.</li>
              </ul>
            `,
            name: `Previously Won`,
            sg: true
          },
          gf_fullCV: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that give full CV.</li>
              </ul>
            `,
            name: `Full CV`,
            sg: true
          },
          gf_reducedCV: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that give reduced CV.</li>
              </ul>
            `,
            name: `Reduced CV`,
            sg: true
          },
          gf_noCV: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that give no CV.</li>
              </ul>
            `,
            name: `No CV`,
            sg: true
          },
          gf_sgTools: {
            description: `
              <ul>
                <li>Allows you to filter SGTools giveaways.</li>
                <li>This option requires [id=ge] enabled to work.</li>
              </ul>
            `,
            name: `SGTools`,
            sg: true
          },
          gf_groups: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by group.</li>
                <li>This option requires [id=ggl] enabled as "Panel (On Page Load)" to work.</li>
              </ul>
            `,
            name: `Groups`,
            sg: true
          },
          gf_creators: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by creator.</li>
              </ul>
            `,
            name: `Creators`,
            sg: true
          },
          gf_learning: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that Steam is learning about.</li>
                <li>This option requires [id=gc_lg] enabled to work.</li>
              </ul>
            `,
            name: `Learning`,
            sg: true
          },
          gf_removed: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that have been removed from the Steam store.</li>
                <li>This option requires [id=gc_rm] enabled to work.</li>
              </ul>
            `,
            name: `Removed`,
            sg: true
          },
          gf_tradingCards: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that have trading cards.</li>
                <li>This option requires [id=gc_tc] enabled to work.</li>
              </ul>
            `,
            name: `Trading Cards`,
            sg: true
          },
          gf_achievements: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that have achievements.</li>
                <li>This option requires [id=gc_a] enabled to work.</li>
              </ul>
            `,
            name: `Achievements`,
            sg: true
          },
          gf_singleplayer: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are singleplayer.</li>
                <li>This option requires [id=gc_sp] enabled to work.</li>
              </ul>
            `,
            name: `Singleplayer`,
            sg: true
          },
          gf_multiplayer: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are multiplayer.</li>
                <li>This option requires [id=gc_mp] enabled to work.</li>
              </ul>
            `,
            name: `Multiplayer`,
            sg: true
          },
          gf_steamCloud: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that have Steam Cloud.</li>
                <li>This option requires [id=gc_sc] enabled to work.</li>
              </ul>
            `,
            name: `Steam Cloud`,
            sg: true
          },
          gf_linux: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that have are compatible with Linux.</li>
                <li>This option requires [id=gc_l] enabled to work.</li>
              </ul>
            `,
            name: `Linux`,
            sg: true
          },
          gf_mac: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are compatible with Mac.</li>
                <li>This option requires [id=gc_m] enabled to work.</li>
              </ul>
            `,
            name: `Mac`,
            sg: true
          },
          gf_dlc: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are DLCs.</li>
                <li>This option requires [id=gc_dlc] enabled to work.</li>
              </ul>
            `,
            name: `DLC`,
            sg: true
          },
          gf_dlcOwned: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are DLCs and have a base game that you own.</li>
                <li>This option requires [id=gc_dlc_o] enabled to work.</li>
              </ul>
            `,
            name: `DLC (Owned Base)`,
            sg: true
          },
          gf_dlcFree: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are DLCs and have a free base game.</li>
                <li>This option requires [id=gc_dlc_b] enabled to work.</li>
              </ul>
            `,
            name: `DLC (Free Base)`,
            sg: true
          },
          gf_dlcNonFree: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are DLCs and have a non-free base game.</li>
                <li>This option requires [id=gc_dlc_b] enabled to work.</li>
              </ul>
            `,
            name: `DLC (Non-Free Base)`,
            sg: true
          },
          gf_package: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are packages.</li>
                <li>This option requires [id=gc_p] enabled to work.</li>
              </ul>
            `,
            name: `Package`,
            sg: true
          },
          gf_earlyAccess: {
            description: `
              <ul>
                <li>Allows you to filter giveaways for games that are in early access.</li>
                <li>This option requires [id=gc_ea] enabled to work.</li>
              </ul>
            `,
            name: `Early Access`,
            sg: true
          },
          gf_genres: {
            description: `
              <ul>
                <li>Allows you to filter giveaways by game genre.</li>
                <li>This option requires [id=gc_g] enabled to work.</li>
              </ul>
            `,
            name: `Genres`,
            sg: true
          },
          gf_os: {
            description: `
              <ul>
                <li>Allows you to quickly enable/disable SteamGifts' "Filter by OS" filter.</li>
              </ul>
            `,
            name: `OS (SteamGifts)`,
            sg: true
          },
          gf_alreadyOwned: {
            description: `
              <ul>
                <li>Allows you to quickly enable/disable SteamGifts' "Hide games you already own" filter.</li>
              </ul>
            `,
            name: `Already Owned (SteamGifts)`,
            sg: true
          },
          gf_dlcMissingBase: {
            description: `
              <ul>
                <li>Allows you to quickly enable/disable SteamGifts' "Hide DLC if you're missing the base game" filter.</li>
              </ul>
            `,
            name: `DLC Missing Base (SteamGifts)`,
            sg: true
          },
          gf_aboveLevel: {
            description: `
              <ul>
                <li>Allows you to quickly enable/disable SteamGifts' "Hide giveaways above your level" filter.</li>
              </ul>
            `,
            name: `Above Level (SteamGifts)`,
            sg: true
          },
          gf_manuallyFiltered: {
            description: `
              <ul>
                <li>Allows you to quickly enable/disable SteamGifts' "Hide games you manually filtered" filter.</li>
              </ul>
            `,
            name: `Manually Filtered (SteamGifts)`,
            sg: true
          }
        },
        name: `Multiple Filters`,
        sg: true
      }
    },
    id: `gf`,
    load: gf,
    name: `Giveaway Filters`,
    sg: true,
    sync: `Hidden Games, Owned/Wishlisted/Ignored Games, Won Games, Reduced CV Games, No CV Games and Giveaways`,
    type: `giveaways`
  });

  function gf() {
    if (esgst.gf_s) {
      esgst.giveawayFeatures.push(gf_getGiveaways);
    }
    if (esgst.gf_m && (esgst.giveawaysPath || esgst.createdPath || esgst.enteredPath || esgst.wonPath || esgst.groupPath || esgst.userPath)) {
      esgst.style.insertAdjacentText(`beforeEnd`, `
        .esgst-gf-container {
          top: ${esgst.commentsTop - 5}px;
        }
      `);
      if (esgst.hideButtons && esgst.hideButtons_gf) {
        if (esgst.leftButtonIds.indexOf(`gf`) > -1) {
          esgst.leftButtons.insertBefore(filters_addContainer(`gf`, esgst.mainPageHeading), esgst.leftButtons.firstElementChild);
        } else {
          esgst.rightButtons.appendChild(filters_addContainer(`gf`, esgst.mainPageHeading));
        }
      } else {
        esgst.mainPageHeading.insertBefore(filters_addContainer(`gf`, esgst.mainPageHeading), esgst.mainPageHeading.firstElementChild);
      }
    }
    if (location.pathname.match(/^\/account\/settings\/giveaways$/) && (esgst.gf_os || esgst.gf_alreadyOwned || esgst.gf_dlcMissingBase || esgst.gf_aboveLevel || esgst.gf_manuallyFiltered)) {
      let key,
        inputs = {
          filter_os: null,
          filter_giveaways_exist_in_account: null,
          filter_giveaways_missing_base_game: null,
          filter_giveaways_level: null,
          filter_giveaways_additional_games: null
        };
      for (key in inputs) {
        inputs[key] = document.querySelector(`[name="${key}"]`);
      }
      document.getElementsByClassName(`form__submit-button js__submit-form`)[0].addEventListener(`click`, () => {
        for (key in inputs) {
          esgst.settings[key] = parseInt(inputs[key].value);
        }
        setValue(`settings`, JSON.stringify(esgst.settings));
      });
    }
  }

  function gf_getGiveaways(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.creator !== esgst.username && !giveaway.ended && !giveaway.entered && giveaway.url) {
        if (source === `gf` || esgst.giveawayPath) {
          if (!giveaway.innerWrap.getElementsByClassName(`esgst-gf-unhide-button`)[0] && esgst.giveaways[giveaway.code] && esgst.giveaways[giveaway.code].hidden) {
            new Button(giveaway.headingName, `beforeBegin`, {
              callbacks: [gf_hideGiveaway.bind(null, giveaway, main), null, gf_unhideGiveaway.bind(null, giveaway, main), null],
              className: `esgst-gf-unhide-button`,
              icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
              id: `gf_s`,
              index: 2,
              titles: [`Hide giveaway`, `Hiding giveaway...`, `Unhide giveaway`, `Unhiding giveaway...`]
            }).button.setAttribute(`data-draggable-id`, `gf`);
          }
        }
        if ((source !== `gc` && (esgst.giveawaysPath || esgst.groupPath)) || esgst.giveawayPath) {
          if (!giveaway.innerWrap.getElementsByClassName(`esgst-gf-hide-button`)[0] && (!esgst.giveaways[giveaway.code] || !esgst.giveaways[giveaway.code].hidden || !esgst.giveaways[giveaway.code].code)) {
            new Button(giveaway.headingName, `beforeBegin`, {
              callbacks: [gf_hideGiveaway.bind(null, giveaway, main), null, gf_unhideGiveaway.bind(null, giveaway, main), null],
              className: `esgst-gf-hide-button`,
              icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
              id: `gf_s`,
              index: 0,
              titles: [`Hide giveaway`, `Hiding giveaway...`, `Unhide giveaway`, `Unhiding giveaway...`]
            }).button.setAttribute(`data-draggable-id`, `gf`);
          }
        }
      }
    });
  }

  async function gf_hideGiveaway(giveaway, main) {
    let deleteLock = await createLock(`giveawayLock`, 300);
    let giveaways = JSON.parse(await getValue(`giveaways`, `{}`));
    if (!giveaways[giveaway.code]) {
      giveaways[giveaway.code] = {};
    }
    giveaways[giveaway.code].code = giveaway.code;
    giveaways[giveaway.code].endTime = giveaway.endTime;
    giveaways[giveaway.code].hidden = Date.now();
    await setValue(`giveaways`, JSON.stringify(giveaways));
    deleteLock();
    if (!main || !esgst.giveawayPath) {
      giveaway.outerWrap.remove();
    }
    return true;
  }

  async function gf_unhideGiveaway(giveaway, main) {
    let deleteLock = await createLock(`giveawayLock`, 300);
    let giveaways = JSON.parse(await getValue(`giveaways`, `{}`));
    if (giveaways[giveaway.code]) {
      delete giveaways[giveaway.code].hidden;
    }
    await setValue(`giveaways`, JSON.stringify(giveaways));
    deleteLock();
    if (!main || !esgst.giveawayPath) {
      giveaway.outerWrap.remove();
    }
    return true;
  }

  function gf_getFilters(popup) {
    return {
      level: {
        check: (!esgst.parameters.level_min && !esgst.parameters.level_max) && (((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup),
        maxValue: 10,
        minValue: 0,
        name: `Level`,
        type: `number`
      },
      entries: {
        check: (!esgst.parameters.entry_min && !esgst.parameters.entry_max) && (!esgst.wonPath || popup),
        minValue: 0,
        name: `Entries`,
        type: `number`
      },
      copies: {
        check: (!esgst.parameters.copy_min && !esgst.parameters.copy_max) && (!esgst.wonPath || popup),
        minValue: 1,
        name: `Copies`,
        type: `number`
      },
      points: {
        check: (!esgst.parameters.point_min && !esgst.parameters.point_max) && (((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Points`,
        type: `number`
      },
      comments: {
        check: popup || (!esgst.createdPath && !esgst.enteredPath && !esgst.wonPath),
        minValue: 0,
        name: `Comments`,
        type: `number`
      },
      minutesToEnd: {
        check: !esgst.wonPath || popup,
        minValue: 0,
        name: `Minutes To End`,
        type: `number`
      },
      chance: {
        check: esgst.gwc && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Chance`,
        step: 0.01,
        type: `number`
      },
      projectedChance: {
        check: esgst.gwc && esgst.gwc_a && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Projected Chance`,
        step: 0.01,
        type: `number`
      },
      chancePerPoint: {
        check: esgst.gwc && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Chance Per Point`,
        step: 0.01,
        type: `number`
      },
      projectedChancePerPoint: {
        check: esgst.gwc && esgst.gwc_a && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Projected Chance Per Point`,
        step: 0.01,
        type: `number`
      },
      ratio: {
        check: esgst.gwr && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        minValue: 0,
        name: `Ratio`,
        type: `number`
      },
      projectedRatio: {
        check: esgst.gwr && esgst.gwr_a && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        minValue: 0,
        name: `Projected Ratio`,
        type: `number`
      },
      pointsToWin: {
        check: esgst.gptw && (((!esgst.enteredPath || esgst.cewgd) && !esgst.createdPath && !esgst.wonPath) || popup),
        minValue: 0,
        name: `Points To Win`,
        type: `number`
      },
      rating: {
        category: `gc_r`,
        check: true,
        maxValue: 100,
        minValue: 0,
        name: `Rating`,
        type: `number`
      },
      reviews: {
        category: `gc_r`,
        check: true,
        minValue: 0,
        name: `Reviews`,
        type: `number`
      },
      releaseDate: {
        category: `gc_rd`,
        check: !esgst.parameters.release_date_min && !esgst.parameters.release_date_max,
        date: true,
        name: `Release Date`,
        type: `number`
      },
      pinned: {
        check: esgst.giveawaysPath,
        name: `Pinned`,
        type: `boolean`
      },
      public: {
        check: !esgst.giveawaysPath,
        name: `Public`,
        type: `boolean`
      },
      inviteOnly: {
        check: ((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup,
        name: `Invite Only`,
        type: `boolean`
      },
      group: {
        check: ((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup,
        name: `Group`,
        type: `boolean`
      },
      whitelist: {
        check: ((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup,
        name: `Whitelist`,
        type: `boolean`
      },
      regionRestricted: {
        check: ((!esgst.createdPath || esgst.cewgd) && (!esgst.enteredPath || esgst.cewgd) && (!esgst.wonPath || esgst.cewgd)) || popup,
        name: `Region Restricted`,
        type: `boolean`
      },
      enterable: {
        check: popup === `Ge`,
        name: `Enterable`,
        type: `boolean`
      },
      created: {
        check: (!esgst.createdPath && !esgst.enteredPath && !esgst.wonPath) || popup,
        name: `Created`,
        type: `boolean`
      },
      received: {
        check: esgst.createdPath || esgst.wonPath,
        name: `Received`,
        type: `boolean`
      },
      notReceived: {
        check: esgst.createdPath || esgst.wonPath,
        name: `Not Received`,
        type: `boolean`
      },
      awaitingFeedback: {
        check: esgst.createdPath || esgst.wonPath,
        name: `Awaiting Feedback`,
        type: `boolean`
      },
      entered: {
        check: (!esgst.createdPath && !esgst.enteredPah && !esgst.wonPath) || popup,
        name: `Entered`,
        type: `boolean`
      },
      started: {
        check: (!esgst.enteredPath && !esgst.wonPath) || popup,
        name: `Started`,
        type: `boolean`
      },
      ended: {
        check: !esgst.wonPath || popup,
        name: `Ended`,
        type: `boolean`
      },
      deleted: {
        check: esgst.createdPath || esgst.enteredPath,
        name: `Deleted`,
        type: `boolean`
      },
      owned: {
        check: true,
        name: `Owned`,
        type: `boolean`
      },
      wishlisted: {
        check: true,
        name: `Wishlisted`,
        type: `boolean`
      },
      followed: {
        check: true,
        name: `Followed`,
        type: `boolean`
      },
      hidden: {
        check: true,
        name: `Hidden`,
        type: `boolean`
      },
      ignored: {
        check: true,
        name: `Ignored`,
        type: `boolean`
      },
      previouslyEntered: {
        check: true,
        name: `Previously Entered`,
        type: `boolean`
      },
      previouslyWon: {
        check: true,
        name: `Previously Won`,
        type: `boolean`
      },
      fullCV: {
        check: true,
        name: `Full CV`,
        type: `boolean`
      },
      reducedCV: {
        check: true,
        name: `Reduced CV`,
        type: `boolean`
      },
      noCV: {
        check: true,
        name: `No CV`,
        type: `boolean`
      },
      sgTools: {
        check: esgst.ge,
        name: `SGTools`,
        type: `boolean`
      },
      groups: {
        check: esgst.ggl && esgst.ggl_index === 0,
        list: true,
        name: `Groups`,
        type: `string`
      },
      creators: {
        check: true,
        list: true,
        name: `Creators`,
        type: `string`
      },
      learning: {
        category: `gc_lg`,
        check: true,
        name: `Learning`,
        type: `boolean`
      },
      removed: {
        category: `gc_rm`,
        check: true,
        name: `Removed`,
        type: `boolean`
      },
      tradingCards: {
        category: `gc_tc`,
        check: true,
        name: `Trading Cards`,
        type: `boolean`
      },
      achievements: {
        category: `gc_a`,
        check: true,
        name: `Achievements`,
        type: `boolean`
      },
      singleplayer: {
        category: `gc_sp`,
        check: true,
        name: `Singleplayer`,
        type: `boolean`
      },
      multiplayer: {
        category: `gc_mp`,
        check: true,
        name: `Multiplayer`,
        type: `boolean`
      },
      steamCloud: {
        category: `gc_sc`,
        check: true,
        name: `Steam Cloud`,
        type: `boolean`
      },
      linux: {
        category: `gc_l`,
        check: true,
        name: `Linux`,
        type: `boolean`
      },
      mac: {
        category: `gc_m`,
        check: true,
        name: `Mac`,
        type: `boolean`
      },
      dlc: {
        category: `gc_dlc`,
        check: true,
        name: `DLC`,
        type: `boolean`
      },
      dlcOwned: {
        category: `gc_dlc_o`,
        check: true,
        name: `DLC (Owned Base)`,
        type: `boolean`
      },
      dlcFree: {
        category: `gc_dlc_b`,
        check: true,
        name: `DLC (Free Base)`,
        type: `boolean`
      },
      dlcNonFree: {
        category: `gc_dlc_b`,
        check: true,
        name: `DLC (Non-Free Base)`,
        type: `boolean`
      },
      package: {
        category: `gc_p`,
        check: true,
        name: `Package`,
        type: `boolean`
      },
      earlyAccess: {
        category: `gc_ea`,
        check: true,
        name: `Early Access`,
        type: `boolean`
      },
      genres: {
        category: `gc_g`,
        check: true,
        list: true,
        name: `Genres`,
        type: `string`
      }
    };
  }

  function filters_addContainer(id, heading, popup) {
    const obj = {
      basicFilters: {},
      id: id,
      key: `${id}_presets`,
      popup: popup,
      rules: null,
      type: popup || (esgst.groupPath ? `Groups` : (location.search.match(/type/) ? { wishlist: `Wishlist`, recommended: `Recommended`, group: `Group`, new: `New` }[location.search.match(/type=(wishlist|recommended|group|new)/)[1]] : (esgst.createdPath ? `Created` : (esgst.enteredPath ? `Entered` : (esgst.wonPath ? `Won` : (esgst.userPath ? `User` : ``))))))
    };
    switch (id) {
      case `gf`:
        obj.filters = gf_getFilters(popup);
        break;
      case `df`:
        obj.filters = df_getFilters(popup);
        break;
      case `cf`:
        obj.filters = cf_getFilters(popup);
        break;
      default:
        break;
    } 
    if (popup) {
      esgst[`${id}Popup`] = obj;
    } else {
      esgst[id] = obj;
    }

    const headingButton = document.createElement(`div`);
    headingButton.className = `esgst-heading-button esgst-gf-heading-button`;
    headingButton.id = `esgst-${obj.id}`;
    createElements(headingButton, `inner`, [{
      attributes: {
        class: `esgst-gf-toggle-switch`
      },
      type: `span`
    }, {
      attributes: {
        class: `fa fa-sliders`,
        title: getFeatureTooltip(obj.id, `Manage presets`)
      },
      type: `i`
    }]);
    const toggleSwitch = new ToggleSwitch(
      headingButton.firstElementChild,
      `${obj.id}_enable${obj.type}`,
      true,
      ``,
      false,
      false,
      null,
      esgst[`${obj.id}_enable${obj.type}`]
    );
    const presetButton = headingButton.lastElementChild;

    toggleSwitch.onEnabled = filters_filter.bind(null, obj);
    toggleSwitch.onDisabled = filters_filter.bind(null, obj, true);

    obj.container = createElements(heading, `afterEnd`, [{
      attributes: {
        class: `esgst-gf-container`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-gf-box`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-gf-filters esgst-hidden`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-gf-left-panel`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-gf-basic-filters`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `esgst-gf-number-filters`
                },
                type: `div`
              }, {
                attributes: {
                  class: `esgst-gf-boolean-filters`
                },
                type: `div`
              }, {
                attributes: {
                  class: `esgst-gf-string-filters`
                },
                type: `div`
              }]
            }, {
              type: `div`,
              children: [{
                text: `Advanced `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-question-circle`,
                  title: `Advanced filters offer more options and flexibility, but may be more complex to understand and use. When you change settings in the basic filters, they will also be changed in the advanced ones, and vice-versa. But the two types are not compatible backwards: basic -> advanced conversion works fine, but advanced -> basic conversion does not, and will result in the loss of any settings that are exclusive to the advanced filter. Bear this in mind when saving a preset, since the last applied preset will be saved.`
                },
                type: `i`
              }]
            }, {
              attributes: {
                class: `esgst-clickable`
              },
              type: `div`,
              children: [{
                text: `Manual `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-book`
                },
                type: `i`
              }]
            }, {
              attributes: {
                class: `esgst-gf-advanced-filters`
              },
              type: `div`
            }]
          }, {
            attributes: {
              class: `esgst-gf-right-panel`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-gf-steamgifts-filters`
              },
              type: `div`,
              children: [{
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-bold`
                  },
                  text: `SteamGifts Filters:`,
                  type: `span`
                }]
              }]
            }, {
              type: `br`
            }, {
              attributes: {
                class: `esgst-gf-preset-panel`
              },
              type: `div`,
              children: [{
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-bold`
                  },
                  text: `Preset:`,
                  type: `span`
                }, {
                  attributes: {
                    class: `fa fa-question-circle`,
                    title: `If you have both the basic and the advanced filters enabled, the last applied preset will be saved. For example, if the last setting you altered was in the basic filters, it will save the basic preset, and if the last setting you altered was in the advanced filters, it will save the advanced preset. The two presets are not compatible, so they will overwrite each other. Be careful with this, as you might lose some settings.`
                  },
                  type: `i`
                }]
              }, {
                attributes: {
                  class: `form__input-small`,
                  type: `text`
                },
                type: `input`
              }, {
                attributes: {
                  class: `esgst-description esgst-bold`
                },
                type: `div`
              }, {
                attributes: {
                  class: `form__row__error esgst-hidden`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-exclamation-circle`
                  },
                  type: `i`
                }, {
                  text: ` Please enter a name for the preset.`,
                  type: `node`
                }]
              }, {
                attributes: {
                  class: `esgst-description`
                },
                text: `The name of the preset.`,
                type: `div`
              }]
            }]
          }]
        }]
      }, {
        attributes: {
          class: `esgst-gf-button`
        },
        type: `div`,
        children: [{
          text: `Expand`,
          type: `span`
        }, {
          attributes: {
            class: `esgst-hidden`
          },
          text: `Collapse`,
          type: `span`
        }, {
          text: ` filters (`,
          type: `node`
        }, {
          text: `0`,
          type: `span`
        }, {
          text: ` filtered `,
          type: `node`,            
        }, ...(obj.id === `gf` ? [{
          text: `- `,
          type: `node`
        }, {
          text: `0`,
          type: `span`
        }, {
          text: `P required to enter all unfiltered `,
          type: `node`
        }] : []), {
          text: `- `,
          type: `node`
        }, {
          type: `span`
        }]
      }]
    }]);

    if (!obj.popup) {
      esgst.commentsTop += obj.container.offsetHeight;
    }

    const box = obj.container.firstElementChild;
    obj.filtersPanel = box.firstElementChild;
    const leftPanel = obj.filtersPanel.firstElementChild;
    const basicFilters = leftPanel.firstElementChild;
    const numberFilters = basicFilters.firstElementChild;
    const booleanFilters = numberFilters.nextElementSibling;
    const stringFilters = booleanFilters.nextElementSibling;
    const advancedFilters = leftPanel.lastElementChild;
    const rightPanel = leftPanel.nextElementSibling;
    const sgFilters = rightPanel.firstElementChild;
    const presetPanel = rightPanel.lastElementChild;
    obj.presetInput = presetPanel.firstElementChild.nextElementSibling;
    obj.presetMessage = obj.presetInput.nextElementSibling;
    obj.presetWarning = obj.presetMessage.nextElementSibling;
    const button = box.nextElementSibling;
    obj.expandButton = button.firstElementChild;
    obj.collapseButton = obj.expandButton.nextElementSibling;
    obj.filteredCount = obj.collapseButton.nextElementSibling;
    if (obj.id === `gf`) {
      obj.pointsCount = obj.filteredCount.nextElementSibling;
      obj.presetDisplay = obj.pointsCount.nextElementSibling;
    } else {
      obj.presetDisplay = obj.filteredCount.nextElementSibling;
    }

    advancedFilters.previousElementSibling.addEventListener(`click`, filter_manual.bind(null, {}));

    presetPanel.appendChild(new ButtonSet_v2({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: filters_savePreset.bind(null, obj)
    }).set);

    let name = esgst[`${obj.id}_preset${obj.type}`];
    if (name) {
      let i;
      for (i = esgst[obj.key].length - 1; i > -1 && esgst[obj.key][i].name !== name; i--);
      if (i > -1) {
        obj.rules = esgst[obj.key][i].rules;
      }
    }
    if (!obj.rules) {
      name = `Default${obj.type}`;
      const preset = {
        name,
        rules: {}
      };
      esgst[obj.key].push(preset);
      setSetting([
        {
          id: `${obj.id}_preset${obj.type}`,
          value: name
        },
        {
          id: obj.key,
          value: esgst[obj.key]
        }
      ]);
      obj.rules = {};
    }
    obj.rules_save = obj.rules;
    obj.presetDisplay.textContent = obj.presetInput.value = name;

    if (!obj.popup && esgst.pagination) {
      obj.paginationFilteredCount = createElements(esgst.pagination.firstElementChild, `beforeEnd`, [{
        type: `span`,
        children: [{
          text: `(`,
          type: `node`
        }, {
          attributes: {
            class: `esgst-bold`
          },
          text: `0`,
          type: `span`
        }, {
          text: ` filtered by ${obj.id === `gf` ? `Giveaway` : (obj.id === `df` ? `Discussion` : `Comment`)} Filters)`,
          type: `node`
        }]
      }]).firstElementChild;
    }

    presetButton.addEventListener(`click`, filters_openPresetPopup.bind(null, obj));
    button.addEventListener(`click`, filters_toggleFilters.bind(null, obj));

    const filters = [];
    for (const key in obj.filters) {
      const filter = obj.filters[key];
      const rule = {
        id: key,
        label: filter.name
      };
      let context;
      let checkbox;
      let textInput;
      let maxInput;
      let minInput;
      switch (filter.type) {
        case `boolean`:
          rule.input = `radio`;
          rule.operators = [`equal`];
          rule.type = `boolean`;
          rule.values = [`true`, `false`];

          if (!esgst[`${obj.id}_m_b`]) {
            const attributes = {};
            if (!esgst[`${obj.id}_${key}`] || !filter.check) {
              attributes.class = `esgst-hidden`;
            }
            context = createElements(booleanFilters, `beforeEnd`, [{
              attributes,
              type: `div`,
              children: [{
                type: `span`
              }, {
                attributes: {
                  class: `esgst-gf-filter-count`,
                  title: `Number of items this rule is hiding`
                },
                type: `span`
              }, {
                text: filter.name,
                type: `node`
              }]
            }]);
            checkbox = new Checkbox(context.firstElementChild, `enabled`, true);
            obj.basicFilters[rule.id] = {
              data: {
                basicCount: context.firstElementChild.nextElementSibling
              },
              input: rule.input,
              operator: `equal`,
              type: rule.type,
              filterType: `boolean`,
              checkbox: checkbox
            };
            checkbox.onChange = filters_basicToAdv.bind(null, obj);
          }
          break;
        case `number`:
          rule.operators = [
            `equal`,
            `not_equal`,
            `less`,
            `less_or_equal`,
            `greater`,
            `greater_or_equal`,
            `is_null`,
            `is_not_null`
          ];
          if (filter.date) {
            rule.input = `text`;
            rule.plugin = `datepicker`;
            rule.plugin_config = {
              changeMonth: true,
              changeYear: true,
              dateFormat: `yy/mm/dd`
            };
            rule.type = `date`;

            if (!esgst[`${obj.id}_m_b`]) {
              const attributes = {};
              if (!esgst[`${obj.id}_${key}`] || !filter.check) {
                attributes.class = `esgst-hidden`;
              }
              context = createElements(numberFilters, `beforeEnd`, [{
                attributes,
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-gf-filter-count`,
                    title: `Number of items this rule is hiding`
                  },
                  type: `span`
                }, {
                  text: filter.name,
                  type: `node`
                }, {
                  type: `span`,
                  children: [{
                    attributes: {
                      type: `date`
                    },
                    type: `input`
                  }, {
                    text: `-`,
                    type: `node`
                  }, {
                    attributes: {
                      type: `date`
                    },
                    type: `input`
                  }]
                }]
              }]);
            }
          } else {
            rule.input = `number`;
            if (filter.step) {
              rule.type = `double`;
            } else {
              rule.type = `integer`;
            }
            rule.validation = {
              max: filter.maxValue,
              min: filter.minValue,
              step: filter.step
            };

            if (!esgst[`${obj.id}_m_b`]) {
              const attributes = {};
              if (!esgst[`${obj.id}_${key}`] || !filter.check) {
                attributes.class = `esgst-hidden`;
              }
              context = createElements(numberFilters, `beforeEnd`, [{
                attributes,
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-gf-filter-count`,
                    title: `Number of items this rule is hiding`
                  },
                  type: `span`
                }, {
                  text: filter.name,
                  type: `node`
                }, {
                  type: `span`,
                  children: [{
                    attributes: {
                      type: `number`
                    },
                    type: `input`
                  }, {
                    text: `-`,
                    type: `node`
                  }, {
                    attributes: {
                      type: `number`
                    },
                    type: `input`
                  }]
                }]
              }]);
            }
          }

          if (!esgst[`${obj.id}_m_b`]) {
            minInput = context.lastElementChild.firstElementChild;
            maxInput = minInput.nextElementSibling;
            obj.basicFilters[rule.id] = {
              data: {
                basicCount: context.firstElementChild
              },
              input: rule.input,
              type: rule.type,
              filterType: `number`,
              maxInput: maxInput,
              minInput: minInput
            };
            maxInput.addEventListener(`change`, filters_basicToAdv.bind(null, obj));
            minInput.addEventListener(`change`, filters_basicToAdv.bind(null, obj));
          }

          break;
        case `string`:
          rule.input = `text`;
          rule.operators = [`contains`, `not_contains`];
          rule.placeholder =  `Item1, Item2, ...`;
          rule.type = `string`;

          if (!esgst[`${obj.id}_m_b`]) {
            const attributes = {};
            if (!esgst[`${obj.id}_${key}`] || !filter.check) {
              attributes.class = `esgst-hidden`;
            }
            context = createElements(stringFilters, `beforeEnd`, [{
              attributes,
              type: `div`,
              children: [{
                type: `span`,
                children: [{
                  type: `span`
                }, {
                  text: ` ${filter.name}`,
                  type: `node`
                }]
              }, {
                attributes: {
                  class: `esgst-gf-filter-count`,
                  title: `Number of items this rule is hiding`
                },
                type: `span`
              }, {
                attributes: {
                  placeholder: `Item1, Item2, ...`,
                  type: `text`
                },
                type: `input`
              }]
            }]);
            checkbox = new Checkbox(context.firstElementChild.firstElementChild, `enabled`,  true);
            textInput = context.lastElementChild;
            obj.basicFilters[rule.id] = {
              data: {
                basicCount: context.firstElementChild.nextElementSibling
              },
              id: rule.id,
              input: rule.input,
              type: rule.type,
              filterType: `string`,
              checkbox: checkbox,
              textInput: textInput
            };
            checkbox.onChange = filters_basicToAdv.bind(null, obj);
            textInput.addEventListener(`change`, filters_basicToAdv.bind(null, obj));
          }
          break;
      }
      if (!rule.data) {
        rule.data = {};
      }
      rule.data.check = esgst[`${obj.id}_${rule.id}`] && filter.check;
      filters.push(rule);
    }

    if (!esgst[`${obj.id}_m_b`]) {
      createElements(stringFilters, `beforeEnd`, [{
        attributes: {
          class: `esgst-gf-legend-panel`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Legend:`,
          type: `div`
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-check-square`
            },
            type: `i`
          }, {
            text: ` - Show All`,
            type: `node`
          }]
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-square-o`
            },
            type: `i`
          }, {
            text: ` - Hide All`,
            type: `node`
          }]
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-square`
            },
            type: `i`
          }, {
            text: ` - Show Only`,
            type: `node`
          }]
        }]
      }]);
      if (obj.rules.rules && obj.rules.rules.length) {
        filters_applyBasic(obj, obj.rules);
      }
    }
    if (!esgst[`${obj.id}_m_a`]) {
      const templates = {
        group : `
          <div id="{{= it.group_id }}" class="rules-group-container">
            <div class="rules-group-header">
              <span class="esgst-gf-filter-count" title="Number of items this group is hiding">0</span>
              <div class="btn-group pull-right group-actions">
                <button type="button" class="btn btn-xs btn-success" data-add="rule">
                  <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }}
                </button>
              {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }}
                <button type="button" class="btn btn-xs btn-success" data-add="group">
                  <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }}
                </button>
              {{?}}
              {{? it.level>1 }}
                <button type="button" class="btn btn-xs btn-primary" data-pause="group">
                  <i class="{{= it.icons.pause_group }}"></i> {{= it.translate("pause_group") }}
                </button>
                <button type="button" class="btn btn-xs btn-primary" data-resume="group">
                  <i class="{{= it.icons.resume_group }}"></i> {{= it.translate("resume_group") }}
                </button>
                <button type="button" class="btn btn-xs btn-danger" data-delete="group">
                  <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }}
                </button>
              {{?}}
              </div>
              <div class="btn-group group-conditions">
              {{~ it.conditions: condition }}
                <label class="btn btn-xs btn-default">
                  <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }}
                </label>
              {{~}}
              </div>
            {{? it.settings.display_errors }}
              <div class="error-container">
                <i class="{{= it.icons.error }}"></i>
              </div>
            {{?}}
            </div>
            <div class=rules-group-body>
              <div class=rules-list></div>
            </div>
          </div>
        `,
        rule: `
          <div id="{{= it.rule_id }}" class="rule-container">
            <div class="rule-header">
              <div class="btn-group pull-right rule-actions">
                <button type="button" class="btn btn-xs btn-primary" data-pause="rule">
                  <i class="{{= it.icons.pause_rule }}"></i> {{= it.translate("pause_rule") }}
                </button>
                <button type="button" class="btn btn-xs btn-primary" data-resume="rule">
                  <i class="{{= it.icons.resume_rule }}"></i> {{= it.translate("resume_rule") }}
                </button>
                <button type="button" class="btn btn-xs btn-danger" data-delete="rule">
                  <i class="{{= it.icons.remove_rule }}"></i> {{= it.translate("delete_rule") }}
                </button>
              </div>
            </div>
          {{? it.settings.display_errors }}
            <div class="error-container">
              <i class="{{= it.icons.error }}"></i>
            </div>
          {{?}}
            <span class="esgst-gf-filter-count" title="Number of items this rule is hiding">0</span>
            <div class="rule-filter-container"></div>
            <div class="rule-operator-container"></div>
            <div class="rule-value-container"></div>
          </div>
        `,
        filterSelect: `
          {{ var optgroup = null; }}
          <select class="form-control" name="{{= it.rule.id }}_filter">
          {{? it.settings.display_empty_filter }}
            <option value="-1">{{= it.settings.select_placeholder }}</option>
          {{?}}
          {{~ it.filters: filter }}
            {{ var className = filter.data.check ? '' : 'class="esgst-hidden"'; }}
            {{? optgroup !== filter.optgroup }}
              {{? optgroup !== null }}</optgroup>{{?}}
              {{? (optgroup = filter.optgroup) !== null }}
                <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}">
              {{?}}
            {{?}}
            <option {{= className }} value="{{= filter.id }}" {{? filter.icon}}data-icon="{{= filter.icon}}"{{?}}>{{= it.translate(filter.label) }}</option>
          {{~}}
          {{? optgroup !== null }}</optgroup>{{?}}
          </select>
        `
      };
      const options = {
        filters: filters,
        icons: {
          add_group: `fa fa-plus`,
          add_rule: `fa fa-plus`,
          pause_group: `fa fa-pause`,
          pause_rule: `fa fa-pause`,
          remove_group: `fa fa-times`,
          remove_rule: `fa fa-times`,
          resume_group: `fa fa-play`,
          resume_rule: `fa fa-play`,
          error: `fa fa-exclamation`
        },
        plugins: {
          [`bt-checkbox`]: {
            font: `fontawesome`
          },
          [`not-group`]: {
            icon_checked: `fa fa-check-square-o`,
            icon_unchecked: `fa fa-square-o`
          },
          [`sortable`]: {
            icon: `fa fa-arrows`
          }
        },
        sort_filters: true,
        lang: {
          pause_group: `Pause`,
          pause_rule: `Pause`,
          resume_group: `Resume`,
          resume_rule: `Resume`
        },
        templates: templates
      };
      if (obj.rules.rules && obj.rules.rules.length) {
        options.rules = obj.rules;
      }
      $(advancedFilters).queryBuilder(options);
      obj.builder = $(advancedFilters)[0].queryBuilder;
      [obj.rules, obj.rules_save] = filters_changeRules(obj);

      obj.builder.$el.on(`click.queryBuilder`, `[data-pause=group]`, event => {
        const group = event.currentTarget.closest(`.rules-group-container`);
        group.setAttribute(`data-esgst-paused`, true);
        [obj.rules, obj.rules_save] = filters_changeRules(obj, {});
        filters_filter(obj);
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-resume=group]`, event => {
        const group = event.currentTarget.closest(`.rules-group-container`);
        group.removeAttribute(`data-esgst-paused`);
        [obj.rules, obj.rules_save] = filters_changeRules(obj, {});
        filters_filter(obj);
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-pause=rule]`, event => {
        const rule = event.currentTarget.closest(`.rule-container`);
        rule.setAttribute(`data-esgst-paused`, true);
        [obj.rules, obj.rules_save] = filters_changeRules(obj, {});
        filters_filter(obj);
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-resume=rule]`, event => {
        const rule = event.currentTarget.closest(`.rule-container`);
        rule.removeAttribute(`data-esgst-paused`);
        [obj.rules, obj.rules_save] = filters_changeRules(obj, {});
        filters_filter(obj);
      });

      obj.builder.on(`rulesChanged.queryBuilder`, () => {
        try {
          [obj.rules, obj.rules_save] = filters_changeRules(obj, {});
          if (!obj.basicApplied && !esgst[`${obj.id}_m_b`]) {
            filters_resetBasic(obj);
            filters_applyBasic(obj, obj.rules);
          }
          filters_filter(obj);
        } catch (e) {
          console.log(e);
        }
        obj.basicApplied = false;
      });
      obj.builder.on(`getRules.queryBuilder.filter`, filters_changeRules.bind(null, obj));
    }

    if (esgst[`${obj.id}_m_b`]) {
      basicFilters.classList.add(`esgst-hidden`);
      basicFilters.nextElementSibling.classList.add(`esgst-hidden`);
    }
    if (esgst[`${obj.id}_m_a`]) {
      advancedFilters.classList.add(`esgst-hidden`);
      basicFilters.nextElementSibling.classList.add(`esgst-hidden`);
    }

    if (obj.id === `gf`) {
      [
        {
          id: `filter_os`,
          key: `os`,
          name: `OS`
        },
        {
          id: `filter_giveaways_exist_in_account`,
          key: `alreadyOwned`,
          name: `Already Owned`
        },
        {
          id: `filter_giveaways_missing_base_game`,
          key: `dlcMissingBase`,
          name: `DLC Missing Base`
        },
        {
          id: `filter_giveaways_level`,
          key: `aboveLevel`,
          name: `Above Level`
        },
        {
          id: `filter_giveaways_additional_games`,
          key: `manuallyFiltered`,
          name: `Manually Filtered`
        }
      ].forEach(filter => {
        if (!esgst[`${obj.id}_${filter.key}`]) return;

        const children = [{
          text: filter.name,
          type: `node`
        }];
        if (filter.key === `os`) {
          children.push({
            type: `select`,
            children: [{
              attributes: {
                value: `0`
              },
              text: `All`,
              type: `option`
            }, {
              attributes: {
                value: `1`
              },
              text: `Windows`,
              type: `option`
            }, {
              attributes: {
                value: `2`
              },
              text: `Linux`,
              type: `option`
            }, {
              attributes: {
                value: `3`
              },
              text: `Mac`,
              type: `option`
            }]
          })
        }
        const sgFilter = createElements(sgFilters, `beforeEnd`, [{
          attributes: {
            class: `esgst-gf-category-filter`
          },
          type: `div`,
          children: [{
            type: `span`,
            children
          }, {
            attributes: {
              class: `fa fa-circle-o-notch fa-spin esgst-hidden`
            },
            type: `i`
          }, {
            attributes: {
              class: `fa fa-check esgst-green esgst-hidden`
            },
            type: `i`
          }]
        }]);
        const check = sgFilter.lastElementChild;
        const spinning = check.previousElementSibling;
        if (filter.key === `os`) {
          const select = sgFilter.firstElementChild.firstElementChild;
          select.value = esgst[filter.id];
          select.addEventListener(`change`, async () => {
            check.classList.add(`esgst-hidden`);
            spinning.classList.remove(`esgst-hidden`);
            await setSetting(filter.id, select.value);
            esgst[filter.id] = select.value;
            await request({
              data: `filter_os=${esgst.filter_os}&filter_giveaways_exist_in_account=${esgst.filter_giveaways_exist_in_account}&filter_giveaways_missing_base_game=${esgst.filter_giveaways_missing_base_game}&filter_giveaways_level=${esgst.filter_giveaways_level}&filter_giveaways_additional_games=${esgst.filter_giveaways_additional_games}&xsrf_token=${esgst.xsrfToken}`,
              method: `POST`,
              url: `/account/settings/giveaways`
            });
            spinning.classList.add(`esgst-hidden`);
            check.classList.remove(`esgst-hidden`);
          });
        } else {
          const checkbox = new Checkbox(sgFilter, esgst[filter.id] ? true : false);
          checkbox.onChange = async () => {
            check.classList.add(`esgst-hidden`);
            spinning.classList.remove(`esgst-hidden`);
            await setSetting(filter.id, checkbox.value ? 1 : 0);
            esgst[filter.id] = checkbox.value ? 1 : 0;
            await request({
              data: `filter_os=${esgst.filter_os}&filter_giveaways_exist_in_account=${esgst.filter_giveaways_exist_in_account}&filter_giveaways_missing_base_game=${esgst.filter_giveaways_missing_base_game}&filter_giveaways_level=${esgst.filter_giveaways_level}&filter_giveaways_additional_games=${esgst.filter_giveaways_additional_games}&xsrf_token=${esgst.xsrfToken}`,
              method: `POST`,
              url: `/account/settings/giveaways`
            });
            spinning.classList.add(`esgst-hidden`);
            check.classList.remove(`esgst-hidden`);
          };
        }
      });
    }
    if (sgFilters.children.length === 1) {
      sgFilters.classList.add(`esgst-hidden`);
    }

    return headingButton;
  }

  function filter_manual(obj) {
    if (obj.popup) {
      obj.popup.open();
      return;
    }
    obj.popup = new Popup_v2({
      icon: `fa-book`,
      title: `Advanced Filters Manual`,
      addScrollable: `left`
    });
    obj.popup.getScrollable([{
      attributes: {
        class: `esgst-bold`
      },
      text: `Interface`,
      type: `div`
    }, {
      type: `br`
    }, {
      attributes: {
        class: `markdown`
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
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-square-o`
              },
              type: `i`
            }, {
              text: ` NOT`,
              type: `node`
            }]
          }, {
            text: ` - If checked, only items that do not apply to the group will be shown.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `AND`,
            type: `span`
          }, {
            text: ` - Turns the group into an AND group, which means that only items that apply to every single rule of the group will be shown.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `OR`,
            type: `span`
          }, {
            text: ` - Turns the group into an OR group, which means that only items that apply to at least one rule of the group will be shown.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-arrows`
              },
              type: `i`
            }]
          }, {
            text: ` - Allows you reorder/move rules/groups. The order of the rules does not alter the result.`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-pause`
              },
              type: `i`
            }, {
              text: ` Pause`,
              type: `node`
            }]
          }, {
            text: ` - Allows you to pause the rule/group, so that it does not filter anything until you resume it or refresh the page.`,
            type: `node`
          }]
        }, {
          text: `The other buttons in the interface should be self-explanatory.`,
          type: `li`
        }]
      }]
    }, {
      type: `br`
    }, {
      attributes: {
        class: `esgst-bold`
      },
      text: `Types of Filters`,
      type: `div`
    }, {
      type: `br`
    }, {
      attributes: {
        class: `markdown`
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
            text: `Boolean`,
            type: `span`
          }, {
            text: ` - Presents a choice between true and false. Set to true if you only want to see items that apply to the filter, and to false otherwise. For example, if you only want to see giveaways that are on your wishlist, set wishlisted to "true"; if you only want to see giveaways that you have not entered, set entered to "false".`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Number`,
            type: `span`
          }, {
            text: ` - Presents a text field and a choice between equal, not equal, less, less or equal, greater, greater or equal, is null and is not null. Enter the value that you want in the text field and choose the option that you want. For example, if you only want to see giveaways above level 5, you can either set level to "greater than 4" or to "greater or equal to 5". The is null and is not null options regard the presence of the filter. For example, some giveaways do not have a rating. If you still want to see those giveaways when filtering by rating, add an additional rule and set rating to "is null".`,
            type: `node`
          }]
        }, {
          type: `li`,
          children: [{
            attributes: {
              class: `esgst-bold`
            },
            text: `Text`,
            type: `span`
          }, {
            text: ` - Presents a text field and a choice between contains and doesn't contain. Enter the values that you want in the text field, separated by a comma followed by a space, and choose the option that you want. For example, if you only want to see giveaways that have the adventure or the action genres, set genres to "contains Adventure, Action". But if you only want to see giveaways that have both the adventure and the action genres, add 2 rules, set one to "contains Adventure" and the other to "contains Action", and turn the group into an AND group.`,
            type: `node`
          }]
        }]
      }]
    }, {
      type: `br`
    }, {
      attributes: {
        class: `esgst-bold`
      },
      text: `Building the Filters`,
      type: `div`
    }, {
      type: `br`
    }, {
      attributes: {
        class: `markdown`
      },
      type: `div`,
      children: [{
        text: `The process of building the filters might seem intimidating at first, but it is actually quite simple. Just think of it like this:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Show me a="true" AND b="false".`,
          type: `li`
        }, {
          text: `Show me a="false" OR b="true".`,
          type: `li`
        }, {
          text: `Do NOT show me a="true".`,
          type: `li`
        }]
      }, {
        text: `The building process for the filters above becomes, respectively:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Turn group into AND, add rule a="true", add rule b="false".`,
          type: `li`
        }, {
          text: `Turn group into OR, add rule a="false", add rule b="true".`,
          type: `li`
        }, {
          text: `Check NOT option, add rule a="true".`,
          type: `li`
        }]
      }, {
        text: `For more advanced filters, think in parenthesis:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Show me (a="true" AND b="false") OR c="greater or equal to 5".`,
          type: `li`
        }, {
          text: `Show me (a="false" AND b="true" AND c="false") OR (d="true" AND e="false") OR f="equal to 2".`,
          type: `li`
        }, {
          text: `Show me (a="true" AND b="false" AND c="true" AND d="false") AND do NOT show me e="contains Adventure, Action".`,
          type: `li`
        }]
      }, {
        text: `Each parenthesis represents a new group. NOT filters also represent a new group, since there isn't a NOT option for rules. So the building process for the filters above becomes, respectively:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Turn group into OR, add group (turn group into AND, add rule a="true", add rule b="false"), add rule c="greater or equal to 5".`,
          type: `li`
        }, {
          text: `Turn group into OR, add group (turn group into AND, add rule a="false", add rule b="true", add rule c="false"), add group (turn group into AND, add rule d="true", add rule e="false"), add rule f="equal to 2".`,
          type: `li`
        }, {
          text: `Turn group into AND, add group (turn group into AND, add rule a="true", add rule b="false", add rule c="true", add rule d="false"), add group (check NOT option, add rule e="contains Adventure, Action").`,
          type: `li`
        }]
      }, {
        text: `Real example: suppose you only want to see giveaways that are for level 5 or more and that have achievements or trading cards. The sentence for that system is:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Show me level="greater or equal to 5" AND (achievements="true" OR tradingCards="true").`,
          type: `li`
        }]
      }, {
        text: `And the building process is:`,
        type: `div`
      }, {
        type: `ul`,
        children: [{
          text: `Turn group into AND, add rule level="greater or equal to 5", add group (turn group into OR, add rule achievements="true", add rule tradingCards="true").`,
          type: `li`
        }]
      }, {
        text: `The final result is illustrated in the picture below:`,
        type: `div`
      }]
    }, {
      attributes: {
        src: `https://i.imgur.com/F1UXcKs.png`
      },
      type: `img`
    }]);
    obj.popup.open();
  }

  function filters_convert(presets) {
    const minValues = {
      level: 0,
      entries: 0,
      copies: 1,
      points: 0,
      comments: 0,
      minutesToEnd: 0,
      chance: 0,
      chancePerPoint: 0,
      ratio: 0,
      rating: 0,
      reviews: 0,
      releaseDate: 0
    };
    const maxValues = {
      level: 10,
      points: 100,
      minutesToEnd: 43800,
      chance: 100,
      chancePerPoint: 100,
      rating: 100,
      releaseDate: 3187209600
    };
    const newPresets = [];
    for (const preset of presets) {
      let newPreset = {
        condition: `AND`,
        not: false,
        rules: []
      };

      // Convert basic rules.
      for (let key in preset) {
        if (key.match(/^(authors|creators|exceptions|genres|groups|words|name|overrides)$/)) {
          continue;
        }

        const isMax = key.match(/^max/);
        const isMin = key.match(/^min/);
        const value = preset[key];
        key = key.replace(/(^(max|min))|List$/, ``);
        key = `${key[0].toLowerCase()}${key.slice(1)}`;
        if (isMax) {
          if (value !== maxValues[key] && !value.toString().match(/^9+$/)) {
            newPreset.rules.push({
              field: key,
              id: key,
              input: key === `releaseDate` ? `date` : `number`,
              operator: `less_or_equal`,
              type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
              value: value
            });
          }
        } else if (isMin) {
          if (value !== minValues[key]) {
            newPreset.rules.push({
              field: key,
              id: key,
              input: key === `releaseDate` ? `date` : `number`,
              operator: `greater_or_equal`,
              type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
              value: value
            });
          }
        } else if (value && typeof value === `string` && !value.match(/^(enabled|undefined)$/)) {
          if (value === `disabled`) {
            newPreset.rules.push({
              field: key,
              id: key,
              input: `radio`,
              operator: `equal`,
              type: `boolean`,
              value: false
            });
          } else if (value === `none`) {
            newPreset.rules.push({
              field: key,
              id: key,
              input: `radio`,
              operator: `equal`,
              type: `boolean`,
              value: true
            });
          } else {
            const rule = {
              field: key,
              id: key,
              input: `text`,
              operator: preset[key] === `disabled` ? `not_contains` : `contains`,
              type: `string`,
              value: value
            };
            if (preset[key] === `enabled`) {
              rule.data = {
                paused: true
              };
            }
            newPreset.rules.push(rule);
          }
        }
      }

      // Convert exceptions.
      let newExceptions = null;
      if (preset.exceptions) {
        newExceptions = {
          condition: `OR`,
          not: false,
          rules: []
        };
        if (newPreset.rules.length) {
          newExceptions.rules.push(newPreset);
        }
        for (const exception of preset.exceptions) {
          const newException = {
            condition: `AND`,
            not: false,
            rules: []
          };
          for (let key in exception) {
            if (key.match(/^(authors|creators|exceptions|genres|groups|words|name|overrides)$/)) {
              continue;
            }

            const isMax = key.match(/^max/);
            const isMin = key.match(/^min/);
            const value = preset[key];
            key = key.replace(/(^(max|min))|List$/, ``);
            key = `${key[0].toLowerCase()}${key.slice(1)}`;
            if (isMax) {
              if (value !== maxValues[key] && !value.toString().match(/^9+$/)) {
                newException.rules.push({
                  field: key,
                  id: key,
                  input: key === `releaseDate` ? `date` : `number`,
                  operator: `less_or_equal`,
                  type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                  value: value
                });
              }
            } else if (isMin) {
              if (value !== minValues[key]) {
                newException.rules.push({
                  field: key,
                  id: key,
                  input: key === `releaseDate` ? `date` : `number`,
                  operator: `greater_or_equal`,
                  type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                  value: value
                });
              }
            } else if (value && value !== `undefined`) {
              if (key.match(/^(authors|creators|genres|groups|words)$/)) {
                if (exception[key]) {
                  newException.rules.push({
                    field: key,
                    id: key,
                    input: `text`,
                    operator: `contains`,
                    type: `string`,
                    value: value
                  });
                }
              } else {
                newException.rules.push({
                  field: key,
                  id: key,
                  input: `radio`,
                  operator: `equal`,
                  type: `boolean`,
                  value: true
                });
              }
            }
          }
          if (newException.rules.length) {
            newExceptions.rules.push(newException);
          }
        }

        // Apply overrides.
        if (preset.overrides) {
          for (let i = newPreset.rules.length - 1; i > -1; i--) {
            const rule = newPreset.rules[i];
            if (preset.overrides[rule.id]) {
              for (const exception of newExceptions.rules) {
                if (exception === newPreset) continue;

                exception.rules.push(rule);
              }
            }
          }
        }

        if (newExceptions.rules.length) {
          newPreset = newExceptions;
        }
      }

      if (newPreset.rules.length) {
        newPreset.valid = true;
        newPresets.push({
          name: `__old-preset__${preset.name}`,
          rules: newPreset
        });
      }
    }
    return newPresets;
  }

  function filters_changeRules(obj, event) {
    let out = [{
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    }, {
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    }];
    let valid = false;
    try {
      valid = obj.builder.validate();
    } catch (e) {
      return out;
    }
    if (!valid) {
      if (event) {
        event.value = out;
      }
      return out;
    }

    out = (function parse(group) {
      const groupData = {
        condition: group.condition,
        data: {
          count: group.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0]
        },
        rules: []
      };
      const groupData_save = {
        condition: group.condition,
        rules: []
      };
      group.each(function(rule) {
        if (!event) {
          if (rule.data && rule.data.paused) {
            rule.$el[0].setAttribute(`data-esgst-paused`, true);
          } else {
            rule.$el[0].removeAttribute(`data-esgst-paused`);
          }
        }

        let value = null;
        if (!rule.operator || rule.operator.nb_inputs !== 0) {
          value = rule.value;
        }
        const ruleData_save = {
          id: rule.filter ? rule.filter.id : null,
          field: rule.filter ? rule.filter.field : null,
          type: rule.filter ? rule.filter.type : null,
          input: rule.filter ? rule.filter.input : null,
          operator: rule.operator ? rule.operator.type : null,
          value: value
        };
        if (rule.$el[0].getAttribute(`data-esgst-paused`)) {
          ruleData_save.data = {
            paused: true
          };
        } else {
          const ruleData = {
            data: rule.data,
            id: rule.filter ? rule.filter.id : null,
            field: rule.filter ? rule.filter.field : null,
            type: rule.filter ? rule.filter.type : null,
            input: rule.filter ? rule.filter.input : null,
            operator: rule.operator ? rule.operator.type : null,
            value: value
          };
          if (groupData.condition === `AND`) {
            if (!ruleData.data) {
              ruleData.data = {};
            }
            ruleData.data.count = rule.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0];
            ruleData.data.count.classList.remove(`esgst-hidden`);
          } else {
            rule.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0].classList.add(`esgst-hidden`);
          }
          groupData.rules.push(obj.builder.change(`ruleToJson`, ruleData, rule));
        }
        groupData_save.rules.push(obj.builder.change(`ruleToJson`, ruleData_save, rule));
      }, function (model) {
        if (!event) {
          if (model.data && model.data.paused) {
            model.$el[0].setAttribute(`data-esgst-paused`, true);
          } else {
            model.$el[0].removeAttribute(`data-esgst-paused`);
          }
        }

        const [data, data_save] = parse(model);
        if (data.rules.length !== 0) {
          if (model.$el[0].getAttribute(`data-esgst-paused`)) {
            data_save.data = {
              paused: true
            };
          } else {
            groupData.rules.push(data);
          }
          groupData_save.rules.push(data_save);
        }
      }, obj.builder);

      return [
        obj.builder.change(`groupToJson`, groupData, group),
        obj.builder.change(`groupToJson`, groupData_save, group)
      ];
    }(obj.builder.model.root));

    out[0].valid = valid;
    out[1].valid = valid;

    if (event) {
      event.value = out;
    }

    return out;
  }

  function filters_basicToAdv(obj) {
    const adv = {
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    };
    for (const id in obj.basicFilters) {
      const filter = obj.basicFilters[id];
      switch (filter.filterType) {
        case `boolean`:
          if (filter.checkbox.value === `enabled`) break;

          adv.rules.push({
            data: filter.data,
            field: id,
            id: id,
            input: filter.input,
            operator: filter.operator,
            type: filter.type,
            value: filter.checkbox.value === `none`
          });
          break;
        case `number`:
          if (filter.maxInput.value) {
            adv.rules.push({
              data: filter.data,
              field: id,
              id: id,
              input: filter.input,
              operator: `less_or_equal`,
              type: filter.type,
              value: filter.maxInput.value
            });
          }
          if (filter.minInput.value) {
            adv.rules.push({
              data: filter.data,
              field: id,
              id: id,
              input: filter.input,
              operator: `greater_or_equal`,
              type: filter.type,
              value: filter.minInput.value
            });
          }
          break;
        case `string`:
          if (filter.checkbox.value === `enabled`) break;

          if (!filter.textInput.value) break;

          adv.rules.push({
            data: filter.data,
            field: id,
            id: id,
            input: filter.input,
            operator: filter.checkbox.value === `none` ? `contains` : `not_contains`,
            type: filter.type,
            value: filter.textInput.value
          });
          break;
      }
    }
    obj.rules = adv;
    if (obj.rules.rules) {
      if (esgst[`${obj.id}_m_a`]) {
        obj.rules_save = obj.rules;
        filters_filter(obj);
      } else {
        if (!obj.rules.rules.length) {
          obj.rules = {
            condition: `AND`,
            rules: [
              {empty: true}
            ],
            valid: true
          };
        }
        obj.basicApplied = true;
        obj.builder.setRules(obj.rules);
      }
    }
  }

  function filters_applyBasic(obj, rules) {
    if (rules.condition !== `AND`) return;

    for (const rule of rules.rules) {
      if (rule.condition) continue;

      const filter = obj.basicFilters[rule.id];
      switch (rule.type) {
        case `boolean`:
          filter.checkbox.change(false, rule.value ? `none` : `disabled`);
          break;
        case `date`:
        case `double`:
        case `integer`:
          if (rule.operator === `less_or_equal`) {
            filter.maxInput.value = rule.value;
          } else if (rule.operator === `greater_or_equal`) {
            filter.minInput.value = rule.value;
          }
          break;
        case `string`:
          filter.checkbox.change(false, rule.operator === `contains` ? `none` : `disabled`);
          filter.textInput.value = rule.value;
          break;
      }
    }
  }

  function filters_resetBasic(obj) {
    for (const id in obj.basicFilters) {
      const filter = obj.basicFilters[id];
      switch (filter.filterType) {
        case `boolean`:
          filter.checkbox.change(false, `enabled`);
          break;
        case `number`:
          filter.maxInput.value = ``;
          filter.minInput.value = ``;
          break;
        case `string`:
          filter.checkbox.change(false, `enabled`);
          filter.textInput.value = ``;
          break;
      }
    }
  }

  async function filters_savePreset(obj) {
    const name = obj.presetInput.value;

    if (!name) {
      obj.presetWarning.classList.remove(`esgst-hidden`);
      return;
    }

    obj.presetWarning.classList.add(`esgst-hidden`);
    const preset = {
      name,
      rules: obj.rules_save
    };
    let i;
    for (i = esgst[obj.key].length - 1; i > -1 && esgst[obj.key][i].name !== name; i--);
    if (i > -1) {
      esgst[obj.key][i] = preset;
    } else {
      esgst[obj.key].push(preset);
    }
    await setSetting([
      {
        id: `${obj.id}_preset${obj.type}`,
        value: name
      },
      {
        id: obj.key,
        value: esgst[obj.key]
      }
    ]);
    createFadeMessage(obj.presetMessage, `Saved!`);
  }

  async function filters_openPresetPopup(obj) {
    const popup = new Popup(`fa-sliders`, `Manage presets:`, true);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `To edit a preset, apply it and save it with the same name. To rename a preset, click the edit icon, enter the new name and hit "Enter". Drag and drop presets to move them.`,
      type: `div`
    }]);
    let deleted = [];
    const undoButton = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-clickable esgst-hidden`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-rotate-left`,
        },
        type: `i`
      }, {
        text: `Undo Delete`,
        type: `span`
      }]
    }]);
    undoButton.addEventListener(`click`, filters_undoDeletePreset.bind(null, obj, deleted, undoButton));
    const table = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left popup__keys__list`
      },
      type: `div`
    }]);
    for (const preset of esgst[obj.key]) {
      const attributes = {
        draggable: true
      };
      if (obj.presetInput.value === preset.name) {
        attributes.class = `esgst-green-highlight`;
      }
      const row = createElements(table, `beforeEnd`, [{
        attributes,
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-float-left`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-hidden`,
              type: `text`,
              value: preset.name
            },
            type: `input`
          }, {
            attributes: {
              class: `esgst-clickable`
            },
            text: preset.name,
            type: `strong`
          }]
        }, {
          attributes: {
            class: `esgst-clickable esgst-float-right`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-edit`,
              title: `Rename preset`
            },
            type: `i`
          }, {
            attributes: {
              title: `Delete preset`
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-trash`
              },
              type: `i`
            }]
          }]
        }, {
          attributes: {
            class: `esgst-clear`
          },
          type: `div`
        }]
      }]);
      const renameInput = row.firstElementChild.firstElementChild;
      const heading = renameInput.nextElementSibling;
      const renameButton = row.firstElementChild.nextElementSibling.firstElementChild;

      row.addEventListener(`dragstart`, filters_setSource.bind(null, obj, preset, row));
      row.addEventListener(`dragenter`, filters_getSource.bind(null, obj, row, table));
      row.addEventListener(`dragend`, filters_saveSource.bind(null, obj));
      renameInput.addEventListener(`keypress`, filters_renamePreset.bind(null, obj, heading, preset));
      heading.addEventListener(`click`, filters_applyPreset.bind(null, obj, popup, preset));
      renameButton.addEventListener(`click`, filters_showRenameInput.bind(null, heading, renameInput));
      renameButton.nextElementSibling.addEventListener(`click`, filters_deletePreset.bind(null, obj, deleted, preset, row, undoButton));
    }
    popup.open();
  }

  async function filters_setSource(obj, preset, row, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    obj.source = row;
    let i;
    for (i = esgst[obj.key].length - 1; i > -1 && esgst[obj.key][i].name !== preset.name; i--);
    obj.sourceIndex = i;
  }

  function filters_getSource(obj, row, table) {
    let current = obj.source;
    let i = 0;
    do {
      current = current.previousElementSibling;
      if (current && current === row) {
        obj.sourceNewIndex = i;
        table.insertBefore(obj.source, row);
        return;
      }
      ++i;
    } while (current);
    obj.sourceNewIndex = i - 1;
    table.insertBefore(obj.source, row.nextElementSibling);
  }

  async function filters_saveSource(obj) {
    esgst[obj.key].splice(obj.sourceNewIndex, 0, esgst[obj.key].splice(obj.sourceIndex, 1)[0]);
    await setSetting(obj.key, esgst[obj.key]);
  }

  async function filters_applyPreset(obj, popup, preset) {
    if (!preset.rules || !preset.rules.rules || !preset.rules.rules.length) {
      preset.rules = {
        condition: `AND`,
        rules: [
          {empty: true}
        ],
        valid: true
      };
    }

    if (!esgst[`${obj.id}_m_b`]) {
      filters_resetBasic(obj);
      filters_applyBasic(obj, preset.rules);
    }
    if (!esgst[`${obj.id}_m_a`]) {
      obj.builder.setRules(preset.rules);
      [obj.rules, obj.rules_save] = filters_changeRules(obj);
    }
    popup.close();
    obj.presetDisplay.textContent = obj.presetInput.value = preset.name;
    filters_filter(obj);
    setSetting(`${obj.id}_preset${obj.type}`, preset.name);
  }

  function filters_showRenameInput(heading, renameInput) {
    heading.classList.add(`esgst-hidden`);
    renameInput.classList.remove(`esgst-hidden`);
    const value = renameInput.value;
    renameInput.value = ``;
    renameInput.focus();
    renameInput.value = value;
  }

  async function filters_renamePreset(obj, heading, preset, event) {
    if (event.key !== `Enter`) return;

    const oldName = preset.name;
    const newName = event.currentTarget.value;
    let i;
    for (i = esgst[obj.key].length - 1; i > -1 && esgst[obj.key][i].name !== oldName; i--);
    preset.name = esgst[obj.key][i].name = newName;
    const values = [{
      id: obj.key,
      value: esgst[obj.key]
    }];
    heading.textContent = newName;
    if (obj.presetInput.value === oldName) {
      obj.presetDisplay.textContent = obj.presetInput.value = newName;
    }
    const types = [``, `Wishlist`, `Recommended`, `Group`, `New`, `Created`, `Entered`, `Won`, `Groups`, `User`, `Gb`, `Ge`, `Ged`];
    for (const type of types) {
      if (esgst[`${obj.id}_preset${type}`] === oldName) {
        values.push({
          id: `${obj.id}_preset${type}`,
          value: newName
        });
      }
    }
    event.currentTarget.classList.add(`esgst-hidden`);
    heading.classList.remove(`esgst-hidden`);
    await setSetting(values);
  }

  async function filters_deletePreset(obj, deleted, preset, row, undoButton, event) {
    const deleteButton = event.currentTarget;
    createElements(deleteButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let i;
    for (i = esgst[obj.key].length - 1; i > -1 && esgst[obj.key][i].name !== preset.name; i--);
    esgst[obj.key].splice(i, 1);
    await setSetting(obj.key, esgst[obj.key]);
    createElements(deleteButton, `inner`, [{
      attributes: {
        class: `fa fa-trash`
      },
      type: `i`
    }]);
    row.classList.add(`esgst-hidden`);
    deleted.push({
      details: preset,
      row: row
    });
    undoButton.classList.remove(`esgst-hidden`);
  }

  async function filters_undoDeletePreset(obj, deleted, undoButton) {
    const preset = deleted.pop();
    preset.row.classList.remove(`esgst-hidden`);
    preset.row.parentElement.appendChild(preset.row);
    esgst[obj.key].push(preset.details);
    await setSetting(obj.key, esgst[obj.key]);
    if (deleted.length === 0) {
      undoButton.classList.add(`esgst-hidden`);
    }
  }

  function filters_toggleFilters(obj) {
    obj.collapseButton.classList.toggle(`esgst-hidden`);
    obj.expandButton.classList.toggle(`esgst-hidden`);
    obj.filtersPanel.classList.toggle(`esgst-hidden`);
  }

  function filters_filter(obj, unfilter, endless) {
    if (!unfilter && !esgst[`${obj.id}_enable${obj.type}`]) return;

    let items;
    if (obj.id === `gf`) {
      items = obj.popup ? esgst.popupGiveaways : esgst.mainGiveaways;
    } else if (obj.id === `df`) {
      items = obj.popup ? esgst.popupDiscussions : esgst.mainDiscussions;
    } else {
      items = obj.popup ? esgst.popupComments : esgst.mainComments;
    }
    const counters = document.getElementsByClassName(`esgst-gf-filter-count`);
    for (const counter of counters) {
      counter.textContent = `0`;
    }
    for (const item of items) {
      if (unfilter) {
        if (item.outerWrap.classList.contains(`esgst-hidden`)) {
          item.outerWrap.classList.remove(`esgst-hidden`);
        }
        if (obj.id === `cf` && item.outerWrap.parentElement.classList.contains(`esgst-hidden`)) {
          item.outerWrap.parentElement.classList.remove(`esgst-hidden`);
        }
      } else if (filters_filterItem(obj.id, obj.filters, item, obj.rules)) {
        if (item.outerWrap.classList.contains(`esgst-hidden`)) {
          item.outerWrap.classList.remove(`esgst-hidden`);
        }
        if (obj.id === `cf` && item.outerWrap.parentElement.classList.contains(`esgst-hidden`)) {
          item.outerWrap.parentElement.classList.remove(`esgst-hidden`);
        }
      } else {
        if (!item.outerWrap.classList.contains(`esgst-hidden`)) {
          item.outerWrap.classList.add(`esgst-hidden`);
        }                
        if (obj.id === `cf` && !item.outerWrap.parentElement.classList.contains(`esgst-hidden`)) {
          item.outerWrap.parentElement.classList.add(`esgst-hidden`);
        }
      }
    }
    filters_updateCount(obj, endless);
    if (obj.id === `gf` && esgst.gcToFetch) {
      const games = {apps: {}, subs: {}};
      for (const id in esgst.gcToFetch.apps) {
        games.apps[id] = [...esgst.gcToFetch.apps[id]];
      }
      for (const id in esgst.gcToFetch.subs) {
        games.subs[id] = [...esgst.gcToFetch.subs[id]];
      }
      gc_getGames(games, true, null, false, true);
    }
  }

  /**
  * Checks if an item passes a set of filter rules.
  * @param {object} filters An object containing all the filters.
  * @param {object} item An object containing information about the item to be checked.
  * @param {object} rules An object containing the rules to check.
  * @returns {boolean} True if the item passed the filters and false otherwise.
  */
  function filters_filterItem(id, filters, item, rules) {
    if (
      !rules ||
      (!rules.id && (!rules.condition || (isSet(rules.valid) && !rules.valid))) ||
      (rules.id && !esgst[`${id}_${rules.id}`])
    ) {
      return true;
    }

    let filtered;

    if (rules.condition) {
      if (rules.condition === `AND`) {
        // The giveaway must be filtered by all rules.
        filtered = true;
        for (const rule of rules.rules) {
          filtered = filtered && filters_filterItem(id, filters, item, rule);
          if (!filtered) break;
        }
      } else {
        // The giveaway must be filtered by at least 1 rule.
        filtered = false;
        if (rules.rules.length) {
          for (const rule of rules.rules) {
            filtered = filtered || filters_filterItem(id, filters, item, rule);
            if (filtered) break;
          }
        } else {
          filtered = true;
        }
      }
      filtered = rules.not ? !filtered : filtered;
      if (!filtered && rules.data && rules.data.count) {
        rules.data.count.textContent = parseInt(rules.data.count.textContent) + 1;
      }
      return filtered;
    }

    filtered = true;
    const key = rules.id;
    const filter = filters[key];

    if (
      !filter.check ||
      (filter.category && (!esgst.gc || !esgst[filter.category] || !item.gcReady)) ||
      (item.sgTools && key.match(/^(chance|chancePerPoint|comments|entries|ratio)$/))
    ) {
      return filtered;
    }

    switch (rules.type) {
      case `date`:
        rules.value = new Date(rules.value).getTime();
      case `integer`:
      case `double`: {
        if (key === `minutesToEnd` && (item.ended || item.deleted)) break;

        const value = key === `minutesToEnd`
          ? ((item.endTime - Date.now()) / 60000)
          : item[key];
        switch (rules.operator) {
          case `equal`:
            filtered = rules.value === value;
            break;
          case `not_equal`:
            filtered = rules.value !== value;
            break;
          case `less`:
            filtered = value < rules.value;
            break;
          case `less_or_equal`:
            filtered = value <= rules.value;
            break;
          case `greater`:
            filtered = value > rules.value;
            break;
          case `greater_or_equal`:
            filtered = value >= rules.value;
            break;
          case `is_null`:
            filtered = !isSet(value) || value < 0;
            break;
          case `is_not_null`:
            filtered = isSet(value) && value > -1;
            break;
        }

        break;
      }
      case `boolean`:
        if (key === `regionRestricted` && esgst.parameters.region_restricted) break;

        if (
          (
            key !== `fullCV` || (
              (rules.value || item.reducedCV || item.noCV) &&
              (!rules.value || (!item.reducedCV && !item.noCV))
            )
          ) &&
          (
            key === `fullCV` || (
              (!rules.value || item[key]) && (rules.value || !item[key])
            )
          )
        ) break;

        filtered = false;

        if (!item.deleted && key === `ended` && !rules.value && (esgst.createdPath || esgst.enteredPath || esgst.wonPath || esgst.userPath || esgst.groupPath)) {
          esgst.stopEs = true;
        }

        break;
      case `string`: {
        const list = rules.value.toLowerCase().split(/,\s/);

        if (rules.operator === `contains`) {
          if (!item[key]) {
            filtered = false;
            break;
          }

          let i;
          for (i = list.length - 1; i > -1 && item[key].indexOf(list[i]) < 0; i--);
          filtered = i > -1;
        } else {
          if (!item[key]) break;

          let i;
          for (i = list.length - 1; i > -1 && item[key].indexOf(list[i]) < 0; i--);
          filtered = i < 0;
        }

        break;
      }
    }
    if (!filtered && rules.data) {
      if (rules.data.count) {
        rules.data.count.textContent = parseInt(rules.data.count.textContent) + 1;
      }
      if (rules.data.basicCount) {
        rules.data.basicCount.textContent = parseInt(rules.data.basicCount.textContent) + 1;
      }
    }
    return filtered;
  }

  function filters_updateCount(obj, endless) {
    let filtered = 0;
    let points = 0;
    let paginationFiltered = 0;
    let key;
    if (obj.id === `gf`) {
      key = obj.popup ? `popupGiveaways` : `mainGiveaways`;
    } else if (obj.id === `df`) {
      key = obj.popup ? `popupDiscussions` : `mainDiscussions`;
    } else {
      key = obj.popup ? `popupComments` : `mainComments`;
    }
    for (let i = esgst[key].length - 1; i > -1; i--) {
      const item = esgst[key][i];
      if (document.body.contains(item.outerWrap) || endless) {
        if (!item.pinned || !esgst.pinnedGiveaways.classList.contains(`esgst-hidden`)) {
          if (item.outerWrap.classList.contains(`esgst-hidden`)) {
            if (!item.pinned) {
              paginationFiltered += 1;
            }
            filtered += 1;
          } else if (item.points && !item.entered) {
            points += item.points;
          }
        }
      } else {
        esgst[key].splice(i, 1);
      }
    }
    obj.filteredCount.textContent = filtered;
    if (obj.id === `gf`) {
      obj.pointsCount.textContent = points;
    }
    if (!obj.popup && obj.paginationFilteredCount) {
      obj.paginationFilteredCount.textContent = paginationFiltered;
    }
  }

