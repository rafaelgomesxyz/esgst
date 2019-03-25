import { Module } from '../../class/Module';

class GeneralFixedHeader extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Keeps the header of any page at the top of the window while you scroll down the page.`]
        ]]
      ],
      id: `fh`,
      load: this.fh,
      name: `Fixed Header`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  fh() {
    if (!this.esgst.header) {
      return;
    }

    this.esgst.header.classList.add(`esgst-fh`);
    const height = this.esgst.header.offsetHeight;
    this.esgst.pageTop += height;
    this.esgst.commentsTop += height;
  }
}

const generalFixedHeader = new GeneralFixedHeader();

export { generalFixedHeader };