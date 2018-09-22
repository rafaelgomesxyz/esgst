/**
 * @typedef {Object} Module
 * @property {Esgst} esgst
 */

/**
 * @typedef {Object} Esgst
 * @property {boolean} codb
 * @property {boolean} radb
 * @property {boolean} ttpcc
 * @property {boolean} gch
 * @property {boolean} gm_enable
 * @property {string[]} giveawayHeading
 * @property {string[]} giveawayHeading_gv
 * @property {string[]} giveawayLinks
 * @property {string[]} giveawayLinks_gv
 * @property {Popup} gfPopup
 * @property {string[]} gc_categories_ids
 * @property {string} gc_fLabel
 * @property {string} gc_fIcon
 * @property {Object} pointsPlayer
 * @property {Object} inboxPlayer
 * @property {Object} wishlistPlayer
 * @property {Object} wonPlayer
 * @property {Object} parameters
 * @property {string} parameters.level_min
 * @property {string} parameters.level_max
 * @property {string} parameters.entry_min
 * @property {string} parameters.entry_max
 * @property {string} parameters.copy_min
 * @property {string} parameters.copy_max
 * @property {string} parameters.point_min
 * @property {string} parameters.point_max
 * @property {string} parameters.release_date_min
 * @property {string} parameters.release_date_max
 * @property {string} parameters.region_restricted
 * @property {HTMLElement} giveawayErrorButton
 */

/**
 * @typedef {Object} MR
 * @property {HTMLElement} Context
 * @property {HTMLElement} Comment
 * @property {Node} Container
 * @property {Element} Timestamp
 * @property {string} ParentID
 * @property {string} URL
 * @property {string} url
 * @property {string} TradeCode
 * @property {string} Username
 * @property {Node} Children
 * @property {HTMLElement} Box
 * @property {HTMLElement} Description
 * @property {HTMLElement} Cancel
 * @property {HTMLElement} Edit
 * @property {HTMLElement} delete
 * @property {HTMLElement} undelete
 */

/**
 * @typedef {Object} gcResponseData
 * @property {string[]} categories
 * @property {Object} achievements
 * @property {number} achievements.total
 * @property {boolean} is_free
 * @property {string} type
 * @property {Object} fullgame
 * @property {string} fullgame.appid
 * @property {string[]} dlc
 * @property {object[]} genres
 * @property {object} platforms
 * @property {string} name
 * @property {object} price
 * @property {object} price_overview
 * @property {object} release_date
 * @property {object} apps
 * @property {string[]} packages
 */

/**
 * @typedef {Object} MM
 * @property {Object} button
 * @property {Object} checkboxes
 * @property {Object} counters
 * @property {Object} counterElements
 * @property {string} scope
 * @property {Popout} popout
 * @property {HTMLElement} headings
 * @property {HTMLElement} sections
 * @property {HTMLElement} textAreaGiveaways
 */

/**
 * @typedef {Object} appListResponse
 * @property {Object} applist
 */

/**
 * @typedef {Object} rgAppInfoResponse
 * @property {string} capsule
 * @property {string} name
 */

/**
 * @typedef {object} ElementsArrayItem
 * @property {string} [text]
 * @property {string} type
 * @property {object} [attributes]
 * @property {string} [attributes.class]
 * @property {string} [attributes.value]
 * @property {ElementsArrayItem[]} [children]
 */

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