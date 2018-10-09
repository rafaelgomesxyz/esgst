import Module from '../../class/Module';
import Button from '../../class/Button';
import {common} from '../Common';

const
  createHeadingButton = common.createHeadingButton.bind(common),
  createLock = common.createLock.bind(common),
  getValue = common.getValue.bind(common),
  setValue = common.setValue.bind(common)
;

class GiveawaysGiveawayFilters extends Module {
  constructor() {
    super();
    this.info = {
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
      load: this.gf,
      name: `Giveaway Filters`,
      sg: true,
      sync: `Hidden Games, Owned/Wishlisted/Ignored Games, Won Games, Reduced CV Games, No CV Games and Giveaways`,
      type: `giveaways`
    };
  }

  gf() {
    if (this.esgst.gf_s) {
      this.esgst.giveawayFeatures.push(this.gf_getGiveaways.bind(this));
    }
    if (this.esgst.gf_m && (this.esgst.giveawaysPath || this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.groupPath || this.esgst.userPath)) {
      this.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${this.esgst.commentsTop - 5}px;
        }
      `);
      createHeadingButton({
        element: this.esgst.modules.filters.filters_addContainer(`gf`, this.esgst.mainPageHeading),
        id: `gf`
      });
    }
    if (location.pathname.match(/^\/account\/settings\/giveaways$/) && (this.esgst.gf_os || this.esgst.gf_alreadyOwned || this.esgst.gf_dlcMissingBase || this.esgst.gf_aboveLevel || this.esgst.gf_manuallyFiltered)) {
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
          this.esgst.settings[key] = parseInt(inputs[key].value);
        }
        setValue(`settings`, JSON.stringify(this.esgst.settings));
      });
    }
  }

  gf_getGiveaways(giveaways, main, source) {
    giveaways.forEach(giveaway => {
      if (giveaway.creator !== this.esgst.username && !giveaway.ended && !giveaway.entered && giveaway.url) {
        if (source === `gf` || this.esgst.giveawayPath) {
          if (!giveaway.innerWrap.getElementsByClassName(`esgst-gf-unhide-button`)[0] && this.esgst.giveaways[giveaway.code] && this.esgst.giveaways[giveaway.code].hidden) {
            new Button(giveaway.headingName, `beforeBegin`, {
              callbacks: [this.gf_hideGiveaway.bind(this, giveaway, main), null, this.gf_unhideGiveaway.bind(this, giveaway, main), null],
              className: `esgst-gf-unhide-button`,
              icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
              id: `gf_s`,
              index: 2,
              titles: [`Hide giveaway`, `Hiding giveaway...`, `Unhide giveaway`, `Unhiding giveaway...`]
            }).button.setAttribute(`data-draggable-id`, `gf`);
          }
        }
        if ((source !== `gc` && (this.esgst.giveawaysPath || this.esgst.groupPath)) || this.esgst.giveawayPath) {
          if (!giveaway.innerWrap.getElementsByClassName(`esgst-gf-hide-button`)[0] && (!this.esgst.giveaways[giveaway.code] || !this.esgst.giveaways[giveaway.code].hidden || !this.esgst.giveaways[giveaway.code].code)) {
            new Button(giveaway.headingName, `beforeBegin`, {
              callbacks: [this.gf_hideGiveaway.bind(this, giveaway, main), null, this.gf_unhideGiveaway.bind(this, giveaway, main), null],
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

  async gf_hideGiveaway(giveaway, main) {
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
    if (!main || !this.esgst.giveawayPath) {
      giveaway.outerWrap.remove();
    }
    return true;
  }

  async gf_unhideGiveaway(giveaway, main) {
    let deleteLock = await createLock(`giveawayLock`, 300);
    let giveaways = JSON.parse(await getValue(`giveaways`, `{}`));
    if (giveaways[giveaway.code]) {
      delete giveaways[giveaway.code].hidden;
    }
    await setValue(`giveaways`, JSON.stringify(giveaways));
    deleteLock();
    if (!main || !this.esgst.giveawayPath) {
      giveaway.outerWrap.remove();
    }
    return true;
  }

  gf_getFilters(popup) {
    return {
      level: {
        check: (!this.esgst.parameters.level_min && !this.esgst.parameters.level_max) && (((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup),
        maxValue: 10,
        minValue: 0,
        name: `Level`,
        type: `number`
      },
      entries: {
        check: (!this.esgst.parameters.entry_min && !this.esgst.parameters.entry_max) && (!this.esgst.wonPath || popup),
        minValue: 0,
        name: `Entries`,
        type: `number`
      },
      copies: {
        check: (!this.esgst.parameters.copy_min && !this.esgst.parameters.copy_max) && (!this.esgst.wonPath || popup),
        minValue: 1,
        name: `Copies`,
        type: `number`
      },
      points: {
        check: (!this.esgst.parameters.point_min && !this.esgst.parameters.point_max) && (((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Points`,
        type: `number`
      },
      comments: {
        check: popup || (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath),
        minValue: 0,
        name: `Comments`,
        type: `number`
      },
      minutesToEnd: {
        check: !this.esgst.wonPath || popup,
        minValue: 0,
        name: `Minutes To End`,
        type: `number`
      },
      chance: {
        check: this.esgst.gwc && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Chance`,
        step: 0.01,
        type: `number`
      },
      projectedChance: {
        check: this.esgst.gwc && this.esgst.gwc_a && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Projected Chance`,
        step: 0.01,
        type: `number`
      },
      chancePerPoint: {
        check: this.esgst.gwc && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Chance Per Point`,
        step: 0.01,
        type: `number`
      },
      projectedChancePerPoint: {
        check: this.esgst.gwc && this.esgst.gwc_a && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        maxValue: 100,
        minValue: 0,
        name: `Projected Chance Per Point`,
        step: 0.01,
        type: `number`
      },
      ratio: {
        check: this.esgst.gwr && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        minValue: 0,
        name: `Ratio`,
        type: `number`
      },
      projectedRatio: {
        check: this.esgst.gwr && this.esgst.gwr_a && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
        minValue: 0,
        name: `Projected Ratio`,
        type: `number`
      },
      pointsToWin: {
        check: this.esgst.gptw && (((!this.esgst.enteredPath || this.esgst.cewgd) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
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
        check: !this.esgst.parameters.release_date_min && !this.esgst.parameters.release_date_max,
        date: true,
        name: `Release Date`,
        type: `number`
      },
      pinned: {
        check: this.esgst.giveawaysPath,
        name: `Pinned`,
        type: `boolean`
      },
      public: {
        check: !this.esgst.giveawaysPath,
        name: `Public`,
        type: `boolean`
      },
      inviteOnly: {
        check: ((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup,
        name: `Invite Only`,
        type: `boolean`
      },
      group: {
        check: ((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup,
        name: `Group`,
        type: `boolean`
      },
      whitelist: {
        check: ((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup,
        name: `Whitelist`,
        type: `boolean`
      },
      regionRestricted: {
        check: ((!this.esgst.createdPath || this.esgst.cewgd) && (!this.esgst.enteredPath || this.esgst.cewgd) && (!this.esgst.wonPath || this.esgst.cewgd)) || popup,
        name: `Region Restricted`,
        type: `boolean`
      },
      enterable: {
        check: popup === `Ge`,
        name: `Enterable`,
        type: `boolean`
      },
      created: {
        check: (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath) || popup,
        name: `Created`,
        type: `boolean`
      },
      received: {
        check: this.esgst.createdPath,
        name: `Received`,
        type: `boolean`
      },
      notReceived: {
        check: this.esgst.createdPath,
        name: `Not Received`,
        type: `boolean`
      },
      awaitingFeedback: {
        check: this.esgst.createdPath,
        name: `Awaiting Feedback`,
        type: `boolean`
      },
      entered: {
        check: (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath) || popup,
        name: `Entered`,
        type: `boolean`
      },
      started: {
        check: (!this.esgst.enteredPath && !this.esgst.wonPath) || popup,
        name: `Started`,
        type: `boolean`
      },
      ended: {
        check: !this.esgst.wonPath || popup,
        name: `Ended`,
        type: `boolean`
      },
      deleted: {
        check: this.esgst.createdPath || this.esgst.enteredPath,
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
        check: this.esgst.ge,
        name: `SGTools`,
        type: `boolean`
      },
      groups: {
        check: this.esgst.ggl && this.esgst.ggl_index === 0,
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
}

export default GiveawaysGiveawayFilters;