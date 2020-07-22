import { Module } from '../../class/Module';
import { common } from '../Common';
import { Settings } from '../../class/Settings';
import { DOM } from '../../class/DOM';

const getFeatureTooltip = common.getFeatureTooltip.bind(common);
class GeneralPaginationNavigationOnTop extends Module {
	constructor() {
		super();
		this.info = {
			description: [
				[
					'ul',
					[
						[
							'li',
							'Moves the pagination navigation of any page to the main page heading of the page.',
						],
					],
				],
			],
			features: {
				pnot_s: {
					name: `Enable simplified view (will show only the numbers and arrows).`,
					sg: true,
					st: true,
				},
			},
			id: 'pnot',
			name: 'Pagination Navigation On Top',
			sg: true,
			st: true,
			type: 'general',
		};
	}

	init() {
		if (!this.esgst.paginationNavigation || !this.esgst.mainPageHeading) return;

		if (this.esgst.st) {
			this.esgst.paginationNavigation.classList.add('page_heading_btn');
		}
		this.esgst.paginationNavigation.title = getFeatureTooltip('pnot');
		this.pnot_simplify();
		DOM.insert(
			this.esgst.mainPageHeading.querySelector(
				`.page__heading__breadcrumbs, .page_heading_breadcrumbs`
			),
			'afterend',
			this.esgst.paginationNavigation
		);
	}

	pnot_simplify() {
		if (Settings.get('pnot') && Settings.get('pnot_s')) {
			const elements = this.esgst.paginationNavigation.querySelectorAll('span');
			// @ts-ignore
			for (const element of elements) {
				if (element.textContent.match(/[A-Za-z]+/)) {
					element.textContent = element.textContent.replace(/[A-Za-z]+/g, '');
					if (element.previousElementSibling) {
						element.appendChild(element.previousElementSibling);
					}
					if (element.nextElementSibling) {
						element.appendChild(element.nextElementSibling);
					}
				}
			}
		}
	}
}

const generalPaginationNavigationOnTop = new GeneralPaginationNavigationOnTop();

export { generalPaginationNavigationOnTop };
