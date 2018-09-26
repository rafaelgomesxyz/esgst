/** module interface */
export default class Module {
  /** @type {Esgst} */
  esgst;

  /** @type {EsgstModuleInfo} */
  info = {
    id: 'unknown',
    type: '',
    load: () => {},
    name: 'Unknown'
  };

  constructor() {
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
