## Google Web App

A Google Web App is like a server, but free (with the limitation that it can't handle much traffic), and offered by Google with easy integration to Google Sheets. That makes it a nice alternative for cases where ESGST doesn't need a fast or frequent response (no user should be syncing their reduced / no CV data every second).

ESGST uses a single Google Apps Script project that integrates with all of its sheets.

You can access your Google Apps Script dashboard through this link: https://script.google.com/home

### Triggers

The project uses the following triggers:

Function | When | Description
:-: | :-: | :-:
updateRcvGames | Every Sunday, Midnight to 1am | Updates the reduced CV database
getRcvSgToolsGames | Every 6 hours | Gets the latest additions to the reduced CV list from SGTools, without having to wait until the next full update
getUhChanges | Every Monday, Midnight to 1am | Updates the username history database

### Reduced CV Database

https://docs.google.com/spreadsheets/d/1hdANpkPL_eKZHxJuvcmsVKbjtzN_2MXV2ZBMSJMkO-s/edit?usp=sharing

### No CV Database

https://docs.google.com/spreadsheets/d/1wqUDyl_qZF0a6DkRiq-VfDQTiAfIt5WC_ikIp1iD7c4/edit?usp=sharing

### Username History Database

https://docs.google.com/spreadsheets/d/16LbNkqIGc_G-HD_nnGVaoYwijXyrnDOeCOKrpIeEqb8/edit?usp=sharing