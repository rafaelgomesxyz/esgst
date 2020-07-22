import { Module } from '../../class/Module';
import { common } from '../Common';

const createElements = common.createElements.bind(common);
class GiveawaysHiddenGamesEnterButtonDisabler extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							'Disables the enter button of any giveaway if you have hidden the game on SteamGifts so that you do not accidentally enter it.',
						],
					],
				],
			],
			id: 'hgebd',
			name: "Hidden Game's Enter Button Disabler",
			sg: true,
			sync: 'Hidden Games',
			syncKeys: ['HiddenGames'],
			type: 'giveaways',
		};
	}

	init() {
		if (!this.esgst.giveawayPath || document.getElementsByClassName('table--summary')[0]) {
			return;
		}
		const hideButton = document.getElementsByClassName('featured__giveaway__hide')[0];
		if (
			(this.esgst.enterGiveawayButton ||
				(this.esgst.giveawayErrorButton &&
					!this.esgst.giveawayErrorButton.textContent.match(/Exists\sin\sAccount/))) &&
			!hideButton
		) {
			const parent = (this.esgst.enterGiveawayButton || this.esgst.giveawayErrorButton)
				.parentElement;
			if (this.esgst.enterGiveawayButton) {
				this.esgst.enterGiveawayButton.remove();
			}
			if (this.esgst.giveawayErrorButton) {
				this.esgst.giveawayErrorButton.remove();
			}
			createElements(parent, 'afterbegin', [
				{
					attributes: {
						class: 'sidebar__error is-disabled',
					},
					type: 'div',
					children: [
						{
							attributes: {
								class: 'fa fa-exclamation-circle',
							},
							type: 'i',
						},
						{
							text: ' Hidden Game',
							type: 'node',
						},
					],
				},
			]);
		}
	}
}

const giveawaysHiddenGamesEnterButtonDisabler = new GiveawaysHiddenGamesEnterButtonDisabler();

export { giveawaysHiddenGamesEnterButtonDisabler };
