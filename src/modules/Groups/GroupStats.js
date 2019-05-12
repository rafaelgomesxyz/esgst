import { Module } from '../../class/Module';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';
import { permissions } from '../../class/Permissions';

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
      name: `Group Stats`,
      sg: true,
      type: `groups`
    };
  }

  async init() {
    if (!shared.common.isCurrentPath(`Steam - Groups`)) {
      return;
    }

    if (gSettings.gs_t && !(await permissions.requestUi([`steamCommunity`], `gs`, true))) {
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
    }, gSettings.gs_t ? {
      attributes: {
        class: `table__column--width-small text-center`
      },
      text: `Type`,
      type: `div`
    } : null]);
    const gsObj = {
      notification: new elementBuilder.sg.notification(),
      numGroups: 0
    };
    shared.esgst.mainPageHeading.parentElement.insertBefore(gsObj.notification.notification, shared.esgst.pagination.previousElementSibling);
    shared.esgst.groupFeatures.push(this.gs_getGroups.bind(this, gsObj));
  }

  gs_getGroups(gsObj, groups) {
    gsObj.notification.setType(`warning`);
    gsObj.notification.setIcons([`fa-circle-o-notch`, `fa-spin`]);
    gsObj.notification.setMessage(`Loading stats for groups...`);
    gsObj.numGroups += groups.length;
    const promises = [];
    for (const group of groups) {
      const promise = this.gs_addStatus(group);
      promise.then(() => gsObj.notification.setMessage(`Loading stats for groups (${--gsObj.numGroups} left)...`));
      promises.push(promise);
    }
    Promise.all(promises).then(() => {
      if (gsObj.numGroups === 0) {
        gsObj.notification.setType(`success`);
        gsObj.notification.setIcons([`fa-check-circle`]);
        gsObj.notification.setMessage(`Stats for groups loaded.`);
      }
    });
  }

  async gs_addStatus(group) {
    const items = [];
    const responseHtml = utils.parseHtml((await common.request({
      method: `GET`,
      url: `${group.url}/users/search?q=${gSettings.username}`
    })).responseText);
    const context = responseHtml.querySelector(`.table__row-inner-wrap`);
    if (!context || context.querySelector(`.table__column__heading`).textContent !== gSettings.username) {
      return;
    }
    const elements = context.querySelectorAll(`.table__column--width-small`);
    for (const element of elements) {
      items.push(element);
    }
    const users = responseHtml.querySelectorAll(`.sidebar__navigation__item__count`)[1].textContent;
    group.users = parseInt(users.replace(/,/g, ``));
    items.push([`div`, { class: `table__column--width-small text-center` }, users]);
    const lastGiveawayElement = responseHtml.querySelectorAll(`.featured__table__row__right`)[1];
    lastGiveawayElement.classList.remove(`featured__table__row__right`);
    lastGiveawayElement.classList.add(`table__column--width-small`, `text-center`);
    items.push(lastGiveawayElement);
    const timestampElement = lastGiveawayElement.querySelector(`[data-timestamp]`);
    if (timestampElement) {
      group.lastGiveaway = parseInt(timestampElement.getAttribute(`data-timestamp`)) * 1e3;
    } else {
      group.lastGiveaway = 0;
    }
    const steamIdElement = responseHtml.querySelector(`a[href*="/gid/"]`);
    group.steamId = steamIdElement.getAttribute(`href`).match(/\/gid\/(\d+)/)[1];
    group.type = `-`;
    if (gSettings.gs_t) {
      const response = await common.request({
        anon: true,
        method: `GET`,
        url: `https://steamcommunity.com/gid/${group.steamId}?cc=us&l=english`
      });
      if (response.finalUrl.match(/steamcommunity\.com\/games\//)) {
        group.type = `Official Game Group`;
        group.officialGameGroup = true;
      } else {
        const joinText = utils.parseHtml(response.responseText).querySelector(`.grouppage_join_area`).textContent.trim();
        if (joinText.match(/join\sgroup/i)) {
          group.type = `Open`;
          group.open = true;
        } else if (joinText.match(/request\sto\sjoin/i)) {
          group.type = `Restricted`;
          group.restricted = true;
        } else if (joinText.match(/membership\sby\sinvitation\sonly/i)) {
          group.type = `Closed`;
          group.closed = true;
        }
      }
      items.push([`div`, { class: `table__column--width-small text-center` }, group.type]);
    }
    common.createElements_v2(group.container, `afterEnd`, items);
    if (shared.esgst.gpf && shared.esgst.gpf.filteredCount && gSettings[`gpf_enable${shared.esgst.gpf.type}`]) {
      shared.esgst.modules.groupsGroupFilters.filters_filter(shared.esgst.gpf);
    }
  }
}

const groupsGroupStats = new GroupsGroupStats();

export { groupsGroupStats };