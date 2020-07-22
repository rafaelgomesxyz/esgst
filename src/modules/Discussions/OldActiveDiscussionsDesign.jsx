import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const endless_load = common.endless_load.bind(common),
	request = common.request.bind(common);
class DiscussionsOldActiveDiscussionsDesign extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							`Brings back the SteamGifts' old active discussions design, while keeping the new "Deals" section.`,
						],
						[
							'li',
							[
								`Only one section ("Discussions" or "Deals") can be shown at a time. There is a button (`,
								['i', { class: 'fa fa-retweet' }],
								`) in the page heading of the active discussions that allows you to switch sections.`,
							],
						],
					],
				],
			],
			features: {
				oadd_d: {
					description: [
						[
							'ul',
							[
								[
									'li',
									`With this option enabled, the deals are included in the "Discussions" section instead of being exclusive to the "Deals" section.`,
								],
							],
						],
					],
					name: 'Show deals in the "Discussions" section.',
					sg: true,
				},
			},
			id: 'oadd',
			name: 'Old Active Discussions Design',
			sg: true,
			type: 'discussions',
		};
	}

	async init() {
		if (!this.esgst.giveawaysPath || !this.esgst.activeDiscussions) return;
		await this.oadd_load();
	}

	async oadd_load(refresh, callback) {
		let deals,
			dealsRows,
			dealsSwitch,
			discussions,
			discussionsRows,
			discussionsSwitch,
			i,
			j,
			response1Html,
			response2Html,
			revisedElements;
		response1Html = DOM.parse((await request({ method: 'GET', url: '/discussions' })).responseText);
		response2Html = DOM.parse(
			(await request({ method: 'GET', url: '/discussions/deals' })).responseText
		);
		this.esgst.activeDiscussions.classList.add('esgst-oadd');
		DOM.insert(
			this.esgst.activeDiscussions,
			'atinner',
			<fragment>
				<div ref={(ref) => (discussions = ref)}>
					<div className="page__heading">
						<div
							className="esgst-heading-button"
							title="Switch to Deals"
							ref={(ref) => (discussionsSwitch = ref)}
						>
							<i className="fa fa-retweet"></i>
						</div>
						<div className="page__heading__breadcrumbs">
							<a href="/discussions">Active Discussions</a>
						</div>
						<a className="page__heading__button page__heading__button--green" href="/discussions">
							More <i className="fa fa-angle-right"></i>
						</a>
					</div>
					<div className="table">
						<div className="table__heading">
							<div className="table__column--width-fill">Summary</div>
							<div className="table__column--width-small text-center">Comments</div>
							<div className="table__column--width-medium text-right">Last Post</div>
						</div>
						<div className="table__rows" ref={(ref) => (discussionsRows = ref)}></div>
					</div>
				</div>
				<div className="esgst-hidden" ref={(ref) => (deals = ref)}>
					<div className="page__heading">
						<div
							className="esgst-heading-button"
							title="Switch to Discussions"
							ref={(ref) => (dealsSwitch = ref)}
						>
							<i className="fa fa-retweet"></i>
						</div>
						<div className="page__heading__breadcrumbs">
							<a href="/discussions/deals">Active Deals</a>
						</div>
						<a
							className="page__heading__button page__heading__button--green"
							href="/discussions/deals"
						>
							More <i className="fa fa-angle-right"></i>
						</a>
					</div>
					<div className="table">
						<div className="table__heading">
							<div className="table__column--width-fill">Summary</div>
							<div className="table__column--width-small text-center">Comments</div>
							<div className="table__column--width-medium text-right">Last Post</div>
						</div>
						<div className="table__rows" ref={(ref) => (dealsRows = ref)}></div>
					</div>
				</div>
			</fragment>
		);
		let preset = null;
		if (Settings.get('df') && Settings.get('df_m') && Settings.get('df_enable')) {
			let name = Settings.get('df_preset');
			if (name) {
				let i;
				for (
					i = Settings.get('df_presets').length - 1;
					i > -1 && Settings.get('df_presets')[i].name !== name;
					i--
				) {}
				if (i > -1) {
					preset = Settings.get('df_presets')[i];
				}
			}
		}
		let elements = await this.esgst.modules.discussions.discussions_get(response1Html, true);
		if (!Settings.get('oadd_d')) {
			revisedElements = [];
			elements.forEach((element) => {
				// @ts-ignore
				if (element.category !== 'Deals') {
					revisedElements.push(element);
				}
			});
			elements = revisedElements;
		}
		const filters = this.esgst.modules.discussionsDiscussionFilters.getFilters();
		for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
			if (
				!preset ||
				this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
					filters,
					elements[j],
					preset.rules
				)
			) {
				// @ts-ignore
				discussionsRows.appendChild(elements[j].outerWrap);
				i += 1;
			}
		}
		elements = await this.esgst.modules.discussions.discussions_get(response2Html, true);
		for (i = 0, j = elements.length - 1; i < 5 && j > -1; j--) {
			if (
				!preset ||
				this.esgst.modules.discussionsDiscussionFilters.filters_filterItem(
					filters,
					elements[j],
					preset.rules
				)
			) {
				// @ts-ignore
				dealsRows.appendChild(elements[j].outerWrap);
				i += 1;
			}
		}
		discussionsSwitch.addEventListener('click', () => {
			discussions.classList.add('esgst-hidden');
			deals.classList.remove('esgst-hidden');
		});
		dealsSwitch.addEventListener('click', () => {
			discussions.classList.remove('esgst-hidden');
			deals.classList.add('esgst-hidden');
		});
		if (Settings.get('adots')) {
			this.esgst.modules.discussionsActiveDiscussionsOnTopSidebar.adots_load(refresh);
		} else if (Settings.get('radb')) {
			this.esgst.modules.discussionsRefreshActiveDiscussionsButton.radb_addButtons();
		}
		if (refresh) {
			await endless_load(this.esgst.activeDiscussions);
			if (callback) {
				callback();
			}
		} else if (callback) {
			callback();
		}
	}
}

const discussionsOldActiveDiscussionsDesign = new DiscussionsOldActiveDiscussionsDesign();

export { discussionsOldActiveDiscussionsDesign };
