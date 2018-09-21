import Module from '../../class/Module';

class GiveawaysUnfadedEnteredGiveaway extends Module {
  info = ({
    description: `
      <ul>
        <li>Removes SteamGifts' default fade for entered giveaways.</li>
      </ul>
    `,
    id: `ueg`,
    load: this.ueg,
    name: `Unfaded Entered Giveaway`,
    sg: true,
    type: `giveaways`
  });

  ueg() {
    this.esgst.endlessFeatures.push(this.ueg_remove);
  }

  ueg_remove(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .giveaway__row-inner-wrap.is-faded, .esgst-es-page-${endless}.giveaway__row-inner-wrap.is-faded` : `.giveaway__row-inner-wrap.is-faded`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      elements[i].classList.add(`esgst-ueg`);
    }
  }
}

export default GiveawaysUnfadedEnteredGiveaway;