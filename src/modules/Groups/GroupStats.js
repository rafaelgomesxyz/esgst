import Module from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';

class GroupsGroupStats extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds some columns to your `,
            [`a`, { href: `https://www.steamgifts.com/account/steam/groups` }, `groups`],
            ` page that show some stats about each group.`
          ]]
        ]]
      ],
      features: {
        gs_t: {
          name: `Request the type of the group (takes a bit longer to check if the group is open, restricted, closed or an official game group).`,
          sg: true
        }
      },
      id: `gs`,
      load: this.gs,
      name: `Group Stats`,
      sg: true,
      type: `groups`
    };
  }

  gs() {
    if (!this.esgst.groupsPath) {
      return;
    }
    common.createElements(document.getElementsByClassName(`table__heading`)[0], `beforeEnd`, [{
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Sent`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Received`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Gift Difference`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Value Difference`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Users`,
      type: `div`
    }, {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Last Giveaway`,
      type: `div`
    }, this.esgst.gs_t ? {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Type`,
      type: `div`
    } : null]);
    this.esgst.groupFeatures.push(this.gs_getGroups.bind(this));
  }

  gs_getGroups(groups) {
    for (const group of groups) {
      this.gs_addStatus(group);
    }
  }

  async gs_addStatus(group) {
    const items = [];
    const responseHtml = utils.parseHtml((await common.request({
      method: `GET`,
      url: `${group.url}/users/search?q=${this.esgst.username}`
    })).responseText);
    const context = responseHtml.querySelector(`.table__row-inner-wrap`);
    if (!context || context.querySelector(`.table__column__heading`).textContent !== this.esgst.username) {
      return;
    }
    const elements = context.querySelectorAll(`.table__column--width-small`);
    for (const element of elements) {
      items.push(element);
    }
    items.push([`div`, { class: `table__column--width-small text-center` }, responseHtml.querySelectorAll(`.sidebar__navigation__item__count`)[1].textContent]);
    const lastGiveawayElement = responseHtml.querySelectorAll(`.featured__table__row__right`)[1];
    lastGiveawayElement.classList.remove(`featured__table__row__right`);
    lastGiveawayElement.classList.add(`table__column--width-small`, `text-center`);
    items.push(lastGiveawayElement);
    const steamIdElement = responseHtml.querySelector(`a[href*="/gid/"]`);
    group.steamId = steamIdElement.getAttribute(`href`).match(/\/gid\/(\d+)/)[1];
    group.type = `-`;
    if (this.esgst.gs_t) {
      const response = await common.request({
        anon: true,
        method: `GET`,
        url: `https://steamcommunity.com/gid/${group.steamId}?cc=us&l=english`
      });
      if (response.finalUrl.match(/steamcommunity\.com\/games\//)) {
        group.type = `Official Game Group`;
      } else {
        const joinText = utils.parseHtml(response.responseText).querySelector(`.grouppage_join_area`).textContent.trim();
        if (joinText.match(/join\sgroup/i)) {
          group.type = `Open`;
        } else if (joinText.match(/request\sto\sjoin/i)) {
          group.type = `Restricted`;
        } else if (joinText.match(/membership\sby\sinvitation\sonly/i)) {
          group.type = `Closed`;
        }
      }
      items.push([`div`, { class: `table__column--width-small text-center` }, group.type]);
    }
    common.createElements_v2(group.container, `afterEnd`, items);
  }
}

export default GroupsGroupStats;