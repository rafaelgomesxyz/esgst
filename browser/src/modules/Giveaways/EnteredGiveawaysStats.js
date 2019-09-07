import { Module } from '../../class/Module';
import {common} from '../Common';
import { gSettings } from '../../class/Globals';

class GiveawaysEnteredGiveawaysStats extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Allows you to see stats for your entered giveaways in the sidebar of the entered page.`]
        ]]
      ],
      features: {
        egs_e: {
          name: `Include ended giveaways in the stats.`,
          sgPaths: `My Giveaways - Entered`,
          sg: true
        }
      },
      id: 'egs',
      name: `Entered Giveaways Stats`,
      sg: true,
      sgPaths: `My Giveaways - Entered`,
      type: 'giveaways'
    };
  }

  init() {
    if (!this.esgst.enteredPath) {
      return;
    }
    common.createSidebarNavigation(this.esgst.sidebar, 'beforeEnd', {
      name: `Entered Giveaways Stats`,
      items: [
        {
          id: 'egs_chance',
          name: `Average Chance`,
          count: 0
        },
        {
          id: 'egs_level',
          name: `Average Level`,
          count: 0
        },
        {
          id: 'egs_entries',
          name: `Average Entries`,
          count: 0
        },
        {
          id: 'egs_points',
          name: `Average Points Spent`,
          count: 0
        },
        {
          id: 'egs_simple_points',
          name: `Total Points Spent`,
          count: 0
        }
      ]
    });
    const obj = {
      counters: {
        chance: 0.0,
        level: 0.0,
        entries: 0.0,
        points: 0
      },
      simpleCounters: {
        points: 0
      },
      elements: {},
      total: 0
    };
    for (const key in obj.counters) {
      obj.elements[key] = document.querySelector(`#egs_${key}`).querySelector(`.sidebar__navigation__item__count`);
    }
    for (const key in obj.simpleCounters) {
      obj.elements[`simple_${key}`] = document.querySelector(`#egs_simple_${key}`).querySelector(`.sidebar__navigation__item__count`);
    }
    this.esgst.giveawayFeatures.push((giveaways, main) => this.addStats(obj, giveaways, main));
  }

  addStats(obj, giveaways, main) {
    if (!main) {
      return;
    }
    for (const giveaway of giveaways) {
      if (!giveaway.ended || gSettings.egs_e) {
        for (const key in obj.counters) {
          obj.counters[key] += giveaway[key];
        }
        for (const key in obj.simpleCounters) {
          obj.simpleCounters[key] += giveaway[key];
        }
        obj.total += 1;
      }
    }
    for (const key in obj.counters) {
      obj.elements[key].textContent = common.round(obj.counters[key] / obj.total);
    }
    for (const key in obj.simpleCounters) {
      obj.elements[`simple_${key}`].textContent = obj.simpleCounters[key];
    }
  }
}

const giveawaysEnteredGiveawaysStats = new GiveawaysEnteredGiveawaysStats();

export { giveawaysEnteredGiveawaysStats };