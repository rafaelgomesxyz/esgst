import { DOM, ExtendedInsertPosition } from '../class/DOM';
import { EventDispatcher } from '../class/EventDispatcher';
import { Session } from '../class/Session';
import { ButtonColor, ClassNames, EsgstClassNames } from '../constants/ClassNames';
import { Events } from '../constants/Events';
import { Namespaces } from '../constants/Namespaces';
import { Utils } from '../lib/jsUtils';
import { Base, BaseNodes } from './Base';

export type ButtonOptions =
	| Partial<ButtonStateData>
	| (ButtonStateWithTemplate | ButtonStateWithoutTemplate)[]
	| ButtonStateWithTemplate
	| ButtonStateWithoutTemplate;

export interface ButtonData extends ButtonStateData {
	color: ButtonColor;
	isDisabled: boolean;
	tooltip: string;
	icons: string[];
	name: string;
}

export interface ButtonStateData {
	states: (ButtonStateWithTemplate | ButtonStateWithoutTemplate)[];
	initialStateNumber: number;
}

export interface ButtonStateWithTemplate extends ButtonStateExtra {
	template: ButtonStateTemplate;
}

export type ButtonStateWithoutTemplate = ButtonStateBase & ButtonStateExtra;

export interface ButtonStateBase {
	color: ButtonColor;
	icons?: string[];
}

export interface ButtonStateExtra {
	isDisabled?: boolean;
	tooltip?: string;
	name?: string;
	switchTo?: {
		onClick?: number;
		onReturn?: number;
	};
	onClick?: () => void | Promise<void>;
}

export type ButtonStateTemplate = 'loading' | 'success' | 'warning' | 'error' | 'info';

export interface ButtonNodes extends BaseNodes {
	container: HTMLDivElement | null;
	outer: HTMLDivElement | null;
	icons: HTMLElement[];
	name: ChildNode | null;
}

export abstract class Button extends Base<Button, ButtonData, ButtonNodes> {
	static readonly defaultColor: ButtonColor = 'gray';
	static readonly colorRegExps = {
		[Namespaces.SG]: new RegExp(
			`(${Object.keys(ClassNames[Namespaces.SG].button.reversedColors).join('|')})`
		),
		[Namespaces.ST]: new RegExp(
			`${ClassNames[Namespaces.ST].button.root}\\s(${Object.keys(
				ClassNames[Namespaces.ST].button.colors
			).join('|')})`
		),
	};
	static readonly iconsRegExp = /fa-(?!fw)[\w-]+/g;
	static readonly selectors = {
		[Namespaces.SG]: Object.values(ClassNames[Namespaces.SG].button.colors)
			.map((className) => `.${className.replace(' ', '.')}`)
			.join(', '),
		[Namespaces.ST]: Object.values(ClassNames[Namespaces.ST].button.colors)
			.map((className) => `.${ClassNames[Namespaces.SG].button.root}.${className}`)
			.join(', '),
	};
	static readonly containerKeys = ['pageHeading'];
	static readonly containerSelectors = {
		[Namespaces.SG]: Button.containerKeys
			// @ts-expect-error
			.map((key) => `.${ClassNames[Namespaces.SG][key]}`)
			.join(', '),
		[Namespaces.ST]: Button.containerKeys
			// @ts-expect-error
			.map((key) => `.${ClassNames[Namespaces.ST][key]}`)
			.join(', '),
	};
	static readonly templates: Record<number, Record<ButtonStateTemplate, ButtonStateBase>> = {
		[Namespaces.SG]: {
			loading: { color: 'white', icons: ['fa-circle-o-notch fa-spin'] },
			success: { color: 'green', icons: ['fa-check-circle'] },
			warning: { color: 'yellow', icons: ['fa-exclamation-circle'] },
			error: { color: 'red', icons: ['fa-times-circle'] },
			info: { color: 'gray', icons: [] },
		},
		[Namespaces.ST]: {
			loading: { color: 'white', icons: ['fa-circle-o-notch fa-spin'] },
			success: { color: 'green', icons: ['fa-check'] },
			warning: { color: 'yellow', icons: ['fa-exclamation'] },
			error: { color: 'red', icons: ['fa-times'] },
			info: { color: 'gray', icons: [] },
		},
	};

