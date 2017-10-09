chrome.runtime.onMessage.addListener((request, sender, callback) => {
    fetch(request.url, JSON.parse(request.parameters)).then(response => {
        response.text().then(responseText => {
            callback(JSON.stringify({
                finalUrl: response.url,
                redirected: response.redirected,
                responseText: responseText
            }));
        });
    });
    return true;
});