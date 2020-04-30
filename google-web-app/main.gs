function doGet(event) {
	var parameters = event.parameter;
	switch (parameters.action) {
		case 'ncv':
			return doNcvGet(parameters);
		case 'rcv':
			return doRcvGet(parameters);
		case 'uh':
			return doUhGet(parameters);
	}
}

function doPost(event) {
	var postData = JSON.parse(event.postData.contents);
	var parameters = event.parameter;
	switch (parameters.action) {
		case 'ncv':
			return doNcvPost(postData);
	}
}