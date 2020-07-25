import { DOM } from '../../class/DOM';
import { Settings } from '../../class/Settings';

const CLASS_NAMES = {
	sg: {
		pageHeading: 'page__heading',
		pageHeadingBreadcrumbs: 'page__heading__breadcrumbs',
		pageHeadingButton: 'page__heading__button',
	},
	st: {
		pageHeading: 'page_heading',
		pageHeadingBreadcrumbs: 'page_heading_breadcrumbs',
		pageHeadingButton: 'page_heading_btn',
	},
};

class PageHeading {
	/**
	 * @param {Object} options
	 * @param {"sg"|"st"} namespace
	 */
	constructor(options, namespace) {
		this.namespace = namespace;
		options = Object.assign(
			{
				context: null,
				position: null,
			},
			options
		);
		this.pageHeading = (
			<div className={CLASS_NAMES[this.namespace].pageHeading}>
				<div
					className={CLASS_NAMES[this.namespace].pageHeadingBreadcrumbs}
					ref={(ref) => (this.breadcrumbs = ref)}
				></div>
			</div>
		);
		if (options.context && options.position) {
			DOM.insert(options.context, options.position, this.pageHeading);
		}
		if (Settings.get('fmph')) {
			this.pageHeading.classList.add('esgst-fmph');
		}
		if (options.breadcrumbs) {
			this.setBreadcrumbs(options.breadcrumbs);
		}
		if (options.buttons) {
			this.addButtons(options.buttons);
		}
	}

	setBreadcrumbs(breadcrumbs) {
		const items = [];
		for (const breadcrumb of breadcrumbs) {
			items.push(
				typeof breadcrumb === 'string' || breadcrumb instanceof Node ? (
					<span>{breadcrumb}</span>
				) : (
					<a href={breadcrumb.url}>{breadcrumb.name}</a>
				),
				<i className="fa fa-angle-right"></i>
			);
		}
		DOM.insert(this.breadcrumbs, 'atinner', <fragment>{items.slice(0, -1)}</fragment>);
	}

	addButtons(buttons) {
		for (const button of buttons) {
			this.addButton(button);
		}
	}

	addButton(options) {
		let icons = [];
		for (const icon of options.icons) {
			icons.push(<i className={`fa ${icon}`} style={{ margin: '0' }}></i>, ' ');
		}
		let button;
		DOM.insert(
			this.pageHeading,
			options.position,
			<a
				className={`${CLASS_NAMES[this.namespace].pageHeadingButton} is-clickable`}
				title={options.title}
				onclick={options.onclick}
				ref={(ref) => (button = ref)}
				style={{ display: 'inline-block' }}
			>
				{icons.slice(0, -1)}
			</a>
		);
		if (options.ref) {
			options.ref(button);
		}
		return button;
	}
}

class SgPageHeading extends PageHeading {
	constructor(options) {
		super(options, 'sg');
	}
}

class StPageHeading extends PageHeading {
	constructor(options) {
		super(options, 'st');
	}
}

const elementBuilder = {
	sg: {
		pageHeading: SgPageHeading,
	},
	st: {
		pageHeading: StPageHeading,
	},
};

export { elementBuilder };
