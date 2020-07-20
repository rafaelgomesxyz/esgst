import { DOM } from '../class/DOM';
import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';
import { Comment } from './Comment';

abstract class CommentEntity implements ICommentEntity {
	nodes: ICommentEntityNodes;
	data: ICommentEntityData;
	comments: IComment[];

	constructor() {
		this.nodes = CommentEntity.getDefaultNodes();
		this.data = CommentEntity.getDefaultData();
		this.comments = [];
	}

	static getDefaultNodes(): ICommentEntityNodes {
		return {
			outer: null,
			title: null,
			description: null,
			comments: null,
		};
	}

	static getDefaultData(): ICommentEntityData {
		return {
			url: '',
			title: '',
			description: '',
		};
	}

	static create(): ICommentEntity {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return new SgCommentEntity();
			}
		}
		return null;
	}

	static parseAll(context: HTMLElement): ICommentEntity[] {
		switch (Session.namespace) {
			case Namespaces.SG: {
				return SgCommentEntity.parseAll(context);
			}
		}
		return null;
	}

	abstract parse(outer: HTMLDivElement): void;
	abstract parseNodes(outer: HTMLDivElement): void;
	abstract parseData(): void;
	abstract build(context: HTMLElement, position: string): void;
}

class SgCommentEntity extends CommentEntity {
	constructor() {
		super();
	}

	static parseAll(context: HTMLElement): SgCommentEntity[] {
		const entities: SgCommentEntity[] = [];
		const elements = context.querySelectorAll(
			'.comments > .comments__entity:not([data-esgst-parsed]), :scope > .comments__entity:not([data-esgst-parsed])'
		);
		for (const element of elements) {
			const entity = new SgCommentEntity();
			entity.parse(element as HTMLDivElement);
			entities.push(entity);
		}
		return entities;
	}

	parse(outer: HTMLDivElement): void {
		this.parseNodes(outer);
		this.parseData();
		this.comments = Comment.parseAll(this.nodes.comments);
	}

	parseNodes(outer: HTMLDivElement): void {
		const nodes = CommentEntity.getDefaultNodes();
		nodes.outer = outer;
		nodes.title = nodes.outer.querySelector('.comments__entity__name a');
		nodes.description = nodes.outer.querySelector('.comments__entity__description');
		nodes.comments = nodes.outer.nextElementSibling as HTMLDivElement;
		nodes.outer.dataset.esgstParsed = '';
		this.nodes = nodes;
	}

	parseData(): void {
		const nodes = this.nodes;
		const data = CommentEntity.getDefaultData();
		data.url = nodes.title.getAttribute('href');
		data.title = nodes.title.textContent.trim();
		data.description = nodes.description.innerHTML;
		this.data = data;
	}

	build(context: HTMLElement, position: string): void {
		if (this.nodes.outer) {
			this.nodes.outer.remove();
		}
		const outer = DOM.insert(
			context,
			position,
			<div class="comments__entity">
				<p class="comments__entity__name">
					<a href={this.data.url}>{this.data.title}</a>
				</p>
				<div class="markdown markdown--resize-body comments__entity__description">
					{this.data.description}
				</div>
			</div>
		);
		DOM.insert(outer, 'afterEnd', <div class="comments"></div>);
		this.parseNodes(outer);
		for (const comment of this.comments) {
			comment.build(this.nodes.comments, 'beforeEnd');
		}
	}
}

export { CommentEntity };
