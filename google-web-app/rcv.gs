var rcvAppsSheet;
var rcvSubsSheet;

function loadRcvSheets() {
  if (!rcvAppsSheet || !rcvSubsSheet) {
    var sheets = SpreadsheetApp.openById('1hdANpkPL_eKZHxJuvcmsVKbjtzN_2MXV2ZBMSJMkO-s').getSheets();
    rcvAppsSheet = sheets[0];
    rcvSubsSheet = sheets[1];
  }
}

function doRcvGet(parameters) {
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
  
  loadRcvSheets();
  
  var appValues = getSheetValues(rcvAppsSheet);
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
  
  var subValues = getSheetValues(rcvSubsSheet);
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

function updateRcvGames() {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var properties = PropertiesService.getScriptProperties();
    properties.setProperty('isUpdating', true);

    loadRcvSheets();

    rcvAppsSheet.getRange('E2:E').clear();
    rcvSubsSheet.getRange('E2:E').clear();

    SpreadsheetApp.flush();
    lock.releaseLock();

    getRcvGames();
  } catch (e) {
    Logger.log(e);
  }
}

function getRcvGames() {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    
    var isComplete = false;
    
    var date = new Date();
    var startTime = date.getTime();
    var addedDate = SHORT_MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    var limit = 299999;
    
    var url = 'https://www.steamgifts.com/bundle-games/search?page=';
    var properties = PropertiesService.getScriptProperties();
    var page = properties.getProperty('page');
    page = page ? parseInt(page) : 1;

    var response = fetch(url + page);
    var text = response.getContentText();
    var html = removeNewLines(text);

    var totalMatch = html.match(/<div\sclass="pagination__results">.*?of\s<strong>(.*?)<\/strong>/);
    var total = totalMatch ? (Math.ceil(parseInt(totalMatch[1].replace(/,/g, '')) / 25) + 1) : 0;

    loadRcvSheets();

    var appValues = getSheetValues(rcvAppsSheet);
    var subValues = getSheetValues(rcvSubsSheet);

    while (page < total) {
      var now = Date.now();

      if (now - startTime > limit) {
        properties.setProperty('page', page);
        ScriptApp.newTrigger('getRcvGames').timeBased().at(new Date(now + 60000)).create();
        
        isComplete = false;
        
        break;
      } else {
        if (!text) {
          response = fetch(url + page);
          text = response.getContentText();
          html = removeNewLines(text);
        }
        
        var elementMatch;
        var elementRegex = /<div\sclass="table__row-inner-wrap">(.+?)(<div\sclass="table__row-outer-wrap">|<div\sclass="pagination">)/g;
        
        while ((elementMatch = elementRegex.exec(html)) !== null) {
          var element = elementMatch[1];
          var linkMatch = element.match(/<a\sclass="table__column__secondary-link"\shref=".+?(app|sub)\/(\d+)/);
          if (linkMatch) {
            var type = linkMatch[1];
            var id = linkMatch[2];
            var effectiveDate = element.match(/<div\sclass="table__column--width-small\stext-center">(.+?)<\/div>/)[1];
            var name = element.match(/<p\sclass="table__column__heading">(.+?)<\/p>/)[1];

            if (type === 'app') {
              for (var j = appValues.length - 1; j > -1 && appValues[j][0] != id; j--);
              if (j > -1) {
                if (appValues[j][2] !== effectiveDate) {
                  rcvAppsSheet.getRange(j + 2, 3).setValue(effectiveDate);
                }
                rcvAppsSheet.getRange(j + 2, 5).setValue('1');
              } else {
                appendSheetRow(rcvAppsSheet, [id, name, effectiveDate, addedDate, '1']);
              }
            } else {
              for (var j = subValues.length - 1; j > -1 && subValues[j][0] != id; j--);
              if (j > -1) {
                if (subValues[j][2] !== effectiveDate) {
                  rcvSubsSheet.getRange(j + 2, 3).setValue(effectiveDate);
                }
                rcvSubsSheet.getRange(j + 2, 5).setValue('1');
              } else {
                appendSheetRow(rcvSubsSheet, [id, name, effectiveDate, addedDate, '1']);
              }
            }
          } else {
            Logger.log(page);
          }
        }
        
        html = null;
        page += 1;
        
        isComplete = true;
      }
    }
    
    if (isComplete) {
      properties.deleteProperty('isUpdating');
      properties.deleteProperty('page');
      
      appValues = getSheetValues(rcvAppsSheet);
      for (var i = appValues.length - 1; i > -1; i--) {
        if (appValues[i][4] != '1') {
          rcvAppsSheet.deleteRow(i + START_ROW);
        }
      }
      
      subValues = getSheetValues(rcvSubsSheet);
      for (var i = subValues.length - 1; i > -1; i--) {
        if (subValues[i][4] != '1') {
          rcvSubsSheet.deleteRow(i + START_ROW);
        }
      }
      
      rcvAppsSheet.getRange('E2:E').clear();
      rcvSubsSheet.getRange('E2:E').clear();
    }
    
    SpreadsheetApp.flush();
    lock.releaseLock();
  } catch (e) {
    Logger.log(e);
  }
}

function getRcvSgToolsGames() {
  try {
    var lock = LockService.getScriptLock();
    lock.waitLock(30000);

    var date = new Date();
    var addedDate = SHORT_MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    
    var url = 'http://www.sgtools.info/api/lastBundled?apiKey=' + SGTOOLS_API_KEY;
    
    var response = fetch(url);
    var text = response.getContentText();
    var json = JSON.parse(text);
    
    var games = json[0];

    loadRcvSheets();
    
    var appValues = getSheetValues(rcvAppsSheet);
    var subValues = getSheetValues(rcvSubsSheet);   

    for (var i = 0, n = games.length; i < n; i++) {
      var type = games[i].type;
      var id = games[i].app_id;
      var effectiveDate = new Date(games[i].bundled_date.replace(/\//g, '-').replace(/\s/, 'T') + '.000Z');
      effectiveDate = SHORT_MONTHS[effectiveDate.getMonth()] + ' ' + effectiveDate.getDate() + ', ' + effectiveDate.getFullYear();
      var name = games[i].name;

      if (type === 'app') {
        for (var j = appValues.length - 1; j > -1 && appValues[j][0] != id; j--);
        if (j < 0) {
          appendSheetRow(rcvAppsSheet, [id, name, effectiveDate, addedDate, '']);
        }
      } else {
        for (var j = subValues.length - 1; j > -1 && subValues[j][0] != id; j--);
        if (j < 0) {
          appendSheetRow(rcvSubsSheet, [id, name, effectiveDate, addedDate, '']);
        }
      }
    }
    
    SpreadsheetApp.flush();
    lock.releaseLock();
  } catch (e) {
    Logger.log(e);
  }
}