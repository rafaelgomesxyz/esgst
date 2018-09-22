import Parsedown from '../lib/parsedown';
import modules from '../modules';

/**
 * @type {Esgst}
 */
class Esgst {
  urlr;

  documentEvents = {
    click: null,
    keydown: null
  };

  windowEvents = {};

  parameters = {};

  defaultValues = {
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
    chfl_key: 'ctrlKey + e',
    getSyncGameNames_sg: false,
    getSyncGameNames_st: false,
    sgDarkGrey_startTime: '00:00',
    sgDarkGrey_endTime: '23:59',
    sgv2Dark_startTime: '00:00',
    sgv2Dark_endTime: '23:59',
    steamGiftiesBlack_startTime: '00:00',
    steamGiftiesBlack_endTime: '23:59',
    steamGiftiesBlue_startTime: '00:00',
    steamGiftiesBlue_endTime: '23:59',
    steamTradiesBlackBlue_startTime: '00:00',
    steamTradiesBlackBlue_endTime: '23:59',
    customTheme_startTime: '00:00',
    customTheme_endTime: '23:59',
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
    hr_w_format: '(#❤)',
    hr_p_format: '(#P)',
    ef_filters: '',
    gwc_h_width: '3px',
    gwr_h_width: '3px',
    chfl_giveaways_sg: [
      'new',
      'wishlist',
      'created',
      'entered',
      'won',
      {color: 'grey', description: 'View your hidden games.', icon: 'fa-eye', id: 'filters', name: 'Hidden Games', url: '/account/settings/giveaways/filters'},
      {color: 'grey', description: 'Check if a game receives reduced CV.', icon: 'fa-calendar-minus-o', id: 'bundle-games', name: 'Reduced CV Games', url: '/bundle-games'},
      {id: 'type=wishlist', name: 'Browse Wishlist Giveaways', url: '/giveaways/search?type=wishlist'},
      {id: 'type=recommended', name: 'Browse Recommended Giveaways', url: '/giveaways/search?type=recommended'},
      {id: 'type=group', name: 'Browse Group Giveaways', url: '/giveaways/search?type=group'},
      {id: 'type=new', name: 'Browse New Giveaways', url: '/giveaways/search?type=new'}
    ],
    chfl_discussions_sg: [
      'new',
      'created',
      'dh',
      {color: 'grey', description: 'Help the community.', icon: 'fa-question-circle ', id: 'categorize-discussions', name: 'Categorize Discussions', url: '/tools/categorize-discussions'},
      {id: 'announcements', name: 'Browse Announcements', url: '/discussions/announcements'},
      {id: 'bugs-suggestions', name: 'Browse Bugs / Suggestions', url: '/discussions/bugs-suggestions'},
      {id: 'deals', name: 'Browse Deals', url: '/discussions/deals'},
      {id: 'general', name: 'Browse General', url: '/discussions/general'},
      {id: 'group-recruitment', name: 'Browse Group Recruitment', url: '/discussions/group-recruitment'},
      {id: 'lets-play-together', name: "Browse Let's Play Together", url: '/discussions/lets-play-together'},
      {id: 'off-topic', name: 'Browse Off-Topic', url: '/discussions/off-topic'},
      {id: 'puzzles', name: 'Browse Puzzles', url: '/discussions/puzzles'},
      {id: 'uncategorized', name: 'Browse Uncategorized', url: '/discussions/uncategorized'}
    ],
    chfl_support_sg: [
      'new',
      {color: 'grey', description: "Check a user's real CV.", icon: 'fa-dollar', id: 'real-cv', name: 'Real CV', url: 'https://www.sgtools.info/real-cv'},
      {color: 'red', description: 'Check if a user has not activated wins.', icon: 'fa-exchange', id: 'activation', name: 'Not Activated Wins', url: 'https://www.sgtools.info/activation'},
      {color: 'red', description: 'Check if a user has multiple wins.', icon: 'fa-clone', id: 'multiple-wins', name: 'Multiple Wins', url: 'https://www.sgtools.info/multiple-wins'},
      {color: 'grey', description: 'Check the last bundled games.', icon: 'fa-percent', id: 'lastbundled', name: 'Last Bundled', url: 'https://www.sgtools.info/lastbundled'}
    ],
    chfl_help_sg: [
      'comment-formatting',
      'faq',
      'guidelines',
      {color: 'grey', description: "View SteamGifts' change log.", icon: 'fa-file-text-o', id: 'e9zDo', name: 'Change Log', url: '/discussion/e9zDo/'}
    ],
    chfl_account_sg: [
      'profile',
      'stats',
      'et',
      'ch',
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
      'steamgifts',
      '103582791432125620',
      'privacy-policy',
      'terms-of-service'
    ],
    chfl_trades_st: [
      'new',
      'user=[steamId]'
    ],
    chfl_account_st: [
      'user=[steamId]'
    ],
    chfl_footer_st: [
      'guidelines',
      'comment-formatting',
      'privacy-policy',
      'terms-of-service'
    ],
    cdr_days: 7,
    addNoCvGames_sg: false,
    lockGiveawayColumns_sg: false,
    staticPopups_width: '900px',
    hgr_removeOwned: true,
    giveawayColumns: ['ged', 'endTime', 'winners', 'startTime', 'touhou', 'inviteOnly', 'whitelist', 'group', 'regionRestricted', 'level'],
    giveawayPanel: ['ttec', 'gwc', 'gwr', 'gptw', 'gp', 'elgb', 'sgTools'],
    giveawayColumns_gv: ['sgTools', 'ged', 'time', 'touhou', 'inviteOnly', 'whitelist', 'group', 'regionRestricted', 'level'],
    giveawayPanel_gv: ['ttec', 'gwc', 'gwr', 'gptw', 'gp', 'elgb'],
    enableByDefault_sg: false,
    enableByDefault_st: false,
    cf_m_sg: true,
    checkVersion_sg: true,
    checkVersionMain_sg: true,
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
    staticPopups_sg: false,
    staticPopups_st: false,
    vai_i_sg: false,
    avatar: '',
    steamId: '',
    steamApiKey: '',
    username: '',
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
    as_searchAppId: false,
    autoBackup_days: 1,
    autoBackup_index: 0,
    autoSyncGroups: 0,
    autoSyncWhitelist: 0,
    autoSyncBlacklist: 0,
    autoSyncHiddenGames: 0,
    autoSyncGames: 0,
    autoSyncWonGames: 0,
    autoSyncReducedCvGames: 0,
    autoSyncNoCvGames: 0,
    autoSyncHltbTimes: 0,
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
    ds_option: 'sortIndex_asc',
    elgb_filters: '.|(bestof|(g(ood)?)?)(l(uck)?)?(h(ave)?)?(f(un)?)?|enjoy|(h(umble)?)?(b(undle)?)?(g(ift)?)?(l(ink)?)?',
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
    gc_categories: ['gc_gi', 'gc_r', 'gc_hltb', 'gc_fcv', 'gc_rcv', 'gc_ncv', 'gc_h', 'gc_i', 'gc_o', 'gc_w', 'gc_pw', 'gc_a', 'gc_sp', 'gc_mp', 'gc_sc', 'gc_tc', 'gc_l', 'gc_m', 'gc_ea', 'gc_lg', 'gc_rm', 'gc_dlc', 'gc_p', 'gc_rd', 'gc_g'],
    gc_indexes: {},
    gc_categories_gv: ['gc_gi', 'gc_r', 'gc_hltb', 'gc_fcv', 'gc_rcv', 'gc_ncv', 'gc_h', 'gc_i', 'gc_o', 'gc_w', 'gc_pw', 'gc_a', 'gc_sp', 'gc_mp', 'gc_sc', 'gc_tc', 'gc_l', 'gc_m', 'gc_ea', 'gc_lg', 'gc_rm', 'gc_dlc', 'gc_p', 'gc_rd', 'gc_g'],
    gc_indexes_gv: {},
    gc_o_altAccounts: [],
    gc_g_colors: [],
    gc_g_filters: '',
    gc_r_colors: [
      {bgColor: '#a34c25', color: '#ffffff', icon: 'thumbs-down', lower: 0, upper: 39},
      {bgColor: '#b9a074', color: '#ffffff', icon: 'minus-circle', lower: 40, upper: 69},
      {bgColor: '#66c0f4', color: '#ffffff', icon: 'thumbs-up', lower: 70, upper: 100}
    ],
    gc_fcvIcon: 'calendar',
    gc_rcvIcon: 'calendar-minus-o',
    gc_ncvIcon: 'calendar-times-o',
    gc_hIcon: 'eye-slash',
    gc_iIcon: 'ban',
    gc_oIcon: 'folder',
    gc_wIcon: 'heart',
    gc_pwIcon: 'gift',
    gc_aIcon: 'trophy',
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
    gc_fcvLabel: 'Full CV',
    gc_rcvLabel: 'Reduced CV',
    gc_ncvLabel: 'No CV',
    gc_hLabel: 'Hidden',
    gc_iLabel: 'Ignored',
    gc_oLabel: 'Owned',
    gc_wLabel: 'Wishlisted',
    gc_pwLabel: 'Previously Won',
    gc_aLabel: 'Achievements',
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
    gc_rdLabel: 'Mon DD, YYYY',
    gc_h_color: '#ffffff',
    gc_hltb_color: '#ffffff',
    gc_gi_color: '#ffffff',
    gc_fcv_color: '#ffffff',
    gc_rcv_color: '#ffffff',
    gc_ncv_color: '#ffffff',
    gc_w_color: '#ffffff',
    gc_o_color: '#ffffff',
    gc_pw_color: '#ffffff',
    gc_i_color: '#ffffff',
    gc_lg_color: '#ffffff',
    gc_rm_color: '#ffffff',
    gc_ea_color: '#ffffff',
    gc_tc_color: '#ffffff',
    gc_a_color: '#ffffff',
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
    gc_fcv_bgColor: '#641e16',
    gc_rcv_bgColor: '#641e16',
    gc_ncv_bgColor: '#641e16',
    gc_o_bgColor: '#16a085',
    gc_w_bgColor: '#3498db',
    gc_pw_bgColor: '#16a085',
    gc_i_bgColor: '#e74c3c',
    gc_lg_bgColor: '#555555',
    gc_rm_bgColor: '#e74c3c',
    gc_ea_bgColor: '#3498db',
    gc_tc_bgColor: '#2ecc71',
    gc_a_bgColor: '#145a32',
    gc_sp_bgColor: '#5eb2a1',
    gc_mp_bgColor: '#0e6251',
    gc_sc_bgColor: '#154360',
    gc_l_bgColor: '#f39c12',
    gc_m_bgColor: '#d35400',
    gc_dlc_bgColor: '#8e44ad',
    gc_p_bgColor: '#8e44ad',
    gc_rd_bgColor: '#7f8c8d',
    gc_g_bgColor: '#7f8c8d',
    gcl_index: 0,
    ge_b_bgColor: '#ddcccc',
    ge_g_bgColor: '#ccddcc',
    ge_p_bgColor: '#ccccdd',
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
    lastSyncWonGames: 0,
    lastSyncReducedCvGames: 0,
    lastSyncNoCvGames: 0,
    lastSyncHltbTimes: 0,
    lastSyncGiveaways: 0,
    leftButtonIds: ['wbsDesc', 'wbsAsc', 'wbc', 'ugs', 'tb', 'sks', 'rbp', 'namwc', 'mpp', 'mm', 'hgr', 'gv', 'gts', 'gf', 'ge', 'gas', 'ds', 'df', 'ctUnread', 'ctRead', 'ctGo', 'cs', 'cf', 'as', 'aic'],
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
    rightButtonIds: ['esResume', 'esPause', 'esRefresh', 'esRefreshAll', 'stbb', 'sttb'],
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
    syncGroups: true,
    syncWhitelist: true,
    syncBlacklist: true,
    syncHiddenGames: true,
    syncGames: true,
    syncWonGames: true,
    syncReducedCvGames: true,
    syncNoCvGames: true,
    syncHltbTimes: false,
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
    wbc_minPage: '',
    wbc_maxPage: '',
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
    wbh_w_color: '#ffffff',
    wbh_w_bgColor: '#228b22',
    wbh_b_color: '#ffffff',
    wbh_b_bgColor: '#ff4500'
  };
  
