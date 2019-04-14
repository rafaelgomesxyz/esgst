import { utils } from './lib/jsUtils';

let _browser = null;

// @ts-ignore
if (typeof browser !== `undefined`) {
  // @ts-ignore
  _browser = browser;
} else if (typeof self !== `undefined`) {
  _browser = {
    runtime: {
      onMessage: {
        addListener: callback => {
          // @ts-ignore
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
          // @ts-ignore
          self.port.emit(obj.action, obj);
          // @ts-ignore
          self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {
            // @ts-ignore
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

console.log(_browser.runtime.getBrowserInfo);
if (typeof _browser.runtime.getBrowserInfo === `undefined`) {
  _browser.runtime.getBrowserInfo = () => Promise.resolve({ name: `?` });
}

export { _browser };