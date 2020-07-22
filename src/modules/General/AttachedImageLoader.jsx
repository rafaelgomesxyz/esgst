import { Module } from '../../class/Module';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

class GeneralAttachedImageLoader extends Module {
	constructor() {
		super();
		this.info = {
			conflicts: ['vai'],
			description: () => (
				<ul>
					<li>
						Only loads an attached image (in any page) when you click on its "View attached image"
						button, instead of loading it on page load, which should speed up page loads.
					</li>
				</ul>
			),
			id: 'ail',
			name: 'Attached Image Loader',
			sg: true,
			st: true,
			type: 'general',
		};
	}

	init() {
		if (Settings.get('vai')) return;
		this.esgst.endlessFeatures.push(this.ail_getImages.bind(this));
	}

	ail_getImages(context, main, source, endless) {
		const buttons = context.querySelectorAll(
			`${
				endless
					? `.esgst-es-page-${endless} .comment__toggle-attached, .esgst-es-page-${endless}.comment__toggle-attached`
					: '.comment__toggle-attached'
			}, ${
				endless
					? `.esgst-es-page-${endless} .view_attached, .esgst-es-page-${endless}.view_attached`
					: '.view_attached'
			}`
		);
		for (let i = 0, n = buttons.length; i < n; i++) {
			const button = buttons[i],
				image = button.nextElementSibling.firstElementChild,
				url = image.getAttribute('src');
			image.removeAttribute('src');
			button.addEventListener('click', image.setAttribute.bind(image, 'src', url));
		}
	}
}

const generalAttachedImageLoader = new GeneralAttachedImageLoader();

export { generalAttachedImageLoader };
