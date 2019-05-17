import { Parsedown } from '../lib/parsedown';
import { modules } from '../modules';
import { shared } from './Shared';

class Esgst {
  constructor() {
    this.es_loadNext = undefined;
    this.es_refresh = undefined;
    this.es_refreshAll = undefined;
    this.gpf = undefined;
    this.es = undefined;
    this.mgc_createTrainSwitch = undefined;
    this.mgc_removeLinksSwitch = undefined;
    this.gas = undefined;
    this.hr = undefined;
    this.ged_addIcons = undefined;
    this.cf = undefined;
    this.cfh = undefined;
    this.qiv = undefined;
    this.mm_enable = undefined;
    this.mm_disable = undefined;
    this.tf = undefined;
    this.df = undefined;
    this.gf = undefined;
    this.wbcButton = undefined;
    this.minimizePanel = undefined;
    this.onBeforeCommentSubmit = undefined;
    this.guideSteps = undefined;
    this.leftMainPageHeadingButtons = undefined;
    this.rightMainPageHeadingButtons = undefined;

    this.cvLevels = [0, 0.01, 25, 50, 100, 250, 500, 1000, 2000, 3000, 5000];

    this.currentPaths = undefined;
    this.settingsChanged = undefined;
    this.winners = undefined;
    this.emojis = undefined;
    this.uscButton = undefined;
    this.isSyncing = undefined;
    this.giveawayExtraPanel = undefined;
    this.giveawayExtraPanel_gv = undefined;
    this.mmSelectionStart = undefined;
    this.lpvStyleArray = undefined;
    this.pvStyleArray = undefined;
    this.onLevelContainerUpdated = undefined;
    this.wonButton = undefined;
    this.currentPage = undefined;
    this.itemsPerPage = undefined;
    this.giveawaysDropdown = undefined;
    this.helpDropdown = undefined;
    this.supportDropdown = undefined;
    this.delistedGames = undefined;
    this.discussionsDropdown = undefined;
    this.accountDropdown = undefined;
    this.featuresById = undefined;

    this.gc_queue = [];
    this.gc_queue_index = 0;
    this.is_gc_running_queue = false;

    this.settingsUrl = `https://www.steamgifts.com/account/settings/profile?esgst=settings`;
    this.syncUrl = `https://www.steamgifts.com/account/settings/profile?esgst=sync`;
    this.backupUrl = `https://www.steamgifts.com/account/settings/profile?esgst=backup`;
    this.restoreUrl = `https://www.steamgifts.com/account/settings/profile?esgst=restore`;
    this.deleteUrl = `https://www.steamgifts.com/account/settings/profile?esgst=delete`;
    this.cleanUrl = `https://www.steamgifts.com/account/settings/profile?esgst=clean`;
    this.dataManagementUrl = `https://www.steamgifts.com/account/settings/profile?esgst=data-management`;

    this.path = window.location.pathname.replace(/\/search/, ``);
    
    this.customPages = {};
    
    this.sidebarGroups = [];

    this.paths = {
      sg: [
        { name: `Everywhere`, pattern: `.*` },
        { name: `Giveaways`, pattern: `^/($|giveaways)` },
        { name: `Browse Giveaways`, pattern: `^/($|giveaways($|/search))` },
        { name: `Browse Giveaways - All`, pattern: `^/($|giveaways($|/search\\?(?!type)))` },
        { name: `Browse Giveaways - Wishlist`, pattern: `^/giveaways/search\\?type=wishlist` },
        { name: `Browse Giveaways - Recommended`, pattern: `^/giveaways/search\\?type=recommended` },
        { name: `Browse Giveaways - Group`, pattern: `^/giveaways/search\\?type=group` },
        { name: `Browse Giveaways - New`, pattern: `^/giveaways/search\\?type=new` },
        { name: `Community Wishlist`, pattern: `^/giveaways/wishlist` },
        { name: `My Giveaways - New`, pattern: `^/giveaways/new` },
        { name: `My Giveaways - Created`, pattern: `^/giveaways/created` },
        { name: `My Giveaways - Entered`, pattern: `^/giveaways/entered` },
        { name: `My Giveaways - Won`, pattern: `^/giveaways/won` },
        { name: `Archive`, pattern: `^/archive` },
        { name: `Archive - All`, pattern: `^/archive($|/search)` },
        { name: `Archive - Coming Soon`, pattern: `^/archive/coming-soon` },
        { name: `Archive - Open`, pattern: `^/archive/open` },
        { name: `Archive - Closed`, pattern: `^/archive/closed` },
        { name: `Archive - Deleted`, pattern: `^/archive/deleted` },
        { name: `Bundle Games`, pattern: `^/bundle-games` },
        { name: `Giveaway`, pattern: `^/giveaway/` },
        { name: `Giveaway - Comments`, pattern: `^/giveaway/.+?/[^/]+($|/search)` },
        { name: `Giveaway - Entries`, pattern: `^/giveaway/.+?/[^/]+/entries` },
        { name: `Giveaway - Winners`, pattern: `^/giveaway/.+?/[^/]+/winners` },
        { name: `Giveaway - Groups`, pattern: `^/giveaway/.+?/[^/]+/groups` },
        { name: `Giveaway - Region Restrictions`, pattern: `^/giveaway/.{5}/[A-Za-z0-9-]+/region-restrictions` },
        { name: `Group`, pattern: `^/group/` },
        { name: `Group - Giveaways`, pattern: `^/group/.+?/[^/]+($|/search)` },
        { name: `Group - Users`, pattern: `^/group/.+?/[^/]+/users` },
        { name: `Group - Stats`, pattern: `^/group/.+?/[^/]+/stats` },
        { name: `Group - Wishlist`, pattern: `^/group/.+?/[^/]+/wishlist` },
        { name: `Discussions`, pattern: `^/discussions` },
        { name: `Discussions - All`, pattern: `^/discussions($|/search)` },
        { name: `Discussions - Announcements`, pattern: `^/discussions/announcements` },
        { name: `Discussions - Bugs / Suggestions`, pattern: `^/discussions/bugs-suggestions` },
        { name: `Discussions - Deals`, pattern: `^/discussions/deals` },
        { name: `Discussions - General`, pattern: `^/discussions/general` },
        { name: `Discussions - Group Recruitment`, pattern: `^/discussions/group-recruitment` },
        { name: `Discussions - Let's Play Together`, pattern: `^/discussions/lets-play-together` },
        { name: `Discussions - Off-Topic`, pattern: `^/discussions/off-topic` },
        { name: `Discussions - Puzzles`, pattern: `^/discussions/puzzles` },
        { name: `Discussions - Uncategorized`, pattern: `^/discussions/uncategorized` },
        { name: `My Discussions - New`, pattern: `^/discussions/new` },
        { name: `My Discussions - Edit`, pattern: `^/discussions/edit` },
        { name: `My Discussions - Created`, pattern: `^/discussions/created` },
        { name: `Discussion`, pattern: `^/discussion/` },
        { name: `Tickets`, pattern: `^/support/tickets` },
        { name: `Tickets - All`, pattern: `^/support/tickets($|/search)` },
        { name: `Tickets - Change Giveaway Game`, pattern: `^/support/tickets/change-giveaway-game` },
        { name: `Tickets - Delete Giveaway`, pattern: `^/support/tickets/delete-giveaway` },
        { name: `Tickets - Other`, pattern: `^/support/tickets/other` },
        { name: `Tickets - Request New Winner`, pattern: `^/support/tickets/request-new-winner` },
        { name: `Tickets - Unsuspend Request`, pattern: `^/support/tickets/unsuspend-request` },
        { name: `Tickets - User Report`, pattern: `^/support/tickets/user-report` },
        { name: `Ticket`, pattern: `^/support/ticket/` },
        { name: `User`, pattern: `^/user` },
        { name: `User - Giveaways - Sent`, pattern: `^/user($|/search)` },
        { name: `User - Giveaways - Won`, pattern: `^/user/giveaways/won` },
        { name: `Messages`, pattern: `^/messages` },
        { name: `Messages - All`, pattern: `^/messages($|/search)` },
        { name: `Messages - Giveaways`, pattern: `^/messages/giveaways` },
        { name: `Messages - Discussions`, pattern: `^/messages/discussions` },
        { name: `Messages - Tickets`, pattern: `^/messages/tickets` },
        { name: `Manage - Whitelist`, pattern: `^/account/manage/whitelist` },
        { name: `Manage - Blacklist`, pattern: `^/account/manage/blacklist` },
        { name: `Steam - Games`, pattern: `^/account/steam/games` },
        { name: `Steam - Groups`, pattern: `^/account/steam/groups` },
        { name: `Steam - Wishlist`, pattern: `^/account/steam/wishlist` },
        { name: `About - Brand Assets`, pattern: `^/about/brand-assets` },
        { name: `About - Comment Formatting`, pattern: `^/about/comment-formatting` },
        { name: `About - FAQ`, pattern: `^/about/faq` },
        { name: `About - Guidelines`, pattern: `^/about/guidelines` },
        { name: `Legal - Privacy Policy`, pattern: `^/legal/privacy-policy` },
        { name: `Legal - Cookie Policy`, pattern: `^/legal/cookie-policy` },
        { name: `Legal - Terms Of Service`, pattern: `^/legal/terms-of-service` },
        { name: `Account`, pattern: `^/account` },
        { name: `Settings - Profile`, pattern: `^/account/settings/profile` },
        { name: `Settings - Patreon`, pattern: `^/account/settings/patreon` },
        { name: `Settings - Giveaways`, pattern: `^/account/settings/giveaways` },
        { name: `Settings - Giveaways - Filters`, pattern: `^/account/settings/giveaways/filters` },
        { name: `Settings - Email Notifications`, pattern: `^/account/settings/email-notifications` },
        { name: `Settings - Referrals`, pattern: `^/account/settings/referrals` },
        { name: `Privacy - Delete Account`, pattern: `^/account/privacy/delete-account` },
        { name: `Stats - Personal - Community`, pattern: `^/stats/personal/community` },
        { name: `Stats - Personal - Steam`, pattern: `^/stats/personal/steam` },
        { name: `Stats - Community - Giveaways`, pattern: `^/stats/community/giveaways` },
        { name: `Stats - Community - Discussions`, pattern: `^/stats/community/discussions` },
        { name: `Stats - Community - Comments`, pattern: `^/stats/community/comments` },
        { name: `Stats - Community - Support`, pattern: `^/stats/community/support` },
        { name: `Stats - Community - Users`, pattern: `^/stats/community/users` },
        { name: `Stats - Steam - Games`, pattern: `^/stats/steam/games` },
        { name: `ESGST - Settings`, pattern: `^/account/settings/profile\\?esgst=settings` },
        { name: `ESGST - Sync`, pattern: `^/account/settings/profile\\?esgst=sync` },
        { name: `ESGST - Backup`, pattern: `^/account/settings/profile\\?esgst=backup` },
        { name: `ESGST - Restore`, pattern: `^/account/settings/profile\\?esgst=restore` },
        { name: `ESGST - Delete`, pattern: `^/account/settings/profile\\?esgst=delete` },
        { name: `ESGST - Clean`, pattern: `^/account/settings/profile\\?esgst=clean` },
        { name: `ESGST - Data Management`, pattern: `^/account/settings/profile\\?esgst=data-management` },
        { name: `ESGST - Archive Searcher`, pattern: `^/account/settings/profile\\?esgst=as` },
        { name: `ESGST - Comment / Entry Checker`, pattern: `^/account/settings/profile\\?esgst=cec` },
        { name: `ESGST - Giveaway Bookmarks`, pattern: `^/account/settings/profile\\?esgst=gb` },
        { name: `ESGST - Giveaway Encryptor / Decryptor`, pattern: `^/account/settings/profile\\?esgst=ged` },
        { name: `ESGST - Giveaway Extractor`, pattern: `^/account/settings/profile\\?esgst=ge` },
        { name: `ESGST - Group Library / Wishlist Checker`, pattern: `^/account/settings/profile\\?esgst=glwc` }
      ],
      st: [
        { name: `Everywhere`, pattern: `.*` },
        { name: `Trades`, pattern: `^/($|trades)` },
        { name: `Browse Trades`, pattern: `^/($|trades($|/search))` },
        { name: `My Trades - New`, pattern: `^/trades/new` },
        { name: `My Trades - Created`, pattern: `^/trades/search\\?user=%steamId%` },
        { name: `Trade`, pattern: `^/trade/` },
        { name: `Vote`, pattern: `^/vote/` },
        { name: `Messages`, pattern: `^/messages` },
        { name: `User`, pattern: `^/user` },
        { name: `Reviews`, pattern: `^/reviews` },
        { name: `Comments`, pattern: `^/comments` },
        { name: `Settings`, pattern: `^/settings` },
        { name: `About - Comment Formatting`, pattern: `^/about/comment-formatting` },
        { name: `About - Guidelines`, pattern: `^/about/guidelines` },
        { name: `Legal - Privacy Policy`, pattern: `^/legal/privacy-policy` },
        { name: `Legal - Cookie Policy`, pattern: `^/legal/cookie-policy` },
        { name: `Legal - Terms Of Service`, pattern: `^/legal/terms-of-service` }
      ],
      sgtools: [
        { name: `Everywhere`, pattern: `.*` }
      ]
    };
    this.formatDistanceLocale = {
      formatDistance: (token, count) => {
        switch (token) {
          case `xSeconds`:
            return `${count}s`;
          case `xMinutes`:
            return `${count}m`;
          case `xHours`:
            return `${count}h`;
          case `xDays`:
            return `${count}d`;
          case `xMonths`:
            return `${count}mo`;
          case `xYears`:
            return `${count}y`;
        }
      }
    };
    this.newGiveawayDateFormat = `MMM d, yyyy h:mm a`;
    this.triggerFunctions = {
      onLevelContainerUpdated: [],
      onBeforeCommentSubmit: []
    };

    for (const key in this.triggerFunctions) {
      if (!this.triggerFunctions.hasOwnProperty(key)) {
        return;
      }
      this[key] = this.triggerFunction.bind(this, key);
    }

    this.documentEvents = {
      click: null,
      keydown: null
    };

    this.windowEvents = {};

    /**
     * @property {string} level_min
     * @property {string} level_max
     * @property {string} entry_min
     * @property {string} entry_max
     * @property {string} copy_min
     * @property {string} copy_max
     * @property {string} point_min
     * @property {string} point_max
     * @property {string} release_date_min
     * @property {string} release_date_max
     * @property {string} region_restricted
     */
    this.parameters = {};

    this.defaultValues = {
      sfi_icon: `user`,
      npth_previousRegex: `back|last|less|prev|<|←`,
      npth_nextRegex: `forw|more|next|onwards|►|>|→`,
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
      cv_username: `%username%`,
      cv_steamId: `%steamId%`,
      cv_creator: `%creator%`,
      cv_replyUser: `%replyUser%`,
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
      gc_e_color: `#a59d7c`,
      gc_e_bColor: `#e0e0a8`,
      gc_e_bgColor: `#e9e9ca`,
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
          label: `SteamRep`,
          url: `https://steamrep.com/profiles/%steamid%`
        }
      ],
      cgb_b_bgColor: `#000000`,
      cgb_p_bgColor: `#000000`,
      cgb_io_bgColor: `#000000`,
      cgb_rr_bgColor: `#000000`,
      cgb_g_bgColor: `#000000`,
      cgb_w_bgColor: `#000000`,
      cgb_sgt_bgColor: `#000000`,
      qgs_index: 0,
      lpv_barColor: `#609f60`,
      lpv_projectedBarColor: `rgba(96, 159, 96, 0.5)`,
      lpv_barColorHover: `#6dac6d`,
      lpv_projectedBarColorHover: `rgba(122, 185, 122, 0.5)`,
      lpv_barColorSelected: `#7ab97a`,
      lpv_projectedBarColorSelected: `rgba(147, 210, 147, 0.5)`,
      pv_barColor: `#609f60`,
      pv_barColorHover: `#6dac6d`,
      pv_barColorSelected: `#7ab97a`,
      giveawayLinks: [`entries`, `winners_count`, `comments`],
      giveawayLinks_gv: [`entries`, `winners_count`, `comments`],
      giveawayExtraPanel: [`ggl`],
      giveawayExtraPanel_gv: [`ggl`],
      giveawayHeading: [`gr`, `gb`, `gf`, `egh`, `name`, `points`, `copies`, `steam`, `search`, `hideGame`, `gt`],
      giveawayHeading_gv: [`gr`, `gb`, `gf`, `egh`, `name`, `points`, `copies`, `steam`, `search`, `hideGame`, `gt`],
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
      gpf_presets: [],
      cf_presets: [],
      chfl_key: `ctrlKey + e`,
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
      cs_minPage: ``,
      cs_maxPage: ``,
      ge_sgt_limit: 1,
      filter_os: 0,
      filter_giveaways_exist_in_account: 0,
      filter_giveaways_missing_base_game: 0,
      filter_giveaways_level: 0,
      filter_giveaways_additional_games: 0,
      dismissedOptions: [],
      hr_g_format: `🏆`,
      hr_w_format: `(#❤)`,
      hr_p_format: `(#P)`,
      ef_filters: ``,
      gwc_h_width: `3px`,
      gwr_h_width: `3px`,
      chfl_giveaways_sg: [
        `new`,
        `wishlist`,
        `created`,
        `entered`,
        `won`,
        {
          color: `grey`,
          description: `View your hidden games.`,
          icon: `fa-eye`,
          id: `filters`,
          name: `Hidden Games`,
          url: `/account/settings/giveaways/filters`
        },
        {
          color: `grey`,
          description: `Check if a game receives reduced CV.`,
          icon: `fa-calendar-minus-o`,
          id: `bundle-games`,
          name: `Reduced CV Games`,
          url: `/bundle-games`
        },
        {id: `type=wishlist`, name: `Browse Wishlist Giveaways`, url: `/giveaways/search?type=wishlist`},
        {id: `type=recommended`, name: `Browse Recommended Giveaways`, url: `/giveaways/search?type=recommended`},
        {id: `type=group`, name: `Browse Group Giveaways`, url: `/giveaways/search?type=group`},
        {id: `type=new`, name: `Browse New Giveaways`, url: `/giveaways/search?type=new`}
      ],
      chfl_discussions_sg: [
        `new`,
        `created`,
        `dh`,
        {
          color: `grey`,
          description: `Help the community.`,
          icon: `fa-question-circle `,
          id: `categorize-discussions`,
          name: `Categorize Discussions`,
          url: `/tools/categorize-discussions`
        },
        {id: `announcements`, name: `Browse Announcements`, url: `/discussions/announcements`},
        {id: `bugs-suggestions`, name: `Browse Bugs / Suggestions`, url: `/discussions/bugs-suggestions`},
        {id: `deals`, name: `Browse Deals`, url: `/discussions/deals`},
        {id: `general`, name: `Browse General`, url: `/discussions/general`},
        {id: `group-recruitment`, name: `Browse Group Recruitment`, url: `/discussions/group-recruitment`},
        {id: `lets-play-together`, name: "Browse Let`s Play Together", url: `/discussions/lets-play-together`},
        {id: `off-topic`, name: `Browse Off-Topic`, url: `/discussions/off-topic`},
        {id: `puzzles`, name: `Browse Puzzles`, url: `/discussions/puzzles`},
        {id: `uncategorized`, name: `Browse Uncategorized`, url: `/discussions/uncategorized`}
      ],
      chfl_support_sg: [
        `new`,
        {
          color: `grey`,
          description: "Check a user`s real CV.",
          icon: `fa-dollar`,
          id: `real-cv`,
          name: `Real CV`,
          url: `https://www.sgtools.info/real-cv`
        },
        {
          color: `red`,
          description: `Check if a user has not activated wins.`,
          icon: `fa-exchange`,
          id: `activation`,
          name: `Not Activated Wins`,
          url: `https://www.sgtools.info/activation`
        },
        {
          color: `red`,
          description: `Check if a user has multiple wins.`,
          icon: `fa-clone`,
          id: `multiple-wins`,
          name: `Multiple Wins`,
          url: `https://www.sgtools.info/multiple-wins`
        },
        {
          color: `grey`,
          description: `Check the last bundled games.`,
          icon: `fa-percent`,
          id: `lastbundled`,
          name: `Last Bundled`,
          url: `https://www.sgtools.info/lastbundled`
        }
      ],
      chfl_help_sg: [
        `comment-formatting`,
        `faq`,
        `guidelines`,
        {
          color: `grey`,
          description: "View SteamGifts` change log.",
          icon: `fa-file-text-o`,
          id: `e9zDo`,
          name: `Change Log`,
          url: `/discussion/e9zDo/`
        }
      ],
      chfl_account_sg: [
        `profile`,
        `stats`,
        `et`,
        `ch`,
        {color: `blue`, icon: `fa-heart`, id: `whitelist`, name: `Whitelist`, url: `/account/manage/whitelist`},
        {color: `red`, icon: `fa-ban`, id: `blacklist`, name: `Blacklist`, url: `/account/manage/blacklist`},
        {color: `grey`, icon: `fa-folder`, id: `games`, name: `Games`, url: `/account/steam/games`},
        {color: `grey`, icon: `fa-user`, id: `groups`, name: `Groups`, url: `/account/steam/groups`},
        {color: `grey`, icon: `fa-star`, id: `wishlist`, name: `Wishlist`, url: `/account/steam/wishlist`},
      ],
      chfl_footer_sg: [
        `archive`,
        `stats`,
        `roles`,
        `users`,
        `steamgifts`,
        `103582791432125620`,
        `privacy-policy`,
        `terms-of-service`
      ],
      chfl_trades_st: [
        `new`,
        `user=[steamId]`
      ],
      chfl_account_st: [
        `user=[steamId]`
      ],
      chfl_footer_st: [
        `guidelines`,
        `comment-formatting`,
        `privacy-policy`,
        `terms-of-service`
      ],
      cdr_days: 7,
      addNoCvGames_sg: false,
      hgm_addOwned: false,
      hgm_addIgnored: false,
      hgm_addBanned: false,
      hgm_removeTextArea: false,
      hgm_removeOwned: false,
      hgm_removeWishlisted: false,
      hgm_removeBanned: false,
      giveawayColumns: [`ged`, `endTime`, `winners`, `startTime`, `touhou`, `inviteOnly`, `whitelist`, `group`, `regionRestricted`, `level`],
      giveawayPanel: [`ttec`, `gwc`, `gwr`, `gptw`, `gp`, `elgb`, `sgTools`],
      giveawayColumns_gv: [`sgTools`, `ged`, `time`, `touhou`, `inviteOnly`, `whitelist`, `group`, `regionRestricted`, `level`],
      giveawayPanel_gv: [`ttec`, `gwc`, `gwr`, `gptw`, `gp`, `elgb`],
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
      avatar: ``,
      steamId: ``,
      steamApiKey: ``,
      username_sg: ``,
      username_st: ``,
      adots_index: 0,
      ags_type: ``,
      ags_maxDate: ``,
      ags_minDate: ``,
      ags_maxScore: ``,
      ags_minScore: ``,
      ags_maxLevel: ``,
      ags_minLevel: ``,
      ags_maxEntries: ``,
      ags_minEntries: ``,
      ags_maxCopies: ``,
      ags_minCopies: ``,
      ags_maxPoints: ``,
      ags_minPoints: ``,
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
      gpf_enable: true,
      gpf_preset: null,
      ds_auto: false,
      ds_option: `sortIndex_asc`,
      elgb_filters: `.|(bestof|(g(ood)?)?)(l(uck)?)?(h(ave)?)?(f(un)?)?|enjoy|(h(umble)?)?(b(undle)?)?(g(ift)?)?(l(ink)?)?`,
      exportBackup: true,
      exportBackupIndex: 0,
      gas_auto: false,
      gas_option: `sortIndex_asc`,
      gas_autoWishlist: false,
      gas_optionWishlist: `sortIndex_asc`,
      gas_autoRecommended: false,
      gas_optionRecommended: `sortIndex_asc`,
      gas_autoGroup: false,
      gas_optionGroup: `sortIndex_asc`,
      gas_autoNew: false,
      gas_optionNew: `sortIndex_asc`,
      gas_autoEntered: false,
      gas_optionEntered: `sortIndex_asc`,
      gas_autoUser: false,
      gas_optionUser: `sortIndex_asc`,
      gas_autoGroups: false,
      gas_optionGroups: `sortIndex_asc`,
      gas_autoPopup: false,
      gas_optionPopup: `sortIndex_asc`,
      gb_hours: 1,
      gc_categories: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_ocv`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
      gc_categories_gv: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_ocv`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
      gc_o_altAccounts: [],
      gc_g_colors: [],
      gc_g_filters: ``,
      gc_r_colors: [
        {bgColor: `#a34c25`, color: `#ffffff`, icon: `thumbs-down`, lower: 0, upper: 39},
        {bgColor: `#b9a074`, color: `#ffffff`, icon: `minus-circle`, lower: 40, upper: 69},
        {bgColor: `#66c0f4`, color: `#ffffff`, icon: `thumbs-up`, lower: 70, upper: 100}
      ],
      gc_ocvIcon: `history`,
      gc_fcvIcon: `calendar`,
      gc_rcvIcon: `calendar-minus-o`,
      gc_ncvIcon: `calendar-times-o`,
      gc_hIcon: `eye-slash`,
      gc_iIcon: `ban`,
      gc_oIcon: `folder`,
      gc_wIcon: `heart`,
      gc_fIcon: `plus`,
      gc_pwIcon: `gift`,
      gc_aIcon: `trophy`,
      gc_bdIcon: `times`,
      gc_bvgIcon: `retweet`,
      gc_spIcon: `user`,
      gc_mpIcon: `users`,
      gc_scIcon: `cloud`,
      gc_tcIcon: `clone`,
      gc_lIcon: `linux`,
      gc_mIcon: `apple`,
      gc_eaIcon: `unlock`,
      gc_lgIcon: `spinner`,
      gc_rmIcon: `trash`,
      gc_dlcIcon: `download`,
      gc_pIcon: `suitcase`,
      gc_rdIcon: `clock-o`,
      gc_ocvLabel: `Was `,
      gc_fcvLabel: `Full CV`,
      gc_rcvLabel: `Reduced CV`,
      gc_ncvLabel: `No CV`,
      gc_hLabel: `Hidden`,
      gc_iLabel: `Ignored`,
      gc_oLabel: `Owned`,
      gc_wLabel: `Wishlisted`,
      gc_fLabel: `Followed`,
      gc_pwLabel: `Previously Won`,
      gc_aLabel: `Achievements`,
      gc_bdLabel: `Banned`,
      gc_bvgLabel: `Barter.vg`,
      gc_spLabel: `Singleplayer`,
      gc_mpLabel: `Multiplayer`,
      gc_scLabel: `Steam Cloud`,
      gc_tcLabel: `Trading Cards`,
      gc_lLabel: `Linux`,
      gc_mLabel: `Mac`,
      gc_eaLabel: `Early Access`,
      gc_lgLabel: `Learning`,
      gc_rmLabel: `Removed`,
      gc_dlcLabel: `DLC`,
      gc_pLabel: `Package`,
      gc_rdLabel: `Mon DD, YYYY`,
      gc_h_color: `#ffffff`,
      gc_hltb_color: `#ffffff`,
      gc_gi_color: `#ffffff`,
      gc_ocv_color: `#ffffff`,
      gc_fcv_color: `#ffffff`,
      gc_rcv_color: `#ffffff`,
      gc_ncv_color: `#ffffff`,
      gc_w_color: `#ffffff`,
      gc_f_color: `#ffffff`,
      gc_o_color: `#ffffff`,
      gc_pw_color: `#ffffff`,
      gc_i_color: `#ffffff`,
      gc_lg_color: `#ffffff`,
      gc_rm_color: `#ffffff`,
      gc_ea_color: `#ffffff`,
      gc_tc_color: `#ffffff`,
      gc_a_color: `#ffffff`,
      gc_bd_color: `#ffffff`,
      gc_bvg_color: `#ffffff`,
      gc_sp_color: `#ffffff`,
      gc_mp_color: `#ffffff`,
      gc_sc_color: `#ffffff`,
      gc_l_color: `#ffffff`,
      gc_m_color: `#ffffff`,
      gc_dlc_color: `#ffffff`,
      gc_p_color: `#ffffff`,
      gc_rd_color: `#ffffff`,
      gc_g_color: `#ffffff`,
      gc_h_bgColor: `#e74c3c`,
      gc_hltb_bgColor: `#328ed6`,
      gc_gi_bgColor: `#555555`,
      gc_ocv_bgColor: `#641e16`,
      gc_fcv_bgColor: `#641e16`,
      gc_rcv_bgColor: `#641e16`,
      gc_ncv_bgColor: `#641e16`,
      gc_o_bgColor: `#16a085`,
      gc_o_t_bgColor: `rgba(22, 160, 133, 0.2)`,
      gc_o_a_t_bgColor: `rgba(100, 30, 22, 0.2)`,
      gc_w_bgColor: `#3498db`,
      gc_w_t_bgColor: `rgba(52, 152, 219, 0.2)`,
      gc_f_bgColor: `#2084C7`,
      gc_pw_bgColor: `#16a085`,
      gc_i_bgColor: `#e74c3c`,
      gc_i_t_bgColor: `rgba(231, 76, 60, 0.2)`,
      gc_lg_bgColor: `#555555`,
      gc_rm_bgColor: `#e74c3c`,
      gc_ea_bgColor: `#3498db`,
      gc_tc_bgColor: `#2ecc71`,
      gc_a_bgColor: `#145a32`,
      gc_bd_bgColor: `#e74c3c`,
      gc_bvg_bgColor: `#555555`,
      gc_sp_bgColor: `#5eb2a1`,
      gc_mp_bgColor: `#0e6251`,
      gc_sc_bgColor: `#154360`,
      gc_l_bgColor: `#f39c12`,
      gc_m_bgColor: `#d35400`,
      gc_dlc_bgColor: `#8e44ad`,
      gc_p_bgColor: `#8e44ad`,
      gc_p_t_bgColor: `rgba(142, 68, 173, 0.2)`,
      gc_rd_bgColor: `#7f8c8d`,
      gc_g_bgColor: `#7f8c8d`,
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
      leftMainPageHeadingIds: [`wbsDesc`, `wbsAsc`, `wbm`, `wbc`, `ust`, `usc`, `ugs`, `uf_s_s`, `tf_s_s`, `tf`, `tb`, `sks`, `rbp`, `namwc`, `mpp`, `hgm`, `gv`, `gts`, `glwc`, `gf_s_s`, `gf`, `ge`, `gas`, `ds`, `df_s_s`, `df`, `ctUnread`, `ctRead`, `ctGo`, `cs`, `cf`, `cec`, `as`, `aic`],
      leftButtonIds: [],
      mgc_createTrain: true,
      mgc_bumpLast: true,
      mgc_groupKeys: false,
      mgc_groupAllKeys: false,
      mgc_reversePosition: false,
      mgc_removeLinks: true,
      namwc_checkNotActivated: false,
      namwc_checkMultiple: false,
      npth_previousKey: `ArrowLeft`,
      npth_nextKey: `ArrowRight`,
      nrf_searchMultiple: false,
      rightMainPageHeadingIds: [`esResume`, `esPause`, `esContinuous`, `esNext`, `esRefresh`, `esRefreshAll`, `stbb`, `sttb`, `mm`],
      rightButtonIds: [],
      sal_index: 2,
      sk_closePopups: `escape`,
      sk_searchBox: `ctrlKey + q`,
      sk_firstPage: `ctrlKey + arrowup`,
      sk_previousPage: `ctrlKey + arrowleft`,
      sk_nextPage: `ctrlKey + arrowright`,
      sk_lastPage: `ctrlKey + arrowdown`,
      sk_toggleFilters: `altKey + q`,
      sk_hideGame: `altKey + g`,
      sk_hideGiveaway: `altKey + h`,
      sk_giveawayEntry: `ctrlKey + enter`,
      sk_creator: `altKey + c`,
      sk_replyBox: `ctrlKey +  `,
      sk_replyUser: `altKey + u`,
      sk_submitReply: `ctrlKey + enter`,
      sks_exportKeys: false,
      sks_searchCurrent: false,
      sks_limitDate: false,
      sks_limitPages: false,
      sks_minDate: ``,
      sks_maxDate: ``,
      sks_minPage: ``,
      sks_maxPage: ``,
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
      usc_minPage: ``,
      usc_maxPage: ``,
      usc_checkSelected: false,
      wbc_checkSingle: false,
      wbc_checkBlacklist: false,
      wbc_checkAll: false,
      wbc_checkPages: false,
      wbc_minPage: ``,
      wbc_maxPage: ``,
      wbc_returnWhitelists: false,
      wbc_returnBlacklists: false,
      wbc_checkSelected: false,
      wbc_pages: 0,
      wbc_skipUsers: false,
      wbm_clearTags: false,
      wbm_useCache: false,
      wbm_tags: [],
      wbc_checkNew: false,
      wbc_clearCache: false,
      wbh_w_color: `#ffffff`,
      wbh_w_bgColor: `#228b22`,
      wbh_b_color: `#ffffff`,
      wbh_b_bgColor: `#ff4500`
    };

    this.oldValues = {
      uf_gp_sg: `uf_p_sg`,
      uf_dp_sg: `uf_p_sg`,
      makeSectionsCollapsible_sg: `makeSecionsCollapsible_sg`,
      makeSectionsCollapsible_st: `makeSecionsCollapsible_st`,
      collapse_general: `collapseSections_sg`,
      collapse_giveaways: `collapseSections_sg`,
      collapse_discussions: `collapseSections_sg`,
      collapse_trades: `collapseSections_sg`,
      collapse_comments: `collapseSections_sg`,
      collapse_users: `collapseSections_sg`,
      collapse_groups: `collapseSections_sg`,
      collapse_games: `collapseSections_sg`,
      collapse_others: `collapseSections_sg`,
      collapse_themes: `collapseSections_sg`,
      collapse_element_ordering: `collapseSections_sg`,
      collapse_steam_api_key: `collapseSections_sg`,
      hgm_sg: `hgr_sg`,
      hgm_removeOwned: `hgr_removeOwned`,
      hgm_removeWishlisted: `hgr_removeWishlisted`,
      mm_useRegExp: `gm_useRegExp`,
      mm_enableGiveaways: `gm_enable`,
      mm_enableDiscussions: `gm_enable`,
      mm_enableUsers: `gm_enable`,
      mm_enableGames: `gm_enable`,
      pl_sg: `wbl_sg`,
      pl_w_sg: `wbl_sg`,
      pl_b_sg: `wbl_sg`,
      gdttt_vg_sg: `gdttt_v_sg`,
      gdttt_vd_sg: `gdttt_v_sg`,
      gdttt_vt_sg: `gdttt_v_sg`,
      gdttt_vts_st: `gdttt_v_st`,
      wbc_hb_sg: `wbc_b_sg`,
      wbc_checkBlacklist: `wbc_checkWhitelist`
    };

    /**
     * @property {Parsedown} markdownParser
     */
    this.markdownParser = null;

    this.sg = null;
    this.st = null;

    // noinspection SpellCheckingInspection
    this.icon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqv8DCbP/Hgeq+CQIrf8iCK3/Igit/yIIrf8iB6//Iwit9x8Aqv8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKr0GAa2/c0DvfzfA7f83QO3/N0Dt/zdA7f83QO+/d4Gs/3OAKP1GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm/xQFs/n2Bcf//wW///8FwP//BcD//wW///8Fx///BbP69gC2/xUAAAAAAAAAAAAAAAAA/1UDFptOFxSZMxkLpJktAq720QW1+ugEsfvjA7b92wO2/dsEsfvjBbX66Aau/dEoiO4tUlLWGU5k3hdVVf8DEJxKHxWqT8cVrU7uE6VN0guqny0Apv8XAJfQGwBAVywAQFcsAJfQGwCx/xcogugtS2Lk0lBl6u5Qae7ISmPeHxagSSMVr07jF7lV/xOiSu0brgATAAAAAAAAAA8AAAC/AAAAwAAAABAAAAAAYznjEkth4OxWb/3/T2jv40lf4iMXnksiEq1O3RayUv8UpEnkEo0+HQAAABkAAABBAAAA8QAAAPEAAABBAAAAGUBSvxxOYeDjU2v0/05m7d1LYuEiF55LIhKtTt0Ws1L/FahN2gU1FTAAAADAAAAA7AAAAP0AAAD9AAAA7AAAAMAVG0owUGPm2lNr9P9OZu3dS2LhIheeSyISrU7dFrNS/xWoTdoFNRswAAAAvwAAAOsAAAD9AAAA/QAAAOsAAADAFRtKMFBj6NpTa/T/Tmbt3Uti4SIXnksiEq1O3RayUv8UpEnkEo0+HQAAABgAAABAAAAA8QAAAPEAAABBAAAAGT5PuR1OYeDjU2v0/05m7d1LYuEiFqBJIxWuT+QXuVX/E6JL7QC8XhMAAAAAAAAADwAAAL8AAAC/AAAAEAAAAAAOR/8SSWLh7FZv/f9PaO/jSV/iIxCUSh8Vrk7HFqxN7ROlS9JskzMt1XULGK12EhxGLgYsRy8GK612EhzVgAsYgmxxLU1i39JNZ+vtT2fwx0pj1h8AqlUDF65GFgqZUhlsiC0txH0T0s5/EujJgBPkz4QR28+EEdvJgBPkzn8Q6Md+E9KLdHosM1LWGUZo6BZVVf8DAAAAAAAAAAAAAAAA/2YAFMl9EvbgjRb/14gV/9eIFf/XiBX/14gV/9+NFv/KgBD254YAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL91FRjKgRHN1IgU3s+EEt3PhBLdz4QS3c+EEt3UiBTezYMRzcJ6FBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqgADxIARHr18FiO8eA8ivHgPIrx4DyK8eA8ivXwPI8SAER7/VQADAAAAAAAAAAAAAAAA78cAAPA3AAD4FwAABCAAADGOAAAE+AAAkBEAAJ55AACYOQAAlgEAAER4AAAXaAAATnoAAPgXAAD0JwAA69cAAA==`;
    // noinspection SpellCheckingInspection
    this.sgIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIUAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAACFAAAAAAAAAAAAAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAAAAAAAAAAACFAAAA+QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAAwAMAAMfjAADP8wAAz/MAAM/zAADP8wAAz/MAAM/zAADH4wAAwAMAAMADAAD//wAA//8AAA==`;
    // noinspection SpellCheckingInspection
    this.stIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SgWw+ucFsPrkBbD6SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWw+uYFsPr/BbD6/wWw+ucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFsPrmBbD6/wWw+v8FsPrmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SQWw+uYFsPrmBbD6SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKRLShSkS+cUpEvkFKRLSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4EpMYuDnTGLg5Exi4EoAAAAAAAAAABSkS+YUpEv/FKRL/xSkS+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYuDmTGLg/0xi4P9MYuDnAAAAAAAAAAAUpEvmFKRL/xSkS/8UpEvmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGLg5kxi4P9MYuD/TGLg5gAAAAAAAAAAFKRLSRSkS+YUpEvmFKRLSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4ElMYuDmTGLg5kxi4EkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0rGfRPnxn0T5MZ9E0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGfRPmxn0T/8Z9E//GfRPnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxn0T5sZ9E//GfRP/xn0T5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0nGfRPmxn0T5sZ9E0kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AAD8PwAA/D8AAPw/AAD//wAAh+EAAIfhAACH4QAAh+EAAP//AAD8PwAA/D8AAPw/AAD8PwAA//8AAA==`;
    this.attachedImages = [];
    this.popups = [];
    this.openPopups = 0;
    this.elgbCache = {};
    this.originalHash = window.location.hash;
    this.userPath = false;
    this.groupPath = false;
    this.regionsPath = false;
    this.groupWishlistPath = false;
    this.mainPath = false;
    this.winnersPath = false;
    this.giveawaysPath = false;
    this.giveawayCommentsPath = false;
    this.discussionsTicketsPath = false;
    this.ticketsPath = false;
    this.tradesPath = false;
    this.discussionsTicketsTradesPath = false;
    this.discussionTicketTradeCommentsPath = false;
    this.archivePath = false;
    this.profilePath = false;
    this.giveawayPath = false;
    this.discussionPath = false;
    this.ticketPath = false;
    this.tradePath = false;
    this.discussionsPath = false;
    this.newDiscussionPath = false;
    this.editDiscussionPath = false;
    this.createdDiscussionsPath = false;
    this.newGiveawayPath = false;
    this.newTicketPath = false;
    this.wishlistPath = false;
    this.createdPath = false;
    this.wonPath = false;
    this.enteredPath = false;
    this.commentsPath = false;
    this.aboutPath = false;
    this.whitelistPath = false;
    this.blacklistPath = false;
    this.headerSize = 0;
    this.mainPageHeadingSize = 0;
    this.footerSize = 0;
    this.pageTop = 0;
    this.commentsTop = 0;
    this.apPopouts = {};
    this.tsTables = [];
    this.currentUsers = {};
    this.currentGroups = {};
    this.mmWbcUsers = [];
    this.gameFeatures = [];
    this.groupFeatures = [];
    this.giveawayFeatures = [];
    this.commentFeatures = [];
    this.discussionFeatures = [];
    this.tradeFeatures = [];
    this.profileFeatures = [];
    this.userFeatures = [];
    this.endlessFeatures = [];
    this.games = {};

    this.minimizeList = null;

    this.sidebar = null;

    /** @type {string} */
    this.xsrfToken = undefined;
    
    this.logoutButton = null;

    /** @type {string} */
    this.version = undefined;

    this.storage = undefined;

    this.settings = undefined;

    this.groups = null;

    this.features = null;

    /** @type {boolean} */
    this.firstInstall = undefined;

    this.giveaways = null;
    
    this.mainContext = null;

    this.pageOuterWrap = null;

    this.leftButtons = null;

    this.rightButtons = null;

    this.hidingGame = undefined;

    this.mainPageHeading = null;

    /** @type {string} */
    this.pageOuterWrapClass = ``;

    /** @type {string} */
    this.pageHeadingClass = ``;

    /** @type {string} */
    this.pageHeadingBreadcrumbsClass = ``;
    
    this.footer = null;
    
    this.replyBox = null;

    /** @type {string} */
    this.cancelButtonClass = ``;

    /** @type {string} */
    this.paginationNavigationClass = ``;

    /** @type {string} */
    this.hiddenClass = ``;

    /** @type {string} */
    this.selectedClass = ``;

    /** @type {string} */
    this.originalUrl = ``;
    
    this.favicon = null;

    /** @type {string} */
    this.originalTitle = ``;

    /** @type {string} */
    this.searchUrl = ``;
    
    this.header = null;
    
    this.headerNavigationLeft = null;
    
    this.pagination = null;
    
    this.featuredContainer = null;
    
    this.paginationNavigation = null;
    
    this.enterGiveawayButton = null;
    
    this.leaveGiveawayButton = null;
    
    this.activeDiscussions = null;
    
    this.pinnedGiveaways = null;

    /** @type {boolean} */
    this.addNoCvGames = undefined;

    this.discussions = null;

    this.tickets = null;

    this.trades = null;

    this.users = null;

    /** @type {boolean} */
    this.busy = false;

    this.showChangelog = null;

    /** @type {"sg"|"st"} */
    this.name = undefined;

    this.style = null;
    
    this.customThemeElement = null;
    
    this.theme = null;
    
    this.ustButton = null;

    this.modules = null;

    this.fullLevel = null;

    this.level = null;

    this.pointsContainer = null;

    this.points = null;

    this.decryptedGiveaways = null;

    this.gfPopup = null;

    this.cfPopup = null;

    this.gc_categories_ids = [`gc_gi`, `gc_r`, `gc_hltb`, `gc_ocv`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`];

    this.pointsPlayer = null;

    this.inboxPlayer = null;

    this.wishlistPlayer = null;

    this.wonPlayer = null;

    this.giveawayErrorButton = null;

    this.gcToFetch = null;

    this.createdButton = null;

    this.rerolls = null;

    this.lastPageLink = null;

    this.stopEs = null;

    this.audioContext = null;

    this.mainButton = null;

    this.inboxButton = null;
  
    this.messageCountContainer = null;

    this.messageCount = null;

    this.wishlistNew = null;

    this.lastPage = null;

    this.levelContainer = null;

    this.lpvStyle = null;

    this.pvStyle = null;

    this.wishlist = null;

    this.toDismiss = [];

    this.draggable = {};

    this.modules = modules;

    for (const key in this.modules) {
      if (this.modules.hasOwnProperty(key) && this.modules[key].setEsgst) {
        this.modules[key].setEsgst.call(this.modules[key], this);
      }
    }
    this.documentEvents.click = new Set;
    this.documentEvents.keydown = new Set;

    this.scopes = {};
    this.currentScope = null;
    this.scopeHistory = [];
    this.modules.common.addScope(`main`, document);
    this.modules.common.setCurrentScope(`main`);

    this.parameters = this.modules.common.getParameters();

    if (this.parameters.esgst === `guide`) {
      this.locationHref = window.location.href.replace(/\?.+/, ``);
    } else {
      this.locationHref = window.location.href;
    }

    this.markdownParser = new Parsedown;
    this.sg = window.location.hostname.match(/www.steamgifts.com/);
    this.st = window.location.hostname.match(/www.steamtrades.com/);
    this.elgbCache = JSON.parse(this.modules.common.getLocalValue(`elgbCache`, `{"descriptions": {}, "timestamp": ${Date.now()}}`));

    this.userPath = window.location.pathname.match(/^\/user\//);
    this.userWonPath = this.userPath && window.location.pathname.match(/\/giveaways\/won/);
    this.groupPath = window.location.pathname.match(/^\/group\//);
    this.regionsPath = window.location.pathname.match(/^\/regions\//);
    this.groupWishlistPath = window.location.pathname.match(/^\/group\/(.*?)\/wishlist/);
    this.mainPath = window.location.pathname.match(/^\/$/);
    this.winnersPath = window.location.pathname.match(/^\/giveaway\/.+\/winners/);
    this.giveawaysPath = this.locationHref.match(/steamgifts.com($|\/$|\/giveaways(?!.*\/(new|wishlist|created|entered|won)))/);
    this.giveawayCommentsPath = window.location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups))/);
    this.discussionsTicketsPath = window.location.pathname.match(/^\/(discussions|support\/tickets)/);
    this.ticketsPath = window.location.pathname.match(/^\/support\/tickets/);
    this.tradesPath = this.locationHref.match(/steamtrades.com($|\/$|\/trades(?!\/(new|edit)))/);
    this.discussionsTicketsTradesPath = this.locationHref.match(/steamtrades.com($|\/$)/) || window.location.pathname.match(/^\/(discussions|support\/tickets|trades)/);
    this.discussionTicketTradeCommentsPath = window.location.pathname.match(/^\/(discussion|support\/ticket|trade)\//);
    this.archivePath = window.location.pathname.match(/^\/archive/);
    this.profilePath = window.location.pathname.match(/^\/account\/settings\/profile/);
    this.giveawayPath = window.location.pathname.match(/^\/giveaway\//);
    this.discussionPath = window.location.pathname.match(/^\/discussion\//);
    this.ticketPath = window.location.pathname.match(/^\/support\/ticket\//);
    this.tradePath = window.location.pathname.match(/^\/trade\//);
    this.discussionsPath = window.location.pathname.match(/^\/discussions(?!\/(new|edit))/);
    this.newDiscussionPath = window.location.pathname.match(/^\/discussions\/new/);
    this.editDiscussionPath = window.location.pathname.match(/^\/discussions\/edit/);
    this.newTradePath = window.location.pathname.match(/^\/trades\/new/);
    this.editTradePath = window.location.pathname.match(/^\/trades\/edit/);
    this.createdDiscussionsPath = window.location.pathname.match(/^\/discussions\/created/);
    this.newGiveawayPath = window.location.pathname.match(/^\/giveaways\/new/);
    this.newTicketPath = window.location.pathname.match(/^\/support\/tickets\/new/);
    this.wishlistPath = window.location.pathname.match(/^\/giveaways\/wishlist/);
    this.createdPath = window.location.pathname.match(/^\/giveaways\/created/);
    this.wonPath = window.location.pathname.match(/^\/giveaways\/won/);
    this.enteredPath = window.location.pathname.match(/^\/giveaways\/entered/);
    this.commentsPath = window.location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups))|discussion\/|support\/ticket\/|trade\/)/);
    this.aboutPath = window.location.pathname.match(/^\/(about|legal)/);
    this.whitelistPath = window.location.pathname.match(/^\/account\/manage\/whitelist/);
    this.blacklistPath = window.location.pathname.match(/^\/account\/manage\/blacklist/);
  }

  async triggerFunction(key, ...args) {
    for (const func of this.triggerFunctions[key]) {
      await func(...args);
    }
  }
}

const esgst = new Esgst();

shared.add({ esgst, modules });

export { esgst };

