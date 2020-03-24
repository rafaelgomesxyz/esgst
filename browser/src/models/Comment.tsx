import { DOM } from '../class/DOM.js';
import { Session } from '../class/Session.js';
import { Shared } from '../class/Shared.js';
import { Namespaces } from '../constants/Namespaces.js';
import { createUser } from './User';

abstract class CommentUtils implements ICommentUtils {
	constructor() {}

	abstract parseAll(context: HTMLElement, generation: number, parent: IComment): IComment[];
	abstract parse(outer: SgCommentOuter, generation: number, parent: IComment): IComment;
	abstract parseNodes(comment: IComment, outer: SgCommentOuter | StCommentOuter): void;
	abstract parseData(comment: IComment): void;
	abstract build(comment: IComment, context: HTMLElement, position: string): void;
}

class SgCommentUtils extends CommentUtils {
	constructor() {
		super();
	}

	parseAll(context: HTMLElement, generation: number = 0, parent: SgComment = null): SgComment[] {
		const comments: SgComment[] = [];
		const elements = context.querySelectorAll('.comments > .comment:not(.comment--submit):not([data-esgst-parsed]), :scope > .comment:not(.comment--submit):not([data-esgst-parsed])');
		for (const element of elements) {
			const comment = this.parse(element as SgCommentOuter, generation, parent);
			comments.push(comment);
		}
		return comments;
	}

	parse(outer: SgCommentOuter, generation: number = 0, parent: SgComment = null): SgComment {
		const comment = createComment(generation, parent);
		comment.author = createUser();
		this.parseNodes(comment, outer);
		this.parseData(comment);
		if (comment.nodes.children) {
			comment.children = this.parseAll(comment.nodes.children, comment.generation + 1, comment);
		}
		return comment;
	}

	parseNodes(comment: SgComment, outer: SgCommentOuter) {
		const nodes: ICommentNodes = comment.getDefaultNodes();
		const authorNodes: IUserNodes = comment.author.getDefaultNodes();
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
		authorNodes.patreon = nodes.author.querySelector('[href*="/patreon"]');
		nodes.defaultState = nodes.summary.querySelector('.comment__display-state');
		nodes.editState = nodes.summary.querySelector('.comment__edit-state');
		if (nodes.editState) {
			nodes.editTextArea = nodes.editState.querySelector('[name="description"]');
			nodes.editSaveButton = nodes.editState.querySelector('.js__comment-edit-save');
			nodes.editCancelButton = nodes.editState.querySelector('.js__comment-edit-cancel');
		}
		nodes.deleteState = nodes.summary.querySelector('.comment__delete-state');
		nodes.collapseState = nodes.summary.querySelector('.comment__collapse-state');
		nodes.actions = nodes.summary.querySelector('.comment__actions');
		const timestampNodes = nodes.actions.querySelectorAll('[data-timestamp]') as any as TimestampNode[];
		nodes.createdTimestamp = timestampNodes[0];
		if (timestampNodes.length === 2) {
			nodes.editedTimestamp = timestampNodes[1];
		}
		if (nodes.deleteState) {
			nodes.deletedTimestamp = nodes.deleteState.querySelector('[data-timestamp]');
		}
		nodes.replyButton = nodes.actions.querySelector('.js__comment-reply');
		nodes.editButton = nodes.actions.querySelector('.js__comment-edit');
		nodes.deleteButton = nodes.actions.querySelector('.js__comment-delete');
		nodes.undeleteButton = nodes.actions.querySelector('.js__comment-undelete');
		nodes.permalink = nodes.actions.querySelector('[href*="/go/comment/"]');
		nodes.children = nodes.outer.querySelector('.comment__children');
		nodes.outer.dataset.esgstParsed = '';
		comment.nodes = nodes;
		comment.author.nodes = authorNodes;
	}

