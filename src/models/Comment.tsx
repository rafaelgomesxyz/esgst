import { DOM } from '../class/DOM.js';
import { Session } from '../class/Session.js';
import { Shared } from '../class/Shared.js';
import { Namespaces } from '../constants/Namespaces.js';
import { AttachedImage } from './AttachedImage';
import { User } from './User';

abstract class Comment implements IComment {
	nodes: ICommentNodes;
	data: ICommentData;
	author: IUser;
	attachedImages: IAttachedImage[];
	generation: number;
	parent: IComment;
	children: IComment[];
	mrBox: ICommentBox;

	constructor(generation: number = 0, parent: IComment = null) {
		this.nodes = Comment.getDefaultNodes();
		this.data = Comment.getDefaultData();
		this.author = null;
		this.attachedImages = [];
		this.generation = generation;
		this.parent = parent;
		this.children = [];
		this.mrBox = null;
	}

	static getDefaultNodes(): ICommentNodes {
		return {
			outer: null,
			inner: null,
			summary: null,
			author: null,
			collapseButton: null,
			expandButton: null,
			defaultState: null,
			editState: null,
			editTextArea: null,
			editSaveButton: null,
			editCancelButton: null,
			deleteState: null,
			collapseState: null,
			collapseCount: null,
			actions: null,
			createdTimestamp: null,
			editedTimestamp: null,
			deletedTimestamp: null,
			replyButton: null,
			editButton: null,
			deleteButton: null,
			undeleteButton: null,
			source: null,
			sourceComment: null,
			sourceThread: null,
			permalink: null,
			rmlLink: null,
			rating: null,
			children: null,
		};
	}

	static getDefaultData(): ICommentData {
		return {
			id: '',
			isDeleted: false,
			markdown: '',
			createdTimestamp: 0,
			editedTimestamp: 0,
			deletedTimestamp: 0,
			isEdited: false,
			canReply: false,
			canEdit: false,
			canDelete: false,
			canUndelete: false,
			sourceCommentUrl: '',
			sourceCommentAuthor: '',
			sourceThreadUrl: '',
			sourceThreadTitle: '',
			url: '',
			code: '',
			isOp: false,
			isReview: false,
			isReviewPositive: false,
		};
	}

	static create(generation: number = 0, parent: IComment = null): IComment {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return new SgComment(generation, parent);
			}
			case Namespaces.ST: {
				return new StComment(generation, parent);
			}
		}
		return null;
	}

	static parseAll(
		context: HTMLElement,
		generation: number = 0,
		parent: IComment = null
	): IComment[] {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return SgComment.parseAll(context, generation, parent);
			}
			case Namespaces.ST: {
				return StComment.parseAll(context, generation, parent);
			}
		}
		return null;
	}

	abstract parse(outer: SgCommentOuter | StCommentOuter): void;
	abstract parseNodes(outer: SgCommentOuter | StCommentOuter): void;
	abstract parseData(): void;
	abstract build(context: HTMLElement, position: string): void;
}

class SgComment extends Comment {
	constructor(generation: number = 0, parent: SgComment = null) {
		super(generation, parent);
	}

	static parseAll(context: HTMLElement, generation: number, parent: SgComment = null): SgComment[] {
		const comments: SgComment[] = [];
		const elements = context.querySelectorAll(
			'.comments > .comment:not(.comment--submit):not([data-esgst-parsed]), :scope > .comment:not(.comment--submit):not([data-esgst-parsed])'
		);
		for (const element of elements) {
			const comment = new SgComment(generation, parent);
			comment.parse(element as SgCommentOuter);
			comments.push(comment);
		}
		return comments;
	}

	parse(outer: SgCommentOuter): void {
		this.author = User.create();
		this.parseNodes(outer);
		this.parseData();
		if (this.nodes.defaultState) {
			this.attachedImages = AttachedImage.parseAll(this.nodes.defaultState);
		}
		if (this.nodes.children) {
			this.children = SgComment.parseAll(this.nodes.children, this.generation + 1, this);
		}
	}

