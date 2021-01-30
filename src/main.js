'use strict';

// that will append styles to page in runtime
import './assets/styles';
import { browser } from './browser';
import { DOM } from './class/DOM';
import { esgst } from './class/Esgst';
import { Logger } from './class/Logger';
import { MessageNotifier } from './class/MessageNotifier';
import { persistentStorage } from './class/PersistentStorage';
import { Session } from './class/Session';
import { Settings } from './class/Settings';
import { SettingsAnalytics } from './class/SettingsAnalytics';
import { Shared } from './class/Shared';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { addStyle } from './modules/Style';
import { runSilentSync } from './modules/Sync';

(() => {
	const common = esgst.modules.common;
	// @ts-ignore
	if (!window.NodeList.prototype[Symbol.iterator]) {
		// @ts-ignore
		window.NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
	}

	// @ts-ignore
	if (!window.HTMLCollection.prototype[Symbol.iterator]) {
		// @ts-ignore
		window.HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
	}

	// initialize esgst
	async function init() {
		if (document.getElementById('esgst')) {
			// esgst is already running
			return;
		}

		esgst.markdownParser.setBreaksEnabled(true);
		esgst.markdownParser.setMarkupEscaped(true);
		esgst.name = esgst.sg ? 'sg' : 'st';

		browser.runtime.onMessage.addListener((message) => {
			message = JSON.parse(message);
			switch (message.action) {
				case 'notify-tds':
					Shared.esgst.modules.generalThreadSubscription.updateItems(message.values);
					break;
				case 'storageChanged':
					Shared.common.getChanges(message.values.changes, message.values.areaName);
					break;
				case 'update':
					common.createConfirmation(
						`Hi! A new version of ESGST (${message.values.version}) is available. Do you want to force an update now? If you choose to force an update, ESGST will stop working in any SteamGifts/SteamTrades tab that is open, along with any operation that you might be performing (such as syncing, checking something etc), so you will have to refresh them. If you choose not to force an update, your browser will automatically update the extension when you are not using it (for example, when you restart the browser).`,
						() => {
							browser.runtime.sendMessage({ action: 'reload' }).then(() => {});
						},
						() => {}
					);
					break;
			}
		});

		// set default values or correct values
		await browser.runtime.sendMessage({
			action: 'register_tab',
			url: window.location.href,
		});
		/**
		 * @property {object} esgst.storage.Emojis
		 * @property {object} esgst.storage.filterPresets
		 * @property {object} esgst.storage.dfPresets
		 */
		esgst.storage = await browser.storage.local.get(null);
		browser.storage.onChanged.addListener(Shared.common.getChanges.bind(Shared.common));

		esgst.features = common.getFeatures();
		[esgst.featuresById, esgst.featuresAncestors] = common.getFeaturesById();

		await persistentStorage.upgrade(esgst.storage, esgst.storage.v);

		esgst.decryptedGiveaways = JSON.parse(esgst.storage.decryptedGiveaways);
		esgst.delistedGames = JSON.parse(esgst.storage.delistedGames);
		esgst.discussions = JSON.parse(esgst.storage.discussions);
		esgst.emojis = JSON.parse(esgst.storage.emojis);
		esgst.games = JSON.parse(esgst.storage.games);
		esgst.giveaways = JSON.parse(esgst.storage.giveaways);
		esgst.groups = JSON.parse(esgst.storage.groups);
		esgst.requestLog = JSON.parse(esgst.storage.requestLog);
		esgst.rerolls = JSON.parse(esgst.storage.rerolls);
		esgst.settings = JSON.parse(esgst.storage.settings);
		esgst.tickets = JSON.parse(esgst.storage.tickets);
		esgst.trades = JSON.parse(esgst.storage.trades);
		esgst.users = JSON.parse(esgst.storage.users);
		esgst.winners = JSON.parse(esgst.storage.winners);
		esgst.notifiedMessages = JSON.parse(esgst.storage.notifiedMessages);

		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', load);
		} else {
			// noinspection JSIgnoredPromiseFromCall
			load();
		}
	}

	async function load() {
		esgst.bodyLoaded = true;

		let settingsChanged = false;

		if (esgst.sg) {
			try {
				const avatar = document
					.getElementsByClassName('nav__avatar-inner-wrap')[0]
					.style.backgroundImage.match(/\("(.+)"\)/)[1];

				if (esgst.settings.avatar !== avatar) {
					esgst.settings.avatar = avatar;

					settingsChanged = true;
				}

				const username = document
					.getElementsByClassName('nav__avatar-outer-wrap')[0]
					.href.match(/\/user\/(.+)/)[1];

				if (esgst.settings.username_sg !== username) {
					esgst.settings.username_sg = username;

					settingsChanged = true;
				}

				if (!esgst.settings.registrationDate_sg || !esgst.settings.steamId) {
					const responseHtml = DOM.parse(
						(
							await common.request({
								method: 'GET',
								url: `https://www.steamgifts.com/user/${esgst.settings.username_sg}`,
							})
						).responseText
					);

					const elements = responseHtml.getElementsByClassName('featured__table__row__left');

					for (const element of elements) {
						if (element.textContent === 'Registered') {
							esgst.settings.registrationDate_sg = parseInt(
								element.nextElementSibling.firstElementChild.getAttribute('data-timestamp')
							);

							break;
						}
					}

					esgst.settings.steamId = responseHtml
						.querySelector(`a[href*="/profiles/"]`)
						.getAttribute('href')
						.match(/\d+/)[0];

					settingsChanged = true;
				}
			} catch (e) {}
		} else {
			try {
				const avatar = document
					.getElementsByClassName('nav_avatar')[0]
					.style.backgroundImage.match(/\("(.+)"\)/)[1];

				if (esgst.settings.avatar !== avatar) {
					esgst.settings.avatar = avatar;

					settingsChanged = true;
				}

				const username = document.querySelector(
					`.author_name[href*="/user/${esgst.settings.steamId}"], .underline[href*="/user/${esgst.settings.steamId}"]`
				).textContent;

				if (esgst.settings.username_st !== username) {
					esgst.settings.username_st = username;

					settingsChanged = true;
				}
			} catch (e) {}
		}

		if (settingsChanged) {
			await common.setValue('settings', JSON.stringify(esgst.settings));
		}

		Settings.init();

		// now that all values are set esgst can begin to load

		if (esgst.sg) {
			esgst.headerSize = 39;
			esgst.footerSize = 44;
		} else {
			esgst.headerSize = Settings.get('fh') ? 231 : 454;
			esgst.footerSize = Settings.get('ff') ? 44 : 64;
		}
		esgst.mainPageHeadingSize = 45;
		esgst.pageTop = Settings.get('fh') ? esgst.headerSize : 0;
		esgst.commentsTop = esgst.pageTop + (Settings.get('fmph') ? esgst.mainPageHeadingSize : 0);

		addStyle();

		/* [URLR] URL Redirector */
		if (
			Settings.get('urlr') &&
			window.location.pathname.match(/^\/(giveaway|discussion|support\/ticket|trade)\/.{5}$/)
		) {
			window.location.href = `${window.location.href}/`;
		}

		for (const key in esgst.paths) {
			for (const item of esgst.paths[key]) {
				item.pattern = item.pattern.replace(/%steamId%/, Settings.get('steamId'));
			}
		}

		esgst.currentPaths = [];
		const effectivePath = common.getPath(window.location.href);
		for (const pathObj of esgst.paths[esgst.name]) {
			if (effectivePath.match(pathObj.pattern)) {
				esgst.currentPaths.push(pathObj.name);
			}
		}

		if (common.isCurrentPath('Account')) {
			if (window.location.href.match(/state=dropbox/)) {
				await common.setValue('dropboxToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
				window.close();
			} else if (window.location.href.match(/state=google-drive/)) {
				await common.setValue(
					'googleDriveToken',
					window.location.hash.match(/access_token=(.+?)&/)[1]
				);
				window.close();
			} else if (window.location.href.match(/state=onedrive/)) {
				await common.setValue(
					'oneDriveToken',
					window.location.hash.match(/access_token=(.+?)&/)[1]
				);
				window.close();
			} else if (window.location.href.match(/state=imgur/)) {
				await common.setValue('imgurToken', window.location.hash.match(/access_token=(.+?)&/)[1]);
				window.close();
			}
		}

		Session.init();

		try {
			Shared.header = new Header();
			Shared.header.parse(document.body);

			Shared.footer = new Footer();
			Shared.footer.parse(document.body);
		} catch (e) {
			Logger.error(e.message);
		}

		if (!Session.isLoggedIn) {
			return;
		}

		if (esgst.st && !Settings.get('esgst_st')) {
			// esgst is not enabled for steamtrades
			return;
		}
		esgst.lastPage = esgst.modules.generalLastPageLink.lpl_getLastPage(document, true);
		await common.getElements();
		if (esgst.sg) {
			// noinspection JSIgnoredPromiseFromCall
			common.checkSync();
		}
		if (Settings.get('autoBackup')) {
			common.checkBackup();
		}
		if (esgst.profilePath && Settings.get('autoSync')) {
			const el = document.getElementsByClassName('form__sync-default')[0];
			if (el) {
				el.addEventListener('click', () => runSilentSync(`Games=1&Groups=1`));
			}
		}

		await common.addHeaderMenu();

		common.checkNewVersion();

		SettingsAnalytics.check();

		if (Settings.get('showMessages')) {
			await MessageNotifier.notify(esgst.notifiedMessages);
		}

		await common.loadFeatures(esgst.modules);
	}

	init().catch((err) => console.log(err));
})();
