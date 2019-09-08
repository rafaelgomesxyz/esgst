import { shared } from './class/Shared';
import { utils } from './lib/jsUtils';

let _browser = null;

// @ts-ignore
if (typeof browser !== 'undefined') {
  // @ts-ignore
  _browser = browser;
// @ts-ignore
} else if (typeof GM !== 'undefined' || typeof GM_info !== 'undefined') {
  let tdsData = [];

  _browser = {
    gm: null,
    runtime: {
      onMessage: {
        addListener: callback => _browser.gm.listener = callback
      },
      getBrowserInfo: () => Promise.resolve({ name: 'userscript' }),
      getManifest: () => Promise.resolve(_browser.gm.info.script),
      sendMessage: obj => {
        return new Promise(async resolve => {
          switch (obj.action) {
            case 'get-tds':
              resolve(JSON.stringify(tdsData));

              break;
            case 'notify-tds':
              tdsData = JSON.parse(obj.data);

              _browser.gm.listener(JSON.stringify({
                action: 'notify-tds',
                values: tdsData
              }));

              resolve();

              break;
            case 'permissions_contains':
              resolve(true);
              break;
            case 'permissions_request':
              resolve(true);
              break;
            case 'permissions_remove':
              resolve();
              break;
            case 'getBrowserInfo': {
              const browserInfo = await _browser.runtime.getBrowserInfo();
              resolve(JSON.stringify(browserInfo));
              break;
            }
            case 'do_lock': {
              const lock = JSON.parse(obj.lock);

              resolve(await _browser.gm.doLock(lock));

              break;
            }
            case 'update_lock': {
              const lock = JSON.parse(obj.lock);
              const locked = JSON.parse(await _browser.gm.getValue(lock.key, '{}'));
              if (locked.uuid === lock.uuid) {
                locked.timestamp = Date.now();
                await _browser.gm.setValue(lock.key, JSON.stringify(locked));
              }
              resolve();
              break;
            }
            case 'do_unlock': {
              const lock = JSON.parse(obj.lock);
              await _browser.gm.setValue(lock.key, '{}');
              resolve();
              break;
            }
            case 'fetch': {
              const parameters = JSON.parse(obj.parameters);
              if (parameters.credentials === 'omit') {
                parameters.headers.Cookie = '';
              }
              _browser.gm.xmlHttpRequest({
                binary: !!obj.fileName,
                data: obj.fileName
                  ? await shared.common.getZip(parameters.body, obj.fileName, 'binarystring')
                  : parameters.body,
                headers: parameters.headers,
                method: parameters.method,
                overrideMimeType: obj.blob ? `text/plain; charset=x-user-defined` : '',
                url: obj.url,
                onload: async response => {
                  if (obj.blob) {
                    response.responseText = (await shared.common.readZip(response.responseText))[0].value;
                  }
                  resolve(response);
                },
                onerror: response => resolve({ error: response.responseText })
              });
              break;
            }
          }
        });
      }
    },
    storage: {
      local: {
        get: async () => {
          const keys = await _browser.gm.listValues();
          const promises = [];
          const storage = {};
          for (const key of keys) {
            const promise = _browser.gm.getValue(key);
            promise.then(value => storage[key] = value);
            promises.push(promise);
          }
          await Promise.all(promises);

          if (!storage.settings) {
            _browser.gm.listener(JSON.stringify({
              action: 'isFirstRun'
            }));
          }

          return storage;
        },
        remove: async keys => {
          const promises = [];
          for (const key of keys) {
            promises.push(_browser.gm.deleteValue(key));
          }
          await Promise.all(promises);
          await _browser.gm.setValue('storageChanged', JSON.stringify(Date.now()));
        },
        set: async values => {
          const promises = [];
          for (const key in values) {
            if (values.hasOwnProperty(key)) {
              promises.push(_browser.gm.setValue(key, values[key]));
            }
          }
          await Promise.all(promises);
          await _browser.gm.setValue('storageChanged', JSON.stringify(Date.now()));
        }
      },
      onChanged: {
        addListener: () => {}
      }
    }
  };
  // @ts-ignore
  if (typeof GM === 'undefined') {
    // polyfill for userscript managers that do not support the gm-dot api
    _browser.gm = {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      addValueChangeListener: GM_addValueChangeListener,
      // @ts-ignore
      deleteValue: GM_deleteValue,
      // @ts-ignore
      getValue: GM_getValue,
      // @ts-ignore
      info: GM_info,
      // @ts-ignore
      listValues: GM_listValues,
      // @ts-ignore
      setValue: GM_setValue,
      // @ts-ignore
      xmlHttpRequest: GM_xmlhttpRequest
    };
    for (const key in _browser.gm) {
      const old = _browser.gm[key];
      _browser.gm[key] = (...args) =>
        new Promise((resolve, reject) => {
          try {
            resolve(old.apply(this, args));
          } catch (e) {
            reject(e);
          }
        });
    }
  } else {
    // @ts-ignore
    _browser.gm = GM;
  }
  _browser.gm.lastUpdate = 0;
  if (!_browser.gm.addValueChangeListener) {
    _browser.gm.hasValueChanged = async (key, oldValue, callback) => {
      const newValue = await _browser.gm.getValue(key);
      if (newValue !== oldValue) {
        callback(key, oldValue, newValue, true);
        oldValue = newValue;
      }
      window.setTimeout(_browser.gm.hasValueChanged, 5000, key, oldValue, callback);
    };
    _browser.gm.addValueChangeListener = async (key, callback) => {
      const oldValue = await _browser.gm.getValue(key);
      _browser.gm.hasValueChanged(key, oldValue, callback);
    };
  }
  _browser.gm.addValueChangeListener('storageChanged', async (name, oldValue, newValue, remote) => {
    if (!remote || !newValue || newValue === 'undefined') {
      return;
    }
    const lastUpdate = JSON.parse(newValue);
    if (lastUpdate > _browser.gm.lastUpdate) {
      _browser.gm.lastUpdate = lastUpdate;

      const storage = await _browser.storage.local.get(null);
      const changes = {};
      for (const key in storage) {
        changes[key] = {
          newValue: storage[key]
        };
      }
      _browser.gm.listener(JSON.stringify({
        action: 'storageChanged',
        values: { changes, areaName: 'local' }
      }));
    }
  });
  _browser.gm.doLock = async (lock) => {
    let locked = JSON.parse(await _browser.gm.getValue(lock.key, '{}'));
    if (!locked || !locked.uuid || locked.timestamp < Date.now() - (lock.threshold + (lock.timeout || 15000))) {
      await _browser.gm.setValue(lock.key, JSON.stringify({
        timestamp: Date.now(),
        uuid: lock.uuid
      }));
      await shared.common.timeout(lock.threshold / 2);
      locked = JSON.parse(await _browser.gm.getValue(lock.key, '{}'));
      if (!locked || locked.uuid !== lock.uuid) {
        if (!lock.lockOrDie) {
          return _browser.gm.doLock(lock);
        }

        return 'false';
      }

      return 'true';
    }
    
    if (!lock.lockOrDie) {
      await shared.common.timeout(lock.threshold / 3);
      return _browser.gm.doLock(lock);
    }

    return 'false';
  };
} else if (typeof self !== 'undefined') {
  _browser = {
    gm: null,
    runtime: {
      onMessage: {
        addListener: callback => {
          // @ts-ignore
          self.port.on('esgstMessage', obj => callback(obj));
        }
      },
      getManifest: () => {
        return new Promise(resolve => {
          _browser.runtime.sendMessage({
            action: 'getPackageJson'
          }).then(result => {
            resolve(JSON.parse(result));
          });
        });
      },
      sendMessage: obj => {
        return new Promise(resolve => {
          obj.uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, utils.createUuid.bind(utils));
          // @ts-ignore
          self.port.emit(obj.action, obj);
          // @ts-ignore
          self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {
            // @ts-ignore
            self.port.removeListener(`${obj.action}_${obj.uuid}_response`, 'onResponse');
            resolve(result);
          });
        });
      }
    },
    storage: {
      local: {
        get: async () => {
          return JSON.parse(await _browser.runtime.sendMessage({
            action: 'getStorage'
          }));
        },
        remove: async keys => {
          await _browser.runtime.sendMessage({
            action: 'delValues',
            values: JSON.stringify(keys)
          });
        },
        set: async values => {
          await _browser.runtime.sendMessage({
            action: 'setValues',
            values: JSON.stringify(values)
          });
        }
      },
      onChanged: {
        addListener: () => {}
      }
    }
  };
} else {
  _browser = {
    runtime: {}
  };
}

if (typeof _browser.runtime.getBrowserInfo === 'undefined') {
  _browser.runtime.getBrowserInfo = () => Promise.resolve({ name: '?' });
}

export { _browser };