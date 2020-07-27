import { Namespaces } from './Namespaces';

export type NotificationColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export const EsgstClassNames = {
	notification: 'esgst-notification-bar',
};

export const ClassNames = {
	[Namespaces.SG]: {
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
	},
	[Namespaces.ST]: {
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
	},
};
