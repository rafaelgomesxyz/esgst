import { Module } from '../class/Module';
import { Settings } from '../class/Settings';

class DiscussionPanels extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: 'discussionPanels'
    };
  }

  init() {
    if ((Settings.ct && (this.esgst.giveawaysPath || this.esgst.discussionsPath)) || (Settings.gdttt && (this.esgst.giveawaysPath || this.esgst.discussionsPath || this.esgst.discussionsTicketsTradesPath)) || (Settings.ust && this.esgst.ticketsPath)) {
      this.esgst.endlessFeatures.push(this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels.bind(this.esgst.modules.commentsCommentTracker));
    }
  }
}

const discussionPanelsModule = new DiscussionPanels();

export { discussionPanelsModule };