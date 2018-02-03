chrome.runtime.onMessage.addListener((request, sender, callback) => {
    switch (request.action) {
        case `fetch`:
            let parameters = JSON.parse(request.parameters);
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
        case `reload`:
            chrome.runtime.reload();
            callback();
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