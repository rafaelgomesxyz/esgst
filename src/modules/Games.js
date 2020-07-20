import { Module } from '../class/Module';
import { common } from './Common';
import { Settings } from '../class/Settings';
import { Shared } from '../class/Shared';
import { DOM } from '../class/DOM';

const getValue = common.getValue.bind(common),
	lockAndSaveGames = common.lockAndSaveGames.bind(common),
	request = common.request.bind(common),
	updateHiddenGames = common.updateHiddenGames.bind(common);
const WHITELIST = {
	25657: { id: 3970, type: 'apps' }, // Prey (2006)
};

class Games extends Module {
	constructor() {
		super();
		this.info = {
			endless: true,
			id: 'games',
			featureMap: {
				endless: this.games_load.bind(this),
			},
		};
	}

	async games_load(context, main, source, endless) {
		let games = await this.games_get(
			context,
			main,
			endless ? this.esgst.games : JSON.parse(getValue('games')),
			endless
		);
		if (!Object.keys(games.apps).length && !Object.keys(games.subs).length) return;
		['apps', 'subs'].forEach((type) => {
			for (let id in games[type]) {
				if (games[type].hasOwnProperty(id)) {
					games[type][id].forEach((game) => {
						this.esgst.currentScope.games.push({
							game,
							code: id,
							innerWrap: game.headingName,
							name: game.name,
							outerWrap: game.headingName,
							type: type,
						});
					});
				}
			}
		});
		for (const feature of this.esgst.gameFeatures) {
			await feature(games, main, source, endless, 'apps');
		}
		for (const id in games.apps) {
			if (games.apps.hasOwnProperty(id)) {
				games.apps[id].forEach((game) => this.esgst.modules.giveaways.giveaways_reorder(game));
			}
		}
		for (const id in games.subs) {
			if (games.subs.hasOwnProperty(id)) {
				games.subs[id].forEach((game) => this.esgst.modules.giveaways.giveaways_reorder(game));
			}
		}
		if (
			main &&
			this.esgst.gmf &&
			this.esgst.gmf.filteredCount &&
			Settings.get(`gmf_enable${this.esgst.gmf.type}`)
		) {
			this.esgst.modules.gamesGameFilters.filters_filter(this.esgst.gmf, false, endless);
		}
	}

