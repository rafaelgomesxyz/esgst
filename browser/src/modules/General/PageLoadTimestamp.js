import { Module } from '../../class/Module';
import dateFns_format from 'date-fns/format';
import {common} from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';
import { Shared } from '../../class/Shared';

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
    const timestamp = dateFns_format(Date.now(), (Settings.plt_format || `MMM dd, yyyy, HH:mm:ss`));
    switch (Settings.plt_index) {
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
      case 1: {
        if (!Shared.footer) {
          return;
        }

        const linkContainer = Shared.footer.addLinkContainer({
          name: `Page loaded on ${timestamp}`,
          side: 'left',
        });

        linkContainer.nodes.outer.classList.add('esgst-plt');

        break;
      }
    }
  }
}

const generalPageLoadTimestamp = new GeneralPageLoadTimestamp();

export { generalPageLoadTimestamp };