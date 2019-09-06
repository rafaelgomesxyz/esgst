import { Module } from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common)
  ;

class GiveawaysCommunityWishlistSearchLink extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Turns the numbers in the "Giveaways" column of any `,
            [`a`, { href: `https://www.steamgifts.com/giveaways/wishlist` }, `community wishlist`],
            ` page into links that allow you to search for all of the active giveaways for the game (that are visible to you).<`
          ]]
        ]]
      ],
      id: `cwsl`,
      name: `Community Wishlist Search Link`,
      sg: true,
      type: `giveaways`
    };
  }

  init() {
    if (this.esgst.wishlistPath) {
      this.esgst.gameFeatures.push(this.cwsl_getGames.bind(this));
    }
  }

  cwsl_getGames(games, main) {
    if (!main) {
      return;
    }
    for (const game of games.all) {
      let giveawayCount = game.heading.parentElement.nextElementSibling.nextElementSibling;
      createElements(giveawayCount, `inner`, [{
        attributes: {
          class: `table__column__secondary-link`,
          href: `/giveaways/search?${game.type.slice(0, -1)}=${game.id}`
        },
        type: `a`,
        children: [...(Array.from(giveawayCount.childNodes).map(x => {
          return {
            context: x
          };
        }))]
      }]);
    }
  }
}

const giveawaysCommunityWishlistSearchLink = new GiveawaysCommunityWishlistSearchLink();

export { giveawaysCommunityWishlistSearchLink };