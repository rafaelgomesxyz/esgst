import { Button } from '../../class/Button';
import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { common } from '../Common';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { shared, Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const
  createElements = common.createElements.bind(common),
  createLock = common.createLock.bind(common),
  endless_load = common.endless_load.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getValue = common.getValue.bind(common),
  lockAndSaveGiveaways = common.lockAndSaveGiveaways.bind(common),
  request = common.request.bind(common),
  setValue = common.setValue.bind(common)
  ;

class GiveawaysGiveawayBookmarks extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: 'fa fa-bookmark' }],
            ' if the giveaway is bookmarked and ',
            ['i', { class: 'fa fa-bookmark-o' }],
            ` if it is not) next to a giveaway's game name (in any page) that allows you to bookmark the giveaway so that you can enter it later.`
          ]],
          ['li', [
            `Adds a button (`,
            ['i', { class: 'fa fa-bookmark' }],
            `) next to the ESGST button at the header of any page that allows you to view all of the giveaways that have been bookmarked.`
          ]]
        ]]
      ],
      features: {
        gb_u: {
          name: 'Automatically unbookmark ended giveaways.',
          sg: true
        },
        gb_ue: {
          name: 'Automatically unbookmark entered giveaways.',
          sg: true
        },
        gb_ui: {
          name: 'Automatically unbookmark inaccessible giveaways.',
          sg: true
        },
        gb_h: {
          description: [
            ['ul', [
              ['li', `When giveaways that hadn't started start, the button will turn green, indicating that you must open the list of bookmarked giveaways so that the started giveaways can be updated with their end times.`],
              ['li', `When giveaways are about to end (based on the number of hours specified below), the button will turn red.`],
              ['li', `If there are both started and ending giveaways, the button will be colored with a brown-ish color, as a mixture of the green and red colors.`],
              ['li', `If you hover over the button, it shows more details about how many giveaways have started and/or are ending.`]
            ]]
          ],
          inputItems: [
            {
              id: 'gb_hours',
              prefix: `Time range to trigger highlight: `,
              suffix: ' hours'
            }
          ],
          name: 'Highlight the header button when giveaways have started and/or are about to end.',
          sg: true
        },
        gb_t: {
          name: 'Open the list of bookmarked giveaways in a new tab.',
          sg: true
        },
        gb_se: {
          name: 'Show the button for entered giveaways.',
          sg: true
        }
      },
      id: 'gb',
      name: 'Giveaway Bookmarks',
      sg: true,
      type: 'giveaways',
      featureMap: {
        giveaway: this.gb_getGiveaways.bind(this)
      }
    };
  }

  init() {
    let button = Shared.header.addButtonContainer({
      buttonIcon: 'fa fa-bookmark',
      buttonName: 'ESGST Bookmarked Giveaways',
      isNotification: true,
      side: 'left',
    });

    button.nodes.outer.classList.add('esgst-hidden');
    button.nodes.buttonIcon.title = getFeatureTooltip('gb', 'View your bookmarked giveaways');

    // noinspection JSIgnoredPromiseFromCall
    this.gb_addButton(button);

    if (Settings.gb_ue && this.esgst.enterGiveawayButton) {
      this.esgst.enterGiveawayButton.onclick = () => {
        let giveaway = this.esgst.scopes.main.giveaways[0];
        if (giveaway && giveaway.gbButton) {
          if (giveaway.gbButton.index === 3) {
            // noinspection JSIgnoredPromiseFromCall
            giveaway.gbButton.change(giveaway.gbButton.callbacks[2]);
          }
          if (!Settings.gb_se) {
            giveaway.gbButton.button.classList.add('esgst-hidden');
          }
        }
      };
    }
    if (this.esgst.leaveGiveawayButton) {
      this.esgst.leaveGiveawayButton.onclick = () => {
        let giveaway = this.esgst.scopes.main.giveaways[0];
        if (giveaway && giveaway.gbButton) {
          giveaway.gbButton.button.classList.remove('esgst-hidden');
        }
      };
    }
  }

  gb_addButton(button) {
    let i, n;
    let bookmarked = [], endingSoon = 1, started = 0, ending = 0;
    if (Settings.gb_h && button) {
      button.nodes.outer.classList.add('esgst-gb-highlighted');
    }
    const toSave = {};
    for (let key in this.esgst.giveaways) {
      if (this.esgst.giveaways.hasOwnProperty(key)) {
        const giveaway = this.esgst.giveaways[key];
        if (giveaway.bookmarked) {
          if (typeof giveaway.started === 'undefined') {
            giveaway.started = true;
            toSave[key] = { started: true };
          }
          if (Date.now() >= giveaway.endTime || !giveaway.endTime) {
            if (giveaway.started) {
              if (Settings.gb_u) {
                delete giveaway.bookmarked;
                toSave[key] = { bookmarked: null };
              } else {
                bookmarked.push(giveaway);
              }
            } else {
              bookmarked.push(giveaway);
              ++started;
              if (Settings.gb_h && button) {
                button.nodes.outer.classList.add('started');
              }
            }
          } else {
            bookmarked.push(giveaway);
            if (giveaway.started) {
              endingSoon = giveaway.endTime - Date.now() - (Settings.gb_hours * 3600000);
              if (endingSoon <= 0) {
                ++ending;
              }
            }
          }
        }
      }
    }
    common.lock_and_save_giveaways(toSave);
    let title;
    if (started || ending) {
      if (started) {
        if (ending) {
          title = `(${started} started - click to update them, ${ending} ending)`;
        } else {
          title = `(${started} started - click to update them)`;
        }
      } else {
        title = `(${ending} ending)`;
      }
    } else {
      title = '';
    }
    if (button) {
      button.nodes.buttonIcon.title = getFeatureTooltip('gb', `View your bookmarked giveaways ${title}`);
    }
    if (bookmarked.length) {
      bookmarked.sort((a, b) => {
        if (a.endTime > b.endTime) {
          return 1;
        } else if (a.endTime < b.endTime) {
          return -1;
        } else {
          return 0;
        }
      });
      for (i = 0, n = bookmarked.length; i < n; ++i) {
        if (Date.now() > bookmarked[i].endTime) {
          bookmarked.push(bookmarked.splice(i, 1)[0]);
          i -= 1;
          n -= 1;
        }
      }
      if (button) {
        button.nodes.outer.classList.remove('esgst-hidden');
        if (Settings.gb_h && ending > 0) {
          button.nodes.outer.classList.add('ending');
        }
      }
    }
    if (shared.common.isCurrentPath('Account') && this.esgst.parameters.esgst === 'gb') {
      const context = this.esgst.sidebar.nextElementSibling;
      if (Settings.removeSidebarInFeaturePages) {
        this.esgst.sidebar.remove();
      }
      context.innerHTML = '';
      context.setAttribute('data-esgst-popup', 'true');
      new elementBuilder[shared.esgst.name].pageHeading({
        context: context,
        position: 'beforeEnd',
        breadcrumbs: [
          {
            name: 'ESGST',
            url: this.esgst.settingsUrl
          },
          {
            name: 'Bookmarked Giveaways',
            url: `https://www.steamgifts.com/account/settings/profile?esgst=gb`
          }
        ]
      });
      this.gb_loadGibs(bookmarked, context, createElements(context, 'beforeEnd', [{
        type: 'div'
      }]));
    }
    if (button) {
      button.nodes.outer.addEventListener('click', () => {
        if (Settings.gb_t) {
          window.open(`https://www.steamgifts.com/account/settings/profile?esgst=gb`);
        } else {
          const popup = new Popup({
            addScrollable: 'left',
            isTemp: true
          });
          new elementBuilder[shared.esgst.name].pageHeading({
            context: popup.description,
            position: 'afterBegin',
            breadcrumbs: [
              {
                name: 'ESGST',
                url: this.esgst.settingsUrl
              },
              {
                name: 'Bookmarked Giveaways',
                url: `https://www.steamgifts.com/account/settings/profile?esgst=gb`
              }
            ]
          });
          this.gb_loadGibs(bookmarked, popup.description, popup.scrollable, popup);
        }
      });
    }
  }

  gb_loadGibs(bookmarked, container, context, popup) {
    let info;
    let i = 0;
    let n = bookmarked.length;
    let gbGiveaways = createElements(context, 'beforeEnd', [{
      attributes: {
        class: 'esgst-text-left'
      },
      type: 'div'
    }]);
    let set = new ButtonSet({
      color1: 'green',
      color2: 'grey',
      icon1: 'fa-plus',
      icon2: 'fa-circle-o-notch fa-spin',
      title1: 'Load more...',
      title2: 'Loading more...',
      callback1: () => {
        return new Promise(resolve => {
          // noinspection JSIgnoredPromiseFromCall
          this.gb_loadGiveaways(i, i + 5, bookmarked, gbGiveaways, info, popup, value => {
            i = value;
            if (i > n) {
              set.set.remove();
            } else if (Settings.es_gb && context.scrollHeight <= context.offsetHeight) {
              set.trigger();
            }
            resolve();
          });
        });
      }
    });
    container.appendChild(new ButtonSet({
      color1: 'grey',
      color2: '',
      icon1: 'fa-list',
      icon2: '',
      title1: 'View Raw List',
      title2: '',
      callback1: this.gb_openList.bind(this, { bookmarked })
    }).set);
    container.appendChild(set.set);
    if (popup) {
      popup.open();
    }
    info = createElements(context, 'beforeBegin', [{
      type: 'div',
      children: [{
        text: '0',
        type: 'span'
      }, {
        text: 'P required to enter all ',
        type: 'node'
      }, {
        text: '0',
        type: 'span'
      }, {
        text: ' giveaways.',
        type: 'node'
      }]
    }]);
    if (Settings.gas || (Settings.gf && Settings.gf_m) || Settings.mm) {
      let heading = createElements(context, 'beforeBegin', [{
        attributes: {
          class: 'page__heading'
        },
        type: 'div'
      }]);
      if (Settings.gas) {
        this.esgst.modules.giveawaysGiveawaysSorter.init(heading);
      }
      if (Settings.gf && Settings.gf_m) {
        heading.appendChild(this.esgst.modules.giveawaysGiveawayFilters.filters_addContainer(heading, 'Gb'));
      }
      if (Settings.mm) {
        this.esgst.modules.generalMultiManager.mm(heading);
      }
    }
    set.trigger();
    if (Settings.es_gb) {
      context.addEventListener('scroll', () => {
        if ((context.scrollTop + context.offsetHeight) >= context.scrollHeight && !set.busy) {
          set.trigger();
        }
      });
    }
  }

  gb_openList(gb) {
    if (gb.popup) {
      gb.popup.open();
      return;
    }
    gb.popup = new Popup({ addScrollable: true, icon: 'fa-list', title: `Bookmarked Giveaways (Raw List)` });
    for (const giveaway of gb.bookmarked) {
      const attributes = {
        class: 'table__column__secondary-link',
        href: `/giveaway/${giveaway.code}/`
      };
      if (giveaway.name) {
        attributes['data-esgst'] = true;
      }
      createElements(gb.popup.scrollable, 'beforeEnd', [{
        type: 'div',
        children: [{
          attributes,
          text: giveaway.name || giveaway.code,
          type: 'a'
        }]
      }]);
    }
    gb.popup.open();
    // noinspection JSIgnoredPromiseFromCall
    this.gb_loadNames(gb);
  }

  async gb_loadNames(gb) {
    let giveaways = {};
    for (let i = 0, n = gb.popup.scrollable.children.length; i < n; i++) {
      let element = gb.popup.scrollable.children[i].firstElementChild;
      if (!element.getAttribute('data-esgst')) {
        let code = element.textContent;
        element.textContent = DOM.parse((await request({
          method: 'GET',
          queue: true,
          url: element.getAttribute('href')
        })).responseText).getElementsByClassName('featured__heading__medium')[0].textContent;
        giveaways[code] = {
          name: element.textContent
        };
      }
    }
    lockAndSaveGiveaways(giveaways);
  }

  async gb_loadGiveaways(i, n, bookmarked, gbGiveaways, info, popup, callback) {
    if (i < n) {
      if (bookmarked[i]) {
        let response = await request({ method: 'GET', queue: true, url: `/giveaway/${bookmarked[i].code}/` });
        let endTime;
        let responseHtml = DOM.parse(response.responseText);
        let container = responseHtml.getElementsByClassName('featured__outer-wrap--giveaway')[0];
        if (container) {
          let heading = responseHtml.getElementsByClassName('featured__heading')[0];
          let columns = heading.nextElementSibling;
          let remaining = columns.firstElementChild;
          endTime = 0;
          if (!bookmarked[i].started && !remaining.textContent.match(/Begins/)) {
            endTime = parseInt(remaining.lastElementChild.getAttribute('data-timestamp')) * 1e3;
          }
          let url = response.finalUrl;
          let gameId = container.getAttribute('data-game-id');
          let anchors = heading.getElementsByTagName('a');
          let j, numA, numT;
          for (j = 0, numA = anchors.length; j < numA; ++j) {
            anchors[j].classList.add('giveaway__icon');
          }
          let headingName = heading.firstElementChild;
          createElements(headingName, 'outer', [{
            attributes: {
              class: 'giveaway__heading__name',
              href: url
            },
            type: 'a',
            children: [...(Array.from(headingName.childNodes).map(x => {
              return {
                context: x
              };
            }))]
          }]);
          let thinHeadings = heading.getElementsByClassName('featured__heading__small');
          numT = thinHeadings.length;
          info.firstElementChild.textContent = parseInt(info.firstElementChild.textContent) + parseInt(thinHeadings[numT - 1].textContent.match(/\d+/)[0]);
          info.lastElementChild.textContent = parseInt(info.lastElementChild.textContent) + 1;
          for (j = 0; j < numT; ++j) {
            createElements(thinHeadings[0], 'outer', [{
              attributes: {
                class: 'giveaway__heading__thin'
              },
              type: 'span',
              children: [...(Array.from(thinHeadings[0].childNodes).map(x => {
                return {
                  context: x
                };
              }))]
            }]);
          }
          remaining.classList.remove('featured__column');
          let created = remaining.nextElementSibling;
          created.classList.remove('featured__column', 'featured__column--width-fill');
          created.classList.add('giveaway__column--width-fill');
          created.lastElementChild.classList.add('giveaway__username');
          let avatar = columns.lastElementChild;
          avatar.remove();
          let element = created.nextElementSibling;
          while (element) {
            element.classList.remove('featured__column');
            element.className = element.className.replace(/featured/g, 'giveaway');
            element = element.nextElementSibling;
          }
          let counts = responseHtml.getElementsByClassName('sidebar__navigation__item__count');
          let image = responseHtml.getElementsByClassName('global__image-outer-wrap--game-large')[0].firstElementChild.getAttribute('src');
          let entered = responseHtml.getElementsByClassName('sidebar__entry-delete')[0];
          if (entered) {
            entered = !entered.classList.contains('is-hidden');
          }
          const items = [];
          if (Date.now() > bookmarked[i].endTime && !gbGiveaways.getElementsByClassName('row-spacer')[0]) {
            items.push({
              attributes: {
                class: 'row-spacer'
              },
              type: 'div'
            });
          }
          const attributes = {
            class: 'giveaway__row-outer-wrap',
            ['data-game-id']: gameId
          };
          if (entered) {
            attributes['data-entered'] = true;
          }
          heading.className = 'giveaway__heading';
          columns.className = 'giveaway__columns';
          items.push({
            type: 'div',
            children: [{
              attributes,
              type: 'div',
              children: [{
                attributes: {
                  class: 'giveaway__row-inner-wrap'
                },
                type: 'div',
                children: [{
                  attributes: {
                    class: 'giveaway__summary'
                  },
                  type: 'div',
                  children: [{
                    context: heading
                  }, {
                    context: columns
                  }, {
                    attributes: {
                      class: 'giveaway__links'
                    },
                    type: 'div',
                    children: [{
                      attributes: {
                        href: `${url}/entries`
                      },
                      type: 'a',
                      children: [{
                        attributes: {
                          class: 'fa fa-tag'
                        },
                        type: 'i'
                      }, {
                        text: `${(counts[1] && counts[1].textContent) || 0} entries`,
                        type: 'span'
                      }]
                    }, {
                      attributes: {
                        href: `${url}/comments`
                      },
                      type: 'a',
                      children: [{
                        attributes: {
                          class: 'fa fa-comment'
                        },
                        type: 'i'
                      }, {
                        text: `${counts[0].textContent} comments`,
                        type: 'span'
                      }]
                    }]
                  }]
                }, {
                  context: avatar
                }, {
                  attributes: {
                    class: 'giveaway_image_thumbnail',
                    href: url,
                    style: `background-image: url(${image})`
                  },
                  type: 'a'
                }]
              }]
            }]
          });
          createElements(gbGiveaways, 'beforeEnd', items);
          await endless_load(gbGiveaways.lastElementChild, false, 'gb');
          if (endTime > 0) {
            let deleteLock = await createLock('giveawayLock', 300);
            let giveaways = JSON.parse(getValue('giveaways'));
            giveaways[bookmarked[i].code].started = true;
            giveaways[bookmarked[i].code].endTime = endTime;
            await setValue('giveaways', JSON.stringify(giveaways));
            deleteLock();
            window.setTimeout(() => this.gb_loadGiveaways(++i, n, bookmarked, gbGiveaways, info, popup, callback), 0);
          } else {
            window.setTimeout(() => this.gb_loadGiveaways(++i, n, bookmarked, gbGiveaways, info, popup, callback), 0);
          }
        } else {
          if (Settings.gb_ui) {
            let deleteLock = await createLock('giveawayLock', 300);
            let giveaways = JSON.parse(getValue('giveaways'));
            if (giveaways[bookmarked[i].code]) {
              delete giveaways[bookmarked[i].code].bookmarked;
            }
            await setValue('giveaways', JSON.stringify(giveaways));
            deleteLock();
          }
          window.setTimeout(() => this.gb_loadGiveaways(++i, n, bookmarked, gbGiveaways, info, popup, callback), 0);
        }
      } else {
        callback(i + 1);
      }
    } else {
      callback(i);
    }
  }

  gb_getGiveaways(giveaways, main) {
    giveaways.forEach(giveaway => {
      if (main && this.esgst.wonPath) return;
      if ((!main || !this.esgst.archivePath) && giveaway.creator !== Settings.username && giveaway.url && !giveaway.gbButton) {
        giveaway.gbButton = new Button(giveaway.headingName, 'beforeBegin', {
          callbacks: [this.gb_bookmarkGiveaway.bind(this, giveaway, main), null, this.gb_unbookmarkGiveaway.bind(this, giveaway, main), null],
          className: 'esgst-gb-button',
          icons: ['fa-bookmark-o esgst-clickable', 'fa-circle-o-notch fa-spin', 'fa-bookmark', 'fa-circle-o-notch fa-spin'],
          id: 'gb',
          index: this.esgst.giveaways[giveaway.code] && this.esgst.giveaways[giveaway.code].bookmarked ? 2 : 0,
          titles: ['Bookmark giveaway', 'Bookmarking giveaway...', 'Unbookmark giveaway', 'Unbookmarking giveaway...']
        });
        giveaway.gbButton.button.setAttribute('data-draggable-id', 'gb');
        if ((giveaway.entered || (this.esgst.enteredPath && main)) && !Settings.gb_se) {
          giveaway.gbButton.button.classList.add('esgst-hidden');
        }
      }
    });
  }

  async gb_bookmarkGiveaway(giveaway) {
    let deleteLock = await createLock('giveawayLock', 300);
    let giveaways = JSON.parse(getValue('giveaways', '{}'));
    if (!giveaways[giveaway.code]) {
      giveaways[giveaway.code] = {};
    }
    giveaways[giveaway.code].code = giveaway.code;
    giveaways[giveaway.code].endTime = giveaway.endTime;
    giveaways[giveaway.code].name = giveaway.name;
    giveaways[giveaway.code].started = giveaway.started;
    giveaways[giveaway.code].bookmarked = true;
    await setValue('giveaways', JSON.stringify(giveaways));
    deleteLock();
    return true;
  }

  async gb_unbookmarkGiveaway(giveaway) {
    let deleteLock = await createLock('giveawayLock', 300);
    let giveaways = JSON.parse(getValue('giveaways', '{}'));
    if (giveaways[giveaway.code]) {
      delete giveaways[giveaway.code].bookmarked;
    }
    await setValue('giveaways', JSON.stringify(giveaways));
    deleteLock();
    return true;
  }
}

const giveawaysGiveawayBookmarks = new GiveawaysGiveawayBookmarks();

export { giveawaysGiveawayBookmarks };