	parseNodes(outer: SgCommentOuter): void {
		const nodes: ICommentNodes = Comment.getDefaultNodes();
		const authorNodes: IUserNodes = User.getDefaultNodes();
		nodes.outer = outer;
		nodes.inner = nodes.outer.querySelector('.comment__parent, .comment__child');
		authorNodes.avatarOuter = nodes.inner.querySelector('.global__image-outer-wrap');
		authorNodes.avatarInner = authorNodes.avatarOuter.querySelector('.global__image-inner-wrap');
		nodes.summary = nodes.inner.querySelector('.comment__summary');
		nodes.author = nodes.summary.querySelector('.comment__author');
		nodes.collapseButton = nodes.author.querySelector('.comment__collapse-button');
		nodes.expandButton = nodes.author.querySelector('.comment__expand-button');
		authorNodes.usernameOuter = nodes.author.querySelector('.comment__username');
		authorNodes.usernameInner = authorNodes.usernameOuter.querySelector('[href*="/user/"]');
		authorNodes.role = nodes.author.querySelector('.comment__role-name');
		authorNodes.patreon = nodes.author.querySelector('[data-ui-tooltip*="Patron"]');
		nodes.defaultState = nodes.summary.querySelector('.comment__display-state');
		nodes.editState = nodes.summary.querySelector('.comment__edit-state');
		if (nodes.editState) {
			nodes.editTextArea = nodes.editState.querySelector('[name="description"]');
			nodes.editSaveButton = nodes.editState.querySelector('.js__comment-edit-save');
			nodes.editCancelButton = nodes.editState.querySelector('.js__comment-edit-cancel');
		}
		nodes.deleteState = nodes.summary.querySelector('.comment__delete-state');
		if (nodes.deleteState) {
			nodes.deletedTimestamp = nodes.deleteState.querySelector('[data-timestamp]');
		}
		nodes.collapseState = nodes.summary.querySelector('.comment__collapse-state');
		nodes.actions = nodes.summary.querySelector('.comment__actions');
		const timestampNodes = (nodes.actions.querySelectorAll(
			'[data-timestamp]'
		) as any) as TimestampNode[];
		nodes.createdTimestamp = timestampNodes[0];
		if (timestampNodes.length === 2) {
			nodes.editedTimestamp = timestampNodes[1];
		}
		nodes.replyButton = nodes.actions.querySelector('.js__comment-reply');
		nodes.editButton = nodes.actions.querySelector('.js__comment-edit');
		nodes.deleteButton = nodes.actions.querySelector('.js__comment-delete');
		nodes.undeleteButton = nodes.actions.querySelector('.js__comment-undelete');
		nodes.permalink = nodes.actions.querySelector('[href*="/go/comment/"]');
		nodes.children = nodes.outer.querySelector('.comment__children');
		nodes.outer.dataset.esgstParsed = '';
		this.nodes = nodes;
		this.author.nodes = authorNodes;
	}

	parseData(): void {
		const nodes = this.nodes;
		const authorNodes = this.author.nodes;
		const data: ICommentData = Comment.getDefaultData();
		const authorData: IUserData = User.getDefaultData();
		data.id = nodes.outer.dataset.commentId;
		data.isDeleted = !authorNodes.avatarInner;
		if (!data.isDeleted) {
			authorData.avatar = authorNodes.avatarInner.style.backgroundImage.slice(4, -2); // url(...);
			authorData.username = authorNodes.usernameInner.textContent.trim();
			authorData.url = authorNodes.usernameInner.getAttribute('href');
		}
		authorData.isOp = authorNodes.usernameOuter.classList.contains('comment__username--op');
		if (authorNodes.role) {
			authorData.roleId = authorNodes.role.getAttribute('href').split('/')[2]; // /roles/...
			authorData.roleName = authorNodes.role.textContent.trim().slice(1, -1); // (...)
		}
		authorData.isPatron = !!authorNodes.patreon;
		if (nodes.editTextArea) {
			data.markdown = nodes.editTextArea.value;
		}
		if (nodes.deletedTimestamp) {
			data.deletedTimestamp = parseInt(nodes.deletedTimestamp.dataset.timestamp);
		}
		data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		if (nodes.editedTimestamp) {
			data.editedTimestamp = parseInt(nodes.editedTimestamp.dataset.timestamp);
		}
		data.isEdited = !!data.editedTimestamp;
		data.canReply = !!nodes.replyButton;
		data.canEdit = !!nodes.editButton;
		data.canDelete = !!nodes.deleteButton;
		data.canUndelete = !!nodes.undeleteButton;
		if (nodes.permalink) {
			data.url = nodes.permalink.getAttribute('href');
			data.code = data.url.split('/')[3]; // /go/comment/...
		}
		data.isOp = !nodes.summary.id;
		this.data = data;
		this.author.data = authorData;
	}

