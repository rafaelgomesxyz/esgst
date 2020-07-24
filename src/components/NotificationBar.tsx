import { DOM, ElementChild, ExtendedInsertPosition } from '../class/DOM';
import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';
import { Base, BaseNodes } from './Base';

export interface NotificationBarNodes extends BaseNodes {
	outer: HTMLDivElement | null;
	icons: HTMLElement[];
}

export interface NotificationBarData {
	status: NotificationBarStatus;
	icons: string[];
	message: ElementChild;
}

export type NotificationBarStatus = 'info' | 'success' | 'warning' | 'danger' | 'default';

export abstract class NotificationBar extends Base<NotificationBar> {
	static readonly defaultStatus: NotificationBarStatus = 'default';
	static readonly statusList: readonly NotificationBarStatus[] = [
		'info',
		'success',
		'warning',
		'danger',
		'default',
	];
	static readonly statusRegex = new RegExp(
		`notification--(${NotificationBar.statusList.join('|')})`
	);
	static readonly iconsRegex = /fa-(?!fw)[\w-]+/g;
	static readonly selectors = NotificationBar.statusList
		.map((status) => `.notification.notification--${status}`)
		.join(', ');

	protected _nodes: NotificationBarNodes;
	protected _data: NotificationBarData;

	constructor(options: Partial<NotificationBarData>) {
		super();

		this._nodes = NotificationBar.getInitialNodes();
		this._data = NotificationBar.getInitialData(options);
	}

	static getInitialNodes = (): NotificationBarNodes => {
		return {
			outer: null,
			icons: [],
		};
	};

	static getInitialData = (options: Partial<NotificationBarData> = {}): NotificationBarData => {
		return {
			status: options.status ?? NotificationBar.defaultStatus,
			icons: [...(options.icons ?? [])],
			message: options.message ?? null,
		};
	};

	static create = (
		options: Partial<NotificationBarData> = {},
		namespace = Session.namespace
	): NotificationBar => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgNotificationBar(options);
			default:
				throw NotificationBar.getError('could not create');
		}
	};

	static getAll = (referenceEl: Element): NotificationBar[] => {
		const notificationBars: NotificationBar[] = [];
		const els = referenceEl.querySelectorAll(NotificationBar.selectors);
		for (const el of els) {
			const notificationBar = NotificationBar.create();
			notificationBar.parse(el);
			notificationBars.push(notificationBar);
		}
		return notificationBars;
	};

	get nodes() {
		return this._nodes;
	}

	get data() {
		return this._data;
	}

	abstract setStatus(status: NotificationBarStatus): NotificationBar;
	abstract setContent(icons: string[], message: ElementChild): NotificationBar;
	abstract setIcons(icons: string[]): NotificationBar;
	abstract setMessage(message: ElementChild): NotificationBar;
	abstract removeIcons(): NotificationBar;
	abstract removeMessage(): NotificationBar;
	abstract parseStatus(): NotificationBar;
	abstract parseIcons(): NotificationBar;
	abstract parseMessage(): NotificationBar;
}

export class SgNotificationBar extends NotificationBar {
	constructor(options: Partial<NotificationBarData>) {
		super(options);
	}

	build = (): NotificationBar => {
		if (!this._nodes.outer) {
			this._nodes.outer = <div></div>;
		}
		this.setStatus(this._data.status);
		this.setContent(this._data.icons, this._data.message);
		return this;
	};

	insert = (referenceEl: Element, position: ExtendedInsertPosition): NotificationBar => {
		if (!this._nodes.outer) {
			this.build();
		}
		if (!this._nodes.outer) {
			throw this.getError('could not insert');
		}
		DOM.insert(referenceEl, position, this._nodes.outer);
		return this;
	};

	destroy = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not destroy');
		}
		this._nodes.outer.remove();
		this._nodes.outer = null;
		this.reset();
		return this;
	};

	reset = (): NotificationBar => {
		const outerEl = this._nodes.outer;
		this._nodes = NotificationBar.getInitialNodes();
		this._data = NotificationBar.getInitialData();
		if (outerEl) {
			this._nodes.outer = outerEl;
			this.build();
		}
		return this;
	};

	setStatus = (status: NotificationBarStatus): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not set status');
		}
		this._data.status = status;
		this._nodes.outer.className = `notification notification--${this._data.status} notification--margin-top-small`;
		return this;
	};

	setContent = (icons: string[], message: ElementChild): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not set content');
		}
		this._nodes.outer.innerHTML = '';
		this._nodes.icons = [];
		this._data.icons = [];
		this._data.message = null;
		this.setIcons(icons);
		this.setMessage(message);
		return this;
	};

	setIcons = (icons: string[]): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not set icons');
		}
		this.removeIcons();
		this._data.icons = icons;
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
			throw this.getError('could not set message');
		}
		this.removeMessage();
		this._data.message = message;
		DOM.insert(this._nodes.outer, 'beforeend', <fragment>{this._data.message}</fragment>);
		return this;
	};

	removeIcons = (): NotificationBar => {
		if (this._data.icons.length === 0) {
			return this;
		}
		if (!this._nodes.outer) {
			throw this.getError('could not remove icons');
		}
		if (this._data.message) {
			for (const icon of this._nodes.icons) {
				(icon.nextSibling as ChildNode).remove();
				icon.remove();
			}
		} else {
			this._nodes.outer.innerHTML = '';
		}
		this._nodes.icons = [];
		this._data.icons = [];
		return this;
	};

	removeMessage = (): NotificationBar => {
		if (!this._data.message) {
			return this;
		}
		if (!this._nodes.outer) {
			throw this.getError('could not remove message');
		}
		if (this._data.icons.length > 0) {
			let nextSibling = (this._nodes.icons[this._nodes.icons.length - 1].nextSibling as ChildNode)
				.nextSibling;
			while (nextSibling) {
				const sibling = nextSibling;
				nextSibling = nextSibling.nextSibling;
				sibling.remove();
			}
		} else {
			this._nodes.outer.innerHTML = '';
		}
		this._data.message = null;
		return this;
	};

	parse = (referenceEl: Element): NotificationBar => {
		if (!referenceEl.matches(NotificationBar.selectors)) {
			throw this.getError('could not parse');
		}
		this._nodes.outer = referenceEl as HTMLDivElement;
		this.parseStatus();
		this.parseIcons();
		this.parseMessage();
		return this;
	};

	parseStatus = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not parse status');
		}
		this._data.status = NotificationBar.statusRegex.exec(
			this._nodes.outer.className
		)?.[1] as NotificationBarStatus;
		return this;
	};

	parseIcons = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not parse icons');
		}
		this._data.icons = [];
		const els = this._nodes.outer.querySelectorAll('i');
		for (const el of els) {
			let iconParts = [];
			let matches;
			while ((matches = NotificationBar.iconsRegex.exec(el.className)) !== null) {
				iconParts.push(matches[0]);
			}
			this._data.icons.push(iconParts.join(' '));
		}
		return this;
	};

	parseMessage = (): NotificationBar => {
		if (!this._nodes.outer) {
			throw this.getError('could not parse message');
		}
		this._data.message = this._nodes.outer.textContent.trim();
		return this;
	};
}
