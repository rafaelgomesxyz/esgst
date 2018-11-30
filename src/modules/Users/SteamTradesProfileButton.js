import Module from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  setSiblingsOpacity = common.setSiblingsOpacity.bind(common)
  ;

class UsersSteamTradesProfileButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a button next to the "Visit Steam Profile" button of a user's `
            [`a`, { href: `https://www.steamgifts.com/user/cg` }, `profile`],
            ` page that allows you to go to their SteamTrades profile page.`
          ]]
        ]]
      ],
      id: `stpb`,
      load: this.stpb,
      name: `SteamTrades Profile Button`,
      sg: true,
      type: `users`
    };
  }

  stpb() {
    this.esgst.profileFeatures.push(this.stpb_add.bind(this));
  }

  stpb_add(profile) {
    let button, tooltip;
    button = createElements(profile.steamButtonContainer.firstElementChild, `beforeEnd`, [{
      attributes: {
        class: `esgst-stpb-button`,
        href: `https://www.steamtrades.com/user/${profile.steamId}`,
        rel: `nofollow`,
        target: `_blank`,
        title: getFeatureTooltip(`stpb`)
      },
      type: `a`,
      children: [{
        attributes: {
          class: `fa fa-fw`
        },
        type: `i`,
        children: [{
          attributes: {
            src: this.esgst.stIcon
          },
          type: `img`
        }]
      }]
    }]);
    tooltip = profile.steamButtonContainer.getElementsByClassName(`js-tooltip`)[0];
    if (tooltip) {
      button.addEventListener(`mouseenter`, this.stpb_show.bind(this, button, tooltip));
      button.addEventListener(`mouseleave`, setSiblingsOpacity.bind(common, button, `1`));
    }
  }

  stpb_show(button, tooltip) {
    tooltip.textContent = `Visit SteamTrades Profile`;
    setSiblingsOpacity(button, `0.2`);
  }
}

export default UsersSteamTradesProfileButton;