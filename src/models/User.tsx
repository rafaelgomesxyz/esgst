import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';
import { Base, BaseData, BaseNodes } from './Base';

export interface UserNodes extends BaseNodes {
	usernameOuter: HTMLDivElement | null;
	usernameInner: HTMLAnchorElement | null;
	role: HTMLAnchorElement | null;
	patreon: HTMLAnchorElement | null;
	reputation: HTMLAnchorElement | null;
	positiveReputation: HTMLSpanElement | null;
	negativeReputation: HTMLSpanElement | null;
	avatarOuter: HTMLAnchorElement | null;
	avatarInner: HTMLDivElement | null;
}

export type UserData = BaseData & UserBaseData & UserExtraData;

export interface UserBaseData {
	id: string | null;
	steamId: string | null;
	username: string | null;
	op: boolean | null;
	roleId: string | null;
	roleName: string | null;
	patron: boolean | null;
	positiveReputation: number | null;
	negativeReputation: number | null;
	avatar: string | null;
}

export interface UserExtraData {
	url: string | null;
}

export abstract class User extends Base<User, UserNodes, UserData> {
	constructor(namespace: number) {
		super(namespace);
		this.nodes = User.getDefaultNodes();
		this.data = User.getDefaultData();
	}

	static getDefaultNodes = (): UserNodes => {
		return {
			...Base.getDefaultNodes(),
			usernameOuter: null,
			usernameInner: null,
			role: null,
			patreon: null,
			reputation: null,
			positiveReputation: null,
			negativeReputation: null,
			avatarOuter: null,
			avatarInner: null,
		};
	};

	static getDefaultData = (): UserData => {
		return {
			...Base.getDefaultData(),
			...User.getDefaultBaseData(),
			...User.getDefaultExtraData(),
		};
	};

	static getDefaultBaseData = (): UserBaseData => {
		return {
			id: null,
			steamId: null,
			username: null,
			op: null,
			roleId: null,
			roleName: null,
			patron: null,
			positiveReputation: null,
			negativeReputation: null,
			avatar: null,
		};
	};

	static getDefaultExtraData = (): UserExtraData => {
		return {
			url: null,
		};
	};

	static create = (namespace = Session.namespace): User | null => {
		switch (namespace) {
			case Namespaces.SG:
				return new SgUser();
			case Namespaces.ST:
				return new StUser();
			default:
				return null;
		}
	};

	static extractUser = (url: string): string | null => {
		return url.slice(6) || null; // /user/...
	};

	static extractAvatar = (url: string): string | null => {
		return url.slice(5, -2) || null; // url("...")
	};

	parse = (refNode: HTMLElement): User => {
		this.parseNodes(refNode);
		this.parseData();
		this.parseExtraData();

		return this;
	};

	parseNodes = (refNode: HTMLElement): User => {
		return this;
	};

	build = (): User => {
		return this;
	};

	reset = (): User => {
		const outerNode = this.nodes.outer;
		this.nodes = User.getDefaultNodes();
		this.data = User.getDefaultData();

		if (outerNode) {
			this.nodes.outer = outerNode;
			this.built = false;
			this.build();
		}

		return this;
	};
}

class SgUser extends User {
	constructor() {
		super(Namespaces.SG);
	}

	parseData = (): SgUser => {
		const nodes = this.nodes;
		const data = User.getDefaultData();

		const url =
			nodes.usernameInner?.getAttribute('href') || nodes.avatarOuter?.getAttribute('href');
		if (url) {
			data.username = User.extractUser(url);
		}
		if (nodes.usernameOuter) {
			data.op = nodes.usernameOuter.classList.contains('comment__username--op');
		}
		if (nodes.role) {
			data.roleId = nodes.role.getAttribute('href')?.slice(7) || null; // /roles/...
			data.roleName = nodes.role.textContent.trim().slice(1, -1) || null; // (...)
		}
		data.patron = !!nodes.patreon;
		const imageUrl =
			nodes.avatarOuter?.style.backgroundImage || nodes.avatarInner?.style.backgroundImage;
		if (imageUrl) {
			data.avatar = User.extractAvatar(imageUrl);
		}
		this.data = data;

		return this;
	};

	parseExtraData = (): SgUser => {
		const data = this.data;

		if (data.username) {
			data.url = `/user/${data.username}`;
		}

		return this;
	};
}

class StUser extends User {
	constructor() {
		super(Namespaces.ST);
	}

	parseData = (): StUser => {
		const nodes = this.nodes;
		const data = User.getDefaultData();

		const url =
			nodes.usernameInner?.getAttribute('href') || nodes.avatarOuter?.getAttribute('href');
		if (url) {
			data.steamId = User.extractUser(url);
		}
		if (nodes.usernameOuter) {
			data.username = nodes.usernameOuter.textContent.trim() || null;
			data.op = nodes.usernameOuter.classList.contains('is_op');
		}
		if (nodes.reputation && nodes.positiveReputation && nodes.negativeReputation) {
			data.positiveReputation = parseInt(
				nodes.positiveReputation.textContent.slice(1).replace(',', '')
			); // +...
			data.negativeReputation = parseInt(
				nodes.negativeReputation.textContent.slice(1).replace(',', '')
			); // -...
		}
		const imageUrl =
			nodes.avatarOuter?.style.backgroundImage || nodes.avatarInner?.style.backgroundImage;
		if (imageUrl) {
			data.avatar = User.extractAvatar(imageUrl);
		}
		this.data = data;

		return this;
	};

	parseExtraData = (): StUser => {
		const data = this.data;

		if (data.steamId) {
			data.url = `/user/${data.steamId}`;
		}

		return this;
	};
}
