import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common);
class GiveawaysGiveawayWinningChance extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds an element (<i className="fa fa-area-chart"></i> [Chance] %) below a giveaway's
						start time (in any page) that shows your chance of winning the giveaway.
					</li>
					<li>
						The chance is calculated by rounding up (using 2 decimals) the result of the following
						formula: number_of_copies / number_of_entries * 100
					</li>
					<li>You can move the element around by dragging and dropping it.</li>
				</ul>
			),
			features: {
				gwc_e: {
					description: () => (
						<ul>
							<li>The formula changes to: number_of_copies / (number_of_entries + 1) * 100</li>
							<li>
								For example, if a giveaway has 5 entries, the current chance of winning it is 20%,
								but after you enter it, it will have 6 entries, so the chance will decrease to
								16.67%.
							</li>
						</ul>
					),
					name:
						'Show what the chance will be when you enter the giveaway instead of the current chance.',
					sg: true,
				},
				gwc_a: {
					description: () => (
						<ul>
							<li>
								Uses an advanced formula (number_of_copies / (number_of_entries /
								time_open_in_milliseconds * duration_in_milliseconds) * 100) to calculate the chance
								based on how much time the giveaway has been open and the duration of the giveaway.
								This gives you an estimate of what the chance will be when the giveaway ends.
							</li>
						</ul>
					),
					features: {
						gwc_a_b: {
							name: `Show the basic chance along with the advanced one (the advanced chance will appear in a parenthesis, like "[Basic]% ([Advanced]%)").`,
							sg: true,
						},
					},
					name: 'Use advanced formula.',
					sg: true,
				},
				gwc_h: {
					conflicts: ['gwr_h'],
					description: () => (
						<ul>
							<li>
								Changes the color of the giveaway's title to the same color as the chance and adds a
								border of same color to the giveaway's game image.
							</li>
						</ul>
					),
					inputItems: [
						{
							id: 'gwc_h_width',
							prefix: `Image Border Width: `,
						},
					],
					name: 'Highlight the giveaway.',
					sg: true,
				},
			},
			id: 'gwc',
			name: 'Giveaway Winning Chance',
			sg: true,
			type: 'giveaways',
			featureMap: {
				giveaway: this.gwc_addChances.bind(this),
			},
		};
	}

	init() {
		if (
			Settings.get('gptw') ||
			(!this.esgst.enteredPath &&
				(!this.esgst.wonPath ||
					!Settings.get('cewgd') ||
					!Settings.get('cewgd_w') ||
					!Settings.get('cewgd_w_e')))
		)
			return;
		this.esgst.endlessFeatures.push(this.gwc_addHeading.bind(this));
	}

	gwc_addChances(giveaways, main, source) {
		giveaways.forEach((giveaway) => {
			if (
				giveaway.sgTools ||
				(main &&
					(this.esgst.createdPath ||
						(this.esgst.wonPath &&
							(!Settings.get('cewgd') || !Settings.get('cewgd_w') || !Settings.get('cewgd_w_e'))) ||
						this.esgst.newGiveawayPath ||
						this.esgst.archivePath))
			)
				return;
			if (
				((giveaway.inviteOnly &&
					((main &&
						(this.esgst.giveawayPath ||
							this.esgst.enteredPath ||
							(this.esgst.wonPath &&
								Settings.get('cewgd') &&
								Settings.get('cewgd_w') &&
								Settings.get('cewgd_w_e')))) ||
						!main ||
						giveaway.ended ||
						giveaway.id)) ||
					!giveaway.inviteOnly) &&
				!giveaway.innerWrap.getElementsByClassName('esgst-gwc')[0]
			) {
				if (giveaway.started) {
					giveaway.gwcContext = createElements(
						giveaway.panel,
						Settings.get('gv') &&
							((main && this.esgst.giveawaysPath) ||
								(source === 'gb' && Settings.get('gv_gb')) ||
								(source === 'ged' && Settings.get('gv_ged')) ||
								(source === 'ge' && Settings.get('gv_ge')))
							? 'afterbegin'
							: 'beforeend',
						[
							{
								attributes: {
									class: `${this.esgst.giveawayPath ? 'featured__column' : ''} esgst-gwc`,
									['data-draggable-id']: 'gwc',
									title: getFeatureTooltip('gwc', 'Giveaway Winning Chance'),
								},
								type: 'div',
							},
						]
					);
					this.gwc_addChance(giveaway);
				} else {
					giveaway.chance = 100;
					giveaway.projectedChance = 100;
					giveaway.chancePerPoint = giveaway.chance / Math.max(1, giveaway.points);
					giveaway.projectedChancePerPoint = giveaway.chancePerPoint;
				}
			}
		});
	}

	gwc_addChance(giveaway) {
		let advancedChance = 0,
			advancedColor,
			basicChance,
			basicColor,
			colors,
			entries,
			i;
		entries =
			giveaway.entered || giveaway.ended || giveaway.created || !Settings.get('gwc_e')
				? giveaway.entries
				: giveaway.entries + 1;
		basicChance = entries > 0 ? (giveaway.copies / entries) * 100 : 100;
		basicChance = basicChance > 100 ? 100 : basicChance <= 0 ? 0.01 : basicChance;
		if (Settings.get('gwc_a') && !giveaway.ended && giveaway.startTime) {
			advancedChance =
				entries > 0
					? (giveaway.copies /
							((entries / (Date.now() - giveaway.startTime)) *
								(giveaway.endTime - giveaway.startTime))) *
					  100
					: 100;
			advancedChance = advancedChance > 100 ? 100 : advancedChance <= 0 ? 0.01 : advancedChance;
		}
		giveaway.chance = basicChance;
		giveaway.projectedChance = advancedChance;
		giveaway.chancePerPoint = giveaway.chance / Math.max(1, giveaway.points);
		giveaway.projectedChancePerPoint = giveaway.projectedChance / Math.max(1, giveaway.points);
		if (giveaway.points) {
			giveaway.gwcContext.title = getFeatureTooltip(
				'gwc',
				`Giveaway Winning Chance (${common.round(
					giveaway.chancePerPoint,
					4
				)}% basic and ${common.round(giveaway.projectedChancePerPoint)}% advanced per point)`
			);
		}
		giveaway.gwcContext.setAttribute('data-chance', giveaway.chance);
		giveaway.gwcContext.setAttribute('data-projectedChance', giveaway.projectedChance);
		for (i = Settings.get('gwc_colors').length - 1; i > -1; --i) {
			colors = Settings.get('gwc_colors')[i];
			if (basicChance >= parseFloat(colors.lower) && basicChance <= parseFloat(colors.upper)) {
				basicColor = colors.color;
				break;
			}
		}
		for (i = Settings.get('gwc_colors').length - 1; i > -1; --i) {
			colors = Settings.get('gwc_colors')[i];
			if (
				advancedChance >= parseFloat(colors.lower) &&
				advancedChance <= parseFloat(colors.upper)
			) {
				advancedColor = colors.color;
				break;
			}
		}
		if (Settings.get('gwc_h')) {
			giveaway.headingName.classList.add('esgst-gwc-highlight');
			giveaway.headingName.style.color =
				Settings.get('gwc_a') && !Settings.get('gwc_a_b') ? advancedColor : basicColor;
			if (giveaway.image) {
				giveaway.image.classList.add('esgst-gwc-highlight');
				giveaway.image.style.color = `${
					Settings.get('gwc_a') && !Settings.get('gwc_a_b') ? advancedColor : basicColor
				}`;
				giveaway.image.style.boxShadow = `${
					Settings.get('gwc_a') && !Settings.get('gwc_a_b') ? advancedColor : basicColor
				} 0px 0px 0px var(--esgst-gwc-highlight-width, 3px) inset`;
			}
		}
		if (this.esgst.enteredPath || this.esgst.wonPath) {
			giveaway.gwcContext.style.display = 'inline-block';
		}
		const items = [];
		if (!this.esgst.enteredPath && !this.esgst.wonPath) {
			items.push({
				attributes: {
					class: 'fa fa-area-chart',
				},
				type: 'i',
			});
		}
		const children = [];
		const basicAttributes = {};
		if (basicColor) {
			basicAttributes.style = `color: ${basicColor}; font-weight: bold;`;
		}
		const advancedAttributes = {};
		if (advancedColor) {
			advancedAttributes.style = `color: ${advancedColor}; font-weight: bold;`;
		}
		if (Settings.get('gwc_a') && advancedChance) {
			if (Settings.get('gwc_a_b')) {
				children.push(
					{
						attributes: basicAttributes,
						text: `${common.round(basicChance)}%`,
						type: 'span',
					},
					{
						text: ` (`,
						type: 'node',
					},
					{
						attributes: advancedAttributes,
						text: `${common.round(advancedChance)}%`,
						type: 'span',
					},
					{
						text: `)`,
						type: 'node',
					}
				);
			} else {
				children.push({
					attributes: advancedAttributes,
					text: `${common.round(advancedChance)}%`,
					type: 'span',
				});
			}
		} else {
			children.push({
				attributes: basicAttributes,
				text: `${common.round(basicChance)}%`,
				type: 'span',
			});
		}
		items.push({
			type: 'span',
			children,
		});
		if ((this.esgst.enteredPath || this.esgst.wonPath) && Settings.get('gwr')) {
			items.push({
				text: ' / ',
				type: 'node',
			});
		}
		createElements(giveaway.gwcContext, 'atinner', items);
	}

	gwc_addHeading(context, main, source, endless) {
		if (
			this.esgst.createdPath ||
			(this.esgst.wonPath &&
				(!Settings.get('cewgd') || !Settings.get('cewgd_w') || !Settings.get('cewgd_w_e'))) ||
			!main
		)
			return;
		const table = context.querySelector(
			`${
				endless
					? `.esgst-es-page-${endless} .table__heading, .esgst-es-page-${endless}.table__heading`
					: '.table__heading'
			}`
		);
		if (!table || table.getElementsByClassName('esgst-gwcr-heading')[0]) return;
		let title = '';
		if (Settings.get('gwc')) {
			title += 'Chance / ';
		}
		if (Settings.get('gwr')) {
			title += 'Ratio / ';
		}
		if (Settings.get('gptw')) {
			title += 'Points To Win / ';
		}
		title = title.slice(0, -3);
		createElements(table.firstElementChild, 'afterend', [
			{
				attributes: {
					class: 'table__column--width-small text-center esgst-gwcr-heading',
				},
				text: title,
				type: 'div',
			},
		]);
	}
}

const giveawaysGiveawayWinningChance = new GiveawaysGiveawayWinningChance();

export { giveawaysGiveawayWinningChance };
