import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const createElements = common.createElements.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common);
class GiveawaysGiveawayPointsToWin extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds an element (<i className="fa fa-rub"></i>[Points]) below a giveaway's start time
						(in any page) that shows how many points you would have to spend to win the giveaway.
					</li>
					<li>
						The points are calculated by rounding up (using 2 decimals) the result of the following
						formula: number_of_points / number_of_copies * number_of_entries
					</li>
					<li>You can move the element around by dragging and dropping it.</li>
				</ul>
			),
			features: {
				gptw_e: {
					description: () => (
						<ul>
							<li>
								The formula changes to: number_of_points / number_of_copies * (number_of_entries +
								1)
							</li>
							<li>
								For example, if a giveaway for 2 copies has 5 entries and is worth 10 points, the
								current points to win are 25, but after you enter it, it will have 6 entries, so the
								points will increase to 30.
							</li>
						</ul>
					),
					name:
						'Show what the points to win will be when you enter the giveaway instead of the current points to win.',
					sg: true,
				},
			},
			id: 'gptw',
			name: 'Giveaway Points To Win',
			sg: true,
			type: 'giveaways',
			featureMap: {
				giveaway: this.gptw_addPoints.bind(this),
			},
		};
	}

	init() {
		if (
			!this.esgst.enteredPath &&
			(!this.esgst.wonPath ||
				!Settings.get('cewgd') ||
				!Settings.get('cewgd_w') ||
				!Settings.get('cewgd_w_e'))
		)
			return;
		this.esgst.endlessFeatures.push(
			this.esgst.modules.giveawaysGiveawayWinningChance.gwc_addHeading.bind(this)
		);
	}

	gptw_addPoints(giveaways, main, source) {
		for (const giveaway of giveaways) {
			if (
				giveaway.sgTools ||
				(main &&
					(this.esgst.createdPath ||
						(this.esgst.wonPath &&
							(!Settings.get('cewgd') || !Settings.get('cewgd_w') || !Settings.get('cewgd_w_e'))) ||
						this.esgst.newGiveawayPath ||
						this.esgst.archivePath))
			) {
				continue;
			}
			if (
				((!giveaway.inviteOnly ||
					((!main ||
						(!this.esgst.giveawayPath &&
							!this.esgst.enteredPath &&
							(!this.esgst.wonPath ||
								!Settings.get('cewgd') ||
								!Settings.get('cewgd_w') ||
								!Settings.get('cewgd_w_e')))) &&
						main &&
						!giveaway.ended &&
						!giveaway.id)) &&
					giveaway.inviteOnly) ||
				giveaway.innerWrap.getElementsByClassName('esgst-gptw')[0]
			) {
				continue;
			}
			if (giveaway.started) {
				giveaway.gptwContext = createElements(
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
								class: `${this.esgst.giveawayPath ? 'featured__column' : ''} esgst-gptw`,
								['data-draggable-id']: 'gptw',
								title: getFeatureTooltip('gptw', 'Giveaway Points To Win'),
							},
							type: 'div',
						},
					]
				);
				this.gptw_addPoint(giveaway);
			} else {
				giveaway.pointsToWin = 0;
			}
		}
	}

	gptw_addPoint(giveaway) {
		const entries =
			giveaway.entered || giveaway.ended || giveaway.created || !Settings.get('gptw_e')
				? giveaway.entries
				: giveaway.entries + 1;
		giveaway.pointsToWin =
			Math.round(((giveaway.points || 0) / giveaway.copies) * entries * 100) / 100;
		giveaway.gptwContext.setAttribute('data-pointsToWin', giveaway.pointsToWin);
		let color = null;
		for (const colors of Settings.get('gptw_colors')) {
			if (
				giveaway.pointsToWin >= parseFloat(colors.lower) &&
				giveaway.pointsToWin <= parseFloat(colors.upper)
			) {
				color = colors.color;
				break;
			}
		}
		if (this.esgst.enteredPath || this.esgst.wonPath) {
			giveaway.gptwContext.style.display = 'inline-block';
		}
		const items = [];
		if (!this.esgst.enteredPath && !this.esgst.wonPath) {
			items.push({
				attributes: {
					class: 'fa fa-rub',
				},
				type: 'i',
			});
		}
		const attributes = {};
		if (color) {
			attributes.style = `color: ${color}; font-weight: bold;`;
		}
		items.push({
			attributes,
			text: giveaway.pointsToWin,
			type: 'span',
		});
		createElements(giveaway.gptwContext, 'atinner', items);
	}
}

const giveawaysGiveawayPointsToWin = new GiveawaysGiveawayPointsToWin();

export { giveawaysGiveawayPointsToWin };
