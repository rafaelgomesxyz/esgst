import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';

export abstract class User implements IUser {
	nodes: IUserNodes;
	data: IUserData;

	constructor() {
		this.nodes = User.getDefaultNodes();
		this.data = User.getDefaultData();
	}

	static getDefaultNodes = (): IUserNodes => {
		return {
			avatarOuter: null,
			avatarInner: null,
			usernameOuter: null,
			usernameInner: null,
			role: null,
			patreon: null,
			reputation: null,
			positiveReputation: null,
			negativeReputation: null,
		};
	};

	static getDefaultData = (): IUserData => {
		return {
			...User.getDefaultBaseData(),
			...User.getDefaultExtraData(),
		};
	};

	static getDefaultBaseData = (): IUserBaseData => {
		return {
			id: null,
			steamId: null,
			avatar: null,
			username: null,
			isOp: null,
			roleId: null,
			roleName: null,
			isPatron: null,
			positiveReputation: null,
			negativeReputation: null,
		};
	};

	static getDefaultExtraData = (): IUserExtraData => {
		return {
			url: null,
		};
	};

	static create = (): IUser | null => {
		switch (Session.namespace) {
			case Namespaces.SG:
				return new SgUser();
			case Namespaces.ST:
				return new StUser();
			default:
				return null;
		}
	};

	abstract parseExtraData(): void;
}

class SgUser extends User {
	constructor() {
		super();
	}

	parseExtraData = () => {
		if (this.data.username) {
			this.data.url = `/user/${this.data.username}`;
		}
	};
}

class StUser extends User {
	constructor() {
		super();
	}

	parseExtraData = () => {
		if (this.data.steamId) {
			this.data.url = `/user/${this.data.steamId}`;
		}
	};
}
