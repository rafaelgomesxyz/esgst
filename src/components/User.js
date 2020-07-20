import { Namespaces } from '../constants/Namespaces';
import { Session } from '../class/Session';

class IUser {
	constructor() {
		/** @type {IUserNodes} */
		this.nodes = {};

		/** @type {IUserData} */
		this.data = {};
	}

	/**
	 * @param {string} url
	 * @returns {string}
	 */
	static extractAvatar(url) {
		return url.match(/url\("(.+?)"\)/)[1];
	}

	/**
	 * @param {string} url
	 * @returns {string}
	 */
	static extractUsername(url) {
		return url.match(/\/user\/([A-Za-z0-9]+)/)[1];
	}
}

class SgUser extends IUser {
	constructor() {
		super();
	}

	/**
	 * @param {HTMLElement} context
	 */
	parse(context) {
		if (context.dataset.esgstParsed) {
			throw 'User already parsed.';
		}

		const avatarOuterNode = context.querySelector('.nav__avatar-outer-wrap');

		if (avatarOuterNode) {
			this.nodes.avatarOuter = avatarOuterNode;
			this.nodes.avatarInner = this.nodes.avatarOuter.querySelector('.nav__avatar-inner-wrap');

			this.data.url = this.nodes.avatarOuter.getAttribute('href');
			this.data.username = IUser.extractUsername(this.data.url);
			this.data.avatar = IUser.extractAvatar(this.nodes.avatarInner.style.backgroundImage);
		}

		context.dataset.esgstParsed = 'true';
	}
}

class StUser extends IUser {
	constructor() {
		super();
	}

	/**
	 * @param {HTMLElement} context
	 */
	parse(context) {
		if (context.dataset.esgstParsed) {
			throw 'User already parsed.';
		}

		const avatarOuterNode = context.classList.contains('nav_avatar') && context;

		if (avatarOuterNode) {
			this.nodes.avatarOuter = avatarOuterNode;
			this.nodes.avatarInner = this.nodes.avatarOuter;

			this.data.url = this.nodes.avatarOuter.getAttribute('href');
			this.data.username = IUser.extractUsername(this.data.url);
			this.data.avatar = IUser.extractAvatar(this.nodes.avatarInner.style.backgroundImage);
		}

		context.dataset.esgstParsed = 'true';
	}
}

/**
 * @param {number} [namespace]
 * @returns {IUser}
 */
function User(namespace = Session.namespace) {
	switch (namespace) {
		case Namespaces.SG: {
			return new SgUser();
		}

		case Namespaces.ST: {
			return new StUser();
		}

		default: {
			throw 'Invalid namespace.';
		}
	}
}

export { IUser, User };