	parseData(comment: SgComment) {
		const data: ICommentData = comment.getDefaultData();
		const authorData: IUserData = comment.author.getDefaultData();
		data.id = comment.nodes.outer.dataset.commentId || '';
		data.isDeleted = !comment.author.nodes.avatarInner;
		if (!data.isDeleted) {
			authorData.avatar = comment.author.nodes.avatarInner.style.backgroundImage.slice(4, -2);
			authorData.username = comment.author.nodes.usernameInner.textContent.trim();
		}
		authorData.isOp = comment.author.nodes.usernameOuter.classList.contains('comment__username--op');
		if (comment.author.nodes.role) {
			authorData.roleId = comment.author.nodes.role.getAttribute('href').split('/')[2];
			authorData.roleName = comment.author.nodes.role.textContent.trim().slice(1, -1);
		}
		authorData.isPatron = !!comment.author.nodes.patreon;
		if (comment.nodes.editTextArea) {
			data.markdown = comment.nodes.editTextArea.value;
		}
		data.createdTimestamp = parseInt(comment.nodes.createdTimestamp.dataset.timestamp);
		if (comment.nodes.editedTimestamp) {
			data.editedTimestamp = parseInt(comment.nodes.editedTimestamp.dataset.timestamp);
		}
		if (comment.nodes.deletedTimestamp) {
			data.deletedTimestamp = parseInt(comment.nodes.deletedTimestamp.dataset.timestamp);
		}
		data.isEdited = !!data.editedTimestamp;
		data.canReply = !!comment.nodes.replyButton;
		data.canEdit = !!comment.nodes.editButton;
		data.canDelete = !!comment.nodes.deleteButton;
		data.canUndelete = !!comment.nodes.undeleteButton;
		if (comment.nodes.permalink) {
			data.code = comment.nodes.permalink.getAttribute('href').split('/')[3];
		}
		comment.data = data;
		comment.author.data = authorData;
	}

	build(comment: SgComment, context: HTMLElement, position: string) {
		if (comment.nodes.outer) {
			comment.nodes.outer.remove();
		}
		const outer: SgCommentOuter = DOM.insert(context, position, (
			<div class="comment" data-comment-id={comment.data.id}>
				<div class={`ajax ${comment.parent ? 'comment__child' : 'comment__parent'}`}>
					{comment.data.isDeleted ? (
						<div class="global__image-outer-wrap global__image-outer-wrap--avatar-small global__image-outer-wrap--missing-image">
							<i class="fa fa-user"></i>
						</div>
					) : (
						<a class="global__image-outer-wrap global__image-outer-wrap--avatar-small" href={`/user/${comment.author.data.username}`}>
							<div class="global__image-inner-wrap" style={`background-image:url(${comment.author.data.avatar});`}></div>
						</a>
					)}
					<div class="comment__summary" id={comment.data.code}>
						<div class="comment__author">
							<i class="comment__collapse-button fa fa-minus-square-o"></i>
							<i class="comment__expand-button fa fa-plus-square-o"></i>
							{comment.data.isDeleted ? (
								<div class="comment__username comment__username--deleted">Deleted</div>
							) : (
								<div class={`comment__username${comment.author.data.isOp ? ' comment__username--op' : ''}`}>
									<a href={`/user/${comment.author.data.username}`}>{comment.author.data.username}</a>
								</div>
							)}
							{comment.author.data.roleName && (
								<a href={`/roles/${comment.author.data.roleId}`} class="comment__role-name">{`(${comment.author.data.roleName})`}</a>
							)}
							{comment.author.data.isPatron && (
								<a href="/account/settings/patreon">
									<i class="fa fa-star"></i>
								</a>
							)}
						</div>
						{comment.data.canEdit && (
							<div class="comment__edit-state is-hidden">
								<div class="comment__description">
									<form>
										<input type="hidden" name="xsrf_token" value={Session.xsrfToken}/>
										<input type="hidden" name="do" value="comment_edit"/>
										<input type="hidden" name="allow_replies" value="1"/>
										<input type="hidden" name="comment_id" value={comment.data.id}/>
										<textarea name="description">{comment.data.markdown}</textarea>
										<div class="align-button-container">
											<a class="comment__submit-button js__comment-edit-save" href="">Save Changes</a>
											<div class="comment__cancel-button js__comment-edit-cancel">
												<span>Cancel</span>
											</div>
										</div>
									</form>
								</div>
							</div>
						)}
						{comment.data.isDeleted ? (
							<div class="comment__delete-state">
								<div class="comment__description markdown markdown--resize-body">
									<p>This comment was deleted <span data-timestamp={comment.data.deletedTimestamp}>{Shared.common.getTimeSince(comment.data.deletedTimestamp)}</span> ago.</p>
								</div>
							</div>
						) : (
							<div class="comment__display-state">
								<div class="comment__description markdown markdown--resize-body">{comment.data.markdown ? DOM.parse(Shared.esgst.markdownParser.text(comment.data.markdown)).body.children : ''}</div>
							</div>
						)}
						<div class="comment__actions">
							<div>
								<span data-timestamp={comment.data.createdTimestamp}>{Shared.common.getTimeSince(comment.data.createdTimestamp)}</span> ago
								{comment.data.isEdited && (
									<span data-timestamp={comment.data.createdTimestamp}>*</span>
								)}
							</div>
							{comment.data.canReply && (
								<div class="comment__actions__button js__comment-reply">Reply</div>
							)}
							{comment.data.canEdit && (
								<div class="comment__actions__button js__comment-edit">Edit</div>
							)}
							{comment.data.canDelete && (
								<form>
									<input type="hidden" name="xsrf_token" value={Session.xsrfToken}/>
									<input type="hidden" name="do" value="comment_delete"/>
									<input type="hidden" name="allow_replies" value="1"/>
									<input type="hidden" name="comment_id" value={comment.data.id}/>
									<div class="comment__actions__button js__comment-delete">Delete</div>
								</form>
							)}
							{comment.data.canUndelete && (
								<form>
									<input type="hidden" name="xsrf_token" value={Session.xsrfToken}/>
									<input type="hidden" name="do" value="comment_undelete"/>
									<input type="hidden" name="allow_replies" value="1"/>
									<input type="hidden" name="comment_id" value={comment.data.id}/>
									<div class="comment__actions__button js__comment-undelete">Delete</div>
								</form>
							)}
							<a class="comment__actions__button" href="/go/comment/cnVoepa" rel="nofollow noopener">Permalink</a>
						</div>
						<div class="comment__collapse-state">
							<div class="comment__description markdown markdown--resize-body">
								<p>Comment has been collapsed.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="comment__children"></div>
			</div>
		));
		this.parseNodes(comment, outer);
		for (const child of comment.children) {
			this.build(child, comment.nodes.children, 'beforeEnd');
		}
	}
}

