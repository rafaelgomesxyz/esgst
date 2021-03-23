import { DOM } from '../../class/DOM';
import { EventDispatcher } from '../../class/EventDispatcher';
import { FetchRequest } from '../../class/FetchRequest';
import { LocalStorage } from '../../class/LocalStorage';
import { Logger } from '../../class/Logger';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Scope } from '../../class/Scope';
import { Session } from '../../class/Session';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Button } from '../../components/Button';
import { PageHeading } from '../../components/PageHeading';
import { Events } from '../../constants/Events';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	getValue = common.getValue.bind(common),
	setSetting = common.setSetting.bind(common);
class GiveawaysEnterLeaveGiveawayButton extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button ("<i className="fa fa-plus-circle"></i> Enter" to enter and "
						<i className="fa fa-minus-circle"></i> Leave" to leave) below a giveaway's start time
						(in any page) that allows you to enter/leave the giveaway without having to access it.
					</li>
					<li>You can move the button around by dragging and dropping it.</li>
				</ul>
			),
			features: {
				elgb_b: {
					dependencies: ['gb'],
					name:
						'Automatically bookmark giveaways when trying to enter them without enough points .',
					sg: true,
				},
				elgb_c: {
					name:
						'Cache repeated descriptions from the same creator for 1 hour and only show them once.',
					sg: true,
				},
				elgb_f: {
					inputItems: [
						{
							id: 'elgb_filters',
							prefix: `Filters: `,
							title: `Enter only lowercase letters with no spaces and separate filters with '|'.\n\nFor example, if you want to filter out 'Good luck! No need to thank, unless you're the winner.', use the filter 'goodlucknoneedtothankunlessyourethewinner'.\n\nIf you're familiar with regular expressions, you can also use them. For example, to include a variation of the description above that uses 'you are' instead of 'you're' you could use the filter 'goodlucknoneedtothankunlessyoua?rethewinner'. 'a?' will match or not an 'a' between 'you' and 're'.\n\nThe '.' filter, for example, filters out any descriptions that only have one letter. Generic filters such as '.*' and '.+' will be ignored when applying the filters.`,
						},
					],
					name: 'Filter descriptions.',
					sg: true,
				},
				elgb_p: {
					description: () => (
						<ul>
							<li>
								Only shows the button in popups(<span data-esgst-feature-id="gb"></span>,{' '}
								<span data-esgst-feature-id="ged"></span>, <span data-esgst-feature-id="ge"></span>,
								etc...), so basically only for any giveaways that are loaded dynamically by ESGST.
							</li>
						</ul>
					),
					name: 'Only enable for popups.',
					sg: true,
				},
				elgb_r: {
					features: {
						elgb_r_d: {
							name: 'Only pop up if the giveaway has a description.',
							sg: true,
						},
					},
					name: 'Pop up a box to reply to the giveaway when entering it.',
					sg: true,
				},
				elgb_fp: {
					name: `Pop up the first page of comments of the giveaway when entering it, if it has any comments.`,
					sg: true,
				},
			},
			id: 'elgb',
			name: 'Enter / Leave Giveaway Button',
			sg: true,
			type: 'giveaways',
			featureMap: {
				giveaway: this.elgb_addButtons.bind(this),
			},
		};
	}

	init() {
		EventDispatcher.subscribe(Events.POINTS_UPDATED, this.elgb_updateButtons.bind(this));
	}

	async elgb_addButtons(giveaways, main, source) {
		giveaways.forEach((giveaway) => {
			if (
				giveaway.sgTools ||
				(main && (Settings.get('elgb_p') || this.esgst.createdPath || this.esgst.wonPath))
			)
				return;
			if (giveaway.innerWrap.getElementsByClassName('esgst-elgb-button')[0]) {
				return;
			}
			if (this.esgst.enteredPath && main) {
				this.elgb_setEntryButton(giveaway);
				return;
			}
			if (
				giveaway.blacklist ||
				(giveaway.inviteOnly && !giveaway.url) ||
				!giveaway.started ||
				giveaway.ended ||
				giveaway.created ||
				giveaway.level > Session.counters.level.base ||
				(giveaway.id &&
					this.esgst.games[giveaway.type][giveaway.id] &&
					(this.esgst.games[giveaway.type][giveaway.id].owned ||
						this.esgst.games[giveaway.type][giveaway.id].won ||
						(this.esgst.games[giveaway.type][giveaway.id].hidden && Settings.get('hgebd'))))
			) {
				return;
			}
			if (this.esgst.giveawayPath && main) {
				let sidebarButton = document.getElementsByClassName('sidebar__error is-disabled')[0];
				if (!sidebarButton || sidebarButton.textContent.trim() !== 'Not Enough Points') {
					return;
				}
				giveaway.elgbPanel = createElements(sidebarButton.parentElement, 'afterbegin', [
					{
						type: 'div',
					},
				]);
				sidebarButton.remove();
				this.elgb_addButton(giveaway, main, source);
			} else {
				this.elgb_addButton(giveaway, main, source);
			}
		});
	}

	elgb_setEntryButton(giveaway) {
		let button = giveaway.outerWrap.getElementsByClassName('table__remove-default')[0];
		if (!button) return;
		let form = button.parentElement;
		let errorButton = createElements(form.parentElement, 'beforeend', [
			{
				attributes: {
					class: 'esgst-clickable esgst-hidden',
					title: getFeatureTooltip('elgb'),
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-plus-circle esgst-green',
						},
						type: 'i',
					},
					{
						attributes: {
							class: 'table__column__secondary-link',
						},
						text: 'Add',
						type: 'span',
					},
				],
			},
			{
				attributes: {
					class: 'esgst-clickable',
					title: getFeatureTooltip('elgb'),
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-times-circle esgst-red',
						},
						type: 'i',
					},
					{
						attributes: {
							class: 'table__column__secondary-link',
						},
						text: 'Remove',
						type: 'span',
					},
				],
			},
			{
				attributes: {
					class: 'esgst-hidden',
					title: getFeatureTooltip('elgb'),
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-refresh fa-spin',
						},
						type: 'i',
					},
					{
						text: 'Adding...',
						type: 'span',
					},
				],
			},
			{
				attributes: {
					class: 'esgst-hidden',
					title: getFeatureTooltip('elgb'),
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-refresh fa-spin',
						},
						type: 'i',
					},
					{
						text: 'Removing...',
						type: 'span',
					},
				],
			},
			{
				attributes: {
					class: 'esgst-hidden',
					title: getFeatureTooltip('elgb'),
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'fa fa-exclamation esgst-red',
						},
						type: 'i',
					},
					{
						text: 'Error',
						type: 'span',
					},
				],
			},
		]);
		let removingButton = errorButton.previousElementSibling;
		let addingButton = removingButton.previousElementSibling;
		let removeButton = addingButton.previousElementSibling;
		let addButton = removeButton.previousElementSibling;
		addButton.addEventListener(
			'click',
			this.elgb_addEntry.bind(this, addButton, addingButton, errorButton, giveaway, removeButton)
		);
		removeButton.addEventListener(
			'click',
			this.elgb_removeEntry.bind(
				this,
				addButton,
				errorButton,
				giveaway,
				removeButton,
				removingButton
			)
		);
		form.remove();
	}

	async elgb_addEntry(addButton, addingButton, errorButton, giveaway, removeButton) {
		addButton.classList.add('esgst-hidden');
		addingButton.classList.remove('esgst-hidden');
		try {
			let responseJson = (
				await FetchRequest.post('/ajax.php', {
					data: `xsrf_token=${Session.xsrfToken}&do=entry_insert&code=${giveaway.code}`,
					doNotQueue: true,
				})
			).json;
			if (responseJson.type === 'success') {
				removeButton.classList.remove('esgst-hidden');
			} else {
				if (
					Settings.get('elgb_b') &&
					Settings.get('gb') &&
					giveaway.gbButton &&
					giveaway.gbButton.index === 1
				) {
					// noinspection JSIgnoredPromiseFromCall
					giveaway.gbButton.change(giveaway.gbButton.callbacks[0]);
				}
				errorButton.classList.remove('esgst-hidden');
			}
			await Shared.header.updatePoints(responseJson.points);
		} catch (e) {
			errorButton.classList.remove('esgst-hidden');
		}
		addingButton.classList.add('esgst-hidden');
		if (Settings.get('et')) {
			// noinspection JSIgnoredPromiseFromCall
			this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, true, giveaway.name);
		}
	}

	async elgb_removeEntry(addButton, errorButton, giveaway, removeButton, removingButton) {
		removeButton.classList.add('esgst-hidden');
		removingButton.classList.remove('esgst-hidden');
		try {
			let responseJson = (
				await FetchRequest.post('/ajax.php', {
					data: `xsrf_token=${Session.xsrfToken}&do=entry_delete&code=${giveaway.code}`,
					doNotQueue: true,
				})
			).json;
			if (responseJson.type === 'success') {
				addButton.classList.remove('esgst-hidden');
			} else {
				errorButton.classList.remove('esgst-hidden');
			}
			await Shared.header.updatePoints(responseJson.points);
		} catch (e) {
			errorButton.classList.remove('esgst-hidden');
		}
		removingButton.classList.add('esgst-hidden');
		if (Settings.get('et')) {
			// noinspection JSIgnoredPromiseFromCall
			this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, false, giveaway.name);
		}
	}

	elgb_addButton(giveaway, main, source) {
		if (!giveaway.elgbButton) {
			giveaway.elgbButton = Button.create({
				additionalContainerClass: 'esgst-elgb-button',
				states: [
					{
						color: 'green',
						icons: ['fa-plus-circle'],
						name: 'Enter',
						onClick: () => {
							return new Promise((resolve) =>
								this.elgb_enterGiveaway(giveaway, main, null, source, resolve)
							);
						},
					},
					{
						template: 'loading',
						isDisabled: true,
						name: 'Entering...',
					},
					{
						color: 'yellow',
						icons: ['fa-minus-circle'],
						name: 'Leave',
						switchTo: { onReturn: 1 },
						onClick: () => {
							return new Promise((resolve) =>
								this.elgb_leaveGiveaway(giveaway, main, source, resolve)
							);
						},
					},
					{
						template: 'loading',
						isDisabled: true,
						name: 'Leaving...',
					},
					{
						color: 'red',
						icons: ['fa-plus-circle'],
						name: 'Enter',
						switchTo: { onClick: 2 },
						onClick: () => {
							return new Promise((resolve) =>
								this.elgb_enterGiveaway(giveaway, main, null, source, resolve)
							);
						},
					},
				],
			});
			if (
				Settings.get('gv') &&
				((main && this.esgst.giveawaysPath) ||
					(source === 'gb' && Settings.get('gv_gb')) ||
					(source === 'ged' && Settings.get('gv_ged')) ||
					(source === 'ge' && Settings.get('gv_ge')))
			) {
				giveaway.elgbButton.insert(giveaway.elgbPanel, 'afterbegin');
			} else {
				giveaway.elgbButton.insert(giveaway.elgbPanel, 'beforeend');
			}
			giveaway.elgbButton.nodes.outer.setAttribute('data-draggable-id', 'elgb');
		}
		const style = giveaway.elgbButton.nodes.outer.getAttribute('style');
		if (giveaway.entered) {
			giveaway.elgbButton.build(3);
			giveaway.elgbButton.setTooltip('');
		} else if (giveaway.error) {
			giveaway.elgbButton.build(5);
			giveaway.elgbButton.setTooltip(giveaway.error);
		} else {
			if (giveaway.points <= Session.counters.points) {
				giveaway.elgbButton.build(1);
				giveaway.elgbButton.setTooltip('');
			} else {
				giveaway.elgbButton.build(5);
				giveaway.elgbButton.setTooltip('Not Enough Points');
			}
		}
		giveaway.elgbButton.nodes.outer.setAttribute('style', style);
	}

	async elgb_openPopup(giveaway, main, source, mainCallback) {
		let headingButton;
		let popup = new Popup({
			addScrollable: true,
			isTemp: true,
			name: 'elgb',
		});
		const heading = PageHeading.create('elgb', [
			{
				name: giveaway.creator,
				url: `/user/${giveaway.creator}`,
			},
			{
				name: giveaway.name,
				url: giveaway.url,
			},
		]).insert(popup.description, 'afterbegin');
		const scope = Scope.find(popup.id);
		if (scope) {
			scope.sourceLink = heading.nodes.breadcrumbs[1];
		}
		if ((Settings.get('cf') && Settings.get('cf_m')) || Settings.get('mm')) {
			if (Settings.get('cf') && Settings.get('cf_m')) {
				heading.nodes.outer.appendChild(
					this.esgst.modules.commentsCommentFilters.filters_addContainer(
						heading.nodes.outer,
						'Elgb'
					)
				);
			}
			if (Settings.get('mm')) {
				this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
			}
		}
		if (giveaway.entered) {
			Button.create([
				{
					color: 'yellow',
					icons: ['fa-minus-circle'],
					name: 'Leave Giveaway',
					onClick: () => {
						return new Promise((resolve) => {
							// noinspection JSIgnoredPromiseFromCall
							this.elgb_leaveGiveaway(giveaway, main, source, () => {
								resolve();
								popup.close();
							});
						});
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Leaving...',
				},
			]).insert(heading.nodes.outer, 'beforeend');
		} else {
			let games = JSON.parse(getValue('games'));
			if (
				giveaway.started &&
				!giveaway.ended &&
				!giveaway.created &&
				giveaway.level <= Session.counters.level.base &&
				((giveaway.id &&
					((games[giveaway.type][giveaway.id] &&
						!games[giveaway.type][giveaway.id].owned &&
						(!games[giveaway.type][giveaway.id].hidden || !Settings.get('hgebd'))) ||
						!games[giveaway.type][giveaway.id])) ||
					!giveaway.id)
			) {
				Button.create([
					{
						color: 'green',
						icons: ['fa-plus-circle'],
						name: 'Enter Giveaway',
						onClick: () => {
							return new Promise((resolve) => {
								// noinspection JSIgnoredPromiseFromCall
								this.elgb_enterGiveaway(giveaway, main, true, source, () => {
									resolve();
									popup.close();
								});
							});
						},
					},
					{
						template: 'loading',
						isDisabled: true,
						name: 'Entering...',
					},
				]).insert(heading.nodes.outer, 'beforeend');
			}
		}
		let description = null;
		let responseHtml = null;
		responseHtml = (await FetchRequest.get(giveaway.url, { doNotQueue: true })).html;
		if (mainCallback && !responseHtml.getElementsByClassName('featured__outer-wrap--giveaway')[0]) {
			mainCallback(true);
			return;
		}
		description = responseHtml.getElementsByClassName('page__description')[0];
		if (description && description.textContent.trim() && !mainCallback) {
			if (Settings.get('elgb_c')) {
				if (Date.now() - this.esgst.elgbCache.timestamp > 3600000) {
					this.esgst.elgbCache = {
						descriptions: {},
						timestamp: Date.now(),
					};
					LocalStorage.set('elgbCache', JSON.stringify(this.esgst.elgbCache));
				}
				if (!this.esgst.elgbCache.descriptions[giveaway.creator]) {
					this.esgst.elgbCache.descriptions[giveaway.creator] = [];
				}
				let html = description.innerHTML;
				let i;
				for (
					i = this.esgst.elgbCache.descriptions[giveaway.creator].length - 1;
					i > -1 && this.esgst.elgbCache.descriptions[giveaway.creator][i] !== html;
					--i
				) {}
				if (i > -1) {
					description = null;
				} else {
					this.esgst.elgbCache.descriptions[giveaway.creator].push(html);
					LocalStorage.set('elgbCache', JSON.stringify(this.esgst.elgbCache));
					if (Settings.get('elgb_f')) {
						let text = description.textContent.replace(/[^a-zA-Z]/g, '').toLowerCase();
						if (
							text.match(new RegExp(`^(${this.processFilters(Settings.get('elgb_filters'))})$`))
						) {
							description = null;
						}
					}
				}
			} else if (Settings.get('elgb_f')) {
				let text = description.textContent.replace(/[^a-zA-Z]/g, '').toLowerCase();
				if (text.match(new RegExp(`^(${this.processFilters(Settings.get('elgb_filters'))})$`))) {
					description = null;
				}
			}
		}
		if (description) {
			description.classList.add('esgst-text-left');
			createElements(popup.scrollable, 'beforeend', [
				{
					context: description,
				},
			]);
		}
		let box = null;
		if ((Settings.get('elgb_r') && (!Settings.get('elgb_r_d') || description)) || mainCallback) {
			box = createElements(popup.scrollable, 'beforeend', [
				{
					type: 'textarea',
				},
			]);
			if (Settings.get('cfh')) {
				this.esgst.modules.commentsCommentFormattingHelper.cfh_addPanel(box);
			}
			Button.create([
				{
					color: 'green',
					icons: ['fa-arrow-circle-right'],
					name: 'Add Comment',
					onClick: async () => {
						if (box.value) {
							await FetchRequest.post(giveaway.url, {
								data: `xsrf_token=${Session.xsrfToken}&do=comment_new&description=${box.value}`,
							});
						}
						popup.close();
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Saving...',
				},
			]).insert(popup.scrollable, 'beforeend');
		}
		if (description && Settings.get('elgb_f')) {
			const button = Button.create([
				{
					color: 'alternate-white',
					tooltip: 'Add Description To Filters',
					icons: ['fa-eye'],
					onClick: async () => {
						await setSetting(
							'elgb_filters',
							`${Settings.get('elgb_filters')}|${description.textContent
								.replace(/[^a-zA-Z]/g, '')
								.toLowerCase()}`
						);
						button.destroy();
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Filtering...',
				},
			]).insert(heading.nodes.outer.lastElementChild, 'beforebegin');
		}
		let commentsContainer = responseHtml.querySelector('.comments');
		if (commentsContainer && commentsContainer.children.length) {
			let preset = null;
			if (Settings.get('cf') && Settings.get('cf_m') && Settings.get('cf_enableElgb')) {
				const name = Settings.get('cf_presetElgb');
				if (name) {
					preset = Settings.get('cf_presets').filter((x) => x.name === name)[0];
				}
			}
			if (preset) {
				let filteredComments = 0;
				const filters = Shared.esgst.modules.commentsCommentFilters.getFilters();
				const comments = await Shared.esgst.modules.comments.comments_get(
					commentsContainer.parentElement,
					responseHtml
				);
				for (const comment of comments) {
					if (
						!Shared.esgst.modules.commentsCommentFilters.filters_filterItem(
							filters,
							comment,
							preset.rules
						)
					) {
						filteredComments += 1;
					}
				}
				if (filteredComments === comments.length) {
					commentsContainer = null;
				}
			}
		}
		if (commentsContainer && commentsContainer.children.length) {
			commentsContainer.classList.add('esgst-text-left', 'esgst-hidden');
			createElements(popup.scrollable, 'beforeend', [
				{
					context: commentsContainer,
				},
			]);
			if (Settings.get('elgb_fp') || mainCallback) {
				commentsContainer.classList.remove('esgst-hidden');
				common.endless_load(popup.scrollable);
			} else {
				const commentButton = Button.create({
					color: 'alternate-white',
					tooltip: 'Show First Page Comments',
					icons: ['fa-comments'],
					onClick: () => {
						commentButton.destroy();
						commentsContainer.classList.remove('esgst-hidden');
						common.endless_load(popup.scrollable);
					},
				}).insert(heading.nodes.outer.lastElementChild, 'beforebegin');
			}
		}
		if (
			(Settings.get('elgb_fp') && commentsContainer && commentsContainer.children.length) ||
			description ||
			(Settings.get('elgb_r') && (!Settings.get('elgb_r_d') || description)) ||
			mainCallback
		) {
			if (mainCallback) {
				popup.onClose = mainCallback;
			}
			popup.open(() => {
				if (box) {
					box.focus();
				}
			});
		}
	}

	processFilters(filters) {
		return filters.replace(/(^|\|)\.*(\*|\+)\.*($|\|)/g, '').replace(/\|$/, '');
	}

	async elgb_enterGiveaway(giveaway, main, popup, source, callback) {
		let responseJson = null;
		try {
			responseJson = (
				await FetchRequest.post('/ajax.php', {
					data: `xsrf_token=${Session.xsrfToken}&do=entry_insert&code=${giveaway.code}`,
					doNotQueue: true,
				})
			).json;
		} catch (e) {
			Logger.warning(e.message, e.stack);
			Logger.info(giveaway.code);
		}
		if (!responseJson) {
			return;
		}
		if (responseJson.type === 'success') {
			if (!this.esgst.giveawayPath || !main) {
				giveaway.innerWrap.classList.add('is-faded');
			}
			giveaway.entered = true;
			EventDispatcher.dispatch(Events.GIVEAWAY_ENTER, giveaway);
			giveaway.error = null;
			this.elgb_addButton(giveaway, main, source);
			if (Settings.get('et')) {
				// noinspection JSIgnoredPromiseFromCall
				this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, true, giveaway.name);
			}
			await Shared.header.updatePoints(responseJson.points);
			if (Settings.get('egh')) {
				// noinspection JSIgnoredPromiseFromCall
				this.esgst.modules.gamesEnteredGameHighlighter.egh_saveGame(giveaway.id, giveaway.type);
			}
			if (Settings.get('gb') && Settings.get('gb_ue') && giveaway.gbButton) {
				if (giveaway.gbButton.index === 3) {
					// noinspection JSIgnoredPromiseFromCall
					giveaway.gbButton.change(giveaway.gbButton.callbacks[2]);
				}
				if (!Settings.get('gb_se')) {
					giveaway.gbButton.button.classList.add('esgst-hidden');
				}
			}
			if (
				main &&
				Shared.esgst.gf &&
				Shared.esgst.gf.filteredCount &&
				Settings.get(`gf_enable${this.esgst.gf.type}`)
			) {
				this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf);
			}
			if (
				(!main || this.esgst.parameters.esgst) &&
				this.esgst.gfPopup &&
				this.esgst.gfPopup.filteredCount &&
				Settings.get(`gf_enable${this.esgst.gfPopup.type}`)
			) {
				this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gfPopup);
			}
			if (callback) {
				callback();
			}
			if (!popup && (!this.esgst.giveawayPath || !main)) {
				// noinspection JSIgnoredPromiseFromCall
				this.elgb_openPopup(giveaway, main, source);
			}
		} else {
			if (
				Settings.get('elgb_b') &&
				Settings.get('gb') &&
				giveaway.gbButton &&
				giveaway.gbButton.index === 1
			) {
				// noinspection JSIgnoredPromiseFromCall
				giveaway.gbButton.change(giveaway.gbButton.callbacks[0]);
			}
			giveaway.entered = false;
			giveaway.error = responseJson.msg;
			this.elgb_addButton(giveaway, main, source);
			if (callback) {
				callback();
			}
		}
	}

	async elgb_leaveGiveaway(giveaway, main, source, callback) {
		let responseJson = null;
		try {
			responseJson = (
				await FetchRequest.post('/ajax.php', {
					data: `xsrf_token=${Session.xsrfToken}&do=entry_delete&code=${giveaway.code}`,
					doNotQueue: true,
				})
			).json;
		} catch (e) {
			Logger.warning(e.message, e.stack);
			Logger.info(giveaway.code);
		}
		if (!responseJson) {
			return;
		}
		if (responseJson.type === 'success') {
			giveaway.innerWrap.classList.remove('is-faded');
			giveaway.entered = false;
			EventDispatcher.dispatch(Events.GIVEAWAY_LEAVE, giveaway);
			giveaway.error = null;
			this.elgb_addButton(giveaway, main, source);
			if (Settings.get('et')) {
				// noinspection JSIgnoredPromiseFromCall
				this.esgst.modules.giveawaysEntryTracker.et_setEntry(giveaway.code, false, giveaway.name);
			}
			await Shared.header.updatePoints(responseJson.points);
			if (Settings.get('gb') && giveaway.gbButton) {
				giveaway.gbButton.button.classList.remove('esgst-hidden');
			}
			if (
				main &&
				Shared.esgst.gf &&
				this.esgst.gf.filteredCount &&
				Settings.get(`gf_enable${this.esgst.gf.type}`)
			) {
				this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf);
			}
			if (
				!main &&
				this.esgst.gfPopup &&
				this.esgst.gfPopup.filteredCount &&
				Settings.get(`gf_enable${this.esgst.gfPopup.type}`)
			) {
				this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gfPopup);
			}
			if (callback) {
				callback();
			}
		} else if (callback) {
			callback();
		}
	}

	elgb_updateButtons() {
		let giveaway, i, n;
		const giveaways = Scope.findData('main', 'giveaways');
		for (i = 0, n = giveaways.length; i < n; ++i) {
			giveaway = giveaways[i];
			if (giveaway.elgbButton && !giveaway.entered) {
				if (giveaway.error === 'Not Enough Points') {
					giveaway.error = null;
				}
				this.elgb_addButton(giveaway, true);
			}
		}
		if (Settings.get('ttec')) {
			this.esgst.modules.giveawaysTimeToEnterCalculator.ttec_calculateTime(giveaways, true);
		}
	}
}

const giveawaysEnterLeaveGiveawayButton = new GiveawaysEnterLeaveGiveawayButton();

export { giveawaysEnterLeaveGiveawayButton };
