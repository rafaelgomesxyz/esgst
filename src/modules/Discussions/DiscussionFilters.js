import { Button } from '../../class/Button';
import { Filters } from '../Filters';
import { Process } from '../../class/Process';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

const
  sortArray = utils.sortArray.bind(utils),
  checkMissingDiscussions = common.checkMissingDiscussions.bind(common),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  createLock = common.createLock.bind(common),
  endless_load = common.endless_load.bind(common),
  getValue = common.getValue.bind(common),
  setValue = common.setValue.bind(common)
  ;

class DiscussionsDiscussionFilters extends Filters {
  constructor() {
    super(`df`);
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to filter discussions.`]
        ]]
      ],
      features: {
        df_s: {
          description: [
            [`ul`, [
              [`li`, [
                `Adds a button (`,
                [`i`, { class: `fa fa-eye` }],
                ` if the discussion is hidden and `,
                [`i`, { class: `fa fa-eye-slash` }],
                ` if it is not) next to a discussion's title (in any page) that allows you to hide the discussion.`
              ]],
              [`li`, [
                `Adds a button (`,
                [`i`, { class: `fa fa-comments` }],
                ` `,
                [`i`, { class: `fa fa-eye-slash` }],
                `) to the page heading of this menu that allows you to view all of the discussions that have been hidden.`
              ]],
            ]]
          ],
          name: `Single Filters`,
          sg: true,
          features: {
            df_s_s: {
              name: `Show switch to temporarily hide / unhide discussions filtered by the filters in the main page heading, along with a counter.`,
              sg: true
            }
          }
        },
        df_m: {
          description: [
            [`ul`, [
              [`li`, `Allows you to hide multiple discussions in a page using many different filters.`],
              [`li`, [
                `Adds a toggle switch with a button (`,
                [`i`, { class: `fa fa-sliders` }],
                `) to the main page heading of any `,
                [`a`, { href: `https://www.steamgifts.com/discussions` }, `discussions`],
                ` page. The switch allows you to turn the filters on/off and the button allows you to manage your presets.`
              ]],
              [`li`, `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 2 categories:`],
              [`ul`, [
                [`li`, `Basic filters are related to a numeric value (such as the number of comments of a discussion) and have a slider that you can use to set the range of the filter (any discussions that do not apply to the range will be hidden).`],
                [`li`, `Type filters are related to a boolean value (such as whether or not a discussion was created by yourself) and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
                [`ul`, [
                  [`li`, [
                    `"Show all" (`,
                    [`i`, { class: `fa fa-check-square` }],
                    `) does not hide any discussions that apply to the filter (this is the default state).`
                  ]],
                  [`li`, [
                    `"Show only" (`,
                    [`i`, { class: `fa fa-square` }],
                    `) hides any discussions that do not apply to the filter.`
                  ]],
                  [`li`, [
                    `"Hide all" (`,
                    [`i`, { class: `fa fa-square-o` }],
                    `) hides any discussions that apply to the filter.`
                  ]]
                ]]
              ]],
              [`li`, `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:`],
              [`ul`, [
                [`li`, `Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.`],
                [`li`, `Exception rules are the ones that you can change by clicking on the icon `],
                [`i`, { class: `fa fa-gear` }],
                ` in the filter panel. They are exceptions to the basic rules. For example, if you set the basic rule of the "Created" filter to "hide all" and you add an exception rule for the "Comments" filter to the 0-50 range, none of your created discussions that have 0-50 comments will be hidden, because they apply to the exception.`
              ]],
              [`li`, [
                `Override rules are the ones that you can change by clicking on the icon (`,
                [`i`, { class: `fa fa-exclamation esgst-faded` }],
                ` if set to overridable and `,
                [`i`, { class: `fa fa-exclamation` }],
                ` if set to non-overridable) next to each filter. They are enforcements of the basic rules. Continuing the previous example, if you set the override rule of the "Created" filter to "non-overridable", then all of your created discussions will be hidden, because even if they apply to the exception, the basic rule is being enforced by the override rule, so the exception cannot override it.`
              ]]
            ]]
          ],
          features: {
            df_m_b: {
              name: `Hide basic filters.`,
              sg: true
            },
            df_m_a: {
              name: `Hide advanced filters.`,
              sg: true
            },
            df_comments: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions by number of comments.`]
                ]]
              ],
              name: `Comments`,
              sg: true
            },
            df_announcements: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Announcements".`]
                ]]
              ],
              name: `Announcements`,
              sg: true
            },
            df_bugsSuggestions: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Bugs / Suggestions".`]
                ]]
              ],
              name: `Bugs / Suggestions`,
              sg: true
            },
            df_deals: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Deals".`]
                ]]
              ],
              name: `Deals`,
              sg: true
            },
            df_general: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "General".`]
                ]]
              ],
              name: `General`,
              sg: true
            },
            df_groupRecruitment: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Group Recruitment".`]
                ]]
              ],
              name: `Group Recruitment`,
              sg: true
            },
            df_letsPlayTogether: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Let's Play Together".`]
                ]]
              ],
              name: `Let's Play Together`,
              sg: true
            },
            df_offTopic: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Off-Topic".`]
                ]]
              ],
              name: `Off-Topic`,
              sg: true
            },
            df_puzzles: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Puzzles".`]
                ]]
              ],
              name: `Puzzles`,
              sg: true
            },
            df_uncategorized: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions categorized as "Uncategorized".`]
                ]]
              ],
              name: `Uncategorized`,
              sg: true
            },
            df_created: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions created by yourself.`]
                ]]
              ],
              name: `Created`,
              sg: true
            },
            df_poll: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions that contain polls.`]
                ]]
              ],
              name: `Poll`,
              sg: true
            },
            df_highlighted: {
              dependencies: [`dh`],
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions that you have highlighted.`]
                ]]
              ],
              name: `Highlighted`,
              sg: true
            },
            df_visited: {
              dependencies: [`gdttt`],
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions that you have visited.`]
                ]]
              ],
              name: `Visited`,
              sg: true
            },
            df_unread: {
              dependencies: [`ct`],
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions that you have read.`]
                ]]
              ],
              name: `Unread`,
              sg: true
            },
            df_authors: {
              description: [
                [`ul`, [
                  [`li`, `Allows you to filter discussions by author.`]
                ]]
              ],
              name: `Authors`,
              sg: true
            }
          },
          name: `Multiple Filters`,
          sg: true
        }
      },
      id: `df`,
      name: `Discussion Filters`,
      sg: true,
      type: `discussions`
    };
  }

  async init() {
    if (gSettings.df_s) {
      if (gSettings.df_s_s) {
        this.addSingleButton(`fa-comments`);
      }
      this.esgst.discussionFeatures.push(this.df_addButtons.bind(this));
    }
    if (gSettings.df_m && this.esgst.discussionsPath && !this.esgst.editDiscussionPath) {
      this.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${this.esgst.commentsTop - 5}px;
        }
      `);
      createHeadingButton({
        element: this.filters_addContainer(this.esgst.mainPageHeading),
        id: `df`
      });
    }
    if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions || gSettings.adots || gSettings.oadd) return;
    await checkMissingDiscussions();
  }

  df_menu(obj, button) {
    obj.process = new Process({
      button,
      popup: {
        icon: `fa-comments`,
        title: `Hidden Discussions`,
        addProgress: true,
        addScrollable: `left`
      },
      urls: {
        id: `df`,
        init: this.df_initUrls.bind(this),
        perLoad: 5,
        request: {
          request: this.df_requestUrl.bind(this)
        }
      }
    });
  }

  async df_initUrls(obj) {
    obj.discussions = obj.popup.getScrollable([
      [`div`, { class: `table esgst-text-left` }, [
        [`div`, { class: `table__heading` }, [
          [`div`, { class: `table__column--width-fill` }, `Summary`],
          [`div`, { class: `table__column--width-small text-center` }, `Comments`]
        ]],
        [`div`, { class: `table__rows` }]
      ]]
    ]).lastElementChild;
    const discussions = JSON.parse(getValue(`discussions`));
    let hidden = [];
    for (const key in discussions) {
      if (discussions.hasOwnProperty(key)) {
        if (discussions[key].hidden) {
          const discussion = {
            code: key,
            hidden: parseInt(discussions[key].hidden)
          };
          hidden.push(discussion);
        }
      }
    }
    hidden = sortArray(hidden, true, `hidden`);
    obj.ids = [];
    for (const discussion of hidden) {
      obj.ids.push(discussion.code);
      obj.items.push(`/discussion/${discussion.code}/`);
    }
  }

  async df_requestUrl(obj, details, response, responseHtml) {
    const breadcrumbs = responseHtml.getElementsByClassName(`page__heading__breadcrumbs`);
    const categoryLink = breadcrumbs[0].firstElementChild.nextElementSibling.nextElementSibling;
    const usernameLink = responseHtml.getElementsByClassName(`comment__username`)[0].firstElementChild;
    createElements(obj.discussions, `beforeEnd`, [{
      type: `div`,
      children: [{
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
            type: `div`,
            children: [{
              context: responseHtml.getElementsByClassName(`global__image-outer-wrap`)[0]
            }]
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [{
              type: `h3`,
              children: [{
                attributes: {
                  class: `table__column__heading`,
                  href: `/discussion/${obj.ids[obj.index]}/`
                },
                text: categoryLink.nextElementSibling.nextElementSibling.firstElementChild.textContent,
                type: `a`
              }]
            }, {
              type: `p`,
              children: [{
                attributes: {
                  class: `table__column__secondary-link`,
                  href: categoryLink.getAttribute(`href`)
                },
                text: categoryLink.textContent,
                type: `a`
              }, {
                text: ` - `,
                type: `node`
              }, {
                context: responseHtml.querySelector(`.comment [data-timestamp]`)
              }, {
                text: ` by `,
                type: `node`
              }, {
                attributes: {
                  class: `table__column__secondary-link`,
                  href: usernameLink.getAttribute(`href`)
                },
                text: usernameLink.textContent,
                type: `a`
              }]
            }]
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `table__column__secondary-link`,
                href: `/discussion/${obj.ids[obj.index]}/`
              },
              text: `${breadcrumbs[1].textContent.match(/(.+) Comments?/)[1]}`,
              type: `a`
            }]
          }]
        }]
      }]
    }]);
    await endless_load(obj.discussions);
    if (!this.esgst.giveawaysPath && !this.esgst.discussionsPath) {
      if (gSettings.gdttt) {
        await this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.discussions, true);
        await this.esgst.modules.generalGiveawayDiscussionTicketTradeTracker.gdttt_checkVisited(obj.discussions);
      } else if (gSettings.ct) {
        await this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.discussions, true);
      }
      await this.esgst.modules.discussions.discussions_load(obj.discussions);
    }
  }

  df_addButtons(discussions, main) {
    for (const discussion of discussions) {
      if (!discussion.heading.parentElement.getElementsByClassName(`esgst-df-button`)[0]) {
        new Button(discussion.headingContainer.firstElementChild, `beforeBegin`, {
          callbacks: [this.df_hideDiscussion.bind(this, discussion, main), null, this.df_unhideDiscussion.bind(this, discussion, main), null],
          className: `esgst-df-button`,
          icons: [`fa-eye-slash esgst-clickable`, `fa-circle-o-notch fa-spin`, `fa-eye esgst-clickable`, `fa-circle-o-notch fa-spin`],
          id: `df_s`,
          index: discussion.saved && discussion.saved.hidden ? 2 : 0,
          titles: [`Hide discussion`, `Hiding discussion...`, `Unhide discussion`, `Unhiding discussion...`]
        });
      }
    }
  }

  async df_hideDiscussion(discussion, main) {
    let deleteLock = await createLock(`discussionLock`, 300);
    let discussions = JSON.parse(getValue(`discussions`, `{}`));
    if (!discussions[discussion.code]) {
      discussions[discussion.code] = {};
    }
    discussions[discussion.code].hidden = discussions[discussion.code].lastUsed = Date.now();
    await setValue(`discussions`, JSON.stringify(discussions));
    deleteLock();
    if (!main || !this.esgst.discussionPath) {
      discussion.outerWrap.remove();
    }
    return true;
  }

  async df_unhideDiscussion(discussion, main) {
    let deleteLock = await createLock(`discussionLock`, 300);
    let discussions = JSON.parse(getValue(`discussions`, `{}`));
    if (discussions[discussion.code]) {
      delete discussions[discussion.code].hidden;
      discussions[discussion.code].lastUsed = Date.now();
    }
    await setValue(`discussions`, JSON.stringify(discussions));
    deleteLock();
    if (!main || !this.esgst.discussionPath) {
      discussion.outerWrap.remove();
    }
    return true;
  }

  getFilters() {
    return {
      comments: {
        check: true,
        minValue: 0,
        name: `Comments`,
        type: `number`
      },
      announcements: {
        check: true,
        name: `Announcements`,
        type: `boolean`
      },
      bugsSuggestion: {
        check: true,
        name: `Bugs / Suggestion`,
        type: `boolean`
      },
      deals: {
        check: true,
        name: `Deals`,
        type: `boolean`
      },
      general: {
        check: true,
        name: `General`,
        type: `boolean`
      },
      groupRecruitment: {
        check: true,
        name: `Group Recruitment`,
        type: `boolean`
      },
      letsPlayTogether: {
        check: true,
        name: `Let's Play Together`,
        type: `boolean`
      },
      offTopic: {
        check: true,
        name: `Off-Topic`,
        type: `boolean`
      },
      puzzles: {
        check: true,
        name: `Puzzles`,
        type: `boolean`
      },
      uncategorized: {
        check: true,
        name: `Uncategorized`,
        type: `boolean`
      },
      created: {
        check: true,
        name: `Created`,
        type: `boolean`
      },
      poll: {
        check: true,
        name: `Poll`,
        type: `boolean`
      },
      highlighted: {
        check: gSettings.dh,
        name: `Highlighted`,
        type: `boolean`
      },
      visited: {
        check: gSettings.gdttt,
        name: `Visited`,
        type: `boolean`
      },
      unread: {
        check: gSettings.ct,
        name: `Unread`,
        type: `boolean`
      },
      authors: {
        check: true,
        list: true,
        name: `Authors`,
        type: `string`
      }
    };
  }
}

const discussionsDiscussionFilters = new DiscussionsDiscussionFilters();

export { discussionsDiscussionFilters };