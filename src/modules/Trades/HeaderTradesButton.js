import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';

class TradesHeaderTradesButton extends Module {
	constructor() {
		super();
		this.info = {
			description: [['ul', [['li', 'Brings back the Trades button to the SteamGifts header.']]]],
			id: 'htb',
			name: 'Header Trades Button',
			sg: true,
			type: 'trades',
		};
	}

	init() {
		const tradesButton = Shared.header.addButtonContainer({
			buttonName: 'Trades',
			position: 'beforeEnd',
			openInNewTab: true,
			side: 'left',
			url: 'https://www.steamtrades.com',
		});
		Shared.header.nodes.leftNav.insertBefore(
			tradesButton.nodes.outer,
			Shared.header.buttonContainers.discussions.nodes.outer
		);
	}
}

const tradesHeaderTradesButton = new TradesHeaderTradesButton();

export { tradesHeaderTradesButton };