	build(context: HTMLElement, position: string): void {
		if (this.nodes.outer) {
			this.nodes.outer.remove();
		}
		const patron = this.author.data.isPatron && (
			<i
				data-ui-tooltip='{"rows":[{"icon" : [{"class" : "fa-star", "color" : "#84cfda"}], "columns":[{"name" : "Patron"}]}]}'
				class="fa fa-star"
			></i>
		);
		const outer = DOM.insert(
			context,
			position,
			<div data-comment-id={this.data.id} class="comment">
				<div class={`ajax ${this.parent ? 'comment__child' : 'comment__parent'}`}>
					{this.data.isDeleted ? (
						<div class="global__image-outer-wrap global__image-outer-wrap--avatar-small global__image-outer-wrap--missing-image">
							<i class="fa fa-user"></i>
						</div>
					) : (
						<a
							href={this.author.data.url}
							class="global__image-outer-wrap global__image-outer-wrap--avatar-small"
						>
							<div
								class="global__image-inner-wrap"
								style={`background-image:url(${this.author.data.avatar});`}
							></div>
						</a>
					)}
					<div id={this.data.code} class="comment__summary">
						<div class="comment__author">
							<i class="comment__collapse-button fa fa-minus-square-o"></i>
							<i class="comment__expand-button fa fa-plus-square-o"></i>
							{this.data.isDeleted ? (
								<div class="comment__username comment__username--deleted">Deleted</div>
							) : (
								<div
									class={`comment__username${
										this.author.data.isOp ? ' comment__username--op' : ''
									}`}
								>
									<a href={this.author.data.url}>{this.author.data.username}</a>
								</div>
							)}
							{this.author.data.roleId && (
								<a
									href={`/roles/${this.author.data.roleId}`}
									class="comment__role-name"
								>{`(${this.author.data.roleName})`}</a>
							)}
							{this.author.data.isPatron &&
								(Session.isLoggedIn ? <a href="/account/settings/patreon">{patron}</a> : patron)}
						</div>
						{this.data.canEdit && (
							<div class="comment__edit-state is-hidden">
								<div class="comment__description">
									<form>
										<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
										<input type="hidden" name="do" value="comment_edit" />
										<input type="hidden" name="allow_replies" value="1" />
										<input type="hidden" name="comment_id" value={this.data.id} />
										<textarea name="description">{this.data.markdown}</textarea>
										<div class="align-button-container">
											<a href="" class="comment__submit-button js__comment-edit-save">
												Save Changes
											</a>
											<div class="comment__cancel-button js__comment-edit-cancel">
												<span>Cancel</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						)}
						{this.data.isDeleted ? (
							<div class="comment__delete-state">
								<div class="comment__description markdown markdown--resize-body">
									<p>
										This comment was deleted{' '}
										<span data-timestamp={this.data.deletedTimestamp}>
											{Shared.common.getTimeSince(this.data.deletedTimestamp)}
										</span>{' '}
										ago.
									</p>
								</div>
							</div>
						) : (
							<div class="comment__display-state">
								<div class="comment__description markdown markdown--resize-body">
									{this.data.markdown
										? DOM.parse(Shared.esgst.markdownParser.text(this.data.markdown)).body.children
										: ''}
								</div>
							</div>
						)}
						<div class="comment__actions">
							<div>
								<span data-timestamp={this.data.createdTimestamp}>
									{Shared.common.getTimeSince(this.data.createdTimestamp)}
								</span>{' '}
								ago
								{this.data.isEdited && <span data-timestamp={this.data.editedTimestamp}>*</span>}
							</div>
							{this.data.canReply && (
								<div class="comment__actions__button js__comment-reply">Reply</div>
							)}
							{this.data.canEdit && (
								<div class="comment__actions__button js__comment-edit">Edit</div>
							)}
							{this.data.canDelete && (
								<form>
									<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
									<input type="hidden" name="do" value="comment_delete" />
									<input type="hidden" name="allow_replies" value="1" />
									<input type="hidden" name="comment_id" value={this.data.id} />
									<div class="comment__actions__button js__comment-delete">Delete</div>
								</form>
							)}
							{this.data.canUndelete && (
								<form>
									<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
									<input type="hidden" name="do" value="comment_undelete" />
									<input type="hidden" name="allow_replies" value="1" />
									<input type="hidden" name="comment_id" value={this.data.id} />
									<div class="comment__actions__button js__comment-undelete">Undelete</div>
								</form>
							)}
							{!this.data.isOp && (
								<a rel="nofollow noopener" href={this.data.url} class="comment__actions__button">
									Permalink
								</a>
							)}
						</div>
						<div class="comment__collapse-state">
							<div class="comment__description markdown markdown--resize-body">
								<p>Comment has been collapsed.</p>
							</div>
						</div>
					</div>
				</div>
				{!this.data.isOp && <div class="comment__children"></div>}
			</div>
		);
		this.parseNodes(outer);
		for (const child of this.children) {
			child.build(this.nodes.children, 'beforeEnd');
		}
	}
}

