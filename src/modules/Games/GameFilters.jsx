import { DOM } from '../../class/DOM';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { Filters } from '../Filters';

class GamesGameFilters extends Filters {
	constructor() {
		super('gmf');
		this.info = {
			description: () => <fragment>Filter games.</fragment>,
			features: {
				gmf_m: {
					description: () => (
						<ul>
							<li>Allows you to hide multiple games in a page using many different filters.</li>
							<li>
								Adds a toggle switch with a button (<i className="fa fa-sliders"></i>) to the main
								page heading of any page that has games and does not have giveaways. If a page has
								giveaways, you can filter games through the giveaway filters (the filter settings of
								this feature are shared with Giveaway Filters). The switch allows you to turn the
								filters on/off and the button allows you to manage your presets.
							</li>
							<li>
								To prevent confusion, in discussion pages the filter bar for this feature will be at
								the top, while the filter bar for Comment Filters (if enabled) will be at the main
								page heading.
							</li>
							<li>
								Adds a collapsible panel below the same main page heading that allows you to
								change/save the rules of a preset. The filters are separated in 3 categories:
							</li>
							<ul>
								<li>
									Basic filters are related to a numeric value and have a slider that you can use to
									set the range of the filter (any games that do not apply to the range will be
									hidden).
								</li>
								<li>
									Type filters are related to a boolean value and have a checkbox that changes
									states when you click on it. The checkbox has 3 states:
								</li>
								<ul>
									<li>
										"Show all" (<i className="fa fa-check-square"></i>) does not hide any games that
										apply to the filter (this is the default state).
									</li>
									<li>
										"Show only" (<i className="fa fa-square"></i>) hides any games that do not apply
										to the filter.
									</li>
									<li>
										"Hide all" (<i className="fa fa-square-o"></i>) hides any games that apply to
										the filter.
									</li>
								</ul>
								<li>
									Category filters are essentially the same thing as type filters, but for game
									categories (<span data-esgst-feature-id="gc"></span>).
								</li>
							</ul>
							<li>
								A preset contains all of your rules and can be saved to be reused later. You can
								save as many presets as you want. Each preset contains 3 types of rules:
							</li>
							<ul>
								<li>
									Basic rules are the ones that you can change directly in the filter panel, using
									the sliders/checkboxes as explained in the previous item.
								</li>
								<li>
									Exception rules are the ones that you can change by clicking on the icon{' '}
									<i className="fa fa-gear"></i> in the filter panel. They are exceptions to the
									basic rules.
								</li>
								<li>
									Override rules are the ones that you can change by clicking on the icon (
									<i className="fa fa-exclamation esgst-faded"></i> if set to overridable and{' '}
									<i className="fa fa-exclamation"></i> if set to non-overridable) next to each
									filter. They are enforcements of the basic rules.
								</li>
							</ul>
						</ul>
					),
					features: {
						gmf_m_f: {
							name: 'Fix filter bar at the top of the page.',
							sg: true,
						},
						gmf_m_b: {
							name: 'Hide basic filters.',
							sg: true,
						},
						gmf_m_a: {
							name: 'Hide advanced filters.',
							sg: true,
						},
						gmf_rating: {
							alias: 'gf_rating',
						},
						gmf_reviews: {
							alias: 'gf_reviews',
						},
						gmf_releaseDate: {
							alias: 'gf_releaseDate',
						},
						gmf_owned: {
							alias: 'gf_owned',
						},
						gmf_wishlisted: {
							alias: 'gf_wishlisted',
						},
						gmf_previouslyWishlisted: {
							alias: 'gf_previouslyWishlisted',
						},
						gmf_followed: {
							alias: 'gf_followed',
						},
						gmf_hidden: {
							alias: 'gf_hidden',
						},
						gmf_ignored: {
							alias: 'gf_ignored',
						},
						gmf_previouslyEntered: {
							alias: 'gf_previouslyEntered',
						},
						gmf_previouslyWon: {
							alias: 'gf_previouslyWon',
						},
						gmf_fullCV: {
							alias: 'gf_fullCV',
						},
						gmf_reducedCV: {
							alias: 'gf_reducedCV',
						},
						gmf_noCV: {
							alias: 'gf_noCV',
						},
						gmf_learning: {
							alias: 'gf_learning',
						},
						gmf_removed: {
							alias: 'gf_removed',
						},
						gmf_banned: {
							alias: 'gf_banned',
						},
						gmf_tradingCards: {
							alias: 'gf_tradingCards',
						},
						gmf_achievements: {
							alias: 'gf_achievements',
						},
						gmf_singleplayer: {
							alias: 'gf_singleplayer',
						},
						gmf_multiplayer: {
							alias: 'gf_multiplayer',
						},
						gmf_steamCloud: {
							alias: 'gf_steamCloud',
						},
						gmf_linux: {
							alias: 'gf_linux',
						},
						gmf_mac: {
							alias: 'gf_mac',
						},
						gmf_dlc: {
							alias: 'gf_dlc',
						},
						gmf_dlcOwned: {
							alias: 'gf_dlcOwned',
						},
						gmf_dlcFree: {
							alias: 'gf_dlcFree',
						},
						gmf_dlcNonFree: {
							alias: 'gf_dlcNonFree',
						},
						gmf_package: {
							alias: 'gf_package',
						},
						gmf_earlyAccess: {
							alias: 'gf_earlyAccess',
						},
						gmf_genres: {
							alias: 'gf_genres',
						},
						gmf_tags: {
							alias: 'gf_tags',
						},
					},
					name: 'Multiple Filters',
					sg: true,
				},
			},
			id: 'gmf',
			name: 'Game Filters',
			sg: true,
			sync: `Owned/Wishlisted/Ignored Games, Giveaways, Hidden Games, No CV Games, Reduced CV Games, Won Games`,
			syncKeys: ['Games', 'Giveaways', 'HiddenGames', 'NoCvGames', 'ReducedCvGames', 'WonGames'],
			type: 'games',
		};
	}

