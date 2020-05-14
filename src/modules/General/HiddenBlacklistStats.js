import { Module } from '../../class/Module';

class GeneralHiddenBlacklistStats extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						'Hides the blacklist stats of your ',
						['a', { href: `https://www.steamgifts.com/stats/personal/community` }, 'stats'],
						' page.'
					]]
				]]
			],
			id: 'hbs',
			name: 'Hidden Blacklist Stats',
			sg: true,
			type: 'general'
		};
	}

	init() {
		if (!window.location.pathname.match(/^\/stats\/personal\/community/)) return;

		let chart = document.getElementsByClassName('chart')[4];

		// remove any "blacklist" text from the chart
		let heading = chart.firstElementChild;
		heading.lastElementChild.remove();
		heading.lastElementChild.remove();
		let subHeading = heading.nextElementSibling;
		subHeading.textContent = subHeading.textContent.replace(/and\sblacklists\s/, '');

		// create a new graph without the blacklist points
		let script = document.createElement('script');
		script.textContent = chart.previousElementSibling.textContent.replace(/,{name:\s"Blacklists".+?}/, '');
		document.body.appendChild(script);
		script.remove();
	}
}

const generalHiddenBlacklistStats = new GeneralHiddenBlacklistStats();

export { generalHiddenBlacklistStats };