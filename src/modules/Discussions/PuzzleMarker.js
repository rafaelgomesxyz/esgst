import { Button } from '../../class/Button';
import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const
	createLock = common.createLock.bind(common),
	getValue = common.getValue.bind(common),
	setValue = common.setValue.bind(common)
	;

class DiscussionsPuzzleMarker extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Adds a checkbox in front of a discussion categorized as "Puzzles" (in any page) that changes states (`,
						['i', { class: 'fa fa-circle-o esgst-grey' }],
						`  by default, `,
						['i', { class: 'fa fa-times-circle esgst-red' }],
						`  for "unsolved", `,
						['i', { class: 'fa fa-exclamation-circle esgst-orange' }],
						'  for "in progress" and ',
						['i', { class: 'fa fa-check-circle esgst-green' }],
						`for "solved") and allows you to mark the puzzle as unsolved/in progress / solved.`
					]]
				]]
			],
			features: {
				pm_a: {
					name: `Show the checkbox for all discussions, regardless of their category.`,
					sg: true
				}
			},
			id: 'pm',
			name: 'Puzzle Marker',
			sg: true,
			type: 'discussions',
			featureMap: {
				discussion: this.pm_addButtons.bind(this)
			}
		};
	}

	pm_addButtons(discussions, main) {
		for (const discussion of discussions) {
			if (Settings.get('pm_a') || discussion.category === 'Puzzles') {
				let context = main && this.esgst.discussionPath ? discussion.headingContainer : discussion.outerWrap;
				if (!context.getElementsByClassName('esgst-pm-button')[0]) {
					context.classList.add('esgst-relative');
					new Button(context, 'afterBegin', {
						callbacks: [this.pm_change.bind(this, discussion.code, 'unsolved'), null, this.pm_change.bind(this, discussion.code, 'in progress'), null, this.pm_change.bind(this, discussion.code, 'solved'), null, this.pm_change.bind(this, discussion.code, 'off'), null],
						className: 'esgst-pm-button',
						icons: ['fa-circle-o esgst-clickable esgst-grey', 'fa-circle-o-notch fa-spin', 'fa-times-circle esgst-clickable esgst-red', 'fa-circle-o-notch fa-spin', 'fa-exclamation-circle esgst-clickable esgst-orange', 'fa-circle-o-notch fa-spin', 'fa-check-circle esgst-clickable esgst-green', 'fa-circle-o-notch fa-spin'],
						id: 'pm',
						index: ['off', '', 'unsolved', '', 'in progress', '', 'solved'].indexOf((discussion.saved && discussion.saved.status) || 'off'),
						titles: [`Current status is 'off', click to change to 'unsolved'`, 'Changing status...', `Current status is 'unsolved', click to change to 'in progress'`, 'Changing status...', `Current status is 'in progress', click to change to 'solved'`, 'Changing status...', `Current status is 'solved', click to change to 'off'`, 'Changing status...']
					});
				}
			}
		}
	}

	async pm_change(code, status) {
		let deleteLock = await createLock('commentLock', 300);
		let discussions = JSON.parse(getValue('discussions'));
		if (!discussions[code]) {
			discussions[code] = {
				readComments: {}
			};
		}
		if (status === 'off') {
			delete discussions[code].status;
		} else {
			discussions[code].status = status;
		}
		discussions[code].lastUsed = Date.now();
		await setValue('discussions', JSON.stringify(discussions));
		deleteLock();
		return true;
	}
}

const discussionsPuzzleMarker = new DiscussionsPuzzleMarker();

export { discussionsPuzzleMarker };