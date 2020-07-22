import dateFns_format from 'date-fns/format';
import dateFns_isSameDay from 'date-fns/isSameDay';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { common } from '../Common';
import { Shared } from '../../class/Shared';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common);
class GiveawaysEntryTracker extends Module {
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
								['i', { class: 'fa fa-ticket esgst-red' }],
								` My Entry History) to the dropdown menu accessible by clicking on the arrow next to your avatar at the header of any page that allows you to view your giveaway entry history (the detailed log, including the name, link and date of every giveaway you have entered/left) and some other details (the average number of giveaways that you enter per day, the date when you entered the least number of giveaways, the date when you entered the most number of giveaways and a table containing how many giveaways you have entered/left per day).`,
							],
						],
						[
							'li',
							'An entry only appears in the history if you entered/left the giveaway after this feature was enabled.',
						],
					],
				],
			],
			id: 'et',
			name: 'Entry Tracker',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		if (this.esgst.enteredPath) {
			this.esgst.endlessFeatures.push(this.et_getEntries.bind(this));
		}
		if (!this.esgst.sg) return;

		const dropdownItem = Shared.header.addDropdownItem({
			buttonContainerId: 'account',
			description: 'View your entry history.',
			icon: 'fa fa-fw fa-ticket icon-red red',
			name: 'My Entry History',
			onClick: this.et_menu.bind(this),
		});

		dropdownItem.nodes.outer.dataset.linkId = 'myEntryHistory';
		dropdownItem.nodes.outer.dataset.linkKey = 'account';
		dropdownItem.nodes.outer.title = getFeatureTooltip('et');

		if (
			this.esgst.giveawayPath &&
			!document.getElementsByClassName('table--summary')[0] &&
			this.esgst.enterGiveawayButton
		) {
			let code, name;
			code = window.location.pathname.match(/^\/giveaway\/(.+?)\//)[1];
			name = document.getElementsByClassName('featured__heading__medium')[0].textContent;
			this.esgst.enterGiveawayButton.addEventListener(
				'click',
				this.et_setEntry.bind(this, code, true, name)
			);
			this.esgst.leaveGiveawayButton.addEventListener(
				'click',
				this.et_setEntry.bind(this, code, false, name)
			);
		}
	}

	async et_menu() {
		let dates = {};
		let entries = JSON.parse(getValue('entries', '[]'));
		const items = [];
		for (let i = entries.length - 1; i > -1; i--) {
			let entry = entries[i];
			items.push({
				type: 'li',
				children: [
					{
						text: `${entry.entry ? 'Entered' : 'Left'} `,
						type: 'node',
					},
					{
						attributes: {
							href: `/giveaway/${entry.code}/`,
						},
						text: entry.name,
						type: 'a',
					},
					{
						text: `on ${this.esgst.modules.generalAccurateTimestamp.at_formatTimestamp(
							entry.timestamp
						)}`,
						type: 'node',
					},
				],
			});
			let date = dateFns_format(entry.timestamp, `MMM d, yyyy`);
			let key = new Date(date).getTime();
			if (!dates[key]) {
				dates[key] = {
					date: date,
					entered: 0,
					left: 0,
				};
			}
			if (entry.entry) {
				dates[key].entered += 1;
			} else {
				dates[key].left += 1;
			}
		}
		const currentKeys = Object.keys(dates).map((x) => parseInt(x));
		const lastDate = currentKeys[0];
		let currentDate = currentKeys[currentKeys.length - 1];
		while (currentDate < lastDate) {
			const dateObj = new Date(currentDate);
			dateObj.setDate(dateObj.getDate() + 1);
			currentDate = dateObj.getTime();
			if (!dates[currentDate]) {
				dates[currentDate] = {
					date: dateFns_format(currentDate, `MMM d, yyyy`),
					entered: 0,
					left: 0,
				};
			}
		}
		let popup = new Popup({
			addScrollable: true,
			icon: 'fa-history',
			isTemp: true,
			title: 'Entry Tracker',
		});
		popup.scrollable.style.display = 'flex';
		let rows = createElements(popup.scrollable, 'beforeend', [
			{
				attributes: {
					class: 'esgst-text-left table',
					style: `padding-left: 5px;`,
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'table__heading',
						},
						type: 'div',
						children: [
							{
								attributes: {
									class: 'table__column--width-small',
								},
								text: 'Delete',
								type: 'div',
							},
							{
								attributes: {
									class: 'table__column--width-small',
								},
								text: 'Date',
								type: 'div',
							},
							{
								attributes: {
									class: 'table__column--width-small',
								},
								text: 'Entered',
								type: 'div',
							},
							{
								attributes: {
									class: 'table__column--width-small',
								},
								text: 'Left',
								type: 'div',
							},
						],
					},
					{
						attributes: {
							class: 'table__rows',
						},
						type: 'div',
					},
				],
			},
		]).lastElementChild;
		let keys = Object.keys(dates);
		keys.sort();
		let lowest = {
			count: 999999999,
			date: null,
		};
		let highest = {
			count: 0,
			date: null,
		};
		let total = 0;
		for (let i = keys.length - 1; i > -1; i--) {
			let key = keys[i];
			let button = createElements(rows, 'beforeend', [
				{
					attributes: {
						class: 'table__row-outer-wrap',
					},
					type: 'div',
					children: [
						{
							attributes: {
								class: 'table__row-inner-wrap',
							},
							type: 'div',
							children: [
								{
									attributes: {
										class: 'table__column--width-small esgst-text-center',
									},
									type: 'div',
									children: [
										{
											attributes: {
												class: 'fa fa-times esgst-clickable',
												title: 'Delete',
											},
											type: 'i',
										},
									],
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: dates[key].date,
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: dates[key].entered,
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: dates[key].left,
									type: 'div',
								},
							],
						},
					],
				},
			]).firstElementChild.firstElementChild;
			button.firstElementChild.addEventListener(
				'click',
				this.et_deleteEntry.bind(this, button, dates[key].date, popup)
			);
			if (dates[key].entered < lowest.count) {
				lowest.count = dates[key].entered;
				lowest.date = dates[key].date;
			}
			if (dates[key].entered > highest.count) {
				highest.count = dates[key].entered;
				highest.date = dates[key].date;
			}
			total += dates[key].entered;
		}
		let average = Math.round((total / keys.length) * 100) / 100;
		createElements(popup.description, 'afterbegin', [
			{
				type: 'div',
				children: [
					{
						text: 'You enter on average ',
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-bold',
						},
						text: average,
						type: 'span',
					},
					{
						text: ' giveaways per day.',
						type: 'node',
					},
				],
			},
			{
				type: 'div',
				children: [
					{
						text: 'Your highest entry count was on ',
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-italic',
						},
						text: highest.date,
						type: 'span',
					},
					{
						text: ' with ',
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-bold',
						},
						text: highest.count,
						type: 'span',
					},
					{
						text: ' entries.',
						type: 'node',
					},
				],
			},
			{
				type: 'div',
				children: [
					{
						text: 'Your lowest entry count was on ',
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-italic',
						},
						text: lowest.date,
						type: 'span',
					},
					{
						text: ' with ',
						type: 'node',
					},
					{
						attributes: {
							class: 'esgst-bold',
						},
						text: lowest.count,
						type: 'span',
					},
					{
						text: ' entries.',
						type: 'node',
					},
				],
			},
		]);
		createElements(popup.scrollable, 'afterbegin', [
			{
				attributes: {
					class: 'esgst-text-left markdown',
					style: `border-right: 1px solid #ccc; padding-right: 5px;`,
				},
				type: 'div',
				children: [
					{
						type: 'ul',
						children: items,
					},
				],
			},
		]);
		popup.open();
	}

	async et_deleteEntry(button, date, popup) {
		if (
			!window.confirm(
				`Are you sure you want to delete entries for ${date}? Your entire history for that day will be deleted.`
			)
		)
			return;
		createElements(button, 'atinner', [
			{
				attributes: {
					class: 'fa fa-circle-o-notch fa-spin',
				},
				type: 'i',
			},
		]);
		let entries = JSON.parse(getValue('entries', '[]'));
		for (let i = entries.length - 1; i > -1; i--) {
			let entry = entries[i];
			if (!dateFns_isSameDay(date, entry.timestamp)) continue;
			entries.splice(i, 1);
		}
		await setValue('entries', JSON.stringify(entries));
		popup.close();
		// noinspection JSIgnoredPromiseFromCall
		this.et_menu();
	}

	et_getEntries(context, main, source, endless) {
		const elements = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} .table__remove-default:not(.is-hidden), .esgst-es-page-${endless}.table__remove-default:not(.is-hidden)`
					: `.table__remove-default:not(.is-hidden)`
			}`
		);
		for (let i = 0, n = elements.length; i < n; ++i) {
			this.et_setObserver(elements[i]);
		}
	}

	et_setObserver(element) {
		let code, container, heading, name;
		container = element.closest('.table__row-inner-wrap');
		heading = container.getElementsByClassName('table__column__heading')[0];
		code = heading.getAttribute('href').match(/\/giveaway\/(.+?)\//)[1];
		name = heading.firstChild.textContent.trim().match(/(.+?)(\s\(.+\sCopies\))?$/)[1];
		element.addEventListener('click', this.et_setEntry.bind(this, code, false, name));
	}

	async et_setEntry(code, entry, name) {
		let entries = JSON.parse(getValue('entries', '[]'));
		entries.push({
			code: code,
			entry: entry,
			name: name,
			timestamp: Date.now(),
		});
		setValue('entries', JSON.stringify(entries));
	}
}

const giveawaysEntryTracker = new GiveawaysEntryTracker();

export { giveawaysEntryTracker };