	protected _data: ButtonData;
	protected _nodes: ButtonNodes;
	protected _currentStateNumber: number;

	constructor(options: ButtonOptions, namespace: number) {
		super(namespace);
		this._data = Button.getInitialData(options);
		this._nodes = Button.getInitialNodes();
		this._currentStateNumber = this._data.initialStateNumber;
	}

	static getInitialData = (options: ButtonOptions = {}): ButtonData => {
		let states: (ButtonStateWithTemplate | ButtonStateWithoutTemplate)[];
		let initialStateNumber = 1;
		if (Array.isArray(options)) {
			states = options;
		} else if ('color' in options || 'template' in options) {
			states = [options];
		} else {
			states = [...(options.states ?? [])];
			initialStateNumber = options.initialStateNumber ?? 1;
		}
		return {
			color: Button.defaultColor,
			isDisabled: false,
			tooltip: '',
			icons: [],
			name: '',
			states,
			initialStateNumber,
		};
	};

	static getInitialNodes = (): ButtonNodes => {
		return {
			container: null,
			outer: null,
			icons: [],
			name: null,
		};
	};

	static create = (options: ButtonOptions = {}, namespace = Session.namespace): Button => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgButton(options);
			case Namespaces.ST:
				return new StButton(options);
			default:
				throw Button.getError('failed to create');
		}
	};

	static getAll = (referenceNode: Element, namespace = Session.namespace): Button[] => {
		const buttons: Button[] = [];
		const nodes = referenceNode.querySelectorAll(Button.selectors[namespace]);
		for (const node of nodes) {
			const button = Button.create({}, namespace);
			button.parse(node);
			buttons.push(button);
		}
		return buttons;
	};

	insert = (referenceNode: Element, position: ExtendedInsertPosition): Button => {
		if (!this._nodes.outer) {
			this.build();
		}
		if (!this._nodes.outer) {
			throw this.getError('failed to insert');
		}
		if (this._nodes.container) {
			DOM.insert(referenceNode, position, this._nodes.container);
		} else if (referenceNode.matches(Button.containerSelectors[this._namespace])) {
			// The button needs to be wrapped in a container to prevent styles from being applied.
			DOM.insert(
				referenceNode,
				position,
				<div
					className={EsgstClassNames.buttonContainer}
					ref={(ref) => (this._nodes.container = ref)}
				>
					{this._nodes.outer}
				</div>
			);
		} else {
			DOM.insert(referenceNode, position, this._nodes.outer);
		}
		return this;
	};

	destroy = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to destroy');
		}
		this._nodes.outer.remove();
		if (this._nodes.container) {
			this._nodes.container.remove();
		}
		this._nodes.outer = null;
		this._hasBuilt = false;
		this.reset();
		return this;
	};

	reset = (): Button => {
		const containerNode = this._nodes.container;
		const outerNode = this._nodes.outer;
		const nameNode = this._nodes.name;
		this._data = Button.getInitialData();
		this._nodes = Button.getInitialNodes();
		if (outerNode) {
			this._nodes.container = containerNode;
			this._nodes.outer = outerNode;
			this._nodes.name = nameNode;
			this._hasBuilt = false;
			this._currentStateNumber = this._data.initialStateNumber;
			this.build();
		}
		return this;
	};

	setColor = (color: ButtonColor): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set color');
		}
		if (this._hasBuilt && this._data.color === color) {
			return this;
		}
		const classNames = ClassNames[this._namespace].button;
		this._data.color = color;
		this._nodes.outer.className = [
			EsgstClassNames.button,
			classNames.root,
			classNames.colors[this._data.color],
		]
			.join(' ')
			.trim();
		return this;
	};

	setDisabled = (isDisabled: boolean): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set disabled');
		}
		if (this._hasBuilt && this._data.isDisabled === isDisabled) {
			return this;
		}
		this._data.isDisabled = isDisabled;
		this._nodes.outer.classList.toggle(ClassNames[this._namespace].disabled, this._data.isDisabled);
		return this;
	};

	setTooltip = (tooltip: string): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to set tooltip');
		}
		if (this._hasBuilt && this._data.tooltip === tooltip) {
			return this;
		}
		this._data.tooltip = tooltip;
		this._nodes.outer.title = tooltip;
		return this;
	};

	setContent = (icons: string[], name: string): Button => {
		this.setIcons(icons);
		this.setName(name);
		return this;
	};

	setName = (name: string): Button => {
		if (!this._nodes.name) {
			throw this.getError('failed to set name');
		}
		if (this._hasBuilt && this._data.name === name) {
			return this;
		}
		this._data.name = name;
		this._nodes.name.textContent = this._data.name;
		return this;
	};

	parse = (referenceNode: Element): Button => {
		if (!referenceNode.matches(Button.selectors[this._namespace])) {
			throw this.getError('failed to parse');
		}
		this._nodes.outer = referenceNode as HTMLDivElement;
		const outerNodeParent = this._nodes.outer.parentElement;
		if (outerNodeParent?.matches(`.${EsgstClassNames.buttonContainer}`)) {
			this._nodes.container = outerNodeParent as HTMLDivElement;
		}
		this.parseColor();
		this.parseDisabled();
		this.parseTooltip();
		this.parseIcons();
		this.parseName();
		this._data.states = [
			{
				color: this._data.color,
				isDisabled: this._data.isDisabled,
				tooltip: this._data.tooltip,
				icons: this._data.icons,
				name: this._data.name,
			},
		];
		this._data.initialStateNumber = 1;
		return this;
	};

	parseColor = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse color');
		}
		const className = Button.colorRegExps[this._namespace].exec(
			this._nodes.outer.className
		)?.[1] as string;
		// @ts-expect-error
		this._data.color = ClassNames[this._namespace].button.reversedColors[className];
		return this;
	};

	parseDisabled = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse tooltip');
		}
		this._data.isDisabled = this._nodes.outer.classList.contains(
			ClassNames[this._namespace].disabled
		);
		return this;
	};

	parseTooltip = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse tooltip');
		}
		this._data.tooltip = this._nodes.outer.title;
		return this;
	};

	parseIcons = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse icons');
		}
		this._data.icons = [];
		this._nodes.icons = Array.from(this._nodes.outer.querySelectorAll('i'));
		for (const iconNode of this._nodes.icons) {
			const iconParts = [];
			let matches;
			while ((matches = Button.iconsRegExp.exec(iconNode.className)) !== null) {
				iconParts.push(matches[0]);
			}
			this._data.icons.push(iconParts.join(' '));
		}
		return this;
	};

	onClick = async (): Promise<void> => {
		if (this._data.isDisabled) {
			return;
		}
		const state = this._data.states[this._currentStateNumber - 1];
		if (!state) {
			throw this.getError('current state does not exist');
		}
		let nextStateNumber =
			state.switchTo?.onClick ?? (this._currentStateNumber % this._data.states.length) + 1;
		if (nextStateNumber > 0) {
			this.build(nextStateNumber);
		}
		if (!state.isDisabled && state.onClick) {
			await state.onClick();
		}
		if (this._currentStateNumber !== nextStateNumber) {
			// Another state has taken over.
			return;
		}
		nextStateNumber =
			state.switchTo?.onReturn ?? (this._currentStateNumber % this._data.states.length) + 1;
		if (nextStateNumber > 0) {
			this.build(nextStateNumber);
		}
	};

	abstract build(stateNumber?: number): Button;
	abstract setIcons(icons: string[]): Button;
	abstract removeIcons(): Button;
	abstract parseName(): Button;
}

