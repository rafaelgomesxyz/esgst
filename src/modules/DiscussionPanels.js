import Module from '../class/Module';

class DiscussionPanels extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `discussionPanels`,
      load: this.discussionPanels
    };
  }

  discussionPanels() {
    if ((this.esgst.ct && (this.esgst.giveawaysPath || this.esgst.discussionsPath)) || (this.esgst.gdttt && (this.esgst.giveawaysPath || this.esgst.discussionsPath || this.esgst.discussionsTicketsTradesPath)) || (this.esgst.ust && this.esgst.ticketsPath)) {
      this.esgst.endlessFeatures.push(this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels.bind(this.esgst.modules.commentsCommentTracker));
    }
  }
}

export default DiscussionPanels;