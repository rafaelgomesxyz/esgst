import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';

const

parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  request = common.request.bind(common)
  ;

class GiveawaysHiddenGamesManager extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button (`,
            [`i`, { class: `fa fa-eye-slash` }],
            ` `,
            [`i`, { class: `fa fa-plus-circle` }],
            ` `,
            [`i`, { class: `fa fa-times-circle` }],
            `) to your `,
            [`a`, { href: `https://www.steamgifts.com/account/settings/giveaways/filters` }, `giveaway filters`],
            ` page that allows you to add / remove games to / from your hidden list.`
          ]],
          [`li`, `You can add all your owned / ignored games with a single click.`],
          [`li`, `You can remove all your owned / wishlisted games with a single click.`]
        ]]
      ],
      id: `hgm`,
      name: `Hidden Games Manager`,
      sg: true,
      type: `giveaways`,
      features: {
        hgm_s: {
          name: `Automatically add / remove games from the list when syncing.`,
          sg: true
        }
      }
    };
  }

  init() {
    if (!window.location.pathname.match(/^\/account\/settings\/giveaways\/filters/)) return;
    let button = createHeadingButton({
      id: `hgm`,
      icons: [`fa-eye-slash`, `fa-plus-circle`, `fa-times-circle`],
      title: `Add / remove games to / from the list`
    });
    button.addEventListener(`click`, this.openPopup.bind(this, { button }));
  }

  openPopup(obj) {
    if (obj.popup) {
      obj.popup.open();
      return;
    }
    obj.popup = new Popup({ addScrollable: true, icon: `fa-plus fa-times`, title: `Add / remove hidden games:` });
    obj.result = createElements(obj.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `markdown`
      },
      type: `div`
    }]);
    obj.textArea = common.createElements_v2(obj.popup.description, `afterBegin`, [
      [`textarea`, { placeholder: `https://store.steampowered.com/app/400\nhttps://store.steampowered.com/sub/1280`}]
    ]);
    new ToggleSwitch(obj.popup.description, `hgm_addOwned`, false, `Add all owned games.`, false, false, null, gSettings.hgm_addOwned);
    new ToggleSwitch(obj.popup.description, `hgm_addIgnored`, false, `Add all ignored games.`, false, false, null, gSettings.hgm_addIgnored);
    new ToggleSwitch(obj.popup.description, `hgm_removeTextArea`, false, `Only remove games from text area.`, false, false, null, gSettings.hgm_removeTextArea);
    new ToggleSwitch(obj.popup.description, `hgm_removeOwned`, false, `Only remove owned games.`, false, false, null, gSettings.hgm_removeOwned);
    new ToggleSwitch(obj.popup.description, `hgm_removeWishlisted`, false, `Only remove wishlisted games.`, false, false, null, gSettings.hgm_removeWishlisted);
    obj.popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-arrow-circle-right`,
      icon2: `fa-plus`,
      title1: `Add`,
      title2: `Cancel`,
      callback1: this.startAdding.bind(this, obj),
      callback2: this.stop.bind(this, obj)
    }).set);
    obj.popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-arrow-circle-right`,
      icon2: `fa-times`,
      title1: `Remove`,
      title2: `Cancel`,
      callback1: this.startRemoving.bind(this, obj),
      callback2: this.stop.bind(this, obj)
    }).set);
    obj.popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-arrow-circle-down`,
      icon2: `fa-times`,
      title1: `Export`,
      title2: `Cancel`,
      callback1: this.startExporting.bind(this, obj),
      callback2: this.stop.bind(this, obj)
    }).set);
    obj.progress = createElements(obj.popup.description, `beforeEnd`, [{
      type: `div`
    }]);
    obj.popup.open();
  }

  async startAdding(obj) {
    if (obj.running) {
      return;
    }
    obj.running = true;
    obj.canceled = false;
    obj.button.classList.add(`esgst-busy`);
    createElements(obj.progress, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Adding games...`,
      type: `span`
    }]);
    obj.result.innerHTML = ``;
    
    const appIds = [];
    const subIds = [];

    obj.textArea.value
      .split(/\n/)
      .map(x => {
        const match = x.match(/(app|sub)\/(\d+)/);
        if (match) {
          const id = match[2];
          const type = `${match[1]}s`;
          const savedGame = this.esgst.games[type][id];
          if (!savedGame || !savedGame.hidden) {
            (type === `apps` ? appIds : subIds).push(id);
          }
        }
      });
    if (gSettings.hgm_addOwned) {
      appIds.push(...Object.keys(this.esgst.games.apps).filter(x => this.esgst.games.apps[x].owned && !this.esgst.games.apps[x].hidden));
    }
    if (gSettings.hgm_addIgnored) {
      appIds.push(...Object.keys(this.esgst.games.apps).filter(x => this.esgst.games.apps[x].ignored && !this.esgst.games.apps[x].hidden));
    }

    obj.hideObj = { appIds, subIds, update: message => obj.progress.textContent = message };

    const result = await common.hideGames(obj.hideObj);

    let message = ``;
    if (result.apps.length) {
      message += `The following apps were not found and therefore not hidden (they are most likely internal apps, such as demos, game editors etc): ${result.apps.join(`, `)}\n`;
    }
    if (result.subs.length) {
      message += `The following subs were not found and therefore not hidden: ${result.subs.join(`, `)}\n`;
    }
    if (message) {
      window.alert(message);
    }
    
    obj.button.classList.remove(`esgst-busy`);
    obj.progress.innerHTML = ``;
    obj.running = false;
  }

  startExporting(obj) {
    return this.startRemoving(obj, true);
  }

  async startRemoving(obj, exportOnly) {
    if (obj.running) {
      return;
    }
    obj.running = true;
    obj.canceled = false;
    obj.lastPage = ``;
    obj.button.classList.add(`esgst-busy`);
    createElements(obj.progress, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `${exportOnly ? `Exporting` : `Removing`} games...`,
      type: `span`
    }]);
    if (!exportOnly) {
      createElements(obj.result, `inner`, [{
        attributes: {
          class: `esgst-bold`
        },
        text: `Removed Games:`,
        type: `span`
      }]);
    }

    const appIds = [];
    const subIds = [];
    if (!exportOnly) {
      obj.textArea.value
        .split(/\n/)
        .map(x => {
          const match = x.match(/(app|sub)\/(\d+)/);
          if (match) {
            (match[1] === `app` ? appIds : subIds).push(match[2]);
          }
        });
    }

    const newGames = { apps: {}, subs: {} };
    
    let url = `/account/settings/giveaways/filters/search?page=`;
    let nextPage = 1;
    let pagination = null;
    do {
      let context = null;
      if (nextPage === this.esgst.currentPage) {
        context = document;
      } else if (document.getElementsByClassName(`esgst-es-page-${nextPage}`)[0]) {
        nextPage += 1;
        continue;
      } else {
        context = parseHtml((await request({ method: `GET`, url: `${url}${nextPage}` })).responseText);
      }
      if (!obj.lastPage) {
        obj.lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(context, context === document);
        obj.lastPage = obj.lastPage === 999999999 ? `` : ` of ${obj.lastPage}`;
      }
      createElements(obj.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `${exportOnly ? `Exporting` : `Removing`} games (page ${nextPage}${obj.lastPage})...`,
        type: `span`
      }]);
      let elements = context.getElementsByClassName(`table__row-outer-wrap`);
      for (let i = 0, n = elements.length; i < n; i++) {
        let element = elements[i];
        let info = await this.esgst.modules.games.games_getInfo(element);
        if (!info) continue;
        if (exportOnly) {
          (info.type === `apps` ? appIds : subIds).push(info.id);
          continue;
        }
        let game = this.esgst.games[info.type][info.id];
        if ((!gSettings.hgm_removeOwned || !game || !game.owned) && (!gSettings.hgm_removeWishlisted || !game || !game.wishlisted) && (!gSettings.hgm_removeTextArea || (info.type === `apps` ? appIds : subIds).indexOf(info.id) < 0) && (gSettings.hgm_removeOwned || gSettings.hgm_removeWishlisted || gSettings.hgm_removeTextArea)) {
          continue;
        }
        newGames[info.type][info.id] = { hidden: null };
        let button = element.getElementsByClassName(`table__remove-default`)[0];
        if (context === document) {
          button.dispatchEvent(new Event(`click`));
        } else {
          await request({
            data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${button.parentElement.querySelector(`[name="game_id"]`).value}`,
            method: `POST`,
            url: `/ajax.php`
          });
        }
        createElements(obj.result, `beforeEnd`, [{
          attributes: {
            href: `http://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}`
          },
          text: element.getElementsByClassName(`table__column__heading`)[0].textContent,
          type: `a`
        }]);
      }
      nextPage += 1;
      pagination = context.getElementsByClassName(`pagination__navigation`)[0];
    } while (!obj.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));

    if (exportOnly) {
      const file = [].concat(
        ...appIds.map(id => `https://store.steampowered.com/app/${id}`),
        ...subIds.map(id => `https://store.steampowered.com/sub/${id}`)
      ).join(`\n`);
      common.downloadFile(file, `steamgifts-hidden-games.txt`);
    } else {
      await common.lockAndSaveGames(newGames);

      if (obj.result.children.length === 1) {
        createElements(obj.result, `inner`, [{
          attributes: {
            class: `esgst-bold`
          },
          text: `0 games removed.`,
          type: `span`
        }]);
      }
    }
    obj.button.classList.remove(`esgst-busy`);
    obj.progress.innerHTML = ``;
    obj.running = false;
  }

  stop(obj) {
    obj.canceled = true;
    if (obj.hideObj) {
      obj.hideObj.canceled = true;
    }
    obj.button.classList.remove(`esgst-busy`);
    obj.progress.innerHTML = ``;
  }
}

const giveawaysHiddenGamesManager = new GiveawaysHiddenGamesManager();

export { giveawaysHiddenGamesManager };