  oldValues = {
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
      wbc_checkBlacklist: 'wbc_checkWhitelist'
  };

  /**
   * @property {Parsedown} markdownParser
   */
  markdownParser;

  sg;
  st;

  currentVersion = '7.26.3';
  devVersion = '7.26.4 (Dev.5)';
  icon = 'data =image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqv8DCbP/Hgeq+CQIrf8iCK3/Igit/yIIrf8iB6//Iwit9x8Aqv8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKr0GAa2/c0DvfzfA7f83QO3/N0Dt/zdA7f83QO+/d4Gs/3OAKP1GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm/xQFs/n2Bcf//wW///8FwP//BcD//wW///8Fx///BbP69gC2/xUAAAAAAAAAAAAAAAAA/1UDFptOFxSZMxkLpJktAq720QW1+ugEsfvjA7b92wO2/dsEsfvjBbX66Aau/dEoiO4tUlLWGU5k3hdVVf8DEJxKHxWqT8cVrU7uE6VN0guqny0Apv8XAJfQGwBAVywAQFcsAJfQGwCx/xcogugtS2Lk0lBl6u5Qae7ISmPeHxagSSMVr07jF7lV/xOiSu0brgATAAAAAAAAAA8AAAC/AAAAwAAAABAAAAAAYznjEkth4OxWb/3/T2jv40lf4iMXnksiEq1O3RayUv8UpEnkEo0+HQAAABkAAABBAAAA8QAAAPEAAABBAAAAGUBSvxxOYeDjU2v0/05m7d1LYuEiF55LIhKtTt0Ws1L/FahN2gU1FTAAAADAAAAA7AAAAP0AAAD9AAAA7AAAAMAVG0owUGPm2lNr9P9OZu3dS2LhIheeSyISrU7dFrNS/xWoTdoFNRswAAAAvwAAAOsAAAD9AAAA/QAAAOsAAADAFRtKMFBj6NpTa/T/Tmbt3Uti4SIXnksiEq1O3RayUv8UpEnkEo0+HQAAABgAAABAAAAA8QAAAPEAAABBAAAAGT5PuR1OYeDjU2v0/05m7d1LYuEiFqBJIxWuT+QXuVX/E6JL7QC8XhMAAAAAAAAADwAAAL8AAAC/AAAAEAAAAAAOR/8SSWLh7FZv/f9PaO/jSV/iIxCUSh8Vrk7HFqxN7ROlS9JskzMt1XULGK12EhxGLgYsRy8GK612EhzVgAsYgmxxLU1i39JNZ+vtT2fwx0pj1h8AqlUDF65GFgqZUhlsiC0txH0T0s5/EujJgBPkz4QR28+EEdvJgBPkzn8Q6Md+E9KLdHosM1LWGUZo6BZVVf8DAAAAAAAAAAAAAAAA/2YAFMl9EvbgjRb/14gV/9eIFf/XiBX/14gV/9+NFv/KgBD254YAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL91FRjKgRHN1IgU3s+EEt3PhBLdz4QS3c+EEt3UiBTezYMRzcJ6FBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqgADxIARHr18FiO8eA8ivHgPIrx4DyK8eA8ivXwPI8SAER7/VQADAAAAAAAAAAAAAAAA78cAAPA3AAD4FwAABCAAADGOAAAE+AAAkBEAAJ55AACYOQAAlgEAAER4AAAXaAAATnoAAPgXAAD0JwAA69cAAA==';
  sgIcon = 'data =image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIUAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAACFAAAAAAAAAAAAAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAAAAAAAAAAACFAAAA+QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAAwAMAAMfjAADP8wAAz/MAAM/zAADP8wAAz/MAAM/zAADH4wAAwAMAAMADAAD//wAA//8AAA==';
  stIcon = 'data =image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SgWw+ucFsPrkBbD6SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWw+uYFsPr/BbD6/wWw+ucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFsPrmBbD6/wWw+v8FsPrmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SQWw+uYFsPrmBbD6SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKRLShSkS+cUpEvkFKRLSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4EpMYuDnTGLg5Exi4EoAAAAAAAAAABSkS+YUpEv/FKRL/xSkS+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYuDmTGLg/0xi4P9MYuDnAAAAAAAAAAAUpEvmFKRL/xSkS/8UpEvmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGLg5kxi4P9MYuD/TGLg5gAAAAAAAAAAFKRLSRSkS+YUpEvmFKRLSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4ElMYuDmTGLg5kxi4EkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0rGfRPnxn0T5MZ9E0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGfRPmxn0T/8Z9E//GfRPnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxn0T5sZ9E//GfRP/xn0T5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0nGfRPmxn0T5sZ9E0kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AAD8PwAA/D8AAPw/AAD//wAAh+EAAIfhAACH4QAAh+EAAP//AAD8PwAA/D8AAPw/AAD8PwAA//8AAA==';
  attachedImages = [];
  mainComments = [];
  popupComments = [];
  popups = [];
  openPopups = 0;
  ustCheckboxes = {};
  ustTickets = {};
  numUstTickets = 0;
  elgbCache = {};
  originalHash = location.hash;
  menuPath = null;
  settingsPath = null;
  importMenuPath = null;
  exportMenuPath = null;
  deleteMenuPath = null;
  gbPath = null;
  gedPath = null;
  gePath = null;
  glwcPath = null;
  userPath = null;
  groupPath = null;
  regionsPath = null;
  groupWishlistPath = null;
  mainPath = null;
  winnersPath = null;
  giveawaysPath = null;
  giveawayCommentsPath = null;
  discussionsTicketsPath = null;
  ticketsPath = null;
  tradesPath = null;
  discussionsTicketsTradesPath = null;
  discussionTicketTradeCommentsPath = null;
  archivePath = null;
  profilePath = null;
  giveawayPath = null;
  discussionPath = null;
  ticketPath = null;
  tradePath = null;
  discussionsPath = null;
  newDiscussionPath = null;
  editDiscussionPath = null;
  createdDiscussionsPath = null;
  newGiveawayPath = null;
  newTicketPath = null;
  wishlistPath = null;
  createdPath = null;
  wonPath = null;
  enteredPath = null;
  commentsPath = null;
  accountPath = null;
  aboutPath = null;
  whitelistPath = null;
  blacklistPath = null;
  inboxPath = null;
  groupsPath = null;
  pageTop = 0;
  commentsTop = 0;
  apPopouts = {};
  tsTables = [];
  currentUsers = {};
  currentGroups = {};
  mainGiveaways = [];
  mainDiscussions = [];
  mainUsers = [];
  mainGames = [];
  mainGroups = [];
  popupGiveaways = [];
  popupDiscussions = [];
  popupUsers = [];
  popupGames = [];
  popupGroups = [];
  mmWbcUsers = [];
  gameFeatures = [];
  groupFeatures = [];
  giveawayFeatures = [];
  discussionFeatures = [];
  profileFeatures = [];
  userFeatures = [];
  endlessFeatures = [];
  edited = {};
  games = [];

