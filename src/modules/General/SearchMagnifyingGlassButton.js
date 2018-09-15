import Module from '../../class/Module';

class GeneralSearchMagnifyingGlassButton extends Module {
info = ({
    description: `
      <ul>
        <li>Turns the magnifying glass icon (<i class="fa fa-search"></i>) in the search field of any page into a button that submits the search when you click on it.</li>
      </ul>
    `,
    id: `smgb`,
    load: this.smgb,
    name: `Search Magnifying Glass Button`,
    sg: true,
    type: `general`
  });

  smgb() {
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
          location.href = `${this.esgst.searchUrl.replace(/page=/, ``)}q=${value}`;
        }
      });
    }
  }
}

export default GeneralSearchMagnifyingGlassButton;