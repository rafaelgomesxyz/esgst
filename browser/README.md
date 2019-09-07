# Enhanced SteamGifts & SteamTrades (ESGST)

An extension / userscript that adds some cool features to SteamGifts and SteamTrades.

If you find any bugs or have any feature requests, please file an issue [here](https://github.com/rafaelgssa/esgst/issues).

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

There are two different ways to use ESGST: extension or userscript. You can choose which one you want to use, but the extension is a lot faster and has a better peformance than the userscript, so I recommend it, although there is no major difference between them, except for a few options that are only available in the extension because of limitations in the userscript.

### Option 1 - Extension

<a href="https://chrome.google.com/webstore/detail/esgst/ibedmjbicclcdfmghnkfldnplocgihna/">
  <img src="https://raw.githubusercontent.com/rafaelgssa/esgst/master/browser/assets/chrome-badge.png" alt="Chrome">
</a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/esgst/">
  <img src="https://raw.githubusercontent.com/rafaelgssa/esgst/master/browser/assets/firefox-badge.png" alt="Firefox">
</a>
<a href="https://addons.palemoon.org/addon/esgst/">
  <img src="https://raw.githubusercontent.com/rafaelgssa/esgst/master/browser/assets/palemoon-badge.png" alt="Pale Moon">
</a>

It should be possible to install the extension in any Chromium-based browser from the Chrome store (such as Opera, Vivaldi, etc...), any Firefox-based browser from the Firefox store (such as Waterfox, etc...), and any browser that uses the Phoebus system from the Pale Moon store (such as Basilik, etc...).

You can also use the extension on Android through Firefox for Android, but some features might not work or not be optimized enough for mobile.

### Option 2 - Userscript

To install the userscript, you must install [Tampermonkey](https://tampermonkey.net/), [Greasemonkey](http://www.greasespot.net/) or some other userscript manager first. Then [click here](https://github.com/rafaelgssa/esgst/releases/latest/download/userscript.user.js) and you should be prompted to install it. I recommend Tampermonkey, because the userscript uses the GM_addValueChangeListener API to communicate changes in the storage between tabs, and that API is not available on Greasemonkey, so a polyfill is used for Greasemonkey, which is not very effective and can affect the performance.

You can also use the userscript on Android through Firefox with Violentmonkey or USI, but some features might not work or not be optimized enough for mobile.

* [Changelog](https://github.com/rafaelgssa/esgst/releases)

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

* All requests from `Whitelist/Blacklist Checker`, `Not Activated/Multiple Win Checker`, 'Not Received Finder' and 'Archive Searcher' are limited to 2 per second, to prevent a stress on the SteamGifts servers.
* If you try to leave the page while `Whitelist/Blacklist Checker`, `Not Activated/Multiple Win Checker`, 'Not Received Finder' and 'Archive Searcher' are running, you will get a confirmation dialog asking you if you want to leave the page. Additionally, while these features are running, their buttons are faded out.