  /** @type {HTMLElement} */
  minimizeList;

  /** @type {HTMLElement} */
  minimizePanel;

  updateHiddenGames;

  /** @type {HTMLElement} */
  noCvButton;

  /** @type {HTMLElement} */
  sidebar;

  /** @type {string} */
  xsrfToken;

  /** @type {HTMLElement} */
  logoutButton;

  /** @type {string} */
  version;

  /** @type {string[]} */
  leftButtonIds;

  /** @type {EsgstStorage} */
  storage;

  /** @type {EsgstSettings} */
  settings = {};

  /** @type {string[]} */
  rightButtonIds;

  /** @type {string} */
  steamApiKey;

  groups = [];

  features;

  /** @type {boolean} */
  firstInstall;

  df_preset;

  df_presets;

  giveaways;

  radb;

  ugd_clearCache;

  ugd_forceUpdate = false;

  username;

  /** @type {HTMLElement} */
  mainContext;

  gc_g_colors = [];

  gc_o_altAccounts = [];

  dismissedOptions = [];

  gc_r_colors;

  /** @type {number} */
  ugd_playtime;

  /** @type {number} */
  cleanDiscussions_days;

  /** @type {number} */
  cleanEntries_days;

  /** @type {number} */
  cleanGiveaways_days;

  /** @type {number} */
  cleanSgCommentHistory_days;