class StComment extends Comment {
	constructor(generation: number = 0, parent: SgComment = null) {
		super(generation, parent);
	}

	static parseAll(context: HTMLElement, generation: number, parent: StComment = null): StComment[] {
		const comments: StComment[] = [];
		const elements = context.querySelectorAll(
			'.comments > .comment_outer:not([data-esgst-parsed]), :scope > .comment_outer:not([data-esgst-parsed]), .reviews > .review_outer:not([data-esgst-parsed]), :scope > .review_outer:not([data-esgst-parsed])'
		);
		for (const element of elements) {
			const comment = new StComment(generation, parent);
			comment.parse(element as StCommentOuter);
			comments.push(comment);
		}
		return comments;
	}

	parse(outer: StCommentOuter): void {
		this.author = User.create();
		this.parseNodes(outer);
		this.parseData();
		if (this.nodes.children) {
			this.children = StComment.parseAll(this.nodes.children, this.generation + 1, this);
		}
	}

	parseNodes(outer: StCommentOuter): void {
		const nodes: ICommentNodes = Comment.getDefaultNodes();
		const authorNodes: IUserNodes = User.getDefaultNodes();
		nodes.outer = outer;
		nodes.editState = nodes.outer.querySelector('.edit_form');
		if (nodes.editState) {
			nodes.editTextArea = nodes.editState.querySelector('[name="description"]');
			nodes.editSaveButton = nodes.editState.querySelector('.btn_action');
			nodes.editCancelButton = nodes.editState.querySelector('.btn_cancel');
		}
		nodes.inner = nodes.outer.querySelector('.comment_inner, .review_inner');
		nodes.author = nodes.inner.querySelector('.author');
		nodes.collapseButton = nodes.author.querySelector('.comment_collapse_btn');
		nodes.expandButton = nodes.author.querySelector('.comment_expand_btn');
		authorNodes.avatarOuter = nodes.author.querySelector('.author_avatar');
		authorNodes.usernameOuter = nodes.author.querySelector('.author_name');
		authorNodes.reputation = nodes.author.querySelector('.author_small');
		if (authorNodes.reputation) {
			authorNodes.positiveReputation = authorNodes.reputation.querySelector('.is_positive');
			authorNodes.negativeReputation = authorNodes.reputation.querySelector('.is_negative');
		}
		nodes.summary = nodes.inner.querySelector('.comment_body, .review_body');
		nodes.defaultState = nodes.summary.querySelector('.comment_body_default, .review_description');
		nodes.deleteState = nodes.summary.querySelector('.comment_body_delete');
		if (nodes.deleteState) {
			nodes.deletedTimestamp = nodes.deleteState.querySelector('[data-timestamp]');
		}
		nodes.actions = nodes.summary.querySelector('.action_list');
		const timestampNodes = (nodes.actions.querySelectorAll(
			'[data-timestamp]'
		) as any) as TimestampNode[];
		nodes.createdTimestamp = timestampNodes[0];
		if (timestampNodes.length === 2) {
			nodes.editedTimestamp = timestampNodes[1];
		}
		nodes.replyButton = nodes.actions.querySelector('.js_comment_reply');
		nodes.editButton = nodes.actions.querySelector('.js_comment_edit');
		nodes.deleteButton = nodes.actions.querySelector('.js_comment_delete');
		nodes.undeleteButton = nodes.actions.querySelector('.js_comment_undelete');
		nodes.sourceThread = nodes.actions.querySelector('[href*="/trade/"]');
		if (nodes.sourceThread) {
			nodes.source = nodes.sourceThread.parentElement as HTMLDivElement;
			nodes.sourceComment = nodes.source.querySelector('[href*="/go/comment/"]');
		}
		nodes.permalink = nodes.actions.querySelector('[href*="/go/comment/"]:last-child');
		nodes.collapseState = nodes.summary.querySelector('.comment_body_collapse');
		if (nodes.collapseState) {
			nodes.collapseCount = nodes.collapseState.querySelector('.comment_children_count');
		}
		nodes.rating = nodes.inner.querySelector('.review_rating');
		nodes.children = nodes.outer.querySelector('.review_children, .comment_children');
		nodes.outer.dataset.esgstParsed = '';
		this.nodes = nodes;
		this.author.nodes = authorNodes;
	}

