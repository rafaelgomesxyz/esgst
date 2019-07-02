var ncvAppsSheet;
var ncvSubsSheet;

function loadNcvSheets() {
  if (!ncvAppsSheet || !ncvSubsSheet) {
    var sheets = SpreadsheetApp.openById('1wqUDyl_qZF0a6DkRiq-VfDQTiAfIt5WC_ikIp1iD7c4').getSheets();
    ncvAppsSheet = sheets[0];
    ncvSubsSheet = sheets[1];
  }
}

function doNcvGet(parameters) {
  var output = {
    success: {
      apps: {},
      subs: {}
    },
    failed: {
      apps: [],
      subs: []
    }
  };

  var numAppsAdded = 0;
  var numSubsAdded = 0;

  var appsFound = [];
  var subsFound = [];

  var appIdsParam = parameters.appIds ? parameters.appIds.split(/,/) : null;
  var subIdsParam = parameters.subIds ? parameters.subIds.split(/,/) : null;
  var dateParam = parameters.date ? new Date(parameters.date).getTime() : null;
  var dateAfterParam = parameters.dateAfter ? new Date(parameters.dateAfter).getTime() : null;
  var dateBeforeParam = parameters.dateBefore ? new Date(parameters.dateBefore).getTime() : null;
  var nameParam = parameters.name || null;
  var recentParam = parameters.recent || null;

  loadNcvSheets();

  var appValues = getSheetValues(ncvAppsSheet);
  if (recentParam) {
    appValues = sortValuesByDate(appValues, 3);
  }
  for (var i = 0, n = appValues.length; i < n; i++) {
    var id = appValues[i][0];
    if ((appIdsParam && appIdsParam.indexOf(id) > -1) || (!appIdsParam && !subIdsParam)) {
      appsFound.push(id);
      var effectiveDate = new Date(appValues[i][2]).getTime();
      if (
        (!recentParam || numAppsAdded < 50) && (
          (dateParam && dateParam === effectiveDate) ||
          (dateAfterParam && dateBeforeParam && effectiveDate > dateAfterParam && effectiveDate < dateBeforeParam) ||
          (dateAfterParam && !dateBeforeParam && effectiveDate > dateAfterParam) ||
          (!dateAfterParam && dateBeforeParam && effectiveDate < dateBeforeParam) ||
          (!dateParam && !dateAfterParam && !dateBeforeParam)
        )
      ) {
        numAppsAdded += 1;
        output.success.apps[id] = {
          effective_date: appValues[i][2],
          added_date: appValues[i][3]
        };
        if (nameParam) {
          output.success.apps[id].name = appValues[i][1];
        }
      }
    }
  }
  
  var subValues = getSheetValues(ncvSubsSheet);
  if (recentParam) {
    subValues = sortValuesByDate(subValues, 3);
  }
  for (var i = 0, n = subValues.length; i < n; i++) {
    var id = subValues[i][0];
    if ((subIdsParam && subIdsParam.indexOf(id) > -1) || (!appIdsParam && !subIdsParam)) {
      subsFound.push(id);
      var effectiveDate = new Date(subValues[i][2]).getTime();
      if (
        (!recentParam || numSubsAdded < 50) && (
          (dateParam && dateParam === effectiveDate) ||
          (dateAfterParam && dateBeforeParam && effectiveDate > dateAfterParam && effectiveDate < dateBeforeParam) ||
          (dateAfterParam && !dateBeforeParam && effectiveDate > dateAfterParam) ||
          (!dateAfterParam && dateBeforeParam && effectiveDate < dateBeforeParam) ||
          (!dateParam && !dateAfterParam && !dateBeforeParam)
        )
      ) {
        numSubsAdded += 1;
        output.success.subs[id] = {
          effective_date: subValues[i][2],
          added_date: subValues[i][3]
        };
        if (nameParam) {
          output.success.subs[id].name = subValues[i][1];
        }
      }
    }
  }
  
  if (appIdsParam) {
    for (var i = 0, n = appIdsParam.length; i < n; i++) {
      if (appsFound.indexOf(appIdsParam[i]) < 0) {
        output.failed.apps.push(appIdsParam[i]);
      }
    }
  }
  
  if (subIdsParam) {
    for (var i = 0, n = subIdsParam.length; i < n; i++) {
      if (subsFound.indexOf(subIdsParam[i]) < 0) {
        output.failed.subs.push(subIdsParam[i]);
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(output));
}

function doNcvPost(postData) {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var date = new Date();
    var addedDate = SHORT_MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();

    loadNcvSheets();

    var appValues = getSheetValues(ncvAppsSheet);
    for (var id in postData.apps) {
      for (var i = appValues.length - 1; i > -1 && appValues[i][0] != id; i--);
      var result = validateNcvGame('app', id);
      if (i > -1) {
        if (result.ok) {
          if (result.effectiveDate !== appValues[i][2]) {
            ncvAppsSheet.getRange(i + START_ROW, 3).setValue(result.effectiveDate);
          }
        } else if (!result.noResponse) {
          ncvAppsSheet.deleteRow(i + START_ROW);
        }
      } else if (result.ok) {
        appendSheetRow(ncvAppsSheet, [id, result.name, result.effectiveDate, addedDate]);
      }
    }

    var subValues = getSheetValues(ncvSubsSheet);
    for (var id in postData.subs) {
      for (var i = subValues.length - 1; i > -1 && subValues[i][0] != id; i--);
      var result = validateNcvGame('sub', id);
      if (i > -1) {
        if (result.ok) {
          if (result.effectiveDate !== subValues[i][2]) {
            ncvSubsSheet.getRange(i + START_ROW, 3).setValue(result.effectiveDate);
          }
        } else if (!result.noResponse) {
          ncvSubsSheet.deleteRow(i + START_ROW);
        }
      } else if (result.ok) {
        appendSheetRow(ncvSubsSheet, [id, result.name, result.effectiveDate, addedDate]);
      }
    }

    SpreadsheetApp.flush();
    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({ success: 1 }));
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ success: 0, message: e.message }));
  }
}

function validateNcvGame(type, id) {
  var url = 'https://www.steamgifts.com/ajax.php';
  
  var response = fetch(url, {
    method: 'POST',
    payload: {
      'do': 'autocomplete_giveaway_game',
      'page_number': 1,
      'search_query': id
    }
  });
  var text = response.getContentText();
  if (!text) {
    return {
      ok: false,
      noResponse: true
    };
  }

  try {
    var json = JSON.parse(text);
    var html = removeNewLines(json.html);

    var elementMatch;
    var elementRegex = /<p\sclass=\"table__column__heading\">(.+?)(<div\sclass="table__row-outer-wrap">|<div\sclass=\"pagination\spagination--ajax\">)/g;

    while ((elementMatch = elementRegex.exec(html)) !== null) {
      var element = elementMatch[1];
      var linkMatch = element.match(/<a\sclass="table__column__secondary-link"\shref=".+?(app|sub)\/(\d+)/);
      if (linkMatch && linkMatch[1] === type && linkMatch[2] == id) {
        var dateMatch = element.match(/&quot;Zero\scontributor\svalue\ssince...&quot;},\s\{&quot;name&quot;\s:\s&quot;(.+?)&quot;/);
        if (dateMatch) {
          var name = element.match(/^(.+?)\s<span/)[1];
          var effectiveDate = dateMatch[1];
          return {
            ok: true,
            name: name,
            effectiveDate: effectiveDate
          };
        }
      }
    }
  } catch (e) {
    Logger.log(e);
  }
  return {
    ok: false
  };
}