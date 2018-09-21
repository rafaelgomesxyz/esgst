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