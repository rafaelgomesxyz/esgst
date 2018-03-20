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

* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/esgst/)
* Chrome -> Download [this zip](https://github.com/revilheart/ESGST/archive/master.zip), extract it to a folder on your computer, go to "chrome://extensions/", tick "Developer mode" in the top right corner, click "Load unpacked extension" and select the "Extensions" folder where you extracted the zip to. Using the extension on Chrome might be a nuisance, since every time you open the browser you will get a message saying that using extensions in developer mode can be unsafe, and every time a new version is released you will have to download the zip again, extract it to the same folder, replacing the previous files, go to the extensions page and click "Reload" under ESGST.

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
* Community Wishlist Search Link
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
* Hidden Featured Container
* Hidden Game Remover
* Hidden Game's Enter Button Disabler
* Hidden Pinned Giveaways
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
