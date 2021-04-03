declare interface Window {
	wrappedJSObject?: {
		AbortController: typeof AbortController;
		fetch: typeof window.fetch;
		fetchOptions: RequestInit;
	};
}

declare let XPCNativeWrapper: <T>(value: T) => T;

declare let cloneInto: <T>(value: T, window: Window) => T;

declare namespace JSX {
	type IntrinsicElements = {
		[K in keyof HTMLElementTagNameMap]: Omit<
			import('./class/DOM').ElementAttributes<K>,
			'children'
		> & {
			children?: import('./class/DOM').ElementChildren | import('./class/DOM').ElementChild;
		};
	} & {
		fragment: {
			children?: import('./class/DOM').ElementChildren | import('./class/DOM').ElementChild;
		};
	};
}

declare interface Element {
	textContent: string;
}

declare interface ChildNode {
	textContent: string;
}

declare interface Text {
	textContent: string;
}

interface ICommentEntity {
	nodes: ICommentEntityNodes;
	data: ICommentEntityData;
	comments: IComment[];

	parse(outer: HTMLDivElement): void;
	parseNodes(outer: HTMLDivElement): void;
	parseData(): void;
	build(context: HTMLElement, position: string): void;
}

interface ICommentEntityNodes {
	outer: HTMLDivElement;
	title: HTMLAnchorElement;
	description: HTMLDivElement;
	comments: HTMLDivElement;
}

interface ICommentEntityData {
	url: string;
	title: string;
	description: string;
}

interface IComment {
	nodes: ICommentNodes;
	data: ICommentData;
	author: import('./models/User').User;
	attachedImages: IAttachedImage[];
	generation: number;
	parent: IComment;
	children: IComment[];
	mrBox: ICommentBox;

	parse(outer: SgCommentOuter | StCommentOuter): void;
	parseNodes(outer: SgCommentOuter | StCommentOuter): void;
	parseData(): void;
	build(context: HTMLElement, position: string): void;
}

interface ICommentNodes {
	outer: SgCommentOuter | StCommentOuter;
	inner: HTMLDivElement;
	summary: HTMLDivElement;
	author: HTMLDivElement;
	collapseButton: HTMLElement;
	expandButton: HTMLElement;
	defaultState: HTMLDivElement;
	editState: HTMLDivElement;
	editTextArea: HTMLTextAreaElement;
	editSaveButton: HTMLAnchorElement;
	editCancelButton: HTMLDivElement;
	deleteState: HTMLDivElement;
	collapseState: HTMLDivElement;
	collapseCount: HTMLDivElement;
	actions: HTMLDivElement;
	createdTimestamp: TimestampNode;
	editedTimestamp: TimestampNode;
	deletedTimestamp: TimestampNode;
	replyButton: HTMLDivElement;
	editButton: HTMLDivElement;
	deleteButton: HTMLDivElement;
	undeleteButton: HTMLDivElement;
	source: HTMLDivElement;
	sourceComment: HTMLAnchorElement;
	sourceThread: HTMLAnchorElement;
	permalink: HTMLAnchorElement;
	rmlLink: HTMLAnchorElement;
	rating: HTMLDivElement;
	children: HTMLDivElement;
}

interface ICommentData {
	id: string;
	isDeleted: boolean;
	markdown: string;
	createdTimestamp: number;
	editedTimestamp: number;
	deletedTimestamp: number;
	isEdited: boolean;
	canReply: boolean;
	canEdit: boolean;
	canDelete: boolean;
	canUndelete: boolean;
	sourceCommentUrl: string;
	sourceCommentAuthor: string;
	sourceThreadUrl: string;
	sourceThreadTitle: string;
	url: string;
	code: string;
	isOp: boolean;
	isReview: boolean;
	isReviewPositive: boolean;
}

type SgCommentOuter = HTMLDivElement & {
	dataset: {
		commentId?: string;
	};
};

type StCommentOuter = HTMLDivElement & {
	dataset: {
		id?: string;
	};
};

type TimestampNode = HTMLSpanElement & {
	dataset: {
		timestamp: string;
	};
};

interface IAttachedImage {
	nodes: IAttachedImageNodes;
	data: IAttachedImageData;

	parse(outer: HTMLDivElement): void;
	parseNodes(outer: HTMLDivElement): void;
	parseData(): void;
	build(context: HTMLElement, position: string): void;
}

interface IAttachedImageNodes {
	outer: HTMLDivElement;
	button: HTMLDivElement;
	link: HTMLAnchorElement;
	image: HTMLImageElement;
}

interface IAttachedImageData {
	title: string;
	url: string;
}

interface ICommentBox {
	nodes: ICommentBoxNodes;
	data: ICommentBoxData;
	author: import('./models/User').User;
	parent: IComment;

	parse(outer: HTMLDivElement): void;
	parseNodes(outer: HTMLDivElement): void;
	parseData(): void;
	build(context: HTMLElement, position: string): void;
}

interface ICommentBoxNodes {
	outer: HTMLDivElement;
	inner: HTMLDivElement;
	summary: HTMLDivElement;
	author: HTMLDivElement;
	defaultState: HTMLDivElement;
	heading: HTMLDivElement;
	form: HTMLFormElement;
	textArea: HTMLTextAreaElement;
	tradeCodeField: HTMLInputElement;
	profileIdField: HTMLInputElement;
	buttons: HTMLDivElement;
	rating: HTMLDivElement;
	positiveRating: HTMLDivElement;
	negativeRating: HTMLDivElement;
	submitButton: HTMLAnchorElement;
	cancelButton: HTMLDivElement;
}

interface ICommentBoxData {
	tradeCode: string;
	profileId: string;
	markdown: string;
	isReview: boolean;
}
