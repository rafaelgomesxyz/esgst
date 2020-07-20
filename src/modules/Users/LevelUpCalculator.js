import { Module } from '../../class/Module';
import { common } from '../Common';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class UsersLevelUpCalculator extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						['li', 'Shows how much real CV a user needs to level up in their profile page.'],
						[
							'li',
							[
								'Uses the values mentioned on ',
								['a', { href: 'https://www.steamgifts.com/discussion/XaCbA/' }, 'this discussion'],
								' for the calculation.',
							],
						],
					],
				],
			],
			features: {
				luc_c: {
					name: 'Display current user level.',
					sg: true,
				},
			},
			id: 'luc',
			name: 'Level Up Calculator',
			sg: true,
			type: 'users',
			featureMap: {
				profile: this.luc_calculate.bind(this),
			},
		};
	}

	luc_calculate(profile) {
		for (const [index, value] of Shared.esgst.cvLevels.entries()) {
			const cvRounded = Math.round(profile.realSentCV);
			if (cvRounded < value) {
				DOM.build(profile.levelRowRight, 'beforeEnd', [
					[
						'span',
						{ class: 'esgst-luc-value', title: Shared.common.getFeatureTooltip('luc') },
						`(${Settings.get('luc_c') ? `${profile.level} / ` : ''}~$${Shared.common.round(
							value - cvRounded
						)} real CV to level ${index})`,
					],
				]);
				break;
			}
		}
	}
}

const usersLevelUpCalculator = new UsersLevelUpCalculator();

export { usersLevelUpCalculator };
