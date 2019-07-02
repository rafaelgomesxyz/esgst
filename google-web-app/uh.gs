var uhDatabaseSheet;
var uhRecentSheet;

function loadUhSheets() {
  if (!uhDatabaseSheet || !uhRecentSheet) {
    var sheets = SpreadsheetApp.openById(UH_SHEET).getSheets();
    uhDatabaseSheet = sheets[0];
    uhRecentSheet = sheets[1];
  }
}

function doUhGet(parameters) {
  var steamId;

  loadUhSheets();

  switch (parseInt(parameters.code)) {
    case 0:
      steamId = parameters.steamId;
      if (steamId && steamId != 'undefined') {
        return ContentService.createTextOutput(JSON.stringify({
          usernames: searchUhUser(steamId, parameters.username.replace(/\s[\s\S]*/, ''))
        }));
      }
      break;
    case 1:
      return ContentService.createTextOutput(JSON.stringify({
        recent: uhRecentSheet.getRange(2, 1, uhRecentSheet.getMaxRows() - 1, 2).getValues()
      }));
      break;
  }
}

function searchUhUser(steamId, username) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  var i = 0;
  var n = uhDatabaseSheet.getMaxRows() - 2;
  var values = uhDatabaseSheet.getRange(2, 1, n, 2).getValues();

  for (i = 0; i < n && values[i][0] < steamId; i++);

  if (i < n && values[i][0] == steamId) {
    var usernames = values[i][1];
    var array = usernames.split(/,\s/g);
    if (usernames.toLowerCase().indexOf(username.toLowerCase()) < 0) {
      array.unshift(username);

      uhDatabaseSheet.getRange(i + 2, 2).setValue(array.join(', '));      
      uhRecentSheet.insertRows(2);
      uhRecentSheet.getRange(2, 1).setValue(array[1]);
      uhRecentSheet.getRange(2, 2).setValue(array[0]);
    }

    SpreadsheetApp.flush();
    lock.releaseLock();

    return array;
  } else {
    i += 2;

    uhDatabaseSheet.insertRows(i);
    uhDatabaseSheet.getRange(i, 1).setValue(steamId);
    uhDatabaseSheet.getRange(i, 2).setValue(username);

    SpreadsheetApp.flush();
    lock.releaseLock();

    return [username];
  }
}

function getUhChanges() {
  loadUhSheets();

  var properties = PropertiesService.getScriptProperties();
  var i = properties.getProperty('index');
  var isComplete = false;
  var limit = 299999;
  var n = uhDatabaseSheet.getMaxRows() - 2;
  var startTime = Date.now();
  var values = uhDatabaseSheet.getRange(2, 1, n, 2).getValues();
  i = i ? parseInt(i) : 0;

  while (i < n) {
    var currentTime = Date.now();

    if (currentTime - startTime > limit) {
      properties.setProperty('index', i);

      ScriptApp.newTrigger('getUhChanges').timeBased().at(new Date(currentTime + 60000)).create();

      isComplete = false;

      break;
    } else {
      var steamId = values[i][0];

      var url = 'https://www.steamgifts.com/go/user/' + steamId;

      var response = fetch(url, {
        method: 'POST'
      });
      var text = response.getContentText();

      var username;

      var baseUrl = /baseUrl\s=\s"(.+?)";/.exec(text)[1];
      if (baseUrl == '\\/giveaways') {
        username = '[This user has deleted their account]';
      } else {
        username = /<div\sclass="featured__heading__medium">(.+?)<\/div>/.exec(text)[1];
      }

      var usernames = values[i][1].split(/,\s/);
      if (usernames[0].toLowerCase() != username.toLowerCase()) {
        var lock = LockService.getScriptLock();
        lock.waitLock(30000);

        usernames.unshift(username);
        uhDatabaseSheet.getRange(i + 2, 2).setValue(usernames.join(', '));
        uhRecentSheet.insertRows(2);
        uhRecentSheet.getRange(2, 1).setValue(usernames[1]);
        uhRecentSheet.getRange(2, 2).setValue(usernames[0]);

        SpreadsheetApp.flush();
        lock.releaseLock();
      }

      isComplete = true;

      Logger.log(i);      
    }

    i += 1;
  }

  if (isComplete) {
    properties.deleteProperty('index');
  }
}