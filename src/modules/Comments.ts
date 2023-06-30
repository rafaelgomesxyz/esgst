import { Module } from '../class/Module';
import { Scope } from '../class/Scope';
import { Settings } from '../class/Settings';
import { Shared } from '../class/Shared';
import { Comment } from '../models/Comment';
import { common } from './Common';

interface Comment2 {
	actions?: HTMLElement;
	author?: string;
	bump?: string[];
	code?: string;
	comment?: HTMLElement;
	displayState?: HTMLElement;
	id?: string;
	index?: number;
	isOp?: boolean;
	length?: number;
	outerWrap?: HTMLElement;
	parent?: HTMLElement;
	permalink?: HTMLElement;
	summary?: HTMLElement;
	text?: string;
	timestamp?: number;
	type?: string;
	words?: string[];
}

const getValue = common.getValue.bind(common);
class Comments extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'comments',
			featureMap: {
				endless: this.comments_load.bind(this),
			},
		};
	}

	comments_load = async (
		context: HTMLElement,
		main: boolean,
		_source: never,
		endless: number,
		mainEndless: unknown
	) => {
		const commentsV2 = Comment.parseAll(context);
		Scope.addData('current', 'commentsV2', commentsV2, endless);
		for (const feature of Shared.esgst.commentV2Features) {
			await feature(commentsV2, main);
		}
		let count = 0;
		const comments = await this.comments_get(context, document, main, endless);
		if (!comments.length) return;
		Scope.addData('current', 'comments', comments, endless);
		for (let i = 0, n = comments.length; i < n; ++i) {
			comments[i].index = i;
		}
		for (const feature of Shared.esgst.commentFeatures) {
			await feature(comments, main);
		}
		if (!main || this.esgst.commentsPath || Shared.common.isCurrentPath('Messages')) {
			if (
				main &&
				Shared.esgst.cf &&
				this.esgst.cf.filteredCount &&
				Settings.get(`cf_enable${this.esgst.cf.type}`)
			) {
				this.esgst.modules.commentsCommentFilters.filters_filter(this.esgst.cf, false, endless);
			}
			if (
				!main &&
				this.esgst.cfPopup &&
				this.esgst.cfPopup.filteredCount &&
				Settings.get(`cf_enable${this.esgst.cfPopup.type}`)
			) {
				this.esgst.modules.commentsCommentFilters.filters_filter(
					this.esgst.cfPopup,
					false,
					endless
				);
			}
		}
		if (Settings.get('ct')) {
			if (!main || Shared.common.isCurrentPath('Messages')) {
				count = 0;
			} else {
				const breadcrumbs = context.querySelectorAll(
					'.page__heading:not([data-esgst]) .page__heading__breadcrumbs'
				);
				const countElement = breadcrumbs[1] || breadcrumbs[0];
				if (countElement && countElement.firstElementChild) {
					const reMatches = countElement.firstElementChild.textContent
						.replace(/,/g, '')
						.match(/\d+/);
					if (reMatches) {
						count = parseInt(reMatches[0]);
					}
				} else {
					count = 0;
				}
			}
			// noinspection JSIgnoredPromiseFromCall
			this.esgst.modules.commentsCommentTracker.ct_getComments(
				count,
				comments,
				null,
				false,
				false,
				false,
				main || endless || mainEndless
			);
		}
		if (Settings.get('rfi')) {
			if (
				Settings.get('rfi_s') &&
				(!main || Shared.common.isCurrentPath('Messages')) &&
				(!context.getAttribute || !context.getAttribute('data-rfi'))
			) {
				await this.esgst.modules.commentsReplyFromInbox.rfi_getReplies(
					comments,
					main || endless || mainEndless
				);
			}
		}
		if (Settings.get('ged')) {
			this.esgst.ged_addIcons(comments);
		}
	};

	comments_get = async (
		context: HTMLElement,
		mainContext: Document,
		main: boolean,
		endless: number
	) => {
		let comment: Comment2;
		const comments: Comment2[] = [];
		const matches: NodeListOf<HTMLElement> = context.querySelectorAll(
			common.getSelectors(endless, [
				'X:not(.comment--submit) > .comment__parent',
				'X.comment__child',
				'X.comment_inner',
			])
		);
		const sourceLink: HTMLElement | null = mainContext.querySelector(
			'.page__heading__breadcrumbs a[href*="/giveaway/"], .page__heading__breadcrumbs a[href*="/discussion/"], .page__heading__breadcrumbs a[href*="/ticket/"], .page_heading_breadcrumbs a[href*="/trade/"]'
		);
		for (let i = matches.length - 1; i >= 0; --i) {
			if (!sourceLink) {
				continue;
			}
			comment = await this.comments_getInfo(
				matches[i],
				Scope.current?.sourceLink || sourceLink,
				endless ? this.esgst.users : JSON.parse(getValue('users')),
				main
			);
			if (comment) {
				comments.push(comment);
			}
		}
		return comments;
	};

	comments_getInfo = async (
		context: HTMLElement,
		sourceLink: HTMLElement,
		_savedUsers: unknown,
		main: boolean
	) => {
		let matches: NodeListOf<HTMLElement>,
			n: number,
			source: string | null | undefined,
			element: HTMLElement | null,
			reMatches: string[] | null,
			attr: string | null;
		const comment: Comment2 = {};
		comment.comment = context;
		comment.outerWrap = comment.comment;
		element = comment.comment.parentElement;
		if (element) {
			comment.parent = element;
		}
		const author = comment.comment.querySelector('.comment__author, .author_name');
		if (!author) {
			return {};
		}
		comment.author = author.textContent.trim();
		element = comment.comment.querySelector('.comment__summary, .comment_body');
		if (element) {
			comment.summary = element;
		}
		comment.isOp =
			(comment.summary && !comment.summary.id) || (comment.parent && !comment.parent.id);
		element = comment.comment.querySelector('.comment__display-state, .comment_body_default');
		if (element) {
			comment.displayState = element;
		}
		comment.text = comment.displayState
			? comment.displayState.textContent.trim().replace(/View\sattached\simage\./, '')
			: '';
		reMatches = comment.text
			.replace(/[^A-Za-z]/g, '')
			.match(/^(havea|takea|thanksand|thankyou)?bump(ing|ity|o)?$/i);
		if (reMatches) {
			comment.bump = reMatches;
		}
		comment.length = comment.text.length;
		comment.words = Array.from(new Set(comment.text.split(/\s/)));
		element = comment.comment.querySelector('.comment__actions, .action_list');
		if (element) {
			comment.actions = element;
		}
		if (!comment.actions) {
			return {};
		}
		matches = comment.actions.querySelectorAll('[href*="/comment/"]');
		n = matches.length;
		if (n > 0) {
			comment.permalink = matches[n - 1];
		}
		comment.id = '';
		if (comment.permalink) {
			attr = comment.permalink.getAttribute('href');
			if (attr) {
				reMatches = attr.match(/\/comment\/(.+)/);
				if (reMatches) {
					comment.id = reMatches[1];
				}
			}
		}
		matches = comment.actions.querySelectorAll('[data-timestamp]');
		n = matches.length;
		if (n > 0) {
			attr = matches[n - 1].getAttribute('data-timestamp');
			if (attr) {
				comment.timestamp = parseInt(attr);
			}
		}
		if (!main || Shared.common.isCurrentPath('Messages')) {
			if (this.esgst.sg) {
				source = comment.comment
					.closest('.comments')
					?.previousElementSibling?.firstElementChild?.firstElementChild?.getAttribute('href');
			} else {
				source = comment.actions.querySelector('[href*="/trade/"]')?.getAttribute('href');
			}
		}
		if (!source && sourceLink) {
			source = sourceLink.getAttribute('href');
		}
		if (source) {
			reMatches = source.match(/(giveaway|discussion|ticket|trade)\/(.+?)(\/.*)?$/);
			if (reMatches) {
				comment.type = `${reMatches[1]}s`;
				comment.code = reMatches[2];
			}
			return comment;
		}
		return {};
	};
}

const commentsModule = new Comments();

export { commentsModule };
