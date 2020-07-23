import { ExtendedInsertPosition } from '../class/DOM';
import { Session } from '../class/Session';
import { ClassNames } from '../constants/ClassNames';

export interface BaseNodes {
	outer: HTMLElement | null;
}

export abstract class Base {
	protected _nodes: BaseNodes = {
		outer: null,
	};
	protected _data: unknown;

	static getError(message: string): Error {
		return new Error(`${this.name}: ${message}`);
	}

	hide = () => {
		if (!this._nodes.outer) {
			throw this.getError('could not hide');
		}
		this._nodes.outer.classList.add(ClassNames[Session.namespace].hiddenClass);
	};

	show = () => {
		if (!this._nodes.outer) {
			throw this.getError('could not show');
		}
		this._nodes.outer.classList.remove(ClassNames[Session.namespace].hiddenClass);
	};

	getError = (message: string): Error => {
		return new Error(`${this.constructor.name}: ${message}`);
	};

	abstract build(): void;

	abstract insert(referenceEl: Element, position: ExtendedInsertPosition): void;

	abstract destroy(): void;

	abstract reset(): void;

	abstract parse(referenceEl: Element): void;
}
