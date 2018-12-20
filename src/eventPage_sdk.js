import JSZip from 'jszip';

let workers = [];

(() => {
  const settings = ss.storage.settings ? JSON.parse(ss.storage.settings) : {};
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

PageMod({
  include: [`*.steamgifts.com`, `*.steamtrades.com`],
  contentScriptFile: data.url(`esgst.js`),
  contentScriptWhen: `start`,
  onAttach: worker => {
    let key, keys, parameters, values;

    workers.push(worker);

    worker.on(`detach`, () => {
      detachWorker(worker, workers);
    });

    worker.port.on(`delValues`, request => {
      keys = JSON.parse(request.keys);
      keys.forEach(key => {
        delete ss.storage[key];
      });
      worker.port.emit(`delValues_response`, `null`);
      sendMessage(`delValues`, keys);
    });

    worker.port.on(`fetch`, async request => {
      parameters = JSON.parse(request.parameters);
      const response = await doFetch(parameters, request);      
      worker.port.emit(`fetch_response`, response);
    });

    worker.port.on(`getStorage`, () => {
      worker.port.emit(`getStorage_response`, JSON.stringify(ss.storage));
    });

    worker.port.on(`reload`, () => {
      worker.port.emit(`reload_response`, `null`);
    });

    worker.port.on(`setValues`, request => {
      values = JSON.parse(request.values);
      for (key in values) {
        if (values.hasOwnProperty(key)) {
          ss.storage[key] = values[key];
        }
      }
      worker.port.emit(`setValues_response`, `null`);
      sendMessage(`setValues`, values);
    });

    worker.port.on(`tabs`, request => {
      getTabs(request);
      worker.port.emit(`tabs_response`, `null`);
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