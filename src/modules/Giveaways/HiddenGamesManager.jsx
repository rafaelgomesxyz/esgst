import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { Session } from '../../class/Session';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Button } from '../../components/Button';
import { NotificationBar } from '../../components/NotificationBar';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	request = common.request.bind(common);
class GiveawaysHiddenGamesManager extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-eye-slash"></i> <i className="fa fa-plus-circle"></i>{' '}
						<i className="fa fa-times-circle"></i>) to your{' '}
						<a href="https://www.steamgifts.com/account/settings/giveaways/filters">
							giveaway filters
						</a>{' '}
						page that allows you to add / remove games to / from your hidden list.
					</li>
					<li>You can add all your owned / ignored games with a single click.</li>
					<li>You can remove all your owned / wishlisted games with a single click.</li>
				</ul>
			),
			id: 'hgm',
			name: 'Hidden Games Manager',
			sg: true,
			type: 'giveaways',
			features: {
				hgm_s: {
					name: `Automatically add / remove games from the list when syncing, based on the settings you have defined.`,
					sg: true,
				},
			},
		};
	}

	init() {
		if (!window.location.pathname.match(/^\/account\/settings\/giveaways\/filters/)) return;
		let button = createHeadingButton({
			id: 'hgm',
			icons: ['fa-eye-slash', 'fa-plus-circle', 'fa-times-circle'],
			title: 'Add / remove games to / from the list',
		});
		button.addEventListener('click', this.openPopup.bind(this, { button }));
	}

	openPopup(obj) {
		if (obj.popup) {
			obj.popup.open();
			return;
		}
		obj.popup = new Popup({
			addScrollable: true,
			icon: 'fa-plus fa-times',
			title: `Add / remove hidden games:`,
		});
		obj.result = createElements(obj.popup.scrollable, 'beforeend', [
			{
				attributes: {
					class: 'markdown',
				},
				type: 'div',
			},
		]);
		DOM.insert(
			obj.popup.description,
			'afterbegin',
			<textarea
				className="esgst-textarea-small"
				placeholder="https://store.steampowered.com/app/400\nhttps://store.steampowered.com/sub/1280"
				ref={(ref) => (obj.textArea = ref)}
			></textarea>
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_addOwned',
			false,
			'Add all owned games.',
			false,
			false,
			null,
			Settings.get('hgm_addOwned')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_addIgnored',
			false,
			'Add all ignored games.',
			false,
			false,
			null,
			Settings.get('hgm_addIgnored')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_addBanned',
			false,
			`Add all banned games (requires syncing delisted games in the settings menu).`,
			false,
			false,
			null,
			Settings.get('hgm_addBanned')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeTextArea',
			false,
			'Only remove games from text area.',
			false,
			false,
			null,
			Settings.get('hgm_removeTextArea')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeOwned',
			false,
			'Only remove owned games.',
			false,
			false,
			null,
			Settings.get('hgm_removeOwned')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeWishlisted',
			false,
			'Only remove wishlisted games.',
			false,
			false,
			null,
			Settings.get('hgm_removeWishlisted')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeFollowed',
			false,
			'Only remove followed games.',
			false,
			false,
			null,
			Settings.get('hgm_removeFollowed')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeTagged',
			false,
			(
				<fragment>
					Only remove games tagged with:{' '}
					<input
						className="esgst-switch-input esgst-switch-input-large"
						placeholder="tag1, tag2, tag3, ..."
						type="text"
						value={Settings.get('hgm_tags').join(', ')}
						onchange={(event) => {
							Settings.set(
								'hgm_tags',
								Array.from(new Set(event.target.value.toLowerCase().split(/,\s*/)))
							);
							Shared.common.setSetting('hgm_tags', Settings.get('hgm_tags'));
						}}
					/>
				</fragment>
			),
			false,
			false,
			'Enter the tags for the games that you want to remove, separated by a comma.',
			Settings.get('hgm_removeTagged')
		);
		new ToggleSwitch(
			obj.popup.scrollable,
			'hgm_removeBanned',
			false,
			`Only remove banned games (requires syncing delisted games in the settings menu).`,
			false,
			false,
			null,
			Settings.get('hgm_removeBanned')
		);
		Button.create([
			{
				color: 'green',
				icons: ['fa-arrow-circle-right'],
				name: 'Add',
				onClick: this.startAdding.bind(this, obj),
			},
			{
				template: 'error',
				name: 'Cancel',
				switchTo: { onReturn: 0 },
				onClick: this.stop.bind(this, obj),
			},
		]).insert(obj.popup.description, 'beforeend');
		Button.create([
			{
				color: 'green',
				icons: ['fa-arrow-circle-right'],
				name: 'Remove',
				onClick: this.startRemoving.bind(this, obj, false),
			},
			{
				template: 'error',
				name: 'Cancel',
				switchTo: { onReturn: 0 },
				onClick: this.stop.bind(this, obj),
			},
		]).insert(obj.popup.description, 'beforeend');
		Button.create([
			{
				color: 'green',
				icons: ['fa-arrow-circle-down'],
				name: 'Export',
				onClick: this.startExporting.bind(this, obj),
			},
			{
				template: 'error',
				name: 'Cancel',
				switchTo: { onReturn: 0 },
				onClick: this.stop.bind(this, obj),
			},
		]).insert(obj.popup.description, 'beforeend');
		obj.progressBar = NotificationBar.create().insert(obj.popup.description, 'beforeend').hide();
		obj.popup.open();
	}

	async startAdding(obj) {
		if (obj.running) {
			return;
		}

		obj.running = true;
		obj.canceled = false;
		obj.button.classList.add('esgst-busy');
		obj.progressBar.setLoading('Adding games...').show();
		obj.result.innerHTML = '';

		const appIds = [];
		const subIds = [];

		obj.textArea.value.split(/\n/).map((x) => {
			const match = x.match(/(app|sub)\/(\d+)/);
			if (match) {
				const id = match[2];
				const type = `${match[1]}s`;
				const savedGame = this.esgst.games[type][id];
				if (!savedGame || !savedGame.hidden) {
					(type === 'apps' ? appIds : subIds).push(id);
				}
			}
		});
		if (Settings.get('hgm_addOwned')) {
			appIds.push(
				...Object.keys(this.esgst.games.apps).filter(
					(x) => this.esgst.games.apps[x].owned && !this.esgst.games.apps[x].hidden
				)
			);
		}
		if (Settings.get('hgm_addIgnored')) {
			appIds.push(
				...Object.keys(this.esgst.games.apps).filter(
					(x) => this.esgst.games.apps[x].ignored && !this.esgst.games.apps[x].hidden
				)
			);
		}
		if (Settings.get('hgm_addBanned')) {
			appIds.push(...Shared.esgst.delistedGames.banned);
		}

		obj.hideObj = { appIds, subIds, update: (message) => obj.progressBar.setMessage(message) };

		const result = await common.hideGames(obj.hideObj);

		let message = '';
		if (result.apps.length) {
			message += `The following apps were not found and therefore not hidden (they are most likely internal apps, such as demos, game editors etc): ${result.apps.join(
				`, `
			)}\n`;
		}
		if (result.subs.length) {
			message += `The following subs were not found and therefore not hidden: ${result.subs.join(
				`, `
			)}\n`;
		}
		if (message) {
			window.alert(message);
		}

		obj.button.classList.remove('esgst-busy');
		obj.progressBar.reset().hide();
		obj.running = false;
	}

	startExporting(obj) {
		return this.startRemoving(obj, true);
	}

	async startRemoving(obj, exportOnly) {
		if (obj.running) {
			return;
		}
		obj.running = true;
		obj.canceled = false;
		obj.lastPage = '';
		obj.button.classList.add('esgst-busy');
		obj.progressBar.setLoading(`${exportOnly ? 'Exporting' : 'Removing'} games...`).show();
		if (!exportOnly) {
			createElements(obj.result, 'atinner', [
				{
					attributes: {
						class: 'esgst-bold',
					},
					text: `Removed Games:`,
					type: 'span',
				},
			]);
		}

		const appIds = [];
		const subIds = [];
		if (!exportOnly) {
			obj.textArea.value.split(/\n/).map((x) => {
				const match = x.match(/(app|sub)\/(\d+)/);
				if (match) {
					(match[1] === 'app' ? appIds : subIds).push(match[2]);
				}
			});
		}

		const newGames = { apps: {}, subs: {} };

		let url = `/account/settings/giveaways/filters/search?page=`;
		let nextPage = 1;
		let pagination = null;
		do {
			let context = null;
			if (nextPage === this.esgst.currentPage) {
				context = document;
			} else if (document.getElementsByClassName(`esgst-es-page-${nextPage}`)[0]) {
				nextPage += 1;
				continue;
			} else {
				context = DOM.parse(
					(await request({ method: 'GET', url: `${url}${nextPage}` })).responseText
				);
			}
			if (!obj.lastPage) {
				obj.lastPage = this.esgst.modules.generalLastPageLink.lpl_getLastPage(
					context,
					context === document
				);
				obj.lastPage = obj.lastPage === 999999999 ? '' : ` of ${obj.lastPage}`;
			}
			obj.progressBar.setMessage(
				`${exportOnly ? 'Exporting' : 'Removing'} games (page ${nextPage}${obj.lastPage})...`
			);
			let elements = context.getElementsByClassName('table__row-outer-wrap');
			for (let i = 0, n = elements.length; i < n; i++) {
				let element = elements[i];
				let info = await this.esgst.modules.games.games_getInfo(element);
				if (!info) continue;
				if (exportOnly) {
					(info.type === 'apps' ? appIds : subIds).push(info.id);
					continue;
				}
				let game = this.esgst.games[info.type][info.id];
				if (
					(!Settings.get('hgm_removeOwned') || !game || !game.owned) &&
					(!Settings.get('hgm_removeWishlisted') || !game || !game.wishlisted) &&
					(!Settings.get('hgm_removeFollowed') || !game || !game.followed) &&
					(!Settings.get('hgm_removeTagged') ||
						!game ||
						!game.tags ||
						!game.tags.filter((tag) => Settings.get('hgm_tags').includes(tag.toLowerCase()))
							.length) &&
					(!Settings.get('hgm_removeBanned') ||
						Shared.esgst.delistedGames.banned.indexOf(parseInt(info.id) < 0)) &&
					(!Settings.get('hgm_removeTextArea') ||
						(info.type === 'apps' ? appIds : subIds).indexOf(info.id) < 0) &&
					(Settings.get('hgm_removeOwned') ||
						Settings.get('hgm_removeWishlisted') ||
						Settings.get('hgm_removeFollowed') ||
						Settings.get('hgm_removeTagged') ||
						Settings.get('hgm_removeBanned') ||
						Settings.get('hgm_removeTextArea'))
				) {
					continue;
				}
				newGames[info.type][info.id] = { hidden: null };
				let button = element.getElementsByClassName('table__remove-default')[0];
				if (context === document) {
					button.dispatchEvent(new Event('click'));
				} else {
					await request({
						data: `xsrf_token=${Session.xsrfToken}&do=remove_filter&game_id=${
							button.parentElement.querySelector(`[name="game_id"]`).value
						}`,
						method: 'POST',
						url: '/ajax.php',
					});
				}
				createElements(obj.result, 'beforeend', [
					{
						attributes: {
							href: `http://store.steampowered.com/${info.type.slice(0, -1)}/${info.id}`,
						},
						text: element.getElementsByClassName('table__column__heading')[0].textContent,
						type: 'a',
					},
				]);
			}
			nextPage += 1;
			pagination = context.getElementsByClassName('pagination__navigation')[0];
		} while (
			!obj.canceled &&
			pagination &&
			!pagination.lastElementChild.classList.contains('is-selected')
		);

		if (exportOnly) {
			const file = []
				.concat(
					...appIds.map((id) => `https://store.steampowered.com/app/${id}`),
					...subIds.map((id) => `https://store.steampowered.com/sub/${id}`)
				)
				.join('\n');
			common.downloadFile(file, 'steamgifts-hidden-games.txt');
		} else {
			await common.lockAndSaveGames(newGames);

			if (obj.result.children.length === 1) {
				createElements(obj.result, 'atinner', [
					{
						attributes: {
							class: 'esgst-bold',
						},
						text: '0 games removed.',
						type: 'span',
					},
				]);
			}
		}
		obj.button.classList.remove('esgst-busy');
		obj.progressBar.reset().hide();
		obj.running = false;
	}

	stop(obj) {
		obj.canceled = true;
		if (obj.hideObj) {
			obj.hideObj.canceled = true;
		}
		obj.button.classList.remove('esgst-busy');
		obj.progressBar.reset().hide();
	}
}

const giveawaysHiddenGamesManager = new GiveawaysHiddenGamesManager();

export { giveawaysHiddenGamesManager };
