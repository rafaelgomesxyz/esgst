import { DOM } from '../../class/DOM';
import { EventDispatcher } from '../../class/EventDispatcher';
import { Module } from '../../class/Module';
import { Events } from '../../constants/Events';

class GeneralFixedMainPageHeading extends Module {
	constructor() {
		super();
		this.info = {
			description: () => (
				<ul>
					<li>
						Keeps the main page heading (usually the first heading of the page, for example, the
						heading that says "Giveaways" in the main page) of any page at the top of the window
						while you scroll down the page.
					</li>
				</ul>
			),
			id: 'fmph',
			name: 'Fixed Main Page Heading',
			sg: true,
			st: true,
			type: 'general',
		};
	}

	init() {
		EventDispatcher.subscribe(Events.PAGE_HEADING_BUILD, (builtHeading) =>
			builtHeading.nodes.outer.classList.add('esgst-fmph')
		);

		if (!this.esgst.pageHeadings.length) {
			return;
		}

		this.esgst.style.insertAdjacentText(
			'beforeend',
			`
			.esgst-fmph {
				top: ${this.esgst.pageTop}px;
			}
		`
		);

		for (const pageHeading of this.esgst.pageHeadings) {
			pageHeading.classList.add('esgst-fmph');
		}
	}
}

const generalFixedMainPageHeading = new GeneralFixedMainPageHeading();

export { generalFixedMainPageHeading };
