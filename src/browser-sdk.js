import { v4 as uuidv4 } from 'uuid';
import { setBrowser } from './browser';

const browser = {
	gm: null,
	runtime: {
		getBrowserInfo: () => Promise.resolve({ name: '?' }),
		onMessage: {
			addListener: (callback) => {
				// @ts-ignore
				self.port.on('esgstMessage', (obj) => callback(obj));
			},
		},
		getManifest: () => {
			return new Promise((resolve) => {
				browser.runtime
					.sendMessage({
						action: 'getPackageJson',
					})
					.then((result) => {
						resolve(JSON.parse(result));
					});
			});
		},
		sendMessage: (obj) => {
			return new Promise((resolve) => {
				obj.uuid = uuidv4();
				// @ts-ignore
				self.port.emit(obj.action, obj);
				// @ts-ignore
				self.port.on(`${obj.action}_${obj.uuid}_response`, function onResponse(result) {
					// @ts-ignore
					self.port.removeListener(`${obj.action}_${obj.uuid}_response`, 'onResponse');
					resolve(result);
				});
			});
		},
	},
	storage: {
		local: {
			get: async () => {
				return JSON.parse(
					await browser.runtime.sendMessage({
						action: 'getStorage',
					})
				);
			},
			remove: async (keys) => {
				await browser.runtime.sendMessage({
					action: 'delValues',
					keys: JSON.stringify(keys),
				});
			},
			set: async (values) => {
				await browser.runtime.sendMessage({
					action: 'setValues',
					values: JSON.stringify(values),
				});
			},
		},
		onChanged: {
			addListener: () => {},
		},
	},
};

setBrowser(browser);
