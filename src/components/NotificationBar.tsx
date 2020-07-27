import { DOM, ElementChild } from '../class/DOM';
import { EventDispatcher } from '../class/EventDispatcher';
import { Session } from '../class/Session';
import { ClassNames, EsgstClassNames, NotificationColor } from '../constants/ClassNames';
import { Events } from '../constants/Events';
import { Namespaces } from '../constants/Namespaces';
import { Utils } from '../lib/jsUtils';
import { Base, BaseData, BaseNodes } from './Base';

export interface NotificationBarData extends BaseData {
	color: NotificationColor;
	icons: string[];
	message: ElementChild;
}

export interface NotificationBarNodes extends BaseNodes {
	outer: HTMLDivElement | null;
	icons: HTMLElement[];
	message: ChildNode[] | HTMLElement | null;
}

export interface SgNotificationBarNodes extends NotificationBarNodes {
	message: ChildNode[];
}

export interface StNotificationBarNodes extends NotificationBarNodes {
	message: HTMLElement | null;
}

export abstract class NotificationBar extends Base<
	NotificationBar,
	NotificationBarData,
	NotificationBarNodes
> {
	static readonly defaultColor: NotificationColor = 'gray';
	static readonly colorRegExps = {
		[Namespaces.SG]: new RegExp(
			`(${Object.keys(ClassNames[Namespaces.SG].notification.reversedColors).join('|')})`
		),
		[Namespaces.ST]: new RegExp(
			`${ClassNames[Namespaces.ST].notification.root}\\s(${Object.keys(
				ClassNames[Namespaces.ST].notification.colors
			).join('|')})`
		),
	};
	static readonly iconsRegExp = /fa-(?!fw)[\w-]+/g;
	static readonly selectors = {
		[Namespaces.SG]: Object.values(ClassNames[Namespaces.SG].notification.colors)
			.map((className) => `.${ClassNames[Namespaces.SG].notification.root}.${className}`)
			.join(', '),
		[Namespaces.ST]: Object.values(ClassNames[Namespaces.ST].notification.colors)
			.map((className) => `.${ClassNames[Namespaces.SG].notification.root}.${className}`)
			.join(', '),
	};

	protected _data: NotificationBarData;
	protected _nodes: NotificationBarNodes;

	constructor(options: Partial<NotificationBarData>, namespace: number) {
		super(namespace);
		this._data = NotificationBar.getInitialData(options);
		this._nodes = NotificationBar.getInitialNodes();
	}

	static getInitialData = (options: Partial<NotificationBarData> = {}): NotificationBarData => {
		return {
			color: options.color ?? NotificationBar.defaultColor,
			isHidden: options.isHidden ?? false,
			icons: [...(options.icons ?? [])],
			message: options.message ?? null,
		};
	};

	static getInitialNodes = (): NotificationBarNodes => {
		return {
			outer: null,
			icons: [],
			message: [],
		};
	};

	static create = (
		options: Partial<NotificationBarData> = {},
		namespace = Session.namespace
	): NotificationBar => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgNotificationBar(options);
			case Namespaces.ST:
				return new StNotificationBar(options);
			default:
				throw NotificationBar.getError('failed to create');
		}
	};

	static getAll = (referenceNode: Element, namespace = Session.namespace): NotificationBar[] => {
		const notificationBars: NotificationBar[] = [];
		const nodes = referenceNode.querySelectorAll(NotificationBar.selectors[namespace]);
		for (const node of nodes) {
			const notificationBar = NotificationBar.create({}, namespace);
			notificationBar.parse(node);
			notificationBars.push(notificationBar);
		}
		return notificationBars;
	};

	setLoading = (message?: ElementChild): NotificationBar => {
		this.setColor('blue').setContent(
			['fa-circle-o-notch fa-spin'],
			typeof message === 'undefined' ? this._data.message : message
		);
		return this;
	};

	setSuccess = (message?: ElementChild): NotificationBar => {
		this.setColor('green').setContent(
			['fa-check-circle'],
			typeof message === 'undefined' ? this._data.message : message
		);
		return this;
	};

	setWarning = (message?: ElementChild): NotificationBar => {
		this.setColor('yellow').setContent(
			['fa-exclamation-circle'],
			typeof message === 'undefined' ? this._data.message : message
		);
		return this;
	};

	setError = (message?: ElementChild): NotificationBar => {
		this.setColor('red').setContent(
			['fa-times-circle'],
			typeof message === 'undefined' ? this._data.message : message
		);
		return this;
	};

	setInfo = (message?: ElementChild): NotificationBar => {
		this.setColor('gray').setContent(
			[],
			typeof message === 'undefined' ? this._data.message : message
		);
		return this;
	};

	setColor = (color: NotificationColor): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set color');
		}
		if (this._hasBuilt && this._data.color === color) {
			return this;
		}
		const classNames = ClassNames[this._namespace].notification;
		this._data.color = color;
		this._nodes.outer.className = [
			EsgstClassNames.notification,
			classNames.root,
			classNames.colors[this._data.color],
			classNames.marginTop,
		]
			.join(' ')
			.trim();
		return this;
	};

	parse = (referenceNode: Element): NotificationBar => {
		if (!referenceNode.matches(NotificationBar.selectors[this._namespace])) {
			throw this.getError('failed to parse');
		}
		this._nodes.outer = referenceNode as HTMLDivElement;
		this.parseColor();
		this.parseIcons();
		this.parseMessage();
		return this;
	};

	parseColor = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse color');
		}
		const className = NotificationBar.colorRegExps[this._namespace].exec(
			this._nodes.outer.className
		)?.[1] as string;
		// @ts-expect-error
		this._data.color = ClassNames[this._namespace].notification.reversedColors[className];
		return this;
	};

	parseIcons = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse icons');
		}
		this._data.icons = [];
		this._nodes.icons = Array.from(this._nodes.outer.querySelectorAll('i'));
		for (const iconNode of this._nodes.icons) {
			const iconParts = [];
			let matches;
			while ((matches = NotificationBar.iconsRegExp.exec(iconNode.className)) !== null) {
				iconParts.push(matches[0]);
			}
			this._data.icons.push(iconParts.join(' '));
		}
		return this;
	};

	abstract setContent(icons: string[], message: ElementChild): NotificationBar;
	abstract setIcons(icons: string[]): NotificationBar;
	abstract setMessage(message: ElementChild): NotificationBar;
	abstract removeIcons(): NotificationBar;
	abstract removeMessage(): NotificationBar;
	abstract parseMessage(): NotificationBar;
}

