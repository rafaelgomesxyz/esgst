import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';

class GiveawaysGiveawayCopyHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Highlights the number of copies next a giveaway's game name (in any page) by coloring it as red and changing the font to bold.`]
        ]]
      ],
      featureMap: {
        giveaway: this.highlight.bind(this)
      },
      id: 'gch',
      name: 'Giveaway Copy Highlighter',
      sg: true,
      type: 'giveaways'
    };
  }

  highlight(giveaways) {
    for (const giveaway of giveaways) {
      if (!giveaway.copiesContainer) {
        continue;
      }
      const { color, bgColor } = Settings.get('gch_colors').filter(colors => giveaway.copies >= parseInt(colors.lower) && giveaway.copies <= parseInt(colors.upper))[0] || { color: undefined, bgColor: undefined };
      giveaway.copiesContainer.classList.add('esgst-bold');
      if (!color) {
        giveaway.copiesContainer.classList.add('esgst-red');
        continue;
      }
      giveaway.copiesContainer.style.color = color;
      if (!bgColor) {
        continue;
      }
      giveaway.copiesContainer.classList.add('esgst-gch-highlight');
      giveaway.copiesContainer.style.backgroundColor = bgColor;
    }
  }
}

const giveawaysGiveawayCopyHighlighter = new GiveawaysGiveawayCopyHighlighter();

export { giveawaysGiveawayCopyHighlighter };