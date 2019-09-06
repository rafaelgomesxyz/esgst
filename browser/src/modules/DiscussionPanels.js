import { Module } from '../class/Module';
import { gSettings } from '../class/Globals';

class DiscussionPanels extends Module {
  constructor() {
    super();
    this.info = {
      endless: true,
      id: `discussionPanels`
    };
  }

  init() {
    if ((gSettings.ct && (this.esgst.giveawaysPath || this.esgst.discussionsPath)) || (gSettings.gdttt && (this.esgst.giveawaysPath || this.esgst.discussionsPath || this.esgst.discussionsTicketsTradesPath)) || (gSettings.ust && this.esgst.ticketsPath)) {
      this.esgst.endlessFeatures.push(this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels.bind(this.esgst.modules.commentsCommentTracker));
    }
  }
}

const discussionPanelsModule = new DiscussionPanels();

export { discussionPanelsModule };