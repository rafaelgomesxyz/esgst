import Module from '../../class/Module';
import {common} from '../Common';

const
  {
    createElements,
    getFeatureTooltip,
    unhideGame
  } = common
;

class GiveawaysUnhideGiveawayButton extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-eye"></i>) next to a giveaway's game name (in any page), if you have hidden the game on SteamGifts, that allows you to unhide the game without having to access your <a href="https://www.steamgifts.com/account/settings/giveaways/filters">giveaway filters</a> page.</li>
      </ul>
    `,
    id: `ugb`,
    load: this.ugb,
    name: `Unhide Giveaway Button`,
    sg: true,
    type: `giveaways`
  });

  ugb() {
    this.esgst.giveawayFeatures.push(this.ugb_add);
  }

  ugb_add(giveaways, main) {
    giveaways.forEach(giveaway => {
      let hideButton = giveaway.innerWrap.querySelector(`.giveaway__hide, .featured__giveaway__hide`);
      if (!hideButton && (!main || this.esgst.giveawaysPath || this.esgst.giveawayPath)) {
        if (this.esgst.giveawayPath && main) {
          hideButton = createElements(giveaway.headingName.parentElement, `beforeEnd`, [{
            type: `a`,
            children: [{
              attributes: {
                class: `fa fa-eye giveaway__hide`,
                title: getFeatureTooltip(`ugb`, `Unhide all giveaways for this game`)
              },
              type: `i`
            }]
          }]);
        } else {
          hideButton = createElements(giveaway.headingName.parentElement, `beforeEnd`, [{
            attributes: {
              class: `fa fa-eye giveaway__hide giveaway__icon`,
              title: getFeatureTooltip(`ugb`, `Unhide all giveaways for this game`)
            },
            type: `i`
          }]);
        }
        hideButton.addEventListener(`click`, unhideGame.bind(null, hideButton, giveaway.gameId, giveaway.name, giveaway.id, giveaway.type));
      }
    });
  }
}

export default GiveawaysUnhideGiveawayButton;