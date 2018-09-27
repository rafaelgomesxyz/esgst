import Module from '../../class/Module';

class GeneralSameTabOpener extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Opens any link in the page in the same tab.</li>
      </ul>
    `,
      id: `sto`,
      load: this.sto,
      name: `Same Tab Opener`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  sto() {
    this.esgst.endlessFeatures.push(this.sto_setLinks);
  }

  sto_setLinks(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} [target="_blank"], .esgst-es-page-${endless}[target="_blank"]` : `[target="_blank"]`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      elements[i].removeAttribute(`target`);
    }
  }
}

export default GeneralSameTabOpener;