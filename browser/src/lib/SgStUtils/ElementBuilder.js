import { DOM } from '../../class/DOM';

const CLASS_NAMES = {
	sg: {
		pageHeading: 'page__heading',
		pageHeadingBreadcrumbs: 'page__heading__breadcrumbs',
		pageHeadingButton: 'page__heading__button'
	},
	st: {
		pageHeading: 'page_heading',
		pageHeadingBreadcrumbs: 'page_heading_breadcrumbs',
		pageHeadingButton: 'page_heading_btn'
	}
};

class SgNotification {
	/**
	 * @param {Object} [options]
	 * @param {HTMLElement} [options.context]
	 * @param {String} [options.position]
	 * @param {"success"|"warning"} options.type
	 * @param {String[]} options.icons
	 * @param {String} options.message
	 */
	constructor(options) {
		options = Object.assign({
			context: null,
			position: null,
			type: 'warning',
			icons: [],
			message: ''
		}, options);
		DOM.build(options.context, options.position, [
			['div', { ref: ref => this.notification = ref }, [
				['i', { ref: ref => this.icon = ref }],
				' ',
				['span', { ref: ref => this.message = ref }]
			]]
		]);
		this.setType(options.type);
		this.setIcons(options.icons);
		this.setMessage(options.message);
	}

	setType(type) {
		this.notification.className = `notification notification--${type} notification--margin-top-small`;
	}

	setIcons(icons) {
		this.icon.className = `fa fa-fw ${icons.join(' ')}`;
	}

	setMessage(text) {
		this.message.textContent = text;
	}
}

class PageHeading {
	/**
	 * @param {Object} options
	 * @param {"sg"|"st"} namespace
	 */
	constructor(options, namespace) {
		this.namespace = namespace;
		options = Object.assign({
			context: null,
			position: null
		}, options);
		DOM.build(options.context, options.position, [
			['div', { class: CLASS_NAMES[this.namespace].pageHeading, ref: ref => this.pageHeading = ref }, [
				['div', { class: CLASS_NAMES[this.namespace].pageHeadingBreadcrumbs, ref: ref => this.breadcrumbs = ref }]
			]]
		]);
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
				typeof breadcrumb === 'string' || Array.isArray(breadcrumb)
					? ['span', breadcrumb]
					: ['a', { href: breadcrumb.url }, breadcrumb.name],
				['i', { class: 'fa fa-angle-right' }]
			);
		}
		DOM.build(this.breadcrumbs, 'inner', items.slice(0, -1));
	}

	addButtons(buttons) {
		for (const button of buttons) {
			this.addButton(button);
		}
	}

	addButton(options) {
		let icons = [];
		for (const icon of options.icons) {
			icons.push(
				['i', { class: `fa ${icon}`, style: `margin: 0` }],
				' '
			);
		}
		return DOM.build(this.pageHeading, options.position, [
			['a', { class: `${CLASS_NAMES[this.namespace].pageHeadingButton} is-clickable`, title: options.title, onclick: options.onclick, ref: ref => options.ref = ref, style: `display: inline-block;` }, icons.slice(0, -1)]
		]);
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
		notification: SgNotification,
		pageHeading: SgPageHeading
	},
	st: {
		pageHeading: StPageHeading
	}
};

export { elementBuilder };