class StCommentUtils extends CommentUtils {
	constructor() {
		super();
	}

	parseAll(context: HTMLElement, generation: number = 0, parent: StComment = null): StComment[] {
		const comments: StComment[] = [];
		const elements = context.querySelectorAll('.comments > .comment_outer:not([data-esgst-parsed]), :scope > .comment_outer:not([data-esgst-parsed])');
		for (const element of elements) {
			const comment = this.parse(element as SgCommentOuter, generation, parent);
			comments.push(comment);
		}
		return comments;
	}

	parse(outer: StCommentOuter, generation: number = 0, parent: StComment = null): StComment {
		const comment = createComment(generation, parent);
		comment.author = createUser();
		this.parseNodes(comment, outer);
		this.parseData(comment);
		if (comment.nodes.children) {
			comment.children = this.parseAll(comment.nodes.children, comment.generation + 1, comment);
		}
		return comment;
	}

	parseNodes(comment: StComment, outer: StCommentOuter) {
		const nodes: ICommentNodes = comment.getDefaultNodes();
		const authorNodes: IUserNodes = comment.author.getDefaultNodes();
		nodes.outer = outer;
		nodes.inner = nodes.outer.querySelector('.comment_inner');
		nodes.author = nodes.inner.querySelector('.author');
		nodes.collapseButton = nodes.author.querySelector('.comment_collapse_btn');
		nodes.expandButton = nodes.author.querySelector('.comment_expand_btn');
		authorNodes.avatarInner = nodes.author.querySelector('.author_avatar');
		authorNodes.usernameInner = nodes.author.querySelector('.author_name');
		authorNodes.reputation = nodes.author.querySelector('.author_small');
		if (authorNodes.reputation) {
			authorNodes.positiveReputation = authorNodes.reputation.querySelector('.is_positive');
			authorNodes.negativeReputation = authorNodes.reputation.querySelector('.is_negative');
		}
		nodes.summary = nodes.inner.querySelector('.comment_body');
		nodes.defaultState = nodes.summary.querySelector('.comment_body_default');
		nodes.editState = nodes.outer.querySelector('.edit_form');
		if (nodes.editState) {
			nodes.editTextArea = nodes.editState.querySelector('[name="description"]');
			nodes.editSaveButton = nodes.editState.querySelector('.btn_action');
			nodes.editCancelButton = nodes.editState.querySelector('.btn_cancel');
		}
		nodes.deleteState = nodes.summary.querySelector('.comment_body_delete');
		nodes.collapseState = nodes.summary.querySelector('.comment_body_collapse');
		nodes.actions = nodes.summary.querySelector('.action_list');
		const timestampNodes = nodes.actions.querySelectorAll('[data-timestamp]') as any as TimestampNode[];
		nodes.createdTimestamp = timestampNodes[0];
		if (timestampNodes.length === 2) {
			nodes.editedTimestamp = timestampNodes[1];
		}
		if (nodes.deleteState) {
			nodes.deletedTimestamp = nodes.deleteState.querySelector('[data-timestamp]');
		}
		nodes.source = nodes.actions.querySelector('[href*="/trade/"]');
		nodes.permalink = nodes.actions.querySelector('[href*="/go/comment/"]:last-child');
		nodes.replyButton = nodes.actions.querySelector('.js_comment_reply');
		nodes.editButton = nodes.actions.querySelector('.js_comment_edit');
		nodes.deleteButton = nodes.actions.querySelector('.js_comment_delete');
		nodes.undeleteButton = nodes.actions.querySelector('.js_comment_undelete');
		nodes.children = nodes.outer.querySelector('.comment_children');
		nodes.outer.dataset.esgstParsed = '';
		comment.nodes = nodes;
		comment.author.nodes = authorNodes;
	}

