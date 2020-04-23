function doRcvGet(parameters) {
	var output = {
		deprecated: 'This API is deprecated. Please use https://rafaelgssa.github.io/esgst/#api-Games-GetRcv instead.'
	};
	var queryParams = [];
	if (parameters.appIds) {
		queryParams.push('app_ids=' + parameters.appIds);
	}
	if (parameters.subIds) {
		queryParams.push('sub_ids=' + parameters.subIds);
	}
	if (parameters.date) {
		queryParams.push('date_equal=' + convertDate(parameters.date));
	}
	if (parameters.dateAfterParam) {
		queryParams.push('date_after=' + convertDate(parameters.dateAfterParam));
	}
	if (parameters.dateBeforeParam) {
		queryParams.push('date_before=' + convertDate(parameters.dateBeforeParam));
	}
	if (parameters.name) {
		queryParams.push('show_name=' + convertBoolean(parameters.name));
	}
	if (parameters.recent) {
		queryParams.push('show_recent=' + convertBoolean(parameters.recent));
	}
	var query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
	var response = UrlFetchApp.fetch('https://rafaelgssa.com/esgst/games/rcv' + query);
	var json = JSON.parse(response.getContentText());
	output.success = json.result.found;
	output.failed = json.result.not_found;
	return ContentService.createTextOutput(JSON.stringify(output));
}

function convertDate(date) {
	var parts = date.split('/');
	return parts[2] + '-' + parts[0] + '-' + parts[1];
}

function convertBoolean(boolean) {
	return JSON.parse(boolean) ? 'true' : 'false';
}