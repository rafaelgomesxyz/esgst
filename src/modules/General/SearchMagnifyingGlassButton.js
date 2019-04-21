import { Module } from '../../class/Module';
import { gSettings } from '../../class/Globals';

class GeneralSearchMagnifyingGlassButton extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Turns the magnifying glass icon (`,
            [`i`, { class: `fa fa-search` }],
            `) in the search field of any page into a button that submits the search when you click on it.`
          ]]
        ]]
      ],
      id: `smgb`,
      name: `Search Magnifying Glass Button`,
      sg: true,
      type: `general`
    };
  }

  init() {
    let buttons, i;
    buttons = document.querySelectorAll(`.sidebar__search-container .fa-search, .esgst-qgs-container .fa-search`);
    for (i = buttons.length - 1; i > -1; --i) {
      let button, input;
      button = buttons[i];
      input = button.previousElementSibling;
      button.classList.add(`esgst-clickable`);
      button.addEventListener(`click`, () => {
        let value = input.value.trim();
        if (value) {
          if (gSettings.as && value.match(/"|id:/)) {
            this.esgst.modules.giveawaysArchiveSearcher.as_openPage(input);
          } else {
            window.location.href = `${this.esgst.searchUrl.replace(/page=/, ``)}q=${value}`;
          }
        }
      });
    }
  }
}

const generalSearchMagnifyingGlassButton = new GeneralSearchMagnifyingGlassButton();

export { generalSearchMagnifyingGlassButton };