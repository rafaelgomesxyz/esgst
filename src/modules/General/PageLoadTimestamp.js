import Module from '../../class/Module';
import dateFns_format from 'date-fns/format';
import {common} from '../Common';

class GeneralPageLoadTimestamp extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Adds a timestamp indicating when the page was loaded to any page, in the preferred location.`]
        ]]
      ],
      id: `plt`,
      name: `Page Load Timestamp`,
      inputItems: [
        {
          id: `plt_format`,
          prefix: `Timestamp format: `,
          tooltip: `ESGST uses date-fns v2.0.0-alpha.25, so check the accepted tokens here: https://date-fns.org/v2.0.0-alpha.25/docs/Getting-Started.`
        }
      ],
      options: {
        title: `Position:`,
        values: [`Sidebar`, `Footer`]
      },
      sg: true,
      st: true,
      type: `general`
    };
  }

  init() {
    const items = [
      [`span`, { class: `esgst-plt` }, `This page was loaded on ${dateFns_format(Date.now(), (this.esgst.plt_format || `MMM dd, yyyy, HH:mm:ss`))}.`]
    ];
    switch (this.esgst.plt_index) {
      case 0:
        if (this.esgst.sidebar) {
          common.createElements_v2(this.esgst.sidebar, `afterBegin`, items);
          break;
        }
      case 1:
        if (!this.esgst.footer) {
          return;
        }
        common.createElements_v2(this.esgst.footer.firstElementChild.firstElementChild, `beforeEnd`, items);
        break;
    }
  }
}

export default GeneralPageLoadTimestamp;