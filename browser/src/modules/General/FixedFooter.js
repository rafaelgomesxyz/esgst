import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';

class GeneralFixedFooter extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Keeps the footer of any page at the bottom of the window while you scroll down the page.']
        ]]
      ],
      id: 'ff',
      name: 'Fixed Footer',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    if (!Shared.footer) {
      return;
    }

    Shared.footer.nodes.outer.classList.add('esgst-ff');
  }
}

const generalFixedFooter = new GeneralFixedFooter();

export { generalFixedFooter };