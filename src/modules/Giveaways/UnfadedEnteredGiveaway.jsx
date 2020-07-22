import { Module } from '../../class/Module';
import { DOM } from '../../class/DOM';

class GiveawaysUnfadedEnteredGiveaway extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>Removes SteamGifts' default fade for entered giveaways.</li>
				</ul>
			),
			id: 'ueg',
			name: 'Unfaded Entered Giveaway',
			sg: true,
			type: 'giveaways',
			featureMap: {
				endless: this.ueg_remove.bind(this),
			},
		};
	}

	ueg_remove(context, main, source, endless) {
		const elements = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} .giveaway__row-inner-wrap.is-faded, .esgst-es-page-${endless}.giveaway__row-inner-wrap.is-faded`
					: '.giveaway__row-inner-wrap.is-faded'
			}`
		);
		for (let i = 0, n = elements.length; i < n; ++i) {
			elements[i].classList.add('esgst-ueg');
		}
	}
}

const giveawaysUnfadedEnteredGiveaway = new GiveawaysUnfadedEnteredGiveaway();

export { giveawaysUnfadedEnteredGiveaway };
