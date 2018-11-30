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
    this.esgst.paginationNavigation.title = getFeatureTooltip(`pnot`);
    this.esgst.mainPageHeading.appendChild(this.esgst.paginationNavigation);
  }
}

export default GeneralPaginationNavigationOnTop;