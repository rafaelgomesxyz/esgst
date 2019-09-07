import { Module } from '../../class/Module';

class GeneralNarrowSidebar extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', 'Keeps the sidebar narrowed in all pages.']
        ]]
      ],
      id: 'ns',
      name: 'Narrow Sidebar',
      sg: true,
      type: 'general'
    };
  }

  init() {
    if (!this.esgst.sidebar) return;
    this.esgst.sidebar.classList.remove('sidebar--wide');
    this.esgst.sidebar.classList.add('esgst-ns');
  }
}

const generalNarrowSidebar = new GeneralNarrowSidebar();

export { generalNarrowSidebar };