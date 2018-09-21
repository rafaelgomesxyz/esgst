import Common from './Common';
import GiveawaysBlacklistGiveawayLoader from "./Giveaways/BlacklistGiveawayLoader";
import GeneralNarrowSidebar from "./General/NarrowSidebar";
import GeneralHiddenCommunityPoll from "./General/HiddenCommunityPoll";
import DiscussionsOldActiveDiscussionsDesign from "./Discussions/OldActiveDiscussionsDesign";
import DiscussionsActiveDiscussionsOnTopSidebar from "./Discussions/ActiveDiscussionsOnTopSidebar";
import GeneralElementFilters from "./General/ElementFilters";
import Giveaways_addToStorage from "./Giveaways_addToStorage";
import GeneralAttachedImageCarousel from "./General/AttachedImageCarousel";
import GiveawaysArchiveSearcher from "./Giveaways/ArchiveSearcher";
import GeneralCakeDayReminder from "./General/CakeDayReminder";
import GiveawaysCommentEntryChecker from "./Giveaways/CommentEntryChecker";
import DiscussionsCloseOpenDiscussionButton from "./Discussions/CloseOpenDiscussionButton";
import CommentsCommentReverser from "./Comments/CommentReverser";
import CommentsCommentSearcher from "./Comments/CommentSearcher";
import CommentsCommentTracker from "./Comments/CommentTracker";
import GiveawaysCommunityWishlistSearchLink from "./Giveaways/CommunityWishlistSearchLink";
import DiscussionsDiscussionEditDetector from "./Discussions/DiscussionEditDetector";
import DiscussionsDiscussionHighlighter from "./Discussions/DiscussionHighlighter";
import DiscussionsDiscussionsSorter from "./Discussions/DiscussionsSorter";
import GamesEnteredGameHighlighter from "./Games/EnteredGameHighlighter";
import GiveawaysEntryTracker from "./Giveaways/EntryTracker";
import CommentsCommentHistory from "./Comments/CommentHistory";
import GeneralCustomHeaderFooterLinks from "./General/CustomHeaderFooterLinks";
import GeneralFixedFooter from "./General/FixedFooter";
import GeneralFixedHeader from "./General/FixedHeader";
import GeneralFixedMainPageHeading from "./General/FixedMainPageHeading";
import CommentsCollapseExpandReplyButton from "./Comments/CollapseExpandReplyButton";
import CommentsReplyBoxOnTop from "./Comments/ReplyBoxOnTop";
import GeneralFixedSidebar from "./General/FixedSidebar";
import GiveawaysGiveawaysSorter from "./Giveaways/GiveawaysSorter";
import GiveawaysGiveawayBookmarks from "./Giveaways/GiveawayBookmarks";
import GamesGameCategories from "./Games/GameCategories";
import GiveawaysGiveawayCopyHighlighter from "./Giveaways/GiveawayCopyHighlighter";
import GeneralGiveawayDiscussionTicketTradeTracker from "./General/GiveawayDiscussionTicketTradeTracker";
import GiveawaysGiveawayExtractor from './Giveaways/GiveawayExtractor';
import GiveawaysGiveawayEncrypterDecrypter from './Giveaways/GiveawayEncrypterDecrypter';
import GiveawaysGiveawayErrorSearchLinks from './Giveaways/GiveawayErrorSearchLinks';
import CommentsCommentFilters from './Comments/CommentFilters';
import DiscussionsDiscussionFilters from './Discussions/DiscussionFilters';
import GiveawaysGiveawayFilters from './Giveaways/GiveawayFilters';
import GroupsGroupLibraryWishlistChecker from './Groups/GroupLibraryWishlistChecker';
import GiveawaysGiveawayRecreator from './Giveaways/GiveawayRecreator';
import GroupsGroupStats from './Groups/GroupStats';
import DiscussionsDiscussionTags from './Discussions/DiscussionTags';
import GamesGameTags from './Games/GameTags';
import GroupsGroupTags from './Groups/GroupTags';
import GiveawaysGiveawayTemplates from './Giveaways/GiveawayTemplates';
import GiveawaysGridView from './Giveaways/GridView';
import GeneralHiddenBlacklistStats from './General/HiddenBlacklistStats';
import GiveawaysHiddenGamesEnterButtonDisabler from './Giveaways/HiddenGamesEnterButtonDisabler';
import GiveawaysHiddenGameRemover from './Giveaways/HiddenGameRemover';
import GeneralHeaderRefresher from './General/HeaderRefresher';
import TradesHaveWantListChecker from './Trades/HaveWantListChecker';
import GeneralLastPageLink from './General/LastPageLink';
import GeneralLevelProgressVisualizer from './General/LevelProgressVisualizer';
import GiveawaysMultipleGiveawayCreator from './Giveaways/MultipleGiveawayCreator';
import GeneralMultiManager from './General/MultiManager';
import DiscussionsMainPostPopup from './Discussions/MainPostPopup';
import DiscussionsMainPostSkipper from './Discussions/MainPostSkipper';
import GeneralNotificationMerger from './General/NotificationMerger';
import GiveawaysNextPreviousTrainHotkeys from './Giveaways/NextPreviousTrainHotkeys';
import GeneralPaginationNavigationOnTop from './General/PaginationNavigationOnTop';
import GiveawaysPinnedGiveawaysButton from './Giveaways/PinnedGiveawaysButton';
import DiscussionsPuzzleMarker from './Discussions/PuzzleMarker';
import GeneralPointsVisualizer from './General/PointsVisualizer';
import GiveawaysQuickGiveawaySearch from './Giveaways/QuickGiveawaySearch';
import GiveawaysAdvancedGiveawaySearch from './Giveaways/AdvancedGiveawaySearch';
import GeneralSearchMagnifyingGlassButton from './General/SearchMagnifyingGlassButton';
import DiscussionsRefreshActiveDiscussionsButton from './Discussions/RefreshActiveDiscussionsButton';
import CommentsReplyBoxPopup from './Comments/ReplyBoxPopup';
import CommentsCommentFormattingHelper from './Comments/CommentFormattingHelper';
import GiveawaysRealCVCalculator from './Giveaways/RealCVCalculator';
import GiveawaysStickiedGiveawayCountries from './Giveaways/StickiedGiveawayCountries';
import GeneralShortcutKeys from './General/ShortcutKeys';
import GiveawaysSentKeySearcher from './Giveaways/SentKeySearcher';
import GeneralScrollToBottomButton from './General/ScrollToBottomButton';
import GeneralScrollToTopButton from './General/ScrollToTopButton';
import TradesTradeBumper from './Trades/TradeBumper';
import GeneralTimeToPointCapCalculator from './General/TimeToPointCapCalculator';
import GiveawaysUnsentGiftSender from './Giveaways/UnsentGiftSender';
import UsersUserSuspensionTracker from './Users/UserSuspensionTracker';
import UsersWhitelistBlacklistChecker from './Users/WhitelistBlacklistChecker';
import UsersWhitelistBlacklistHighlighter from './Users/WhitelistBlacklistHighlighter';
import UsersWhitelistBlacklistSorter from './Users/WhitelistBlacklistSorter';
import UsersWhitelistBlacklistManager from './Users/WhitelistBlacklistManager';
import GeneralURLRedirector from './General/URLRedirector';
import UsersUserTags from './Users/UserTags';
import GeneralAccurateTimestamp from './General/AccurateTimestamp';
import GeneralEmbeddedVideos from './General/EmbeddedVideos';
import GeneralImageBorders from './General/ImageBorders';
import GeneralVisibleAttachedImages from './General/VisibleAttachedImages';
import GeneralAttachedImageLoader from './General/AttachedImageLoader';
import GiveawaysCreatedEnteredWonGiveawayDetails from './Giveaways/CreatedEnteredWonGiveawayDetails';
import GiveawaysDeleteKeyConfirmation from './Giveaways/DeleteKeyConfirmation';
import GiveawaysGiveawayCountryLoader from './Giveaways/GiveawayCountryLoader';
import GiveawaysGiveawayWinningChance from './Giveaways/GiveawayWinningChance';
import GiveawaysGiveawayWinningRatio from './Giveaways/GiveawayWinningRatio';
import GiveawaysGiveawayPointsToWin from './Giveaways/GiveawayPointsToWin';
import GiveawaysGiveawayEndTimeHighlighter from './Giveaways/GiveawayEndTimeHighlighter';
import GiveawaysSteamActivationLinks from './Giveaways/SteamActivationLinks';
import GiveawaysUnfadedEnteredGiveaway from './Giveaways/UnfadedEnteredGiveaway';
import GiveawaysStickiedGiveawayGroups from './Giveaways/StickiedGiveawayGroups';
import CommentsMultiReply from './Comments/MultiReply';
import CommentsReplyFromInbox from './Comments/ReplyFromInbox';
import CommentsReplyMentionLink from './Comments/ReplyMentionLink';
import UsersInboxWinnerHighlighter from './Users/InboxWinnerHighlighter';
import UsersUserStats from './Users/UserStats';
import GroupsGroupHighlighter from './Groups/GroupHighlighter';
import GeneralAvatarPopout from './General/AvatarPopout';
import GiveawaysGiveawayPopup from './Giveaways/GiveawayPopup';
import GiveawaysEnterLeaveGiveawayButton from './Giveaways/EnterLeaveGiveawayButton';
import GiveawaysIsThereAnyDealInfo from './Giveaways/IsThereAnyDealInfo';
import GiveawaysUnhideGiveawayButton from './Giveaways/UnhideGiveawayButton';
import GiveawaysOneClickHideGiveawayButton from './Giveaways/OneClickHideGiveawayButton';
import GiveawaysGiveawayWinnersLink from './Giveaways/GiveawayWinnersLink';
import GiveawaysTimeToEnterCalculator from './Giveaways/TimeToEnterCalculator';
import GiveawaysGiveawayGroupLoader from './Giveaways/GiveawayGroupLoader';
import CommentsReceivedReplyBoxPopup from './Comments/ReceivedReplyBoxPopup';
import Giveaways from './Giveaways';
import Discussions from './Discussions';
import DiscussionPanels from './DiscussionPanels';
import Comments from './Comments';
import Games from './Games';
import Groups from './Groups';
import Users from './Users';
import GeneralTableSorter from './General/TableSorter';
import GeneralSameTabOpener from './General/SameTabOpener';
import UsersUsernameHistory from './Users/UsernameHistory';
import UsersUserNotes from './Users/UserNotes';
import UsersUserFilters from './Users/UserFilters';
import UsersSharedGroupChecker from './Users/SharedGroupChecker';
import UsersRealWonSentCVLink from './Users/RealWonSentCVLink';
import UsersUserGiveawayData from './Users/UserGiveawayData';
import UsersNotActivatedMultipleWinChecker from './Users/NotActivatedMultipleWinChecker';
import UsersNotReceivedFinder from './Users/NotReceivedFinder';
import UsersSentWonRatio from './Users/SentWonRatio';
import UsersVisibleRealCV from './Users/VisibleRealCV';
import UsersLevelUpCalculator from './Users/LevelUpCalculator';
import UsersSteamGiftsProfileButton from './Users/SteamGiftsProfileButton';
import UsersSteamTradesProfileButton from './Users/SteamTradesProfileButton';
import UsersProfileLinks from './Users/ProfileLinks';
import Profile from './Profile';
import EndlessLoad from './EndlessLoad';
import GeneralQuickInboxView from './General/QuickInboxView';
import GeneralEndlessScrolling from './General/EndlessScrolling';
import Tags from './Tags';

