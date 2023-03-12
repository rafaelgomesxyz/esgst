import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class GeneralHiddenCommunityPoll extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>Hides the community poll (if there is one) of the main page.</li>
				</ul>
			),
			features: {
				hcp_v: {
					name: 'Only hide the poll if you already voted in it.',
					sg: true,
				},
			},
			id: 'hcp',
			name: 'Hidden Community Poll',
			sg: true,
			type: 'general',
		};
	}

	init() {
		if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions) return;
		let poll = this.esgst.activeDiscussions.previousElementSibling;
		if (
			poll &&
			poll.classList.contains('widget-container') &&
			!poll.querySelector(`.block_header[href="/happy-holidays"]`)
		) {
			if (!Settings.get('hcp_v') || poll.querySelector('.table__row-outer-wrap.is-selected')) {
				poll.classList.add('esgst-hidden');
			}
		}
	}
}

const generalHiddenCommunityPoll = new GeneralHiddenCommunityPoll();

export { generalHiddenCommunityPoll };
