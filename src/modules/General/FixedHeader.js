import Module from '../../class/Module';

class GeneralFixedHeader extends Module {
info = ({
    description: `
      <ul>
        <li>Keeps the header of any page this.esgst.modules.generalAccurateTimestamp.at the top of the window while you scroll down the page.</li>
      </ul>
    `,
    id: `fh`,
    load: this.fh,
    name: `Fixed Header`,
    sg: true,
    st: true,
    type: `general`
  });

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

export default GeneralFixedHeader;