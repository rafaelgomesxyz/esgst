function doUhGet(parameters) {
	var output = {
		deprecated: 'This API is deprecated. Please use https://rafaelgssa.github.io/esgst/#api-Users-GetAllUh and https://rafaelgssa.github.io/esgst/#api-Users-GetUh instead.'
	};
	switch (parseInt(parameters.code)) {
		case 0:
			var response = UrlFetchApp.fetch('https://rafaelgssa.com/esgst/user/+' + parameters.steamId + '/uh?username=' + parameters.username);
			var json = JSON.parse(response.getContentText());
			output.usernames = json.result.usernames;
			break;
		case 1:
			var response = UrlFetchApp.fetch('https://rafaelgssa.com/esgst/users/uh?format_array=true&show_recent=true');
			var json = JSON.parse(response.getContentText());
			output.recent = json.result.found.map(function(change) { return [change.usernames[1], change.usernames[0]]; });
			break;
	}
	return ContentService.createTextOutput(JSON.stringify(output));
}