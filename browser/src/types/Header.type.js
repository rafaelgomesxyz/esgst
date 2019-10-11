/**
 * @typedef {Object} IHeaderNodes
 * @property {HTMLElement} inner
 * @property {HTMLElement} leftNav
 * @property {HTMLElement} [logo]
 * @property {HTMLElement} nav
 * @property {HTMLElement} outer
 * @property {HTMLElement} rightNav
 */

/**
 * @typedef {Object} IHeaderButtonContainer
 * @property {Object} nodes
 * @property {HTMLElement} [nodes.absoluteDropdown]
 * @property {HTMLElement} [nodes.arrow]
 * @property {HTMLElement} [nodes.arrowIcon]
 * @property {HTMLElement} [nodes.button]
 * @property {HTMLElement} [nodes.buttonIcon]
 * @property {HTMLElement} [nodes.buttonImage]
 * @property {HTMLElement} [nodes.buttonName]
 * @property {HTMLElement} [nodes.counter]
 * @property {HTMLElement} [nodes.level]
 * @property {HTMLElement} nodes.outer
 * @property {HTMLElement} [nodes.points]
 * @property {HTMLElement} [nodes.relativeDropdown]
 * @property {HTMLElement} [nodes.reputation]
 * @property {Object} data
 * @property {string} data.id
 * @property {string} [data.buttonIcon]
 * @property {string} [data.buttonImage]
 * @property {string} data.buttonName
 * @property {number} [data.counter]
 * @property {boolean} [data.isActive]
 * @property {boolean} [data.isDropdown]
 * @property {boolean} [data.isFlashing]
 * @property {boolean} [data.isNotification]
 * @property {string} [data.url]
 * @property {Object<string, IHeaderDropdownItem>} [dropdownItems]
 * @property {import('../components/User').IUser} [user]
 */

/**
 * @typedef {Object} IHeaderButtonContainerParams
 * @property {string} [buttonIcon]
 * @property {string} [buttonImage]
 * @property {string} buttonName
 * @property {string} [context]
 * @property {string} [counter]
 * @property {boolean} [isActive]
 * @property {boolean} [isDropdown]
 * @property {boolean} [isFlashing]
 * @property {boolean} [isNotification]
 * @property {Function} [onClick]
 * @property {string} [position]
 * @property {'left' | 'right'} [side]
 * @property {string} [url]
 * @property {Object<string, IHeaderDropdownItemParams>} [dropdownItems]
 */

/**
 * @typedef {Object} IHeaderDropdownItem
 * @property {Object} nodes
 * @property {HTMLElement} [nodes.description]
 * @property {HTMLElement} nodes.icon
 * @property {HTMLElement} nodes.name
 * @property {HTMLElement} nodes.outer
 * @property {HTMLElement} [nodes.summary]
 * @property {Object} data
 * @property {string} data.id
 * @property {string} [data.description]
 * @property {string} data.icon
 * @property {string} data.name
 * @property {string} data.url
 */

/**
 * @typedef {Object} IHeaderDropdownItemParams
 * @property {string} [buttonContainerId]
 * @property {string} [description]
 * @property {string} icon
 * @property {string} name
 * @property {Function} [onClick]
 * @property {string} url
 */