  /** @type {number} */
  cleanTickets_days;

  /** @type {number} */
  cleanTrades_days;

  /** @type {number} */
  autoBackup_days;

  /** @type {number} */
  autoBackup_index;

  /** @type {boolean} */
  askFileName;

  pageOuterWrap;

  hideButtons;

  leftButtons;

  rightButtons;

  /** @type {EsgstHidingGame} */
  hidingGame;

  mainPageHeading;

  staticPopups;

  /** @type {string} */
  pageOuterWrapClass;

  /** @type {string} */
  pageHeadingClass;

  /** @type {string} */
  pageHeadingBreadcrumbsClass;

  /** @type {string} */
  footer;

  /** @type {string} */
  replyBox;

  /** @type {string} */
  cancelButtonClass;

  /** @type {string} */
  paginationNavigationClass;

  /** @type {string} */
  hiddenClass;

  /** @type {string} */
  selectedClass;

  /** @type {string} */
  currentPage;

  /** @type {string} */
  originalUrl;

  /** @type {HTMLElement} */
  favicon;

  /** @type {string} */
  originalTitle;

  /** @type {string} */
  searchUrl;

  /** @type {HTMLElement} */
  header;

  /** @type {HTMLElement} */
  headerNavigationLeft;

  /** @type {HTMLElement} */
  pagination;

