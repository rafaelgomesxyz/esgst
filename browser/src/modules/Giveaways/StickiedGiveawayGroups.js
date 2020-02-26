import { Button } from '../../class/Button';
import { Module } from '../../class/Module';
import { common } from '../Common';
import { Shared } from '../../class/Shared';

const
  getValue = common.getValue.bind(common),
  lockAndSaveGroups = common.lockAndSaveGroups.bind(common)
  ;

class GiveawaysStickiedGiveawayGroups extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: 'fa fa-thumb-stack' }],
            ' if the group is stickied and ',
            ['i', { class: 'fa fa-thumb-stack esgst-faded' }],
            ` if it is not) next to each group in the `,
            ['a', { href: `https://www.steamgifts.com/giveaways/new` }, 'new giveaway'],
            '/',
            ['a', { href: `https://www.steamgifts.com/account/steam/groups` }, 'groups'],
            ' pages that allows you to sticky the group so that it appears at the top of the group list for quick use.'
          ]]
        ]]
      ],
      id: 'sgg',
      name: 'Stickied Giveaway Groups',
      sg: true,
      type: 'giveaways'
    };
  }

  init() {
    if (this.esgst.newGiveawayPath && !document.getElementsByClassName('table--summary')[0]) {
      this.sgg_setGiveawayGroups();
    }
    if (Shared.common.isCurrentPath('Steam - Groups')) {
      this.esgst.endlessFeatures.push(this.sgg_setGroups.bind(this));
    }
  }

  sgg_setGiveawayGroups() {
    let avatar, code, container, context, elements, i, id, j, n, savedGroups, stickied;
    savedGroups = JSON.parse(this.esgst.storage.groups);
    container = document.querySelector(`.form_list[data-input="group_item_string"]`);
    elements = container.children;
    const obj = {
      separator: container.firstElementChild.nextElementSibling
    };
    for (i = 1, n = elements.length; i < n; ++i) {
      context = elements[i];
      id = context.getAttribute('data-item-id');
      const avatarContext = context.firstElementChild;
      avatar = avatarContext.style.backgroundImage;
      code = null;
      stickied = false;
      for (j = savedGroups.length - 1; j >= 0; --j) {
        if (avatar.match(savedGroups[j].avatar)) {
          code = savedGroups[j].code;
          if (savedGroups[j].stickied) {
            stickied = true;
          }
          break;
        }
      }
      if (code) {
        if (stickied) {
          if (context === obj.separator) {
            obj.separator = obj.separator.nextElementSibling;
          }
          container.insertBefore(context, obj.separator);
        }
        new Button(context, 'afterBegin', {
          callbacks: [this.sgg_stickyGroup.bind(this, obj, code, container, context, id), null, this.sgg_unstickyGroup.bind(this, obj, code, container, context, id), null],
          className: 'esgst-sgg-button',
          icons: ['fa-thumb-tack esgst-clickable esgst-faded', 'fa-circle-o-notch fa-spin', 'fa-thumb-tack esgst-clickable', 'fa-circle-o-notch fa-spin'],
          id: 'sgg',
          index: stickied ? 2 : 0,
          titles: ['Sticky group', 'Stickying...', 'Unsticky group', 'Unstickying...']
        });
      }
    }
  }

  async sgg_setGroups(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-inner-wrap, .esgst-es-page-${endless}.table__row-inner-wrap` : '.table__row-inner-wrap'}`);
    if (!elements.length) return;
    const savedGroups = JSON.parse(getValue('groups', '[]'));
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      let avatar = element.getElementsByClassName('table_image_avatar')[0].style.backgroundImage;
      let stickied = false;
      let code = null;
      for (let j = savedGroups.length - 1; j >= 0; j--) {
        if (!avatar.match(savedGroups[j].avatar)) {
          continue;
        }
        code = savedGroups[j].code;
        if (savedGroups[j].stickied) {
          stickied = true;
        }
        break;
      }
      if (!code) {
        continue;
      }
      new Button(element, 'afterBegin', {
        callbacks: [this.sgg_stickyGroup.bind(this, {}, code, null, element, null), null, this.sgg_unstickyGroup.bind(this, {}, code, null, element, null), null],
        className: 'esgst-sgg-button',
        icons: ['fa-thumb-tack esgst-clickable esgst-faded', 'fa-circle-o-notch fa-spin', 'fa-thumb-tack esgst-clickable', 'fa-circle-o-notch fa-spin'],
        id: 'sgg',
        index: stickied ? 2 : 0,
        titles: ['Sticky group', 'Stickying...', 'Unsticky group', 'Unstickying...']
      });
    }
  }

  async sgg_stickyGroup(obj, code, container, context, id, event) {
    event.stopPropagation();
    if (container) {
      if (context === obj.separator) {
        obj.separator = obj.separator.nextElementSibling;
      }
      container.insertBefore(context, obj.separator);
    }
    let groups = {};
    groups[code] = {
      stickied: true
    };
    if (id) {
      groups[code].id = id;
    }
    await lockAndSaveGroups(groups);
    return true;
  }

  async sgg_unstickyGroup(obj, code, container, context, id, event) {
    event.stopPropagation();
    if (container) {
      container.insertBefore(context, obj.separator);
      obj.separator = obj.separator.previousElementSibling;
    }
    let groups = {};
    groups[code] = {
      stickied: false
    };
    if (id) {
      groups[code].id = id;
    }
    await lockAndSaveGroups(groups);
    return true;
  }
}

const giveawaysStickiedGiveawayGroups = new GiveawaysStickiedGiveawayGroups();

export { giveawaysStickiedGiveawayGroups };