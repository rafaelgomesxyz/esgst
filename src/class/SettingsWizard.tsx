import { Button } from '../components/Button';
import { PageHeading } from '../components/PageHeading';
import { DOM } from './DOM';
import { Popup } from './Popup';
import { Settings } from './Settings';
import { Shared } from './Shared';

export interface SettingsWizardStep {
	doShow: () => boolean;
	isConfirmStep?: boolean;
	title: string;
	description: HTMLElement | (() => HTMLElement) | null;
	settings: Record<string, unknown>;
	permissions: string[];
	sync: string[];
	runOp?: () => Promise<void>;
}

class _SettingsWizard {
	steps: SettingsWizardStep[] = [
		{
			doShow: () => Shared.esgst.isFirstRun,
			isConfirmStep: true,
			title: 'Get started with ESGST',
			description: () => (
				<fragment>
					All good, {Settings.get('username')}! You'll now be guided through a series of feature
					combos, so you can shape your ESGST experience based on your needs. Choose "Yes" for the
					combos you want and "No" for the ones you don't. When you're ready, click "Next" to
					proceed.
				</fragment>
			),
			settings: {},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Always within reach',
			description: (
				<ul>
					<li>See the header, main page heading and sidebar at all times</li>
					<li>The pagination navigation is moved to the main page heading</li>
					<li>Quickly scroll to the top of the page</li>
				</ul>
			),
			settings: {
				fh_sg: 1,
				fh_st: 1,
				fmph_sg: 1,
				fmph_st: 1,
				fs_sg: 1,
				pnot_sg: 1,
				pnot_st: 1,
				pnot_s_sg: 1,
				pnot_s_st: 1,
				sttb_sg: 1,
				sttb_st: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Infinite content',
			description: (
				<ul>
					<li>Endlessly load new content as you scroll down the page</li>
				</ul>
			),
			settings: {
				es_sg: 1,
				es_st: 1,
				es_murl_sg: 1,
				es_murl_st: 1,
				es_gb_sg: 1,
				es_ge_sg: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Less is more',
			description: (
				<ul>
					<li>The active discussions in the main page are moved to the sidebar</li>
					<li>Giveaways are shown as a grid instead of a list</li>
					<li>The sidebar size is reduced</li>
				</ul>
			),
			settings: {
				adots_sg: 1,
				adots_index: 1,
				gv_sg: 1,
				gv_gb_sg: 1,
				gv_ge_sg: 1,
				ns_sg: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'More is less',
			description: (
				<ul>
					<li>Linked YouTube/Vimeo videos are automatically embedded in posts</li>
					<li>Attached images are automatically embedded in posts</li>
				</ul>
			),
			settings: {
				ev_sg: 1,
				ev_st: 1,
				vai_sg: 1,
				vai_st: 1,
				vai_gifv_sg: 1,
				vai_gifv_st: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'General improvements',
			description: (
				<ul>
					<li>
						Attached images are loaded on demand to improve page loading times (note that if you
						enable this combo, it will overwrite the previous combo's setting to embed images in
						posts)
					</li>
					<li>Broken giveaway URLs are automatically fixed</li>
					<li>"Last Page" links are added to pages that don't have them, when possible</li>
				</ul>
			),
			settings: {
				ail_sg: 1,
				ail_st: 1,
				urlr_sg: 1,
				lpl_sg: 1,
				lpl_st: 1,
				vai_sg: 0,
				vai_st: 0,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Starter kit for creating giveaways',
			description: (
				<ul>
					<li>See stats about who commented/entered your giveaways</li>
					<li>See more information about your giveaways in the created page</li>
					<li>
						Filter giveaways by status (received, not received, awaiting feedback) and winners
					</li>
					<li>Quickly recreate giveaways that ended with 0 entries</li>
					<li>Save giveaway templates to quickly create giveaways using the same template</li>
					<li>
						Create multiple giveaways at once and easily create trains (giveaways are automatically
						connected to each other through previous/next links)
					</li>
					<li>
						Search for a specific key or set of keys in your giveaways and export all of your keys
					</li>
					<li>
						Sticky your most used countries/groups to the top in the new giveaway page, for quick
						access
					</li>
					<li>
						Send all of your unsent gifts to the winners at once and check the winners for not
						activated / multiple wins / group membership / other criteria before sending
					</li>
				</ul>
			),
			settings: {
				cec_sg: 1,
				cewgd_sg: 1,
				cewgd_c_sg: 1,
				cewgd_c_p_sg: 1,
				cewgd_c_sl_sg: 1,
				cewgd_c_t_sg: 1,
				cewgd_c_l_sg: 1,
				cewgd_c_w_sg: 1,
				gf_sg: 1,
				gf_m_sg: 1,
				gf_m_a_sg: 1,
				gf_received_sg: 1,
				gf_notReceived_sg: 1,
				gf_awaitingFeedback_sg: 1,
				gf_winners_sg: 1,
				gf_enableCreated: 1,
				gr_sg: 1,
				gr_r_sg: 1,
				gts_sg: 1,
				mgc_sg: 1,
				sks_sg: 1,
				sgac_sg: 1,
				sgg_sg: 1,
				ugs_sg: 1,
			},
			permissions: ['sgTools', 'steamCommunity'],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Starter kit for entering/winning giveaways',
			description: (
				<ul>
					<li>Quickly use SteamGifts' advanced giveaway search options</li>
					<li>See more information about your entered/won giveaways in the entered/won pages</li>
					<li>Enter/leave giveaways without having to access them</li>
					<li>Keep track of your entries</li>
					<li>Bookmark giveaways to enter later</li>
					<li>Quickly extract all giveaways from a train</li>
					<li>
						Filter giveaways by level, entries, points, etc. (entered giveaways are automatically
						hidden)
					</li>
					<li>Sort giveaways by entries, points, etc.</li>
					<li>See your current chance of winning a giveaway</li>
					<li>See the current entries/copy ratio of a giveaway</li>
					<li>Navigate through trains using the arrow keys</li>
					<li>Hide giveaways with one click</li>
					<li>Quickly activate a key from a won game on Steam</li>
					<li>
						If you don't have enough points to enter a giveaway, see how long you have to wait until
						you have enough points
					</li>
					<li>
						See information about games (such as whether a game has achievements, trading cards,
						etc.) and filter giveaways by this information
					</li>
					<li>Keep track of games by tagging them</li>
				</ul>
			),
			settings: {
				ags_sg: 1,
				cewgd_sg: 1,
				cewgd_e_sg: 1,
				cewgd_e_p_sg: 1,
				cewgd_e_sl_sg: 1,
				cewgd_e_t_sg: 1,
				cewgd_e_l_sg: 1,
				cewgd_w_sg: 1,
				cewgd_w_p_sg: 1,
				cewgd_w_sl_sg: 1,
				cewgd_w_t_sg: 1,
				cewgd_w_l_sg: 1,
				cewgd_w_e_sg: 1,
				elgb_sg: 1,
				et_sg: 1,
				gb_sg: 1,
				gb_h_sg: 1,
				ge_sg: 1,
				ge_a_sg: 1,
				gf_sg: 1,
				gf_m_sg: 1,
				gf_m_a_sg: 1,
				gf_level_sg: 1,
				gf_entries_sg: 1,
				gf_copies_sg: 1,
				gf_points_sg: 1,
				gf_comments_sg: 1,
				gf_minutesToEnd_sg: 1,
				gf_chance_sg: 1,
				gf_ratio_sg: 1,
				gf_rating_sg: 1,
				gf_reviews_sg: 1,
				gf_releaseDate_sg: 1,
				gf_pinned_sg: 1,
				gf_public_sg: 1,
				gf_inviteOnly_sg: 1,
				gf_group_sg: 1,
				gf_whitelist_sg: 1,
				gf_regionRestricted_sg: 1,
				gf_created_sg: 1,
				gf_entered_sg: 1,
				gf_owned_sg: 1,
				gf_wishlisted_sg: 1,
				gf_followed_sg: 1,
				gf_ignored_sg: 1,
				gf_bookmarked_sg: 1,
				gf_fullCV_sg: 1,
				gf_reducedCV_sg: 1,
				gf_noCV_sg: 1,
				gf_creators_sg: 1,
				gf_learning_sg: 1,
				gf_removed_sg: 1,
				gf_tradingCards_sg: 1,
				gf_achievements_sg: 1,
				gf_singleplayer_sg: 1,
				gf_multiplayer_sg: 1,
				gf_steamCloud_sg: 1,
				gf_linux_sg: 1,
				gf_mac_sg: 1,
				gf_dlc_sg: 1,
				gf_dlcOwned_sg: 1,
				gf_package_sg: 1,
				gf_earlyAccess_sg: 1,
				gf_genres_sg: 1,
				gf_tags_sg: 1,
				gf_enable: 1,
				gf_enableGroups: 1,
				gf_enableWishlist: 1,
				gf_enableRecommended: 1,
				gf_enableGroup: 1,
				gf_enableNew: 1,
				gf_enableEntered: 1,
				gf_enableWon: 1,
				gf_enableUser: 1,
				gf_preset: 'HideEntered',
				gf_presetGroups: 'HideEntered',
				gf_presetWishlist: 'HideEntered',
				gf_presetRecommended: 'HideEntered',
				gf_presetGroup: 'HideEntered',
				gf_presetNew: 'HideEntered',
				gf_presetEntered: 'HideEntered',
				gf_presetWon: 'HideEntered',
				gf_presetUser: 'HideEntered',
				gf_presets: [
					{
						name: 'HideEntered',
						rules: {
							condition: 'AND',
							rules: [
								{
									id: 'entered',
									field: 'entered',
									type: 'boolean',
									input: 'radio',
									operator: 'equal',
									value: false,
								},
							],
							not: false,
							valid: true,
						},
					},
				],
				gas_sg: 1,
				gwc_sg: 1,
				gwr_sg: 1,
				npth_sg: 1,
				ochgb_sg: 1,
				sal_sg: 1,
				ttec_sg: 1,
				gc_sg: 1,
				gc_a_sg: 1,
				gc_dlc_sg: 1,
				gc_dlc_o_sg: 1,
				gc_ea_sg: 1,
				gc_f_sg: 1,
				gc_fcv_sg: 1,
				gc_g_sg: 1,
				gc_i_sg: 1,
				gc_lg_sg: 1,
				gc_l_sg: 1,
				gc_m_sg: 1,
				gc_mp_sg: 1,
				gc_ncv_sg: 1,
				gc_o_sg: 1,
				gc_p_sg: 1,
				gc_r_sg: 1,
				gc_rcv_sg: 1,
				gc_rd_sg: 1,
				gc_rm_sg: 1,
				gc_sp_sg: 1,
				gc_sc_sg: 1,
				gc_tc_sg: 1,
				gc_w_sg: 1,
				gt_sg: 1,
				gt_s_sg: 1,
			},
			permissions: ['server', 'steamCommunity', 'steamStore'],
			sync: ['Games', 'FollowedGames', 'NoCvGames', 'ReducedCvGames'],
		},
		{
			doShow: () => true,
			title: 'Starter kit for commenting',
			description: (
				<ul>
					<li>Quickly use comment formatting</li>
					<li>Mark comments as read/unread and keep track of which comments you've read</li>
					<li>Reply to multiple comments at the same time, without having to reload the page</li>
					<li>
						Reply to main posts faster, by having the reply box below the OP instead of at the
						bottom of the page
					</li>
					<li>Reply to comments from your inbox</li>
					<li>See who replied to whom (useful for deep nested replies)</li>
				</ul>
			),
			settings: {
				cfh_sg: 1,
				cfh_st: 1,
				cfh_bq_sg: 1,
				cfh_bq_st: 1,
				cfh_b_sg: 1,
				cfh_b_st: 1,
				cfh_h1_sg: 1,
				cfh_h1_st: 1,
				cfh_h2_sg: 1,
				cfh_h2_st: 1,
				cfh_h3_sg: 1,
				cfh_h3_st: 1,
				cfh_ic_sg: 1,
				cfh_ic_st: 1,
				cfh_i_sg: 1,
				cfh_i_st: 1,
				cfh_lb_sg: 1,
				cfh_lb_st: 1,
				cfh_lc_sg: 1,
				cfh_lc_st: 1,
				cfh_ol_sg: 1,
				cfh_ol_st: 1,
				cfh_pc_sg: 1,
				cfh_pc_st: 1,
				cfh_s_sg: 1,
				cfh_s_st: 1,
				cfh_st_sg: 1,
				cfh_st_st: 1,
				cfh_ul_sg: 1,
				cfh_ul_st: 1,
				cfh_img_sg: 1,
				cfh_img_st: 1,
				cfh_l_sg: 1,
				cfh_l_st: 1,
				cfh_t_sg: 1,
				cfh_t_st: 1,
				cfh_e_sg: 1,
				cfh_e_st: 1,
				cfh_p_sg: 1,
				cfh_p_st: 1,
				cfh_sr_sg: 1,
				cfh_sr_st: 1,
				cfh_cf_sg: 1,
				cfh_cf_st: 1,
				ct_sg: 1,
				ct_st: 1,
				ct_a_sg: 1,
				ct_a_st: 1,
				ct_o_sg: 1,
				ct_o_st: 1,
				ct_f_sg: 1,
				ct_f_st: 1,
				mr_sg: 1,
				mr_st: 1,
				rbot_sg: 1,
				rbot_st: 1,
				rfi_sg: 1,
				rfi_st: 1,
				rfi_s_sg: 1,
				rfi_s_st: 1,
				rml_sg: 1,
				rml_st: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Starter kit for group/whitelist/blacklist management',
			description: (
				<ul>
					<li>
						See what games members of a group or your whitelist/blacklist have in their
						libraries/wishlists
					</li>
					<li>See more information about your groups in the groups page</li>
					<li>
						See when users in your whitelist/blacklist were online and more information about them
					</li>
					<li>Quickly export/clear your whitelist/blacklist</li>
				</ul>
			),
			settings: {
				glwc_sg: 1,
				gs_sg: 1,
				gs_sent_sg: 1,
				gs_received_sg: 1,
				gs_giftDifference_sg: 1,
				gs_valueDifference_sg: 1,
				gs_firstGiveaway_sg: 1,
				gs_lastGiveaway_sg: 1,
				gs_averageEntries_sg: 1,
				gs_users_sg: 1,
				us_sg: 1,
				wbm_sg: 1,
			},
			permissions: ['steamApi', 'steamCommunity', 'steamStore'],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Starter kit for user management',
			description: (
				<ul>
					<li>Quickly see information about a user without having to leave the page</li>
					<li>Check if a user has any not activated / multiple wins</li>
					<li>See a user's sent/won ratio</li>
					<li>Check which groups you share with another user</li>
					<li>See a user's username history, if that information is available</li>
					<li>Add notes/tags to users</li>
					<li>
						Check a list of users to see who has whitelisted/blacklisted you, if that information is
						available
					</li>
					<li>Quickly see if a user is on your whitelist/blacklist</li>
				</ul>
			),
			settings: {
				cl_sg: 1,
				cl_ui_sg: 1,
				namwc_sg: 1,
				namwc_h_sg: 1,
				namwc_h_st: 1,
				namwc_h_m_sg: 1,
				namwc_h_m_st: 1,
				namwc_h_i_sg: 1,
				namwc_h_i_st: 1,
				swr_sg: 1,
				sgc_sg: 1,
				uh_sg: 1,
				un_sg: 1,
				un_st: 1,
				ut_sg: 1,
				ut_st: 1,
				wbc_sg: 1,
				wbc_h_sg: 1,
				wbc_h_st: 1,
				wbh_sg: 1,
				wbh_st: 1,
			},
			permissions: ['server', 'sgTools', 'steamCommunity'],
			sync: ['Groups'],
		},
		{
			doShow: () => true,
			title: 'Run ESGST on SteamTrades',
			description: null,
			settings: {
				esgst_sg: 1,
			},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => true,
			title: 'Saving settings...',
			description: null,
			settings: {},
			permissions: [],
			sync: [],
			runOp: () => Shared.common.lockAndSaveSettings(this.settingsToSave),
		},
		{
			doShow: () => this.permissionsToGrant.size > 0,
			isConfirmStep: true,
			title: 'Required permissions',
			description: () => (
				<fragment>
					Some of the features you enabled require permissions in order to work. Go{' '}
					<a
						className="esgst-bold table__column__secondary-link"
						href={`${browser.runtime.getURL('permissions.html')}?keys=${Array.from(
							this.permissionsToGrant
						).join(',')}`}
						target="_blank"
					>
						here
					</a>{' '}
					and click the "Grant" button to grant them. Then click "Next" to proceed.
				</fragment>
			),
			settings: {},
			permissions: [],
			sync: [],
		},
		{
			doShow: () => this.dataToSync.size > 0,
			isConfirmStep: true,
			title: 'Required sync',
			description: () => (
				<fragment>
					Some of the features you enabled require you to sync your data in order to work. Go{' '}
					<a
						className="esgst-bold table__column__secondary-link"
						href={`https://www.steamgifts.com/account/settings/profile?esgst=sync&autoSync=true&${Array.from(
							this.dataToSync
						)
							.map((syncKey) => `${syncKey}=1`)
							.join('&')}`}
						target="_blank"
					>
						here
					</a>{' '}
					and wait until the sync is complete. You might also want to enable the automatic sync in
					that page, since you'll need to perform this sync every once in a while to keep your data
					up-to-date. Then click "Next" to proceed.
				</fragment>
			),
			settings: {},
			permissions: [],
			sync: [],
		},
	];

	settingsToSave = {};
	permissionsToGrant = new Set();
	dataToSync = new Set();
	currentStep = -1;

	stepNode: HTMLElement | undefined;

	run = () => {
		this.settingsToSave = {};
		this.permissionsToGrant = new Set();
		this.dataToSync = new Set();
		this.currentStep = -1;
		const popup = new Popup({ isTemp: true });
		PageHeading.create('sm', {
			breadcrumbs: ['Settings Wizard'],
		}).insert(popup.description, 'beforeend');
		this.stepNode = popup.getScrollable();
		this.stepNode.classList.add('markdown');
		popup.onClose = () => window.location.reload();
		popup.open();
		this.nextStep();
	};

	nextStep = async () => {
		if (!this.stepNode) {
			return;
		}
		let step: SettingsWizardStep;
		do {
			this.currentStep += 1;
			step = this.steps[this.currentStep];
		} while (step && !step.doShow());
		if (step) {
			DOM.insert(
				this.stepNode,
				'atinner',
				<fragment>
					<h3>{step.title}</h3>
					{step.description && (
						<p>{typeof step.description === 'function' ? step.description() : step.description}</p>
					)}
				</fragment>
			);
			const [buttonGroup] = DOM.insert(
				this.stepNode,
				'beforeend',
				<div className="esgst-button-group"></div>
			);
			if (step.runOp) {
				await step.runOp();
				window.setTimeout(this.nextStep, 0);
			} else if (step.isConfirmStep) {
				Button.create({
					template: 'success',
					name: 'Next',
					onClick: () => void window.setTimeout(this.nextStep, 0),
				}).insert(buttonGroup, 'beforeend');
			} else {
				Button.create({
					template: 'success',
					name: 'Yes',
					onClick: () => {
						this.settingsToSave = { ...this.settingsToSave, ...step.settings };
						for (const permissionKey of step.permissions) {
							this.permissionsToGrant.add(permissionKey);
						}
						for (const syncKey of step.sync) {
							this.dataToSync.add(syncKey);
						}
						window.setTimeout(this.nextStep, 0);
					},
				}).insert(buttonGroup, 'beforeend');
				Button.create({
					template: 'error',
					name: 'No',
					onClick: () => void window.setTimeout(this.nextStep, 0),
				}).insert(buttonGroup, 'beforeend');
			}
		} else {
			DOM.insert(
				this.stepNode,
				'atinner',
				<fragment>
					<h3>All done!</h3>
					<p>
						You can customize your experience even more by going to the{' '}
						<a href="https://www.steamgifts.com/account/settings/profile?esgst=settings">
							settings page
						</a>{' '}
						(also available as a popup through the ESGST button at the header).
						<br />
						<br />
						Remember to backup your data often in the{' '}
						<a href="https://www.steamgifts.com/account/settings/profile?esgst=backup">
							backup page
						</a>{' '}
						to prevent data loss. You can also restore/delete your data in the{' '}
						<a href="https://www.steamgifts.com/account/settings/profile?esgst=restore">restore</a>/
						<a href="https://www.steamgifts.com/account/settings/profile?esgst=delete">delete</a>{' '}
						pages. These pages are also available as a popup from the settings popup.
						<br />
						<br />
						And that's the basics, enjoy ESGST! And please report any bugs/suggestions in the
						SteamGifts thread or on GitHub (both are accessible from the ESGST dropdown at the
						header).
						<br />
						<br />
						You can close this popup now. When you do, the page will be refreshed for the settings
						to take effect.
					</p>
				</fragment>
			);
		}
	};
}

export const SettingsWizard = new _SettingsWizard();
