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

* Firefox -> Download [this file](https://github.com/revilheart/ESGST/raw/master/Extension/esgst.xpi) and drag it into "about:addons".
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

### General

* [Attached Images Carousel](#attached-images-carousel)
* [Attached Images Loader](#attached-images-loader)
* [Avatar Popout](#avatar-popout)
* [Accurate Timestamps](#accurate-timestamps)
* [Endless Scrolling](#endless-scrolling)
* [Embedded Videos](#embedded-videos)
* [Fixed Footer](#fixed-footer)
* [Fixed Header](#fixed-header)
* [Fixed Main Page Heading](#fixed-main-page-heading)
* [Fixed Sidebar](#fixed-sidebar)
* [Giveaways/Discussions/Tickets/Trades Tracker](#giveawaysdiscussionsticketstrades-tracker)
* [Hidden Blacklist Stats](#hidden-blacklist-stats)
* [Hidden Community Poll](#hidden-community-poll)
* [Header Refresher](#header-refresher)
* [Image Borders](#image-borders)
* [Last Page Link](#last-page-link)
* [Level Progress Visualizer](#level-progress-visualizer)
* [Multi-Tag](#multi-tag)
* [Pagination Navigation On Top](#pagination-navigation-on-top)
* [Same Tab Opener](#same-tab-opener)
* [Scroll To Bottom Button](#scroll-to-bottom-button)
* [Scroll To Top Button](#scroll-to-top-button)
* [Search Magnifying Glass Button](#search-magnifying-glass-button)
* [Shortcut Keys](#shortcut-keys)
* [Time To Point Cap Calculator](#time-to-point-cap-calculator)
* [Tables Sorter](#tables-sorter)
* [Visible Attached Images](#visible-attached-images)

### Giveaways

* [Advanced Giveaway Search](#advanced-giveaway-search)
* [Archive Searcher](#archive-searcher)
* [Blacklist Giveaway Loader](#blacklist-giveaway-loader)
* [Comments/Entries Checker](#commentsentries-checker)
* [Created/Entered/Won Giveaway Details](#createdenteredwon-giveaway-details)
* [Delete Keys Confirmation](#delete-keys-confirmation)
* [Enter/Leave Giveaway Button](#enterleave-giveaway-button)
* [Entries Tracker](#entries-tracker)
* [Giveaway Bookmarks](#giveaway-bookmarks)
* [Giveaway Copies Highlighter](#giveaway-copies-highlighter)
* [Giveaway Countries Loader](#giveaway-countries-loader)
* [Giveaway Encrypter/Decrypter](#giveaway-encrypterdecrypter)
* [Giveaway Error Search Links](#giveaway-error-search-links)
* [Giveaway Filters](#giveaway-filters)
* [Giveaway Groups Loader](#giveaway-groups-loader)
* [Giveaway Recreator](#giveaway-recreator)
* [Giveaway Popup](#giveaway-popup)
* [Giveaway Templates](#giveaway-templates)
* [Giveaway Winners Link](#giveaway-winners-link)
* [Giveaway Winning Chance](#giveaway-winning-chance)
* [Giveaway Winning Ratio](#giveaway-winning-ratio)
* [Giveaways Extractor](#giveaways-extractor)
* [Giveaways Manager](#giveaways-manager)
* [Giveaways Sorter](#giveaways-sorter)
* [Grid View](#grid-view)
* [Hidden Featured Container](#hidden-featured-container)
* [Hidden Games Enter Button Disabler](#hidden-games-enter-button-disabler)
* [Hidden Games Remover](#hidden-games-remover)
* [Hidden Pinned Giveaways](#hidden-pinned-giveaways)
* [Is There Any Deal? Info](#is-there-any-deal?-info)
* [Multiple Giveaways Creator](#multiple-giveaways-creator)
* [Next/Previous Train Hotkeys](#nextprevious-train-hotkeys)
* [One-Click Hide Giveaway Button](#one-click-hide-giveaway-button)
* [Pinned Giveaways Button](#pinned-giveaways-button)
* [Quick Giveaway Browsing](#quick-giveaway-browsing)
* [Quick Giveaway Search](#quick-giveaway-search)
* [Real CV Calculator](#real-cv-calculator)
* [Sent Keys Searcher](#sent-keys-searcher)
* [Steam Activation Links](#steam-activation-links)
* [Stickied Giveaway Countries](#stickied-giveaway-countries)
* [Stickied Giveaway Groups](#stickied-giveaway-groups)
* [Time To Enter Calculator](#time-to-enter-calculator)
* [Unfaded Entered Giveaways](#unfaded-entered-giveaways)
* [Unhide Giveaway Button](#unhide-giveaway-button)
* [Unsent Gifts Sender](#unsent-gifts-sender)

### Discussions

* [Active Discussions On Top/Sidebar](#active-discussions-on-top-sidebar)
* [Close/Open Discussion Button](#closeopen-discussion-button)
* [Discussion Edits Detector](#discussion-edits-detector)
* [Discussion Filters](#discussion-filters)
* [Discussions Highlighter](#discussions-highlighter)
* [Discussions Sorter](#discussions-sorter)
* [Main Post Popup](#main-post-popup)
* [Main Post Skipper](#main-post-skipper)
* [Old Active Discussions Design](#old-active-discussions-design)
* [Puzzle Marker](#puzzle-marker)
* [Refresh Active Discussions Button](#refresh-active-discussions-button)

### Trades

* [Trades Bumper](#trades-bumper)

### Comments

* [Collapse/Expand Replies Button](#collapseexpand-replies-button)
* [Comment Formatting Helper](#comment-formatting-helper)
* [Comment History](#comment-history)
* [Comment Searcher](#comment-searcher)
* [Comment Tracker](#comment-tracker)
* [Comments Reverser](#comments-reverser)
* [Multi-Reply](#multi-reply)
* [Received Reply Box Popup](#received-reply-box-popup)
* [Reply Box On Top](#reply-box-on-top)
* [Reply Box Popup](#reply-box-popup)
* [Reply From Inbox](#reply-from-inbox)
* [Reply Mention Link](#reply-mention-link)

### Users

* [Inbox Winners Highlighter](#inbox-winners-highlighter)
* [Level Up Calculator](#level-up-calculator)
* [Not Activated/Multiple Wins Checker](#not-activatedmultiple-wins-checker)
* [Not Received Finder](#not-received-finder)
* [Real Won/Sent CV Links](#real-wonsent-cv-links)
* [Sent/Won Ratio](#sentwon-ratio)
* [Shared Groups Checker](#shared-groups-checker)
* [SteamGifts Profile Button](#steamgifts-profile-button)
* [SteamTrades Profile Button](#steamtrades-profile-button)
* [User Filters](#user-filters)
* [User Giveaways Data](#user-giveaways-data)
* [User Notes](#user-notes)
* [User Tags](#user-tags)
* [Username History](#username-history)
* [Users Stats](#users-stats)
* [Whitelist/Blacklist Checker](#whitelistblacklist-checker)
* [Whitelist/Blacklist Highlighter](#whitelistblacklist-highlighter)
* [Whitelist/Blacklist Manager](#whitelistblacklist-manager)
* [Whitelist/Blacklist Sorter](#whitelistblacklist-sorter)

### Groups

* [Group Library/Wishlist Checker](#group-librarywishlist-checker)
* [Group Stats](#group-stats)
* [Groups Highlighter](#groups-highlighter)

### Games

* [Entered Games Highlighter](#entered-games-highlighter)
* [Game Categories](#game-categories)
* [Game Tags](#game-tags)

---

### Attached Images Carousel

<code>SG & ST</code>

<ul>
    <li>Allows you to navigate through all attached images of a page.</li>
    <li>Open the carousel by clicking either an attached image or the button in the main page heading, depending on your preferred settings.</li>
</ul>
<img src="https://i.imgur.com/gnXYNE6.png">
<img src="https://i.imgur.com/Csegj00.png">

### Attached Images Loader

<code>SG & ST</code>

<ul>
    <li>Allows you to load attached images on demand, when you click on "View attached image".</li>
    <li>Speeds up page loads if you have a slow Internet connection.</li>
</ul>

### Avatar Popout

<code>SG</code>

<ul>
    <li>Allows you to view information about a user/group by hovering over/clicking their avatar/link, depending on your preferred settings.</li>
</ul>
<img src="https://i.imgur.com/SsG4VuQ.png">
<img src="https://i.imgur.com/0JPC9qD.png">

### Accurate Timestamps

<code>SG & ST</code>

<ul>
    <li>Shows accurate timestamps, for example, "Jan 1, 2017, 0:00:00 - 2 hours ago" instead of just "2 hours ago".</li>
    <li>You can choose whether to enable it for giveaways in the main page or not, whether to show seconds or not and whether to use a 12-hour clock or a 24-hour one.</li>
</ul>

### Endless Scrolling

<code>SG & ST</code>

<ul>
    <li>Loads the next page when you scroll down to the end of the page, allowing you to endlessly scroll through pages.</li>
    <li>You can choose for which types of pages to enable it (comments, discussions/tickets, giveaways, lists and trades) and whether to show page divisors in each of them or not.</li>
    <li>Has a reverse scrolling option for discussions that loads pages in descending order and loads the last page instead of the first one when visiting discussions from the main pages.</li>
    <li>Use the buttons in the main page heading to pause/resume it, load the next page, continuously load pages, refresh the current page and refresh all pages.</li>
    <li>If you use the pagination navigation to try to go to a page that is currently loaded, it will scroll to where the page begins instead of opening it.</li>
</ul>
<img src="https://i.imgur.com/xLD7YZN.png">

### Embedded Videos

<code>SG & ST</code>

<ul>
    <li>Embeds YouTube and Vimeo videos into the page.</li>
    <li>Videos are only embedded if their links are in the [URL](URL) format and are the only content in a line, for example, "[https://youtu.be/ihd9dKek2gc](https://youtu.be/ihd9dKek2gc)" gets embedded, while "[Watch this!](https://youtu.be/ihd9dKek2gc)" and "Watch this: [https://youtu.be/ihd9dKek2gc](https://youtu.be/ihd9dKek2gc)" do not.</li>
</ul>
<img src="https://i.imgur.com/jE2Xmna.png">

### Fixed Footer

<code>SG & ST</code>

<ul>
    <li>Fixes the footer so that it stays at the bottom of the window while you scroll down the page.</li>
</ul>
<img src="https://i.imgur.com/XLE0Wpm.png">

### Fixed Header

<code>SG & ST</code>

<ul>
    <li>Fixes the header so that it stays at the top of the window while you scroll down the page.</li>
</ul>
<img src="https://i.imgur.com/RvvzGj1.png">

### Fixed Main Page Heading

<code>SG & ST</code>

<ul>
    <li>Fixes the main page heading so that it stays at the top of the window while you scroll down the page.</li>
</ul>
<img src="https://i.imgur.com/Bl7YWNk.png">

### Fixed Sidebar

<code>SG</code>

<ul>
    <li>Fixes the sidebar so that it stays at the left side of the window while you scroll down the page.</li>
</ul>
<img src="https://i.imgur.com/lD6noac.png">

### Unfaded Entered Giveaways

`steamgifts.com/*`

* Removes SG's default fade for entered giveaways.

### Created/Entered/Won Giveaway Details

`steamgifts.com/giveaways/(created|entered|won)/*`

* Adds more details to the created/entered/won pages, such as the number of points, the link to the Steam store page of the game, the name of the creator, the type of the giveaway and the level. It also loads the giveaway groups below the giveaway if Giveaway Groups Loader is enabled.

### Is There Any Deal? Info

`steamgifts.com/giveaway/*`

* Adds Is There Any Deal? info to giveaway pages, including the best current deal, the historical lowest price (optional) and the list of bundles that the game has been in, with a cache that can be updated after 24 hours since the last check.

![](http://i.imgur.com/epF2am3.png)

### Last Page Link

`steamgifts.com/*`

* Adds a "Last Page" link to some places that are missing it, for example: discussion pages with 100+ pages, user pages, group pages with 100+ pages.

### Giveaway Maker

`steamgifts.com/giveaways/new/*`

* Allows you to create multiple giveaways or a train of giveaways (multiple giveaways that are linked to one another).
* You can view detailed information about a giveaway by hovering over it.
* You can re-order/remove the giveaways by dragging and dropping them in the correspondent areas.
* All giveaways will be created without reviewing or validating, so make sure all fields are filled correctly, or the giveaway creation will fail (if a train is being created, the failed giveaway will be disconnected and the previous giveaway will be connected to the next instead).

![](http://i.imgur.com/Pf9j7gN.png)

### Discussions Sorter

`steamgifts.com/discussions/*`

* Allows you to sort discussions by creation date (from newest to oldest).

![](http://i.imgur.com/pMAoVq9.png)

### Whitelist/Blacklist Sorter

`steamgifts.com/account/manage/whitelist|blacklist/*`

* Allows you to view your whitelist/blacklist sorted by added date, both from oldest to newest and from newest to oldest.

![](http://i.imgur.com/Vyr1LWi.png)

### Steam Activation Link

`steamgifts.com/giveaways/won*`

* Allows you to easily activate a won game.

![](http://i.imgur.com/0hnY0yD.png)

### User Filters

`steamgifts.com/*`

* Allows you to filter out posts, discussions and giveaways from users.
* Filtered posts are completely removed, along with all replies to it.
* Each user has their own settings, which can be configured through their profile (or their avatar if you're using Avatar Popout).
* You can enable an option in the settings menu to automatically filter out all users that you have blacklisted. If you set a custom setting to a blacklisted user on their profile, that setting will overwrite the automatic setting.
* You can see a list of filtered users in the settings menu.

### Giveaway Bookmarks

`steamgifts.com/*`

* Allows you to bookmark giveaways to enter later.
* You can enable an option to highlight the button if a giveaway is about to end, given a certain amount of hours specified in the settings menu.
* Giveaways that have not started yet will not appear in the list of bookmarked giveaways. Instead, they will stay in a sort of hidden state until they start. When they start, the header bookmark button will turn green, indicating that you must open the list of bookmarked giveaways so that the started giveaways can be updated with their end times. When giveaways are about to end, the button will red. If there are both started and ending giveaways, the button will be colored with a brown-ish color. Hovering over the button also gives you more details about how many giveaways have started and/or are ending.

![](http://i.imgur.com/6e8UyL3.png)
![](http://i.imgur.com/kNxEDZV.png)
![](http://i.imgur.com/7OAYXa9.png)

### Quick Giveaway Browsing

`steamgifts.com/*`

* Allows you to quickly go to recommended/wishlist/group/new giveaways without having to first go to the main page and then select it at the sidebar.

![](http://imgur.com/NDgqzFj.png)

### Game Categories

`steamgifts.com/*`

* Displays categories for games. Categories so far: bundled, trading cards, achievements, multiplayer, Steam cloud, Linux, Mac, DLC and genres.
* The bundle list must be synced through the settings menu for the bundled category to work.

![](http://i.imgur.com/DmYIM2V.png)
![](http://i.imgur.com/70Gyhxu.png)
![](http://i.imgur.com/jsL0aVB.png)
![](http://i.imgur.com/zGeKiag.png)

### Giveaway Filters

`steamgifts.com/giveaways/*`

* Allows you to filter out certain giveaways in a page.
* Works well with Game Categories.

![](http://i.imgur.com/Ez4NyMm.png)

### Real CV Calculator

`steamgifts.com/giveaway/new`

* Calculates how much real CV you should get for a giveaway.
* It's only accurate if you have synced the bundle list from the settings menu and also scanned your sent giveaways using User Giveaways Data. But even then, it's only 100% accurate if the user has 0 not received giveaways, since User Giveaways Data doesn't currently know if the giveaways have been received or not.
* In the example below, as I had previously given away 3 copies of Max Payne 3, the sixth copy is worth 10% less (18P). So the 3 new copies would equal 58P:

![](http://i.imgur.com/oCGStUq.png)

### Giveaway Encrypter/Decrypted

`steamgifts.com/*`

* Allows users of the script to encrypt giveaways and hide them in their posts, so that they can be easily seen by other users of the script.
* To add encrypt a giveaway and hide it in a post, you must have the option enabled for Comment Formatting Helper.
* If there are any encrypted giveaways hidden in a page, a button will be added to the header menu where you can access them.

### Settings Menu

`steamgifts.com/account/*`

* Allows you to enable / disable features.
* Allows you import / export your data.
* Allows you to manage `Whitelist / Blacklist Highlighter` and `Not Activated / Multiple Wins Checker` caches.
* Allows you to sync your data and enable / disable the automatic sync.

### Level Progress Visualizer

`steamgifts.com/*`

* Shows your level progress in the main button.

![](http://imgur.com/RJmCnpR.png)

### Hidden Featured Container

`steamgifts.com/giveaways/*`

![](http://i.imgur.com/QjTxvo2.png)

* Hides the featured container in the giveaways pages.

### Hidden Blacklist Stats

`steamgifts.com/stats/personal/community`

![](http://i.imgur.com/yB3pQSI.png)

* Hides blacklist stats in the stats page.

### Active Discussions On Top/Sidebar

`steamgifts.com/*`

* Moves the active discussions to the top/sidebar of the page.
* More info about the sidebar choice: if you have Advanced Giveaway Search enabled, it will be hidden and triggered when hovering hover the search field; the username and avatar of the user who last posted will be removed (the button to go to the last comment will remain intact); Accurate Timestamps will not run for any timestamps inside the active discussions; and any user tags you might have saved for users will be hidden inside the active discussions (they will still be visible if you click the tag button to edit them).

![](http://i.imgur.com/XEeroVn.png)

### Grid View

`steamgifts.com/giveaways*`

![](http://i.imgur.com/jhd1m4A.png)

### SteamGifts Profile Button

`steamtrades.com/user/*`

![](http://i.imgur.com/k4P3OMy.png)

* Adds a button that links to an user's SteamGifts profile.

### SteamTrades Profile Button

`steamgifts.com/user/*`

![](http://i.imgur.com/iJxVz6D.png)

* Adds a button that links to an user's SteamTrades profile.

### Shared Groups Checker

`steamgifts.com\/*`

![](http://i.imgur.com/5NkCrum.png)

* Allows you to check which groups you and another user have in common.

### Comment History

`steamgifts.com/*`

![](http://i.imgur.com/lDSXYcS.png)

* Keeps track of the comments you make (they can be seen from the settings menu).
* This feature **only** works with Main Comment Box Popup, Discussion Edit Detector and Multi-Reply / Reply From Inbox. If you submit a comment though SG's native comment box, the comment will not be tracked.

### Username History

`steamgifts.com/user/*`

![](http://i.imgur.com/cTnt7sk.png)

* Keeps track of usernames from the [database](https://docs.google.com/spreadsheets/d/1rZQuo6T02zutwSo1edbDzW8q9GmpDIbaVvKN79TyFqA/edit?usp=sharing) and detects username changes every month.
* There are currently 7200+ users being tracked.
* An user is added to the database when you click on the arrow next to their username.
* You can view recent username changes from the settings menu.

### User Notes

`(steamgifts|steamtrades).com/user/*`

![](http://i.imgur.com/lF9YKjm.png)
![](http://i.imgur.com/1AvN0Co.png)

* Allows you to add notes to users.
* The notes are permanent because they are tied to an user's SteamID64 instead of their username.
* The icon changes if the notes are not empty:

![](http://i.imgur.com/PYm3Ds7.png)

### User Tags

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/AIPs4d1.png)
![](http://i.imgur.com/4660IaT.png)

* Allows you to add tags to users.
* Unlike the permanent user notes, the tags are not tied to an user's SteamID64, because that information is only available in the profile page, but they are still permament because upon adding a tag to an user, it automatically detects username changes and returns any old tags you might have saved for that user before they changed their username.
* While the tags are not tied to an user's SteamID64, it still has to retrieve the user's profile page in order to save to the storage, so if you're adding tags to an user for the first time, it might take a while to do so.
* Separation of tags is purely cosmetic.

### Multi-Tag

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/aZRQkxr.png)
![](http://i.imgur.com/mhjTmn1.png)

* Allows you to tag multiple users / games at the same time.
* It goes without saying that this feature only works if either Permanent User Notes or Game Tags are enabled.

### Whitelist/Blacklist Highlighter

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/rxqGu9i.png)
![](http://i.imgur.com/mRIrwb7.png)

* Adds a heart or ban icon next to the username of all users from your whitelist / blacklist.
* The users must be scanned through the settings menu for the feature to work. You can scan them manually or enable the automatic scan to run every once in a while.

### Whitelist/Blacklist Checker

`steamgifts.com/*`

![](http://i.imgur.com/KDAHDme.png)
![](http://i.imgur.com/x6AWyp7.png)

* Allows you to check if an user or a list of users have whitelisted / blacklisted you.
* Results are cached for 24 hours.
* The caches can be seen and updated from the settings menu.
* The checker has a simplified version that only checks / shows whitelists. It can be activated from the settings menu by enabling `Show blacklist information.`. If this version is activated and the checker finds an user that has blacklisted you, it will return `There is not enough information to know if you are whitelisted or blacklisted.` instead of `You are blacklisted.`.
* You can highlight users who have whitelisted / blacklisted you by enabling this option through the settings menu. This functionality is supported on SteamTrades (`steamtrades.com/*`). The following icons will be added next to their username:

![](http://i.imgur.com/yPoDrnm.png)
![](http://i.imgur.com/BRLSAXD.png)

### Real Won/Sent CV Links

`steamgifts.com/user/*`

![](http://i.imgur.com/NvGf47L.png)
![](http://i.imgur.com/Shwsgdh.png)

* Adds links to an user's SGTools real won / sent CV pages.
* Has an option to automatically load the real CV and show it on the profile.

### Sent/Won Ratio

`steamgifts.com/user/*`

![](http://i.imgur.com/eqBybQQ.png)

* Shows the sent / won ratio of an user.

### Not Activated/Multiple Wins Checker

`steamgifts.com/(user|giveaway/.../winners)/*`

![](http://i.imgur.com/QsNfLPJ.png)
![](http://i.imgur.com/vaSRuPJ.png)
![](http://i.imgur.com/nBeDvPw.png)

* Allows you to check if an user or a page of winners from a giveaway have any not activated / multiple wins.
* Results are cached for 7 days.
* The caches can be seen from the settings menu (updating all of them at once is not possible).
* You can highlight users who have not received / multiple wins by enabling this option through the settings menu. This functionality is supported on SteamTrades (`steamtrades.com/*`). Their username will change to the following colors:

![](http://i.imgur.com/6Oo1Bkg.png)
![](http://i.imgur.com/IH9khSq.png)

### Not Received Finder

`steamgifts.com/user/*`

![](http://i.imgur.com/lgjr9mo.png)
![](http://i.imgur.com/8AXpAd2.png)

* Allows you to find an user's not received giveaways.
* If the user doesn't have any not received giveaways, the button will not appear.
* Results are cached for 7 days.

### User Giveaways Data

![](http://i.imgur.com/1ZeyWtw.png)
![](http://i.imgur.com/Vq0Toc1.png)
![](http://i.imgur.com/q3xqDym.png)

* Gathers data about an user's giveaways, listing them by type and level.
* Lists the most given away games for sent checks and the users most won from for won checks.
* The data is not 100% accurate if the user has not received giveaways.

### Level Up Calculator

`steamgifts.com/user/*`

![](http://i.imgur.com/eTBR402.png)

* Approximately calculates how much real CV an user needs to level up.

### Inbox Winners Highlighter

`steamgifts.com/messages`

![](http://i.imgur.com/l5IeKoHg.png)

* Highlights the winners of your giveaways in your inbox.
* A winner is added to the storage when you send the gift to them through the winners page of the giveaway or through Unsent Gifts Sender.

### Unsent Gifts Sender

`steamgifts.com/created/*`

![](http://i.imgur.com/IXgP9G0.png)
![](http://i.imgur.com/69wbkUP.png)

* Allows you to send all your unsent gifts directly from your created giveaways page.
* You can choose to only send the gifts to winners with 0 not activated / multiple wins or who are whitelisted.

### Entries Remover

`steamgifts.com/giveaways/entered/*`

![](http://i.imgur.com/kXTZeWo.png)

* Allows you to remove entries for owned games.
* In order for the feature to work, you must enter your Steam API Key in section 9 of the settings menu (get a Steam API Key [here](https://steamcommunity.com/dev/apikey)):

![](http://i.imgur.com/MK5cVax.png)

### Giveaway Templates

`steamgifts.com/giveaways/new`

![](http://i.imgur.com/yl9ogWx.png)
![](http://i.imgur.com/PFML0cc.png)

* Allows you to save giveaway templates for later use.
* To edit a template, simply apply it normally, perform your changes and save it with the same name.

### Stickied Giveaway Groups

`steamgifts.com/giveaways/new`

![](http://i.imgur.com/5QeKO7e.png)

* Allows you to sticky groups while creating a giveaway.

### Header Icons Refresher

`steamgifts.com/*`

* Updates the header icons every 60 seconds (only if the tab is active).
* You can enable an option that runs the refresher in the background and changes the icon of the tab when not active.

### Delivered Gifts Notifier

`steamgifts.com/*`

![](http://i.imgur.com/z4EZZm6.png)

* Notifies you if one of your won gifts has been delivered.

### Advanced Giveaway Search

`steamgifts.com/giveaways/*(!(wishlist|created|entered|won)`

![](http://i.imgur.com/RHYmAGs.png)

* Allows you to easily search giveaways using SG's [search parameters](https://www.steamgifts.com/discussion/8SzdT/).

### Pinned Giveaways Button

`steamgifts.com/giveaways/*`

![](http://i.imgur.com/oiXdLx3.png)

* Allows you to collapse the pinned giveaways container after expanding it.

### Points Refresher

`steamgifts.com/?`

* Updates your points every 60 seconds (only if the tab is active).
* You can enable an option that runs the refresher in the background and changes the title of the tab when not active.

### Visible Attached Images

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/IoZ7JhK.png)

* Shows all attached images by default.

### Games Highlighter

`steamgifts.com/*`

![](http://i.imgur.com/gblD658.png)

* Highlights games you have already entered giveaways for.

### Giveaway Panel
### Entered Giveaways Filter

`steamgifts.com/*`

* Hides entered giveaways.

### Enter/Leave Giveaway Button

`steamgifts.com/(giveaways|user|group)/*`

![](http://i.imgur.com/dR5gyHW.png)

* Allows you to enter / leave giveaways directly from the giveaways pages.

### Giveaway Description/Reply Box Popup

`steamgifts.com/(giveaways|user|group)/*`

![](http://i.imgur.com/6HJTICj.png)

* Allows you to view giveaway descriptions and add comments to giveaways directly from the giveaways pages.
* You can enable an option to show it automatically upon entering a giveaway if Enter / Leave Giveaway Button is enabled.

### Giveaway Winning Chance

`steamgifts.com/(giveaways|giveaways/entered|giveaway|user|group)/*`

![](http://i.imgur.com/Pib5Tom.png)

* Displays your winning chance for a giveaway.

### Groups Highlighter

`steamgifts.com/giveaway/groups/*`

![](http://i.imgur.com/eaGeLUj.png)

* Highlights which groups you are a member of in the giveaway groups page.

### Groups Stats

`steamgifts.com/account/steam/groups/*`

![](http://i.imgur.com/b7jV7Gu.png?1)

* Shows your status in groups from your groups page.

### One-Click Hide Giveaway Button

`steamgifts.com/*`

* Allows you to hide giveaways with one click.

### Giveaway Groups Loader

`steamgifts.com/*`

![](http://i.imgur.com/PN73phv.png)

* Loads the groups of a giveaway and shows them below it.
* Groups that you are a member of are highlighted in bold.

### Giveaway Error Search Links

`steamgifts.com/giveaway/*`

![](http://i.imgur.com/GM6bX3s.png)

* Provides search links for the game when you cannot access a giveaway.

### Discussions Highlighter

`steamgifts.com/discussions/*`

![](http://i.imgur.com/A2o14yw.png)

* Allows you to highlight discussions.

### Comment Tracker

`(steamgifts|steamtrades).com/*(!messages)`

![](http://i.imgur.com/6nALh8y.png)

* Fades out giveaways / discussions / support tickets / trades you have already visited. Note that this does not mean every comment inside the page has been read, it simply means you have visited it.
* Keeps track of comments / editions and fades out those you have already read.
* To mark a comment as read, click on the eye icon below it:

![](http://i.imgur.com/UCb55vi.png)

* Adds a panel that allows you to go to the first unread comment of the page or mark all comments of the page as read:

![](http://i.imgur.com/8fPMwjG.png)

* Keeps track of discussion comments and shows how many comments are unread on the discussions page.
* Allows you to go to the first unread comment of a discussion or mark all its comments as read directly from the discussions page.

### Comment Formatting Helper

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/g9C3e0g.png)

* Adds a panel that helps you with comment formatting.
* Allows you to turn automatic links / images paste formatting on / off.
* You can disable any items of the panel through the settings menu, except for the automatic links / images paste formatting item.

### Reply Box Popup

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/hmaZQYn.png)
![](http://i.imgur.com/ClGzBNS.png)

* Hides the main comment box and adds a button that pops up a box which allows you to add comments to the page.
* Has `Discussion Edit Detector` built-in.

### Multi-Reply

`(steamgifts|steamtrades).com/*`

* Allows you to reply to multiple comments at the same time, since each comment has their own comment box and the page isn't reloaded after submitting it.
* Has `Discussion Edit Detector` built-in.

### Reply From Inbox

`(steamgifts|steamtrades).com/messages/*`

* Allows you to reply to your messages directly from your inbox.
* Has `Multi-Reply` built-in.

### Game Tags

`steamgifts.com/*`

![](http://i.imgur.com/qCLDa2g.png)
![](http://i.imgur.com/g4pTzCe.png)

* Allows you to add tags to games.
* Separation of tags is purely cosmetic.

### Giveaway Winners Link

`steamgifts.com/*`

![](http://i.imgur.com/g2kaFD9.png)

* Adds a link to the winners page of a giveaway.

### Main Post Popup

`steamgifts.com/discussion/*`

![](http://i.imgur.com/lA9QNLM.png)

* Hides the main post and adds a button that pops it up.
* If `Comment Tracker` is enabled, the main post is only hidden if it has been marked as read.

### Discussion Edit Detector

`steamgifts.com/discussion/*`

* Detects if the discussion you're posting a comment to has been edited since the time you opened it and saves your comment correctly.
* This fixes a bug on SteamGifts that does not save your comment to a discussion if you submit it after the discussion has been edited.

### Reply Mention Link

`(steamgifts|steamtrades).com/*`

![](http://i.imgur.com/SgEzjXC.png)

* Adds a mention link to the comment replied to.

### Archive Searcher

`steamgifts.com/archive/*`

![](http://i.imgur.com/DtvFj5J.png)
![](http://i.imgur.com/bkUPFuV.png)

* Allows you to search the archive by exact title / AppID.

### Pagination Navigation On Top

`steamgifts|steamtrades.com*`

* Moves the pagination navigation to the top of the page.

### Reply Box On Top

`steamgifts|steamtrades.com*`

* Moves the reply box to the top of the page.

### Other Info

* All requests from `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` are limited to 2 per second, to prevent a stress on the SG servers.
* If you try to leave the page while `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` are running, you will get a confirmation dialog asking you if you want to leave the page. Additionally, while these features are running, their buttons are faded out.
* `Whitelist / Blacklist Checker`, `Not Activated / Multiple Wins Checker`, `Not Received Finder` and `Archive Searcher` allow for real-time options. For example, if you start `Whitelist / Blacklist Checker` with `Also check for whitelist.` enabled, but in the middle of the process you decide to disable that option, from that point onwards it will no longer check for whitelist.

---

## Changelog

**7.14.0 (February 3, 2018):**

<ul>
    <li><a href="https://github.com/revilheart/ESGST/issues/406">#406</a>Add option to play sound with notifications</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/407">#407</a>Allow users to specify where they want features to run</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/410">#410</a>Fix a bug that shows a notification for new wishlist giveaways when there are not any</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/411">#411</a>Fix a bug that duplicates encrypted giveaways when editing a comment</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/413">#413</a>Fix a bug that happens when checking if the user is already a member of the Steam group</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/414">#414</a>Detect all errors</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/415">#415</a>Extend Table Sorter to tables posted in comments</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/418">#418</a>Decrypt encrypted giveaways on page load</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/420">#420</a>Fix a bug in Discussions Highlighter that prevents the page from loading correctly</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/421">#421</a>Fix a bug that happens when filtering giveaways/discussions</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/422">#422</a>Only hide basic filters if the user made an advanced search in Giveaway Filters</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/423">#423</a>Fix a bug that happens when sending unsent gifts</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/424">#424</a>Fix some typos in Unsent Gifts Sender</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/425">#425</a>Fix a bug that notifies about errors even if the option is disabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/427">#427</a>Allow users to move the enter button and chance/ratio around like Game Categories does</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/428">#428</a>Fix a bug that happens when clicking the Manage User Tags button in the settings menu</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/430">#430</a>Add Release Date game category</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/431">#431</a>Add missing game categories to Giveaway Filters</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/432">#432</a>Add option to remove all games to Hidden Games Remover</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/433">#433</a>Fix a bug that shows 2 hide giveaway buttons if One-Click Hide Giveaway Button is enabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/434">#434</a>Fix a bug that happens when showing notifications in Header Refresher</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/435">#435</a>Change the donation site, since Pledgie is closing down</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/436">#436</a>Separate grid view from normal view when dragging categories</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/437">#437</a>Speed up page load with Reply From Inbox > "Save replies" enabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/438">#438</a>Fix a bug that happens when deleting all color settings for the rating category</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/440">#440</a>Bypass Steam's age and mature check when retrieving game categories</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/441">#441</a>Fix a bug that happens when saving settings</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/444">#444</a>Add a feature: Quick Inbox View</li>
</ul>

**7.13.1 (January 14, 2018):**

<ul>
    <li><a href="https://github.com/revilheart/ESGST/issues/399">#399</a> Remove !important rule from colors in Game Categories</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/398">#398</a> Add more information about requesting to join the Steam group</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/401">#401</a> Hide button to request access to the ESGST Steam group if the user is already a member</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/400">#400</a> Add options to customize what happens when clicking on notifications</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/402">#402</a> Fix a bug that happens when syncing with Avatar Popout (Click) enabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/403">#403</a> Fix a bug that does not load Puzzle Marker in discussion pages</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/404">#404</a> Fix a bug that does not allow moving categories to the default place if no other categories are present</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/405">#405</a> Add option to only close notifications manually</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/396">#396</a> Fix a style issue with the last item of menu dropdowns</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/353">#353</a> Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)</li>
</ul>

**7.13.0 (January 13, 2018):**

<ul>
    <li><a href="https://github.com/revilheart/ESGST/issues/251">#251</a> Fix a bug that does not save encrypted giveaways posted by the user sometimes</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/285">#285</a> Apply discussion filters in the main page</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/331">#331</a> Add options to limit search by date and pages to Sent Keys Searcher</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/348">#348</a> Check for replies to a comment before replying in Reply From Inbox</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/349">#349</a> Add link to reload extension to the update popup</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/362">#362</a> Fix a bug that keeps loading the auto sync</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/367">#367</a> Fix a style compatibility issue between Discussions Highlighter and Puzzle Marker</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/369">#369</a> Initialize filterPresets for new users</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/370">#370</a> Fix a bug that happens when checking users with return options enabled in Whitelist/Blacklist Checker</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/372">#372</a> Add a loading popup when opening the import/export/delete menus until the data sizes are calculated</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/373">#373</a> Fix a bug in Giveaways Manager when unbookmarking giveaways</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/374">#374</a> Add option to save current reply to Saved Replies</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/375">#375</a> Add a feature: URL Redirector</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/376">#376</a> Add a feature: Notification Merger</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/377">#377</a> Fix a bug that updates the last sync date for all data when syncing games/groups</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/378">#378</a> Use name + description to identify a saved reply</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/379">#379</a> Fix a bug that happens when retrieving DLC base information in Game Categories</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/380">#380</a> Add shortcut keys to undo/redo and support for saved replies in Comment Formatting Helper</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/381">#381</a> Fix a bug that opens the description popup even if the option is disabled in Enter/Leave Giveaway Button</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/382">#382</a> Fix a bug in User Giveaways Data that does not retrieve giveaways</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/383">#383</a> Fix a typo in the Game Categories code</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/384">#384</a> Add support for Avatar Popout to the avatar in the header</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/385">#385</a> Add options to calculate data sizes when opening the import/export/delete menus</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/386">#386</a> Add a tool to generate next/previous/counter formats to Multiple Giveaways Creator</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/387">#387</a> Turn Header Refresher notifications into links</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/388">#388</a> Add an option to notify errors</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/389">#389</a> Fix a typo in the counter when performing some checks</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/390">#390</a> Prevent Giveaways Extractor from stopping if there is a badly formatted giveaway link</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/391">#391</a> Fix a conflict with SteamGifts Steam Ratings</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/392">#392</a> Allow winners to be updated when syncing giveaways or using Created/Entered/Won Giveaway Details</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/393">#393</a> Fix a bug that happens when importing from OneDrive</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/394">#394</a> Fix a bug that does not filter giveaways in the created/entered/won pages correctly</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/395">#395</a> Allow more customization for Game Categories</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/353">#353</a> Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)</li>
</ul>

**7.12.2 (January 7, 2018):**

<ul>
    <li><a href="https://github.com/revilheart/ESGST/issues/363">#363</a> Fix a bug that does not auto backup all data</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/364">#364</a> Fix a bug that happens when checking for a user's not activated/multiple wins</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/353">#353</a> Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)</li>
</ul>

**7.12.1 (January 6, 2018):**

<ul>
    <li><a href="https://github.com/revilheart/ESGST/issues/350">#350</a> Fix a bug that does not highlight discussions</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/351">#351</a> Fix a bug that does not go to the first unread comment correctly</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/352">#352</a> Fix a bug that does not load Quick Discussion Browsing unless Quick Giveaway Browsing is enabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/354">#354</a> Fix a bug that does not load User Suspension Tracker in the main tickets page unless Giveaways/Discussions/Tickets/Trades Tracker is enabled</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/355">#355</a> Fix a bug that does not calculate real CV</li>
    <li><a href="https://github.com/revilheart/ESGST/issues/353">#353</a> Convert all callback functions into promises and use async/await to deal with them (Fixes a lot of bugs) (Ongoing)</li>
</ul>