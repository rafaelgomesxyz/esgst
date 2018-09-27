import Module from '../../class/Module';
import {common} from '../Common';

const
  goToComment = common.goToComment.bind(common)
;

class DiscussionsMainPostSkipper extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Skips to the comments of a discussion if you have used the pagination navigation. For example, if you enter a discussion and use the pagination navigation to go to page 2, on page 2 the feature will skip the main post and take you directly to the comments.</li>
      </ul>
    `,
      id: `mps`,
      load: this.mps.bind(this),
      name: `Main Post Skipper`,
      sg: true,
      type: `discussions`
    };
  }

  mps() {
    if (!location.hash && this.esgst.discussionPath && this.esgst.paginationNavigation && document.referrer.match(new RegExp(`/discussion/${[location.pathname.match(/^\/discussion\/(.+?)\//)[1]]}/`))) {
      goToComment(``, this.esgst.pagination.previousElementSibling.firstElementChild.firstElementChild, true);
    }
  }
}

export default DiscussionsMainPostSkipper;