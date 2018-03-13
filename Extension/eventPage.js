let storage = null,
    promise = new Promise((resolve, reject) => {
        chrome.storage.local.get(null, stg => {
            storage = stg;
            resolve();
        });
    });

function sendMessage(action, sender, values) {
    chrome.tabs.query({url: [`*://*.steamgifts.com/*`, `*://*.steamtrades.com/*`]}, tabs => {
        tabs.forEach(tab => {
            if (tab.id === sender.tab.id) return;
            chrome.tabs.sendMessage(tab.id, JSON.stringify({
                action: action,
                values: values
            }), function(response) {});
        });
    });
}
    
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    let key, keys, parameters, values;
    switch (request.action) {
        case `delValues`:
            keys = JSON.parse(request.keys);
            chrome.storage.local.remove(keys, () => {
                keys.forEach(key => {
                    delete storage[key];
                });
                sendMessage(`delValues`, sender, keys);
                callback();
            });
            break;
        case `fetch`:
            parameters = JSON.parse(request.parameters);
            parameters.headers = new Headers(parameters.headers);
            fetch(request.url, parameters).then(response => {
                response.text().then(responseText => {
                    callback(JSON.stringify({
                        finalUrl: response.url,
                        redirected: response.redirected,
                        responseText: responseText
                    }));
                });
            });
            break;
        case `getStorage`:
            promise.then(() => callback(JSON.stringify(storage)));
            break;
        case `reload`:
            chrome.runtime.reload();
            callback();
            break;
        case `setValues`:
            values = JSON.parse(request.values);
            chrome.storage.local.set(values, () => {
                for (key in values) {
                    storage[key] = values[key];
                }
                sendMessage(`setValues`, sender, values);
                callback();
            });
            break;
        case `tabs`:
            getTabs(request);
            break;
    }
    return true;
});

async function getTabs(request) {
    console.log(request);
    let items = [
        {id: `inbox_sg`, pattern: `*://*.steamgifts.com/messages*`, url: `https://www.steamgifts.com/messages`},
        {id: `inbox_st`, pattern: `*://*.steamtrades.com/messages*`, url: `https://www.steamtrades.com/messages`},
        {id: `wishlist`, pattern: `*://*.steamgifts.com/giveaways/search?*type=wishlist*`, url: `https://www.steamgifts.com/giveaways/search?type=wishlist`},
        {id: `won`, pattern: `*://*.steamgifts.com/giveaways/won*`, url: `https://www.steamgifts.com/giveaways/won`},
    ];
    let any = false;
    for (let i = 0, n = items.length; i < n; i++) {
        let item = items[i];
        if (!request[item.id]) {
            continue;
        }
        let tab = (await queryTabs({url: item.pattern}))[0];
        console.log(tab);
        if (tab && tab.id) {
            chrome.tabs.update(tab.id, {active: true});
            if (request.refresh) {
                chrome.tabs.reload(tab.id);
            }
        } else if (request.any) {
            any = true;                    
        } else {
            open(item.url);
        }
    }
    if (any) {
        let tab = (await queryTabs({url: `*://*.steamgifts.com/*`}))[0];
        console.log(tab);
        if (tab && tab.id) {
            chrome.tabs.update(tab.id, {active: true});
        }
    }
}

function queryTabs(query) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(query, resolve);
    });
}