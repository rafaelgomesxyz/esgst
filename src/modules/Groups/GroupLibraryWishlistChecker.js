import { Module } from '../../class/Module';
import { common } from '../Common';
import { elementBuilder } from '../../lib/SgStUtils/ElementBuilder';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';
import { permissions } from '../../class/Permissions';
import { DOM } from '../../class/DOM';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { Logger } from '../../class/Logger';

const
	createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	createTooltip = common.createTooltip.bind(common),
	getParameters = common.getParameters.bind(common),
	request = common.request.bind(common)
	;

class GroupsGroupLibraryWishlistChecker extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Adds a button (`,
						['i', { class: 'fa fa-folder' }],
						' ',
						['i', { class: 'fa fa-star' }],
						` ) to your `,
						['a', { href: `https://www.steamgifts.com/account/manage/whitelist` }, 'whitelist'],
						'/',
						['a', { href: `https://www.steamgifts.com/account/manage/blacklist` }, 'blacklist'],
						' pages and any ',
						['a', { href: `https://www.steamgifts.com/group/SJ7Bu/` }, 'group'],
						' page that allows you to check how many of the whitelist/blacklist/group members have a certain game in their libraries/wishlists.'
					]],
					['li', `The results are separated in 2 sections ("Libraries" and "Wishlists"). The games in each section are ranked based on the number of members that have them in their libraries/wishlists (each game also has a percentage that represents that number).`],
					['li', `Only the first 100 results are shown for each section, but you can use the search fields to find games that are outside of the top 100. If you are searching in the "Libraries" section, it is more accurate to search for games using their app id instead of their name, because the games in that section only have a name if they can also be found in the "Wishlists" section, as game names are not available in the libraries data and retrieving them would generate more requests to Steam, which is not good.`],
					['li', 'If you hover over the number of libraries/wishlists for a game it shows the usernames of all of the members that have the game in their libraries/wishlists.'],
					['li', `A Steam API key is required to retrieve libraries data. If a key is not set in the last section of this menu, the feature will only retrieve wishlists data.`]
				]]
			],
			id: 'glwc',
			name: 'Group Library/Wishlist Checker',
			sg: true,
			type: 'groups',
			features: {
				glwc_gn: {
					description: [
						['ul', [
							['li', 'The new Steam wishlist page does not offer the game names in its source code, so ESGST cannot know the names of the games. However, by enabling this option, ESGST will fetch the list of all games on Steam, so that it can show you the names of the games properly. The only problem is that this list is huge, so it can slow down the feature execution a bit. This list is shared with Have / Want List Checker, if you also use that feature.']
						]]
					],
					name: 'Display game names.',
					sg: true
				},
				glwc_mm: {
					dependencies: ['mm'],
					description: [
						['ul', [
							['li', 'Allows checking a custom list of users provided by [id=mm].']
						]]
					],
					name: 'Integrate with [id=mm].',
					sg: true
				}
			}
		};
	}

	async init() {
		if (Shared.esgst.whitelistPath || Shared.esgst.blacklistPath || Shared.esgst.groupPath) {
			let parameters;
			if (Shared.esgst.whitelistPath) {
				parameters = `url=account/manage/whitelist`;
			} else if (Shared.esgst.blacklistPath) {
				parameters = `url=account/manage/blacklist`;
			} else {
				parameters = `url=${window.location.pathname.match(/\/(group\/(.+?)\/(.+?))(\/.*)?$/)[1]}/users&id=${document.querySelector(`[href*="/gid/"]`).getAttribute('href').match(/\d+/)[0]}`;
			}
			createHeadingButton({
				id: 'glwc',
				icons: ['fa-folder', 'fa-star'],
				title: 'Check libraries/wishlists',
				link: `https://www.steamgifts.com/account/settings/profile?esgst=glwc&${parameters}`,
			});
		} else if (Shared.common.isCurrentPath('Account') && Shared.esgst.parameters.esgst === 'glwc') {
			if (!(await permissions.contains([['steamApi', 'steamCommunity', 'steamStore']]))) {
				return;
			}

			let glwc = {}, parameters;
			glwc.container = Shared.esgst.sidebar.nextElementSibling;
			if (Settings.get('removeSidebarInFeaturePages')) {
				Shared.esgst.sidebar.remove();
			}
			glwc.container.innerHTML = '';
			glwc.container.setAttribute('data-esgst-popup', true);
			new elementBuilder[Shared.esgst.name].pageHeading({
				context: glwc.container,
				position: 'beforeEnd',
				breadcrumbs: [
					{
						name: 'ESGST',
						url: Shared.esgst.settingsUrl
					},
					{
						name: 'Group Library/Wishlist Checker',
						url: `https://www.steamgifts.com/account/settings/profile?esgst=glwc`
					}
				]
			});
			new ToggleSwitch(glwc.container, 'glwc_checkMaxWishlists', false, [
				'Only check users with a maximum of ',
				['input', { class: 'esgst-switch-input', type: 'number', min: '0', value: Settings.get('glwc_maxWishlists'), onchange: event => { Settings.set('glwc_maxWishlists', parseInt(event.target.value)); Shared.common.setSetting('glwc_maxWishlists', Settings.get('glwc_maxWishlists')); } }],
				' games in their wishlist.',
			], false, false, 'Enter the maximum number of games that a user must have in their wishlist in order to be checked.', Settings.get('glwc_checkMaxWishlists'));
			glwc.progress = createElements(glwc.container, 'beforeEnd', [{
				type: 'div'
			}]);
			glwc.overallProgress = createElements(glwc.container, 'beforeEnd', [{
				type: 'div'
			}]);
			glwc.context = createElements(glwc.container, 'beforeEnd', [{
				type: 'div'
			}]);
			parameters = getParameters();
			glwc.id = parameters.id;
			glwc.url = parameters.url;
			glwc.users = parameters.users ? parameters.users.split(',').map(username => ({ username })) : [];
			glwc.games = {};
			if (glwc.id) {
				glwc.overallProgress.textContent = 'Preparing...';
				glwc.members = [];
				const members = (await request({
					method: 'GET',
					url: `http://steamcommunity.com/gid/${glwc.id}/memberslistxml?xml=1`
				})).responseText.match(/<steamID64>.+?<\/steamID64>/g);
				members.forEach(member => {
					glwc.members.push(member.match(/<steamID64>(.+?)<\/steamID64>/)[1]);
				});
			}
			if (glwc.users.length > 0) {
				glwc.overallProgress.textContent = 'Step 2 of 3';
				// noinspection JSIgnoredPromiseFromCall
				this.glwc_getSteamIds(glwc, 0, glwc.users.length);
			} else {
				glwc.overallProgress.textContent = 'Step 1 of 3';
				// noinspection JSIgnoredPromiseFromCall
				this.glwc_getUsers(glwc, 1);
			}
		}
	}

	async glwc_getUsers(glwc, nextPage) {
		if (glwc.isCanceled) return;
		createElements(glwc.progress, 'inner', [{
			attributes: {
				class: 'fa fa-circle-o-notch fa-spin'
			},
			type: 'i'
		}, {
			text: `Retrieving users (page ${nextPage})...`,
			type: 'span'
		}]);
		let elements, i, n, pagination, responseHtml;
		responseHtml = DOM.parse((await request({
			method: 'GET',
			url: `/${glwc.url}/search?page=${nextPage}`
		})).responseText);
		elements = responseHtml.querySelectorAll(`.table__row-inner-wrap:not(.is-faded)`);
		for (i = 0, n = elements.length; i < n; ++i) {
			glwc.users.push({
				username: elements[i].getElementsByClassName('table__column__heading')[0].textContent
			});
		}
		pagination = responseHtml.getElementsByClassName('pagination__navigation')[0];
		if (pagination && !pagination.lastElementChild.classList.contains('is-selected')) {
			window.setTimeout(() => this.glwc_getUsers(glwc, ++nextPage), 0);
		} else {
			glwc.overallProgress.textContent = 'Step 2 of 3';
			// noinspection JSIgnoredPromiseFromCall
			this.glwc_getSteamIds(glwc, 0, glwc.users.length);
		}
	}

	async glwc_getSteamIds(glwc, i, n) {
		if (glwc.isCanceled) return;
		if (i < n) {
			createElements(glwc.progress, 'inner', [{
				attributes: {
					class: 'fa fa-circle-o-notch fa-spin'
				},
				type: 'i'
			}, {
				text: `Retrieving Steam ids (${i + 1} of ${n})...`,
				type: 'span'
			}]);
			let steamId = Shared.esgst.users.steamIds[glwc.users[i].username];
			if (steamId) {
				glwc.users[i].steamId = steamId;
				window.setTimeout(() => this.glwc_getSteamIds(glwc, ++i, n), 0);
			} else {
				glwc.users[i].steamId = DOM.parse((await request({
					method: 'GET',
					url: `/user/${glwc.users[i].username}`
				})).responseText).querySelector(`[href*="/profiles/"]`).getAttribute('href').match(/\d+/)[0];
				window.setTimeout(() => this.glwc_getSteamIds(glwc, ++i, n), 0);
			}
		} else {
			glwc.overallProgress.textContent = `Step 3 of 3 (this might take a while)`;
			glwc.memberCount = 0;
			// noinspection JSIgnoredPromiseFromCall

			if (Settings.get('glwc_gn')) {
				await Shared.esgst.modules.tradesHaveWantListChecker.hwlc_getGames(true);
			}

			this.glwc_getGames(glwc, 0, glwc.users.length);
		}
	}

	async glwc_getGames(glwc, i, n) {
		if (glwc.isCanceled) return;
		if (i < n) {
			try {
				createElements(glwc.progress, 'inner', [{
					attributes: {
						class: 'fa fa-circle-o-notch fa-spin'
					},
					type: 'i'
				}, {
					text: `Retrieving libraries/wishlists (${i + 1} of ${n})...`,
					type: 'span'
				}]);
				if (!glwc.id || glwc.members.indexOf(glwc.users[i].steamId) >= 0) {
					try {
						glwc.users[i].library = [];
						let elements = JSON.parse((await request({
							method: 'GET',
							url: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${Settings.get('steamApiKey')}&steamid=${glwc.users[i].steamId}&format=json`
						})).responseText).response.games;
						if (elements) {
							elements.forEach(element => {
								let game = {
									id: element.appid,
									logo: `https://steamcdn-a.akamaihd.net/steam/apps/${element.appid}/header.jpg`,
									name: `${element.appid}`
								};

								if (Shared.esgst.appList) {
									const name = Shared.esgst.appList[element.appid];

									if (name) {
										game.name = name;
									}
								}

								if (!glwc.games[game.id]) {
									game.libraries = [];
									game.wishlists = [];
									glwc.games[game.id] = game;
								}
								glwc.games[game.id].libraries.push(i);
								glwc.users[i].library.push(game.id);
							});
						}
					} catch (e) { /**/
					}
					glwc.users[i].wishlist = [];
					let responseText = (await request({
						method: 'GET',
						url: `http://store.steampowered.com/wishlist/profiles/${glwc.users[i].steamId}`
					})).responseText;
					let wishlistData = responseText.match(/g_rgWishlistData\s=\s(\[(.+?)]);/);
					if (wishlistData) {
						let appInfo = responseText.match(/g_rgAppInfo\s=\s({(.+?)});/);
						let games = appInfo ? JSON.parse(appInfo[1]) : null;
						const wishlistGames = JSON.parse(wishlistData[1]);
						const maxWishlists = parseInt(Settings.get('glwc_maxWishlists') || '0');
						if (wishlistGames.length <= maxWishlists) {
							wishlistGames.forEach(item => {
								let id = item.appid;
								let game = { id };
								if (games && games[id]) {
									game.logo = games[id].capsule;
									game.name = games[id].name;
								} else {
									game.logo = `https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`;

									if (Shared.esgst.appList) {
										const name = Shared.esgst.appList[item.appid];

										if (name) {
											game.name = name;
										}
									}

									if (!game.name) {
										game.name = `${id}`;
									}
								}
								if (glwc.games[id]) {
									if (game.logo && game.name) {
										glwc.games[id].logo = game.logo;
										glwc.games[id].name = game.name;
									}
								} else {
									game.libraries = [];
									game.wishlists = [];
									glwc.games[id] = game;
								}
								glwc.games[id].wishlists.push(i);
								glwc.users[i].wishlist.push(parseInt(id));
							});
						}
					}
					glwc.memberCount += 1;
					window.setTimeout(() => this.glwc_getGames(glwc, ++i, n), 0);
				} else {
					window.setTimeout(() => this.glwc_getGames(glwc, ++i, n), 0);
				}
			} catch (err) {
				Logger.error(err);
				glwc.progress.innerHTML = 'An error happened (check the console log).';
				glwc.overallProgress.innerHTML = '';
			}
		} else {
			glwc.progress.innerHTML = '';
			glwc.overallProgress.innerHTML = '';
			this.glwc_showResults(glwc);
		}
	}

	glwc_showResults(glwc) {
		let game, i, id, j, library, libraryInput, libraryResults, librarySearch, n, user, users, wishlist, wishlistInput,
			wishlistResults, wishlistSearch;
		glwc.context.classList.add('esgst-glwc-results');
		createElements(glwc.context, 'inner', [{
			type: 'div',
			children: [{
				attributes: {
					class: 'esgst-glwc-heading'
				},
				text: 'Libraries',
				type: 'div'
			}, {
				attribute: {
					placeholder: 'Search by game name or app id...',
					type: 'text'
				},
				type: 'input'
			}, {
				attributes: {
					class: 'table'
				},
				type: 'div',
				children: [{
					attributes: {
						class: 'table__heading'
					},
					type: 'div',
					children: [{
						attributes: {
							class: 'table__column--width-small text-center'
						},
						text: 'Rank',
						type: 'div'
					}, {
						attributes: {
							class: 'table__column--width-fill'
						},
						text: 'Game',
						type: 'div'
					}, {
						attributes: {
							class: 'table__column--width-small text-center'
						},
						text: 'Libraries',
						type: 'div'
					}]
				}, {
					attributes: {
						class: 'table__rows'
					},
					type: 'div'
				}, {
					attributes: {
						class: 'table__rows'
					},
					type: 'div'
				}]
			}]
		}, {
			type: 'div',
			children: [{
				attributes: {
					class: 'esgst-glwc-heading'
				},
				text: 'Wishlists',
				type: 'div'
			}, {
				attribute: {
					placeholder: 'Search by game name or app id...',
					type: 'text'
				},
				type: 'input'
			}, {
				attributes: {
					class: 'table'
				},
				type: 'div',
				children: [{
					attributes: {
						class: 'table__heading'
					},
					type: 'div',
					children: [{
						attributes: {
							class: 'table__column--width-small text-center'
						},
						text: 'Rank',
						type: 'div'
					}, {
						attributes: {
							class: 'table__column--width-fill'
						},
						text: 'Game',
						type: 'div'
					}, {
						attributes: {
							class: 'table__column--width-small text-center'
						},
						text: 'Wishlists',
						type: 'div'
					}]
				}, {
					attributes: {
						class: 'table__rows'
					},
					type: 'div'
				}, {
					attributes: {
						class: 'table__rows'
					},
					type: 'div'
				}]
			}]
		}]);
		libraryInput = glwc.context.firstElementChild.firstElementChild.nextElementSibling;
		libraryResults = libraryInput.nextElementSibling.lastElementChild;
		librarySearch = libraryResults.previousElementSibling;
		wishlistInput = glwc.context.lastElementChild.firstElementChild.nextElementSibling;
		wishlistResults = wishlistInput.nextElementSibling.lastElementChild;
		wishlistSearch = wishlistResults.previousElementSibling;
		library = [];
		wishlist = [];
		for (id in glwc.games) {
			if (glwc.games.hasOwnProperty(id)) {
				if (glwc.games[id].libraries.length) {
					library.push(glwc.games[id]);
				}
				if (glwc.games[id].wishlists.length) {
					wishlist.push(glwc.games[id]);
				}
			}
		}
		if (library.length > 0) {
			library = library.sort((a, b) => {
				if (a.libraries.length > b.libraries.length) {
					return -1;
				} else if (a.libraries.length < b.libraries.length) {
					return 1;
				} else {
					return 0;
				}
			});
			for (i = 0, n = library.length; i < 100 && i < n; ++i) {
				game = library[i];
				if (i <= 0 || game.libraries.length !== library[i - 1].libraries.length) {
					j = i + 1;
				}
				users = [];
				game.libraries.forEach(k => {
					user = glwc.users[k];
					users.push(`<a class="table__column__secondary-link" href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
				});
				const popout = createTooltip(createElements(libraryResults, 'beforeEnd', [{
					attributes: {
						class: 'table__row-outer-wrap'
					},
					type: 'div',
					children: [{
						attributes: {
							class: 'table__row-inner-wrap'
						},
						type: 'div',
						children: [{
							attributes: {
								class: 'table__column--width-small text-center'
							},
							type: 'div',
							children: [{
								attributes: {
									class: 'table__column__rank'
								},
								text: `${j}.`,
								type: 'span'
							}]
						}, {
							type: 'div',
							children: [{
								attributes: {
									class: 'table_image_thumbnail',
									style: `background-image:url(${game.logo});`
								},
								type: 'div'
							}]
						}, {
							attributes: {
								class: 'table__column--width-fill'
							},
							type: 'div',
							children: [{
								attributes: {
									class: 'table__column__heading'
								},
								text: game.name,
								type: 'p'
							}, {
								type: 'p',
								children: [{
									attributes: {
										class: 'table__column__secondary-link',
										href: `http://store.steampowered.com/app/${game.id}`,
										rel: 'nofollow',
										target: '_blank'
									},
									text: `http://store.steampowered.com/app/${game.id}`,
									type: 'a'
								}]
							}]
						}, {
							attributes: {
								class: 'table__column--width--small text-center'
							},
							type: 'div',
							children: [{
								attributes: {
									class: 'table__column__secondary-link esgst-clickable'
								},
								text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
								type: 'span'
							}]
						}]
					}]
				}]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
				popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
			}
		} else {
			createElements(libraryResults, 'inner', [{
				text: 'To get libraries data you must have a Steam API key set in the settings menu.',
				type: 'node'
			}]);
		}
		wishlist = wishlist.sort((a, b) => {
			if (a.wishlists.length > b.wishlists.length) {
				return -1;
			} else if (a.wishlists.length < b.wishlists.length) {
				return 1;
			} else {
				return 0;
			}
		});
		for (i = 0, n = wishlist.length; i < 100 && i < n; ++i) {
			game = wishlist[i];
			if (i <= 0 || game.wishlists.length !== wishlist[i - 1].wishlists.length) {
				j = i + 1;
			}
			users = [];
			game.wishlists.forEach(k => {
				user = glwc.users[k];
				users.push(`<a class="table__column__secondary-link" href="http://store.steampowered.com/wishlist/profiles/${user.steamId}">${user.username}</a>`);
			});
			const popout = createTooltip(createElements(wishlistResults, 'beforeEnd', [{
				attributes: {
					class: 'table__row-outer-wrap'
				},
				type: 'div',
				children: [{
					attributes: {
						class: 'table__row-inner-wrap'
					},
					type: 'div',
					children: [{
						attributes: {
							class: 'table__column--width-small text-center'
						},
						type: 'div',
						children: [{
							attributes: {
								class: 'table__column__rank'
							},
							text: `${j}.`,
							type: 'span'
						}]
					}, {
						type: 'div',
						children: [{
							attributes: {
								class: 'table_image_thumbnail',
								style: `background-image:url(${game.logo});`
							},
							type: 'div'
						}]
					}, {
						attributes: {
							class: 'table__column--width-fill'
						},
						type: 'div',
						children: [{
							attributes: {
								class: 'table__column__heading'
							},
							text: game.name,
							type: 'p'
						}, {
							type: 'p',
							children: [{
								attributes: {
									class: 'table__column__secondary-link',
									href: `http://store.steampowered.com/app/${game.id}`,
									rel: 'nofollow',
									target: '_blank'
								},
								text: `http://store.steampowered.com/app/${game.id}`,
								type: 'a'
							}]
						}]
					}, {
						attributes: {
							class: 'table__column--width--small text-center'
						},
						type: 'div',
						children: [{
							attributes: {
								class: 'table__column__secondary-link esgst-clickable'
							},
							text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
							type: 'span'
						}]
					}]
				}]
			}]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
			popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
		}
		libraryInput.addEventListener('input', () => {
			const value = libraryInput.value.toLowerCase();
			if (value) {
				game = glwc.games[value];
				if (game) {
					if (game.libraries.length) {
						users = [];
						game.libraries.forEach(k => {
							user = glwc.users[k];
							users.push(`<a class="table__column__secondary-link" href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
						});
						createElements(librarySearch, 'inner', [{
							attributes: {
								class: 'table__row-outer-wrap'
							},
							type: 'div',
							children: [{
								attributes: {
									class: 'table__row-inner-wrap'
								},
								type: 'div',
								children: [{
									attributes: {
										class: 'table__column--width-small text-center'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__rank'
										},
										text: '-',
										type: 'span'
									}]
								}, {
									type: 'div',
									children: [{
										attributes: {
											class: 'table_image_thumbnail',
											style: `background-image:url(${game.logo});`
										},
										type: 'div'
									}]
								}, {
									attributes: {
										class: 'table__column--width-fill'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__heading'
										},
										text: game.name,
										type: 'p'
									}, {
										type: 'p',
										children: [{
											attributes: {
												class: 'table__column__secondary-link',
												href: `http://store.steampowered.com/app/${game.id}`,
												rel: 'nofollow',
												target: '_blank'
											},
											text: `http://store.steampowered.com/app/${game.id}`,
											type: 'a'
										}]
									}]
								}, {
									attributes: {
										class: 'table__column--width-small text-center'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__secondary-link esgst-clickable'
										},
										text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
										type: 'span'
									}]
								}]
							}]
						}]);
						const popout = createTooltip(librarySearch.firstElementChild.firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
						popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
					} else {
						createElements(librarySearch, 'inner', [{
							text: 'Nothing found...',
							type: 'node'
						}]);
					}
				} else {
					librarySearch.innerHTML = '';
					for (i = 0, j = 0, n = library.length; j < 100 && i < n; ++i) {
						game = library[i];
						if (game.name.toLowerCase().match(value)) {
							users = [];
							game.libraries.forEach(k => {
								user = glwc.users[k];
								users.push(`<a class="table__column__secondary-link" href="http://steamcommunity.com/profiles/${user.steamId}/games?tab=all">${user.username}</a>`);
							});
							const popout = createTooltip(createElements(librarySearch, 'beforeEnd', [{
								attributes: {
									class: 'table__row-outer-wrap'
								},
								type: 'div',
								children: [{
									attributes: {
										class: 'table__row-inner-wrap'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column--width-small text-center'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__rank'
											},
											text: '-',
											type: 'span'
										}]
									}, {
										type: 'div',
										children: [{
											attributes: {
												class: 'table_image_thumbnail',
												style: `background-image:url(${game.logo});`
											},
											type: 'div'
										}]
									}, {
										attributes: {
											class: 'table__column--width-fill'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__heading'
											},
											text: game.name,
											type: 'p'
										}, {
											type: 'p',
											children: [{
												attributes: {
													class: 'table__column__secondary-link',
													href: `http://store.steampowered.com/app/${game.id}`,
													rel: 'nofollow',
													target: '_blank'
												},
												text: `http://store.steampowered.com/app/${game.id}`,
												type: 'a'
											}]
										}]
									}, {
										attributes: {
											class: 'table__column--width--small text-center'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__secondary-link esgst-clickable'
											},
											text: `${game.libraries.length} (${Math.round(game.libraries.length / glwc.memberCount * 10000) / 100}%)`,
											type: 'span'
										}]
									}]
								}]
							}]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
							popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
							j += 1;
						}
					}
					if (!librarySearch.innerHTML) {
						createElements(librarySearch, 'inner', [{
							text: 'Nothing found...',
							type: 'node'
						}]);
					}
				}
				librarySearch.classList.remove('esgst-hidden');
				libraryResults.classList.add('esgst-hidden');
			} else {
				libraryResults.classList.remove('esgst-hidden');
				librarySearch.classList.add('esgst-hidden');
			}
		});
		wishlistInput.addEventListener('input', () => {
			const value = wishlistInput.value;
			if (value) {
				game = glwc.games[value];
				if (game) {
					if (game.wishlists.length) {
						users = [];
						game.wishlists.forEach(k => {
							user = glwc.users[k];
							users.push(`<a class="table__column__secondary-link" href="http://store.steampowered.com/wishlist/profiles/${user.steamId}">${user.username}</a>`);
						});
						createElements(wishlistSearch, 'inner', [{
							attributes: {
								class: 'table__row-outer-wrap'
							},
							type: 'div',
							children: [{
								attributes: {
									class: 'table__row-inner-wrap'
								},
								type: 'div',
								children: [{
									attributes: {
										class: 'table__column--width-small text-center'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__rank'
										},
										text: '-',
										type: 'span'
									}]
								}, {
									type: 'div',
									children: [{
										attributes: {
											class: 'table_image_thumbnail',
											style: `background-image:url(${game.logo});`
										},
										type: 'div'
									}]
								}, {
									attributes: {
										class: 'table__column--width-fill'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__heading'
										},
										text: game.name,
										type: 'p'
									}, {
										type: 'p',
										children: [{
											attributes: {
												class: 'table__column__secondary-link',
												href: `http://store.steampowered.com/app/${game.id}`,
												rel: 'nofollow',
												target: '_blank'
											},
											text: `http://store.steampowered.com/app/${game.id}`,
											type: 'a'
										}]
									}]
								}, {
									attributes: {
										class: 'table__column--width-small text-center'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column__secondary-link esgst-clickable'
										},
										text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
										type: 'span'
									}]
								}]
							}]
						}]);
						const popout = createTooltip(wishlistSearch.firstElementChild.firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
						popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
					} else {
						createElements(wishlistSearch, 'inner', [{
							text: 'Nothing found...',
							type: 'node'
						}]);
					}
				} else {
					wishlistSearch.innerHTML = '';
					for (i = 0, j = 0, n = wishlist.length; j < 100 && i < n; ++i) {
						game = wishlist[i];
						if (game.name.toLowerCase().match(value)) {
							users = [];
							game.wishlists.forEach(k => {
								user = glwc.users[k];
								users.push(`<a class="table__column__secondary-link" href="http://steamcommunity.com/profiles/${user.steamId}/wishlists">${user.username}</a>`);
							});
							const popout = createTooltip(createElements(wishlistSearch, 'beforeEnd', [{
								attributes: {
									class: 'table__row-outer-wrap'
								},
								type: 'div',
								children: [{
									attributes: {
										class: 'table__row-inner-wrap'
									},
									type: 'div',
									children: [{
										attributes: {
											class: 'table__column--width-small text-center'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__rank'
											},
											text: '-',
											type: 'span'
										}]
									}, {
										type: 'div',
										children: [{
											attributes: {
												class: 'table_image_thumbnail',
												style: `background-image:url(${game.logo});`
											},
											type: 'div'
										}]
									}, {
										attributes: {
											class: 'table__column--width-fill'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__heading'
											},
											text: game.name,
											type: 'p'
										}, {
											type: 'p',
											children: [{
												attributes: {
													class: 'table__column__secondary-link',
													href: `http://store.steampowered.com/app/${game.id}`,
													rel: 'nofollow',
													target: '_blank'
												},
												text: `http://store.steampowered.com/app/${game.id}`,
												type: 'a'
											}]
										}]
									}, {
										attributes: {
											class: 'table__column--width--small text-center'
										},
										type: 'div',
										children: [{
											attributes: {
												class: 'table__column__secondary-link esgst-clickable'
											},
											text: `${game.wishlists.length} (${Math.round(game.wishlists.length / glwc.memberCount * 10000) / 100}%)`,
											type: 'span'
										}]
									}]
								}]
							}]).firstElementChild.lastElementChild.firstElementChild, users.join(`, `), true);
							popout.onFirstOpen = () => Shared.common.endless_load(popout.popout);
							j += 1;
						}
					}
					if (!wishlistSearch.innerHTML) {
						createElements(wishlistSearch, 'inner', [{
							text: 'Nothing found...',
							type: 'node'
						}]);
					}
				}
				wishlistSearch.classList.remove('esgst-hidden');
				wishlistResults.classList.add('esgst-hidden');
			} else {
				wishlistResults.classList.remove('esgst-hidden');
				wishlistSearch.classList.add('esgst-hidden');
			}
		});
	}
}

const groupsGroupLibraryWishlistChecker = new GroupsGroupLibraryWishlistChecker();

export { groupsGroupLibraryWishlistChecker };