import { Module } from '../../class/Module';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { Logger } from '../../class/Logger';
import { FetchRequest } from '../../class/FetchRequest';
import { Popout } from '../../class/Popout';
import { DOM } from '../../class/DOM';

class GeneralThreadSubscription extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							"Allows you to subscribe to threads so that you're notified when a new comment is posted.",
						],
						[
							'li',
							[
								'Adds a ',
								['i', { class: 'fa fa-bell-o' }],
								' button to the header that allows you to view your subscriptions.',
							],
						],
					],
				],
			],
			id: 'tds',
			name: 'Thread Subscription',
			sg: true,
			st: true,
			type: 'general',
			features: {
				tds_n: {
					name: 'Show browser notifications when there are new comments in the subscriptions.',
					sg: true,
					st: true,
				},
			},
			inputItems: [
				{
					attributes: {
						min: 0,
						type: 'number',
					},
					id: 'tds_minutes',
					prefix: 'Check every ',
					suffix: ' minutes',
				},
			],
		};

		this.button = null;
		this.lockObj = null;
		this.minutes = null;
		this.popout = null;
		this.subscribedItems = [];

		this.forumCategories = {
			'': 'All',
			'addons-tools': 'Add-ons / Tools',
			announcements: 'Announcements',
			'bugs-suggestions': 'Bugs / Suggestions',
			deals: 'Deals',
			'game-showcase': 'Game Showcase',
			general: 'General',
			'group-recruitment': 'Group Recruitment',
			hardware: 'Hardware',
			help: 'Help',
			'lets-play-together': "Let's Play Together",
			'movies-tv': 'Movies / TV',
			'off-topic': 'Off Topic',
			'puzzles-events': 'Puzzles / Events',
			uncategorized: 'Uncategorized',
			'user-projects': 'User Projects',
			'whitelist-recruitment': 'Whitelist Recruitment',
		};
	}

	async init() {
		this.button = Shared.header.addButtonContainer({
			buttonIcon: 'fa fa-circle-o-notch fa-spin',
			buttonName: 'ESGST Thread Subscriptions',
			isNotification: true,
			side: 'right',
		});

		this.button.nodes.buttonIcon.title = 'Loading your subscriptions';

		this.popout = new Popout('esgst-tds-popout', this.button.nodes.outer, 0, true);

		this.minutes = parseInt(Settings.get('tds_minutes')) * 60000;

		this.startDaemon();

		if (Shared.esgst.discussionsPath || Shared.esgst.discussionPath) {
			const forumCodes = Object.keys(this.forumCategories);

			for (const forumCode of forumCodes) {
				const element = document.querySelector(
					`.sidebar__navigation__item__link[href="/discussions${forumCode ? `/${forumCode}` : ''}"]`
				);

				if (!element) {
					continue;
				}

				element.parentElement.classList.add('esgst-tds-sidebar-item');

				if (Settings.get('tds_forums')[forumCode]) {
					this.addUnsubscribeButton(
						null,
						forumCode,
						element,
						null,
						this.forumCategories[forumCode],
						'forum'
					);
				} else {
					this.addSubscribeButton(
						null,
						forumCode,
						element,
						null,
						this.forumCategories[forumCode],
						'forum'
					);
				}
			}
		}

		if (!Shared.esgst.commentsPath) {
			return;
		}

		const match = window.location.pathname.match(/(discussion|ticket|trade)\/(.+?)\//);
		const type = `${match[1]}s`;
		const code = match[2];

		const context = document.querySelector('.page__heading, .page_heading');
		const name = context.querySelector('h1').textContent.trim();

		const heading = Shared.esgst.mainPageHeading.querySelector(
			'.page__heading__breadcrumbs, .page_heading_breadcrumbs'
		).firstElementChild;
		const count = parseInt(heading.textContent.replace(/,/g, '').match(/\d+/)[0]);

		if (Shared.esgst.discussionPath || Shared.esgst.tradePath) {
			const savedThread = Shared.esgst[type][code];

			if (savedThread && typeof savedThread.subscribed !== 'undefined') {
				this.addUnsubscribeButton(null, code, context, count, name, type);
			} else {
				this.addSubscribeButton(null, code, context, count, name, type);
			}
		}
	}

	async dismissItem(event, item) {
		item.diff = 0;

		if (item.type === 'forum') {
			await this.subscribe(item.code, item.codes, item.name, item.type);
		} else {
			item.subscribed = item.count;

			await this.subscribe(item.code, item.count, item.name, item.type);
		}

		event.target.remove();

		await Shared.common.notifyTds(this.subscribedItems);
	}

	async unsubscribeItem(element, item) {
		if (item.type !== 'forum') {
			delete item.subscribed;
		}

		await this.unsubscribe(item.code, item.type);

		element.remove();

		await Shared.common.notifyTds(this.subscribedItems);

		if (this.popout.isOpen) {
			this.popout.reposition();
		}
	}

	async updatePopout() {
		this.popout.popout.innerHTML = '';

		this.subscribedItems = this.subscribedItems.filter(
			(item) => typeof item.subscribed !== 'undefined' || Settings.get('tds_forums')[item.code]
		);
		this.subscribedItems.sort((a, b) => (a.diff > b.diff ? -1 : 1));

		for (const item of this.subscribedItems) {
			const element = DOM.build(this.popout.popout, 'beforeEnd', [
				[
					'div',
					{ class: `esgst-tds-item ${item.diff ? 'esgst-tds-item-active' : ''}` },
					[
						[
							'div',
							{ class: 'esgst-tds-item-description' },
							[
								[
									'a',
									{
										class: 'esgst-tds-item-name',
										href:
											item.type === 'forum'
												? `https://www.steamgifts.com/discussions${
														item.code ? `/${item.code}` : ''
												  }`
												: item.type === 'discussions'
												? `https://www.steamgifts.com/discussion/${item.code}/`
												: `https://www.steamtrades.com/${item.code}/`,
									},
									item.type === 'forum' ? this.forumCategories[item.code] : item.name,
								],
								[
									'div',
									{ class: 'esgst-tds-item-count' },
									item.diff
										? `${item.diff} new ${item.type === 'forum' ? 'threads' : 'comments'}`
										: `No new ${item.type === 'forum' ? 'threads' : 'comments'}`,
								],
							],
						],
						[
							'div',
							{ class: 'esgst-tds-item-actions' },
							[
								item.diff
									? [
											'i',
											{
												class: 'fa fa-eye',
												title: 'Dismiss',
												onclick: (event) => this.dismissItem(event, item),
											},
									  ]
									: null,
								[
									'i',
									{
										class: 'fa fa-bell',
										title: 'Unsubscribe',
										onclick: () => this.unsubscribeItem(element, item),
									},
								],
							],
						],
					],
				],
			]);
		}

		if (this.popout.isOpen) {
			this.popout.reposition();
		}
	}

	updateButton() {
		if (this.subscribedItems.filter((item) => item.diff).length) {
			this.button.nodes.outer.classList.remove('nav__button-container--inactive');
			this.button.nodes.outer.classList.add('nav__button-container--active');
			this.button.nodes.buttonIcon.className = 'fa fa-bell';
			this.button.nodes.buttonIcon.title = 'New comments in your subscriptions, click to see';
		} else {
			this.button.nodes.outer.classList.remove('nav__button-container--active');
			this.button.nodes.outer.classList.add('nav__button-container--inactive');
			this.button.nodes.buttonIcon.className = 'fa fa-bell-o';
			this.button.nodes.buttonIcon.title = 'No new comments in your subscriptions';
		}

		this.updatePopout();
	}

	updateItems(items) {
		this.subscribedItems = items;

		this.updateButton();
	}

	async showNotification() {
		const result = await window.Notification.requestPermission();

		if (result !== 'granted') {
			return;
		}

		new Notification('ESGST Notification', {
			body: 'There are new comments in your subscriptions.',
			icon: 'https://dl.dropboxusercontent.com/s/lr3t3bxrxfxylqe/esgstIcon.ico?raw=1',
			tag: 'TDS',
		});
	}

	async runDaemon(firstRun) {
		//Logger.info('Running TDS daemon...');

		await Shared.common.updateLock(this.lockObj.lock);

		const oldDiff = this.subscribedItems
			.filter((item) => item.diff)
			.reduce((sum, currentItem) => sum + currentItem.diff, 0);

		this.subscribedItems = [];

		for (const code in Shared.esgst.discussions) {
			const discussion = Shared.esgst.discussions[code];

			if (typeof discussion.subscribed !== 'undefined') {
				this.subscribedItems.push({
					code,
					count: discussion.subscribed,
					diff: 0,
					name: discussion.name,
					subscribed: discussion.subscribed,
					type: 'discussions',
				});
			}
		}

		for (const code in Shared.esgst.trades) {
			const trade = Shared.esgst.trades[code];

			if (typeof trade.subscribed !== 'undefined') {
				this.subscribedItems.push({
					code,
					count: trade.subscribed,
					diff: 0,
					name: trade.name,
					subscribed: trade.subscribed,
					type: 'trades',
				});
			}
		}

		for (const item of this.subscribedItems) {
			const response = await FetchRequest.get(
				item.type === 'discussions'
					? `https://www.steamgifts.com/discussion/${item.code}/`
					: `https://www.steamtrades.com/trade/${item.code}/`
			);

			const mainPageHeading = response.html.querySelectorAll('.page__heading, .page_heading')[1];

			const heading = mainPageHeading.querySelector(
				'.page__heading__breadcrumbs, .page_heading_breadcrumbs'
			).firstElementChild;
			const count = parseInt(heading.textContent.replace(/,/g, '').match(/\d+/)[0]);

			if (count !== item.count) {
				item.diff = count - item.count;
				item.count = count;
			}
		}

		for (const code in Settings.get('tds_forums')) {
			const codes = [];

			const response = await FetchRequest.get(
				`/discussions${code ? `/${code}` : ''}/search?sort=new`
			);

			const elements = response.html.querySelectorAll('.table__column__heading');

			for (const element of elements) {
				codes.push(element.getAttribute('href').match(/\/discussion\/(.+?)\//)[1]);
			}

			const diff = codes.filter((subCode) => !Settings.get('tds_forums')[code].includes(subCode))
				.length;

			this.subscribedItems.push({
				code,
				codes,
				diff,
				type: 'forum',
			});
		}

		const newDiff = this.subscribedItems
			.filter((item) => item.diff)
			.reduce((sum, currentItem) => sum + currentItem.diff, 0);

		if (Settings.get('tds_n') && !firstRun && oldDiff !== newDiff) {
			this.showNotification();
		}

		Shared.common.notifyTds(this.subscribedItems);

		this.updateButton();

		window.setTimeout(this.runDaemon.bind(this, false), this.minutes);
	}

	async startDaemon() {
		this.lockObj = await Shared.common.createLock('tdsLock', 300, {
			lockOrDie: true,
			timeout: this.minutes + 15000,
		});

		if (!this.lockObj.wasLocked) {
			//Logger.info('TDS Daemon already running....');

			this.updateItems(await Shared.common.getTds());

			return;
		}

		await this.runDaemon(true);
	}

	async subscribe(code, countOrCodes, name, type) {
		if (type === 'forum') {
			if (countOrCodes !== null) {
				const forums = Settings.get('tds_forums');
				forums[code] = countOrCodes;
				Settings.set('tds_forums', forums);
			} else {
				const codes = [];

				const response = await FetchRequest.get(
					`/discussions${code ? `/${code}` : ''}/search?sort=new`
				);

				const elements = response.html.querySelectorAll('.table__column__heading');

				for (const element of elements) {
					codes.push(element.getAttribute('href').match(/\/discussion\/(.+?)\//)[1]);
				}

				if (!Settings.get('tds_forums')[code]) {
					const forums = Settings.get('tds_forums');
					forums[code] = [];
					Settings.set('tds_forums', forums);
				}

				const forums = Settings.get('tds_forums');
				forums[code] = Array.from(new Set(Settings.get('tds_forums')[code].concat(codes)));
				Settings.set('tds_forums', forums);
			}

			await Shared.common.setSetting('tds_forums', Settings.get('tds_forums'));
		} else {
			const savedThread = Shared.esgst[type][code] || {};

			if (!savedThread.readComments) {
				savedThread.readComments = {};
			}

			savedThread.name = name;
			savedThread.subscribed = countOrCodes;
			savedThread.lastUsed = Date.now();

			switch (type) {
				case 'discussions':
					await Shared.common.lockAndSaveDiscussions({ [code]: savedThread });

					break;
				case 'trades':
					await Shared.common.lockAndSaveTrades({ [code]: savedThread });

					break;
			}
		}

		return true;
	}

	async unsubscribe(code, type) {
		if (type === 'forum') {
			delete Settings.get('tds_forums')[code];

			await Shared.common.setSetting('tds_forums', Settings.get('tds_forums'));
		} else {
			const savedThread = Shared.esgst[type][code] || {};

			savedThread.subscribed = null;
			savedThread.lastUsed = Date.now();

			switch (type) {
				case 'discussions':
					await Shared.common.lockAndSaveDiscussions({ [code]: savedThread });

					break;
				case 'trades':
					await Shared.common.lockAndSaveTrades({ [code]: savedThread });

					break;
			}
		}

		return true;
	}

	addSubscribeButton(button, code, context, count, name, type) {
		if (!button) {
			button = DOM.build(context, type === 'forum' ? 'afterEnd' : 'afterBegin', [
				['div', { class: 'esgst-tds-button page_heading_btn' }],
			]);
		}

		DOM.build(button, 'inner', [
			['i', { class: 'fa fa-bell-o', title: Shared.common.getFeatureTooltip('tds', 'Subscribe') }],
		]);

		let busy = false;

		button.addEventListener('click', async () => {
			if (busy) {
				return;
			}

			busy = true;

			DOM.build(button, 'inner', [['i', { class: 'fa fa-circle-o-notch fa-spin' }]]);

			await this.subscribe(code, count, name, type);

			this.addUnsubscribeButton(button, code, context, count, name, type);
		});
	}

	addUnsubscribeButton(button, code, context, count, name, type) {
		if (!button) {
			button = DOM.build(context, type === 'forum' ? 'afterEnd' : 'afterBegin', [
				['div', { class: 'esgst-tds-button page_heading_btn' }],
			]);
		}

		DOM.build(button, 'inner', [
			['i', { class: 'fa fa-bell', title: Shared.common.getFeatureTooltip('tds', 'Unsubscribe') }],
		]);

		let busy = false;

		button.addEventListener('click', async () => {
			if (busy) {
				return;
			}

			busy = true;

			DOM.build(button, 'inner', [['i', { class: 'fa fa-circle-o-notch fa-spin' }]]);

			await this.unsubscribe(code, type);

			this.addSubscribeButton(button, code, context, count, name, type);
		});
	}
}

const generalThreadSubscription = new GeneralThreadSubscription();

export { generalThreadSubscription };