  /** @type {HTMLElement} */
  featuredContainer;

  /** @type {HTMLElement} */
  paginationNavigation;

  /** @type {HTMLElement} */
  enterGiveawayButton;

  /** @type {HTMLElement} */
  leaveGiveawayButton;

  /** @type {HTMLElement} */
  activeDiscussions;

  /** @type {HTMLElement} */
  pinnedGiveaways;

  /** @type {boolean} */
  addNoCvGames;

  discussions;

  tickets;

  trades;

  users;

  /** @type {boolean} */
  busy;

  checkVersion;

  checkVersionMain;

  showChangelog;

  steamId;

  isRepositioning;

  /** @type {string} */
  name;

  showFeatureNumber;

  openSyncInTab;

  syncGroups;

  syncWhitelist;

  syncBlacklist;

  syncHiddenGames;

  syncWonGames;

  syncReducedCvGames;

  syncGiveaways;

  syncGames;

  syncNoCvGames;

  syncHltbTimes;

  getSyncGameNames;

  lastSyncGroups;

  lastSyncGames;

  /** @type {string[]} */
  giveawayColumns = [];

  /** @type {string[]} */
  giveawayPanel = [];

  /** @type {string[]} */
  giveawayColumns_gv = [];

  /** @type {string[]} */
  giveawayPanel_gv = [];

