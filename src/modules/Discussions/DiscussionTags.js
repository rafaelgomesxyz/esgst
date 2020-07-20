import { Tags } from '../Tags';

class DiscussionsDiscussionTags extends Tags {
	constructor() {
		super('dt');
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								`Adds a button (`,
								['i', { class: 'fa fa-tag' }],
								` ) next a discussion's title (in any page) that allows you to save tags for the discussion (only visible to you).`,
							],
						],
						['li', 'You can press Enter to save the tags.'],
						['li', 'Each tag can be colored individually.'],
						[
							'li',
							[
								`There is a button (`,
								['i', { class: 'fa fa-list' }],
								` ) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.`,
							],
						],
						[
							'li',
							[
								`Adds a button (`,
								['i', { class: 'fa fa-comments' }],
								' ',
								['i', { class: 'fa fa-tags' }],
								`) to the page heading of this menu that allows you to manage all of the tags that have been saved.`,
							],
						],
					],
				],
			],
			features: {
				dt_s: {
					name: 'Show tag suggestions while typing.',
					sg: true,
				},
			},
			id: 'dt',
			name: 'Discussion Tags',
			sg: true,
			type: 'discussions',
		};
	}

	init() {
		this.esgst.discussionFeatures.push(this.tags_addButtons.bind(this));
		// noinspection JSIgnoredPromiseFromCall
		this.tags_getTags();
	}
}

const discussionsDiscussionTags = new DiscussionsDiscussionTags();

export { discussionsDiscussionTags };
