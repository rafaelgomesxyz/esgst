import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';

class GeneralFixedSidebar extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Keeps the sidebar of any page at the left side of the window while you scroll down the page.']
        ]]
      ],
      id: 'fs',
      name: 'Fixed Sidebar',
      sg: true,
      type: 'general'
    };
  }

  init() {
    if (!this.esgst.sidebar) {
      return;
    }

    const top = this.esgst.pageTop + 25;
    this.esgst.style.insertAdjacentText("beforeend", `
      .esgst-fs {
        max-height: calc(100vh - ${top + 30 + (Settings.get('ff') ? 39 : 0)}px);
        top: ${top}px;
      }
    `);

    this.esgst.sidebar.classList.add('esgst-fs');
  }
}

const generalFixedSidebar = new GeneralFixedSidebar();

export { generalFixedSidebar };