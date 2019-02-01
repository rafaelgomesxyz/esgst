import _browser from 'webextension-polyfill';
import utils from './lib/jsUtils';

let browser = _browser;

if (typeof browser.runtime === `undefined`) {
  if (typeof self === `undefined`) {
    browser = {
      runtime: {}
    };
  } else {
    browser = {
      runtime: {
        onMessage: {
          addListener: callback => {
            self.port.on(`esgstMessage`, obj => callback(obj));
          }
        },
        getManifest: () => {
          return new Promise(resolve => {
            browser.runtime.sendMessage({
              action: `getPackageJson`
            }, result => {
              resolve(JSON.parse(result));
            });
          });
        },
        sendMessage: (obj, callback) => {
          obj.uuid = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, utils.createUuid.bind(utils));
          self.port.emit(obj.action, obj);
          self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {
            self.port.removeListener(`${obj.action}_${obj.uuid}_response`, `onResponse`);
            callback(result);
          });
        }
      }
    };
  }
}

if (typeof browser.runtime.getBrowserInfo === `undefined`) {
  browser.runtime.getBrowserInfo = () => ({
    name: `?`
  });
}

export default browser;