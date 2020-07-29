import { DOM } from '../class/DOM';
import { EventDispatcher } from '../class/EventDispatcher';
import { Session } from '../class/Session';
import { ClassNames } from '../constants/ClassNames';
import { Events } from '../constants/Events';
import { Namespaces } from '../constants/Namespaces';
import { Utils } from '../lib/jsUtils';
import { Base, BaseData, BaseNodes } from './Base';

export type PageHeadingOptions = Partial<PageHeadingData> | PageHeadingBreadcrumb[];

export interface PageHeadingData extends BaseData {
	breadcrumbs: PageHeadingBreadcrumb[];
}

export type PageHeadingBreadcrumb = string | Node | PageHeadingBreadcrumbLink;

export interface PageHeadingBreadcrumbLink {
	url: string;
	name: string;
}

export interface PageHeadingNodes extends BaseNodes {
	outer: HTMLDivElement | null;
	breadcrumbsContainer: HTMLDivElement | null;
	breadcrumbs: HTMLElement[];
}

export abstract class PageHeading extends Base<PageHeading, PageHeadingData, PageHeadingNodes> {
	static readonly selectors = {
		[Namespaces.SG]: `.${ClassNames[Namespaces.SG].pageHeading}`,
		[Namespaces.ST]: `.${ClassNames[Namespaces.ST].pageHeading}`,
	};

	protected _featureId: string;
	protected _data: PageHeadingData;
	protected _nodes: PageHeadingNodes;

	constructor(featureId: string, options: PageHeadingOptions, namespace: number) {
		super(namespace);
		this._featureId = featureId;
		this._data = PageHeading.getInitialData(options);
		this._nodes = PageHeading.getInitialNodes();
	}

	static getInitialData = (options: PageHeadingOptions = {}): PageHeadingData => {
		let breadcrumbs: PageHeadingBreadcrumb[];
		if (Array.isArray(options)) {
			breadcrumbs = options;
		} else {
			breadcrumbs = [...(options.breadcrumbs ?? [])];
		}
		return {
			isHidden: false,
			breadcrumbs,
		};
	};

	static getInitialNodes = (): PageHeadingNodes => {
		return {
			outer: null,
			breadcrumbsContainer: null,
			breadcrumbs: [],
		};
	};

	static create = (
		featureId: string,
		options: PageHeadingOptions = {},
		namespace = Session.namespace
	): PageHeading => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgPageHeading(featureId, options);
			case Namespaces.ST:
				return new StPageHeading(featureId, options);
			default:
				throw PageHeading.getError('failed to create');
		}
	};

	static getAll = (
		featureId: string,
		referenceNode: Element,
		namespace = Session.namespace
	): PageHeading[] => {
		const pageHeadings: PageHeading[] = [];
		const nodes = referenceNode.querySelectorAll(PageHeading.selectors[namespace]);
		for (const node of nodes) {
			const pageHeading = PageHeading.create(featureId, {}, namespace);
			pageHeading.parse(node);
			pageHeadings.push(pageHeading);
		}
		return pageHeadings;
	};

	build = (): PageHeading => {
		if (!this._nodes.outer) {
			this._nodes.outer = (
				<div
					className={ClassNames[this._namespace].pageHeading}
					dataset={{ esgst: this._featureId }}
				>
					<div
						className={ClassNames[this._namespace].pageHeadingBreadcrumbs}
						ref={(ref) => (this._nodes.breadcrumbsContainer = ref)}
					></div>
				</div>
			);
		}
		this.setBreadcrumbs(this._data.breadcrumbs);
		this._hasBuilt = true;
		void EventDispatcher.dispatch(Events.PAGE_HEADING_BUILD, this);
		return this;
	};

	reset = (): PageHeading => {
		const outerNode = this._nodes.outer;
		const breadcrumbsContainerNode = this._nodes.breadcrumbsContainer;
		this._data = PageHeading.getInitialData();
		this._nodes = PageHeading.getInitialNodes();
		if (outerNode) {
			this._nodes.outer = outerNode;
			this._nodes.breadcrumbsContainer = breadcrumbsContainerNode;
			this._hasBuilt = false;
			this.build();
		}
		return this;
	};

	setBreadcrumbs(breadcrumbs: PageHeadingBreadcrumb[]): PageHeading {
		if (!this._nodes.breadcrumbsContainer) {
			throw this.getError('failed to set breadcrumbs');
		}
		if (Utils.isDeepEqual(this._data.breadcrumbs, breadcrumbs)) {
			return this;
		}
		this._data.breadcrumbs = breadcrumbs;
		this._nodes.breadcrumbs = [];
		DOM.insert(
			this._nodes.breadcrumbsContainer,
			'atinner',
			<fragment>
				{this._data.breadcrumbs
					.map((breadcrumb) => [
						typeof breadcrumb === 'string' || breadcrumb instanceof Node ? (
							<span ref={(ref) => this._nodes.breadcrumbs.push(ref)}>{breadcrumb}</span>
						) : (
							<a href={breadcrumb.url} ref={(ref) => this._nodes.breadcrumbs.push(ref)}>
								{breadcrumb.name}
							</a>
						),
						<i className="fa fa-angle-right"></i>,
					])
					.flat()
					.slice(0, -1)}
			</fragment>
		);
		return this;
	}

	parse = (referenceNode: Element): PageHeading => {
		if (!referenceNode.matches(PageHeading.selectors[this._namespace])) {
			throw this.getError('failed to parse');
		}
		this._nodes.outer = referenceNode as HTMLDivElement;
		this.parseBreadcrumbs();
		return this;
	};

	parseBreadcrumbs = (): PageHeading => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse breadcrumbs');
		}
		this._nodes.breadcrumbsContainer = this._nodes.outer.querySelector(
			ClassNames[this._namespace].pageHeadingBreadcrumbs
		);
		if (!this._nodes.breadcrumbsContainer) {
			throw this.getError('failed to parse breadcrumbs');
		}
		this._data.breadcrumbs = [];
		this._nodes.breadcrumbs = Array.from(
			this._nodes.breadcrumbsContainer.children
		) as HTMLDivElement[];
		for (const breadcrumbNode of this._nodes.breadcrumbs) {
			this._data.breadcrumbs.push({
				url: breadcrumbNode.getAttribute('href') ?? '',
				name: breadcrumbNode.textContent.trim(),
			});
		}
		return this;
	};
}

export class SgPageHeading extends PageHeading {
	constructor(featureId: string, options: PageHeadingOptions) {
		super(featureId, options, Namespaces.SG);
	}
}

export class StPageHeading extends PageHeading {
	constructor(featureId: string, options: PageHeadingOptions) {
		super(featureId, options, Namespaces.ST);
	}
}
