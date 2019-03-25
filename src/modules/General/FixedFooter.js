import { Module } from '../../class/Module';

class GeneralFixedFooter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Keeps the footer of any page at the bottom of the window while you scroll down the page.`]
        ]]
      ],
      id: `ff`,
      load: this.ff,
      name: `Fixed Footer`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  ff() {
    if (!this.esgst.footer) {
      return;
    }

    this.esgst.footer.classList.add(`esgst-ff`);
  }
}

const generalFixedFooter = new GeneralFixedFooter();

export { generalFixedFooter };