let
  common = new Common,
  giveawaysBlacklistGiveawayLoader = new GiveawaysBlacklistGiveawayLoader,
  generalNarrowSidebar = new GeneralNarrowSidebar,
  generalHiddenCommunityPoll = new GeneralHiddenCommunityPoll,
  discussionsOldActiveDiscussionsDesign = new DiscussionsOldActiveDiscussionsDesign,
  discussionsActiveDiscussionsOnTopSidebar = new DiscussionsActiveDiscussionsOnTopSidebar,
  generalElementFilters = new GeneralElementFilters,
  giveaways_addToStorage = new Giveaways_addToStorage,
  generalAttachedImageCarousel = new GeneralAttachedImageCarousel,
  giveawaysArchiveSearcher = new GiveawaysArchiveSearcher,
  generalCakeDayReminder = new GeneralCakeDayReminder,
  giveawaysCommentEntryChecker = new GiveawaysCommentEntryChecker,
  discussionsCloseOpenDiscussionButton = new DiscussionsCloseOpenDiscussionButton,
  commentsCommentReverser = new CommentsCommentReverser,
  commentsCommentSearcher = new CommentsCommentSearcher,
  commentsCommentTracker = new CommentsCommentTracker,
  giveawaysCommunityWishlistSearchLink = new GiveawaysCommunityWishlistSearchLink,
  discussionsDiscussionEditDetector = new DiscussionsDiscussionEditDetector,
  discussionsDiscussionHighlighter = new DiscussionsDiscussionHighlighter,
  discussionsDiscussionsSorter = new DiscussionsDiscussionsSorter,
  gamesEnteredGameHighlighter = new GamesEnteredGameHighlighter,
  giveawaysEntryTracker = new GiveawaysEntryTracker,
  commentsCommentHistory = new CommentsCommentHistory,
  generalCustomHeaderFooterLinks = new GeneralCustomHeaderFooterLinks,
  generalFixedFooter = new GeneralFixedFooter,
  generalFixedHeader = new GeneralFixedHeader,
  generalFixedMainPageHeading = new GeneralFixedMainPageHeading,
  commentsCollapseExpandReplyButton = new CommentsCollapseExpandReplyButton,
  commentsReplyBoxOnTop = new CommentsReplyBoxOnTop,
  generalFixedSidebar = new GeneralFixedSidebar,
  giveawaysGiveawaysSorter = new GiveawaysGiveawaysSorter,
  giveawaysGiveawayBookmarks = new GiveawaysGiveawayBookmarks,
  gamesGameCategories = new GamesGameCategories,
  giveawaysGiveawayCopyHighlighter = new GiveawaysGiveawayCopyHighlighter,
  generalGiveawayDiscussionTicketTradeTracker = new GeneralGiveawayDiscussionTicketTradeTracker,
  giveawaysGiveawayExtractor = new GiveawaysGiveawayExtractor,
  giveawaysGiveawayEncrypterDecrypter = new GiveawaysGiveawayEncrypterDecrypter,
  giveawaysGiveawayErrorSearchLinks = new GiveawaysGiveawayErrorSearchLinks,
  commentsCommentFilters = new CommentsCommentFilters,
  discussionsDiscussionFilters = new DiscussionsDiscussionFilters,
  giveawaysGiveawayFilters = new GiveawaysGiveawayFilters,
  groupsGroupLibraryWishlistChecker = new GroupsGroupLibraryWishlistChecker,
  giveawaysGiveawayRecreator = new GiveawaysGiveawayRecreator,
  groupsGroupStats = new GroupsGroupStats,
  discussionsDiscussionTags = new DiscussionsDiscussionTags,
  gamesGameTags = new GamesGameTags,
  groupsGroupTags = new GroupsGroupTags,
  giveawaysGiveawayTemplates = new GiveawaysGiveawayTemplates,
  giveawaysGridView = new GiveawaysGridView,
  generalHiddenBlacklistStats = new GeneralHiddenBlacklistStats,
  giveawaysHiddenGamesEnterButtonDisabler = new GiveawaysHiddenGamesEnterButtonDisabler,
  giveawaysHiddenGameRemover = new GiveawaysHiddenGameRemover,
  generalHeaderRefresher = new GeneralHeaderRefresher,
  tradesHaveWantListChecker = new TradesHaveWantListChecker,
  generalLastPageLink = new GeneralLastPageLink,
  generalLevelProgressVisualizer = new GeneralLevelProgressVisualizer,
  giveawaysMultipleGiveawayCreator = new GiveawaysMultipleGiveawayCreator,
  generalMultiManager = new GeneralMultiManager,
  discussionsMainPostPopup = new DiscussionsMainPostPopup,
  discussionsMainPostSkipper = new DiscussionsMainPostSkipper,
  generalNotificationMerger = new GeneralNotificationMerger,
  giveawaysNextPreviousTrainHotkeys = new GiveawaysNextPreviousTrainHotkeys,
  generalPaginationNavigationOnTop = new GeneralPaginationNavigationOnTop,
  giveawaysPinnedGiveawaysButton = new GiveawaysPinnedGiveawaysButton,
  discussionsPuzzleMarker = new DiscussionsPuzzleMarker,
  generalPointsVisualizer = new GeneralPointsVisualizer,
  giveawaysQuickGiveawaySearch = new GiveawaysQuickGiveawaySearch,
  giveawaysAdvancedGiveawaySearch = new GiveawaysAdvancedGiveawaySearch,
  generalSearchMagnifyingGlassButton = new GeneralSearchMagnifyingGlassButton,
  discussionsRefreshActiveDiscussionsButton = new DiscussionsRefreshActiveDiscussionsButton,
  commentsReplyBoxPopup = new CommentsReplyBoxPopup,
  commentsCommentFormattingHelper = new CommentsCommentFormattingHelper,
  giveawaysRealCVCalculator = new GiveawaysRealCVCalculator,
  giveawaysStickiedGiveawayCountries = new GiveawaysStickiedGiveawayCountries,
  generalShortcutKeys = new GeneralShortcutKeys,
  giveawaysSentKeySearcher = new GiveawaysSentKeySearcher,
  generalScrollToBottomButton = new GeneralScrollToBottomButton,
  generalScrollToTopButton = new GeneralScrollToTopButton,
  tradesTradeBumper = new TradesTradeBumper,
  generalTimeToPointCapCalculator = new GeneralTimeToPointCapCalculator,
  giveawaysUnsentGiftSender = new GiveawaysUnsentGiftSender,
  usersUserSuspensionTracker = new UsersUserSuspensionTracker,
  usersWhitelistBlacklistChecker = new UsersWhitelistBlacklistChecker,
  usersWhitelistBlacklistHighlighter = new UsersWhitelistBlacklistHighlighter,
  usersWhitelistBlacklistSorter = new UsersWhitelistBlacklistSorter,
  usersWhitelistBlacklistManager = new UsersWhitelistBlacklistManager,
  generalURLRedirector = new GeneralURLRedirector,
  usersUserTags = new UsersUserTags,
  generalAccurateTimestamp = new GeneralAccurateTimestamp,
  generalEmbeddedVideos = new GeneralEmbeddedVideos,
  generalImageBorders = new GeneralImageBorders,
  generalVisibleAttachedImages = new GeneralVisibleAttachedImages,
  generalAttachedImageLoader = new GeneralAttachedImageLoader,
  giveawaysCreatedEnteredWonGiveawayDetails = new GiveawaysCreatedEnteredWonGiveawayDetails,
  giveawaysDeleteKeyConfirmation = new GiveawaysDeleteKeyConfirmation,
  giveawaysGiveawayCountryLoader = new GiveawaysGiveawayCountryLoader,
  giveawaysGiveawayWinningChance = new GiveawaysGiveawayWinningChance,
  giveawaysGiveawayWinningRatio = new GiveawaysGiveawayWinningRatio,
  giveawaysGiveawayPointsToWin = new GiveawaysGiveawayPointsToWin,
  giveawaysGiveawayEndTimeHighlighter = new GiveawaysGiveawayEndTimeHighlighter,
  giveawaysSteamActivationLinks = new GiveawaysSteamActivationLinks,
  giveawaysUnfadedEnteredGiveaway = new GiveawaysUnfadedEnteredGiveaway,
  giveawaysStickiedGiveawayGroups = new GiveawaysStickiedGiveawayGroups,
  commentsMultiReply = new CommentsMultiReply,
  commentsReplyFromInbox = new CommentsReplyFromInbox,
  commentsReplyMentionLink = new CommentsReplyMentionLink,
  usersInboxWinnerHighlighter = new UsersInboxWinnerHighlighter,
  usersUserStats = new UsersUserStats,
  groupsGroupHighlighter = new GroupsGroupHighlighter,
  generalAvatarPopout = new GeneralAvatarPopout,
  giveawaysGiveawayPopup = new GiveawaysGiveawayPopup,
  giveawaysEnterLeaveGiveawayButton = new GiveawaysEnterLeaveGiveawayButton,
  giveawaysIsThereAnyDealInfo = new GiveawaysIsThereAnyDealInfo,
  giveawaysUnhideGiveawayButton = new GiveawaysUnhideGiveawayButton,
  giveawaysOneClickHideGiveawayButton = new GiveawaysOneClickHideGiveawayButton,
  giveawaysGiveawayWinnersLink = new GiveawaysGiveawayWinnersLink,
  giveawaysTimeToEnterCalculator = new GiveawaysTimeToEnterCalculator,
  giveawaysGiveawayGroupLoader = new GiveawaysGiveawayGroupLoader,
  commentsReceivedReplyBoxPopup = new CommentsReceivedReplyBoxPopup,
  giveaways = new Giveaways,
  discussions = new Discussions,
  discussionPanels = new DiscussionPanels,
  comments = new Comments,
  games = new Games,
  groups = new Groups,
  users = new Users,
  generalTableSorter = new GeneralTableSorter,
  generalSameTabOpener = new GeneralSameTabOpener,
  usersUsernameHistory = new UsersUsernameHistory,
  usersUserNotes = new UsersUserNotes,
  usersUserFilters = new UsersUserFilters,
  usersSharedGroupChecker = new UsersSharedGroupChecker,
  usersRealWonSentCVLink = new UsersRealWonSentCVLink,
  usersUserGiveawayData = new UsersUserGiveawayData,
  usersNotActivatedMultipleWinChecker = new UsersNotActivatedMultipleWinChecker,
  usersNotReceivedFinder = new UsersNotReceivedFinder,
  usersSentWonRatio = new UsersSentWonRatio,
  usersVisibleRealCV = new UsersVisibleRealCV,
  usersLevelUpCalculator = new UsersLevelUpCalculator,
  usersSteamGiftsProfileButton = new UsersSteamGiftsProfileButton,
  usersSteamTradesProfileButton = new UsersSteamTradesProfileButton,
  usersProfileLinks = new UsersProfileLinks,
  profile = new Profile,
  endlessLoad = new EndlessLoad,
  generalQuickInboxView = new GeneralQuickInboxView,
  generalEndlessScrolling = new GeneralEndlessScrolling,
  tags = new Tags
