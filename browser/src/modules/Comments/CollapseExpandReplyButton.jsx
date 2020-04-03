import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class CommentsCollapseExpandReplyButton extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Adds a button (`,
						['i', { class: 'fa fa-plus-square' }],
						' if all of the replies in the page are collapsed and ',
						['i', { class: 'fa fa-minus-square' }],
						` if they are expanded) above the comments (in any page) that allows you to collapse/expand all of the replies (comments nested 2 or more levels deep) in the page.`
					]],
					['li', `Also adds the same button in front of each comment nested 1 level deep in the page, which allows you to collapse/expand the replies of the comment individually.`]
				]]
			],
			features: {
				cerb_a: {
					name: 'Automatically collapse all replies when visiting a page.',
					sg: true,
					st: true
				}
			},
			id: 'cerb',
			name: 'Collapse/Expand Reply Button',
			sg: true,
			sgPaths: /^(Giveaway\s-\sComments|Discussion|Ticket|Trade)$/,
			st: true,
			type: 'comments'
		};
	}

	init() {
		if (!Shared.esgst.commentsPath) return;
		let button, collapse, comments, expand;
		comments = document.getElementsByClassName('comments')[0];
		if (comments && comments.children.length) {
			this.buttons = [];
			button = DOM.insert(Shared.esgst.mainPageHeading, 'afterEnd', (
				<div class="esgst-cerb-button esgst-clickable">
					<span>
						<i class="fa fa-minus-square"></i> Collapse all replies
					</span>
					<span class="esgst-hidden">
						<i class="fa fa-plus-square"></i> Expand all replies
					</span>
				</div>
			));
			collapse = button.firstElementChild;
			expand = collapse.nextElementSibling;
			collapse.addEventListener('click', this.cerb_collapseAllReplies.bind(this, collapse, expand));
			expand.addEventListener('click', this.cerb_expandAllReplies.bind(this, collapse, expand));
			Shared.esgst.endlessFeatures.push(this.cerb_getReplies.bind(this, collapse, expand));
		}
	}

	cerb_getReplies(collapse, expand, context, main, source, endless) {
		let id = context === document && main ? window.location.hash.replace(/#/, '') : null,
			permalink = id ? document.getElementById(id) : null,
			elements = context.querySelectorAll(Shared.common.getSelectors(endless, [
				`:not(.esgst-popup) .comments > X.comment`,
				`:not(.esgst-popup) .comments > X.comment_outer`
			]));
		if (!elements.length) return;
		for (let reply of elements) {
			let replies = reply.querySelector(`.comment__children, .comment_children`);
			if (replies && replies.children.length) {
				this.cerb_setButton(DOM.insert(reply.firstElementChild, 'afterBegin', (
					<div class="esgst-cerb-reply-button esgst-clickable">
						<span title={Shared.common.getFeatureTooltip('cerb', 'Collapse all replies')}>
							<i class="fa fa-minus-square"></i>
						</span>
						<span class="esgst-hidden" title={Shared.common.getFeatureTooltip('cerb', 'Expand all replies')}>
							<i class="fa fa-plus-square"></i>
						</span>
					</div>
				)), permalink && reply.contains(permalink), reply, replies.children);
			}
		}
		if (Settings.get('cerb_a')) {
			this.cerb_collapseAllReplies(collapse, expand);
		}
	}

	cerb_setButton(button, permalink, reply, replies) {
		let collapse, expand;
		collapse = button.firstElementChild;
		expand = collapse.nextElementSibling;
		this.buttons.push({
			collapse: this.cerb_collapseReplies.bind(this, collapse, expand, replies),
			expand: this.cerb_expandReplies.bind(this, collapse, expand, replies),
			permalink: permalink
		});
		collapse.addEventListener('click', this.cerb_collapseReplies.bind(this, collapse, expand, replies));
		expand.addEventListener('click', this.cerb_expandReplies.bind(this, collapse, expand, replies));
		if (Settings.get('cerb_a') && !permalink) {
			collapse.classList.toggle('esgst-hidden');
			expand.classList.toggle('esgst-hidden');
		}
	}

	cerb_collapseReplies(collapse, expand, replies) {
		let i, n;
		for (i = 0, n = replies.length; i < n; ++i) {
			replies[i].classList.add('esgst-hidden');
		}
		collapse.classList.add('esgst-hidden');
		expand.classList.remove('esgst-hidden');
	}

	cerb_expandReplies(collapse, expand, replies) {
		let i, n;
		for (i = 0, n = replies.length; i < n; ++i) {
			replies[i].classList.remove('esgst-hidden');
		}
		collapse.classList.remove('esgst-hidden');
		expand.classList.add('esgst-hidden');
	}

	cerb_collapseAllReplies(collapse, expand) {
		for (const button of this.buttons) {
			if (!button.permalink) {
				button.collapse();
			}
		}
		collapse.classList.add('esgst-hidden');
		expand.classList.remove('esgst-hidden');
	}

	cerb_expandAllReplies(collapse, expand) {
		for (const button of this.buttons) {
			button.expand();
		}
		collapse.classList.remove('esgst-hidden');
		expand.classList.add('esgst-hidden');
	}
}

const commentsCollapseExpandReplyButton = new CommentsCollapseExpandReplyButton();

export { commentsCollapseExpandReplyButton };