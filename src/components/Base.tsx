import { DOM, ExtendedInsertPosition } from '../class/DOM';
import { ClassNames } from '../constants/ClassNames';

export interface BaseNodes {
	outer: HTMLElement | null;
}

export abstract class Base<T, TData, TNodes extends BaseNodes> {
	protected _namespace: number;
	protected _data: unknown;
	protected _nodes: BaseNodes = {
		outer: null,
	};
	protected _hasBuilt = false;

	constructor(namespace: number) {
		this._namespace = namespace;
	}

	static getError(message: string): Error {
		return new Error(`${this.name}: ${message}`);
	}

	get namespace(): number {
		return this._namespace;
	}

	get data(): TData {
		return this._data as TData;
	}

	get nodes(): TNodes {
		return this._nodes as TNodes;
	}

	get hasBuilt(): boolean {
		return this._hasBuilt;
	}

	insert = (referenceNode: Element, position: ExtendedInsertPosition): T => {
		if (!this._nodes.outer) {
			this.build();
		}
		if (!this._nodes.outer) {
			throw this.getError('failed to insert');
		}
		DOM.insert(referenceNode, position, this._nodes.outer);
		return (this as unknown) as T;
	};

	destroy = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('failed to destroy');
		}
		this._nodes.outer.remove();
		this._nodes.outer = null;
		this._hasBuilt = false;
		this.reset();
		return (this as unknown) as T;
	};

	hide = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('failed to hide');
		}
		this._nodes.outer.classList.add(ClassNames[this._namespace].hidden);
		return (this as unknown) as T;
	};

	show = (): T => {
		if (!this._nodes.outer) {
			throw this.getError('failed to show');
		}
		this._nodes.outer.classList.remove(ClassNames[this._namespace].hidden);
		return (this as unknown) as T;
	};

	getError = (message: string): Error => {
		return new Error(`${this.constructor.name}: ${message}`);
	};

	abstract build(): T;
	abstract reset(): T;
	abstract parse(referenceEl: Element): T;
}
