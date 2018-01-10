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
    }
    return true;
});