import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const capitalizeFirstLetter = common.capitalizeFirstLetter.bind(common),
	createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	saveAndSortContent = common.saveAndSortContent.bind(common);
class GiveawaysGiveawaysSorter extends Module {
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
								`Adds a button (`,
								['i', { class: 'fa fa-sort' }],
								`) to the main page heading of any `,
								['a', { href: `https://www.steamgifts.com/giveaways` }, 'giveaways'],
								'/',
								['a', { href: `https://www.steamgifts.com/entered` }, 'entered'],
								'/',
								['a', { href: `https://www.steamgifts.com/group/SJ7Bu/` }, 'group'],
								'/',
								['a', { href: `https://www.steamgifts.com/user/cg` }, 'user'],
								` page that allows you to sort the giveaways in the page by game name, points, rating (if [id=gc_r] is enabled), end time, start time, creator, comments, entries, chance/chance per point (if [id=gwc] is enabled), ratio (if [id=gwr] is enabled) and points to win (if [id=gptw] is enabled).`,
							],
						],
						[
							'li',
							'There is also an option to automatically sort the giveaways so that every time you open the page the giveaways are already sorted by whatever option you prefer.',
						],
					],
				],
			],
			id: 'gas',
			name: 'Giveaways Sorter',
			sg: true,
			type: 'giveaways',
		};
	}

	init(popup) {
		if (
			!popup &&
			!this.esgst.giveawaysPath &&
			!this.esgst.enteredPath &&
			!this.esgst.groupPath &&
			!this.esgst.userPath
		)
			return;

		const typeMatch = window.location.search.match(/type=(wishlist|recommended|group|new)/);
		let type = '';
		if (typeMatch) {
			type = capitalizeFirstLetter(typeMatch[1]);
		} else if (this.esgst.enteredPath) {
			type = 'Entered';
		} else if (this.esgst.userPath) {
			type = 'User';
		} else if (this.esgst.groupPath) {
			type = 'Groups';
		} else if (popup) {
			type = 'Popup';
		} else {
			type = '';
		}
		this.esgst.gas = {
			autoKey: `gas_auto${type}`,
			optionKey: `gas_option${type}`,
		};

		let object = {
			button: createHeadingButton({
				context: popup,
				id: 'gas',
				icons: ['fa-sort'],
				title: 'Sort giveaways',
			}),
		};
		object.button.addEventListener('click', this.gas_openPopout.bind(this, object));
	}

	gas_openPopout(obj) {
		if (obj.popout) return;

		obj.popout = new Popout('esgst-gas-popout', obj.button, 0, true);
		new ToggleSwitch(
			obj.popout.popout,
			this.esgst.gas.autoKey,
			false,
			'Auto Sort',
			false,
			false,
			'Automatically sorts the giveaways by the selected option when loading the page.',
			Settings.get(this.esgst.gas.autoKey)
		);
		const children = [
			{
				attributes: {
					value: 'sortIndex_asc',
				},
				text: 'Default',
				type: 'option',
			},
			{
				attributes: {
					value: 'name_asc',
				},
				text: 'Game Name - Ascending',
				type: 'option',
			},
			{
				attributes: {
					value: 'name_desc',
				},
				text: 'Game Name - Descending',
				type: 'option',
			},
		];
		children.push(
			{
				attributes: {
					value: 'level_asc',
				},
				text: 'Level - Ascending',
				type: 'option',
			},
			{
				attributes: {
					value: 'level_desc',
				},
				text: 'Level - Descending',
				type: 'option',
			}
		);
		if (!this.esgst.enteredPath) {
			children.push(
				{
					attributes: {
						value: 'points_asc',
					},
					text: 'Points - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'points_desc',
					},
					text: 'Points - Descending',
					type: 'option',
				}
			);
		}
		if (Settings.get('gc') && Settings.get('gc_r') && !this.esgst.enteredPath) {
			children.push(
				{
					attributes: {
						value: 'rating_asc',
					},
					text: 'Rating - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'rating_desc',
					},
					text: 'Rating - Descending',
					type: 'option',
				}
			);
		}
		children.push(
			{
				attributes: {
					value: 'endTime_asc',
				},
				text: 'End Time - Ascending',
				type: 'option',
			},
			{
				attributes: {
					value: 'endTime_desc',
				},
				text: 'End Time - Descending',
				type: 'option',
			}
		);
		if (!this.esgst.enteredPath) {
			children.push(
				{
					attributes: {
						value: 'startTime_asc',
					},
					text: 'Start Time - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'startTime_desc',
					},
					text: 'Start Time - Descending',
					type: 'option',
				},
				{
					attributes: {
						value: 'creator_asc',
					},
					text: 'Creator - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'creator_desc',
					},
					text: 'Creator - Descending',
					type: 'option',
				},
				{
					attributes: {
						value: 'comments_asc',
					},
					text: 'Comments - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'comments_desc',
					},
					text: 'Comments - Descending',
					type: 'option',
				}
			);
		}
		children.push(
			{
				attributes: {
					value: 'entries_asc',
				},
				text: 'Entries - Ascending',
				type: 'option',
			},
			{
				attributes: {
					value: 'entries_desc',
				},
				text: 'Entries - Descending',
				type: 'option',
			}
		);
		if (Settings.get('gwc')) {
			children.push(
				{
					attributes: {
						value: 'chance_asc',
					},
					text: 'Chance - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'chance_desc',
					},
					text: 'Chance - Descending',
					type: 'option',
				},
				{
					attributes: {
						value: 'chancePerPoint_asc',
					},
					text: 'Chance Per Point - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'chancePerPoint_desc',
					},
					text: 'Chance Per Point - Descending',
					type: 'option',
				}
			);
			if (Settings.get('gwc_a')) {
				children.push(
					{
						attributes: {
							value: 'projectedChance_asc',
						},
						text: 'Projected Chance - Ascending',
						type: 'option',
					},
					{
						attributes: {
							value: 'projectedChance_desc',
						},
						text: 'Projected Chance - Descending',
						type: 'option',
					},
					{
						attributes: {
							value: 'projectedChancePerPoint_asc',
						},
						text: 'Projected Chance Per Point - Ascending',
						type: 'option',
					},
					{
						attributes: {
							value: 'projectedChancePerPoint_desc',
						},
						text: 'Projected Chance Per Point - Descending',
						type: 'option',
					}
				);
			}
		}
		if (Settings.get('gwr')) {
			children.push(
				{
					attributes: {
						value: 'ratio_asc',
					},
					text: 'Ratio - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'ratio_desc',
					},
					text: 'Ratio - Descending',
					type: 'option',
				}
			);
			if (Settings.get('gwr_a')) {
				children.push(
					{
						attributes: {
							value: 'projectedRatio_asc',
						},
						text: 'Projected Ratio - Ascending',
						type: 'option',
					},
					{
						attributes: {
							value: 'projectedRatio_desc',
						},
						text: 'Projected Ratio - Descending',
						type: 'option',
					}
				);
			}
		}
		if (Settings.get('gptw')) {
			children.push(
				{
					attributes: {
						value: 'pointsToWin_asc',
					},
					text: 'Points To Win - Ascending',
					type: 'option',
				},
				{
					attributes: {
						value: 'pointsToWin_desc',
					},
					text: 'Points To Win - Descending',
					type: 'option',
				}
			);
		}
		let options = createElements(obj.popout.popout, 'beforeEnd', [
			{
				type: 'select',
				children,
			},
		]);
		options.value = Settings.get(this.esgst.gas.optionKey);
		let callback = () =>
			saveAndSortContent(this.esgst.currentScope.giveaways, this.esgst.gas.optionKey, options);
		options.addEventListener('change', callback);
		obj.popout.popout.appendChild(
			new ButtonSet({
				color1: 'green',
				color2: '',
				icon1: 'fa-arrow-circle-right',
				icon2: '',
				title1: 'Sort',
				title2: '',
				callback1: callback,
			}).set
		);
		obj.popout.open();
	}
}

const giveawaysGiveawaysSorter = new GiveawaysGiveawaysSorter();

export { giveawaysGiveawaysSorter };
