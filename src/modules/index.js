import { common } from './Common';
import { settingsModule } from './Settings';
import { loadDataCleaner, loadDataManagement, manageData } from './Storage';
import { generalPageLoadTimestamp } from './General/PageLoadTimestamp';
import { generalVisibleFullLevel } from './General/VisibleFullLevel';
import { giveawaysBlacklistGiveawayLoader } from './Giveaways/BlacklistGiveawayLoader';
import { generalNarrowSidebar } from './General/NarrowSidebar';
import { generalHiddenCommunityPoll } from './General/HiddenCommunityPoll';
import { discussionsOldActiveDiscussionsDesign } from './Discussions/OldActiveDiscussionsDesign';
import { discussionsActiveDiscussionsOnTopSidebar } from './Discussions/ActiveDiscussionsOnTopSidebar';
import { generalElementFilters } from './General/ElementFilters';
import { giveaways_addToStorage } from './Giveaways_addToStorage';
import { generalAttachedImageCarousel } from './General/AttachedImageCarousel';
import { giveawaysArchiveSearcher } from './Giveaways/ArchiveSearcher';
import { generalCakeDayReminder } from './General/CakeDayReminder';
import { giveawaysCommentEntryChecker } from './Giveaways/CommentEntryChecker';
import { discussionsCloseOpenDiscussionButton } from './Discussions/CloseOpenDiscussionButton';
import { commentsCommentReverser } from './Comments/CommentReverser';
import { commentsCommentSearcher } from './Comments/CommentSearcher';
import { commentsCommentTracker } from './Comments/CommentTracker';
import { giveawaysCommunityWishlistSearchLink } from './Giveaways/CommunityWishlistSearchLink';
import { discussionsDiscussionHighlighter } from './Discussions/DiscussionHighlighter';
import { discussionsDiscussionsSorter } from './Discussions/DiscussionsSorter';
import { gamesEnteredGameHighlighter } from './Games/EnteredGameHighlighter';
import { giveawaysEntryTracker } from './Giveaways/EntryTracker';
import { commentsCommentHistory } from './Comments/CommentHistory';
import { generalCustomHeaderFooterLinks } from './General/CustomHeaderFooterLinks';
import { generalFixedFooter } from './General/FixedFooter';
import { generalFixedHeader } from './General/FixedHeader';
import { generalFixedMainPageHeading } from './General/FixedMainPageHeading';
import { commentsCollapseExpandReplyButton } from './Comments/CollapseExpandReplyButton';
import { commentsReplyBoxOnTop } from './Comments/ReplyBoxOnTop';
import { generalFixedSidebar } from './General/FixedSidebar';
import { giveawaysGiveawaysSorter } from './Giveaways/GiveawaysSorter';
import { giveawaysGiveawayBookmarks } from './Giveaways/GiveawayBookmarks';
import { gamesGameCategories } from './Games/GameCategories';
import { giveawaysGiveawayCopyHighlighter } from './Giveaways/GiveawayCopyHighlighter';
import { giveawaysGiveawayLevelHighlighter } from './Giveaways/GiveawayLevelHighlighter';
import { giveawaysCustomGiveawayBackground } from './Giveaways/CustomGiveawayBackground';
import { giveawaysCustomGiveawayCalendar } from './Giveaways/CustomGiveawayCalendar';
import { giveawaysEnteredGiveawaysStats } from './Giveaways/EnteredGiveawaysStats';
import { generalGiveawayDiscussionTicketTradeTracker } from './General/GiveawayDiscussionTicketTradeTracker';
import { giveawaysGiveawayExtractor } from './Giveaways/GiveawayExtractor';
import { giveawaysGiveawayEncrypterDecrypter } from './Giveaways/GiveawayEncrypterDecrypter';
import { giveawaysGiveawayErrorSearchLinks } from './Giveaways/GiveawayErrorSearchLinks';
import { commentsCommentFilters } from './Comments/CommentFilters';
import { discussionsDiscussionFilters } from './Discussions/DiscussionFilters';
import { tradesTradeFilters } from './Trades/TradeFilters';
import { groupsGroupFilters } from './Groups/GroupFilters';
import { giveawaysGiveawayFilters } from './Giveaways/GiveawayFilters';
import { groupsGroupLibraryWishlistChecker } from './Groups/GroupLibraryWishlistChecker';
import { giveawaysGiveawayRecreator } from './Giveaways/GiveawayRecreator';
import { groupsGroupStats } from './Groups/GroupStats';
import { discussionsDiscussionTags } from './Discussions/DiscussionTags';
import { gamesGameTags } from './Games/GameTags';
import { groupsGroupTags } from './Groups/GroupTags';
import { giveawaysGiveawayTemplates } from './Giveaways/GiveawayTemplates';
import { giveawaysGridView } from './Giveaways/GridView';
import { generalHiddenBlacklistStats } from './General/HiddenBlacklistStats';
import { giveawaysHiddenGamesEnterButtonDisabler } from './Giveaways/HiddenGamesEnterButtonDisabler';
import { giveawaysHiddenGamesManager } from './Giveaways/HiddenGamesManager';
import { generalHeaderRefresher } from './General/HeaderRefresher';
import { tradesHaveWantListChecker } from './Trades/HaveWantListChecker';
import { generalLastPageLink } from './General/LastPageLink';
import { generalLevelProgressVisualizer } from './General/LevelProgressVisualizer';
import { giveawaysMultipleGiveawayCreator } from './Giveaways/MultipleGiveawayCreator';
import { generalMultiManager } from './General/MultiManager';
import { discussionsMainPostPopup } from './Discussions/MainPostPopup';
import { discussionsMainPostSkipper } from './Discussions/MainPostSkipper';
import { generalNotificationMerger } from './General/NotificationMerger';
import { giveawaysNextPreviousTrainHotkeys } from './Giveaways/NextPreviousTrainHotkeys';
import { generalPaginationNavigationOnTop } from './General/PaginationNavigationOnTop';
import { giveawaysPinnedGiveawaysButton } from './Giveaways/PinnedGiveawaysButton';
import { discussionsPuzzleMarker } from './Discussions/PuzzleMarker';
import { generalPointsVisualizer } from './General/PointsVisualizer';
import { giveawaysQuickGiveawaySearch } from './Giveaways/QuickGiveawaySearch';
import { giveawaysAdvancedGiveawaySearch } from './Giveaways/AdvancedGiveawaySearch';
import { generalSearchMagnifyingGlassButton } from './General/SearchMagnifyingGlassButton';
import { discussionsRefreshActiveDiscussionsButton } from './Discussions/RefreshActiveDiscussionsButton';
import { commentsReplyBoxPopup } from './Comments/ReplyBoxPopup';
import { commentsCommentFormattingHelper } from './Comments/CommentFormattingHelper';
import { commentsCommentVariables } from './Comments/CommentVariables';
import { giveawaysRealCVCalculator } from './Giveaways/RealCVCalculator';
import { giveawaysStickiedGiveawayCountries } from './Giveaways/StickiedGiveawayCountries';
import { generalShortcutKeys } from './General/ShortcutKeys';
import { giveawaysSentKeySearcher } from './Giveaways/SentKeySearcher';
import { generalScrollToBottomButton } from './General/ScrollToBottomButton';
import { generalScrollToTopButton } from './General/ScrollToTopButton';
import { tradesTradeBumper } from './Trades/TradeBumper';
import { generalTimeToPointCapCalculator } from './General/TimeToPointCapCalculator';
import { giveawaysUnsentGiftSender } from './Giveaways/UnsentGiftSender';
import { usersUserSuspensionTracker } from './Users/UserSuspensionTracker';
import { usersUserSuspensionChecker } from './Users/UserSuspensionChecker';
import { usersWhitelistBlacklistChecker } from './Users/WhitelistBlacklistChecker';
import { usersWhitelistBlacklistHighlighter } from './Users/WhitelistBlacklistHighlighter';
import { usersWhitelistBlacklistSorter } from './Users/WhitelistBlacklistSorter';
import { usersWhitelistBlacklistManager } from './Users/WhitelistBlacklistManager';
import { generalURLRedirector } from './General/URLRedirector';
import { usersUserTags } from './Users/UserTags';
import { usersSteamFriendsIndicator } from './Users/SteamFriendsIndicator';
import { generalAccurateTimestamp } from './General/AccurateTimestamp';
import { generalEmbeddedVideos } from './General/EmbeddedVideos';
import { generalImageBorders } from './General/ImageBorders';
import { generalVisibleAttachedImages } from './General/VisibleAttachedImages';
import { generalAttachedImageLoader } from './General/AttachedImageLoader';
import { giveawaysCreatedEnteredWonGiveawayDetails } from './Giveaways/CreatedEnteredWonGiveawayDetails';
import { giveawaysDeleteKeyConfirmation } from './Giveaways/DeleteKeyConfirmation';
import { giveawaysGiveawayWinningChance } from './Giveaways/GiveawayWinningChance';
import { giveawaysGiveawayWinningRatio } from './Giveaways/GiveawayWinningRatio';
import { giveawaysGiveawayPointsToWin } from './Giveaways/GiveawayPointsToWin';
import { giveawaysGiveawayEndTimeHighlighter } from './Giveaways/GiveawayEndTimeHighlighter';
import { giveawaysSteamActivationLinks } from './Giveaways/SteamActivationLinks';
import { giveawaysUnfadedEnteredGiveaway } from './Giveaways/UnfadedEnteredGiveaway';
import { giveawaysStickiedGiveawayGroups } from './Giveaways/StickiedGiveawayGroups';
import { commentsMultiReply } from './Comments/MultiReply';
import { commentsReplyFromInbox } from './Comments/ReplyFromInbox';
import { commentsReplyMentionLink } from './Comments/ReplyMentionLink';
import { usersInboxWinnerHighlighter } from './Users/InboxWinnerHighlighter';
import { usersUserStats } from './Users/UserStats';
import { groupsGroupHighlighter } from './Groups/GroupHighlighter';
import { giveawaysGiveawayPopup } from './Giveaways/GiveawayPopup';
import { giveawaysEnterLeaveGiveawayButton } from './Giveaways/EnterLeaveGiveawayButton';
import { giveawaysIsThereAnyDealInfo } from './Giveaways/IsThereAnyDealInfo';
import { giveawaysUnhideGiveawayButton } from './Giveaways/UnhideGiveawayButton';
import { giveawaysOneClickHideGiveawayButton } from './Giveaways/OneClickHideGiveawayButton';
import { giveawaysVisibleInviteOnlyGiveaways } from './Giveaways/VisibleInviteOnlyGiveaways';
import { giveawaysGiveawayWinnersLink } from './Giveaways/GiveawayWinnersLink';
import { giveawaysTimeToEnterCalculator } from './Giveaways/TimeToEnterCalculator';
import { generalContentLoader } from './General/ContentLoader';
import { commentsReceivedReplyBoxPopup } from './Comments/ReceivedReplyBoxPopup';
import { giveawaysModule as giveaways } from './Giveaways';
import { discussionsModule as discussions } from './Discussions';
import { discussionPanelsModule as discussionPanels } from './DiscussionPanels';
import { commentsModule as comments } from './Comments';
import { gamesModule as games } from './Games';
import { groupsModule as groups } from './Groups';
import { usersModule as users } from './Users';
import { generalTableSorter } from './General/TableSorter';
import { generalSameTabOpener } from './General/SameTabOpener';
import { usersUsernameHistory } from './Users/UsernameHistory';
import { usersUserNotes } from './Users/UserNotes';
import { usersUserFilters } from './Users/UserFilters';
import { usersSharedGroupChecker } from './Users/SharedGroupChecker';
import { usersUserLinks } from './Users/UserLinks';
import { usersRealWonSentCVLink } from './Users/RealWonSentCVLink';
import { usersUserGiveawayData } from './Users/UserGiveawayData';
import { usersNotActivatedMultipleWinChecker } from './Users/NotActivatedMultipleWinChecker';
import { usersNotReceivedFinder } from './Users/NotReceivedFinder';
import { usersSentWonRatio } from './Users/SentWonRatio';
import { usersVisibleGiftsBreakdown } from './Users/VisibleGiftsBreakdown';
import { usersVisibleRealCV } from './Users/VisibleRealCV';
import { usersLevelUpCalculator } from './Users/LevelUpCalculator';
import { usersSteamGiftsProfileButton } from './Users/SteamGiftsProfileButton';
import { usersProfileLinks } from './Users/ProfileLinks';
import { generalSearchClearButton } from './General/SearchClearButton';
import { profileModule as profile } from './Profile';
import { generalQuickInboxView } from './General/QuickInboxView';
import { generalEndlessScrolling } from './General/EndlessScrolling';

