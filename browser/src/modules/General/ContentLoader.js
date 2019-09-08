import { FetchRequest } from '../../class/FetchRequest';
import { gSettings } from '../../class/Globals';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { Popup } from '../../class/Popup';
import { shared } from '../../class/Shared';
import { logger } from '../../class/Logger';

const ON_LOAD = 0;
const ON_HOVER_POPOUT = 1;
const ON_CLICK_POPOUT = 2;
const ON_CLICK_POPUP = 3;

class GeneralContentLoader extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Allows you to load many different content (such as giveaway groups) without leaving the page.`]
        ]]
      ],
      features: {
        cl_gc: {
          description: [
            ['ul', [
              ['li', [
                `Loads a giveaway's countries when clicking / hovering over (depending on preference) on its region restriction icon (`,
                ['i', { class: 'fa fa-globe' }],
                `).`
              ]]
            ]]
          ],
          name: 'Giveaway Countries',
          options: {
            title: `Load as:`,
            values: [`~Panel (On Page Load)`, `Popout (On Hover)`, `Popout (On Click)`, `Popup (On Click)`]
          },
          sg: true
        },
        cl_ge: {
          description: [
            ['ul', [
              ['li', [
                `Loads a giveaway's entries when clicking / hovering over (depending on preference) on its "Entries" link.`
              ]]
            ]]
          ],
          name: 'Giveaway Entries',
          options: {
            title: `Load as:`,
            values: [`~Panel (On Page Load)`, `Popout (On Hover)`, `Popout (On Click)`, `Popup (On Click)`]
          },
          sg: true
        },
        ggl: {
          description: [
            ['ul', [
              ['li', [
                `Loads a giveaway's groups when clicking / hovering over (depending on preference) on its group icon (`,
                ['i', { class: 'fa fa-user' }],
                `) or automatically when loading the page (extends to your `,
                ['a', { href: `https://www.steamgifts.com/giveaways/created` }, 'created'],
                ' / ',
                ['a', { href: `https://www.steamgifts.com/giveaways/entered` }, 'entered'],
                ' / ',
                ['a', { href: `https://www.steamgifts.com/giveaways/won` }, 'won'],
                ` pages if [id=cewgd] is enabled).`
              ]],
              ['li', `Has [id=gh] built-in.`]
            ]]
          ],
          features: {
            ggl_m: {
              name: 'Only show groups that you are a member of.',
              sg: true
            }
          },
          name: 'Giveaway Groups',
          options: {
            title: `Load as:`,
            values: [`Panel (On Page Load)`, `Popout (On Hover)`, `Popout (On Click)`, `Popup (On Click)`]
          },
          sg: true,
          sync: 'Steam Groups',
          syncKeys: ['Groups']
        },
        cl_gi: {      
          description: [
            ['ul', [
              ['li', `Loads a group's info when clicking / hovering over (depending on preference) its avatar.`]
            ]]
          ],
          name: 'Group Info',
          options: {
            title: `Load as:`,
            values: [`~Panel (On Page Load)`, `Popout (On Hover)`, `Popout (On Click)`, `~Popup (On Click)`]
          },
          sg: true
        },
        cl_ui: {      
          description: [
            ['ul', [
              ['li', `Loads a user's info when clicking / hovering over (depending on preference) its avatar.`]
            ]]
          ],
          name: 'User Info',
          options: {
            title: `Load as:`,
            values: [`~Panel (On Page Load)`, `Popout (On Hover)`, `Popout (On Click)`, `~Popup (On Click)`]
          },
          sg: true
        }
      },
      id: 'cl',
      name: 'Content Loader',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    if (gSettings.cl_gc) {
      shared.esgst.giveawayFeatures.push(this.setTriggers.bind(this, 'cl_gc'));
    }
    if (gSettings.cl_ge) {
      shared.esgst.giveawayFeatures.push(this.setTriggers.bind(this, 'cl_ge'));
    }
    if (gSettings.ggl) {
      shared.esgst.giveawayFeatures.push(this.setTriggers.bind(this, 'ggl'));
    }
    if (gSettings.cl_gi) {
      shared.esgst.endlessFeatures.push(this.setTriggers.bind(this, 'cl_gi'));
    }
    if (gSettings.cl_ui) {
      shared.esgst.endlessFeatures.push(this.setTriggers.bind(this, 'cl_ui'));
      shared.esgst.userFeatures.push(this.setTriggers.bind(this, 'cl_ui'));
    }
  }

  setTriggers(id, items, main, source, endless) {
    let targetObjs;

    switch (id) {
      case 'cl_gc':
        targetObjs = items.filter(x => x.regionRestricted);
        if (!main || (!shared.esgst.createdPath && !shared.esgst.enteredPath && !shared.esgst.wonPath)) {
          for (const targetObj of targetObjs) {
            this.setTrigger(main, id, targetObj, targetObj.regionRestricted);
          }
        }
        break;
      case 'cl_ge':
        targetObjs = items.filter(x => x.entriesLink);
        if (!main || (!shared.esgst.createdPath && !shared.esgst.enteredPath && !shared.esgst.wonPath)) {
          for (const targetObj of targetObjs) {
            this.setTrigger(main, id, targetObj, targetObj.entriesLink);
          }
        }
        break;
      case 'ggl':
        targetObjs = items.filter(x => x.group);
        if (gSettings[`${id}_index`] === ON_LOAD) {
          this.load(main, id, targetObjs);
        } else if (!main || (!shared.esgst.createdPath && !shared.esgst.enteredPath && !shared.esgst.wonPath)) {
          for (const targetObj of targetObjs) {
            this.setTrigger(main, id, targetObj, targetObj.group);
          }
        }
        break;
      case 'cl_gi':
      case 'cl_ui':
        if (Array.isArray(items)) {
          targetObjs = items.filter(x => x.oldElement && !x.oldElement.classList.contains('esgst-ap-avatar'));
          for (const targetObj of targetObjs) {
            this.setTrigger(main, id, {}, targetObj.oldElement);
          }
        } else {
          const selectors = shared.common.getSelectors(endless, [
            'X.global__image-outer-wrap--avatar-small',
            'X.giveaway_image_avatar',
            'X.table_image_avatar',
            'X.featured_giveaway_image_avatar',
            'X.nav__avatar-outer-wrap'
          ]);
          targetObjs = items.querySelectorAll(selectors);
          for (const targetObj of targetObjs) {
            if (!targetObj.classList.contains('esgst-ap-avatar')) {
              this.setTrigger(main, id, {}, targetObj);
            }
          }
        }
    }
  }

  setTrigger(main, id, targetObj, target) {
    let context;
    let delay;
    let enterTimeout;
    let eventType;
    let exitTimeout;
    let onClick;
    let triggerObj;

    if (id === 'cl_gi' || id === 'cl_ui') {
      const url = target.getAttribute('href');
      if (!url) {
        return;
      }

      targetObj.url = url.match(/\/profiles\//) ? `/user/${target.textContent}` : url;

      const match = targetObj.url.match(/\/(user|group)\/(.+?)(\/.*)?$/);
      if (!match || (match[1] === 'user' && id !== 'cl_ui') || (match[1] === 'group' && id != 'cl_gi')) {
        return;
      }

      targetObj.type = match[1];
      targetObj.id = match[2];
      target.classList.add('esgst-ap-avatar');
    }

    switch (gSettings[`${id}_index`]) {
      case ON_HOVER_POPOUT:
        delay = 1000;
        eventType = 'mouseenter';
        onClick = false;

        target.addEventListener('mouseleave', event => {
          if (enterTimeout) {
            window.clearTimeout(enterTimeout);
            enterTimeout = null;
          }

          exitTimeout = window.setTimeout(() => {
            if (triggerObj && !context.contains(event.relatedTarget)) {
              triggerObj.close();
            }
          }, delay);
        });

        target.addEventListener('click', () => {
          if (enterTimeout) {
            window.clearTimeout(enterTimeout);
            enterTimeout = null;
          }
        });
        break;
      case ON_CLICK_POPOUT:
      case ON_CLICK_POPUP:
        delay = 0;
        eventType = 'click';
        onClick = true;

        if (target.getAttribute('href')) {
          target.dataset.href = target.getAttribute('href');
          target.removeAttribute('href');
        }
        target.classList.add('esgst-clickable');
        break;
    }

    target.addEventListener(eventType, event => {
      event.preventDefault();
      enterTimeout = window.setTimeout(async () => {
        if (id === 'cl_gi' || id === 'cl_ui') {
          triggerObj = shared.esgst.apPopouts[targetObj.id];
          if (triggerObj) {
            context = triggerObj.popout;
          }
        }
        if (triggerObj) {
          switch (gSettings[`${id}_index`]) {
            case ON_HOVER_POPOUT:
                triggerObj.open(target);
              break;
            case ON_CLICK_POPOUT:
              if (triggerObj.isOpen) {
                triggerObj.close();
              } else {
                triggerObj.open(target);
              }
              break;
            case ON_CLICK_POPUP:
              triggerObj.open();
              break;
          }
        } else {
          let addSearchBox = false;
          let icon;
          let name;
          let url;

          switch (id) {
            case 'cl_gc':
              addSearchBox = true;
              icon = 'globe';
              name = 'Giveaway Countries';
              url = `${targetObj.url}/region-restrictions`;
              break;
            case 'cl_ge':
              addSearchBox = true;
              icon = 'tag';
              name = 'Giveaway Entries';
              url = `${targetObj.url}/entries`;
              break;
            case 'ggl':
              addSearchBox = true;
              icon = 'user';
              name = 'Giveaway Groups';
              url = `${targetObj.url}/groups`;
              break;
          }

          if (id === 'cl_gi' || id === 'cl_ui') {
            shared.esgst.apPopouts[targetObj.id] = triggerObj = new Popout('esgst-ap-popout', undefined, undefined, onClick);
            context = triggerObj.popout;

            triggerObj.open(target); 
          } else if (gSettings[`${id}_index`] === ON_CLICK_POPUP) {
            triggerObj = new Popup({
              addScrollable: true,
              icon: `fa-${icon}`,
              title: [
                ['a', { href: url }, name]
              ]
            });
            context = triggerObj.scrollable;

            triggerObj.open();
          } else {
            triggerObj = new Popout(`esgst-${id}-popout`, undefined, undefined, onClick);
            context = triggerObj.popout;

            shared.common.createElements_v2(context, 'beforeEnd', [
              ['div', [
                ['a', { class: `esgst-${id}-heading`, href: url }, name]
              ]]
            ]);

            triggerObj.open(target);
          }

          shared.common.createElements_v2(context, 'beforeEnd', [
            addSearchBox
              ? ['input', { placeholder: 'Search...', type: 'text', ref: ref=> triggerObj.custom.searchBox = ref }]
              : null,
            ['div']
          ]);
          if (triggerObj.custom.searchBox) {
            triggerObj.custom.searchBox.addEventListener('input', () => {
              const value = triggerObj.custom.searchBox.value.toLowerCase();
              const elements = triggerObj.custom.rows.children;
              if (value) {
                triggerObj.custom.isSearching = true;

                for (const element of elements) {
                  if (element.textContent.toLowerCase().match(value)) {
                    element.classList.remove('esgst-hidden');
                  } else {
                    element.classList.add('esgst-hidden');
                  }
                }
              } else {
                for (const element of elements) {
                  element.classList.remove('esgst-hidden');
                }

                triggerObj.custom.isSearching = false;
              }
              triggerObj.reposition();
            });
          }

          shared.common.createElements_v2(context.lastElementChild, 'inner', [
            ['i', { class: 'fa fa-circle-o-notch fa-spin' }],
            ' Loading content...'
          ]);

          triggerObj.reposition();

          this.load(main, id, [targetObj], triggerObj, context);
        }

        if (gSettings[`${id}_index`] === ON_HOVER_POPOUT) {
          context.onmouseenter = () => {
            if (exitTimeout) {
              window.clearTimeout(exitTimeout);
              exitTimeout = null;
            }
          };
        }
      }, delay);
    });
  }

  load(main, id, targetObjs, triggerObj, context) {
    switch (id) {
      case 'cl_gc':
        this.loadGiveawayCountries(main, id, targetObjs, triggerObj, context);
        break;
      case 'cl_ge':
        this.loadGiveawayEntries(main, id, targetObjs, triggerObj, context);
        break;
      case 'ggl':
        this.loadGiveawayGroups(main, id, targetObjs, triggerObj, context);
        break;
      case 'cl_gi':
      case 'cl_ui':
        this.loadInfo(main, id, targetObjs, triggerObj, context);
        break;
    }
  }

  async loadGiveawayCountries(main, id, giveaways, triggerObj, context) {
    for (const giveaway of giveaways) {
      try {
        await this.fetchGiveawayCountries(giveaway, triggerObj, context);
      } catch (e) {
        logger.warning(e.stack);
      }
    }
  }

  async fetchGiveawayCountries(giveaway, triggerObj, context) {
    let countries = [];

    const url = `${giveaway.url}/region-restrictions/search?page=`;
    let nextPage = 1;
    let pagination;

    do {
      const response = await FetchRequest.get(`${url}${nextPage}`);

      const error = response.html.querySelector('.table--summary');
      if (error) {
        countries = null;
        break;
      }

      const elements = response.html.querySelectorAll('.table__row-inner-wrap');
      for (const element of elements) {
        const hasFlag = !!element.querySelector('.table_image_flag');
        const heading = element.querySelector('.table__column__heading');
        const name = heading.textContent;
        const code = name.match(/\s\((.+?)\)$/)[1].toLowerCase();

        countries.push({ code, hasFlag, name });
      }

      nextPage += 1;
      pagination = response.html.querySelector('.pagination__navigation');
    } while (pagination && !pagination.lastElementChild.classList.contains('is-selected'));

    if (countries) {
      let table;

      shared.common.createElements_v2(context.lastElementChild, 'inner', [
        ['div', { class: 'esgst-text-left table esgst-hidden', ref: ref => table = ref }, [
          ['div', { class: 'table__rows', ref: ref => triggerObj.custom.rows = ref }]
        ]]
      ]);

      let numCountries = countries.length;

      for (const country of countries) {
        shared.common.createElements_v2(triggerObj.custom.rows, 'beforeEnd', [
          ['div', { class: 'table__row-outer-wrap' }, [
            ['div', { class: 'table__row-inner-wrap' }, [
              ['div', [
                country.hasFlag
                  ? ['div', { class: 'table_image_flag', style: `background-image:url(https://cdn.steamgifts.com/img/flags/${country.code}.png)` }]
                  : ['div', { class: 'table_image_flag_missing' }]
              ]],
              ['div', { class: 'table__column--width-fill' }, [
                ['p', { class: 'table__column__heading' }, country.name]
              ]]
            ]]
          ]]
        ]);
      }

      if (numCountries === 0) {
        shared.common.createElements_v2(context.lastElementChild, 'inner', [
          ['i', { class: 'fa fa-exclamation-mark' }],
          ['span', 'You cannot see the countries of this giveaway.']
        ]);
      } else if (table) {
        table.classList.remove('esgst-hidden');
        if (triggerObj.custom.searchBox) {
          triggerObj.custom.searchBox.classList.remove('esgst-hidden');
        }
      }
    } else {
      shared.common.createElements_v2(context.lastElementChild, 'inner', [
        ['i', { class: 'fa fa-times-circle' }],
        ['span', 'An error occurred.']
      ]);
    }
    triggerObj.reposition();
  }

  async loadGiveawayEntries(main, id, giveaways, triggerObj, context) {
    for (const giveaway of giveaways) {
      try {
        await this.fetchGiveawayEntries(giveaway, triggerObj, context);
      } catch (e) {
        logger.warning(e.stack);
      }
    }
  }

  async fetchGiveawayEntries(giveaway, triggerObj, context) {
    let isLoading = false;
    let isCanceled = false;

    const url = `${giveaway.url}/entries/search?page=`;
    let nextPage = 1;
    let pagination;

    const loadNextPage = async () => {
      isLoading = true;

      const loadingElement = shared.common.createElements_v2(context, 'beforeEnd', [
        ['div', [
          ['i', { class: 'fa fa-circle-o-notch fa-spin' }],
          ['span', 'Loading next page...']
        ]]
      ]);

      const response = await FetchRequest.get(`${url}${nextPage}`);

      const error = response.html.querySelector('.table--summary');
      if (error) {
        isCanceled = true;

        loadingElement.remove();

        shared.common.createElements_v2(context.lastElementChild, 'inner', [
          ['i', { class: 'fa fa-exclamation-mark' }],
          ['span', 'You cannot see the entries of this giveaway.']
        ]);

        return;
      } else if (triggerObj.custom.searchBox) {
        triggerObj.custom.searchBox.classList.remove('esgst-hidden');
      }

      const entries = [];

      const elements = response.html.querySelectorAll('.table__row-inner-wrap');
      for (const element of elements) {
        const imageElement = element.querySelector('.table_image_avatar');
        const avatar = imageElement ? imageElement.style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1] : null;
        const heading = element.querySelector('.table__column__heading');
        const name = heading.textContent;

        entries.push({ avatar, name });
      }

      const currentRows = document.createDocumentFragment();
      for (const entry of entries) {
        shared.common.createElements_v2(currentRows, 'beforeEnd', [
          ['div', { class: 'table__row-outer-wrap' }, [
            ['div', { class: 'table__row-inner-wrap' }, [
              ['div', [
                entry.avatar
                  ? ['a', { class: 'table_image_avatar', href: `/user/${entry.name}`, style: `background-image:url(http://cdn.edgecast.steamstatic.com/steamcommunity/public/images/avatars/${entry.avatar}_medium.jpg)` }]
                  : ['div', { class: 'table_image_avatar_missing' }]
              ]],
              ['div', { class: 'table__column--width-fill' }, [
                ['a', { class: 'table__column__heading', href: `/user/${entry.name}` }, entry.name]
              ]]
            ]]
          ]]
        ]);
      }

      loadingElement.remove();

      await shared.common.endless_load(currentRows);

      triggerObj.custom.rows.appendChild(currentRows);

      triggerObj.reposition();

      nextPage += 1;
      pagination = response.html.querySelector('.pagination__navigation');
      if (!pagination || pagination.lastElementChild.classList.contains('is-selected')) {
        isCanceled = true;
      }

      isLoading = false;
    };

    context.addEventListener('scroll', () => {
      if (isLoading || isCanceled || triggerObj.custom.isSearching) {
        return;
      }
      if (context.scrollTop + context.offsetHeight >= context.scrollHeight) {
        loadNextPage();
      }
    });

    shared.common.createElements_v2(context.lastElementChild, 'inner', [
      ['div', { class: 'esgst-text-left table' }, [
        ['div', { class: 'table__rows', ref: ref => triggerObj.custom.rows = ref }]
      ]]
    ]);

    triggerObj.reposition();

    loadNextPage();
  }

  async loadGiveawayGroups(main, id, giveaways, triggerObj, context) {
    const giveawaysToSave = {};
    const groupsToSave = {};

    for (const giveaway of giveaways) {
      try {
        await this.fetchGiveawayGroups(giveaway, triggerObj, context, giveawaysToSave, groupsToSave);
      } catch (e) {
        logger.warning(e.stack);
      }
    }

    if (main && shared.esgst.gf && shared.esgst.gf.filteredCount && gSettings[`gf_enable${shared.esgst.gf.type}`]) {
      shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gf);
    }
    if (!main && shared.esgst.gfPopup && shared.esgst.gfPopup.filteredCount && gSettings[`gf_enable${shared.esgst.gfPopup.type}`]) {
      shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(shared.esgst.gfPopup);
    }

    await Promise.all([
      shared.common.lockAndSaveGiveaways(giveawaysToSave),
      shared.common.lockAndSaveGroups(groupsToSave)
    ]);
  }

  async fetchGiveawayGroups(giveaway, triggerObj, context, giveawaysToSave, groupsToSave) {
    let groups;

    const found = shared.esgst.giveaways[giveaway.code]
      && Array.isArray(shared.esgst.giveaways[giveaway.code].groups)
      && shared.esgst.giveaways[giveaway.code].groups.length
      && !shared.esgst.giveaways[giveaway.code].groups.filter(x =>
        !shared.esgst.groups.filter(y => x === y.code)[0]
      )[0];
    if (found) {
      groups = shared.esgst.giveaways[giveaway.code].groups;
    } else {
      groups = [];

      const url = `${giveaway.url}/groups/search?page=`;
      let nextPage = 1;
      let pagination;

      do {
        const response = await FetchRequest.get(`${url}${nextPage}`);

        const error = response.html.querySelector('.table--summary');
        if (error) {
          groups = null;
          break;
        }

        const elements = response.html.querySelectorAll('.table__row-inner-wrap');
        for (const element of elements) {
          const imageElement = element.querySelector('.table_image_avatar');
          const avatar = imageElement ? imageElement.style.backgroundImage.match(/\/avatars\/(.+)_medium/)[1] : null;
          const heading = element.querySelector('.table__column__heading');
          const code = heading.getAttribute('href').match(/group\/(.+?)\//)[1];
          const name = heading.textContent;

          groups.push(code);
          groupsToSave[code] = { avatar, code, name };
        }

        nextPage += 1;
        pagination = response.html.querySelector('.pagination__navigation');
      } while (pagination && !pagination.lastElementChild.classList.contains('is-selected'));

      if (groups) {
        giveawaysToSave[giveaway.code] = { groups };
      }
    }

    if (triggerObj) {
      if (groups) {
        let table;

        shared.common.createElements_v2(context.lastElementChild, 'inner', [
          ['div', { class: 'esgst-text-left table esgst-hidden', ref: ref => table = ref }, [
            ['div', { class: 'table__rows', ref: ref => triggerObj.custom.rows = ref }]
          ]]
        ]);

        let numGroups = 0;

        for (const code of groups) {
          let className;

          const group = shared.esgst.groups.filter(x => x.code === code)[0] || groupsToSave[code];
          if (group.member) {
            className = 'esgst-ggl-member';
            numGroups += 1;
          } else if (gSettings.ggl_m) {
            className = 'esgst-hidden';
          } else {
            className = '';
            numGroups += 1;
          }

          if (className !== 'esgst-hidden') {
            shared.common.createElements_v2(triggerObj.custom.rows, 'beforeEnd', [
              ['div', { class: `table__row-outer-wrap ${className}` }, [
                ['div', { class: 'table__row-inner-wrap' }, [
                  ['div', [
                    group.avatar
                      ? ['a', { class: 'table_image_avatar', href: `/group/${group.code}/`, style: `background-image:url(http://cdn.edgecast.steamstatic.com/steamcommunity/public/images/avatars/${group.avatar}_medium.jpg)` }]
                      : ['div', { class: 'table_image_avatar_missing' }]
                  ]],
                  ['div', { class: 'table__column--width-fill' }, [
                    ['a', { class: 'table__column__heading', href: `/group/${group.code}/` }, group.name]
                  ]]
                ]]
              ]]
            ]);
          }
        }

        if (numGroups === 0) {
          shared.common.createElements_v2(context.lastElementChild, 'inner', [
            ['i', { class: 'fa fa-exclamation-mark' }],
            ['span', 'You are not a member of any group in this giveaway.']
          ]);
        } else if (table) {
          table.classList.remove('esgst-hidden');
          if (triggerObj.custom.searchBox) {
            triggerObj.custom.searchBox.classList.remove('esgst-hidden');
          }
          shared.common.endless_load(table);
        }
      } else {
        shared.common.createElements_v2(context.lastElementChild, 'inner', [
          ['i', { class: 'fa fa-times-circle' }],
          ['span', 'An error occurred.']
        ]);
      }
      triggerObj.reposition();
    } else if (groups && !giveaway.summary.querySelector('.esgst-ggl-panel')) {
      const panel = shared.common.createElements_v2(giveaway.extraPanel || giveaway.summary, 'beforeEnd', [
        ['div', { class: 'esgst-ggl-panel', 'data-draggable-id': 'ggl' }]
      ]);

      shared.esgst.modules.giveaways.giveaways_reorder(giveaway);

      giveaway.groups = [];
      giveaway.groupNames = [];

      let numGroups = 0;

      for (const code of groups) {
        let className;

        const group = shared.esgst.groups.filter(x => x.code === code)[0] || groupsToSave[code];
        if (group.member) {
          className = 'esgst-ggl-member';
          numGroups += 1;
        } else if (gSettings.ggl_m) {
          className = 'esgst-hidden';
        } else {
          className = '';
          numGroups += 1;
        }

        giveaway.groups.push(group.name.toLowerCase());
        giveaway.groupNames.push(group.name);

        if (className !== 'esgst-hidden') {
          shared.common.createElements_v2(panel, 'beforeEnd', [
            ['div', { class: className }, [
              group.avatar
                ? ['a', { class: 'table_image_avatar', href: `/group/${group.code}/`, style: `background-image:url(http://cdn.edgecast.steamstatic.com/steamcommunity/public/images/avatars/${group.avatar}_medium.jpg)` }]
                : ['div', { class: 'table_image_avatar_missing' }],
              ['a', { href: `/group/${group.code}/` }, group.name]
            ]]
          ]);

          if (gSettings.cl_gi) {
            this.setTriggers('cl_gi', panel);
          }
        }
      }

      if (numGroups === 0) {
        panel.remove();
      }
    }
  }

  async loadInfo(main, id, targetObjs, triggerObj, context) {
    for (const targetObj of targetObjs) {
      try {
        await this.fetchInfo(targetObj, triggerObj, context);
      } catch (e) {
        logger.warning(e.stack);
      }
    }
  }

  async fetchInfo(targetObj, triggerObj, context) {
    const response = await FetchRequest.get(targetObj.url);

    context.innerHTML = '';

    context.appendChild(response.html.querySelector('.featured__outer-wrap'));

    const avatar = context.querySelector('.global__image-outer-wrap--avatar-large')
    const link = shared.common.createElements_v2(avatar, 'afterEnd', [
      ['a', { class: 'esgst-ap-link' }]
    ]);
    link.appendChild(avatar);
    link.setAttribute('href', targetObj.url);

    const table = context.querySelector('.featured__table');

    // add sidebar buttons to table
    const sidebarButtons = response.html.querySelector('.sidebar__shortcut-outer-wrap');
    sidebarButtons.lastElementChild.remove();
    table.parentElement.insertBefore(sidebarButtons, table);

    // merge left / right table columns
    const columns = table.children;
    for (let i = 0, n = columns[1].children.length; i < n; i++) {
      columns[0].appendChild(columns[1].firstElementChild);
    }
    columns[1].remove();

    const suspensionElement = response.html.querySelector('.sidebar__suspension')
    if (suspensionElement) {
      shared.common.createElements_v2(columns[0], 'beforeEnd', [
        ['div', { class: 'esgst-ap-suspended featured__table__row' }, [
          ['div', { class: 'featured__table__row__left' }, suspensionElement.textContent],
          ['div', { class: 'featured__table__row__right' }, suspensionElement.nextElementSibling.textContent]
        ]]
      ]);
    }

    const sidebarElements = response.html.querySelectorAll('.sidebar__navigation__item__name');
    for (const element of sidebarElements) {
      const match = element.textContent.match(/^Giveaways|Users$/);
      if (!match) {
        continue;
      }

      shared.common.createElements_v2(columns[0], 'beforeEnd', [
        ['div', { class: 'featured__table__row' }, [
          ['div', { class: 'featured__table__row__left' }, match[0]],
          ['div', { class: 'featured__table__row__right' }, element.nextElementSibling.nextElementSibling.textContent]
        ]]
      ]);
    }

    const reportButton = context.querySelector('.js__submit-form-inner');
    if (reportButton) {
      const form = reportButton.querySelector('form');
      reportButton.addEventListener('click', form.submit.bind(form));
    }

    if (targetObj.type === 'user') {
      await shared.esgst.modules.profile.profile_load(context);
    }
    if (gSettings.at) {
      shared.esgst.modules.generalAccurateTimestamp.at_getTimestamps(context);
    }

    triggerObj.reposition();
  }
}

const generalContentLoader = new GeneralContentLoader();

export { generalContentLoader };

