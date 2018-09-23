/**
 * @typedef {Object} EsgstContainer
 * @property {Common} common
 * @property {Esgst} esgst
 */
export default new class {
  add(objs) {
    for (let name in objs) {
      if (!objs.hasOwnProperty(name)) {
        continue;
      }

      this[name] = objs[name];
    }
  }
}
