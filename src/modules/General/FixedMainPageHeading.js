import { Module } from '../../class/Module';

class GeneralFixedMainPageHeading extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Keeps the main page heading (usually the first heading of the page, for example, the heading that says "Giveaways" in the main page) of any page at the top of the window while you scroll down the page.`]
        ]]
      ],
      id: `fmph`,
      name: `Fixed Main Page Heading`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  init() {
    if (!this.esgst.mainPageHeading) {
      return;
    }

    this.esgst.style.insertAdjacentText("beforeend", `
      .esgst-fmph {
        top: ${this.esgst.pageTop}px;
      }
    `);

    this.esgst.mainPageHeading.classList.add(`esgst-fmph`);
  }
}

const generalFixedMainPageHeading = new GeneralFixedMainPageHeading();

export { generalFixedMainPageHeading };