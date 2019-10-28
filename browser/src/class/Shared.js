class _Shared {
  constructor() {
    /**
     * @type {import('../modules/Common').common}
     */
    this.common = null;

    /**
     * @type {import('./Esgst').esgst}
     */
    this.esgst = null;

    /**
     * @type {import('../components/Header').IHeader}
     */
    this.header = null;

    /**
     * @type {import('../components/Footer').IFooter}
     */
    this.footer = null;
  }

  add(objs) {
    for (let name in objs) {
      if (!objs.hasOwnProperty(name)) {
        continue;
      }

      this[name] = objs[name];
    }
  }
}

const Shared = new _Shared();

export { Shared };

