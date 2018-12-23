import {container} from '../class/Container';
import Parsedown from '../lib/parsedown';
import modules from '../modules';

class Esgst {
  constructor() {
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
        { name: `About - Brand Assets`, pattern: `^/about/brand-assets$` },
        { name: `About - Comment Formatting`, pattern: `^/about/comment-formatting$` },
        { name: `About - FAQ`, pattern: `^/about/faq$` },
        { name: `About - Guidelines`, pattern: `^/about/guidelines$` },
        { name: `Legal - Privacy Policy`, pattern: `^/legal/privacy-policy$` },
        { name: `Legal - Cookie Policy`, pattern: `^/legal/cookie-policy$` },
        { name: `Legal - Terms Of Service`, pattern: `^/legal/terms-of-service$` },
        { name: `Settings - Profile`, pattern: `^/account/settings/profile$` },
        { name: `Settings - Patreon`, pattern: `^/account/settings/patreon$` },
        { name: `Settings - Giveaways`, pattern: `^/account/settings/giveaways$` },
        { name: `Settings - Giveaways - Filters`, pattern: `^/account/settings/giveaways/filters` },
        { name: `Settings - Email Notifications`, pattern: `^/account/settings/email-notifications$` },
        { name: `Settings - Referrals`, pattern: `^/account/settings/referrals$` },
        { name: `Privacy - Delete Account`, pattern: `^/account/privacy/delete-account$` },
        { name: `Stats - Personal - Community`, pattern: `^/stats/personal/community$` },
        { name: `Stats - Personal - Steam`, pattern: `^/stats/personal/steam$` },
        { name: `Stats - Community - Giveaways`, pattern: `^/stats/community/giveaways$` },
        { name: `Stats - Community - Discussions`, pattern: `^/stats/community/discussions$` },
        { name: `Stats - Community - Comments`, pattern: `^/stats/community/comments$` },
        { name: `Stats - Community - Support`, pattern: `^/stats/community/support$` },
        { name: `Stats - Community - Users`, pattern: `^/stats/community/users$` },
        { name: `Stats - Steam - Games`, pattern: `^/stats/steam/games$` }
      ],
      st: [
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
      onLevelContainerUpdated: []
    };

    for (const key in this.triggerFunctions) {
      if (!this.triggerFunctions.hasOwnProperty(key)) {
        return;
      }
      this[key] = this.triggerFunction.bind(this, key);
    }

    this.currentSettings = {};

