class _EventDispatcher {
  constructor() {
    /** @type {Object<number, Function>} */
    this.subscribers = {};
  }

  /**
   * @param {number} event
   * @param {Function} callback
   */
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }

    this.subscribers[event].push(callback);

    return this.unsubscribe.bind(this, event, callback);
  }

  /**
   * @param {number} event
   * @param {Function} callback
   */
  unsubscribe(event, callback) {
    if (!this.subscribers[event]) {
      return;
    }

    this.subscribers[event] = this.subscribers[event].filter(subscriber => subscriber !== callback);
  }

  /**
   * @param {number} event
   * @param {Array} params
   */
  async dispatch(event, ...params) {
    if (!this.subscribers[event]) {
      return;
    }

    for (const subscriber of this.subscribers[event]) {
      try {
        await subscriber(...params);
      } catch (error) {
        window.console.log(error.message);
      }
    }
  }
}

const EventDispatcher = new _EventDispatcher();

export { EventDispatcher };