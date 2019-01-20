# Enhanced SteamGifts & SteamTrades (ESGST)

A WebExtension that adds some cool features to SteamGifts and SteamTrades.

If you find any bugs or have any feature requests, please file an issue [here](https://github.com/gsrafael01/ESGST/issues).

---

## Compatibility

Tested and confirmed as working:

* Chrome (since v55)
* Firefox (since v52)
* Pale Moon

Not tested but should be working:

* Any Chromium-based browser (such as Opera, Vivaldi, etc...)

Not supported:

* Edge
* Safari

---

## Installation

<a href="https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna/">
  <img src="https://raw.githubusercontent.com/gsrafael01/ESGST/master/chrome_badge.png" alt="Chrome">
</a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/esgst/">
  <img src="https://raw.githubusercontent.com/gsrafael01/ESGST/master/firefox_badge.png" alt="Firefox">
</a>
<a href="https://addons.palemoon.org/addon/esgst/">
  <img src="https://raw.githubusercontent.com/gsrafael01/ESGST/master/pale_moon_badge.png" alt="Pale Moon">
</a>

It should be possible to install the extension in any Chromium-based browser from the Chrome store (such as Opera, Vivaldi, etc...).

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

**8.1.13 (January 5, 2019)**

* [#1173](https://github.com/gsrafael01/ESGST/issues/1173) Add a new giveaway filter: Minutes From Start
* [#1171](https://github.com/gsrafael01/ESGST/issues/1171) Extend themes to SGTools (extension only)
* [#1158](https://github.com/gsrafael01/ESGST/issues/1158) Add option to sync won giveaways

**8.1.12 (January 2, 2019)**

* [#1169](https://github.com/gsrafael01/ESGST/issues/1169) Let the background page handle locks in the extension
* [#1168](https://github.com/gsrafael01/ESGST/issues/1168) Show a warning popup if a user tries to enable extension-exclusive features
* [#1167](https://github.com/gsrafael01/ESGST/issues/1167) Fix a bug that prevents the Entry Tracker popup from opening depending on the Accurate Timestamp format set
* [#1166](https://github.com/gsrafael01/ESGST/issues/1166) Remove option to limit requests to the Steam store and make it the default behavior
* [#1165](https://github.com/gsrafael01/ESGST/issues/1165) Fix several bugs in User Giveaway Data
* [#1164](https://github.com/gsrafael01/ESGST/issues/1164) Fix a bug that does not persist data larger than 5MB on Pale Moon
* [#1162](https://github.com/gsrafael01/ESGST/issues/1162) Detect giveaway codes hidden in image titles with Giveaway Extractor
* [#1161](https://github.com/gsrafael01/ESGST/issues/1161) Add an info to each sync category for which feature the data is required
* [#1157](https://github.com/gsrafael01/ESGST/issues/1157) Fix a bug that prevents Giveaway Extractor from working in a new tab
* [#1156](https://github.com/gsrafael01/ESGST/issues/1156) Remove Happy Holidays Integration

**8.1.11 (December 23, 2018)**

* [#1155](https://github.com/gsrafael01/ESGST/issues/1155) Implement priority system for Game Categories
* [#1154](https://github.com/gsrafael01/ESGST/issues/1154) Implement cache for Giveaway Extractor
* [#1153](https://github.com/gsrafael01/ESGST/issues/1153) Change Learning game category link to Steam store
* [#1152](https://github.com/gsrafael01/ESGST/issues/1152) Fix some issues with Giveaway Extractor
* [#1151](https://github.com/gsrafael01/ESGST/issues/1151) Fix a bug in Whitelist/Blacklist Checker that happens when checking users with 0 giveaways
* [#1150](https://github.com/gsrafael01/ESGST/issues/1150) Fix a bug that does not count Happy Holidays giveaways for Level Progress Visualizer
* [#1149](https://github.com/gsrafael01/ESGST/issues/1149) Fix typo in Accurate Timestamp
* [#1148](https://github.com/gsrafael01/ESGST/issues/1148) Add option not to show seconds in Accurate Timestamp if they are equal to 0
* [#1147](https://github.com/gsrafael01/ESGST/issues/1147) Add a giveaway filter: Currently Enterable
* [#1146](https://github.com/gsrafael01/ESGST/issues/1146) Fix a bug that happens when using Firefox with third-party cookies disabled
* [#36](https://github.com/gsrafael01/ESGST/issues/36) Add a new feature: Visible Invite-Only Giveaways

**8.1.10 (December 22, 2018)**

* [#1143](https://github.com/gsrafael01/ESGST/issues/1143) Add toolbar button to Pale Moon
* [#1142](https://github.com/gsrafael01/ESGST/issues/1142) Fix a bug that happens when extracting giveaways
* [#1141](https://github.com/gsrafael01/ESGST/issues/1141) Fix a bug that happens when syncing owned/wishlisted/ignored games

**8.1.9 (December 21, 2018)**

* [#1140](https://github.com/gsrafael01/ESGST/issues/1140) Fix a bug that happens when trying to open the bookmarked giveaways popup
* [#1139](https://github.com/gsrafael01/ESGST/issues/1139) Remove options to check if the current version is the latest using the title of the thread
* [#1138](https://github.com/gsrafael01/ESGST/issues/1138) Remove options to download .zip and reload extension from new version popup in Chrome extensions
* [#1137](https://github.com/gsrafael01/ESGST/issues/1137) Fix Grid View
* [#1136](https://github.com/gsrafael01/ESGST/issues/1136) Fix changelog for v8.1.8
* [#1123](https://github.com/gsrafael01/ESGST/issues/1123) Add option to apply Accurate Timestamp format to SteamGifts' date tooltips

**8.1.8 (December 21, 2018)**

* [#1134](https://github.com/gsrafael01/ESGST/issues/1134) Fix a bug that does not enable/disable themes properly
* [#1133](https://github.com/gsrafael01/ESGST/issues/1133) Allow new options in the settings menu to be searchable by searching for "[new]"
* [#1132](https://github.com/gsrafael01/ESGST/issues/1132) Fix a bug that marks disabled options as new
* [#1131](https://github.com/gsrafael01/ESGST/issues/1131) Add a giveaway filter: Banned
* [#1130](https://github.com/gsrafael01/ESGST/issues/1130) Always show game categories in real time and always show categories that do not need to be fetched instantly
* [#1129](https://github.com/gsrafael01/ESGST/issues/1129) Continue loading game categories where it left off
* [#1128](https://github.com/gsrafael01/ESGST/issues/1128) Add Giveaway Groups Loader panel to list of movable elements
* [#1127](https://github.com/gsrafael01/ESGST/issues/1127) Revamp popups
* [#1126](https://github.com/gsrafael01/ESGST/issues/1126) Rename extension to Enhanced SteamGifts & SteamTrades (ESGST)
* [#1125](https://github.com/gsrafael01/ESGST/issues/1125) Add extension support for Pale Moon
* [#1124](https://github.com/gsrafael01/ESGST/issues/1124) Add a feature: Custom Giveaway Calendar
* [#1122](https://github.com/gsrafael01/ESGST/issues/1122) Add option to backup/restore themes
* [#1121](https://github.com/gsrafael01/ESGST/issues/1121) Add button to the settings menu to dismiss all new options
* [#1117](https://github.com/gsrafael01/ESGST/issues/1117) Bring back fixed feature details panel in the settings menu
* [#1033](https://github.com/gsrafael01/ESGST/issues/1033) Fix a bug in Multi-Manager that does not select items in ESGST-generated pages

**8.1.7 (December 19, 2018)**

* [#1120](https://github.com/gsrafael01/ESGST/issues/1120) Fix a bug in Giveaway Popup / Enter/Leave Giveaway Button that shows wrong creator when opening giveaways from the won page of a user
* [#1119](https://github.com/gsrafael01/ESGST/issues/1119) Fix a bug in Giveaway Winners Link that shows the winners link even if the giveaway ended with 0 entries
* [#1116](https://github.com/gsrafael01/ESGST/issues/1116) Fix a bug that happens when loading game categories

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