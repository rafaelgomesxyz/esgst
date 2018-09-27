/** module interface */
export default class Module {
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
    this.info.id += (new Date).getTime();
  }

  init() {
    this.info.load.call(this);
  }

  get type() {
    return this.info.type;
  }

  /**
   * @param {Esgst} esgst
   */
  setEsgst(esgst) {
    this.esgst = esgst;
    return this;
  }
}
