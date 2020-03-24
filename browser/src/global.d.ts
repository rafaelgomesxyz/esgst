declare namespace JSX {
  type IntrinsicElements = Record<keyof HTMLElementTagNameMap, any> & {
    fragment: any,
  };
}

interface IUserUtils {}

interface IUser {
  nodes: IUserNodes,
	data: IUserData,

	getDefaultNodes(): IUserNodes,
	getDefaultData(): IUserData,
}

interface IUserNodes {
  avatarOuter?: HTMLAnchorElement | HTMLDivElement,
	avatarInner?: HTMLDivElement,
  usernameOuter: HTMLDivElement,
  usernameInner: HTMLAnchorElement,
  role?: HTMLAnchorElement,
  patreon?: HTMLAnchorElement,
  reputation?: HTMLAnchorElement,
	positiveReputation?: HTMLSpanElement,
	negativeReputation?: HTMLSpanElement,
}

interface IUserData {
  id?: string,
  steamId?: string,
  avatar?: string,
  username: string,
  isOp?: boolean,
  roleId?: string,
  roleName?: string,
  isPatron?: boolean,
  positiveReputation?: number,
	negativeReputation?: number,
}

interface ICommentEntity {
	nodes: ICommentEntityNodes,
	data: ICommentEntityData,
	comments: IComment[],
}

interface ICommentEntityNodes {
	container: HTMLDivElement,
	name: HTMLAnchorElement,
	description: HTMLDivElement,
	comments: HTMLDivElement,
}

interface ICommentEntityData {
	url: string,
	name: string,
	description: string,
}

interface ICommentUtils {
	parseAll(context: HTMLElement, generation: number, parent: IComment): IComment[],
	parse(outer: SgCommentOuter, generation: number, parent: IComment): IComment,
	parseNodes(comment: IComment, outer: SgCommentOuter | StCommentOuter): void,
	parseData(comment: IComment): void,
	build(comment: IComment, context: HTMLElement, position: string): void,
}

interface IComment {
	nodes: ICommentNodes,
	data: ICommentData,
	author: IUser,
	generation: number,
	parent: IComment,
	children: IComment[],

	getDefaultNodes(): ICommentNodes,
	getDefaultData(): ICommentData,
}

interface ICommentNodes {
	outer: SgCommentOuter | StCommentOuter,
	inner: HTMLDivElement,
	summary: HTMLDivElement,
	author: HTMLDivElement,
	collapseButton: HTMLElement,
	expandButton: HTMLElement,
	defaultState?: HTMLDivElement,
	editState?: HTMLDivElement,
	editTextArea?: HTMLTextAreaElement,
	editSaveButton?: HTMLAnchorElement,
	editCancelButton?: HTMLDivElement,
	deleteState?: HTMLDivElement,
	collapseState: HTMLDivElement,
	actions: HTMLDivElement,
	createdTimestamp: TimestampNode,
	editedTimestamp?: TimestampNode,
	deletedTimestamp?: TimestampNode,
	replyButton?: HTMLDivElement,
	editButton?: HTMLDivElement,
	deleteButton?: HTMLDivElement,
	undeleteButton?: HTMLDivElement,
	source?: HTMLAnchorElement,
	permalink: HTMLAnchorElement,
	children?: HTMLDivElement,
}

interface ICommentData {
	id?: string,
	isDeleted: boolean,
	markdown?: string,
	createdTimestamp: number,
	editedTimestamp?: number,
	deletedTimestamp?: number,
	isEdited: boolean,
	canReply: boolean,
	canEdit: boolean,
	canDelete: boolean,
	canUndelete: boolean,
	source?: string,
	code: string,
}

type SgCommentOuter = HTMLDivElement & {
	dataset: {
		commentId?: string,
	},
};

type StCommentOuter = HTMLDivElement & {
	dataset: {
		id?: string,
	},
};

type TimestampNode = HTMLSpanElement & {
	dataset: {
		timestamp: string,
	},
};