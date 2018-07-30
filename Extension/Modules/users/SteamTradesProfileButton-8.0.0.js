_MODULES.push({
    description: `
      <ul>
        <li>Adds a button next to the "Visit Steam Profile" button of a user's <a href="https://www.steamgifts.com/user/cg">profile</a> page that allows you to go to their SteamTrades profile page.</li>
      </ul>
    `,
    id: `stpb`,
    load: stpb,
    name: `SteamTrades Profile Button`,
    sg: true,
    type: `users`
  });

  function stpb() {
    esgst.profileFeatures.push(stpb_add);
  }

  function stpb_add(profile) {
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
            src: esgst.stIcon
          },
          type: `img`
        }]
      }]
    }]);
    tooltip = profile.steamButtonContainer.getElementsByClassName(`js-tooltip`)[0];
    if (tooltip) {
      button.addEventListener(`mouseenter`, stpb_show.bind(null, button, tooltip));
      button.addEventListener(`mouseleave`, setSiblingsOpacity.bind(null, button, `1`));
    }
  }

  function stpb_show(button, tooltip) {
    tooltip.textContent = `Visit SteamTrades Profile`;
    setSiblingsOpacity(button, `0.2`);
  }

