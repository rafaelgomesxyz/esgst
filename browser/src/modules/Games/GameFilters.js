import { common } from '../Common';
import { Filters } from '../Filters';
import { gSettings } from '../../class/Globals';
import { shared } from '../../class/Shared';

class GamesGameFilters extends Filters {
  constructor() {
    super('gmf');
    this.info = {
      description: 'Filter games.',
      features: {
        gmf_m: {
          description: [
            ['ul', [
              ['li', 'Allows you to hide multiple games in a page using many different filters.'],
              ['li', [
                `Adds a toggle switch with a button (`,
                ['i', { class: 'fa fa-sliders' }],
                `) to the main page heading of any page that has games and does not have giveaways. If a page has giveaways, you can filter games through the giveaway filters (the filter settings of this feature are shared with Giveaway Filters). The switch allows you to turn the filters on/off and the button allows you to manage your presets.`
              ]],
              ['li', 'To prevent confusion, in discussion pages the filter bar for this feature will be at the top, while the filter bar for Comment Filters (if enabled) will be at the main page heading.'],
              ['li', `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 3 categories:`],
              ['ul', [
                ['li', `Basic filters are related to a numeric value and have a slider that you can use to set the range of the filter (any games that do not apply to the range will be hidden).`],
                ['li', `Type filters are related to a boolean value  and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
                ['ul', [
                  ['li', [
                    `"Show all" (`,
                    ['i', { class: 'fa fa-check-square' }],
                    `) does not hide any games that apply to the filter (this is the default state).`
                  ]],
                  ['li', [
                    `"Show only" (`,
                    ['i', { class: 'fa fa-square' }],
                    `) hides any games that do not apply to the filter.`
                  ]],
                  ['li', [
                    `"Hide all" (`,
                    ['i', { class: 'fa fa-square-o' }],
                    `) hides any games that apply to the filter.`
                  ]]
                ]],
                ['li', `Category filters are essentially the same thing as type filters, but for game categories ([id=gc]).`]
              ]],
              ['li', `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:`],
              ['ul', [
                ['li', `Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.`],
                ['li', [
                  'Exception rules are the ones that you can change by clicking on the icon ',
                  ['i', { class: 'fa fa-gear' }],
                  ` in the filter panel. They are exceptions to the basic rules.`
                ]],
                ['li', [
                  `Override rules are the ones that you can change by clicking on the icon (`,
                  ['i', { class: 'fa fa-exclamation esgst-faded' }],
                  ' if set to overridable and ',
                  ['i', { class: 'fa fa-exclamation' }],
                  ` if set to non-overridable) next to each filter. They are enforcements of the basic rules.`
                ]]
              ]]
            ]]
          ],
          features: {
            gmf_m_b: {
              name: 'Hide basic filters.',
              sg: true
            },
            gmf_m_a: {
              name: 'Hide advanced filters.',
              sg: true
            },
            gf_rating: {
              dependencies: ['gc', 'gc_r'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games by rating percentage.']
                ]]
              ],
              name: 'Rating',
              sg: true
            },
            gf_reviews: {
              dependencies: ['gc', 'gc_r'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games by the number of reviews.']
                ]]
              ],
              name: 'Reviews',
              sg: true
            },
            gf_releaseDate: {
              dependencies: ['gc', 'gc_rd'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games by release date.']
                ]]
              ],
              name: 'Release Date',
              sg: true
            },
            gf_owned: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you own on Steam.']
                ]]
              ],
              name: 'Owned',
              sg: true
            },
            gf_wishlisted: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have wishlisted on Steam.']
                ]]
              ],
              name: 'Wishlisted',
              sg: true
            },
            gf_followed: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have followed on Steam.']
                ]]
              ],
              name: 'Followed',
              sg: true,
              syncKeys: ['FollowedGames']
            },
            gf_hidden: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have hidden on SteamGifts.']
                ]]
              ],
              name: 'Hidden',
              sg: true
            },
            gf_ignored: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have ignored on Steam.']
                ]]
              ],
              name: 'Ignored',
              sg: true
            },
            gf_previouslyEntered: {
              dependencies: ['egh'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have previously entered giveaways for.']
                ]]
              ],
              name: 'Previously Entered',
              sg: true
            },
            gf_previouslyWon: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that you have previously won.']
                ]]
              ],
              name: 'Previously Won',
              sg: true
            },
            gf_fullCV: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that give full CV.']
                ]]
              ],
              name: 'Full CV',
              sg: true
            },
            gf_reducedCV: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that give reduced CV.']
                ]]
              ],
              name: 'Reduced CV',
              sg: true
            },
            gf_noCV: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that give no CV.']
                ]]
              ],
              name: 'No CV',
              sg: true
            },
            gf_learning: {
              dependencies: ['gc', 'gc_lg'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that Steam is learning about.']
                ]]
              ],
              name: 'Learning',
              sg: true
            },
            gf_removed: {
              dependencies: ['gc', 'gc_rm'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that have been removed from the Steam store.']
                ]]
              ],
              name: 'Removed',
              sg: true
            },
            gf_banned: {
              dependencies: ['gc', 'gc_bd'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are banned on Steam.']
                ]]
              ],
              name: 'Banned',
              sg: true
            },
            gf_tradingCards: {
              dependencies: ['gc', 'gc_tc'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that have trading cards.']
                ]]
              ],
              name: 'Trading Cards',
              sg: true
            },
            gf_achievements: {
              dependencies: ['gc', 'gc_a'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that have achievements.']
                ]]
              ],
              name: 'Achievements',
              sg: true
            },
            gf_singleplayer: {
              dependencies: ['gc', 'gc_sp'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are singleplayer.']
                ]]
              ],
              name: 'Singleplayer',
              sg: true
            },
            gf_multiplayer: {
              dependencies: ['gc', 'gc_mp'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are multiplayer.']
                ]]
              ],
              name: 'Multiplayer',
              sg: true
            },
            gf_steamCloud: {
              dependencies: ['gc', 'gc_sc'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that have Steam Cloud.']
                ]]
              ],
              name: 'Steam Cloud',
              sg: true
            },
            gf_linux: {
              dependencies: ['gc', 'gc_l'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that have are compatible with Linux.']
                ]]
              ],
              name: 'Linux',
              sg: true
            },
            gf_mac: {
              dependencies: ['gc', 'gc_m'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are compatible with Mac.']
                ]]
              ],
              name: 'Mac',
              sg: true
            },
            gf_dlc: {
              dependencies: ['gc', 'gc_dlc'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are DLCs.']
                ]]
              ],
              name: 'DLC',
              sg: true
            },
            gf_dlcOwned: {
              dependencies: ['gc', 'gc_dlc', 'gc_dlc_o'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are DLCs and have a base game that you own.']
                ]]
              ],
              name: `DLC (Owned Base)`,
              sg: true
            },
            gf_dlcFree: {
              dependencies: ['gc', 'gc_dlc', 'gc_dlc_b'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are DLCs and have a free base game.']
                ]]
              ],
              name: `DLC (Free Base)`,
              sg: true
            },
            gf_dlcNonFree: {
              dependencies: ['gc', 'gc_dlc', 'gc_dlc_b'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are DLCs and have a non-free base game.']
                ]]
              ],
              name: `DLC (Non-Free Base)`,
              sg: true
            },
            gf_package: {
              dependencies: ['gc', 'gc_p'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are packages.']
                ]]
              ],
              name: 'Package',
              sg: true
            },
            gf_earlyAccess: {
              dependencies: ['gc', 'gc_ea'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games that are in early access.']
                ]]
              ],
              name: 'Early Access',
              sg: true
            },
            gf_genres: {
              dependencies: ['gc', 'gc_g'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games by genre.']
                ]]
              ],
              name: 'Genres',
              sg: true
            },
            gf_tags: {
              dependencies: ['gt'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter games by game tags.']
                ]]
              ],
              name: 'Game Tags',
              sg: true
            }
          },
          name: 'Multiple Filters',
          sg: true
        }
      },
      id: 'gmf',
      name: 'Game Filters',
      sg: true,
      sync: `Owned/Wishlisted/Ignored Games, Giveaways, Hidden Games, No CV Games, Reduced CV Games, Won Games`,
      syncKeys: ['Games', 'Giveaways', 'HiddenGames', 'NoCvGames', 'ReducedCvGames', 'WonGames'],
      type: 'games'
    };
  }

  init() {
    if (!gSettings.gmf || !shared.common.isCurrentPath(['Community Wishlist', 'Bundle Games', 'Discussion', 'Settings - Giveaways - Filters', 'Steam - Games'])) {
      return;
    }

    if (!shared.esgst.hasAddedFilterContainer) {
      shared.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${shared.esgst.commentsTop - 5}px;
        }
      `);
    }

    shared.common.createHeadingButton({
      element: this.filters_addContainer(shared.esgst.discussionPath ? document.querySelector('.page__heading') : shared.esgst.mainPageHeading),
      id: 'gmf'
    });
  }

  getFilters() {
    return {
      rating: {
        category: 'gc_r',
        check: true,
        maxValue: 100,
        minValue: 0,
        name: 'Rating',
        type: 'number'
      },
      reviews: {
        category: 'gc_r',
        check: true,
        minValue: 0,
        name: 'Reviews',
        type: 'number'
      },
      releaseDate: {
        category: 'gc_rd',
        check: !shared.esgst.parameters.release_date_min && !shared.esgst.parameters.release_date_max,
        date: true,
        name: 'Release Date',
        type: 'number'
      },
      owned: {
        check: true,
        name: 'Owned',
        sync: ['Games'],
        type: 'boolean'
      },
      wishlisted: {
        check: true,
        name: 'Wishlisted',
        sync: ['Games'],
        type: 'boolean'
      },
      followed: {
        check: true,
        name: 'Followed',
        sync: ['FollowedGames'],
        type: 'boolean'
      },
      hidden: {
        check: true,
        name: 'Hidden',
        sync: ['HiddenGames'],
        type: 'boolean'
      },
      ignored: {
        check: true,
        name: 'Ignored',
        sync: ['Games'],
        type: 'boolean'
      },
      previouslyEntered: {
        check: true,
        name: 'Previously Entered',
        type: 'boolean'
      },
      previouslyWon: {
        check: true,
        name: 'Previously Won',
        sync: ['WonGames'],
        type: 'boolean'
      },
      fullCV: {
        check: true,
        name: 'Full CV',
        sync: ['ReducedCvGames', 'NoCvGames'],
        type: 'boolean'
      },
      reducedCV: {
        check: true,
        name: 'Reduced CV',
        sync: ['ReducedCvGames'],
        type: 'boolean'
      },
      noCV: {
        check: true,
        name: 'No CV',
        sync: ['NoCvGames'],
        type: 'boolean'
      },
      learning: {
        category: 'gc_lg',
        check: true,
        name: 'Learning',
        type: 'boolean'
      },
      removed: {
        check: true,
        name: 'Removed',
        sync: ['DelistedGames'],
        type: 'boolean'
      },
      banned: {
        check: true,
        name: 'Banned',
        sync: ['DelistedGames'],
        type: 'boolean'
      },
      tradingCards: {
        category: 'gc_tc',
        check: true,
        name: 'Trading Cards',
        type: 'boolean'
      },
      achievements: {
        category: 'gc_a',
        check: true,
        name: 'Achievements',
        type: 'boolean'
      },
      singleplayer: {
        category: 'gc_sp',
        check: true,
        name: 'Singleplayer',
        type: 'boolean'
      },
      multiplayer: {
        category: 'gc_mp',
        check: true,
        name: 'Multiplayer',
        type: 'boolean'
      },
      steamCloud: {
        category: 'gc_sc',
        check: true,
        name: 'Steam Cloud',
        type: 'boolean'
      },
      linux: {
        category: 'gc_l',
        check: true,
        name: 'Linux',
        type: 'boolean'
      },
      mac: {
        category: 'gc_m',
        check: true,
        name: 'Mac',
        type: 'boolean'
      },
      dlc: {
        category: 'gc_dlc',
        check: true,
        name: 'DLC',
        type: 'boolean'
      },
      dlcOwned: {
        category: 'gc_dlc_o',
        check: true,
        name: `DLC (Owned Base)`,
        type: 'boolean'
      },
      dlcFree: {
        category: 'gc_dlc_b',
        check: true,
        name: `DLC (Free Base)`,
        type: 'boolean'
      },
      dlcNonFree: {
        category: 'gc_dlc_b',
        check: true,
        name: `DLC (Non-Free Base)`,
        type: 'boolean'
      },
      package: {
        category: 'gc_p',
        check: true,
        name: 'Package',
        type: 'boolean'
      },
      earlyAccess: {
        category: 'gc_ea',
        check: true,
        name: 'Early Access',
        type: 'boolean'
      },
      genres: {
        category: 'gc_g',
        check: true,
        list: true,
        name: 'Genres',
        type: 'string'
      },
      tags: {
        check: true,
        list: true,
        name: 'Game Tags',
        type: 'string'
      }
    };
  }
}

const gamesGameFilters = new GamesGameFilters();

export { gamesGameFilters };