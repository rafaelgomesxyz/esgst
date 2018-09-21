import Module from '../../class/Module';

class GiveawaysGiveawayCopyHighlighter extends Module {
  info = ({
    description: `
      <ul>
        <li>Highlights the number of copies next a giveaway's game name (in any page) by coloring it as red and changing the font to bold.</li>
      </ul>
    `,
    id: `gch`,
    name: `Giveaway Copy Highlighter`,
    sg: true,
    type: `giveaways`
  });
}

export default GiveawaysGiveawayCopyHighlighter;