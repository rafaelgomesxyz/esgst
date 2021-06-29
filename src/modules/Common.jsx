import dateFns_format from 'date-fns/format';
import dateFns_isSameWeek from 'date-fns/isSameWeek';
import { browser } from '../browser';
import { DOM } from '../class/DOM';
import { EventDispatcher } from '../class/EventDispatcher';
import { FetchRequest } from '../class/FetchRequest';
import { LocalStorage } from '../class/LocalStorage';
import { Lock } from '../class/Lock';
import { Logger } from '../class/Logger';
import { Module } from '../class/Module';
import { permissions } from '../class/Permissions';
import { Popout } from '../class/Popout';
import { Popup } from '../class/Popup';
import { Scope } from '../class/Scope';
import { Session } from '../class/Session';
import { Settings } from '../class/Settings';
import { SettingsWizard } from '../class/SettingsWizard';
import { Shared } from '../class/Shared';
import { Tabs } from '../class/Tabs';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { Button } from '../components/Button';
import { Collapsible } from '../components/Collapsible';
import { NotificationBar } from '../components/NotificationBar';
import { PageHeading } from '../components/PageHeading';
import { ClassNames } from '../constants/ClassNames';
import { Events } from '../constants/Events';
import { Utils } from '../lib/jsUtils';
import { settingsModule } from './Settings';
import { loadDataCleaner, loadDataManagement } from './Storage';
import { runSilentSync, setSync } from './Sync';

const SHORT_MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

class Common extends Module {
	constructor() {
		super();
		this.info = {
			id: 'common',
			name: 'Common',
			type: 'general',
		};
	}

	minimizePanel_add() {
		if (!this.esgst.pageOuterWrap) {
			return;
		}

		this.esgst.minimizePanel = this.createElements(this.esgst.pageOuterWrap, 'beforeend', [
			{
				attributes: {
					class: 'esgst-minimize-panel',
				},
				type: 'div',
				children: [
					{
						attributes: {
							class: 'esgst-minimize-container markdown',
						},
						type: 'div',
						children: [
							{
								text: `Minimized Popups:`,
								type: 'h3',
							},
							{
								type: 'hr',
							},
							{
								attributes: {
									class: 'esgst-minimize-list',
								},
								type: 'ul',
							},
						],
					},
				],
			},
		]);
		this.esgst.minimizeList = this.esgst.minimizePanel.firstElementChild.lastElementChild;
	}

	minimizePanel_addItem(popup) {
		if (!this.esgst.minimizeList) {
			return;
		}

		popup.minimizeItem = this.createElements(this.esgst.minimizeList, 'beforeend', [
			{
				attributes: {
					class: 'esgst-minimize-item',
				},
				type: 'li',
				children: [
					{
						attributes: {
							href: `javascript:void(0);`,
						},
						text: popup.title.textContent.replace(/:$/, ''),
						type: 'a',
					},
				],
			},
		]);
		popup.minimizeLink = popup.minimizeItem.firstElementChild;
		popup.minimizeItem.addEventListener('click', this.minimizePanel_openItem.bind(this, popup));
	}

	minimizePanel_openItem(popup) {
		popup.open();
		popup.minimizeItem.remove();
		popup.minimizeItem = null;
		if (!this.esgst.minimizePanel.getElementsByClassName('alert').length) {
			this.esgst.minimizePanel.classList.remove('alert');
		}
	}

	minimizePanel_alert(popup) {
		if (popup.minimizeItem) {
			popup.minimizeItem.classList.add('alert');
		}
		if (Settings.get('minimizePanel')) {
			this.esgst.minimizePanel.classList.add('alert');
		}
	}

	setSidebarActive(id) {
		const selected = this.esgst.sidebar.querySelector('.is-selected');
		selected.querySelector('.fa-caret-right').remove();
		selected.classList.remove('is-selected');
		const newSelected = document.querySelector(`#${id}`);
		newSelected.classList.add('is-selected');
		DOM.insert(
			newSelected.querySelector('.sidebar__navigation__item__link'),
			'afterbegin',
			<i className="fa fa-caret-right"></i>
		);
	}

	/**
	 *
	 * @param {Object} modules
	 * @returns {Promise<void>}
	 */
	async loadFeatures(modules) {
		//Logger.info(this.esgst.games.apps[269650]);
		if (this.isCurrentPath('Account')) {
			this.createSidebarNavigation(this.esgst.sidebar, 'beforeend', {
				name: 'ESGST',
				items: [
					{
						id: 'settings',
						name: 'Settings',
						url: this.esgst.settingsUrl,
					},
					{
						id: 'sync',
						name: 'Sync',
						url: this.esgst.syncUrl,
					},
					{
						id: 'backup',
						name: 'Backup',
						url: this.esgst.backupUrl,
					},
					{
						id: 'restore',
						name: 'Restore',
						url: this.esgst.restoreUrl,
					},
					{
						id: 'delete',
						name: 'Delete',
						url: this.esgst.deleteUrl,
					},
					{
						id: 'clean',
						name: 'Clean',
						url: this.esgst.cleanUrl,
					},
					{
						id: 'data-management',
						name: 'Data Management',
						url: this.esgst.dataManagementUrl,
					},
				],
			});
			if (
				this.esgst.parameters.esgst?.match(
					/^(settings|sync|backup|restore|delete|clean|data-management)$/
				)
			) {
				EventDispatcher.subscribe(Events.PAGE_HEADING_BUILD, (builtHeading) =>
					builtHeading.nodes.outer.classList.add('esgst-fmph')
				);
			}
			if (this.esgst.parameters.esgst === 'debug') {
				let textArea;
				DOM.insert(
					document.body,
					'atinner',
					<fragment>
						<textarea ref={(ref) => (textArea = ref)}></textarea>
						<button onclick={() => Function('"use strict";' + textArea.value + '').call(Shared)}>
							Debug
						</button>
					</fragment>
				);
				return;
			} else if (this.esgst.parameters.esgst === 'settings') {
				this.setSidebarActive('settings');
				settingsModule.loadMenu();
			} else if (this.esgst.parameters.esgst === 'sync') {
				this.setSidebarActive('sync');
				await setSync();
			} else if (this.esgst.parameters.esgst === 'backup') {
				this.setSidebarActive('backup');
				loadDataManagement('export');
			} else if (this.esgst.parameters.esgst === 'restore') {
				this.setSidebarActive('restore');
				loadDataManagement('import');
			} else if (this.esgst.parameters.esgst === 'delete') {
				this.setSidebarActive('delete');
				loadDataManagement('delete');
			} else if (this.esgst.parameters.esgst === 'clean') {
				this.setSidebarActive('clean');
				loadDataCleaner();
			} else if (this.esgst.parameters.esgst === 'data-management') {
				this.setSidebarActive('data-management');
				this.loadDM();
			}
		}

		if (Settings.get('minimizePanel')) {
			this.minimizePanel_add();
		}

		if (this.esgst.mainPageHeading) {
			DOM.insert(
				this.esgst.mainPageHeading,
				'afterbegin',
				<div
					className="esgst-page-heading esgst-page-heading-buttons"
					ref={(ref) => (this.esgst.leftMainPageHeadingButtons = ref)}
				></div>
			);
			DOM.insert(
				this.esgst.mainPageHeading,
				'beforeend',
				<div
					className="esgst-page-heading esgst-page-heading-buttons"
					ref={(ref) => (this.esgst.rightMainPageHeadingButtons = ref)}
				></div>
			);
		}

		let hideButtonsLeft, hideButtonsRight;
		hideButtonsLeft = document.createElement('div');
		hideButtonsLeft.className = 'esgst-heading-button';
		DOM.insert(hideButtonsLeft, 'atinner', <i className="fa fa-ellipsis-v"></i>);
		this.esgst.leftButtons = this.createElements(
			new Popout('esgst-hidden-buttons', hideButtonsLeft, 0, true).popout,
			'beforeend',
			[
				{
					attributes: {
						class: 'esgst-page-heading',
					},
					type: 'div',
				},
			]
		);
		hideButtonsRight = document.createElement('div');
		hideButtonsRight.className = 'esgst-heading-button';
		DOM.insert(hideButtonsRight, 'atinner', <i className="fa fa-ellipsis-v"></i>);
		this.esgst.rightButtons = this.createElements(
			new Popout('esgst-hidden-buttons', hideButtonsRight, 0, true).popout,
			'beforeend',
			[
				{
					attributes: {
						class: 'esgst-page-heading',
					},
					type: 'div',
				},
			]
		);

		this.isGiveawayHeadingDefault = this.areArraysEqual(
			Settings.get('giveawayHeading'),
			Settings.defaultValues.giveawayHeading
		);
		this.isGiveawayHeadingGvDefault = this.areArraysEqual(
			Settings.get('giveawayHeading_gv'),
			Settings.defaultValues.giveawayHeading_gv
		);
		this.isGiveawayColumnsDefault = this.areArraysEqual(
			Settings.get('giveawayColumns'),
			Settings.defaultValues.giveawayColumns
		);
		this.isGiveawayColumnsGvDefault = this.areArraysEqual(
			Settings.get('giveawayColumns_gv'),
			Settings.defaultValues.giveawayColumns_gv
		);
		this.isGiveawayPanelDefault = this.areArraysEqual(
			Settings.get('giveawayPanel'),
			Settings.defaultValues.giveawayPanel
		);
		this.isGiveawayPanelGvDefault = this.areArraysEqual(
			Settings.get('giveawayPanel_gv'),
			Settings.defaultValues.giveawayPanel_gv
		);
		this.isGiveawayLinksDefault = this.areArraysEqual(
			Settings.get('giveawayLinks'),
			Settings.defaultValues.giveawayLinks
		);
		this.isGiveawayLinksGvDefault = this.areArraysEqual(
			Settings.get('giveawayLinks_gv'),
			Settings.defaultValues.giveawayLinks_gv
		);
		this.isGiveawayExtraPanelDefault = this.areArraysEqual(
			Settings.get('giveawayExtraPanel'),
			Settings.defaultValues.giveawayExtraPanel
		);
		this.isGiveawayExtraPanelGvDefault = this.areArraysEqual(
			Settings.get('giveawayExtraPanel_gv'),
			Settings.defaultValues.giveawayExtraPanel_gv
		);

		const batchSize = 10;
		let currentBatchIndex = 0;

		for (const key in modules) {
			const mod = modules[key];
			if (!mod.info || (!mod.info.endless && !Settings.get(mod.info.id))) {
				continue;
			}
			if (mod.info.featureMap) {
				for (const type in mod.info.featureMap) {
					if (!mod.info.featureMap.hasOwnProperty(type)) {
						continue;
					}
					const map = mod.info.featureMap[type];
					if (Array.isArray(map)) {
						for (const item of map) {
							this.esgst[`${type}Features`].push(item);
						}
					} else {
						this.esgst[`${type}Features`].push(map);
					}
				}
			}
			try {
				await mod.init();
				/*currentBatchIndex += 1;
				if (currentBatchIndex > batchSize) {
					currentBatchIndex = 0;
					await this.timeout(0);
				}*/
			} catch (e) {
				Logger.warning(`${mod.info.name} failed to load:`);
				Logger.error(e.message);
			}
		}

		const customPage = this.esgst.parameters.esgst
			? this.esgst.customPages[this.esgst.parameters.esgst]
			: null;
		if (customPage && customPage.check) {
			await customPage.load();
		} else if (!Shared.esgst.parameters.esgst || Shared.esgst.parameters.esgst !== 'ge') {
			await this.endless_load(document, !this.esgst.parameters.esgst);
		}

		if (this.esgst.wbcButton && !Scope.findData('main', 'users').length) {
			this.esgst.wbcButton.classList.add('esgst-hidden');
		}
		if (this.esgst.uscButton && !Scope.findData('main', 'users').length) {
			this.esgst.uscButton.classList.add('esgst-hidden');
		}

		this.esgst.style.insertAdjacentText(
			'beforeend',
			`
			.esgst-menu-split-fixed {
				max-height: calc(100vh - ${this.esgst.commentsTop + 55 + (Settings.get('ff') ? 39 : 0)}px);
				top: ${this.esgst.commentsTop + 25}px;
			}
		`
		);

		if (Settings.get('updateHiddenGames')) {
			const hideButton = document.getElementsByClassName('js__submit-hide-games')[0];
			if (hideButton) {
				hideButton.addEventListener('click', () =>
					this.updateHiddenGames(this.esgst.hidingGame.id, this.esgst.hidingGame.type, false)
				);
			}
		}

		if (this.esgst.newGiveawayPath) {
			// when the user searches for a game in the new giveaway page, wait until the results appear and load the game features for them
			let rows = document.getElementsByClassName('form__rows')[0];
			if (rows) {
				window.setTimeout(
					() =>
						this.checkNewGiveawayInput(document.getElementsByClassName('js__autocomplete-data')[0]),
					1000
				);
			}
		}

		if (this.esgst.mainPageHeading) {
			if (
				!this.esgst.leftMainPageHeadingButtons.querySelector(
					`.esgst-heading-button:not(.esgst-hidden)`
				)
			) {
				this.esgst.leftMainPageHeadingButtons.classList.add('esgst-hidden');
			}
			if (
				!this.esgst.rightMainPageHeadingButtons.querySelector(
					`.esgst-heading-button:not(.esgst-hidden)`
				)
			) {
				this.esgst.rightMainPageHeadingButtons.classList.add('esgst-hidden');
			}
			if (!this.esgst.leftButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
				hideButtonsLeft.classList.add('esgst-hidden');
			}
			if (!this.esgst.rightButtons.querySelector(`.esgst-heading-button:not(.esgst-hidden)`)) {
				hideButtonsRight.classList.add('esgst-hidden');
			}
			this.esgst.mainPageHeading.insertBefore(
				hideButtonsLeft,
				this.esgst.mainPageHeading.firstElementChild
			);
			this.esgst.mainPageHeading.appendChild(hideButtonsRight);
		}
		this.reorderButtons(this.esgst);
		if (document.readyState === 'complete') {
			this.processHash();
		} else {
			document.addEventListener('readystatechange', () => this.processHash());
		}
		window.addEventListener('beforeunload', this.checkBusy.bind(this));
		window.addEventListener('hashchange', this.goToComment.bind(this, null, null, false));

		if (Shared.esgst.replyBox && Settings.get('jumpToReplyBox')) {
			Shared.esgst.replyBox.querySelector('textarea').focus();
		}

		for (const key in this.esgst.documentEvents) {
			if (this.esgst.documentEvents.hasOwnProperty(key)) {
				document.addEventListener(
					key,
					this.processEvent.bind(this, this.esgst.documentEvents[key]),
					true
				);
			}
		}

		this.esgst.modules = modules;
	}

	processHash() {
		this.goToComment(this.esgst.originalHash, null, false);
		if (this.esgst.parameters.esgst && this.esgst.parameters.id) {
			const element = document.querySelector(`[data-id="${this.esgst.parameters.id}"]`);
			if (element) {
				const hiddenSection = element.closest(
					`.esgst-form-row-indent.esgst-hidden:not(.SMFeatures)`
				);
				if (hiddenSection) {
					hiddenSection.previousElementSibling.firstElementChild.click();
				}
				this.goToComment(`#${this.esgst.parameters.id}`, element);
			}
		}
	}

	processEvent(functions, event) {
		for (const fun of functions) {
			fun(event);
		}
	}

	async getElements() {
		if (this.esgst.sg) {
			this.esgst.pageOuterWrapClass = 'page__outer-wrap';
			this.esgst.pageHeadingClass = 'page__heading';
			this.esgst.pageHeadingBreadcrumbsClass = 'page__heading__breadcrumbs';
			this.esgst.replyBox = document.querySelector('.comment--submit');
			this.esgst.cancelButtonClass = 'comment__cancel-button';
			this.esgst.paginationNavigationClass = 'pagination__navigation';
			this.esgst.hiddenClass = 'is-hidden';
			this.esgst.selectedClass = 'is-selected';
		} else {
			this.esgst.pageOuterWrapClass = 'page_outer_wrap';
			this.esgst.pageHeadingClass = 'page_heading';
			this.esgst.pageHeadingBreadcrumbsClass = 'page_heading_breadcrumbs';
			this.esgst.replyBox = /** @type {HTMLElement} */ document.querySelector('.reply_form');
			if (this.esgst.replyBox?.querySelector('.rating_checkbox')) {
				this.esgst.reviewBox = this.esgst.replyBox;
				this.esgst.replyBox = null;
			}
			this.esgst.cancelButtonClass = 'btn_cancel';
			this.esgst.paginationNavigationClass = 'pagination_navigation';
			this.esgst.hiddenClass = 'is_hidden';
			this.esgst.selectedClass = 'is_selected';
		}
		const pageMatch = Shared.esgst.locationHref.match(/page=(\d+)/);
		if (pageMatch) {
			this.esgst.currentPage = parseInt(pageMatch[1]);
		} else {
			this.esgst.currentPage = 1;
		}
		let url = window.location.href
			.replace(window.location.search, '')
			.replace(window.location.hash, '')
			.replace('/search', '');
		this.esgst.originalUrl = url;
		this.esgst.favicon = document.querySelector(`[rel="shortcut icon"]`);
		this.esgst.originalTitle = document.title;
		if (this.esgst.mainPath) {
			url += this.esgst.sg ? 'giveaways' : 'trades';
		}
		url += '/search?';
		let parameters = window.location.search.replace(/^\?/, '').split(/&/);
		for (let i = 0, n = parameters.length; i < n; ++i) {
			if (parameters[i] && !parameters[i].match(/page/)) {
				url += `${parameters[i]}&`;
			}
		}
		if (window.location.search) {
			this.esgst.originalUrl = url.replace(/&$/, '');
			if (this.esgst.currentPage > 1) {
				this.esgst.originalUrl += `&page=${this.esgst.currentPage}`;
			}
		}
		url += `page=`;
		this.esgst.searchUrl = url;
		this.esgst.pagination = /** @type {HTMLElement} */ document.getElementsByClassName(
			'pagination'
		)[0];
		this.esgst.featuredContainer = /** @type {HTMLElement} */ document.getElementsByClassName(
			'featured__container'
		)[0];
		this.esgst.pageOuterWrap = /** @type {HTMLElement} */ document.getElementsByClassName(
			this.esgst.pageOuterWrapClass
		)[0];
		this.esgst.paginationNavigation = /** @type {HTMLElement} */ document.getElementsByClassName(
			this.esgst.paginationNavigationClass
		)[0];
		this.esgst.sidebar = /** @type {HTMLElement} */ document.getElementsByClassName('sidebar')[0];
		if (this.esgst.sidebar) {
			this.esgst.enterGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(
				'sidebar__entry-insert'
			)[0];
			this.esgst.leaveGiveawayButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(
				'sidebar__entry-delete'
			)[0];
			this.esgst.giveawayErrorButton = /** @type {HTMLElement} */ this.esgst.sidebar.getElementsByClassName(
				'sidebar__error'
			)[0];
			const headings = document.querySelectorAll('.sidebar__heading');
			// @ts-ignore
			for (const heading of headings) {
				this.esgst.sidebarGroups.push({
					heading: heading,
					navigation: heading.nextElementSibling,
				});
			}
		}
		const discussionHeading = document.querySelector(`.homepage_heading[href="/discussions"]`);
		this.esgst.activeDiscussions =
			/** @type {HTMLElement} */ discussionHeading &&
			discussionHeading.closest('.widget-container--margin-top');
		this.esgst.pinnedGiveaways = /** @type {HTMLElement} */ document.getElementsByClassName(
			'pinned-giveaways__outer-wrap'
		)[0];
		let mainPageHeadingIndex;
		if (this.esgst.commentsPath) {
			mainPageHeadingIndex = 1;
		} else {
			mainPageHeadingIndex = 0;
		}
		this.esgst.pageHeadings = document.querySelectorAll(`.${this.esgst.pageHeadingClass}`);
		this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[
			mainPageHeadingIndex
		];
		if (!this.esgst.mainPageHeading && mainPageHeadingIndex === 1) {
			this.esgst.mainPageHeading = document.getElementsByClassName(this.esgst.pageHeadingClass)[0];
		}
	}

	async checkNewGiveawayInput(context) {
		if (context.style.opacity === '1') {
			if (!context.getAttribute('data-esgst')) {
				context.setAttribute('data-esgst', true);
				await this.loadNewGiveawayFeatures(context);
			}
		} else {
			context.removeAttribute('data-esgst');
		}
		window.setTimeout(() => this.checkNewGiveawayInput(context), 1000);
	}

	async loadNewGiveawayFeatures(context) {
		await this.esgst.modules.games.games_load(context, true);
	}

	async endless_load(context, main, source, endless, mainEndless) {
		this.purgeRemovedElements();
		for (let feature of this.esgst.endlessFeatures) {
			try {
				await feature(context, main, source, endless, mainEndless);
			} catch (e) {
				Logger.error(feature.name, e.message, e.stack);
			}
		}
	}

	purgeRemovedElements() {
		// there are more elements that need to be purged,
		// but for now these are the most critical ones
		Scope.purge();
		const keys = ['attachedImages', 'tsTables'];
		for (const key of keys) {
			for (let i = this.esgst[key].length - 1; i > -1; i--) {
				if (document.contains(this.esgst[key][i].outerWrap)) continue;
				this.esgst[key].splice(i, 1);
			}
		}
		for (const key in this.esgst.apPopouts) {
			if (this.esgst.apPopouts.hasOwnProperty(key)) {
				if (document.contains(this.esgst.apPopouts[key].popout)) continue;
				delete this.esgst.apPopouts[key];
			}
		}
		for (const key in this.esgst.currentUsers) {
			if (this.esgst.currentUsers.hasOwnProperty(key)) {
				const elements = this.esgst.currentUsers[key].elements;
				for (let i = elements.length - 1; i > -1; i--) {
					if (document.contains(elements[i])) continue;
					elements.splice(i, 1);
				}
				if (elements.length) continue;
				delete this.esgst.currentUsers[key];
			}
		}
	}

