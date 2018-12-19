# ESGST - Enhanced SteamGifts & SteamTrades

A script that adds some cool features to SteamGifts and SteamTrades.

If you find any bugs or have any feature requests, please file an issue [here](https://github.com/revilheart/ESGST/issues).

---

## Compatibility

Tested and confirmed as working:

* Chrome (since v55)
* Firefox (since v52)

Not tested but should be working:

* Opera (since v42)

Not tested and may not be working (if it works please let me know so I can move it above):

* Edge
* Safari (since v10.1)

---

## Installation

There are two different ways to use ESGST: extension or userscript. You can choose which one you want to use, but the extension is reported to be a lot faster and have a better peformance than the userscript, although there is no major difference between them.

### Option 1 - Extension

* [Chrome](https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/esgst/)

Other browsers might work with the extension, especially Opera, since I believe it uses the same extension system as Chrome, but only Firefox and Chrome have been tested and confirmed as working.

### Option 2 - Userscript

To install the script, you must install [Greasemonkey](http://www.greasespot.net/), [Tampermonkey](https://tampermonkey.net/), or some other userscript manager first. Then [click here](https://github.com/revilheart/ESGST/raw/master/ESGST.user.js) and you should be prompted to install it.

You can also install the script in your Android through Firefox with Violentmonkey or USI. Though some features might not work.

### Upgrade/Downgrade

To upgrade from the script to the extension or downgrade from the extension to the script, all you have to do is export all your data from the one you're uninstalling, install the other one and import all the data you had exported.

* [Changelog](#changelog)

---

## Features

To learn more about each feature you have to install ESGST.

### General

* Attached Image Carousel
* Attached Image Loader
* Avatar Popout
* Accurate Timestamp
* Cake Day Reminder
* Custom Header/Footer Links
* Element Filters
* Endless Scrolling
* Embedded Videos
* Fixed Footer
* Fixed Header
* Fixed Main Page Heading
* Fixed Sidebar
* Giveaway/Discussion/Ticket/Trade Tracker
* Hidden Blacklist Stats
* Hidden Community Poll
* Header Refresher
* Image Borders
* Last Page Link
* Level Progress Visualizer
* Multi-Tag
* Notification Merger
* Pagination Navigation On Top
* Quick Inbox View
* Same Tab Opener
* Scroll To Bottom Button
* Scroll To Top Button
* Search Magnifying Glass Button
* Shortcut Keys
* Time To Point Cap Calculator
* Table Sorter
* URL Redirector
* Visible Attached Images

### Giveaways

* Advanced Giveaway Search
* Archive Searcher
* Blacklist Giveaway Loader
* Comment/Entry Checker
* Created/Entered/Won Giveaway Details
* Delete Key Confirmation
* Enter/Leave Giveaway Button
* Entry Tracker
* Giveaway Bookmarks
* Giveaway Copy Highlighter
* Giveaway Country Loader
* Giveaway Encrypter/Decrypter
* Giveaway Error Search Links
* Giveaway Extractor
* Giveaway Filters
* Giveaway Group Loader
* Giveaway Manager
* Giveaway Recreator
* Giveaway Popup
* Giveaway Templates
* Giveaway Winners Link
* Giveaway Winning Chance
* Giveaway Winning Ratio
* Giveaways Sorter
* Grid View
* Hidden Game Remover
* Hidden Game's Enter Button Disabler
* IsThereAnyDeal Info
* Multiple Giveaway Creator
* Next/Previous Train Hotkeys
* One-Click Hide Giveaway Button
* Pinned Giveaways Button
* Quick Giveaway Search
* Real CV Calculator
* Sent Key Searcher
* Steam Activation Links
* Stickied Giveaway Countries
* Stickied Giveaway Groups
* Time To Enter Calculator
* Unfaded Entered Giveaway
* Unhide Giveaway Button
* Unsent Gift Sender

### Discussions

* Active Discussions On Top/Sidebar
* Close/Open Discussion Button
* Discussion Edit Detector
* Discussion Filters
* Discussion Highlighter
* Discussions Sorter
* Main Post Popup
* Main Post Skipper
* Old Active Discussions Design
* Puzzle Marker
* Refresh Active Discussions Button

### Trades

* Trade Bumper

### Comments

* Collapse/Expand Reply Button
* Comment Formatting Helper
* Comment History
* Comment Reverser
* Comment Searcher
* Comment Tracker
* Multi-Reply
* Received Reply Box Popup
* Reply Box On Top
* Reply Box Popup
* Reply From Inbox
* Reply Mention Link

### Users

* Inbox Winner Highlighter
* Level Up Calculator
* Not Activated/Multiple Win Checker
* Not Received Finder
* Profile Links
* Real Won/Sent CV Link
* Sent/Won Ratio
* Shared Group Checker
* SteamGifts Profile Button
* SteamTrades Profile Button
* User Filters
* User Giveaway Data
* User Notes
* User Stats
* User Suspension Tracker
* User Tags
* Username History
* Whitelist/Blacklist Checker
* Whitelist/Blacklist Highlighter
* Whitelist/Blacklist Manager
* Whitelist/Blacklist Sorter

### Groups

* Group Highlighter
* Group Library/Wishlist Checker
* Group Stats

### Games

* Entered Game Highlighter
* Game Categories
* Game Tags

### Others

* Automatically add no CV games to the database when searching for games in the new giveaway page.
* Automatically backup your data every specified number of days.
* Automatically sync games/groups when syncing through SteamGifts.
* Automatically update whitelist/blacklist when adding/removing a user to/from those lists.
* Calculate and show data sizes when opening the delete menu.
* Calculate and show data sizes when opening the export menu.
* Calculate and show data sizes when opening the import menu.
* Check whether or not you are on the current version when visiting the ESGST discussion.
* Check whether or not you are on the current version when visiting the main discussions page if the ESGST discussion is in the current page.
* Collapse sections in the settings menu by default.
* Enable ESGST for SteamTrades.
* Enable new features and functionalities by default.
* Hide buttons at the left/right sides of the main page heading to reduce the used space.
* Lock giveaway columns so that they are not draggable (they will remain in the set order).
* Make popups static (they are fixed at the top left corner of the page instead of being automatically centered).
* Open settings menu in a separate tab.
* Open the automatic sync in a new tab.
* Show changelog from the new version when updating.
* Show the feature number in the tooltips of elements added by ESGST.

---

### Other Info

* All requests from `Whitelist/Blacklist Checker`, `Not Activated/Multiple Win Checker`, `Not Received Finder` and `Archive Searcher` are limited to 2 per second, to prevent a stress on the SteamGifts servers.
* If you try to leave the page while `Whitelist/Blacklist Checker`, `Not Activated/Multiple Win Checker`, `Not Received Finder` and `Archive Searcher` are running, you will get a confirmation dialog asking you if you want to leave the page. Additionally, while these features are running, their buttons are faded out.

---

## Changelog

**8.1.6 (December 19, 2018)**

* [#1115](https://github.com/gsrafael01/ESGST/issues/1115) Update first-install and notice popups
* [#1114](https://github.com/gsrafael01/ESGST/issues/1114) Fix heading links in ESGST menu pages
* [#1113](https://github.com/gsrafael01/ESGST/issues/1113) Fix a bug in Endless Scrolling that happens when refreshing a page with no comments and the page received comments in the meantime
* [#1112](https://github.com/gsrafael01/ESGST/issues/1112) Fix a bug in Comment Reverser that reverses elements in the main page heading when there are no comments
* [#1110](https://github.com/gsrafael01/ESGST/issues/1110) Allow options to be collapsed without having to disable them in the settings menu
* [#1109](https://github.com/gsrafael01/ESGST/issues/1109) Remember collapsed sections in the settings menu
* [#1108](https://github.com/gsrafael01/ESGST/issues/1108) Add option to color blacklisted giveaways to Custom Giveaway Background
* [#1107](https://github.com/gsrafael01/ESGST/issues/1107) Fix a bug that does not allow Shortcut Keys to be used with the native SteamGifts comment box
* [#1106](https://github.com/gsrafael01/ESGST/issues/1106) Fix endless scrolling for Happy Holidays Integration
* [#1105](https://github.com/gsrafael01/ESGST/issues/1105) Fix a bug that tries to load game categories for discussions that have "Humble Bundle" and "Steam Gift Card" in their title
* [#1104](https://github.com/gsrafael01/ESGST/issues/1104) Fix the pagination count in Endless Scrolling with reverse scrolling enabled
* [#1103](https://github.com/gsrafael01/ESGST/issues/1103) Fix a bug in Endless Scrolling that does not allow the user to go to the first page of a discussion if reverse scrolling is enabled
* [#1102](https://github.com/gsrafael01/ESGST/issues/1102) Add a new game category: Banned
* [#1101](https://github.com/gsrafael01/ESGST/issues/1101) Remove background image in giveaway pages when using Custom Giveaway Background
* [#1100](https://github.com/gsrafael01/ESGST/issues/1100) Add option to color enter button yellow if ESGST is unable to check game ownership
* [#1099](https://github.com/gsrafael01/ESGST/issues/1099) Include Element Ordering and Steam API Key sections in the settings menu search
* [#1098](https://github.com/gsrafael01/ESGST/issues/1098) Fix a bug that does not fade options properly when searching in the settings menu
* [#1097](https://github.com/gsrafael01/ESGST/issues/1097) Allow the auto sync popup to be opened at any point during the sync instead of only at the end
* [#1096](https://github.com/gsrafael01/ESGST/issues/1096) Add option to open popup by default when automatically syncing
* [#1095](https://github.com/gsrafael01/ESGST/issues/1095) Log what has already been synced when syncing
* [#1094](https://github.com/gsrafael01/ESGST/issues/1094) Change Search Key Searcher export file format from .txt to .csv
* [#1093](https://github.com/gsrafael01/ESGST/issues/1093) Add option to show first page of comments of the giveaway to Enter/Leave Giveaway Button and Giveaway Popup
* [#1092](https://github.com/gsrafael01/ESGST/issues/1092) Prevent Whitelist/Blacklist Checker button from appearing in pages with no users to check
* [#1090](https://github.com/gsrafael01/ESGST/issues/1090) Detect Steam bundles as subs
* [#1089](https://github.com/gsrafael01/ESGST/issues/1089) Add links to the Whitelist/Blacklist Checker results that allow the user to confirm the result

**8.1.5 (December 4, 2018)**

* [#1070](https://github.com/gsrafael01/ESGST/issues/1070) Fix a bug in Reply From Inbox that happens when a deleted reply is cached
* [#1069](https://github.com/gsrafael01/ESGST/issues/1069) Fix a bug that prevents Time To Point Cap Calculator and Visible Full Level from working with Header Refresher disabled
* [#1068](https://github.com/gsrafael01/ESGST/issues/1068) Increase default static popup width to 1200px
* [#1067](https://github.com/gsrafael01/ESGST/issues/1067) Show sync results when clicking on the auto sync button
* [#1065](https://github.com/gsrafael01/ESGST/issues/1065) Bring back option to open features in popups
* [#1064](https://github.com/gsrafael01/ESGST/issues/1064) Add option to Level Up Calculator to display current user level
* [#1063](https://github.com/gsrafael01/ESGST/issues/1063) Add option to remove sidebar in ESGST feature pages
* [#1062](https://github.com/gsrafael01/ESGST/issues/1062) Fix a bug in Custom Header/Footer Links that does not reset links
* [#1061](https://github.com/gsrafael01/ESGST/issues/1061) Add a new game category: Barter.vg
* [#1060](https://github.com/gsrafael01/ESGST/issues/1060) Allow links to be reordered in User Links
* [#1059](https://github.com/gsrafael01/ESGST/issues/1059) Add option to make settings menu collapsible
* [#1058](https://github.com/gsrafael01/ESGST/issues/1058) Add a feature: Visible Gifts Breakdown
* [#1057](https://github.com/gsrafael01/ESGST/issues/1057) Apply Accurate Timestamp to Avatar Popout
* [#1056](https://github.com/gsrafael01/ESGST/issues/1056) More improvements to settings menu
* [#1055](https://github.com/gsrafael01/ESGST/issues/1055) Fix a bug in Not Received Finder that prevents the feature from working
* [#1053](https://github.com/gsrafael01/ESGST/issues/1053) Fix a bug that does not save some options
* [#1052](https://github.com/gsrafael01/ESGST/issues/1052) Remove Discussion Edit Detector (fixed by cg)
* [#1050](https://github.com/gsrafael01/ESGST/issues/1050) Improvements to Entered Giveaways Stats
* [#1048](https://github.com/gsrafael01/ESGST/issues/1048) Add an option to show a simplified view of Pagination Navigation On Top
* [#1045](https://github.com/gsrafael01/ESGST/issues/1045) Add option to display number of gifts won from / sent to user in User Giveaway Data
* [#1044](https://github.com/gsrafael01/ESGST/issues/1044) Detect removed games in the No CV Games database
* [#1041](https://github.com/gsrafael01/ESGST/issues/1041) Insert main page heading buttons after pagination
* [#1011](https://github.com/gsrafael01/ESGST/issues/1011) Fix a bug that does not load categories properly in created pages

**8.1.4 (December 4, 2018)**

* [#1054](https://github.com/gsrafael01/ESGST/issues/1054) Add a feature: Happy Holidays Integration

**8.1.3 (December 3, 2018)**

* [#1047](https://github.com/gsrafael01/ESGST/issues/1047) Fix a bug in the settings menu that does not allow adding new colors
* [#1046](https://github.com/gsrafael01/ESGST/issues/1046) Fix a bug in Enter/Leave Giveaway Button that does not add a button to re-enter giveaways in the entered page
* [#1042](https://github.com/gsrafael01/ESGST/issues/1042) Fix conflicts with holiday gifts elements
* [#1040](https://github.com/gsrafael01/ESGST/issues/1040) Improvements to settings menu
* [#1039](https://github.com/gsrafael01/ESGST/issues/1039) Fix a bug that does not allow editing custom paths
* [#1038](https://github.com/gsrafael01/ESGST/issues/1038) Remove options to open features in a new tab and make it the default behavior
* [#1037](https://github.com/gsrafael01/ESGST/issues/1037) Extend Custom Giveaway Background to Giveaway Extractor
* [#1036](https://github.com/gsrafael01/ESGST/issues/1036) Fix a bug in Giveaway Filters that does not filter descriptions
* [#1035](https://github.com/gsrafael01/ESGST/issues/1035) Fix a bug that does not reset colors in the settings menu
* [#1034](https://github.com/gsrafael01/ESGST/issues/1034) Fix a bug in Custom Giveaway Background that does not color giveaways correctly in created/entered/won pages

**8.2.1 (December 1, 2018)**

* [#1032](https://github.com/gsrafael01/ESGST/issues/1032) Hotfix for v8.1.1

**8.1.1 (December 1, 2018)**

* [#1032](https://github.com/gsrafael01/ESGST/issues/1032) Hotfix for v8.1.0

**8.1.0 (December 1, 2018)**

* [#1031](https://github.com/gsrafael01/ESGST/issues/1031) Add a new feature: Entered Giveaways Stats
* [#1030](https://github.com/gsrafael01/ESGST/issues/1030) Fix a bug in Giveaway Templates that does not create giveaways through the Create Giveaway button
* [#1029](https://github.com/gsrafael01/ESGST/issues/1029) Fix a bug in Giveaway Filters that does not toggle SteamGifts filters
* [#1028](https://github.com/gsrafael01/ESGST/issues/1028) Add a new feature: User Links
* [#1027](https://github.com/gsrafael01/ESGST/issues/1027) Fix a bug that positions Created/Entered/Won Giveaway Details columns in the wrong order
* [#1026](https://github.com/gsrafael01/ESGST/issues/1026) Fix a bug that does not load username history
* [#1024](https://github.com/gsrafael01/ESGST/issues/1024) Specify the element to retrieve usernames from more
* [#1023](https://github.com/gsrafael01/ESGST/issues/1023) Add option to position Quick Giveaway Search on the right to prevent it from moving the other buttons
* [#1022](https://github.com/gsrafael01/ESGST/issues/1022) Revamp ESGST-generated pages/popups
* [#1015](https://github.com/gsrafael01/ESGST/issues/1015) Add option to hide games from list to Multi-Manager
* [#1014](https://github.com/gsrafael01/ESGST/issues/1014) Only round chance / chance per point when displaying it, but keep it unrounded internally for better accuracy
* [#1012](https://github.com/gsrafael01/ESGST/issues/1012) Add a new feature: Custom Giveaway Background
* [#990](https://github.com/gsrafael01/ESGST/issues/990) Fix a bug that does not allow some elements to be re-ordered

**8.0.5 (November 26, 2018)**

* [#1021](https://github.com/gsrafael01/ESGST/issues/1021) Fix a bug that detects wrong removed games when syncing
* [#1020](https://github.com/gsrafael01/ESGST/issues/1020) Fix a bug in Reply Box Popup that does not go to the comment after posting
* [#1019](https://github.com/gsrafael01/ESGST/issues/1019) Use date-fns to format and display dates
* [#1017](https://github.com/gsrafael01/ESGST/issues/1017) Detect giveaways for Steam gift cards and Humble bundles
* [#1016](https://github.com/gsrafael01/ESGST/issues/1016) Change package scripts
* [#1013](https://github.com/gsrafael01/ESGST/issues/1013) Add giveaway filter "Game Tags"
* [#1009](https://github.com/gsrafael01/ESGST/issues/1009) Fix a bug that does not format train links correctly in Multiple Giveaway Creator
* [#1008](https://github.com/gsrafael01/ESGST/issues/1008) Fix a bug that does not calculate points to win in the entered page

**8.0.4 (November 1, 2018)**

* [#1007](https://github.com/gsrafael01/ESGST/issues/1007) Fix a bug that happens when trying to recreate a giveaway in Giveaway Recreator
* [#1006](https://github.com/gsrafael01/ESGST/issues/1006) Fix a bug that happens when trying to view the results in Multiple Giveaway Creator
* [#1005](https://github.com/gsrafael01/ESGST/issues/1005) Add option to automatically unbookmark inaccessible giveaways to Giveaway Bookmarks
* [#1004](https://github.com/gsrafael01/ESGST/issues/1004) Fix a bug that does not automatically unbookmark ended giveaways in Giveaway Bookmarks
* [#1003](https://github.com/gsrafael01/ESGST/issues/1003) Fix a bug that happens when saving a template in Giveaway Templates
* [#1000](https://github.com/gsrafael01/ESGST/issues/1000) Add option to remove only wishlisted games to Hidden Games Remover
* [#999](https://github.com/gsrafael01/ESGST/issues/999) Fix a bug that happens when trying to edit a giveaway in Multiple Giveaway Creator
* [#996](https://github.com/gsrafael01/ESGST/issues/996) Allow multiple checkbox selection with Shift key in Multi-Manager
* [#995](https://github.com/gsrafael01/ESGST/pull/995) Fix a bug that happens when applying a template in Giveaway Templates
* [#994](https://github.com/gsrafael01/ESGST/issues/994) Add option to fallback to the Steam API when syncing without being logged in
* [#993](https://github.com/gsrafael01/ESGST/pull/993) Automatically add panel to the first visible text area in Comment Formatting Helper
* [#992](https://github.com/gsrafael01/ESGST/issues/992) Fix a style issue in Grid View
* [#988](https://github.com/gsrafael01/ESGST/issues/988) Fix a style issue that increases the hide giveaway button opacity
* [#987](https://github.com/gsrafael01/ESGST/issues/987) Fix a bug that prevents game tags from being shown

**8.0.3 (October 16, 2018)**

* [#985](https://github.com/gsrafael01/ESGST/issues/985) Fix a style conflict between jQuery UI' CSS and SteamGifts' CSS
* [#984](https://github.com/gsrafael01/ESGST/issues/984) Fix dragging system for giveaway pages
* [#983](https://github.com/gsrafael01/ESGST/issues/983) Fix a bug that does not highlight copies from pinned giveaways in Giveaway Copy Highlighter
* [#982](https://github.com/gsrafael01/ESGST/issues/982) Fix a style issue in Grid View
* [#981](https://github.com/gsrafael01/ESGST/issues/981) Fix a bug in Giveaway Winners Link
* [#980](https://github.com/gsrafael01/ESGST/issues/980) Fix a bug that duplicates game categories
* [#979](https://github.com/gsrafael01/ESGST/issues/979) Fix a style issue with game categories that are moved to the giveaway columns
* [#978](https://github.com/gsrafael01/ESGST/issues/978) Add option to use preferred Google/Microsoft account when restoring/backing up
* [#977](https://github.com/gsrafael01/ESGST/issues/977) Fix a style issue that decreases the opacity of giveaway icons in the giveaway page
* [#922](https://github.com/gsrafael01/ESGST/issues/922) Load package data without having to reload the page in Game Categories

**8.0.2 (October 12, 2018)**

* [#975](https://github.com/gsrafael01/ESGST/issues/975) Fix style issues
* [#974](https://github.com/gsrafael01/ESGST/issues/974) Make Level Progress Visualizer and Points Visualizer bars dynamically adjust to the size of the button
* [#973](https://github.com/gsrafael01/ESGST/issues/973) Fix a style issue that lowers the opacity of the points/copies elements
* [#970](https://github.com/gsrafael01/ESGST/issues/970) Fix a bug that does not show replies in the inbox page with Reply From Inbox
* [#969](https://github.com/gsrafael01/ESGST/issues/969) Fix a bug that refreshes the page after commenting with Multi-Reply
* [#968](https://github.com/gsrafael01/ESGST/issues/968) Add option to change Level Progress Visualizer and Points Visualizer bar colors
* [#967](https://github.com/gsrafael01/ESGST/issues/967) Make Level Progress Visualizer and Points Visualizer compatible
* [#966](https://github.com/gsrafael01/ESGST/issues/966) Add a new feature: Visible Full Level

**8.0.1 (October 11, 2018)**



**8.0.0 (October 11, 2018)**

* [#965](https://github.com/gsrafael01/ESGST/issues/965) Add "Winners" giveaway filter
* [#964](https://github.com/gsrafael01/ESGST/issues/964) Add option to categorize Steam games to Multi Manager
* [#963](https://github.com/gsrafael01/ESGST/issues/963) Extract ItsTooHard and Jigidi links with Giveaway Extractor
* [#962](https://github.com/gsrafael01/ESGST/issues/962) Add option to automatically bookmark giveaways when trying to enter them without enough points to Enter/Leave Giveaway Button
* [#961](https://github.com/gsrafael01/ESGST/issues/961) Add option to display time to point cap alongside with points at the header
* [#960](https://github.com/gsrafael01/ESGST/issues/960) Add new section to the settings menu to handle elements order and prevent them from being draggable in all pages
* [#959](https://github.com/gsrafael01/ESGST/issues/959) Add option to use different pause settings in Endless Scrolling depending on the include path
* [#958](https://github.com/gsrafael01/ESGST/issues/958) Add option to reset left/right main page heading buttons order
* [#957](https://github.com/gsrafael01/ESGST/issues/957) Extend new draggable system to left/right main page heading buttons
* [#956](https://github.com/gsrafael01/ESGST/issues/956) Add which games were won from the listed users to User Giveaway Data
* [#950](https://github.com/gsrafael01/ESGST/issues/950) Fix HTML in User Stats
* [#949](https://github.com/gsrafael01/ESGST/issues/949) Fix a bug that does not show giveaway info category for games with 0P
* [#946](https://github.com/gsrafael01/ESGST/issues/946) Add a button for 2.14.4 "Only extract from the current giveaway onward"
* [#937](https://github.com/gsrafael01/ESGST/issues/937) Add a new game category and giveaway filter: Followed
* [#936](https://github.com/gsrafael01/ESGST/issues/936) Make elements in the giveaway links draggable
* [#935](https://github.com/gsrafael01/ESGST/issues/935) Fix a bug that empties the header points when removing someone from the whitelist
* [#933](https://github.com/gsrafael01/ESGST/issues/933) Fix HTML in Multiple Giveaway Creator
* [#925](https://github.com/gsrafael01/ESGST/issues/925) Make elements in the giveaway heading draggable
* [#902](https://github.com/gsrafael01/ESGST/issues/902) Change Content-Type header in Dropbox requests to application/octet-stream

**7.26.3 (August 15, 2018)**

* [#889](https://github.com/revilheart/ESGST/issues/889) Fix some bugs in Trade Bumper
* [#888](https://github.com/revilheart/ESGST/issues/888) Fix a conflict with Do You Even Play, Bro?
* [#887](https://github.com/revilheart/ESGST/issues/887) Fix a bug that sometimes adds a loading icon to giveaways when it shouldn&#39;t in Game Categories
* [#886](https://github.com/revilheart/ESGST/issues/886) Fix a few syntax bugs
* [#885](https://github.com/revilheart/ESGST/issues/885) Fix a bug that happens when loading categories for giveaways that were unfiltered


**7.26.2 (August 10, 2018)**

* [#881](https://github.com/revilheart/ESGST/issues/881) Add option to show game categories that do not need to be fetched from Steam instantly
* [#880](https://github.com/revilheart/ESGST/issues/880) Fix a bug that does not apply some themes
* [#879](https://github.com/revilheart/ESGST/issues/879) Add the feature to show tag suggestions while typing as an option
* [#878](https://github.com/revilheart/ESGST/issues/878) Load game categories for filtered giveaways on demand


**7.26.1 (August 8, 2018)**

* [#877](https://github.com/revilheart/ESGST/issues/877) Fix a bug that does not sync Steam groups
* [#876](https://github.com/revilheart/ESGST/issues/876) Fix a bug that does not retrieve game categories correctly for non-US users
* [#873](https://github.com/revilheart/ESGST/issues/873) Implement global 200ms limit to Steam store API requests
* [#872](https://github.com/revilheart/ESGST/issues/872) Fix a bug where some features don&#39;t work correctly in ESGST-generated pages
* [#871](https://github.com/revilheart/ESGST/issues/871) Fix a bug that does not load emojis
* [#859](https://github.com/revilheart/ESGST/issues/859) Fix a bug that does not load Profile Links if one of the sub-options is disabled
* [#848](https://github.com/revilheart/ESGST/issues/848) Fix bugs introduced by v7.25.0
* [#806](https://github.com/revilheart/ESGST/issues/806) Add option to continuously load X more pages (max 10) when visiting any page to Endless Scrolling


**7.26.0 (August 6, 2018)**

* [#870](https://github.com/revilheart/ESGST/issues/870) Add Learning game category
* [#869](https://github.com/revilheart/ESGST/issues/869) Add Singleplayer game category
* [#868](https://github.com/revilheart/ESGST/issues/868) Include online multiplayer, co-op and online co-op in the Multiplayer game category
* [#867](https://github.com/revilheart/ESGST/issues/867) Link to SGTools pages in the Unsent Gifts Sender results
* [#866](https://github.com/revilheart/ESGST/issues/866) Add Enterable filter to Giveaway Extractor
* [#864](https://github.com/revilheart/ESGST/issues/864) Add a feature: Group Tags
* [#862](https://github.com/revilheart/ESGST/issues/862) Add autocomplete feature to User Tags and Game Tags


**7.25.4 (August 2, 2018)**



**7.25.3 (August 2, 2018)**



**7.25.2 (August 2, 2018)**

* [#857](https://github.com/revilheart/ESGST/issues/857) Add option to backup as .zip or .json
* [#854](https://github.com/revilheart/ESGST/issues/854) Move each module into a separate file
* [#853](https://github.com/revilheart/ESGST/issues/853) Move some generic functions to a separate file


**7.25.2 (August 2, 2018)**

* [#857](https://github.com/revilheart/ESGST/issues/857) Add option to backup as .zip or .json
* [#854](https://github.com/revilheart/ESGST/issues/854) Move each module into a separate file
* [#853](https://github.com/revilheart/ESGST/issues/853) Move some generic functions to a separate file


**7.25.1 (July 28, 2018)**

* [#848](https://github.com/revilheart/ESGST/issues/848) Fix bugs introduced by v7.25.0
* [#850](https://github.com/revilheart/ESGST/issues/850) Fix the extension's toolbar popup
* [#852](https://github.com/revilheart/ESGST/issues/852) Add a new game category: HLTB

**7.25.0 (July 27, 2018)**

* [#845](https://github.com/revilheart/ESGST/issues/845) Fix the extension to comply with Mozilla requirements

**7.24.1 (July 24, 2018)**

* [#844](https://github.com/revilheart/ESGST/issues/844) Show error message in the giveaway if game categories failed to load
* [#843](https://github.com/revilheart/ESGST/issues/843) Fix a bug that re-retrieves categories for games that were already recently retrieved
* [#842](https://github.com/revilheart/ESGST/issues/842) Fix Is There Any Deal? Info
* [#841](https://github.com/revilheart/ESGST/issues/841) Extend "Most sent to" list to other users in User Giveaway Data
* [#840](https://github.com/revilheart/ESGST/issues/840) Prevent User Giveaway Data from making useless requests if a giveaway has less than or equal to 3 winners
* [#839](https://github.com/revilheart/ESGST/issues/839) Fix a bug that happens sometimes when hovering over the input field in Quick Giveaway Search
* [#838](https://github.com/revilheart/ESGST/issues/838) Fix a bug that colors ended giveaways as green the first time they are found in Giveaway Encrypter/Decrypter
* [#836](https://github.com/revilheart/ESGST/issues/836) Open links from the header menu in a new tab
* [#834](https://github.com/revilheart/ESGST/issues/834) Enhance cookie manipulation in the extension to bypass age checks in requests to the Steam store
* [#833](https://github.com/revilheart/ESGST/issues/833) Fix a bug that happens when showing game categories in real time
* [#832](https://github.com/revilheart/ESGST/issues/832) Fix changelog link in the header menu
* [#828](https://github.com/revilheart/ESGST/issues/828) Add option to show the Giveaway Encrypter/Decrypter header button even if there are only ended giveaways in the page
* [#803](https://github.com/revilheart/ESGST/issues/803) Fix a bug that doesn't show groups containing HTML entities in Multiple Giveaway Creator

**7.24.0 (July 22, 2018)**

* [#829](https://github.com/revilheart/ESGST/issues/829) Add options to limit requests to the Steam store and show categories in real time to Game Categories
* [#831](https://github.com/revilheart/ESGST/issues/831) Fix a bug that does not calculate average entries correctly in Entry Tracker
* [#830](https://github.com/revilheart/ESGST/issues/830) Fix a bug that identifies non-owned games as owned in Game Categories
* [#827](https://github.com/revilheart/ESGST/issues/827) Add a feature: Giveaway Points To Win
* [#826](https://github.com/revilheart/ESGST/issues/826) Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" to Giveaways Sorter
* [#805](https://github.com/revilheart/ESGST/issues/805) Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" giveaway filters
* [#808](https://github.com/revilheart/ESGST/issues/808) Fix a bug that does not remember the position of the winners column in group pages when dragging
* [#825](https://github.com/revilheart/ESGST/issues/825) Fix a style issue that shows two scrollbars in the settings menu

**7.23.0 (July 20, 2018)**

* [#824](https://github.com/revilheart/ESGST/issues/824) Add enhancements to User Giveaway Data
* [#823](https://github.com/revilheart/ESGST/issues/823) Fix a bug that does not change SteamGifts filters through Giveaway Filters correctly
* [#822](https://github.com/revilheart/ESGST/issues/822) Fix a bug that does not pin highlighted discussions after sorting
* [#821](https://github.com/revilheart/ESGST/issues/821) Make SGTools filter ignore the Chance, Chance Per Point, Comments, Entries and Ratio filters
* [#820](https://github.com/revilheart/ESGST/issues/820) Fix the "Add Current" button for includes/excludes in the main page
* [#819](https://github.com/revilheart/ESGST/issues/819) Possible fix for endless spawning issue with Steam Activation Links
* [#818](https://github.com/revilheart/ESGST/issues/818) Use the featured heading of a user's profile page instead of the page heading
* [#817](https://github.com/revilheart/ESGST/issues/817) Add option to choose custom colors for Giveaway Copy Highlighter
* [#816](https://github.com/revilheart/ESGST/issues/816) Add option to automatically mark a user's own comments as read
* [#815](https://github.com/revilheart/ESGST/issues/815) Add option to enable tracking controls for a user's own comments
* [#814](https://github.com/revilheart/ESGST/issues/814) Add option to fade out read comments in Comment Tracker
* [#813](https://github.com/revilheart/ESGST/issues/813) Fix a bug that happens when refreshing active discussions on the sidebar
* [#812](https://github.com/revilheart/ESGST/issues/812) Fix a bug that happens when retrieving categories of discussions in the sidebar
* [#790](https://github.com/revilheart/ESGST/issues/790) Add option to automatically update hidden games adding/removing a game to/from the list
* [#811](https://github.com/revilheart/ESGST/issues/811) Show success message when cleaning data
* [#795](https://github.com/revilheart/ESGST/issues/795) Fix a bug that happens when cleaning data for features that the user hasn't used yet
* [#810](https://github.com/revilheart/ESGST/issues/810) Automatically detect username changes when visiting a user's profile page
* [#804](https://github.com/revilheart/ESGST/issues/804) Change resource references to the current version in the userscript version
* [#802](https://github.com/revilheart/ESGST/issues/802) Make the settings search bar stay always visible when scrolling
* [#797](https://github.com/revilheart/ESGST/issues/797) Add Public giveaway filter
* [#801](https://github.com/revilheart/ESGST/issues/801) Add a feature: Comment Filters
* [#147](https://github.com/revilheart/ESGST/issues/147) Add extension support for Microsoft Edge
* [#796](https://github.com/revilheart/ESGST/issues/796) Add countdown to the duplicate giveaway waiting period in Multiple Giveaway Creator
* [#794](https://github.com/revilheart/ESGST/issues/794) Add Patreon as an additional form of donation
* [#785](https://github.com/revilheart/ESGST/issues/785) Detect packages that contain owned/wishlisted games through Game Categories
* [#792](https://github.com/revilheart/ESGST/issues/792) Fix a bug that does not update the list of reduced CV games if a game was removed
* [#784](https://github.com/revilheart/ESGST/issues/784) Load themes faster
* [#646](https://github.com/revilheart/ESGST/issues/646) Extend header/footer to ESGST-generated pages
* [#672](https://github.com/revilheart/ESGST/issues/672) Add option to clean discussion (remove deleted comments from the database) to Comment Tracker
* [#783](https://github.com/revilheart/ESGST/issues/783) Open SGTools links in new tabs on Giveaway Extractor

**7.22.0 (June 24, 2018)**

* [#545](https://github.com/revilheart/ESGST/issues/545) Add a feature: Have/Want List Checker
* [#572](https://github.com/revilheart/ESGST/issues/572) Fix a bug that does not predict the level in Level Progress Visualizer correctly
* [#690](https://github.com/revilheart/ESGST/issues/690) Fix a bug where Giveaway Group Loader fails in some pages
* [#702](https://github.com/revilheart/ESGST/issues/702) Extend Attached Image Carousel to Quick Inbox View
* [#722](https://github.com/revilheart/ESGST/issues/722) Improve performance when applying filter presets (removes live-search select box and invert rule)
* [#732](https://github.com/revilheart/ESGST/issues/732) Bring back filter counters
* [#768](https://github.com/revilheart/ESGST/issues/768) Save state of "create train" and "remove links" switches from Multiple Giveaway Creator with Giveaway Templates
* [#769](https://github.com/revilheart/ESGST/issues/769) Add polyfill for IntersectionObserver
* [#771](https://github.com/revilheart/ESGST/issues/771) Fix a bug that does not filter games without images after data being retrieved with Created/Entered/Won Giveaway Details
* [#772](https://github.com/revilheart/ESGST/issues/772) Fix domain for SteamGifts popups on SteamTrades
* [#773](https://github.com/revilheart/ESGST/issues/773) Fix Shared Group Checker for new Steam group page design
* [#775](https://github.com/revilheart/ESGST/issues/775) Save game name when it doesn't have an image for future use
* [#776](https://github.com/revilheart/ESGST/issues/776) Fix a bug that does not save an advanced filter preset after deleting the rules
* [#777](https://github.com/revilheart/ESGST/issues/777) Fix a bug that does not filter by Achievements or Linux
* [#778](https://github.com/revilheart/ESGST/issues/778) Add small manual for advanced filters
* [#779](https://github.com/revilheart/ESGST/issues/779) Fix conflict with Touhou script
* [#780](https://github.com/revilheart/ESGST/issues/780) Fix a bug that blinks the minimize popups panel if the popup was open when it ended
* [#781](https://github.com/revilheart/ESGST/issues/781) Fix a bug that does not allow restoring .zip files in Firefox
* [#782](https://github.com/revilheart/ESGST/issues/782) Fix a bug that skips the Quick Inbox View popout to the top when scrolling down

**7.21.0 (June 10, 2018)**

* Hotfix for v7.20.4

**7.21.0 (June 10, 2018)**

* [#765](https://github.com/revilheart/ESGST/issues/765) Fix a bug that does not allow restoring .zip files
* [#764](https://github.com/revilheart/ESGST/issues/764) Fix a bug that does not save filter settings if only basic filters are enabled
* [#763](https://github.com/revilheart/ESGST/issues/763) Fix a bug that does not retrieve all pages correctly in Whitelist/Blacklist Checker
* [#762](https://github.com/revilheart/ESGST/issues/762) Fix a bug that adds duplicate "Sticky group" buttons
* [#760](https://github.com/revilheart/ESGST/issues/760) Add SteamGifts' CSS file to the repository to prevent ESGST pages from being messed up if cg updates the CSS
* [#759](https://github.com/revilheart/ESGST/issues/759) Fix a bug that shows wrong list of users in Group Library/Wishlist Checker when searching by app ID
* [#758](https://github.com/revilheart/ESGST/issues/758) Fix a bug that only previews comments on user input
* [#757](https://github.com/revilheart/ESGST/issues/757) Fix a bug that does not load encrypted giveaways
* [#756](https://github.com/revilheart/ESGST/issues/756) Open settings menu when clicking on the extension icon
* [#755](https://github.com/revilheart/ESGST/issues/755) Add option to minimize non-temporary popups
* [#753](https://github.com/revilheart/ESGST/issues/753) Fix a bug that adds duplicate "Skip User" buttons to Whitelist/Blacklist Checker
* [#752](https://github.com/revilheart/ESGST/issues/752) Fix active discussions on narrow sidebar
* [#750](https://github.com/revilheart/ESGST/issues/750) Fix a bug that positions large popouts incorrectly in screens below 1440x900
* [#749](https://github.com/revilheart/ESGST/issues/749) Fix a bug that does not allow applying empty presets
* [#748](https://github.com/revilheart/ESGST/issues/748) Improve the scrolling
* [#747](https://github.com/revilheart/ESGST/issues/747) Fix a bug that applies discussion filter on the main page even when disabled
* [#746](https://github.com/revilheart/ESGST/issues/746) Add a feature: Points Visualizer
* [#745](https://github.com/revilheart/ESGST/issues/745) Fix a style issue in the filters
* [#744](https://github.com/revilheart/ESGST/issues/744) Add a new game category: DLC (Base Owned)
* [#743](https://github.com/revilheart/ESGST/issues/743) Bring back option to select which filters to appear
* [#742](https://github.com/revilheart/ESGST/issues/742) Fix a bug that does not load Multi-Manager in the regular pages
* [#711](https://github.com/revilheart/ESGST/issues/711) Fix a bug in Quick Inbox View
* [#671](https://github.com/revilheart/ESGST/issues/671) Add a feature: Giveaway End Time Highlighter
* [#573](https://github.com/revilheart/ESGST/issues/573) Completely revamp User Giveaway Data

**7.20.5 (May 28, 2018)**

* Hotfix for v7.20.4

**7.20.4 (May 28, 2018)**

* [#737](https://github.com/revilheart/ESGST/issues/737) Save paused state of filters to allow them to remain paused when refreshing the page
* [#736](https://github.com/revilheart/ESGST/issues/736) Fix a bug that deletes settings if saving a preset with some filters paused
* [#735](https://github.com/revilheart/ESGST/issues/735) Convert old presets to the new system
* [#734](https://github.com/revilheart/ESGST/issues/734) Fix a bug in Endless Scrolling
* [#731](https://github.com/revilheart/ESGST/issues/731) Fix a bug that does not apply presets

**7.20.3 (May 27, 2018)**

* [#730](https://github.com/revilheart/ESGST/issues/730) Possible fix to massive CPU usage spikes
* [#728](https://github.com/revilheart/ESGST/issues/728) Increase max-height of filters area
* [#727](https://github.com/revilheart/ESGST/issues/727) Fix a bug that happens when backing up to Google Drive
* [#726](https://github.com/revilheart/ESGST/issues/726) Fix a bug in the filters
* [#723](https://github.com/revilheart/ESGST/issues/723) Change color of AND/OR filter buttons
* [#721](https://github.com/revilheart/ESGST/issues/721) Fix a bug that happens in Giveaway Encrypter/Decrypter because of filters
* [#720](https://github.com/revilheart/ESGST/issues/720) Bring back the core of the basic filters as an opt-out option
* [#718](https://github.com/revilheart/ESGST/issues/718) Add button to pause filter rules/groups to advanced filters

**7.20.2 (May 27, 2018)**

* Hotfix for v7.20.0

**7.20.1 (May 26, 2018)**

* Hotfix for v7.20.0

**7.20.0 (May 26, 2018)**

* [#709](https://github.com/revilheart/ESGST/issues/709) Use jQuery QueryBuilder to configure filters
* [#715](https://github.com/revilheart/ESGST/issues/715) Add a feature: Narrow Sidebar
* [#708](https://github.com/revilheart/ESGST/issues/708) Fix a bug that does not load features correctly in new tabs
* [#667](https://github.com/revilheart/ESGST/issues/667) Fix a bug that does not load endless features correctly in some pages
* [#678](https://github.com/revilheart/ESGST/issues/678) Display ? instead of negative CV in Game Categories - Giveaway Info and get the price from the giveaway points when available
* [#707](https://github.com/revilheart/ESGST/issues/707) Do not go to comment in Quick Inbox View
* [#665](https://github.com/revilheart/ESGST/issues/665) Add other found replies to the comment instead of showing them in a popup in Reply From Inbox
* [#703](https://github.com/revilheart/ESGST/issues/703) Improve description variables explanation in Multiple Giveaway Creator
* [#706](https://github.com/revilheart/ESGST/issues/706) Fix a bug that reverses the pages of a discussion when there is a hash in the URL
* [#705](https://github.com/revilheart/ESGST/issues/705) Fix a bug that does not manage items inside of Grid View popouts in Multi-Manager
* [#704](https://github.com/revilheart/ESGST/issues/704) Add option to hide games to Multi-Manager

**7.19.0 (May 20, 2018)**

* [#701](https://github.com/revilheart/ESGST/issues/701) Remove min-height requirement from Fixed Sidebar
* [#700](https://github.com/revilheart/ESGST/issues/700) Fix a bug that does not fix the sidebar after scrolling down a second time from the top
* [#699](https://github.com/revilheart/ESGST/issues/699) Fix a bug that does not display the sync page
* [#698](https://github.com/revilheart/ESGST/issues/698) Add option to choose the key combination to trigger the Custom Header/Footer Links editor
* [#695](https://github.com/revilheart/ESGST/issues/695) Fix a bug where sorting fails after hiding a single giveaway
* [#694](https://github.com/revilheart/ESGST/issues/694) Fix a style issue that does not position popouts above/below correctly
* [#693](https://github.com/revilheart/ESGST/issues/693) Fix a style issue that does not position popouts correctly if the window is scrolled horizontally
* [#692](https://github.com/revilheart/ESGST/issues/692) Remove min-height requirement from Fixed Main Page Heading
* [#691](https://github.com/revilheart/ESGST/issues/691) Change Giveaway Popup button to red if giveaway cannot be accessed
* [#689](https://github.com/revilheart/ESGST/issues/689) Add a button to clear the current query to the search field in the settings menu
* [#688](https://github.com/revilheart/ESGST/issues/688) Extend giveaway features to the archive page
* [#686](https://github.com/revilheart/ESGST/issues/686) Changes to how emojis are stored
* [#685](https://github.com/revilheart/ESGST/issues/685) Compress data when backing up
* [#684](https://github.com/revilheart/ESGST/issues/684) Add &quot;Last Bundled&quot; default link to Custom Header/Footer Links
* [#683](https://github.com/revilheart/ESGST/issues/683) Allow selected emojis to be re-ordered
* [#682](https://github.com/revilheart/ESGST/issues/682) Add option to retrieve game names when syncing
* [#681](https://github.com/revilheart/ESGST/issues/681) Fix a bug where filtering is applied when changing any filter options despite filtering being disabled
* [#680](https://github.com/revilheart/ESGST/issues/680) Add a feature: Visible Real CV
* [#679](https://github.com/revilheart/ESGST/issues/679) Add &quot;Previously Won&quot; game category
* [#677](https://github.com/revilheart/ESGST/issues/677) Fix a bug that does not persist some settings
* [#676](https://github.com/revilheart/ESGST/issues/676) Fix a bug that auto-backups to computer on every page load
* [#674](https://github.com/revilheart/ESGST/issues/674) Change how the NEW indicator works on Quick Inbox View


**7.18.3 (May 11, 2018)**

* [#675](https://github.com/revilheart/ESGST/issues/675) Remove Comment History from SteamTrades
* [#673](https://github.com/revilheart/ESGST/issues/673) Fix a bug that happens when creating giveaways through either Giveaway Templates or Multiple Giveaway Creator
* [#670](https://github.com/revilheart/ESGST/issues/670) Fix a bug that does not return Endless Scrolling to a paused state after continuously loading pages
* [#667](https://github.com/revilheart/ESGST/issues/667) Fix a bug that does not load endless features correctly in some pages


**7.18.2 (May 07, 2018)**

* [#668](https://github.com/revilheart/ESGST/issues/668) Hotfix for v7.18.1


**7.18.1 (May 07, 2018)**

* [#666](https://github.com/revilheart/ESGST/issues/666) Hotfix for v7.18.0


**7.18.0 (May 07, 2018)**

* [#664](https://github.com/revilheart/ESGST/issues/664) Fix a bug that does not decrypt giveaways containing the word bot in their name
* [#663](https://github.com/revilheart/ESGST/issues/663) Fix a bug that happens when importing giveaways with a description template for a train in Multiple Giveaway Creator
* [#662](https://github.com/revilheart/ESGST/issues/662) Fixate the Comment Formatting Helper panel without limiting the height of the text area
* [#661](https://github.com/revilheart/ESGST/issues/661) Fix a bug in Comment Formatting Helper that does not add a scrolling bar to the text area in the edit discussion page
* [#660](https://github.com/revilheart/ESGST/issues/660) Fix a bug that removes all games when syncing if both the store and the API methods failed
* [#659](https://github.com/revilheart/ESGST/issues/659) Fix a style issue that sometimes does not overlap popups/popouts correctly
* [#658](https://github.com/revilheart/ESGST/issues/658) Fix a bug that does not refresh Quick Inbox View correctly
* [#657](https://github.com/revilheart/ESGST/issues/657) Add infinite max filters to Giveaway/Discussion Filters
* [#655](https://github.com/revilheart/ESGST/issues/655) Fix a bug that does not load endless features correctly
* [#654](https://github.com/revilheart/ESGST/issues/654) Make SGTools link draggable in Giveaway Extractor
* [#653](https://github.com/revilheart/ESGST/issues/653) Add missing Steam and search links to SGTools giveaways in Giveaway Extractor
* [#651](https://github.com/revilheart/ESGST/issues/651) Update FontAwesome links
* [#650](https://github.com/revilheart/ESGST/issues/650) Limit requests to the Steam store when syncing to 1 per second
* [#647](https://github.com/revilheart/ESGST/issues/647) Changes to the structure of the code
* [#645](https://github.com/revilheart/ESGST/issues/645) Add a SGTools filter to Giveaway Filters
* [#644](https://github.com/revilheart/ESGST/issues/644) Fix a bug that does not delete table rows in Comment Formatting Helper
* [#642](https://github.com/revilheart/ESGST/issues/642) Add option to group all keys for the same game in Multiple Giveaway Creator
* [#641](https://github.com/revilheart/ESGST/issues/641) Add a new section to the settings menu: Themes
* [#640](https://github.com/revilheart/ESGST/issues/640) Fix tooltip in Multiple Giveaway Creator
* [#639](https://github.com/revilheart/ESGST/issues/639) Convert checkboxes from circles to squares
* [#638](https://github.com/revilheart/ESGST/issues/638) Fix some bugs that happen when marking comments as unread
* [#608](https://github.com/revilheart/ESGST/issues/608) Add a feature: Multi-Manager (remove Giveaway Manager and Multi-Tag)
* [#332](https://github.com/revilheart/ESGST/issues/332) Fix a bug that fails to create multiple giveaways for the same game in Multiple Giveaway Creator


**7.17.8 (April 19, 2018)**

* [#637](https://github.com/revilheart/ESGST/issues/637) Fix a style issue in pages generated by ESGST open in a new tab
* [#636](https://github.com/revilheart/ESGST/issues/636) Fix a bug that calculates the wrong chance per point if a giveaway has 0 points
* [#635](https://github.com/revilheart/ESGST/issues/635) Bypass bot protections when extracting giveaways
* [#634](https://github.com/revilheart/ESGST/issues/634) Fix a bug that does not switch the colors of game category icons for alt accounts when moving them
* [#633](https://github.com/revilheart/ESGST/issues/633) Fix a bug that does not turn the decrypted giveaways icon to green when new giveaways are found
* [#628](https://github.com/revilheart/ESGST/issues/628) Add option to only search for comments in a specific page range to Comment Searcher
* [#599](https://github.com/revilheart/ESGST/issues/599) Extend Giveaways Sorter to popups
* [#567](https://github.com/revilheart/ESGST/issues/567) Add description variables to Multiple Giveaway Creator


**7.17.7 (April 14, 2018)**

* [#632](https://github.com/revilheart/ESGST/issues/632) Add option to limit how many SGTools giveaways are opened when extracting
* [#631](https://github.com/revilheart/ESGST/issues/631) Add option to allow manipulation of cookies for Firefox containers
* [#630](https://github.com/revilheart/ESGST/issues/630) Add more details to error messages during alt accounts sync
* [#629](https://github.com/revilheart/ESGST/issues/629) Cancel backup when canceling file name input
* [#627](https://github.com/revilheart/ESGST/issues/627) Implement a method to make the process of adding new filters easier
* [#626](https://github.com/revilheart/ESGST/issues/626) Fix a bug that does not sync games if the user does not have alt accounts set
* [#625](https://github.com/revilheart/ESGST/issues/625) Integrate SGTools giveaways into Giveaway Extractor
* [#624](https://github.com/revilheart/ESGST/issues/624) Fix a bug that opens duplicate SGTools links when extracting giveaways
* [#623](https://github.com/revilheart/ESGST/issues/623) Add option to save backups without asking for a file name
* [#593](https://github.com/revilheart/ESGST/issues/593) Add Groups and Creators giveaway filters and Authors discussion filter
* [#592](https://github.com/revilheart/ESGST/issues/592) Fix a bug that does not load more pages in Endless Scrolling if there are deleted giveaways in the current page with the ended filter set to hide all


**7.17.6 (April 11, 2018)**

* [#620](https://github.com/revilheart/ESGST/issues/620) Add more reliable methods of syncing and backing up
* [#619](https://github.com/revilheart/ESGST/issues/619) Fix a bug that does not add an Enter button when extracting giveaways with few points
* [#618](https://github.com/revilheart/ESGST/issues/618) Add option to open SGTools links when extracting giveaways
* [#617](https://github.com/revilheart/ESGST/issues/617) Fix a bug that does not sync owned games in alt accounts
* [#616](https://github.com/revilheart/ESGST/issues/616) Allow users to sync their games through the Steam API alone if the store method is unavailable
* [#615](https://github.com/revilheart/ESGST/issues/615) Fix a bug that does not reverse a discussion if endless scrolling is paused
* [#614](https://github.com/revilheart/ESGST/issues/614) Add option to reverse comments in a discussion by indicating it through a hash in the URL
* [#613](https://github.com/revilheart/ESGST/issues/613) Make blacklist checks an opt-out instead of an opt-in by default in Whitelist/Blacklist Checker
* [#611](https://github.com/revilheart/ESGST/issues/611) Add option to specify non-region restricted giveaways when importing in Multiple Giveaway Creator
* [#610](https://github.com/revilheart/ESGST/issues/610) Fix a bug that duplicates the permalink icon
* [#609](https://github.com/revilheart/ESGST/issues/609) Fix a bug that does not retrieve game names when syncing
* [#607](https://github.com/revilheart/ESGST/issues/607) Fix a bug that does not include the .zip download when notifying a new version in non-Firefox browsers
* [#604](https://github.com/revilheart/ESGST/issues/604) Fix a bug that prevents the script from loading
* [#603](https://github.com/revilheart/ESGST/issues/603) Fix a bug that can prevent some elements in the giveaway columns/panel from being moved
* [#600](https://github.com/revilheart/ESGST/issues/600) Fix a bug that does not show SG popups found when requesting data if static popups are enabled


**7.17.5 (April 05, 2018)**

* [#605](https://github.com/revilheart/ESGST/issues/605) Fix a bug that does not set the correct default values for some settings
* [#602](https://github.com/revilheart/ESGST/issues/602) Add option to clean duplicate data to the data cleaner menu
* [#598](https://github.com/revilheart/ESGST/issues/598) Implement a method to automatically detect and highlight new features/options in the settings menu with the [NEW] tag
* [#597](https://github.com/revilheart/ESGST/issues/597) Fix a bug that shows Inifity% chance per point on the entered page
* [#596](https://github.com/revilheart/ESGST/issues/596) Replace the terms &quot;Import&quot; and &quot;Export&quot; with &quot;Restore&quot; and &quot;Backup&quot; and change the icons to avoid any confusion
* [#584](https://github.com/revilheart/ESGST/issues/584) Fix a bug that does not reload the extension in Chrome when updating
* [#555](https://github.com/revilheart/ESGST/issues/555) Add SteamGifts filters to Giveaway Filters
* [#538](https://github.com/revilheart/ESGST/issues/538) Add options to allow users to specify the format of the tab indicators in Header Refresher
* [#524](https://github.com/revilheart/ESGST/issues/524) Fix a but that shows the new version popup twice
* [#299](https://github.com/revilheart/ESGST/issues/299) Implement a method to better handle marking discussions as visited across multiple tabs


**7.17.4 (March 26, 2018)**

* [#590](https://github.com/revilheart/ESGST/issues/590) Speed up retrieval of Game Categories for users that do not have ratings, removed and user-defined tags enabled
* [#588](https://github.com/revilheart/ESGST/issues/588) Fix a conflict between whitelist/blacklist/rule checks and Quick Inbox View
* [#587](https://github.com/revilheart/ESGST/issues/587) Prevent main page heading from being fixed if the page is too small
* [#586](https://github.com/revilheart/ESGST/issues/586) Add option to filter giveaways by chance per point
* [#585](https://github.com/revilheart/ESGST/issues/585) Fix a bug that duplicates user notes when importing and merging
* [#582](https://github.com/revilheart/ESGST/issues/582) Fix a couple bugs that prevent Game Categories from being retrieved correctly


**7.17.3 (March 20, 2018):**

* [#583](https://github.com/revilheart/ESGST/issues/583) Revert #565
* [#580](https://github.com/revilheart/ESGST/issues/580) Fix a bug in Tables Sorter that does not sort sent/received group columns correctly
* [#579](https://github.com/revilheart/ESGST/issues/579) Rename Whitelist/Blacklist Links to Profile Links and add more options


**7.17.2 (March 15, 2018):**

* Split jQuery, jQuery UI and Parsedown into separate files

**7.17.1 (March 14, 2018):**

* Add extension to the Mozilla store

**7.17.0 (March 14, 2018):**

* [#562](https://github.com/revilheart/ESGST/issues/562) Add descriptions to the precise options in Giveaway Templates
* [#563](https://github.com/revilheart/ESGST/issues/563) Add an option to specify the game when importing with Multiple Giveaway Creator
* [#564](https://github.com/revilheart/ESGST/issues/564) Fix a bug that does not extract the giveaway from the current page
* [#565](https://github.com/revilheart/ESGST/issues/565) Add minified version and set it as default
* [#566](https://github.com/revilheart/ESGST/issues/566) Add option to specify separate details for each imported giveaway in Multiple Giveaway Creator
* [#568](https://github.com/revilheart/ESGST/issues/568) Add an option to enable Giveaway Recreator for all created giveaways
* [#570](https://github.com/revilheart/ESGST/issues/570) Fix a bug in Chrome that does not open the giveaway extractor on first click
* [#571](https://github.com/revilheart/ESGST/issues/571) Include whether the giveaway is for a gift or a key in the template when using Giveaway Templates
* [#574](https://github.com/revilheart/ESGST/issues/574) Add a feature: Element Filters (remove Hidden Feature Container and Hidden Pinned Giveaways)
* [#575](https://github.com/revilheart/ESGST/issues/575) Move "Click here to see your review for this user" to the top of the page in Reply Box On Top on SteamTrades
* [#576](https://github.com/revilheart/ESGST/issues/576) Fix a bug that does not load features correctly in discussions that contain polls
* [#578](https://github.com/revilheart/ESGST/issues/578) Optimize the extension performance (Ongoing)
* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (Ongoing)

**7.16.5 (March 4, 2018):**

* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (ongoing)
* [#552](https://github.com/revilheart/ESGST/issues/552) Fix a bug that does not allow the Giveaway Extractor button to be moved
* [#556](https://github.com/revilheart/ESGST/issues/556) Only load Attached Images Carouself for images that are actually in the page
* [#558](https://github.com/revilheart/ESGST/issues/558) Fix a bug that does not extract giveaways in a new tab
* [#560](https://github.com/revilheart/ESGST/issues/560) Fix a bug that does not load ESGST sometimes
* [#561](https://github.com/revilheart/ESGST/issues/561) Fix a bug that happens when performing requests in the userscript version

**7.16.4 (March 2, 2018):**

* Hotfix for v7.16.3 (Userscript version was not working)

**7.16.3 (March 2, 2018):**

* Hotfix for v7.16.2 (Userscript version was not working)

**7.16.2 (March 2, 2018):**

* Hotfix for v7.16.1 (Forgot to change the version)

**7.16.1 (March 2, 2018):**

* [#527](https://github.com/revilheart/ESGST/issues/527) Fix a bug that happens when loading highlighted discussions
* [#537](https://github.com/revilheart/ESGST/issues/537) Add option to delete days from Entry Tracker history
* [#539](https://github.com/revilheart/ESGST/issues/539) Fix a bug that happens when sending unsent gifts with the options to check if the winner is whitelisted/blacklisted
* [#540](https://github.com/revilheart/ESGST/issues/540) Fix some bugs with the reordering of heading buttons
* [#541](https://github.com/revilheart/ESGST/issues/541) Extend Inbox Winner Highlighter to Quick Inbox View
* [#542](https://github.com/revilheart/ESGST/issues/542) Add options to specify image border width when highlighting a giveaway with Giveaway Winning Chance/Ratio
* [#543](https://github.com/revilheart/ESGST/issues/543) Fix a bug that does not load some features correctly
* [#544](https://github.com/revilheart/ESGST/issues/544) Change the order of the elements in the Giveaway Bookmarks popup
* [#548](https://github.com/revilheart/ESGST/issues/548) Fix a bug that decrypts giveaway links from the Quick Inbox View popout
* [#549](https://github.com/revilheart/ESGST/issues/549) Add domain instructions to adding a Steam API key
* [#550](https://github.com/revilheart/ESGST/issues/550) Optimize storage usage in the script version

**7.16.0 (February 25, 2018):**

* [#481](https://github.com/revilheart/ESGST/issues/481) Fix several inaccuracies in Level Progress Visualizer
* [#525](https://github.com/revilheart/ESGST/issues/525) Add a feature: Whitelist/Blacklist Links
* [#528](https://github.com/revilheart/ESGST/issues/528) Enhancements to Custom Header/Footer Links
* [#531](https://github.com/revilheart/ESGST/issues/531) Fix a bug that happens when trying to create multiple giveaways using the import option
* [#532](https://github.com/revilheart/ESGST/issues/532) Fix a bug in Entry Tracker that does not track entries in the entered page
* [#533](https://github.com/revilheart/ESGST/issues/533) Fix a conflict with RaChart Enhancer
* [#534](https://github.com/revilheart/ESGST/issues/534) Change the highlight style of Giveaway Winning Chance/Ratio
* [#535](https://github.com/revilheart/ESGST/issues/535) Fix a bug that prevents ESGST from loading correctly
* [#536](https://github.com/revilheart/ESGST/issues/536) Fix a bug that does not update the points when entering/leaving a giveaway in the entered page

**7.15.1 (February 24, 2018):**

* Hotfix for v7.15.0 (Forgot to change the version for the userscript version)

**7.15.0 (February 24, 2018):**

* [#501](https://github.com/revilheart/ESGST/issues/501) Fix a bug that prevents Level Progress Visualizer from loading correctly
* [#502](https://github.com/revilheart/ESGST/issues/502) Update the descriptions of all features
* [#504](https://github.com/revilheart/ESGST/issues/504) Add option to identify elements added by ESGST in the page through their tooltip
* [#505](https://github.com/revilheart/ESGST/issues/505) Fix a bug that does not load the Attached Images Carousel button
* [#506](https://github.com/revilheart/ESGST/issues/506) Fix a bug that happens when syncing giveaways if a giveaway was deleted
* [#507](https://github.com/revilheart/ESGST/issues/507) Show a popup if a user clicks on "Create" in Multiple Giveaway Creator and there are no giveaways in the queue
* [#508](https://github.com/revilheart/ESGST/issues/508) Extend Enter/Leave Giveaway Button to the entered page
* [#509](https://github.com/revilheart/ESGST/issues/509) Add a feature: Cake Day Reminder
* [#510](https://github.com/revilheart/ESGST/issues/510) Fix some issues that happen if a user has more than 999P
* [#511](https://github.com/revilheart/ESGST/issues/511) Add a review popup to Multiple Giveaway Creator
* [#512](https://github.com/revilheart/ESGST/issues/512) Load game features when using the pagination in the new giveaway page
* [#513](https://github.com/revilheart/ESGST/issues/513) Add an option to highlight the giveaway with the chance/ratio color
* [#514](https://github.com/revilheart/ESGST/issues/514) Fix a bug that happens when trying to enable a feature that conflicts with another
* [#515](https://github.com/revilheart/ESGST/issues/515) Fix a bug that was still showing the wrong status in Blacklist Giveaway Loader
* [#516](https://github.com/revilheart/ESGST/issues/516) Fix a bug that does not reset the text color of game categories to the default color
* [#517](https://github.com/revilheart/ESGST/issues/517) Allow the source element in Giveaway Encrypter/Decrypter to be moved
* [#518](https://github.com/revilheart/ESGST/issues/518) Add a button to reset the giveaway columns to their original order
* [#519](https://github.com/revilheart/ESGST/issues/519) Add an option to view the raw list of bookmarked giveaways
* [#520](https://github.com/revilheart/ESGST/issues/520) Check for a new version in the ESGST discussion using only the title
* [#521](https://github.com/revilheart/ESGST/issues/521) Add a feature: Custom Header/Footer Links (remove Quick Giveaway Browsing and Quick Discussion Browsing)
* [#522](https://github.com/revilheart/ESGST/issues/522) Fix a bug that does not detect all wishlists in Group Library/Wishlist Checker
* [#523](https://github.com/revilheart/ESGST/issues/523) Prevent some user features from being duplicated in Reply From Inbox

**7.14.4 (February 16, 2018):**

* [#338](https://github.com/revilheart/ESGST/issues/338) Cache Level Progress Visualizer prediction after giveaways end
* [#486](https://github.com/revilheart/ESGST/issues/486) Fix a bug that does not go to a permalink when using Collapse/Expand Replies Button with the automatic collapse enabled
* [#487](https://github.com/revilheart/ESGST/issues/487) Fix a bug that does not decrypt giveaways
* [#488](https://github.com/revilheart/ESGST/issues/488) Fix a bug that does not open the Quick Inbox View popout after a header refresh
* [#489](https://github.com/revilheart/ESGST/issues/489) Fix a bug that does not run Discussion Filters and Discussions Sorter on page load
* [#490](https://github.com/revilheart/ESGST/issues/490) Prevent Discussions Highlighter and Puzzle Marker buttons from switching places
* [#491](https://github.com/revilheart/ESGST/issues/491) Fix a bug that happens when checking suspensions in Not Activated/Multiple Wins Checker
* [#492](https://github.com/revilheart/ESGST/issues/492) Fix a bug that happens when checking groups in Unsent Gifts Sender
* [#493](https://github.com/revilheart/ESGST/issues/493) Allow users to update the "No CV Games" database
* [#494](https://github.com/revilheart/ESGST/issues/494) Fix a bug that auto focus text areas with Comment Formatting Helper enabled
* [#496](https://github.com/revilheart/ESGST/issues/496) Fix a bug that does not connect wagons when creating trains
* [#498](https://github.com/revilheart/ESGST/issues/498) Implement a Button class
* [#499](https://github.com/revilheart/ESGST/issues/499) Fix features that retrieve a user's wishlist from Steam
* [#500](https://github.com/revilheart/ESGST/issues/500) Fix a bug that happens when sending a ticket with User Suspension Tracker

**7.14.3 (February 12, 2018):**

* [#471](https://github.com/revilheart/ESGST/issues/471) Fix a bug that happens when using the Comment Tracker buttons from the main discussions page
* [#472](https://github.com/revilheart/ESGST/issues/472) Open discussion in a new tab when middle-clicking the button to go to its first unread comment
* [#473](https://github.com/revilheart/ESGST/issues/473) Fix a bug that happens when hiding discussions
* [#477](https://github.com/revilheart/ESGST/issues/477) Fix a bug that happens when using Group/Library Wishlist Checker
* [#475](https://github.com/revilheart/ESGST/issues/475) Fix a bug in Quick Inbox View
* [#474](https://github.com/revilheart/ESGST/issues/474) Fix a bug that happens when syncing wishlisted games
* [#476](https://github.com/revilheart/ESGST/issues/476) Change saving popup to a message next to the switch
* [#483](https://github.com/revilheart/ESGST/issues/483) Also open features in a new tab when middle-clicking them
* [#480](https://github.com/revilheart/ESGST/issues/480) Remove the option to notify errors
* [#484](https://github.com/revilheart/ESGST/issues/484) Fix a bug that does not load features correctly in ESGST-generated pages
* [#479](https://github.com/revilheart/ESGST/issues/479) Fix a bug in Collapse/Expand Replies Button that happens if the option to automatically collapse is enabled
* [#482](https://github.com/revilheart/ESGST/issues/482) Make the extension compatible with Firefox Containers
* [#485](https://github.com/revilheart/ESGST/issues/485) Fix a bug that happens when visiting discussions if the 

**7.14.2 (February 7, 2018):**

* [#443](https://github.com/revilheart/ESGST/issues/443) Add option to check for whitelists/blacklists between page range
* [#445](https://github.com/revilheart/ESGST/issues/445) Fix a bug that filters games without a release date even if the option is disabled
* [#447](https://github.com/revilheart/ESGST/issues/447) Identify dev versions in the header menu
* [#448](https://github.com/revilheart/ESGST/issues/448) Enhancements to Quick Inbox View
* [#451](https://github.com/revilheart/ESGST/issues/451) Add option to set fixed width for static popups
* [#452](https://github.com/revilheart/ESGST/issues/452) Fix a bug that does not save inclusions/exclusions for some features correctly
* [#453](https://github.com/revilheart/ESGST/issues/453) Fix a bug that happens when using User Giveaways Data
* [#454](https://github.com/revilheart/ESGST/issues/454) Check if AudioContext can be constructed
* [#455](https://github.com/revilheart/ESGST/issues/455) Fix a bug that reorders categories when Header Refresher refreshes
* [#456](https://github.com/revilheart/ESGST/issues/456) Fix a bug that happens when loading Group Stats with Endless Scrolling
* [#457](https://github.com/revilheart/ESGST/issues/457) Add user count to Group Stats
* [#461](https://github.com/revilheart/ESGST/issues/461) Fade options that don't contain the query when filtering features in the settings menu
* [#462](https://github.com/revilheart/ESGST/issues/462) Fix the table headers order in Created/Entered/Won Giveaway Details
* [#463](https://github.com/revilheart/ESGST/issues/463) Display additional information when hovering over some game categories
* [#464](https://github.com/revilheart/ESGST/issues/464) Add option to prevent giveaway columns from being movable
* [#465](https://github.com/revilheart/ESGST/issues/465) Show wishlist category for packages if any of the apps in the package is wishlisted
* [#466](https://github.com/revilheart/ESGST/issues/466) Fix a bug that moves the enter button when entering a giveaway or upon a header refresh
* [#467](https://github.com/revilheart/ESGST/issues/467) Fix a bug that detects the status incorrectly in Blacklist Giveaway Loader
* [#468](https://github.com/revilheart/ESGST/issues/468) Fix a bug that shows negative price for Giveaway Info in Game Categories
* [#469](https://github.com/revilheart/ESGST/issues/469) Only construct AudioContext when necessary
* [#470](https://github.com/revilheart/ESGST/issues/470) Add Comments and Invite Only filters to Giveaway Filters

**7.14.1 (February 3, 2018):**

* Hotfix for v7.14.0

**7.14.0 (February 3, 2018):**

* [#406](https://github.com/revilheart/ESGST/issues/406) Add option to play sound with notifications
* [#407](https://github.com/revilheart/ESGST/issues/407) Allow users to specify where they want features to run
* [#410](https://github.com/revilheart/ESGST/issues/410) Fix a bug that shows a notification for new wishlist giveaways when there are not any
* [#411](https://github.com/revilheart/ESGST/issues/411) Fix a bug that duplicates encrypted giveaways when editing a comment
* [#413](https://github.com/revilheart/ESGST/issues/413) Fix a bug that happens when checking if the user is already a member of the Steam group
* [#414](https://github.com/revilheart/ESGST/issues/414) Detect all errors
* [#415](https://github.com/revilheart/ESGST/issues/415) Extend Table Sorter to tables posted in comments
* [#418](https://github.com/revilheart/ESGST/issues/418) Decrypt encrypted giveaways on page load
* [#420](https://github.com/revilheart/ESGST/issues/420) Fix a bug in Discussions Highlighter that prevents the page from loading correctly
* [#421](https://github.com/revilheart/ESGST/issues/421) Fix a bug that happens when filtering giveaways/discussions
* [#422](https://github.com/revilheart/ESGST/issues/422) Only hide basic filters if the user made an advanced search in Giveaway Filters
* [#423](https://github.com/revilheart/ESGST/issues/423) Fix a bug that happens when sending unsent gifts
* [#424](https://github.com/revilheart/ESGST/issues/424) Fix some typos in Unsent Gifts Sender
* [#425](https://github.com/revilheart/ESGST/issues/425) Fix a bug that notifies about errors even if the option is disabled
* [#427](https://github.com/revilheart/ESGST/issues/427) Allow users to move the enter button and chance/ratio around like Game Categories does
* [#428](https://github.com/revilheart/ESGST/issues/428) Fix a bug that happens when clicking the Manage User Tags button in the settings menu
* [#430](https://github.com/revilheart/ESGST/issues/430) Add Release Date game category
* [#431](https://github.com/revilheart/ESGST/issues/431) Add missing game categories to Giveaway Filters
* [#432](https://github.com/revilheart/ESGST/issues/432) Add option to remove all games to Hidden Games Remover
* [#433](https://github.com/revilheart/ESGST/issues/433) Fix a bug that shows 2 hide giveaway buttons if One-Click Hide Giveaway Button is enabled
* [#434](https://github.com/revilheart/ESGST/issues/434) Fix a bug that happens when showing notifications in Header Refresher
* [#435](https://github.com/revilheart/ESGST/issues/435) Change the donation site, since Pledgie is closing down
* [#436](https://github.com/revilheart/ESGST/issues/436) Separate grid view from normal view when dragging categories
* [#437](https://github.com/revilheart/ESGST/issues/437) Speed up page load with Reply From Inbox > "Save replies" enabled
* [#438](https://github.com/revilheart/ESGST/issues/438) Fix a bug that happens when deleting all color settings for the rating category
* [#440](https://github.com/revilheart/ESGST/issues/440) Bypass Steam's age and mature check when retrieving game categories
* [#441](https://github.com/revilheart/ESGST/issues/441) Fix a bug that happens when saving settings
* [#444](https://github.com/revilheart/ESGST/issues/444) Add a feature: Quick Inbox View

**7.13.1 (January 14, 2018):**

* [#399](https://github.com/revilheart/ESGST/issues/399) Remove !important rule from colors in Game Categories
* [#398](https://github.com/revilheart/ESGST/issues/398) Add more information about requesting to join the Steam group
* [#401](https://github.com/revilheart/ESGST/issues/401) Hide button to request access to the ESGST Steam group if the user is already a member
* [#400](https://github.com/revilheart/ESGST/issues/400) Add options to customize what happens when clicking on notifications
* [#402](https://github.com/revilheart/ESGST/issues/402) Fix a bug that happens when syncing with Avatar Popout (Click) enabled
* [#403](https://github.com/revilheart/ESGST/issues/403) Fix a bug that does not load Puzzle Marker in discussion pages
* [#404](https://github.com/revilheart/ESGST/issues/404) Fix a bug that does not allow moving categories to the default place if no other categories are present
* [#405](https://github.com/revilheart/ESGST/issues/405) Add option to only close notifications manually
* [#396](https://github.com/revilheart/ESGST/issues/396) Fix a style issue with the last item of menu dropdowns
* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)

**7.13.0 (January 13, 2018):**

* [#251](https://github.com/revilheart/ESGST/issues/251) Fix a bug that does not save encrypted giveaways posted by the user sometimes
* [#285](https://github.com/revilheart/ESGST/issues/285) Apply discussion filters in the main page
* [#331](https://github.com/revilheart/ESGST/issues/331) Add options to limit search by date and pages to Sent Keys Searcher
* [#348](https://github.com/revilheart/ESGST/issues/348) Check for replies to a comment before replying in Reply From Inbox
* [#349](https://github.com/revilheart/ESGST/issues/349) Add link to reload extension to the update popup
* [#362](https://github.com/revilheart/ESGST/issues/362) Fix a bug that keeps loading the auto sync
* [#367](https://github.com/revilheart/ESGST/issues/367) Fix a style compatibility issue between Discussions Highlighter and Puzzle Marker
* [#369](https://github.com/revilheart/ESGST/issues/369) Initialize filterPresets for new users
* [#370](https://github.com/revilheart/ESGST/issues/370) Fix a bug that happens when checking users with return options enabled in Whitelist/Blacklist Checker
* [#372](https://github.com/revilheart/ESGST/issues/372) Add a loading popup when opening the import/export/delete menus until the data sizes are calculated
* [#373](https://github.com/revilheart/ESGST/issues/373) Fix a bug in Giveaways Manager when unbookmarking giveaways
* [#374](https://github.com/revilheart/ESGST/issues/374) Add option to save current reply to Saved Replies
* [#375](https://github.com/revilheart/ESGST/issues/375) Add a feature: URL Redirector
* [#376](https://github.com/revilheart/ESGST/issues/376) Add a feature: Notification Merger
* [#377](https://github.com/revilheart/ESGST/issues/377) Fix a bug that updates the last sync date for all data when syncing games/groups
* [#378](https://github.com/revilheart/ESGST/issues/378) Use name + description to identify a saved reply
* [#379](https://github.com/revilheart/ESGST/issues/379) Fix a bug that happens when retrieving DLC base information in Game Categories
* [#380](https://github.com/revilheart/ESGST/issues/380) Add shortcut keys to undo/redo and support for saved replies in Comment Formatting Helper
* [#381](https://github.com/revilheart/ESGST/issues/381) Fix a bug that opens the description popup even if the option is disabled in Enter/Leave Giveaway Button
* [#382](https://github.com/revilheart/ESGST/issues/382) Fix a bug in User Giveaways Data that does not retrieve giveaways
* [#383](https://github.com/revilheart/ESGST/issues/383) Fix a typo in the Game Categories code
* [#384](https://github.com/revilheart/ESGST/issues/384) Add support for Avatar Popout to the avatar in the header
* [#385](https://github.com/revilheart/ESGST/issues/385) Add options to calculate data sizes when opening the import/export/delete menus
* [#386](https://github.com/revilheart/ESGST/issues/386) Add a tool to generate next/previous/counter formats to Multiple Giveaways Creator
* [#387](https://github.com/revilheart/ESGST/issues/387) Turn Header Refresher notifications into links
* [#388](https://github.com/revilheart/ESGST/issues/388) Add an option to notify errors
* [#389](https://github.com/revilheart/ESGST/issues/389) Fix a typo in the counter when performing some checks
* [#390](https://github.com/revilheart/ESGST/issues/390) Prevent Giveaways Extractor from stopping if there is a badly formatted giveaway link
* [#391](https://github.com/revilheart/ESGST/issues/391) Fix a conflict with SteamGifts Steam Ratings
* [#392](https://github.com/revilheart/ESGST/issues/392) Allow winners to be updated when syncing giveaways or using Created/Entered/Won Giveaway Details
* [#393](https://github.com/revilheart/ESGST/issues/393) Fix a bug that happens when importing from OneDrive
* [#394](https://github.com/revilheart/ESGST/issues/394) Fix a bug that does not filter giveaways in the created/entered/won pages correctly
* [#395](https://github.com/revilheart/ESGST/issues/395) Allow more customization for Game Categories
* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)

**7.12.2 (January 7, 2018):**

* [#363](https://github.com/revilheart/ESGST/issues/363) Fix a bug that does not auto backup all data
* [#364](https://github.com/revilheart/ESGST/issues/364) Fix a bug that happens when checking for a user's not activated/multiple wins
* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)

**7.12.1 (January 6, 2018):**

* [#350](https://github.com/revilheart/ESGST/issues/350) Fix a bug that does not highlight discussions
* [#351](https://github.com/revilheart/ESGST/issues/351) Fix a bug that does not go to the first unread comment correctly
* [#352](https://github.com/revilheart/ESGST/issues/352) Fix a bug that does not load Quick Discussion Browsing unless Quick Giveaway Browsing is enabled
* [#354](https://github.com/revilheart/ESGST/issues/354) Fix a bug that does not load User Suspension Tracker in the main tickets page unless Giveaways/Discussions/Tickets/Trades Tracker is enabled
* [#355](https://github.com/revilheart/ESGST/issues/355) Fix a bug that does not calculate real CV
* [#353](https://github.com/revilheart/ESGST/issues/353) Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)
