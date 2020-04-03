import { browser } from '../browser';
import { Popup } from './Popup';
import { Shared } from './Shared';
import { Settings } from './Settings';
import { DOM } from './DOM';

class Permissions {
	constructor() {
		this.permissions = {
			allUrls: {
				isOrigin: true,
				messages: {
					ge: 'Required by Giveaway Extractor to extract giveaways from any URL.'
				},
				values: ['<all_urls>']
			},
			cookies: {
				messages: {
					manipulateCookies: 'Required if the option to manipulate cookies is enabled.'
				},
				values: ['cookies', 'webRequest', 'webRequestBlocking']
			},
			dropbox: {
				isOrigin: true,
				messages: {
					storage: 'Required to back up / restore data to / from Dropbox.'
				},
				values: [`*://*.api.dropboxapi.com/*`, `*://*.content.dropboxapi.com/*`]
			},
			googleDrive: {
				isOrigin: true,
				messages: {
					storage: 'Required to back up / restore data to / from Google Drive.'
				},
				values: [`*://*.googleapis.com/*`]
			},
			googleWebApp: {
				isOrigin: true,
				messages: {
					namwc: 'Required by Not Activated / Multiple Wins Checker to retrieve the user\'s suspensions from the database.',
					ncv: 'Required to update the no CV games database when creating a new giveaway.',
					sync: 'Required to sync reduced / no CV games and HLTB times.',
					uh: 'Required by Username History to retrieve the user\'s username history and the list of recent changes from the database.',
					ust: 'Required by User Suspension Tracker to send tickets to the database.'
				},
				values: [`*://*.script.google.com/*`, `*://*.script.googleusercontent.com/*`]
			},
			imgur: {
				isOrigin: true,
				messages: {
					cfh: 'Required by Comment Formatting Helper to upload images.'
				},
				values: [`*://*.api.imgur.com/*`]
			},
			isThereAnyDeal: {
				isOrigin: true,
				messages: {
					itadi: 'Required by IsThereAnyDeal Info to retrieve the deals.'
				},
				values: [`*://*.isthereanydeal.com/*`]
			},
			oneDrive: {
				isOrigin: true,
				messages: {
					storage: 'Required to back up / restore data to / from OneDrive.'
				},
				values: [`*://*.files.1drv.com/*`, `*://*.graph.microsoft.com/*`]
			},
			server: {
				isOrigin: true,
				messages: {
					gc: 'Required by Game Categories to retrieve categories that need to be retrieved from Steam.',
					sync: 'Required to sync reduced CV games.'
				},
				values: [`*://*.rafaelgssa.com/*`]
			},
			revadike: {
				isOrigin: true,
				messages: {
					hgm: `Optional for Hidden Game Manager to hide games, by converting Steam app IDs to SteamGifts game IDs.`,
					mm: 'Optional for Multi Manager to hide games.',
					sync: 'Optional to hide games when syncing.'
				},
				values: [`*://*.revadike.com/*`]
			},
			steamApi: {
				isOrigin: true,
				messages: {
					glwc: 'Required by Group Libraries / Wishlists Checker to retrieve the users\' owned games.',
					hwlc: 'Required by Have / Want List Checker to retrieve the user\'s owned games.',
					sync: 'Required to sync owned / wishlisted / ignored games.',
					ugd: 'Required by User Giveaway Data to retrieve the user\'s playtimes / achievement stats.'
				},
				values: [`*://*.api.steampowered.com/*`]
			},
			steamCommunity: {
				isOrigin: true,
				messages: {
					as: 'Required by Archive Searcher to retrieve the title of a game when searching by app id.',
					glwc: 'Required by Group Libraries / Wishlists Checker to retrieve the group\'s members.',
					gs: 'Required by Groups Stats to retrieve the group\'s type.',
					sgc: 'Required by Shared Groups Checker to retrieve the user\'s groups.',
					sync: 'Required to sync followed games.',
					ugs: 'Required by Unsent Gifts Sender if the option to check group members is enabled.'
				},
				values: [`*://*.steamcommunity.com/*`]
			},
			steamStore: {
				isOrigin: true,
				messages: {
					gc: 'Required by Game Categories to retrieve categories that need to be retrieved from Steam.',
					glwc: 'Required by Group Libraries / Wishlists Checker to retrieve the users\' wishlists.',
					hwlc: 'Required by Have / Want List Checker to retrieve the user\'s wishlist.',
					rcvc: 'Required by Real CV Calculator to retrieve the game\'s price.',
					sync: 'Required to sync owned / wishlisted / ignored games.',
					ugd: 'Required by User Giveaway Data to get list of games in packages.'
				},
				values: [`*://*.store.steampowered.com/*`]
			},
			steamTracker: {
				isOrigin: true,
				messages: {
					sync: 'Required to sync delisted games.'
				},
				values: [`*://*.steam-tracker.com/*`]
			},
			userStyles: {
				isOrigin: true,
				messages: {
					settings: 'Required to retrieve themes.'
				},
				values: [`*://*.userstyles.org/*`]
			}
		};
	}

