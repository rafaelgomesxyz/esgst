import { Utils } from '../lib/jsUtils';

class Scope {
	constructor(name, context) {
		this.name = name;
		this.context = context;
		if (name === 'main') {
			this.id = name;
		} else {
			this.id = new Array(16).fill('x').map(x => Utils.createUuid(x)).join('');
		}

		this.data = {
			comments: [],
			commentsV2: [],
			discussions: [],
			games: [],
			giveaways: [],
			groups: [],
			trades: [],
			users: []
		};
	}

	reset(key) {
		if (this.data.hasOwnProperty(key)) {
			this.data[key] = [];
		}
	}

	get comments() { return this.data.comments; }

	get commentsV2() { return this.data.commentsV2; }

	get discussions() { return this.data.discussions; }

	get games() { return this.data.games; }

	get giveaways() { return this.data.giveaways; }

	get groups() { return this.data.groups; }

	get trades() { return this.data.trades; }

	get users() { return this.data.users; }
}

export { Scope };