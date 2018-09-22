/** module interface */
export default class Module {
  /** @type {Esgst} */
  esgst;

  info = {
    id: 'string',
    description: 'string',
    type: 'string',
    endless: 'boolean'
  };
  init() {}

  /**
   * @param {Esgst} esgst
   */
  setEsgst(esgst) {
    this.esgst = esgst;
    return this;
  }
}
