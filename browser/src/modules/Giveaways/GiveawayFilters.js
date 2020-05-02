import { Button } from '../../class/Button';
import { common } from '../Common';
import { Filters } from '../Filters';
import { Shared } from '../../class/Shared';
import { Settings } from '../../class/Settings';

const
	createHeadingButton = common.createHeadingButton.bind(common),
	createLock = common.createLock.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common)
	;

class GiveawaysGiveawayFilters extends Filters {
	constructor() {
		super('gf');
		this.info = {
			description: 'Filter giveaways.',
			features: {
				gf_s: {
					description: [
						['ul', [
							['li', [
								'Adds a button (',
								['i', { class: 'fa fa-eye-slash' }],
								') next to a giveaway\'s title in any page that allows you to hide that individual giveaway.',
							]],
							['li', [
								'Adds a button (',
								['i', { class: 'fa fa-gift' }],
								' ',
								['i', { class: 'fa fa-eye-slash' }],
								') to the page heading of the settings menu that allows you to manage your hidden giveaways.',
							]],
						]],
					],
					name: 'Single Filters',
					sg: true,
					features: {
						gf_s_s: {
							name: `Show switch to temporarily hide / unhide giveaways filtered by the filters in the main page heading, along with a counter.`,
							sg: true
						}
					}
				},
				gf_m: {
					description: [
						['ul', [
							['li', 'Allows you to hide multiple giveaways in a page using many different filters.'],
							['li', [
								`Adds a toggle switch with a button (`,
								['i', { class: 'fa fa-sliders' }],
								`) to the main page heading of any `,
								['a', { href: `https://www.steamgifts.com/giveaways` }, 'giveaways'],
								'/',
								['a', { href: `https://www.steamgifts.com/giveaways/created` }, 'created'],
								'/',
								['a', { href: `https://www.steamgifts.com/giveaways/entered` }, 'entered'],
								'/',
								['a', { href: `https://www.steamgifts.com/giveaways/won` }, 'won'],
								'/',
								['a', { href: `https://www.steamgifts.com/user/cg` }, 'user'],
								'/',
								['a', { href: `https://www.steamgifts.com/group/SJ7Bu/` }, 'group'],
								` page and some popups ([id=gb], [id=ged], [id=ge], etc...). The switch allows you to turn the filters on/off and the button allows you to manage your presets.`
							]],
							['li', `Adds a collapsible panel below the same main page heading that allows you to change/save the rules of a preset. The filters are separated in 3 categories:`],
							['ul', [
								['li', `Basic filters are related to a numeric value (such as the level of a giveaway) and have a slider that you can use to set the range of the filter (any giveaways that do not apply to the range will be hidden).`],
								['li', `Type filters are related to a boolean value (such as whether or not a giveaway was created by yourself) and have a checkbox that changes states when you click on it. The checkbox has 3 states:`],
								['ul', [
									['li', [
										`"Show all" (`,
										['i', { class: 'fa fa-check-square' }],
										`) does not hide any giveaways that apply to the filter (this is the default state).`
									]],
									['li', [
										`"Show only" (`,
										['i', { class: 'fa fa-square' }],
										`) hides any giveaways that do not apply to the filter.`
									]],
									['li', [
										`"Hide all" (`,
										['i', { class: 'fa fa-square-o' }],
										`) hides any giveaways that apply to the filter.`
									]]
								]],
								['li', `Category filters are essentially the same thing as type filters, but for game categories ([id=gc]).`]
							]],
							['li', `A preset contains all of your rules and can be saved to be reused later. You can save as many presets as you want. Each preset contains 3 types of rules:`],
							['ul', [
								['li', `Basic rules are the ones that you can change directly in the filter panel, using the sliders/checkboxes as explained in the previous item.`],
								['li', [
									'Exception rules are the ones that you can change by clicking on the icon ',
									['i', { class: 'fa fa-gear' }],
									` in the filter panel. They are exceptions to the basic rules. For example, if you set the basic rule of the "Created" filter to "hide all" and you add an exception rule for the "Level" filter to the 0-5 range, none of your created giveaways that are for the levels 0-5 will be hidden, because they apply to the exception.`
								]],
								['li', [
									`Override rules are the ones that you can change by clicking on the icon (`,
									['i', { class: 'fa fa-exclamation esgst-faded' }],
									' if set to overridable and ',
									['i', { class: 'fa fa-exclamation' }],
									` if set to non-overridable) next to each filter. They are enforcements of the basic rules. Continuing the previous example, if you set the override rule of the "Created" filter to "non-overridable", then all of your created giveaways will be hidden, because even if they apply to the exception, the basic rule is being enforced by the override rule, so the exception cannot override it.`
								]]
							]]
						]]
					],
					features: {
						gf_m_b: {
							name: 'Hide basic filters.',
							sg: true
						},
						gf_m_a: {
							name: 'Hide advanced filters.',
							sg: true
						},
						gf_level: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by level.']
								]]
							],
							name: 'Level',
							sg: true
						},
						gf_entries: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by number of entries.']
								]]
							],
							name: 'Entries',
							sg: true
						},
						gf_copies: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by number of copies.']
								]]
							],
							name: 'Copies',
							sg: true
						},
						gf_points: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by how many points they cost.']
								]]
							],
							name: 'Points',
							sg: true
						},
						gf_comments: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by number of comments.']
								]]
							],
							name: 'Comments',
							sg: true
						},
						gf_minutesToEnd: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by how much time they have left.']
								]]
							],
							name: 'Minutes To End',
							sg: true
						},
						gf_minutesFromStart: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by how long ago they started.']
								]]
							],
							name: 'Minutes From Start',
							sg: true
						},
						gf_chance: {
							dependencies: ['gwc'],
							description: [
								['ul', [
									['li', `Allows you to filter giveaways by chance (basic).`]
								]]
							],
							name: 'Chance',
							sg: true
						},
						gf_projectedChance: {
							dependencies: ['gwc', 'gwc_a'],
							description: [
								['ul', [
									['li', `Allows you to filter giveaways by projected chance (advanced).`]
								]]
							],
							name: 'Projected Chance',
							sg: true
						},
						gf_chancePerPoint: {
							dependencies: ['gwc'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by chance per point using the basic chance.']
								]]
							],
							name: 'Chance Per Point',
							sg: true
						},
						gf_projectedChancePerPoint: {
							dependencies: ['gwc', 'gwc_a'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by chance per point using the advanced chance.']
								]]
							],
							name: 'Projected Chance Per Point',
							sg: true
						},
						gf_ratio: {
							dependencies: ['gwr'],
							description: [
								['ul', [
									['li', `Allows you to filter giveaways by ratio (basic).`]
								]]
							],
							name: 'Ratio',
							sg: true
						},
						gf_projectedRatio: {
							dependencies: ['gwr', 'gwr_a'],
							description: [
								['ul', [
									['li', `Allows you to filter giveaways by projected ratio (advanced).`]
								]]
							],
							name: 'Projected Ratio',
							sg: true
						},
						gf_pointsToWin: {
							dependencies: ['gptw'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by points to win.']
								]]
							],
							name: 'Points To Win',
							sg: true
						},
						gf_rating: {
							dependencies: ['gc', 'gc_r'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by rating percentage of the game.']
								]]
							],
							name: 'Rating',
							sg: true
						},
						gf_reviews: {
							dependencies: ['gc', 'gc_r'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by the number of reviews that the game has.']
								]]
							],
							name: 'Reviews',
							sg: true
						},
						gf_releaseDate: {
							dependencies: ['gc', 'gc_rd'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by release date of the game.']
								]]
							],
							name: 'Release Date',
							sg: true
						},
						gf_pinned: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are pinned.']
								]]
							],
							name: 'Pinned',
							sg: true
						},
						gf_public: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are public.']
								]]
							],
							name: 'Public',
							sg: true
						},
						gf_inviteOnly: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are invite only.']
								]]
							],
							name: 'Invite Only',
							sg: true
						},
						gf_group: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are for groups.']
								]]
							],
							name: 'Group',
							sg: true
						},
						gf_whitelist: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are for whitelist.']
								]]
							],
							name: 'Whitelist',
							sg: true
						},
						gf_regionRestricted: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are region restricted.']
								]]
							],
							name: 'Region Restricted',
							sg: true
						},
						gf_enterable: {
							description: [
								['ul', [
									['li', `Allows you filter giveaways that are enterable in [id=ge].`],
									['li', `The difference between this filter and [id=gf_currentlyEnterable] is that this filter checks if you are allowed to enter the giveaway, not if you can enter the giveaway at the moment (for example, if the giveaway has not started yet or you do not have enough points to enter the giveaway, the giveaway is considered as enterable, just not currently enterable).`]
								]]
							],
							name: 'Enterable',
							sg: true
						},
						gf_currentlyEnterable: {
							description: [
								['ul', [
									['li', `Allows you filter giveaways that are currently enterable in [id=ge].`],
									['li', `The difference between this filter and [id=gf_enterable] is that this filter checks if you can enter the giveaway at the moment, not if you are allowed to enter the giveaway (for example, if the giveaway has not started yet or you do not have enough points to enter the giveaway, the giveaway is not considered as currently enterable, but just enterable).`]
								]]
							],
							name: 'Currently Enterable',
							sg: true
						},
						gf_created: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways created by yourself.']
								]]
							],
							name: 'Created',
							sg: true
						},
						gf_received: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that have been marked as received.']
								]]
							],
							name: 'Received',
							sg: true
						},
						gf_notReceived: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that have been marked as not received.']
								]]
							],
							name: 'Not Received',
							sg: true
						},
						gf_awaitingFeedback: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that are awaiting feedback.']
								]]
							],
							name: 'Awaiting Feedback',
							sg: true
						},
						gf_entered: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that you have entered.']
								]]
							],
							name: 'Entered',
							sg: true
						},
						gf_started: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that have started.']
								]]
							],
							name: 'Started',
							sg: true
						},
						gf_ended: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that have ended.']
								]]
							],
							name: 'Ended',
							sg: true
						},
						gf_deleted: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that have been deleted.']
								]]
							],
							name: 'Deleted',
							sg: true
						},
						gf_owned: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you own on Steam.']
								]]
							],
							name: 'Owned',
							sg: true
						},
						gf_wishlisted: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have wishlisted on Steam.']
								]]
							],
							name: 'Wishlisted',
							sg: true
						},
						gf_followed: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have followed on Steam.']
								]]
							],
							name: 'Followed',
							sg: true,
							syncKeys: ['FollowedGames']
						},
						gf_hidden: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have hidden on SteamGifts.']
								]]
							],
							name: 'Hidden',
							sg: true
						},
						gf_ignored: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have ignored on Steam.']
								]]
							],
							name: 'Ignored',
							sg: true
						},
						gf_previouslyEntered: {
							dependencies: ['egh'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have previously entered giveaways for.']
								]]
							],
							name: 'Previously Entered',
							sg: true
						},
						gf_previouslyWon: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that you have previously won.']
								]]
							],
							name: 'Previously Won',
							sg: true
						},
						gf_bookmarked: {
							dependencies: ['gb'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways that you have bookmarked.']
								]]
							],
							name: 'Bookmarked',
							sg: true
						},
						gf_fullCV: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that give full CV.']
								]]
							],
							name: 'Full CV',
							sg: true
						},
						gf_reducedCV: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that give reduced CV.']
								]]
							],
							name: 'Reduced CV',
							sg: true
						},
						gf_noCV: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that give no CV.']
								]]
							],
							name: 'No CV',
							sg: true
						},
						gf_sgTools: {
							dependencies: ['ge'],
							description: [
								['ul', [
									['li', 'Allows you to filter SGTools giveaways.']
								]]
							],
							name: 'SGTools',
							sg: true
						},
						gf_groups: {
							dependencies: ['cl', 'ggl'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by group.']
								]]
							],
							name: 'Groups',
							sg: true
						},
						gf_creators: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by creator.']
								]]
							],
							name: 'Creators',
							sg: true
						},
						gf_winners: {
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by winner.']
								]]
							],
							name: 'Winners',
							sg: true
						},
						gf_learning: {
							dependencies: ['gc', 'gc_lg'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that Steam is learning about.']
								]]
							],
							name: 'Learning',
							sg: true
						},
						gf_removed: {
							dependencies: ['gc', 'gc_rm'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that have been removed from the Steam store.']
								]]
							],
							name: 'Removed',
							sg: true
						},
						gf_banned: {
							dependencies: ['gc', 'gc_bd'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are banned on Steam.']
								]]
							],
							name: 'Banned',
							sg: true
						},
						gf_tradingCards: {
							dependencies: ['gc', 'gc_tc'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that have trading cards.']
								]]
							],
							name: 'Trading Cards',
							sg: true
						},
						gf_achievements: {
							dependencies: ['gc', 'gc_a'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that have achievements.']
								]]
							],
							name: 'Achievements',
							sg: true
						},
						gf_singleplayer: {
							dependencies: ['gc', 'gc_sp'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are singleplayer.']
								]]
							],
							name: 'Singleplayer',
							sg: true
						},
						gf_multiplayer: {
							dependencies: ['gc', 'gc_mp'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are multiplayer.']
								]]
							],
							name: 'Multiplayer',
							sg: true
						},
						gf_steamCloud: {
							dependencies: ['gc', 'gc_sc'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that have Steam Cloud.']
								]]
							],
							name: 'Steam Cloud',
							sg: true
						},
						gf_linux: {
							dependencies: ['gc', 'gc_l'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that have are compatible with Linux.']
								]]
							],
							name: 'Linux',
							sg: true
						},
						gf_mac: {
							dependencies: ['gc', 'gc_m'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are compatible with Mac.']
								]]
							],
							name: 'Mac',
							sg: true
						},
						gf_dlc: {
							dependencies: ['gc', 'gc_dlc'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are DLCs.']
								]]
							],
							name: 'DLC',
							sg: true
						},
						gf_dlcOwned: {
							dependencies: ['gc', 'gc_dlc', 'gc_dlc_o'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are DLCs and have a base game that you own.']
								]]
							],
							name: `DLC (Owned Base)`,
							sg: true
						},
						gf_dlcFree: {
							dependencies: ['gc', 'gc_dlc', 'gc_dlc_b'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are DLCs and have a free base game.']
								]]
							],
							name: `DLC (Free Base)`,
							sg: true
						},
						gf_dlcNonFree: {
							dependencies: ['gc', 'gc_dlc', 'gc_dlc_b'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are DLCs and have a non-free base game.']
								]]
							],
							name: `DLC (Non-Free Base)`,
							sg: true
						},
						gf_package: {
							dependencies: ['gc', 'gc_p'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are packages.']
								]]
							],
							name: 'Package',
							sg: true
						},
						gf_earlyAccess: {
							dependencies: ['gc', 'gc_ea'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways for games that are in early access.']
								]]
							],
							name: 'Early Access',
							sg: true
						},
						gf_genres: {
							dependencies: ['gc', 'gc_g'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by game genre.']
								]]
							],
							name: 'Genres',
							sg: true
						},
						gf_tags: {
							dependencies: ['gt'],
							description: [
								['ul', [
									['li', 'Allows you to filter giveaways by game tags.']
								]]
							],
							name: 'Game Tags',
							sg: true
						},
						gf_os: {
							description: [
								['ul', [
									['li', 'Allows you to quickly enable/disable SteamGifts\' "Filter by OS" filter.']
								]]
							],
							name: `OS (SteamGifts)`,
							sg: true
						},
						gf_alreadyOwned: {
							description: [
								['ul', [
									['li', 'Allows you to quickly enable/disable SteamGifts\' "Hide games you already own" filter.']
								]]
							],
							name: `Already Owned (SteamGifts)`,
							sg: true
						},
						gf_dlcMissingBase: {
							description: [
								['ul', [
									['li', 'Allows you to quickly enable/disable SteamGifts\' "Hide DLC if you\'re missing the base game" filter.']
								]]
							],
							name: `DLC Missing Base (SteamGifts)`,
							sg: true
						},
						gf_aboveLevel: {
							description: [
								['ul', [
									['li', 'Allows you to quickly enable/disable SteamGifts\' "Hide giveaways above your level" filter.']
								]]
							],
							name: `Above Level (SteamGifts)`,
							sg: true
						},
						gf_manuallyFiltered: {
							description: [
								['ul', [
									['li', 'Allows you to quickly enable/disable SteamGifts\' "Hide games you manually filtered" filter.']
								]]
							],
							name: `Manually Filtered (SteamGifts)`,
							sg: true
						}
					},
					name: 'Multiple Filters',
					sg: true
				}
			},
			id: 'gf',
			name: 'Giveaway Filters',
			sg: true,
			sync: `Owned/Wishlisted/Ignored Games, Giveaways, Hidden Games, No CV Games, Reduced CV Games, Won Games`,
			syncKeys: ['Games', 'Giveaways', 'HiddenGames', 'NoCvGames', 'ReducedCvGames', 'WonGames'],
			type: 'giveaways'
		};
	}

	init() {
		if (Settings.get('gf_s')) {
			if (Settings.get('gf_s_s')) {
				this.addSingleButton('fa-gift');
			}
			this.esgst.giveawayFeatures.push(this.gf_getGiveaways.bind(this));
		}
		if (Settings.get('gf_m') && (this.esgst.giveawaysPath || this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.groupPath || this.esgst.userPath)) {
			if (!Shared.esgst.hasAddedFilterContainer) {
				Shared.esgst.style.insertAdjacentText("beforeend", `
					.esgst-gf-container {
						top: ${Shared.esgst.commentsTop - 5}px;
					}
				`);
			}
			createHeadingButton({
				element: this.filters_addContainer(this.esgst.mainPageHeading),
				id: 'gf'
			});
		}
		if (window.location.pathname.match(/^\/account\/settings\/giveaways$/) && (Settings.get('gf_os') || Settings.get('gf_alreadyOwned') || Settings.get('gf_dlcMissingBase') || Settings.get('gf_aboveLevel') || Settings.get('gf_manuallyFiltered'))) {
			let key,
				inputs = {
					filter_os: null,
					filter_giveaways_exist_in_account: null,
					filter_giveaways_missing_base_game: null,
					filter_giveaways_level: null,
					filter_giveaways_additional_games: null
				};
			for (key in inputs) {
				inputs[key] = document.querySelector(`[name="${key}"]`);
			}
			document.getElementsByClassName('form__submit-button js__submit-form')[0].addEventListener('click', () => {
				const settings = [];
				for (key in inputs) {
					settings.push({
						id: key,
						value: parseInt(inputs[key].value)
					});
				}
				Shared.common.setSetting(settings);
			});
		}
	}

	gf_getGiveaways(giveaways, main, source) {
		giveaways.forEach(giveaway => {
			if (giveaway.creator !== Settings.get('username') && !giveaway.ended && !giveaway.entered && giveaway.url) {
				if (source === 'gf' || this.esgst.giveawayPath) {
					if (!giveaway.innerWrap.getElementsByClassName('esgst-gf-unhide-button')[0] && this.esgst.giveaways[giveaway.code] && this.esgst.giveaways[giveaway.code].hidden) {
						new Button(giveaway.headingName, 'beforeBegin', {
							callbacks: [this.gf_hideGiveaway.bind(this, giveaway, main), null, this.gf_unhideGiveaway.bind(this, giveaway, main), null],
							className: 'esgst-gf-unhide-button',
							icons: ['fa-eye-slash esgst-clickable', 'fa-circle-o-notch fa-spin', 'fa-eye esgst-clickable', 'fa-circle-o-notch fa-spin'],
							id: 'gf_s',
							index: 2,
							titles: ['Hide giveaway', 'Hiding giveaway...', 'Unhide giveaway', 'Unhiding giveaway...']
						}).button.setAttribute('data-draggable-id', 'gf');
					}
				}
				if ((source !== 'gc' && (this.esgst.giveawaysPath || this.esgst.groupPath)) || this.esgst.giveawayPath) {
					if (!giveaway.innerWrap.getElementsByClassName('esgst-gf-hide-button')[0] && (!this.esgst.giveaways[giveaway.code] || !this.esgst.giveaways[giveaway.code].hidden || !this.esgst.giveaways[giveaway.code].code)) {
						new Button(giveaway.headingName, 'beforeBegin', {
							callbacks: [this.gf_hideGiveaway.bind(this, giveaway, main), null, this.gf_unhideGiveaway.bind(this, giveaway, main), null],
							className: 'esgst-gf-hide-button',
							icons: ['fa-eye-slash esgst-clickable', 'fa-circle-o-notch fa-spin', 'fa-eye esgst-clickable', 'fa-circle-o-notch fa-spin'],
							id: 'gf_s',
							index: 0,
							titles: ['Hide giveaway', 'Hiding giveaway...', 'Unhide giveaway', 'Unhiding giveaway...']
						}).button.setAttribute('data-draggable-id', 'gf');
					}
				}
			}
		});
	}

	async gf_hideGiveaway(giveaway, main) {
		let deleteLock = await createLock('giveawayLock', 300);
		let giveaways = JSON.parse(getValue('giveaways', '{}'));
		if (!giveaways[giveaway.code]) {
			giveaways[giveaway.code] = {};
		}
		giveaways[giveaway.code].code = giveaway.code;
		giveaways[giveaway.code].endTime = giveaway.endTime;
		giveaways[giveaway.code].hidden = Date.now();
		await setValue('giveaways', JSON.stringify(giveaways));
		deleteLock();
		if (!main || !this.esgst.giveawayPath) {
			giveaway.outerWrap.remove();
		}
		return true;
	}

	async gf_unhideGiveaway(giveaway, main) {
		let deleteLock = await createLock('giveawayLock', 300);
		let giveaways = JSON.parse(getValue('giveaways', '{}'));
		if (giveaways[giveaway.code]) {
			delete giveaways[giveaway.code].hidden;
		}
		await setValue('giveaways', JSON.stringify(giveaways));
		deleteLock();
		if (!main || !this.esgst.giveawayPath) {
			giveaway.outerWrap.remove();
		}
		return true;
	}

	getFilters(popup) {
		return {
			level: {
				check: (!this.esgst.parameters.level_min && !this.esgst.parameters.level_max) && (((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup),
				maxValue: 10,
				minValue: 0,
				name: 'Level',
				type: 'integer'
			},
			entries: {
				check: (!this.esgst.parameters.entry_min && !this.esgst.parameters.entry_max) && (!this.esgst.wonPath || popup),
				minValue: 0,
				name: 'Entries',
				type: 'integer'
			},
			copies: {
				check: (!this.esgst.parameters.copy_min && !this.esgst.parameters.copy_max) && (!this.esgst.wonPath || popup),
				minValue: 1,
				name: 'Copies',
				type: 'integer'
			},
			points: {
				check: (!this.esgst.parameters.point_min && !this.esgst.parameters.point_max) && (((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup),
				maxValue: 100,
				minValue: 0,
				name: 'Points',
				type: 'integer'
			},
			comments: {
				check: popup || (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath),
				minValue: 0,
				name: 'Comments',
				type: 'integer'
			},
			minutesToEnd: {
				check: !this.esgst.wonPath || popup,
				minValue: 0,
				name: 'Minutes To End',
				type: 'integer'
			},
			minutesFromStart: {
				check: !this.esgst.wonPath || popup,
				minValue: 0,
				name: 'Minutes From Start',
				type: 'integer'
			},
			chance: {
				check: Settings.get('gwc') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				maxValue: 100,
				minValue: 0,
				name: 'Chance',
				type: 'double'
			},
			projectedChance: {
				check: Settings.get('gwc') && Settings.get('gwc_a') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				maxValue: 100,
				minValue: 0,
				name: 'Projected Chance',
				type: 'double'
			},
			chancePerPoint: {
				check: Settings.get('gwc') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				maxValue: 100,
				minValue: 0,
				name: 'Chance Per Point',
				type: 'double'
			},
			projectedChancePerPoint: {
				check: Settings.get('gwc') && Settings.get('gwc_a') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				maxValue: 100,
				minValue: 0,
				name: 'Projected Chance Per Point',
				type: 'double'
			},
			ratio: {
				check: Settings.get('gwr') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				minValue: 0,
				name: 'Ratio',
				type: 'integer'
			},
			projectedRatio: {
				check: Settings.get('gwr') && Settings.get('gwr_a') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				minValue: 0,
				name: 'Projected Ratio',
				type: 'integer'
			},
			pointsToWin: {
				check: Settings.get('gptw') && (((!this.esgst.enteredPath || Settings.get('cewgd')) && !this.esgst.createdPath && !this.esgst.wonPath) || popup),
				minValue: 0,
				name: 'Points To Win',
				type: 'integer'
			},
			pinned: {
				check: this.esgst.giveawaysPath,
				name: 'Pinned',
				type: 'boolean'
			},
			public: {
				check: !this.esgst.giveawaysPath,
				name: 'Public',
				type: 'boolean'
			},
			inviteOnly: {
				check: ((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup,
				name: 'Invite Only',
				type: 'boolean'
			},
			group: {
				check: ((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup,
				name: 'Group',
				type: 'boolean'
			},
			whitelist: {
				check: ((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup,
				name: 'Whitelist',
				type: 'boolean'
			},
			regionRestricted: {
				check: ((!this.esgst.createdPath || Settings.get('cewgd')) && (!this.esgst.enteredPath || Settings.get('cewgd')) && (!this.esgst.wonPath || Settings.get('cewgd'))) || popup,
				name: 'Region Restricted',
				type: 'boolean'
			},
			enterable: {
				check: popup === 'Ge',
				name: 'Enterable',
				type: 'boolean'
			},
			currentlyEnterable: {
				check: popup === 'Ge',
				name: 'Currently Enterable',
				type: 'boolean'
			},
			created: {
				check: (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath) || popup,
				name: 'Created',
				type: 'boolean'
			},
			received: {
				check: this.esgst.createdPath || this.esgst.wonPath,
				name: 'Received',
				type: 'boolean'
			},
			notReceived: {
				check: this.esgst.createdPath || this.esgst.wonPath,
				name: 'Not Received',
				type: 'boolean'
			},
			awaitingFeedback: {
				check: this.esgst.createdPath || this.esgst.wonPath,
				name: 'Awaiting Feedback',
				type: 'boolean'
			},
			entered: {
				check: (!this.esgst.createdPath && !this.esgst.enteredPath && !this.esgst.wonPath) || popup,
				name: 'Entered',
				type: 'boolean'
			},
			started: {
				check: (!this.esgst.enteredPath && !this.esgst.wonPath) || popup,
				name: 'Started',
				type: 'boolean'
			},
			ended: {
				check: !this.esgst.wonPath || popup,
				name: 'Ended',
				type: 'boolean'
			},
			deleted: {
				check: this.esgst.createdPath || this.esgst.enteredPath,
				name: 'Deleted',
				type: 'boolean'
			},
			sgTools: {
				check: Settings.get('ge'),
				name: 'SGTools',
				type: 'boolean'
			},
			bookmarked: {
				check: Settings.get('gb'),
				name: 'Bookmarked',
				type: 'boolean'
			},
			groups: {
				check: Settings.get('cl') && Settings.get('ggl') && Settings.get('ggl_index') === 0,
				list: true,
				name: 'Groups',
				type: 'string'
			},
			creators: {
				check: true,
				list: true,
				name: 'Creators',
				type: 'string'
			},
			winners: {
				check: true,
				list: true,
				name: 'Winners',
				type: 'string'
			},
			...Shared.esgst.modules.gamesGameFilters.getFilters()
		};
	}
}

const giveawaysGiveawayFilters = new GiveawaysGiveawayFilters();

export { giveawaysGiveawayFilters };