import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';

class DiscussionsReversedActiveDiscussions extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							'Reverses the active discussions (in the main page) so that discussions come before deals (original order).',
						],
					],
				],
			],
			id: 'rad',
			name: 'Reversed Active Discussions',
			sg: true,
			sgPaths: /^Browse\sGiveaways/,
			type: 'discussions',
		};
	}

	async init() {
		if (!Shared.esgst.giveawaysPath || !Shared.esgst.activeDiscussions || Settings.get('oadd')) {
			return;
		}
		Shared.esgst.activeDiscussions.insertBefore(
			Shared.esgst.activeDiscussions.lastElementChild,
			Shared.esgst.activeDiscussions.firstElementChild
		);
	}
}

const discussionsReversedActiveDiscussions = new DiscussionsReversedActiveDiscussions();

export { discussionsReversedActiveDiscussions };
