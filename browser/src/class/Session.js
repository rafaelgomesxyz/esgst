import { Namespaces } from './Namespaces';

class ISession {
  /**
   * @param {string} text
   * @returns {string}
   */
  static extractXsrfToken(text) {
    return text.match(/xsrf_token=(.+)/)[1];
  }
}

class _Session extends ISession {
  constructor() {
    super();

    /** @type {ISessionCounters} */
    this.counters = {
      created: 0,
      level: {
        base: 0,
        full: 0,
      },
      messages: 0,
      points: 0,
      reputation: {
        negative: 0,
        positive: 0,
      },
      won: 0,
      wonDelivered: false,
    };

    /** @type {boolean} */
    this.isLoggedIn = false;

    /** @type {number} */
    this.namespace = Namespaces.SG;

    /** @type {IUserData} */
    this.user = null;

    /** @type {string} */
    this.xsrfToken = null;
  }

  init() {
    switch (window.location.hostname) {
      case 'www.steamgifts.com': {
        this.namespace = Namespaces.SG;

        break;
      }

      case 'www.steamtrades.com': {
        this.namespace = Namespaces.ST;

        break;
      }

      case 'www.sgtools.info': {
        this.namespace = Namespaces.SGT;

        break;
      }

      default: {
        throw 'Invalid namespace.';
      }
    }
  }
}

const Session = new _Session();

export { ISession, Session };