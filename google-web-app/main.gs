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
	var parameters = event.parameter;
	var postData = JSON.parse(event.postData.contents);
	switch (parameters.action) {
		case 'ncv':
			return doNcvPost(postData);
		case 'rcv':
			return doRcvPost(postData);
	}
}