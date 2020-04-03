import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { common } from '../Common';
import { Settings } from '../../class/Settings';

const
	createHeadingButton = common.createHeadingButton.bind(common)
	;

class DiscussionsMainPostPopup extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				['ul', [
					['li', [
						`Hides the main post of a discussion and adds a button (`,
						['i', { class: 'fa fa-home' }],
						`) to its main page heading that allows you to open the main post through a popup.`
					]],
					['li', `This feature is useful if you have [id=fmph] enabled, which allows you to view the main post of a discussion from any scrolling position.`]
				]]
			],
			features: {
				mpp_r: {
					dependencies: ['ct'],
					name: 'Only hide the main post if it has been marked as read.',
					sg: true
				}
			},
			id: 'mpp',
			name: 'Main Post Popup',
			sg: true,
			type: 'discussions'
		};
	}

	init() {
		if (!this.esgst.discussionPath) {
			return;
		}
		let button = createHeadingButton({ id: 'mpp', icons: ['fa-home'], title: 'Open the main post' });
		let MPPPost = document.createElement('div');
		MPPPost.className = 'page__outer-wrap';
		let Sibling;
		do {
			Sibling = this.esgst.mainPageHeading.previousElementSibling;
			if (Sibling) {
				MPPPost.insertBefore(Sibling, MPPPost.firstElementChild);
			}
		} while (Sibling);
		this.esgst.mainPageHeading.parentElement.insertBefore(MPPPost, this.esgst.mainPageHeading);
		let Hidden;
		if (Settings.get('mpp_r')) {
			let discussion = JSON.parse(this.esgst.storage.discussions)[window.location.pathname.match(/^\/discussion\/(.+?)\//)[1]];
			if (discussion) {
				if (discussion.readComments && discussion.readComments['']) {
					Hidden = true;
					window.scrollTo(0, 0);
				} else {
					Hidden = false;
				}
			} else {
				Hidden = false;
			}
		} else {
			Hidden = true;
			window.scrollTo(0, 0);
		}
		MPPPost.classList.add(Hidden ? 'esgst-mpp-hidden' : 'esgst-mpp-visible', 'esgst-text-left');
		button.addEventListener('click', () => {
			if (!Hidden) {
				MPPPost.classList.remove('esgst-mpp-visible');
				MPPPost.classList.add('esgst-mpp-hidden');
			}
			let popup = new Popup({ icon: '', title: '', popup: MPPPost });
			MPPPost.classList.add('esgst-mpp-popup');
			popup.open();
			popup.onClose = () => {
				MPPPost.classList.remove('esgst-mpp-popup');
				if (!Hidden) {
					MPPPost.classList.remove('esgst-mpp-hidden');
					MPPPost.classList.add('esgst-mpp-visible');
					MPPPost.removeAttribute('style');
					this.esgst.mainPageHeading.parentElement.insertBefore(MPPPost, this.esgst.mainPageHeading);
				}
			};
		});
	}
}

const discussionsMainPostPopup = new DiscussionsMainPostPopup();

export { discussionsMainPostPopup };