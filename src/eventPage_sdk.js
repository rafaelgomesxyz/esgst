import JSZip from 'jszip';

const file = FileUtils.getFile(`ProfD`, [`esgst.sqlite`]);

const TYPE_SET = 0;
const TYPE_GET = 1;
const TYPE_DEL = 2;

let workers = [];

var button = buttons.ActionButton({
  id: "esgst",
  label: "ESGST",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("https://www.steamgifts.com/account/settings/profile?esgst=settings");
}

function handle_storage(operation, values) {
  return new Promise(resolve => {
    const dbConn = Services.storage.openDatabase(file);
    dbConn.executeSimpleSQL(`CREATE TABLE IF NOT EXISTS esgst (key TEXT NOT NULL, value TEXT)`)
    dbConn.executeSimpleSQL(`CREATE UNIQUE INDEX IF NOT EXISTS idx_esgst_key ON esgst (key)`);
    const statements = [];
    switch (operation) {
      case TYPE_SET: {
        const stmt = dbConn.createStatement(`INSERT OR REPLACE INTO esgst (key, value) VALUES (:key, :value)`);
        const params = stmt.newBindingParamsArray();
        for (const key in values) {
          const bp = params.newBindingParams();
          bp.bindByName(`key`, key);
          bp.bindByName(`value`, values[key]);
          params.addParams(bp);
        }
        stmt.bindParameters(params);
        statements.push(stmt);
        break;
      }
      case TYPE_GET: {
        if (values) {
          const stmt = dbConn.createStatement(`INSERT OR IGNORE INTO esgst (key, value) VALUES (:key, :value)`);
          const params = stmt.newBindingParamsArray();
          for (const key in values) {
            const bp = params.newBindingParams();
            bp.bindByName(`key`, key);
            bp.bindByName(`value`, values[key]);
            params.addParams(bp);
          }
          stmt.bindParameters(params);
          statements.push(stmt);
          const conditions = [];
          let i = 0;
          const n = Object.keys(values).length;
          while (i < n) {
            conditions.push(`key = :key${i++}`);
          }
          const select_stmt = dbConn.createStatement(`SELECT * FROM esgst WHERE ${conditions.join(` OR `)}`);
          i = 0;
          for (const key in values) {
            select_stmt.params[`key${i}`] = key;
          }
          statements.push(select_stmt);
        } else {
          const select_stmt = dbConn.createStatement(`SELECT * FROM esgst`);
          statements.push(select_stmt);
        }
        break;
      }
      case TYPE_DEL: {
        const conditions = [];
        let i = 0;
        const n = values.length;
        while (i < n) {
          conditions.push(`key = :key${i++}`);
        }
        const stmt = dbConn.createStatement(`DELETE FROM esgst WHERE ${conditions.join(` OR `)}`);
        i = 0;
        for (const key of values) {
          stmt.params[`key${i}`] = key;
        }
        statements.push(stmt);
        break;
      }
    }
    const output = {};
    dbConn.executeAsync(statements, statements.length, {
      handleCompletion: aReason => { },
      handleError: aError => { }, 
      handleResult: aResultSet => {
        let row;
        do {
          row = aResultSet.getNextRow();
          if (row) {
            output[row.getResultByName(`key`)] = row.getResultByName(`value`);
          }
        } while (row);
      }
    });
    dbConn.asyncClose(() => resolve(output));
  });
}

(async () => {
  const settings = JSON.parse((await handle_storage(TYPE_GET, { settings: `{}` })).settings);
  if (!settings.activateTab_sg && !settings.activateTab_st) {
    return;
  }
  // Get the currently active tab.
  const currentTab = tabs.activeTab;
  if (settings.activateTab_sg) {
    // Set the SG tab as active.
    activateTab(`steamgifts`);
  }
  if (settings.activateTab_st) {
    // Set the ST tab as active.
    activateTab(`steamtrades`);
  }
  // Go back to the previously active tab.  
  if (currentTab && currentTab.id) {
    currentTab.activate();
  }
})();

function sendMessage(action, values) {
  for (const worker of workers) {
    worker.port.emit(`esgstMessage`, JSON.stringify({ action, values }));
  }
}

async function getZip(data, fileName) {
  const zip = new JSZip();
  zip.file(fileName, data);
  return (await zip.generateAsync({
    compression: `DEFLATE`,
    compressionOptions: {
      level: 9
    },
    type: `blob`
  }));
}

async function readZip(data) {
  const zip = new JSZip(),
    contents = await zip.loadAsync(data),
    keys = Object.keys(contents.files),
    output = [];
  for (const key of keys) {
    output.push({
      name: key,
      value: await zip.file(key).async(`string`)
    });
  }
  return output;
}

function doFetch(parameters, request) {
  return new Promise(async resolve => {
    if (request.fileName) {
      parameters.body = await getZip(parameters.body, request.fileName);
    }

    let domain = request.url.match(/https?:\/\/(.+?)(\/.*)?$/)[1];
    let url = request.url.match(/(https?:\/\/.+?)(\/.*)?$/)[1];

    const cookieHeader = parameters.headers.Cookie;
    let setCookies = [];
    if (cookieHeader) {
      const expiresDate = new Date();
      expiresDate.setMinutes(expiresDate.getMinutes() + 15);
      const expires = expiresDate.getTime();
      setCookies = cookieHeader
        .split(/;\s/)
        .map(x => {
          const parts = x.match(/(.+?)=(.+?)/);
          return {
            expires, 
            host: domain,
            isHttpOnly: false,
            isSecure: false,
            isSession: false,
            name: parts[1],
            path: url,
            value: parts[2]
          };
        })
        .filter(x => !Services.cookies.cookieExists(x));
      for (const cookie of setCookies) {
        Services.cookies.add(cookie.host, cookie.path, cookie.name, cookie.value, cookie.isSecure, cookie.isHttpOnly, cookie.isSession, cookie.expires);
      }
    }

    const requestObj = Request({
      anonymous: parameters.credentials === `omit`,
      content: parameters.body || ``,
      headers: parameters.headers,
      url: request.url,
      onComplete: async response => {
        const responseText = request.blob
          ? (await readZip(response.text))[0].value
          : response.text;
        resolve(JSON.stringify({
          finalUrl: response.url,
          redirected: response.url !== request.url,
          responseText: responseText
        }));
      }
    });
    if (parameters.method === `GET`) {
      requestObj.get();
    } else if (parameters.method === `POST`) {
      requestObj.post();
    } else if (parameters.method === `PUT`) {
      requestObj.put();
    }
  });
}

function detachWorker(worker) {
  const index = workers.indexOf(worker);
  if (index !== -1) {
    workers.splice(index, 1);
  }
}

const locks = {};

function do_lock(lock) {
  return new Promise(resolve => {
    _do_lock(lock, resolve);
  });
}

function _do_lock(lock, resolve) {
  const now = Date.now();
  let locked = locks[lock.key];
  if (!locked || !locked.uuid || locked.timestamp < now - (lock.threshold + 15000)) {
    locks[lock.key] = {
      timestamp: now,
      uuid: lock.uuid
    };
    setTimeout(() => {
      locked = locks[lock.key];
      if (!locked || locked.uuid !== lock.uuid) {
        setTimeout(() => _do_lock(lock, resolve), 0);
      } else {
        resolve();
      }
    }, lock.threshold / 2);
  } else {
    setTimeout(() => _do_lock(lock, resolve), lock.threshold / 3);
  }
}

function do_unlock(lock) {
  if (locks[lock.key] && locks[lock.key].uuid === lock.uuid) {
    delete locks[lock.key];
  }
}

PageMod({
  include: [`*.steamgifts.com`, `*.steamtrades.com`],
  contentScriptFile: data.url(`esgst.js`),
  contentScriptWhen: `start`,
  onAttach: worker => {
    let keys, parameters, values;

    workers.push(worker);

    worker.on(`detach`, () => {
      detachWorker(worker, workers);
    });

    worker.port.on(`do_lock`, async request => {
      await do_lock(request.lock);
      worker.port.emit(`do_lock_${request.uuid}_response`, `null`);
    });

    worker.port.on(`do_unlock`, request => {
      do_unlock(request.lock);
      worker.port.emit(`do_unlock_${request.uuid}_response`, `null`);
    });

    worker.port.on(`delValues`, async request => {
      keys = JSON.parse(request.keys);
      await handle_storage(TYPE_DEL, keys);
      worker.port.emit(`delValues_${request.uuid}_response`, `null`);
      sendMessage(`delValues`, keys);
    });

    worker.port.on(`fetch`, async request => {
      parameters = JSON.parse(request.parameters);
      const response = await doFetch(parameters, request);      
      worker.port.emit(`fetch_${request.uuid}_response`, response);
    });

    worker.port.on(`getStorage`, async () => {
      const storage = await handle_storage(TYPE_GET, null);
      worker.port.emit(`getStorage_${request.uuid}_response`, JSON.stringify(storage));
    });

    worker.port.on(`reload`, () => {
      worker.port.emit(`reload_${request.uuid}_response`, `null`);
    });

    worker.port.on(`setValues`, async request => {
      values = JSON.parse(request.values);
      await handle_storage(TYPE_SET, values);
      worker.port.emit(`setValues_${request.uuid}_response`, `null`);
      sendMessage(`setValues`, values);
    });

    worker.port.on(`tabs`, request => {
      getTabs(request);
      worker.port.emit(`tabs_${request.uuid}_response`, `null`);
    });
  }
});

PageMod({
  include: [`*.sgtools.info`],
  contentScriptFile: data.url(`esgst_sgtools.js`),
  contentScriptWhen: `start`,
  onAttach: worker => {
    worker.port.on(`getStorage`, async () => {
      const storage = await handle_storage(TYPE_GET, null);
      worker.port.emit(`getStorage_${request.uuid}_response`, JSON.stringify(storage));
    });
  }
});

function getTabs(request) {
  let items = [
    {
      id: `inbox_sg`,
      pattern: /.*:\/\/.*\.steamgifts\.com\/messages.*/,
      url: `https://www.steamgifts.com/messages`
    },
    {
      id: `inbox_st`,
      pattern: /.*:\/\/.*\.steamtrades\.com\/messages.*/,
      url: `https://www.steamtrades.com/messages`
    },
    {
      id: `wishlist`,
      pattern: /.*:\/\/.*\.steamgifts\.com\/giveaways\/search\?.*type=wishlist.*/,
      url: `https://www.steamgifts.com/giveaways/search?type=wishlist`
    },
    {
      id: `won`,
      pattern: /.*:\/\/.*\.steamgifts\.com\/giveaways\/won.*/,
      url: `https://www.steamgifts.com/giveaways/won`
    }
  ];
  let any = false;
  for (let i = 0, n = items.length; i < n; i++) {
    let item = items[i];
    if (!request[item.id]) {
      continue;
    }
    let tab = workers.map(worker => worker.tab).filter(tab => tab.url.match(item.pattern))[0];
    if (tab && tab.id) {
      tab.activate();
      if (request.refresh) {
        tab.reload();
      }
    } else if (request.any) {
      any = true;
    } else {
      tabs.open(item.url);
    }
  }
  if (any) {
    let tab = workers.map(worker => worker.tab).filter(tab => tab.url.match(/.*:\/\/.*\.steamgifts\.com\/.*/))[0];
    if (tab && tab.id) {
      tab.activate();
    }
  }
}

function activateTab(host) {
  const tab = workers.map(worker => worker.tab).filter(tab => tab.url.match(new RegExp(`.*:\\/\\/.*\\.${host}\\.com\\/.*`)))[0];
  if (tab && tab.id) {
    tab.activate();
  }
}