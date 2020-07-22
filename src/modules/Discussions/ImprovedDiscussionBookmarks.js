import { Button } from '../../class/Button';
import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Popup } from '../../class/Popup';
import { FetchRequest } from '../../class/FetchRequest';
import { Session } from '../../class/Session';

class DiscussionsImprovedDiscussionBookmarks extends Module {
	constructor() {
		super();

		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								'Replaces the native ',
								['i', { class: 'fa fa-bookmark' }],
								' button if the discussion is bookmarked and adds a ',
								['i', { class: 'fa fa-bookmark-o' }],
								" button if it is not, next to a discussion's title (in any page) that allows you to add / remove the discussion to / from SteamGifts' native bookmark list.",
							],
						],
						['li', 'Bookmarked discussions have a green background.'],
					],
				],
			],
			features: {
				idb_t: {
					name: 'Pin any bookmarked discussions in the page.',
					sg: true,
				},
			},
			id: 'idb',
			name: 'Improved Discussion Bookmarks',
			sg: true,
			type: 'discussions',
		};
	}

	init() {
		const highlightedDiscussions = {};

		for (const code in Shared.esgst.discussions) {
			const discussion = Shared.esgst.discussions[code];

			if (discussion.highlighted) {
				highlightedDiscussions[code] = {
					highlighted: null,
				};
			}
		}

		const numHighlightedDiscussions = Object.keys(highlightedDiscussions).length;

		if (numHighlightedDiscussions > 0) {
			const popup = new Popup({
				addProgress: true,
				icon: 'fa-exchange',
				isTemp: true,
				title:
					'Discussion Highlighter has been renamed to Improved Discussion Bookmarks because the ability to bookmark discussions has been added to SteamGifts, so ESGST no longer handles the data. Do you want to transfer the discussions you had previously highlighted to the SteamGifts bookmark list or do you want to delete them from your data?',
				buttons: [
					{
						color1: 'green',
						color2: 'grey',
						icon1: 'fa-check',
						icon2: 'fa-circle-o-notch fa-spin',
						title1: 'Transfer',
						title2: 'Transfering...',
						callback1: async () => {
							let current = 1;

							for (const code in highlightedDiscussions) {
								await this.bookmarkDiscussion(code);

								popup.setProgress(
									`${current++} of ${numHighlightedDiscussions} discussions transferred...`
								);
							}

							await Shared.common.lockAndSaveDiscussions(highlightedDiscussions);

							popup.close();
						},
					},
					{
						color1: 'red',
						color2: 'grey',
						icon1: 'fa-times',
						icon2: 'fa-circle-o-notch fa-spin',
						title1: 'Delete',
						title2: 'Deleting...',
						callback1: async () => {
							await Shared.common.lockAndSaveDiscussions(highlightedDiscussions);

							popup.close();
						},
					},
				],
			});
			popup.open();
		}

		Shared.esgst.discussionFeatures.push(this.addButtons.bind(this));
	}

	async addButtons(discussions, main) {
		for (const discussion of discussions) {
			if (discussion.idbButton) {
				continue;
			}

			const context =
				main && Shared.esgst.discussionPath ? discussion.heading : discussion.outerWrap;

			let index = 0;

			if (discussion.bookmarked) {
				await this.bookmarkDiscussion(null, context);

				if (Settings.get('idb_t') && main && Shared.esgst.discussionsPath) {
					discussion.outerWrap.parentElement.insertBefore(
						discussion.outerWrap,
						discussion.outerWrap.parentElement.firstElementChild
					);
					discussion.isPinned = true;
				}

				index = 2;
			}

			let isNavy = false;

			if (discussion.bookmarkNode) {
				isNavy = discussion.bookmarkNode.classList.contains('icon-navy');

				discussion.bookmarkNode.remove();
			}

			discussion.idbButton = new Button(discussion.heading.parentElement, 'afterbegin', {
				callbacks: [
					this.bookmarkDiscussion.bind(this, discussion.code, context),
					null,
					this.unbookmarkDiscussion.bind(this, discussion.code, context),
					null,
				],
				className: 'esgst-idb-button',
				icons: [
					'fa-bookmark-o esgst-clickable',
					'fa-circle-o-notch fa-spin',
					`fa-bookmark esgst-clickable ${isNavy ? 'icon-navy' : ''}`,
					'fa-circle-o-notch fa-spin',
				],
				id: 'idb',
				index: index,
				titles: [
					'Click to bookmark this discussion',
					'Bookmarking discussion...',
					'Click to unbookmark this discussion',
					'Unbookmarking discussion...',
				],
			});
		}
	}

	async bookmarkDiscussion(code, context) {
		if (code) {
			await FetchRequest.post(`/discussion/${code}/`, {
				data: `xsrf_token=${Session.xsrfToken}&do=bookmark_insert`,
			});
		}

		if (context) {
			context.classList.add('esgst-idb-highlight');
		}

		return true;
	}

	async unbookmarkDiscussion(code, context) {
		if (code) {
			await FetchRequest.post(`/discussion/${code}/`, {
				data: `xsrf_token=${Session.xsrfToken}&do=bookmark_delete`,
			});
		}

		if (context) {
			context.classList.remove('esgst-idb-highlight');
		}

		return true;
	}
}

const discussionsImprovedDiscussionBookmarks = new DiscussionsImprovedDiscussionBookmarks();

export { discussionsImprovedDiscussionBookmarks };
