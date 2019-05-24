import { shared } from './Shared';
import { utils } from '../lib/jsUtils';

class ICloudStorage {
  static get REDIRECT_URL() { return `https://www.steamgifts.com/account/settings/profile`; }

  static getToken(key) {
    return new Promise(resolve => {
      ICloudStorage.checkToken(key, resolve);
    });
  }

  static async checkToken(key, resolve, startTime = Date.now(), timeout = 60000) {
    const token = await shared.common.getValue(key);
    if (utils.isSet(token)) {
      resolve(token);
    } else if (startTime - Date.now() > timeout) {
      resolve(null);
    } else {
      window.setTimeout(ICloudStorage.checkToken, 1000, key, resolve, startTime, timeout);
    }
  }
}

export { ICloudStorage };