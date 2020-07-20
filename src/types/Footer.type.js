/**
 * @typedef {Object} IFooterNodes
 * @property {HTMLElement} inner
 * @property {HTMLElement} leftNav
 * @property {HTMLElement} nav
 * @property {HTMLElement} outer
 * @property {HTMLElement} rightNav
 */

/**
 * @typedef {Object} IFooterLinkContainer
 * @property {Object} nodes
 * @property {HTMLElement} [nodes.icon]
 * @property {HTMLElement} [nodes.link]
 * @property {HTMLElement} nodes.outer
 * @property {Object} data
 * @property {string} data.id
 * @property {string} [data.icon]
 * @property {string} data.name
 * @property {string} [data.url]
 */

/**
 * @typedef {Object} IFooterLinkContainerParams
 * @property {HTMLElement} [context]
 * @property {string} [icon]
 * @property {string} name
 * @property {string} [position]
 * @property {'left' | 'right'} [side]
 * @property {string} [url]
 */
