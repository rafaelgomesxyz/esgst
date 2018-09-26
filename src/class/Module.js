/** module interface */
export default class Module {
  /** @type {Esgst} */
  esgst;

  // it just shows expected structure, not default or inherited values
  info = {
    id: 'string',
    description: 'string',
    type: 'string',
    endless: 'boolean',
    load: 'function'
  };

  init() {
    this.info.load.call(this);
  }

  /**
   * @param {Esgst} esgst
   */
  setEsgst(esgst) {
    this.esgst = esgst;
    return this;
  }
}
