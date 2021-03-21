import { DOM } from '../../class/DOM';
import { FetchRequest } from '../../class/FetchRequest';
import { LocalStorage } from '../../class/LocalStorage';
import { Logger } from '../../class/Logger';
import { Module } from '../../class/Module';
import { permissions } from '../../class/Permissions';
import { Scope } from '../../class/Scope';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Utils } from '../../lib/jsUtils';
import { common } from '../Common';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common),
	lockAndSaveGames = common.lockAndSaveGames.bind(common),
	request = common.request.bind(common);
class GamesGameCategories extends Module {
	constructor() {
		super();

		this.PRIORITIES = {
			MISSING: 0,
			FAILED: 1,
			OUTDATED: 2,
			ALMOST_OUTDATED: 3,
		};

		this.queueIndexes = {
			apps: {},
			subs: {},
			total: 0,
		};

		this.fetchableCategories = [
			'gc_gi',
			'gc_lg',
			'gc_r',
			'gc_a',
			'gc_sp',
			'gc_mp',
			'gc_sc',
			'gc_tc',
			'gc_l',
			'gc_m',
			'gc_dlc',
			'gc_ea',
			'gc_rm',
			'gc_rd',
			'gc_g',
			'gc_p',
		];

		this.info = {
			description: () => (
				<ul>
					<li>
						Adds tags (which are called "categories" not to be confused with{' '}
						<span data-esgst-feature-id="gt"></span>) below a game's name (in any page) that can
						display a lot of useful information about the game (depending on which categories you
						have enabled).
					</li>
					<li>
						The categories can be reordered by dragging and dropping them. You can also drag and
						drop them between a giveaway's columns (where the end/start times and the creator's
						username are).
					</li>
					<li>
						While the information is being loaded, an hourglass icon is displayed. This icon can be
						in different colors depending on the cache status:
					</li>
					<ul>
						<li>
							<i className="fa fa-hourglass fa-spin esgst-red"></i> - The information is missing and
							will be retrieved from the server with highest priority.
						</li>
						<li>
							<i className="fa fa-hourglass fa-spin esgst-orange"></i> - The information was not
							successfully retrieved and it has been 24 hours since the last attempt, so another
							attempt will be made with high priority.
						</li>
						<li>
							<i className="fa fa-hourglass fa-spin esgst-yellow"></i> - The information is outdated
							(hasn't been updated in 7 days) and will be updated with low priority.
						</li>
						<li>
							<i className="fa fa-hourglass fa-spin esgst-green"></i> - The information is about to
							become outdated (hasn't been updated in 6 days) and will be updated with lowest
							priority.
						</li>
					</ul>
				</ul>
			),
			features: {
				gc_e: {
					colors: {
						color: 'Text',
						bColor: 'Border',
						bgColor: 'Background',
					},
					description: () => (
						<ul>
							<li>
								The enter button of giveaways will be colored with the desired color if the game
								cannot be checked for ownership and has one of the following categories: Banned,
								DLC, Learning, Package
							</li>
						</ul>
					),
					name: 'Color enter button of giveaways if game ownership cannot be checked.',
					sg: true,
				},
				gc_lp_gv: {
					description: () => (
						<ul>
							<li>
								Leaving this disabled can help prevent misclicks when using{' '}
								{Shared.common.getFeatureName(null, 'gv')}.
							</li>
						</ul>
					),
					name: 'Enable category links when using [id=gv].',
					sg: true,
				},
				gc_b: {
					name: 'Show the category colors as a bottom border to the giveaways in Grid View.',
					sg: true,
				},
				gc_il: {
					name: `Show the panel inline (next to the game's name instead of below it).`,
					sg: true,
				},
				gc_a: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game has achievements.</li>
							<li>If you hover over the category, it shows how many achievements the game has.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Achievements',
					sg: true,
				},
				gc_bd: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is banned on Steam.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Banned',
					sg: true,
					sync: 'Delisted Games',
					syncKeys: ['DelistedGames'],
				},
				gc_bvg: {
					colors: true,
					description: () => (
						<ul>
							<li>Links to the Barter.vg page of the game.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Barter.vg',
					sg: true,
				},
				gc_dlc: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is a DLC.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_dlc_b: {
							description: () => (
								<ul>
									<li>
										The icon <i className="fa fa-certificate"></i> will be added if the base is
										free, the icon <i className="fa fa-dollar"></i> will be added if it is not, and
										no icon will be added if the information is unavailable.
									</li>
								</ul>
							),
							name: 'Indicate if the base game of the DLC is free.',
							sg: true,
						},
						gc_dlc_o: {
							description: () => (
								<ul>
									<li>
										The same icon you use for the Owned category will be added if the base is owned.
									</li>
								</ul>
							),
							name: 'Indicate if the base game of the DLC is owned.',
							sg: true,
						},
					},
					name: 'DLC',
					sg: true,
				},
				gc_ea: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is in early access.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Early Access',
					sg: true,
				},
				gc_f: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you have followed the game on Steam.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Followed',
					sg: true,
					syncKeys: ['FollowedGames'],
				},
				gc_fcv: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game gives full CV when given away.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Full CV',
					sg: true,
				},
				gc_g: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows the official genres of the game.</li>
							<li>
								The genres/user-defined tags are listed in the same category, separated by a comma.
								If they exceed a certain width, a "..." is added and the rest is hidden (they can be
								seen by hovering over the category).
							</li>
						</ul>
					),
					isCategory: true,
					features: {
						gc_g_s: {
							description: () => (
								<ul>
									<li>
										With this option enabled, each genre/user-defined tag will have its own category
										instead of all of them being listed in the same one.
									</li>
									<li>This option allows each separate category to be colored individually.</li>
								</ul>
							),
							name: 'Show each genre/user-defined tag as a separate category.',
							sg: true,
						},
						gc_g_udt: {
							description: () => (
								<ul>
									<li>
										Shows the user-defined tags that the game has in addition to the official
										genres.
									</li>
								</ul>
							),
							name: 'User-Defined Tags',
							sg: true,
						},
					},
					name: 'Genres',
					sg: true,
				},
				gc_gi: {
					colors: true,
					description: () => (
						<ul>
							<li>
								Shows how many giveaways you have already made for the game and how much real CV you
								should get for a new giveaway.
							</li>
						</ul>
					),
					isCategory: true,
					name: 'Giveaway Info',
					sg: true,
				},
				gc_h: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you have hidden the game on SteamGifts.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Hidden',
					sg: true,
				},
				gc_hltb: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows how long it takes on average to beat the game based on HowLongToBeat.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					options: [
						{
							title: `For singleplayer games, show:`,
							values: ['Main Story', 'Main + Extra', 'Completionist'],
						},
						{
							title: `For multiplayer games, show:`,
							values: ['Co-Op', 'Vs.'],
						},
						{
							title: `For singleplayer/multiplayer games, show:`,
							values: ['Solo', 'Co-Op', 'Vs.'],
						},
					],
					name: 'HLTB',
					sg: true,
					sync: 'HLTB Times',
					syncKeys: ['HltbTimes'],
				},
				gc_i: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you have ignored the game on Steam.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_i_t: {
							background: true,
							name: 'Color the table row in tables.',
							sg: true,
						},
					},
					name: 'Ignored',
					sg: true,
				},
				gc_lg: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if Steam is learning about the game.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Learning',
					sg: true,
				},
				gc_l: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is compatible with Linux.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Linux',
					sg: true,
				},
				gc_m: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is compatible with Mac.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Mac',
					sg: true,
				},
				gc_mp: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is multiplayer.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Multiplayer',
					sg: true,
				},
				gc_ncv: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game gives no CV when given away.</li>
							<li>If you hover over the category, it shows the date since it gives no CV.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_ncv_o: {
							name: 'Only display "No CV" if the game also has "Reduced CV".',
							sg: true,
						},
					},
					name: 'No CV',
					sg: true,
				},
				gc_o: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you own the game.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_o_a: {
							isCategory: true,
							features: {
								gc_o_a_t: {
									background: true,
									name: 'Color the table row in tables.',
									sg: true,
								},
							},
							name: 'Show if you own the game in any of your alt accounts.',
							sg: true,
						},
						gc_o_t: {
							background: true,
							name: 'Color the table row in tables.',
							sg: true,
						},
						gc_o_pw: {
							name: 'Do not show if the game already has the Previously Won category.',
							sg: true,
						},
					},
					name: 'Owned',
					sg: true,
				},
				gc_ocv: {
					colors: {
						fcv_color: `Text (if the game was full CV)`,
						rcv_color: `Text (if the game was reduced CV)`,
						fcv_bgColor: `Background (if the game was full CV)`,
						rcv_bgColor: `Background (if the game was reduced RCV)`,
					},
					description: () => (
						<ul>
							<li>Shows the original CV state of a game when it was given away.</li>
							<li>
								This category borrows labels / icons from the Full CV, Reduced CV and No CV
								categories, and adds its own label / icon before the borrowed ones to differentiate
								them.
							</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Original CV',
					sg: true,
				},
				gc_p: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is a package.</li>
							<li>
								If you hover over the category, it shows how many items are contained in the
								package.
							</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_p_t: {
							background: true,
							name: 'Color the table row in tables if you own some of the games in the package.',
							sg: true,
						},
					},
					name: 'Package',
					sg: true,
				},
				gc_pw: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you have previously won the game.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_pw_o: {
							name: 'Do not show if the game already has the Owned category.',
							sg: true,
						},
					},
					name: 'Previously Won',
					sg: true,
				},
				gc_r: {
					description: () => (
						<ul>
							<li>Shows the overall rating that the game has on Steam.</li>
						</ul>
					),
					isCategory: true,
					features: {
						gc_r_s: {
							name: 'Show the percentage and number of reviews next to the icon.',
							sg: true,
						},
					},
					name: 'Rating',
					sg: true,
				},
				gc_rcv: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game gives reduced CV when given away.</li>
							<li>If you hover over the category, it shows the date since it gives reduced CV.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Reduced CV',
					sg: {
						include: [{ enabled: 1, pattern: '.*' }],
						exclude: [{ enabled: 1, pattern: '^/bundle-games' }],
					},
				},
				gc_rd: {
					description: () => (
						<ul>
							<li>Shows the release date of the game.</li>
							<li>If the game has no release date, a "?" will be shown instead.</li>
						</ul>
					),
					isCategory: true,
					colors: true,
					name: 'Release Date',
					sg: true,
				},
				gc_rm: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game has been removed from the Steam store.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Removed',
					sg: true,
				},
				gc_sp: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game is singleplayer.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Singleplayer',
					sg: true,
				},
				gc_sc: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game has Steam Cloud.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Steam Cloud',
					sg: true,
				},
				gc_tc: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if the game has trading cards.</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					name: 'Trading Cards',
					sg: true,
				},
				gc_w: {
					colors: true,
					description: () => (
						<ul>
							<li>Shows if you have wishlisted the game on Steam.</li>
							<li>
								If you hover over the category, it shows the date when you added the game to your
								wishlist.
							</li>
						</ul>
					),
					isCategory: true,
					allowCustomDisplay: true,
					features: {
						gc_w_t: {
							background: true,
							name: 'Color the table row in tables.',
							sg: true,
						},
					},
					name: 'Wishlisted',
					sg: true,
				},
			},
			id: 'gc',
			name: 'Game Categories',
			sg: true,
			sync: `Owned/Wishlisted/Ignored Games, Giveaways, Hidden Games, No CV Games, Reduced CV Games`,
			syncKeys: ['Games', 'Giveaways', 'HiddenGames', 'NoCvGames', 'ReducedCvGames'],
			type: 'games',
		};
	}

	isFetchableEnabled() {
		for (const id of this.fetchableCategories) {
			if (Settings.get(id)) {
				return true;
			}
		}
		return false;
	}

	async init() {
		if (this.isFetchableEnabled() && !(await permissions.contains([['server'], ['steamStore']]))) {
			return;
		}

		Shared.esgst.gameFeatures.push(this.gc_games.bind(this));
		Shared.esgst.gcToFetch = { apps: {}, subs: {} };
	}

	gc_games(games, main, source, endless) {
		// noinspection JSIgnoredPromiseFromCall
		this.gc_getGames(games, main, source, endless);
	}

	async gc_getGames(games, main, source, endless, filtersChanged) {
		let gc = {
			apps: Object.keys(games.apps).filter((id) => !id.startsWith('Humble')),
			cache: {
				apps: {},
				subs: {},
			},
			subs: Object.keys(games.subs).filter((id) => !id.startsWith('Humble')),
		};

		// get categories
		for (const id of gc.apps) {
			if (games.apps.hasOwnProperty(id)) {
				let elements = games.apps[id];
				for (let i = 0, n = elements.length; i < n; ++i) {
					let element = elements[i];
					if (
						element.container.classList.contains('esgst-hidden') ||
						element.container.getElementsByClassName('esgst-gc-panel')[0]
					) {
						continue;
					}
					if (element.container.closest('.poll')) {
						DOM.insert(
							element.container.getElementsByClassName('table__column__heading')[0],
							'afterend',
							<div className="esgst-gc-panel">
								<span className="esgst-gc-loading" title="This game is queued for fetching">
									<i className="fa fa-hourglass fa-spin"></i>
									<span></span>
								</span>
							</div>
						);
					} else {
						DOM.insert(
							element.heading,
							'afterend',
							<div className="esgst-gc-panel">
								<span className="esgst-gc-loading" title="This game is queued for fetching">
									<i className="fa fa-hourglass fa-spin"></i>
									<span></span>
								</span>
							</div>
						);
					}
				}
			}
		}
		for (const id of gc.subs) {
			if (games.subs.hasOwnProperty(id)) {
				let elements = games.subs[id];
				for (let i = 0, n = elements.length; i < n; ++i) {
					let element = elements[i];
					if (
						element.container.classList.contains('esgst-hidden') ||
						element.container.getElementsByClassName('esgst-gc-panel')[0]
					) {
						continue;
					}
					if (element.container.closest('.poll')) {
						DOM.insert(
							element.container.getElementsByClassName('table__column__heading')[0],
							'afterend',
							<div className="esgst-gc-panel">
								<span className="esgst-gc-loading" title="This game is queued for fetching">
									<i className="fa fa-hourglass fa-spin"></i>
									<span></span>
								</span>
							</div>
						);
					} else {
						DOM.insert(
							element.heading,
							'afterend',
							<div className="esgst-gc-panel">
								<span className="esgst-gc-loading" title="This game is queued for fetching">
									<i className="fa fa-hourglass fa-spin"></i>
									<span></span>
								</span>
							</div>
						);
					}
				}
			}
		}

		// Show categories that do not need to be fetched.
		for (const id of gc.apps) {
			this.gc_addCategory(
				gc,
				null,
				games.apps[id],
				id,
				Shared.esgst.games.apps[id],
				'apps',
				gc.cache.hltb,
				this.isFetchableEnabled()
			);
		}
		for (const id of gc.subs) {
			this.gc_addCategory(
				gc,
				null,
				games.subs[id],
				id,
				Shared.esgst.games.subs[id],
				'subs',
				null,
				this.isFetchableEnabled()
			);
		}
		const giveaways = Scope.findData(null, 'giveaways');
		for (const giveaway of giveaways) {
			this.gc_addBorders(giveaway);
		}

		let toFetch = [];

		if (this.isFetchableEnabled()) {
			gc.cache = JSON.parse(
				LocalStorage.get(
					'gcCache',
					`{ "apps": {}, "subs": {}, "hltb": {}, "timestamp": 0, "version": 7 }`
				)
			);
			if (gc.cache.version !== 7) {
				gc.cache = {
					apps: {},
					subs: {},
					hltb: gc.cache.hltb,
					timestamp: 0,
					version: 7,
				};
			}
			if (!gc.cache.hltb) {
				gc.cache.hltb = {};
			}
			const now = Date.now();
			for (const id in gc.cache.apps) {
				if (!gc.cache.apps.hasOwnProperty(id)) {
					continue;
				}
				let priority;
				if (gc.cache.apps[id].lastCheck) {
					if (gc.apps.indexOf(id) > -1) {
						// Game is in the current page.

						if (now - gc.cache.apps[id].lastCheck > 604800000) {
							// Game has not been updated in 7 days.

							priority = this.PRIORITIES.OUTDATED;
						} else if (now - gc.cache.apps[id].lastCheck > 518400000) {
							// Game has not been updated in 6 days.

							priority = this.PRIORITIES.ALMOST_OUTDATED;
						} else if (
							!Utils.isSet(gc.cache.apps[id].learning) &&
							(!gc.cache.apps[id].removed || gc.cache.apps[id].removed === -1) &&
							now - gc.cache.apps[id].lastCheck > 86400000
						) {
							// Game was not successfully fetched and it has been more than 24 hours since the last attempt.

							priority = this.PRIORITIES.FAILED;
						} else {
							// Game is up to date.

							this.gc_addCategory(
								gc,
								gc.cache.apps[id],
								games.apps[id],
								id,
								Shared.esgst.games.apps[id],
								'apps',
								gc.cache.hltb
							);
							continue;
						}
					} else if (now - gc.cache.apps[id].lastCheck > 2592000000) {
						// Game is not in the current page and has not been updated in 30 days.

						delete gc.cache.apps[id];
						continue;
					}
				} else {
					gc.cache.apps[id].lastCheck = now;
					priority = this.PRIORITIES.FAILED;
				}
				if (
					games.apps[id] &&
					games.apps[id].filter((item) => !item.container.classList.contains('esgst-hidden'))[0]
				) {
					if (priority >= this.PRIORITIES.OUTDATED) {
						this.gc_addCategory(
							gc,
							gc.cache.apps[id],
							games.apps[id],
							id,
							Shared.esgst.games.apps[id],
							'apps',
							gc.cache.hltb,
							false,
							true
						);
					}
					toFetch.push({
						id,
						lastCheck: gc.cache.apps[id].lastCheck,
						priority,
						type: 'apps',
						hasIndex: true,
					});
				}
			}
			for (const id in gc.cache.subs) {
				if (!gc.cache.subs.hasOwnProperty(id)) {
					continue;
				}
				let priority;
				if (gc.cache.subs[id].lastCheck) {
					if (gc.subs.indexOf(id) > -1) {
						// Game is in the current page.

						if (now - gc.cache.subs[id].lastCheck > 604800000) {
							// Game has not been updated in 7 days.

							priority = this.PRIORITIES.OUTDATED;
						} else if (now - gc.cache.subs[id].lastCheck > 518400000) {
							// Game has not been updated in 6 days.

							priority = this.PRIORITIES.ALMOST_OUTDATED;
						} else {
							// Game is up to date.

							this.gc_addCategory(
								gc,
								gc.cache.subs[id],
								games.subs[id],
								id,
								Shared.esgst.games.subs[id],
								'subs',
								gc.cache.hltb
							);
							continue;
						}
					} else if (now - gc.cache.subs[id].lastCheck > 2592000000) {
						// Game is not in the current page and has not been updated in 30 days.

						delete gc.cache.subs[id];
						continue;
					}
				} else {
					gc.cache.subs[id].lastCheck = now;
					priority = this.PRIORITIES.FAILED;
				}
				if (
					games.subs[id] &&
					games.subs[id].filter((item) => !item.container.classList.contains('esgst-hidden'))[0]
				) {
					if (priority >= this.PRIORITIES.OUTDATED) {
						this.gc_addCategory(
							gc,
							gc.cache.subs[id],
							games.subs[id],
							id,
							Shared.esgst.games.subs[id],
							'subs',
							gc.cache.hltb,
							false,
							true
						);
					}
					toFetch.push({
						id,
						lastCheck: gc.cache.subs[id].lastCheck,
						priority,
						type: 'subs',
						hasIndex: true,
					});
				}
			}
			LocalStorage.set('gcCache', JSON.stringify(gc.cache));

			for (const id of gc.apps) {
				if (gc.cache.apps[id]) {
					continue;
				}
				toFetch.push({
					id,
					lastCheck: 0,
					priority: this.PRIORITIES.MISSING,
					type: 'apps',
					hasIndex: true,
				});
			}
			for (const id of gc.subs) {
				if (gc.cache.subs[id]) {
					continue;
				}
				toFetch.push({
					id,
					lastCheck: 0,
					priority: this.PRIORITIES.MISSING,
					type: 'subs',
					hasIndex: true,
				});
			}

			toFetch = toFetch.sort((a, b) => {
				if (a.priority < b.priority) {
					return -1;
				}
				if (a.priority > b.priority) {
					return 1;
				}
				if (a.lastCheck < b.lastCheck) {
					return -1;
				}
				if (a.lastCheck > b.lastCheck) {
					return 1;
				}
				return 0;
			});

			for (const item of toFetch) {
				if (!games[item.type][item.id]) {
					continue;
				}
				this.queueIndexes[item.type][item.id] = this.queueIndexes.total;
				let isInQueue = false;
				for (const game of games[item.type][item.id]) {
					const panel = game.container.getElementsByClassName('esgst-gc-panel')[0];
					if (panel && !panel.getAttribute('data-gcReady')) {
						const loading = panel.getElementsByClassName('esgst-gc-loading')[0];
						if (loading) {
							loading.setAttribute('data-esgst-to-fetch', true);
							loading.title = `This game is queued for fetching (the number indicates its queue position)`;
							let color;
							switch (item.priority) {
								case this.PRIORITIES.MISSING:
									color = 'red';
									break;
								case this.PRIORITIES.FAILED:
									color = 'orange';
									break;
								case this.PRIORITIES.OUTDATED:
									color = 'yellow';
									break;
								case this.PRIORITIES.ALMOST_OUTDATED:
									color = 'green';
									break;
							}
							loading.firstElementChild.classList.add(`esgst-${color}`);
							loading.lastElementChild.textContent = ` ${this.queueIndexes[item.type][item.id]}`;
							isInQueue = true;
						}
					}
				}
				if (isInQueue) {
					this.queueIndexes.total += 1;
				}
			}

			if (toFetch.length > 0) {
				this.fetchedApps = [];

				await this.fetchFromServer(gc, games, toFetch); // Fetch missing items from server.
				await this.fetchFromServer(gc, games, toFetch); // Fetch sub apps and DLC bases from server, if any.
				await this.fetchFromSteam(gc, games, toFetch, now); // Fetch missing items from Steam.
				await this.fetchFromServer(gc, games, toFetch); // Fetch sub apps and DLC bases from server, if any.
				await this.fetchFromSteam(gc, games, toFetch, now); // Fetch sub apps and DLC bases from Steam, if any.

				await lockAndSaveGames(Shared.esgst.games);
				LocalStorage.set('gcCache', JSON.stringify(gc.cache));
			}
		}

		// add categories
		let categories = [
			'achievements',
			'dlc',
			'dlcOwned',
			'dlcFree',
			'dlcNonFree',
			'genres',
			'hltb',
			'linux',
			'mac',
			'singleplayer',
			'multiplayer',
			'package',
			'rating',
			'reviews',
			'learning',
			'removed',
			'banned',
			'steamCloud',
			'tradingCards',
			'earlyAccess',
			'releaseDate',
		];
		const data = Scope.findData(null, ['giveaways', 'games']);
		const items = data.giveaways.concat(data.games.map((game) => game.game));
		for (const item of items) {
			const loading = item.outerWrap.querySelector(`.esgst-gc-loading:not([data-esgst-to-fetch])`);
			if (loading) {
				loading.remove();
			}
			if (
				item.gcReady ||
				!item.outerWrap.querySelector(`[data-gcReady]`) ||
				item.outerWrap.classList.contains('esgst-hidden')
			) {
				continue;
			}
			for (let j = 0, numCategories = categories.length; j < numCategories; ++j) {
				let id = categories[j];
				let category = item.outerWrap.getElementsByClassName(
					`esgst-gc-${id === 'reviews' ? 'rating' : id}`
				)[0];
				if (category) {
					if (id === 'releaseDate') {
						item.releaseDate = category.getAttribute('data-timestamp');
						if (item.releaseDate === '?') {
							item.releaseDate = -1;
						} else {
							item.releaseDate = parseInt(item.releaseDate) * 1e3;
						}
					} else if (id === 'genres') {
						item.genres = category.textContent
							.toLowerCase()
							.trim()
							.replace(/\s{2,}/g, `, `)
							.split(/,\s/);
					} else if (id === 'rating') {
						item.rating = parseInt(category.title.match(/(\d+)%/)[1]);
						item.ratingQuantity = parseInt(
							(category.title.match(/\((.+?)\)/)[1] || '0').replace(',', '')
						);
					} else if (id === 'reviews') {
						item.reviews = parseInt(category.title.match(/\((.+?)\)/)[1].replace(/[^\d]/g, ''));
					} else {
						item[id] = true;
					}
				} else if (id === 'rating') {
					item.rating = -1;
					item.ratingQuantity = 0;
				} else if (id === 'releaseDate') {
					item.releaseDate = -1;
				} else if (id === 'reviews') {
					item.reviews = -1;
				}
			}
			if (!item.isGame) {
				this.gc_addBorders(item);
			}
			item.gcReady = true;
		}
		if (!filtersChanged) {
			if (
				main &&
				Shared.esgst.gf &&
				Shared.esgst.gf.filteredCount &&
				Settings.get(`gf_enable${Shared.esgst.gf.type}`)
			) {
				Shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(
					Shared.esgst.gf,
					false,
					endless
				);
			}
			if (
				!main &&
				Shared.esgst.gfPopup &&
				Shared.esgst.gfPopup.filteredCount &&
				Settings.get(`gf_enable${Shared.esgst.gfPopup.type}`)
			) {
				Shared.esgst.modules.giveawaysGiveawayFilters.filters_filter(Shared.esgst.gfPopup);
			}
			if (
				main &&
				Shared.esgst.gmf &&
				Shared.esgst.gmf.filteredCount &&
				Settings.get(`gmf_enable${Shared.esgst.gmf.type}`)
			) {
				Shared.esgst.modules.gamesGameFilters.filters_filter(Shared.esgst.gmf, false, endless);
			}
		}
	}

	gc_addBorders(giveaway) {
		if (
			giveaway.outerWrap.classList.contains('esgst-hidden') ||
			!giveaway.grid ||
			!Settings.get('gc_b')
		) {
			return;
		}
		let borders = giveaway.outerWrap.getElementsByClassName('esgst-gc-border')[0];
		if (borders) {
			borders.innerHTML = '';
		} else {
			borders = createElements(giveaway.outerWrap, 'beforeend', [
				{
					attributes: {
						class: 'esgst-gc-border',
					},
					type: 'div',
				},
			]);
		}
		const categoryNames = {
			gc_ocv: 'originalCV',
			gc_fcv: 'fullCV',
			gc_rcv: 'reducedCV',
			gc_ncv: 'noCV',
			gc_h: 'hidden',
			gc_i: 'ignored',
			gc_o: 'owned',
			gc_w: 'wishlisted',
			gc_f: 'followed',
			gc_pw: 'won',
			gc_a: 'achievements',
			gc_bd: 'banned',
			gc_sp: 'singleplayer',
			gc_mp: 'multiplayer',
			gc_sc: 'steamCloud',
			gc_tc: 'tradingCards',
			gc_l: 'linux',
			gc_m: 'mac',
			gc_ea: 'earlyAccess',
			gc_lg: 'learning',
			gc_rm: 'removed',
			gc_dlc: 'dlc',
			gc_p: 'package',
		};
		for (const category of Settings.get('gc_categories_gv')) {
			const key = categoryNames[category];
			if (!key || !giveaway.innerWrap.getElementsByClassName(`esgst-gc-${key}`)[0]) {
				continue;
			}
			createElements(borders, 'beforeend', [
				{
					attributes: {
						class: `esgst-gc-${key}`,
					},
					type: 'div',
				},
			]);
		}
	}

	async gc_fakeBundle(id) {
		const bundleId = id.replace(/^SteamBundle/, '');
		const response = await request({
			headers: { ['Esgst-Cookie']: `birthtime=0; mature_content=1; ` },
			method: 'GET',
			url: `https://store.steampowered.com/bundle/${bundleId}?cc=us&l=english`,
		});
		const html = DOM.parse(response.responseText);
		return {
			[id]: {
				success: true,
				data: {
					apps: Array.from(html.querySelectorAll(`[data-ds-appid]`)).map((x) => ({
						id: parseInt(x.getAttribute('data-ds-appid')),
					})),
					name: html.querySelector('.pageheader').textContent,
					platforms: {},
				},
			},
		};
	}

	async fakeApi(gc, toFetch, data, id, type, last_update, item) {
		const categories = {
			achievements: data.achievements || 0,
			base: data.base,
			dlc: data.base ? 1 : 0,
			dlcs: data.dlcs,
			earlyAccess: data.genres && data.genres.indexOf('Early Access') >= 0 ? 1 : 0,
			free: data.price === 0,
			genres: '',
			lastCheck: last_update,
			learning: Utils.isSet(data.learning) ? (data.learning ? 1 : 0) : null,
			linux: data.linux ? 1 : 0,
			mac: data.mac ? 1 : 0,
			multiplayer: data.multiplayer ? 1 : 0,
			name: data.name,
			price: Math.ceil(data.price / 100),
			rating: data.rating ? `${data.rating.percentage}% (${data.rating.count})` : '',
			ratingType: '',
			releaseDate: data.release_date ? new Date(data.release_date).getTime() : '?',
			removed: data.removed ? 1 : 0,
			singleplayer: data.singleplayer ? 1 : 0,
			steamCloud: data.steam_cloud ? 1 : 0,
			tags: '',
			tradingCards: data.trading_cards ? 1 : 0,
		};
		if (data.alias) {
			if (!Shared.esgst.games[type][id]) {
				Shared.esgst.games[type][id] = {};
			}
			Shared.esgst.games[type][id].alias = data.alias;
		}
		if (type === 'apps' && data.subs) {
			if (!Shared.esgst.games.apps[id]) {
				Shared.esgst.games.apps[id] = {};
			}
			Shared.esgst.games.apps[id].subs = null;
			Shared.esgst.games.apps[id].packages = data.subs;
		}
		if (type === 'subs' && data.apps) {
			if (!Shared.esgst.games.subs[id]) {
				Shared.esgst.games.subs[id] = {};
			}
			Shared.esgst.games.subs[id].apps = data.apps;
			for (const appId of Shared.esgst.games.subs[id].apps) {
				if (
					item.hasIndex &&
					!gc.cache.apps[appId] &&
					!toFetch.filter((x) => x.type === 'apps' && x.id == appId)[0]
				) {
					item.isComplete = false;
					item.dependencies.push(appId);
					toFetch.push({
						id: appId,
						lastCheck: 0,
						priority: this.PRIORITIES.MISSING,
						type: 'apps',
					});
				}
			}
		}
		if (data.genres) {
			data.genres.sort((a, b) => {
				return a.localeCompare(b, {
					sensitivity: 'base',
				});
			});
			categories.genres = data.genres.join(`, `);
		}
		if (data.tags) {
			data.tags.sort((a, b) => {
				return a.localeCompare(b, {
					sensitivity: 'base',
				});
			});
			categories.tags = data.tags.join(`, `);
		}
		if (data.rating) {
			if (data.rating.percentage < 40) {
				categories.ratingType = 'Negative';
			} else if (data.rating.percentage < 70) {
				categories.ratingType = 'Mixed';
			} else {
				categories.ratingType = 'Positive';
			}
		} else {
			categories.ratingType = '?';
		}
		if (
			type === 'apps' &&
			!categories.removed &&
			Shared.esgst.delistedGames.removed.indexOf(parseInt(id)) >= 0
		) {
			categories.removed = 1;
		}
		if (Settings.get('gc_dlc_b') && categories.dlc && categories.base) {
			if (gc.cache.apps[categories.base]) {
				categories.freeBase = gc.cache.apps[categories.base].free;
			}
			if (
				item.hasIndex &&
				typeof categories.freeBase === 'undefined' &&
				!toFetch.filter((x) => x.type === 'apps' && x.id == categories.base)[0]
			) {
				item.isComplete = false;
				item.dependencies.push(categories.base);
				toFetch.push({
					id: categories.base,
					lastCheck: 0,
					priority: this.PRIORITIES.MISSING,
					type: 'apps',
				});
			}
		}
		return categories;
	}

	async gc_getCategories(gc, currentTime, games, id, type, toFetch, item) {
		if (item.hasIndex && games[type][id]) {
			for (const game of games[type][id]) {
				const panel = game.container.getElementsByClassName('esgst-gc-panel')[0];
				if (panel && !panel.getAttribute('data-gcReady')) {
					const loading = panel.getElementsByClassName('esgst-gc-loading')[0];
					if (loading) {
						loading.title = 'Fetching game categories...';
						loading.firstElementChild.classList.remove('fa-hourglass');
						loading.firstElementChild.classList.add('fa-circle-o-notch');
						loading.lastElementChild.textContent = '';
					}
				}
			}
		}
		let categories = {
			achievements: 0,
			dlc: 0,
			earlyAccess: 0,
			genres: '',
			lastCheck: currentTime,
			learning: null,
			linux: 0,
			mac: 0,
			multiplayer: 0,
			name: '',
			price: -1,
			rating: '',
			ratingType: '',
			releaseDate: '?',
			removed: -1,
			singleplayer: 0,
			steamCloud: 0,
			tags: '',
			tradingCards: 0,
		};
		try {
			let responseJson =
				typeof id === 'string' && id.match(/^SteamBundle/)
					? await this.gc_fakeBundle(id)
					: JSON.parse(
							(
								await request({
									anon: true,
									method: 'GET',
									url: `https://store.steampowered.com/api/${
										type === 'apps' ? `appdetails?appids=` : `packagedetails?packageids=`
									}${id}&filters=achievements,apps,basic,categories,genres,name,packages,platforms,price,price_overview,release_date&cc=us&l=english`,
								})
							).responseText
					  );
			let data;
			if (responseJson && responseJson[id]) {
				data = responseJson[id].data;
				if (data) {
					if (data.steam_appid && id != data.steam_appid) {
						if (!Shared.esgst.games[type][id]) {
							Shared.esgst.games[type][id] = {};
						}
						Shared.esgst.games[type][id].alias = data.steam_appid;
					}
					if (type === 'apps' && data.packages) {
						if (!Shared.esgst.games.apps[id]) {
							Shared.esgst.games.apps[id] = {};
						}
						Shared.esgst.games.apps[id].subs = null;
						Shared.esgst.games.apps[id].packages = data.packages.map((x) => parseInt(x));
					}
					if (type === 'subs' && data.apps) {
						if (!Shared.esgst.games.subs[id]) {
							Shared.esgst.games.subs[id] = {};
						}
						Shared.esgst.games.subs[id].apps = data.apps.map((x) => parseInt(x.id));
						for (const appId of Shared.esgst.games.subs[id].apps) {
							if (
								item.hasIndex &&
								!gc.cache.apps[appId] &&
								!toFetch.filter((x) => x.type === 'apps' && x.id == appId)[0]
							) {
								item.isComplete = false;
								item.dependencies.push(appId);
								toFetch.push({
									id: appId,
									lastCheck: 0,
									priority: this.PRIORITIES.MISSING,
									type: 'apps',
								});
							}
						}
					}
					if (data.categories) {
						for (let i = 0, n = data.categories.length; i < n; ++i) {
							switch (data.categories[i].description.toLowerCase()) {
								case 'steam achievements':
									categories.achievements = 1;
									break;
								case 'single-player':
									categories.singleplayer = 1;
									break;
								case 'multi-player':
								case 'online multi-player':
								case 'co-op':
								case 'local co-op':
								case 'online co-op':
								case 'shared/split screen':
									categories.multiplayer = 1;
									break;
								case 'steam cloud':
									categories.steamCloud = 1;
									break;
								case 'steam trading cards':
									categories.tradingCards = 1;
									break;
								default:
									break;
							}
						}
					}
					if (categories.achievements && data.achievements && data.achievements.total) {
						categories.achievements = data.achievements.total;
					}
					categories.free = !!data.is_free;
					categories.dlc = data.type === 'dlc' ? 1 : 0;
					if (categories.dlc && data.fullgame && data.fullgame.appid) {
						categories.base = parseInt(data.fullgame.appid);
					} else if (data.dlc) {
						categories.dlcs = data.dlc;
					}
					let genres = [];
					if (data.genres) {
						for (let i = 0, n = data.genres.length; i < n; ++i) {
							genres.push(data.genres[i].description.trim());
						}
					}
					genres.sort((a, b) => {
						return a.localeCompare(b, {
							sensitivity: 'base',
						});
					});
					categories.earlyAccess = genres.indexOf('Early Access') >= 0 ? 1 : 0;
					categories.genres = genres.join(`, `);
					let platforms = data.platforms;
					categories.linux = platforms.linux ? 1 : 0;
					categories.mac = platforms.mac ? 1 : 0;
					categories.name = data.name;
					let price = data.price || data.price_overview;
					categories.price = price
						? price.currency === 'USD'
							? Math.ceil(price.initial / 100)
							: -1
						: 0;
					if (data.release_date && data.release_date.date) {
						// @ts-ignore
						categories.releaseDate = new Date(data.release_date.date).getTime();
					}
				}
			}
			if (
				(typeof id !== 'string' || !id.match(/^SteamBundle/)) &&
				(Settings.get('gc_lg') ||
					Settings.get('gc_r') ||
					Settings.get('gc_rm') ||
					Settings.get('gc_g_udt'))
			) {
				if (
					Settings.get('gc_rm') &&
					!Settings.get('gc_lg') &&
					!Settings.get('gc_r') &&
					!Settings.get('gc_g_udt') &&
					type === 'apps' &&
					Shared.esgst.delistedGames.removed.indexOf(parseInt(id)) > -1
				) {
					categories.removed = 1;
				} else {
					let response = await request({
						headers: { ['Esgst-Cookie']: `birthtime=0; mature_content=1; ` },
						method: 'GET',
						url: `https://store.steampowered.com/${type.slice(0, -1)}/${id}?cc=us&l=english`,
					});
					let responseHtml = DOM.parse(response.responseText);
					if (response.finalUrl.match(id)) {
						let elements = responseHtml.getElementsByClassName('user_reviews_summary_row');
						let n = elements.length;
						if (n > 0) {
							let rating = elements[n - 1].getAttribute('data-tooltip-html').replace(/[,.]/g, '');
							let match = rating.match(/(\d+)%.+?(\d+)/);
							let percentageIndex = 1;
							let countIndex = 2;
							if (!match) {
								match = rating.match(/(\d+).+?(\d+)%/);
								percentageIndex = 2;
								countIndex = 1;
							}
							if (match) {
								categories.rating = `${match[percentageIndex]}% (${match[countIndex]})`;
								rating = parseInt(match[percentageIndex]);
								if (rating >= 0) {
									if (rating < 40) {
										categories.ratingType = 'Negative';
									} else if (rating < 70) {
										categories.ratingType = 'Mixed';
									} else {
										categories.ratingType = 'Positive';
									}
								} else {
									categories.ratingType = '?';
								}
							}
						}
						categories.removed = 0;
						let tags = [];
						elements = responseHtml.querySelectorAll('a.app_tag');
						for (let i = 0, n = elements.length; i < n; ++i) {
							tags.push(elements[i].textContent.trim());
						}
						tags.sort((a, b) => {
							return a.localeCompare(b, {
								sensitivity: 'base',
							});
						});
						categories.tags = tags.join(`, `);
						if (responseHtml.querySelector('.learning_about')) {
							categories.learning = 1;
						} else {
							categories.learning = 0;
						}
					} else {
						categories.removed = 1;
					}
				}
			}
			if (Settings.get('gc_dlc_b') && categories.dlc && categories.base) {
				if (gc.cache.apps[categories.base]) {
					categories.freeBase = gc.cache.apps[categories.base].free;
				}
				if (
					item.hasIndex &&
					typeof categories.freeBase === 'undefined' &&
					!toFetch.filter((x) => x.type === 'apps' && x.id == categories.base)[0]
				) {
					item.isComplete = false;
					item.dependencies.push(appId);
					toFetch.push({
						id: categories.base,
						lastCheck: 0,
						priority: this.PRIORITIES.MISSING,
						type: 'apps',
					});
				}
			}
		} catch (error) {
			Logger.warning(error.message, error.stack);
			if (item.hasIndex && games[type][id]) {
				for (const game of games[type][id]) {
					const panel = game.container.getElementsByClassName('esgst-gc-panel')[0];
					if (panel && !panel.getAttribute('data-gcReady')) {
						if (Settings.get('gc_il') && !Shared.esgst.giveawayPath) {
							panel.previousElementSibling.style.display = 'inline-block';
							panel.classList.add('esgst-gc-panel-inline');
						}
						const loading = panel.getElementsByClassName('esgst-gc-loading')[0];
						if (loading) {
							loading.remove();
						}
						createElements(panel, 'beforeend', [
							{
								attributes: {
									class: 'esgst-bold esgst-red',
								},
								type: 'span',
								children: [
									{
										attributes: {
											class: 'fa fa-exclamation',
											title: 'An error happened while loading game categories.',
										},
										type: 'i',
									},
								],
							},
						]);
					}
				}
			}
		}
		return categories;
	}

	updateIndexes(type, id) {
		if (this.queueIndexes.total > 0) {
			const index = id ? this.queueIndexes[type][id] : -1;
			for (const queueId in this.queueIndexes.apps) {
				if (this.queueIndexes.apps[queueId] > 0) {
					if (!id || this.queueIndexes.apps[queueId] > index) {
						this.queueIndexes.apps[queueId] -= 1;
					}
				} else {
					delete this.queueIndexes.apps[queueId];
				}
			}
			for (const queueId in this.queueIndexes.subs) {
				if (this.queueIndexes.subs[queueId] > 0) {
					if (!id || this.queueIndexes.subs[queueId] > index) {
						this.queueIndexes.subs[queueId] -= 1;
					}
				} else {
					delete this.queueIndexes.subs[queueId];
				}
			}
			if (id) {
				this.queueIndexes[type][id] = this.queueIndexes.total - 1;
			} else {
				this.queueIndexes.total -= 1;
			}
		}
		const games = Scope.findData('current', 'games');
		for (const game of games) {
			const panel = game.game.container.getElementsByClassName('esgst-gc-panel')[0];
			if (panel && !panel.getAttribute('data-gcReady')) {
				const loading = panel.getElementsByClassName('esgst-gc-loading')[0];
				if (loading && loading.lastElementChild) {
					loading.lastElementChild.textContent = ` ${
						this.queueIndexes[game.type][game.code] || ''
					}`;
				}
			}
		}
	}

	gc_checkPackage(savedGame) {
		const count = {
			num: 0,
			total: savedGame.apps.length,
		};
		for (const id of savedGame.apps) {
			const game = Shared.esgst.games.apps[id];
			if (!game) {
				continue;
			}
			if (
				game.owned ||
				(game.alias && Utils.getProperty(Shared.esgst.games.apps, [game.alias, 'owned']))
			) {
				count.num += 1;
			}
			if (!savedGame.wishlisted) {
				savedGame.wishlisted =
					game.wishlisted ||
					(game.alias && Utils.getProperty(Shared.esgst.games.apps, [game.alias, 'wishlisted']));
			}
		}
		if (count.num === count.total) {
			savedGame.owned = true;
		}
		return count;
	}

	gc_addCategory(gc, cache, games, id, savedGame, type, hltb, isInstant, isOutdated) {
		if (!games) {
			return;
		}
		let active,
			category,
			count,
			cv,
			elements,
			encodedName,
			genre,
			genreList,
			genres,
			giveaway,
			giveaways,
			hltbTimes,
			i,
			j,
			k,
			n,
			panel,
			name,
			sent,
			singularType,
			user,
			value;
		let packageCount = null;
		if (savedGame) {
			savedGame = Object.assign({}, savedGame);
			if (type === 'apps') {
				if (
					!savedGame.owned &&
					savedGame.alias &&
					Utils.getProperty(Shared.esgst.games.apps, [savedGame.alias, 'owned'])
				) {
					savedGame.owned = true;
				}
				if (
					!savedGame.wishlisted &&
					savedGame.alias &&
					Utils.getProperty(Shared.esgst.games.apps, [savedGame.alias, 'wishlisted'])
				) {
					savedGame.wishlisted = true;
				}
			} else if (type === 'subs' && savedGame.apps) {
				packageCount = this.gc_checkPackage(savedGame);
			}
		}
		singularType = type.slice(0, -1);
		const realId = typeof id === 'string' ? id.replace(/^SteamBundle/, '') : id;
		if (typeof id === 'string' && id.match(/^SteamBundle/)) {
			singularType = 'bundle';
		}
		name = cache ? cache.name : games[0].name;
		encodedName = encodeURIComponent(name.replace(/\.\.\.$/, ''));
		const placeholderValues = {
			steamId: Settings.get('steamId'),
			username: Settings.get('username'),
			gameType: singularType,
			gameId: realId,
			gameName: name,
			gameSearchName: encodedName,
			hltbId: hltb && hltb[id] && hltb[id].id,
		};
		elements = [];
		let categories = Shared.esgst.gc_categories_ids;
		for (i = 0, n = categories.length; i < n; ++i) {
			category = categories[i];
			if (Settings.get(category)) {
				switch (category) {
					case 'gc_fcv':
						if ((savedGame && !savedGame.reducedCV && !savedGame.noCV) || !savedGame) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-fullCV',
									['data-draggable-id']: 'gc_fcv',
									href: this.replacePlaceholders(Settings.get('gc_fcvUrl'), placeholderValues),
									title: getFeatureTooltip('gc_fcv', 'Full CV'),
								},
								text: Settings.get('gc_fcv_s')
									? Settings.get('gc_fcv_s_i')
										? ''
										: 'FCV'
									: Settings.get('gc_fcvLabel'),
								type: 'a',
								children:
									Settings.get('gc_fcv_s') && Settings.get('gc_fcv_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_fcvIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_rcv':
						if (
							savedGame &&
							savedGame.reducedCV &&
							(!Settings.get('gc_ncv_o') || !savedGame.noCV)
						) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-reducedCV',
									['data-draggable-id']: 'gc_rcv',
									href: this.replacePlaceholders(Settings.get('gc_rcvUrl'), placeholderValues),
									title: getFeatureTooltip('gc_rcv', `Reduced CV since ${savedGame.reducedCV}`),
								},
								text: Settings.get('gc_rcv_s')
									? Settings.get('gc_rcv_s_i')
										? ''
										: 'RCV'
									: Settings.get('gc_rcvLabel'),
								type: 'a',
								children:
									Settings.get('gc_rcv_s') && Settings.get('gc_rcv_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_rcvIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_ncv':
						if (savedGame && savedGame.noCV) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-noCV',
									['data-draggable-id']: 'gc_ncv',
									href: this.replacePlaceholders(Settings.get('gc_ncvUrl'), placeholderValues),
									title: getFeatureTooltip('gc_ncv', `No CV since ${savedGame.noCV}`),
								},
								text: Settings.get('gc_ncv_s')
									? Settings.get('gc_ncv_s_i')
										? ''
										: 'NCV'
									: Settings.get('gc_ncvLabel'),
								type: 'a',
								children:
									Settings.get('gc_ncv_s') && Settings.get('gc_ncv_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_ncvIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_hltb':
						hltbTimes = {
							mainStory: 0,
							mainExtra: 0,
							completionist: 0,
							solo: 0,
							coOp: 0,
							vs: 0,
						};
						if (savedGame && savedGame.apps && gc.cache.hltb) {
							for (const id of savedGame.apps) {
								if (gc.cache.hltb[id]) {
									hltbTimes.mainStory += parseFloat(gc.cache.hltb[id].mainStory || 0);
									hltbTimes.mainExtra += parseFloat(gc.cache.hltb[id].mainExtra || 0);
									hltbTimes.completionist += parseFloat(gc.cache.hltb[id].completionist || 0);
									hltbTimes.solo += parseFloat(gc.cache.hltb[id].solo || 0);
									hltbTimes.coOp += parseFloat(gc.cache.hltb[id].coOp || 0);
									hltbTimes.vs += parseFloat(gc.cache.hltb[id].vs || 0);
								}
							}
							// @ts-ignore
							hltbTimes.mainStory = isNaN(hltbTimes.mainStory) ? '- ' : `${hltbTimes.mainStory}h`;
							// @ts-ignore
							hltbTimes.mainExtra = isNaN(hltbTimes.mainExtra) ? '- ' : `${hltbTimes.mainExtra}h`;
							// @ts-ignore
							hltbTimes.completionist = isNaN(hltbTimes.completionist)
								? '- '
								: `${hltbTimes.completionist}h`;
							// @ts-ignore
							hltbTimes.solo = isNaN(hltbTimes.solo) ? '- ' : `${hltbTimes.solo}h`;
							// @ts-ignore
							hltbTimes.coOp = isNaN(hltbTimes.coOp) ? '- ' : `${hltbTimes.coOp}h`;
							// @ts-ignore
							hltbTimes.vs = isNaN(hltbTimes.vs) ? '- ' : `${hltbTimes.vs}h`;
						} else {
							hltbTimes = hltb && hltb[id];
						}
						if (hltbTimes) {
							let time = '';
							if (hltbTimes.mainStory && hltbTimes.mainExtra && hltbTimes.completionist) {
								// singleplayer
								switch (Settings.get('gc_hltb_index_0')) {
									case 0:
										time = hltbTimes.mainStory;
										break;
									case 1:
										time = hltbTimes.mainExtra;
										break;
									case 2:
										time = hltbTimes.completionist;
										break;
								}
							} else if (hltbTimes.solo && hltbTimes.coOp && hltbTimes.vs) {
								// singleplayer/multiplayer
								switch (Settings.get('gc_hltb_index_2')) {
									case 0:
										time = hltbTimes.solo;
										break;
									case 1:
										time = hltbTimes.coOp;
										break;
									case 2:
										time = hltbTimes.vs;
										break;
								}
							} else if (hltbTimes.coOp && hltbTimes.vs) {
								// singleplayer/multiplayer
								switch (Settings.get('gc_hltb_index_1')) {
									case 0:
										time = hltbTimes.coOp;
										break;
									case 1:
										time = hltbTimes.vs;
										break;
								}
							} else {
								time =
									hltbTimes.mainStory ||
									hltbTimes.mainExtra ||
									hltbTimes.completionist ||
									hltbTimes.solo ||
									hltbTimes.coOp ||
									hltbTimes.vs;
							}
							if (time) {
								let title = `Average time to beat based on HowLongToBeat: \n\n`;
								if (hltbTimes.mainStory) {
									title += `Main Story: ${hltbTimes.mainStory}\n`;
								}
								if (hltbTimes.mainExtra) {
									title += `Main + Extra: ${hltbTimes.mainExtra}\n`;
								}
								if (hltbTimes.completionist) {
									title += `Completionist: ${hltbTimes.completionist}\n`;
								}
								if (hltbTimes.solo) {
									title += `Solo: ${hltbTimes.solo}\n`;
								}
								if (hltbTimes.coOp) {
									title += `Co-Op: ${hltbTimes.coOp}\n`;
								}
								if (hltbTimes.vs) {
									title += `Vs.: ${hltbTimes.vs}\n`;
								}
								elements.push({
									attributes: {
										class: 'esgst-gc esgst-gc-hltb',
										['data-draggable-id']: 'gc_hltb',
										href: this.replacePlaceholders(Settings.get('gc_hltbUrl'), placeholderValues),
										title: getFeatureTooltip('gc_hltb', title),
									},
									type: 'a',
									children: [
										Settings.get('gc_hltb_s') && Settings.get('gc_hltb_s_i')
											? {
													attributes: {
														class: `fa fa-${Settings.get('gc_hltbIcon')}`,
													},
													type: 'i',
											  }
											: null,
										{
											text: `${
												Settings.get('gc_hltb_s')
													? Settings.get('gc_hltb_s_i')
														? ''
														: 'HLTB:'
													: Settings.get('gc_hltbLabel')
											} ${time}`,
											type: 'node',
										},
									],
								});
							}
						}
						break;
					case 'gc_h':
						if (savedGame && savedGame.hidden) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-hidden',
									['data-draggable-id']: 'gc_h',
									href: this.replacePlaceholders(Settings.get('gc_hUrl'), placeholderValues),
									title: getFeatureTooltip('gc_h', 'Hidden'),
								},
								text: Settings.get('gc_h_s')
									? Settings.get('gc_h_s_i')
										? ''
										: 'H'
									: Settings.get('gc_hLabel'),
								type: 'a',
								children:
									Settings.get('gc_h_s') && Settings.get('gc_h_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_hIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_i':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (Shared.esgst.games.apps[id] && Shared.esgst.games.apps[id].ignored) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((savedGame && savedGame.ignored) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-ignored',
									['data-draggable-id']: 'gc_i',
									href: this.replacePlaceholders(Settings.get('gc_iUrl'), placeholderValues),
									title: getFeatureTooltip('gc_i', `Ignored${count}`),
								},
								text: Settings.get('gc_i_s')
									? Settings.get('gc_i_s_i')
										? ''
										: `I${count}`
									: `${Settings.get('gc_iLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_i_s') && Settings.get('gc_i_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_iIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
							if (Settings.get('gc_i_t')) {
								for (const game of games) {
									const row = game.container.closest('tr');
									if (row) {
										row.style.backgroundColor = Settings.get('gc_i_t_bgColor');
									}
								}
							}
						}
						break;
					case 'gc_o':
						if (Settings.get('gc_o_a')) {
							for (const account of Settings.get('gc_o_altAccounts')) {
								let game = account.games[type][id];
								if (game && game.owned) {
									elements.push({
										attributes: {
											class: 'esgst-gc esgst-gc-owned',
											['data-bgColor']: account.bgColor,
											['data-color']: account.color,
											['data-draggable-id']: 'gc_o',
											href: this.replacePlaceholders(Settings.get('gc_o_aUrl'), {
												...placeholderValues,
												steamId: account.steamId,
											}),
											style: `background-color: ${account.bgColor}; color: ${account.color};`,
											title: getFeatureTooltip('gc_o', `Owned by ${account.name}`),
										},
										text: Settings.get('gc_o_s')
											? Settings.get('gc_o_s_i')
												? ''
												: 'O'
											: account.label,
										type: 'a',
										children:
											Settings.get('gc_o_s') && Settings.get('gc_o_s_i')
												? [
														{
															attributes: {
																class: `fa fa-${account.icon}`,
															},
															type: 'i',
														},
												  ]
												: null,
									});
									if (Settings.get('gc_o_a_t')) {
										for (const game of games) {
											const row = game.container.closest('tr');
											if (row) {
												row.style.backgroundColor = Settings.get('gc_o_a_t_bgColor');
											}
										}
									}
								}
							}
						}
						if (
							savedGame &&
							savedGame.owned &&
							(!Settings.get('gc_o_pw') || !Settings.get('gc_pw') || !savedGame.won)
						) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-owned',
									['data-draggable-id']: 'gc_o',
									href: this.replacePlaceholders(Settings.get('gc_oUrl'), placeholderValues),
									title: getFeatureTooltip('gc_o', 'Owned'),
								},
								text: Settings.get('gc_o_s')
									? Settings.get('gc_o_s_i')
										? ''
										: 'O'
									: Settings.get('gc_oLabel'),
								type: 'a',
								children:
									Settings.get('gc_o_s') && Settings.get('gc_o_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_oIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
							if (Settings.get('gc_o_t')) {
								for (const game of games) {
									const row = game.container.closest('tr');
									if (row) {
										row.style.backgroundColor = Settings.get('gc_o_t_bgColor');
									}
								}
							}
						}
						break;
					case 'gc_w':
						if (savedGame && savedGame.wishlisted) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-wishlisted',
									['data-draggable-id']: 'gc_w',
									href: this.replacePlaceholders(Settings.get('gc_wUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_w',
										`Wishlisted${
											typeof savedGame.wishlisted === 'number'
												? ` since ${this.gc_formatDate(savedGame.wishlisted * 1e3)}`
												: ''
										}`
									),
								},
								text: Settings.get('gc_w_s')
									? Settings.get('gc_w_s_i')
										? ''
										: 'W'
									: Settings.get('gc_wLabel'),
								type: 'a',
								children:
									Settings.get('gc_w_s') && Settings.get('gc_w_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_wIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
							if (Settings.get('gc_w_t')) {
								for (const game of games) {
									const row = game.container.closest('tr');
									if (row) {
										row.style.backgroundColor = Settings.get('gc_w_t_bgColor');
									}
								}
							}
						}
						break;
					case 'gc_f':
						if (savedGame && savedGame.followed) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-followed',
									['data-draggable-id']: 'gc_f',
									href: this.replacePlaceholders(Settings.get('gc_fUrl'), placeholderValues),
									title: getFeatureTooltip('gc_f', 'Followed'),
								},
								text: Settings.get('gc_f_s')
									? Settings.get('gc_f_s_i')
										? ''
										: 'F'
									: Settings.get('gc_fLabel'),
								type: 'a',
								children:
									Settings.get('gc_f_s') && Settings.get('gc_f_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_fIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_pw':
						if (
							savedGame &&
							savedGame.won &&
							(!Settings.get('gc_pw_o') || !Settings.get('gc_o') || !savedGame.owned)
						) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-won',
									['data-draggable-id']: 'gc_pw',
									href: this.replacePlaceholders(Settings.get('gc_pwUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_pw',
										savedGame.won > 1
											? `You previously won this game on ${Shared.common.getTimestamp(
													savedGame.won
											  )}`
											: 'Previously Won'
									),
								},
								text: Settings.get('gc_pw_s')
									? Settings.get('gc_pw_s_i')
										? ''
										: 'PW'
									: Settings.get('gc_pwLabel'),
								type: 'a',
								children:
									Settings.get('gc_pw_s') && Settings.get('gc_pw_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_pwIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_gi':
						if (cache && Utils.isSet(cache.price)) {
							let price = cache.price;
							const heading = games[0].heading;
							if (heading) {
								const points = heading.innerHTML.match(
									/<span\sclass="giveaway__heading__thin">\((\d+?)P\)<\/span>/
								);
								if (points) {
									price = parseInt(points[1]);
								}
							}
							user = Shared.esgst.users.users[Settings.get('steamId')];
							if (user) {
								giveaways = user.giveaways;
								if (giveaways) {
									giveaways = giveaways.sent[type][id];
									active = 0;
									count = 0;
									sent = 0;
									if (giveaways) {
										let currentDate = Date.now();
										let numGiveaways;
										for (j = 0, numGiveaways = giveaways.length; j < numGiveaways; ++j) {
											giveaway = Shared.esgst.giveaways[giveaways[j]];
											if (giveaway) {
												if (Array.isArray(giveaway.winners)) {
													if (giveaway.winners.length > 0) {
														giveaway.winners.forEach((winner) => {
															count += 1;
															if (
																(giveaway.entries >= 5 ||
																	(!giveaway.inviteOnly &&
																		!giveaway.group &&
																		!giveaway.whitelist)) &&
																winner.status === 'Received'
															) {
																sent += 1;
															}
														});
													} else if (currentDate < giveaway.endTime) {
														active += giveaway.copies;
													}
												} else if (giveaway.winners > 0) {
													count += Math.min(giveaway.entries, giveaway.winners);
													if (
														giveaway.entries >= 5 ||
														(!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)
													) {
														sent += Math.min(giveaway.entries, giveaway.winners);
													}
												} else if (currentDate < giveaway.endTime) {
													active += giveaway.copies;
												}
											}
										}
										value = price;
										if (savedGame) {
											if (savedGame.noCV) {
												value = 0;
											} else if (savedGame.reducedCV) {
												value *= 0.15;
											}
										}
										if (sent > 5) {
											for (j = 0, numGiveaways = sent - 5; j < numGiveaways; ++j) {
												value *= 0.9;
											}
										}
										cv = sent + 1 > 5 ? value * 0.9 : value;
										cv = Math.round(cv * 100) / 100;
									} else {
										value = price;
										if (savedGame) {
											if (savedGame.noCV) {
												value = 0;
											} else if (savedGame.reducedCV) {
												value *= 0.15;
											}
										}
										cv = Math.round(value * 100) / 100;
									}
									elements.push({
										attributes: {
											class: 'esgst-gc esgst-gc-giveawayInfo',
											['data-draggable-id']: 'gc_gi',
											href: this.replacePlaceholders(Settings.get('gc_giUrl'), placeholderValues),
											title: getFeatureTooltip(
												'gc_gi',
												`You have sent ${count} copies of this game (${sent} of which added to your CV)${
													active
														? `\nYou currently have ${active} open giveaways for this game`
														: ''
												}\n\n${
													price !== -1
														? `You should get $${cv} real CV for sending a new copy of this game\nA giveaway for this game is worth ${Math.min(
																Math.ceil(price),
																50
														  )}P`
														: `ESGST was unable to retrieve the price of this game (most likely because the game was removed from the Steam store)`
												}`
											),
										},
										type: 'a',
										children: [
											{
												attributes: {
													class: 'fa fa-info',
												},
												type: 'i',
											},
											{
												text: ` ${count} `,
												type: 'node',
											},
											{
												attributes: {
													class: 'fa fa-dollar',
												},
												type: 'i',
											},
											{
												text: ` ${price !== -1 ? cv : '?'}`,
												type: 'node',
											},
										],
									});
								}
							}
						}
						break;
					case 'gc_r':
						if (cache && cache.rating) {
							let colors = null;
							let percentage = parseInt(cache.rating.match(/(\d+)%/)[1]);
							for (let i = 0, n = Settings.get('gc_r_colors').length; i < n; i++) {
								colors = Settings.get('gc_r_colors')[i];
								if (percentage >= colors.lower && percentage <= colors.upper) {
									break;
								}
							}
							if (!colors) {
								colors = {
									bgColor: '#7f8c8d',
									color: '#ffffff',
									icon: 'fa-question-circle',
								};
							}
							let match = cache.rating.match(/\((\d+)\)/);
							if (match) {
								cache.rating = cache.rating.replace(
									/\(\d+\)/,
									`(${parseInt(match[1]).toLocaleString()})`
								);
							}
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-rating',
									['data-bgColor']: colors.bgColor,
									['data-color']: colors.color,
									['data-draggable-id']: 'gc_r',
									href: this.replacePlaceholders(Settings.get('gc_rUrl'), placeholderValues),
									style: `background-color: ${colors.bgColor}; color: ${colors.color};`,
									title: getFeatureTooltip('gc_r', cache.rating),
								},
								type: 'a',
								children: [
									colors.icon.match(/\w/)
										? {
												attributes: {
													class: `fa fa-${colors.icon}`,
												},
												type: 'i',
										  }
										: {
												attributes: {
													style: `font-size: 14px;`,
												},
												text: colors.icon,
												type: 'span',
										  },
									{
										text: Settings.get('gc_r_s') ? ` ${cache.rating}` : '',
										type: 'node',
									},
								],
							});
						}
						break;
					case 'gc_a':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].achievements) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.achievements) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-achievements',
									['data-draggable-id']: 'gc_a',
									href: this.replacePlaceholders(Settings.get('gc_aUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_a',
										`Achievements${count || ` (${cache.achievements})`}`
									),
								},
								text: Settings.get('gc_a_s')
									? Settings.get('gc_a_s_i')
										? ''
										: `A${count}`
									: `${Settings.get('gc_aLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_a_s') && Settings.get('gc_a_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_aIcon')}`,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_bd':
						if (type === 'apps' && Shared.esgst.delistedGames.banned.indexOf(parseInt(id)) > -1) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-banned',
									['data-draggable-id']: 'gc_bd',
									href: this.replacePlaceholders(Settings.get('gc_bdUrl'), placeholderValues),
									title: getFeatureTooltip('gc_bd', 'Banned'),
								},
								text: Settings.get('gc_bd_s')
									? Settings.get('gc_bd_s_i')
										? ''
										: 'BD'
									: Settings.get('gc_bdLabel'),
								type: 'a',
								children:
									Settings.get('gc_bd_s') && Settings.get('gc_bd_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_bdIcon')}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
						break;
					case 'gc_bvg':
						elements.push({
							attributes: {
								class: 'esgst-gc esgst-gc-bartervg',
								['data-draggable-id']: 'gc_bvg',
								href: this.replacePlaceholders(Settings.get('gc_bvgUrl'), placeholderValues),
								target: '_blank',
								title: getFeatureTooltip('gc_bvg', 'Barter.vg'),
							},
							text: Settings.get('gc_bvg_s')
								? Settings.get('gc_bvg_s_i')
									? ''
									: 'BVG'
								: Settings.get('gc_bvgLabel'),
							type: 'a',
							children:
								Settings.get('gc_bvg_s') && Settings.get('gc_bvg_s_i')
									? [
											{
												attributes: {
													class: `fa fa-${Settings.get('gc_bvgIcon')}`,
												},
												type: 'i',
											},
									  ]
									: null,
						});
						break;
					case 'gc_mp':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].multiplayer) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.multiplayer) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-multiplayer',
									['data-draggable-id']: 'gc_mp',
									href: this.replacePlaceholders(Settings.get('gc_mpUrl'), placeholderValues),
									title: getFeatureTooltip('gc_mp', `Multiplayer${count}`),
								},
								text: Settings.get('gc_mp_s')
									? Settings.get('gc_mp_s_i')
										? ''
										: `MP${count}`
									: `${Settings.get('gc_mpLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_mp_s') && Settings.get('gc_mp_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_mpIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_sp':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].singleplayer) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.singleplayer) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-singleplayer',
									['data-draggable-id']: 'gc_sp',
									href: this.replacePlaceholders(Settings.get('gc_spUrl'), placeholderValues),
									title: getFeatureTooltip('gc_sp', `Singleplayer${count}`),
								},
								text: Settings.get('gc_sp_s')
									? Settings.get('gc_sp_s_i')
										? ''
										: `SP${count}`
									: `${Settings.get('gc_spLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_sp_s') && Settings.get('gc_sp_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_spIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_sc':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].steamCloud) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.steamCloud) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-steamCloud',
									['data-draggable-id']: 'gc_sc',
									href: this.replacePlaceholders(Settings.get('gc_scUrl'), placeholderValues),
									title: getFeatureTooltip('gc_sc', `Steam Cloud${count}`),
								},
								text: Settings.get('gc_sc_s')
									? Settings.get('gc_sc_s_i')
										? ''
										: `SC${count}`
									: `${Settings.get('gc_scLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_sc_s') && Settings.get('gc_sc_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_scIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_tc':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].tradingCards) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.tradingCards) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-tradingCards',
									['data-draggable-id']: 'gc_tc',
									href: this.replacePlaceholders(Settings.get('gc_tcUrl'), placeholderValues),
									title: getFeatureTooltip('gc_tc', `Trading Cards${count}`),
								},
								text: Settings.get('gc_tc_s')
									? Settings.get('gc_tc_s_i')
										? ''
										: `TC${count}`
									: `${Settings.get('gc_tcLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_tc_s') && Settings.get('gc_tc_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_tcIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_l':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].linux) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.linux) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-linux',
									['data-draggable-id']: 'gc_l',
									href: this.replacePlaceholders(Settings.get('gc_lUrl'), placeholderValues),
									title: getFeatureTooltip('gc_l', `Linux${count}`),
								},
								text: Settings.get('gc_l_s')
									? Settings.get('gc_l_s_i')
										? ''
										: `L${count}`
									: `${Settings.get('gc_lLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_l_s') && Settings.get('gc_l_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_lIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_m':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].mac) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.mac) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-mac',
									['data-draggable-id']: 'gc_m',
									href: this.replacePlaceholders(Settings.get('gc_mUrl'), placeholderValues),
									title: getFeatureTooltip('gc_m', `Mac${count}`),
								},
								text: Settings.get('gc_m_s')
									? Settings.get('gc_m_s_i')
										? ''
										: `M${count}`
									: `${Settings.get('gc_mLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_m_s') && Settings.get('gc_m_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_mIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_dlc':
						if (cache && cache.dlc) {
							let baseOwned;
							if (Settings.get('gc_dlc_o')) {
								if (cache.base && Shared.esgst.games.apps[cache.base]) {
									baseOwned = Shared.esgst.games.apps[cache.base].owned;
								}
							}
							const children = [];
							if (Settings.get('gc_dlc_s')) {
								if (Settings.get('gc_dlc_s_i')) {
									children.push({
										attributes: {
											class: `fa fa-${Settings.get('gc_dlcIcon')} `,
										},
										type: 'i',
									});
									if (Settings.get('gc_dlc_o') && baseOwned) {
										children.push({
											attributes: {
												class: `fa fa-${Settings.get('gc_oIcon')} esgst-gc-dlcOwned`,
											},
											type: 'i',
										});
									}
									if (Settings.get('gc_dlc_b') && typeof cache.freeBase !== 'undefined') {
										if (cache.freeBase) {
											children.push({
												attributes: {
													class: 'fa fa-certificate esgst-gc-dlcFree',
												},
												type: 'i',
											});
										} else {
											children.push({
												attributes: {
													class: 'fa fa-money esgst-gc-dlcNonFree',
												},
												type: 'i',
											});
										}
									}
								} else {
									children.push({
										text: 'DLC',
										type: 'node',
									});
									if (Settings.get('gc_dlc_o') && baseOwned) {
										children.push({
											attributes: {
												class: 'esgst-gc-dlcOwned',
											},
											text: `(O)`,
											type: 'span',
										});
									}
									if (Settings.get('gc_dlc_b') && typeof cache.freeBase !== 'undefined') {
										if (cache.freeBase) {
											children.push({
												attributes: {
													class: 'esgst-gc-dlcFree',
												},
												text: `(F)`,
												type: 'span',
											});
										} else {
											children.push({
												attributes: {
													class: 'esgst-gc-dlcNonFree',
												},
												text: `(NF)`,
												type: 'span',
											});
										}
									}
								}
							} else {
								children.push({
									text: Settings.get('gc_dlcLabel'),
									type: 'node',
								});
								if (Settings.get('gc_dlc_o') && baseOwned) {
									children.push({
										attributes: {
											class: 'esgst-gc-dlcOwned',
										},
										text: `(Owned)`,
										type: 'span',
									});
								}
								if (Settings.get('gc_dlc_b') && typeof cache.freeBase !== 'undefined') {
									if (cache.freeBase) {
										children.push({
											attributes: {
												class: 'esgst-gc-dlcFree',
											},
											text: `(Free)`,
											type: 'span',
										});
									} else {
										children.push({
											attributes: {
												class: 'esgst-gc-dlcNonFree',
											},
											text: `(Not Free)`,
											type: 'span',
										});
									}
								}
							}
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-dlc',
									['data-draggable-id']: 'gc_dlc',
									href: this.replacePlaceholders(Settings.get('gc_dlcUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_dlc',
										`DLC${
											Settings.get('gc_dlc_b') && typeof cache.freeBase !== 'undefined'
												? cache.freeBase
													? ` (the base game of this DLC is free)`
													: ` (the base game of this DLC is not free)`
												: ''
										}`
									),
								},
								type: 'a',
								children,
							});
						}
						break;
					case 'gc_p':
						if (type === 'subs') {
							const children = [];
							if (Settings.get('gc_p_s')) {
								if (Settings.get('gc_p_s_i')) {
									children.push({
										attributes: {
											class: `fa fa-${Settings.get('gc_pIcon')}`,
										},
										type: 'i',
									});
								} else {
									children.push({
										text: 'P',
										type: 'node',
									});
								}
							} else {
								children.push({
									text: Settings.get('gc_pLabel'),
									type: 'node',
								});
							}
							if (packageCount) {
								children.push({
									text: ` (${packageCount.num}/${packageCount.total})`,
									type: 'node',
								});
							}
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-package',
									['data-draggable-id']: 'gc_p',
									href: this.replacePlaceholders(Settings.get('gc_pUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_p',
										`Package${savedGame && savedGame.apps ? ` (${savedGame.apps.length})` : ''} ${
											packageCount ? ` (${packageCount.num} owned)` : ''
										} `
									),
								},
								type: 'a',
								children,
							});
							if (packageCount && packageCount.num) {
								if (Settings.get('gc_p_t') && packageCount.num < packageCount.total) {
									for (const game of games) {
										const row = game.container.closest('tr');
										if (row) {
											row.style.backgroundColor = Settings.get('gc_p_t_bgColor');
										}
									}
								} else if (Settings.get('gc_o_t') && packageCount.num === packageCount.total) {
									for (const game of games) {
										const row = game.container.closest('tr');
										if (row) {
											row.style.backgroundColor = Settings.get('gc_o_t_bgColor');
										}
									}
								}
							}
						}
						break;
					case 'gc_ea':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].earlyAccess) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.earlyAccess) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-earlyAccess',
									['data-draggable-id']: 'gc_ea',
									href: this.replacePlaceholders(Settings.get('gc_eaUrl'), placeholderValues),
									title: getFeatureTooltip('gc_ea', `Early Access${count}`),
								},
								text: Settings.get('gc_ea_s')
									? Settings.get('gc_ea_s_i')
										? ''
										: `EA${count}`
									: `${Settings.get('gc_eaLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_ea_s') && Settings.get('gc_ea_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_eaIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_lg':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].learning === 1) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.learning === 1) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-learning',
									['data-draggable-id']: 'gc_lg',
									href: this.replacePlaceholders(Settings.get('gc_lgUrl'), placeholderValues),
									title: getFeatureTooltip('gc_lg', `Learning${count}`),
								},
								text: Settings.get('gc_lg_s')
									? Settings.get('gc_lg_s_i')
										? ''
										: `LG${count}`
									: `${Settings.get('gc_lgLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_lg_s') && Settings.get('gc_lg_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_lgIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_rm':
						count = 0;
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].removed === 1) {
									count += 1;
								}
							}
						}
						count = count ? ` (${count})` : '';
						if ((cache && cache.removed === 1) || count) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-removed',
									['data-draggable-id']: 'gc_rm',
									href: this.replacePlaceholders(Settings.get('gc_rmUrl'), placeholderValues),
									title: getFeatureTooltip('gc_rm', `Removed${count}`),
								},
								text: Settings.get('gc_rm_s')
									? Settings.get('gc_rm_s_i')
										? ''
										: `RM${count}`
									: `${Settings.get('gc_rmLabel')}${count}`,
								type: 'a',
								children:
									Settings.get('gc_rm_s') && Settings.get('gc_rm_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_rmIcon')} `,
													},
													type: 'i',
												},
												count
													? {
															text: count,
															type: 'node',
													  }
													: null,
										  ]
										: null,
							});
						}
						break;
					case 'gc_rd':
						if (cache && cache.releaseDate) {
							elements.push({
								attributes: {
									class: 'esgst-gc esgst-gc-releaseDate',
									['data-draggable-id']: 'gc_rd',
									['data-timestamp']:
										cache.releaseDate === ' ? ' ? cache.releaseDate : cache.releaseDate / 1e3,
									href: this.replacePlaceholders(Settings.get('gc_rdUrl'), placeholderValues),
									title: getFeatureTooltip('gc_rd', 'Release Date'),
								},
								type: 'a',
								children: [
									{
										attributes: {
											class: `fa fa-${Settings.get('gc_rdIcon')}`,
										},
										type: 'i',
									},
									{
										text: ` ${this.gc_formatDate(cache.releaseDate)}`,
										type: 'node',
									},
								],
							});
						}
						break;
					case 'gc_g':
						genres = '';
						if (savedGame && savedGame.apps) {
							for (const id of savedGame.apps) {
								if (gc.cache.apps[id] && gc.cache.apps[id].genres) {
									genres += `${
										Settings.get('gc_g_udt') && gc.cache.apps[id].tags
											? `${gc.cache.apps[id].genres}, ${gc.cache.apps[id].tags}`
											: gc.cache.apps[id].genres
									}, `;
								}
							}
							genres = genres.slice(0, -2);
						} else if (cache && cache.genres) {
							genres =
								Settings.get('gc_g_udt') && cache.tags
									? `${cache.genres}, ${cache.tags}`
									: cache.genres;
						}
						if (genres) {
							let filters;
							genreList = Utils.sortArray(Array.from(new Set(genres.split(/,\s/))));
							genres = genreList.join(`, `);
							if (Settings.get('gc_g_filters').trim()) {
								filters = Settings.get('gc_g_filters')
									.trim()
									.toLowerCase()
									.split(/\s*,\s*/);
							}
							for (j = genreList.length - 1; j >= 0; --j) {
								genre = genreList[j].toLowerCase();
								if (!filters || filters.indexOf(genre) > -1) {
									for (
										k = Settings.get('gc_g_colors').length - 1;
										k >= 0 && Settings.get('gc_g_colors')[k].genre.toLowerCase() !== genre;
										--k
									) {}
									if (k >= 0) {
										if (Settings.get('gc_g_s')) {
											genreList[j] = {
												attributes: {
													class: 'esgst-gc esgst-gc-genres',
													href: this.replacePlaceholders(
														Settings.get('gc_gUrl'),
														placeholderValues
													),
													style: `background-color: ${
														Settings.get('gc_g_colors')[k].bgColor
													}; color: ${Settings.get('gc_g_colors')[k].color};`,
													title: getFeatureTooltip('gc_g_s', genreList[j]),
												},
												text: genreList[j],
												type: 'a',
											};
										} else {
											genreList[j] = {
												attributes: {
													style: `color: ${Settings.get('gc_g_colors')[k].color}`,
												},
												text: genreList[j],
												type: 'span',
											};
											if (j < genreList.length - 1) {
												genreList.splice(j + 1, 0, {
													text: `, `,
													type: 'node',
												});
											}
										}
									} else if (Settings.get('gc_g_s')) {
										genreList[j] = {
											attributes: {
												class: 'esgst-gc esgst-gc-genres',
												href: this.replacePlaceholders(Settings.get('gc_gUrl'), placeholderValues),
												title: getFeatureTooltip('gc_g_s', genreList[j]),
											},
											text: genreList[j],
											type: 'a',
										};
									} else {
										genreList[j] = {
											text: genreList[j],
											type: 'node',
										};
										if (j < genreList.length - 1) {
											genreList.splice(j + 1, 0, {
												text: `, `,
												type: 'node',
											});
										}
									}
								} else {
									genreList.splice(j, 1);
								}
							}
							if (Settings.get('gc_g_s')) {
								elements.push({
									attributes: {
										class: 'esgst-gc esgst-gc-genres',
										['data-draggable-id']: 'gc_g',
									},
									type: 'span',
									children: genreList,
								});
							} else if (genreList.length > 0) {
								elements.push({
									attributes: {
										class: 'esgst-gc esgst-gc-genres',
										['data-draggable-id']: 'gc_g',
										href: this.replacePlaceholders(Settings.get('gc_gUrl'), placeholderValues),
										title: getFeatureTooltip('gc_g', genres),
									},
									type: 'a',
									children: genreList,
								});
							}
						}
						break;
				}
			}
		}
		if (isInstant || isOutdated) {
			elements.push({
				attributes: {
					class: 'esgst-gc-loading',
					title: 'This game is queued for fetching',
				},
				type: 'span',
				children: [
					{
						attributes: {
							class: 'fa fa-hourglass fa-spin',
						},
						type: 'i',
					},
					{
						type: 'span',
					},
				],
			});
		}
		let cannotCheckOwnership = false;
		if (
			(!savedGame || !savedGame.owned) &&
			((cache && (cache.dlc || cache.learning === 1)) ||
				(type === 'apps' && Shared.esgst.delistedGames.banned.indexOf(parseInt(id)) > -1) ||
				(type === 'subs' && !packageCount))
		) {
			cannotCheckOwnership = true;
		}
		for (i = 0, n = games.length; i < n; ++i) {
			let currentElements = [...elements];
			const button =
				(games[i].elgbButton && games[i].elgbButton.firstElementChild) ||
				Shared.esgst.enterGiveawayButton;
			if (button && cannotCheckOwnership && Settings.get('gc_e')) {
				button.title = 'ESGST cannot check ownership of this game';
				button.style.color = Settings.get('gc_e_color');
				button.style.borderColor = Settings.get('gc_e_bColor');
				button.style.backgroundColor = Settings.get('gc_e_bgColor');
				button.style.backgroundImage = 'none';
			}
			if (games[i].container.classList.contains('esgst-hidden')) {
				if (!Shared.esgst.gcToFetch[type][id]) {
					Shared.esgst.gcToFetch[type][id] = [];
				}
				if (Shared.esgst.gcToFetch[type][id].indexOf(games[i]) < 0) {
					Shared.esgst.gcToFetch[type][id].push(games[i]);
				}
				continue;
			}
			if (Shared.esgst.gcToFetch[type][id]) {
				Shared.esgst.gcToFetch[type][id] = Shared.esgst.gcToFetch[type][id].filter(
					(item) => item !== games[i]
				);
				if (!Shared.esgst.gcToFetch[type][id].length) {
					delete Shared.esgst.gcToFetch[type][id];
				}
			}
			const oldElements = games[i].container.querySelectorAll('.esgst-gc');
			for (const element of oldElements) {
				element.remove();
			}
			panel = games[i].container.getElementsByClassName('esgst-gc-panel')[0];
			if (panel && !panel.getAttribute('data-gcReady')) {
				if (Settings.get('gc_il') && !Shared.esgst.giveawayPath) {
					panel.previousElementSibling.style.display = 'inline-block';
					panel.classList.add('esgst-gc-panel-inline');
				}
				if (Settings.get('gc_ocv') && games[i].startTime) {
					const reducedCV =
						(savedGame && savedGame.reducedCV && new Date(savedGame.reducedCV).getTime()) || 0;
					const noCV = (savedGame && savedGame.noCV && new Date(savedGame.noCV).getTime()) || 0;
					if (reducedCV || noCV) {
						let original = '';
						if (reducedCV && noCV) {
							if (games[i].startTime < reducedCV && games[i].startTime < noCV) {
								original = 'fcv';
							} else if (games[i].startTime < noCV) {
								original = 'rcv';
							}
						} else if (games[i].startTime < reducedCV || games[i].startTime < noCV) {
							original = 'fcv';
						}
						if (original) {
							currentElements.push({
								attributes: {
									class: `esgst-gc esgst-gc-originalCV esgst-gc-originalCV-${original}`,
									['data-draggable-id']: 'gc_ocv',
									href: this.replacePlaceholders(Settings.get('gc_ocvUrl'), placeholderValues),
									title: getFeatureTooltip(
										'gc_ocv',
										`Was ${Settings.get(`gc_${original}Label`)} when it was given away`
									),
								},
								text: Settings.get('gc_ocv_s')
									? Settings.get('gc_ocv_s_i')
										? ''
										: `W${original.toUpperCase()}`
									: `${Settings.get('gc_ocvLabel')}${Settings.get(`gc_${original}Label`)}`,
								type: 'a',
								children:
									Settings.get('gc_ocv_s') && Settings.get('gc_ocv_s_i')
										? [
												{
													attributes: {
														class: `fa fa-${Settings.get('gc_ocvIcon')}`,
													},
													type: 'i',
												},
												{
													attributes: {
														class: `fa fa-${Settings.get(`gc_${original}Icon`)}`,
													},
													type: 'i',
												},
										  ]
										: null,
							});
						}
					}
				}
				createElements(panel, 'atinner', currentElements);
				if (games[i].grid && !Settings.get('gc_lp_gv')) {
					for (j = panel.children.length - 1; j > -1; --j) {
						panel.children[j].removeAttribute('href');
					}
				}
				if (!isInstant && !isOutdated) {
					panel.setAttribute('data-gcReady', 1);
				}
				games[i].gcPanel = panel;
				Shared.esgst.modules.giveaways.giveaways_reorder(games[i]);
			}
		}
	}

	gc_formatDate(timestamp) {
		if (timestamp === '?') return timestamp;
		let date = new Date(timestamp);
		return Settings.get('gc_rdLabel')
			.replace(/DD/, date.getDate())
			.replace(/MM/, `${date.getMonth() + 1}`)
			.replace(
				/Month/,
				[
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December',
				][date.getMonth()]
			)
			.replace(
				/Mon/,
				['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
					date.getMonth()
				]
			)
			.replace(/YYYY/, `${date.getFullYear()}`);
	}

	replacePlaceholders = (str, values) => {
		return str
			.replace(/%steam-id%/g, values.steamId)
			.replace(/%username%/g, values.username)
			.replace(/%game-type%/g, values.gameType)
			.replace(/%game-id%/g, values.gameId)
			.replace(/%game-name%/g, values.gameName)
			.replace(/%game-search-name%/g, values.gameSearchName)
			.replace(/%hltb-id%/g, values.hltbId);
	};

	fetchFromServer = async (gc, games, toFetch) => {
		const params = {
			apps: [],
			subs: [],
			bundles: [],
		};
		for (const item of toFetch) {
			if (item.fetched) {
				continue;
			}
			if (typeof item.id === 'string' && item.id.match(/^SteamBundle/)) {
				item.realId = item.id.replace(/^SteamBundle/, '');
				item.realType = 'bundles';
			} else {
				item.realId = item.id;
				item.realType = item.type;
			}
			params[item.realType].push(item.realId);
		}

		if (params.apps.length > 0 || params.subs.length > 0 || params.bundles.length > 0) {
			try {
				const response = await FetchRequest.get(
					`https://rafaelgssa.com/esgst/games?app_ids=${params.apps.join(
						`,`
					)}&sub_ids=${params.subs.join(`,`)}&bundle_ids=${params.bundles.join(`,`)}`
				);
				const json = response.json;
				for (const item of toFetch) {
					item.fetched = true;
				}
				for (const item of toFetch) {
					if (!item.fetched) {
						continue;
					}

					const data = json.result.found[item.realType][item.realId];

					if (!data || data.queued_for_update) {
						continue;
					}

					const lastUpdate = new Date(data.last_update).getTime();

					item.found = true;
					item.isComplete = true;
					item.dependencies = [];
					gc.cache[item.type][item.id] = await this.fakeApi(
						gc,
						toFetch,
						data,
						item.id,
						item.type,
						lastUpdate,
						item
					);
					if (item.type === 'apps') {
						this.fetchedApps.push(item.id);
					}

					this.checkCategories(gc, games, toFetch, item);
				}
			} catch (err) {
				Logger.warning(err.message, err.stack);
			}
		}
	};

	fetchFromSteam = async (gc, games, toFetch, now) => {
		const lockObj = await Shared.common.createLock('gc', 100, {});

		for (const item of toFetch) {
			if (item.found) {
				continue;
			}

			item.fetched = true;
			item.found = true;
			item.isComplete = true;
			item.dependencies = [];
			gc.cache[item.type][item.id] = await this.gc_getCategories(
				gc,
				now,
				games,
				item.id,
				item.type,
				toFetch,
				item
			);
			if (item.type === 'apps') {
				this.fetchedApps.push(item.id);
			}

			this.checkCategories(gc, games, toFetch, item);

			await Shared.common.updateLock(lockObj.lock);
		}

		lockObj.deleteLock();
	};

	checkCategories = (gc, games, toFetch, item) => {
		if (item.hasIndex) {
			if (item.isComplete) {
				this.addCategories(gc, games, item);
				this.updateIndexes();
			} else {
				this.updateIndexes(item.type, item.id);
			}
		} else {
			for (const subItem of toFetch) {
				if (subItem.dependencies && subItem.dependencies.length > 0) {
					subItem.dependencies = subItem.dependencies.filter(
						(subId) => !this.fetchedApps.includes(subId)
					);
					if (subItem.dependencies.length === 0) {
						this.addCategories(gc, games, subItem);
						this.updateIndexes();
					}
				}
			}
		}
	};

	addCategories = (gc, games, item) => {
		const categories = gc.cache[item.type][item.id];
		if (
			Settings.get('gc_dlc_b') &&
			categories.dlc &&
			categories.base &&
			gc.cache.apps[categories.base]
		) {
			categories.freeBase = gc.cache.apps[categories.base].free;
		}
		this.gc_addCategory(
			gc,
			gc.cache[item.type][item.id],
			games[item.type][item.id],
			item.id,
			Shared.esgst.games[item.type][item.id],
			item.type,
			item.type === 'apps' ? gc.cache.hltb : null
		);
	};
}

const gamesGameCategories = new GamesGameCategories();

export { gamesGameCategories };
