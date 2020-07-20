import { DOM } from '../class/DOM';
import { Namespaces } from '../constants/Namespaces';
import { Session } from '../class/Session';

class IFooter {
	constructor() {
		/** @type {IFooterNodes} */
		this.nodes = {
			inner: null,
			leftNav: null,
			nav: null,
			outer: null,
			rightNav: null,
		};

		/** @type {Object<string, IFooterLinkContainer>} */
		this.linkContainers = {};
	}

	/**
	 * @param {string} string
	 * @returns {string}
	 */
	static generateId(name) {
		return name
			.replace(/[^A-Za-z\s].*/, '') // Only gets the name until a non-letter character
			.trim()
			.split(' ')
			.filter((word) => word)
			.map((word) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`) // Applies CamelCase format
			.join('')
			.replace(/^(.)/, (fullMatch, group1) => group1.toLowerCase()); // Applies camelCase format
	}
}

class SgFooter extends IFooter {
	constructor() {
		super();
	}

	/**
	 * @param {IFooterLinkContainerParams} params
	 */
	addLinkContainer(params) {
		const [context, position] = params.context
			? [params.context, params.position]
			: params.side === 'left'
			? [this.nodes.leftNav, params.position || 'beforeEnd']
			: [this.nodes.rightNav, params.position || 'afterBegin'];

		const linkContainerNode = DOM.build(context, position, [
			[
				'div',
				[
					...(params.icon ? [['i', { class: params.icon }]] : []),
					' ',
					' ',
					...(params.url ? [['a', { href: params.url }, params.name]] : [params.name]),
				],
			],
		]);

		return this.parseLinkContainer(linkContainerNode);
	}

	/**
	 * @param {HTMLElement} context
	 */
	parse(context) {
		const outerNode = context.querySelector('.footer__outer-wrap');

		if (!outerNode) {
			throw 'No footer present.';
		}

		if (outerNode.dataset.esgstParsed) {
			throw 'Footer already parsed.';
		}

		this.nodes.outer = outerNode;
		this.nodes.inner = this.nodes.outer.querySelector('.footer__inner-wrap');
		this.nodes.nav = this.nodes.inner;
		this.nodes.leftNav = this.nodes.nav.querySelector(':scope > div:first-child');
		this.nodes.rightNav = this.nodes.nav.querySelector(':scope > div:last-child');

		const linkContainerNodes = [
			...Array.from(this.nodes.leftNav.querySelectorAll(':scope > div')),
			...Array.from(this.nodes.rightNav.querySelectorAll(':scope > div')),
		];

		for (const linkContainerNode of linkContainerNodes) {
			this.parseLinkContainer(linkContainerNode);
		}

		this.nodes.outer.dataset.esgstParsed = 'true';
	}

	/**
	 * @param {HTMLElement} linkContainerNode
	 * @returns {IFooterLinkContainer}
	 */
	parseLinkContainer(linkContainerNode) {
		/** @type {IFooterLinkContainer} */
		const linkContainer = {
			nodes: {
				outer: linkContainerNode,
			},
			data: {
				id: '',
				name: '',
			},
		};

		const iconNode = linkContainer.nodes.outer.querySelector('.fa');

		if (iconNode) {
			linkContainer.nodes.icon = iconNode;

			linkContainer.data.icon = linkContainer.nodes.icon.className;
		}

		const linkNode = linkContainer.nodes.outer.querySelector('a');

		if (linkNode) {
			linkContainer.nodes.link = linkContainer.nodes.outer.querySelector('a');

			linkContainer.data.name =
				linkContainer.nodes.link.textContent.trim() || linkContainer.nodes.outer.title;
			linkContainer.data.url = linkContainer.nodes.link.getAttribute('href');
		} else {
			linkContainer.data.name =
				linkContainer.nodes.outer.textContent.trim() || linkContainer.nodes.outer.title;
		}

		linkContainer.data.id = IFooter.generateId(linkContainer.data.name);

		this.linkContainers[linkContainer.data.id] = linkContainer;

		return linkContainer;
	}
}

class StFooter extends IFooter {
	constructor() {
		super();
	}

	/**
	 * @param {IFooterLinkContainerParams} params
	 */
	addLinkContainer(params) {
		const [context, position] = params.context
			? [params.context, params.position]
			: params.side === 'left'
			? [this.nodes.leftNav, params.position || 'beforeEnd']
			: [this.nodes.rightNav, params.position || 'afterBegin'];

		const linkContainerNode = DOM.build(context, position, [
			[
				'li',
				[
					...(params.icon ? [['i', { class: params.icon }]] : []),
					' ',
					...(params.url ? [['a', { href: params.url }, params.name]] : [params.name]),
				],
			],
		]);

		return this.parseLinkContainer(linkContainerNode);
	}

	/**
	 * @param {HTMLElement} context
	 */
	parse(context) {
		const outerNode = context.querySelector('footer');

		if (!outerNode) {
			throw 'No footer present.';
		}

		if (outerNode.dataset.esgstParsed) {
			throw 'Footer already parsed.';
		}

		this.nodes.outer = outerNode;
		this.nodes.inner = this.nodes.outer.querySelector('.footer_inner_wrap');
		this.nodes.nav = this.nodes.inner;
		this.nodes.leftNav = DOM.build(this.nodes.nav, 'afterBegin', [['ul']]);
		this.nodes.leftNav.appendChild(this.nodes.nav.querySelector(':scope > div'));
		this.nodes.rightNav = this.nodes.nav.querySelector(':scope > ul:last-child');

		const linkContainerNodes = [
			...Array.from(this.nodes.leftNav.querySelectorAll(':scope > li, :scope > div')),
			...Array.from(this.nodes.rightNav.querySelectorAll(':scope > li, :scope > div')),
		];

		for (const linkContainerNode of linkContainerNodes) {
			this.parseLinkContainer(linkContainerNode);
		}

		this.nodes.outer.dataset.esgstParsed = 'true';
	}

	/**
	 * @param {HTMLElement} linkContainerNode
	 * @returns {IFooterLinkContainer}
	 */
	parseLinkContainer(linkContainerNode) {
		/** @type {IFooterLinkContainer} */
		const linkContainer = {
			nodes: {
				outer: linkContainerNode,
			},
			data: {
				id: '',
				name: '',
			},
		};

		const iconNode = linkContainer.nodes.outer.querySelector('.fa');

		if (iconNode) {
			linkContainer.nodes.icon = iconNode;

			linkContainer.data.icon = linkContainer.nodes.icon.className;
		}

		const linkNode = linkContainer.nodes.outer.querySelector('a');

		if (linkNode) {
			linkContainer.nodes.link = linkContainer.nodes.outer.querySelector('a');

			linkContainer.data.name =
				linkContainer.nodes.link.textContent.trim() || linkContainer.nodes.outer.title;
			linkContainer.data.url = linkContainer.nodes.link.getAttribute('href');
		} else {
			linkContainer.data.name =
				linkContainer.nodes.outer.textContent.trim() || linkContainer.nodes.outer.title;
		}

		linkContainer.data.id = IFooter.generateId(linkContainer.data.name);

		this.linkContainers[linkContainer.data.id] = linkContainer;

		return linkContainer;
	}
}

/**
 * @param {number} namespace
 * @returns {IFooter}
 */
function Footer(namespace = Session.namespace) {
	switch (namespace) {
		case Namespaces.SG: {
			return new SgFooter();
		}

		case Namespaces.ST: {
			return new StFooter();
		}

		default: {
			throw 'Invalid namespace.';
		}
	}
}

export { IFooter, Footer };
