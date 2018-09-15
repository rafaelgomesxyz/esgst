import Module from '../class/Module';

class DiscussionPanels extends Module {
info = ({
    endless: true,
    id: `discussionPanels`,
    load: discussionPanels
  });

  discussionPanels() {
    if ((this.esgst.ct && (this.esgst.giveawaysPath || this.esgst.discussionsPath)) || (this.esgst.gdttt && (this.esgst.giveawaysPath || this.esgst.discussionsPath || this.esgst.discussionsTicketsTradesPath)) || (this.esgst.ust && this.esgst.ticketsPath)) {
      this.esgst.endlessFeatures.push(ct_addDiscussionPanels);
    }
  }
}

export default DiscussionPanels;