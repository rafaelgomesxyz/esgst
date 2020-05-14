import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';

class GeneralVisibleAttachedImages extends Module {
	constructor() {
		super();
		this.info = {
			conflicts: [
				'ail'
			],
			description: [
				['ul', [
					['li', `Displays all of the attached images (in any page) by default so that you do not need to click on "View attached image" to view them.`]
				]]
			],
			features: {
				vai_gifv: {
					name: 'Rename .gifv images to .gif so that they are properly attached.',
					sg: true,
					st: true
				}
			},
			id: 'vai',
			name: 'Visible Attached Images',
			sg: true,
			st: true,
			type: 'general',
			featureMap: {
				endless: this.vai_getImages.bind(this)
			}
		};
	}

	vai_getImages(context, main, source, endless) {
		let buttons = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached` : '.comment__toggle-attached'}, ${endless ? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached` : '.view_attached'}`);
		for (let i = 0, n = buttons.length; i < n; i++) {
			let button = buttons[i];
			let image = button.nextElementSibling.firstElementChild;
			let url = image.getAttribute('src');
			if (url && Settings.get('vai_gifv')) {
				url = url.replace(/\.gifv/, '.gif');
				image.setAttribute('src', url);
			}
			image.classList.remove('is_hidden', 'is-hidden');
		}
	}
}

const generalVisibleAttachedImages = new GeneralVisibleAttachedImages();

export { generalVisibleAttachedImages };