;

export default {
  common,
  giveawaysBlacklistGiveawayLoader,
  generalNarrowSidebar,
  generalHiddenCommunityPoll,
  discussionsOldActiveDiscussionsDesign,
  discussionsActiveDiscussionsOnTopSidebar,
  generalElementFilters,
  giveaways_addToStorage,
  generalAttachedImageCarousel,
  giveawaysArchiveSearcher,
  generalCakeDayReminder,
  giveawaysCommentEntryChecker,
  discussionsCloseOpenDiscussionButton,
  commentsCommentReverser,
  commentsCommentSearcher,
  commentsCommentTracker,
  giveawaysCommunityWishlistSearchLink,
  discussionsDiscussionEditDetector,
  discussionsDiscussionHighlighter,
  discussionsDiscussionsSorter,
  gamesEnteredGameHighlighter,
  giveawaysEntryTracker,
  commentsCommentHistory,
  generalCustomHeaderFooterLinks,
  generalFixedFooter,
  generalFixedHeader,
  generalFixedMainPageHeading,
  commentsCollapseExpandReplyButton,
  commentsReplyBoxOnTop,
  generalFixedSidebar,
  giveawaysGiveawaysSorter,
  giveawaysGiveawayBookmarks,
  gamesGameCategories,
  giveawaysGiveawayCopyHighlighter,
  generalGiveawayDiscussionTicketTradeTracker,
  giveawaysGiveawayExtractor,
  giveawaysGiveawayEncrypterDecrypter,
  giveawaysGiveawayErrorSearchLinks,
  commentsCommentFilters,
  discussionsDiscussionFilters,
  giveawaysGiveawayFilters,
  groupsGroupLibraryWishlistChecker,
  giveawaysGiveawayRecreator,
  groupsGroupStats,
  discussionsDiscussionTags,
  gamesGameTags,
  groupsGroupTags,
  giveawaysGiveawayTemplates,
  giveawaysGridView,
  generalHiddenBlacklistStats,
  giveawaysHiddenGamesEnterButtonDisabler,
  giveawaysHiddenGameRemover,
  generalHeaderRefresher,
  tradesHaveWantListChecker,
  generalLastPageLink,
  generalLevelProgressVisualizer,
  giveawaysMultipleGiveawayCreator,
  generalMultiManager,
  discussionsMainPostPopup,
  discussionsMainPostSkipper,
  generalNotificationMerger,
  giveawaysNextPreviousTrainHotkeys,
  generalPaginationNavigationOnTop,
  giveawaysPinnedGiveawaysButton,
  discussionsPuzzleMarker,
  generalPointsVisualizer,
  giveawaysQuickGiveawaySearch,
  giveawaysAdvancedGiveawaySearch,
  generalSearchMagnifyingGlassButton,
  discussionsRefreshActiveDiscussionsButton,
  commentsReplyBoxPopup,
  commentsCommentFormattingHelper,
  giveawaysRealCVCalculator,
  giveawaysStickiedGiveawayCountries,
  generalShortcutKeys,
  giveawaysSentKeySearcher,
  generalScrollToBottomButton,
  generalScrollToTopButton,
  tradesTradeBumper,
  generalTimeToPointCapCalculator,
  giveawaysUnsentGiftSender,
  usersUserSuspensionTracker,
  usersWhitelistBlacklistChecker,
  usersWhitelistBlacklistHighlighter,
  usersWhitelistBlacklistSorter,
  usersWhitelistBlacklistManager,
  generalURLRedirector,
  usersUserTags,
  generalAccurateTimestamp,
  generalEmbeddedVideos,
  generalImageBorders,
  generalVisibleAttachedImages,
  generalAttachedImageLoader,
  giveawaysCreatedEnteredWonGiveawayDetails,
  giveawaysDeleteKeyConfirmation,
  giveawaysGiveawayCountryLoader,
  giveawaysGiveawayWinningChance,
  giveawaysGiveawayWinningRatio,
  giveawaysGiveawayPointsToWin,
  giveawaysGiveawayEndTimeHighlighter,
  giveawaysSteamActivationLinks,
  giveawaysUnfadedEnteredGiveaway,
  giveawaysStickiedGiveawayGroups,
  commentsMultiReply,
  commentsReplyFromInbox,
  commentsReplyMentionLink,
  usersInboxWinnerHighlighter,
  usersUserStats,
  groupsGroupHighlighter,
  generalAvatarPopout,
  giveawaysGiveawayPopup,
  giveawaysEnterLeaveGiveawayButton,
  giveawaysIsThereAnyDealInfo,
  giveawaysUnhideGiveawayButton,
  giveawaysOneClickHideGiveawayButton,
  giveawaysGiveawayWinnersLink,
  giveawaysTimeToEnterCalculator,
  giveawaysGiveawayGroupLoader,
  commentsReceivedReplyBoxPopup,
  giveaways,
  discussions,
  discussionPanels,
  comments,
  games,
  groups,
  users,
  generalTableSorter,
  generalSameTabOpener,
  usersUsernameHistory,
  usersUserNotes,
  usersUserFilters,
  usersSharedGroupChecker,
  usersRealWonSentCVLink,
  usersUserGiveawayData,
  usersNotActivatedMultipleWinChecker,
  usersNotReceivedFinder,
  usersSentWonRatio,
  usersVisibleRealCV,
  usersLevelUpCalculator,
  usersSteamGiftsProfileButton,
  usersSteamTradesProfileButton,
  usersProfileLinks,
  profile,
  endlessLoad,
  generalQuickInboxView,
  generalEndlessScrolling,
  tags
};
