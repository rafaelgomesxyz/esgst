<<<<<<< HEAD:src/modules/Giveaways/PinnedGiveawaysButton.js
import Module from '../../class/Module';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common)
;

class GiveawaysPinnedGiveawaysButton extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Modifies the arrow button in the pinned giveaways box of the main page so that you are able to collapse the box again after expanding it.</li>
      </ul>
    `,
      id: `pgb`,
      load: this.pgb,
      name: `Pinned Giveaways Button`,
      sg: true,
      type: `giveaways`
    };
  }

  pgb() {
    let button = document.getElementsByClassName(`pinned-giveaways__button`)[0];
    if (!button) return;
    const container = button.previousElementSibling;
    container.classList.add(`esgst-pgb-container`);
    button.remove();
    button = createElements(container, `afterEnd`, [{
      attributes: {
        class: `esgst-pgb-button`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-pgb-icon fa fa-angle-down`
        },
        type: `i`
      }]
    }]);
    const icon = button.firstElementChild;
    button.addEventListener(`click`, this.pgb_toggle.bind(this, container, icon));
  }

  pgb_toggle(container, icon) {
    container.classList.toggle(`pinned-giveaways__inner-wrap--minimized`);
    icon.classList.toggle(`fa-angle-down`);
    icon.classList.toggle(`fa-angle-up`);
  }
}

export default GiveawaysPinnedGiveawaysButton;
=======
_MODULES.push({
    description: `
      <ul>
        <li>Modifies the arrow button in the pinned giveaways box of the main page so that you are able to collapse the box again after expanding it.</li>
      </ul>
    `,
    id: `pgb`,
    load: pgb,
    name: `Pinned Giveaways Button`,
    sg: true,
    type: `giveaways`
  });

  function pgb() {
    let button = document.getElementsByClassName(`pinned-giveaways__button`)[0];
    if (!button) return;
    const container = button.previousElementSibling;
    container.classList.add(`esgst-pgb-container`);
    button.remove();
    button = createElements(container, `afterEnd`, [{
      attributes: {
        class: `esgst-pgb-button`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-pgb-icon fa fa-angle-down`
        },
        type: `i`
      }]
    }]);
    const icon = button.firstElementChild;
    button.addEventListener(`click`, pgb_toggle.bind(null, container, icon));
  }

  function pgb_toggle(container, icon) {
    container.classList.toggle(`pinned-giveaways__inner-wrap--minimized`);
    icon.classList.toggle(`fa-angle-down`);
    icon.classList.toggle(`fa-angle-up`);
  }

>>>>>>> master:Extension/Modules/Giveaways/PinnedGiveawaysButton.js
