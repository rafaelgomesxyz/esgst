import { Module } from '../../class/Module';
import { gSettings } from '../../class/Globals';

class GiveawaysGiveawayEndTimeHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Allows you to highlight the end time of a giveaway (in any page) by coloring it based on how many hours there are left.`]
        ]]
      ],
      id: `geth`,
      name: `Giveaway End Time Highlighter`,
      sg: true,
      type: `giveaways`,
      featureMap: {
        giveaway: this.geth_getGiveaways.bind(this)
      }
    };
  }

  geth_getGiveaways(giveaways) {
    if (!gSettings.geth_colors.length) {
      return;
    }

    for (const giveaway of giveaways) {
      if (!giveaway.started) {
        continue;
      }

      const hoursLeft = (giveaway.endTime - Date.now()) / 3600000;
      for (let i = gSettings.geth_colors.length - 1; i > -1; i--) {
        const colors = gSettings.geth_colors[i];
        if (hoursLeft >= parseFloat(colors.lower) && hoursLeft <= parseFloat(colors.upper)) {
          (giveaway.endTimeColumn_gv || giveaway.endTimeColumn).style.color = colors.color;
          break;
        }
      }
    }
  }
}

const giveawaysGiveawayEndTimeHighlighter = new GiveawaysGiveawayEndTimeHighlighter();

export { giveawaysGiveawayEndTimeHighlighter };