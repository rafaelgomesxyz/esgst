import Module from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GiveawaysQuickGiveawaySearch extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Adds a search box before the "Giveaways" box at the header of any page that allows you to quickly search for giveaways from any page.`],
          [`li`, `Has[id=ags] built-in.`]
        ]]
      ],
      features: {
        qgs_h: {
          name: `Hide the native search on the main page.`,
          sg: true
        }
      },
      id: `qgs`,
      load: this.qgs,
      name: `Quick Giveaway Search`,
      options: {
        title: `Position:`,
        values: [`Left`, `Right`]
      },
      sg: true,
      type: `giveaways`
    };
  }

  qgs() {
    let container = createElements(document.getElementsByClassName(`nav__left-container`)[0], this.esgst.qgs_index === 0 ? `afterBegin` : `beforeEnd`, [{
      attributes: {
        class: `esgst-qgs-container`,
        title: getFeatureTooltip(`qgs`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-qgs-input`,
          placeholder: `Search...`,
          type: `text`
        },
        type: `input`
      }, {
        attributes: {
          class: `fa fa-search`
        },
        type: `i`
      }]
    }]);
    container.addEventListener(`mouseenter`, this.qgs_expand.bind(this));
    container.addEventListener(`mouseleave`, this.qgs_collapse.bind(this));
    container.firstElementChild.addEventListener(`keypress`, this.qgs_trigger.bind(this));
    if (this.esgst.qgs_h && this.esgst.giveawaysPath) {
      document.getElementsByClassName(`sidebar__search-container`)[0].remove();
    }
  }

  qgs_expand(event) {
    event.currentTarget.classList.add(`esgst-qgs-container-expanded`);
  }

  qgs_collapse(event) {
    if (event.relatedTarget && event.relatedTarget.closest(`.esgst-popout`)) return;
    event.currentTarget.classList.remove(`esgst-qgs-container-expanded`);
  }

  qgs_trigger(event) {
    if (event.key !== `Enter`) return;
    event.preventDefault();
    window.location.href = `/giveaways/search?q=${encodeURIComponent(event.currentTarget.value)}`;
  }
}

export default GiveawaysQuickGiveawaySearch;