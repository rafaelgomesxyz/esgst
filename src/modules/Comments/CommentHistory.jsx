import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Process } from '../../class/Process';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';

class CommentsCommentHistory extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Replaces SteamGifts' native comment button with a new one, so that ESGST can track your
						comments.
					</li>
					<li>
						Adds a button (<i className="fa fa-comments esgst-yellow"></i> My Comment History) to
						the dropdown menu accessible by clicking on the arrow next to your avatar at the header
						of any page that allows you to view your comment history.
					</li>
				</ul>
			),
			id: 'ch',
			name: 'Comment History',
			sg: true,
			type: 'comments',
		};
	}

	init() {
		if (!Shared.esgst.sg) {
			return;
		}
		if (Shared.esgst.replyBox) {
			Shared.common.addReplyButton(Shared.esgst.replyBox);
		}

		const dropdownItem = Shared.header.addDropdownItem({
			buttonContainerId: 'account',
			description: 'View your comment history.',
			icon: 'fa fa-fw fa-comments icon-yellow yellow',
			name: 'My Comment History',
		});

		dropdownItem.nodes.outer.dataset.linkId = 'myCommentHistory';
		dropdownItem.nodes.outer.dataset.linkKey = 'account';
		dropdownItem.nodes.outer.title = Shared.common.getFeatureTooltip('ch');

		new Process({
			button: dropdownItem.nodes.outer,
			popup: {
				icon: 'fa-comments',
				title: 'Comment History',
				addProgress: true,
				addScrollable: 'left',
			},
			urls: {
				id: 'ch',
				init: this.ch_initUrls.bind(this),
				request: {
					request: this.ch_requestUrl.bind(this),
				},
			},
		});
	}

	async ch_initUrls(obj) {
		obj.ids = [];
		let comments = JSON.parse(Shared.common.getValue(`${Shared.esgst.name}CommentHistory`, '[]'));
		for (let i = 0, n = comments.length; i < n; i++) {
			obj.ids.push(comments[i].id);
			obj.items.push(`https://${window.location.hostname}/go/comment/${comments[i].id}`);
		}
	}

	async ch_requestUrl(obj, details, response, responseHtml) {
		const id = obj.ids[obj.index];
		let comment = responseHtml.getElementById(id);
		if (Shared.esgst.sg) {
			comment = comment.closest('.comment');
			const username = Settings.get('username');
			let author = comment.querySelector('.comment__author')?.textContent.trim() ?? '';
			if (author !== username) {
				while (author !== username && comment) {
					comment = comment.previousElementSibling;
					author = comment?.querySelector('.comment__author')?.textContent.trim() ?? '';
				}
				if (!comment) {
					return;
				}
				const newId = comment.querySelector('.comment__summary')?.id ?? '';
				const key = `${Shared.esgst.name}CommentHistory`;
				const deleteLock = await Shared.common.createLock(`${key}Lock`, 300);
				let comments = JSON.parse(Shared.common.getValue(key, '[]'));
				comments = comments.map((comment) => {
					if (comment.id === id) {
						return { ...comment, id: newId };
					}
					return comment;
				});
				await Shared.common.setValue(key, JSON.stringify(comments));
				deleteLock();
			}
			comment.firstElementChild.classList.remove('comment__parent');
			comment.firstElementChild.classList.add('comment__child');
		}
		comment.lastElementChild.remove();
		let parent = comment.parentElement.closest(`.comment, .comment_outer`);
		const fragmentChildren = [];
		if (parent) {
			parent.lastElementChild.remove();
			DOM.insert(
				parent,
				'beforeend',
				<div className="comment__children comment_children">{comment}</div>
			);
			fragmentChildren.push(parent);
		} else {
			if (Shared.esgst.st) {
				DOM.insert(
					comment.getElementsByClassName('action_list')[0].firstElementChild,
					'afterend',
					<a href={response.url}>{responseHtml.title}</a>
				);
			}
			if (Shared.esgst.sg) {
				fragmentChildren.push(
					<div className="comments__entity">
						<p className="comments__entity__name">
							<a href={response.url}>{responseHtml.title}</a>
						</p>
					</div>
				);
			}
			fragmentChildren.push(<div className="comment__children comment_children">{comment}</div>);
		}
		DOM.insert(
			obj.context,
			'beforeend',
			<div className="comment comments comment_outer">{fragmentChildren}</div>
		);
	}

	async ch_saveComment(id, timestamp) {
		let deleteLock = await Shared.common.createLock(`${Shared.esgst.name}CommentHistoryLock`, 300);
		let key = `${Shared.esgst.name}CommentHistory`;
		let comments = JSON.parse(Shared.common.getValue(key, '[]'));
		comments.unshift({
			id: id,
			timestamp: timestamp,
		});
		await Shared.common.setValue(key, JSON.stringify(comments));
		deleteLock();
	}
}

const commentsCommentHistory = new CommentsCommentHistory();

export { commentsCommentHistory };
