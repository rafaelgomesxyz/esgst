import { Namespaces } from './Namespaces';

export type Color = 'white' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export type ButtonColor = Exclude<Color, 'blue'> | 'alternate-white';

export type NotificationColor = Exclude<Color, 'white'>;

export const EsgstClassNames = {
	button: 'esgst-button',
	buttonContainer: 'esgst-button-container',
	mmButtonGroup: 'esgst-mm-button-group',
	notification: 'esgst-notification-bar',
};

export const ClassNames = {
	[Namespaces.SG]: {
		button: {
			root: '',
			colors: {
				white: 'form__saving-button',
				'alternate-white': 'page__heading__button',
				green: 'form__submit-button',
				yellow: 'sidebar__entry-delete',
				red: 'sidebar__error',
				gray: 'form__saving-button form__saving-button--gray',
			},
			reversedColors: {
				'form__saving-button': 'white',
				page__heading__button: 'alternate-white',
				'form__submit-button': 'green',
				'sidebar__entry-delete': 'yellow',
				sidebar__error: 'red',
				'form__saving-button form__saving-button--gray': 'gray',
			},
		},
		disabled: 'is-disabled',
		giveawayColumns: 'giveaway__columns',
		hidden: 'is-hidden',
		notification: {
			root: 'notification',
			marginTop: 'notification--margin-top-small',
			colors: {
				blue: 'notification--info',
				green: 'notification--success',
				yellow: 'notification--warning',
				red: 'notification--danger',
				gray: 'notification--default',
			},
			reversedColors: {
				'notification--info': 'blue',
				'notification--success': 'green',
				'notification--warning': 'yellow',
				'notification--danger': 'red',
				'notification--default': 'gray',
			},
		},
		pageHeading: 'page__heading',
		pageHeadingBreadcrumbs: 'page__heading__breadcrumbs',
		pageHeadingButton: 'page__heading__button',
		selected: 'is-selected',
	},
	[Namespaces.ST]: {
		button: {
			root: 'btn_action',
			colors: {
				white: 'white',
				'alternate-white': 'page_heading_btn',
				green: 'green',
				yellow: 'yellow',
				red: 'red',
				gray: 'grey',
			},
			reversedColors: {
				white: 'white',
				page_heading_btn: 'alternate-white',
				green: 'green',
				yellow: 'yellow',
				red: 'red',
				grey: 'gray',
			},
		},
		disabled: 'is_disabled',
		hidden: 'is_hidden',
		notification: {
			root: 'notification',
			marginTop: '',
			colors: {
				blue: 'blue',
				green: 'green',
				yellow: 'yellow',
				red: 'red',
				gray: 'gray',
			},
			reversedColors: {
				blue: 'blue',
				green: 'green',
				yellow: 'yellow',
				red: 'red',
				gray: 'gray',
			},
		},
		pageHeading: 'page_heading',
		pageHeadingBreadcrumbs: 'page_heading_breadcrumbs',
		pageHeadingButton: 'page_heading_btn',
		selected: 'is_selected',
	},
};