	init() {
		if (
			!Settings.get('gmf') ||
			!Shared.common.isCurrentPath([
				'Community Wishlist',
				'Bundle Games',
				'Discussion',
				'Settings - Giveaways - Filters',
				'Steam - Games',
			])
		) {
			return;
		}

		if (!Shared.esgst.hasAddedFilterContainer) {
			Shared.esgst.style.insertAdjacentText(
				'beforeend',
				`
				.esgst-gf-container {
					position: ${Settings.get('gmf_m_f') ? 'sticky' : 'static'};
					top: ${Shared.esgst.commentsTop}px;
				}
			`
			);
		}

		Shared.common.createHeadingButton({
			element: this.filters_addContainer(
				Shared.esgst.discussionPath
					? document.querySelector('.page__heading')
					: Shared.esgst.mainPageHeading
			),
			id: 'gmf',
		});
	}

	getFilters() {
		return {
			rating: {
				category: 'gc_r',
				check: true,
				maxValue: 100,
				minValue: 0,
				name: 'Rating',
				type: 'integer',
			},
			reviews: {
				category: 'gc_r',
				check: true,
				minValue: 0,
				name: 'Reviews',
				type: 'integer',
			},
			releaseDate: {
				category: 'gc_rd',
				check:
					!Shared.esgst.parameters.release_date_min && !Shared.esgst.parameters.release_date_max,
				date: true,
				name: 'Release Date',
				type: 'integer',
			},
			owned: {
				check: true,
				name: 'Owned',
				sync: ['Games'],
				type: 'boolean',
			},
			wishlisted: {
				check: true,
				name: 'Wishlisted',
				sync: ['Games'],
				type: 'boolean',
			},
			previouslyWishlisted: {
				check: true,
				name: 'Previously Wishlisted',
				sync: ['Games'],
				type: 'boolean',
			},
			followed: {
				check: true,
				name: 'Followed',
				sync: ['FollowedGames'],
				type: 'boolean',
			},
			hidden: {
				check: true,
				name: 'Hidden',
				sync: ['HiddenGames'],
				type: 'boolean',
			},
			ignored: {
				check: true,
				name: 'Ignored',
				sync: ['Games'],
				type: 'boolean',
			},
			previouslyEntered: {
				check: true,
				name: 'Previously Entered',
				type: 'boolean',
			},
			previouslyWon: {
				check: true,
				name: 'Previously Won',
				sync: ['WonGames'],
				type: 'boolean',
			},
			fullCV: {
				check: true,
				name: 'Full CV',
				sync: ['ReducedCvGames', 'NoCvGames'],
				type: 'boolean',
			},
			reducedCV: {
				check: true,
				name: 'Reduced CV',
				sync: ['ReducedCvGames'],
				type: 'boolean',
			},
			noCV: {
				check: true,
				name: 'No CV',
				sync: ['NoCvGames'],
				type: 'boolean',
			},
			learning: {
				category: 'gc_lg',
				check: true,
				name: 'Learning',
				type: 'boolean',
			},
			removed: {
				check: true,
				name: 'Removed',
				sync: ['DelistedGames'],
				type: 'boolean',
			},
			banned: {
				check: true,
				name: 'Banned',
				sync: ['DelistedGames'],
				type: 'boolean',
			},
			tradingCards: {
				category: 'gc_tc',
				check: true,
				name: 'Trading Cards',
				type: 'boolean',
			},
			achievements: {
				category: 'gc_a',
				check: true,
				name: 'Achievements',
				type: 'boolean',
			},
			singleplayer: {
				category: 'gc_sp',
				check: true,
				name: 'Singleplayer',
				type: 'boolean',
			},
			multiplayer: {
				category: 'gc_mp',
				check: true,
				name: 'Multiplayer',
				type: 'boolean',
			},
			steamCloud: {
				category: 'gc_sc',
				check: true,
				name: 'Steam Cloud',
				type: 'boolean',
			},
			linux: {
				category: 'gc_l',
				check: true,
				name: 'Linux',
				type: 'boolean',
			},
			mac: {
				category: 'gc_m',
				check: true,
				name: 'Mac',
				type: 'boolean',
			},
			dlc: {
				category: 'gc_dlc',
				check: true,
				name: 'DLC',
				type: 'boolean',
			},
			dlcOwned: {
				category: 'gc_dlc_o',
				check: true,
				name: `DLC (Owned Base)`,
				type: 'boolean',
			},
			dlcFree: {
				category: 'gc_dlc_b',
				check: true,
				name: `DLC (Free Base)`,
				type: 'boolean',
			},
			dlcNonFree: {
				category: 'gc_dlc_b',
				check: true,
				name: `DLC (Non-Free Base)`,
				type: 'boolean',
			},
			package: {
				category: 'gc_p',
				check: true,
				name: 'Package',
				type: 'boolean',
			},
			earlyAccess: {
				category: 'gc_ea',
				check: true,
				name: 'Early Access',
				type: 'boolean',
			},
			genres: {
				category: 'gc_g',
				check: true,
				list: true,
				name: 'Genres',
				type: 'string',
			},
			tags: {
				check: true,
				list: true,
				name: 'Game Tags',
				type: 'string',
			},
		};
	}
}

const gamesGameFilters = new GamesGameFilters();

export { gamesGameFilters };
