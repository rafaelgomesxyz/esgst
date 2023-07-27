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
			? [this.nodes.leftNav, params.position || 'beforeend']
			: [this.nodes.rightNav, params.position || 'afterbegin'];

		let linkContainerNode;
		DOM.insert(
			context,
			position,
			<div ref={(ref) => (linkContainerNode = ref)}>
				{params.icon ? <i className={params.icon}></i> : null}{' '}
				{params.url ? <a href={params.url}>{params.name}</a> : params.name}
			</div>
		);

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
			? [this.nodes.leftNav, params.position || 'beforeend']
			: [this.nodes.rightNav, params.position || 'afterbegin'];

		let linkContainerNode;
		DOM.insert(
			context,
			position,
			<div ref={(ref) => (linkContainerNode = ref)}>
				{params.icon ? <i className={params.icon}></i> : null}{' '}
				{params.url ? <a href={params.url}>{params.name}</a> : params.name}
			</div>
		);

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
		this.nodes.inner = this.nodes.outer.querySelector('.footer_lower .footer_inner_wrap');
		this.nodes.nav = this.nodes.inner;
		DOM.insert(
			this.nodes.nav,
			'afterbegin',
			<div ref={(ref) => (this.nodes.leftNav = ref)} style="display: flex; gap: 15px;"></div>
		);
		this.nodes.leftNav.appendChild(this.nodes.nav.querySelector('.footer_steam'));
		this.nodes.rightNav = this.nodes.nav.querySelector('.footer_sites');

		const linkContainerNodes = [
			...Array.from(this.nodes.leftNav.querySelectorAll(':scope > a')),
			...Array.from(this.nodes.rightNav.querySelectorAll(':scope > a')),
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

		const linkNode = linkContainer.nodes.outer;

		if (linkNode) {
			linkContainer.nodes.link = linkContainer.nodes.outer;

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