	parseData(): void {
		const nodes = this.nodes;
		const authorNodes = this.author.nodes;
		const data: ICommentData = Comment.getDefaultData();
		const authorData: IUserData = User.getDefaultData();
		data.id = nodes.outer.dataset.id;
		if (nodes.editTextArea) {
			data.markdown = nodes.editTextArea.value;
		}
		data.isDeleted = authorNodes.avatarOuter.classList.contains('is_icon');
		if (!data.isDeleted) {
			authorData.steamId = authorNodes.avatarOuter.getAttribute('href').split('/')[2]; // /go/...
			authorData.avatar = authorNodes.avatarOuter.style.backgroundImage.slice(4, -2); // url(...);
			authorData.username = authorNodes.usernameOuter.textContent.trim();
			authorData.url = authorNodes.usernameOuter.getAttribute('href');
		}
		if (authorNodes.reputation) {
			authorData.positiveReputation = parseInt(
				authorNodes.positiveReputation.textContent.slice(1).replace(',', '')
			); // +...
			authorData.negativeReputation = parseInt(
				authorNodes.negativeReputation.textContent.slice(1).replace(',', '')
			); // -...
		}
		authorData.isOp = authorNodes.usernameOuter.classList.contains('is_op');
		if (nodes.deletedTimestamp) {
			data.deletedTimestamp = parseInt(nodes.deletedTimestamp.dataset.timestamp);
		}
		data.createdTimestamp = parseInt(nodes.createdTimestamp.dataset.timestamp);
		if (nodes.editedTimestamp) {
			data.editedTimestamp = parseInt(nodes.editedTimestamp.dataset.timestamp);
		}
		data.isEdited = !!data.editedTimestamp;
		data.canReply = !!nodes.replyButton;
		data.canEdit = !!nodes.editButton;
		data.canDelete = !!nodes.deleteButton;
		data.canUndelete = !!nodes.undeleteButton;
		if (nodes.source) {
			if (nodes.sourceComment) {
				data.sourceCommentUrl = nodes.sourceComment.getAttribute('href');
				data.sourceCommentAuthor = nodes.sourceComment.textContent.trim().slice(1); // @...
			}
			data.sourceThreadUrl = nodes.sourceThread.getAttribute('href');
			data.sourceThreadTitle = nodes.sourceThread.textContent.trim();
		}
		if (nodes.permalink) {
			data.url = nodes.permalink.getAttribute('href');
			data.code = data.url.split('/')[3]; // /go/comment/...
		}
		data.isReview = !!nodes.rating;
		data.isReviewPositive = nodes.rating.classList.contains('is_positive');
		this.data = data;
		this.author.data = authorData;
	}