export class SgNotificationBar extends NotificationBar {
	protected _nodes: SgNotificationBarNodes;

	constructor(options: Partial<NotificationBarData>) {
		super(options, Namespaces.SG);
		this._nodes = SgNotificationBar.getInitialNodes();
	}

	static getInitialNodes = (): SgNotificationBarNodes => {
		return {
			outer: null,
			icons: [],
			message: [],
		};
	};

	build = (): NotificationBar => {
		if (!this._nodes.outer) {
			this._nodes.outer = <div></div>;
		}
		this.setColor(this._data.color);
		this.toggleHidden(this._data.isHidden);
		this.setContent(this._data.icons, this._data.message);
		this._hasBuilt = true;
		void EventDispatcher.dispatch(Events.NOTIFICATION_BAR_BUILD, this);
		return this;
	};

	reset = (): NotificationBar => {
		const outerNode = this._nodes.outer;
		this._data = NotificationBar.getInitialData();
		this._nodes = SgNotificationBar.getInitialNodes();
		if (outerNode) {
			this._nodes.outer = outerNode;
			this._hasBuilt = false;
			this.build();
		}
		return this;
	};

	setContent = (icons: string[], message: ElementChild): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set content');
		}
		const areIconsEqual = this._hasBuilt && Utils.isDeepEqual(this._data.icons, icons);
		const isMessageEqual = this._hasBuilt && this._data.message === message;
		if (!areIconsEqual && !isMessageEqual) {
			this._nodes.outer.innerHTML = '';
			this._data.icons = [];
			this._data.message = null;
			this._nodes.icons = [];
			this._nodes.message = [];
		}
		this.setIcons(icons);
		this.setMessage(message);
		return this;
	};

	setIcons = (icons: string[]): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set icons');
		}
		if (this._hasBuilt && Utils.isDeepEqual(this._data.icons, icons)) {
			return this;
		}
		this.removeIcons();
		this._data.icons = icons;
		this._nodes.icons = [];
		DOM.insert(
			this._nodes.outer,
			'afterbegin',
			<fragment>
				{this._data.icons.map((icon) => (
					<fragment>
						<i className={`fa ${icon}`} ref={(ref) => this._nodes.icons.push(ref)}></i>{' '}
					</fragment>
				))}
			</fragment>
		);
		return this;
	};

	setMessage = (message: ElementChild): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set message');
		}
		if (this._hasBuilt && this._data.message === message) {
			return this;
		}
		this.removeMessage();
		this._data.message = message;
		const docFragment = (<fragment>{this._data.message}</fragment>) as DocumentFragment;
		this._nodes.message = Array.from(docFragment.childNodes);
		DOM.insert(this._nodes.outer, 'beforeend', docFragment);
		return this;
	};

	removeIcons = (): NotificationBar => {
		if (this._data.icons.length === 0) {
			return this;
		}
		if (!this._nodes.outer) {
			throw this.getError('failed to remove icons');
		}
		if (this._data.message) {
			for (const iconNode of this._nodes.icons) {
				const iconNodeSibling = iconNode.nextSibling;
				iconNode.remove();
				if (iconNodeSibling?.nodeType === Node.TEXT_NODE && iconNodeSibling.textContent === ' ') {
					iconNodeSibling.remove();
				}
			}
		} else {
			this._nodes.outer.innerHTML = '';
		}
		this._data.icons = [];
		this._nodes.icons = [];
		return this;
	};

	removeMessage = (): NotificationBar => {
		if (!this._data.message) {
			return this;
		}
		if (!this._nodes.outer) {
			throw this.getError('failed to remove message');
		}
		if (this._data.icons.length > 0) {
			for (const messageNode of this._nodes.message) {
				messageNode.remove();
			}
		} else {
			this._nodes.outer.innerHTML = '';
		}
		this._data.message = null;
		this._nodes.message = [];
		return this;
	};

	parseMessage = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse message');
		}
		if (this._data.icons.length > 0) {
			this._nodes.message = [];
			let messageNode = this._nodes.icons[this._nodes.icons.length - 1].nextSibling;
			if (messageNode?.nodeType === Node.TEXT_NODE && messageNode.textContent === ' ') {
				messageNode = messageNode.nextSibling;
			}
			while (messageNode) {
				this._nodes.message.push(messageNode);
				messageNode = messageNode.nextSibling;
			}
		} else {
			this._nodes.message = Array.from(this._nodes.outer.childNodes);
		}
		this._data.message = this._nodes.outer.textContent.trim();
		return this;
	};
}

