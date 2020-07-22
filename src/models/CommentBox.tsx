import { DOM } from '../class/DOM';
import { Session } from '../class/Session.js';
import { Namespaces } from '../constants/Namespaces.js';
import { User } from './User';

abstract class CommentBox implements ICommentBox {
	nodes: ICommentBoxNodes;
	data: ICommentBoxData;
	author: IUser;
	parent: IComment;

	constructor(parent: IComment = null) {
		this.nodes = CommentBox.getDefaultNodes();
		this.data = CommentBox.getDefaultData();
		this.author = null;
		this.parent = parent;
	}

	static getDefaultNodes(): ICommentBoxNodes {
		return {
			outer: null,
			inner: null,
			summary: null,
			author: null,
			defaultState: null,
			heading: null,
			form: null,
			textArea: null,
			tradeCodeField: null,
			profileIdField: null,
			buttons: null,
			rating: null,
			positiveRating: null,
			negativeRating: null,
			submitButton: null,
			cancelButton: null,
		};
	}

	static getDefaultData(): ICommentBoxData {
		return {
			tradeCode: '',
			profileId: '',
			markdown: '',
			isReview: false,
		};
	}

	static create(parent: IComment = null): ICommentBox {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return new SgCommentBox(parent);
			}
			case Namespaces.ST: {
				return new StCommentBox(parent);
			}
		}
		return null;
	}

	static parseAll(context: HTMLElement, parent: IComment = null): ICommentBox[] {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return SgCommentBox.parseAll(context, parent);
			}
			case Namespaces.ST: {
				return StCommentBox.parseAll(context, parent);
			}
		}
		return null;
	}

	abstract parse(outer: HTMLDivElement): void;
	abstract parseNodes(outer: HTMLDivElement): void;
	abstract parseData(): void;
	abstract build(context: HTMLElement, position: string): void;
}

class SgCommentBox extends CommentBox {
	constructor(parent: IComment = null) {
		super(parent);
	}

	static parseAll(context: HTMLElement, parent: IComment = null): SgCommentBox[] {
		const boxes: SgCommentBox[] = [];
		const elements = context.querySelectorAll(
			'.comments > .comment--submit:not([data-esgst-parsed]), :scope > .comment--submit:not([data-esgst-parsed])'
		);
		for (const element of elements) {
			const box = new SgCommentBox(parent);
			box.parse(element as HTMLDivElement);
			boxes.push(box);
		}
		return boxes;
	}

	parse(outer: HTMLDivElement): void {
		this.author = User.create();
		this.parseNodes(outer);
		this.parseData();
	}

	parseNodes(outer: HTMLDivElement): void {
		const nodes: ICommentBoxNodes = CommentBox.getDefaultNodes();
		const authorNodes: IUserNodes = User.getDefaultNodes();
		nodes.outer = outer;
		nodes.inner = nodes.outer.querySelector('.comment__parent');
		authorNodes.avatarOuter = nodes.inner.querySelector('.global__image-outer-wrap');
		authorNodes.avatarInner = authorNodes.avatarOuter.querySelector('.global__image-inner-wrap');
		nodes.summary = nodes.inner.querySelector('.comment__summary');
		nodes.author = nodes.summary.querySelector('.comment__author');
		authorNodes.usernameOuter = nodes.author.querySelector('.comment__username');
		authorNodes.usernameInner = authorNodes.usernameOuter.querySelector('[href*="/user/"]');
		nodes.defaultState = nodes.summary.querySelector('.comment__display-state');
		nodes.form = nodes.defaultState.querySelector('form');
		nodes.textArea = nodes.form.querySelector('[name="description"]');
		nodes.buttons = nodes.form.querySelector('.align-button-container');
		nodes.submitButton = nodes.buttons.querySelector('.js__submit-form');
		nodes.cancelButton = nodes.buttons.querySelector('.js__comment-reply-cancel');
		nodes.outer.dataset.esgstParsed = '';
		this.nodes = nodes;
		this.author.nodes = authorNodes;
	}

	parseData() {
		const nodes = this.nodes;
		const authorNodes = this.author.nodes;
		const data: ICommentBoxData = CommentBox.getDefaultData();
		const authorData: IUserData = User.getDefaultData();
		authorData.avatar = authorNodes.avatarInner.style.backgroundImage.slice(4, -2); // url(...);
		authorData.username = authorNodes.usernameInner.textContent.trim();
		authorData.url = authorNodes.usernameInner.getAttribute('href');
		data.markdown = nodes.textArea.value;
		this.data = data;
		this.author.data = authorData;
	}