  gc_g_filters;

  gc_fcv_s;

  gc_fcv;

  gc_fcv_s_i;

  gc_fcvLabel;

  gc_fcvIcon;

  gc_rcv;

  gc_rcv_s;

  gc_rcvLabel;

  gc_rcv_s_i;

  gc_rcvIcon;

  gc_ncv;

  gc_ncv_s;

  gc_ncvLabel;

  gc_ncv_s_i;

  gc_ncvIcon;

  gc_hltb;

  gc_h;

  gc_hLabel;

  gc_h_s;

  gc_h_s_i;

  gc_hIcon;

  gc_i;

  gc_i_s;

  gc_iLabel;

  gc_i_s_i;

  gc_iIcon;

  gc_o;

  gc_o_s;

  gc_o_s_i;

  gc_oLabel;

  gc_oIcon;

  gc_o_a;

  gc_w_s;

  gc_w;

  gc_wLabel;

  gc_w_s_i;

  gc_pw;

  gc_pw_s;

  gc_pwLabel;

  gc_pw_s_i;

  gc_pwIcon;

  gc_gi;

  gc_r;

  gc_a_s;

  gc_aLabel;

  gc_a_s_i;

  gc_sp;

  gc_sp_s;

  gc_spLabel;

  gc_sp_s_i;

