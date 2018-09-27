import Module from '../../class/Module';
import ButtonSet_v2 from '../../class/ButtonSet_v2';
import Popup from '../../class/Popup';
import ToggleSwitch from '../../class/ToggleSwitch';
import {utils} from '../../lib/jsUtils';
import {common} from '../Common';

const
  parseHtml = utils.parseHtml.bind(utils),
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  request = common.request.bind(common)
;

class GiveawaysHiddenGameRemover extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Adds a button (<i class="fa fa-eye-slash"></i> <i class="fa fa-times-circle"></i>) to your <a href="https://www.steamgifts.com/account/settings/giveaways/filters">giveaway filters</a> page that allows you to remove all of the games that you have hidden.</li>
        <li>There is also an option to remove only the games that you own.</li>
      </ul>
    `,
      id: `hgr`,
      load: this.hgr.bind(this),
      name: `Hidden Game Remover`,
      sg: true,
      type: `giveaways`
    };
  }

  hgr() {
    if (!location.pathname.match(/^\/account\/settings\/giveaways\/filters/)) return;
    let button = createHeadingButton({
      id: `hgr`,
      icons: [`fa-eye-slash`, `fa-times-circle`],
      title: `Remove games from the list`
    });
    button.addEventListener(`click`, this.hgr_openPopup.bind(this, {button}));
  }

  hgr_openPopup(hgr) {
    if (hgr.popup) {
      hgr.popup.open();
      return;
    }
    hgr.popup = new Popup(`fa-times`, `Remove hidden games:`);
    hgr.removed = createElements(hgr.popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `markdown`
      },
      type: `div`
    }]);
    new ToggleSwitch(hgr.popup.description, `hgr_removeOwned`, false, `Only remove owned games.`, false, false, `If disabled, all games will be removed.`, this.esgst.hgr_removeOwned);
    hgr.popup.description.appendChild(new ButtonSet_v2({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-arrow-circle-right`,
      icon2: `fa-times`,
      title1: `Remove`,
      title2: `Cancel`,
      callback1: this.hgr_startRemover.bind(null, hgr),
      callback2: this.hgr_stopRemover.bind(null, hgr)
    }).set);
    hgr.progress = createElements(hgr.popup.description, `beforeEnd`, [{
      type: `div`
    }]);
    hgr.popup.open();
  }

  async hgr_startRemover(hgr) {
    hgr.canceled = false;
    hgr.lastPage = ``;
    hgr.button.classList.add(`esgst-busy`);
    createElements(hgr.progress, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Removing games...`,
      type: `span`
    }]);
    createElements(hgr.removed, `inner`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `Removed Games:`,
      type: `span`
    }]);
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
        context = parseHtml((await request({method: `GET`, url: `${url}${nextPage}`})).responseText);
      }
      if (!hgr.lastPage) {
        hgr.lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(context);
        hgr.lastPage = hgr.lastPage === 999999999 ? `` : ` of ${hgr.lastPage}`;
      }
      createElements(hgr.progress, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }, {
        text: `Removing games (page ${nextPage}${hgr.lastPage})...`,
        type: `span`
      }]);
      let elements = context.getElementsByClassName(`table__row-outer-wrap`);
      for (let i = 0, n = elements.length; i < n; i++) {
        let element = elements[i];
        let info = this.esgst.modules.games.games_getInfo(element);
        if (!info) continue;
        let game = this.esgst.games[info.type][info.id];
        if (this.esgst.hgr_removeOwned && (!game || !game.owned)) continue;
        let button = element.getElementsByClassName(`table__remove-default`)[0];
        if (context === document) {
          button.dispatchEvent(new Event(`click`));
        } else {
          request({
            data: `xsrf_token=${this.esgst.xsrfToken}&do=remove_filter&game_id=${button.parentElement.querySelector(`[name="game_id"]`).value}`,
            method: `POST`,
            url: `/ajax.php`
          });
        }
        createElements(hgr.removed, `beforeEnd`, [{
          attributes: {
            href: `http://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}`
          },
          text: element.getElementsByClassName(`table__column__heading`)[0].textContent,
          type: `a`
        }]);
      }
      nextPage += 1;
      pagination = context.getElementsByClassName(`pagination__navigation`)[0];
    } while (!hgr.canceled && pagination && !pagination.lastElementChild.classList.contains(`is-selected`));
    hgr.button.classList.remove(`esgst-busy`);
    hgr.progress.innerHTML = ``;
    if (hgr.removed.children.length === 1) {
      createElements(hgr.removed, `inner`, [{
        attributes: {
          class: `esgst-bold`
        },
        text: `0 games removed.`,
        type: `span`
      }]);
    }
  }

  hgr_stopRemover(hgr) {
    hgr.canceled = true;
    hgr.button.classList.remove(`esgst-busy`);
    hgr.progress.innerHTML = ``;
  }
}

export default GiveawaysHiddenGameRemover;