	build(context: HTMLElement, position: string): void {
		if (this.nodes.outer) {
			this.nodes.outer.remove();
		}
		let outer: HTMLDivElement | undefined;
		DOM.insert(
			context,
			position,
			<div className="comment comment--submit" ref={(ref) => (outer = ref)}>
				<div className="comment__parent">
					<a
						href={this.author.data.url}
						className="global__image-outer-wrap global__image-outer-wrap--avatar-small"
					>
						<div
							className="global__image-inner-wrap"
							style={`background-image:url(${this.author.data.avatar});`}
						></div>
					</a>
					<div className="comment__summary">
						<div className="comment__author">
							<div className="comment__username">
								<a href={this.author.data.url}>{this.author.data.username}</a>
							</div>
						</div>
						<div className="comment__display-state">
							<div className="comment__description">
								<form method="post">
									<input type="hidden" name="do" value="comment_new" />
									<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
									<input
										type="hidden"
										name="parent_id"
										value={this.parent ? this.parent.data.id : ''}
									/>
									<textarea name="description">{this.data.markdown}</textarea>
									<div className="align-button-container">
										<a href="" className="comment__submit-button js__submit-form">
											Submit Comment
										</a>
										<div className="comment__cancel-button js__comment-reply-cancel">
											<span>Cancel</span>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
		this.parseNodes(outer);
	}
}

class StCommentBox extends CommentBox {
	constructor(parent: IComment = null) {
		super(parent);
	}

	static parseAll(context: HTMLElement, parent: IComment = null): StCommentBox[] {
		const boxes: StCommentBox[] = [];
		const elements = context.querySelectorAll(
			'.comments > .reply_form:not([data-esgst-parsed]), :scope > .reply_form:not([data-esgst-parsed])'
		);
		for (const element of elements) {
			const box = new StCommentBox(parent);
			box.parse(element as HTMLDivElement);
			boxes.push(box);
		}
		return boxes;
	}

	parse(outer: HTMLDivElement): void {
		this.author = User.create();
		this.parseNodes(outer);
		this.parseData();
	}

	parseNodes(outer: HTMLDivElement): void {
		const nodes: ICommentBoxNodes = CommentBox.getDefaultNodes();
		nodes.outer = outer;
		nodes.heading = nodes.outer.querySelector('.heading');
		nodes.form = nodes.outer.querySelector('form');
		nodes.tradeCodeField = nodes.form.querySelector('[name="trade_code"]');
		nodes.profileIdField = nodes.form.querySelector('[name="profile_id"]');
		nodes.textArea = nodes.form.querySelector('[name="description"]');
		nodes.buttons = nodes.form.querySelector('.btn_actions');
		nodes.rating = nodes.buttons.querySelector('.rating_checkbox_container');
		if (nodes.rating) {
			nodes.positiveRating = nodes.rating.querySelector('.is_positive');
			nodes.negativeRating = nodes.rating.querySelector('.is_negative');
		}
		nodes.submitButton = nodes.buttons.querySelector('.btn_action');
		nodes.cancelButton = nodes.buttons.querySelector('.btn_cancel');
		nodes.outer.dataset.esgstParsed = '';
		this.nodes = nodes;
	}

	parseData() {
		const nodes = this.nodes;
		const data: ICommentBoxData = CommentBox.getDefaultData();
		if (nodes.tradeCodeField) {
			data.tradeCode = nodes.tradeCodeField.value;
		}
		if (nodes.profileIdField) {
			data.profileId = nodes.profileIdField.value;
		}
		data.markdown = nodes.textArea.value;
		data.isReview = !!nodes.rating;
		this.data = data;
	}

	build(context: HTMLElement, position: string): void {
		if (this.nodes.outer) {
			this.nodes.outer.remove();
		}
		let outer: HTMLDivElement | undefined;
		DOM.insert(
			context,
			position,
			<div className="reply_form" ref={(ref) => (outer = ref)}>
				<div className="heading">{this.data.isReview ? 'Add Review' : 'Add Comment'}</div>
				<form>
					<input
						type="hidden"
						name="do"
						value={this.data.isReview ? 'review_insert' : 'comment_insert'}
					/>
					{!this.data.isReview && (
						<input type="hidden" name="trade_code" value={this.data.tradeCode} />
					)}
					<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
					{this.data.isReview ? (
						<fragment>
							<input type="hidden" name="profile_id" value={this.data.profileId} />
							<input type="hidden" name="rating" value="" />
						</fragment>
					) : (
						<input type="hidden" name="parent_id" value={this.parent ? this.parent.data.id : ''} />
					)}
					<textarea
						placeholder={
							this.data.isReview
								? 'Write about your trading experience with this user...'
								: `Write a reply${this.parent ? ` to ${this.parent.author.data.username}` : ''}...`
						}
						name="description"
					>
						{this.data.markdown}
					</textarea>
					<div className="btn_actions">
						{this.data.isReview && (
							<div className="rating_checkbox_container">
								<div data-rating="1" className="rating_checkbox is_positive">
									<i className="is_default fa fa-fw fa-thumbs-o-up"></i>
									<i className="is_hover fa fa-fw fa-thumbs-up"></i>
									<i className="is_selected fa fa-fw fa-thumbs-up"></i>
									{' Positive'}
								</div>
								<div data-rating="0" className="rating_checkbox is_negative">
									<i className="is_default fa fa-fw fa-thumbs-o-down"></i>
									<i className="is_hover fa fa-fw fa-thumbs-down"></i>
									<i className="is_selected fa fa-fw fa-thumbs-down"></i>
									{' Negative'}
								</div>
							</div>
						)}
						<div className="btn_action white js_submit">
							<i className="fa fa-send"></i>
							<span>Submit</span>
						</div>
						{!this.data.isReview && (
							<div className="btn_cancel">
								<span>Cancel</span>
							</div>
						)}
					</div>
				</form>
			</div>
		);
		this.parseNodes(outer);
	}
}

export { CommentBox };
