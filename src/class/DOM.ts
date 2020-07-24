import { Utils } from '../lib/jsUtils';

export type ExtendedInsertPosition = InsertPosition | 'atouter' | 'atinner';

export type ElementAttributes<T extends ElementTag> = {
	[K in keyof ExtendedElement<T>]?:
		| (ExtendedElement<T>[K] extends Function
				? ExtendedElement<T>[K]
				: {
						[L in keyof ExtendedElement<T>[K]]?: ExtendedElement<T>[K][L] | null;
				  })
		| null;
};

export type ElementTag = keyof HTMLElementTagNameMap;

export type ExtendedElement<T extends ElementTag> = HTMLElementTagNameMap[T] &
	ExtendedElementBase<T>;

export interface ExtendedElementBase<T extends ElementTag> {
	attrs: Record<string, string>;
	extend: () => void;
	ref: ElementCallback<T>;
}

export type ElementChildren = ElementChild[];

export type ElementChild = Node | string | null | ElementChildren;

export type ElementCallback<T extends ElementTag> = (node: HTMLElementTagNameMap[T]) => void;

export type NodeBuilder = () => Node;

class _DOM {
	private parser = new DOMParser();

	element = <T extends ElementTag>(
		tag: T | NodeBuilder | 'fragment',
		attributes: ElementAttributes<T>,
		...children: ElementChildren
	): HTMLElementTagNameMap[T] | DocumentFragment => {
		try {
			if (typeof tag === 'function') {
				const node = tag() as HTMLElementTagNameMap[T];
				if (children) {
					this.appendChildren(node, children);
				}
				return node;
			}
			if (tag === 'fragment') {
				const node = document.createDocumentFragment();
				if (children) {
					this.appendChildren(node, children);
				}
				return node;
			}
			const element = document.createElement<T>(tag);
			if (attributes) {
				this.setElementAttributes(element, attributes);
			}
			if (children) {
				this.appendChildren(element, children);
			}
			return element;
		} catch (err) {
			window.console.log(err.message);
			window.console.log(tag, attributes, children);
			throw err;
		}
	};

	setElementAttributes = <T extends ElementTag>(
		element: HTMLElement,
		attributes: ElementAttributes<T>
	) => {
		const filteredAttributes = Object.entries(attributes).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredAttributes) {
			if (key === 'attrs' && typeof value === 'object') {
				this.setCustomElementAttributes(element, value);
			} else if (key === 'extend' && typeof value === 'function') {
				attributes.extend = value.bind(null, element);
			} else if (key === 'ref' && typeof value === 'function') {
				value(element);
			} else if (key.startsWith('on') && typeof value === 'function') {
				const eventType = key.slice(2);
				element.addEventListener(eventType, value);
			} else if (typeof value === 'object') {
				this.setElementProperties(element, key, value);
			} else if (key.includes('-')) {
				this.setCustomElementAttributes(element, { [key]: value });
			} else {
				// @ts-ignore
				element[key] = value;
			}
		}
	};

	setCustomElementAttributes = <T extends ElementTag>(
		element: HTMLElement,
		attributes: ElementAttributes<T>
	) => {
		const filteredAttributes = Object.entries(attributes).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredAttributes) {
			element.setAttribute(key, value);
		}
	};

	setElementProperties = (
		element: HTMLElement,
		attribute: string,
		properties: Record<string, unknown>
	) => {
		const filteredProperties = Object.entries(properties).filter(([, value]) => Utils.isSet(value));
		for (const [key, value] of filteredProperties) {
			// @ts-ignore
			element[attribute][key] = value;
		}
	};

	appendChildren = (node: Node, children: ElementChildren) => {
		for (const child of children) {
			if (typeof child === 'string' || typeof child === 'number') {
				const textNode = document.createTextNode(child);
				node.appendChild(textNode);
			} else if (child instanceof Node) {
				node.appendChild(child);
			} else if (Array.isArray(child)) {
				this.appendChildren(node, child);
			}
		}
	};

	fragment = () => {
		return document.createDocumentFragment();
	};

	insert = (
		referenceEl: Element,
		position: ExtendedInsertPosition,
		node: HTMLElement | DocumentFragment
	) => {
		try {
			const elements =
				node instanceof DocumentFragment ? (Array.from(node.children) as HTMLElement[]) : [node];
			const referenceElParent = referenceEl.parentElement;
			switch (position) {
				case 'beforebegin':
					if (referenceElParent) {
						referenceElParent.insertBefore(node, referenceEl);
					}
					break;
				case 'afterbegin':
					referenceEl.insertBefore(node, referenceEl.firstChild);
					break;
				case 'beforeend':
					referenceEl.appendChild(node);
					break;
				case 'afterend':
					if (referenceElParent) {
						referenceElParent.insertBefore(node, referenceEl.nextSibling);
					}
					break;
				case 'atouter':
					if (referenceElParent) {
						referenceElParent.insertBefore(node, referenceEl.nextSibling);
						referenceEl.remove();
					}
					break;
				case 'atinner':
					referenceEl.innerHTML = '';
					referenceEl.appendChild(node);
					break;
				// no default
			}
			if (node instanceof DocumentFragment && node.children.length > 0) {
				throw new Error('Failed to insert elements');
			}
		} catch (error) {
			window.console.log(error.message);
			window.console.log(referenceEl, position, node);
		}
		return [];
	};

	parse = (html: string) => {
		return this.parser.parseFromString(html, 'text/html');
	};
}

export const DOM = new _DOM();