	parseData(comment: StComment) {
		const data: ICommentData = comment.getDefaultData();
		const authorData: IUserData = comment.author.getDefaultData();
		data.id = comment.nodes.outer.dataset.id;
		data.isDeleted = comment.author.nodes.avatarInner.classList.contains('is_icon');
		if (!data.isDeleted) {
			authorData.steamId = comment.author.nodes.avatarInner.getAttribute('href').split('/')[2];
			authorData.avatar = comment.author.nodes.avatarInner.style.backgroundImage.slice(4, -2);
			authorData.username = comment.author.nodes.usernameInner.textContent.trim();
			authorData.positiveReputation = parseInt(comment.author.nodes.positiveReputation.textContent.slice(1).replace(',', ''));
			authorData.negativeReputation = parseInt(comment.author.nodes.negativeReputation.textContent.slice(1).replace(',', ''));
		}
		authorData.isOp = comment.author.nodes.usernameInner.classList.contains('is_op');
		if (comment.nodes.editTextArea) {
			data.markdown = comment.nodes.editTextArea.value;
		}
		data.createdTimestamp = parseInt(comment.nodes.createdTimestamp.dataset.timestamp);
		if (comment.nodes.editedTimestamp) {
			data.editedTimestamp = parseInt(comment.nodes.editedTimestamp.dataset.timestamp);
		}
		if (comment.nodes.deletedTimestamp) {
			data.deletedTimestamp = parseInt(comment.nodes.deletedTimestamp.dataset.timestamp);
		}
		data.isEdited = !!data.editedTimestamp;
		data.canReply = !!comment.nodes.replyButton;
		data.canEdit = !!comment.nodes.editButton;
		data.canDelete = !!comment.nodes.deleteButton;
		data.canUndelete = !!comment.nodes.undeleteButton;
		if (comment.nodes.source) {
			data.source = comment.nodes.source.getAttribute('href');
		}
		if (comment.nodes.permalink) {
			data.code = comment.nodes.permalink.getAttribute('href').split('/')[3];
		}
		comment.data = data;
		comment.author.data = authorData;
	}

