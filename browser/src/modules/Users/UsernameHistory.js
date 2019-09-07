import { Module } from '../../class/Module';
import { common } from '../Common';
import { shared } from '../../class/Shared';
import { permissions } from '../../class/Permissions';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  request = common.request.bind(common)
  ;

class UsersUsernameHistory extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: `fa fa-caret-down` }],
            `) next to a user's username (in their `,
            ['a', { href: `https://www.steamgifts.com/user/cg` }, 'profile'],
            ` page) that allows you to view their username history ever since they started being tracked.`
          ]],
          ['li', `It is impossible to keep track of every SteamGifts user due to a database capacity limitation (and that would also be impractical), so instead the feature keeps track of a limited number of users (currently around 9000). A user starts being tracked when anyone using ESGST clicks on the button to view their username history.`],
          ['li', `Username changes are detected in two instances:`],
          ['ul', [
            ['li', `Every 30 days the usernames of all of the users in the database are updated and if any changes are detected they are added to the history.`],
            ['li', `Every time anyone using ESGST clicks on the button to view the username history of a user the username of that user is updated and if a change is detected it is added to the history.`],
          ]],
          ['li', `The database is kept globally in a Google Sheet, which means that everyone using ESGST interacts with the same database and views the same history.`],
          ['li', [
            `There is a button (`,
            ['i', { class: `fa fa-expand` }],
            `) in the username history popout that allows anyone using ESGST to help expand the database by submitting proof that the user used to have a certain username in the past. The submission will be analyzed and if the proof is authentic the username will be added to the history.`
          ]],
          ['li', [
            `Adds a button (`,
            ['i', { class: `fa fa-user` }],
            ` `,
            ['i', { class: `fa fa-history` }],
            `) to the page heading of this menu that allows you to view all of the recent username changes detected.`
          ]]
        ]]
      ],
      id: 'uh',
      name: `Username History`,
      sg: true,
      type: 'users',
      featureMap: {
        profile: this.uh_add.bind(this)
      }
    };
  }

  uh_add(profile) {
    let button, box, container, list;
    container = createElements(profile.heading, 'beforeEnd', [{
      attributes: {
        class: `esgst-uh-container`
      },
      type: 'div',
      children: [{
        attributes: {
          class: `esgst-uh-button`,
          title: getFeatureTooltip('uh', `View username history`)
        },
        type: 'a',
        children: [{
          attributes: {
            class: `fa fa-caret-down`
          },
          type: 'i'
        }]
      }, {
        attributes: {
          class: `esgst-uh-box esgst-hidden`
        },
        type: 'div',
        children: [{
          attributes: {
            class: `esgst-uh-title`
          },
          type: 'div',
          children: [{
            text: `Username History`,
            type: 'span'
          }, {
            attributes: {
              href: `https://goo.gl/C2wjUh`,
              target: '_blank',
              title: `Expand the database`
            },
            type: 'a',
            children: [{
              attributes: {
                class: `fa fa-expand`
              },
              type: 'i'
            }]
          }]
        }, {
          attributes: {
            class: `esgst-uh-list`
          },
          type: 'ul'
        }]
      }]
    }]);
    button = container.firstElementChild;
    box = button.nextElementSibling;
    list = box.lastElementChild;
    button.addEventListener('click', this.uh_toggle.bind(this, box, profile, list));
    shared.esgst.documentEvents.click.add(this.uh_close.bind(this, box, container));
  }

  async uh_toggle(box, profile, list) {
    if (!(await permissions.requestUi(['googleWebApp'], 'uh'))) {
      return;
    }

    box.classList.toggle(`esgst-hidden`);
    if (!list.innerHTML) {
      createElements(list, 'inner', [{
        type: 'div',
        children: [{
          attributes: {
            class: `fa fa-circle-o-notch fa-spin`
          },
          type: 'i'
        }, {
          text: `Loading username history...`,
          type: 'span'
        }]
      }]);
      createElements(list, 'inner', (await this.getUserNames(profile.steamId, profile.username)).usernames.map(x => {
        return {
          text: x,
          type: 'li'
        };
      }));
    }
  }

  uh_close(box, container, event) {
    if (!box.classList.contains(`esgst-hidden`) && !container.contains(event.target)) {
      box.classList.add(`esgst-hidden`);
    }
  }

  /**
   * @param steamId
   * @param username
   */
  async getUserNames(steamId, username) {
    return JSON.parse((await request({
      method: 'GET',
      url: `https://script.google.com/macros/s/AKfycbz2IWN7I79WsbGELQk2rbQQSPI8XNWvDt3mEO-3nLEWqHiQmeo/exec?action=uh&code=0&steamId=${steamId}&username=${username}`
    })).responseText);
  }
}

const usersUsernameHistory = new UsersUsernameHistory();

export { usersUsernameHistory };