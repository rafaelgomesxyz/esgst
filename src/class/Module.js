/**
 * @typedef {Object} EsgstModuleInfo
 * @property {String} id
 * @property {String} name
 * @property {String} description
 * @property {String} type
 * @property {Boolean} sg
 * @property {Boolean} st
 * @property {Boolean} sgt
 * @property {boolean} endless
 */

/** module interface */
class Module {
  constructor() {
    /** @type {Esgst} */
    this.esgst = null;
    /** @type {EsgstModuleInfo} */
    this.info = {
      id: 'unknown',
      type: '',
      name: 'Unknown'
    };
  }

  init() {
  }

  /**
   * @param {Esgst} esgst
   */
  setEsgst(esgst) {
    this.esgst = esgst;
    return this;
  }
}

export { Module };

