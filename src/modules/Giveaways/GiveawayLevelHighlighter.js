import { Module } from '../../class/Module';
import { gSettings } from '../../class/Globals';

class GiveawaysGiveawayLevelHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Highlights the level of a giveaway (in any page) by coloring it with the specified colors.`]
        ]]
      ],
      featureMap: {
        giveaway: this.highlight.bind(this)
      },
      id: `glh`,
      name: `Giveaway Level Highlighter`,
      sg: true,
      type: `giveaways`
    };
  }

  highlight(giveaways) {
    for (const giveaway of giveaways) {
      if (!giveaway.levelColumn) {
        continue;
      }
      const { color, bgColor } = gSettings.glh_colors.filter(colors => giveaway.level >= parseInt(colors.lower) && giveaway.level <= parseInt(colors.upper))[0] || { color: undefined, bgColor: undefined };
      if (!color || !bgColor) {
        continue;
      }
      giveaway.levelColumn.setAttribute(`style`, `${color ? `color: ${color} !important;` : ``}${bgColor ? `background-color: ${bgColor};` : ``}`);
      giveaway.levelColumn.classList.add(`esgst-glh-highlight`);
    }
  }
}

const giveawaysGiveawayLevelHighlighter = new GiveawaysGiveawayLevelHighlighter();

export { giveawaysGiveawayLevelHighlighter };