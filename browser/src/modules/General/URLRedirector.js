import { Module } from '../../class/Module';

class GeneralURLRedirector extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', `Redirects broken URLs to the correct URLs. For example, "/giveaway/XXXXX" redirects to "/giveaway/XXXXX/".`]
				]]
			],
			id: 'urlr',
			name: 'URL Redirector',
			sg: true,
			st: true,
			type: 'general'
		};
	}
}

const generalURLRedirector = new GeneralURLRedirector();

export { generalURLRedirector };