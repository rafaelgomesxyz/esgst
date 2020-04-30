function doNcvGet(parameters) {
	var output = {
		deprecated: 'This API is deprecated. Please use https://rafaelgssa.github.io/esgst/#api-Games-GetNcv instead.'
	};
	var queryParams = [];
	if (parameters.appIds) {
		queryParams.push('app_ids=' + parameters.appIds);
	}
	if (parameters.subIds) {
		queryParams.push('sub_ids=' + parameters.subIds);
	}
	if (parameters.date) {
		queryParams.push('date_equal=' + dateToServer(parameters.date));
	}
	if (parameters.dateAfterParam) {
		queryParams.push('date_after=' + dateToServer(parameters.dateAfterParam));
	}
	if (parameters.dateBeforeParam) {
		queryParams.push('date_before=' + dateToServer(parameters.dateBeforeParam));
	}
	if (parameters.name) {
		queryParams.push('show_name=' + booleanToServer(parameters.name));
	}
	if (parameters.recent) {
		queryParams.push('show_recent=' + booleanToServer(parameters.recent));
	}
	var query = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
	var response = fetch('https://rafaelgssa.com/esgst/games/ncv' + query);
	var json = JSON.parse(response.getContentText());
	output.success = json.result.found;
	for (var id in output.success.apps) {
		output.success.apps[id].effective_date = dateFromServer(output.success.apps[id].effective_date);
		output.success.apps[id].added_date = dateFromServer(output.success.apps[id].added_date);
	}
	for (var id in output.success.subs) {
		output.success.subs[id].effective_date = dateFromServer(output.success.subs[id].effective_date);
		output.success.subs[id].added_date = dateFromServer(output.success.subs[id].added_date);
	}
	output.failed = json.result.not_found;
	return ContentService.createTextOutput(JSON.stringify(output));
}

function doNcvPost(postData) {
	var output = {
		deprecated: 'This API is deprecated. Please use https://rafaelgssa.github.io/esgst/#api-Games-PostNcv instead.'
	};
	var apps = {};
	var subs = {};
	for (var id in postData.apps) {
		apps[id] = dateToServer(postData.apps[id].effective_date);
	}
	for (var id in postData.subs) {
		subs[id] = dateToServer(postData.subs[id].effective_date);
	}
	var response = fetch('https://rafaelgssa.com/esgst/games/ncv', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		payload: JSON.stringify({
			apps: apps,
			subs: subs
		})
	});
	var json = JSON.parse(response.getContentText());
	if (json.error) {
		output.success = 0;
		output.message = json.error;
	} else {
		output.success = json.result;
	}
	return ContentService.createTextOutput(JSON.stringify(output));
}