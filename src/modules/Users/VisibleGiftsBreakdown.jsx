import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class UsersVisibleGiftsBreakdown extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							[
								`Shows the gifts breakdown of a user in their profile page, with the following initials:`,
							],
						],
						[
							'ul',
							[
								['li', 'FCV - Full CV'],
								['li', 'RCV - Reduced CV'],
								['li', 'NCV - No CV'],
								['li', 'A - Awaiting Feedback'],
								['li', 'NR - Not Received'],
							],
						],
					],
				],
			],
			id: 'vgb',
			inputItems: [
				{
					id: 'vgb_wonFormat',
					prefix: `Won Format: `,
					tooltip: `[FCV], [RCV], [NCV] and [NR] will be replaced with their respective values.`,
				},
				{
					id: 'vgb_sentFormat',
					prefix: `Sent Format: `,
					tooltip: `[FCV], [RCV], [NCV], [A] and [NR] will be replaced with their respective values.`,
				},
			],
			name: 'Visible Gifts Breakdown',
			options: {
				title: `Position: `,
				values: ['Left', 'Right'],
			},
			sg: true,
			type: 'users',
			featureMap: {
				profile: this.vgb_add.bind(this),
			},
		};
	}

	vgb_add(profile) {
		const position = Settings.get('vgb_index') === 0 ? 'afterbegin' : 'beforeend';
		DOM.insert(
			profile.wonRowRight.firstElementChild.firstElementChild,
			position,
			<fragment>{` ${Settings.get('vgb_wonFormat')
				.replace(/\[FCV]/, profile.wonFull)
				.replace(/\[RCV]/, profile.wonReduced)
				.replace(/\[NCV]/, profile.wonZero)
				.replace(/\[NR]/, profile.wonNotReceived)} `}</fragment>
		);
		DOM.insert(
			profile.sentRowRight.firstElementChild.firstElementChild,
			position,
			<fragment>{` ${Settings.get('vgb_sentFormat')
				.replace(/\[FCV]/, profile.sentFull)
				.replace(/\[RCV]/, profile.sentReduced)
				.replace(/\[NCV]/, profile.sentZero)
				.replace(/\[A]/, profile.sentAwaiting)
				.replace(/\[NR]/, profile.sentNotReceived)} `}</fragment>
		);
	}
}

const usersVisibleGiftsBreakdown = new UsersVisibleGiftsBreakdown();

export { usersVisibleGiftsBreakdown };
