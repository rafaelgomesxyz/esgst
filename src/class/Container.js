/**
 * @typedef {Object} EsgstContainer
 * @property {Common} common
 * @property {Esgst} esgst
 */
class Container {
  add(objs) {
    for (let name in objs) {
      if (!objs.hasOwnProperty(name)) {
        continue;
      }

      this[name] = objs[name];
    }
  }
}

const container = new Container;
export {container};
