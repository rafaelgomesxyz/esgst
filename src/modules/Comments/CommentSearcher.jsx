import { Module } from '../../class/Module';
import { Process } from '../../class/Process';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class CommentsCommentSearcher extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-comments"></i> <i className="fa fa-search"></i>) to
						the main page heading of any page that allows you to search for comments made by
						specific users in the page.
					</li>
				</ul>
			),
			id: 'cs',
			name: 'Comment Searcher',
			sg: true,
			st: true,
			type: 'comments',
		};
	}

	init() {
		if (
			!Shared.esgst.commentsPath ||
			(Shared.esgst.giveawayPath && document.getElementsByClassName('table--summary')[0])
		)
			return;
		new Process({
			headingButton: {
				id: 'cs',
				icons: ['fa-comments', 'fa-search'],
				title: 'Search comments from specific users',
			},
			popup: {
				icon: 'fa-comments',
				title: `Search comments from specific users:`,
				textInputs: [
					{
						placeholder: `username1, username2, ...`,
					},
				],
				options: [
					{
						check: true,
						description: (
							<fragment>
								Limit search by pages, from{' '}
								<input
									className="esgst-switch-input"
									min="1"
									name="cs_minPage"
									type="number"
									value={Settings.get('cs_minPage')}
								/>
								{' to '}
								<input
									className="esgst-switch-input"
									min="1"
									name="cs_maxPage"
									type="number"
									value={Settings.get('cs_maxPage')}
								/>
								.
							</fragment>
						),
						id: 'cs_limitPages',
						tooltip: `If unchecked, all pages will be searched.`,
					},
				],
				addProgress: true,
				addScrollable: 'left',
			},
			init: this.cs_init.bind(this),
			requests: [
				{
					source: Shared.esgst.discussionPath,
					url: Shared.esgst.searchUrl,
					request: this.cs_request.bind(this),
				},
			],
		});
	}

	cs_init(obj) {
		obj.usernames = obj.popup
			.getTextInputValue(0)
			.toLowerCase()
			.replace(/(,\s*)+/g, this.cs_format.bind(this))
			.split(`, `);
		let match = window.location.pathname.match(
			/^\/(giveaway|discussion|support\/ticket|trade)\/(.+?)\//
		);
		obj.code = match[2];
		obj.type = match[1];
		obj.title = Shared.esgst.originalTitle.replace(/\s-\sPage\s\d+/, '');
		obj.results = 0;
		if (Settings.get('cs_limitPages')) {
			obj.requests[0].nextPage = Settings.get('cs_minPage');
			obj.requests[0].maxPage = Settings.get('cs_maxPage');
		}
	}

	cs_format(match, p1, offset, string) {
		return offset === 0 || offset === string.length - match.length ? '' : `, `;
	}

	async cs_request(obj, details, response, responseHtml) {
		obj.popup.setProgress(
			`Searching comments (page ${details.nextPage}${
				details.maxPage ? ` of ${details.maxPage}` : details.lastPage
			})..`
		);
		obj.popup.setOverallProgress(`${obj.results} results found.`);
		let comments = responseHtml.getElementsByClassName('comments');
		let elements = (comments[1] || comments[0]).querySelectorAll(
			`.comment:not(.comment--submit), .comment_outer`
		);
		let context = obj.popup.getScrollable();
		for (let i = 0, n = elements.length; i < n; i++) {
			let element = elements[i];
			if (Shared.esgst.sg) {
				element.firstElementChild.classList.remove('comment__parent');
				element.firstElementChild.classList.add('comment__child');
			}
			let parent = element.parentElement.closest(`.comment, .comment_outer`);
			element = element.cloneNode(true);
			element.lastElementChild.innerHTML = '';
			const fragmentChildren = [];
			if (parent) {
				parent = parent.cloneNode(true);
				parent.lastElementChild.remove();
				DOM.insert(
					parent,
					'beforeend',
					<div className="comment__children comment_children">{element}</div>
				);
				fragmentChildren.push(parent);
			} else {
				if (Shared.esgst.st) {
					DOM.insert(
						element.getElementsByClassName('action_list')[0].firstElementChild,
						'afterend',
						<a href={`/${obj.type}/${obj.code}/`}>{`${obj.title} - Page ${details.nextPage}`}</a>
					);
				}
				if (Shared.esgst.sg) {
					fragmentChildren.push(
						<div className="comments__entity">
							<p className="comments__entity__name">
								<a
									href={`/${obj.type}/${obj.code}/`}
								>{`${obj.title} - Page ${details.nextPage}`}</a>
							</p>
						</div>
					);
				}
				fragmentChildren.push(<div className="comment__children comment_children">{element}</div>);
			}
			if (
				obj.usernames.indexOf(
					element.querySelector(`.comment__username, .author_name`).textContent.trim().toLowerCase()
				) > -1
			) {
				DOM.insert(
					context,
					'beforeend',
					<div className="comment comments comment_outer">{fragmentChildren}</div>
				);
				obj.results += 1;
			}
		}
		obj.popup.setOverallProgress(`${obj.results} results found.`);
		await Shared.common.endless_load(context);
	}
}

const commentsCommentSearcher = new CommentsCommentSearcher();

export { commentsCommentSearcher };
