import { Module } from '../../class/Module';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { permissions } from '../../class/Permissions';
import { FetchRequest } from '../../class/FetchRequest';
import { DOM } from '../../class/DOM';

class GroupsGroupStats extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            'Adds some columns to your ',
            ['a', { href: `https://www.steamgifts.com/account/steam/groups` }, 'groups'],
            ' page that show some stats about each group.'
          ]]
        ]]
      ],
      features: {
        gs_sent: {
          name: 'Sent',
          sg: true
        },
        gs_received: {
          name: 'Received',
          sg: true
        },
        gs_giftDifference: {
          name: 'Gift Difference',
          sg: true
        },
        gs_valueDifference: {
          name: 'Value Difference',
          sg: true
        },
        gs_firstGiveaway: {
          name: 'First Giveaway',
          sg: true
        },
        gs_lastGiveaway: {
          name: 'Last Giveaway',
          sg: true
        },
        gs_averageEntries: {
          name: 'Average Entries',
          sg: true
        },
        gs_contributors: {
          name: 'Contributors',
          sg: true
        },
        gs_winners: {
          name: 'Winners',
          sg: true
        },
        gs_giftsSent: {
          name: 'Gifts Sent',
          sg: true
        },
        gs_giveaways: {
          name: 'Giveaways',
          sg: true
        },
        gs_users: {
          name: 'Users',
          sg: true
        },
        gs_creationDate: {
          name: `Creation Date (takes a bit longer to retrieve the date from Steam)`,
          sg: true
        },
        gs_type: {
          name: `Type (takes a bit longer to check if the group is open, restricted, closed or an official game group on Steam)`,
          sg: true
        }
      },
      id: 'gs',
      name: 'Group Stats',
      sg: true,
      type: 'groups'
    };
  }

  async init() {
    if (!Shared.common.isCurrentPath('Steam - Groups')) {
      return;
    }

    if ((Settings.get('gs_creationDate') || Settings.get('gs_type')) && !(await permissions.requestUi([['steamCommunity']], 'gs', true))) {
      return;
    }

    DOM.build(document.getElementsByClassName('table__heading')[0], 'beforeEnd', [
      Settings.get('gs_sent') ? ['div', { class: 'table__column--width-small text-center' }, 'Sent'] : null,
      Settings.get('gs_received') ? ['div', { class: 'table__column--width-small text-center' }, 'Received'] : null,
      Settings.get('gs_giftDifference') ? ['div', { class: 'table__column--width-small text-center' }, 'Gift Difference'] : null,
      Settings.get('gs_valueDifference') ? ['div', { class: 'table__column--width-small text-center' }, 'Value Difference'] : null,
      Settings.get('gs_firstGiveaway') ? ['div', { class: 'table__column--width-small text-center' }, 'First Giveaway'] : null,
      Settings.get('gs_lastGiveaway') ? ['div', { class: 'table__column--width-small text-center' }, 'Last Giveaway'] : null,
      Settings.get('gs_averageEntries') ? ['div', { class: 'table__column--width-small text-center' }, 'Average Entries'] : null,
      Settings.get('gs_contributors') ? ['div', { class: 'table__column--width-small text-center' }, 'Contributors'] : null,
      Settings.get('gs_winners') ? ['div', { class: 'table__column--width-small text-center' }, 'Winners'] : null,
      Settings.get('gs_giftsSent') ? ['div', { class: 'table__column--width-small text-center' }, 'Gifts Sent'] : null,
      Settings.get('gs_giveaways') ? ['div', { class: 'table__column--width-small text-center' }, 'Giveaways'] : null,
      Settings.get('gs_users') ? ['div', { class: 'table__column--width-small text-center' }, 'Users'] : null,
      Settings.get('gs_creationDate') ? ['div', { class: 'table__column--width-small text-center' }, 'Creation Date'] : null,
      Settings.get('gs_type') ? ['div', { class: 'table__column--width-small text-center' }, 'Type'] : null
    ]);
    this.notification = new elementBuilder.sg.notification();
    this.numGroups = 0;
    Shared.esgst.mainPageHeading.parentElement.insertBefore(this.notification.notification, Shared.esgst.pagination.previousElementSibling);
    Shared.esgst.groupFeatures.push(this.gs_getGroups.bind(this));
  }

  gs_getGroups(groups, main) {
    this.notification.setType('warning');
    this.notification.setIcons(['fa-circle-o-notch', 'fa-spin']);
    this.notification.setMessage('Loading stats for groups...');
    this.numGroups += groups.length;
    const promises = [];
    for (const group of groups) {
      const promise = this.gs_addStatus(group, main);
      promise.then(() => this.notification.setMessage(`Loading stats for groups (${--this.numGroups} left)...`));
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      if (this.numGroups === 0) {
        this.notification.setType('success');
        this.notification.setIcons(['fa-check-circle']);
        this.notification.setMessage('Stats for groups loaded.');
      }
    });
  }

  async gs_addStatus(group, main) {
    const response = await FetchRequest.get(`${group.url}/users/search?q=${Settings.get('username')}`);

    const userContext = response.html.querySelector('.table__row-inner-wrap');
    if (!userContext || userContext.querySelector('.table__column__heading').textContent !== Settings.get('username')) {
      return;
    }

    const items = [];

    group.firstGiveaway = 0;
    group.lastGiveaway = 0;
    group.averageEntries = 0;
    group.contributors = 0;
    group.winners = 0;
    group.giveaways = 0;
    group.users = 0;

    const tableColumns = userContext.querySelectorAll('.table__column--width-small');
    for (const [index, column] of  tableColumns.entries()) {
      let append = false;
      if (index === 0 && Settings.get('gs_sent')) {
        append = true;
      } else if (index === 1 && Settings.get('gs_received')) {
        append = true;
      } else if (index === 2 && Settings.get('gs_giftDifference')) {
        append = true;
      } else if (index === 3 && Settings.get('gs_valueDifference')) {
        append = true;
      }
      if (append) {
        items.push(column);
      }
    }

    const tableRows = response.html.querySelectorAll('.featured__table__row__left');
    for (const row of tableRows) {
      const text = row.textContent.trim();
      const element = row.nextElementSibling;
      let append = false;
      if (text === 'First Giveaway' && Settings.get('gs_firstGiveaway')) {
        const timestampElement = element.querySelector(`[data-timestamp]`);
        if (timestampElement) {
          group.firstGiveaway = parseInt(timestampElement.getAttribute('data-timestamp')) * 1e3;
        }
        append = true;
      } else if (text === 'Last Giveaway' && Settings.get('gs_lastGiveaway')) {
        const timestampElement = element.querySelector(`[data-timestamp]`);
        if (timestampElement) {
          group.lastGiveaway = parseInt(timestampElement.getAttribute('data-timestamp')) * 1e3;
        }
        append = true;
      } else if (text === 'Average Entries' && Settings.get('gs_averageEntries')) {
        group.averageEntries = parseInt(element.textContent.replace(/,/g, ''));
        append = true;
      } else if (text === 'Contributors' && Settings.get('gs_contributors')) {
        group.averageEntries = parseInt(element.textContent.replace(/,/g, ''));
        append = true;
      } else if (text === 'Winners' && Settings.get('gs_winners')) {
        group.averageEntries = parseInt(element.textContent.replace(/,/g, ''));
        append = true;
      } else if (text === 'Gifts Sent' && Settings.get('gs_giftsSent')) {
        append = true;
      }
      if (append) {
        element.classList.remove('featured__table__row__right');
        element.classList.add('table__column--width-small', 'text-center');
        items.push(element);
      }
    }

    const sidebarItems = response.html.querySelectorAll('.sidebar__navigation__item__name');
    for (const item of sidebarItems) {
      const text = item.textContent.trim();
      const element = item.nextElementSibling.nextElementSibling;
      let append = false;
      if (text === 'Giveaways' && Settings.get('gs_giveaways')) {
        group.giveaways = parseInt(element.textContent.replace(/,/g, ''));
        append = true;
      } else if (text === 'Users' && Settings.get('gs_users')) {
        group.users = parseInt(element.textContent.replace(/,/g, ''));
        append = true;
      }
      if (append) {
        element.classList.remove('sidebar__navigation__item__count');
        element.classList.add('table__column--width-small', 'text-center');
        items.push(element);
      }
    }

    const steamIdElement = response.html.querySelector(`a[href*="/gid/"]`);

    group.steamId = steamIdElement.getAttribute('href').match(/\/gid\/(\d+)/)[1];

    group.creationDate = 0;
    group.type = '-';

    if (Settings.get('gs_creationDate') || Settings.get('gs_type')) {
      const response = await FetchRequest.get(`https://steamcommunity.com/gid/${group.steamId}?cc=us&l=english`, { anon: true });

      if (Settings.get('gs_creationDate')) {
        const groupStatLabels = response.html.querySelectorAll('.groupstat > .label');
        let date = '-';
        for (const label of groupStatLabels) {
          if (label.textContent.match(/founded/i)) {
            date = label.nextElementSibling.textContent.trim();
            group.creationDate = new Date(date);
            break;
          }
        }
        items.push(['div', { class: 'table__column--width-small text-center' }, [
          ['span', { 'data-timestamp': group.creationDate / 1e3 }, date]
        ]]);
      }

      if (Settings.get('gs_type')) {
        if (response.url.match(/steamcommunity\.com\/games\//)) {
          group.type = 'Official Game Group';
          group.officialGameGroup = true;
        } else {
          const text = response.html.querySelector('.grouppage_join_area').textContent.trim();
          if (text.match(/join\sgroup/i)) {
            group.type = 'Open';
            group.open = true;
          } else if (text.match(/request\sto\sjoin/i)) {
            group.type = 'Restricted';
            group.restricted = true;
          } else if (text.match(/membership\sby\sinvitation\sonly/i)) {
            group.type = 'Closed';
            group.closed = true;
          }
        }
        items.push(['div', { class: 'table__column--width-small text-center' }, group.type]);
      }
    }

    DOM.build(group.container, 'afterEnd', items);

    if (main && Shared.esgst.gpf && Shared.esgst.gpf.filteredCount && Settings.get(`gpf_enable${Shared.esgst.gpf.type}`)) {
      Shared.esgst.modules.groupsGroupFilters.filters_filter(Shared.esgst.gpf);
    }
  }
}

const groupsGroupStats = new GroupsGroupStats();

export { groupsGroupStats };