  gc_spIcon;

  gc_mp;

  gc_mp_s;

  gc_mpLabel;

  gc_mp_s_i;

  gc_sc;

  gc_sc_s;

  gc_sc_s_i;

  gc_scLabel;

  gc_tc;

  gc_tc_s;

  gc_tcLabel;

  gc_l;

  gc_l_s;

  gc_lLabel;

  gc_m;

  gc_m_s;

  gc_mLabel;

  gc_dlc;

  gc_dlc_s;

  gc_dlcLabel;

  gc_p;

  gc_p_s;

  gc_p_s_i;

  gc_pLabel;

  gc_pIcon;

  gc_ea;

  gc_ea_s;

  gc_eaLabel;

  gc_lg;

  gc_lg_s;

  gc_lgLabel;

  gc_rm;

  gc_rm_s;

  gc_rmLabel;

  gc_rd;

  gc_rdIcon;

  gc_g;

  df_m;

  gc_a;

  gc_aIcon;

  gc_wIcon;

  gc_mpIcon;

  gc_scIcon;

  gc_tc_s_i;

  gc_l_s_i;

  gc_m_s_i;

  gc_dlc_s_i;

  gc_ea_s_i;

  gc_lg_s_i;

  gc_rm_s_i;

  es_gf;

  cfh_img_choice;

  gwc_h_width;

  ff;

  ib;

  df_enable;

  gc_tcIcon;

  gc_lIcon;

  gc_dlcIcon;

  gc_eaIcon;

  gc_mIcon;

  gc_lgIcon;

  gc_rmIcon;

  gwr_h_width;

  namwc_h;

  namwc_h_m;

  namwc_h_f;

  namwc_h_i;

  wbh;

  namwc_checkNotActivated;

  namwc_checkMultiple;

  ust;

  wbh_w;

  wbh_b;

  nrf_searchMultiple;

  rwscvl_r;

  vrcv;

  ugd_achievements;

  ugd_getPlaytime;

  ugd_getAchievements;

  ugd_s;

  wbc_h;

  wbc_hb;

  wbcButton;

  wbc_checkSingle;

  wbc_checkSelected;

  wbc_checkBlacklist;

  wbc_checkAll;

  wbc_minPage;

  wbc_maxPage;

  wbc_checkPages;

  wbc_returnWhitelists;

  wbc_returnBlacklists;

  wbc_checkNew;

  wbc_pages;

  wbc_skipUsers;

  wbc_clearCache;

  wbc_n;

  wbm_useCache;

  /** @type {string[]} */
  wbm_tags = [];

  wbm_clearTags;

  staticPopups_f;

  lastBackup;

  mm;

  style;

  staticPopups_width;

  /** @type {HTMLElement} */
  customThemeElement;

  /** @type {HTMLElement} */
  theme;

  /** @type {HTMLElement} */
  customTheme;

  collapseSections;

  cleanDiscussions;

  cleanEntries;

  cleanGiveaways;

  cleanSgCommentHistory;

  cleanTickets;

  cleanDuplicates;

  cleanTrades;

  backupZip;

  /** @type {HTMLElement} */
  ustButton;


  modules;

  ch;

  df;

  adots;

  uf;

  gt;

  gpt;

  wbc;

  namwc;

  gv;

