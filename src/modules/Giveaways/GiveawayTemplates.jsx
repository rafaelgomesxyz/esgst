import { Checkbox } from '../../class/Checkbox';
import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Session } from '../../class/Session';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Button } from '../../components/Button';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	createLock = common.createLock.bind(common),
	getValue = common.getValue.bind(common),
	request = common.request.bind(common),
	setSetting = common.setSetting.bind(common),
	setValue = common.setValue.bind(common);
class GiveawaysGiveawayTemplates extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a section 9 to the{' '}
						<a href="https://www.steamgifts.com/giveaways/new">new giveaway</a> page that allows you
						to save the details that you have filled (except for the name of the game and the number
						of copies/keys) as a template so that you can reuse it later. For example, if you often
						make public level 5 giveaways that last 2 days, you can save a template with those
						details so that when you create a new giveaway all of the fields in the page are
						automatically filled and all you have to do is select the game and set the number of
						copies/keys.
					</li>
					<li>
						Also adds a button (<i className="fa fa-file"></i>) to the main page heading of the same
						page that allows you manage all of the templates that have been saved and select the
						template that you want to use.
					</li>
				</ul>
			),
			id: 'gts',
			name: 'Giveaway Templates',
			sg: true,
			type: 'giveaways',
		};
	}

	init() {
		if (!this.esgst.newGiveawayPath) return;
		let rows = document.getElementsByClassName('form__rows')[0];
		if (!rows) return;
		this.gts_addButtonSection(
			createHeadingButton({
				id: 'gts',
				icons: ['fa-file'],
				title: 'View/apply templates',
			}),
			rows
		);
	}

	gts_addButtonSection(button, rows) {
		let createGiveawayButton,
			delay,
			endTime,
			message,
			preciseEndCheckbox,
			preciseEndDateCheckbox,
			preciseEndOption,
			preciseEndDateOption,
			preciseStartCheckbox,
			preciseStartDateCheckbox,
			preciseStartOption,
			preciseStartDateOption,
			reviewButton,
			section,
			startTime,
			warning;
		if (!rows) return;
		let gts = {};
		gts.deletedTemplates = [];
		reviewButton = rows.lastElementChild;
		createGiveawayButton = Button.create([
			{
				color: 'green',
				icons: ['fa-plus-circle'],
				name: 'Create Giveaway',
				onClick: async () => {
					const textArea = document.querySelector(`[name="description"]`);
					if (
						Settings.get('ngdc') &&
						(await Shared.esgst.modules.giveawaysNewGiveawayDescriptionChecker.check(
							textArea.value
						))
					) {
						return;
					}
					return new Promise(async (resolve) => {
						let data = `xsrf_token=${Session.xsrfToken}&next_step=3&`;
						data += `game_id=${document.querySelector(`[name="game_id"]`).value}&`;
						data += `type=${document.querySelector(`[name="type"]`).value}&`;
						data += `copies=${document.querySelector(`[name="copies"]`).value}&`;
						data += `key_string=${encodeURIComponent(
							document.querySelector(`[name="key_string"]`).value
						)}&`;
						data += `timezone=${new Date().getTimezoneOffset()}&`;
						data += `start_time=${encodeURIComponent(
							document.querySelector(`[name="start_time"]`).value
						)}&`;
						data += `end_time=${encodeURIComponent(
							document.querySelector(`[name="end_time"]`).value
						)}&`;
						data += `region_restricted=${
							document.querySelector(`[name="region_restricted"]`).value
						}&`;
						data += `country_item_string=${encodeURIComponent(
							document.querySelector(`[name="country_item_string"]`).value.trim()
						)}&`;
						data += `group_item_string=${encodeURIComponent(
							document.querySelector(`[name="group_item_string"]`).value.trim()
						)}&`;
						data += `who_can_enter=${document.querySelector(`[name="who_can_enter"]`).value}&`;
						data += `whitelist=${
							document.querySelector(`.form__row--who-can-enter [name="whitelist"]`).value
						}&`;
						data += `contributor_level=${
							document.querySelector(`[name="contributor_level"]`).value
						}&`;
						data += `description=${encodeURIComponent(textArea.value)}`;
						const response = await request({
							data: data.replace(
								/start_time=(.+?)&/,
								this.esgst.modules.giveawaysMultipleGiveawayCreator.mgc_correctTime.bind(
									this.esgst.modules.giveawaysMultipleGiveawayCreator
								)
							),
							method: 'POST',
							url: '/giveaways/new',
						});
						if (response.finalUrl.match(/\/giveaways\/new/)) {
							resolve();
							const errors = DOM.parse(response.responseText).getElementsByClassName(
								'form__row__error'
							);
							let message = `Unable to create giveaway because of the following errors:\n\n`;
							for (const error of errors) {
								message += `* ${error.textContent.trim()}`;
							}
							window.alert(message);
						} else {
							window.location.href = response.finalUrl;
						}
					});
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Creating...',
			},
		]).insert(rows, 'beforeend');
		button.addEventListener('click', this.gts_openPopup.bind(this, gts));
		section = createElements(reviewButton, 'beforebegin', [
			{
				attributes: {
					class: 'esgst-form-row',
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'esgst-form-heading',
						},
						type: 'div',
						children: [
							{
								attributes: {
									class: 'esgst-form-heading-number',
								},
								text: '9.',
								type: 'div',
							},
							{
								attributes: {
									class: 'esgst-form-heading-text',
								},
								text: 'Template',
								type: 'div',
							},
						],
					},
					{
						attributes: {
							class: 'esgst-gts-section esgst-form-row-indent',
						},
						type: 'div',
						children: [
							{
								type: 'div',
								children: [
									{
										text: 'Use precise start time.',
										type: 'span',
									},
									{
										attributes: {
											class: 'fa fa-question-circle',
											title: `For example, if you picked 12:00 pm for the start date in section 4, when you apply the template the start date will be set to the next 12:00 pm hour, so if you apply the template on January 1 11:00 pm, the start date will be set to January 1 12:00 pm, and if you apply the template on January 1 13:00 pm, the start date will be set to January 2 12:00 pm. The end date will then be set based on the time range that you picked.`,
										},
										type: 'i',
									},
								],
							},
							{
								type: 'div',
								children: [
									{
										text: 'Use precise end time.',
										type: 'span',
									},
									{
										attributes: {
											class: 'fa fa-question-circle',
											title: `For example, if you picked 12:00 pm for the end date and a time range of 2 days in section 4, when you apply the template the end date will be set to the next 12:00 pm hour after 2 days, so if you apply the template on January 1 11:00 pm, the end date will be set to January 3 12:00 pm, and if you apply the template on January 1 13:00 pm, the end date will be set to January 4 12:00 pm. The start date will then be set based on the time range that you picked.`,
										},
										type: 'i',
									},
								],
							},
							{
								type: 'div',
								children: [
									{
										text: 'Use precise start date.',
										type: 'span',
									},
									{
										attributes: {
											class: 'fa fa-question-circle',
											title: `With this option enabled, the template will use the exact start date that you picked in section 4. This is only useful if you are creating multiple giveaways and want all of them to begin at a specific later date, because the template is not reusable after the date has passed.`,
										},
										type: 'i',
									},
								],
							},
							{
								type: 'div',
								children: [
									{
										text: 'Use precise end date.',
										type: 'span',
									},
									{
										attributes: {
											class: 'fa fa-question-circle',
											title: `With this option enabled, the template will use the exact end date that you picked in section 4. This is only useful if you are creating multiple giveaways and want all of them to end at a specific later date, because the template is not reusable after the date has passed.`,
										},
										type: 'i',
									},
								],
							},
							{
								attributes: {
									class: 'esgst-description',
								},
								text: `By not selecting one of the options above, the template will use the time range that you picked in section 4. For example, if the time range that you picked was 2 days, when you apply the template the start date will be set to your current date and the end date will be set to 2 days later.`,
								type: 'div',
							},
							{
								attributes: {
									class: 'form__input-small',
									type: 'text',
								},
								type: 'input',
							},
							{
								attributes: {
									class: 'esgst-description esgst-hidden',
								},
								text: 'Saved!',
								type: 'span',
							},
							{
								attributes: {
									class: 'esgst-hidden form__row__error',
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
										text: ' Please enter a name for the template.',
										type: 'node',
									},
								],
							},
							{
								attributes: {
									class: 'esgst-description',
								},
								text: 'The name of the template.',
								type: 'div',
							},
						],
					},
				],
			},
		]).lastElementChild;
		preciseStartOption = section.firstElementChild;
		preciseEndOption = preciseStartOption.nextElementSibling;
		preciseStartDateOption = preciseEndOption.nextElementSibling;
		preciseEndDateOption = preciseStartDateOption.nextElementSibling;
		gts.input = preciseEndDateOption.nextElementSibling.nextElementSibling;
		message = gts.input.nextElementSibling;
		warning = message.nextElementSibling;
		preciseStartCheckbox = new Checkbox(preciseStartOption, Settings.get('gts_preciseStart'));
		preciseEndCheckbox = new Checkbox(preciseEndOption, Settings.get('gts_preciseEnd'));
		preciseStartDateCheckbox = new Checkbox(
			preciseStartDateOption,
			Settings.get('gts_preciseStartDate')
		);
		preciseEndDateCheckbox = new Checkbox(preciseEndDateOption, Settings.get('gts_preciseEndDate'));
		preciseStartOption.addEventListener('click', () => {
			setSetting('gts_preciseStart', preciseStartCheckbox.input.checked);
		});
		preciseEndOption.addEventListener('click', () => {
			setSetting('gts_preciseEnd', preciseEndCheckbox.input.checked);
		});
		preciseStartDateOption.addEventListener('click', () => {
			setSetting('gts_preciseStartDate', preciseStartDateCheckbox.input.checked);
		});
		preciseEndDateOption.addEventListener('click', () => {
			setSetting('gts_preciseEndDate', preciseEndDateCheckbox.input.checked);
		});
		Button.create([
			{
				template: 'success',
				name: 'Save Template',
				onClick: async () => {
					let i, n, template, savedTemplates, startDate, endDate;
					if (gts.input.value) {
						warning.classList.add('esgst-hidden');
						startDate = new Date(document.querySelector(`[name="start_time"]`).value);
						startTime = startDate.getTime();
						endDate = new Date(document.querySelector(`[name="end_time"]`).value);
						endTime = endDate.getTime();
						delay = startTime - Date.now();
						if (delay < 0) {
							delay = 0;
						}
						template = {
							countries: document.querySelector(`[name="country_item_string"]`).value.trim(),
							delay: delay,
							description: document.querySelector(`[name="description"]`).value,
							duration: endTime - startTime,
							gameType: document.querySelector(`[name="type"]`).value,
							groups: document.querySelector(`[name="group_item_string"]`).value.trim(),
							level: document.querySelector(`[name="contributor_level"]`).value,
							name: gts.input.value,
							region: document.querySelector(`[name="region_restricted"]`).value,
							whoCanEnter: document.querySelector(`[name="who_can_enter"]`).value,
							whitelist: document.querySelector(`.form__row--who-can-enter [name="whitelist"]`)
								.value,
							createTrain: Settings.get('mgc_createTrain'),
							removeLinks: Settings.get('mgc_removeLinks'),
							startTime: undefined,
							endTime: undefined,
							startDate: undefined,
							endDate: undefined,
						};
						if (preciseStartCheckbox.input.checked) {
							template.startTime = startTime;
						}
						if (preciseEndCheckbox.input.checked) {
							template.endTime = endTime;
						}
						if (preciseStartDateCheckbox.input.checked) {
							template.startDate = {
								day: startDate.getDate(),
								month: startDate.getMonth(),
								year: startDate.getFullYear(),
							};
						}
						if (preciseEndDateCheckbox.input.checked) {
							template.endDate = {
								day: endDate.getDate(),
								month: endDate.getMonth(),
								year: endDate.getFullYear(),
							};
						}
						let deleteLock = await createLock('templateLock', 300);
						savedTemplates = JSON.parse(getValue('templates', '[]'));
						for (
							i = 0, n = savedTemplates.length;
							i < n && savedTemplates[i].name !== template.name;
							++i
						) {}
						if (i < n) {
							if (gts.edit) {
								savedTemplates[i] = template;
								message.classList.remove('esgst-hidden');
								window.setTimeout(() => {
									message.classList.add('esgst-hidden');
								}, 2000);
							} else if (
								window.confirm(
									'There already exists a template with this name. Do you want to overwrite it?'
								)
							) {
								savedTemplates[i] = template;
								message.classList.remove('esgst-hidden');
								window.setTimeout(() => {
									message.classList.add('esgst-hidden');
								}, 2000);
							}
						} else {
							savedTemplates.push(template);
							message.classList.remove('esgst-hidden');
							window.setTimeout(() => {
								message.classList.add('esgst-hidden');
							}, 2000);
						}
						await setValue('templates', JSON.stringify(savedTemplates));
						deleteLock();
					} else {
						warning.classList.remove('esgst-hidden');
					}
				},
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Saving...',
			},
		]).insert(section, 'beforeend');
		rows.insertBefore(createGiveawayButton.nodes.outer, rows.firstElementChild);
		rows.insertBefore(reviewButton, rows.firstElementChild);
		createGiveawayButton.nodes.outer.style.display = 'inline-block';
		createGiveawayButton.nodes.outer.style.margin = '20px 5px';
		reviewButton.style.margin = '20px 0';
		let first, last;
		first = true;
		last = false;
		window.addEventListener('scroll', () => {
			if (window.scrollY < 138) {
				if (!first) {
					rows.insertBefore(createGiveawayButton.nodes.outer, rows.firstElementChild);
					rows.insertBefore(reviewButton, rows.firstElementChild);
					createGiveawayButton.nodes.outer.style.margin = '20px 5px';
					reviewButton.style.margin = '20px 0';
					first = true;
					last = false;
				}
			} else if (!last) {
				rows.appendChild(reviewButton);
				rows.appendChild(createGiveawayButton.nodes.outer);
				reviewButton.style.margin = '';
				createGiveawayButton.nodes.outer.style.margin = '0 5px';
				last = true;
				first = false;
			}
		});
	}

	async gts_openPopup(gts) {
		let popup = new Popup({
			addScrollable: true,
			icon: 'fa-file',
			isTemp: true,
			title: `View/apply templates:`,
		});
		createElements(popup.description, 'afterbegin', [
			{
				attributes: {
					class: 'esgst-description',
				},
				text: 'Drag and drop templates to move them.',
				type: 'div',
			},
		]);
		gts.undo = createElements(popup.description, 'beforeend', [
			{
				attributes: {
					class: 'esgst-clickable esgst-hidden',
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-rotate-left',
						},
						type: 'i',
					},
					{
						text: 'Undo Delete',
						type: 'span',
					},
				],
			},
		]);
		gts.undo.addEventListener('click', this.gts_undoDelete.bind(this, gts));
		let templates = createElements(popup.scrollable, 'beforeend', [
			{
				attributes: {
					class: 'esgst-text-left popup__keys__list',
				},
				type: 'div',
			},
		]);
		let savedTemplates = JSON.parse(getValue('templates', '[]'));
		for (let i = 0, n = savedTemplates.length; i < n; ++i) {
			let savedTemplate = savedTemplates[i];
			if (!savedTemplate.gameType) {
				savedTemplate.gameType = 'gift';
			}
			if (!savedTemplate.whoCanEnter) {
				savedTemplate.whoCanEnter = savedTemplate.type;
			}
			let details = `${savedTemplate.gameType}, `;
			if (savedTemplate.startTime || savedTemplate.endTime) {
				if (savedTemplate.startTime) {
					let time = new Date(savedTemplate.startTime);
					if (savedTemplate.startDate) {
						details += `${savedTemplate.startDate.year}-${savedTemplate.startDate.month + 1}-${
							savedTemplate.startDate.day
						} `;
					}
					details += `${`0${time.getHours()}`.slice(-2)}:${`0${time.getMinutes()}`.slice(-2)} to`;
				} else {
					details += '? to';
				}
				if (savedTemplate.endTime) {
					let time = new Date(savedTemplate.endTime);
					if (savedTemplate.endDate) {
						details += ` ${savedTemplate.endDate.year}-${savedTemplate.endDate.month + 1}-${
							savedTemplate.endDate.day
						}`;
					}
					details += ` ${`0${time.getHours()}`.slice(-2)}:${`0${time.getMinutes()}`.slice(-2)}`;
				} else {
					details += ' ?';
				}
				details += `, `;
			} else if (savedTemplate.startDate || savedTemplate.endDate) {
				if (savedTemplate.startDate) {
					details += `${savedTemplate.startDate.year}-${savedTemplate.startDate.month + 1}-${
						savedTemplate.startDate.day
					} to`;
				} else {
					details += '? to';
				}
				if (savedTemplate.endDate) {
					details += ` ${savedTemplate.endDate.year}-${savedTemplate.endDate.month + 1}-${
						savedTemplate.endDate.day
					}`;
				} else {
					details = ' ?';
				}
				details += `, `;
			}
			let hours = Math.floor(savedTemplate.duration / 3600000);
			if (hours > 23) {
				let days = Math.floor(hours / 24);
				if (days > 6) {
					let weeks = Math.floor(days / 7);
					if (weeks === 1) {
						details += '1 week';
					} else {
						details += `${weeks} weeks`;
					}
				} else if (days === 1) {
					details += '1 day';
				} else {
					details += `${days} days`;
				}
			} else if (hours === 1) {
				details += '1 hour';
			} else {
				details += `${hours} hours`;
			}
			if (savedTemplate.region !== '0') {
				details += `, region restricted`;
			}
			if (savedTemplate.whoCanEnter === 'everyone') {
				details += `, public`;
			} else if (savedTemplate.whoCanEnter === 'invite_only') {
				details += `, invite only`;
			} else {
				if (savedTemplate.whitelist === '1') {
					details += `, whitelist`;
				}
				if (savedTemplate.groups.trim()) {
					details += `, groups`;
				}
			}
			details += `, level ${savedTemplate.level}`;
			let template = createElements(templates, 'beforeend', [
				{
					attributes: {
						draggable: true,
					},
					type: 'div',
					children: [
						{
							attributes: {
								class: 'esgst-clickable',
								style: `float: left;`,
							},
							type: 'div',
							children: [
								{
									attributes: {
										class: 'esgst-bold',
									},
									text: savedTemplate.name,
									type: 'span',
								},
							],
						},
						{
							attributes: {
								class: 'esgst-clickable',
								style: `float: right;`,
							},
							type: 'div',
							children: [
								{
									attributes: {
										class: 'fa fa-trash',
										title: 'Delete template',
									},
									type: 'i',
								},
							],
						},
						{
							attributes: {
								style: `clear: both;`,
							},
							type: 'div',
						},
						{
							attributes: {
								class: 'esgst-description',
							},
							text: details,
							type: 'div',
						},
					],
				},
			]);
			template.addEventListener(
				'dragstart',
				this.gts_setSource.bind(this, gts, savedTemplate.name, template)
			);
			template.addEventListener(
				'dragenter',
				this.gts_getSource.bind(this, gts, template, templates)
			);
			template.addEventListener('dragend', this.gts_saveSource.bind(this, gts));
			this.gts_setTemplate(gts, popup, template, savedTemplate);
		}
		popup.open();
	}

	gts_setTemplate(gts, popup, template, savedTemplate) {
		let applyButton = template.firstElementChild,
			deleteButton = applyButton.nextElementSibling;
		applyButton.addEventListener('click', () => {
			this.gts_applyTemplate(savedTemplate);
			gts.input.value = savedTemplate.name;
			gts.edit = true;
			popup.close();
		});
		deleteButton.addEventListener('click', async () => {
			createElements(deleteButton, 'atinner', [
				{
					attributes: {
						class: 'fa fa-circle-o-notch fa-spin',
					},
					type: 'i',
				},
			]);
			let deleteLock = await createLock('templateLock', 300),
				savedTemplates = JSON.parse(getValue('templates', '[]')),
				i = 0;
			for (
				const n = savedTemplates.length;
				i < n && savedTemplates[i].name !== savedTemplate.name;
				++i
			) {}
			savedTemplates.splice(i, 1);
			await setValue('templates', JSON.stringify(savedTemplates));
			deleteLock();
			createElements(deleteButton, 'atinner', [
				{
					attributes: {
						class: 'fa fa-trash',
					},
					type: 'i',
				},
			]);
			template.classList.add('esgst-hidden');
			gts.deletedTemplates.push({
				template: template,
				savedTemplate: savedTemplate,
			});
			gts.undo.classList.remove('esgst-hidden');
			gts.edit = false;
		});
	}

	async gts_undoDelete(gts) {
		let deletedTemplate = gts.deletedTemplates.pop();
		deletedTemplate.template.classList.remove('esgst-hidden');
		deletedTemplate.template.parentElement.appendChild(deletedTemplate.template);
		let savedTemplates = JSON.parse(getValue('templates', '[]'));
		savedTemplates.push(deletedTemplate.savedTemplate);
		await setValue('templates', JSON.stringify(savedTemplates));
		if (gts.deletedTemplates.length === 0) {
			gts.undo.classList.add('esgst-hidden');
		}
	}

	gts_applyTemplate(savedTemplate) {
		let context,
			countries,
			currentDate,
			days,
			endTime,
			groups,
			i,
			id,
			j,
			matches,
			newEndTime,
			newStartTime,
			startTime,
			selected;
		if (!savedTemplate.gameType) {
			savedTemplate.gameType = 'gift';
		}
		if (!savedTemplate.whoCanEnter) {
			savedTemplate.whoCanEnter = savedTemplate.type;
		}
		currentDate = new Date();
		this.clickCheckbox(savedTemplate.gameType);
		if (savedTemplate.edit) {
			common.setDatePickerDate('start_time', new Date(savedTemplate.startTime));
			common.setDatePickerDate('end_time', new Date(savedTemplate.endTime));
		} else {
			if (savedTemplate.startTime && savedTemplate.endTime) {
				startTime = new Date(savedTemplate.startTime);
				newStartTime = new Date(currentDate.getTime());
				newStartTime.setHours(
					startTime.getHours(),
					startTime.getMinutes(),
					startTime.getSeconds(),
					startTime.getMilliseconds()
				);
				if (newStartTime.getTime() < currentDate.getTime()) {
					newStartTime.setDate(newStartTime.getDate() + 1);
				}
				endTime = new Date(savedTemplate.endTime);
				newEndTime = new Date(newStartTime.getTime());
				if (endTime.getMonth() !== startTime.getMonth()) {
					days =
						new Date(startTime.getFullYear(), startTime.getMonth() + 1, 0).getDate() -
						newStartTime.getDate() +
						endTime.getDate();
				} else {
					days = endTime.getDate() - startTime.getDate();
				}
				newEndTime.setDate(newStartTime.getDate() + days);
				newEndTime.setHours(
					endTime.getHours(),
					endTime.getMinutes(),
					endTime.getSeconds(),
					endTime.getMilliseconds()
				);
				common.setDatePickerDate('start_time', newStartTime);
				common.setDatePickerDate('end_time', newEndTime);
			} else if (savedTemplate.startTime) {
				startTime = new Date(savedTemplate.startTime);
				newStartTime = new Date(currentDate.getTime());
				newStartTime.setHours(
					startTime.getHours(),
					startTime.getMinutes(),
					startTime.getSeconds(),
					startTime.getMilliseconds()
				);
				if (newStartTime.getTime() < currentDate.getTime()) {
					newStartTime.setDate(newStartTime.getDate() + 1);
				}
				newEndTime = new Date(newStartTime.getTime() + savedTemplate.duration);
				common.setDatePickerDate('start_time', newStartTime);
				common.setDatePickerDate('end_time', newEndTime);
			} else if (savedTemplate.endTime) {
				endTime = new Date(savedTemplate.endTime);
				newStartTime = new Date(currentDate.getTime() + savedTemplate.delay);
				newEndTime = new Date(newStartTime.getTime() + savedTemplate.duration);
				newEndTime.setHours(
					endTime.getHours(),
					endTime.getMinutes(),
					endTime.getSeconds(),
					endTime.getMilliseconds()
				);
				if (newEndTime.getTime() < newStartTime.getTime()) {
					newEndTime.setDate(newEndTime.getDate() + 1);
				}
				common.setDatePickerDate('start_time', newStartTime);
				common.setDatePickerDate('end_time', newEndTime);
			} else {
				newStartTime = new Date(currentDate.getTime() + savedTemplate.delay);
				newEndTime = new Date(currentDate.getTime() + savedTemplate.delay + savedTemplate.duration);
				common.setDatePickerDate('start_time', newStartTime);
				common.setDatePickerDate('end_time', newEndTime);
			}
			if (savedTemplate.startDate) {
				newStartTime.setFullYear(savedTemplate.startDate.year);
				newStartTime.setMonth(savedTemplate.startDate.month);
				newStartTime.setDate(savedTemplate.startDate.day);
				common.setDatePickerDate('start_time', newStartTime);
			}
			if (savedTemplate.endDate) {
				newEndTime.setFullYear(savedTemplate.endDate.year);
				newEndTime.setMonth(savedTemplate.endDate.month);
				newEndTime.setDate(savedTemplate.endDate.day);
				common.setDatePickerDate('end_time', newEndTime);
			}
		}
		if (!savedTemplate.region.match(/^[10]$/)) {
			savedTemplate.region = '0';
		}
		this.clickCheckbox(savedTemplate.region);
		if (savedTemplate.countries) {
			matches = document.querySelector(`.form_list[data-input="country_item_string"]`).children;
			countries = savedTemplate.countries.trim().split(/\s/);
			for (i = matches.length - 1; i > 0; --i) {
				context = matches[i];
				id = context.getAttribute('data-item-id');
				selected = context.classList.contains('is-selected');
				j = countries.indexOf(id);
				if ((selected && j < 0) || (!selected && j >= 0)) {
					context.click();
				}
			}
		}
		this.clickCheckbox(savedTemplate.whoCanEnter);
		if (savedTemplate.gameName) {
			document.getElementsByClassName('js__autocomplete-name')[0].value = savedTemplate.gameName;
		}
		if (savedTemplate.gameId) {
			document.querySelector(`[name="game_id"]`).value = savedTemplate.gameId;
		}
		if (savedTemplate.keys) {
			document.querySelector(`[name="key_string"]`).value = savedTemplate.keys;
		} else if (savedTemplate.copies) {
			document.querySelector(`[name="copies"]`).value = savedTemplate.copies;
		}
		if (savedTemplate.whoCanEnter === 'groups') {
			matches = document.querySelector(`.form_list[data-input="group_item_string"]`).children;
			context = matches[0];
			if (
				(savedTemplate.whitelist === '1' && !context.classList.contains('is-selected')) ||
				(savedTemplate.whitelist !== '1' && context.classList.contains('is-selected'))
			) {
				context.click();
			}
			if (savedTemplate.groups) {
				groups = savedTemplate.groups.trim().split(/\s/);
				for (i = matches.length - 1; i > 0; --i) {
					context = matches[i];
					id = context.getAttribute('data-item-id');
					selected = context.classList.contains('is-selected');
					j = groups.indexOf(id);
					if ((selected && j < 0) || (!selected && j >= 0)) {
						context.click();
					}
				}
			} else {
				for (i = matches.length - 1; i > 0; --i) {
					context = matches[i];
					if (context.classList.contains('is-selected')) {
						context.click();
					}
				}
			}
		}
		if (savedTemplate.level > 0) {
			document.getElementsByClassName('ui-slider-range')[0].style.width = `${
				savedTemplate.level * 10
			}%`;
			document.getElementsByClassName(
				'form__level'
			)[0].textContent = `level ${savedTemplate.level}`;
			document
				.getElementsByClassName('form__input-description--no-level')[0]
				.classList.add('is-hidden');
			document
				.getElementsByClassName('form__input-description--level')[0]
				.classList.remove('is-hidden');
		} else {
			document.getElementsByClassName('ui-slider-range')[0].style.width = '0%';
			document
				.getElementsByClassName('form__input-description--level')[0]
				.classList.add('is-hidden');
			document
				.getElementsByClassName('form__input-description--no-level')[0]
				.classList.remove('is-hidden');
		}
		document.getElementsByClassName('ui-slider-handle')[0].style.left = `${
			savedTemplate.level * 10
		}%`;
		document.querySelector(`[name="contributor_level"]`).value = savedTemplate.level;
		document.querySelector(`[name="description"]`).value = savedTemplate.description;
		if (this.esgst.mgc_createTrainSwitch) {
			if (savedTemplate.createTrain) {
				this.esgst.mgc_createTrainSwitch.enable();
			} else {
				this.esgst.mgc_createTrainSwitch.disable();
			}
		}
		if (this.esgst.mgc_removeLinksSwitch) {
			if (savedTemplate.removeLinks) {
				this.esgst.mgc_removeLinksSwitch.enable();
			} else {
				this.esgst.mgc_removeLinksSwitch.disable();
			}
		}
	}

	async gts_setSource(gts, name, template, event) {
		let i, n, savedTemplates;
		event.dataTransfer.setData('text/plain', '');
		gts.source = template;
		savedTemplates = JSON.parse(getValue('templates', '[]'));
		for (i = 0, n = savedTemplates.length; i < n && savedTemplates[i].name !== name; ++i) {}
		if (i < n) {
			gts.sourceIndex = i;
		}
	}

	gts_getSource(gts, template, templates) {
		let current, i;
		current = gts.source;
		i = 0;
		do {
			current = current.previousElementSibling;
			if (current && current === template) {
				gts.sourceNewIndex = i;
				templates.insertBefore(gts.source, template);
				return;
			}
			++i;
		} while (current);
		gts.sourceNewIndex = i - 1;
		templates.insertBefore(gts.source, template.nextElementSibling);
	}

	async gts_saveSource(gts) {
		let savedTemplates = JSON.parse(getValue('templates', '[]'));
		savedTemplates.splice(gts.sourceNewIndex, 0, savedTemplates.splice(gts.sourceIndex, 1)[0]);
		setValue('templates', JSON.stringify(savedTemplates));
	}

	clickCheckbox(value) {
		if (value === null) {
			return;
		}
		let checkbox = document.querySelector(`[data-checkbox-value="${value}"]`);
		if (checkbox) {
			checkbox.click();
		}
	}
}

const giveawaysGiveawayTemplates = new GiveawaysGiveawayTemplates();

export { giveawaysGiveawayTemplates };
