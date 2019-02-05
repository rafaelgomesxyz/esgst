import { utils } from './lib/jsUtils';

let _browser = null;

if (typeof browser !== `undefined`) {
  _browser = browser;
} else if (typeof self !== `undefined`) {
  _browser = {
    runtime: {
      onMessage: {
        addListener: callback => {
          self.port.on(`esgstMessage`, obj => callback(obj));
        }
      },
      getManifest: () => {
        return new Promise(resolve => {
          _browser.runtime.sendMessage({
            action: `getPackageJson`
          }).then(result => {
            resolve(JSON.parse(result));
          });
        });
      },
      sendMessage: obj => {
        return new Promise(resolve => {
          obj.uuid = `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, utils.createUuid.bind(utils));
          self.port.emit(obj.action, obj);
          self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {
            self.port.removeListener(`${obj.action}_${obj.uuid}_response`, `onResponse`);
            resolve(result);
          });
        });
      }
    }
  };
} else {
  _browser = {
    runtime: {}
  };
}

if (typeof _browser.runtime.getBrowserInfo === `undefined`) {
  _browser.runtime.getBrowserInfo = () => ({
    name: `?`
  });
}

export default _browser;