  constructor() {
    this.modules = modules;
    for (let module of this.modules) {
      module.setEsgst(this);
    }
    this.documentEvents.click = new Set;
    this.documentEvents.keydown = new Set;

    this.parameters = this.modules.common.getParameters();
    
    this.markdownParser = new Parsedown;
    this.sg = location.hostname.match(/www.steamgifts.com/);
    this.st = location.hostname.match(/www.steamtrades.com/);
    this.elgbCache = JSON.parse(this.modules.common.getLocalValue(`elgbCache`, `{"descriptions": {}, "timestamp": ${Date.now()}}`));

    this.menuPath = location.pathname.match(/^\/esgst\//);
    this.settingsPath = location.pathname.match(/^\/esgst\/settings/);
    this.importMenuPath = location.pathname.match(/^\/esgst\/(import|restore)/);
    this.exportMenuPath = location.pathname.match(/^\/esgst\/(backup|export)/);
    this.deleteMenuPath = location.pathname.match(/^\/esgst\/delete/);
    this.gbPath = location.pathname.match(/^\/esgst\/bookmarked-giveaways/);
    this.gedPath = location.pathname.match(/^\/esgst\/decrypted-giveaways/);
    this.gePath = location.pathname.match(/^\/esgst\/extracted-giveaways/);
    this.glwcPath = location.pathname.match(/^\/esgst\/glwc/);
    this.userPath = location.pathname.match(/^\/user\//);
    this.groupPath = location.pathname.match(/^\/group\//);
    this.regionsPath = location.pathname.match(/^\/regions\//);
    this.groupWishlistPath = location.pathname.match(/^\/group\/(.*?)\/wishlist/);
    this.mainPath = location.pathname.match(/^\/$/);
    this.winnersPath = location.pathname.match(/^\/giveaway\/.+\/winners/);
    this.giveawaysPath = location.href.match(/steamgifts.com($|\/$|\/giveaways(?!.*\/(new|wishlist|created|entered|won)))/);
    this.giveawayCommentsPath = location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups))/);
    this.discussionsTicketsPath = location.pathname.match(/^\/(discussions|support\/tickets)/);
    this.ticketsPath = location.pathname.match(/^\/support\/tickets/);
    this.tradesPath = location.href.match(/steamtrades.com($|\/$|\/trades)/);
    this.discussionsTicketsTradesPath = location.href.match(/steamtrades.com($|\/$)/) || location.pathname.match(/^\/(discussions|support\/tickets|trades)/);
    this.discussionTicketTradeCommentsPath = location.pathname.match(/^\/(discussion|support\/ticket|trade)\//);
    this.archivePath = location.pathname.match(/^\/archive/);
    this.profilePath = location.pathname.match(/^\/account\/settings\/profile/);
    this.giveawayPath = location.pathname.match(/^\/giveaway\//);
    this.discussionPath = location.pathname.match(/^\/discussion\//);
    this.ticketPath = location.pathname.match(/^\/support\/ticket\//);
    this.tradePath = location.pathname.match(/^\/trade\//);
    this.discussionsPath = location.pathname.match(/^\/discussions(?!\/(new|edit))/);
    this.newDiscussionPath = location.pathname.match(/^\/discussions\/new/);
    this.editDiscussionPath = location.pathname.match(/^\/discussions\/edit/);
    this.createdDiscussionsPath = location.pathname.match(/^\/discussions\/created/);
    this.newGiveawayPath = location.pathname.match(/^\/giveaways\/new/);
    this.newTicketPath = location.pathname.match(/^\/support\/tickets\/new/);
    this.wishlistPath = location.pathname.match(/^\/giveaways\/wishlist/);
    this.createdPath = location.pathname.match(/^\/giveaways\/created/);
    this.wonPath = location.pathname.match(/^\/giveaways\/won/);
    this.enteredPath = location.pathname.match(/^\/giveaways\/entered/);
    this.commentsPath = location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups))|discussion\/|support\/ticket\/|trade\/)/);
    this.accountPath = location.pathname.match(/^\/account/);
    this.aboutPath = location.pathname.match(/^\/(about|legal)/);
    this.whitelistPath = location.pathname.match(/^\/account\/manage\/whitelist/);
    this.blacklistPath = location.pathname.match(/^\/account\/manage\/blacklist/);
    this.inboxPath = location.pathname.match(/^\/messages/);
    this.groupsPath = location.pathname.match(/^\/account\/steam\/groups/);
  }
}

export {Esgst};
export default new Esgst;
