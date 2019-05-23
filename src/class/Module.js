/**
 * @typedef {Object} EsgstModuleInfo
 * @property {String} id
 * @property {String} [name]
 * @property {Array|String} [description]
 * @property {String} [type]
 * @property {Boolean|Object} [sg]
 * @property {Boolean|Object} [st]
 * @property {Boolean|Object} [sgt]
 * @property {boolean} [endless]
 */

/** module interface */
class Module {
  constructor() {
    /**
     * @type {import('./Esgst').esgst}
     */
    this.esgst = null;
    /** @type {EsgstModuleInfo} */
    this.info = {
      id: 'unknown',
      name: 'Unknown',
      type: ''
    };
  }

  init() {
  }

  setEsgst(esgst) {
    this.esgst = esgst;
    return this;
  }
}

export { Module };