const modules = {
  common,
  settingsModule,
  loadDataCleaner,
  loadDataManagement,
  manageData,
  generalPageLoadTimestamp,
  generalVisibleFullLevel,
  giveawaysBlacklistGiveawayLoader,
  giveawaysVisibleInviteOnlyGiveaways,
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
  giveawaysGiveawayLevelHighlighter,
  giveawaysCustomGiveawayBackground,
  giveawaysCustomGiveawayCalendar,
  generalGiveawayDiscussionTicketTradeTracker,
  giveawaysGiveawayExtractor,
  giveawaysGiveawayEncrypterDecrypter,
  giveawaysGiveawayErrorSearchLinks,
  commentsCommentFilters,
  discussionsDiscussionFilters,
  tradesTradeFilters,
  groupsGroupFilters,
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
  giveawaysHiddenGamesManager,
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
  commentsCommentVariables,
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
  usersUserSuspensionChecker,
  usersWhitelistBlacklistChecker,
  usersWhitelistBlacklistHighlighter,
  usersWhitelistBlacklistSorter,
  usersWhitelistBlacklistManager,
  generalURLRedirector,
  usersUserTags,
  usersSteamFriendsIndicator,
  generalAccurateTimestamp,
  generalEmbeddedVideos,
  generalImageBorders,
  generalVisibleAttachedImages,
  generalAttachedImageLoader,
  giveawaysCreatedEnteredWonGiveawayDetails,
  giveawaysDeleteKeyConfirmation,
  giveawaysGiveawayWinningChance,
  giveawaysGiveawayWinningRatio,
  giveawaysEnteredGiveawaysStats,
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
  generalContentLoader,
  groupsGroupHighlighter,
  giveawaysGiveawayPopup,
  giveawaysEnterLeaveGiveawayButton,
  giveawaysIsThereAnyDealInfo,
  giveawaysUnhideGiveawayButton,
  giveawaysOneClickHideGiveawayButton,
  giveawaysGiveawayWinnersLink,
  giveawaysTimeToEnterCalculator,
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
  usersUserLinks,
  usersRealWonSentCVLink,
  usersUserGiveawayData,
  usersNotActivatedMultipleWinChecker,
  usersNotReceivedFinder,
  usersSentWonRatio,
  usersVisibleGiftsBreakdown,
  usersVisibleRealCV,
  usersLevelUpCalculator,
  usersSteamGiftsProfileButton,
  usersProfileLinks,
  generalSearchClearButton,
  profile,
  generalQuickInboxView,
  generalEndlessScrolling
};

export { modules };