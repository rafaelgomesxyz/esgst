## Google Web App [TO BE DEPRECATED]

A Google Web App is like a server, but free (with the limitation that it can't handle much traffic), and offered by Google with easy integration to Google Sheets.

You can access your Google Apps Script dashboard through this link: https://script.google.com/home

TO BE DEPRECATED: If you use this app, start using the [ESGST API](https://rafaelgssa.github.io/esgst/), as this app is in the proccess of being deprecated.

### Triggers

The project uses the following triggers:

Function | When | Description
:-: | :-: | :-:
updateRcvGames | Every Sunday, Midnight to 1am | Updates the reduced CV database
getRcvSgToolsGames | Every 6 hours | Gets the latest additions to the reduced CV list from SGTools, without having to wait until the next full update

### Reduced CV Database

https://docs.google.com/spreadsheets/d/1hdANpkPL_eKZHxJuvcmsVKbjtzN_2MXV2ZBMSJMkO-s/edit?usp=sharing

TO BE DEPRECATED: Use https://rafaelgssa.github.io/esgst/#api-Games-GetRcv

### No CV Database

https://docs.google.com/spreadsheets/d/1wqUDyl_qZF0a6DkRiq-VfDQTiAfIt5WC_ikIp1iD7c4/edit?usp=sharing

### Username History Database

DEPRECATED: Use https://rafaelgssa.github.io/esgst/#api-Users-GetAllUh