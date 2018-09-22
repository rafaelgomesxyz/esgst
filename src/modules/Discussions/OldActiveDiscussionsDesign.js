import Module from '../../class/Module';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  {
    parseHtml
  } = utils,
  {
    request,
    createElements,
    endless_load
  } = common
;

class DiscussionsOldActiveDiscussionsDesign extends Module {
  info = ({
    description: `
      <ul>
        <li>Brings back the SteamGifts' old active discussions design, while keeping the new "Deals" section.</li>
        <li>Only one section ("Discussions" or "Deals") can be shown at a time. There is a button (<i class="fa fa-retweet"></i>) in the page heading of the active discussions that allows you to switch sections.</li>
      </ul>
    `,
    features: {
      oadd_d: {
        description: `
          <ul>
            <li>With this option enabled, the deals are included in the "Discussions" section instead of being exclusive to the "Deals" section.</li>
          </ul>
        `,
        name: `Show deals in the "Discussions" section.`,
        sg: true
      }
    },
    id: `oadd`,
    load: this.oadd,
    name: `Old Active Discussions Design`,
    sg: true,
    type: `discussions`
  });

  async oadd() {
    if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions) return;
    await this.oadd_load();
  }

  async oadd_load(refresh, callback) {
    let deals, dealsRows, dealsSwitch, discussions, discussionsRows, discussionsSwitch, i, j, response1Html, response2Html, revisedElements;
    response1Html = parseHtml((await request({method: `GET`, url: `/discussions`})).responseText);
    response2Html = parseHtml((await request({method: `GET`, url: `/discussions/deals`})).responseText);
    this.esgst.activeDiscussions.classList.add(`esgst-oadd`);
    createElements(this.esgst.activeDiscussions, `inner`, [{
      type: `div`,
      children: [{
        attributes: {
          class: `page__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-heading-button`,
            title: `Switch to Deals`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-retweet`
            },
            type: `i`
          }]
        }, {
          attributes: {
            class: `page__heading__breadcrumbs`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `/discussions`
            },
            text: `Active Discussions`,
            type: `a`
          }]
        }, {
          attributes: {
            class: `page__heading__button page__heading__button--green`,
            href: `/discussions`
          },
          type: `a`,
          children: [{
            text: `More`,
            type: `node`
          }, {
            attributes: {
              class: `fa fa-angle-right`
            },
            type: `i`
          }]
        }]
      }, {
        attributes: {
          class: `table`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-fill`
            },
            text: `Summary`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Comments`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-medium text-right`
            },
            text: `Last Post`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }, {
      attributes: {
        class: `esgst-hidden`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `page__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-heading-button`,
            title: `Switch to Discussions`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-retweet`
            },
            type: `i`
          }]
        }, {
          attributes: {
            class: `page__heading__breadcrumbs`
          },
          type: `div`,
          children: [{
            attributes: {
              href: `/discussions/deals`
            },
            text: `Active Deals`,
            type: `a`
          }]
        }, {
          attributes: {
            class: `page__heading__button page__heading__button--green`,
            href: `/discussions/deals`
          },
          type: `a`,
          children: [{
            text: `More`,
            type: `node`
          }, {
            attributes: {
              class: `fa fa-angle-right`
            },
            type: `i`
          }]
        }]
      }, {
        attributes: {
          class: `table`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-fill`
            },
            text: `Summary`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small text-center`
            },
            text: `Comments`,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-medium text-right`
            },
            text: `Last Post`,
            type: `div`
          }]
        }, {
          attributes: {
            class: `table__rows`
          },
          type: `div`
        }]
      }]
    }]);
    discussions = this.esgst.activeDiscussions.firstElementChild;
    deals = discussions.nextElementSibling;
    discussionsSwitch = discussions.firstElementChild.firstElementChild;
    discussionsRows = discussions.lastElementChild.lastElementChild;
    dealsSwitch = deals.firstElementChild.firstElementChild;
    dealsRows = deals.lastElementChild.lastElementChild;
    let preset = null;
    if (this.esgst.df && this.esgst.df_m && this.esgst.df_enable) {
      let name = this.esgst.df_preset;
      if (name) {
        let i;
        for (i = this.esgst.df_presets.length - 1; i > -1 && this.esgst.df_presets[i].name !== name; i--) {}
        if (i > -1) {
          preset = this.esgst.df_presets[i];
        }
      }
    }
    let elements = await this.esgst.modules.discussions.discussions_get(response1Html, true);
    if (!this.esgst.oadd_d) {
      revisedElements = [];
      elements.forEach(element => {
        if (element.category !== `Deals`) {
          revisedElements.push(element);
        }
      });
      elements = revisedElements;
    }
    const filters = this.esgst.modules.discussionsDiscussionFilters.df_getFilters();
    for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
      if (!preset || this.esgst.modules.giveawaysGiveawayFilters.filters_filterItem(`df`, filters, elements[j], preset.rules)) {
        discussionsRows.appendChild(elements[j].outerWrap);
        i += 1;
      }
    }
    elements = await this.esgst.modules.discussions.discussions_get(response2Html, true);
    for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
      if (!preset || this.esgst.modules.giveawaysGiveawayFilters.filters_filterItem(`df`, filters, elements[j], preset.rules)) {
        dealsRows.appendChild(elements[j].outerWrap);
        i += 1;
      }
    }
    discussionsSwitch.addEventListener(`click`, () => {
      discussions.classList.add(`esgst-hidden`);
      deals.classList.remove(`esgst-hidden`);
    });
    dealsSwitch.addEventListener(`click`, () => {
      discussions.classList.remove(`esgst-hidden`);
      deals.classList.add(`esgst-hidden`);
    });
    if (this.esgst.adots) {
      this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load(refresh);
    } else if (this.esgst.radb) {
      this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
    }
    if (refresh) {
      await endless_load(this.esgst.activeDiscussions);
      if (callback) {
        callback();
      }
    } else if (callback) {
      callback();
    }
  }
}

export default DiscussionsOldActiveDiscussionsDesign;