import { Module } from '../../class/Module';
import dateFns_format from 'date-fns/format';
import {common} from '../Common';
import { gSettings } from '../../class/Globals';
import { DOM } from '../../class/DOM';

class GeneralPageLoadTimestamp extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Adds a timestamp indicating when the page was loaded to any page, in the preferred location.`]
        ]]
      ],
      id: 'plt',
      name: 'Page Load Timestamp',
      inputItems: [
        {
          id: 'plt_format',
          prefix: `Timestamp format: `,
          tooltip: `ESGST uses date-fns v2.0.0-alpha.25, so check the accepted tokens here: https://date-fns.org/v2.0.0-alpha.25/docs/Getting-Started.`
        }
      ],
      options: {
        title: `Position:`,
        values: ['Sidebar', 'Footer']
      },
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    const timestamp = dateFns_format(Date.now(), (gSettings.plt_format || `MMM dd, yyyy, HH:mm:ss`));
    switch (gSettings.plt_index) {
      case 0:
        if (this.esgst.sidebar) {
          DOM.build(this.esgst.sidebar, 'afterBegin', [
            ['span', { class: 'esgst-plt' }, [
              ['h3', { class: 'sidebar__heading' }, 'Page Load Timestamp'],
              ['div', { class: 'sidebar__navigation' }, timestamp]
            ]]
          ]);
          break;
        }
      case 1:
        if (!this.esgst.footer) {
          return;
        }
        DOM.build(this.esgst.footer.firstElementChild.firstElementChild, 'beforeEnd', [
          ['span', { class: 'esgst-plt' }, [
            ['span', { class: 'esgst-bold' }, `Page Load Timestamp: `],
            ['span', timestamp]
          ]]
        ]);
        break;
    }
  }
}

const generalPageLoadTimestamp = new GeneralPageLoadTimestamp();

export { generalPageLoadTimestamp };