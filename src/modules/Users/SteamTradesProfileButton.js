import Module from '../../class/Module';

class UsersSteamTradesProfileButton extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a button next to the "Visit Steam Profile" button of a user's <a href="https://www.steamgifts.com/user/cg">profile</a> page that allows you to go to their SteamTrades profile page.</li>
      </ul>
    `,
    id: `stpb`,
    load: this.stpb,
    name: `SteamTrades Profile Button`,
    sg: true,
    type: `users`
  });

  stpb() {
    this.esgst.profileFeatures.push(stpb_add);
  }

  stpb_add(profile) {
    let button, tooltip;
    button = this.esgst.modules.common.createElements(profile.steamButtonContainer.firstElementChild, `beforeEnd`, [{
      attributes: {
        class: `esgst-stpb-button`,
        href: `https://www.steamtrades.com/user/${profile.steamId}`,
        rel: `nofollow`,
        target: `_blank`,
        title: this.esgst.modules.common.getFeatureTooltip(`stpb`)
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
      button.addEventListener(`mouseenter`, this.stpb_show.bind(null, button, tooltip));
      button.addEventListener(`mouseleave`, this.esgst.modules.common.setSiblingsOpacity.bind(null, button, `1`));
    }
  }

  stpb_show(button, tooltip) {
    tooltip.textContent = `Visit SteamTrades Profile`;
    this.esgst.modules.common.setSiblingsOpacity(button, `0.2`);
  }
}

export default UsersSteamTradesProfileButton;