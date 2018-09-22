import Module from '../../class/Module';
import Button from '../../class/Button';
import {common} from '../Common';

const
  {
    lockAndSaveGroups
  } = common
;

class GiveawaysStickiedGiveawayGroups extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-thumb-stack"></i> if the group is stickied and <i class="fa fa-thumb-stack esgst-faded"></i> if it is not) next to each group in the <a href="https://www.steamgifts.com/giveaways/new">new giveaway</a>/<a href="https://www.steamgifts.com/account/steam/groups">groups</a> pages that allows you to sticky the group so that it appears this.esgst.modules.generalAccurateTimestamp.at the top of the group list for quick use.</li>
      </ul>
    `,
    id: `sgg`,
    load: this.sgg,
    name: `Stickied Giveaway Groups`,
    sg: true,
    type: `giveaways`
  });

  sgg() {
    if (this.esgst.newGiveawayPath && !document.getElementsByClassName(`table--summary`)[0]) {
      this.sgg_setGiveawayGroups();
    }
    if (this.esgst.groupsPath) {
      this.esgst.endlessFeatures.push(this.sgg_setGroups);
    }
  }

  sgg_setGiveawayGroups() {
    let avatar, code, container, context, elements, i, id, j, n, savedGroups, separator, stickied;
    savedGroups = JSON.parse(this.esgst.storage.groups);
    container = document.querySelector(`.form_list[data-input="group_item_string"]`);
    separator = container.firstElementChild.nextElementSibling;
    elements = container.children;
    for (i = 1, n = elements.length; i < n; ++i) {
      context = elements[i];
      id = context.getAttribute(`data-item-id`);
      avatar = context.firstElementChild.style.backgroundImage;
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
          if (context === separator) {
            separator = separator.nextElementSibling;
          }
          container.insertBefore(context, separator);
        }
        new Button(context, `afterBegin`, {
          callbacks: [this.sgg_stickyGroup.bind(null, code, container, context, id, separator), null, this.sgg_unstickyGroup.bind(null, code, container, context, id, separator), null],
          className: `esgst-sgg-button`,
          icons: [`fa-thumb-tack esgst-clickable esgst-faded`, `fa-circle-o-notch fa-spin`, `fa-thumb-tack esgst-clickable`, `fa-circle-o-notch fa-spin`],
          id: `sgg`,
          index: stickied ? 2 : 0,
          titles: [`Sticky group`, `Stickying...`, `Unsticky group`, `Unstickying...`]
        });
      }
    }
  }

  async sgg_setGroups(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .table__row-inner-wrap, .esgst-es-page-${endless}.table__row-inner-wrap` : `.table__row-inner-wrap`}`);
    if (!elements.length) return;
    const savedGroups = JSON.parse(await getValue(`groups`, `[]`));
    for (let i = 0, n = elements.length; i < n; i++) {
      let element = elements[i];
      let avatar = element.getElementsByClassName(`table_image_avatar`)[0].style.backgroundImage;
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
      new Button(element, `afterBegin`, {
        callbacks: [this.sgg_stickyGroup.bind(null, code, null, element, null, null), null, this.sgg_unstickyGroup.bind(null, code, null, element, null, null), null],
        className: `esgst-sgg-button`,
        icons: [`fa-thumb-tack esgst-clickable esgst-faded`, `fa-circle-o-notch fa-spin`, `fa-thumb-tack esgst-clickable`, `fa-circle-o-notch fa-spin`],
        id: `sgg`,
        index: stickied ? 2 : 0,
        titles: [`Sticky group`, `Stickying...`, `Unsticky group`, `Unstickying...`]
      });
    }
  }

  async sgg_stickyGroup(code, container, context, id, separator, event) {
    event.stopPropagation();
    if (container) {
      if (context === separator) {
        separator = separator.nextElementSibling;
      }
      container.insertBefore(context, separator);
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

  async sgg_unstickyGroup(code, container, context, id, separator, event) {
    event.stopPropagation();
    if (container) {
      container.insertBefore(context, separator);
      separator = separator.previousElementSibling;
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

export default GiveawaysStickiedGiveawayGroups;