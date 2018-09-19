_MODULES.push({
    description: `
      <ul>
        <li>Removes SteamGifts' default fade for entered giveaways.</li>
      </ul>
    `,
    id: `ueg`,
    load: ueg,
    name: `Unfaded Entered Giveaway`,
    sg: true,
    type: `giveaways`
  });

  function ueg() {
    esgst.endlessFeatures.push(ueg_remove);
  }

  function ueg_remove(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .giveaway__row-inner-wrap.is-faded, .esgst-es-page-${endless}.giveaway__row-inner-wrap.is-faded` : `.giveaway__row-inner-wrap.is-faded`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      elements[i].classList.add(`esgst-ueg`);
    }
  }

