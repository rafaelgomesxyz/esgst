var SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fetch(url, options) {
	if (!options) {
		options = {};
	}
	if (!options.headers) {
		options.headers = {};
	}
	options.headers['Esgst-Version'] = 'GoogleAppsScriptV50';
	options.headers['From'] = 'esgst.extension@gmail.com';
	options.muteHttpExceptions = true;
	return UrlFetchApp.fetch(url, options);
}

function dateToServer(dateStr) {
	var date = new Date(dateStr);
	return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function dateFromServer(dateStr) {
	var dateParts = dateStr.split('-');
	var year = parseInt(dateParts[0]);
	var month = parseInt(dateParts[1]);
	var day = parseInt(dateParts[2]);
	return SHORT_MONTHS[month - 1] + ' ' + day + ', ' + year;
}

function booleanToServer(boolean) {
	return JSON.parse(boolean) ? 'true' : 'false';
}