export class SgButton extends Button {
	constructor(options: ButtonOptions) {
		super(options, Namespaces.SG);
	}

	build = (stateNumber = this._currentStateNumber): Button => {
		if (this._hasBuilt && this._currentStateNumber === stateNumber) {
			return this;
		}
		if (!this._nodes.outer) {
			this._nodes.outer = <div onclick={this.onClick}></div>;
			this._nodes.name = document.createTextNode('');
			this._nodes.outer?.appendChild(this._nodes.name);
		}
		const state = this._data.states[stateNumber - 1];
		if (!state) {
			throw this.getError('state does not exist');
		}
		let color: ButtonColor;
		let icons: string[] | undefined;
		if ('template' in state) {
			({ color, icons } = Button.templates[this._namespace][state.template]);
		} else {
			({ color, icons } = state);
		}
		this.setColor(color);
		this.setDisabled(state.isDisabled ?? false);
		if (state.tooltip) {
			this.setTooltip(state.tooltip);
		}
		this.setContent(icons ?? [], state.name ?? '');
		this._hasBuilt = true;
		this._currentStateNumber = stateNumber;
		void EventDispatcher.dispatch(Events.BUTTON_BUILD, this);
		return this;
	};

	setIcons = (icons: string[]): Button => {
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

	removeIcons = (): Button => {
		if (this._data.icons.length === 0) {
			return this;
		}
		for (const iconNode of this._nodes.icons) {
			const iconNodeSibling = iconNode.nextSibling;
			iconNode.remove();
			if (iconNodeSibling?.nodeType === Node.TEXT_NODE && iconNodeSibling.textContent === ' ') {
				iconNodeSibling.remove();
			}
		}
		this._data.icons = [];
		this._nodes.icons = [];
		return this;
	};

	parseName = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse name');
		}
		if (this._data.icons.length > 0) {
			let nameNode = this._nodes.icons[this._nodes.icons.length - 1].nextSibling;
			if (nameNode?.nodeType === Node.TEXT_NODE && nameNode.textContent === ' ') {
				nameNode = nameNode.nextSibling;
			}
			this._nodes.name = nameNode;
		} else {
			this._nodes.name = this._nodes.outer.firstChild;
		}
		if (!this._nodes.name) {
			throw this.getError('failed to parse name');
		}
		this._data.name = this._nodes.name.textContent.trim();
		return this;
	};
}

