let storage = null;

if (typeof window.chrome !== `undefined`) {
    if (window.chrome.runtime) {
        window.browser = window.chrome;
    }
}

function sendMessage(action, sender, values) {
    window.browser.tabs.query({url: [`*://*.steamgifts.com/*`, `*://*.steamtrades.com/*`]}, tabs => {
        tabs.forEach(tab => {
            if (tab.id === sender.tab.id) return;
            window.browser.tabs.sendMessage(tab.id, JSON.stringify({
                action: action,
                values: values
            }), function(response) {});
        });
    });
}

async function doFetch(parameters, request, sender, callback) {
    if (!request.manipulateCookies) {
        let response = await fetch(request.url, parameters);
        let responseText = await response.text();
        callback(JSON.stringify({
            finalUrl: response.url,
            redirected: response.redirected,
            responseText: responseText
        }));
        return;
    }
    window.browser.tabs.get(sender.tab.id, async tab => {
        if (tab.cookieStoreId === `firefox-default`) {
            let response = await fetch(request.url, parameters);
            let responseText = await response.text();
            callback(JSON.stringify({
                finalUrl: response.url,
                redirected: response.redirected,
                responseText: responseText
            }));
            return;
        }

        let domain = request.url.match(/https?:\/\/(.+?)(\/.*)?$/)[1];
        let url = request.url.match(/(https?:\/\/.+?)(\/.*)?$/)[1];

        // get no-container cookies
        let cookies = await getCookies({
            domain: domain
        });
        // get container cookies
        let containerCookies = await getCookies({
            domain: domain,
            storeId: tab.cookieStoreId
        });

        // delete no-container cookies
        for (let i = cookies.length - 1; i > -1; i--) {
            let cookie = cookies[i];
            await deleteCookie({
                name: cookie.name,
                url: url
            });
        }
        // set container cookies to no-container scope
        for (let i = containerCookies.length - 1; i > -1; i--) {
            let cookie = containerCookies[i];
            cookie.url = request.url;
            delete cookie.hostOnly;
            delete cookie.session;
            delete cookie.storeId;
            await setCookie(cookie);
        }

        // request
        let response = await fetch(request.url, parameters);
        let responseText = await response.text();

        // delete container cookies from no-container scope
        for (let i = containerCookies.length - 1; i > -1; i--) {
            let cookie = containerCookies[i];
            await deleteCookie({
                name: cookie.name,
                url: url
            });
        }
        // restore no-container cookies
        for (let i = cookies.length - 1; i > -1; i--) {
            let cookie = cookies[i];
            cookie.url = request.url;
            delete cookie.hostOnly;
            delete cookie.session;
            delete cookie.storeId;
            await setCookie(cookie);
        }

        callback(JSON.stringify({
            finalUrl: response.url,
            redirected: response.redirected,
            responseText: responseText
        }));
    });
}

function getCookies(details) {
    return new Promise((resolve, reject) => {
        window.browser.cookies.getAll(details, resolve);
    });
}

function setCookie(details) {
    return new Promise((resolve, reject) => {
        window.browser.cookies.set(details, resolve);
    });
}

function deleteCookie(details) {
    return new Promise((resolve, reject) => {
        window.browser.cookies.remove(details, resolve);
    });
}

window.browser.runtime.onMessage.addListener((request, sender, callback) => {
    let key, keys, parameters, values;
    switch (request.action) {
        case `delValues`:
            keys = JSON.parse(request.keys);
            window.browser.storage.local.remove(keys, () => {
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
            doFetch(parameters, request, sender, callback);
            break;
        case `getStorage`:
            if (storage) {
                callback(JSON.stringify(storage));
            } else {
                window.browser.storage.local.get(null, stg => {
                    storage = stg;
                    callback(JSON.stringify(storage));
                });
            }
            break;
        case `reload`:
            window.browser.runtime.reload();
            callback();
            break;
        case `setValues`:
            values = JSON.parse(request.values);
            window.browser.storage.local.set(values, () => {
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
        if (tab && tab.id) {
            window.browser.tabs.update(tab.id, {active: true});
            if (request.refresh) {
                window.browser.tabs.reload(tab.id);
            }
        } else if (request.any) {
            any = true;                    
        } else {
            open(item.url);
        }
    }
    if (any) {
        let tab = (await queryTabs({url: `*://*.steamgifts.com/*`}))[0];
        if (tab && tab.id) {
            window.browser.tabs.update(tab.id, {active: true});
        }
    }
}

function queryTabs(query) {
    return new Promise((resolve, reject) => {
        window.browser.tabs.query(query, resolve);
    });
}