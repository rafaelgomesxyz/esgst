import Module from '../../class/Module';
import { common } from '../Common';

const
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class GeneralPaginationNavigationOnTop extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Moves the pagination navigation of any page to the main page heading of the page.`]
        ]]
      ],
      features: {
        pnot_s: {
          name: `Enable simplified view (will show only the numbers and arrows).`,
          sg: true,
          st: true
        }
      },
      id: `pnot`,
      load: this.pnot,
      name: `Pagination Navigation On Top`,
      sg: true,
      st: true,
      type: `general`
    };
  }

  pnot() {
    if (!this.esgst.paginationNavigation || !this.esgst.mainPageHeading) return;

    if (this.esgst.st) {
      this.esgst.paginationNavigation.classList.add(`page_heading_btn`);
    }
    if (this.esgst.pnot_s) {
      const elements = this.esgst.paginationNavigation.querySelectorAll(`span`);
      for (const element of elements) {
        element.textContent = element.textContent.replace(/[A-Za-z]+/g, ``);
      }
    }
    this.esgst.paginationNavigation.title = getFeatureTooltip(`pnot`);
    this.esgst.mainPageHeading.appendChild(this.esgst.paginationNavigation);
  }
}

export default GeneralPaginationNavigationOnTop;