	async games_get(context, main, savedGames, endless) {
		let game, games, i, id, info, matches, n, headingNameQuery, matchesQuery, type;
		games = {
			apps: {},
			subs: {},
			all: [],
		};
		if (this.esgst.discussionPath && main) {
			matchesQuery = `${
				endless
					? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway`
					: '.featured__outer-wrap--giveaway'
			}, ${
				endless
					? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap`
					: '.giveaway__row-outer-wrap'
			}, ${
				endless
					? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap`
					: '.table__row-outer-wrap'
			}, ${
				endless
					? `.esgst-es-page-${endless} .markdown table td, .esgst-es-page-${endless}.markdown table td`
					: '.markdown table td'
			}`;
			headingNameQuery = `.giveaway__heading__name, .featured__heading__medium, .table__column__heading, a`;
		} else {
			matchesQuery = `${
				endless
					? `.esgst-es-page-${endless} .featured__outer-wrap--giveaway, .esgst-es-page-${endless}.featured__outer-wrap--giveaway`
					: '.featured__outer-wrap--giveaway'
			}, ${
				endless
					? `.esgst-es-page-${endless} .giveaway__row-outer-wrap, .esgst-es-page-${endless}.giveaway__row-outer-wrap`
					: '.giveaway__row-outer-wrap'
			}, ${
				endless
					? `.esgst-es-page-${endless} .table__row-outer-wrap, .esgst-es-page-${endless}.table__row-outer-wrap`
					: '.table__row-outer-wrap'
			}`;
			headingNameQuery = `.giveaway__heading__name, .featured__heading__medium, .table__column__heading`;
		}
		matches = context.querySelectorAll(matchesQuery);
		for (i = 0, n = matches.length; i < n; ++i) {
			game = this.esgst.scopes.main.giveaways.filter((x) => x.outerWrap === matches[i])[0];
			if (!game) {
				game = {
					isGame: true,
					outerWrap: matches[i],
				};
			}
			game.container = game.outerWrap;
			game.columns = game.container.querySelector(`.giveaway__columns, .featured__columns`);
			game.table = !!game.container.closest('table');
			game.grid = game.container.closest('.esgst-gv-view');
			if (game.grid) {
				game.gvIcons = game.container.getElementsByClassName('esgst-gv-icons')[0];
			}
			game.panel = game.container.querySelector('.esgst-giveaway-panel');
			info = await this.games_getInfo(game.container, main);
			game.headingName = game.container.querySelector(headingNameQuery);
			if (game.headingName) {
				if (
					game.headingName.getAttribute('href') &&
					game.headingName.getAttribute('href').match(/\/(discussion|\/support\/ticket|trade)\//)
				) {
					continue;
				}
				if (game.table || this.esgst.wishlistPath) {
					game.heading = game.headingName;
				} else {
					game.heading = game.headingName.parentElement;
				}
				if (!game.name) {
					game.name = game.headingName.textContent;
				}
				const steamGiftCard = game.name.match(/^\$(.+?)\sSteam\sGift\sCard$/);
				if (steamGiftCard) {
					game.points = parseInt(steamGiftCard[1].replace(/,/g, ''));
					info = {
						id: `SteamGiftCard${game.points}`,
						type: 'apps',
					};
				}
				const humbleBundle = game.name.match(/^Humble.+?Bundle/);
				if (humbleBundle) {
					info = {
						id: game.name.replace(/\s/g, ''),
						type: 'apps',
					};
				}
				if (info) {
					id = info.id;
					type = info.type;
					game.id = id;
					game.type = type;
					if (Shared.esgst.games && Shared.esgst.games[game.type][game.id]) {
						const keys = [
							'owned',
							'wishlisted',
							'followed',
							'hidden',
							'ignored',
							'previouslyEntered',
							'previouslyWon',
							'reducedCV',
							'noCV',
							'banned',
							'removed',
						];
						for (const key of keys) {
							if (
								key === 'banned' &&
								Shared.esgst.delistedGames.banned.indexOf(parseInt(game.id)) > -1
							) {
								game[key] = true;
							} else if (
								key === 'removed' &&
								(Shared.esgst.delistedGames.removed.indexOf(parseInt(game.id)) > -1 ||
									Shared.esgst.games[game.type][game.id].removed)
							) {
								game[key] = true;
							} else if (
								Shared.esgst.games[game.type][game.id][
									key === 'previouslyEntered' ? 'entered' : key === 'previouslyWon' ? 'won' : key
								]
							) {
								game[key] = true;
							}
						}
					}
					if (
						Settings.get('updateHiddenGames') &&
						window.location.pathname.match(/^\/account\/settings\/giveaways\/filters/) &&
						main
					) {
						const removeButton = game.container.getElementsByClassName('table__remove-default')[0];
						if (removeButton) {
							removeButton.addEventListener(
								'click',
								updateHiddenGames.bind(common, id, type, true)
							);
						}
					}
					if (!games[type][id]) {
						games[type][id] = [];
					}
					game.tagContext =
						(game.container.closest('.poll') &&
							game.container.getElementsByClassName('table__column__heading')[0]) ||
						game.headingName;
					game.tagPosition = 'afterEnd';
					game.saved = this.esgst.games[type][id];
					games[type][id].push(game);
					games.all.push(game);
				}
			}
		}
		return games;
	}

	async games_getInfo(context, main) {
		if (!context) {
			return null;
		}
		const link = context.querySelector(
			`[href*="store.steampowered.com/app/"], [href*="store.steampowered.com/sub/"], [href*="store.steampowered.com/bundle/"], [href*="steamcommunity.com/app/"], [href*="steamcommunity.com/sub/"], [href*="steamcommunity.com/bundle/"]`
		);
		const image = context.querySelector(
			`[style*="/apps/"], [style*="/subs/"], [style*="/bundles/"]`
		);
		if (link || image) {
			const url = (link && link.getAttribute('href')) || (image && image.getAttribute('style'));
			if (!url) {
				return null;
			}
			const info = url.match(/\/(app|sub|bundle)s?\/(\d+)/);
			if (info[1] === 'bundle') {
				return {
					id: `SteamBundle${info[2]}`,
					type: 'subs',
				};
			}
			return {
				id: info[2],
				type: `${info[1]}s`,
			};
		}
		const gameId = context.getAttribute('data-game-id');
		if (gameId && WHITELIST[gameId]) {
			return WHITELIST[gameId];
		}
		const missing = context.querySelector('.table_image_thumbnail_missing');
		if (!missing) {
			return null;
		}
		const heading = context.querySelector('.table__column__heading');
		if (!heading) {
			return null;
		}
		const name = heading.textContent.trim();
		for (const type of ['apps', 'subs']) {
			for (const id in this.esgst.games[type]) {
				if (!this.esgst.games[type].hasOwnProperty(id)) {
					continue;
				}
				if (this.esgst.games[type][id].name === name) {
					return { id, type };
				}
			}
		}
		if (!heading.getAttribute('href')) {
			return null;
		}
		const response = await request({
			method: 'GET',
			url: heading.getAttribute('href'),
		});
		const html = DOM.parse(response.responseText);
		const giveaway = (
			await this.esgst.modules.giveaways.giveaways_get(html, false, response.finalUrl)
		)[0];
		if (!giveaway || !giveaway.gameType || !giveaway.gameSteamId) {
			return null;
		}
		const games = {
			apps: {},
			subs: {},
		};
		games[giveaway.gameType][giveaway.gameSteamId] = { name };
		this.esgst.scopes.main.giveaways.map((x) => {
			if (x.name !== name || x.id) {
				return x;
			}
			x.id = giveaway.gameSteamId;
			x.type = giveaway.gameType;
			if (this.esgst.games && this.esgst.games[x.type][x.id]) {
				const keys = [
					'owned',
					'wishlisted',
					'followed',
					'hidden',
					'ignored',
					'previouslyEntered',
					'previouslyWon',
					'reducedCV',
					'noCV',
					'banned',
					'removed',
				];
				for (const key of keys) {
					if (key === 'banned' && Shared.esgst.delistedGames.banned.indexOf(parseInt(x.id)) > -1) {
						x[key] = true;
					} else if (
						key === 'removed' &&
						(Shared.esgst.delistedGames.removed.indexOf(parseInt(x.id)) > -1 ||
							Shared.esgst.games[x.type][x.id].removed)
					) {
						x[key] = true;
					} else if (
						Shared.esgst.games[x.type][x.id][
							key === 'previouslyEntered' ? 'entered' : key === 'previouslyWon' ? 'won' : key
						]
					) {
						x[key] = true;
					}
				}
			}
			return x;
		});
		if (
			main &&
			Shared.esgst.gf &&
			this.esgst.gf.filteredCount &&
			Settings.get(`gf_enable${this.esgst.gf.type}`)
		) {
			this.esgst.modules.giveawaysGiveawayFilters.filters_filter(this.esgst.gf);
		}
		lockAndSaveGames(games);
		return {
			id: giveaway.gameSteamId,
			type: giveaway.gameType,
		};
	}
}

const gamesModule = new Games();

export { gamesModule };
