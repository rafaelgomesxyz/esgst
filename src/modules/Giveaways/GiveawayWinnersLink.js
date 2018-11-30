import Module from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common)
  ;

class GiveawaysGiveawayWinnersLink extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a link next to an ended giveaway's "Entries" link (in any page) that shows how many winners the giveaway has and takes you to the giveaway's `,
            [`a`, { href: `https://www.steamgifts.com/giveaway/aeqw7/dead-space/winners` }, `winners`],
            ` page.`
          ]]
        ]]
      ],
      id: `gwl`,
      load: this.gwl,
      name: `Giveaway Winners Link`,
      sg: true,
      type: `giveaways`
    };
  }

  gwl() {
    this.esgst.giveawayFeatures.push(this.gwl_addLinks.bind(this));
  }

  gwl_addLinks(giveaways, main) {
    if (((!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath && !this.esgst.giveawayPath && !this.esgst.archivePath) || main) && (this.esgst.giveawayPath || this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.archivePath)) return;
    giveaways.forEach(giveaway => {
      if (giveaway.innerWrap.getElementsByClassName(`esgst-gwl`)[0] || !giveaway.ended) return;
      const attributes = {
        class: `esgst-gwl`,
        [`data-draggable-id`]: `winners_count`
      };
      if (giveaway.url) {
        attributes.href = `${giveaway.url}/winners`;
      }
      createElements(giveaway.entriesLink, `afterEnd`, [{
        attributes,
        type: `a`,
        children: [{
          attributes: {
            class: `fa fa-trophy`
          },
          type: `i`
        }, {
          text: `${Array.isArray(giveaway.winners) ? giveaway.winners.length : giveaway.winners} winners`,
          type: `span`
        }]
      }]);
    });
  }
}

export default GiveawaysGiveawayWinnersLink;