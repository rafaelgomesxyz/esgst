import { Utils } from '../lib/jsUtils';
import { Shared } from './Shared';

class _Settings {
	constructor() {
		this.enableByDefault = false;
		this.settings = {};
		this.fullSettings = {};

		this.defaultValues = {
			glwc_checkMaxWishlists: false,
			glwc_maxWishlists: 500,
			es_g_sg: true,
			es_d_sg: true,
			es_c_sg: true,
			es_c_st: true,
			es_l_sg: true,
			es_l_st: true,
			es_t_st: true,
			tds_forums: {},
			tds_minutes: 10,
			ch_perLoad: 5,
			df_perLoad: 5,
			tf_perLoad: 5,
			gs_sent_sg: true,
			gs_received_sg: true,
			gs_giftDifference_sg: true,
			gs_valueDifference_sg: true,
			gs_lastGiveaway_sg: true,
			gs_users_sg: true,
			deleteOldBackups: false,
			deleteOldBackups_days: 90,
			sfi_icon: 'user',
			npth_previousRegex: 'back|last|less|prev|<|←',
			npth_nextRegex: 'forw|more|next|onwards?|►|>|→',
			permissionsDenied: [],
			egh_c_sg: true,
			cewgd_c_sg: true,
			cewgd_c_p_sg: true,
			cewgd_c_sl_sg: true,
			cewgd_c_t_sg: true,
			cewgd_c_l_sg: true,
			cewgd_c_w_sg: true,
			cewgd_e_sg: true,
			cewgd_e_p_sg: true,
			cewgd_e_sl_sg: true,
			cewgd_e_t_sg: true,
			cewgd_e_l_sg: true,
			cewgd_w_sg: true,
			cewgd_w_p_sg: true,
			cewgd_w_sl_sg: true,
			cewgd_w_t_sg: true,
			cewgd_w_l_sg: true,
			esgst_st: true,
			esgst_sgt: true,
			ge_extractOnward: false,
			ge_flushCache: false,
			ge_flushCacheHours: 24,
			ge_ignoreDiscussionComments: false,
			ge_ignoreGiveawayComments: false,
			cv_username: '%username%',
			cv_steamId: '%steamId%',
			cv_creator: '%creator%',
			cv_replyUser: '%replyUser%',
			cv_esgstFeature: '%esgst=(.+?)%',
			cgc_dateFormat: `M d, yy`,
			cgc_timeFormat: `H:mm`,
			cgc_index_0: 1,
			collapse_general: false,
			collapse_giveaways: false,
			collapse_discussions: false,
			collapse_trades: false,
			collapse_comments: false,
			collapse_users: false,
			collapse_groups: false,
			collapse_games: false,
			collapse_others: false,
			collapse_themes: false,
			collapse_element_ordering: false,
			collapse_steam_api_key: false,
			gc_e_color: '#a59d7c',
			gc_e_bColor: '#e0e0a8',
			gc_e_bgColor: '#e9e9ca',
			at_format: `MMM d, yyyy, H:mm:ss`,
			plt_format: `MMM d, yyyy, H:mm:ss`,
			vgb_index: 1,
			vgb_wonFormat: `([FCV] FCV / [RCV] RCV / [NCV] NCV / [NR] NR)`,
			vgb_sentFormat: `([FCV] FCV / [RCV] RCV / [NCV] NCV / [A] A / [NR] NR)`,
			ul_links: [
				{
					label: `https://cdn.steamtrades.com/img/favicon.ico`,
					url: `https://www.steamtrades.com/user/%steamid%`
				},
				{
					label: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/79/7967e1ee4973a92886fe737d90f0a0b20b6f94a1_full.jpg`,
					url: `https://www.backlog-assassins.net/users/+%steamid%`
				},
				{
					label: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/91/91b23515a62b46eaa46cedab5bbe8085aa11ce1d_full.jpg`,
					url: `https://www.playingappreciated.com/profile.php?u=%steamid%`
				},
				{
					label: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0a/0a603fdbfb5d1283132c6558390ef71c1f48fc51_full.jpg`,
					url: `https://touhou.justarchi.net/user/%steamid%/profile`
				},
				{
					label: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/1a/1ad341114c26138740b405595f9ecf140f6b647f_full.jpg`,
					url: `https://astats.astats.nl/astats/User_Info.php?steamID64=%steamid%`
				},
				{
					label: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/41/41d0a0ca20c6b460c10e03c6ff8ef23bc6bb7f9d_full.jpg`,
					url: `https://barter.vg/steam/%steamid%`
				},
				{
					label: 'SteamRep',
					url: `https://steamrep.com/profiles/%steamid%`
				}
			],
			cgb_b_bgColor: '#000000',
			cgb_p_bgColor: '#000000',
			cgb_io_bgColor: '#000000',
			cgb_rr_bgColor: '#000000',
			cgb_g_bgColor: '#000000',
			cgb_w_bgColor: '#000000',
			cgb_sgt_bgColor: '#000000',
			qgs_index: 0,
			lpv_barColor: '#609f60',
			lpv_projectedBarColor: `rgba(96, 159, 96, 0.5)`,
			lpv_barColorHover: '#6dac6d',
			lpv_projectedBarColorHover: `rgba(122, 185, 122, 0.5)`,
			lpv_barColorSelected: '#7ab97a',
			lpv_projectedBarColorSelected: `rgba(147, 210, 147, 0.5)`,
			pv_barColor: '#609f60',
			pv_barColorHover: '#6dac6d',
			pv_barColorSelected: '#7ab97a',
			giveawayLinks: ['entries', 'winners_count', 'comments'],
			giveawayLinks_gv: ['entries', 'winners_count', 'comments'],
			giveawayExtraPanel: ['ggl'],
			giveawayExtraPanel_gv: ['ggl'],
			giveawayHeading: ['gr', 'gb', 'gf', 'egh', 'name', 'points', 'copies', 'steam', 'screenshots-videos', 'search', 'hideGame', 'gt'],
			giveawayHeading_gv: ['gr', 'gb', 'gf', 'egh', 'name', 'points', 'copies', 'steam', 'screenshots-videos', 'search', 'hideGame', 'gt'],
			nrf_clearCache: false,
			dt_s_sg: true,
			gt_s_sg: true,
			gt_s_st: true,
			gpt_s_sg: true,
			gpt_s_st: true,
			ut_s_sg: true,
			ut_s_st: true,
			gc_si_sg: true,
			es_pages: 1,
			backupZip_sg: false,
			backupZip_st: false,
			gc_hltb_index_0: 0,
			gc_hltb_index_1: 0,
			gc_hltb_index_2: 0,
			gc_rt_sg: true,
			ugd_playtime: 0,
			ugd_achievements: 0,
			ct_o_sg: true,
			ct_o_st: true,
			ct_f_sg: true,
			ct_f_st: true,
			gf_m_b_sg: false,
			gf_m_a_sg: false,
			df_m_b_sg: false,
			df_m_a_sg: false,
			tf_m_b_st: false,
			tf_m_a_st: false,
			cf_m_b_sg: false,
			cf_m_a_sg: false,
			gf_presets: [],
			df_presets: [],
			tf_presets: [],
			gmf_presets: [],
			gpf_presets: [],
			cf_presets: [],
			chfl_key: 'ctrlKey + e',
			getSyncGameNames_sg: false,
			getSyncGameNames_st: false,
			sgDarkGrey_startTime: `00:00`,
			sgDarkGrey_endTime: `23:59`,
			sgv2Dark_startTime: `00:00`,
			sgv2Dark_endTime: `23:59`,
			steamGiftiesBlack_startTime: `00:00`,
			steamGiftiesBlack_endTime: `23:59`,
			steamGiftiesBlue_startTime: `00:00`,
			steamGiftiesBlue_endTime: `23:59`,
			steamTradiesBlackBlue_startTime: `00:00`,
			steamTradiesBlackBlue_endTime: `23:59`,
			customTheme_startTime: `00:00`,
			customTheme_endTime: `23:59`,
			mm_useRegExp: false,
			mm_enableGiveaways: false,
			mm_enableDiscussions: false,
			mm_enableUsers: false,
			mm_enableGames: false,
			cs_limitPages: false,
			cs_minPage: '',
			cs_maxPage: '',
			ge_sgt_limit: 1,
			filter_os: 0,
			filter_giveaways_exist_in_account: 0,
			filter_giveaways_missing_base_game: 0,
			filter_giveaways_level: 0,
			filter_giveaways_additional_games: 0,
			dismissedOptions: [],
			hr_g_format: '🏆',
			hr_w_format: `(#❤)`,
			hr_p_format: `(#P)`,
			ef_filters: '',
			gwc_h_width: '3px',
			gwr_h_width: '3px',
			chfl_giveaways_sg: [
				'createANewGiveaway',
				'communityWishlist',
				'viewCreated',
				'viewEntered',
				'viewWon',
				{
					color: 'grey',
					description: 'View your hidden games.',
					icon: 'fa-eye',
					id: 'hiddenGames',
					name: 'Hidden Games',
					url: '/account/settings/giveaways/filters'
				},
				{
					color: 'grey',
					description: 'Check if a game receives reduced CV.',
					icon: 'fa-calendar-minus-o',
					id: 'reducedCvGames',
					name: 'Reduced CV Games',
					url: '/bundle-games'
				},
				{id: `browseWishlistGiveaways`, name: 'Browse Wishlist Giveaways', url: `/giveaways/search?type=wishlist`},
				{id: `browseFollowedGiveaways`, name: 'Browse Followed Giveaways', url: `/giveaways/search?esgst=fgp`},
				{id: `browseRecommendedGiveaways`, name: 'Browse Recommended Giveaways', url: `/giveaways/search?type=recommended`},
				{id: `browseGroupGiveaways`, name: 'Browse Group Giveaways', url: `/giveaways/search?type=group`},
				{id: `browseNewGiveaways`, name: 'Browse New Giveaways', url: `/giveaways/search?type=new`}
			],
			chfl_discussions_sg: [
				'createANewDiscussion',
				'viewCreated',
				'viewBookmarked',
				{id: 'browseAddonsTools', name: 'Browse Add-ons / Tools', url: '/discussions/addons-tools'},
				{id: 'browseAnnouncements', name: 'Browse Announcements', url: '/discussions/announcements'},
				{id: 'browseBugs', name: 'Browse Bugs / Suggestions', url: '/discussions/bugs-suggestions'},
				{id: 'browseDeals', name: 'Browse Deals', url: '/discussions/deals'},
				{id: 'browseGameShowcase', name: 'Browse Game Showcase', url: '/discussions/game-showcase'},
				{id: 'browseGeneral', name: 'Browse General', url: '/discussions/general'},
				{id: 'browseGroupRecruitment', name: 'Browse Group Recruitment', url: '/discussions/group-recruitment'},
				{id: 'browseHardware', name: 'Browse Hardware', url: '/discussions/hardware'},
				{id: 'browseHelp', name: 'Browse Help', url: '/discussions/help'},
				{id: 'browseLet', name: 'Browse Let\'s Play Together', url: '/discussions/lets-play-together'},
				{id: 'browseMoviesTv', name: 'Browse Movies / TV', url: '/discussions/movies-tv'},
				{id: 'browseOff', name: 'Browse Off Topic', url: '/discussions/off-topic'},
				{id: 'browsePuzzles', name: 'Browse Puzzles / Events', url: '/discussions/puzzles-events'},
				{id: 'browseUncategorized', name: 'Browse Uncategorized', url: '/discussions/uncategorized'},
				{id: 'browseUserProjects', name: 'Browse User Projects', url: '/discussions/user-projects'},
				{id: 'browseWhitelistRecruitment', name: 'Browse Whitelist / Recruitment', url: '/discussions/whitelist-recruitment'},
			],
			chfl_support_sg: [
				'createANewTicket',
				{
					color: 'grey',
					description: "Check a user`s real CV.",
					icon: 'fa-dollar',
					id: 'realCv',
					name: 'Real CV',
					url: `https://www.sgtools.info/real-cv`
				},
				{
					color: 'red',
					description: 'Check if a user has not activated wins.',
					icon: 'fa-exchange',
					id: 'notActivatedWins',
					name: 'Not Activated Wins',
					url: `https://www.sgtools.info/activation`
				},
				{
					color: 'red',
					description: 'Check if a user has multiple wins.',
					icon: 'fa-clone',
					id: 'multipleWins',
					name: 'Multiple Wins',
					url: `https://www.sgtools.info/multiple-wins`
				},
				{
					color: 'grey',
					description: 'Check the last bundled games.',
					icon: 'fa-percent',
					id: 'lastBundled',
					name: 'Last Bundled',
					url: `https://www.sgtools.info/lastbundled`
				}
			],
			chfl_help_sg: [
				'commentFormatting',
				'faq',
				'guidelines',
				{
					color: 'grey',
					description: "View SteamGifts` change log.",
					icon: 'fa-file-text-o',
					id: 'changeLog',
					name: 'Change Log',
					url: '/discussion/e9zDo/'
				}
			],
			chfl_account_sg: [
				'syncWithSteam',
				'myStats',
				'myEntryHistory',
				'myCommentHistory',
				{color: 'blue', icon: 'fa-heart', id: 'whitelist', name: 'Whitelist', url: '/account/manage/whitelist'},
				{color: 'red', icon: 'fa-ban', id: 'blacklist', name: 'Blacklist', url: '/account/manage/blacklist'},
				{color: 'grey', icon: 'fa-folder', id: 'games', name: 'Games', url: '/account/steam/games'},
				{color: 'grey', icon: 'fa-user', id: 'groups', name: 'Groups', url: '/account/steam/groups'},
				{color: 'grey', icon: 'fa-star', id: 'wishlist', name: 'Wishlist', url: '/account/steam/wishlist'},
			],
			chfl_footer_sg: [
				'archive',
				'stats',
				'roles',
				'users',
				'steamGroup',
				'chat',
				'privacyPolicy',
				'cookiePolicy',
				'termsOfService',
				'advertise'
			],
			chfl_trades_st: [
				'newTrade',
				'myTrades'
			],
			chfl_account_st: [
				'reviews',
				'comments',
				'settings',
			],
			chfl_footer_st: [
				'guidelines',
				'commentFormatting',
				'privacyPolicy',
				'cookiePolicy',
				'termsOfService',
				'advertise'
			],
			cdr_days: 7,
			cdr_aDays: 7,
			addNoCvGames_sg: false,
			hgm_addOwned: false,
			hgm_addIgnored: false,
			hgm_addBanned: false,
			hgm_removeTextArea: false,
			hgm_removeOwned: false,
			hgm_removeWishlisted: false,
			hgm_removeFollowed: false,
			hgm_removeTagged: false,
			hgm_tags: [],
			hgm_removeBanned: false,
			giveawayColumns: ['ged', 'endTime', 'winners', 'startTime', 'touhou', 'inviteOnly', 'whitelist', 'group', 'regionRestricted', 'level'],
			giveawayPanel: ['ttec', 'gwc', 'gwr', 'gptw', 'gp', 'elgb', 'sgTools'],
			giveawayColumns_gv: ['sgTools', 'ged', 'time', 'touhou', 'inviteOnly', 'whitelist', 'group', 'regionRestricted', 'level'],
			giveawayPanel_gv: ['ttec', 'gwc', 'gwr', 'gptw', 'gp', 'elgb'],
			enableByDefault_sg: false,
			enableByDefault_st: false,
			cf_m_sg: true,
			collapseSections_sg: false,
			collapseSections_st: false,
			df_m_sg: true,
			elgb_d_sg: true,
			gb_ue_sg: true,
			gc_g_s_sg: false,
			ge_o_sg: false,
			gf_m_sg: true,
			gwc_a_b_sg: false,
			gwr_a_b_sg: false,
			hpg_sg: false,
			pm_a: false,
			radb_sg: true,
			showChangelog_sg: true,
			showChangelog_st: true,
			vai_i_sg: false,
			avatar: '',
			steamId: '',
			steamApiKey: '',
			username_sg: '',
			username_st: '',
			registrationDate_sg: 0,
			adots_index: 0,
			ags_type: '',
			ags_maxDate: '',
			ags_minDate: '',
			ags_maxScore: '',
			ags_minScore: '',
			ags_maxLevel: '',
			ags_minLevel: '',
			ags_maxEntries: '',
			ags_minEntries: '',
			ags_maxCopies: '',
			ags_minCopies: '',
			ags_maxPoints: '',
			ags_minPoints: '',
			ags_regionRestricted: false,
			ags_dlc: false,
			ags_app: false,
			ags_sub: false,
			ap_index: 0,
			plt_index: 0,
			as_searchAppId: false,
			autoBackup_days: 1,
			autoBackup_index: 0,
			autoSyncGroups: 0,
			autoSyncWhitelist: 0,
			autoSyncBlacklist: 0,
			autoSyncSteamFriends: 0,
			autoSyncHiddenGames: 0,
			autoSyncGames: 0,
			autoSyncFollowedGames: 0,
			autoSyncWonGames: 0,
			autoSyncReducedCvGames: 0,
			autoSyncNoCvGames: 0,
			autoSyncHltbTimes: 0,
			autoSyncDelistedGames: 0,
			autoSyncGiveaways: 0,
			autoSyncWonGiveaways: 0,
			calculateDelete: true,
			calculateExport: true,
			calculateImport: true,
			cf_enable: true,
			cf_preset: null,
			cfh_pasteFormatting: true,
			cfh_img_choice: 1,
			cfh_img_remember: false,
			cleanDiscussions: true,
			cleanEntries: true,
			cleanGiveaways: true,
			cleanSgCommentHistory: true,
			cleanStCommentHistory: true,
			cleanTickets: true,
			cleanTrades: true,
			cleanDuplicates: true,
			cleanDiscussions_days: 30,
			cleanEntries_days: 30,
			cleanGiveaways_days: 30,
			cleanSgCommentHistory_days: 30,
			cleanStCommentHistory_days: 30,
			cleanTickets_days: 30,
			cleanTrades_days: 30,
			df_enable: true,
			df_enableCreated: false,
			df_preset: null,
			df_presetCreated: null,
			tf_enable: true,
			tf_enableCreated: false,
			tf_preset: null,
			tf_presetCreated: null,
			gmf_enable: true,
			gmf_preset: null,
			gpf_enable: true,
			gpf_preset: null,
			ds_auto: false,
			ds_option: 'sortIndex_asc',
			elgb_filters: `.|(bestof|(g(ood)?)?)(l(uck)?)?(h(ave)?)?(f(un)?)?|enjoy|(h(umble)?)?(b(undle)?)?(g(ift)?)?(l(ink)?)?`,
			exportBackup: true,
			exportBackupIndex: 0,
			gas_auto: false,
			gas_option: 'sortIndex_asc',
			gas_autoWishlist: false,
			gas_optionWishlist: 'sortIndex_asc',
			gas_autoRecommended: false,
			gas_optionRecommended: 'sortIndex_asc',
			gas_autoGroup: false,
			gas_optionGroup: 'sortIndex_asc',
			gas_autoNew: false,
			gas_optionNew: 'sortIndex_asc',
			gas_autoEntered: false,
			gas_optionEntered: 'sortIndex_asc',
			gas_autoUser: false,
			gas_optionUser: 'sortIndex_asc',
			gas_autoGroups: false,
			gas_optionGroups: 'sortIndex_asc',
			gas_autoPopup: false,
			gas_optionPopup: 'sortIndex_asc',
			gb_hours: 1,
			gc_categories: ['gc_gi', 'gc_r', 'gc_hltb', 'gc_ocv', 'gc_fcv', 'gc_rcv', 'gc_ncv', 'gc_h', 'gc_i', 'gc_o', 'gc_w', 'gc_f', 'gc_pw', 'gc_a', 'gc_bd', 'gc_bvg', 'gc_sp', 'gc_mp', 'gc_sc', 'gc_tc', 'gc_l', 'gc_m', 'gc_ea', 'gc_lg', 'gc_rm', 'gc_dlc', 'gc_p', 'gc_rd', 'gc_g'],
			gc_categories_gv: ['gc_gi', 'gc_r', 'gc_hltb', 'gc_ocv', 'gc_fcv', 'gc_rcv', 'gc_ncv', 'gc_h', 'gc_i', 'gc_o', 'gc_w', 'gc_f', 'gc_pw', 'gc_a', 'gc_bd', 'gc_bvg', 'gc_sp', 'gc_mp', 'gc_sc', 'gc_tc', 'gc_l', 'gc_m', 'gc_ea', 'gc_lg', 'gc_rm', 'gc_dlc', 'gc_p', 'gc_rd', 'gc_g'],
			gc_o_altAccounts: [],
			gc_g_colors: [],
			gc_g_filters: '',
			gc_r_colors: [
				{bgColor: '#a34c25', color: '#ffffff', icon: 'thumbs-down', lower: 0, upper: 39},
				{bgColor: '#b9a074', color: '#ffffff', icon: 'minus-circle', lower: 40, upper: 69},
				{bgColor: '#66c0f4', color: '#ffffff', icon: 'thumbs-up', lower: 70, upper: 100}
			],
			gc_ocvIcon: 'history',
			gc_fcvIcon: 'calendar',
			gc_rcvIcon: 'calendar-minus-o',
			gc_ncvIcon: 'calendar-times-o',
			gc_hIcon: 'eye-slash',
			gc_iIcon: 'ban',
			gc_oIcon: 'folder',
			gc_wIcon: 'heart',
			gc_fIcon: 'plus',
			gc_pwIcon: 'gift',
			gc_aIcon: 'trophy',
			gc_bdIcon: 'times',
			gc_bvgIcon: 'retweet',
			gc_spIcon: 'user',
			gc_mpIcon: 'users',
			gc_scIcon: 'cloud',
			gc_tcIcon: 'clone',
			gc_lIcon: 'linux',
			gc_mIcon: 'apple',
			gc_eaIcon: 'unlock',
			gc_lgIcon: 'spinner',
			gc_rmIcon: 'trash',
			gc_dlcIcon: 'download',
			gc_pIcon: 'suitcase',
			gc_rdIcon: 'clock-o',
			gc_ocvLabel: 'Was ',
			gc_fcvLabel: 'Full CV',
			gc_rcvLabel: 'Reduced CV',
			gc_ncvLabel: 'No CV',
			gc_hLabel: 'Hidden',
			gc_iLabel: 'Ignored',
			gc_oLabel: 'Owned',
			gc_wLabel: 'Wishlisted',
			gc_fLabel: 'Followed',
			gc_pwLabel: 'Previously Won',
			gc_aLabel: 'Achievements',
			gc_bdLabel: 'Banned',
			gc_bvgLabel: 'Barter.vg',
			gc_spLabel: 'Singleplayer',
			gc_mpLabel: 'Multiplayer',
			gc_scLabel: 'Steam Cloud',
			gc_tcLabel: 'Trading Cards',
			gc_lLabel: 'Linux',
			gc_mLabel: 'Mac',
			gc_eaLabel: 'Early Access',
			gc_lgLabel: 'Learning',
			gc_rmLabel: 'Removed',
			gc_dlcLabel: 'DLC',
			gc_pLabel: 'Package',
			gc_rdLabel: `Mon DD, YYYY`,
			gc_h_color: '#ffffff',
			gc_hltb_color: '#ffffff',
			gc_gi_color: '#ffffff',
			gc_ocv_fcv_color: '#ffffff',
			gc_ocv_rcv_color: '#ffffff',
			gc_fcv_color: '#ffffff',
			gc_rcv_color: '#ffffff',
			gc_ncv_color: '#ffffff',
			gc_w_color: '#ffffff',
			gc_f_color: '#ffffff',
			gc_o_color: '#ffffff',
			gc_pw_color: '#ffffff',
			gc_i_color: '#ffffff',
			gc_lg_color: '#ffffff',
			gc_rm_color: '#ffffff',
			gc_ea_color: '#ffffff',
			gc_tc_color: '#ffffff',
			gc_a_color: '#ffffff',
			gc_bd_color: '#ffffff',
			gc_bvg_color: '#ffffff',
			gc_sp_color: '#ffffff',
			gc_mp_color: '#ffffff',
			gc_sc_color: '#ffffff',
			gc_l_color: '#ffffff',
			gc_m_color: '#ffffff',
			gc_dlc_color: '#ffffff',
			gc_p_color: '#ffffff',
			gc_rd_color: '#ffffff',
			gc_g_color: '#ffffff',
			gc_h_bgColor: '#e74c3c',
			gc_hltb_bgColor: '#328ed6',
			gc_gi_bgColor: '#555555',
			gc_ocv_fcv_bgColor: '#641e16',
			gc_ocv_rcv_bgColor: '#641e16',
			gc_fcv_bgColor: '#641e16',
			gc_rcv_bgColor: '#641e16',
			gc_ncv_bgColor: '#641e16',
			gc_o_bgColor: '#16a085',
			gc_o_t_bgColor: `rgba(22, 160, 133, 0.2)`,
			gc_o_a_t_bgColor: `rgba(100, 30, 22, 0.2)`,
			gc_w_bgColor: '#3498db',
			gc_w_t_bgColor: `rgba(52, 152, 219, 0.2)`,
			gc_f_bgColor: '#2084C7',
			gc_pw_bgColor: '#16a085',
			gc_i_bgColor: '#e74c3c',
			gc_i_t_bgColor: `rgba(231, 76, 60, 0.2)`,
			gc_lg_bgColor: '#555555',
			gc_rm_bgColor: '#e74c3c',
			gc_ea_bgColor: '#3498db',
			gc_tc_bgColor: '#2ecc71',
			gc_a_bgColor: '#145a32',
			gc_bd_bgColor: '#e74c3c',
			gc_bvg_bgColor: '#555555',
			gc_sp_bgColor: '#5eb2a1',
			gc_mp_bgColor: '#0e6251',
			gc_sc_bgColor: '#154360',
			gc_l_bgColor: '#f39c12',
			gc_m_bgColor: '#d35400',
			gc_dlc_bgColor: '#8e44ad',
			gc_p_bgColor: '#8e44ad',
			gc_p_t_bgColor: `rgba(142, 68, 173, 0.2)`,
			gc_rd_bgColor: '#7f8c8d',
			gc_g_bgColor: '#7f8c8d',
			gcl_index: 0,
			ged: true,
			gf_enable: true,
			gf_enableWishlist: true,
			gf_enableRecommended: true,
			gf_enableNew: true,
			gf_enableGroup: true,
			gf_enableCreated: true,
			gf_enableEntered: true,
			gf_enableWon: true,
			gf_enableGroups: true,
			gf_enableUser: true,
			gf_enableGb: true,
			gf_enableGe: true,
			gf_enableGed: true,
			cf_enableElgb: true,
			gf_preset: null,
			gf_presetWishlist: null,
			gf_presetRecommended: null,
			gf_presetNew: null,
			gf_presetGroup: null,
			gf_presetCreated: null,
			gf_presetEntered: null,
			gf_presetWon: null,
			gf_presetGroups: null,
			gf_presetUser: null,
			gf_presetGb: null,
			gf_presetGe: null,
			gf_presetGed: null,
			cf_presetElgb: null,
			ggl_index: 0,
			dt_colors: {},
			gpt_colors: {},
			gt_colors: {},
			gts_preciseStart: false,
			gts_preciseEnd: false,
			gts_preciseStartDate: false,
			gts_preciseEndDate: false,
			gv_spacing: 0,
			gch_colors: [],
			glh_colors: [],
			gwc_colors: [],
			gwr_colors: [],
			gptw_colors: [],
			geth_colors: [],
			hr_minutes: 1,
			hr_w_hours: 24,
			lastBackup: 0,
			lastSyncGroups: 0,
			lastSyncWhitelist: 0,
			lastSyncBlacklist: 0,
			lastSyncSteamFriends: 0,
			lastSyncHiddenGames: 0,
			lastSyncGames: 0,
			lastSyncFollowedGames: 0,
			lastSyncWonGames: 0,
			lastSyncReducedCvGames: 0,
			lastSyncNoCvGames: 0,
			lastSyncHltbTimes: 0,
			lastSyncDelistedGames: 0,
			lastSyncGiveaways: 0,
			lastSyncWonGiveaways: 0,
			leftMainPageHeadingIds: ['wbsDesc', 'wbsAsc', 'wbm', 'wbc', 'ust', 'usc', 'ugs', 'uf_s_s', 'tf_s_s', 'tf', 'tb', 'sks', 'rbp', 'namwc', 'mpp', 'hgm', 'gv', 'gts', 'glwc', 'gf_s_s', 'gf', 'ge', 'gas', 'ds', 'df_s_s', 'df', 'ctUnread', 'ctRead', 'ctGo', 'cs', 'cf', 'cec', 'as', 'aic'],
			leftButtonIds: [],
			mgc_createTrain: true,
			mgc_bumpLast: true,
			mgc_groupKeys: false,
			mgc_groupAllKeys: false,
			mgc_reversePosition: false,
			mgc_removeLinks: true,
			namwc_checkNotActivated: false,
			namwc_checkMultiple: false,
			npth_previousKey: 'ArrowLeft',
			npth_nextKey: 'ArrowRight',
			nrf_searchMultiple: false,
			rightMainPageHeadingIds: ['esResume', 'esPause', 'esContinuous', 'esNext', 'esRefresh', 'esRefreshAll', 'stbb', 'sttb', 'mm'],
			rightButtonIds: [],
			sal_index: 2,
			sk_closePopups: 'escape',
			sk_searchBox: 'ctrlKey + q',
			sk_firstPage: 'ctrlKey + arrowup',
			sk_previousPage: 'ctrlKey + arrowleft',
			sk_nextPage: 'ctrlKey + arrowright',
			sk_lastPage: 'ctrlKey + arrowdown',
			sk_toggleFilters: 'altKey + q',
			sk_hideGame: 'altKey + g',
			sk_hideGiveaway: 'altKey + h',
			sk_giveawayEntry: 'ctrlKey + enter',
			sk_creator: 'altKey + c',
			sk_replyBox: 'ctrlKey +  ',
			sk_replyUser: 'altKey + u',
			sk_submitReply: 'ctrlKey + enter',
			sks_exportKeys: false,
			sks_searchCurrent: false,
			sks_limitDate: false,
			sks_limitPages: false,
			sks_minDate: '',
			sks_maxDate: '',
			sks_minPage: '',
			sks_maxPage: '',
			stbb_index: 0,
			sttb_index: 0,
			syncGroups: false,
			syncWhitelist: false,
			syncBlacklist: false,
			syncSteamFriends: false,
			syncHiddenGames: false,
			syncGames: false,
			syncFollowedGames: false,
			syncWonGames: false,
			syncReducedCvGames: false,
			syncNoCvGames: false,
			syncHltbTimes: false,
			syncDelistedGames: false,
			syncGiveaways: false,
			syncWonGiveaways: false,
			ugd_getPlaytime: true,
			ugd_getAchievements: false,
			ugd_clearCache: false,
			ugs_checkRules: false,
			ugs_checkWhitelist: false,
			ugs_checkBlacklist: false,
			ugs_checkMember: false,
			ugs_checkDifference: false,
			ugs_difference: 0,
			ut_colors: {},
			wbc_hb_sg: false,
			usc_checkSingle: false,
			usc_checkAll: false,
			usc_checkPages: false,
			usc_minPage: '',
			usc_maxPage: '',
			usc_checkSelected: false,
			wbc_checkSingle: false,
			wbc_checkBlacklist: false,
			wbc_checkAll: false,
			wbc_checkPages: false,
			wbc_minPage: '',
			wbc_maxPage: '',
			wbc_returnWhitelists: false,
			wbc_returnBlacklists: false,
			wbc_checkSelected: false,
			wbc_checkFromList: false,
			wbc_userList: [],
			wbc_pages: 0,
			wbc_skipUsers: false,
			wbm_clearTags: false,
			wbm_useCache: false,
			wbm_exportSteamIds: false,
			wbm_tags: [],
			wbc_checkNew: false,
			wbc_clearCache: false,
			wbh_w_color: '#ffffff',
			wbh_w_bgColor: '#228b22',
			wbh_b_color: '#ffffff',
			wbh_b_bgColor: '#ff4500',
		};

		this.oldValues = {
			df_puzzles_sg: 'df_puzzlesEvents_sg',
			gc_o_a_sg: () => this.settings.gc_o_altAccounts && this.settings.gc_o_altAccounts.length > 0 ? 1 : 0,
			idb_sg: 'dh_sg',
			idb_t_sg: 'dh_t_sg',
			cl_gc_index: () => (this.settings.gcl_index || 0) + 1,
			cl_gi_index: () => (this.settings.ap_index || 0) + 1,
			cl_ui_index: () => (this.settings.ap_index || 0) + 1,
			cl_sg: () => this.settings.ap_sg || this.settings.gcl_sg || this.settings.ggl_sg,
			cl_gc_sg: 'gcl_sg',
			cl_gi_sg: 'ggl_sg',
			cl_ui_sg: 'ap_sg',
			gs_type_sg: 'gs_t_sg',
			uf_gp_sg: 'uf_p_sg',
			uf_dp_sg: 'uf_p_sg',
			makeSectionsCollapsible_sg: 'makeSecionsCollapsible_sg',
			makeSectionsCollapsible_st: 'makeSecionsCollapsible_st',
			collapse_general: 'collapseSections_sg',
			collapse_giveaways: 'collapseSections_sg',
			collapse_discussions: 'collapseSections_sg',
			collapse_trades: 'collapseSections_sg',
			collapse_comments: 'collapseSections_sg',
			collapse_users: 'collapseSections_sg',
			collapse_groups: 'collapseSections_sg',
			collapse_games: 'collapseSections_sg',
			collapse_others: 'collapseSections_sg',
			collapse_themes: 'collapseSections_sg',
			collapse_element_ordering: 'collapseSections_sg',
			collapse_steam_api_key: 'collapseSections_sg',
			hgm_sg: 'hgr_sg',
			hgm_removeOwned: 'hgr_removeOwned',
			hgm_removeWishlisted: 'hgr_removeWishlisted',
			mm_useRegExp: 'gm_useRegExp',
			mm_enableGiveaways: 'gm_enable',
			mm_enableDiscussions: 'gm_enable',
			mm_enableUsers: 'gm_enable',
			mm_enableGames: 'gm_enable',
			pl_sg: 'wbl_sg',
			pl_w_sg: 'wbl_sg',
			pl_b_sg: 'wbl_sg',
			gdttt_vg_sg: 'gdttt_v_sg',
			gdttt_vd_sg: 'gdttt_v_sg',
			gdttt_vt_sg: 'gdttt_v_sg',
			gdttt_vts_st: 'gdttt_v_st',
			wbc_hb_sg: 'wbc_b_sg',
			wbc_checkBlacklist: 'wbc_checkWhitelist',
		};
	}

