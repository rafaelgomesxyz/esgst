import { Module } from '../class/Module';
import { Settings } from '../class/Settings';

class DiscussionPanels extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'discussionPanels',
		};
	}

	init() {
		if (
			(Settings.get('ct') && (this.esgst.giveawaysPath || this.esgst.discussionsPath)) ||
			(Settings.get('gdttt') &&
				(this.esgst.giveawaysPath ||
					this.esgst.discussionsPath ||
					this.esgst.discussionsTicketsTradesPath))
		) {
			this.esgst.endlessFeatures.push(
				this.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels.bind(
					this.esgst.modules.commentsCommentTracker
				)
			);
		}
	}
}

const discussionPanelsModule = new DiscussionPanels();

export { discussionPanelsModule };
