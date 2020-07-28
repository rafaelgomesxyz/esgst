import { DOM } from '../../class/DOM';
import { Module } from '../../class/Module';
import { Button } from '../../components/Button';
import { common } from '../Common';

const getFeatureTooltip = common.getFeatureTooltip.bind(common);
class GiveawaysGiveawayPopup extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-external-link"></i> ) below a giveaway's start time
						(in any page) that allows you to read the description of the giveaway and/or add a
						comment to it without having to access it.
					</li>
					<li>You can move the button around by dragging and dropping it.</li>
				</ul>
			),
			id: 'gp',
			name: 'Giveaway Popup',
			sg: true,
			type: 'giveaways',
			featureMap: {
				giveaway: this.gp_addButton.bind(this),
			},
		};
	}

	gp_addButton(giveaways, main, source) {
		giveaways.forEach((giveaway) => {
			if (
				giveaway.sgTools ||
				(main &&
					(this.esgst.createdPath ||
						this.esgst.enteredPath ||
						this.esgst.wonPath ||
						this.esgst.giveawayPath ||
						this.esgst.newGiveawayPath))
			)
				return;
			if (
				!giveaway.innerWrap.getElementsByClassName('esgst-gp-button')[0] &&
				(!giveaway.inviteOnly || giveaway.url)
			) {
				let button;
				const onClick = () => {
					return new Promise((resolve) => {
						// noinspection JSIgnoredPromiseFromCall
						this.esgst.modules.giveawaysEnterLeaveGiveawayButton.elgb_openPopup(
							giveaway,
							main,
							source,
							(error) => {
								if (error) {
									button.build(3);
								} else {
									button.build(1);
								}
								resolve();
							}
						);
					});
				};
				button = Button.create({
					additionalContainerClass: 'esgst-gp-button',
					states: [
						{
							color: 'white',
							tooltip: getFeatureTooltip('gp', 'View giveaway description / add a comment'),
							icons: ['fa-external-link'],
							name: '',
							switchTo: { onReturn: 1 },
							onClick,
						},
						{
							template: 'loading',
							isDisabled: true,
							name: '',
						},
						{
							template: 'error',
							tooltip: getFeatureTooltip('gp', 'Could not access giveaway'),
							name: '',
							switchTo: { onReturn: 3 },
							onClick,
						},
						{
							template: 'loading',
							isDisabled: true,
							name: '',
						},
					],
				}).insert(giveaway.panel, 'beforeend');
				button.nodes.outer.setAttribute('data-draggable-id', 'gp');
			}
		});
	}
}

const giveawaysGiveawayPopup = new GiveawaysGiveawayPopup();

export { giveawaysGiveawayPopup };
