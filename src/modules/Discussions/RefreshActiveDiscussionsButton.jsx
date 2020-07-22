import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const checkMissingDiscussions = common.checkMissingDiscussions.bind(common),
	getFeatureTooltip = common.getFeatureTooltip.bind(common);
class DiscussionsRefreshActiveDiscussionsButton extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Adds a button (<i className="fa fa-refresh"></i>) to the page heading of the active
						discussions (in the main page) that allows you to refresh the active discussions without
						having to refresh the entire page.
					</li>
				</ul>
			),
			id: 'radb',
			name: 'Refresh Active Discussions Button',
			sg: true,
			type: 'discussions',
		};
	}

	radb_addButtons() {
		let elements, i;
		elements = this.esgst.activeDiscussions.querySelectorAll(
			`.homepage_heading, .esgst-heading-button`
		);
		for (i = elements.length - 1; i > -1; --i) {
			DOM.insert(
				elements[i],
				'beforebegin',
				<div
					className={`esgst-radb-button${Settings.get('oadd') ? '' : ' homepage_heading'}`}
					title={getFeatureTooltip('radb', 'Refresh active discussions/deals')}
					onclick={(event) => {
						let icon = event.currentTarget.firstElementChild;
						icon.classList.add('fa-spin');
						if (Settings.get('oadd')) {
							// noinspection JSIgnoredPromiseFromCall
							this.esgst.modules.discussionsOldActiveDiscussionsDesign.oadd_load(true, () => {
								icon.classList.remove('fa-spin');
							});
						} else {
							checkMissingDiscussions(true, () => {
								icon.classList.remove('fa-spin');
							});
						}
					}}
				>
					<i className="fa fa-refresh"></i>
				</div>
			);
		}
	}
}

const discussionsRefreshActiveDiscussionsButton = new DiscussionsRefreshActiveDiscussionsButton();

export { discussionsRefreshActiveDiscussionsButton };
