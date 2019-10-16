class _Utils {
  /**
   * @param timestamp
   * @param [until]
   * @returns {string}
   */
  getTimeSince(timestamp, until) {
    let n, s;
    s = Math.floor((until ? (timestamp - Date.now()) : (Date.now() - timestamp)) / 1000);
    n = Math.floor(s / 31104000);
    if (n >= 1) {
      return `${n} year${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 2592000);
    if (n >= 1) {
      return `${n} month${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 86400);
    if (n >= 1) {
      return `${n} day${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 3600);
    if (n >= 1) {
      return `${n} hour${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s / 60);
    if (n >= 1) {
      return `${n} minute${n === 1 ? '' : 's'}`;
    }
    n = Math.floor(s);
    return `${n} second${n === 1 ? '' : 's'}`;
  }
}

const Utils = new _Utils();

export { Utils };