	init() {
		const settings = Shared.esgst.settings;

		const enableByDefaultSetting = settings[`enableByDefault_${Shared.esgst.name}`];
		this.enableByDefault = !!(typeof enableByDefaultSetting === 'object' ? enableByDefaultSetting.enabled : enableByDefaultSetting);

		for (const key of Object.keys(settings)) {
			const match = key.match(/(.+?)_(sg|st|sgt)$/);

			if (match) {
				if (match[2] === Shared.esgst.name) {
					this.settings[key] = this.settings[match[1]] = settings[key];
				}
			} else {
				this.settings[key] = settings[key];
			}
		}

		for (const key of Object.keys(this.oldValues).concat(Object.keys(this.defaultValues))) {
			const localKey = key.replace(new RegExp(`(.+?)_${Shared.esgst.name}$`), '$1');

			if (!Utils.isSet(this.settings[localKey])) {
				this.settings[key] = this.settings[localKey] = this.getSetting(key);
			}
		}

		for (const id of Object.keys(Shared.esgst.featuresById)) {
			const feature = Shared.esgst.featuresById[id];

			Shared.common.dismissFeature(feature, id);

			if (feature.sg) {
				const result = this.getFeatureSetting(feature, id, 'sg');
				this.settings[`${id}_sg`] = result.current;
				this.fullSettings[`${id}_sg`] = result.full;
			}

			if (feature.st) {
				const result = this.getFeatureSetting(feature, id, 'st');
				this.settings[`${id}_st`] = result.current;
				this.fullSettings[`${id}_st`] = result.full;
			}

			if (feature.sgtools) {
				const result = this.getFeatureSetting(feature, id, 'sgtools');
				this.settings[`${id}_sgtools`] = result.current;
				this.fullSettings[`${id}_sgtools`] = result.full;
			}

			this.settings[id] = this.settings[`${id}_${Shared.esgst.name}`];
			this.fullSettings[id] = this.fullSettings[`${id}_${Shared.esgst.name}`];
		}
	}

