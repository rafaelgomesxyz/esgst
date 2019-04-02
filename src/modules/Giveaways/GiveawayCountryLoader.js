import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { Popup } from '../../class/Popup';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common)
  ;

class GiveawaysGiveawayCountryLoader extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `If you click on/hover over (you can decide which one) the region restricted icon (`,
            [`i`, { class: `fa fa-globe` }],
            `) of a giveaway (in any page) it shows the countries that the giveaway is restricted to.`
          ]]
        ]]
      ],
      id: `gcl`,
      name: `Giveaway Country Loader`,
      options: {
        title: `Load as:`,
        values: [`Popout (On Hover)`, `Popout (On Click)`, `Popup (On Click)`]
      },
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    this.esgst.giveawayFeatures.push(this.gcl_setButton.bind(this));
  }

  gcl_setButton(giveaways, main) {
    if (main && (this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath)) return;
    giveaways.forEach(giveaway => {
      let container, context, delay, eventType, exitTimeout, onClick, timeout;
      if (giveaway.regionRestricted) {
        switch (this.esgst.gcl_index) {
          case 0:
            eventType = `mouseenter`;
            onClick = false;
            delay = 1000;
            giveaway.regionRestricted.addEventListener(`mouseleave`, event => {
              if (timeout) {
                window.clearTimeout(timeout);
                timeout = null;
              }
              exitTimeout = window.setTimeout(() => {
                if (context && !container.contains(event.relatedTarget)) {
                  context.close();
                }
              }, 1000);
            });
            giveaway.regionRestricted.addEventListener(`click`, () => {
              if (timeout) {
                window.clearTimeout(timeout);
                timeout = null;
              }
            });
            break;
          case 1:
            eventType = `click`;
            onClick = true;
            delay = 0;
            giveaway.regionRestricted.removeAttribute(`href`);
            giveaway.regionRestricted.classList.add(`esgst-clickable`);
            break;
          case 2:
            eventType = `click`;
            delay = 0;
            giveaway.regionRestricted.removeAttribute(`href`);
            giveaway.regionRestricted.classList.add(`esgst-clickable`);
            break;
        }
        giveaway.regionRestricted.addEventListener(eventType, () => {
          timeout = window.setTimeout(async () => {
            if (context) {
              switch (this.esgst.gcl_index) {
                case 0:
                  context.open(giveaway.regionRestricted);
                  break;
                case 1:
                  if (context.isOpen) {
                    context.close();
                  } else {
                    context.open(giveaway.regionRestricted);
                  }
                  break;
                case 2:
                  context.open();
                  break;
              }
            } else {
              if (this.esgst.gcl_index === 2) {
                context = new Popup({
                  addScrollable: true, icon: `fa-globe`, title: [
                    [`a`, { href: `${giveaway.url}/region-restrictions` }, `Giveaway Countries`]
                  ]
                });
                container = context.scrollable;
                context.open();
              } else {
                context = new Popout(`esgst-gcl-popout`, null, 1000, onClick);
                container = context.popout;
                context.open(giveaway.regionRestricted);
              }
              createElements(container, `inner`, [{
                attributes: {
                  class: `fa fa-circle-o-notch fa-spin`
                },
                type: `i`
              }, {
                text: `Loading countries...`,
                type: `span`
              }]);
              const countries = await this.gcl_getCountries(1, `${giveaway.url}/region-restrictions/search?page=`);
              if (countries) {
                createElements(container, `inner`, [{
                  attributes: {
                    placeholder: `Search country...`,
                    type: `text`
                  },
                  type: `input`
                }, {
                  attributes: {
                    class: `esgst-text-left table`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `table__rows`
                    },
                    type: `div`
                  }]
                }]);
                container.firstElementChild.addEventListener(`input`, () => {
                  let elements, i, value;
                  value = container.firstElementChild.value.toLowerCase();
                  elements = container.lastElementChild.firstElementChild.children;
                  if (value) {
                    for (i = elements.length - 1; i > -1; --i) {
                      const element = elements[i];
                      if (element.getElementsByClassName(`table__column__heading`)[0].textContent.toLowerCase().match(value)) {
                        element.classList.remove(`esgst-hidden`);
                      } else {
                        element.classList.add(`esgst-hidden`);
                      }
                    }
                  } else {
                    for (i = elements.length - 1; i > -1; --i) {
                      elements[i].classList.remove(`esgst-hidden`);
                    }
                  }
                  context.reposition();
                });
                for (const country of countries) {
                  container.lastElementChild.firstElementChild.appendChild(country);
                }
                await endless_load(container);
                if (this.esgst.gcl_index === 1) {
                  createElements(container, `afterBegin`, [{
                    attributes: {
                      class: `esgst-ggl-heading`,
                      href: `${giveaway.url}/region-restrictions`
                    },
                    text: `Giveaway Countries`,
                    type: `a`
                  }]);
                }
                context.reposition();
              } else {
                createElements(container, `inner`, [{
                  attributes: {
                    class: `fa fa-times-circle`
                  },
                  type: `i`
                }, {
                  text: `An error occurred.`,
                  type: `span`
                }]);
                if (this.esgst.gcl_index === 1) {
                  createElements(container, `afterBegin`, [{
                    attributes: {
                      class: `esgst-ggl-heading`,
                      href: `${giveaway.url}/region-restrictions`
                    },
                    text: `Giveaway Countries`,
                    type: `a`
                  }]);
                }
                context.reposition();
              }
            }
            if (this.esgst.gcl_index === 0) {
              container.onmouseenter = () => {
                if (exitTimeout) {
                  window.clearTimeout(exitTimeout);
                  exitTimeout = null;
                }
              };
            }
          }, delay);
        });
      }
    });
  }

  async gcl_getCountries(nextPage, url) {
    const countries = [];
    let pagination = null;
    do {
      const responseHtml = parseHtml((await request({
        method: `GET`,
        url: `${url}${nextPage}`
      })).responseText);
      if (responseHtml.getElementsByClassName(`table--summary`)[0]) {
        return;
      }
      countries.push(...responseHtml.getElementsByClassName(`table__row-outer-wrap`));
      pagination = responseHtml.getElementsByClassName(`pagination__navigation`)[0];
      nextPage += 1;
    } while (pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    return countries;
  }
}

const giveawaysGiveawayCountryLoader = new GiveawaysGiveawayCountryLoader();

export { giveawaysGiveawayCountryLoader };