chrome.runtime.onMessage.addListener((request, sender, callback) => {
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
    return true;
});