	build(context: HTMLElement, position: string): void {
		if (this.nodes.outer) {
			this.nodes.outer.remove();
		}
		const body = (
			<fragment>
				<div class="author">
					{!this.data.isReview && (
						<fragment>
							<i class="comment_collapse_btn fa fa-minus-square-o"></i>
							<i class="comment_expand_btn fa fa-plus-square-o"></i>
						</fragment>
					)}
					{this.data.isDeleted ? (
						<fragment>
							<div class="author_avatar is_icon">
								<i class="fa fa-close"></i>
							</div>
							<div class="author_name">Deleted</div>
						</fragment>
					) : (
						<fragment>
							<a
								href={this.author.data.url}
								class="author_avatar"
								style={`background-image:url(${this.author.data.avatar});`}
							></a>
							<a
								href={this.author.data.url}
								class={`author_name${this.author.data.isOp ? ' is_op' : ''}`}
							>
								{this.author.data.username}
							</a>
							<a href={this.author.data.url} class="author_small">
								(<span class="is_positive">+{this.author.data.positiveReputation}</span>/
								<span class="is_negative">-{this.author.data.negativeReputation}</span>)
							</a>
						</fragment>
					)}
				</div>
				<div class={this.data.isReview ? 'review_body' : 'comment_body'}>
					{this.data.isDeleted ? (
						<div class="comment_body_delete markdown">
							<p>
								This comment was deleted{' '}
								<span data-timestamp={this.data.deletedTimestamp}>{`${Shared.common.getTimeSince(
									this.data.deletedTimestamp
								)} ago`}</span>
								.
							</p>
						</div>
					) : (
						<div
							class={`${
								this.data.isReview ? 'review_description' : 'comment_body_default'
							} markdown`}
						>
							{this.data.markdown
								? DOM.parse(Shared.esgst.markdownParser.text(this.data.markdown)).body.children
								: ''}
						</div>
					)}
					<div class="action_list">
						{this.data.isReview ? (
							<span>
								<span data-timestamp={this.data.createdTimestamp}>{`${Shared.common.getTimeSince(
									this.data.createdTimestamp
								)} ago`}</span>
							</span>
						) : (
							<div>
								<span data-timestamp={this.data.createdTimestamp}>{`${Shared.common.getTimeSince(
									this.data.createdTimestamp
								)} ago`}</span>
								{this.data.isEdited && <span data-timestamp={this.data.editedTimestamp}>*</span>}
							</div>
						)}
						{this.data.canReply && <a class="js_comment_reply">Reply</a>}
						{this.data.canEdit && <a class="js_comment_edit">Edit</a>}
						{this.data.canDelete && (
							<a
								data-form={`xsrf_token=${Session.xsrfToken}&do=comment_delete&comment_id=${this.data.id}`}
								class="js_comment_delete"
							>
								Delete
							</a>
						)}
						{this.data.canUndelete && (
							<a
								data-form={`xsrf_token=${Session.xsrfToken}&do=comment_undelete&comment_id=${this.data.id}`}
								class="js_comment_undelete"
							>
								Undelete
							</a>
						)}
						{this.data.sourceThreadTitle && (
							<div>
								{this.data.sourceCommentAuthor && (
									<fragment>
										<a rel="nofollow" href={this.data.sourceCommentUrl}>
											@{this.data.sourceCommentAuthor}
										</a>
										<i class="fa fa-fw fa-angle-right"></i>
									</fragment>
								)}
								<a href={this.data.sourceThreadUrl}>{this.data.sourceThreadTitle}</a>
							</div>
						)}
						{!this.data.isOp && (
							<a rel="nofollow" href={this.data.url}>
								Permalink
							</a>
						)}
					</div>
					<div class="comment_body_collapse markdown">
						<p class="comment_children_count"></p>
					</div>
				</div>
			</fragment>
		);
		const outer = DOM.insert(
			context,
			position,
			<div
				id={this.data.code}
				data-id={this.data.id}
				class={this.data.isReview ? 'review_outer' : 'comment_outer'}
			>
				{this.data.canEdit && (
					<div class="edit_form is_hidden">
						<form>
							<input type="hidden" name="xsrf_token" value={Session.xsrfToken} />
							<input type="hidden" name="do" value="comment_edit" />
							<input type="hidden" name="comment_id" value={this.data.id} />
							<textarea name="description">{this.data.markdown}</textarea>
							<div class="btn_actions">
								<div class="btn_action white js_submit">
									<i class="fa fa-edit"></i>
									<span>Edit</span>
								</div>
								<div class="btn_cancel">
									<span>Cancel</span>
								</div>
							</div>
						</form>
					</div>
				)}
				<div
					class={this.data.isReview ? 'review_inner' : 'comment_inner'}
					data-username={this.author.data.username}
				>
					{this.data.isReview ? (
						<fragment>
							<div class="review_flex">{body}</div>
							{this.data.isReviewPositive ? (
								<div class="review_rating is_positive">
									<div>
										<i class="fa fa-thumbs-up"></i>
									</div>
								</div>
							) : (
								<div class="review_rating is_negative">
									<div>
										<i class="fa fa-thumbs-down"></i>
									</div>
								</div>
							)}
						</fragment>
					) : (
						body
					)}
				</div>
				{!this.data.isOp && (
					<div class={this.data.isReview ? 'review_children' : 'comment_children'}></div>
				)}
			</div>
		);
		this.parseNodes(outer);
		for (const child of this.children) {
			child.build(this.nodes.children, 'beforeEnd');
		}
	}
}

export { Comment };
