/**
 * @typedef {Object} User
 * @property {string} username
 */

/**
 * @typedef {Object} PopupObject
 * @property {HTMLElement} progress
 * @property {HTMLElement} overallProgress
 * @property {HTMLElement} activated
 * @property {HTMLElement} notMultiple
 * @property {HTMLElement} notActivated
 * @property {HTMLElement} multiple
 * @property {HTMLElement} unknown
 * @property {HTMLElement} activatedCount
 * @property {HTMLElement} notMultipleCount
 * @property {HTMLElement} notActivatedCount
 * @property {HTMLElement} multipleCount
 * @property {HTMLElement} unknownCount
 * @property {HTMLElement} activatedUsers
 * @property {HTMLElement} multipleCount
 * @property {HTMLElement} notMultipleUsers
 * @property {HTMLElement} notActivatedUsers
 * @property {HTMLElement} multipleUsers
 * @property {HTMLElement} unknownUsers
 */

/**
 * @typedef {Object} PopupComplexObject
 * @property {boolean} isCanceled
 * @property {boolean} isMenu
 * @property {HTMLElement} button
 * @property {PopupObject} popup
 * @property {User} user
 */

/**
 * @typedef {Object} NRF
 * @property {HTMLElement} Progress
 * @property {number} Request
 * @property {number} Save
 * @property {boolean} Canceled
 * @property {HTMLElement} OverallProgress
 * @property {HTMLElement} Results
 * @property {Popup} popup
 */

/**
 * @typedef {Object} Playtime
 * @property {number} appid
 * @property {number} playtime_2weeks
 * @property {number} playtime_forever
 */

/**
 * @typedef {Object} PlayerAchievementsSteamApiResponse
 * @property {PlayerStatsSteamApi} playerstats
 */

/**
 * @typedef {Object} PlayerStatsSteamApi
 * @property {boolean} success
 * @property {AchievementsSteamApi[]} achievements
 */

/**
 * @typedef {Object} AchievementsSteamApi
 * @property {boolean} achieved
 */

/**
 * @typedef {Object} Response
 * @property {string} responseText
 */

/**
 * @typedef {Object} SuspensionsApiReponse
 * @property {number[]} suspensions
 */

/**
 * @typedef {Object} UsernamesApiResponse
 * @property {string[]} Usernames
 */

/**
 * @typedef {Object} WhiteBlacklistChecker
 * @property {number} Request
 * @property {number} Save
 * @property {WhiteBlacklistCheckerUser} User
 * @property {boolean} ShowResults
 * @property {boolean} Canceled
 * @property {boolean} Update
 * @property {HTMLElement} Progress
 * @property {HTMLElement} OverallProgress
 * @property {Popup} popup
 * @property {string[]} Users
 * @property {HTMLElement} whitelisted
 * @property {HTMLElement} blacklisted
 * @property {HTMLElement} none
 * @property {HTMLElement} notBlacklisted
 * @property {HTMLElement} unknown
 * @property {HTMLElement} whitelistedCount
 * @property {HTMLElement} whitelistedUsers
 * @property {HTMLElement} whitelistedUsers
 * @property {HTMLElement} noneUsers
 * @property {HTMLElement} blacklistedUsers
 * @property {HTMLElement} notBlacklistedUsers
 * @property {HTMLElement} unknownUsers
 * @property {HTMLElement} blacklistedCount
 * @property {HTMLElement} noneCount
 * @property {HTMLElement} notBlacklistedCount
 * @property {HTMLElement} unknownCount
 * @property {string} lastPage
 * @property {boolean} manualSkip
 */

/**
 * @typedef {Object} WhiteBlacklistCheckerUser
 * @property {string} Username
 * @property {string} ID
 * @property {string} SteamID64
 */

/**
 * @typedef {Object} WhiteBlacklistGiveaways
 * @property {string} whitelistGiveaway
 * @property {string[]} groupGiveaways
 */

/**
 * @typedef {Object} ButtonDetails
 * @property {boolean} isSwitch
 * @property {number} orderId
 * @property {number} id
 * @property {number} featureId
 * @property {string} title
 * @property {string[]} icons
 * @property {HTMLElement} context
 *
 */

/**
 * @typedef {Object} EsgstStorage
 * @property {boolean} patreonNotice
 * @property {string} tickets
 */

/**
 * @typedef {Object} EsgstSettings
 * @property {boolean} groupPopupDismissed
 * @property {boolean} esgst_st
 * @property {boolean} at_g_sg
 * @property {boolean} egh_t_sg
 * @property {boolean} es_l_d_sg
 * @property {boolean} es_c_d_sg
 * @property {boolean} es_d_d_sg
 * @property {boolean} es_g_d_sg
 * @property {boolean} es_l_d_st
 * @property {boolean} es_c_d_st
 * @property {boolean} es_t_d_st
 * @property {boolean} gc_t_sg
 * @property {boolean} gc_gi_t_sg
 * @property {boolean} gc_gi_cew_sg
 * @property {boolean} gc_o_altAccounts
 * @property {boolean} gc_o_t_sg
 * @property {boolean} gt_t_sg
 * @property {number} exportBackupIndex
 * @property {boolean} syncGroups
 * @property {boolean} syncWhitelist
 * @property {boolean} syncBlacklist
 * @property {boolean} syncHiddenGames
 * @property {boolean} syncWonGames
 * @property {boolean} syncReducedCvGames
 * @property {boolean} syncGiveaways
 * @property {boolean} syncGames
 * @property {boolean} syncNoCvGames
 * @property {boolean} syncHltbTimes
 * @property {boolean} importAndMerge
 * @property {boolean} exportBackup
 * @property {boolean} cfh_img_remember
 *
 * --? from exportSettings. It may be inaccurate
 * @property {string} avatar
 * @property {number} lastSync
 * @property {string} steamApiKey
 * @property {number} steamId
 * @property {number} syncFrequency
 * @property {string} username
 */

/**
 * @typedef {Object} EsgstSyncer
 * @property {HTMLElement} results
 * @property {HTMLElement} progress
 * @property {boolean} canceled
 * @property {EsgstSyncerParameters} parameters
 * @property {boolean} autoSync
 * @property {Object} groups
 * @property {Object} currentGroups
 * @property {EsgstSyncerGroup[]} savedGroups
 * @property {Object} newGroups
 * @property {Object[]} html
 * @property {Object[]} users
 * @property {EsgstSyncerHiddenGames} hiddenGames
 * @property {Process} process
 * @property {Object[]} switches
 * @property {Object} set
 * @property {Popup} popup
 */

/**
 * @typedef {Object} EsgstSyncerParameters
 * @property Groups
 * @property Whitelist
 * @property Blacklist
 * @property HiddenGames
 * @property WonGames
 * @property ReducedCvGames
 * @property NoCvGames
 * @property HltbTimes
 *
 */

/**
 * @typedef {Object} EsgstSyncerGroup
 * @property {string} steamId
 * @property {string} code
 */

/**
 * @typedef {Object} EsgstSyncerHiddenGames
 * @property apps
 * @property subs
 */

/**
 * @typedef {Object} ZipFile
 * @property {Object} files
 */

/**
 * @typedef {Object} EsgstHidingGame
 * @property {number} id
 * @property {string} type
 */