export class StNotificationBar extends NotificationBar {
	protected _nodes: StNotificationBarNodes;

	constructor(options: Partial<NotificationBarData>) {
		super(options, Namespaces.ST);
		this._nodes = StNotificationBar.getInitialNodes();
	}

	static getInitialNodes = (): StNotificationBarNodes => {
		return {
			outer: null,
			icons: [],
			message: null,
		};
	};

	build = (): NotificationBar => {
		if (!this._nodes.outer) {
			this._nodes.outer = (
				<div style={{ marginTop: '5px' }}>
					<div ref={(ref) => (this._nodes.message = ref)}></div>
				</div>
			);
		}
		this.setColor(this._data.color);
		this.toggleHidden(this._data.isHidden);
		this.setContent(this._data.icons, this._data.message);
		this._hasBuilt = true;
		void EventDispatcher.dispatch(Events.NOTIFICATION_BAR_BUILD, this);
		return this;
	};

	reset = (): NotificationBar => {
		const outerNode = this._nodes.outer;
		const messageNode = this._nodes.message;
		this._data = NotificationBar.getInitialData();
		this._nodes = StNotificationBar.getInitialNodes();
		if (outerNode) {
			this._nodes.outer = outerNode;
			this._nodes.message = messageNode;
			this._hasBuilt = false;
			this.build();
		}
		return this;
	};

	setContent = (icons: string[], message: ElementChild): NotificationBar => {
		this.setIcons(icons);
		this.setMessage(message);
		return this;
	};

	setIcons = (icons: string[]): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set icons');
		}
		if (this._hasBuilt && Utils.isDeepEqual(this._data.icons, icons)) {
			return this;
		}
		this.removeIcons();
		this._data.icons = icons;
		this._nodes.icons = [];
		DOM.insert(
			this._nodes.outer,
			'afterbegin',
			<fragment>
				{this._data.icons.map((icon) => (
					<i className={`fa ${icon}`} ref={(ref) => this._nodes.icons.push(ref)}></i>
				))}
			</fragment>
		);
		return this;
	};

	setMessage = (message: ElementChild): NotificationBar => {
		if (!this._nodes.message) {
			throw this.getError('failed to set message');
		}
		if (this._hasBuilt && this._data.message === message) {
			return this;
		}
		this._data.message = message;
		DOM.insert(this._nodes.message, 'atinner', <fragment>{this._data.message}</fragment>);
		return this;
	};

	removeIcons = (): NotificationBar => {
		if (this._data.icons.length === 0) {
			return this;
		}
		for (const iconNode of this._nodes.icons) {
			iconNode.remove();
		}
		this._data.icons = [];
		this._nodes.icons = [];
		return this;
	};

	removeMessage = (): NotificationBar => {
		if (!this._data.message) {
			return this;
		}
		if (!this._nodes.message) {
			throw this.getError('failed to remove message');
		}
		this._nodes.message.innerHTML = '';
		this._data.message = null;
		return this;
	};

	parseMessage = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse message');
		}
		this._nodes.message = this._nodes.outer.querySelector('div:last-child');
		if (!this._nodes.message) {
			throw this.getError('failed to parse message');
		}
		this._data.message = this._nodes.message.textContent.trim();
		return this;
	};
}
