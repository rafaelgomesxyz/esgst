import Popup from '../class/Popup';
import { container } from '../class/Container';

function loadChangelog(version) {
  const changelog = [
      {
        date: `January 21, 2019`,
        version: `8.2.1`,
        changelog: {
          1189: `Fix a bug that happens when retrieving game categories`,
          1188: `Fix a bug that happens when syncing reduced CV games`
        }
      },

      {
        date: `January 21, 2019`,
        version: `8.2.0`,
        changelog: {
          1185: `Use ESGST server as main method for retrieving game categories`,
          1184: `Use ESGST server as main method for syncing reduced CV games`,
          1183: `Fix a bug that does not load the add-on on Pale Moon`,
          1179: `Fix a bug in Giveaway Recreator that does not populate the fields correctly`,
          1178: `Get current version from extension API instead of changing it manually`,
          1177: `Remove all references to the userscript version from the README file`,
          1176: `Add donate link for Steam trade`,
          1172: `[WIP] Implement a server for ESGST`,
          1163: `Make Created/Entered/Won Giveaway Details work for blacklist giveaways`,
          1111: `Deprecate userscript version`
        }
      },

      {
        date: `January 5, 2019`,
        version: `8.1.13`,
        changelog: {
          1173: `Add a new giveaway filter: Minutes From Start`,
          1171: `Extend themes to SGTools (extension only)`,
          1158: `Add option to sync won giveaways`
        }
      },

      {
        date: `January 2, 2019`,
        version: `8.1.12`,
        changelog: {
          1169: `Let the background page handle locks in the extension`,
          1168: `Show a warning popup if a user tries to enable extension-exclusive features`,
          1167: `Fix a bug that prevents the Entry Tracker popup from opening depending on the Accurate Timestamp format set`,
          1166: `Remove option to limit requests to the Steam store and make it the default behavior`,
          1165: `Fix several bugs in User Giveaway Data`,
          1164: `Fix a bug that does not persist data larger than 5MB on Pale Moon`,
          1162: `Detect giveaway codes hidden in image titles with Giveaway Extractor`,
          1161: `Add an info to each sync category for which feature the data is required`,
          1157: `Fix a bug that prevents Giveaway Extractor from working in a new tab`,
          1156: `Remove Happy Holidays Integration`
        }
      },

      {
        date: `December 23, 2018`,
        version: `8.1.11`,
        changelog: {
          1155: `Implement priority system for Game Categories`,
          1154: `Implement cache for Giveaway Extractor`,
          1153: `Change Learning game category link to Steam store`,
          1152: `Fix some issues with Giveaway Extractor`,
          1151: `Fix a bug in Whitelist/Blacklist Checker that happens when checking users with 0 giveaways`,
          1150: `Fix a bug that does not count Happy Holidays giveaways for Level Progress Visualizer`,
          1149: `Fix typo in Accurate Timestamp`,
          1148: `Add option not to show seconds in Accurate Timestamp if they are equal to 0`,
          1147: `Add a giveaway filter: Currently Enterable`,
          1146: `Fix a bug that happens when using Firefox with third-party cookies disabled`,
          36: `Add a new feature: Visible Invite-Only Giveaways`
        }
      },

      {
        date: `December 22, 2018`,
        version: `8.1.10`,
        changelog: {
          1143: `Add toolbar button to Pale Moon`,
          1142: `Fix a bug that happens when extracting giveaways`,
          1141: `Fix a bug that happens when syncing owned/wishlisted/ignored games`
        }
      },

      {
        date: `December 21, 2018`,
        version: `8.1.9`,
        changelog: {
          1140: `Fix a bug that happens when trying to open the bookmarked giveaways popup`,
          1139: `Remove options to check if the current version is the latest using the title of the thread`,
          1138: `Remove options to download .zip and reload extension from new version popup in Chrome extensions`,
          1137: `Fix Grid View`,
          1136: `Fix changelog for v8.1.8`,
          1123: `Add option to apply Accurate Timestamp format to SteamGifts' date tooltips`
        }
      },

    {
      date: `December 21, 2018`,
      version: `8.1.8`,
      changelog: {
        1134: `Fix a bug that does not enable/disable themes properly`,
        1133: `Allow new options in the settings menu to be searchable by searching for "[new]"`,
        1132: `Fix a bug that marks disabled options as new`,
        1131: `Add a giveaway filter: Banned`,
        1130: `Always show game categories in real time and always show categories that do not need to be fetched instantly`,
        1129: `Continue loading game categories where it left off`,
        1128: `Add Giveaway Groups Loader panel to list of movable elements`,
        1127: `Revamp popups`,
        1126: `Rename extension to Enhanced SteamGifts & SteamTrades (ESGST)`,
        1125: `Add extension support for Pale Moon`,
        1124: `Add a feature: Custom Giveaway Calendar`,
        1122: `Add option to backup/restore themes`,
        1121: `Add button to the settings menu to dismiss all new options`,
        1117: `Bring back fixed feature details panel in the settings menu`,
        1033: `Fix a bug in Multi-Manager that does not select items in ESGST-generated pages`
      }
    },
    
    {
      date: `December 19, 2018`,
      version: `8.1.7`,
      changelog: {
        1120: `Fix a bug in Giveaway Popup / Enter/Leave Giveaway Button that shows wrong creator when opening giveaways from the won page of a user`,
        1119: `Fix a bug in Giveaway Winners Link that shows the winners link even if the giveaway ended with 0 entries`,
        1116: `Fix a bug that happens when loading game categories`
      }
    },

    {
      date: `December 19, 2018`,
      version: `8.1.6`,
      changelog: {
        1115: `Update first-install and notice popups`,
        1114: `Fix heading links in ESGST menu pages`,
        1113: `Fix a bug in Endless Scrolling that happens when refreshing a page with no comments and the page received comments in the meantime`,
        1112: `Fix a bug in Comment Reverser that reverses elements in the main page heading when there are no comments`,
        1110: `Allow options to be collapsed without having to disable them in the settings menu`,
        1109: `Remember collapsed sections in the settings menu`,
        1108: `Add option to color blacklisted giveaways to Custom Giveaway Background`,
        1107: `Fix a bug that does not allow Shortcut Keys to be used with the native SteamGifts comment box`,
        1106: `Fix endless scrolling for Happy Holidays Integration`,
        1105: `Fix a bug that tries to load game categories for discussions that have "Humble Bundle" and "Steam Gift Card" in their title`,
        1104: `Fix the pagination count in Endless Scrolling with reverse scrolling enabled`,
        1103: `Fix a bug in Endless Scrolling that does not allow the user to go to the first page of a discussion if reverse scrolling is enabled`,
        1102: `Add a new game category: Banned`,
        1101: `Remove background image in giveaway pages when using Custom Giveaway Background`,
        1100: `Add option to color enter button yellow if ESGST is unable to check game ownership`,
        1099: `Include Element Ordering and Steam API Key sections in the settings menu search`,
        1098: `Fix a bug that does not fade options properly when searching in the settings menu`,
        1097: `Allow the auto sync popup to be opened at any point during the sync instead of only at the end`,
        1096: `Add option to open popup by default when automatically syncing`,
        1095: `Log what has already been synced when syncing`,
        1094: `Change Search Key Searcher export file format from .txt to .csv`,
        1093: `Add option to show first page of comments of the giveaway to Enter/Leave Giveaway Button and Giveaway Popup`,
        1092: `Prevent Whitelist/Blacklist Checker button from appearing in pages with no users to check`,
        1090: `Detect Steam bundles as subs`,
        1089: `Add links to the Whitelist/Blacklist Checker results that allow the user to confirm the result`
      }
    },

    {
      date: `December 4, 2018`,
      version: `8.1.5`,
      changelog: {
        1070: `Fix a bug in Reply From Inbox that happens when a deleted reply is cached`,
        1069: `Fix a bug that prevents Time To Point Cap Calculator and Visible Full Level from working with Header Refresher disabled`,
        1068: `Increase default static popup width to 1200px`,
        1067: `Show sync results when clicking on the auto sync button`,
        1065: `Bring back option to open features in popups`,
        1064: `Add option to Level Up Calculator to display current user level`,
        1063: `Add option to remove sidebar in ESGST feature pages`,
        1062: `Fix a bug in Custom Header/Footer Links that does not reset links`,
        1061: `Add a new game category: Barter.vg`,
        1060: `Allow links to be reordered in User Links`,
        1059: `Add option to make settings menu collapsible`,
        1058: `Add a feature: Visible Gifts Breakdown`,
        1057: `Apply Accurate Timestamp to Avatar Popout`,
        1056: `More improvements to settings menu`,
        1055: `Fix a bug in Not Received Finder that prevents the feature from working`,
        1053: `Fix a bug that does not save some options`,
        1052: `Remove Discussion Edit Detector (fixed by cg)`,
        1050: `Improvements to Entered Giveaways Stats`,
        1048: `Add an option to show a simplified view of Pagination Navigation On Top`,
        1045: `Add option to display number of gifts won from / sent to user in User Giveaway Data`,
        1044: `Detect removed games in the No CV Games database`,
        1041: `Insert main page heading buttons after pagination`,
        1011: `Fix a bug that does not load categories properly in created pages`
      }
    },

    {
      date: `December 4, 2018`,
      version: `8.1.4`,
      changelog: {
        1054: `Add a feature: Happy Holidays Integration`
      }
    },

    {
      date: `December 3, 2018`,
      version: `8.1.3`,
      changelog: {
        1047: `Fix a bug in the settings menu that does not allow adding new colors`,
        1046: `Fix a bug in Enter/Leave Giveaway Button that does not add a button to re-enter giveaways in the entered page`,
        1042: `Fix conflicts with holiday gifts elements`,
        1040: `Improvements to settings menu`,
        1039: `Fix a bug that does not allow editing custom paths`,
        1038: `Remove options to open features in a new tab and make it the default behavior`,
        1037: `Extend Custom Giveaway Background to Giveaway Extractor`,
        1036: `Fix a bug in Giveaway Filters that does not filter descriptions`,
        1035: `Fix a bug that does not reset colors in the settings menu`,
        1034: `Fix a bug in Custom Giveaway Background that does not color giveaways correctly in created/entered/won pages`
      }
    },

    {
      date: `December 1, 2018`,
      version: `8.1.2`,
      changelog: {
        1032: `Hotfix for v8.1.1`
      }
    },

    {
      date: `December 1, 2018`,
      version: `8.1.1`,
      changelog: {
        1032: `Hotfix for v8.1.0`
      }
    },

    {
      date: `December 1, 2018`,
      version: `8.1.0`,
      changelog: {
        1031: `Add a new feature: Entered Giveaways Stats`,
        1030: `Fix a bug in Giveaway Templates that does not create giveaways through the Create Giveaway button`,
        1029: `Fix a bug in Giveaway Filters that does not toggle SteamGifts filters`,
        1028: `Add a new feature: User Links`,
        1027: `Fix a bug that positions Created/Entered/Won Giveaway Details columns in the wrong order`,
        1026: `Fix a bug that does not load username history`,
        1024: `Specify the element to retrieve usernames from more`,
        1023: `Add option to position Quick Giveaway Search on the right to prevent it from moving the other buttons`,
        1022: `Revamp ESGST-generated pages/popups`,
        1015: `Add option to hide games from list to Multi-Manager`,
        1014: `Only round chance / chance per point when displaying it, but keep it unrounded internally for better accuracy`,
        1012: `Add a new feature: Custom Giveaway Background`,
        990: `Fix a bug that does not allow some elements to be re-ordered`
      }
    },

    {
      date: `November 26, 2018`,
      version: `8.0.5`,
      changelog: {
        1021: `Fix a bug that detects wrong removed games when syncing`,
        1020: `Fix a bug in Reply Box Popup that does not go to the comment after posting`,
        1019: `Use date-fns to format and display dates`,
        1017: `Detect giveaways for Steam gift cards and Humble bundles`,
        1016: `Change package scripts`,
        1013: `Add giveaway filter "Game Tags"`,
        1009: `Fix a bug that does not format train links correctly in Multiple Giveaway Creator`,
        1008: `Fix a bug that does not calculate points to win in the entered page`
      }
    },

    {
      date: `November 1, 2018`,
      version: `8.0.4`,
      changelog: {
        1007: `Fix a bug that happens when trying to recreate a giveaway in Giveaway Recreator`,
        1006: `Fix a bug that happens when trying to view the results in Multiple Giveaway Creator`,
        1005: `Add option to automatically unbookmark inaccessible giveaways to Giveaway Bookmarks`,
        1004: `Fix a bug that does not automatically unbookmark ended giveaways in Giveaway Bookmarks`,
        1003: `Fix a bug that happens when saving a template in Giveaway Templates`,
        1000: `Add option to remove only wishlisted games to Hidden Games Remover`,
        999: `Fix a bug that happens when trying to edit a giveaway in Multiple Giveaway Creator`,
        996: `Allow multiple checkbox selection with Shift key in Multi-Manager`,
        995: `Fix a bug that happens when applying a template in Giveaway Templates`,
        994: `Add option to fallback to the Steam API when syncing without being logged in`,
        993: `Automatically add panel to the first visible text area in Comment Formatting Helper`,
        992: `Fix a style issue in Grid View`,
        988: `Fix a style issue that increases the hide giveaway button opacity`,
        987: `Fix a bug that prevents game tags from being shown`
      }
    },

    {
      date: `October 16, 2018`,
      version: `8.0.3`,
      changelog: {
        985: `Fix a style conflict between jQuery UI' CSS and SteamGifts' CSS`,
        984: `Fix dragging system for giveaway pages`,
        983: `Fix a bug that does not highlight copies from pinned giveaways in Giveaway Copy Highlighter`,
        982: `Fix a style issue in Grid View`,
        981: `Fix a bug in Giveaway Winners Link`,
        980: `Fix a bug that duplicates game categories`,
        979: `Fix a style issue with game categories that are moved to the giveaway columns`,
        978: `Add option to use preferred Google/Microsoft account when restoring/backing up`,
        977: `Fix a style issue that decreases the opacity of giveaway icons in the giveaway page`,
        922: `Load package data without having to reload the page in Game Categories`
      }
    },

    {
      date: `October 12, 2018`,
      version: `8.0.2`,
      changelog: {
        975: `Fix style issues`,
        974: `Make Level Progress Visualizer and Points Visualizer bars dynamically adjust to the size of the button`,
        973: `Fix a style issue that lowers the opacity of the points/copies elements`,
        970: `Fix a bug that does not show replies in the inbox page with Reply From Inbox`,
        969: `Fix a bug that refreshes the page after commenting with Multi-Reply`,
        968: `Add option to change Level Progress Visualizer and Points Visualizer bar colors`,
        967: `Make Level Progress Visualizer and Points Visualizer compatible`,
        966: `Add a new feature: Visible Full Level`
      }
    },

    {
      date: `October 11, 2018`,
      version: `8.0.1`,
      changelog: {

      }
    },
    {
      date: `October 11, 2018`,
      version: `8.0.0`,
      changelog: {
        965: `Add "Winners" giveaway filter`,
        964: `Add option to categorize Steam games to Multi Manager`,
        963: `Extract ItsTooHard and Jigidi links with Giveaway Extractor`,
        962: `Add option to automatically bookmark giveaways when trying to enter them without enough points to Enter/Leave Giveaway Button`,
        961: `Add option to display time to point cap alongside with points at the header`,
        960: `Add new section to the settings menu to handle elements order and prevent them from being draggable in all pages`,
        959: `Add option to use different pause settings in Endless Scrolling depending on the include path`,
        958: `Add option to reset left/right main page heading buttons order`,
        957: `Extend new draggable system to left/right main page heading buttons`,
        956: `Add which games were won from the listed users to User Giveaway Data`,
        950: `Fix HTML in User Stats`,
        949: `Fix a bug that does not show giveaway info category for games with 0P`,
        946: `Add a button for 2.14.4 "Only extract from the current giveaway onward"`,
        937: `Add a new game category and giveaway filter: Followed`,
        936: `Make elements in the giveaway links draggable`,
        935: `Fix a bug that empties the header points when removing someone from the whitelist`,
        933: `Fix HTML in Multiple Giveaway Creator`,
        925: `Make elements in the giveaway heading draggable`,
        902: `Change Content-Type header in Dropbox requests to application/octet-stream`
      }
    },
    {
      date: `September 15, 2018`,
      version: `7.27.2`,
      changelog: {
        915: `Fix Received and Not Received filters`,
        916: `Improve the detection of ended giveaways`,
        917: `Fix a bug that does not sort some columns correctly in Table Sorter`,
        918: `Fix a bug that doesn't stop Endless Scrolling on group pages if the Ended filter is set to false and an ended giveaway was found`,
        920: `Fix a typo in the simplified label for the Hidden game category`,
        921: `Do not sync list of reduced CV games if the database has failed to update`,
        923: `Increase priority of Hidden Game's Enter Button Disabler over default buttons`,
        924: `Fix a bug that centers posts in Main Post Popup`,
        926: `Fix a bug that happens when cleaning old data`,
        930: `Fix a bug that does not filter public giveaways in the entered page`,
        931: `Add "Reviews" filter`
      }
    },
    {
      date: `September 2, 2018`,
      version: `7.27.1`,
      changelog: {
        914: `Remove detailed hidden game category for packages`,
        913: `Add support for GitHub Wiki SteamGifts Integration to Comment Formatting Helper`,
        912: `Fix HTML of group names in Multiple Giveaway Creator`,
        910: `Only show Not Received Finder button for won gifts if the user has won gifts marked as not received`,
        909: `Fix counter in User Giveaway Data`
      }
    },
    {
      date: `August 31, 2018`,
      version: `7.27.0`,
      changelog: {
        906: `Always reverse discussions regardless of where the user came from`,
        786: `Show game categories for packages of the items from the package`,
        905: `Fix a bug that shows the loading icon forever in Game Categories`,
        899: `Prevent the script from marking all features as new on first install`,
        884: `Add a feature: Discussion Tags`,
        903: `Fix a bug that happens when syncing ignored games`,
        895: `Extend Not Received Finder to won giveaways`,
        894: `Show the games won under "Most sent to" in User Giveaway Data`
      }
    },
    {
      date: `August 26, 2018`,
      version: `7.26.4`,
      changelog: {
        798: `Indicate leftover gifts/keys in Unsent Gifts Sender`,
        861: `Add option to activate the first SG/ST tab if a browser session was restored (extension only)`,
        883: `Fix a bug that does not sync games correctly`,
        891: `Fix bugs in Whitelist/Blacklist Checker`,
        893: `Fix HTML in User Giveaway Data`,
        897: `Prevent Cake Day Reminder from notifying about past cake day when installing the script`,
        900: `Fix HTML in the restore and delete menus`,
        901: `Fix a bug that happens when refreshing old active discussions on sidebar`
      }
    },
    {
      date: `August 15, 2018`,
      version: `7.26.3`,
      changelog: {
        889: `Fix some bugs in Trade Bumper`,
        888: `Fix a conflict with Do You Even Play, Bro?`,
        887: `Fix a bug that sometimes adds a loading icon to giveaways when it shouldn&#39;t in Game Categories`,
        886: `Fix a few syntax bugs`,
        885: `Fix a bug that happens when loading categories for giveaways that were unfiltered`
      }
    },
    {
      date: `August 10, 2018`,
      version: `7.26.2`,
      changelog: {
        881: `Add option to show game categories that do not need to be fetched from Steam instantly`,
        880: `Fix a bug that does not apply some themes`,
        879: `Add the feature to show tag suggestions while typing as an option`,
        878: `Load game categories for filtered giveaways on demand`
      }
    },
    {
      date: `August 8, 2018`,
      version: `7.26.1`,
      changelog: {
        877: `Fix a bug that does not sync Steam groups`,
        876: `Fix a bug that does not retrieve game categories correctly for non-US users`,
        873: `Implement global 200ms limit to Steam store API requests`,
        872: `Fix a bug where some features don&#39;t work correctly in ESGST-generated pages`,
        871: `Fix a bug that does not load emojis`,
        859: `Fix a bug that does not load Profile Links if one of the sub-options is disabled`,
        848: `Fix bugs introduced by v7.25.0`,
        806: `Add option to continuously load X more pages (max 10) when visiting any page to Endless Scrolling`
      }
    },
    {
      date: `August 6, 2018`,
      version: `7.26.0`,
      changelog: {
        870: `Add Learning game category`,
        869: `Add Singleplayer game category`,
        868: `Include online multiplayer, co-op and online co-op in the Multiplayer game category`,
        867: `Link to SGTools pages in the Unsent Gifts Sender results`,
        866: `Add Enterable filter to Giveaway Extractor`,
        864: `Add a feature: Group Tags`,
        862: `Add autocomplete feature to User Tags and Game Tags`
      }
    },
    {
      date: `August 2, 2018`,
      version: `7.25.4`,
      changelog: {}
    },
    {
      date: `August 2, 2018`,
      version: `7.25.3`,
      changelog: {}
    },
    {
      date: `August 2, 2018`,
      version: `7.25.2`,
      changelog: {
        857: `Add option to backup as .zip or .json`,
        854: `Move each module into a separate file`,
        853: `Move some generic functions to a separate file`
      }
    },
    {
      date: `August 2, 2018`,
      version: `7.25.2`,
      changelog: {
        857: `Add option to backup as .zip or .json`,
        854: `Move each module into a separate file`,
        853: `Move some generic functions to a separate file`
      }
    },
    {
      date: `July 27, 2018`,
      version: `7.25.1`,
      changelog: {
        848: `Fix bugs introduced by v7.25.0`,
        850: `Fix the extension's toolbar popup`,
        852: `Add a new game category: HLTB`
      }
    },
    {
      date: `July 27, 2018`,
      version: `7.25.0`,
      changelog: {
        845: `Fix the extension to comply with Mozilla requirements`
      }
    },
    {
      date: `July 24, 2018`,
      version: `7.24.1`,
      changelog: {
        844: `Show error message in the giveaway if game categories failed to load`,
        843: `Fix a bug that re-retrieves categories for games that were already recently retrieved`,
        842: `Fix Is There Any Deal? Info`,
        841: `Extend "Most sent to" list to other users in User Giveaway Data`,
        840: `Prevent User Giveaway Data from making useless requests if a giveaway has less than or equal to 3 winners`,
        839: `Fix a bug that happens sometimes when hovering over the input field in Quick Giveaway Search`,
        838: `Fix a bug that colors ended giveaways as green the first time they are found in Giveaway Encrypter/Decrypter`,
        836: `Open links from the header menu in a new tab`,
        834: `Enhance cookie manipulation in the extension to bypass age checks in requests to the Steam store`,
        833: `Fix a bug that happens when showing game categories in real time`,
        832: `Fix changelog link in the header menu`,
        828: `Add option to show the Giveaway Encrypter/Decrypter header button even if there are only ended giveaways in the page`,
        803: `Fix a bug that doesn't show groups containing HTML entities in Multiple Giveaway Creator`
      }
    },
    {
      date: `July 22, 2018`,
      version: `7.24.0`,
      changelog: {
        829: `Add options to limit requests to the Steam store and show categories in real time to Game Categories`,
        831: `Fix a bug that does not calculate average entries correctly in Entry Tracker`,
        830: `Fix a bug that identifies non-owned games as owned in Game Categories`,
        827: `Add a feature: Giveaway Points To Win`,
        826: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" to Giveaways Sorter`,
        805: `Add "Projected Chance", "Projected Chance Per Point" and "Projected Ratio" giveaway filters`,
        808: `Fix a bug that does not remember the position of the winners column in group pages when dragging`,
        825: `Fix a style issue that shows two scrollbars in the settings menu`
      }
    },
    {
      date: `July 20, 2018`,
      version: `7.23.0`,
      changelog: {
        824: `Add enhancements to User Giveaway Data`,
        823: `Fix a bug that does not change SteamGifts filters through Giveaway Filters correctly`,
        822: `Fix a bug that does not pin highlighted discussions after sorting`,
        821: `Make SGTools filter ignore the Chance, Chance Per Point, Comments, Entries and Ratio filters`,
        820: `Fix the "Add Current" button for includes/excludes in the main page`,
        819: `Possible fix for endless spawning issue with Steam Activation Links`,
        818: `Use the featured heading of a user's profile page instead of the page heading`,
        817: `Add option to choose custom colors for Giveaway Copy Highlighter`,
        816: `Add option to automatically mark a user's own comments as read`,
        815: `Add option to enable tracking controls for a user's own comments`,
        814: `Add option to fade out read comments in Comment Tracker`,
        813: `Fix a bug that happens when refreshing active discussions on the sidebar`,
        812: `Fix a bug that happens when retrieving categories of discussions in the sidebar`,
        790: `Add option to automatically update hidden games adding/removing a game to/from the list`,
        811: `Show success message when cleaning data`,
        795: `Fix a bug that happens when cleaning data for features that the user hasn't used yet`,
        810: `Automatically detect username changes when visiting a user's profile page`,
        804: `Change resource references to the current version in the userscript version`,
        802: `Make the settings search bar stay always visible when scrolling`,
        797: `Add Public giveaway filter`,
        801: `Add a feature: Comment Filters`,
        147: `Add extension support for Microsoft Edge`,
        796: `Add countdown to the duplicate giveaway waiting period in Multiple Giveaway Creator`,
        794: `Add Patreon as an additional form of donation`,
        785: `Detect packages that contain owned/wishlisted games through Game Categories`,
        792: `Fix a bug that does not update the list of reduced CV games if a game was removed`,
        784: `Load themes faster`,
        646: `Extend header/footer to ESGST-generated pages`,
        672: `Add option to clean discussion (remove deleted comments from the database) to Comment Tracker`,
        783: `Open SGTools links in new tabs on Giveaway Extractor`
      }
    },
    {
      date: `June 24, 2018`,
      version: `7.22.0`,
      changelog: {
        545: `Add a feature: Have/Want List Checker`,
        572: `Fix a bug that does not predict the level in Level Progress Visualizer correctly`,
        690: `Fix a bug where Giveaway Group Loader fails in some pages`,
        702: `Extend Attached Image Carousel to Quick Inbox View`,
        722: `Improve performance when applying filter presets (removes live-search select box and invert rule)`,
        732: `Bring back filter counters`,
        768: `Save state of "create train" and "remove links" switches from Multiple Giveaway Creator with Giveaway Templates`,
        769: `Add polyfill for IntersectionObserver`,
        771: `Fix a bug that does not filter games without images after data being retrieved with Created/Entered/Won Giveaway Details`,
        772: `Fix domain for SteamGifts popups on SteamTrades`,
        773: `Fix Shared Group Checker for new Steam group page design`,
        775: `Save game name when it doesn't have an image for future use`,
        776: `Fix a bug that does not save an advanced filter preset after deleting the rules`,
        777: `Fix a bug that does not filter by Achievements or Linux`,
        778: `Add small manual for advanced filters`,
        779: `Fix conflict with Touhou script`,
        780: `Fix a bug that blinks the minimize popups panel if the popup was open when it ended`,
        781: `Fix a bug that does not allow restoring .zip files in Firefox`,
        782: `Fix a bug that skips the Quick Inbox View popout to the top when scrolling down`
      }
    },
    {
      date: `June 10, 2018`,
      version: `7.21.1`,
      changelog: {
        0: `Hotfix for v7.21.0.`
      }
    },
    {
      date: `June 10, 2018`,
      version: `7.21.0`,
      changelog: {
        765: `Fix a bug that does not allow restoring .zip files`,
        764: `Fix a bug that does not save filter settings if only basic filters are enabled`,
        763: `Fix a bug that does not retrieve all pages correctly in Whitelist/Blacklist Checker`,
        762: `Fix a bug that adds duplicate "Sticky group" buttons`,
        760: `Add SteamGifts' CSS file to the repository to prevent ESGST pages from being messed up if cg updates the CSS`,
        759: `Fix a bug that shows wrong list of users in Group Library/Wishlist Checker when searching by app ID`,
        758: `Fix a bug that only previews comments on user input`,
        757: `Fix a bug that does not load encrypted giveaways`,
        756: `Open settings menu when clicking on the extension icon`,
        755: `Add option to minimize non-temporary popups`,
        753: `Fix a bug that adds duplicate "Skip User" buttons to Whitelist/Blacklist Checker`,
        752: `Fix active discussions on narrow sidebar`,
        750: `Fix a bug that positions large popouts incorrectly in screens below 1440x900`,
        749: `Fix a bug that does not allow applying empty presets`,
        748: `Improve the scrolling`,
        747: `Fix a bug that applies discussion filter on the main page even when disabled`,
        746: `Add a feature: Points Visualizer`,
        745: `Fix a style issue in the filters`,
        744: `Add a new game category: DLC (Base Owned)`,
        743: `Bring back option to select which filters to appear`,
        742: `Fix a bug that does not load Multi-Manager in the regular pages`,
        711: `Fix a bug in Quick Inbox View`,
        671: `Add a feature: Giveaway End Time Highlighter`,
        573: `Completely revamp User Giveaway Data`
      }
    },
    {
      date: `May 28, 2018`,
      version: `7.20.5`,
      changelog: {
        0: `Hotfix for v7.20.4.`
      }
    },
    {
      date: `May 28, 2018`,
      version: `7.20.4`,
      changelog: {
        737: `Save paused state of filters to allow them to remain paused when refreshing the page`,
        736: `Fix a bug that deletes settings if saving a preset with some filters paused`,
        735: `Convert old presets to the new system`,
        734: `Fix a bug in Endless Scrolling`,
        731: `Fix a bug that does not apply presets`
      }
    },
    {
      date: `May 27, 2018`,
      version: `7.20.3`,
      changelog: {
        730: `Possible fix to massive CPU usage spikes`,
        728: `Increase max-height of filters area`,
        727: `Fix a bug that happens when backing up to Google Drive`,
        726: `Fix a bug in the filters`,
        723: `Change color of AND/OR filter buttons`,
        721: `Fix a bug that happens in Giveaway Encrypter/Decrypter because of filters`,
        720: `Bring back the core of the basic filters as an opt-out option`,
        718: `Add button to pause filter rules/groups to advanced filters`
      }
    },
    {
      date: `May 27, 2018`,
      version: `7.20.2`,
      changelog: {
        0: `Hotfix for v7.20.1.`
      }
    },
    {
      date: `May 26, 2018`,
      version: `7.20.1`,
      changelog: {
        0: `Hotfix for v7.20.0.`
      }
    },
    {
      date: `May 26, 2018`,
      version: `7.20.0`,
      changelog: {
        709: `Use jQuery QueryBuilder to configure filters`,
        715: `Add a feature: Narrow Sidebar`,
        708: `Fix a bug that does not load features correctly in new tabs`,
        667: `Fix a bug that does not load endless features correctly in some pages`,
        678: `Display ? instead of negative CV in Game Categories - Giveaway Info and get the price from the giveaway points when available`,
        707: `Do not go to comment in Quick Inbox View`,
        665: `Add other found replies to the comment instead of showing them in a popup in Reply From Inbox`,
        703: `Improve description variables explanation in Multiple Giveaway Creator`,
        706: `Fix a bug that reverses the pages of a discussion when there is a hash in the URL`,
        705: `Fix a bug that does not manage items inside of Grid View popouts in Multi-Manager`,
        704: `Add option to hide games to Multi-Manager`
      }
    },
    {
      date: `May 20, 2018`,
      version: `7.19.0`,
      changelog: {
        701: `Remove min-height requirement from Fixed Sidebar`,
        700: `Fix a bug that does not fix the sidebar after scrolling down a second time from the top`,
        699: `Fix a bug that does not display the sync page`,
        698: `Add option to choose the key combination to trigger the Custom Header/Footer Links editor`,
        695: `Fix a bug where sorting fails after hiding a single giveaway`,
        694: `Fix a style issue that does not position popouts above/below correctly`,
        693: `Fix a style issue that does not position popouts correctly if the window is scrolled horizontally`,
        692: `Remove min-height requirement from Fixed Main Page Heading`,
        691: `Change Giveaway Popup button to red if giveaway cannot be accessed`,
        689: `Add a button to clear the current query to the search field in the settings menu`,
        688: `Extend giveaway features to the archive page`,
        686: `Changes to how emojis are stored`,
        685: `Compress data when backing up`,
        684: `Add &quot;Last Bundled&quot; default link to Custom Header/Footer Links`,
        683: `Allow selected emojis to be re-ordered`,
        682: `Add option to retrieve game names when syncing`,
        681: `Fix a bug where filtering is applied when changing any filter options despite filtering being disabled`,
        680: `Add a feature: Visible Real CV`,
        679: `Add &quot;Previously Won&quot; game category`,
        677: `Fix a bug that does not persist some settings`,
        676: `Fix a bug that auto-backups to computer on every page load`,
        674: `Change how the NEW indicator works on Quick Inbox View`
      }
    },
    {
      date: `May 11, 2018`,
      version: `7.18.3`,
      changelog: {
        675: `Remove Comment History from SteamTrades`,
        673: `Fix a bug that happens when creating giveaways through either Giveaway Templates or Multiple Giveaway Creator`,
        670: `Fix a bug that does not return Endless Scrolling to a paused state after continuously loading pages`,
        667: `Fix a bug that does not load endless features correctly in some pages`
      }
    },
    {
      date: `May 07, 2018`,
      version: `7.18.2`,
      changelog: {
        668: `Hotfix for v7.18.1`
      }
    },
    {
      date: `May 07, 2018`,
      version: `7.18.1`,
      changelog: {
        666: `Hotfix for v7.18.0`
      }
    },
    {
      date: `May 07, 2018`,
      version: `7.18.0`,
      changelog: {
        664: `Fix a bug that does not decrypt giveaways containing the word bot in their name`,
        663: `Fix a bug that happens when importing giveaways with a description template for a train in Multiple Giveaway Creator`,
        662: `Fixate the Comment Formatting Helper panel without limiting the height of the text area`,
        661: `Fix a bug in Comment Formatting Helper that does not add a scrolling bar to the text area in the edit discussion page`,
        660: `Fix a bug that removes all games when syncing if both the store and the API methods failed`,
        659: `Fix a style issue that sometimes does not overlap popups/popouts correctly`,
        658: `Fix a bug that does not refresh Quick Inbox View correctly`,
        657: `Add infinite max filters to Giveaway/Discussion Filters`,
        655: `Fix a bug that does not load endless features correctly`,
        654: `Make SGTools link draggable in Giveaway Extractor`,
        653: `Add missing Steam and search links to SGTools giveaways in Giveaway Extractor`,
        651: `Update FontAwesome links`,
        650: `Limit requests to the Steam store when syncing to 1 per second`,
        647: `Changes to the structure of the code`,
        645: `Add a SGTools filter to Giveaway Filters`,
        644: `Fix a bug that does not delete table rows in Comment Formatting Helper`,
        642: `Add option to group all keys for the same game in Multiple Giveaway Creator`,
        641: `Add a new section to the settings menu: Themes`,
        640: `Fix tooltip in Multiple Giveaway Creator`,
        639: `Convert checkboxes from circles to squares`,
        638: `Fix some bugs that happen when marking comments as unread`,
        608: `Add a feature: Multi-Manager (remove Giveaway Manager and Multi-Tag)`,
        332: `Fix a bug that fails to create multiple giveaways for the same game in Multiple Giveaway Creator`
      }
    },
    {
      date: `April 19, 2018`,
      version: `7.17.8`,
      changelog: {
        637: `Fix a style issue in pages generated by ESGST open in a new tab`,
        636: `Fix a bug that calculates the wrong chance per point if a giveaway has 0 points`,
        635: `Bypass bot protections when extracting giveaways`,
        634: `Fix a bug that does not switch the colors of game category icons for alt accounts when moving them`,
        633: `Fix a bug that does not turn the decrypted giveaways icon to green when new giveaways are found`,
        628: `Add option to only search for comments in a specific page range to Comment Searcher`,
        599: `Extend Giveaways Sorter to popups`,
        567: `Add description variables to Multiple Giveaway Creator`
      }
    },
    {
      date: `April 14, 2018`,
      version: `7.17.7`,
      changelog: {
        632: `Add option to limit how many SGTools giveaways are opened when extracting`,
        631: `Add option to allow manipulation of cookies for Firefox containers`,
        630: `Add more details to error messages during alt accounts sync`,
        629: `Cancel backup when canceling file name input`,
        627: `Implement a method to make the process of adding new filters easier`,
        626: `Fix a bug that does not sync games if the user does not have alt accounts set`,
        625: `Integrate SGTools giveaways into Giveaway Extractor`,
        624: `Fix a bug that opens duplicate SGTools links when extracting giveaways`,
        623: `Add option to save backups without asking for a file name`,
        593: `Add Groups and Creators giveaway filters and Authors discussion filter`,
        592: `Fix a bug that does not load more pages in Endless Scrolling if there are deleted giveaways in the current page with the ended filter set to hide all`
      }
    },
    {
      date: `April 11, 2018`,
      version: `7.17.6`,
      changelog: {
        620: `Add more reliable methods of syncing and backing up`,
        619: `Fix a bug that does not add an Enter button when extracting giveaways with few points`,
        618: `Add option to open SGTools links when extracting giveaways`,
        617: `Fix a bug that does not sync owned games in alt accounts`,
        616: `Allow users to sync their games through the Steam API alone if the store method is unavailable`,
        615: `Fix a bug that does not reverse a discussion if endless scrolling is paused`,
        614: `Add option to reverse comments in a discussion by indicating it through a hash in the URL`,
        613: `Make blacklist checks an opt-out instead of an opt-in by default in Whitelist/Blacklist Checker`,
        611: `Add option to specify non-region restricted giveaways when importing in Multiple Giveaway Creator`,
        610: `Fix a bug that duplicates the permalink icon`,
        609: `Fix a bug that does not retrieve game names when syncing`,
        607: `Fix a bug that does not include the .zip download when notifying a new version in non-Firefox browsers`,
        604: `Fix a bug that prevents the script from loading`,
        603: `Fix a bug that can prevent some elements in the giveaway columns/panel from being moved`,
        600: `Fix a bug that does not show SG popups found when requesting data if static popups are enabled`
      }
    },
    {
      date: `April 05, 2018`,
      version: `7.17.5`,
      changelog: {
        605: `Fix a bug that does not set the correct default values for some settings`,
        602: `Add option to clean duplicate data to the data cleaner menu`,
        598: `Implement a method to automatically detect and highlight new features/options in the settings menu with the [NEW] tag`,
        597: `Fix a bug that shows Infinity% chance per point on the entered page`,
        596: `Replace the terms &quot;Import&quot; and &quot;Export&quot; with &quot;Restore&quot; and &quot;Backup&quot; and change the icons to avoid any confusion`,
        584: `Fix a bug that does not reload the extension in Chrome when updating`,
        555: `Add SteamGifts filters to Giveaway Filters`,
        538: `Add options to allow users to specify the format of the tab indicators in Header Refresher`,
        524: `Fix a but that shows the new version popup twice`,
        299: `Implement a method to better handle marking discussions as visited across multiple tabs`
      }
    },
    {
      date: `March 25, 2018`,
      version: `7.17.4`,
      changelog: {
        590: `Speed up retrieval of Game Categories for users that do not have ratings, removed and user-defined tags enabled`,
        588: `Fix a conflict between whitelist/blacklist/rule checks and Quick Inbox View`,
        587: `Prevent main page heading from being fixed if the page is too small`,
        586: `Add option to filter giveaways by chance per point`,
        585: `Fix a bug that duplicates user notes when importing and merging`,
        582: `Fix a couple bugs that prevent Game Categories from being retrieved correctly`
      }
    },
    {
      date: `March 20, 2018`,
      version: `7.17.3`,
      changelog: {
        583: `Revert #565`,
        580: `Fix a bug in Tables Sorter that does not sort sent/received group columns correctly`,
        579: `Rename Whitelist/Blacklist Links to Profile Links and add more options`
      }
    },
    {
      date: `March 15, 2018`,
      version: `7.17.2`,
      changelog: {
        0: `Split jQuery, jQuery UI and Parsedown into separate files`
      }
    },
    {
      date: `March 14, 2018`,
      version: `7.17.1`,
      changelog: {
        0: `Add extension to the Mozilla store`
      }
    },
    {
      date: `March 14, 2018`,
      version: `7.17.0`,
      changelog: {
        562: `Add descriptions to the precise options in Giveaway Templates`,
        563: `Add an option to specify the game when importing with Multiple Giveaway Creator`,
        564: `Fix a bug that does not extract the giveaway from the current page`,
        565: `Add minified version and set it as default`,
        566: `Add option to specify separate details for each imported giveaway in Multiple Giveaway Creator`,
        568: `Add an option to enable Giveaway Recreator for all created giveaways`,
        570: `Fix a bug in Chrome that does not open the giveaway extractor on first click`,
        571: `Include whether the giveaway is for a gift or a key in the template when using Giveaway Templates`,
        574: `Add a feature: Element Filters (remove Hidden Feature Container and Hidden Pinned Giveaways)`,
        575: `Move "Click here to see your review for this user" to the top of the page in Reply Box On Top on SteamTrades`,
        576: `Fix a bug that does not load features correctly in discussions that contain polls`,
        578: `Optimize the extension performance (Ongoing)`,
        353: `Convert all callback functions into promises and use async/await to deal with them (Ongoing)`
      }
    },
    {
      date: `March 4, 2018`,
      version: `7.16.5`,
      changelog: {
        353: `Convert all callback functions into promises and use async/await to deal with them (ongoing)`,
        552: `Fix a bug that does not allow the Giveaway Extractor button to be moved`,
        556: `Only load Attached Images Carousel for images that are actually in the page`,
        558: `Fix a bug that does not extract giveaways in a new tab`,
        560: `Fix a bug that does not load ESGST sometimes`,
        561: `Fix a bug that happens when performing requests in the userscript version`
      }
    },
    {
      date: `March 2, 2018`,
      version: `7.16.4`,
      changelog: {
        0: `Hotfix for v7.16.3 (Userscript version was still not working)`
      }
    },
    {
      date: `March 2, 2018`,
      version: `7.16.3`,
      changelog: {
        0: `Hotfix for v7.16.2 (Userscript version was not working)`
      }
    },
    {
      date: `March 2, 2018`,
      version: `7.16.2`,
      changelog: {
        0: `Hotfix for v7.16.1 (Forgot to change the version)`
      }
    },
    {
      date: `March 2, 2018`,
      version: `7.16.1`,
      changelog: {
        527: `Fix a bug that happens when loading highlighted discussions`,
        537: `Add option to delete days from Entry Tracker history`,
        539: `Fix a bug that happens when sending unsent gifts with the options to check if the winner is whitelisted/blacklisted`,
        540: `Fix some bugs with the reordering of heading buttons`,
        541: `Extend Inbox Winner Highlighter to Quick Inbox View`,
        542: `Add options to specify image border width when highlighting a giveaway with Giveaway Winning Chance/Ratio`,
        543: `Fix a bug that does not load some features correctly`,
        544: `Change the order of the elements in the Giveaway Bookmarks popup`,
        548: `Fix a bug that decrypts giveaway links from the Quick Inbox View popout`,
        549: `Add domain instructions to adding a Steam API key`,
        550: `Optimize storage usage in the script version`
      }
    }
  ];
  let index;
  if (version) {
    let i, n;
    for (i = 0, n = changelog.length; i < n && changelog[i].version !== version; i++) {
    }
    if (i < n) {
      index = i;
    } else {
      index = -1;
    }
  } else {
    changelog.length - 1;
  }
  const html = [];
  while (index > -1) {
    const items = [];
    for (const key in changelog[index].changelog) {
      if (changelog[index].changelog.hasOwnProperty(key)) {
        const item = {
          type: `li`,
          children: []
        };
        if (key === `0`) {
          item.children.push({
            text: changelog[index].changelog[key],
            type: `node`
          });
        } else {
          item.children.push({
            attributes: {
              href: `https://github.com/gsrafael01/ESGST/issues/${key}`
            },
            text: `#${key}`,
            type: `a`
          }, {
              text: ` ${changelog[index].changelog[key]}`,
              type: `node`
            });
        }
        items.push(item);
      }
    }
    html.unshift({
      attributes: {
        class: `esgst-bold`
      },
      text: `v${changelog[index].version} (${changelog[index].date})`,
      type: `p`
    }, {
        type: `ul`,
        children: items
      });
    index -= 1;
  }
  if (!html.length) {
    return;
  }
  const popup = new Popup({ addScrollable: true, icon: `fa-file-text-o`, isTemp: true, title: `Changelog` });
  container.common.createElements(popup.scrollable, `afterBegin`, [{
    attributes: {
      class: `esgst-text-left markdown`
    },
    type: `div`,
    children: html
  }]);
  popup.open();
}

export {
  loadChangelog
};