	async contains(keyArrays) {
		let result = false;

		for (const keys of keyArrays) {
			const { permissions, origins } = this.getValues(keys);

			result = result || await browser.runtime.sendMessage({
				action: 'permissions_contains',
				permissions: JSON.stringify({ permissions, origins })
			});

			if (result) {
				break;
			}
		}

		return result;
	}

	async request(keys) {
		let result = await this.contains([keys]);
		if (result) {
			return result;
		}
		const { permissions, origins } = this.getValues(keys);
		result = await browser.runtime.sendMessage({
			action: 'permissions_request',
			permissions: JSON.stringify({ permissions, origins })
		});
		if (!result) {
			let hasChanged = false;
			for (const key of keys) {
				if (Settings.get('permissionsDenied').indexOf(key) < 0) {
					Settings.get('permissionsDenied').push(key);
					hasChanged = true;
				}
			}
			if (hasChanged) {
				await Shared.common.setSetting('permissionsDenied', Settings.get('permissionsDenied'));
			}
		}
		return result;
	}

	remove(keys) {
		const { permissions, origins } = this.getValues(keys);
		return browser.runtime.sendMessage({
			action: 'permissions_remove',
			permissions: JSON.stringify({ permissions, origins })
		});
	}

	getValues(keys = []) {
		const permissions = [];
		const origins = [];
		for (const key of keys) {
			const permission = this.permissions[key];
			if (permission.isOrigin) {
				origins.push(...permission.values);
			} else {
				permissions.push(...permission.values);
			}
		}
		return { permissions, origins };
	}

	requestUi(keyArrays, messageKey, isProgrammatic, isOptional) {
		return new Promise(async resolve => {
			const result = await this.contains(keyArrays);
			if (result) {
				resolve(result);
				return;
			}
			if (isProgrammatic) {
				new Popup({
					icon: 'fa-lock',
					isTemp: true,
					title: this.getMessage(keyArrays, messageKey, isOptional)
				}).open();
				resolve(false);
				return;
			}
			const popup = new Popup({
				icon: 'fa-lock',
				isTemp: true,
				title: isOptional ? `In order to perform this action faster, ESGST recommends one of the optional permission combos below. Click the lock icon next to a combo to grant all of the permissions for that combo. If you decide not to grant permissions for any combo, the action will still be performed, but may take longer.` : `In order to perform this action, ESGST requires one of the permission combos below. Click the lock icon next to a combo to grant all of the permissions for that combo.`
			});

			for (const keys of keyArrays) {
				const items = [];

				for (const key of keys) {
					const permission = this.permissions[key];

					items.push(
						['div', [
							['strong', `${permission.values.join(`, `)}: `],
							permission.messages[messageKey]
						]]
					);
				}

				DOM.build(popup.scrollable, 'beforeEnd', [
					['br'],
					['div', { style: 'align-items: center; border: 1px solid #ccc; display: flex; justify-content: center; padding: 5px;' }, [
						['div', { style: 'margin-right: 5px;' }, items],
						['i', { class: 'fa fa-lock', style: 'border-left: 5px solid #ccc; cursor: pointer; font-size: 24px; padding-left: 5px;', onclick: async event => { await this.request(keys); event.target.remove(); } }]
					]]
				]);
			}

			popup.onCloseByUser = async () => resolve(await this.contains(keyArrays));
			popup.open();
		});
	}

	getMessage(keyArrays, messageKey, isOptional) {
		const combos = [];

		for (const keys of keyArrays) {
			const { permissions, origins } = this.getValues(keys);

			combos.push(permissions.concat(origins).join(` + `));
		}

		return `${messageKey && Shared.esgst.featuresById[messageKey] ? `${Shared.esgst.featuresById[messageKey].name} says: ` : ''} ${isOptional ? `If you want to perform this action faster, please go to the "Permissions" section of the settings menu and grant permissions for one (or all) of the combos: ${combos.join(' OR ')}` : `No permission to perform this action. Please go to the "Permissions" section of the settings menu and grant permissions for one (or all) of the combos: ${combos.join(' OR ')}`}`;
	}
}

const permissions = new Permissions();

export { permissions };