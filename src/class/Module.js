/** module interface */
class Module {
  constructor() {
    /** @type {Esgst} */
    this.esgst = null;
    /** @type {EsgstModuleInfo} */
    this.info = {
      id: 'unknown',
      type: '',
      load: () => {
      },
      name: 'Unknown'
    };
  }

  init() {
    if (!this.info.load) {
      return;
    }
    return this.info.load.call(this);
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

