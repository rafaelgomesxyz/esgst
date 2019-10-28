import { Parsedown } from '../lib/parsedown';
import { modules } from '../modules';
import { Shared } from './Shared';
import { LocalStorage } from './LocalStorage';

class Esgst {
  constructor() {
    this.CURRENT_GIVEAWAY_VERSION = 2;

    this.gmf = undefined;
    this.es_loadNext = undefined;
    this.es_refresh = undefined;
    this.es_refreshAll = undefined;
    this.gpf = undefined;
    this.es = undefined;
    this.mgc_createTrainSwitch = undefined;
    this.mgc_removeLinksSwitch = undefined;
    this.gas = undefined;
    this.ged_addIcons = undefined;
    this.cf = undefined;
    this.cfh = undefined;
    this.qiv = undefined;
    this.mm_enable = undefined;
    this.mm_disable = undefined;
    this.tf = undefined;
    this.df = undefined;
    this.gf = undefined;
    this.wbcButton = undefined;
    this.minimizePanel = undefined;
    this.onBeforeCommentSubmit = undefined;
    this.leftMainPageHeadingButtons = undefined;
    this.rightMainPageHeadingButtons = undefined;

    this.cvLevels = [0, 0.01, 25, 50, 100, 250, 500, 1000, 2000, 3000, 5000];

    this.currentPaths = undefined;
    this.settingsChanged = undefined;
    this.winners = undefined;
    this.emojis = undefined;
    this.uscButton = undefined;
    this.isSyncing = undefined;
    this.giveawayExtraPanel = undefined;
    this.giveawayExtraPanel_gv = undefined;
    this.mmSelectionStart = undefined;
    this.lpvStyleArray = undefined;
    this.pvStyleArray = undefined;
    this.currentPage = undefined;
    this.itemsPerPage = undefined;
    this.delistedGames = undefined;
    this.featuresById = undefined;

    this.gc_queue = [];
    this.gc_queue_index = 0;
    this.is_gc_running_queue = false;

    this.settingsUrl = `https://www.steamgifts.com/account/settings/profile?esgst=settings`;
    this.syncUrl = `https://www.steamgifts.com/account/settings/profile?esgst=sync`;
    this.backupUrl = `https://www.steamgifts.com/account/settings/profile?esgst=backup`;
    this.restoreUrl = `https://www.steamgifts.com/account/settings/profile?esgst=restore`;
    this.deleteUrl = `https://www.steamgifts.com/account/settings/profile?esgst=delete`;
    this.cleanUrl = `https://www.steamgifts.com/account/settings/profile?esgst=clean`;
    this.dataManagementUrl = `https://www.steamgifts.com/account/settings/profile?esgst=data-management`;

    this.path = window.location.pathname.replace(/\/search/, '');

    this.customPages = {};

    this.sidebarGroups = [];

    this.paths = {
      sg: [
        { name: 'Everywhere', pattern: '.*' },
        { name: 'Giveaways', pattern: `^/($|giveaways)` },
        { name: 'Browse Giveaways', pattern: `^/($|giveaways($|/search))` },
        { name: 'Browse Giveaways - All', pattern: `^/($|giveaways($|/search\\?(?!type)))` },
        { name: 'Browse Giveaways - Wishlist', pattern: `^/giveaways/search\\?type=wishlist` },
        { name: 'Browse Giveaways - Recommended', pattern: `^/giveaways/search\\?type=recommended` },
        { name: 'Browse Giveaways - Group', pattern: `^/giveaways/search\\?type=group` },
        { name: 'Browse Giveaways - New', pattern: `^/giveaways/search\\?type=new` },
        { name: 'Community Wishlist', pattern: '^/giveaways/wishlist' },
        { name: 'My Giveaways - New', pattern: '^/giveaways/new' },
        { name: 'My Giveaways - Created', pattern: '^/giveaways/created' },
        { name: 'My Giveaways - Entered', pattern: '^/giveaways/entered' },
        { name: 'My Giveaways - Won', pattern: '^/giveaways/won' },
        { name: 'Archive', pattern: '^/archive' },
        { name: 'Archive - All', pattern: `^/archive($|/search)` },
        { name: 'Archive - Coming Soon', pattern: '^/archive/coming-soon' },
        { name: 'Archive - Open', pattern: '^/archive/open' },
        { name: 'Archive - Closed', pattern: '^/archive/closed' },
        { name: 'Archive - Deleted', pattern: '^/archive/deleted' },
        { name: 'Bundle Games', pattern: '^/bundle-games' },
        { name: 'Giveaway', pattern: '^/giveaway/' },
        { name: 'Giveaway - Comments', pattern: `^/giveaway/.+?/[^/]+($|/search)` },
        { name: 'Giveaway - Entries', pattern: `^/giveaway/.+?/[^/]+/entries` },
        { name: 'Giveaway - Winners', pattern: `^/giveaway/.+?/[^/]+/winners` },
        { name: 'Giveaway - Groups', pattern: `^/giveaway/.+?/[^/]+/groups` },
        { name: 'Giveaway - Region Restrictions', pattern: `^/giveaway/.{5}/[A-Za-z0-9-]+/region-restrictions` },
        { name: 'Group', pattern: '^/group/' },
        { name: 'Group - Giveaways', pattern: `^/group/.+?/[^/]+($|/search)` },
        { name: 'Group - Users', pattern: `^/group/.+?/[^/]+/users` },
        { name: 'Group - Stats', pattern: `^/group/.+?/[^/]+/stats` },
        { name: 'Group - Wishlist', pattern: `^/group/.+?/[^/]+/wishlist` },
        { name: 'Discussions', pattern: '^/discussions' },
        { name: 'Discussions - All', pattern: `^/discussions($|/search)` },
        { name: 'Discussions - Announcements', pattern: '^/discussions/announcements' },
        { name: 'Discussions - Bugs / Suggestions', pattern: '^/discussions/bugs-suggestions' },
        { name: 'Discussions - Deals', pattern: '^/discussions/deals' },
        { name: 'Discussions - General', pattern: '^/discussions/general' },
        { name: 'Discussions - Group Recruitment', pattern: '^/discussions/group-recruitment' },
        { name: 'Discussions - Let\'s Play Together', pattern: '^/discussions/lets-play-together' },
        { name: 'Discussions - Off-Topic', pattern: '^/discussions/off-topic' },
        { name: 'Discussions - Puzzles', pattern: '^/discussions/puzzles' },
        { name: 'Discussions - Uncategorized', pattern: '^/discussions/uncategorized' },
        { name: 'My Discussions - New', pattern: '^/discussions/new' },
        { name: 'My Discussions - Edit', pattern: '^/discussions/edit' },
        { name: 'My Discussions - Created', pattern: '^/discussions/created' },
        { name: 'Discussion', pattern: '^/discussion/' },
        { name: 'Tickets', pattern: '^/support/tickets' },
        { name: 'Tickets - All', pattern: `^/support/tickets($|/search)` },
        { name: 'Tickets - Change Giveaway Game', pattern: '^/support/tickets/change-giveaway-game' },
        { name: 'Tickets - Delete Giveaway', pattern: '^/support/tickets/delete-giveaway' },
        { name: 'Tickets - Other', pattern: '^/support/tickets/other' },
        { name: 'Tickets - Request New Winner', pattern: '^/support/tickets/request-new-winner' },
        { name: 'Tickets - Unsuspend Request', pattern: '^/support/tickets/unsuspend-request' },
        { name: 'Tickets - User Report', pattern: '^/support/tickets/user-report' },
        { name: 'Ticket', pattern: '^/support/ticket/' },
        { name: 'User', pattern: '^/user' },
        { name: 'User - Giveaways - Sent', pattern: `^/user($|/search)` },
        { name: 'User - Giveaways - Won', pattern: '^/user/giveaways/won' },
        { name: 'Messages', pattern: '^/messages' },
        { name: 'Messages - All', pattern: `^/messages($|/search)` },
        { name: 'Messages - Giveaways', pattern: '^/messages/giveaways' },
        { name: 'Messages - Discussions', pattern: '^/messages/discussions' },
        { name: 'Messages - Tickets', pattern: '^/messages/tickets' },
        { name: 'Manage - Whitelist', pattern: '^/account/manage/whitelist' },
        { name: 'Manage - Blacklist', pattern: '^/account/manage/blacklist' },
        { name: 'Steam - Games', pattern: '^/account/steam/games' },
        { name: 'Steam - Groups', pattern: '^/account/steam/groups' },
        { name: 'Steam - Wishlist', pattern: '^/account/steam/wishlist' },
        { name: 'About - Brand Assets', pattern: '^/about/brand-assets' },
        { name: 'About - Comment Formatting', pattern: '^/about/comment-formatting' },
        { name: 'About - FAQ', pattern: '^/about/faq' },
        { name: 'About - Guidelines', pattern: '^/about/guidelines' },
        { name: 'Legal - Privacy Policy', pattern: '^/legal/privacy-policy' },
        { name: 'Legal - Cookie Policy', pattern: '^/legal/cookie-policy' },
        { name: 'Legal - Terms Of Service', pattern: '^/legal/terms-of-service' },
        { name: 'Account', pattern: '^/account' },
        { name: 'Settings - Profile', pattern: '^/account/settings/profile' },
        { name: 'Settings - Patreon', pattern: '^/account/settings/patreon' },
        { name: 'Settings - Giveaways', pattern: '^/account/settings/giveaways' },
        { name: 'Settings - Giveaways - Filters', pattern: '^/account/settings/giveaways/filters' },
        { name: 'Settings - Email Notifications', pattern: '^/account/settings/email-notifications' },
        { name: 'Settings - Referrals', pattern: '^/account/settings/referrals' },
        { name: 'Privacy - Delete Account', pattern: '^/account/privacy/delete-account' },
        { name: 'Stats - Personal - Community', pattern: '^/stats/personal/community' },
        { name: 'Stats - Personal - Steam', pattern: '^/stats/personal/steam' },
        { name: 'Stats - Community - Giveaways', pattern: '^/stats/community/giveaways' },
        { name: 'Stats - Community - Discussions', pattern: '^/stats/community/discussions' },
        { name: 'Stats - Community - Comments', pattern: '^/stats/community/comments' },
        { name: 'Stats - Community - Support', pattern: '^/stats/community/support' },
        { name: 'Stats - Community - Users', pattern: '^/stats/community/users' },
        { name: 'Stats - Steam - Games', pattern: '^/stats/steam/games' },
        { name: 'ESGST - Settings', pattern: `^/account/settings/profile\\?esgst=settings` },
        { name: 'ESGST - Sync', pattern: `^/account/settings/profile\\?esgst=sync` },
        { name: 'ESGST - Backup', pattern: `^/account/settings/profile\\?esgst=backup` },
        { name: 'ESGST - Restore', pattern: `^/account/settings/profile\\?esgst=restore` },
        { name: 'ESGST - Delete', pattern: `^/account/settings/profile\\?esgst=delete` },
        { name: 'ESGST - Clean', pattern: `^/account/settings/profile\\?esgst=clean` },
        { name: 'ESGST - Data Management', pattern: `^/account/settings/profile\\?esgst=data-management` },
        { name: 'ESGST - Archive Searcher', pattern: `^/account/settings/profile\\?esgst=as` },
        { name: 'ESGST - Comment / Entry Checker', pattern: `^/account/settings/profile\\?esgst=cec` },
        { name: 'ESGST - Giveaway Bookmarks', pattern: `^/account/settings/profile\\?esgst=gb` },
        { name: 'ESGST - Giveaway Encryptor / Decryptor', pattern: `^/account/settings/profile\\?esgst=ged` },
        { name: 'ESGST - Giveaway Extractor', pattern: `^/account/settings/profile\\?esgst=ge` },
        { name: 'ESGST - Group Library / Wishlist Checker', pattern: `^/account/settings/profile\\?esgst=glwc` }
      ],
      st: [
        { name: 'Everywhere', pattern: '.*' },
        { name: 'Trades', pattern: `^/($|trades)` },
        { name: 'Browse Trades', pattern: `^/($|trades($|/search))` },
        { name: 'My Trades - New', pattern: '^/trades/new' },
        { name: 'My Trades - Created', pattern: `^/trades/search\\?user=%steamId%` },
        { name: 'Trade', pattern: '^/trade/' },
        { name: 'Vote', pattern: '^/vote/' },
        { name: 'Messages', pattern: '^/messages' },
        { name: 'User', pattern: '^/user' },
        { name: 'Reviews', pattern: '^/reviews' },
        { name: 'Comments', pattern: '^/comments' },
        { name: 'Settings', pattern: '^/settings' },
        { name: 'About - Comment Formatting', pattern: '^/about/comment-formatting' },
        { name: 'About - Guidelines', pattern: '^/about/guidelines' },
        { name: 'Legal - Privacy Policy', pattern: '^/legal/privacy-policy' },
        { name: 'Legal - Cookie Policy', pattern: '^/legal/cookie-policy' },
        { name: 'Legal - Terms Of Service', pattern: '^/legal/terms-of-service' }
      ],
      sgtools: [
        { name: 'Everywhere', pattern: '.*' }
      ]
    };
    this.formatDistanceLocale = {
      formatDistance: (token, count) => {
        switch (token) {
          case 'xSeconds':
            return `${count}s`;
          case 'xMinutes':
            return `${count}m`;
          case 'xHours':
            return `${count}h`;
          case 'xDays':
            return `${count}d`;
          case 'xMonths':
            return `${count}mo`;
          case 'xYears':
            return `${count}y`;
        }
      }
    };
    this.newGiveawayDateFormat = `MMM d, yyyy h:mm a`;
    this.triggerFunctions = {
      onBeforeCommentSubmit: []
    };

    for (const key in this.triggerFunctions) {
      if (!this.triggerFunctions.hasOwnProperty(key)) {
        return;
      }
      this[key] = this.triggerFunction.bind(this, key);
    }

    this.documentEvents = {
      click: null,
      keydown: null
    };

    this.windowEvents = {};

    /**
     * @property {string} level_min
     * @property {string} level_max
     * @property {string} entry_min
     * @property {string} entry_max
     * @property {string} copy_min
     * @property {string} copy_max
     * @property {string} point_min
     * @property {string} point_max
     * @property {string} release_date_min
     * @property {string} release_date_max
     * @property {string} region_restricted
     */
    this.parameters = {};

    /**
     * @property {Parsedown} markdownParser
     */
    this.markdownParser = null;

    this.sg = null;
    this.st = null;

    // noinspection SpellCheckingInspection
    this.icon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqv8DCbP/Hgeq+CQIrf8iCK3/Igit/yIIrf8iB6//Iwit9x8Aqv8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKr0GAa2/c0DvfzfA7f83QO3/N0Dt/zdA7f83QO+/d4Gs/3OAKP1GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm/xQFs/n2Bcf//wW///8FwP//BcD//wW///8Fx///BbP69gC2/xUAAAAAAAAAAAAAAAAA/1UDFptOFxSZMxkLpJktAq720QW1+ugEsfvjA7b92wO2/dsEsfvjBbX66Aau/dEoiO4tUlLWGU5k3hdVVf8DEJxKHxWqT8cVrU7uE6VN0guqny0Apv8XAJfQGwBAVywAQFcsAJfQGwCx/xcogugtS2Lk0lBl6u5Qae7ISmPeHxagSSMVr07jF7lV/xOiSu0brgATAAAAAAAAAA8AAAC/AAAAwAAAABAAAAAAYznjEkth4OxWb/3/T2jv40lf4iMXnksiEq1O3RayUv8UpEnkEo0+HQAAABkAAABBAAAA8QAAAPEAAABBAAAAGUBSvxxOYeDjU2v0/05m7d1LYuEiF55LIhKtTt0Ws1L/FahN2gU1FTAAAADAAAAA7AAAAP0AAAD9AAAA7AAAAMAVG0owUGPm2lNr9P9OZu3dS2LhIheeSyISrU7dFrNS/xWoTdoFNRswAAAAvwAAAOsAAAD9AAAA/QAAAOsAAADAFRtKMFBj6NpTa/T/Tmbt3Uti4SIXnksiEq1O3RayUv8UpEnkEo0+HQAAABgAAABAAAAA8QAAAPEAAABBAAAAGT5PuR1OYeDjU2v0/05m7d1LYuEiFqBJIxWuT+QXuVX/E6JL7QC8XhMAAAAAAAAADwAAAL8AAAC/AAAAEAAAAAAOR/8SSWLh7FZv/f9PaO/jSV/iIxCUSh8Vrk7HFqxN7ROlS9JskzMt1XULGK12EhxGLgYsRy8GK612EhzVgAsYgmxxLU1i39JNZ+vtT2fwx0pj1h8AqlUDF65GFgqZUhlsiC0txH0T0s5/EujJgBPkz4QR28+EEdvJgBPkzn8Q6Md+E9KLdHosM1LWGUZo6BZVVf8DAAAAAAAAAAAAAAAA/2YAFMl9EvbgjRb/14gV/9eIFf/XiBX/14gV/9+NFv/KgBD254YAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL91FRjKgRHN1IgU3s+EEt3PhBLdz4QS3c+EEt3UiBTezYMRzcJ6FBkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqgADxIARHr18FiO8eA8ivHgPIrx4DyK8eA8ivXwPI8SAER7/VQADAAAAAAAAAAAAAAAA78cAAPA3AAD4FwAABCAAADGOAAAE+AAAkBEAAJ55AACYOQAAlgEAAER4AAAXaAAATnoAAPgXAAD0JwAA69cAAA==`;
    // noinspection SpellCheckingInspection
    this.sgIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIUAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAACFAAAAAAAAAAAAAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAP8AAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAAAAAAAAAAACFAAAA+QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AADAAwAAwAMAAMfjAADP8wAAz/MAAM/zAADP8wAAz/MAAM/zAADH4wAAwAMAAMADAAD//wAA//8AAA==`;
    // noinspection SpellCheckingInspection
    this.stIcon = `data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SgWw+ucFsPrkBbD6SgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWw+uYFsPr/BbD6/wWw+ucAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFsPrmBbD6/wWw+v8FsPrmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbD6SQWw+uYFsPrmBbD6SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFKRLShSkS+cUpEvkFKRLSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4EpMYuDnTGLg5Exi4EoAAAAAAAAAABSkS+YUpEv/FKRL/xSkS+cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYuDmTGLg/0xi4P9MYuDnAAAAAAAAAAAUpEvmFKRL/xSkS/8UpEvmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGLg5kxi4P9MYuD/TGLg5gAAAAAAAAAAFKRLSRSkS+YUpEvmFKRLSQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExi4ElMYuDmTGLg5kxi4EkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0rGfRPnxn0T5MZ9E0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGfRPmxn0T/8Z9E//GfRPnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxn0T5sZ9E//GfRP/xn0T5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMZ9E0nGfRPmxn0T5sZ9E0kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPw/AAD8PwAA/D8AAPw/AAD//wAAh+EAAIfhAACH4QAAh+EAAP//AAD8PwAA/D8AAPw/AAD8PwAA//8AAA==`;
    this.attachedImages = [];
    this.popups = [];
    this.openPopups = 0;
    this.elgbCache = {};
    this.originalHash = window.location.hash;
    this.userPath = false;
    this.groupPath = false;
    this.regionsPath = false;
    this.groupWishlistPath = false;
    this.mainPath = false;
    this.winnersPath = false;
    this.giveawaysPath = false;
    this.giveawayCommentsPath = false;
    this.discussionsTicketsPath = false;
    this.ticketsPath = false;
    this.tradesPath = false;
    this.discussionsTicketsTradesPath = false;
    this.discussionTicketTradeCommentsPath = false;
    this.archivePath = false;
    this.profilePath = false;
    this.giveawayPath = false;
    this.discussionPath = false;
    this.ticketPath = false;
    this.tradePath = false;
    this.discussionsPath = false;
    this.newDiscussionPath = false;
    this.editDiscussionPath = false;
    this.createdDiscussionsPath = false;
    this.newGiveawayPath = false;
    this.newTicketPath = false;
    this.wishlistPath = false;
    this.createdPath = false;
    this.wonPath = false;
    this.enteredPath = false;
    this.commentsPath = false;
    this.aboutPath = false;
    this.whitelistPath = false;
    this.blacklistPath = false;
    this.headerSize = 0;
    this.mainPageHeadingSize = 0;
    this.footerSize = 0;
    this.pageTop = 0;
    this.commentsTop = 0;
    this.apPopouts = {};
    this.tsTables = [];
    this.currentUsers = {};
    this.currentGroups = {};
    this.mmWbcUsers = [];
    this.gameFeatures = [];
    this.groupFeatures = [];
    this.giveawayFeatures = [];
    this.commentFeatures = [];
    this.discussionFeatures = [];
    this.tradeFeatures = [];
    this.profileFeatures = [];
    this.userFeatures = [];
    this.endlessFeatures = [];
    this.games = {};

    this.minimizeList = null;

    this.sidebar = null;

    /** @type {string} */
    this.version = undefined;

    this.storage = undefined;

    this.settings = undefined;

    this.groups = null;

    this.features = null;

    /** @type {boolean} */
    this.firstInstall = undefined;

    this.giveaways = null;

    this.mainContext = null;

    this.pageOuterWrap = null;

    this.leftButtons = null;

    this.rightButtons = null;

    this.hidingGame = undefined;

    this.mainPageHeading = null;

    /** @type {string} */
    this.pageOuterWrapClass = '';

    /** @type {string} */
    this.pageHeadingClass = '';

    /** @type {string} */
    this.pageHeadingBreadcrumbsClass = '';

    this.replyBox = null;

    /** @type {string} */
    this.cancelButtonClass = '';

    /** @type {string} */
    this.paginationNavigationClass = '';

    /** @type {string} */
    this.hiddenClass = '';

    /** @type {string} */
    this.selectedClass = '';

    /** @type {string} */
    this.originalUrl = '';

    this.favicon = null;

    /** @type {string} */
    this.originalTitle = '';

    /** @type {string} */
    this.searchUrl = '';

    this.pagination = null;

    this.featuredContainer = null;

    this.paginationNavigation = null;

    this.enterGiveawayButton = null;

    this.leaveGiveawayButton = null;

    this.activeDiscussions = null;

    this.pinnedGiveaways = null;

    /** @type {boolean} */
    this.addNoCvGames = undefined;

    this.discussions = null;

    this.tickets = null;

    this.trades = null;

    this.users = null;

    /** @type {boolean} */
    this.busy = false;

    this.showChangelog = null;

    /** @type {"sg"|"st"} */
    this.name = undefined;

    this.style = null;

    this.customThemeElement = null;

    this.theme = null;

    this.ustButton = null;

    this.modules = null;

    this.decryptedGiveaways = null;

    this.gfPopup = null;

    this.cfPopup = null;

    this.gc_categories_ids = ['gc_gi', 'gc_r', 'gc_hltb', 'gc_ocv', 'gc_fcv', 'gc_rcv', 'gc_ncv', 'gc_h', 'gc_i', 'gc_o', 'gc_w', 'gc_f', 'gc_pw', 'gc_a', 'gc_bd', 'gc_bvg', 'gc_sp', 'gc_mp', 'gc_sc', 'gc_tc', 'gc_l', 'gc_m', 'gc_ea', 'gc_lg', 'gc_rm', 'gc_dlc', 'gc_p', 'gc_rd', 'gc_g'];

    this.giveawayErrorButton = null;

    this.gcToFetch = null;

    this.rerolls = null;

    this.lastPageLink = null;

    this.stopEs = false;

    this.lastPage = null;

    this.lpvStyle = null;

    this.pvStyle = null;

    this.toDismiss = [];

    this.draggable = {};

    this.modules = modules;

    for (const key in this.modules) {
      if (this.modules.hasOwnProperty(key) && this.modules[key].setEsgst) {
        this.modules[key].setEsgst.call(this.modules[key], this);
      }
    }
    this.documentEvents.click = new Set;
    this.documentEvents.keydown = new Set;

    this.scopes = {};
    this.currentScope = null;
    this.scopeHistory = [];
    this.modules.common.addScope('main', document);
    this.modules.common.setCurrentScope('main');

    this.parameters = this.modules.common.getParameters();

    this.locationHref = window.location.href;

    this.markdownParser = new Parsedown;
    this.sg = window.location.hostname.match(/www.steamgifts.com/);
    this.st = window.location.hostname.match(/www.steamtrades.com/);
    this.elgbCache = JSON.parse(LocalStorage.get('elgbCache', `{"descriptions": {}, "timestamp": ${Date.now()}}`));

    this.userPath = window.location.pathname.match(/^\/user\//);
    this.userWonPath = this.userPath && window.location.pathname.match(/\/giveaways\/won/);
    this.groupPath = window.location.pathname.match(/^\/group\//);
    this.regionsPath = window.location.pathname.match(/^\/regions\//);
    this.groupWishlistPath = window.location.pathname.match(/^\/group\/(.*?)\/wishlist/);
    this.mainPath = window.location.pathname.match(/^\/$/);
    this.winnersPath = window.location.pathname.match(/^\/giveaway\/.+\/winners/);
    this.giveawaysPath = this.locationHref.match(/steamgifts.com($|\/$|\/giveaways(?!.*\/(new|wishlist|created|entered|won)))/);
    this.giveawayCommentsPath = window.location.pathname.match(/^\/giveaway\/(?!.+\/(entries|winners|groups|region-restrictions))/);
    this.discussionsTicketsPath = window.location.pathname.match(/^\/(discussions|support\/tickets)/);
    this.ticketsPath = window.location.pathname.match(/^\/support\/tickets/);
    this.tradesPath = this.locationHref.match(/steamtrades.com($|\/$|\/trades(?!\/(new|edit)))/);
    this.discussionsTicketsTradesPath = this.locationHref.match(/steamtrades.com($|\/$)/) || window.location.pathname.match(/^\/(discussions|support\/tickets|trades)/);
    this.discussionTicketTradeCommentsPath = window.location.pathname.match(/^\/(discussion|support\/ticket|trade)\//);
    this.archivePath = window.location.pathname.match(/^\/archive/);
    this.profilePath = window.location.pathname.match(/^\/account\/settings\/profile/);
    this.giveawayPath = window.location.pathname.match(/^\/giveaway\//);
    this.discussionPath = window.location.pathname.match(/^\/discussion\//);
    this.ticketPath = window.location.pathname.match(/^\/support\/ticket\//);
    this.tradePath = window.location.pathname.match(/^\/trade\//);
    this.discussionsPath = window.location.pathname.match(/^\/discussions(?!\/(new|edit))/);
    this.newDiscussionPath = window.location.pathname.match(/^\/discussions\/new/);
    this.editDiscussionPath = window.location.pathname.match(/^\/discussions\/edit/);
    this.newTradePath = window.location.pathname.match(/^\/trades\/new/);
    this.editTradePath = window.location.pathname.match(/^\/trades\/edit/);
    this.createdDiscussionsPath = window.location.pathname.match(/^\/discussions\/created/);
    this.newGiveawayPath = window.location.pathname.match(/^\/giveaways\/new/);
    this.newTicketPath = window.location.pathname.match(/^\/support\/tickets\/new/);
    this.wishlistPath = window.location.pathname.match(/^\/giveaways\/wishlist/);
    this.createdPath = window.location.pathname.match(/^\/giveaways\/created/);
    this.wonPath = window.location.pathname.match(/^\/giveaways\/won/);
    this.enteredPath = window.location.pathname.match(/^\/giveaways\/entered/);
    this.commentsPath = window.location.pathname.match(/^\/(giveaway\/(?!.*\/(entries|winners|groups|region-restrictions))|discussion\/|support\/ticket\/|trade\/)/);
    this.aboutPath = window.location.pathname.match(/^\/(about|legal)/);
    this.whitelistPath = window.location.pathname.match(/^\/account\/manage\/whitelist/);
    this.blacklistPath = window.location.pathname.match(/^\/account\/manage\/blacklist/);
    this.appList = undefined;
    this.pageHeadings = undefined;
    this.hasAddedFilterContainer = undefined;
  }

  async triggerFunction(key, ...args) {
    for (const func of this.triggerFunctions[key]) {
      await func(...args);
    }
  }
}

const esgst = new Esgst();

Shared.add({ esgst, modules });

export { esgst };