	build(comment: StComment, context: HTMLElement, position: string) {
		if (comment.nodes.outer) {
			comment.nodes.outer.remove();
		}
		const outer: StCommentOuter = DOM.insert(context, position, (
			<div class="comment_outer" data-id={comment.data.id} id={comment.data.code}>
				{comment.data.canEdit && (
					<div class="edit_form is_hidden">
						<form>
							<input type="hidden" name="xsrf_token" value={Session.xsrfToken}/>
							<input type="hidden" name="do" value="comment_edit"/>
							<input type="hidden" name="comment_id" value={comment.data.id}/>
							<textarea name="description">{comment.data.markdown}</textarea>
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
				<div class="comment_inner" data-username={comment.author.data.username}>
					<div class="author">
						<i class="comment_collapse_btn fa fa-minus-square-o"></i>
						<i class="comment_expand_btn fa fa-plus-square-o"></i>
						{comment.data.isDeleted ? (
							<fragment>
								<div class="author_avatar is_icon">
									<i class="fa fa-close"></i>
								</div>
								<div class="author_name">Deleted</div>
							</fragment>
						) : (
							<fragment>
								<a class="author_avatar" href={`/user/${comment.author.data.steamId}`} style={`background-image:url(${comment.author.data.avatar});`}></a>
								<a class={`author_name${comment.author.data.isOp ? ' is_op' : ''}`} href={`/user/${comment.author.data.steamId}`}>{comment.author.data.username}</a>
								<a class="author_small" href={`/user/${comment.author.data.steamId}`}>(<span class="is_positive">{`+${comment.author.data.positiveReputation}`}</span>/<span class="is_negative">{`-${comment.author.data.negativeReputation}`}</span>)</a>
							</fragment>
						)}
					</div>
					<div class="comment_body">
						{comment.data.isDeleted ? (
							<div class="comment_body_delete markdown">
								<p>This comment was deleted <span data-timestamp={comment.data.deletedTimestamp}>{`${Shared.common.getTimeSince(comment.data.deletedTimestamp)} ago`}</span>.</p>
							</div>
						) : (
							<div class="comment_body_default markdown">{comment.data.markdown ? DOM.parse(Shared.esgst.markdownParser.text(comment.data.markdown)).body.children : ''}</div>
						)}
						<div class="action_list">
							<div>
								<span data-timestamp={comment.data.createdTimestamp}>{`${Shared.common.getTimeSince(comment.data.createdTimestamp)} ago}`}</span>
								{comment.data.isEdited && (
									<span data-timestamp={comment.data.editedTimestamp}>*</span>
								)}
							</div>
							{comment.data.canReply && (
								<a class="js_comment_reply">Reply</a>
							)}
							{comment.data.canEdit && (
								<a class="js_comment_edit">Edit</a>
							)}
							{comment.data.canDelete && (
								<a class="js_comment_delete" data-form={`xsrf_token=${Session.xsrfToken}&amp;do=comment_delete&amp;comment_id=${comment.data.id}`}>Delete</a>
							)}
							{comment.data.canUndelete && (
								<a class="js_comment_undelete" data-form={`xsrf_token=${Session.xsrfToken}&amp;do=comment_undelete&amp;comment_id=${comment.data.id}`}>Undelete</a>
							)}
							{comment.data.source && (
								<div>
									<a href={comment.data.source}>Source</a>
								</div>
							)}
							<a href={`/go/comment/${comment.data.code}`} rel="nofollow">Permalink</a>
						</div>
						<div class="comment_body_collapse markdown">
							<p class="comment_children_count"></p>
						</div>
					</div>
				</div>
				<div class="comment_children"></div>
			</div>
		));
		this.parseNodes(comment, outer);
		for (const child of comment.children) {
			this.build(child, comment.nodes.children, 'beforeEnd');
		}
	}
}

abstract class Comment implements IComment {
	nodes: ICommentNodes;
	data: ICommentData;
	author: IUser;
	generation: number;
	parent: IComment;
	children: IComment[];

	constructor(generation: number = 0, parent: IComment = null) {
		this.nodes = this.getDefaultNodes();
		this.data = this.getDefaultData();
		this.author = null;
		this.generation = generation;
		this.parent = parent;
		this.children = [];
	}

	getDefaultNodes(): ICommentNodes {
		return {
			outer: null,
			inner: null,
			summary: null,
			author: null,
			collapseButton: null,
			expandButton: null,
			collapseState: null,
			actions: null,
			createdTimestamp: null,
			permalink: null,
		};
	}

	getDefaultData(): ICommentData {
		return {
			isDeleted: false,
			createdTimestamp: 0,
			isEdited: false,
			canReply: false,
			canEdit: false,
			canDelete: false,
			canUndelete: false,
			code: '',
		};
	}
}

class SgComment extends Comment {
	constructor(generation: number = 0, parent: SgComment = null) {
		super(generation, parent);
	}
}

class StComment extends Comment {
	constructor(generation: number = 0, parent: StComment = null) {
		super(generation, parent);
	}
}

const createCommentUtils = (): ICommentUtils => {
	switch (Session.namespace) {
		case Namespaces.SG:
			return new SgCommentUtils();
		case Namespaces.ST:
			return new StCommentUtils();
	}
	return null;
};

const createComment = (generation: number = 0, parent: IComment = null): IComment => {
	switch (Session.namespace) {
		case Namespaces.SG:
			return new SgComment(generation, parent);
		case Namespaces.ST:
			return new StComment(generation, parent);
	}
	return null;
};

export { createCommentUtils, createComment };