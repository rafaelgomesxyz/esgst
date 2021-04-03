import { DOM, ExtendedInsertPosition } from '../class/DOM';
import { ClassNames } from '../constants/ClassNames';

export interface BaseNodes {
	outer: HTMLElement | null;
}

export interface BaseData {
	hidden: boolean;
}

export abstract class Base<T, TNodes extends BaseNodes, TData extends BaseData> {
	namespace: number;
	nodes = Base.getDefaultNodes() as TNodes;
	data = Base.getDefaultData() as TData;
	built = false;

	constructor(namespace: number) {
		this.namespace = namespace;
	}

	static getError(message: string): Error {
		return new Error(`${this.name}: ${message}`);
	}

	static getDefaultNodes(): BaseNodes {
		return {
			outer: null,
		};
	}

	static getDefaultData(): BaseData {
		return {
			hidden: false,
		};
	}

	getError = (message: string): Error => {
		return new Error(`${this.constructor.name}: ${message}`);
	};

	insert = (refNode: HTMLElement, position: ExtendedInsertPosition): T => {
		if (!this.nodes.outer) {
			this.build();
		}

		if (!this.nodes.outer) {
			throw this.getError('failed to insert');
		}

		DOM.insert(refNode, position, this.nodes.outer);

		return (this as unknown) as T;
	};

	destroy = (): T => {
		if (!this.nodes.outer) {
			throw this.getError('failed to destroy');
		}

		this.nodes.outer.remove();
		this.nodes.outer = null;
		this.built = false;
		this.reset();

		return (this as unknown) as T;
	};

	hide = (): T => {
		if (!this.nodes.outer) {
			throw this.getError('failed to hide');
		}

		this.nodes.outer.classList.add(ClassNames[this.namespace].hidden);
		this.data.hidden = true;

		return (this as unknown) as T;
	};

	show = (): T => {
		if (!this.nodes.outer) {
			throw this.getError('failed to show');
		}

		this.nodes.outer.classList.remove(ClassNames[this.namespace].hidden);
		this.data.hidden = false;

		return (this as unknown) as T;
	};

	toggleHidden = (hidden: boolean): T => {
		if (!this.nodes.outer) {
			throw this.getError('failed to show');
		}

		this.nodes.outer.classList.toggle(ClassNames[this.namespace].hidden, this.data.hidden);
		this.data.hidden = hidden;

		return (this as unknown) as T;
	};

	abstract parse(refNode: HTMLElement): T;
	abstract parseNodes(refNode: HTMLElement): T;
	abstract parseData(): T;
	abstract parseExtraData(): T;
	abstract build(): T;
	abstract reset(): T;
}
