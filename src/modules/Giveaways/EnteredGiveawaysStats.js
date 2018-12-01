import Module from '../../class/Module';
import {common} from '../Common';

class GiveawaysEnteredGiveawaysStats extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to see stats for your currently active entered giveaways in the sidebar of the entered page.`]
        ]]
      ],
      id: `egs`,
      name: `Entered Giveaways Stats`,
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    common.createSidebarNavigation(this.esgst.sidebar, `beforeEnd`, {
      name: `Active Giveaways Stats`,
      items: [
        {
          id: `egs_chance`,
          name: `Average Chance`,
          count: 0
        },
        {
          id: `egs_level`,
          name: `Average Level`,
          count: 0
        },
        {
          id: `egs_entries`,
          name: `Average Entries`,
          count: 0
        }
      ]
    });
    const obj = {
      counters: {
        chance: 0.0,
        level: 0.0,
        entries: 0.0
      },
      elements: {},
      total: 0
    };
    for (const key in obj.counters) {
      obj.elements[key] = document.querySelector(`#egs_${key}`).querySelector(`.sidebar__navigation__item__count`);
    }
    this.esgst.giveawayFeatures.push((giveaways, main) => this.addStats(obj, giveaways, main));
  }

  addStats(obj, giveaways, main) {
    if (!main) {
      return;
    }
    for (const giveaway of giveaways) {
      if (!giveaway.ended) {
        for (const key in obj.counters) {
          obj.counters[key] += giveaway[key];
        }
        obj.total += 1;
      }
    }
    for (const key in obj.counters) {
      obj.elements[key].textContent = common.round(obj.counters[key] / obj.total);
    }
  }
}

export default GiveawaysEnteredGiveawaysStats;