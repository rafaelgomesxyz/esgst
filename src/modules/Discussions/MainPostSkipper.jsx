import { Module } from '../../class/Module';
import { common } from '../Common';
import { DOM } from '../../class/DOM';

const goToComment = common.goToComment.bind(common);
class DiscussionsMainPostSkipper extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Skips to the comments of a discussion if you have used the pagination navigation. For
						example, if you enter a discussion and use the pagination navigation to go to page 2, on
						page 2 the feature will skip the main post and take you directly to the comments.
					</li>
				</ul>
			),
			id: 'mps',
			name: 'Main Post Skipper',
			sg: true,
			type: 'discussions',
		};
	}

	init() {
		if (
			!window.location.hash &&
			this.esgst.discussionPath &&
			this.esgst.pagination &&
			document.referrer.match(
				new RegExp(`/discussion/${[window.location.pathname.match(/^\/discussion\/(.+?)\//)[1]]}/`)
			)
		) {
			const context = this.esgst.pagination.previousElementSibling;
			if (context.classList.contains('comments')) {
				goToComment('', context.firstElementChild.firstElementChild, true);
			}
		}
	}
}

const discussionsMainPostSkipper = new DiscussionsMainPostSkipper();

export { discussionsMainPostSkipper };