	// Helper

	async saveComment(context, tradeCode, parentId, description, url, status, goToLocation) {
		const username = Settings.get('username');
		const obj = {
			context,
			comment: description,
		};
		await EventDispatcher.dispatch(Events.BEFORE_COMMENT_SUBMIT, obj);
		description = obj.comment;
		const data = `xsrf_token=${Session.xsrfToken}&do=${
			this.esgst.sg ? 'comment_new' : 'comment_insert'
		}&trade_code=${tradeCode}&parent_id=${parentId}&description=${encodeURIComponent(description)}`;
		let id = null;
		let response = await FetchRequest.post(url, { data });
		let responseHtml = null;
		let success = true;
		if (this.esgst.sg) {
			if (response.redirected) {
				responseHtml = response.html;
				let commentEls;
				if (parentId) {
					commentEls =
						responseHtml
							.querySelector(`[data-comment-id="${parentId}"]`)
							?.querySelector('.comment__children')?.children ?? [];
				} else {
					const els = responseHtml.querySelectorAll('.comments') ?? [];
					commentEls = els[els.length - 1].children;
				}
				commentEls = Array.from(commentEls).reverse();
				for (const commentEl of commentEls) {
					const author = commentEl.querySelector('.comment__username')?.textContent.trim() ?? '';
					if (author === username) {
						id = commentEl.querySelector('.comment__summary')?.id ?? '';
						break;
					}
				}
			} else {
				success = false;
			}
		} else {
			const responseJson = response.json;
			if (responseJson.success) {
				responseHtml = DOM.parse(responseJson.html);
				id = responseHtml.querySelector('.comment_outer')?.id ?? '';
			} else {
				success = false;
			}
		}
		if (!success) {
			if (status instanceof NotificationBar) {
				status.setError('Failed!').show();
			} else {
				this.createElements(status, 'atinner', [
					{
						attributes: {
							class: 'fa fa-times-circle',
						},
						type: 'i',
					},
					{
						text: 'Failed!',
						type: 'span',
					},
				]);
			}
			return { id: null, response: null, status };
		}
		if (Settings.get('ch')) {
			// noinspection JSIgnoredPromiseFromCall
			this.esgst.modules.commentsCommentHistory.ch_saveComment(id, Date.now());
		}
		if (!goToLocation) {
			return { id, response, status };
		}
		await this.esgst.modules.giveawaysGiveawayEncrypterDecrypter.ged_saveGiveaways(
			this.esgst.sg
				? responseHtml.getElementById(id).closest('.comment')
				: responseHtml.getElementById(id),
			id
		);
		window.location.href = `/go/comment/${id}`;
	}

	getFeatures() {
		const features = {
			general: {
				features: {},
			},
			giveaways: {
				features: {},
			},
			discussions: {
				features: {},
			},
			trades: {
				features: {},
			},
			comments: {
				features: {},
			},
			users: {
				features: {},
			},
			groups: {
				features: {},
			},
			games: {
				features: {},
			},
			others: {
				features: {
					limitSteamStore: {
						description: () => (
							<ul>
								<li>
									With this option enabled, requests to the Steam store will be limited to 1 per 200
									milliseconds, to prevent the user from running into potential blocks, specially
									when using features like {Shared.common.getFeatureName(null, 'gc')}.
								</li>
							</ul>
						),
						name: 'Limit Steam store requests.',
						sg: true,
					},
					useCustomAdaReqLim: {
						name: 'Use custom adaptive request limits for SteamGifts.',
						sg: true,
						inputItems: [
							{
								id: 'customAdaReqLim_default',
								prefix: '1 request every ',
								suffix: ' seconds (default)',
								attributes: {
									type: 'number',
									min: '0.25',
									step: '0.01',
								},
							},
							{
								id: 'customAdaReqLim_minute50',
								prefix: '1 request every ',
								suffix: ' seconds (after using 50% of the minute limit)',
								attributes: {
									type: 'number',
									min: '0.5',
									step: '0.01',
								},
							},
							{
								id: 'customAdaReqLim_minute75',
								prefix: '1 request every ',
								suffix: ' seconds (after using 75% of the minute limit)',
								attributes: {
									type: 'number',
									min: '1',
									step: '0.01',
								},
							},
							{
								id: 'customAdaReqLim_hourly75',
								prefix: '1 request every ',
								suffix: ' seconds (after using 75% of the hourly limit)',
								attributes: {
									type: 'number',
									min: '1.5',
									step: '0.01',
								},
							},
							{
								id: 'customAdaReqLim_daily75',
								prefix: '1 request every ',
								suffix: ' seconds (after using 75% of the daily limit)',
								attributes: {
									type: 'number',
									min: '2',
									step: '0.01',
								},
							},
						],
					},
					notifyLogs: {
						name: 'Notify about console logs.',
						sg: true,
						st: true,
					},
					jumpToReplyBox: {
						name: 'Jump to the reply box when loading a page that has one.',
						sg: true,
						st: true,
					},
					removeSidebarInFeaturePages: {
						name: `Remove sidebar in feature pages (for example, Giveaway Extractor, Group/Library Wishlist Checker etc).`,
						sg: true,
					},
					openSettingsInTab: {
						name: 'Open settings menu in a new tab.',
						sg: true,
						st: true,
					},
					activateTab: {
						description: () => (
							<ul>
								<li>
									When a browser session is restored, you have to activate a tab so that it can be
									loaded. With this option enabled, ESGST automatically activates the first SG/ST
									tab open so that the extension can be injected immediately.
								</li>
							</ul>
						),
						extensionOnly: true,
						name: 'Activate the first SG/ST tab if a browser session was restored.',
						sg: true,
						st: true,
					},
					manipulateCookies: {
						description: () => (
							<ul>
								<li>
									You should enable this option if you use a single Firefox container for the common
									sites requested by ESGST that require you to be logged in (SteamGifts,
									SteamTrades, Steam, SGTools, etc...) or if you block third-party cookies. With it
									enabled, ESGST will read your cookies and modify request headers to make sure that
									requests are sent using the cookies from the current container you are on.
								</li>
								<li>
									For example: you are only logged in on SteamGifts and Steam in the personal
									container. With this option disabled, when you try to sync your owned games on
									ESGST it will fail because it will use the default cookies (where you are not
									logged in). With this option enabled, the sync will succeed because the container
									cookies will be used instead (where you are logged in).
								</li>
								<li>
									If you are concerned about what exactly is done, you can check out the source code
									of the eventPage.js file, where the process occurs. Basically what happens is: the
									ID of your current container is retrieved from the tab that initiated the request
									and used to retrieve the cookies from that container (using the cookies API), then
									ESGST sends the request with a custom header "Esgst-Cookie" and the request is
									intercepted by the webRequest API, where the custom header is renamed to "Cookie"
									so that the cookies can be sent with the request. This is not a pretty solution,
									but it does the job until a better and more permanent solution comes along.
								</li>
							</ul>
						),
						extensionOnly: true,
						name:
							'Allow ESGST to read your cookies and modify request headers when using Firefox containers or when blocking third-party cookies.',
						sg: true,
						st: true,
						permissions: ['cookies'],
					},
					askFileName: {
						name: 'Ask for file name when backing up data.',
						sg: true,
						st: true,
					},
					autoBackup: {
						inputItems: [
							{
								id: 'autoBackup_days',
								prefix: `Days: `,
							},
						],
						name: 'Automatically backup your data every specified number of days.',
						options: {
							title: `Backup to:`,
							values: ['Computer', 'Dropbox', 'Google Drive', 'OneDrive'],
						},
						sg: true,
						st: true,
					},
					openAutoBackupNewTab: {
						name: 'Open automatic backup in a new tab.',
						sg: true,
						st: true,
					},
					autoSync: {
						name: 'Automatically sync games/groups when syncing through SteamGifts.',
						sg: true,
					},
					openAutoSyncPopup: {
						name: 'Open sync popup when automatically syncing by default.',
						sg: true,
					},
					openAutoSyncNewTab: {
						name: 'Open automatic sync in a new tab.',
						sg: true,
					},
					updateHiddenGames: {
						description: () => (
							<ul>
								<li>
									With this enabled, you no longer have to sync your hidden games every time you
									add/remove a game to/from the list.
								</li>
							</ul>
						),
						name: 'Automatically update hidden games when adding/removing a game to/from the list.',
						sg: true,
					},
					updateWhitelistBlacklist: {
						description: () => (
							<ul>
								<li>
									With this enabled, you no longer have to sync your whitelist/blacklist every time
									you add/remove a user to/from those lists.
								</li>
							</ul>
						),
						name:
							'Automatically update whitelist/blacklist when adding/removing a user to/from those lists.',
						sg: true,
					},
					calculateDelete: {
						name: 'Calculate and show data sizes when opening the delete menu.',
						sg: true,
						st: true,
					},
					backupZip: {
						name: `Backup data as a .zip file (smaller, but slower) instead of a .json file (larger, but faster).`,
						sg: true,
						st: true,
					},
					calculateExport: {
						name: 'Calculate and show data sizes when opening the backup menu.',
						sg: true,
						st: true,
					},
					calculateImport: {
						name: 'Calculate and show data sizes when opening the restore menu.',
						sg: true,
						st: true,
					},
					notifyNewVersion: {
						name: 'Notify when a new ESGST version is available.',
						extensionOnly: true,
						sg: true,
						st: true,
					},
					makeSectionsCollapsible: {
						description: () => (
							<ul>
								<li>
									The state of the sections is remembered if you save the settings after
									collapsing/expanding them.
								</li>
							</ul>
						),
						name: 'Make sections in the settings menu collapsible.',
						sg: true,
						st: true,
					},
					esgst: {
						name: 'Enable ESGST for SteamTrades.',
						st: true,
					},
					enableByDefault: {
						name: 'Enable new features and functionalities by default.',
						sg: true,
						st: true,
					},
					fallbackSteamApi: {
						description: () => (
							<ul>
								<li>
									With this option enabled, if you sync your games without being logged in to Steam,
									the Steam API will be used instead (less complete, so some of your games will be
									removed until you sync while logged in).
								</li>
							</ul>
						),
						name: 'Fallback to Steam API when syncing without being logged in.',
						sg: true,
						st: true,
					},
					static_popups: {
						name: `Make popups static (they are fixed at the top left corner of the page instead of being automatically centered).`,
						sg: true,
						st: true,
					},
					minimizePanel: {
						description: () => (
							<ul>
								<li>
									When you close a non-temporary popup, it will be minimized to a panel that can be
									accessed by moving your mouse to the left corner of the window in any page. There
									you can quickly find and re-open all of the popups that you minimized.
								</li>
								<li>
									A non-temporary popup is a popup that does not get destroyed when you close it.
									For example, the settings popup is a temporary popup - when you close it, the
									popup is destroyed, and when you click on the button to open the settings again, a
									new popup is created. The Whitelist/Blacklist Checker popup is an example of a
									non-temporary popup - if you close it and re-open it, it will be the exact same
									popup.
								</li>
								<li>
									With this option enabled, the sync/backup popups become non-temporary, which
									allows you to close them and keep navigating through the page while ESGST is
									performing the sync/backup, without having to wait for it to finish.
								</li>
								<li>
									Some popups will notify you when they are done. When this happens, a red bar will
									flash at the left side of the screen that only disappears when you open the
									minimize panel and re-open the popup that is requiring your attention.
								</li>
							</ul>
						),
						name: 'Minimize non-temporary popups to a panel when closing them.',
						sg: true,
						st: true,
					},
					getSyncGameNames: {
						description: () => (
							<ul>
								<li>With this disabled, only the app/sub ids of the games will appear.</li>
								<li>
									This can lead to lots of requests to the Steam store, so only enable it if you
									truly need to see the names of the games that were added/removed.
								</li>
							</ul>
						),
						name: 'Retrieve game names when syncing.',
						sg: true,
						st: true,
					},
					showChangelog: {
						name: 'Show changelog from the new version when updating.',
						sg: true,
						st: true,
					},
					showFeatureNumber: {
						name: 'Show the feature number in the tooltips of elements added by ESGST.',
						sg: true,
						st: true,
					},
				},
			},
		};
		for (const type in features) {
			if (features.hasOwnProperty(type)) {
				if (type === 'others') {
					continue;
				}
				const typeModules = Object.keys(this.esgst.modules)
					.filter((x) => this.esgst.modules[x].info && this.esgst.modules[x].info.type === type)
					.sort((x, y) => {
						return this.esgst.modules[x].info.id.localeCompare(this.esgst.modules[y].info.id, {
							sensitivity: 'base',
						});
					});
				for (const key of typeModules) {
					const module = this.esgst.modules[key];
					features[type].features[module.info.id] = module.info;
				}
			}
		}
		return features;
	}

	getFeaturesById() {
		const featuresById = {};
		const featuresAncestors = {};
		for (const type in Shared.esgst.features) {
			for (const id in Shared.esgst.features[type].features) {
				const feature = Shared.esgst.features[type].features[id];
				this.getFeatureById(feature, id, featuresById, featuresAncestors);
			}
		}
		for (const [id, feature] of Object.entries(featuresById)) {
			if (!feature.alias) {
				continue;
			}
			const aliasFeature = featuresById[feature.alias];
			for (const key in aliasFeature) {
				feature[key] = aliasFeature[key];
			}
			feature.id = id;
		}
		return [featuresById, featuresAncestors];
	}

	getFeatureById(feature, id, featuresById, featuresAncestors) {
		feature.id = id;
		featuresById[id] = feature;
		if (feature.features) {
			for (const subId in feature.features) {
				const subFeature = feature.features[subId];
				featuresAncestors[subId] = id;
				this.getFeatureById(subFeature, subId, featuresById, featuresAncestors);
			}
		}
	}

	checkBusy(event) {
		if (document.getElementsByClassName('esgst-busy')[0] || this.esgst.busy) {
			event.returnValue = true;
			return true;
		}
	}

	setMouseEvent(element, id, url, callback) {
		let isDragging = -1;
		let startingPos = [0, 0];
		element.addEventListener('mousedown', (event) => {
			if (event.button === 2) return; // right click, do nothing
			if (event.button === 1) {
				// middle click
				event.preventDefault();
			}
			isDragging = event.button;
			startingPos = [event.pageX, event.pageY];
		});
		element.addEventListener('mousemove', (event) => {
			if (isDragging === -1 || (event.pageX === startingPos[0] && event.pageY === startingPos[1]))
				return;
			isDragging = -1;
		});
		element.addEventListener('mouseup', () => {
			if (isDragging === -1) return;
			if (Settings.get(id) || isDragging === 1) {
				Tabs.open(url);
			} else {
				callback();
			}
			isDragging = -1;
			startingPos = [0, 0];
		});
	}

	createHeadingButton(details) {
		let context = details.context;
		const id = details.orderId || details.id;
		if (!context) {
			if (id === 'gmf' && Shared.esgst.discussionPath) {
				context = document.querySelector('.page__heading__breadcrumbs');
				context.parentElement.insertBefore(details.element, context);

				return context.previousElementSibling;
			} else if (Settings.get('leftButtonIds').indexOf(id) > -1) {
				context = this.esgst.leftButtons;
			} else if (Settings.get('rightButtonIds').indexOf(id) > -1) {
				context = this.esgst.rightButtons;
			} else if (Settings.get('leftMainPageHeadingIds').indexOf(id) > -1) {
				context = this.esgst.leftMainPageHeadingButtons;
			} else {
				context = this.esgst.rightMainPageHeadingButtons;
			}
		}
		if (details.element) {
			context.appendChild(details.element);
			return context.lastElementChild;
		}
		const children = [];
		if (details.isSwitch) {
			children.push({
				type: 'span',
			});
		}
		for (const icon of details.icons) {
			children.push({
				attributes: {
					class: `fa ${icon}`,
				},
				type: 'i',
			});
		}
		const attributes = {
			class: 'esgst-heading-button',
			['data-draggable-id']: id,
			id: `esgst-${details.id}`,
			title: this.getFeatureTooltip(details.featureId || details.id, details.title),
		};
		if (details.link) {
			attributes.href = details.link;
			attributes.target = '_blank';
		}
		return this.createElements(context, 'beforeend', [
			{
				attributes,
				type: details.link ? 'a' : 'div',
				children,
			},
		]);
	}

	async checkNewVersion() {
		if (Shared.esgst.isFirstRun) {
			// noinspection JSIgnoredPromiseFromCall
			this.setSetting('dismissedOptions', this.esgst.toDismiss);

			const popup = new Popup({
				addScrollable: true,
				icon: 'fa-smile-o',
				isTemp: true,
				title: (
					<fragment>
						<i className="fa fa-circle-o-notch fa-spin"></i> Hi! ESGST is retrieving your avatar,
						username and Steam ID. This will not take long...
					</fragment>
				),
			});
			popup.open();

			await this.checkSync(true);

			popup.close();

			SettingsWizard.run();

			Shared.esgst.isFirstRun = false;
		} else if (Shared.esgst.isUpdate && Settings.get('showChangelog')) {
			const hasPermission = await permissions.contains([['github']]);

			if (!hasPermission) {
				new Popup({
					addScrollable: true,
					icon: 'fa-check',
					isTemp: true,
					title: (
						<fragment>
							ESGST has updated from v{Shared.esgst.previousVersion} to v
							{Shared.esgst.currentVersion}! Please go to{' '}
							<a href="https://github.com/rafaelgomesxyz/esgst/-/releases">
								https://github.com/rafaelgomesxyz/esgst/-/releases
							</a>{' '}
							to view the changelog. If you want the changelog to be automatically retrieved from
							GitHub and shown in this popup when updating, then go to the settings menu and grant
							permission to "github.com"
						</fragment>
					),
				}).open();

				Shared.esgst.isUpdate = false;

				return;
			}

			const popup = new Popup({
				addScrollable: true,
				icon: 'fa-circle-o-notch fa-spin',
				isTemp: true,
				title: `ESGST has updated from v${Shared.esgst.previousVersion} to v${Shared.esgst.currentVersion}! Please wait while the changelog is retrieved from GitHub.`,
			});
			popup.open();

			try {
				let changelog = '';

				const refsResponse = await FetchRequest.get(
					'https://api.github.com/repos/rafaelgomesxyz/esgst/git/matching-refs/tags'
				);

				if (!refsResponse || !refsResponse.json) {
					return;
				}

				const refs = refsResponse.json;
				refs.reverse();

				let currentIndex = refs.findIndex(
					(ref) => ref.ref === `refs/tags/v${Shared.esgst.currentVersion}`
				);
				const previousIndex = refs.findIndex(
					(ref) => ref.ref === `refs/tags/v${Shared.esgst.previousVersion}`
				);
				if (currentIndex > -1 && previousIndex > -1) {
					while (currentIndex < previousIndex) {
						const version = refs[currentIndex].ref.split('/tags/')[1];
						const releaseResponse = await FetchRequest.get(
							`https://api.github.com/repos/rafaelgomesxyz/esgst/releases/tags/${version}`
						);
						if (releaseResponse && releaseResponse.json) {
							changelog = `${changelog}## ${version}\n\n${releaseResponse.json.body.replace(
								/#(\d+)/g,
								'[$1](https://github.com/rafaelgomesxyz/esgst/issues/$1)'
							)}\n\n`;
						}

						currentIndex += 1;
					}
				}

				popup.setIcon('fa-star');
				popup.setTitle(
					`ESGST has updated from v${Shared.esgst.previousVersion} to v${Shared.esgst.currentVersion}! Here's the changelog:`
				);
				popup.getScrollable(
					<div className="markdown">{await this.parseMarkdown(popup.scrollable, changelog)}</div>
				);
			} catch (e) {
				Logger.warning(e.message);

				popup.setIcon('fa-times');
				popup.setTitle(
					<fragment>
						ESGST has updated from v{Shared.esgst.previousVersion} to v{Shared.esgst.currentVersion}
						! An error occurred when retrieving the changelog from GitHub, please go to{' '}
						<a href="https://github.com/rafaelgomesxyz/esgst/releases">
							https://github.com/rafaelgomesxyz/esgst/releases
						</a>{' '}
						to view it.
					</fragment>
				);
			}

			Shared.esgst.isUpdate = false;
		}
	}

	async parseMarkdown(context, string) {
		const obj = {
			context,
			comment: string,
		};
		await EventDispatcher.dispatch(Events.BEFORE_COMMENT_SUBMIT, obj);
		string = obj.comment;
		return Array.from(DOM.parse(this.esgst.markdownParser.text(string)).body.children);
	}

