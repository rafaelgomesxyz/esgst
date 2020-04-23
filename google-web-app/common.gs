/* SHEETS */
var RCV_SHEET = '1hdANpkPL_eKZHxJuvcmsVKbjtzN_2MXV2ZBMSJMkO-s';
var NCV_SHEET = '1wqUDyl_qZF0a6DkRiq-VfDQTiAfIt5WC_ikIp1iD7c4';

/* PRIVATE DATA */
var SESSION_ID = '%session_id%';
var SGTOOLS_API_KEY = '%sgtools_api_key%';

var SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var START_ROW = 2;
var START_COLUMN = 1;

function appendSheetRow(sheet, values) {
	var row = sheet.getLastRow();
	var column = START_COLUMN;
	var numRows = 1;
	var numColumns = sheet.getMaxColumns() - (START_COLUMN - 1);
	sheet.insertRowAfter(row);
	sheet.getRange(row + 1, column, numRows, numColumns).setValues([values]);
}

function getSheetValues(sheet, row, column, numRows, numColumns) {
	if (!row) {
		row = START_ROW;
	}
	if (!column) {
		column = START_COLUMN;
	}
	if (!numRows) {
		numRows = sheet.getMaxRows() - (START_ROW - 1);
	}
	if (!numColumns) {
		numColumns = sheet.getMaxColumns() - (START_COLUMN - 1);
	}
	if (numRows > 0 && numColumns > 0) {
		return sheet.getRange(row, column, numRows, numColumns).getValues();
	}
	return [];
}

function removeNewLines(text) {
	return text.replace(/\r|\r?\n/g, '');
}

function fetch(url, options, doNotIncludeSessionId) {
	if (!options) {
		options = {};
	}
	if (!options.headers) {
		options.headers = {};
	}
	if (!doNotIncludeSessionId) {
		options.headers['Cookie'] = 'PHPSESSID=' + SESSION_ID + ';';
	}
	options.headers['Esgst-Version'] = 'GoogleAppsScriptv16';
	options.headers['From'] = 'esgst.extension@gmail.com';
	return UrlFetchApp.fetch(url, options);
}

function sortValuesByDate(values, index) {
	return values.sort(function (a, b) {
		var dateA = new Date(a[index]).getTime();
		var dateB = new Date(b[index]).getTime();
		if (dateA > dateB) {
			return -1;
		}
		if (dateB > dateA) {
			return 1;
		}
		return 0;
	});
}