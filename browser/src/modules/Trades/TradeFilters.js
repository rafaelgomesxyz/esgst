import { Button } from '../../class/Button';
import { Process } from '../../class/Process';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { Filters } from '../Filters';
import { gSettings } from '../../class/Globals';
import { shared } from '../../class/Shared';

const
  sortArray = utils.sortArray.bind(utils),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  createLock = common.createLock.bind(common),
  endless_load = common.endless_load.bind(common),
  getValue = common.getValue.bind(common),
  setValue = common.setValue.bind(common)
  ;

class TradesTradeFilters extends Filters {
  constructor() {
    super('tf');
    this.info = {
      description: [
        ['ul', [
          ['li', 'Allows you to filter trades.']
        ]]
      ],
      features: {
        tf_s: {
          description: [
            ['ul', [
              ['li', [
                `Adds a button (`,
                ['i', { class: 'fa fa-eye' }],
                ' if the trade is hidden and ',
                ['i', { class: 'fa fa-eye-slash' }],
                ` if it is not) next to a trade's title (in any page) that allows you to hide the trade.`
              ]],
              ['li', [
                `Adds a button (`,
                ['i', { class: 'fa fa-comments' }],
                ' ',
                ['i', { class: 'fa fa-eye-slash' }],
                `) to the page heading of this menu that allows you to view all of the trades that have been hidden.`
              ]],
            ]]
          ],
          name: 'Single Filters',
          st: true,
          features: {
            tf_s_s: {
              name: `Show switch to temporarily hide / unhide trades filtered by the filters in the main page heading, along with a counter.`,
              st: true
            }
          }
        },
        tf_m: {
          description: [
            ['ul', [
              ['li', 'Allows you to hide multiple trades in a page using many different filters.'],
              ['li', [
                `Adds a toggle switch with a button (`,
                ['i', { class: 'fa fa-sliders' }],
                `) to the main page heading of any `,
                ['a', { href: `https://www.steamtrades.com/trades` }, 'trades'],
                ' page. The switch allows you to turn the filters on/off and the button allows you to manage your presets.'
              ]],
              ['li', `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 2 categories:`],
              ['ul', [
                ['li', `Basic filters are related to a numeric value (such as the number of comments of a trade) and have a slider that you can use to set the range of the filter (any trades that do not apply to the range will be hidden).`],
                ['li', `Type filters are related to a boolean value (such as whether or not a trade was created by yourself) and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
                ['ul', [
                  ['li', [
                    `"Show all" (`,
                    ['i', { class: 'fa fa-check-square' }],
                    `) does not hide any trades that apply to the filter (this is the default state).`
                  ]],
                  ['li', [
                    `"Show only" (`,
                    ['i', { class: 'fa fa-square' }],
                    `) hides any trades that do not apply to the filter.`
                  ]],
                  ['li', [
                    `"Hide all" (`,
                    ['i', { class: 'fa fa-square-o' }],
                    `) hides any trades that apply to the filter.`
                  ]]
                ]]
              ]],
              ['li', `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:`],
              ['ul', [
                ['li', `Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.`],
                ['li', 'Exception rules are the ones that you can change by clicking on the icon '],
                ['i', { class: 'fa fa-gear' }],
                ` in the filter panel. They are exceptions to the basic rules. For example, if you set the basic rule of the "Created" filter to "hide all" and you add an exception rule for the "Comments" filter to the 0-50 range, none of your created trades that have 0-50 comments will be hidden, because they apply to the exception.`
              ]],
              ['li', [
                `Override rules are the ones that you can change by clicking on the icon (`,
                ['i', { class: 'fa fa-exclamation esgst-faded' }],
                ' if set to overridable and ',
                ['i', { class: 'fa fa-exclamation' }],
                ` if set to non-overridable) next to each filter. They are enforcements of the basic rules. Continuing the previous example, if you set the override rule of the "Created" filter to "non-overridable", then all of your created trades will be hidden, because even if they apply to the exception, the basic rule is being enforced by the override rule, so the exception cannot override it.`
              ]]
            ]]
          ],
          features: {
            tf_m_b: {
              name: 'Hide basic filters.',
              st: true
            },
            tf_m_a: {
              name: 'Hide advanced filters.',
              st: true
            },
            tf_comments: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades by number of comments.']
                ]]
              ],
              name: 'Comments',
              st: true
            },
            tf_created: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades created by yourself.']
                ]]
              ],
              name: 'Created',
              st: true
            },
            tf_visited: {
              dependencies: ['gdttt'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades that you have visited.']
                ]]
              ],
              name: 'Visited',
              st: true
            },
            tf_subscribed: {
              dependencies: ['tds'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades that you have subscribed.']
                ]]
              ],
              name: 'Subscribed',
              st: true
            },
            tf_unread: {
              dependencies: ['ct'],
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades that you have read.']
                ]]
              ],
              name: 'Unread',
              st: true
            },
            tf_authors: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades by author.']
                ]]
              ],
              name: 'Authors',
              st: true
            },
            tf_positiveReputation: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades by the positive reputation of the author.']
                ]]
              ],
              name: 'Positive Reputation',
              st: true
            },
            tf_negativeReputation: {
              description: [
                ['ul', [
                  ['li', 'Allows you to filter trades by the negative reputation of the author.']
                ]]
              ],
              name: 'Negative Reputation',
              st: true
            }
          },
          name: 'Multiple Filters',
          st: true
        }
      },
      id: 'tf',
      name: 'Trade Filters',
      st: true,
      type: 'trades'
    };
  }

  async init() {
    if (gSettings.tf_s) {
      if (gSettings.tf_s_s) {
        this.addSingleButton('fa-comments');
      }
      this.esgst.tradeFeatures.push(this.tf_addButtons.bind(this));
    }
    if (gSettings.tf_m && shared.esgst.tradesPath && !shared.esgst.editTradePath) {
      shared.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gf-container {
          top: ${shared.esgst.commentsTop - 5}px;
        }
      `);
      createHeadingButton({
        element: this.filters_addContainer(shared.esgst.mainPageHeading),
        id: 'tf'
      });
    }
  }

  tf_menu(obj, button) {
    obj.process = new Process({
      button,
      popup: {
        icon: 'fa-comments',
        title: 'Hidden Trades',
        addProgress: true,
        addScrollable: 'left'
      },
      urls: {
        id: 'tf',
        init: this.tf_initUrls.bind(this),
        request: {
          request: this.tf_requestUrl.bind(this)
        }
      }
    });
  }

  async tf_initUrls(obj) {
    obj.trades = obj.popup.getScrollable([
      ['div', { class: 'table esgst-text-left' }, [
        ['div', { class: 'header' }, [
          ['div', { class: 'column_flex' }, 'Summary'],
          ['div', { class: 'column_small text_center' }, 'Comments']
        ]],
        ['div', { class: 'table__rows' }]
      ]]
    ]).lastElementChild;
    const trades = JSON.parse(getValue('trades'));
    let hidden = [];
    for (const key in trades) {
      if (trades.hasOwnProperty(key)) {
        if (trades[key].hidden) {
          const trade = {
            code: key,
            hidden: parseInt(trades[key].hidden)
          };
          hidden.push(trade);
        }
      }
    }
    hidden = sortArray(hidden, true, 'hidden');
    obj.ids = [];
    for (const trade of hidden) {
      obj.ids.push(trade.code);
      obj.items.push(`/trade/${trade.code}/`);
    }
  }

  async tf_requestUrl(obj, details, response, responseHtml) {
    const breadcrumbs = responseHtml.getElementsByClassName('page_heading_breadcrumbs');
    const usernameLink = responseHtml.getElementsByClassName('author_name')[0];
    const avatar = responseHtml.getElementsByClassName('author_avatar')[0];
    avatar.classList.remove('author_avatar');
    avatar.classList.add('avatar');
    const reputation = responseHtml.getElementsByClassName('author_small')[0];
    reputation.classList.remove('author_small');
    reputation.classList.add('reputation');
    createElements(obj.trades, 'beforeEnd', [{
      type: 'div',
      children: [{
        attributes: {
          class: 'row_outer_wrap'
        },
        type: 'div',
        children: [{
          attributes: {
            class: 'row_inner_wrap'
          },
          type: 'div',
          children: [{
            type: 'div',
            children: [{
              context: avatar
            }]
          }, {
            attributes: {
              class: 'column_flex'
            },
            type: 'div',
            children: [{
              type: 'h3',
              children: [{
                attributes: {
                  href: `/trade/${obj.ids[obj.index]}/`
                },
                text: breadcrumbs[0].firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.textContent,
                type: 'a'
              }]
            }, {
              type: 'p',
              children: [{
                context: responseHtml.querySelector(`.comment_outer [data-timestamp]`)
              }, {
                text: ' by ',
                type: 'node'
              }, {
                attributes: {
                  class: 'underline',
                  href: usernameLink.getAttribute('href')
                },
                text: usernameLink.textContent,
                type: 'a'
              }, {
                text: ' ',
                type: 'node'
              }, {
                context: reputation
              }]
            }]
          }, {
            attributes: {
              class: 'column_small text_center'
            },
            type: 'div',
            children: [{
              attributes: {
                class: 'underline',
                href: `/trade/${obj.ids[obj.index]}/`
              },
              text: `${breadcrumbs[1].textContent.match(/(.+) Comments?/)[1]}`,
              type: 'a'
            }]
          }]
        }]
      }]
    }]);
    await endless_load(obj.trades);
    if (!shared.esgst.tradesPath) {
      if (gSettings.gdttt) {
        await shared.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.trades, true);
        await shared.esgst.modules.generalGiveawayDiscussionTicketTradeTracker.gdttt_checkVisited(obj.trades);
      } else if (gSettings.ct) {
        await shared.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.trades, true);
      }
      await shared.esgst.modules.discussions.discussions_load(obj.trades);
    }
  }

  tf_addButtons(trades, main) {
    for (const trade of trades) {
      if (!trade.heading.parentElement.getElementsByClassName('esgst-df-button')[0]) {
        new Button(trade.headingContainer.firstElementChild, 'beforeBegin', {
          callbacks: [this.tf_hideTrade.bind(this, trade, main), null, this.tf_unhideTrade.bind(this, trade, main), null],
          className: 'esgst-df-button',
          icons: ['fa-eye-slash esgst-clickable', 'fa-circle-o-notch fa-spin', 'fa-eye esgst-clickable', 'fa-circle-o-notch fa-spin'],
          id: 'tf_s',
          index: trade.saved && trade.saved.hidden ? 2 : 0,
          titles: ['Hide trade', 'Hiding trade...', 'Unhide trade', 'Unhiding trade...']
        });
      }
    }
  }

  async tf_hideTrade(trade, main) {
    let deleteLock = await createLock('tradeLock', 300);
    let trades = JSON.parse(getValue('trades', '{}'));
    if (!trades[trade.code]) {
      trades[trade.code] = {};
    }
    trades[trade.code].hidden = trades[trade.code].lastUsed = Date.now();
    await setValue('trades', JSON.stringify(trades));
    deleteLock();
    if (!main || !shared.esgst.tradePath) {
      trade.outerWrap.remove();
    }
    return true;
  }

  async tf_unhideTrade(trade, main) {
    let deleteLock = await createLock('tradeLock', 300);
    let trades = JSON.parse(getValue('trades', '{}'));
    if (trades[trade.code]) {
      delete trades[trade.code].hidden;
      trades[trade.code].lastUsed = Date.now();
    }
    await setValue('trades', JSON.stringify(trades));
    deleteLock();
    if (!main || !shared.esgst.tradePath) {
      trade.outerWrap.remove();
    }
    return true;
  }

  getFilters() {
    return {
      comments: {
        check: true,
        minValue: 0,
        name: 'Comments',
        type: 'number'
      },
      created: {
        check: true,
        name: 'Created',
        type: 'boolean'
      },
      visited: {
        check: gSettings.gdttt,
        name: 'Visited',
        type: 'boolean'
      },
      subscribed: {
        check: gSettings.tds,
        name: 'Subscribed',
        type: 'boolean'
      },
      unread: {
        check: gSettings.ct,
        name: 'Unread',
        type: 'boolean'
      },
      authors: {
        check: true,
        list: true,
        name: 'Authors',
        type: 'string'
      },
      positiveReputation: {
        check: true,
        minValue: 0,
        name: 'Positive Reputation',
        type: 'number'
      },
      negativeReputation: {
        check: true,
        minValue: 0,
        name: 'Negative Reputation',
        type: 'number'
      }
    };
  }
}

const tradesTradeFilters = new TradesTradeFilters();

export { tradesTradeFilters };