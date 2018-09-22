import Module from '../../class/Module';
import Popup from '../../class/Popup';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  {
    formatDate
  } = utils,
  {
    createElements,
    getFeatureTooltip,
    getTimestamp
  } = common
;

class GiveawaysEntryTracker extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-ticket esgst-red"></i> My Entry History) to the dropdown menu accessible by clicking on the arrow next to your avatar at the header of any page that allows you to view your giveaway entry history (the detailed log, including the name, link and date of every giveaway you have entered/left) and some other details (the average number of giveaways that you enter per day, the date when you entered the least number of giveaways, the date when you entered the most number of giveaways and a table containing how many giveaways you have entered/left per day).</li>
        <li>An entry only appears in the history if you entered/left the giveaway after this feature was enabled.</li>
      </ul>
    `,
    id: `et`,
    load: this.et,
    name: `Entry Tracker`,
    sg: true,
    type: `giveaways`
  });

  et() {
    if (this.esgst.enteredPath) {
      this.esgst.endlessFeatures.push(this.et_getEntries);
    }
    if (!this.esgst.sg) return;
    createElements(this.esgst.sg ? this.esgst.mainButton.parentElement.getElementsByClassName(`nav__absolute-dropdown`)[0].lastElementChild : this.esgst.mainButton.parentElement.getElementsByClassName(`dropdown`)[0].firstElementChild.lastElementChild, `beforeBegin`, [{
      attributes: {
        class: `esgst-header-menu-row`,
        [`data-link-id`]: `et`,
        [`data-link-key`]: `account`,
        title: getFeatureTooltip(`et`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-fw fa-ticket red`
        },
        type: `i`
      }, {
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-header-menu-name`
          },
          text: `My Entry History`,
          type: `p`
        }, {
          attributes: {
            class: `esgst-header-menu-description`
          },
          text: `View your entry history.`,
          type: `p`
        }]
      }]
    }]).addEventListener(`click`, this.et_menu);
    if (this.esgst.giveawayPath && !document.getElementsByClassName(`table--summary`)[0] && this.esgst.enterGiveawayButton) {
      let code, name;
      code = location.pathname.match(/^\/giveaway\/(.+?)\//)[1];
      name = document.getElementsByClassName(`featured__heading__medium`)[0].textContent;
      this.esgst.enterGiveawayButton.addEventListener(`click`, this.et_setEntry.bind(null, code, true, name));
      this.esgst.leaveGiveawayButton.addEventListener(`click`, this.et_setEntry.bind(null, code, false, name));
    }
  }

  async et_menu() {
    let dates = {};
    let entries = JSON.parse(await getValue(`entries`, `[]`));
    const items = [];
    for (let i = entries.length - 1; i > -1; i--) {
      let entry = entries[i];
      items.push({
        type: `li`,
        children: [{
          text: `${entry.entry ? `Entered` : `Left`} `,
          type: `node`
        }, {
          attributes: {
            href: `/giveaway/${entry.code}/`
          },
          text: entry.name,
          type: `a`
        }, {
          text: `on ${getTimestamp(entry.timestamp, this.esgst.at_24, this.esgst.at_s)}`,
          type: `node`
        }]
      });
      let date = formatDate(`[MMM] [D], [YYYY]`, entry.timestamp);
      let key = new Date(date).getTime();
      if (!dates[key]) {
        dates[key] = {
          date: date,
          entered: 0,
          left: 0
        };
      }
      if (entry.entry) {
        dates[key].entered += 1;
      } else {
        dates[key].left += 1;
      }
    }
    const currentKeys = Object.keys(dates).map(x => parseInt(x));
    const lastDate = currentKeys[0];
    let currentDate = currentKeys[currentKeys.length - 1];
    while (currentDate < lastDate) {
      const dateObj = new Date(currentDate);
      dateObj.setDate(dateObj.getDate() + 1);
      currentDate = dateObj.getTime();
      if (!dates[currentDate]) {
        dates[currentDate] = {
          date: formatDate(`[MMM] [D], [YYYY]`, currentDate),
          entered: 0,
          left: 0
        };
      }
    }
    let popup = new Popup(`fa-history`, `Entry Tracker`, true);
    let rows = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left esgst-float-right table`,
        style: `width: auto;`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-small`
          },
          text: `Delete`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Date`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Entered`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Left`,
          type: `div`
        }]
      }, {
        attributes: {
          class: `table__rows`
        },
        type: `div`
      }]
    }]).lastElementChild;
    let keys = Object.keys(dates);
    keys.sort();
    let lowest = {
      count: 999999999,
      date: null
    };
    let highest = {
      count: 0,
      date: null
    };
    let total = 0;
    for (let i = keys.length - 1; i > -1; i--) {
      let key = keys[i];
      let button = createElements(rows, `beforeEnd`, [{
        attributes: {
          class: `table__row-outer-wrap`,
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small esgst-text-center`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `fa fa-times esgst-clickable`,
                title: `Delete`
              },
              type: `i`
            }]
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: dates[key].date,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: dates[key].entered,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: dates[key].left,
            type: `div`
          }]
        }]
      }]).firstElementChild.firstElementChild;
      button.firstElementChild.addEventListener(`click`, this.et_deleteEntry.bind(null, button, dates[key].date, popup));
      if (dates[key].entered < lowest.count) {
        lowest.count = dates[key].entered;
        lowest.date = dates[key].date;
      }
      if (dates[key].entered > highest.count) {
        highest.count = dates[key].entered;
        highest.date = dates[key].date;
      }
      total += dates[key].entered;
    }
    let average = Math.round(total / keys.length * 100) / 100;
    createElements(popup.description, `afterBegin`, [{
      type: `div`,
      children: [{
        text: `You enter on average `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: average,
        type: `span`
      }, {
        text: ` giveaways per day.`,
        type: `node`
      }]
    }, {
      type: `div`,
      children: [{
        text: `Your highest entry count was on `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-italic`
        },
        text: highest.date,
        type: `span`
      }, {
        text: ` with `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: highest.count,
        type: `span`
      }, {
        text: ` entries.`,
        type: `node`
      }]
    }, {
      type: `div`,
      children: [{
        text: `Your lowest entry count was on `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-italic`
        },
        text: lowest.date,
        type: `span`
      }, {
        text: ` with `,
        type: `node`
      }, {
        attributes: {
          class: `esgst-bold`
        },
        text: lowest.count,
        type: `span`
      }, {
        text: ` entries.`,
        type: `node`
      }]
    }]);
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left esgst-float-left markdown`,
        style: `border-right: 1px solid #ccc;`
      },
      type: `div`,
      children: [{
        type: `ul`,
        children: items
      }]
    }, {
      attributes: {
        class: `esgst-clear`
      },
      type: `div`
    }]);
    popup.open();
  }

  async et_deleteEntry(button, date, popup) {
    if (! confirm(`Are you sure you want to delete entries for ${date}? Your entire history for that day will be deleted.`)) return;
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let entries = JSON.parse(await getValue(`entries`, `[]`));
    for (let i = entries.length - 1; i > -1; i--) {
      let entry = entries[i];
      if (date !== formatDate(`[MMM] [D], [YYYY]`, entry.timestamp)) continue;
      entries.splice(i, 1);
    }
    await setValue(`entries`, JSON.stringify(entries));
    popup.close();
    this.et_menu();
  }

  et_getEntries(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__remove-default:not(.is-hidden), .esgst-es-page-${endless}.table__remove-default:not(.is-hidden)` : `.table__remove-default:not(.is-hidden)`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      this.et_setObserver(elements[i]);
    }
  }

  et_setObserver(element) {
    let code, container, heading, name;
    container = element.closest(`.table__row-inner-wrap`);
    heading = container.getElementsByClassName(`table__column__heading`)[0];
    code = heading.getAttribute(`href`).match(/\/giveaway\/(.+?)\//)[1];
    name = heading.firstChild.textContent.trim().match(/(.+?)(\s\(.+\sCopies\))?$/)[1];
    element.addEventListener(`click`, this.et_setEntry.bind(null, code, false, name));
  }

  async et_setEntry(code, entry, name) {
    let entries = JSON.parse(await getValue(`entries`, `[]`));
    entries.push({
      code: code,
      entry: entry,
      name: name,
      timestamp: Date.now()
    });
    setValue(`entries`, JSON.stringify(entries));
  }
}

export default GiveawaysEntryTracker;