	set(key, value) {
		this.settings[key] = value;
	}

	get(key) {
		return this.settings[key];
	}

	setFull(key, value) {
		this.fullSettings[key] = value;
	}

	getFull(key) {
		return this.fullSettings[key];
	}

	getSetting(id) {
		let value = Shared.esgst.settings[id];

		if (typeof value === 'undefined') {
			const oldId = this.oldValues[id];

			if (typeof oldId === 'function') {
				value = oldId();
			} else if (typeof oldId !== 'undefined') {
				value = Shared.esgst.settings[oldId];
			}

			if (typeof value === 'undefined') {
				let defaultValue = this.defaultValues[id];

				if (typeof defaultValue === 'undefined') {
					defaultValue = this.enableByDefault || 0;
				}

				value = defaultValue;
			} else if (id.match(/^(wbc_checkBlacklist|wbc_hb_sg)$/)) {
				value = !value;
			}
		}

		return value;
	}

	getFeaturePath(feature, id, namespace) {
		if (!feature) {
			feature = Shared.esgst.featuresById[id];
		}
		const key = `${id}_${namespace}`;
		let setting = Shared.esgst.settings[key];
		if (typeof setting === 'undefined' || !setting.include || !Array.isArray(setting.include)) {
			setting = {
				enabled: this.getSetting(key) ? 1 : 0,
				include: [],
				exclude: [],
				new: typeof setting === 'undefined'
			};
			if (feature[namespace].include) {
				setting.include = feature[namespace].include;
				if (feature[namespace].exclude) {
					setting.exclude = feature[namespace].exclude;
				}
			} else {
				setting.include = [{ enabled: setting.enabled, pattern: '.*' }];
			}
			if (setting.new && setting.enabled) {
				setting.include[0].enabled = 1;
			}
		}
		return setting;
	}

	getFeatureSetting(feature, id, namespace, path) {
		let setting = null;
		let value = false;
		if (feature[namespace]) {
			setting = this.getFeaturePath(feature, id, namespace);
			if (setting.enabled) {
				if (!path) {
					path = `${window.location.pathname}${window.location.search}`;
				}
				let i = setting.include.length - 1;
				while (i > -1 && (!setting.include[i].enabled || !path.match(new RegExp(setting.include[i].pattern)))) i--;
				if (i > -1) {
					value = setting.include[i] || true;
				}
				i = setting.exclude.length - 1;
				while (i > -1 && (!setting.exclude[i].enabled || !path.match(new RegExp(setting.exclude[i].pattern)))) i--;
				if (i > -1) {
					value = false;
				}
			}
		}
		return {
			full: setting,
			current: value
		};
	}
}

const Settings = new _Settings();

export { Settings };