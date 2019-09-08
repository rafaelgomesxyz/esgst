import { Module } from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { shared } from '../../class/Shared';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  request = common.request.bind(common)
  ;

class UsersUserStats extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds 5 columns ("Last Online", "Gifts Sent", "Gifts Won", "Ratio" and "Contributor Value") to your `,
            ['a', { href: `https://www.steamgifts.com/account/manage/whitelist` }, 'whitelist'],
            '/',
            ['a', { href: `https://www.steamgifts.com/account/manage/blacklist` }, 'blacklist'],
            ` pages and the popup from [id=wbs] that show some stats about each user.`
          ]]
        ]]
      ],
      id: 'us',
      name: 'User Stats',
      sg: true,
      type: 'users'
    };
  }

  init() {
    if (!shared.esgst.whitelistPath && !shared.esgst.blacklistPath) return;
    shared.esgst.endlessFeatures.push(this.us_get.bind(this));
  }

  async us_get(context, main, source, endless) {
    if (!main && !context.closest('.esgst-wbs-popup')) {
      return;
    }
    if (context === document || !main) {
      createElements(context.getElementsByClassName('table__heading')[0].firstElementChild, 'afterEnd', [{
        attributes: {
          class: 'table__column--width-small text-center'
        },
        text: 'Last Online',
        type: 'div'
      }, {
        attributes: {
          class: 'table__column--width-small text-center'
        },
        text: 'Gifts Won',
        type: 'div'
      }, {
        attributes: {
          class: 'table__column--width-small text-center'
        },
        text: 'Gifts Sent',
        type: 'div'
      }, {
        attributes: {
          class: 'table__column--width-small text-center'
        },
        text: 'Ratio',
        type: 'div'
      }, {
        attributes: {
          class: 'table__column--width-small text-center'
        },
        text: 'Contributor Level',
        type: 'div'
      }]);
    }
    let users = {};
    let elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-inner-wrap, .esgst-es-page-${endless}.table__row-inner-wrap` : '.table__row-inner-wrap'}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      let element = elements[i];
      users[element.getElementsByClassName('table__column__heading')[0].textContent] = (main && element.firstElementChild.nextElementSibling) || element.firstElementChild;
    }
    let promises = [];
    for (let username in users) {
      if (users.hasOwnProperty(username)) {
        let promise = request({ method: 'GET', url: `/user/${username}` });
        promise.then(this.us_load.bind(this, users[username], username));
        promises.push(promise);
      }
      Promise.all(promises).then(shared.esgst.modules.generalTableSorter.ts_sortTables.bind(shared.esgst.modules.generalTableSorter));
    }
  }

  us_load(context, username, response) {
    let element, elements, html, i, n, cvrow, rows;
    html = [];
    const profile = {};
    elements = parseHtml(response.responseText).getElementsByClassName('featured__table__row__left');
    for (i = 0, n = elements.length; i < n; ++i) {
      element = elements[i];
      switch (element.textContent) {
        case 'Last Online':
          html.push({
            attributes: {
              class: 'table__column--width-small text-center'
            },
            type: 'div',
            children: Array.from(element.nextElementSibling.childNodes).map(x => {
              return {
                context: x
              };
            })
          });
          break;
        case 'Gifts Won':
          profile.wonRow = element.parentElement;
          profile.wonRowLeft = element;
          profile.wonRowRight = element.nextElementSibling;
          rows = JSON.parse(profile.wonRowRight.firstElementChild.firstElementChild.getAttribute('data-ui-tooltip')).rows;
          profile.wonCount = parseInt(rows[0].columns[1].name.replace(/,/g, ''));
          profile.wonFull = parseInt(rows[1].columns[1].name.replace(/,/g, ''));
          profile.wonReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ''));
          profile.wonZero = parseInt(rows[3].columns[1].name.replace(/,/g, ''));
          cvrow = profile.wonRowRight.firstElementChild.lastElementChild;
          rows = JSON.parse(cvrow.getAttribute('data-ui-tooltip')).rows;
          profile.wonCV = parseFloat(cvrow.textContent.replace(/[$,]/g, ''));
          profile.realWonCV = parseFloat(rows[0].columns[1].name.replace(/[$,]/g, ''));
          element.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.removeAttribute('style');
          html.push({
            attributes: {
              class: 'table__column--width-small text-center'
            },
            type: 'div',
            children: Array.from(element.nextElementSibling.childNodes).map(x => {
              return {
                context: x
              };
            })
          });
          break;
        case 'Gifts Sent':
          profile.sentRow = element.parentElement;
          profile.sentRowLeft = element;
          profile.sentRowRight = element.nextElementSibling;
          rows = JSON.parse(profile.sentRowRight.firstElementChild.firstElementChild.getAttribute('data-ui-tooltip')).rows;
          profile.sentCount = parseInt(rows[0].columns[1].name.replace(/,/g, ''));
          profile.sentFull = parseInt(rows[1].columns[1].name.replace(/,/g, ''));
          profile.sentReduced = parseInt(rows[2].columns[1].name.replace(/,/g, ''));
          profile.sentZero = parseInt(rows[3].columns[1].name.replace(/,/g, ''));
          profile.notSent = parseInt(rows[5].columns[1].name.replace(/,/g, ''));
          cvrow = profile.sentRowRight.firstElementChild.lastElementChild;
          rows = JSON.parse(cvrow.getAttribute('data-ui-tooltip')).rows;
          profile.sentCV = parseFloat(cvrow.textContent.replace(/[$,]/g, ''));
          profile.realSentCV = parseFloat(rows[0].columns[1].name.replace(/[$,]/g, ''));
          element.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.removeAttribute('style');
          html.push({
            attributes: {
              class: 'table__column--width-small text-center'
            },
            type: 'div',
            children: Array.from(element.nextElementSibling.childNodes).map(x => {
              return {
                context: x
              };
            })
          });
          break;
        case 'Contributor Level':
        shared.esgst.modules.usersSentWonRatio.swr_add(profile);
          html.push({
            attributes: {
              class: 'table__column--width-small text-center'
            },
            type: 'div',
            children: Array.from(profile.sentRow.nextElementSibling.lastElementChild.childNodes).map(x => {
              return {
                context: x
              };
            })
          }, {
              attributes: {
                class: 'table__column--width-small text-center'
              },
              text: parseFloat(JSON.parse(element.nextElementSibling.firstElementChild.getAttribute('data-ui-tooltip')).rows[0].columns[1].name),
              type: 'div'
            });
          break;
      }
    }
    createElements(context, 'afterEnd', html);
  }
}

const usersUserStats = new UsersUserStats();

export { usersUserStats };