    this.urlr = null;

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
      vgb_index: 1,
      vgb_wonFormat: `([FCV] FCV / [RCV] RCV / [NCV] NCV / [NR] NR)`,
      vgb_sentFormat: `([FCV] FCV / [RCV] RCV / [NCV] NCV / [A] A / [NR] NR)`,
      ul_links: [
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
      gc_lr_sg: true,
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
      cf_m_b_sg: false,
      cf_m_a_sg: false,
      gf_presets: [],
      df_presets: [],
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
      toDismiss: [],
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
      hgm_removeTextArea: false,
      hgm_removeOwned: false,
      hgm_removeWishlisted: false,
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
      username: ``,
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
      as_searchAppId: false,
      autoBackup_days: 1,
      autoBackup_index: 0,
      autoSyncGroups: 0,
      autoSyncWhitelist: 0,
      autoSyncBlacklist: 0,
      autoSyncHiddenGames: 0,
      autoSyncGames: 0,
      autoSyncFollowedGames: 0,
      autoSyncWonGames: 0,
      autoSyncReducedCvGames: 0,
      autoSyncNoCvGames: 0,
      autoSyncHltbTimes: 0,
      autoSyncDelistedGames: 0,
      autoSyncGiveaways: 0,
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
      gc_categories: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
      gc_categories_gv: [`gc_gi`, `gc_r`, `gc_hltb`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`],
      gc_o_altAccounts: [],
      gc_g_colors: [],
      gc_g_filters: ``,
      gc_r_colors: [
        {bgColor: `#a34c25`, color: `#ffffff`, icon: `thumbs-down`, lower: 0, upper: 39},
        {bgColor: `#b9a074`, color: `#ffffff`, icon: `minus-circle`, lower: 40, upper: 69},
        {bgColor: `#66c0f4`, color: `#ffffff`, icon: `thumbs-up`, lower: 70, upper: 100}
      ],
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
      lastSyncHiddenGames: 0,
      lastSyncGames: 0,
      lastSyncFollowedGames: 0,
      lastSyncWonGames: 0,
      lastSyncReducedCvGames: 0,
      lastSyncNoCvGames: 0,
      lastSyncHltbTimes: 0,
      lastSyncDelistedGames: 0,
      lastSyncGiveaways: 0,
      leftMainPageHeadingIds: [`wbsDesc`, `wbsAsc`, `wbc`, `ugs`, `tb`, `sks`, `rbp`, `namwc`, `mpp`, `mm`, `hgm`, `gv`, `gts`, `gf`, `ge`, `gas`, `ds`, `df`, `ctUnread`, `ctRead`, `ctGo`, `cs`, `cf`, `as`, `aic`],
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
      rightMainPageHeadingIds: [`esResume`, `esPause`, `esRefresh`, `esRefreshAll`, `stbb`, `sttb`],
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
      syncGroups: true,
      syncWhitelist: true,
      syncBlacklist: true,
      syncHiddenGames: true,
      syncGames: true,
      syncFollowedGames: false,
      syncWonGames: true,
      syncReducedCvGames: true,
      syncNoCvGames: true,
      syncHltbTimes: false,
      syncDelistedGames: false,
      syncGiveaways: true,
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

    this.currentVersion = `8.1.10`;
    this.devVersion = `8.1.11 (Dev.8)`;
    // noinspection SpellCheckingInspection
    this.icon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqv8DCbP/Hgeq+CQIrf8iCK3/Igit/yIIrf8iB6//Iwit9x8Aqv8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKr0GAa2/c0DvfzfA7f83QO3/N0Dt/zdA7f83QO+/d4Gs/3OAKP1GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm/xQFs/n2Bcf//wW///8FwP//BcD//wW///8Fx///BbP69gC2/xUAAAAAAAAAAAAAAAAA/1UDFptOFxSZMxkLpJktAq720QW1+ugEsfvjA7b92wO2/dsEsfvjBbX66Aau/dEoiO4tUlLWGU5k3hdVVf8DEJxKHxWqT8cVrU7uE6VN0guqny0Apv8XAJfQGwBAVywAQFcsAJfQGwCx/xcogugtS2Lk0lBl6u5Qae7ISmPeHxagSSMVr07jF7lV/xOiSu0brgATAAAAAAAAAA8AAAC/AAAAwAAAABAAAAAAYznjEkth4OxWb/3/T2jv40lf4iMXnksiEq1O3RayUv8UpEnkEo0+HQAAABkAAABBAAAA8QAAAPEAAABBAAAAGUBSvxxOYeDjU2v0/05m7d1LYuEiF55LIhKtTt0Ws1L/FahN2gU1FTAAAADAAAAA7AAAAP0AAAD9AAAA7AAAAMAVG0owUGPm2lNr9P9OZu3dS2LhIheeSyISrU7dFrNS/xWoTdoFNRswAAAAvwAAAOsAAAD9AAAA/QAAAOsAAADAFRtKMFBj6NpTa/T/Tmbt3Uti4SIXnksiEq1O3RayUv8UpEnkEo0+HQAAABgAAABAAAAA8QAAAPEAAABBAAAAGT5PuR1OYeDjU2v0/05m7d1LYuEiFqBJIxWuT+QXuVX/E6JL7QC8XhMAAAAAAAAADwAAAL8AAAC/AAAAEAAAAAAOR/8SSWLh7FZv/f9PaO/jSV/iIxCUSh8Vrk7HFqxN7ROlS9JskzMt1XULGK12EhxGLgYsRy8GK612EhzVgAsYgmxxLU1i39JNZ+vtT2fwx0pj1h8AqlUDF65GFgqZUhlsiC0txH0T0s5/EujJgBPkz4QR28+EEdvJgBPkzn8Q6Md+E9KLdHosM1LWGUZo6BZVVf8DAAAAAAAAAAAAAAAA/2YAFMl9EvbgjRb/14gV/9eIFf/XiBX/14gV/9+NFv/KgBD254YAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL91FRjKgRHN1IgU3s+EEt3PhBLdz4QS3c+EEt3UiBTezYMRzcJ6FBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqgADxIARHr18FiO8eA8ivHgPIrx4DyK8eA8ivXwPI8SAER7/VQADAAAAAAAAAAAAAAAA78cAAPA3AAD4FwAABCAAADGOAAAE+AAAkBEAAJ55AACYOQAAlgEAAER4AAAXaAAATnoAAPgXAAD0JwAA69cAAA==`;
    // noinspection SpellCheckingInspection
    this.sgIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIUAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAACFAAAAAAAAAAAAAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAAAAAAAAAAACFAAAA+QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAAwAMAAMfjAADP8wAAz/MAAM/zAADP8wAAz/MAAM/zAADH4wAAwAMAAMADAAD//wAA//8AAA==`;
    // noinspection SpellCheckingInspection
    this.stIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SgWw+ucFsPrkBbD6SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWw+uYFsPr/BbD6/wWw+ucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFsPrmBbD6/wWw+v8FsPrmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SQWw+uYFsPrmBbD6SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKRLShSkS+cUpEvkFKRLSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4EpMYuDnTGLg5Exi4EoAAAAAAAAAABSkS+YUpEv/FKRL/xSkS+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYuDmTGLg/0xi4P9MYuDnAAAAAAAAAAAUpEvmFKRL/xSkS/8UpEvmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGLg5kxi4P9MYuD/TGLg5gAAAAAAAAAAFKRLSRSkS+YUpEvmFKRLSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4ElMYuDmTGLg5kxi4EkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0rGfRPnxn0T5MZ9E0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGfRPmxn0T/8Z9E//GfRPnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxn0T5sZ9E//GfRP/xn0T5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0nGfRPmxn0T5sZ9E0kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AAD8PwAA/D8AAPw/AAD//wAAh+EAAIfhAACH4QAAh+EAAP//AAD8PwAA/D8AAPw/AAD8PwAA//8AAA==`;
    this.attachedImages = [];
    this.mainComments = [];
    this.popupComments = [];
    this.popups = [];
    this.openPopups = 0;
    this.ustCheckboxes = {};
    this.ustTickets = {};
    this.numUstTickets = 0;
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
    this.accountPath = false;
    this.aboutPath = false;
    this.whitelistPath = false;
    this.blacklistPath = false;
    this.inboxPath = false;
    this.groupsPath = false;
    this.pageTop = 0;
    this.commentsTop = 0;
    this.apPopouts = {};
    this.tsTables = [];
    this.currentUsers = {};
    this.currentGroups = {};
    this.mainGiveaways = [];
    this.mainDiscussions = [];
    this.mainUsers = [];
    this.mainGames = [];
    this.mainGroups = [];
    this.popupGiveaways = [];
    this.popupDiscussions = [];
    this.popupUsers = [];
    this.popupGames = [];
    this.popupGroups = [];
    this.mmWbcUsers = [];
    this.gameFeatures = [];
    this.groupFeatures = [];
    this.giveawayFeatures = [];
    this.discussionFeatures = [];
    this.profileFeatures = [];
    this.userFeatures = [];
    this.endlessFeatures = [];
    this.edited = {};
    this.games = {};

    /** @type {HTMLElement} */
    this.minimizeList = null;

    /** @type {HTMLElement} */
    this.minimizePanel = null;

    this.updateHiddenGames = null;

    /** @type {HTMLElement} */
    this.noCvButton = null;

    /** @type {HTMLElement} */
    this.sidebar = null;

    /** @type {string} */
    this.xsrfToken = undefined;

    /** @type {HTMLElement} */
    this.logoutButton = null;

    /** @type {string} */
    this.version = undefined;

    /** @type {string[]} */
    this.leftButtonIds = null;

    /** @type {string[]} */
    this.leftMainPageHeadingIds = null;

    /**
     * @type {EsgstStorage}
     */
    this.storage = undefined;

    /** @type {EsgstSettings} */
    this.settings = undefined;

    /** @type {string[]} */
    this.rightButtonIds = null;

    /** @type {string[]} */
    this.rightMainPageHeadingIds = null;

    /** @type {string} */
    this.steamApiKey = undefined;

    this.groups = null;

    this.features = null;

    /** @type {boolean} */
    this.firstInstall = undefined;

    this.df_preset = null;

    this.df_presets = null;

    this.giveaways = null;

    this.radb = null;

    this.ugd_clearCache = null;

    this.ugd_forceUpdate = null;

    this.username = null;

    /** @type {HTMLElement} */
    this.mainContext = null;

    this.gc_g_colors = null;

    this.gc_o_altAccounts = null;

    this.dismissedOptions = null;

    this.gc_r_colors = null;

    /** @type {number} */
    this.ugd_playtime = undefined;

    /** @type {number} */
    this.cleanDiscussions_days = undefined;

    /** @type {number} */
    this.cleanEntries_days = undefined;

    /** @type {number} */
    this.cleanGiveaways_days = undefined;

    /** @type {number} */
    this.cleanSgCommentHistory_days = undefined;

    /** @type {number} */
    this.cleanTickets_days = undefined;

    /** @type {number} */
    this.cleanTrades_days = undefined;

    /** @type {number} */
    this.autoBackup_days = undefined;

    /** @type {number} */
    this.autoBackup_index = undefined;

    /** @type {boolean} */
    this.askFileName = undefined;

    this.pageOuterWrap = null;

    this.leftButtons = null;

    this.rightButtons = null;

    /** @type {EsgstHidingGame} */
    this.hidingGame = undefined;

    this.mainPageHeading = null;

    /** @type {string} */
    this.pageOuterWrapClass = ``;

    /** @type {string} */
    this.pageHeadingClass = ``;

    /** @type {string} */
    this.pageHeadingBreadcrumbsClass = ``;

    /** @type {HTMLElement} */
    this.footer = null;

    /** @type {HTMLElement} */
    this.replyBox = null;

    /** @type {string} */
    this.cancelButtonClass = ``;

    /** @type {string} */
    this.paginationNavigationClass = ``;

    /** @type {string} */
    this.hiddenClass = ``;

    /** @type {string} */
    this.selectedClass = ``;

    /** @type {number} */

    /** @type {string} */
    this.originalUrl = ``;

    /** @type {HTMLElement} */
    this.favicon = null;

    /** @type {string} */
    this.originalTitle = ``;

    /** @type {string} */
    this.searchUrl = ``;

    /** @type {HTMLElement} */
    this.header = null;

    /** @type {HTMLElement} */
    this.headerNavigationLeft = null;

    /** @type {HTMLElement} */
    this.pagination = null;

    /** @type {HTMLElement} */
    this.featuredContainer = null;

    /** @type {HTMLElement} */
    this.paginationNavigation = null;

    /** @type {HTMLElement} */
    this.enterGiveawayButton = null;

    /** @type {HTMLElement} */
    this.leaveGiveawayButton = null;

    /** @type {HTMLElement} */
    this.activeDiscussions = null;

    /** @type {HTMLElement} */
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

    this.steamId = null;

    /** @type {string} */
    this.name = undefined;

    this.showFeatureNumber = null;

    this.syncGroups = null;

    this.syncWhitelist = null;

    this.syncBlacklist = null;

    this.syncHiddenGames = null;

    this.syncWonGames = null;

    this.syncReducedCvGames = null;

    this.syncGiveaways = null;

    this.syncGames = null;

    this.syncNoCvGames = null;

    this.syncHltbTimes = null;

    this.getSyncGameNames = null;

    this.lastSyncGroups = null;

    this.lastSyncGames = null;

    /** @type {string[]} */
    this.giveawayColumns = null;

    /** @type {string[]} */
    this.giveawayPanel = null;

    /** @type {string[]} */
    this.giveawayColumns_gv = null;

    /** @type {string[]} */
    this.giveawayPanel_gv = null;

    this.gc_g_filters = null;

    this.gc_fcv_s = null;

    this.gc_fcv = null;

    this.gc_fcv_s_i = null;

    this.gc_fcvLabel = null;

    this.gc_fcvIcon = null;

    this.gc_rcv = null;

    this.gc_rcv_s = null;

    this.gc_rcvLabel = null;

    this.gc_rcv_s_i = null;

    this.gc_rcvIcon = null;

    this.gc_ncv = null;

    this.gc_ncv_s = null;

    this.gc_ncvLabel = null;

    this.gc_ncv_s_i = null;

    this.gc_ncvIcon = null;

    this.gc_hltb = null;

    this.gc_h = null;

    this.gc_hLabel = null;

    this.gc_h_s = null;

    this.gc_h_s_i = null;

    this.gc_hIcon = null;

    this.gc_i = null;

    this.gc_i_s = null;

    this.gc_iLabel = null;

    this.gc_i_s_i = null;

    this.gc_iIcon = null;

    this.gc_o = null;

    this.gc_o_s = null;

    this.gc_o_s_i = null;

    this.gc_oLabel = null;

    this.gc_oIcon = null;

    this.gc_o_a = null;

    this.gc_w_s = null;

    this.gc_w = null;

    this.gc_wLabel = null;

    this.gc_w_s_i = null;

    this.gc_pw = null;

    this.gc_pw_s = null;

    this.gc_pwLabel = null;

    this.gc_pw_s_i = null;

    this.gc_pwIcon = null;

    this.gc_gi = null;

    this.gc_r = null;

    this.gc_a_s = null;

    this.gc_aLabel = null;

    this.gc_a_s_i = null;

    this.gc_sp = null;

    this.gc_sp_s = null;

    this.gc_spLabel = null;

    this.gc_sp_s_i = null;

    this.gc_spIcon = null;

    this.gc_mp = null;

    this.gc_mp_s = null;

    this.gc_mpLabel = null;

    this.gc_mp_s_i = null;

    this.gc_sc = null;

    this.gc_sc_s = null;

    this.gc_sc_s_i = null;

    this.gc_scLabel = null;

    this.gc_tc = null;

    this.gc_tc_s = null;

    this.gc_tcLabel = null;

    this.gc_l = null;

    this.gc_l_s = null;

    this.gc_lLabel = null;

    this.gc_m = null;

    this.gc_m_s = null;

    this.gc_mLabel = null;

    this.gc_dlc = null;

    this.gc_dlc_s = null;

    this.gc_dlcLabel = null;

    this.gc_p = null;

    this.gc_p_s = null;

    this.gc_p_s_i = null;

    this.gc_pLabel = null;

    this.gc_pIcon = null;

    this.gc_ea = null;

    this.gc_ea_s = null;

    this.gc_eaLabel = null;

    this.gc_lg = null;

    this.gc_lg_s = null;

    this.gc_lgLabel = null;

    this.gc_rm = null;

    this.gc_rm_s = null;

    this.gc_rmLabel = null;

    this.gc_rd = null;

    this.gc_rdIcon = null;

    this.gc_g = null;

    this.df_m = null;

    this.gc_a = null;

    this.gc_aIcon = null;

    this.gc_wIcon = null;

    this.gc_mpIcon = null;

    this.gc_scIcon = null;

    this.gc_tc_s_i = null;

    this.gc_l_s_i = null;

    this.gc_m_s_i = null;

    this.gc_dlc_s_i = null;

    this.gc_ea_s_i = null;

    this.gc_lg_s_i = null;

    this.gc_rm_s_i = null;

    this.es_gf = null;

    this.cfh_img_choice = null;

    this.gwc_h_width = null;

    this.ff = null;

    this.ib = null;

    this.df_enable = null;

    this.gc_tcIcon = null;

    this.gc_lIcon = null;

    this.gc_dlcIcon = null;

    this.gc_eaIcon = null;

    this.gc_mIcon = null;

    this.gc_lgIcon = null;

    this.gc_rmIcon = null;

    this.gwr_h_width = null;

    this.namwc_h = null;

    this.namwc_h_m = null;

    this.namwc_h_f = null;

    this.namwc_h_i = null;

    this.wbh = null;

    this.namwc_checkNotActivated = null;

    this.namwc_checkMultiple = null;

    this.ust = null;

    this.wbh_w = null;

    this.wbh_b = null;

    this.nrf_searchMultiple = null;

    this.rwscvl_r = null;

    this.vrcv = null;

    this.ugd_achievements = null;

    this.ugd_getPlaytime = null;

    this.ugd_getAchievements = null;

    this.ugd_s = null;

    this.wbc_h = null;

    this.wbc_hb = null;

    this.wbcButton = null;

    this.wbc_checkSingle = null;

    this.wbc_checkSelected = null;

    this.wbc_checkBlacklist = null;

    this.wbc_checkAll = null;

    this.wbc_minPage = null;

    this.wbc_maxPage = null;

    this.wbc_checkPages = null;

    this.wbc_returnWhitelists = null;

    this.wbc_returnBlacklists = null;

    this.wbc_checkNew = null;

    this.wbc_pages = null;

    this.wbc_skipUsers = null;

    this.wbc_clearCache = null;

    this.wbc_n = null;

    this.wbm_useCache = null;

    /** @type {string[]} */
    this.wbm_tags = null;

    this.wbm_clearTags = null;

    this.lastBackup = null;

    this.mm = null;

    this.style = null;

    /** @type {HTMLElement} */
    this.customThemeElement = null;

    /** @type {HTMLElement} */
    this.theme = null;

    /** @type {HTMLElement} */
    this.customTheme = null;

    this.collapseSections = null;

    this.cleanDiscussions = null;

    this.cleanEntries = null;

    this.cleanGiveaways = null;

    this.cleanSgCommentHistory = null;

    this.cleanTickets = null;

    this.cleanDuplicates = null;

    this.cleanTrades = null;

    this.backupZip = null;

    /** @type {HTMLElement} */
    this.ustButton = null;

    this.modules = null;

    this.ch = null;

    this.df = null;

    this.adots = null;

    this.uf = null;

    this.gt = null;

    this.gpt = null;

    this.wbc = null;

    this.namwc = null;

    this.gv = null;

    this.codb = null;

    this.ttpcc = null;

    this.gch = null;

    this.gm_enable = null;

    this.tb_a = null;

    this.qgs = null;

    this.adots_index = null;

    this.ags_app = null;

    this.ags_sub = null;

    this.as_searchAppId = null;

    this.gf = null;

    this.ggl = null;

    this.elgb_p = null;

    this.level = null;

    this.hgebd = null;

    this.pointsContainer = null;

    this.et = null;

    this.points = null;

    this.gv_gb = null;

    this.gv_ged = null;

    this.gv_ge = null;

    this.elgb_d = null;

    this.elgb_r = null;

    this.elgb_c = null;

    this.elgb_f = null;

    this.cfh = null;

    this.elgb_filters = null;

    this.hr = null;

    this.egh = null;

    this.gb = null;

    this.ttec = null;

    this.gb_ue = null;

    this.gb_se = null;

    this.gb_h = null;

    this.gb_u = null;

    this.gb_hours = null;

    this.es_gb = null;

    this.gas = null;

    this.gcl_index = null;

    this.es_ged = null;

    this.decryptedGiveaways = null;

    this.gf_presetGed = null;

    this.gf_presets = null;

    this.ged_b = null;

    this.giveawayHeading = null;

    this.giveawayHeading_gv = null;

    this.giveawayLinks = null;

    this.giveawayLinks_gv = null;

    this.gfPopup = null;

    this.gc_categories_ids = [`gc_gi`, `gc_r`, `gc_hltb`, `gc_fcv`, `gc_rcv`, `gc_ncv`, `gc_h`, `gc_i`, `gc_o`, `gc_w`, `gc_f`, `gc_pw`, `gc_a`, `gc_bd`, `gc_bvg`, `gc_sp`, `gc_mp`, `gc_sc`, `gc_tc`, `gc_l`, `gc_m`, `gc_ea`, `gc_lg`, `gc_rm`, `gc_dlc`, `gc_p`, `gc_rd`, `gc_g`];

    this.gc_fLabel = null;

    this.gc_fIcon = null;

    this.pointsPlayer = null;

    this.inboxPlayer = null;

    this.wishlistPlayer = null;

    this.wonPlayer = null;

    this.giveawayErrorButton = null;

    this.elgb_r_d = null;

    this.gf_m = null;

    this.geth_colors = null;

    this.es_ge = null;

    this.ge_sgt = null;

    this.ge_o = null;

    this.gf_s = null;

    this.gf_os = null;

    this.gf_alreadyOwned = null;

    this.gf_dlcMissingBase = null;

    this.gf_aboveLevel = null;

    this.gf_manuallyFiltered = null;

    this.gwc = null;

    this.gwr = null;

    this.gptw = null;

    this.ge = null;

    this.ggl_index = null;

    this.filter_os = null;

    this.filter_giveaways_exist_in_account = null;

    this.filter_giveaways_missing_base_game = null;

    this.filter_giveaways_level = null;

    this.filter_giveaways_additional_games = null;

    this.gcToFetch = null;

    this.gc = null;

    this.ggl_m = null;

    this.gptw_e = null;

    this.gptw_colors = null;

    this.gts_preciseStart = null;

    this.gts_preciseEnd = null;

    this.gts_preciseStartDate = null;

    this.gts_preciseEndDate = null;

    this.mgc_createTrain = null;

    this.mgc_removeLinks = null;

    this.mgc_createTrainSwitch = null;

    this.mgc_removeLinksSwitch = null;

    this.gwc_e = null;

    this.gwc_a = null;

    this.gwc_colors = null;

    this.gwc_h = null;

    this.gwr_e = null;

    this.gwr_a = null;

    this.gwr_colors = null;

    this.gwr_h = null;

    this.gv_spacing = null;

    this.npth_previousKey = null;

    this.npth_nextKey = null;

    this.ochgb_f = null;

    this.qgs_h = null;

    this.sks_exportKeys = null;

    this.sks_searchCurrent = null;

    this.sks_minDate = null;

    this.sks_maxDate = null;

    this.sks_limitDate = null;

    this.sks_minPage = null;

    this.sks_maxPage = null;

    this.sks_limitPages = null;

    this.ge_sgt_l = null;

    this.ap = null;

    this.gwc_a_b = null;

    this.gwr_a_b = null;

    this.mgc_bumpLast = null;

    this.mgc_groupKeys = null;

    this.mgc_groupAllKeys = null;

    this.mgc_reversePosition = null;

    this.cewgd = null;

    this.lpv = null;

    this.rcvc = null;

    this.sal = null;

    this.ef = null;

    this.sal_index = null;

    this.ugs_checkRules = null;

    this.ugs_checkMember = null;

    this.ugs_difference = null;

    this.ugs_checkDifference = null;

    this.ugs_checkWhitelist = null;

    this.ugs_checkBlacklist = null;

    this.createdButton = null;

    this.rerolls = null;

    this.ge_sgt_limit = null;

    this.aicButton = null;

    this.aicPrevious = null;

    this.aicNext = null;

    this.aic_b = null;

    this.ail = null;

    this.qiv = null;

    this.vai = null;

    this.ap_index = null;

    this.registrationDate = null;

    this.cdr_b = null;

    this.cdr_d = null;

    this.cdr_days = null;

    this.chfl_key = null;

    this.ef_filters = null;

    this.es_pd = null;

    this.es_r = null;

    this.lastPageLink = null;

    this.es_refresh = null;

    this.es_refreshAll = null;

    this.es_cl = null;

    this.stopEs = null;

    this.cr = null;

    this.cf = null;

    this.ts = null;

    this.ct_s = null;

    this.gdttt_g = null;

    this.hr_b = null;

    this.audioContext = null;

    this.mainButton = null;

    this.inboxButton = null;

    this.hr_minutes = null;

    this.nm = null;

    this.pv = null;

    this.hr_g = null;

    this.messageCountContainer = null;

    this.messageCount = null;

    this.hr_m = null;

    this.hr_p = null;

    this.hr_fp = null;

    this.wishlistNew = null;

    this.hr_fp_s = null;

    this.hr_m_n_s = null;

    this.hr_w_n_s = null;

    this.hr_g_n_s = null;

    this.hr_c = null;

    this.hr_a = null;

    this.hr_a_r = null;

    this.lastPage = null;

    this.levelContainer = null;

    this.lpvStyle = null;

    this.mm_enableGames = null;

    this.ged = null;

    this.df_s = null;

    this.dh = null;

    this.gdttt = null;

    this.ut = null;

    this.mm_useRegExp = null;

    this.altInboxButton = null;

    this.pvStyle = null;

    this.stbb_index = null;

    this.es = null;

    this.sttb_index = null;

    this.sk_cp = null;

    this.sk_sb = null;

    this.sk_fp = null;

    this.sk_pp = null;

    this.sk_np = null;

    this.sk_lp = null;

    this.sk_tf = null;

    this.sk_hg = null;

    this.sk_hga = null;

    this.sk_ge = null;

    this.sk_c = null;

    this.sk_rb = null;

    this.sk_ru = null;

    this.sk_sr = null;

    this.us = null;

    this.vai_gifv = null;

    this.es_pages = null;

    this.qiv_p = null;

    this.hr_p_format = null;

    this.hr_m_n = null;

    this.hr_g_n = null;

    this.hr_w = null;

    this.hr_a_a = null;

    this.altMessageCount = null;

    this.sk_closePopups = null;

    this.sk_searchBox = null;

    this.sk_firstPage = null;

    this.sk_previousPage = null;

    this.sk_nextPage = null;

    this.sk_lastPage = null;

    this.sk_toggleFilters = null;

    this.sk_hideGame = null;

    this.sk_hideGiveaway = null;

    this.sk_giveawayEntry = null;

    this.sk_creator = null;

    this.sk_replyBox = null;

    this.sk_replyUser = null;

    this.sk_submitReply = null;

    this.hr_w_n = null;

    this.mm_enable = null;

    this.es_loadNext = null;

    this.hr_w_h = null;

    this.mm_disable = null;

    this.wishlist = null;

    this.hr_w_hours = null;

    this.gc_g_udt = null;

    this.gc_lr = null;

    this.gc_b = null;

    this.gc_ncv_o = null;

    this.gc_hltb_index_0 = null;

    this.gc_hltb_index_1 = null;

    this.gc_hltb_index_2 = null;

    this.gc_f_s = null;

    this.gc_pw_o = null;

    this.gc_r_s = null;

    this.gc_dlc_o = null;

    this.gc_dlc_b = null;

    this.gc_rdLabel = null;

    this.gc_categories_gv = null;

    this.gc_il = null;

    this.gc_f_s_i = null;

    this.gc_g_s = null;

    this.gc_lp = null;

    this.gc_lp_gv = null;

    this.oadd = null;

    this.oadd_d = null;

    this.mpp_r = null;

    this.ds_auto = null;

    this.ds_option = null;

    this.ct = null;

    this.rfi_c = null;

    this.cerb_a = null;

    this.cerbButtons = null;

    this.cf_m = null;

    this.cfhEmojis = null;

    this.cfh_pasteFormatting = null;

    this.cfh_cf = null;

    this.cfh_p = null;

    this.cfh_img_remember = null;

    this.cs_minPage = null;

    this.cs_maxPage = null;

    this.cs_limitPages = null;

    this.ct_s_h = null;

    this.ct_c = null;

    this.ct_o = null;

    this.ctGoToUnread = null;

    this.ct_f = null;

    this.ct_r = null;

    this.mr = null;

    this.rfi = null;

    this.at = null;

    this.rfi_s = null;

    this.ct_a = null;

    this.ctUnreadFound = null;

    this.ged_addIcons = null;

    this.cfh_p_a = null;

    this.ctNewTab = null;

    this.mm_enableUsers = null;

    this.updateWhitelistBlacklist = null;

    this.mm_enableGiveaways = null;

    this.gch_colors = null;

    this.gp = null;

    this.elgb = null;

    this.gr = null;

    this.gr_r = null;

    this.gc_categories = null;

    this.ds = null;

    this.mm_enableDiscussions = null;

    this.dh_t = null;

    this.pm = null;

    this.uf_d = null;

    this.uf_p = null;

    this.pm_a = null;

    this.gr_a = null;

    this.toDismiss = null;

    this.syncFollowedGames = null;

    this.gc_f = null;

    this.draggable = {};

    this.nrf_clearCache = null;

    this.modules = modules;
    for (const key in this.modules) {
      if (this.modules.hasOwnProperty(key)) {
        this.modules[key].setEsgst.call(this.modules[key], this);
      }
    }
    this.documentEvents.click = new Set;
    this.documentEvents.keydown = new Set;

    this.parameters = this.modules.common.getParameters();

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
    this.giveawaysPath = window.location.href.match(/steamgifts.com($|\/$|\/giveaways(?!.*\/(new|wishlist|created|entered|won)))/);
    this.giveawayCommentsPath = window.location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups))/);
    this.discussionsTicketsPath = window.location.pathname.match(/^\/(discussions|support\/tickets)/);
    this.ticketsPath = window.location.pathname.match(/^\/support\/tickets/);
    this.tradesPath = window.location.href.match(/steamtrades.com($|\/$|\/trades)/);
    this.discussionsTicketsTradesPath = window.location.href.match(/steamtrades.com($|\/$)/) || window.location.pathname.match(/^\/(discussions|support\/tickets|trades)/);
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
    this.createdDiscussionsPath = window.location.pathname.match(/^\/discussions\/created/);
    this.newGiveawayPath = window.location.pathname.match(/^\/giveaways\/new/);
    this.newTicketPath = window.location.pathname.match(/^\/support\/tickets\/new/);
    this.wishlistPath = window.location.pathname.match(/^\/giveaways\/wishlist/);
    this.createdPath = window.location.pathname.match(/^\/giveaways\/created/);
    this.wonPath = window.location.pathname.match(/^\/giveaways\/won/);
    this.enteredPath = window.location.pathname.match(/^\/giveaways\/entered/);
    this.commentsPath = window.location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups))|discussion\/|support\/ticket\/|trade\/)/);
    this.accountPath = window.location.pathname.match(/^\/account/);
    this.aboutPath = window.location.pathname.match(/^\/(about|legal)/);
    this.whitelistPath = window.location.pathname.match(/^\/account\/manage\/whitelist/);
    this.blacklistPath = window.location.pathname.match(/^\/account\/manage\/blacklist/);
    this.inboxPath = window.location.pathname.match(/^\/messages/);
    this.groupsPath = window.location.pathname.match(/^\/account\/steam\/groups/);
  }

  async triggerFunction(key) {
    for (const func of this.triggerFunctions[key]) {
      await func();
    }
  }
}

export {Esgst};

let esgst = new Esgst;
export default esgst;
container.add({esgst});
