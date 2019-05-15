import { Module } from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';
import { permissions } from '../../class/Permissions';

const
  isSet = utils.isSet.bind(utils),
  parseHtml = utils.parseHtml.bind(utils),
  sortArray = utils.sortArray.bind(utils),
  createElements = common.createElements.bind(common),
  draggable_enter = common.draggable_enter.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getLocalValue = common.getLocalValue.bind(common),
  lockAndSaveGames = common.lockAndSaveGames.bind(common),
  request = common.request.bind(common),
  setLocalValue = common.setLocalValue.bind(common)
  ;

class GamesGameCategories extends Module {
  constructor() {
    super();

    this.queueIndexes = {
      apps: {},
      subs: {},
      total: 0
    };

    this.fetchableCategories = [
      `gc_gi`,
      `gc_lg`,
      `gc_r`,
      `gc_a`,
      `gc_sp`,
      `gc_mp`,
      `gc_sc`,
      `gc_tc`,
      `gc_l`,
      `gc_m`,
      `gc_dlc`,
      `gc_ea`,
      `gc_rm`,
      `gc_rd`,
      `gc_g`,
      `gc_p`
    ];

    this.info = {
      description: [
        [`ul`, [
          [`li`, `Adds tags (which are called "categories" not to be confused with [id=gt]) below a game's name (in any page) that can display a lot of useful information about the game (depending on which categories you have enabled).`],
          [`li`, `The categories can be reordered by dragging and dropping them. You can also drag and drop them between a giveaway's columns (where the end/start times and the creator's username are).`]
        ]]
      ],
      features: {
        gc_e: {
          colors: {
            color: `Text`,
            bColor: `Border`,
            bgColor: `Background`
          },
          description: [
            [`ul`, [
              [`li`, `The enter button of giveaways will be colored with the desired color if the game cannot be checked for ownership and has one of the following categories: Banned, DLC, Learning, Package`]
            ]]
          ],
          name: `Color enter button of giveaways if game ownership cannot be checked.`,
          sg: true
        },
        gc_lp: {
          description: [
            [`ul`, [
              [`li`, [
                `"Achievements" links to the `,
                [`a`, { href: `https://steamcommunity.com/stats` }, `https://steamcommunity.com/stats`],
                ` page of the game.`
              ]],
              [`li`, [
                `"Full CV", "Reduced CV" and "No CV" link to the `,
                [`a`, { href: `https://www.steamgifts.com/bundle-games` }, `https://www.steamgifts.com/bundle-games`],
                ` page of the game.`
              ]],
              [`li`, `"Giveaway Info" links to your profile page.`],
              [`li`, [
                `"Hidden" links to the `,
                [`a`, { href: `https://www.steamgifts.com/account/settings/giveaways/filters` }, `https://www.steamgifts.com/account/settings/giveaways/filters`],
                ` page of the game.`
              ]],
              [`li`, [
                `"Owned" links to the `,
                [`a`, { href: `https://www.steamgifts.com/account/steam/games` }, `https://www.steamgifts.com/account/steam/games`],
                ` page of the game.`
              ]],
              [`li`, [
                `"Removed" links to the `,
                [`a`, { href: `https://steamdb.info` }, `https://steamdb.info`],
                ` page of the game.`
              ]],
              [`li`, [
                `"Trading Cards" links to the `,
                [`a`, { href: `https://www.steamcardexchange.net/index.php` }, `https://www.steamcardexchange.net/index.php`],
                ` page of the game.`
              ]],
              [`li`, [
                `"Wishlist" links to the `,
                [`a`, { href: `https://www.steamgifts.com/account/steam/wishlist` }, `https://www.steamgifts.com/account/steam/wishlist`],
                ` page of the game.`
              ]],
              [`li`, [
                `Every other category links to the `,
                [`a`, { href: `https://store.steampowered.com` }, `https://store.steampowered.com`],
                ` page of the game.`
              ]]
            ]]
          ],
          features: {
            gc_lp_gv: {
              name: `Enable for Grid View.`,
              sg: true
            }
          },
          name: `Link each category to its related page.`,
          sg: true
        },
        gc_b: {
          name: `Show the category colors as a bottom border to the giveaways in Grid View.`,
          sg: true
        },
        gc_il: {
          name: `Show the panel inline (next to the game's name instead of below it).`,
          sg: true
        },
        gc_a: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game has achievements.`],
              [`li`, `If you hover over the category, it shows how many achievements the game has.`]
            ]]
          ],
          features: {
            gc_a_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_a_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Achievements`,
          sg: true
        },
        gc_bd: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is banned on Steam.`]
            ]]
          ],
          features: {
            gc_bd_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_bd_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Banned`,
          sg: true,
          sync: `Delisted Games`,
          syncKeys: [`DelistedGames`]
        },
        gc_bvg: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Links to the Barter.vg page of the game.`]
            ]]
          ],
          features: {
            gc_bvg_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_bvg_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Barter.vg`,
          sg: true
        },
        gc_dlc: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is a DLC.`]
            ]]
          ],
          features: {
            gc_dlc_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_dlc_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_dlc_b: {
              description: [
                [`ul`, [
                  [`li`, [
                    `The icon `,
                    [`i`, { class: `fa fa-certificate` }],
                    ` will be added if the base is free, the icon `,
                    [`i`, { class: `fa fa-dollar` }],
                    ` will be added if it is not, and no icon will be added if the information is unavailable.`
                  ]]
                ]]
              ],
              name: `Indicate if the base game of the DLC is free.`,
              sg: true
            },
            gc_dlc_o: {
              description: [
                [`ul`, [
                  [`li`, `The same icon you use for the Owned category will be added if the base is owned.`]
                ]]
              ],
              name: `Indicate if the base game of the DLC is owned.`,
              sg: true
            }
          },
          input: true,
          name: `DLC`,
          sg: true
        },
        gc_ea: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is in early access.`]
            ]]
          ],
          features: {
            gc_ea_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_ea_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Early Access`,
          sg: true
        },
        gc_f: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you have followed the game on Steam.`]
            ]]
          ],
          features: {
            gc_f_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_f_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Followed`,
          sg: true,
          syncKeys: [`FollowedGames`]
        },
        gc_fcv: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game gives full CV when given away.`]
            ]]
          ],
          features: {
            gc_fcv_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_fcv_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Full CV`,
          sg: true
        },
        gc_g: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows the official genres of the game.`],
              [`li`, `The genres/user-defined tags are listed in the same category, separated by a comma. If they exceed a certain width, a "..." is added and the rest is hidden (they can be seen by hovering over the category).`]
            ]]
          ],
          features: {
            gc_g_s: {
              description: [
                [`ul`, [
                  [`li`, `With this option enabled, each genre/user-defined tag will have its own category instead of all of them being listed in the same one.`],
                  [`li`, `This option allows each separate category to be colored individually.`]
                ]]
              ],
              name: `Show each genre/user-defined tag as a separate category.`,
              sg: true
            },
            gc_g_udt: {
              description: [
                [`ul`, [
                  [`li`, `Shows the user-defined tags that the game has in addition to the official genres.`]
                ]]
              ],
              name: `User-Defined Tags`,
              sg: true
            }
          },
          name: `Genres`,
          sg: true
        },
        gc_gi: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows how many giveaways you have already made for the game and how much real CV you should get for a new giveaway.`]
            ]]
          ],
          name: `Giveaway Info`,
          sg: true
        },
        gc_h: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you have hidden the game on SteamGifts.`]
            ]]
          ],
          features: {
            gc_h_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_h_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Hidden`,
          sg: true
        },
        gc_hltb: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows how long it takes on average to beat the game based on HowLongToBeat.`]
            ]]
          ],
          options: [{
            title: `For singleplayer games, show:`,
            values: [`Main Story`, `Main + Extra`, `Completionist`]
          }, {
            title: `For multiplayer games, show:`,
            values: [`Co-Op`, `Vs.`]
          }, {
            title: `For singleplayer/multiplayer games, show:`,
            values: [`Solo`, `Co-Op`, `Vs.`]
          }],
          name: `HLTB`,
          sg: true,
          sync: `HLTB Times`,
          syncKeys: [`HltbTimes`]
        },
        gc_i: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you have ignored the game on Steam.`]
            ]]
          ],
          features: {
            gc_i_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_i_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_i_t: {
              background: true,
              name: `Color the table row in tables.`,
              sg: true
            }
          },
          input: true,
          name: `Ignored`,
          sg: true
        },
        gc_lg: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if Steam is learning about the game.`]
            ]]
          ],
          features: {
            gc_lg_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_lg_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Learning`,
          sg: true
        },
        gc_l: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is compatible with Linux.`]
            ]]
          ],
          features: {
            gc_l_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_l_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Linux`,
          sg: true
        },
        gc_m: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is compatible with Mac.`]
            ]]
          ],
          features: {
            gc_m_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_m_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Mac`,
          sg: true
        },
        gc_mp: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is multiplayer.`]
            ]]
          ],
          features: {
            gc_mp_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_mp_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Multiplayer`,
          sg: true
        },
        gc_ncv: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game gives no CV when given away.`],
              [`li`, `If you hover over the category, it shows the date since it gives no CV.`]
            ]]
          ],
          features: {
            gc_ncv_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_ncv_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_ncv_o: {
              name: `Only display "No CV" if the game also has "Reduced CV".`,
              sg: true
            }
          },
          input: true,
          name: `No CV`,
          sg: true
        },
        gc_o: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you own the game.`]
            ]]
          ],
          features: {
            gc_o_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_o_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_o_a: {
              features: {
                gc_o_a_t: {
                  background: true,
                  name: `Color the table row in tables.`,
                  sg: true
                }
              },
              name: `Show if you own the game in any of your alt accounts.`,
              sg: true
            },
            gc_o_t: {
              background: true,
              name: `Color the table row in tables.`,
              sg: true
            }
          },
          input: true,
          name: `Owned`,
          sg: true
        },
        gc_ocv: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows the original CV state of a game when it was given away for giveaways.`],
              [`li`, `This feature borrows labels / icons from Full CV, Reduced CV and No CV categories, with the addition of its own label / icon (a clock by default).`]
            ]]
          ],
          features: {
            gc_ocv_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_ocv_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Original CV`,
          sg: true
        },
        gc_p: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is a package.`],
              [`li`, `If you hover over the category, it shows how many items are contained in the package.`]
            ]]
          ],
          features: {
            gc_p_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_p_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_p_t: {
              background: true,
              name: `Color the table row in tables if you own some of the games in the package.`,
              sg: true
            }
          },
          input: true,
          name: `Package`,
          sg: true
        },
        gc_pw: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you have previously won the game.`]
            ]]
          ],
          features: {
            gc_pw_o: {
              name: `Do not show if the game already has the Owned category.`,
              sg: true
            },
            gc_pw_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_pw_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Previously Won`,
          sg: true
        },
        gc_r: {
          description: [
            [`ul`, [
              [`li`, `Shows the overall rating that the game has on Steam.`]
            ]]
          ],
          features: {
            gc_r_s: {
              name: `Show the percentage and number of reviews next to the icon.`,
              sg: true
            }
          },
          name: `Rating`,
          sg: true
        },
        gc_rcv: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game gives reduced CV when given away.`],
              [`li`, `If you hover over the category, it shows the date since it gives reduced CV.`]
            ]]
          ],
          features: {
            gc_rcv_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_rcv_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Reduced CV`,
          sg: { include: [{ enabled: 1, pattern: `.*` }], exclude: [{ enabled: 1, pattern: `^/bundle-games` }] }
        },
        gc_rd: {
          description: [
            [`ul`, [
              [`li`, `Shows the release date of the game.`],
              [`li`, `If the game has no release date, a "?" will be shown instead.`]
            ]]
          ],
          colors: true,
          input: true,
          name: `Release Date`,
          sg: true
        },
        gc_rm: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game has been removed from the Steam store.`]
            ]]
          ],
          features: {
            gc_rm_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_rm_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Removed`,
          sg: true
        },
        gc_sp: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game is singleplayer.`]
            ]]
          ],
          features: {
            gc_sp_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_sp_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Singleplayer`,
          sg: true
        },
        gc_sc: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game has Steam Cloud.`]
            ]]
          ],
          features: {
            gc_sc_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_sc_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Steam Cloud`,
          sg: true
        },
        gc_tc: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if the game has trading cards.`]
            ]]
          ],
          features: {
            gc_tc_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_tc_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            }
          },
          input: true,
          name: `Trading Cards`,
          sg: true
        },
        gc_w: {
          colors: true,
          description: [
            [`ul`, [
              [`li`, `Shows if you have wishlisted the game on Steam.`],
              [`li`, `If you hover over the category, it shows the date when you added the game to your wishlist.`]
            ]]
          ],
          features: {
            gc_w_s: {
              description: [
                [`ul`, [
                  [`li`, `Shows the category initials instead of its full name.`],
                  [`li`, `Not compatible with custom labels.`]
                ]]
              ],
              features: {
                gc_w_s_i: {
                  name: `Use icons instead of initials.`,
                  sg: true
                }
              },
              name: `Enable the simplified version.`,
              sg: true
            },
            gc_w_t: {
              background: true,
              name: `Color the table row in tables.`,
              sg: true
            }
          },
          input: true,
          name: `Wishlisted`,
          sg: true
        }
      },
      id: `gc`,
      name: `Game Categories`,
      sg: true,
      sync: `Owned/Wishlisted/Ignored Games, Giveaways, Hidden Games, No CV Games, Reduced CV Games`,
      syncKeys: [`Games`, `Giveaways`, `HiddenGames`, `NoCvGames`, `ReducedCvGames`],
      type: `games`
    };
  }

  isFetchableEnabled() {
    for (const id of this.fetchableCategories) {
      if (gSettings[id]) {
        return true;
      }
    }
    return false;
  }

  async init() {    
    if (this.isFetchableEnabled() && !(await permissions.requestUi([`server`, `steamStore`], `gc`, true))) {
      return;
    }

    shared.esgst.gameFeatures.push(this.gc_games.bind(this));
    shared.esgst.gcToFetch = { apps: {}, subs: {} };
  }

  gc_games(games, main, source, endless) {
    // noinspection JSIgnoredPromiseFromCall
    this.gc_getGames(games, main, source, endless);
  }

  async gc_getGames(games, main, source, endless, filtersChanged) {
    let gc = {
      apps: Object.keys(games.apps),
      cache: {
        apps: {},
        subs: {}
      },
      subs: Object.keys(games.subs)
    };

    // get categories
    for (let id in games.apps) {
      if (games.apps.hasOwnProperty(id)) {
        let elements = games.apps[id];
        for (let i = 0, n = elements.length; i < n; ++i) {
          let element = elements[i];
          if (element.container.classList.contains(`esgst-hidden`) || element.container.getElementsByClassName(`esgst-gc-panel`)[0]) {
            continue;
          }
          if (element.container.closest(`.poll`)) {
            common.createElements_v2(element.container.getElementsByClassName(`table__column__heading`)[0], `afterEnd`, [
              [`div`, { class: `esgst-gc-panel` }, [
                [`span`, { class: `esgst-gc-loading`, title: `This game is queued for fetching` }, [
                  [`i`, { class: `fa fa-hourglass fa-spin` }],
                  [`span`]
                ]]
              ]]
            ]);
          } else {
            common.createElements_v2(element.heading, `afterEnd`, [
              [`div`, { class: `esgst-gc-panel` }, [
                [`span`, { class: `esgst-gc-loading`, title: `This game is queued for fetching` }, [
                  [`i`, { class: `fa fa-hourglass fa-spin` }],
                  [`span`]
                ]]
              ]]
            ]);
          }
        }
      }
    }
    for (let id in games.subs) {
      if (games.subs.hasOwnProperty(id)) {
        let elements = games.subs[id];
        for (let i = 0, n = elements.length; i < n; ++i) {
          let element = elements[i];
          if (element.container.classList.contains(`esgst-hidden`) || element.container.getElementsByClassName(`esgst-gc-panel`)[0]) {
            continue;
          }
          if (element.container.closest(`.poll`)) {
            common.createElements_v2(element.container.getElementsByClassName(`table__column__heading`)[0], `afterEnd`, [
              [`div`, { class: `esgst-gc-panel` }, [
                [`span`, { class: `esgst-gc-loading`, title: `This game is queued for fetching` }, [
                  [`i`, { class: `fa fa-hourglass fa-spin` }],
                  [`span`]
                ]]
              ]]
            ]);
          } else {
            common.createElements_v2(element.heading, `afterEnd`, [
              [`div`, { class: `esgst-gc-panel` }, [
                [`span`, { class: `esgst-gc-loading`, title: `This game is queued for fetching` }, [
                  [`i`, { class: `fa fa-hourglass fa-spin` }],
                  [`span`]
                ]]
              ]]
            ]);
          }
        }
      }
    }
    
    // Show categories that do not need to be fetched.
    for (const id of gc.apps) {
      this.gc_addCategory(gc, null, games.apps[id], id, shared.esgst.games.apps[id], `apps`, gc.cache.hltb, true);
    }
    for (const id of gc.subs) {
      this.gc_addCategory(gc, null, games.subs[id], id, shared.esgst.games.subs[id], `subs`, null, true);
    }
    for (const scopeKey in shared.esgst.scopes) {
      const scope = shared.esgst.scopes[scopeKey];
      for (const giveaway of scope.giveaways) {        
        this.gc_addBorders(giveaway);
      }
    }
    
    let to_fetch = [];

    if (this.isFetchableEnabled()) {
      gc.cache = JSON.parse(getLocalValue(`gcCache`, `{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`));
      if (gc.cache.version !== 7) {
        gc.cache = {
          apps: {},
          subs: {},
          hltb: gc.cache.hltb,
          timestamp: 0,
          version: 7
        };
      }
      if (!gc.cache.hltb) {
        gc.cache.hltb = {};
      }
      const now = Date.now();
      for (const id in gc.cache.apps) {
        if (!gc.cache.apps.hasOwnProperty(id)) {
          continue;
        }
        let priority;
        if (gc.cache.apps[id].lastCheck) {
          if (gc.apps.indexOf(id) > -1) {
            // Game is in the current page.

            if (now - gc.cache.apps[id].lastCheck > 604800000) {
              // Game has not been updated in 7 days.
              
              priority = 2;
            } else if (now - gc.cache.apps[id].lastCheck > 518400000) {
              // Game has not been updated in 6 days.
              
              priority = 3;
            } else if (now - gc.cache.apps[id].lastCheck > 86400000 && (!gc.cache.apps[id].name || gc.cache.apps[id].price === -1 || (gSettings.gc_g_udt && !gc.cache.apps[id].tags) || (gSettings.gc_r && !gc.cache.apps[id].rating) || (gSettings.gc_rd && gc.cache.apps[id].removed === -1))) {
              // Game was not successfully fetched and it has been more than 24 hours since the last attempt.

              priority = 1;
            } else {
              // Game is up to date.

              this.gc_addCategory(gc, gc.cache.apps[id], games.apps[id], id, shared.esgst.games.apps[id], `apps`, gc.cache.hltb);
              continue;
            }
          } else if (now - gc.cache.apps[id].lastCheck > 2592000000) {
            // Game is not in the current page and has not been updated in 30 days.

            delete gc.cache.apps[id];
            continue;
          }
        } else {
          gc.cache.apps[id].lastCheck = now;
          priority = 1;
        }
        if (games.apps[id] && games.apps[id].filter(item => !item.container.classList.contains(`esgst-hidden`))[0]) {
          if (priority > 2) {
            this.gc_addCategory(gc, gc.cache.apps[id], games.apps[id], id, shared.esgst.games.apps[id], `apps`, gc.cache.hltb, false, true);
          }
          to_fetch.push({
            id,
            lastCheck: gc.cache.apps[id].lastCheck,
            priority,
            type: `apps`
          });
        }
      }
      for (const id in gc.cache.subs) {
        if (!gc.cache.subs.hasOwnProperty(id)) {
          continue;
        }
        let priority;
        if (gc.cache.subs[id].lastCheck) {
          if (gc.subs.indexOf(id) > -1) {
            // Game is in the current page.

            if (now - gc.cache.subs[id].lastCheck > 604800000) {
              // Game has not been updated in 7 days.
              
              priority = 2;
            } else if (now - gc.cache.subs[id].lastCheck > 518400000) {
              // Game has not been updated in 6 days.
              
              priority = 3;
            } else if (now - gc.cache.subs[id].lastCheck > 86400000 && (!gc.cache.subs[id].name || gc.cache.subs[id].price === -1 || (gSettings.gc_rd && gc.cache.subs[id].removed === -1))) {
              // Game was not successfully fetched and it has been more than 24 hours since the last attempt.

              priority = 1;
            } else {
              // Game is up to date.

              this.gc_addCategory(gc, gc.cache.subs[id], games.subs[id], id, shared.esgst.games.subs[id], `subs`, gc.cache.hltb);
              continue;
            }
          } else if (now - gc.cache.subs[id].lastCheck > 2592000000) {
            // Game is not in the current page and has not been updated in 30 days.

            delete gc.cache.subs[id];
            continue;
          }
        } else {
          gc.cache.subs[id].lastCheck = now;
          priority = 1;
        }
        if (games.subs[id] && games.subs[id].filter(item => !item.container.classList.contains(`esgst-hidden`))[0]) {
          if (priority > 2) {
            this.gc_addCategory(gc, gc.cache.subs[id], games.subs[id], id, shared.esgst.games.subs[id], `subs`, gc.cache.hltb, false, true);
          }
          to_fetch.push({
            id,
            lastCheck: gc.cache.subs[id].lastCheck,
            priority,
            type: `subs`
          });
        }
      }
      setLocalValue(`gcCache`, JSON.stringify(gc.cache));
      
      for (const id of gc.apps) {
        if (gc.cache.apps[id]) {
          continue;
        }
        to_fetch.push({
          id,
          priority: 0,
          type: `apps`,
          found: false,
          realId: null,
          realType: null
        });
      }
      for (const id of gc.subs) {
        if (gc.cache.subs[id]) {
          continue;
        }
        to_fetch.push({
          id,
          priority: 0,
          type: `subs`,
          found: false,
          realId: null,
          realType: null
        });
      }

      to_fetch = to_fetch.sort((a, b) => {
        if (a.priority < b.priority) {
          return -1;
        }
        if (a.priority > b.priority) {
          return 1;
        }
        if (a.lastCheck < b.lastCheck) {
          return -1;
        }
        if (a.lastCheck > b.lastCheck) {
          return 1;
        }
        return 0;
      });

      for (const item of to_fetch) {
        if (!games[item.type][item.id]) {
          continue;
        }
        this.queueIndexes[item.type][item.id] = this.queueIndexes.total;
        let isInQueue = false;
        for (const game of games[item.type][item.id]) {
          const panel = game.container.getElementsByClassName(`esgst-gc-panel`)[0];          
          if (panel && !panel.getAttribute(`data-gcReady`)) {
            const loading = panel.getElementsByClassName(`esgst-gc-loading`)[0];
            if (loading) {
              loading.setAttribute(`data-esgst-to-fetch`, true);
              loading.title = `This game is queued for fetching (the number indicates its queue position)`;
              let color;
              switch (item.priority) {
                case 0:
                  color = `red`;
                  break;
                case 1:
                  color = `orange`;
                  break;
                case 2:
                  color = `yellow`;
                  break;
                case 3:
                  color = `green`;
                  break;
              }
              loading.firstElementChild.classList.add(`esgst-${color}`);
              loading.lastElementChild.textContent = ` ${this.queueIndexes[item.type][item.id]}`;
              isInQueue = true;
            }
          }
        }
        if (isInQueue) {
          this.queueIndexes.total += 1;
        }
      }

      if (to_fetch.length) {
        const params = {
          apps: [],
          subs: [],
          bundles: []
        };
        for (const item of to_fetch) {
          if (typeof item.id === `string` && item.id.match(/^SteamBundle/)) {
            item.realId = item.id.replace(/^SteamBundle/, ``);
            item.realType = `bundles`;
          } else {
            item.realId = item.id;
            item.realType = item.type;
          }
          params[item.realType].push(item.realId);
        }

        try {
          const json = JSON.parse((await request({ method: `GET`, url: `https://gsrafael01.me/esgst/games?app_ids=${params.apps.join(`,`)}&sub_ids=${params.subs.join(`,`)}&bundle_ids=${params.bundles.join(`,`)}` })).responseText);
          for (let i = 0; i < to_fetch.length; i++) {
            const item = to_fetch[i];
            const data = json.result.found[item.realType][item.realId];

            if (!data) {
              continue;
            }

            const last_update = (new Date(data.last_update)).getTime();

            if (now - last_update <= 604800000 && data.learning !== null) {
              item.found = true;
              const oldLength = to_fetch.length;
              gc.cache[item.type][item.id] = await this.gc_fake_api(gc, to_fetch, data, item.id, item.type, last_update);
              i += (to_fetch.length - oldLength);
            }
          }

          await lockAndSaveGames(shared.esgst.games);
          setLocalValue(`gcCache`, JSON.stringify(gc.cache));
        } catch (error) {
          window.console.log(error);
        }

        const lockObj = await shared.common.createLock(`gc`, 100, true);

        for (const item of to_fetch) {
          if (item.found) {
            const categories = gc.cache[item.type][item.id];
            if (gSettings.gc_dlc_b && categories.dlc && categories.base && gc.cache.apps[categories.base]) {
              categories.freeBase = gc.cache.apps[categories.base].free;
            }
            this.gc_addCategory(gc, gc.cache[item.type][item.id], games[item.type][item.id], item.id, shared.esgst.games[item.type][item.id], item.type, item.type === `apps` ? gc.cache.hltb : null);
          } else {
            await this.gc_getCategories(gc, now, games, item.id, item.type, to_fetch);
          }
          this.updateIndexes();
          await shared.common.updateLock(lockObj.lock);
        }

        lockObj.deleteLock();
      }
    }

    // add categories
    let categories = [`achievements`, `dlc`, `dlcOwned`, `dlcFree`, `dlcNonFree`, `genres`, `hltb`, `linux`, `mac`, `singleplayer`, `multiplayer`, `package`, `rating`, `reviews`, `learning`, `removed`, `banned`, `steamCloud`, `tradingCards`, `earlyAccess`, `releaseDate`];
    for (const scopeKey in shared.esgst.scopes) {
      const scope = shared.esgst.scopes[scopeKey];
      for (const giveaway of scope.giveaways) {
        const loading = giveaway.outerWrap.querySelector(`.esgst-gc-loading:not([data-esgst-to-fetch])`);
        if (loading) {
          loading.remove();
        }
        if (giveaway.gcReady || !giveaway.outerWrap.querySelector(`[data-gcReady]`) || giveaway.outerWrap.classList.contains(`esgst-hidden`)) {
          continue;
        }
        for (let j = 0, numCategories = categories.length; j < numCategories; ++j) {
          let id = categories[j];
          let category = giveaway.outerWrap.getElementsByClassName(`esgst-gc-${id === `reviews` ? `rating` : id}`)[0];
          if (category) {
            if (id === `releaseDate`) {
              giveaway.releaseDate = category.getAttribute(`data-timestamp`);
              if (giveaway.releaseDate === `?`) {
                giveaway.releaseDate = -1;
              } else {
                giveaway.releaseDate = parseInt(giveaway.releaseDate) * 1e3;
              }
            } else if (id === `genres`) {
              giveaway.genres = category.textContent.toLowerCase().trim().replace(/\s{2,}/g, `, `).split(/,\s/);
            } else if (id === `rating`) {
              giveaway.rating = parseInt(category.title.match(/(\d+)%/)[1]);
            } else if (id === `reviews`) {
              giveaway.reviews = parseInt(category.title.match(/\((.+?)\)/)[1].replace(/[^\d]/g, ``));
            } else {
              giveaway[id] = true;
            }
          } else if (id === `rating`) {
            giveaway.rating = -1;
          } else if (id === `releaseDate`) {
            giveaway.releaseDate = -1;
          } else if (id === `reviews`) {
            giveaway.reviews = -1;
          }
        }
        this.gc_addBorders(giveaway);
        giveaway.gcReady = true;
      }
    }
    if (!filtersChanged) {
      if (shared.esgst.gf && shared.esgst.gf.filteredCount && gSettings[`gf_enable${shared.esgst.gf.type}`]) {
        shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gf, false, endless);
      }
      if (shared.esgst.gfPopup && shared.esgst.gfPopup.filteredCount && gSettings[`gf_enable${shared.esgst.gfPopup.type}`]) {
        shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gfPopup);
      }
    }
  }

  gc_addBorders(giveaway) {
    if (giveaway.outerWrap.classList.contains(`esgst-hidden`) || !giveaway.grid || !gSettings.gc_b) {
      return;
    }
    let borders = giveaway.outerWrap.getElementsByClassName(`esgst-gc-border`)[0];
    if (borders) {
      borders.innerHTML = ``;
    } else {
      borders = createElements(giveaway.outerWrap, `beforeEnd`, [{
        attributes: {
          class: `esgst-gc-border`
        },
        type: `div`
      }]);
    }
    const categoryNames = {
      gc_ocv: `originalCV`,
      gc_fcv: `fullCV`,
      gc_rcv: `reducedCV`,
      gc_ncv: `noCV`,
      gc_h: `hidden`,
      gc_i: `ignored`,
      gc_o: `owned`,
      gc_w: `wishlisted`,
      gc_f: `followed`,
      gc_pw: `won`,
      gc_a: `achievements`,
      gc_bd: `banned`,
      gc_sp: `singleplayer`,
      gc_mp: `multiplayer`,
      gc_sc: `steamCloud`,
      gc_tc: `tradingCards`,
      gc_l: `linux`,
      gc_m: `mac`,
      gc_ea: `earlyAccess`,
      gc_lg: `learning`,
      gc_rm: `removed`,
      gc_dlc: `dlc`,
      gc_p: `package`
    };
    for (const category of gSettings.gc_categories_gv) {
      const key = categoryNames[category];
      if (!key || !giveaway.innerWrap.getElementsByClassName(`esgst-gc-${key}`)[0]) {
        continue;
      }
      createElements(borders, `beforeEnd`, [{
        attributes: {
          class: `esgst-gc-${key}`
        },
        type: `div`
      }]);
    }
  }

  async gc_fakeBundle(id) {
    const bundleId = id.replace(/^SteamBundle/, ``);
    const response = await request({
      headers: { [`Cookie`]: `birthtime=0; mature_content=1` },
      method: `GET`,
      url: `https://store.steampowered.com/bundle/${bundleId}?cc=us&l=english`
    });
    const html = parseHtml(response.responseText);
    return {
      [id]: {
        success: true,
        data: {
          apps: Array.from(html.querySelectorAll(`[data-ds-appid]`)).map(x => ({ id: parseInt(x.getAttribute(`data-ds-appid`)) })),
          name: html.querySelector(`.pageheader`).textContent,
          platforms: {}
        }
      }
    };
  }

  async gc_fake_api(gc, to_fetch, data, id, type, last_update, games, current_time) {
    const categories = {
      achievements: data.achievements || 0,
      base: data.base,
      dlc: data.base ? 1 : 0,
      dlcs: data.dlcs,
      earlyAccess: data.genres && data.genres.indexOf(`Early Access`) >= 0 ? 1 : 0,
      free: data.price === 0,
      genres: ``,
      lastCheck: last_update,
      learning: data.learning ? 1 : 0,
      linux: data.linux ? 1 : 0,
      mac: data.mac ? 1 : 0,
      multiplayer: data.multiplayer ? 1 : 0,
      name: data.name,
      price: Math.ceil(data.price / 100),
      rating: data.rating ? `${data.rating.percentage}% (${data.rating.count})` : ``,
      ratingType: ``,
      releaseDate: data.release_date ? new Date(data.release_date).getTime() : `?`,
      removed: data.removed ? 1 : 0,
      singleplayer: data.singleplayer ? 1 : 0,
      steamCloud: data.steam_cloud ? 1 : 0,
      tags: ``,
      tradingCards: data.trading_cards ? 1 : 0
    };
    if (type === `apps` && data.subs) {
      if (!shared.esgst.games.apps[id]) {
        shared.esgst.games.apps[id] = {};
      }
      shared.esgst.games.apps[id].subs = data.subs;
    }
    if (type === `subs` && data.apps) {
      if (!shared.esgst.games.subs[id]) {
        shared.esgst.games.subs[id] = {};
      }
      shared.esgst.games.subs[id].apps = data.apps;
      for (const appId of shared.esgst.games.subs[id].apps) {
        if (!gc.cache.apps[appId] || !to_fetch.filter(x => x.type === `apps` && x.id == appId)[0]) {
          if (games) {
            await this.gc_getCategories(gc, current_time, games, appId, `apps`, to_fetch);
          } else {
            to_fetch.unshift({
              id: appId,
              priority: 0,
              type: `apps`
            });
          }
        }
      }
    }
    if (data.genres) {
      data.genres.sort((a, b) => {
        return a.localeCompare(b, {
          sensitivity: `base`
        });
      });
      categories.genres = data.genres.join(`, `);
    }
    if (data.tags) {
      data.tags.sort((a, b) => {
        return a.localeCompare(b, {
          sensitivity: `base`
        });
      });
      categories.tags = data.tags.join(`, `);
    }
    if (data.rating) {
      if (data.rating.percentage < 40) {
        categories.ratingType = `Negative`;
      } else if (data.rating.percentage < 70) {
        categories.ratingType = `Mixed`;
      } else {
        categories.ratingType = `Positive`;
      }
    } else {
      categories.ratingType = `?`;
    }
    if (type === `apps` && !categories.removed && shared.esgst.delistedGames.removed.indexOf(parseInt(id)) >= 0) {
      categories.removed = 1;
    }
    if (gSettings.gc_dlc_b && categories.dlc && categories.base) {
      if (gc.cache.apps[categories.base]) {
        categories.freeBase = gc.cache.apps[categories.base].free;
      }
      if (typeof categories.freeBase === `undefined`) {
        if (games) {
          await this.gc_getCategories(gc, current_time, games, categories.base, `apps`, to_fetch);
        } else {
          to_fetch.unshift({
            id: categories.base,
            priority: 0,
            type: `apps`
          });
        }
      }
    }
    return categories;
  }

  async gc_getCategories(gc, currentTime, games, id, type, to_fetch) {
    if (games[type][id]) {
      for (const game of games[type][id]) {
        const panel = game.container.getElementsByClassName(`esgst-gc-panel`)[0];
        if (panel && !panel.getAttribute(`data-gcReady`)) {
          const loading = panel.getElementsByClassName(`esgst-gc-loading`)[0];
          if (loading) {
            loading.title = `Fetching game categories...`;
            loading.firstElementChild.classList.remove(`fa-hourglass`);
            loading.firstElementChild.classList.add(`fa-circle-o-notch`);
            loading.lastElementChild.textContent = ``;
          }
        }
      }
    }
    try {
      let real_id, real_type;
      if (typeof id === `string` && id.match(/^SteamBundle/)) {
        real_id = id.replace(/^SteamBundle/, ``);
        real_type = `bundles`;
      } else {
        real_id = id;
        real_type = type;
      }
      const json = JSON.parse((await request({
        method: `GET`,
        url: `https://gsrafael01.me/esgst/game/${real_type.slice(0, -1)}/${real_id}`
      })).responseText);
      if (json.result) {
        if (json.result.learning === null) {
          throw `Adult game: ${type}/${id}. The learning category can only be retrieved locally if the user is logged in.`;
        }
        gc.cache[type][id] = await this.gc_fake_api(gc, to_fetch, json.result, id, type, currentTime, games, currentTime);
        this.gc_addCategory(gc, gc.cache[type][id], games[type][id], id, shared.esgst.games[type][id], type, type === `apps` ? gc.cache.hltb : null);
        await lockAndSaveGames(shared.esgst.games);
        setLocalValue(`gcCache`, JSON.stringify(gc.cache));
      }
    } catch (error) {
      window.console.log(error);
      try {
        let categories = {
          achievements: 0,
          dlc: 0,
          earlyAccess: 0,
          genres: ``,
          lastCheck: currentTime,
          learning: 0,
          linux: 0,
          mac: 0,
          multiplayer: 0,
          name: ``,
          price: -1,
          rating: ``,
          ratingType: ``,
          releaseDate: `?`,
          removed: -1,
          singleplayer: 0,
          steamCloud: 0,
          tags: ``,
          tradingCards: 0
        };
        let responseJson = typeof id === `string` && id.match(/^SteamBundle/) ? (await this.gc_fakeBundle(id)) : JSON.parse((await request({
          anon: true,
          method: `GET`,
          url: `https://store.steampowered.com/api/${type === `apps` ? `appdetails?appids=` : `packagedetails?packageids=`}${id}&filters=achievements,apps,basic,categories,genres,name,packages,platforms,price,price_overview,release_date&cc=us&l=english`
        })).responseText);
        let data;
        if (responseJson && responseJson[id]) {
          data = responseJson[id].data;
          if (data) {
            if (data.steam_appid && id != data.steam_appid) {
              if (!shared.esgst.games[type][id]) {
                shared.esgst.games[type][id] = {};
              }
              shared.esgst.games[type][id].alias = data.steam_appid;
            }
            if (type === `apps` && data.packages) {
              if (!shared.esgst.games.apps[id]) {
                shared.esgst.games.apps[id] = {};
              }
              shared.esgst.games.apps[id].packages = data.packages.map(x => parseInt(x));
            }
            if (type === `subs` && data.apps) {
              if (!shared.esgst.games.subs[id]) {
                shared.esgst.games.subs[id] = {};
              }
              shared.esgst.games.subs[id].apps = data.apps.map(x => parseInt(x.id));
              for (const appId of shared.esgst.games.subs[id].apps) {
                if (!gc.cache.apps[appId] || !to_fetch.filter(x => x.type === `apps` && x.id == appId)[0]) {
                  await this.gc_getCategories(gc, currentTime, games, appId, `apps`, to_fetch);
                }
              }
            }
            if (data.categories) {
              for (let i = 0, n = data.categories.length; i < n; ++i) {
                switch (data.categories[i].description.toLowerCase()) {
                  case `steam achievements`:
                    categories.achievements = 1;
                    break;
                  case `single-player`:
                    categories.singleplayer = 1;
                    break;
                  case `multi-player`:
                  case `online multi-player`:
                  case `co-op`:
                  case `local co-op`:
                  case `online co-op`:
                  case `shared/split screen`:
                    categories.multiplayer = 1;
                    break;
                  case `steam cloud`:
                    categories.steamCloud = 1;
                    break;
                  case `steam trading cards`:
                    categories.tradingCards = 1;
                    break;
                  default:
                    break;
                }
              }
            }
            if (categories.achievements && data.achievements && data.achievements.total) {
              categories.achievements = data.achievements.total;
            }
            categories.free = !!data.is_free;
            categories.dlc = data.type === `dlc` ? 1 : 0;
            if (categories.dlc && data.fullgame && data.fullgame.appid) {
              categories.base = parseInt(data.fullgame.appid);
            } else if (data.dlc) {
              categories.dlcs = data.dlc;
            }
            let genres = [];
            if (data.genres) {
              for (let i = 0, n = data.genres.length; i < n; ++i) {
                genres.push(data.genres[i].description.trim());
              }
            }
            genres.sort((a, b) => {
              return a.localeCompare(b, {
                sensitivity: `base`
              });
            });
            categories.earlyAccess = genres.indexOf(`Early Access`) >= 0 ? 1 : 0;
            categories.genres = genres.join(`, `);
            let platforms = data.platforms;
            categories.linux = platforms.linux ? 1 : 0;
            categories.mac = platforms.mac ? 1 : 0;
            categories.name = data.name;
            let price = data.price || data.price_overview;
            categories.price = price ? (price.currency === `USD` ? Math.ceil(price.initial / 100) : -1) : 0;
            if (data.release_date && data.release_date.date) {
              // @ts-ignore
              categories.releaseDate = new Date(data.release_date.date).getTime();
            }
          }
        }
        if ((typeof id !== `string` || !id.match(/^SteamBundle/)) && (gSettings.gc_lg || gSettings.gc_r || gSettings.gc_rm || gSettings.gc_g_udt)) {
          if (gSettings.gc_rm && !gSettings.gc_lg && !gSettings.gc_r && !gSettings.gc_g_udt && type === `apps` && shared.esgst.delistedGames.removed.indexOf(parseInt(id)) > -1) {
            categories.removed = 1;
          } else {
            let response = await request({
              headers: { [`Cookie`]: `birthtime=0; mature_content=1` },
              method: `GET`,
              url: `https://store.steampowered.com/${type.slice(0, -1)}/${id}?cc=us&l=english`
            });
            let responseHtml = parseHtml(response.responseText);
            if (response.finalUrl.match(id)) {
              let elements = responseHtml.getElementsByClassName(`user_reviews_summary_row`);
              let n = elements.length;
              if (n > 0) {
                let rating = elements[n - 1].getAttribute(`data-tooltip-html`).replace(/[,.]/g, ``);
                let match = rating.match(/(\d+)%.+?(\d+)/);
                let percentageIndex = 1;
                let countIndex = 2;
                if (!match) {
                  match = rating.match(/(\d+).+?(\d+)%/);
                  percentageIndex = 2;
                  countIndex = 1;
                }
                if (match) {
                  categories.rating = `${match[percentageIndex]}% (${match[countIndex]})`;
                  rating = parseInt(match[percentageIndex]);
                  if (rating >= 0) {
                    if (rating < 40) {
                      categories.ratingType = `Negative`;
                    } else if (rating < 70) {
                      categories.ratingType = `Mixed`;
                    } else {
                      categories.ratingType = `Positive`;
                    }
                  } else {
                    categories.ratingType = `?`;
                  }
                }
              }
              categories.removed = 0;
              let tags = [];
              elements = responseHtml.querySelectorAll(`a.app_tag`);
              for (let i = 0, n = elements.length; i < n; ++i) {
                tags.push(elements[i].textContent.trim());
              }
              tags.sort((a, b) => {
                return a.localeCompare(b, {
                  sensitivity: `base`
                });
              });
              categories.tags = tags.join(`, `);
              if (responseHtml.querySelector(`.learning_about`)) {
                categories.learning = 1;
              }
            } else {
              categories.removed = 1;
            }
          }
        }
        if (gSettings.gc_dlc_b && categories.dlc && categories.base) {
          if (gc.cache.apps[categories.base]) {
            categories.freeBase = gc.cache.apps[categories.base].free;
          }
          if (typeof categories.freeBase === `undefined`) {
            categories.freeBase = JSON.parse((await request({
              anon: true,
              method: `GET`,
              url: `https://store.steampowered.com/api/appdetails?appids=${categories.base}&filters=basic&cc=us&l=english`
            })).responseText)[data.fullgame.appid].data.is_free;
          }
        }
        gc.cache[type][id] = categories;
        this.gc_addCategory(gc, gc.cache[type][id], games[type][id], id, shared.esgst.games[type][id], type, type === `apps` ? gc.cache.hltb : null);
        await lockAndSaveGames(shared.esgst.games);
        setLocalValue(`gcCache`, JSON.stringify(gc.cache));
      } catch (error) {
        window.console.log(error);
        for (const game of games[type][id]) {
          const panel = game.container.getElementsByClassName(`esgst-gc-panel`)[0];
          if (panel && !panel.getAttribute(`data-gcReady`)) {
            if (gSettings.gc_il && !shared.esgst.giveawayPath) {
              panel.previousElementSibling.style.display = `inline-block`;
              panel.classList.add(`esgst-gc-panel-inline`);
            }
            const loading = panel.getElementsByClassName(`esgst-gc-loading`)[0];
            if (loading) {
              loading.remove();
            }
            createElements(panel, `beforeEnd`, [{
              attributes: {
                class: `esgst-bold esgst-red`
              },
              type: `span`,
              children: [{
                attributes: {
                  class: `fa fa-exclamation`,
                  title: `An error happened while loading game categories.`
                },
                type: `i`
              }]
            }]);
          }
        }
      }
    }
  }

  updateIndexes() {
    if (this.queueIndexes.total > 0) {
      for (const queueId in this.queueIndexes.apps) {
        if (this.queueIndexes.apps[queueId] > 0) {
          this.queueIndexes.apps[queueId] -= 1;
        } else {
          delete this.queueIndexes.apps[queueId];
        }
      }
      for (const queueId in this.queueIndexes.subs) {
        if (this.queueIndexes.subs[queueId] > 0) {
          this.queueIndexes.subs[queueId] -= 1;
        } else {
          delete this.queueIndexes.subs[queueId];
        }
      }
      this.queueIndexes.total -= 1;
    }
    for (const game of shared.esgst.currentScope.games) {
      const panel = game.game.container.getElementsByClassName(`esgst-gc-panel`)[0];
      if (panel && !panel.getAttribute(`data-gcReady`)) {
        const loading = panel.getElementsByClassName(`esgst-gc-loading`)[0];
        if (loading && loading.lastElementChild) {
          loading.lastElementChild.textContent = ` ${this.queueIndexes[game.type][game.code] || 0}`;
        }
      }
    }
  }

  gc_checkPackage(id, savedGame) {
    const sub = shared.esgst.games.subs[id];
    if (!sub || !sub.apps) {
      return;
    }
    const added = [];
    const games = sub.apps
      .map(x => {
        x = parseInt(x);
        let y = shared.esgst.games.apps[x];
        if (!y) {
          return;
        }
        y = Object.assign({}, y);
        if (added.indexOf(x) > -1) {
          return;
        }
        added.push(x);
        y.id = x;
        return y;
      })
      .concat(
        Object.keys(shared.esgst.games.apps)
          .filter(x => shared.esgst.games.apps[x].packages && shared.esgst.games.apps[x].packages.indexOf(id) > -1)
          .map(x => {
            const z = parseInt(x);
            let y = shared.esgst.games.apps[z];
            if (!y) {
              return;
            }
            y = Object.assign({}, y);
            if (added.indexOf(z) > -1) {
              return;
            }
            added.push(z);
            y.id = z;
            return y;
          })
      )
      .filter(x => x);
    let found = false;
    let isOwned = false;
    const count = {
      num: 0,
      total: sub.apps.length
    };
    for (const game of games) {
      if (!game) {
        continue;
      }
      const gameWishlisted = game.wishlisted || (game.alias && !games.filter(x => x.id == game.alias)[0] && shared.esgst.games.apps[game.alias] && shared.esgst.games.apps[game.alias].wishlisted);
      if (gameWishlisted) {
        savedGame.wishlisted = gameWishlisted;
      }
      const gameOwned = game.owned || (game.alias && !games.filter(x => x.id == game.alias)[0] && shared.esgst.games.apps[game.alias] && shared.esgst.games.apps[game.alias].owned);
      if (gameOwned || sub.apps.indexOf(game.id) < 0) {
        if (!found) {
          isOwned = true;
        }
        if (gameOwned) {
          count.num += 1;
        }
      } else {
        found = true;
        isOwned = false;
      }
    }
    savedGame.owned = isOwned;
    count.num = Math.min(count.num, count.total);
    return count;
  }

  gc_addCategory(gc, cache, games, id, savedGame, type, hltb, isInstant, isOutdated) {
    if (!games) {
      return;
    }
    let active, category, count, cv, elements, encodedName, genre, genreList, genres, giveaway, giveaways, hltbTimes, i,
      j, k, n, panel, name, sent, singularType, user, value;
    if (type === `apps` && savedGame && savedGame.packages) {
      savedGame = Object.assign({}, savedGame);
      for (const subId of savedGame.packages) {
        this.gc_checkPackage(subId, savedGame);
      }
    }
    let packageCount = null;
    if (type === `subs` && savedGame && savedGame.apps) {
      savedGame = Object.assign({}, savedGame);
      packageCount = this.gc_checkPackage(id, savedGame);
    }
    singularType = type.slice(0, -1);
    const realId = typeof id === `string` ? id.replace(/^SteamBundle/, ``) : id;
    if (typeof id === `string` && id.match(/^SteamBundle/)) {
      singularType = `bundle`;
    }
    name = cache ? cache.name : games[0].name;
    encodedName = encodeURIComponent(name.replace(/\.\.\.$/, ``));
    elements = [];
    let categories = shared.esgst.gc_categories_ids;
    for (i = 0, n = categories.length; i < n; ++i) {
      category = categories[i];
      if (gSettings[category]) {
        switch (category) {
          case `gc_fcv`:
            if ((savedGame && !savedGame.reducedCV && !savedGame.noCV) || !savedGame) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-fullCV`,
                  [`data-draggable-id`]: `gc_fcv`,
                  href: `https://www.steamgifts.com/bundle-games/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_fcv`, `Full CV`)
                },
                text: gSettings.gc_fcv_s ? (gSettings.gc_fcv_s_i ? `` : `FCV`) : gSettings.gc_fcvLabel,
                type: `a`,
                children: gSettings.gc_fcv_s && gSettings.gc_fcv_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_fcvIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_rcv`:
            if (savedGame && savedGame.reducedCV && (!gSettings.gc_ncv_o || !savedGame.noCV)) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-reducedCV`,
                  [`data-draggable-id`]: `gc_rcv`,
                  href: `https://www.steamgifts.com/bundle-games/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_rcv`, `Reduced CV since ${savedGame.reducedCV}`)
                },
                text: gSettings.gc_rcv_s ? (gSettings.gc_rcv_s_i ? `` : `RCV`) : gSettings.gc_rcvLabel,
                type: `a`,
                children: gSettings.gc_rcv_s && gSettings.gc_rcv_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_rcvIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_ncv`:
            if (savedGame && savedGame.noCV) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-noCV`,
                  [`data-draggable-id`]: `gc_ncv`,
                  href: `https://www.steamgifts.com/bundle-games/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_ncv`, `No CV since ${savedGame.noCV}`)
                },
                text: gSettings.gc_ncv_s ? (gSettings.gc_ncv_s_i ? `` : `NCV`) : gSettings.gc_ncvLabel,
                type: `a`,
                children: gSettings.gc_ncv_s && gSettings.gc_ncv_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_ncvIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_hltb`:
            hltbTimes = {
              mainStory: 0,
              mainExtra: 0,
              completionist: 0,
              solo: 0,
              coOp: 0,
              vs: 0
            };
            if (savedGame && savedGame.apps && gc.cache.hltb) {
              for (const id of savedGame.apps) {
                if (gc.cache.hltb[id]) {
                  hltbTimes.mainStory += parseFloat(gc.cache.hltb[id].mainStory || 0);
                  hltbTimes.mainExtra += parseFloat(gc.cache.hltb[id].mainExtra || 0);
                  hltbTimes.completionist += parseFloat(gc.cache.hltb[id].completionist || 0);
                  hltbTimes.solo += parseFloat(gc.cache.hltb[id].solo || 0);
                  hltbTimes.coOp += parseFloat(gc.cache.hltb[id].coOp || 0);
                  hltbTimes.vs += parseFloat(gc.cache.hltb[id].vs || 0);
                }
              }
              // @ts-ignore
              hltbTimes.mainStory = isNaN(hltbTimes.mainStory) ? `- ` : `${hltbTimes.mainStory}h`;
              // @ts-ignore
              hltbTimes.mainExtra = isNaN(hltbTimes.mainExtra) ? `- ` : `${hltbTimes.mainExtra}h`;
              // @ts-ignore
              hltbTimes.completionist = isNaN(hltbTimes.completionist) ? `- ` : `${hltbTimes.completionist}h`;
              // @ts-ignore
              hltbTimes.solo = isNaN(hltbTimes.solo) ? `- ` : `${hltbTimes.solo}h`;
              // @ts-ignore
              hltbTimes.coOp = isNaN(hltbTimes.coOp) ? `- ` : `${hltbTimes.coOp}h`;
              // @ts-ignore
              hltbTimes.vs = isNaN(hltbTimes.vs) ? `- ` : `${hltbTimes.vs}h`;
            } else {
              hltbTimes = hltb && hltb[id];
            }
            if (hltbTimes) {
              let time = ``;
              if (hltbTimes.mainStory && hltbTimes.mainExtra && hltbTimes.completionist) {
                // singleplayer
                switch (gSettings.gc_hltb_index_0) {
                  case 0:
                    time = hltbTimes.mainStory;
                    break;
                  case 1:
                    time = hltbTimes.mainExtra;
                    break;
                  case 2:
                    time = hltbTimes.completionist;
                    break;
                }
              } else if (hltbTimes.solo && hltbTimes.coOp && hltbTimes.vs) {
                // singleplayer/multiplayer
                switch (gSettings.gc_hltb_index_2) {
                  case 0:
                    time = hltbTimes.solo;
                    break;
                  case 1:
                    time = hltbTimes.coOp;
                    break;
                  case 2:
                    time = hltbTimes.vs;
                    break;
                }
              } else if (hltbTimes.coOp && hltbTimes.vs) {
                // singleplayer/multiplayer
                switch (gSettings.gc_hltb_index_1) {
                  case 0:
                    time = hltbTimes.coOp;
                    break;
                  case 1:
                    time = hltbTimes.vs;
                    break;
                }
              } else {
                time = hltbTimes.mainStory || hltbTimes.mainExtra || hltbTimes.completionist || hltbTimes.solo || hltbTimes.coOp || hltbTimes.vs;
              }
              if (time) {
                let title = `Average time to beat based on HowLongToBeat: \n\n`;
                if (hltbTimes.mainStory) {
                  title += `Main Story: ${hltbTimes.mainStory}\n`;
                }
                if (hltbTimes.mainExtra) {
                  title += `Main + Extra: ${hltbTimes.mainExtra}\n`;
                }
                if (hltbTimes.completionist) {
                  title += `Completionist: ${hltbTimes.completionist}\n`;
                }
                if (hltbTimes.solo) {
                  title += `Solo: ${hltbTimes.solo}\n`;
                }
                if (hltbTimes.coOp) {
                  title += `Co-Op: ${hltbTimes.coOp}\n`;
                }
                if (hltbTimes.vs) {
                  title += `Vs.: ${hltbTimes.vs}\n`;
                }
                elements.push({
                  attributes: {
                    class: `esgst-gc esgst-gc-hltb`,
                    [`data-draggable-id`]: `gc_hltb`,
                    href: `https://howlongtobeat.com/game.php?id=${hltb && hltb[id] && hltb[id].id}`,
                    title: getFeatureTooltip(`gc_hltb`, title)
                  },
                  type: `a`,
                  children: [{
                    attributes: {
                      class: `fa fa-gamepad`
                    },
                    type: `i`
                  }, {
                    text: time,
                    type: `node`
                  }]
                });
              }
            }
            break;
          case `gc_h`:
            if (savedGame && savedGame.hidden) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-hidden`,
                  [`data-draggable-id`]: `gc_h`,
                  href: `https://www.steamgifts.com/account/settings/giveaways/filters/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_h`, `Hidden`)
                },
                text: gSettings.gc_h_s ? (gSettings.gc_h_s_i ? `` : `H`) : gSettings.gc_hLabel,
                type: `a`,
                children: gSettings.gc_h_s && gSettings.gc_h_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_hIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_i`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (shared.esgst.games.apps[id] && shared.esgst.games.apps[id].ignored) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((savedGame && savedGame.ignored) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-ignored`,
                  [`data-draggable-id`]: `gc_i`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_i`, `Ignored${count}`)
                },
                text: gSettings.gc_i_s ? (gSettings.gc_i_s_i ? `` : `I${count}`) : `${gSettings.gc_iLabel}${count}`,
                type: `a`,
                children: gSettings.gc_i_s && gSettings.gc_i_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_iIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
              if (gSettings.gc_i_t) {
                for (const game of games) {
                  const row = game.container.closest(`tr`);
                  if (row) {
                    row.style.backgroundColor = gSettings.gc_i_t_bgColor;
                  }
                }
              }
            }
            break;
          case `gc_o`:
            if (gSettings.gc_o_a) {
              for (const account of gSettings.gc_o_altAccounts) {
                let game = account.games[type][id];
                if (game && game.owned) {
                  elements.push({
                    attributes: {
                      class: `esgst-gc esgst-gc-owned`,
                      [`data-bgColor`]: account.bgColor,
                      [`data-color`]: account.color,
                      [`data-draggable-id`]: `gc_o`,
                      href: `https://steamcommunity.com/profiles/${account.steamId}/games`,
                      style: `background-color: ${account.bgColor}; color: ${account.color};`,
                      title: getFeatureTooltip(`gc_o`, `Owned by ${account.name}`)
                    },
                    text: gSettings.gc_o_s ? (gSettings.gc_o_s_i ? `` : `O`) : account.label,
                    type: `a`,
                    children: gSettings.gc_o_s && gSettings.gc_o_s_i ? [{
                      attributes: {
                        class: `fa fa-${account.icon}`
                      },
                      type: `i`
                    }] : null
                  });
                  if (gSettings.gc_o_a_t) {
                    for (const game of games) {
                      const row = game.container.closest(`tr`);
                      if (row) {
                        row.style.backgroundColor = gSettings.gc_o_a_t_bgColor;
                      }
                    }
                  }
                }
              }
            }
            if (savedGame && savedGame.owned) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-owned`,
                  [`data-draggable-id`]: `gc_o`,
                  href: `https://www.steamgifts.com/account/steam/games/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_o`, `Owned`)
                },
                text: gSettings.gc_o_s ? (gSettings.gc_o_s_i ? `` : `O`) : gSettings.gc_oLabel,
                type: `a`,
                children: gSettings.gc_o_s && gSettings.gc_o_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_oIcon}`
                  },
                  type: `i`
                }] : null
              });
              if (gSettings.gc_o_t) {
                for (const game of games) {
                  const row = game.container.closest(`tr`);
                  if (row) {
                    row.style.backgroundColor = gSettings.gc_o_t_bgColor;
                  }
                }
              }
            }
            break;
          case `gc_w`:
            if (savedGame && savedGame.wishlisted) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-wishlisted`,
                  [`data-draggable-id`]: `gc_w`,
                  href: `https://www.steamgifts.com/account/steam/wishlist/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_w`, `Wishlisted${typeof savedGame.wishlisted === `number` ? ` since ${this.gc_formatDate(savedGame.wishlisted * 1e3)}` : ``}`)
                },
                text: gSettings.gc_w_s ? (gSettings.gc_w_s_i ? `` : `W`) : gSettings.gc_wLabel,
                type: `a`,
                children: gSettings.gc_w_s && gSettings.gc_w_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_wIcon}`
                  },
                  type: `i`
                }] : null
              });
              if (gSettings.gc_w_t) {
                for (const game of games) {
                  const row = game.container.closest(`tr`);
                  if (row) {
                    row.style.backgroundColor = gSettings.gc_w_t_bgColor;
                  }
                }
              }
            }
            break;
          case `gc_f`:
            if (savedGame && savedGame.followed) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-followed`,
                  [`data-draggable-id`]: `gc_f`,
                  href: `https://steamcommunity.com/my/followedgames/`,
                  title: getFeatureTooltip(`gc_f`, `Followed`)
                },
                text: gSettings.gc_f_s ? (gSettings.gc_f_s_i ? `` : `F`) : gSettings.gc_fLabel,
                type: `a`,
                children: gSettings.gc_f_s && gSettings.gc_f_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_fIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_pw`:
            if (savedGame && savedGame.won && (!gSettings.gc_pw_o || !gSettings.gc_o || !savedGame.owned)) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-won`,
                  [`data-draggable-id`]: `gc_pw`,
                  href: `https://www.steamgifts.com/user/${gSettings.username}/giveaways/won/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_pw`, `Previously Won`),
                },
                text: gSettings.gc_pw_s ? (gSettings.gc_pw_s_i ? `` : `PW`) : gSettings.gc_pwLabel,
                type: `a`,
                children: gSettings.gc_pw_s && gSettings.gc_pw_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_pwIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_gi`:
            if (cache && isSet(cache.price)) {
              let price = cache.price;
              const heading = games[0].heading;
              if (heading) {
                const points = heading.innerHTML.match(/<span\sclass="giveaway__heading__thin">\((\d+?)P\)<\/span>/);
                if (points) {
                  price = parseInt(points[1]);
                }
              }
              user = shared.esgst.users.users[gSettings.steamId];
              if (user) {
                giveaways = user.giveaways;
                if (giveaways) {
                  giveaways = giveaways.sent[type][id];
                  active = 0;
                  count = 0;
                  sent = 0;
                  if (giveaways) {
                    let currentDate = Date.now();
                    let numGiveaways;
                    for (j = 0, numGiveaways = giveaways.length; j < numGiveaways; ++j) {
                      giveaway = shared.esgst.giveaways[giveaways[j]];
                      if (giveaway) {
                        if (Array.isArray(giveaway.winners)) {
                          if (giveaway.winners.length > 0) {
                            giveaway.winners.forEach(winner => {
                              count += 1;
                              if ((giveaway.entries >= 5 || (!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)) && winner.status === `Received`) {
                                sent += 1;
                              }
                            });
                          } else if (currentDate < giveaway.endTime) {
                            active += giveaway.copies;
                          }
                        } else if (giveaway.winners > 0) {
                          count += Math.min(giveaway.entries, giveaway.winners);
                          if (giveaway.entries >= 5 || (!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)) {
                            sent += Math.min(giveaway.entries, giveaway.winners);
                          }
                        } else if (currentDate < giveaway.endTime) {
                          active += giveaway.copies;
                        }
                      }
                    }
                    value = price;
                    if (savedGame) {
                      if (savedGame.noCV) {
                        value = 0;
                      } else if (savedGame.reducedCV) {
                        value *= 0.15;
                      }
                    }
                    if (sent > 5) {
                      for (j = 0, numGiveaways = sent - 5; j < numGiveaways; ++j) {
                        value *= 0.90;
                      }
                    }
                    cv = (sent + 1) > 5 ? value * 0.90 : value;
                    cv = Math.round(cv * 100) / 100;
                  } else {
                    value = price;
                    if (savedGame) {
                      if (savedGame.noCV) {
                        value = 0;
                      } else if (savedGame.reducedCV) {
                        value *= 0.15;
                      }
                    }
                    cv = Math.round(value * 100) / 100;
                  }
                  elements.push({
                    attributes: {
                      class: `esgst-gc esgst-gc-giveawayInfo`,
                      [`data-draggable-id`]: `gc_gi`,
                      href: `https://www.steamgifts.com/user/${gSettings.username}`,
                      title: getFeatureTooltip(`gc_gi`, `You have sent ${count} copies of this game (${sent} of which added to your CV)${active ? `\nYou currently have ${active} open giveaways for this game` : ``}\n\n${price !== -1 ? `You should get $${cv} real CV for sending a new copy of this game\nA giveaway for this game is worth ${Math.min(Math.ceil(price), 50)}P` : `ESGST was unable to retrieve the price of this game (most likely because the game was removed from the Steam store)`}`)
                    },
                    type: `a`,
                    children: [{
                      attributes: {
                        class: `fa fa-info`
                      },
                      type: `i`
                    }, {
                      text: ` ${count} `,
                      type: `node`
                    }, {
                      attributes: {
                        class: `fa fa-dollar`
                      },
                      type: `i`
                    }, {
                      text: ` ${price !== -1 ? cv : `?`}`,
                      type: `node`
                    }]
                  });
                }
              }
            }
            break;
          case `gc_r`:
            if (cache && cache.rating) {
              let colors = null;
              let percentage = parseInt(cache.rating.match(/(\d+)%/)[1]);
              for (let i = 0, n = gSettings.gc_r_colors.length; i < n; i++) {
                colors = gSettings.gc_r_colors[i];
                if (percentage >= colors.lower && percentage <= colors.upper) {
                  break;
                }
              }
              if (!colors) {
                colors = {
                  bgColor: `#7f8c8d`,
                  color: `#ffffff`,
                  icon: `fa-question-circle`
                };
              }
              let match = cache.rating.match(/\((\d+)\)/);
              if (match) {
                cache.rating = cache.rating.replace(/\(\d+\)/, `(${parseInt(match[1]).toLocaleString()
                  })`);
              }
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-rating`,
                  [`data-bgColor`]: colors.bgColor,
                  [`data-color`]: colors.color,
                  [`data-draggable-id`]: `gc_r`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  style: `background-color: ${colors.bgColor}; color: ${colors.color};`,
                  title: getFeatureTooltip(`gc_r`, cache.rating)
                },
                type: `a`,
                children: [colors.icon.match(/\w/) ? {
                  attributes: {
                    class: `fa fa-${colors.icon}`
                  },
                  type: `i`
                } : {
                    attributes: {
                      style: `font-size: 14px;`
                    },
                    text: colors.icon,
                    type: `span`
                  }, {
                  text: gSettings.gc_r_s ? ` ${cache.rating}` : ``,
                  type: `node`
                }]
              });
            }
            break;
          case `gc_a`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].achievements) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.achievements) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-achievements`,
                  [`data-draggable-id`]: `gc_a`,
                  href: `https://steamcommunity.com/stats/${realId}/achievements`,
                  title: getFeatureTooltip(`gc_a`, `Achievements${count || ` (${cache.achievements})`}`)
                },
                text: gSettings.gc_a_s ? (gSettings.gc_a_s_i ? `` : `A${count}`) : `${gSettings.gc_aLabel}${count}`,
                type: `a`,
                children: gSettings.gc_a_s && gSettings.gc_a_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_aIcon}`
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_bd`:
            if (type === `apps` && shared.esgst.delistedGames.banned.indexOf(parseInt(id)) > -1) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-banned`,
                  [`data-draggable-id`]: `gc_bd`,
                  href: `https://steamdb.info/app/${realId}`,
                  title: getFeatureTooltip(`gc_bd`, `Banned`)
                },
                text: gSettings.gc_bd_s ? (gSettings.gc_bd_s_i ? `` : `BD`) : gSettings.gc_bdLabel,
                type: `a`,
                children: gSettings.gc_bd_s && gSettings.gc_bd_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_bdIcon}`
                  },
                  type: `i`
                }] : null
              });
            }
            break;
          case `gc_bvg`:
            elements.push({
              attributes: {
                class: `esgst-gc esgst-gc-bartervg`,
                [`data-draggable-id`]: `gc_bvg`,
                href: `https://barter.vg/steam/${singularType}/${realId}`,
                target: `_blank`,
                title: getFeatureTooltip(`gc_bvg`, `Barter.vg`)
              },
              text: gSettings.gc_bvg_s ? (gSettings.gc_bvg_s_i ? `` : `BVG`) : gSettings.gc_bvgLabel,
              type: `a`,
              children: gSettings.gc_bvg_s && gSettings.gc_bvg_s_i ? [{
                attributes: {
                  class: `fa fa-${gSettings.gc_bvgIcon}`
                },
                type: `i`
              }] : null
            });
            break;
          case `gc_mp`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].multiplayer) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.multiplayer) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-multiplayer`,
                  [`data-draggable-id`]: `gc_mp`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_mp`, `Multiplayer${count}`)
                },
                text: gSettings.gc_mp_s ? (gSettings.gc_mp_s_i ? `` : `MP${count}`) : `${gSettings.gc_mpLabel}${count}`,
                type: `a`,
                children: gSettings.gc_mp_s && gSettings.gc_mp_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_mpIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_sp`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].singleplayer) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.singleplayer) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-singleplayer`,
                  [`data-draggable-id`]: `gc_sp`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_sp`, `Singleplayer${count}`)
                },
                text: gSettings.gc_sp_s ? (gSettings.gc_sp_s_i ? `` : `SP${count}`) : `${gSettings.gc_spLabel}${count}`,
                type: `a`,
                children: gSettings.gc_sp_s && gSettings.gc_sp_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_spIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_sc`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].steamCloud) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.steamCloud) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-steamCloud`,
                  [`data-draggable-id`]: `gc_sc`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_sc`, `Steam Cloud${count}`)
                },
                text: gSettings.gc_sc_s ? (gSettings.gc_sc_s_i ? `` : `SC${count}`) : `${gSettings.gc_scLabel}${count}`,
                type: `a`,
                children: gSettings.gc_sc_s && gSettings.gc_sc_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_scIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_tc`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].tradingCards) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.tradingCards) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-tradingCards`,
                  [`data-draggable-id`]: `gc_tc`,
                  href: `https://www.steamcardexchange.net/index.php?gamepage-${singularType}id-${realId}`,
                  title: getFeatureTooltip(`gc_tc`, `Trading Cards${count}`)
                },
                text: gSettings.gc_tc_s ? (gSettings.gc_tc_s_i ? `` : `TC${count}`) : `${gSettings.gc_tcLabel}${count}`,
                type: `a`,
                children: gSettings.gc_tc_s && gSettings.gc_tc_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_tcIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_l`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].linux) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.linux) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-linux`,
                  [`data-draggable-id`]: `gc_l`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_l`, `Linux${count}`)
                },
                text: gSettings.gc_l_s ? (gSettings.gc_l_s_i ? `` : `L${count}`) : `${gSettings.gc_lLabel}${count}`,
                type: `a`,
                children: gSettings.gc_l_s && gSettings.gc_l_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_lIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_m`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].mac) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.mac) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-mac`,
                  [`data-draggable-id`]: `gc_m`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_m`, `Mac${count}`)
                },
                text: gSettings.gc_m_s ? (gSettings.gc_m_s_i ? `` : `M${count}`) : `${gSettings.gc_mLabel}${count}`,
                type: `a`,
                children: gSettings.gc_m_s && gSettings.gc_m_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_mIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_dlc`:
            if (cache && cache.dlc) {
              let baseOwned;
              if (gSettings.gc_dlc_o) {
                if (cache.base && shared.esgst.games.apps[cache.base]) {
                  baseOwned = shared.esgst.games.apps[cache.base].owned;
                }
              }
              const children = [];
              if (gSettings.gc_dlc_s) {
                if (gSettings.gc_dlc_s_i) {
                  children.push({
                    attributes: {
                      class: `fa fa-${gSettings.gc_dlcIcon} `
                    },
                    type: `i`
                  });
                  if (gSettings.gc_dlc_o && baseOwned) {
                    children.push({
                      attributes: {
                        class: `fa fa-${gSettings.gc_oIcon} esgst-gc-dlcOwned`
                      },
                      type: `i`
                    });
                  }
                  if (gSettings.gc_dlc_b && typeof cache.freeBase !== `undefined`) {
                    if (cache.freeBase) {
                      children.push({
                        attributes: {
                          class: `fa fa-certificate esgst-gc-dlcFree`
                        },
                        type: `i`
                      });
                    } else {
                      children.push({
                        attributes: {
                          class: `fa fa-money esgst-gc-dlcNonFree`
                        },
                        type: `i`
                      });
                    }
                  }
                } else {
                  children.push({
                    text: `DLC`,
                    type: `node`
                  });
                  if (gSettings.gc_dlc_o && baseOwned) {
                    children.push({
                      attributes: {
                        class: `esgst-gc-dlcOwned`
                      },
                      text: `(O)`,
                      type: `span`
                    });
                  }
                  if (gSettings.gc_dlc_b && typeof cache.freeBase !== `undefined`) {
                    if (cache.freeBase) {
                      children.push({
                        attributes: {
                          class: `esgst-gc-dlcFree`
                        },
                        text: `(F)`,
                        type: `span`
                      });
                    } else {
                      children.push({
                        attributes: {
                          class: `esgst-gc-dlcNonFree`
                        },
                        text: `(NF)`,
                        type: `span`
                      });
                    }
                  }
                }
              } else {
                children.push({
                  text: gSettings.gc_dlcLabel,
                  type: `node`
                });
                if (gSettings.gc_dlc_o && baseOwned) {
                  children.push({
                    attributes: {
                      class: `esgst-gc-dlcOwned`
                    },
                    text: `(Owned)`,
                    type: `span`
                  });
                }
                if (gSettings.gc_dlc_b && typeof cache.freeBase !== `undefined`) {
                  if (cache.freeBase) {
                    children.push({
                      attributes: {
                        class: `esgst-gc-dlcFree`
                      },
                      text: `(Free)`,
                      type: `span`
                    });
                  } else {
                    children.push({
                      attributes: {
                        class: `esgst-gc-dlcNonFree`
                      },
                      text: `(Not Free)`,
                      type: `span`
                    });
                  }
                }
              }
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-dlc`,
                  [`data-draggable-id`]: `gc_dlc`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_dlc`, `DLC${gSettings.gc_dlc_b && typeof cache.freeBase !== `undefined` ? (cache.freeBase ? ` (the base game of this DLC is free)` : ` (the base game of this DLC is not free)`) : ``}`)
                },
                type: `a`,
                children
              });
            }
            break;
          case `gc_p`:
            if (type === `subs`) {
              const children = [];
              if (gSettings.gc_p_s) {
                if (gSettings.gc_p_s_i) {
                  children.push({
                    attributes: {
                      class: `fa fa-${gSettings.gc_pIcon}`
                    },
                    type: `i`
                  });
                } else {
                  children.push({
                    text: `P`,
                    type: `node`
                  });
                }
              } else {
                children.push({
                  text: gSettings.gc_pLabel,
                  type: `node`
                });
              }
              if (packageCount) {
                children.push({
                  text: ` (${packageCount.num}/${packageCount.total})`,
                  type: `node`
                });
              }
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-package`,
                  [`data-draggable-id`]: `gc_p`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_p`, `Package${savedGame && savedGame.apps ? ` (${savedGame.apps.length})` : ``} ${packageCount ? ` (${packageCount.num} owned)` : ``} `)
                },
                type: `a`,
                children
              });
              if (packageCount && packageCount.num) {
                if (gSettings.gc_p_t && packageCount.num < packageCount.total) {
                  for (const game of games) {
                    const row = game.container.closest(`tr`);
                    if (row) {
                      row.style.backgroundColor = gSettings.gc_p_t_bgColor;
                    }
                  }
                } else if (gSettings.gc_o_t && packageCount.num === packageCount.total) {
                  for (const game of games) {
                    const row = game.container.closest(`tr`);
                    if (row) {
                      row.style.backgroundColor = gSettings.gc_o_t_bgColor;
                    }
                  }
                }
              }
            }
            break;
          case `gc_ea`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].earlyAccess) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.earlyAccess) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-earlyAccess`,
                  [`data-draggable-id`]: `gc_ea`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_ea`, `Early Access${count}`)
                },
                text: gSettings.gc_ea_s ? (gSettings.gc_ea_s_i ? `` : `EA${count}`) : `${gSettings.gc_eaLabel}${count}`,
                type: `a`,
                children: gSettings.gc_ea_s && gSettings.gc_ea_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_eaIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_lg`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].learning === 1) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.learning === 1) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-learning`,
                  [`data-draggable-id`]: `gc_lg`,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_lg`, `Learning${count}`)
                },
                text: gSettings.gc_lg_s ? (gSettings.gc_lg_s_i ? `` : `LG${count}`) : `${gSettings.gc_lgLabel}${count}`,
                type: `a`,
                children: gSettings.gc_lg_s && gSettings.gc_lg_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_lgIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_rm`:
            count = 0;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].removed === 1) {
                  count += 1;
                }
              }
            }
            count = count ? ` (${count})` : ``;
            if ((cache && cache.removed === 1) || count) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-removed`,
                  [`data-draggable-id`]: `gc_rm`,
                  href: `https://steamdb.info/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_rm`, `Removed${count}`)
                },
                text: gSettings.gc_rm_s ? (gSettings.gc_rm_s_i ? `` : `RM${count}`) : `${gSettings.gc_rmLabel}${count}`,
                type: `a`,
                children: gSettings.gc_rm_s && gSettings.gc_rm_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_rmIcon} `
                  },
                  type: `i`
                }, count ? {
                  text: count,
                  type: `node`
                } : null] : null
              });
            }
            break;
          case `gc_rd`:
            if (cache && cache.releaseDate) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-releaseDate`,
                  [`data-draggable-id`]: `gc_rd`,
                  [`data-timestamp`]: cache.releaseDate === ` ? ` ? cache.releaseDate : cache.releaseDate / 1e3,
                  href: `https://store.steampowered.com/${singularType}/${realId}`,
                  title: getFeatureTooltip(`gc_rd`, `Release Date`)
                },
                type: `a`,
                children: [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_rdIcon}`
                  },
                  type: `i`
                }, {
                  text: ` ${this.gc_formatDate(cache.releaseDate)}`,
                  type: `node`
                }]
              });
            }
            break;
          case `gc_g`:
            genres = ``;
            if (savedGame && savedGame.apps) {
              for (const id of savedGame.apps) {
                if (gc.cache.apps[id] && gc.cache.apps[id].genres) {
                  genres += `${gSettings.gc_g_udt && gc.cache.apps[id].tags ? `${gc.cache.apps[id].genres}, ${gc.cache.apps[id].tags}` : gc.cache.apps[id].genres}, `;
                }
              }
              genres = genres.slice(0, -2);
            } else if (cache && cache.genres) {
              genres = gSettings.gc_g_udt && cache.tags ? `${cache.genres}, ${cache.tags}` : cache.genres;
            }
            if (genres) {
              let filters;
              genreList = sortArray(Array.from(new Set(genres.split(/,\s/))));
              genres = genreList.join(`, `);
              if (gSettings.gc_g_filters.trim()) {
                filters = gSettings.gc_g_filters.trim().toLowerCase().split(/\s*,\s*/);
              }
              for (j = genreList.length - 1; j >= 0; --j) {
                genre = genreList[j].toLowerCase();
                if (!filters || filters.indexOf(genre) > -1) {
                  for (k = gSettings.gc_g_colors.length - 1; k >= 0 && gSettings.gc_g_colors[k].genre.toLowerCase() !== genre; --k) {
                  }
                  if (k >= 0) {
                    if (gSettings.gc_g_s) {
                      genreList[j] = {
                        attributes: {
                          class: `esgst-gc esgst-gc-genres`,
                          href: `https://store.steampowered.com/${singularType}/${realId}`,
                          style: `background-color: ${gSettings.gc_g_colors[k].bgColor}; color: ${gSettings.gc_g_colors[k].color};`,
                          title: getFeatureTooltip(`gc_g_s`, genreList[j])
                        },
                        text: genreList[j],
                        type: `a`
                      };
                    } else {
                      genreList[j] = {
                        attributes: {
                          style: `color: ${gSettings.gc_g_colors[k].color}`
                        },
                        text: genreList[j],
                        type: `span`
                      };
                      if (j < genreList.length - 1) {
                        genreList.splice(j + 1, 0, {
                          text: `, `,
                          type: `node`
                        });
                      }
                    }
                  } else if (gSettings.gc_g_s) {
                    genreList[j] = {
                      attributes: {
                        class: `esgst-gc esgst-gc-genres`,
                        href: `https://store.steampowered.com/${singularType}/${realId}`,
                        title: getFeatureTooltip(`gc_g_s`, genreList[j])
                      },
                      text: genreList[j],
                      type: `a`
                    };
                  } else {
                    genreList[j] = {
                      text: genreList[j],
                      type: `node`
                    };
                    if (j < genreList.length - 1) {
                      genreList.splice(j + 1, 0, {
                        text: `, `,
                        type: `node`
                      });
                    }
                  }
                } else {
                  genreList.splice(j, 1);
                }
              }
              if (gSettings.gc_g_s) {
                elements.push({
                  attributes: {
                    class: `esgst-gc esgst-gc-genres`,
                    [`data-draggable-id`]: `gc_g`
                  },
                  type: `span`,
                  children: genreList
                });
              } else if (genreList.length > 0) {
                elements.push({
                  attributes: {
                    class: `esgst-gc esgst-gc-genres`,
                    [`data-draggable-id`]: `gc_g`,
                    href: `https://store.steampowered.com/${singularType}/${realId}`,
                    title: getFeatureTooltip(`gc_g`, genres)
                  },
                  type: `a`,
                  children: genreList
                });
              }
            }
            break;
        }
      }
    }
    if (isInstant || isOutdated) {
      elements.push({
        attributes: {
          class: `esgst-gc-loading`,
          title: `This game is queued for fetching`
        },
        type: `span`,
        children: [{
          attributes: {
            class: `fa fa-hourglass fa-spin`
          },
          type: `i`
        }, {
          type: `span`
        }]
      });
    }
    let cannotCheckOwnership = false;
    if ((!savedGame || !savedGame.owned) && ((cache && (cache.dlc || cache.learning === 1)) || (type === `apps` && shared.esgst.delistedGames.banned.indexOf(parseInt(id)) > -1) || (type === `subs` && !packageCount))) {
      cannotCheckOwnership = true;
    }
    for (i = 0, n = games.length; i < n; ++i) {
      const button = (games[i].elgbButton && games[i].elgbButton.firstElementChild) || shared.esgst.enterGiveawayButton;
      if (button && cannotCheckOwnership && gSettings.gc_e) {
        button.title = `ESGST cannot check ownership of this game`;
        button.style.color = gSettings.gc_e_color;
        button.style.borderColor = gSettings.gc_e_bColor;
        button.style.backgroundColor = gSettings.gc_e_bgColor;
        button.style.backgroundImage = `none`;
      }
      if (games[i].container.classList.contains(`esgst-hidden`)) {
        if (!shared.esgst.gcToFetch[type][id]) {
          shared.esgst.gcToFetch[type][id] = [];
        }
        if (shared.esgst.gcToFetch[type][id].indexOf(games[i]) < 0) {
          shared.esgst.gcToFetch[type][id].push(games[i]);
        }
        continue;
      }
      if (shared.esgst.gcToFetch[type][id]) {
        shared.esgst.gcToFetch[type][id] = shared.esgst.gcToFetch[type][id].filter(item => item !== games[i]);
        if (!shared.esgst.gcToFetch[type][id].length) {
          delete shared.esgst.gcToFetch[type][id];
        }
      }
      const oldElements = games[i].container.querySelectorAll(`.esgst-gc`);
      for (const element of oldElements) {
        element.remove();
      }
      panel = games[i].container.getElementsByClassName(`esgst-gc-panel`)[0];
      if (panel && !panel.getAttribute(`data-gcReady`)) {
        if (gSettings.gc_il && !shared.esgst.giveawayPath) {
          panel.previousElementSibling.style.display = `inline-block`;
          panel.classList.add(`esgst-gc-panel-inline`);
        }
        if (gSettings.gc_ocv && games[i].startTime) {
          const reducedCV = (savedGame && savedGame.reducedCV && new Date(savedGame.reducedCV).getTime()) || 0;
          const noCV = (savedGame && savedGame.noCV && new Date(savedGame.noCV).getTime()) || 0;
          if (reducedCV || noCV) {
            let original = null;
            if (games[i].startTime < reducedCV) {
              original = {
                id: `fcv`,
                initials: `FCV`,
                name: `Full CV`
              };
            } else if (games[i].startTime >= reducedCV && games[i].startTime < noCV) {
              original = {
                id: `rcv`,
                initials: `RCV`,
                name: `Reduced CV`
              };
            }
            if (original) {
              elements.push({
                attributes: {
                  class: `esgst-gc esgst-gc-originalCV`,
                  [`data-draggable-id`]: `gc_ocv`,
                  href: `https://www.steamgifts.com/bundle-games/search?q=${encodedName}`,
                  title: getFeatureTooltip(`gc_ocv`, `Was ${original.name} when it was given away`)
                },
                text: gSettings.gc_ocv_s ? (gSettings.gc_ocv_s_i ? `` : `W${original.initials}`) : `${gSettings.gc_ocvLabel}${original.name}`,
                type: `a`,
                children: gSettings.gc_ocv_s && gSettings.gc_ocv_s_i ? [{
                  attributes: {
                    class: `fa fa-${gSettings.gc_ocvIcon}`
                  },
                  type: `i`
                }, {
                  attributes: {
                    class: `fa fa-${gSettings[`gc_${original.id}Icon`]}`
                  },
                  type: `i`
                }] : null
              });
            }
          }
        }
        createElements(panel, `inner`, elements);
        if (isInstant || isOutdated) {
          continue;
        }
        if (!gSettings.gc_lp || (!gSettings.gc_lp_gv && games[i].grid)) {
          for (j = panel.children.length - 1; j > -1; --j) {
            panel.children[j].removeAttribute(`href`);
          }
        }
        panel.addEventListener(`dragenter`, draggable_enter.bind(common, {
          context: panel,
          item: games[i]
        }));
        panel.setAttribute(`data-gcReady`, 1);
      }
      games[i].gcPanel = panel;
      shared.esgst.modules.giveaways.giveaways_reorder(games[i]);
    }
  }

  gc_formatDate(timestamp) {
    if (timestamp === `?`) return timestamp;
    let date = new Date(timestamp);
    return gSettings.gc_rdLabel
      .replace(/DD/, date.getDate())
      .replace(/MM/, `${date.getMonth() + 1}`)
      .replace(/Month/, [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`][date.getMonth()])
      .replace(/Mon/, [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`][date.getMonth()])
      .replace(/YYYY/, `${date.getFullYear()}`);
  }
}

const gamesGameCategories = new GamesGameCategories();

export { gamesGameCategories };