	async addGiveawayToStorage() {
		let giveaway, ggiveaways, i, key, n, popup, ugd, user;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-circle-o-notch fa-spin',
			isTemp: true,
			title: 'Please wait... ESGST is adding this giveaway to the storage...',
		});
		popup.open();
		const giveawaysres = await this.esgst.modules.giveaways.giveaways_get(
			document,
			true,
			Shared.esgst.locationHref
		);
		if (giveawaysres.length) {
			giveaway = giveawaysres[0];
			ggiveaways = {};
			ggiveaways[giveaway.code] = giveaway;
			user = {
				steamId: Settings.get('steamId'),
				username: Settings.get('username'),
				values: {},
			};
			const savedUser = await this.getUser(null, user);
			let giveaways = null;
			if (savedUser) {
				giveaways = savedUser.giveaways;
			}
			if (!giveaways) {
				giveaways = {
					sent: {
						apps: {},
						subs: {},
					},
					won: {
						apps: {},
						subs: {},
					},
					sentTimestamp: 0,
					wonTimestamp: 0,
				};
				if (savedUser) {
					ugd = savedUser.ugd;
					if (ugd) {
						if (ugd.sent) {
							for (key in ugd.sent.apps) {
								if (ugd.sent.apps.hasOwnProperty(key)) {
									giveaways.sent.apps[key] = [];
									for (i = 0, n = ugd.sent.apps[key].length; i < n; ++i) {
										ggiveaways[ugd.sent.apps[key][i].code] = ugd.sent.apps[key][i];
										giveaways.sent.apps[key].push(ugd.sent.apps[key][i].code);
									}
								}
							}
							for (key in ugd.sent.subs) {
								if (ugd.sent.subs.hasOwnProperty(key)) {
									giveaways.sent.subs[key] = [];
									for (i = 0, n = ugd.sent.subs[key].length; i < n; ++i) {
										ggiveaways[ugd.sent.subs[key][i].code] = ugd.sent.subs[key][i];
										giveaways.sent.subs[key].push(ugd.sent.subs[key][i].code);
									}
								}
							}
							giveaways.sentTimestamp = ugd.sentTimestamp;
						}
						if (ugd.won) {
							for (key in ugd.won.apps) {
								if (ugd.won.apps.hasOwnProperty(key)) {
									giveaways.won.apps[key] = [];
									for (i = 0, n = ugd.won.apps[key].length; i < n; ++i) {
										ggiveaways[ugd.won.apps[key][i].code] = ugd.won.apps[key][i];
										giveaways.won.apps[key].push(ugd.won.apps[key][i].code);
									}
								}
							}
							for (key in ugd.won.subs) {
								if (ugd.won.subs.hasOwnProperty(key)) {
									giveaways.won.subs[key] = [];
									for (i = 0, n = ugd.won.subs[key].length; i < n; ++i) {
										ggiveaways[ugd.won.subs[key][i].code] = ugd.won.subs[key][i];
										giveaways.won.subs[key].push(ugd.won.subs[key][i].code);
									}
								}
							}
							giveaways.wonTimestamp = ugd.wonTimestamp;
						}
					}
				}
			}
			if (!giveaways.sent[giveaway.gameType][giveaway.gameSteamId]) {
				giveaways.sent[giveaway.gameType][giveaway.gameSteamId] = [];
			}
			if (giveaways.sent[giveaway.gameType][giveaway.gameSteamId].indexOf(giveaway.code) < 0) {
				giveaways.sent[giveaway.gameType][giveaway.gameSteamId].push(giveaway.code);
			}
			user.values = {
				giveaways: giveaways,
			};
			await this.lockAndSaveGiveaways(ggiveaways);
			await this.saveUser(null, null, user);
			popup.close();
		}
	}

	reorderButtons(obj) {
		const items = [
			{
				context: obj.leftButtons,
				id: 'leftButtonIds',
			},
			{
				context: obj.rightButtons,
				id: 'rightButtonIds',
			},
			{
				context: obj.leftMainPageHeadingButtons,
				id: 'leftMainPageHeadingIds',
			},
			{
				context: obj.rightMainPageHeadingButtons,
				id: 'rightMainPageHeadingIds',
			},
		];
		for (const item of items) {
			if (!item.context) {
				continue;
			}
			for (const id of Settings.get(item.id)) {
				const elements = (obj.mainPageHeading || obj.outerWrap).querySelectorAll(
					`[data-draggable-id="${id}"]`
				);
				for (const element of elements) {
					item.context.appendChild(element);
				}
			}
		}
	}

	async lockAndSaveSettings(settingsObj) {
		const lock = new Lock('settings');
		await lock.lock();
		const settings = JSON.parse(this.getValue('settings', '{}'));
		for (const key in settingsObj) {
			if (settingsObj[key] === null) {
				if (Utils.isSet(settings[key])) {
					delete settings[key];
				}
			} else {
				settings[key] = settingsObj[key];
			}
		}
		await this.setValue('settings', JSON.stringify(settings));
		await lock.unlock();
	}

	async setSetting() {
		const lock = new Lock('settings');
		await lock.lock();
		const settings = JSON.parse(this.getValue('settings', '{}'));
		const values = Array.isArray(arguments[0])
			? arguments[0]
			: [
					{
						id: arguments[0],
						value: arguments[1],
						sg: arguments[2],
						st: arguments[3],
					},
			  ];
		for (const value of values) {
			if (value.sg) {
				value.id = `${value.id}_sg`;
			} else if (value.st) {
				value.id = `${value.id}_st`;
			}
			Settings.set(value.id, value.value);
			settings[value.id] = value.value;
		}
		await this.setValue('settings', JSON.stringify(settings));
		await lock.unlock();
	}

	dismissFeature(feature, id) {
		this.esgst.toDismiss.push(id);
		if (id.match(/^(chfl|sk_)/)) {
			this.esgst.toDismiss.push(feature.inputItems);
		}
		if (id.match(/^hr_.+_s$/)) {
			this.esgst.toDismiss.push(`${id}_sound`);
		}
		if (Array.isArray(feature.inputItems)) {
			for (const item of feature.inputItems) {
				this.esgst.toDismiss.push(item.id);
			}
		}
		if (feature.features) {
			for (const subId in feature.features) {
				if (feature.features.hasOwnProperty(subId)) {
					this.dismissFeature(feature.features[subId], subId);
				}
			}
		}
	}

	toggleHeaderMenu(event) {
		event.stopPropagation();

		for (const id in Shared.header.buttonContainers) {
			const buttonContainer = Shared.header.buttonContainers[id];

			if (buttonContainer.data.id === 'esgst') {
				buttonContainer.nodes.relativeDropdown.classList.toggle(
					ClassNames[Session.namespace].hidden
				);
				buttonContainer.nodes.arrow.classList.toggle(ClassNames[Session.namespace].selected);
			} else if (buttonContainer.data.isDropdown) {
				buttonContainer.nodes.relativeDropdown.classList.add(ClassNames[Session.namespace].hidden);
				buttonContainer.nodes.arrow.classList.remove(ClassNames[Session.namespace].selected);
			}
		}
	}

	getFeatureTooltip(id, title = '') {
		if (Settings.get('showFeatureNumber')) {
			if (title) {
				return `${title}\n\nThis element was added by ESGST${
					id ? ` (${this.getFeatureNumber(id).number})` : ''
				}`;
			}
			return `This element was added by ESGST${id ? ` (${this.getFeatureNumber(id).number})` : ''}`;
		}
		return title;
	}

	getFeatureName(fullMatch, match) {
		let feature = this.getFeatureNumber(match);
		return `${feature.number} ${feature.name}`;
	}

	getFeatureNumber(queryId) {
		let n = browser.runtime.getURL ? 2 : 1;
		for (let type in this.esgst.features) {
			if (this.esgst.features.hasOwnProperty(type)) {
				let i = 1;
				for (let id in this.esgst.features[type].features) {
					if (this.esgst.features[type].features.hasOwnProperty(id)) {
						let feature = this.esgst.features[type].features[id];
						let result = this.getFeatureNumber_2(feature, id, i, n, queryId);
						if (result) {
							return result;
						}
						if (feature.sg || Settings.get('esgst_st')) {
							i += 1;
						}
					}
				}
				if (type !== 'trades' || Settings.get('esgst_st')) {
					n += 1;
				}
			}
		}
		return {
			name: '',
			number: '',
		};
	}

	getFeatureNumber_2(feature, id, i, n, queryId) {
		if (id === queryId) {
			return {
				name: feature.name,
				number: `${n}.${i}`,
			};
		}
		if (feature.features) {
			let j = 1;
			for (let id in feature.features) {
				if (feature.features.hasOwnProperty(id)) {
					let subFeature = feature.features[id];
					let result = this.getFeatureNumber_2(subFeature, id, j, `${n}.${i}`, queryId);
					if (result) {
						return result;
					}
					if (subFeature.sg || Settings.get('esgst_st')) {
						j += 1;
					}
				}
			}
		}
		return null;
	}

	async getUser(savedUsers, user) {
		let savedUser = null;
		if (!savedUsers) {
			savedUsers = JSON.parse(this.getValue('users'));
		}
		if (user.steamId) {
			savedUser = savedUsers.users[user.steamId];
			if (savedUser) {
				if (!user.id) {
					user.id = savedUser.id;
				}
				if (!user.username) {
					user.username = savedUser.username;
				}
			}
		} else if (user.username) {
			let steamId = savedUsers.steamIds[user.username];
			if (steamId) {
				user.steamId = steamId;
				savedUser = savedUsers.users[steamId];
			}
		}
		return savedUser;
	}

	async saveUser(list, savedUsers, user) {
		if (!savedUsers) {
			savedUsers = JSON.parse(this.getValue('users'));
		}
		let savedUser = await this.getUser(savedUsers, user);
		if (savedUser) {
			if (list) {
				if (!user.steamId) {
					user.steamId = savedUsers.steamIds[user.username];
				}
				list.existing.push(user);
			} else {
				const lock = new Lock('user', { threshold: 300 });
				await lock.lock();
				this.checkUsernameChange(savedUsers, user);
				for (let key in user.values) {
					if (user.values.hasOwnProperty(key)) {
						if (key !== 'tags') {
							if (user.values[key] === null) {
								delete savedUsers.users[user.steamId][key];
							} else {
								savedUsers.users[user.steamId][key] = user.values[key];
							}
						}
					}
				}
				await this.setValue('users', JSON.stringify(savedUsers));
				await lock.unlock();
			}
		} else {
			if (user.steamId && user.username) {
				if (list) {
					list.new.push(user);
				} else {
					await this.addUser(user);
				}
			} else if (user.steamId) {
				await this.getUsername(list, true, user);
			} else {
				await this.getSteamId(list, true, null, user);
			}
		}
	}

	checkUsernameChange(savedUsers, user) {
		let i, n;
		if (
			typeof savedUsers.users[user.steamId].username !== 'undefined' &&
			savedUsers.users[user.steamId].username !== user.username
		) {
			delete savedUsers.steamIds[savedUsers.users[user.steamId].username];
			savedUsers.users[user.steamId].username = user.username;
			savedUsers.steamIds[user.username] = user.steamId;
			if (user.values.tags) {
				if (!savedUsers.users[user.steamId].tags) {
					savedUsers.users[user.steamId].tags = [];
				}
				for (i = 0, n = user.values.tags.length; i < n; ++i) {
					if (savedUsers.users[user.steamId].tags.indexOf(user.values.tags[i]) < 0) {
						savedUsers.users[user.steamId].tags.push(user.values.tags[i]);
					}
				}
			}
			return true;
		} else if (typeof user.values.tags !== 'undefined') {
			savedUsers.users[user.steamId].tags = user.values.tags;
		}
		if (!savedUsers.users[user.steamId].tags) {
			delete savedUsers.users[user.steamId].tags;
		}
	}

	async addUser(user) {
		let savedUser, savedUsers;
		const lock = new Lock('user', { threshold: 300 });
		await lock.lock();
		savedUsers = JSON.parse(this.getValue('users'));
		savedUser = await this.getUser(savedUsers, user);
		if (!savedUser) {
			savedUsers.users[user.steamId] = {};
		}
		if (user.id) {
			savedUsers.users[user.steamId].id = user.id;
		}
		this.checkUsernameChange(savedUsers, user);
		if (user.username) {
			savedUsers.users[user.steamId].username = user.username;
			savedUsers.steamIds[user.username] = user.steamId;
		}
		for (let key in user.values) {
			if (user.values.hasOwnProperty(key)) {
				if (key !== 'tags') {
					if (user.values[key] === null) {
						delete savedUsers.users[user.steamId][key];
					} else {
						savedUsers.users[user.steamId][key] = user.values[key];
					}
				}
			}
		}
		await this.setValue('users', JSON.stringify(savedUsers));
		await lock.unlock();
	}

	async getUsername(list, save, user) {
		let match;
		const response = await FetchRequest.get(`https://www.steamgifts.com/go/user/${user.steamId}`);
		match = response.url.match(/\/user\/(.+)/);
		if (match) {
			user.username = match[1];
			let input = response.html.querySelector(`[name="child_user_id"]`);
			if (input) {
				user.id = input.value;
			}
		}
		if (save) {
			if (list) {
				list.new.push(user);
			} else {
				await this.addUser(user);
			}
		}
	}

	async getSteamId(list, save, savedUsers, user) {
		let input;
		if (!save) {
			if (!savedUsers) {
				savedUsers = JSON.parse(this.getValue('users'));
			}
			let steamId = savedUsers.steamIds[user.username];
			if (steamId) {
				user.steamId = steamId;
				user.id = savedUsers.users[steamId].id;
				return;
			}
		}
		const response = await FetchRequest.get(
			`https://www.steamgifts.com/user/${user.username}?format=json`
		);
		if (!response.url.includes('/user/') || !response.json.success) {
			return;
		}
		user.steamId = response.json.user.steam_id;
		user.id = response.json.user.id;
		if (save) {
			if (list) {
				list.new.push(user);
			} else {
				await this.addUser(user);
			}
		}
	}

	/**
	 * @param users
	 * @returns {Promise<void>}
	 */
	async saveUsers(users) {
		let list, savedUsers;
		list = {
			existing: [],
			new: [],
		};
		savedUsers = JSON.parse(this.getValue('users'));
		for (let i = 0, n = users.length; i < n; i++) {
			await this.saveUser(list, savedUsers, users[i]);
		}
		const lock = new Lock('user', { threshold: 300 });
		await lock.lock();
		savedUsers = JSON.parse(this.getValue('users'));
		for (let i = 0, n = list.new.length; i < n; ++i) {
			let savedUser, user;
			user = list.new[i];
			savedUser = await this.getUser(savedUsers, user);
			if (!savedUser) {
				savedUsers.users[user.steamId] = {};
			}
			if (user.id) {
				savedUsers.users[user.steamId].id = user.id;
			}
			this.checkUsernameChange(savedUsers, user);
			if (user.username) {
				savedUsers.users[user.steamId].username = user.username;
				savedUsers.steamIds[user.username] = user.steamId;
			}
			for (let key in user.values) {
				if (user.values.hasOwnProperty(key)) {
					if (key !== 'tags') {
						if (user.values[key] === null) {
							delete savedUsers.users[user.steamId][key];
						} else {
							savedUsers.users[user.steamId][key] = user.values[key];
						}
					}
				}
			}
		}
		for (let i = 0, n = list.existing.length; i < n; ++i) {
			let user = list.existing[i];
			this.checkUsernameChange(savedUsers, user);
			for (let key in user.values) {
				if (user.values.hasOwnProperty(key)) {
					if (key !== 'tags') {
						if (user.values[key] === null) {
							delete savedUsers.users[user.steamId][key];
						} else {
							savedUsers.users[user.steamId][key] = user.values[key];
						}
					}
				}
			}
		}
		await this.setValue('users', JSON.stringify(savedUsers));
		await lock.unlock();
	}

	async deleteUserValues(values) {
		const lock = new Lock('user', { threshold: 300 });
		await lock.lock();
		const savedUsers = JSON.parse(this.getValue('users'));
		for (let key in savedUsers.users) {
			if (savedUsers.users.hasOwnProperty(key)) {
				for (let i = 0, n = values.length; i < n; ++i) {
					delete savedUsers.users[key][values[i]];
				}
			}
		}
		await this.setValue('users', JSON.stringify(savedUsers));
		await lock.unlock();
	}

	async getUserId(user) {
		if (user.username) {
			await this.getSteamId(null, false, null, user);
		} else {
			await this.getUsername(null, false, user);
		}
	}

	async checkSync(menu) {
		let currentDate = Date.now();
		let isSyncing = LocalStorage.get('isSyncing');
		if (menu) {
			await setSync();
		} else if (!isSyncing || currentDate - isSyncing > 1800000) {
			let parameters = '';
			LocalStorage.set('isSyncing', currentDate);
			[
				'Groups',
				'Whitelist',
				'Blacklist',
				'SteamFriends',
				'HiddenGames',
				'Games',
				'FollowedGames',
				'WonGames',
				'ReducedCvGames',
				'NoCvGames',
				'HltbTimes',
				'DelistedGames',
				'Giveaways',
				'WonGiveaways',
			].forEach((key) => {
				if (
					Settings.get(`autoSync${key}`) &&
					currentDate - Settings.get(`lastSync${key}`) > Settings.get(`autoSync${key}`) * 86400000
				) {
					parameters += `${key}=1&`;
				}
			});
			if (parameters) {
				if (Settings.get('openAutoSyncNewTab')) {
					Tabs.open(`${Shared.esgst.syncUrl}&autoSync=true&${parameters}`);
				} else {
					runSilentSync(parameters);
				}
			} else {
				LocalStorage.delete('isSyncing');
			}
		}
	}

	async runSilentBackup() {
		const button = Shared.header.addButtonContainer({
			buttonIcon: 'fa fa-sign-out fa-spin',
			buttonName: 'ESGST Backup',
			isActive: true,
			isNotification: true,
			side: 'right',
		});

		button.nodes.buttonIcon.title =
			'ESGST is backing up your data... Please do not close this window.';

		this.esgst.parameters = Object.assign(this.esgst.parameters, { autoBackup: true });
		loadDataManagement('export', false, () => {
			button.nodes.outer.classList.remove('nav__button-container--active');
			button.nodes.outer.classList.add('nav__button-container--inactive');
			button.nodes.buttonIcon.className = 'fa fa-check';
			button.nodes.buttonIcon.title = 'ESGST has finished backing up.';
		});
	}

	async getGameNames(context) {
		const elements = context.getElementsByTagName('a');
		for (let i = elements.length - 1; i > -1; --i) {
			const element = elements[i],
				match = element.getAttribute('href').match(/\/(app|sub)\/(.+)/);
			if (!match) continue;
			const id = match[2];
			try {
				const response = await FetchRequest.get(
					`http://store.steampowered.com/api/${
						match[1] === 'app' ? 'appdetails?appids' : 'packagedetails?packageids'
					}=${id}&filters=basic`
				);
				element.textContent = response.json[id].data.name;
			} catch (e) {
				element.classList.add('esgst-red');
				element.title = 'Unable to retrieve name for this game';
			}
		}
	}

	async lock_and_save_giveaways(giveaways, firstRun) {
		return this.lockAndSaveGiveaways(giveaways, firstRun);
	}

	async lockAndSaveGiveaways(giveaways, firstRun) {
		if (!Object.keys(giveaways).length) return;

		let lock;
		let savedGiveaways;
		if (firstRun) {
			savedGiveaways = this.esgst.giveaways;
		} else {
			lock = new Lock('giveaway', { threshold: 300 });
			await lock.lock();
			savedGiveaways = JSON.parse(this.getValue('giveaways', '{}'));
		}
		for (let key in giveaways) {
			if (giveaways.hasOwnProperty(key)) {
				if (savedGiveaways[key]) {
					for (let subKey in giveaways[key]) {
						if (giveaways[key].hasOwnProperty(subKey)) {
							if (subKey === null) {
								delete savedGiveaways[key][subKey];
							} else {
								savedGiveaways[key][subKey] = giveaways[key][subKey];
							}
						}
					}
				} else {
					savedGiveaways[key] = giveaways[key];
				}
			}
		}
		if (!firstRun) {
			await this.setValue('giveaways', JSON.stringify(savedGiveaways));
			if (lock) {
				await lock.unlock();
			}
		}
	}

	async lockAndSaveDiscussions(discussions) {
		const lock = new Lock('discussion', { threshold: 300 });
		await lock.lock();
		const savedDiscussions = JSON.parse(this.getValue('discussions', '{}'));
		for (let key in discussions) {
			if (discussions.hasOwnProperty(key)) {
				if (savedDiscussions[key]) {
					for (let subKey in discussions[key]) {
						if (discussions[key].hasOwnProperty(subKey)) {
							if (discussions[key][subKey] === null) {
								delete savedDiscussions[key][subKey];
							} else {
								savedDiscussions[key][subKey] = discussions[key][subKey];
							}
						}
					}
				} else {
					savedDiscussions[key] = discussions[key];
				}
				if (!savedDiscussions[key].readComments) {
					savedDiscussions[key].readComments = {};
				}
			}
		}
		await this.setValue('discussions', JSON.stringify(savedDiscussions));
		await lock.unlock();
	}

	async lockAndSaveTickets(items) {
		const lock = new Lock('ticket', { threshold: 300 });
		await lock.lock();
		const saved = JSON.parse(this.getValue('tickets', '{}'));
		for (const key in items) {
			if (items.hasOwnProperty(key)) {
				if (saved[key]) {
					for (const subKey in items[key]) {
						if (items[key].hasOwnProperty(subKey)) {
							if (items[key][subKey] === null) {
								delete saved[key][subKey];
							} else {
								saved[key][subKey] = items[key][subKey];
							}
						}
					}
				} else {
					saved[key] = items[key];
				}
				if (!saved[key].readComments) {
					saved[key].readComments = {};
				}
			}
		}
		await this.setValue('tickets', JSON.stringify(saved));
		await lock.unlock();
	}

	async lockAndSaveTrades(items) {
		const lock = new Lock('trade', { threshold: 300 });
		await lock.lock();
		const saved = JSON.parse(this.getValue('trades', '{}'));
		for (const key in items) {
			if (items.hasOwnProperty(key)) {
				if (saved[key]) {
					for (const subKey in items[key]) {
						if (items[key].hasOwnProperty(subKey)) {
							if (items[key][subKey] === null) {
								delete saved[key][subKey];
							} else {
								saved[key][subKey] = items[key][subKey];
							}
						}
					}
				} else {
					saved[key] = items[key];
				}
				if (!saved[key].readComments) {
					saved[key].readComments = {};
				}
			}
		}
		await this.setValue('trades', JSON.stringify(saved));
		await lock.unlock();
	}

	async lockAndSaveGroups(groups, sync) {
		const lock = new Lock('group', { threshold: 300 });
		await lock.lock();
		let savedGroups = JSON.parse(this.getValue('groups', '[]'));
		if (!Array.isArray(savedGroups)) {
			const newGroups = [];
			for (const key in savedGroups) {
				if (savedGroups.hasOwnProperty(key)) {
					newGroups.push(savedGroups[key]);
				}
			}
			savedGroups = newGroups;
		}
		if (sync) {
			for (const group of savedGroups) {
				if (group) {
					delete group.member;
				}
			}
		}
		for (const code in groups) {
			if (groups.hasOwnProperty(code)) {
				const group = groups[code];
				let savedGroup = savedGroups.filter((item) => item.code === code)[0];
				if (savedGroup) {
					for (const key in group) {
						if (group.hasOwnProperty(key)) {
							savedGroup[key] = group[key];
						}
					}
				} else {
					savedGroup = group;
					savedGroups.push(savedGroup);
				}
				if (!savedGroup.avatar || !savedGroup.steamId) {
					const html = (await FetchRequest.get(`/group/${code}/`)).html;
					savedGroup.avatar = html
						.getElementsByClassName('global__image-inner-wrap')[0]
						.style.backgroundImage.match(/\/avatars\/(.+)_full/)[1];
					savedGroup.steamId = html
						.getElementsByClassName('sidebar__shortcut-inner-wrap')[0]
						.firstElementChild.getAttribute('href')
						.match(/\d+/)[0];
				}
			}
		}
		await this.setValue('groups', JSON.stringify(savedGroups));
		await lock.unlock();
	}

	lookForPopups(response) {
		const popup = response.html.querySelector(`.popup--gift-sent, .popup--gift-received`);
		if (!popup) {
			return;
		}
		document.body.appendChild(popup);
		new Popup({ addScrollable: true, icon: '', isTemp: true, title: '', popup: popup }).open();
		if (!this.esgst.st) {
			return;
		}
		const links = popup.querySelectorAll('a');
		for (const link of links) {
			const url = link.getAttribute('href');
			if (!url) {
				continue;
			}
			link.setAttribute('href', url.replace(/^\//, `https://www.steamgifts.com/`));
		}
	}

	async getWonGames(syncer) {
		const savedGames = JSON.parse(this.getValue('games'));
		const to_save = { apps: {}, subs: {} };
		for (const id in savedGames.apps) {
			if (savedGames.apps.hasOwnProperty(id)) {
				if (savedGames.apps[id].won) {
					to_save.apps[id] = { won: null };
				}
			}
		}
		for (const id in savedGames.subs) {
			if (savedGames.subs.hasOwnProperty(id)) {
				if (savedGames.subs[id].won) {
					to_save.subs[id] = { won: null };
				}
			}
		}
		let lastPage = null,
			nextPage = 1,
			pagination = null;
		do {
			syncer.progressBar.setMessage(
				`Syncing your won games (page ${nextPage}${lastPage ? ` of ${lastPage}` : ''})...`
			);
			const responseHtml = (await FetchRequest.get(`/giveaways/won/search?page=${nextPage}`)).html;
			const elements = responseHtml.getElementsByClassName('table__row-outer-wrap');
			if (!lastPage) {
				lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(responseHtml);
			}
			for (const element of elements) {
				if (element.querySelector(`.table__gift-feedback-not-received:not(.is-hidden)`)) {
					continue;
				}
				const info = await this.esgst.modules.games.games_getInfo(element);
				if (!info) {
					continue;
				}
				to_save[info.type][info.id] = {
					won:
						parseInt(element.querySelector(`[data-timestamp]`).getAttribute('data-timestamp')) *
						1e3,
				};
			}
			nextPage += 1;
			pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
		} while (
			!syncer.canceled &&
			pagination &&
			!pagination.lastElementChild.classList.contains('is-selected')
		);
		await this.lockAndSaveGames(to_save);
	}

	saveAndSortContent(array, key, options) {
		this.sortContent(array, options.value);
		// noinspection JSIgnoredPromiseFromCall
		this.setSetting(key, options.value);
	}

	observeChange(context, id, save = null, key = 'value', event = 'change') {
		context.addEventListener(event, () => {
			let value = context[key];
			Settings.set(id, value);
			if (save) {
				if (typeof save === 'object') {
					save[id] = value;
				} else {
					this.setSetting(id, value);
				}
			}
		});
	}

	observeNumChange(context, id, save = null, key = 'value') {
		Settings.set(id, parseFloat(Settings.get(id)));
		context.addEventListener('change', () => {
			let value = parseFloat(context[key]);
			// noinspection JSIgnoredPromiseFromCall
			Settings.set(id, value);
			if (save) {
				if (typeof save === 'object') {
					save[id] = value;
				} else {
					this.setSetting(id, value);
				}
			}
		});
	}

	async checkMissingDiscussions(refresh, callback) {
		let rows = document.getElementsByClassName('table__rows');
		let numDiscussions = 0;
		let numDeals = 0;
		let filteredDiscussions = 0;
		let filteredDeals = 0;
		let discussionsIndex = 1;
		let dealsIndex = 0;
		if (Settings.get('oadd') || Settings.get('rad')) {
			discussionsIndex = 0;
			dealsIndex = 1;
		}
		if (refresh) {
			rows[discussionsIndex].innerHTML = '';
			rows[dealsIndex].innerHTML = '';
		} else {
			let preset = null;
			if (Settings.get('df') && Settings.get('df_m') && Settings.get('df_enable')) {
				let name = Settings.get('df_preset');
				if (name) {
					let i;
					for (
						i = Settings.get('df_presets').length - 1;
						i > -1 && Settings.get('df_presets')[i].name !== name;
						i--
					) {}
					if (i > -1) {
						preset = Settings.get('df_presets')[i];
					}
				}
			}
			if (preset) {
				const filters = this.esgst.modules.discussionsDiscussionFilters.getFilters();
				(
					await this.esgst.modules.discussions.discussions_get(rows[discussionsIndex], true)
				).forEach((discussion) => {
					if (
						!this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
							filters,
							discussion,
							preset.rules
						)
					) {
						// @ts-ignore
						discussion.outerWrap.remove();
						filteredDiscussions += 1;
					} else {
						numDiscussions += 1;
					}
				});
				(await this.esgst.modules.discussions.discussions_get(rows[dealsIndex], true)).forEach(
					(deal) => {
						if (
							!this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
								filters,
								deal,
								preset.rules
							)
						) {
							// @ts-ignore
							deal.outerWrap.remove();
							filteredDeals += 1;
						} else {
							numDeals += 1;
						}
					}
				);
			} else {
				numDiscussions = (
					await this.esgst.modules.discussions.discussions_get(rows[discussionsIndex], true)
				).length;
				numDeals = (await this.esgst.modules.discussions.discussions_get(rows[dealsIndex], true))
					.length;
			}
		}
		if (numDiscussions < 5 || numDeals < 5) {
			let [response1, response2] = await Promise.all([
				FetchRequest.get('/discussions'),
				FetchRequest.get('/discussions/deals'),
			]);
			let revisedElements = [];
			let preset = null;
			if (Settings.get('df') && Settings.get('df_m') && Settings.get('df_enable')) {
				let name = Settings.get('df_preset');
				if (name) {
					let i;
					for (
						i = Settings.get('df_presets').length - 1;
						i > -1 && Settings.get('df_presets')[i].name !== name;
						i--
					) {}
					if (i > -1) {
						preset = Settings.get('df_presets')[i];
					}
				}
			}
			(await this.esgst.modules.discussions.discussions_get(response1.html, true)).forEach(
				(element) => {
					// @ts-ignore
					if (element.category !== 'Deals') {
						revisedElements.push(element);
					}
				}
			);
			const filters = this.esgst.modules.discussionsDiscussionFilters.getFilters();
			let i = revisedElements.length - (numDiscussions + filteredDiscussions + 1);
			while (numDiscussions < 5 && i > -1) {
				if (
					!preset ||
					this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
						filters,
						revisedElements[i],
						preset.rules
					)
				) {
					this.setMissingDiscussion(revisedElements[i]);
					rows[discussionsIndex].appendChild(revisedElements[i].outerWrap);
					numDiscussions += 1;
				}
				i -= 1;
			}
			let elements = await this.esgst.modules.discussions.discussions_get(response2.html, true);
			i = elements.length - (numDeals + filteredDeals + 1);
			while (numDeals < 5 && i > -1) {
				if (
					!preset ||
					this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
						filters,
						elements[i],
						preset.rules
					)
				) {
					this.setMissingDiscussion(elements[i]);
					// @ts-ignore
					rows[dealsIndex].appendChild(elements[i].outerWrap);
					numDeals += 1;
				}
				i -= 1;
			}
			if (Settings.get('adots')) {
				this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load(refresh);
			} else if (Settings.get('radb') && !refresh) {
				this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
			}
			if (refresh) {
				await this.endless_load(this.esgst.activeDiscussions);
			}
			if (callback) {
				callback();
			}
		} else {
			if (Settings.get('adots')) {
				this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load();
			} else if (Settings.get('radb') && !refresh) {
				this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
			}
			if (callback) {
				callback();
			}
		}
	}

	loadDM() {
		const options = {
			items: [
				{
					check: true,
					name: 'View recent username changes',
					callback: this.setSMRecentUsernameChanges.bind(this),
				},
				{
					check: Settings.get('uf'),
					name: 'See list of filtered users',
					callback: this.setSMManageFilteredUsers.bind(this),
				},
				{
					check: this.esgst.sg && Settings.get('gf') && Settings.get('gf_s'),
					name: 'Manage hidden giveaways',
					callback: this.setSMManageFilteredGiveaways.bind(this),
				},
				{
					click: true,
					check: this.esgst.sg && Settings.get('df') && Settings.get('df_s'),
					name: 'Manage hidden discussions',
					callback: this.esgst.modules.discussionsDiscussionFilters.df_menu.bind(
						this.esgst.modules.discussionsDiscussionFilters,
						{}
					),
				},
				{
					click: true,
					check: this.esgst.st && Settings.get('tf') && Settings.get('tf_s'),
					name: 'Manage hidden trades',
					callback: this.esgst.modules.tradesTradeFilters.tf_menu.bind(
						this.esgst.modules.tradesTradeFilters,
						{}
					),
				},
				{
					check: this.esgst.sg && Settings.get('dt'),
					name: 'Manage discussion tags',
					callback: this.openManageDiscussionTagsPopup.bind(this),
				},
				{
					check: this.esgst.sg && Settings.get('ut'),
					name: 'Manage user tags',
					callback: this.openManageUserTagsPopup.bind(this),
				},
				{
					check: Settings.get('gt'),
					name: 'Manage game tags',
					callback: this.openManageGameTagsPopup.bind(this),
				},
				{
					check: Settings.get('gpt'),
					name: 'Manage group tags',
					callback: this.openManageGroupTagsPopup.bind(this),
				},
				{
					click: true,
					check: Settings.get('wbc'),
					name: 'Manage Whitelist / Blacklist Checker caches',
					callback: this.esgst.modules.usersWhitelistBlacklistChecker.wbc_addButton.bind(
						this.esgst.modules.usersWhitelistBlacklistChecker,
						false
					),
				},
				{
					click: true,
					check: Settings.get('namwc'),
					name: 'Manage Not Activated / Multiple Wins Checker caches',
					callback: this.esgst.modules.usersNotActivatedMultipleWinChecker.namwc_setPopup.bind(
						this.esgst.modules.usersNotActivatedMultipleWinChecker
					),
				},
			],
		};
		const context = this.esgst.sidebar.nextElementSibling;
		context.setAttribute('data-esgst-popup', true);
		context.innerHTML = '';
		this.esgst.mainPageHeading = PageHeading.create('sm', [
			{
				name: 'ESGST',
				url: this.esgst.settingsUrl,
			},
			{
				name: 'Data Management',
				url: this.esgst.dataManagementUrl,
			},
		]).insert(context, 'beforeend').nodes.outer;
		for (const item of options.items) {
			const button = Button.create([
				{
					color: 'green',
					icons: [],
					name: 'Open',
					onClick: item.click ? null : () => item.callback(button),
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Opening...',
				},
			]).build().nodes.outer;
			if (item.click) {
				item.callback(button);
			}
			item.content = [button];
		}
		this.createFormRows(context, 'beforeend', options);
	}

	async setSMManageFilteredGiveaways() {
		let gfGiveaways, giveaway, hidden, i, key, n, popup;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-gift',
			isTemp: true,
			title: 'Hidden Giveaways',
		});
		hidden = [];
		const now = Date.now();
		for (key in this.esgst.giveaways) {
			if (this.esgst.giveaways.hasOwnProperty(key)) {
				giveaway = this.esgst.giveaways[key];
				if (giveaway.hidden && giveaway.code && giveaway.endTime) {
					if (now >= giveaway.endTime) {
						delete giveaway.hidden;
					} else {
						hidden.push(giveaway);
					}
				} else {
					delete giveaway.hidden;
				}
			}
		}
		hidden = hidden.sort((a, b) => {
			if (a.hidden > b.hidden) {
				return -1;
			} else if (a.hidden < b.hidden) {
				return 1;
			} else {
				return 0;
			}
		});
		// noinspection JSIgnoredPromiseFromCall
		this.setValue('giveaways', JSON.stringify(this.esgst.giveaways));
		i = 0;
		n = hidden.length;
		gfGiveaways = this.createElements(popup.scrollable, 'beforeend', [
			{
				attributes: {
					class: 'esgst-text-left',
				},
				type: 'div',
			},
		]);
		if (n > 0) {
			const button = Button.create([
				{
					color: 'green',
					icons: ['fa-plus'],
					name: 'Load more...',
					onClick: () => {
						return new Promise((resolve) => {
							// noinspection JSIgnoredPromiseFromCall
							this.loadGfGiveaways(i, i + 5, hidden, gfGiveaways, popup, (value) => {
								i = value;
								if (i > n) {
									button.destroy();
								} else if (
									Settings.get('es_gf') &&
									popup.scrollable.scrollHeight <= popup.scrollable.offsetHeight
								) {
									button.onClick();
								}
								resolve();
							});
						});
					},
				},
				{
					template: 'loading',
					isDisabled: true,
					name: 'Loading more...',
				},
			]).insert(popup.description, 'beforeend');
			popup.open();
			button.onClick();
			if (Settings.get('es_gf')) {
				popup.scrollable.addEventListener('scroll', () => {
					if (
						popup.scrollable.scrollTop + popup.scrollable.offsetHeight >=
							popup.scrollable.scrollHeight &&
						!button.isBusy
					) {
						button.onClick();
					}
				});
			}
		} else {
			gfGiveaways.textContent = 'No hidden giveaways found.';
			popup.open();
		}
	}

	async loadGfGiveaways(i, n, hidden, gfGiveaways, popup, callback) {
		let giveaway;
		if (i < n) {
			if (hidden[i]) {
				let response = await FetchRequest.get(
					`https://www.steamgifts.com/giveaway/${hidden[i].code}/`,
					{
						queue: true,
					}
				);
				giveaway = await this.buildGiveaway(response.html, response.url);
				if (giveaway) {
					this.createElements(gfGiveaways, 'beforeend', giveaway.html);
					await this.endless_load(gfGiveaways.lastElementChild, false, 'gf');
					window.setTimeout(
						() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback),
						0
					);
				} else {
					window.setTimeout(
						() => this.loadGfGiveaways(++i, n, hidden, gfGiveaways, popup, callback),
						0
					);
				}
			} else {
				callback(i + 1);
			}
		} else {
			callback(i);
		}
	}

	async openManageDiscussionTagsPopup() {
		let context, input, popup, savedDiscussion, savedDiscussions, discussions;
		popup = new Popup({
			addScrollable: true,
			isTemp: true,
		});
		const heading = PageHeading.create('dt', ['Manage discussion tags']).insert(
			popup.description,
			'afterbegin'
		);
		input = this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					type: 'text',
				},
				type: 'input',
			},
		]);
		this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description',
				},
				text: 'Type tags below to filter the discussions by.',
				type: 'div',
			},
		]);
		if (Settings.get('mm')) {
			this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
		}
		savedDiscussions = JSON.parse(this.getValue('discussions'));
		discussions = {};
		for (const key in savedDiscussions) {
			if (savedDiscussions.hasOwnProperty(key)) {
				savedDiscussion = savedDiscussions[key];
				if (
					savedDiscussion.tags &&
					(savedDiscussion.tags.length > 1 ||
						(savedDiscussion.tags[0] && savedDiscussion.tags[0].trim()))
				) {
					context = this.createElements(popup.scrollable, 'beforeend', [
						{
							type: 'div',
							children: [
								{
									attributes: {
										class: 'esgst-dt-menu',
										href: `https://www.steamgifts.com/discussion/${key}/`,
									},
									text: savedDiscussion.name || key,
									type: 'a',
								},
							],
						},
					]);
					discussions[key] = {
						context: context,
					};
				}
			}
		}
		await this.endless_load(popup.scrollable);
		input.addEventListener('input', this.filterDiscussionTags.bind(this, discussions));
		popup.open();
	}

	filterDiscussionTags(discussions, event) {
		let i, tags, key, userTags;
		if (event.currentTarget.value) {
			tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
			for (key in discussions) {
				if (discussions.hasOwnProperty(key)) {
					userTags = discussions[key].context.getElementsByClassName('esgst-tags')[0];
					for (
						i = tags.length - 1;
						i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`));
						--i
					) {}
					if (i < 0) {
						discussions[key].context.classList.add('esgst-hidden');
					} else {
						discussions[key].context.classList.remove('esgst-hidden');
					}
				}
			}
		} else {
			for (key in discussions) {
				if (discussions.hasOwnProperty(key)) {
					discussions[key].context.classList.remove('esgst-hidden');
				}
			}
		}
	}

	async openManageUserTagsPopup() {
		let context, input, popup, savedUser, savedUsers, users;
		popup = new Popup({
			addScrollable: true,
			isTemp: true,
		});
		const heading = PageHeading.create('ut', ['Manage user tags']).insert(
			popup.description,
			'afterbegin'
		);
		input = this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					type: 'text',
				},
				type: 'input',
			},
		]);
		this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description',
				},
				text: 'Type tags below to filter the users by.',
				type: 'div',
			},
		]);
		if (Settings.get('mm')) {
			this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
		}
		savedUsers = JSON.parse(this.getValue('users'));
		users = {};
		for (const steamId in savedUsers.users) {
			if (savedUsers.users.hasOwnProperty(steamId)) {
				savedUser = savedUsers.users[steamId];
				if (
					savedUser.tags &&
					(savedUser.tags.length > 1 || (savedUser.tags[0] && savedUser.tags[0].trim()))
				) {
					const attributes = {};
					if (savedUser.username) {
						attributes['data-sg'] = true;
						attributes.href = `https://www.steamgifts.com/user/${savedUser.username}`;
					} else {
						attributes['data-st'] = true;
						attributes.href = `https://www.steamtrades.com/user/${steamId}`;
					}
					context = this.createElements(popup.scrollable, 'beforeend', [
						{
							type: 'div',
							children: [
								{
									attributes,
									text: savedUser.username || steamId,
									type: 'a',
								},
							],
						},
					]);
					users[savedUser.username || steamId] = {
						context: context,
					};
				}
			}
		}
		await this.endless_load(popup.scrollable);
		input.addEventListener('input', this.filterUserTags.bind(this, users));
		popup.open();
	}

	filterUserTags(users, event) {
		let i, tags, username, userTags;
		if (event.currentTarget.value) {
			tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
			for (username in users) {
				if (users.hasOwnProperty(username)) {
					userTags = users[username].context.getElementsByClassName('esgst-tags')[0];
					for (
						i = tags.length - 1;
						i >= 0 && !userTags.innerHTML.match(new RegExp(`>${tags[i]}<`));
						--i
					) {}
					if (i < 0) {
						users[username].context.classList.add('esgst-hidden');
					} else {
						users[username].context.classList.remove('esgst-hidden');
					}
				}
			}
		} else {
			for (username in users) {
				if (users.hasOwnProperty(username)) {
					users[username].context.classList.remove('esgst-hidden');
				}
			}
		}
	}

	async openManageGameTagsPopup() {
		let context, games, input, popup, savedGame, savedGames;
		popup = new Popup({
			addScrollable: true,
			isTemp: true,
		});
		const heading = PageHeading.create('gt', ['Manage game tags']).insert(
			popup.description,
			'afterbegin'
		);
		input = this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					type: 'text',
				},
				type: 'input',
			},
		]);
		this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description',
				},
				text: 'Type tags below to filter the games by.',
				type: 'div',
			},
		]);
		if (Settings.get('mm')) {
			this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
		}
		savedGames = JSON.parse(this.getValue('games'));
		games = {
			apps: {},
			subs: {},
		};
		for (const id in savedGames.apps) {
			if (savedGames.apps.hasOwnProperty(id)) {
				savedGame = savedGames.apps[id];
				if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
					context = this.createElements(popup.scrollable, 'beforeend', [
						{
							attributes: {
								class: 'table__row-outer-wrap',
							},
							type: 'div',
							children: [
								{
									attributes: {
										class: 'table__column__heading',
										href: `http://store.steampowered.com/app/${id}`,
									},
									text: `App - ${id}`,
									type: 'a',
								},
							],
						},
					]);
					games.apps[id] = {
						context: context,
					};
				}
			}
		}
		for (const id in savedGames.subs) {
			if (savedGames.subs.hasOwnProperty(id)) {
				savedGame = savedGames.subs[id];
				if (savedGame.tags && (savedGame.tags.length > 1 || savedGame.tags[0].trim())) {
					context = this.createElements(popup.scrollable, 'beforeend', [
						{
							attributes: {
								class: 'table__row-outer-wrap',
							},
							type: 'div',
							children: [
								{
									attributes: {
										class: 'table__column__heading',
										href: `http://store.steampowered.com/sub/${id}`,
									},
									text: `Sub - ${id}`,
									type: 'a',
								},
							],
						},
					]);
					games.subs[id] = {
						context: context,
					};
				}
			}
		}
		await this.endless_load(popup.scrollable);
		input.addEventListener('input', this.filterGameTags.bind(this, games));
		popup.open();
	}

	filterGameTags(games, event) {
		let gameTags, i, id, tags;
		if (event.currentTarget.value) {
			tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
			for (id in games.apps) {
				if (games.apps.hasOwnProperty(id)) {
					gameTags = games.apps[id].context.getElementsByClassName('esgst-tags')[0];
					for (
						i = tags.length - 1;
						i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`));
						--i
					) {}
					if (i < 0) {
						games.apps[id].context.classList.add('esgst-hidden');
					} else {
						games.apps[id].context.classList.remove('esgst-hidden');
					}
				}
			}
			for (id in games.subs) {
				if (games.subs.hasOwnProperty(id)) {
					gameTags = games.subs[id].context.getElementsByClassName('esgst-tags')[0];
					for (
						i = tags.length - 1;
						i >= 0 && !gameTags.innerHTML.match(new RegExp(`>${tags[i]}<`));
						--i
					) {}
					if (i < 0) {
						games.subs[id].context.classList.add('esgst-hidden');
					} else {
						games.subs[id].context.classList.remove('esgst-hidden');
					}
				}
			}
		} else {
			for (id in games.apps) {
				if (games.apps.hasOwnProperty(id)) {
					games.apps[id].context.classList.remove('esgst-hidden');
				}
			}
			for (id in games.subs) {
				if (games.subs.hasOwnProperty(id)) {
					games.subs[id].context.classList.remove('esgst-hidden');
				}
			}
		}
	}

	async openManageGroupTagsPopup() {
		let context, input, popup, savedGroups, groups;
		popup = new Popup({
			addScrollable: true,
			isTemp: true,
		});
		const heading = PageHeading.create('gpt', ['Manage group tags']).insert(
			popup.description,
			'afterbegin'
		);
		input = this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					type: 'text',
				},
				type: 'input',
			},
		]);
		this.createElements(popup.description, 'beforeend', [
			{
				attributes: {
					class: 'esgst-description',
				},
				text: 'Type tags below to filter the groups by.',
				type: 'div',
			},
		]);
		if (Settings.get('mm')) {
			this.esgst.modules.generalMultiManager.mm(heading.nodes.outer);
		}
		savedGroups = JSON.parse(this.getValue('groups'));
		groups = {};
		for (const savedGroup of savedGroups) {
			if (
				!savedGroup ||
				!savedGroup.tags ||
				(savedGroup.tags.length < 2 && (!savedGroup.tags[0] || !savedGroup.tags[0].trim()))
			) {
				continue;
			}
			context = this.createElements(popup.scrollable, 'beforeend', [
				{
					type: 'div',
					children: [
						{
							attributes: {
								href: `https://www.steamgifts.com/group/${savedGroup.code}/`,
							},
							text: savedGroup.name,
							type: 'a',
						},
					],
				},
			]);
			groups[savedGroup.code] = {
				context: context,
			};
		}
		await this.endless_load(popup.scrollable);
		input.addEventListener('input', this.filterGroupTags.bind(this, groups));
		popup.open();
	}

	filterGroupTags(groups, event) {
		let i, tags, code, groupTags;
		if (event.currentTarget.value) {
			tags = event.currentTarget.value.replace(/,\s+/g, '').split(/,\s/);
			for (code in groups) {
				if (groups.hasOwnProperty(code)) {
					groupTags = groups[code].context.getElementsByClassName('esgst-tags')[0];
					for (
						i = tags.length - 1;
						i >= 0 && !groupTags.innerHTML.match(new RegExp(`>${tags[i]}<`));
						--i
					) {}
					if (i < 0) {
						groups[code].context.classList.add('esgst-hidden');
					} else {
						groups[code].context.classList.remove('esgst-hidden');
					}
				}
			}
		} else {
			for (code in groups) {
				if (groups.hasOwnProperty(code)) {
					groups[code].context.classList.remove('esgst-hidden');
				}
			}
		}
	}

	async setSMRecentUsernameChanges() {
		const popup = new Popup({
			addProgress: true,
			addScrollable: true,
			icon: 'fa-comments',
			title: 'Recent Username Changes',
		});
		const hasPermissions = await permissions.contains([['server']]);
		if (!hasPermissions) {
			DOM.insert(
				popup.description,
				'beforeend',
				<div>
					<i className="fa fa-times"></i>
					<span>
						No permissions granted for https://rafaelgssa.com. Please grant the permissions on the
						settings menu so that the data can be retrieved from the ESGST API.
					</span>
				</div>
			);
			popup.open();
			return;
		}
		popup.progressBar.setLoading('Loading recent username changes...').show();
		DOM.insert(
			popup.scrollable,
			'beforeend',
			<div className="esgst-uh-popup" ref={(ref) => (popup.results = ref)}></div>
		);
		popup.open();
		try {
			const recentChanges = await this.getRecentChanges();
			popup.progressBar.reset().hide();
			DOM.insert(
				popup.results,
				'atinner',
				<fragment>
					{recentChanges.map((change) => (
						<div>
							{`${change.usernames[1]} changed to `}
							<a href={`/user/${change.usernames[0]}`} className="esgst-bold">
								{change.usernames[0]}
							</a>
						</div>
					))}
				</fragment>
			);
			if (Shared.esgst.sg) {
				// noinspection JSIgnoredPromiseFromCall
				this.endless_load(popup.results);
			}
		} catch (err) {
			Logger.warning(err);
			popup.progressBar.setError('Failed to load recent changes. Please try again later.');
		}
	}

	async getRecentChanges() {
		const response = await FetchRequest.get(
			'https://rafaelgssa.com/esgst/users/uh?format_array=true&show_recent=true'
		);
		return response.json.result.found;
	}

	updateWhitelistBlacklist(key, profile, event) {
		let user;
		user = {
			steamId: profile.steamId,
			id: profile.id,
			username: profile.username,
			values: {},
		};
		if (!event || event.currentTarget.classList.contains('is-selected')) {
			user.values[key] = false;
		} else {
			user.values[key] = true;
			user.values[`${key}Date`] = Date.now();
		}
		// noinspection JSIgnoredPromiseFromCall
		this.saveUser(null, null, user);
	}

	/**
	 * @param id
	 * @param type
	 * @param [unhide]
	 * @returns {Promise<void>}
	 */
	async updateHiddenGames(id, type, unhide) {
		if (!Settings.get('updateHiddenGames')) {
			return;
		}
		const games = {
			apps: {},
			subs: {},
		};
		games[type][id] = {
			hidden: unhide ? null : true,
		};
		await this.lockAndSaveGames(games);
	}

	checkBackup() {
		console.log('Checking backup...');
		let currentDate = Date.now();
		let isBackingUp = parseInt(LocalStorage.get('isBackingUp'));
		console.log(currentDate, isBackingUp);
		if (
			(!isBackingUp || currentDate - isBackingUp > 1800000) &&
			currentDate - Settings.get('lastBackup') > Settings.get('autoBackup_days') * 86400000
		) {
			LocalStorage.set('isBackingUp', currentDate);
			if (Settings.get('openAutoBackupNewTab')) {
				Tabs.open(`${Shared.esgst.backupUrl}&autoBackupIndex=${Settings.get('autoBackup_index')}`);
			} else {
				this.runSilentBackup();
			}
		}
	}

	async downloadZip(data, fileName, zipName) {
		this.downloadFile(null, zipName, await this.getZip(JSON.stringify(data), fileName));
	}

	async getZip(data, fileName, type = 'blob') {
		const zip = new JSZip();
		zip.file(fileName, data);
		return await zip.generateAsync({
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9,
			},
			// @ts-ignore
			type: type,
		});
	}

	async readZip(data) {
		const zip = new JSZip();

		//** @type {ZipFile} */
		const contents = await zip.loadAsync(data);
		const keys = Object.keys(contents.files),
			output = [];
		for (const key of keys) {
			output.push({
				name: key,
				value: await zip.file(key).async('text'),
			});
		}
		return output;
	}

	downloadFile(data, fileName, blob) {
		const url = window.URL.createObjectURL(blob || new Blob([data])),
			file = document.createElement('a');
		file.download = fileName;
		file.href = url;
		document.body.appendChild(file);
		file.click();
		file.remove();
		window.URL.revokeObjectURL(url);
	}

	async lockAndSaveGames(games) {
		const lock = new Lock('game', { threshold: 300 });
		await lock.lock();
		let saved = JSON.parse(this.getValue('games'));
		if (games.apps) {
			for (let key in games.apps) {
				if (games.apps.hasOwnProperty(key)) {
					if (saved.apps[key]) {
						for (let subKey in games.apps[key]) {
							if (games.apps[key].hasOwnProperty(subKey)) {
								if (games.apps[key][subKey] === null) {
									delete saved.apps[key][subKey];
								} else {
									saved.apps[key][subKey] = games.apps[key][subKey];
								}
							}
						}
					} else {
						saved.apps[key] = games.apps[key];
					}
					if (!saved.apps[key].tags) {
						delete saved.apps[key].tags;
					}
				}
			}
		}
		if (games.subs) {
			for (let key in games.subs) {
				if (games.subs.hasOwnProperty(key)) {
					if (saved.subs[key]) {
						for (let subKey in games.subs[key]) {
							if (games.subs[key].hasOwnProperty(subKey)) {
								if (games.subs[key][subKey] === null) {
									delete saved.subs[key][subKey];
								} else {
									saved.subs[key][subKey] = games.subs[key][subKey];
								}
							}
						}
					} else {
						saved.subs[key] = games.subs[key];
					}
					if (!saved.subs[key].tags) {
						delete saved.subs[key].tags;
					}
				}
			}
		}
		await this.setValue('games', JSON.stringify(saved));
		await lock.unlock();
	}

	async setSMManageFilteredUsers() {
		/** @type {Popup} */
		let popup;
		if (popup) {
			popup.open();
		} else {
			popup = new Popup({ addScrollable: true, icon: 'fa-eye-slash', title: 'Filtered Users' });
			let users = JSON.parse(this.getValue('users'));
			let filtered = [];
			for (let key in users.users) {
				if (users.users.hasOwnProperty(key)) {
					const data = Shared.esgst.modules.usersUserFilters.fixData(users.users[key].uf);
					if (
						data &&
						(data.giveawayPosts || data.giveaways || data.discussionPosts || data.discussions)
					) {
						filtered.push(users.users[key]);
					}
				}
			}
			filtered.sort((a, b) => {
				if (a.username > b.username) {
					return -1;
				} else {
					return 1;
				}
			});
			let table = this.createElements(popup.scrollable, 'beforeend', [
				{
					attributes: {
						class: 'table',
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
										class: 'table__column--width-fill',
									},
									text: 'Username',
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: 'Discussions Hidden',
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: 'Discussion Posts Hidden',
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: 'Giveaways Hidden',
									type: 'div',
								},
								{
									attributes: {
										class: 'table__column--width-small',
									},
									text: 'Giveaway Posts Hidden',
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
			]);
			for (let i = 0, n = filtered.length; i < n; ++i) {
				const discussionsIcon = filtered[i].uf.discussions ? 'fa fa-check' : '';
				const discussionPostsIcon = filtered[i].uf.discussionPosts ? 'fa fa-check' : '';
				const giveawaysIcon = filtered[i].uf.giveaways ? 'fa fa-check' : '';
				const giveawayPostsIcon = filtered[i].uf.giveawayPosts ? 'fa fa-check' : '';
				this.createElements(table.lastElementChild, 'beforeend', [
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
											class: 'table__column--width-fill',
										},
										type: 'div',
										children: [
											{
												attributes: {
													href: `/user/${filtered[i].username}`,
												},
												text: filtered[i].username,
												type: 'a',
											},
										],
									},
									{
										attributes: {
											class: 'table__column--width-small',
										},
										type: 'div',
										children: discussionsIcon
											? [
													{
														attributes: {
															class: discussionsIcon,
														},
														type: 'i',
													},
											  ]
											: null,
									},
									{
										attributes: {
											class: 'table__column--width-small',
										},
										type: 'div',
										children: discussionPostsIcon
											? [
													{
														attributes: {
															class: discussionPostsIcon,
														},
														type: 'i',
													},
											  ]
											: null,
									},
									{
										attributes: {
											class: 'table__column--width-small',
										},
										type: 'div',
										children: giveawaysIcon
											? [
													{
														attributes: {
															class: giveawaysIcon,
														},
														type: 'i',
													},
											  ]
											: null,
									},
									{
										attributes: {
											class: 'table__column--width-small',
										},
										type: 'div',
										children: giveawayPostsIcon
											? [
													{
														attributes: {
															class: giveawayPostsIcon,
														},
														type: 'i',
													},
											  ]
											: null,
									},
								],
							},
						],
					},
				]);
			}
			popup.open();
		}
	}

	/**
	 * @param {import('../constants/ClassNames').ButtonColor} choice1Color
	 * @param {string} choice1Icon
	 * @param {string} choice1Title
	 * @param {import('../constants/ClassNames').ButtonColor} choice2Color
	 * @param {string} choice2Icon
	 * @param {string} choice2Title
	 * @param {*} title
	 * @param {*} onChoice1
	 * @param {*} onChoice2
	 */
	multiChoice(
		choice1Color,
		choice1Icon,
		choice1Title,
		choice2Color,
		choice2Icon,
		choice2Title,
		title,
		onChoice1,
		onChoice2
	) {
		if (Settings.get('cfh_img_remember')) {
			if (Settings.get('cfh_img_choice') === 1) {
				onChoice1();
			} else {
				onChoice2();
			}
		} else {
			let popup = new Popup({ addScrollable: true, icon: 'fa-list', isTemp: true, title: title });
			new ToggleSwitch(
				popup.description,
				'cfh_img_remember',
				false,
				'Never ask again.',
				false,
				false,
				'Remembers which option you choose forever.',
				Settings.get('cfh_img_remember')
			);
			Button.create({
				color: choice1Color,
				icons: [choice1Icon],
				name: choice1Title,
				onClick: () => {
					return new Promise((resolve) => {
						if (Settings.get('cfh_img_remember')) {
							// noinspection JSIgnoredPromiseFromCall
							this.setSetting('cfh_img_choice', 1);
						}
						resolve();
						popup.close();
						onChoice1();
					});
				},
			}).insert(popup.description, 'beforeend');
			Button.create({
				color: choice2Color,
				icons: [choice2Icon],
				name: choice2Title,
				onClick: () => {
					return new Promise((resolve) => {
						if (Settings.get('cfh_img_remember')) {
							// noinspection JSIgnoredPromiseFromCall
							this.setSetting('cfh_img_choice', 2);
						}
						resolve();
						popup.close();
						onChoice2();
					});
				},
			}).insert(popup.description, 'beforeend');
			popup.open();
		}
	}

	async exportSettings() {
		//** @type {EsgstSettings} */
		let settings = JSON.parse(this.getValue('settings', '{}'));
		let data = { settings, v: this.getValue('v') };

		delete data.settings.avatar;
		delete data.settings.lastSync;
		delete data.settings.steamApiKey;
		delete data.settings.steamId;
		delete data.settings.syncFrequency;
		delete data.settings.username_sg;
		delete data.settings.username_st;
		const name = `${
			Settings.get('askFileName')
				? window.prompt(
						`Enter the name of the file:`,
						`esgst_settings_${new Date().toISOString().replace(/:/g, '_')}`
				  )
				: `esgst_settings_${new Date().toISOString().replace(/:/g, '_')}`
		}.json`;
		if (name === 'null.json') return;
		this.downloadFile(JSON.stringify(data), name);
	}

	async selectSwitches(switches, type, settings) {
		const toSave = [];
		for (const key in switches) {
			if (switches.hasOwnProperty(key)) {
				const toggleSwitch = switches[key];
				if (Array.isArray(toggleSwitch)) {
					toSave.push({
						id: toggleSwitch[0].id,
						value: await toggleSwitch[0][type](settings),
						sg: toggleSwitch[0].sg,
						st: toggleSwitch[0].st,
					});
				} else if (!toggleSwitch.checkbox || toggleSwitch.checkbox.offsetParent) {
					toSave.push({
						id: toggleSwitch.id,
						value: await toggleSwitch[type](settings),
						sg: toggleSwitch.sg,
						st: toggleSwitch.st,
					});
				}
			}
		}
		if (settings) {
			let message;
			DOM.insert(
				settings,
				'beforeend',
				<div className="esgst-description esgst-bold" ref={(ref) => (message = ref)}>
					<i className="fa fa-circle-o-notch fa-spin" title="Saving..."></i>
				</div>
			);
			await this.setSetting(toSave);
			message.classList.add('esgst-green');
			DOM.insert(message, 'atinner', <i className="fa fa-check" title="Saved!"></i>);
			window.setTimeout(() => message.remove(), 2500);
		}
	}

	hideGame(button, id, name, steamId, steamType) {
		let elements, i, popup;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-eye-slash',
			title: (
				<fragment>
					Would you like to hide all giveaways for <span className="esgst-bold">{name}</span>?
				</fragment>
			),
		});
		Button.create([
			{
				template: 'success',
				name: 'Yes',
				onClick: async () => {
					await FetchRequest.post('/ajax.php', {
						data: `xsrf_token=${Session.xsrfToken}&do=hide_giveaways_by_game_id&game_id=${id}`,
					});
					await this.updateHiddenGames(steamId, steamType);
					elements = document.querySelectorAll(`.giveaway__row-outer-wrap[data-game-id="${id}"]`);
					for (i = elements.length - 1; i > -1; --i) {
						elements[i].remove();
					}
					button.remove();
					popup.close();
				},
			},
			{
				color: 'white',
				isDisabled: true,
				icons: ['fa-refresh fa-spin'],
				name: 'Please wait...',
			},
		]).insert(popup.description, 'beforeend');
		this.createElements(popup.actions.firstElementChild, 'atouter', [
			{
				attributes: {
					href: '/account/settings/giveaways/filters',
				},
				text: 'View Hidden Games',
				type: 'a',
			},
		]);
		popup.open();
	}

	unhideGame(button, id, name, steamId, steamType) {
		let popup;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-eye-slash',
			isTemp: true,
			title: (
				<fragment>
					Would you like to unhide all giveaways for <span className="esgst-bold">{name}</span>?
				</fragment>
			),
		});
		Button.create([
			{
				template: 'success',
				name: 'Yes',
				onClick: async () => {
					await FetchRequest.post('/ajax.php', {
						data: `xsrf_token=${Session.xsrfToken}&do=remove_filter&game_id=${id}`,
					});
					await this.updateHiddenGames(steamId, steamType, true);
					button.remove();
					popup.close();
				},
			},
			{
				color: 'white',
				isDisabled: true,
				icons: ['fa-refresh fa-spin'],
				name: 'Please wait...',
			},
		]).insert(popup.description, 'beforeend');
		this.createElements(popup.actions.firstElementChild, 'atouter', [
			{
				attributes: {
					href: '/account/settings/giveaways/filters',
				},
				text: 'View Hidden Games',
				type: 'a',
			},
		]);
		popup.open();
	}

	draggable_set(obj) {
		if (!obj.history) {
			obj.history = [];
		}
		if (!obj.values) {
			obj.values = {};
		}
		obj.context.setAttribute('data-draggable-key', obj.id);
		for (const element of obj.context.children) {
			if (element.getAttribute('draggable') || !element.getAttribute('data-draggable-id')) {
				continue;
			}
			element.setAttribute('draggable', true);
			element.addEventListener('dragstart', this.draggable_start.bind(this, obj));
			element.addEventListener('dragenter', this.draggable_enter.bind(this, obj));
			element.addEventListener('dragend', this.draggable_end.bind(this, obj));
		}
	}

	async draggable_start(obj, event) {
		event.dataTransfer.setData('text/plain', '');
		this.esgst.draggable.dragged = event.currentTarget;
		this.esgst.draggable.source = this.esgst.draggable.dragged.parentElement;
		this.esgst.draggable.destination = null;
		if (obj.addTrash) {
			this.draggable_setTrash(obj);
			this.draggable_setRestoreButton(obj);
		}
	}

	draggable_enter(obj, event) {
		if (!this.esgst.draggable.dragged) {
			return;
		}
		const element = event.currentTarget;
		if (
			element === this.esgst.draggable.dragged ||
			element.getAttribute('data-draggable-id') ===
				this.esgst.draggable.dragged.getAttribute('data-draggable-id')
		) {
			return;
		}
		if (element === obj.context) {
			if (obj.context.children.length < 1) {
				obj.context.appendChild(this.esgst.draggable.dragged);
				this.esgst.draggable.destination = obj.context;
			}
			return;
		}
		if (
			element.getAttribute('data-draggable-group') !==
			this.esgst.draggable.dragged.getAttribute('data-draggable-group')
		) {
			window.alert('Cannot move this element to this group.');
			return;
		}
		let current = this.esgst.draggable.dragged;
		do {
			current = current.previousElementSibling;
			if (current && current === element) {
				element.parentElement.insertBefore(this.esgst.draggable.dragged, element);
				this.esgst.draggable.destination = this.esgst.draggable.dragged.parentElement;
				return;
			}
		} while (current);
		element.parentElement.insertBefore(this.esgst.draggable.dragged, element.nextElementSibling);
		this.esgst.draggable.destination = this.esgst.draggable.dragged.parentElement;
	}

	async draggable_end(obj) {
		if (this.esgst.draggable.awaitingConfirmation) {
			return;
		}
		if (this.esgst.draggable.trash) {
			this.esgst.draggable.trash.remove();
			this.esgst.draggable.trash = null;
		}
		if (this.esgst.draggable.restoreButton && obj.history.length === 0) {
			this.esgst.draggable.restoreButton.hide();
		}
		if (
			this.esgst.draggable.destination === obj.item.columns ||
			this.esgst.draggable.destination === obj.item.gvIcons
		) {
			if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/elgb|gp/)) {
				this.esgst.draggable.dragged.classList.add('esgst-giveaway-column-button');
			}
			if (this.esgst.draggable.dragged.getAttribute('data-color')) {
				this.esgst.draggable.dragged.classList.add(
					this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
				);
				this.esgst.draggable.dragged.firstElementChild.style.color = this.esgst.draggable.dragged.getAttribute(
					'data-bgColor'
				);
				this.esgst.draggable.dragged.style.color = '';
				this.esgst.draggable.dragged.style.backgroundColor = '';
			}
		} else {
			if (this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/elgb|gp/)) {
				this.esgst.draggable.dragged.classList.remove('esgst-giveaway-column-button');
			}
			if (this.esgst.draggable.dragged.getAttribute('data-color')) {
				this.esgst.draggable.dragged.classList.remove(
					this.esgst.giveawayPath ? 'featured__column' : 'giveaway__column'
				);
				this.esgst.draggable.dragged.style.color = this.esgst.draggable.dragged.getAttribute(
					'data-color'
				);
				this.esgst.draggable.dragged.style.backgroundColor = this.esgst.draggable.dragged.getAttribute(
					'data-bgColor'
				);
			}
		}
		if (this.esgst.draggable.destination === obj.item.heading) {
			if (
				this.esgst.draggable.dragged
					.getAttribute('data-draggable-id')
					.match(/steam|search|hideGame/)
			) {
				this.esgst.draggable.dragged.classList.add('giveaway__icon');
			}
		} else if (
			this.esgst.draggable.dragged.getAttribute('data-draggable-id').match(/steam|search|hideGame/)
		) {
			this.esgst.draggable.dragged.classList.remove('giveaway__icon');
		}
		if (this.esgst.draggable.deleted) {
			this.esgst.draggable.dragged.remove();
			obj.history.push({
				dragged: this.esgst.draggable.dragged,
				source: this.esgst.draggable.source,
				destination: this.esgst.draggable.destination,
			});
		} else if (this.esgst.draggable.restored) {
			this.esgst.draggable.destination.appendChild(this.esgst.draggable.dragged);
		}
		const sources = [this.esgst.draggable.source];
		if (this.esgst.draggable.source !== this.esgst.draggable.destination) {
			sources.push(this.esgst.draggable.destination);
		}
		for (const element of sources) {
			if (!element) {
				continue;
			}
			const key = `${element.getAttribute('data-draggable-key')}${obj.item.gvIcons ? '_gv' : ''}`;
			obj.values[key] = [];
			for (const child of element.children) {
				const id = child.getAttribute('data-draggable-id');
				if (id) {
					if (child.getAttribute('data-draggable-obj')) {
						obj.values[key].push(JSON.parse(child.getAttribute('data-draggable-obj')));
					} else {
						obj.values[key].push(id);
					}
				}
			}
			if (key === 'emojis') {
				await this.setValue(key, JSON.stringify(obj.values[key]));
			}
			if (key.startsWith('savedReplies')) {
				await this.setValue(key, JSON.stringify(obj.values[key]));
			}
		}
		if (obj.onDragEnd) {
			obj.onDragEnd(obj.values);
		}
		this.esgst.draggable.dragged = null;
		this.esgst.draggable.source = null;
		this.esgst.draggable.destination = null;
		if (this.esgst.draggable.restoreButton && obj.history.length > 0) {
			this.esgst.draggable.restoreButton.show();
		}
	}

	draggable_setTrash(obj) {
		if (this.esgst.draggable.trash) {
			this.esgst.draggable.trash.remove();
		}
		DOM.insert(
			obj.trashContext || obj.context,
			'afterend',
			<div
				className="esgst-draggable-trash"
				title="Delete the element"
				ondragenter={this.draggable_delete.bind(this, obj)}
				ref={(ref) => (this.esgst.draggable.trash = ref)}
			>
				<i className="fa fa-trash"></i>
			</div>
		);
		this.esgst.draggable.trash.style.width = `${(obj.trashContext || obj.context).offsetWidth}px`;
	}

	async draggable_delete(obj) {
		this.esgst.draggable.awaitingConfirmation = true;
		this.esgst.draggable.deleted = false;
		if (
			!this.esgst.draggable.dragged ||
			!window.confirm('Are you sure you want to delete this item?')
		) {
			this.esgst.draggable.awaitingConfirmation = false;
			this.esgst.draggable.trash.remove();
			this.esgst.draggable.trash = null;
			return;
		}
		this.esgst.draggable.awaitingConfirmation = false;
		this.esgst.draggable.deleted = true;
		await this.draggable_end(obj);
		this.esgst.draggable.deleted = false;
	}

	draggable_setRestoreButton(obj) {
		if (this.esgst.draggable.restoreButton) {
			this.esgst.draggable.restoreButton.destroy();
		}
		this.esgst.draggable.restoreButton = Button.create({
			color: 'white',
			tooltip: 'Restore the latest deleted element (restored elements always appear at the end)',
			icons: ['fa-rotate-left'],
			name: '',
			onClick: this.draggable_restore.bind(this, obj),
		})
			.insert(obj.trashContext || obj.context, 'afterend')
			.hide();
	}

	async draggable_restore(obj) {
		const itemToRestore = obj.history.pop();
		this.esgst.draggable.dragged = itemToRestore.dragged;
		this.esgst.draggable.source = itemToRestore.source;
		this.esgst.draggable.destination = itemToRestore.source;
		this.esgst.draggable.restored = true;
		await this.draggable_end(obj);
		this.esgst.draggable.restored = false;
	}

	setCountdown(context, totalSeconds, callback, initialDate = Date.now()) {
		const seconds = totalSeconds - Math.floor((Date.now() - initialDate) / 1000);
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		context.textContent = `${`0${m}`.slice(-2)}:${`0${s}`.slice(-2)}`;
		if (seconds > -1) {
			window.setTimeout(
				this.setCountdown.bind(this),
				1000,
				context,
				totalSeconds,
				callback,
				initialDate
			);
		} else if (callback) {
			callback();
		}
	}

	round(number, decimals = 2) {
		const multiplier = Math.pow(10, decimals);
		return Math.round(number * multiplier) / multiplier;
	}

	getTextNodesIn(elem, opt_fnFilter) {
		let textNodes = [];
		if (elem) {
			for (let nodes = elem.childNodes, i = 0, n = nodes.length; i < n; i++) {
				let node = nodes[i],
					nodeType = node.nodeType;
				if (nodeType === 3) {
					if (!opt_fnFilter || opt_fnFilter(node, elem)) {
						textNodes.push(node);
					}
				} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					textNodes = textNodes.concat(this.getTextNodesIn(node, opt_fnFilter));
				}
			}
		}
		return textNodes;
	}

	setClearButton(input) {
		const button = input.nextElementSibling;
		input.addEventListener('input', this.toggleClearButton.bind(this, button, input));
		input.addEventListener('change', this.toggleClearButton.bind(this, button, input));
		input.nextElementSibling.addEventListener('click', this.clearInput.bind(this, input));
	}

	toggleClearButton(button, input) {
		if (input.value) {
			if (button.classList.contains('esgst-hidden')) {
				button.classList.remove('esgst-hidden');
			}
		} else if (!button.classList.contains('esgst-hidden')) {
			button.classList.add('esgst-hidden');
		}
	}

	clearInput(input) {
		input.value = '';
		input.dispatchEvent(new Event('change'));
	}

	fixEmojis(emojis) {
		const matches = emojis.split(/<\/span>/);
		if (matches.length < 2) return emojis;
		matches.pop();
		return JSON.stringify(matches.map(this.fixEmoji));
	}

	fixEmoji(emoji) {
		const match = emoji.match(/title="(.+?)"/);
		emoji = emoji.replace(/<span.+?>/, '');
		if (match) {
			return this.getEmojiHtml(emoji);
		}
		let fixed = '';
		for (let i = 0, n = emoji.length; i < n; i++) {
			fixed += this.getEmojiHtml(emoji[i]);
		}
		return fixed;
	}

	getEmojiHtml(emoji) {
		return `&#x${this.getEmojiUnicode(emoji).toString('16').toUpperCase()}`;
	}

	getEmojiUnicode(emoji) {
		if (emoji.length === 1) {
			return emoji.charCodeAt(0);
		}
		const code = (emoji.charCodeAt(0) - 0xd800) * 0x400 + (emoji.charCodeAt(1) - 0xdc00) + 0x10000;
		if (code < 0) {
			return emoji.charCodeAt(0);
		}
		return code;
	}

	triggerOnEnter(callback, event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			callback();
		}
	}

	getChildByClassName(element, className) {
		let i;
		if (!element) return;
		for (
			i = element.children.length - 1;
			i > -1 && !element.children[i].classList.contains(className);
			i--
		) {}
		if (i > -1) return element.children[i];
	}

	escapeMarkdown(string) {
		return string.replace(/([[\]()*~!.`\->#|])/g, `\\$1`);
	}

	removeDuplicateNotes(notes) {
		let output = [];
		notes.split(/\n/).forEach((part) => {
			if (output.indexOf(part) < 0) {
				output.push(part);
			}
			output.push('\n');
		});
		return output.join('').trim().replace(/\n\n+/g, '\n\n');
	}

	capitalizeFirstLetter(string) {
		return `${string[0].toUpperCase()}${string.slice(1)}`;
	}

	getTimestamp(seconds, is24Clock, isShowSeconds) {
		return dateFns_format(
			seconds,
			`MMM d, yyyy, ${is24Clock ? 'H' : 'h'}:mm${isShowSeconds ? `:ss` : ''}${
				is24Clock ? '' : ' a'
			}`
		);
	}

	/**
	 * @param timestamp
	 * @param [until]
	 * @returns {string}
	 */
	getTimeSince(timestamp, until) {
		let n, s;
		s = Math.floor((until ? timestamp - Date.now() : Date.now() - timestamp) / 1000);
		n = Math.floor(s / 31104000);
		if (n >= 1) {
			return `${n} year${n === 1 ? '' : 's'}`;
		}
		n = Math.floor(s / 2592000);
		if (n >= 1) {
			return `${n} month${n === 1 ? '' : 's'}`;
		}
		n = Math.floor(s / 86400);
		if (n >= 1) {
			return `${n} day${n === 1 ? '' : 's'}`;
		}
		n = Math.floor(s / 3600);
		if (n >= 1) {
			return `${n} hour${n === 1 ? '' : 's'}`;
		}
		n = Math.floor(s / 60);
		if (n >= 1) {
			return `${n} minute${n === 1 ? '' : 's'}`;
		}
		n = Math.floor(s);
		return `${n} second${n === 1 ? '' : 's'}`;
	}

	closeHeaderMenu(arrow, dropdown, menu, event) {
		if (!menu.contains(event.target) && arrow.classList.contains('selected')) {
			arrow.classList.remove('selected');
			dropdown.classList.add('esgst-hidden');
		}
	}

	setSiblingsOpacity(element, Opacity) {
		let Siblings, I, N;
		Siblings = element.parentElement.children;
		for (I = 0, N = Siblings.length; I < N; ++I) {
			if (Siblings[I] !== element) {
				Siblings[I].style.opacity = Opacity;
			}
		}
	}

	timeout(ms) {
		return new Promise((resolve) => window.setTimeout(resolve, ms));
	}

	createTooltip(context, message, noMarkdown) {
		let popout;
		popout = new Popout(`esgst-feature-description ${noMarkdown ? '' : 'markdown'}`, context, 100);
		popout.popout.style.maxHeight = '300px';
		popout.popout.style.overflow = 'auto';
		this.createElements(popout.popout, 'atinner', [
			...Array.from(DOM.parse(message).body.childNodes).map((x) => {
				return {
					context: x,
				};
			}),
		]);
		return popout;
	}

	createOptions(options) {
		let context, elements, id, switches;
		context = document.createElement('div');
		elements = {};
		switches = {};
		options.forEach((option) => {
			if (option.check) {
				id = option.id;
				elements[id] = this.createElements(context, 'beforeend', [
					{
						type: 'div',
					},
				]);
				switches[id] = new ToggleSwitch(
					elements[id],
					id,
					false,
					option.description,
					false,
					false,
					option.tooltip,
					Settings.get(id)
				);
			}
		});
		options.forEach((option) => {
			let enabled = Settings.get(option.id);
			if (switches[option.id]) {
				if (option.dependencies) {
					option.dependencies.forEach((dependency) => {
						if (elements[dependency]) {
							switches[option.id].dependencies.push(elements[dependency]);
							if (!enabled) {
								elements[dependency].classList.add('esgst-hidden');
							}
						}
					});
				}
				if (option.exclusions) {
					option.exclusions.forEach((exclusion) => {
						if (elements[exclusion]) {
							switches[option.id].exclusions.push(elements[exclusion]);
							if (enabled) {
								elements[exclusion].classList.add('esgst-hidden');
							}
						}
					});
				}
			}
		});
		return context;
	}

	createResults(context, element, results) {
		for (const result of results) {
			const key = result.Key;
			element[key] = this.createElements(context, 'beforeend', [
				{
					attributes: {
						class: 'esgst-hidden',
					},
					type: 'div',
					children: [
						{
							attributes: {
								class: result.Icon,
							},
							type: 'i',
						},
						{
							attributes: {
								class: 'esgst-bold',
							},
							type: 'span',
							children: [
								{
									text: `${result.Description} (`,
									type: 'node',
								},
								{
									text: '0',
									type: 'span',
								},
								{
									text: `):`,
									type: 'node',
								},
							],
						},
						{
							attributes: {
								class: 'esgst-popup-actions',
							},
							type: 'span',
						},
					],
				},
			]);
			element[`${key}Count`] = element[key].firstElementChild.nextElementSibling.firstElementChild;
			element[`${key}Users`] = element[key].lastElementChild;
		}
	}

	goToComment(hash, element, noPermalink) {
		if (!hash) {
			hash = window.location.hash;
		}
		let id = hash.replace(/#/, '');
		if (
			(!id && !element) ||
			(window.location.pathname.match(/^\/account/) && !this.esgst.parameters.esgst)
		)
			return;
		if (id && !element) {
			element = document.getElementById(id);
		}
		if (!element) return;
		window.scrollTo(0, element.offsetTop);
		window.scrollBy(0, -this.esgst.commentsTop);
		if (noPermalink) return;
		let permalink = document.querySelector(`.is_permalink, .author_permalink`);
		if (permalink) {
			permalink.remove();
		}
		element = element.querySelector(`.comment__username, .author_avatar`);
		if (!element) return;
		this.createElements(element, this.esgst.sg ? 'beforebegin' : 'afterend', [
			{
				attributes: {
					class: 'fa fa-share is_permalink author_permalink',
				},
				type: 'i',
			},
		]);
	}

	sortContent(array, option) {
		let after, before, divider, dividers, i, key, n, name;
		name = option.split(/_/);
		key = name[0];
		if (name[1] === 'asc') {
			before = -1;
			after = 1;
		} else {
			before = 1;
			after = -1;
		}
		array.sort((a, b) => {
			if (typeof a[key] === 'string' && typeof b[key] === 'string') {
				return a[key].toLowerCase().localeCompare(b[key].toLowerCase()) * after;
			} else {
				const aValue = a[key] || 0;
				const bValue = b[key] || 0;
				if (aValue < bValue) {
					return before;
				} else if (aValue > bValue) {
					return after;
				} else {
					return 0;
				}
			}
		});
		let context = null;
		if (array[0].outerWrap) {
			const popup = array[0].outerWrap.closest(`.esgst-popup, [data-esgst-popup]`);
			if (popup) {
				context =
					popup.getElementsByClassName('esgst-gv-view')[0] ||
					array[0].outerWrap.parentElement.parentElement;
			}
		}
		for (i = 0, n = array.length; i < n; ++i) {
			if (!array[i].outerWrap.parentElement) continue;

			if (context) {
				context.appendChild(array[i].outerWrap.parentElement);
			} else {
				array[i].outerWrap.parentElement.appendChild(array[i].outerWrap);
			}
		}
		for (i = array.length - 1; i > -1; i--) {
			if (array[i].isPinned) {
				array[i].outerWrap.parentElement.insertBefore(
					array[i].outerWrap,
					array[i].outerWrap.parentElement.firstElementChild
				);
			}
		}
		if (key === 'sortIndex') {
			dividers = document.getElementsByClassName('esgst-es-page-divider');
			for (i = dividers.length - 1; i > -1; --i) {
				divider = dividers[i];
				divider.classList.remove('esgst-hidden');
				divider.parentElement.insertBefore(
					divider,
					document.getElementsByClassName(`esgst-es-page-${i + 2}`)[0]
				);
			}
		} else {
			dividers = document.querySelectorAll(`.esgst-es-page-divider:not(.esgst-hidden)`);
			for (i = dividers.length - 1; i > -1; --i) {
				dividers[i].classList.add('esgst-hidden');
			}
		}
	}

	rot(string, n) {
		return string.replace(/[a-zA-Z]/g, (char) => {
			return String.fromCharCode(
				(char <= 'Z' ? 90 : 122) >= (char = char.charCodeAt(0) + n) ? char : char - 26
			);
		});
	}

	async buildGiveaway(context, url, errorMessage, blacklist) {
		let ended,
			avatar,
			code,
			column,
			columns,
			comments,
			counts,
			endTime,
			endTimeColumn,
			entered,
			entries,
			giveaway,
			heading,
			headingName,
			i,
			id,
			icons,
			image,
			n,
			removeEntryButton,
			started,
			startTimeColumn,
			thinHeadings;
		giveaway = context.getElementsByClassName('featured__outer-wrap--giveaway')[0];
		if (giveaway) {
			let match = url.match(/giveaway\/(.+?)\//),
				sgTools = false;
			if (match) {
				code = match[1];
			} else {
				match = url.match(/giveaways\/(.+)/);
				if (match) {
					code = match[1];
					sgTools = true;
				}
			}
			id = giveaway.getAttribute('data-game-id');
			heading = giveaway.getElementsByClassName('featured__heading')[0];
			icons = heading.getElementsByTagName('a');
			for (i = 0, n = icons.length; i < n; ++i) {
				icons[i].classList.add('giveaway__icon');
			}
			headingName = heading.firstElementChild;
			this.createElements(headingName, 'atouter', [
				{
					attributes: {
						class: 'giveaway__heading__name',
						href: url,
					},
					type: 'a',
					children: [
						...Array.from(headingName.childNodes).map((x) => {
							return {
								context: x,
							};
						}),
					],
				},
			]);
			thinHeadings = heading.getElementsByClassName('featured__heading__small');
			for (i = 0, n = thinHeadings.length; i < n; ++i) {
				this.createElements(thinHeadings[0], 'atouter', [
					{
						attributes: {
							class: 'giveaway__heading__thin',
						},
						type: 'span',
						children: [
							...Array.from(thinHeadings[0].childNodes).map((x) => {
								return {
									context: x,
								};
							}),
						],
					},
				]);
			}
			columns = heading.nextElementSibling;
			endTimeColumn = columns.firstElementChild;
			endTimeColumn.classList.remove('featured__column');
			if (sgTools) {
				let info = await this.esgst.modules.games.games_getInfo(giveaway);
				if (info) {
					this.createElements(heading, 'beforeend', [
						{
							attributes: {
								class: 'giveaway__icon',
								href: `https://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}/`,
								rel: 'nofollow',
								target: '_blank',
							},
							type: 'a',
							children: [
								{
									attributes: {
										class: 'fa fa-steam',
									},
									type: 'i',
								},
							],
						},
						{
							attributes: {
								class: 'giveaway__icon',
								href: `/giveaways/search?${info.type.slice(0, -1)}=${info.id}`,
							},
							type: 'a',
							children: [
								{
									attributes: {
										class: 'fa fa-search',
									},
									type: 'i',
								},
							],
						},
					]);
				}
				let date = new Date(`${endTimeColumn.lastElementChild.textContent}Z`).getTime();
				ended = Date.now() > date;
				const items = [];
				if (ended) {
					items.push({
						text: 'Ended',
						type: 'node',
					});
				}
				items.push(
					{
						attributes: {
							['data-timestamp']: date / 1e3,
						},
						text: ended ? this.getTimeSince(date) : this.getTimeSince(date, true),
						type: 'span',
					},
					{
						text: ended ? ' ago ' : ' remaining ',
						type: 'node',
					}
				);
				this.createElements(endTimeColumn.lastElementChild, 'atouter', items);
			}
			endTime = parseInt(endTimeColumn.lastElementChild.getAttribute('data-timestamp')) * 1000;
			startTimeColumn = endTimeColumn.nextElementSibling;
			startTimeColumn.classList.remove('featured__column', 'featured__column--width-fill');
			startTimeColumn.classList.add('giveaway__column--width-fill');
			if (sgTools) {
				let date = new Date(`${startTimeColumn.firstElementChild.textContent}Z`).getTime();
				const items = [];
				if (ended) {
					items.push({
						text: 'Ended ',
						type: 'node',
					});
				}
				items.push(
					{
						attributes: {
							['data-timestamp']: date / 1e3,
						},
						text: this.getTimeSince(date),
						type: 'span',
					},
					{
						text: ' ago ',
						type: 'node',
					}
				);
				this.createElements(startTimeColumn.firstElementChild, 'atouter', items);
			}
			startTimeColumn.lastElementChild.classList.add('giveaway__username');
			avatar = columns.lastElementChild;
			if (sgTools) {
				avatar.className = 'giveaway_image_avatar';
			}
			avatar.remove();
			startTimeColumn.querySelector(`[style]`).removeAttribute('style');
			column = startTimeColumn.nextElementSibling;
			while (column) {
				column.classList.remove('featured__column');
				column.className = column.className.replace(/featured/g, 'giveaway');
				column = column.nextElementSibling;
			}
			removeEntryButton = context.getElementsByClassName('sidebar__entry-delete')[0];
			if (removeEntryButton && !removeEntryButton.classList.contains('is-hidden')) {
				entered = 'is-faded';
			} else {
				entered = '';
			}
			counts = context.getElementsByClassName('sidebar__navigation__item__count');
			if (counts.length > 1) {
				entries = counts[1].textContent;
				comments = counts[0].textContent;
				started = true;
			} else if (counts.length > 0) {
				entries = 0;
				comments = counts[0].textContent;
				started = false;
			} else {
				entries = 0;
				comments = 0;
			}
			image = giveaway
				.getElementsByClassName('global__image-outer-wrap--game-large')[0]
				.firstElementChild.getAttribute('src');
			const attributes = {
				class: 'giveaway__row-outer-wrap',
				['data-game-id']: id,
			};
			if (errorMessage) {
				attributes['data-error'] = errorMessage;
			}
			if (blacklist) {
				attributes['data-blacklist'] = true;
			}
			const errorButton = context.getElementsByClassName('sidebar__error is-disabled')[0];
			if (!errorButton || errorButton.textContent.trim() === 'Not Enough Points') {
				attributes['data-enterable'] = true;
			}
			if (context.getElementsByClassName('sidebar__entry-insert')[0]) {
				attributes['data-currently-enterable'] = true;
			}
			if (entered) {
				attributes['data-entered'] = true;
			}
			heading.className = 'giveaway__heading';
			columns.className = 'giveaway__columns';
			return {
				code,
				html: [
					{
						type: 'div',
						children: [
							{
								attributes,
								type: 'div',
								children: [
									{
										attributes: {
											class: `giveaway__row-inner-wrap ${entered}`,
										},
										type: 'div',
										children: [
											{
												attributes: {
													class: 'giveaway__summary',
												},
												children: [
													{
														context: heading,
													},
													{
														context: columns,
													},
													{
														attributes: {
															class: 'giveaway__links',
														},
														type: 'div',
														children: [
															{
																attributes: {
																	href: `${url}/entries`,
																},
																type: 'a',
																children: [
																	{
																		attributes: {
																			class: 'fa fa-tag',
																		},
																		type: 'i',
																	},
																	{
																		text: `${entries} entries`,
																		type: 'span',
																	},
																],
															},
															{
																attributes: {
																	href: `${url}/comments`,
																},
																type: 'a',
																children: [
																	{
																		attributes: {
																			class: 'fa fa-comment',
																		},
																		type: 'i',
																	},
																	{
																		text: `${comments} comments`,
																		type: 'span',
																	},
																],
															},
														],
													},
												],
												type: 'div',
											},
											{
												context: avatar,
											},
											{
												attributes: {
													class: 'giveaway_image_thumbnail',
													href: url,
													style: `background-image: url(${image})`,
												},
												type: 'a',
											},
										],
									},
								],
							},
						],
					},
				],
				points: parseInt(heading.textContent.match(/\((\d+)P\)/)[1]),
				started,
				timestamp: endTime,
			};
		} else {
			return null;
		}
	}

	getCopyIcon(value) {
		return (
			<i
				className="esgst-clickable fa fa-copy"
				title="Copy"
				onclick={(event) => this.copyValue(event.currentTarget, value)}
			></i>
		);
	}

	copyValue(icon, value) {
		let textArea = this.createElements(document.body, 'beforeend', [
			{
				type: 'textarea',
			},
		]);
		textArea.value = value;
		textArea.select();
		document.execCommand('copy');
		textArea.remove();
		if (icon) {
			icon.classList.add('esgst-green');
			window.setTimeout(() => icon.classList.remove('esgst-green'), 2000);
		}
	}

	setMissingDiscussion(context) {
		if (context) {
			this.createElements(context.outerWrap, 'atinner', [
				{
					attributes: {
						class: 'table__row-outer-wrap',
						style: `padding: 15px 0;`,
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
									type: 'div',
									children: [
										{
											attributes: {
												class: 'table_image_avatar',
												href: `/user/${context.author}`,
												style: `background-image:${context.avatar.style.backgroundImage.replace(
													/"/g,
													"'"
												)};`,
											},
											type: 'a',
										},
									],
								},
								{
									attributes: {
										class: 'table__column--width-fill',
									},
									type: 'div',
									children: [
										{
											attributes: {
												style: `margin-bottom: 2px;`,
											},
											type: 'h3',
											children: [
												{
													attributes: {
														class: 'homepage_table_column_heading',
														href: context.url,
													},
													text: context.title,
													type: 'a',
												},
											],
										},
										{
											type: 'p',
											children: context.lastPostTime
												? [
														{
															attributes: {
																class: 'table__column__secondary-link',
																href: context.url,
															},
															text: `${context.comments} Comments`,
															type: 'a',
														},
														{
															text: ' - Last post ',
															type: 'node',
														},
														{
															attributes: {
																['data-timestamp']: context.lastPostTimestamp,
															},
															text: context.lastPostTime,
															type: 'span',
														},
														{
															text: ' ago by ',
															type: 'node',
														},
														{
															attributes: {
																class: 'table__column__secondary-link',
																href: `/user/${context.lastPostAuthor}`,
															},
															text: context.lastPostAuthor,
															type: 'a',
														},
														{
															attributes: {
																class: 'icon-green table__last-comment-icon',
																href: `/go/comment/${context.lastPostCode}`,
															},
															type: 'a',
															children: [
																{
																	attributes: {
																		class: 'fa fa-chevron-circle-right',
																	},
																	type: 'i',
																},
															],
														},
												  ]
												: [
														{
															attributes: {
																class: 'table__column__secondary-link',
																href: context.url,
															},
															text: `${context.comments} Comments`,
															type: 'a',
														},
														{
															text: ' - Created ',
															type: 'node',
														},
														{
															attributes: {
																['data-timestamp']: context.createdTimestamp,
															},
															text: context.createdTime,
															type: 'span',
														},
														{
															text: ' ago by ',
															type: 'node',
														},
														{
															attributes: {
																class: 'table__column__secondary-link',
																href: `/user/${context.author}`,
															},
															text: context.author,
															type: 'a',
														},
												  ],
										},
									],
								},
							],
						},
					],
				},
			]);
			context.outerWrap = context.outerWrap.firstElementChild;
		}
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
	}

	/**
	 *
	 * @param {import('../components/Button').Button} button
	 * @param {*} event
	 */
	triggerSetOnEnter(button, event) {
		if (event.key === 'Enter') {
			button.onClick();
			return true;
		}
	}

	formatTags(fullMatch, match1, offset, string) {
		return offset === 0 || offset === string.length - fullMatch.length ? '' : `, `;
	}

	animateScroll(y, callback) {
		// From https://stackoverflow.com/a/26808520/8115112

		let currentTime, time;
		currentTime = 0;
		if (y > 0) {
			y -= this.esgst.commentsTop;
		}
		time = Math.max(0.1, Math.min(Math.abs(window.scrollY - y) / 2000, 0.8));

		function tick() {
			let p;
			currentTime += 1 / 60;
			p = currentTime / time;
			if (p < 1) {
				window.requestAnimationFrame(tick);
				window.scrollTo(
					0,
					window.scrollY +
						(y - window.scrollY) *
							((p /= 0.5) < 1 ? 0.5 * Math.pow(p, 5) : 0.5 * (Math.pow(p - 2, 5) + 2))
				);
			} else {
				window.scrollTo(0, y);
				if (callback) {
					callback();
				}
			}
		}

		tick();
	}

	reverseComments(context) {
		let i, n;
		let frag = document.createDocumentFragment();
		for (i = 0, n = context.children.length; i < n; ++i) {
			frag.appendChild(context.lastElementChild);
		}
		context.appendChild(frag);
	}

	createAlert(message) {
		let popup;
		popup = new Popup({
			addScrollable: true,
			icon: 'fa-exclamation',
			isTemp: true,
			title: message,
		});
		popup.open();
	}

	/**
	 * @param message
	 * @param {} [onYes]
	 * @param {} [onNo]
	 * @param {} [event]
	 */
	createConfirmation(message, onYes, onNo, event) {
		//Logger.info(message);
		let callback, popup;
		callback = onNo;
		popup = new Popup({ addScrollable: true, icon: 'fa-question', isTemp: true, title: message });
		Button.create({
			template: 'success',
			name: 'Yes',
			onClick: () => {
				callback = onYes;
				popup.close();
			},
		}).insert(popup.description, 'beforeend');
		Button.create({
			template: 'error',
			name: 'No',
			onClick: () => {
				callback = onNo;
				popup.close();
			},
		}).insert(popup.description, 'beforeend');
		popup.onClose = () => {
			if (callback) {
				callback(event);
			}
		};
		popup.open();
	}

	createFadeMessage(context, message) {
		context.textContent = message;
		window.setTimeout(() => {
			context.textContent = '';
		}, 10000);
	}

	openSmallWindow(url) {
		Tabs.open(url);
	}

	convertBytes(bytes) {
		if (bytes < 1024) {
			return `${bytes} B`;
		} else {
			bytes /= 1024;
			if (bytes < 1024) {
				return `${Math.round(bytes * 100) / 100} KB`;
			} else {
				return `${Math.round((bytes / 1024) * 100) / 100} MB`;
			}
		}
	}

	createFormRows(context, position, options) {
		const items = [];
		let i = 1;
		for (const item of options.items) {
			if (!item.check) {
				continue;
			}
			items.push(
				<div className="form__row">
					<div className="form__heading">
						<div className="form__heading__number">{i++}</div>
						<div className="form__heading__text">{item.name}</div>
					</div>
					<div className="form__row__indent" id={item.id || ''}>
						{item.content}
					</div>
				</div>
			);
		}
		let rows;
		DOM.insert(
			context,
			position,
			<div className="form__rows" ref={(ref) => (rows = ref)}>
				{items}
			</div>
		);
		return rows;
	}

	createSidebarNavigation(context, position, options) {
		const items = [];
		for (const item of options.items) {
			const attributes = Object.assign(
				{ className: 'sidebar__navigation__item__link' },
				item.url ? { href: item.url } : null
			);
			const children = (
				<fragment>
					<div className="sidebar__navigation__item__name">{item.name}</div>
					<div className="sidebar__navigation__item__underline"></div>
					{Utils.isSet(item.count) ? (
						<div className="sidebar__navigation__item__count">{item.count}</div>
					) : null}
				</fragment>
			);
			items.push(
				<li className="sidebar__navigation__item" id={item.id || ''}>
					{item.url ? <a {...attributes}>{children}</a> : <div {...attributes}>{children}</div>}
				</li>
			);
		}
		let navigation;
		DOM.insert(
			context,
			position,
			<fragment>
				<h3 className="sidebar__heading">{options.name}</h3>
				<ul className="sidebar__navigation" ref={(ref) => (navigation = ref)}>
					{items}
				</ul>
			</fragment>
		);
		return navigation;
	}

	createElements(context, position, items) {
		try {
			if (position === 'atinner') {
				context.innerHTML = '';
			}
			if (!items || !items.length) {
				return;
			}
			const fragment = document.createDocumentFragment();
			let element = null;
			this.buildElements(fragment, items);
			switch (position) {
				case 'beforebegin':
					context.parentElement.insertBefore(fragment, context);
					element = context.previousElementSibling;
					break;
				case 'afterbegin':
					context.insertBefore(fragment, context.firstElementChild);
					element = context.firstElementChild;
					break;
				case 'beforeend':
					context.appendChild(fragment);
					element = context.lastElementChild;
					break;
				case 'afterend':
					context.parentElement.insertBefore(fragment, context.nextElementSibling);
					element = context.nextElementSibling;
					break;
				case 'atinner':
					context.appendChild(fragment);
					element = context.firstElementChild;
					break;
				case 'atouter':
					context.parentElement.insertBefore(fragment, context);
					element = context.previousElementSibling;
					context.remove();
					break;
			}
			return element;
		} catch (error) {
			Logger.error(error.message, error.stack);
		}
	}

	buildElements(context, items) {
		for (const item of items) {
			if (!item) {
				continue;
			}
			if (Utils.isSet(item.context)) {
				context.appendChild(item.context);
				continue;
			}
			if (item.type === 'node') {
				const node = document.createTextNode(item.text);
				context.appendChild(node);
				continue;
			}
			const element = document.createElement(item.type);
			if (Utils.isSet(item.attributes)) {
				for (const key in item.attributes) {
					if (item.attributes.hasOwnProperty(key)) {
						element.setAttribute(key, item.attributes[key]);
					}
				}
			}
			if (Utils.isSet(item.text)) {
				element.textContent = item.text;
			}
			if (Utils.isSet(item.children)) {
				this.buildElements(element, item.children);
			}
			if (Utils.isSet(item.events)) {
				for (const key in item.events) {
					if (item.events.hasOwnProperty(key)) {
						element.addEventListener(key, item.events[key]);
					}
				}
			}
			if (item.type === 'i') {
				const node = document.createTextNode(' ');
				context.appendChild(node);
			}
			context.appendChild(element);
			if (item.type === 'i') {
				const node = document.createTextNode(' ');
				context.appendChild(node);
			}
		}
	}

	/**
	 * @param appId
	 * @param steamId
	 * @returns {PlayerAchievementsSteamApiResponse}
	 */
	async getPlayerAchievements(appId, steamId) {
		return (
			await FetchRequest.get(
				`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${Settings.get(
					'steamApiKey'
				)}&steamid=${steamId}`
			)
		).json;
	}

	async submitComment(obj) {
		obj.status.innerHTML = '';

		if (!obj.commentUrl) {
			const result = await this.saveComment(
				obj.context,
				obj.tradeCode,
				typeof obj.parentId === 'string' ? obj.parentId : obj.parentId.value,
				obj.description.value,
				obj.url,
				obj.status,
				!obj.callback
			);
			if (obj.callback) {
				obj.callback(result.id, result.response, result.status);
			}
			return;
		}

		const response = await FetchRequest.get(obj.commentUrl);
		const comment = response.html.getElementById(obj.commentUrl.match(/\/comment\/(.+)/)[1]);
		obj.parentId = this.esgst.sg
			? comment.closest('.comment').getAttribute('data-comment-id')
			: comment.getAttribute('data-id');
		obj.tradeCode = this.esgst.sg ? '' : response.url.match(/\/trade\/(.+?)\//)[1];
		obj.url = this.esgst.sg ? response.url.match(/(.+?)(#.+?)?$/)[1] : '/ajax.php';

		if (obj.checked || !Settings.get('rfi_c')) {
			const result = await this.saveComment(
				obj.context,
				obj.tradeCode,
				obj.parentId,
				obj.description.value,
				obj.url,
				obj.status,
				!obj.callback
			);
			if (obj.callback) {
				obj.callback(result.id, result.response, response.status);
			}
			return;
		}

		const comments = this.esgst.sg
			? comment.closest('.comment').getElementsByClassName('comment__children')[0]
			: comment.getElementsByClassName('comment_children')[0];
		for (let i = comments.children.length - 1; i > -1; i--) {
			const comment = comments.children[i],
				id = comment
					.querySelector(`[href*="/go/comment/"]`)
					.getAttribute('href')
					.match(/\/go\/comment\/(.+)/)[1];
			if (obj.context.querySelector(`[href*="/go/comment/${id}"`)) {
				comment.remove();
			}
		}
		if (comments.children.length) {
			obj.context.appendChild(comments);
			await this.endless_load(comments);
			for (let i = comments.children.length - 1; i > -1; i--) {
				obj.context.appendChild(comments.children[i]);
			}
			comments.remove();
			obj.submitButton.build(3);
			this.createElements(obj.status, 'atinner', [
				{
					attributes: {
						class: 'esgst-bold esgst-warning',
					},
					type: 'span',
					children: [
						{
							text: 'Somebody beat you to it!',
							type: 'node',
						},
						{
							type: 'br',
						},
						{
							text: 'There are other replies to this comment.',
							type: 'node',
						},
						{
							type: 'br',
						},
						{
							text: 'You can review them below before confirming your reply.',
							type: 'node',
						},
					],
				},
			]);
			obj.checked = true;
		} else {
			const result = await this.saveComment(
				obj.context,
				obj.tradeCode,
				obj.parentId,
				obj.description.value,
				obj.url,
				obj.status,
				!obj.callback
			);
			if (obj.callback) {
				obj.callback(result.id, result.response, result.status);
			}
		}
	}

	addReplyButton(context, commentUrl, callback) {
		const obj = {
			callback,
			checked: false,
			commentUrl,
			context: context.parentElement,
			description: context.querySelector(`[name="description"]`),
			parentId: context.querySelector(`[name="parent_id"]`),
			tradeCode: (context.querySelector(`[name="trade_code"]`) || { value: '' }).value,
			url: this.esgst.sg ? Shared.esgst.locationHref.match(/(.+?)(#.+?)?$/)[1] : '/ajax.php',
		};
		const container = context.getElementsByClassName(
			this.esgst.sg ? 'align-button-container' : 'btn_actions'
		)[0];
		container.firstElementChild.remove();
		obj.button = this.createElements(container, 'afterbegin', [
			{
				attributes: {
					class: 'esgst-ded-button',
				},
				type: 'div',
			},
		]);
		obj.status = this.createElements(container, 'beforeend', [
			{
				attributes: {
					class: 'comment__actions action_list esgst-ded-status',
				},
				type: 'div',
			},
		]);
		obj.submitButton = Button.create([
			{
				color: 'white',
				icons: ['fa-send'],
				name: 'Submit',
				switchTo: { onReturn: 1 },
				onClick: this.submitComment.bind(this, obj),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Saving...',
			},
			{
				color: 'white',
				icons: ['fa-send'],
				name: 'Confirm',
				switchTo: { onReturn: 3 },
				onClick: this.submitComment.bind(this, obj),
			},
			{
				template: 'loading',
				isDisabled: true,
				name: 'Saving...',
			},
		]).insert(obj.button, 'beforeend');
	}

	async hideGames(obj, unhide) {
		const isUsingServer = await permissions.contains([['server']]);
		let hasCacheChanged = false;
		let api = JSON.parse(this.getValue('sgdbCache', `{ "lastUpdate": 0 }`));
		if (!dateFns_isSameWeek(Date.now(), api.lastUpdate)) {
			if (isUsingServer) {
				obj.update && obj.update('Updating API cache...');

				try {
					const response = await FetchRequest.get('https://rafaelgssa.com/esgst/games/sgids');
					api = {
						cache: {
							appids: response.json.result.found.apps,
							subids: response.json.result.found.subs,
						},
						lastUpdate: Date.now(),
					};
				} catch (err) {}
			} else {
				api = {
					cache: { appids: {}, subids: {} },
					lastUpdate: Date.now(),
				};
			}
			hasCacheChanged = true;
		}

		obj.update && obj.update('Retrieving ids from cache...');

		const games = { apps: {}, subs: {} };
		const ids = [];
		const appsToFetch = [];
		const appsNotFound = [];
		const subsToFetch = [];
		const subsNotFound = [];
		for (const appId of obj.appIds) {
			const savedGame = this.esgst.games.apps[appId];
			if (savedGame && ((unhide && !savedGame.hidden) || (!unhide && savedGame.hidden))) {
				continue;
			}
			const id =
				(savedGame && savedGame.sgId) || (api.cache && api.cache.appids && api.cache.appids[appId]);
			if (id) {
				ids.push(id);
				games.apps[appId] = { hidden: unhide ? null : true, sgId: id };
			} else if (id === 0) {
				appsNotFound.push(appId);
			} else {
				appsToFetch.push(appId);
			}
		}
		for (const subId of obj.subIds) {
			const savedGame = this.esgst.games.subs[subId];
			if (savedGame && ((unhide && !savedGame.hidden) || (!unhide && savedGame.hidden))) {
				continue;
			}
			const id =
				(savedGame && savedGame.sgId) || (api.cache && api.cache.subids && api.cache.subids[subId]);
			if (id) {
				ids.push(id);
				games.subs[subId] = { hidden: unhide ? null : true, sgId: id };
			} else if (id === 0) {
				subsNotFound.push(subId);
			} else {
				subsToFetch.push(subId);
			}
		}
		for (let i = appsToFetch.length - 1; i > -1 && !obj.canceled; i--) {
			obj.update && obj.update(`Retrieving app ids from SteamGifts (${i} left)...`);

			const appId = appsToFetch[i];
			const id = await this.getGameSgId(appId, 'apps');
			if (id) {
				ids.push(id);
				games.apps[appId] = { hidden: unhide ? null : true, sgId: id };
			} else {
				api.cache.appids[appId] = 0;
				appsNotFound.push(appId);
			}
		}
		for (let i = subsToFetch.length - 1; i > -1 && !obj.canceled; i--) {
			obj.update && obj.update(`Retrieving sub ids from SteamGifts (${i} left)...`);

			const subId = subsToFetch[i];
			const id = await this.getGameSgId(subId, 'subs');
			if (id) {
				ids.push(id);
				games.subs[subId] = { hidden: unhide ? null : true, sgId: id };
			} else {
				api.cache.subids[subId] = 0;
				subsNotFound.push(subId);
			}
		}

		if (obj.canceled) {
			return;
		}

		if (hasCacheChanged) {
			await this.setValue('sgdbCache', JSON.stringify(api));
		}

		const title = unhide ? 'Unhiding' : 'Hiding';

		obj.update && obj.update(`${title} games...`);

		const total = ids.length;
		for (const [index, id] of ids.entries()) {
			if (obj.canceled) {
				return;
			}

			obj.update && obj.update(`${title} games (${index} of ${total})...`);

			await FetchRequest.post('/ajax.php', {
				data: `xsrf_token=${Session.xsrfToken}&do=${
					unhide ? 'remove_filter' : 'hide_giveaways_by_game_id'
				}&game_id=${id}`,
			});
		}

		if (obj.canceled) {
			return;
		}

		obj.update && obj.update('Saving...');
		await this.lockAndSaveGames(games);

		obj.update && obj.update('');

		return { apps: appsNotFound, subs: subsNotFound };
	}

	async getGameSgId(id, type) {
		const elements = DOM.parse(
			(
				await FetchRequest.post('/ajax.php', {
					data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent(
						id
					)}`,
				})
			).json.html
		).querySelectorAll('.table__row-outer-wrap');
		for (const element of elements) {
			const info = await this.esgst.modules.games.games_getInfo(element);
			if (info && info.type === type && info.id === id) {
				return element.getAttribute('data-autocomplete-id');
			}
		}
	}

	setDatePickerDate(target, date) {
		const script = document.createElement('script');
		script.textContent = `
			function setDatePickerDate() {
				const input = document.querySelector('input[name="${target}"]');
				const actualInput = input.previousElementSibling;

				const datepicker = actualInput && actualInput.classList.contains('hasDatepicker') ? actualInput : input;

				$(datepicker).datetimepicker("setDate", new Date(${date.getTime()}));
			}

			setDatePickerDate();
		`;
		document.body.appendChild(script);
		script.remove();
	}

	testPath(name, namespace, path) {
		const pathObj = this.esgst.paths[namespace].filter((x) => x.name === name)[0];
		if (pathObj && this.getPath(path).match(pathObj.pattern)) {
			return true;
		}
		return false;
	}

	getPath(url) {
		return url.replace(/^https?:\/\/.+?\//, '/');
	}

	isCurrentPath(nameOrNames) {
		if (Array.isArray(nameOrNames)) {
			for (const name of nameOrNames) {
				if (Shared.esgst.currentPaths.indexOf(name) > -1) {
					return true;
				}
			}

			return false;
		}

		return Shared.esgst.currentPaths.indexOf(nameOrNames) > -1;
	}

	getBrowserInfo() {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'getBrowserInfo',
				})
				.then((result) => resolve(JSON.parse(result)))
		);
	}

	getTds() {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'get-tds',
				})
				.then((data) => resolve(JSON.parse(data)))
		);
	}

	notifyTds(data) {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'notify-tds',
					data: JSON.stringify(data),
				})
				.then(() => resolve())
		);
	}

	do_lock(lock) {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'do_lock',
					lock: JSON.stringify(lock),
				})
				.then((result) => resolve(JSON.parse(result)))
		);
	}

	updateLock(lock) {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'update_lock',
					lock: JSON.stringify(lock),
				})
				.then(() => resolve())
		);
	}

	do_unlock(lock) {
		return new Promise((resolve) =>
			browser.runtime
				.sendMessage({
					action: 'do_unlock',
					lock: JSON.stringify(lock),
				})
				.then(() => resolve())
		);
	}

	setValues(values) {
		return new Promise((resolve) =>
			browser.storage.local.set(values).then(() => {
				for (const key in values) {
					if (values.hasOwnProperty(key)) {
						this.esgst.storage[key] = values[key];
						try {
							this.esgst[key] = JSON.parse(values[key]);
						} catch (e) {
							this.esgst[key] = values[key];
						}
					}
				}
				resolve();
			})
		);
	}

	setValue(key, value) {
		return this.setValues({ [key]: value });
	}

	getValue(key, value) {
		return Utils.isSet(this.esgst.storage[key]) ? this.esgst.storage[key] : value;
	}

	getValues(values) {
		const output = {};
		for (const key in values) {
			if (values.hasOwnProperty(key)) {
				output[key] = Utils.isSet(this.esgst.storage[key]) ? this.esgst.storage[key] : values[key];
			}
		}
		return output;
	}

	delValues(keys) {
		return new Promise((resolve) =>
			browser.storage.local.remove(keys).then(() => {
				keys.forEach((key) => delete this.esgst.storage[key]);
				resolve();
			})
		);
	}

	delValue(key) {
		return this.delValues([key]);
	}

	openDonationsPopup() {
		const popup = new Popup({
			icon: 'fa-dollar',
			title: 'Donations',
			isTemp: true,
		});

		popup.getScrollable(
			<fragment>
				<br />
				<div>
					<a
						class="table__column__secondary-link"
						href={`https://www.buymeacoffee.com/rafaelgomesxyz`}
						target="_blank"
					>
						<strong>Buy Me A Coffee</strong>
					</a>
				</div>
				<div>
					<a
						class="table__column__secondary-link"
						href={`https://www.patreon.com/rafaelgomesxyz`}
						target="_blank"
					>
						<strong>Patreon</strong>
					</a>
				</div>
				<div>
					<a
						class="table__column__secondary-link"
						href={`https://steamcommunity.com/tradeoffer/new/?partner=214244550&token=LW6Selqp`}
						target="_blank"
					>
						<strong>Steam Trade</strong>
					</a>
				</div>
				<div>
					<strong>Paypal:</strong> rafaelgomesxyz@gmail.com{' '}
					{this.getCopyIcon('rafaelgomesxyz@gmail.com')}
				</div>
				<div>
					<strong>Bitcoin:</strong> 32WY96ch5MSZ3FNubL5f7QZ9K3WWNHNpV9{' '}
					{this.getCopyIcon('32WY96ch5MSZ3FNubL5f7QZ9K3WWNHNpV9')}
				</div>
				<div>
					<strong>Monero:</strong>{' '}
					42Tw49nUAig3kk1tJh1y1ZP8vrkmY4EH3QW3SRijHxGggtBpDUn2TqJAVBJYBCybGXNninC4gGD9nhe3cttBaZ6u5NuhiLM{' '}
					{this.getCopyIcon(
						'42Tw49nUAig3kk1tJh1y1ZP8vrkmY4EH3QW3SRijHxGggtBpDUn2TqJAVBJYBCybGXNninC4gGD9nhe3cttBaZ6u5NuhiLM'
					)}
				</div>
				<div>
					<strong>Humble Bundle Partner ID:</strong> gsrafael01 {this.getCopyIcon('gsrafael01')}
				</div>
			</fragment>
		);

		popup.open();
	}

	openRequestLog = async () => {
		const limits = {
			minute: 120,
			hour: 2400,
			day: 14400,
		};

		const popup = new Popup({
			icon: 'fa-history',
			title: 'SteamGifts Request Log',
			isTemp: true,
		});
		const [buttonGroup] = DOM.insert(
			popup.description,
			'beforeend',
			<div className="esgst-button-group">View: </div>
		);
		Button.create({
			color: 'green',
			name: 'Default',
			onClick: async () => {
				await Shared.common.setSetting('sgRequestLog_view', 'default');
				this.loadRequestLog(limits, scrollableArea);
			},
		}).insert(buttonGroup, 'beforeend');
		Button.create({
			color: 'green',
			name: 'Minutes',
			onClick: async () => {
				await Shared.common.setSetting('sgRequestLog_view', 'minute');
				this.loadRequestLog(limits, scrollableArea);
			},
		}).insert(buttonGroup, 'beforeend');
		Button.create({
			color: 'green',
			name: 'Hours',
			onClick: async () => {
				await Shared.common.setSetting('sgRequestLog_view', 'hour');
				this.loadRequestLog(limits, scrollableArea);
			},
		}).insert(buttonGroup, 'beforeend');
		Button.create({
			color: 'green',
			name: 'Days',
			onClick: async () => {
				await Shared.common.setSetting('sgRequestLog_view', 'day');
				this.loadRequestLog(limits, scrollableArea);
			},
		}).insert(buttonGroup, 'beforeend');
		const scrollableArea = popup.getScrollable(null);
		scrollableArea.className = 'markdown';
		popup.open();

		do {
			this.loadRequestLog(limits, scrollableArea);
			await Shared.common.timeout(10000);
		} while (popup.isOpen);
	};

	loadRequestLog = async (limits, scrollableArea) => {
		const currentDate = new Date();
		const now = currentDate.getTime();
		const currentDay = currentDate.getDate();
		const currentHour = currentDate.getHours();
		const currentMinute = currentDate.getMinutes();
		currentDate.setDate(currentDay - 1);
		const lastDay = currentDate.getDate();
		currentDate.setHours(currentHour - 1);
		const lastHour = currentDate.getHours();
		currentDate.setMinutes(currentMinute - 1);
		const lastMinute = currentDate.getMinutes();

		const info = {
			minute: {
				title: 'Minute',
				items: [],
			},
			hour: {
				title: 'Hour',
				items: [],
			},
			day: {
				title: 'Day',
				items: [],
			},
		};

		Shared.esgst.requestLog = Shared.esgst.requestLog.filter(
			(log) => now - log.timestamp <= 2592000000
		);
		for (const log of Shared.esgst.requestLog) {
			const date = new Date(log.timestamp);
			const day = date.getDate();
			const hour = date.getHours();
			const minute = date.getMinutes();

			if (day === currentDay) {
				if (!info.day.items[0]) {
					info.day.items[0] = { count: 0, urls: {} };
				}
				info.day.items[0].urls[log.url] = (info.day.items[0].urls[log.url] ?? 0) + 1;
				info.day.items[0].count += 1;
				const hIndex = currentHour - hour;
				if (!info.hour.items[hIndex]) {
					info.hour.items[hIndex] = { count: 0, urls: {} };
				}
				info.hour.items[hIndex].urls[log.url] = (info.hour.items[hIndex].urls[log.url] ?? 0) + 1;
				info.hour.items[hIndex].count += 1;
				const mIndex = hour === currentHour ? currentMinute - minute : 60 - minute + currentMinute;
				if (mIndex < 60) {
					if (!info.minute.items[mIndex]) {
						info.minute.items[mIndex] = { count: 0, urls: {} };
					}
					info.minute.items[mIndex].urls[log.url] =
						(info.minute.items[mIndex].urls[log.url] ?? 0) + 1;
					info.minute.items[mIndex].count += 1;
				}
			} else if (day === lastDay) {
				if (!info.day.items[1]) {
					info.day.items[1] = { count: 0, urls: {} };
				}
				info.day.items[1].urls[log.url] = (info.day.items[1].urls[log.url] ?? 0) + 1;
				info.day.items[1].count += 1;
				const hIndex = 24 - hour + currentHour;
				if (hIndex < 24) {
					if (!info.hour.items[hIndex]) {
						info.hour.items[hIndex] = { count: 0, urls: {} };
					}
					info.hour.items[hIndex].urls[log.url] = (info.hour.items[hIndex].urls[log.url] ?? 0) + 1;
					info.hour.items[hIndex].count += 1;
				}
				if (hour === lastHour) {
					const mIndex = 60 - minute + currentMinute;
					if (mIndex < 60) {
						if (!info.minute.items[mIndex]) {
							info.minute.items[mIndex] = { count: 0, urls: {} };
						}
						info.minute.items[mIndex].urls[log.url] =
							(info.minute.items[mIndex].urls[log.url] ?? 0) + 1;
						info.minute.items[mIndex].count += 1;
					}
				}
			} else {
				break;
			}
		}
		await Shared.common.setValue('requestLog', JSON.stringify(Shared.esgst.requestLog));

		for (const key in info) {
			for (let i = 0, n = info[key].items.length; i < n; i++) {
				if (info[key].items[i]) {
					info[key].items[i].urls = Utils.sortArray(
						Object.entries(info[key].items[i].urls).map(([url, count]) => ({ url, count })),
						true,
						'count'
					);
				}
			}
		}

		const nodes = [];
		const view = Settings.get('sgRequestLog_view');
		if (!view || view === 'default') {
			for (const i of [0, 1]) {
				for (const key in info) {
					let title;
					const count = info[key].items[i]?.count ?? 0;
					const countPercentage = Math.round((count / limits[key]) * 10000) / 100;
					if (i === 0) {
						const countLeft = limits[key] - count;
						const countLeftPercentage = Math.round((100 - countPercentage) * 100) / 100;
						title = `This ${info[key].title} - Current: ${count} (${countPercentage}%) / Left: ${countLeft} (${countLeftPercentage}%) / Max: ${limits[key]}`;
					} else {
						title = `Last ${info[key].title} - ${count} (${countPercentage}%)`;
					}
					nodes.push(
						Collapsible.create(
							<h3>{title}</h3>,
							<ul>
								{(info[key].items[i]?.urls ?? []).map(({ url, count }) => (
									<li>
										<a href={url}>{url}</a> ({count})
									</li>
								))}
							</ul>,
							`sgRequestLog_${key}_${i}`
						)
					);
				}
			}
		} else {
			const key = view;
			for (let i = 0, n = info[key].items.length; i < n; i++) {
				let title;
				const count = info[key].items[i]?.count ?? 0;
				const countPercentage = Math.round((count / limits[key]) * 100) / 100;
				if (i === 0) {
					const countLeft = limits[key] - count;
					const countLeftPercentage = Math.round((100 - countPercentage) * 100) / 100;
					title = `This ${info[key].title} - Current: ${count} (${countPercentage}%) / Left: ${countLeft} (${countLeftPercentage}%) / Max: ${limits[key]}`;
				} else {
					title = `${i} ${Utils.getPlural(
						i,
						info[key].title
					)} Ago - ${count} (${countPercentage}%)`;
				}
				nodes.push(
					Collapsible.create(
						<h3>{title}</h3>,
						<ul>
							{(info[key].items[i]?.urls ?? []).map(({ url, count }) => (
								<li>
									<a href={url}>{url}</a> ({count})
								</li>
							))}
						</ul>,
						`sgRequestLog_${key}_${i}`
					)
				);
			}
		}

		DOM.insert(
			scrollableArea,
			'atinner',
			<fragment>
				<p>
					<em>Last updated {currentDate.toLocaleString()}</em>
					<br />
					<em>
						Remember that this does not include the requests you make while browsing SteamGifts, so
						you don't want to reach 0 requests left, because that leaves exactly 0 requests for your
						browsing.
					</em>
				</p>
				{nodes}
			</fragment>
		);
	};

	async addHeaderMenu() {
		if (!Shared.header) {
			return;
		}

		Shared.header.addButtonContainer({
			buttonImage: Shared.esgst.icon,
			buttonName: ' ESGST',
			isDropdown: true,
			side: 'left',
			url: 'https://www.steamgifts.com/account/settings/profile?esgst=settings',
			dropdownItems: [
				{
					description: 'Visit the GitHub page.',
					icon: 'fa fa-fw fa-github icon-grey grey',
					name: 'GitHub',
					openInNewTab: true,
					url: 'https://github.com/rafaelgomesxyz/esgst',
				},
				{
					description: 'Report bugs and / or make suggestions.',
					icon: 'fa fa-fw fa-bug icon-red red',
					name: 'Bugs / Suggestions',
					openInNewTab: true,
					url: 'https://github.com/rafaelgomesxyz/esgst/issues',
				},
				{
					description: "Check out what's coming in the next versions.",
					icon: 'fa fa-fw fa-map-signs icon-blue blue',
					name: 'Milestones',
					openInNewTab: true,
					url: 'https://github.com/rafaelgomesxyz/esgst/milestones',
				},
				{
					description: 'Visit the discussion page.',
					icon: 'fa fa-fw fa-commenting icon-green green',
					name: 'Discussion',
					url: 'https://www.steamgifts.com/discussion/TDyzv/',
				},
				{
					description: 'Visit / join the Steam group.',
					icon: 'fa fa-fw fa-steam icon-green green',
					name: 'Steam Group',
					openInNewTab: true,
					url: 'http://steamcommunity.com/groups/esgst',
				},
				{
					description: 'Check out the changelog.',
					icon: 'fa fa-fw fa-file-text-o icon-yellow yellow',
					name: 'Changelog',
					openInNewTab: true,
					url: 'https://github.com/rafaelgomesxyz/esgst/releases',
				},
				{
					description: 'Help make ESGST better!',
					icon: 'fa fa-fw fa-dollar icon-green green',
					name: 'Donations',
					onClick: this.openDonationsPopup.bind(this),
				},
				{
					description: 'Check out the SteamGifts request log.',
					icon: 'fa fa-fw fa-history icon-grey grey',
					name: 'SteamGifts Request Log',
					onClick: this.openRequestLog.bind(this),
				},
				{
					icon: 'fa fa-fw fa-info-circle icon-grey grey',
					name: `Current Version: ${Shared.esgst.versionName}`,
				},
			],
			onClick: (event) => {
				if (!Settings.get('openSettingsInTab')) {
					event.preventDefault();
					try {
						settingsModule.loadMenu(true);
					} catch (err) {
						Logger.error(err.message);
					}
				}
			},
		});

		Shared.header.buttonContainers['esgst'].nodes.outer.id = 'esgst';

		const arrow = Shared.header.buttonContainers['esgst'].nodes.arrow;

		arrow.addEventListener('click', this.toggleHeaderMenu.bind(this), true);
	}

	getSelectors(endless, selectors) {
		if (endless) {
			const newSelectors = [];
			for (const selector of selectors) {
				newSelectors.push(
					selector.replace(/X/, `.esgst-es-page-${endless} `),
					selector.replace(/X/, `.esgst-es-page-${endless}`)
				);
			}
			selectors = newSelectors.join(`, `);
		} else {
			selectors = selectors.map((x) => x.replace(/X/, '')).join(`, `);
		}
		return selectors;
	}

	getLevelFromCv(cv) {
		for (const [index, value] of Shared.esgst.cvLevels.entries()) {
			if (cv < value) {
				const prevValue = Shared.esgst.cvLevels[index - 1];
				return this.round(index - 1 + (cv - prevValue) / (value - prevValue));
			}
		}
	}

	getChanges(changes, areaName) {
		if (areaName !== 'local') {
			return;
		}
		for (const key in changes) {
			if (!changes.hasOwnProperty(key)) {
				continue;
			}
			const change = changes[key];
			if (change.newValue === null) {
				delete Shared.esgst.storage[key];
				delete Shared.esgst[key];
			}
			if (!Utils.isSet(change.newValue)) {
				continue;
			}
			Shared.esgst.storage[key] = change.newValue;
			try {
				Shared.esgst[key] = JSON.parse(Shared.esgst.storage[key]);
			} catch (e) {
				Shared.esgst[key] = Shared.esgst.storage[key];
			}
		}
	}

	dateToServer(dateStr) {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
			-2
		)}-${`0${date.getDate()}`.slice(-2)}`;
	}

	dateFromServer(dateStr) {
		const dateParts = dateStr.split('-');
		const year = parseInt(dateParts[0]);
		const month = parseInt(dateParts[1]);
		const day = parseInt(dateParts[2]);
		return `${SHORT_MONTHS[month - 1]} ${day}, ${year}`;
	}

	areArraysEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) {
			return false;
		}
		for (let i = 0, n = arr1.length; i < n; i++) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}
		return true;
	}

	findFeature(term) {
		term = term.toLowerCase();

		let feature = null;
		let score = 0;

		for (const id of Object.keys(Shared.esgst.featuresById)) {
			const currentFeature = Shared.esgst.featuresById[id];
			let currentScore = 0;

			const name = currentFeature.name.toLowerCase();

			if (name === term) {
				return currentFeature;
			}

			const nameMatches = name.match(term);
			if (nameMatches) {
				currentScore += nameMatches[0].length / name.length;
			}

			if (currentScore > score) {
				feature = currentFeature;
				score = currentScore;
			}
		}

		return feature;
	}
}

// Singleton
const common = new Common();

Shared.add({ common });

export { common };