export class StButton extends Button {
	constructor(options: ButtonOptions) {
		super(options, Namespaces.ST);
	}

	build = (stateNumber = this._currentStateNumber): Button => {
		if (this._hasBuilt && this._currentStateNumber === stateNumber) {
			return this;
		}
		if (!this._nodes.outer) {
			this._nodes.outer = (
				<div onclick={this.onClick}>
					<span ref={(ref) => (this._nodes.name = ref)}></span>
				</div>
			);
		}
		const state = this._data.states[stateNumber - 1];
		if (!state) {
			throw this.getError('state does not exist');
		}
		let color: ButtonColor;
		let icons: string[] | undefined;
		if ('template' in state) {
			({ color, icons } = Button.templates[this._namespace][state.template]);
		} else {
			({ color, icons } = state);
		}
		this.setColor(color);
		this.setDisabled(state.isDisabled ?? false);
		if (state.tooltip) {
			this.setTooltip(state.tooltip);
		}
		this.setContent(icons ?? [], state.name ?? '');
		this._hasBuilt = true;
		this._currentStateNumber = stateNumber;
		void EventDispatcher.dispatch(Events.BUTTON_BUILD, this);
		return this;
	};

	setIcons = (icons: string[]): Button => {
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

	removeIcons = (): Button => {
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

	parseName = (): Button => {
		if (!this._nodes.outer) {
			throw this.getError('failed to parse name');
		}
		this._nodes.name = this._nodes.outer.querySelector('span:last-child');
		if (!this._nodes.name) {
			throw this.getError('failed to parse name');
		}
		this._data.name = this._nodes.name.textContent.trim();
		return this;
	};
}
