import { Button } from '../../class/Button';
import { Process } from '../../class/Process';
import { Utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { Filters } from '../Filters';
import { Settings } from '../../class/Settings';
import { Shared } from '../../class/Shared';
import { DOM } from '../../class/DOM';

const createElements = common.createElements.bind(common),
	createHeadingButton = common.createHeadingButton.bind(common),
	createLock = common.createLock.bind(common),
	endless_load = common.endless_load.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common);
class TradesTradeFilters extends Filters {
	constructor() {
		super('tf');
		this.info = {
			description: () => (
				<ul>
					<li>Allows you to filter trades.</li>
				</ul>
			),
			features: {
				tf_s: {
					description: () => (
						<ul>
							<li>
								Adds a button (<i className="fa fa-eye"></i> if the trade is hidden and{' '}
								<i className="fa fa-eye-slash"></i> if it is not) next to a trade's title (in any
								page) that allows you to hide the trade.
							</li>
							<li>
								Adds a button (<i className="fa fa-comments"></i>{' '}
								<i className="fa fa-eye-slash"></i>) to the page heading of this menu that allows
								you to view all of the trades that have been hidden.
							</li>
						</ul>
					),
					name: 'Single Filters',
					st: true,
					features: {
						tf_s_s: {
							name: `Show switch to temporarily hide / unhide trades filtered by the filters in the main page heading, along with a counter.`,
							st: true,
						},
					},
				},
				tf_m: {
					description: () => (
						<ul>
							<li>Allows you to hide multiple trades in a page using many different filters.</li>
							<li>
								Adds a toggle switch with a button (<i className="fa fa-sliders"></i>) to the main
								page heading of any <a href="https://www.steamtrades.com/trades">trades</a> page.
								The switch allows you to turn the filters on/off and the button allows you to manage
								your presets.
							</li>
							<li>
								Adds a collapsible panel below the same main page heading that allows you to
								change/save the rules of a preset. The filters are separated in 2 categories:
							</li>
							<ul>
								<li>
									Basic filters are related to a numeric value (such as the number of comments of a
									trade) and have a slider that you can use to set the range of the filter (any
									trades that do not apply to the range will be hidden).
								</li>
								<li>
									Type filters are related to a boolean value (such as whether or not a trade was
									created by yourself) and have a checkbox that changes states when you click on it.
									The checkbox has 3 states:
								</li>
								<ul>
									<li>
										"Show all" (<i className="fa fa-check-square"></i>) does not hide any trades
										that apply to the filter (this is the default state).
									</li>
									<li>
										"Show only" (<i className="fa fa-square"></i>) hides any trades that do not
										apply to the filter.
									</li>
									<li>
										"Hide all" (<i className="fa fa-square-o"></i>) hides any trades that apply to
										the filter.
									</li>
								</ul>
							</ul>
							<li>
								A preset contains all of your rules and can be saved to be reused later. You can
								save as many presets as you want. Each preset contains 3 types of rules:
							</li>
							<ul>
								<li>
									Basic rules are the ones that you can change directly in the filter panel, using
									the sliders/checkboxes as explained in the previous item.
								</li>
								<li>Exception rules are the ones that you can change by clicking on the icon </li>
								<i className="fa fa-gear"></i> in the filter panel. They are exceptions to the basic
								rules. For example, if you set the basic rule of the "Created" filter to "hide all"
								and you add an exception rule for the "Comments" filter to the 0-50 range, none of
								your created trades that have 0-50 comments will be hidden, because they apply to
								the exception.
							</ul>
							<li>
								Override rules are the ones that you can change by clicking on the icon (
								<i className="fa fa-exclamation esgst-faded"></i> if set to overridable and{' '}
								<i className="fa fa-exclamation"></i> if set to non-overridable) next to each
								filter. They are enforcements of the basic rules. Continuing the previous example,
								if you set the override rule of the "Created" filter to "non-overridable", then all
								of your created trades will be hidden, because even if they apply to the exception,
								the basic rule is being enforced by the override rule, so the exception cannot
								override it.
							</li>
						</ul>
					),
					features: {
						tf_m_f: {
							name: 'Fix filter bar at the top of the page.',
							sg: true,
						},
						tf_m_b: {
							name: 'Hide basic filters.',
							st: true,
						},
						tf_m_a: {
							name: 'Hide advanced filters.',
							st: true,
						},
						tf_comments: {
							description: () => (
								<ul>
									<li>Allows you to filter trades by number of comments.</li>
								</ul>
							),
							name: 'Comments',
							st: true,
						},
						tf_created: {
							description: () => (
								<ul>
									<li>Allows you to filter trades created by yourself.</li>
								</ul>
							),
							name: 'Created',
							st: true,
						},
						tf_visited: {
							dependencies: ['gdttt'],
							description: () => (
								<ul>
									<li>Allows you to filter trades that you have visited.</li>
								</ul>
							),
							name: 'Visited',
							st: true,
						},
						tf_subscribed: {
							dependencies: ['tds'],
							description: () => (
								<ul>
									<li>Allows you to filter trades that you have subscribed.</li>
								</ul>
							),
							name: 'Subscribed',
							st: true,
						},
						tf_unread: {
							dependencies: ['ct'],
							description: () => (
								<ul>
									<li>Allows you to filter trades that you have read.</li>
								</ul>
							),
							name: 'Unread',
							st: true,
						},
						tf_authors: {
							description: () => (
								<ul>
									<li>Allows you to filter trades by author.</li>
								</ul>
							),
							name: 'Authors',
							st: true,
						},
						tf_positiveReputation: {
							description: () => (
								<ul>
									<li>Allows you to filter trades by the positive reputation of the author.</li>
								</ul>
							),
							name: 'Positive Reputation',
							st: true,
						},
						tf_negativeReputation: {
							description: () => (
								<ul>
									<li>Allows you to filter trades by the negative reputation of the author.</li>
								</ul>
							),
							name: 'Negative Reputation',
							st: true,
						},
					},
					name: 'Multiple Filters',
					st: true,
				},
			},
			id: 'tf',
			name: 'Trade Filters',
			st: true,
			type: 'trades',
		};
	}

	async init() {
		if (Settings.get('tf_s')) {
			if (Settings.get('tf_s_s')) {
				this.addSingleButton('fa-comments');
			}
			this.esgst.tradeFeatures.push(this.tf_addButtons.bind(this));
		}
		if (Settings.get('tf_m') && Shared.esgst.tradesPath && !Shared.esgst.editTradePath) {
			if (!Shared.esgst.hasAddedFilterContainer) {
				Shared.esgst.style.insertAdjacentText(
					'beforeend',
					`
					.esgst-gf-container {
						position: ${Settings.get('tf_m_f') ? 'sticky' : 'static'};
						top: ${Shared.esgst.commentsTop}px;
					}
				`
				);
			}
			createHeadingButton({
				element: this.filters_addContainer(Shared.esgst.mainPageHeading),
				id: 'tf',
			});
		}
	}

	tf_menu(obj, button) {
		obj.process = new Process({
			button,
			popup: {
				icon: 'fa-comments',
				title: 'Hidden Trades',
				addProgress: true,
				addScrollable: 'left',
			},
			urls: {
				id: 'tf',
				init: this.tf_initUrls.bind(this),
				request: {
					request: this.tf_requestUrl.bind(this),
				},
			},
		});
	}

	async tf_initUrls(obj) {
		obj.popup.getScrollable(
			<div className="table esgst-text-left">
				<div className="header">
					<div className="column_flex">Summary</div>
					<div className="column_small text_center">Comments</div>
				</div>
				<div className="table__rows" ref={(ref) => (obj.trades = ref)} />
			</div>
		);
		const trades = JSON.parse(getValue('trades'));
		let hidden = [];
		for (const key in trades) {
			if (trades.hasOwnProperty(key)) {
				if (trades[key].hidden) {
					const trade = {
						code: key,
						hidden: parseInt(trades[key].hidden),
					};
					hidden.push(trade);
				}
			}
		}
		hidden = Utils.sortArray(hidden, true, 'hidden');
		obj.ids = [];
		for (const trade of hidden) {
			obj.ids.push(trade.code);
			obj.items.push(`/trade/${trade.code}/`);
		}
	}

	async tf_requestUrl(obj, details, response, responseHtml) {
		const breadcrumbs = responseHtml.getElementsByClassName('page_heading_breadcrumbs');
		const usernameLink = responseHtml.getElementsByClassName('author_name')[0];
		const avatar = responseHtml.getElementsByClassName('author_avatar')[0];
		avatar.classList.remove('author_avatar');
		avatar.classList.add('avatar');
		const reputation = responseHtml.getElementsByClassName('author_small')[0];
		reputation.classList.remove('author_small');
		reputation.classList.add('reputation');
		createElements(obj.trades, 'beforeend', [
			{
				type: 'div',
				children: [
					{
						attributes: {
							class: 'row_outer_wrap',
						},
						type: 'div',
						children: [
							{
								attributes: {
									class: 'row_inner_wrap',
								},
								type: 'div',
								children: [
									{
										type: 'div',
										children: [
											{
												context: avatar,
											},
										],
									},
									{
										attributes: {
											class: 'column_flex',
										},
										type: 'div',
										children: [
											{
												type: 'h3',
												children: [
													{
														attributes: {
															href: `/trade/${obj.ids[obj.index]}/`,
														},
														text:
															breadcrumbs[0].firstElementChild.nextElementSibling.nextElementSibling
																.firstElementChild.textContent,
														type: 'a',
													},
												],
											},
											{
												type: 'p',
												children: [
													{
														context: responseHtml.querySelector(`.comment_outer [data-timestamp]`),
													},
													{
														text: ' by ',
														type: 'node',
													},
													{
														attributes: {
															class: 'underline',
															href: usernameLink.getAttribute('href'),
														},
														text: usernameLink.textContent,
														type: 'a',
													},
													{
														text: ' ',
														type: 'node',
													},
													{
														context: reputation,
													},
												],
											},
										],
									},
									{
										attributes: {
											class: 'column_small text_center',
										},
										type: 'div',
										children: [
											{
												attributes: {
													class: 'underline',
													href: `/trade/${obj.ids[obj.index]}/`,
												},
												text: `${breadcrumbs[1].textContent.match(/(.+) Comments?/)[1]}`,
												type: 'a',
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);
		await endless_load(obj.trades);
		if (!Shared.esgst.tradesPath) {
			if (Settings.get('gdttt')) {
				await Shared.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.trades, true);
				await Shared.esgst.modules.generalGiveawayDiscussionTicketTradeTracker.gdttt_checkVisited(
					obj.trades
				);
			} else if (Settings.get('ct')) {
				await Shared.esgst.modules.commentsCommentTracker.ct_addDiscussionPanels(obj.trades, true);
			}
			await Shared.esgst.modules.discussions.discussions_load(obj.trades);
		}
	}

	tf_addButtons(trades, main) {
		for (const trade of trades) {
			if (!trade.heading.parentElement.getElementsByClassName('esgst-df-button')[0]) {
				new Button(trade.headingContainer.firstElementChild, 'beforebegin', {
					callbacks: [
						this.tf_hideTrade.bind(this, trade, main),
						null,
						this.tf_unhideTrade.bind(this, trade, main),
						null,
					],
					className: 'esgst-df-button',
					icons: [
						'fa-eye-slash esgst-clickable',
						'fa-circle-o-notch fa-spin',
						'fa-eye esgst-clickable',
						'fa-circle-o-notch fa-spin',
					],
					id: 'tf_s',
					index: trade.saved && trade.saved.hidden ? 2 : 0,
					titles: ['Hide trade', 'Hiding trade...', 'Unhide trade', 'Unhiding trade...'],
				});
			}
		}
	}

	async tf_hideTrade(trade, main) {
		let deleteLock = await createLock('tradeLock', 300);
		let trades = JSON.parse(getValue('trades', '{}'));
		if (!trades[trade.code]) {
			trades[trade.code] = {};
		}
		trades[trade.code].hidden = trades[trade.code].lastUsed = Date.now();
		await setValue('trades', JSON.stringify(trades));
		deleteLock();
		if (!main || !Shared.esgst.tradePath) {
			trade.outerWrap.remove();
		}
		return true;
	}

	async tf_unhideTrade(trade, main) {
		let deleteLock = await createLock('tradeLock', 300);
		let trades = JSON.parse(getValue('trades', '{}'));
		if (trades[trade.code]) {
			delete trades[trade.code].hidden;
			trades[trade.code].lastUsed = Date.now();
		}
		await setValue('trades', JSON.stringify(trades));
		deleteLock();
		if (!main || !Shared.esgst.tradePath) {
			trade.outerWrap.remove();
		}
		return true;
	}

	getFilters() {
		return {
			comments: {
				check: true,
				minValue: 0,
				name: 'Comments',
				type: 'integer',
			},
			created: {
				check: true,
				name: 'Created',
				type: 'boolean',
			},
			visited: {
				check: Settings.get('gdttt'),
				name: 'Visited',
				type: 'boolean',
			},
			subscribed: {
				check: Settings.get('tds'),
				name: 'Subscribed',
				type: 'boolean',
			},
			unread: {
				check: Settings.get('ct'),
				name: 'Unread',
				type: 'boolean',
			},
			authors: {
				check: true,
				list: true,
				name: 'Authors',
				type: 'string',
			},
			positiveReputation: {
				check: true,
				minValue: 0,
				name: 'Positive Reputation',
				type: 'integer',
			},
			negativeReputation: {
				check: true,
				minValue: 0,
				name: 'Negative Reputation',
				type: 'integer',
			},
		};
	}
}

const tradesTradeFilters = new TradesTradeFilters();

export { tradesTradeFilters };
