import { setBrowser } from './browser';
import { RequestQueue } from './class/Queue';
import { Shared } from './class/Shared';

RequestQueue.init();

let tdsData = [];

const browser = {
	gm: null,
	runtime: {
		onMessage: {
			addListener: (callback) => (browser.gm.listener = callback),
		},
		getBrowserInfo: () => Promise.resolve({ name: 'userscript' }),
		getManifest: () => Promise.resolve(browser.gm.info.script),
		sendMessage: (obj) => {
			return new Promise(async (resolve) => {
				switch (obj.action) {
					case 'get-tds':
						resolve(JSON.stringify(tdsData));

						break;
					case 'notify-tds':
						tdsData = JSON.parse(obj.data);

						browser.gm.listener(
							JSON.stringify({
								action: 'notify-tds',
								values: tdsData,
							})
						);

						resolve();

						break;
					case 'permissions_contains':
						resolve(true);
						break;
					case 'getBrowserInfo': {
						const browserInfo = await browser.runtime.getBrowserInfo();
						resolve(JSON.stringify(browserInfo));
						break;
					}
					case 'do_lock': {
						const lock = JSON.parse(obj.lock);

						resolve(await browser.gm.doLock(lock));

						break;
					}
					case 'update_lock': {
						const lock = JSON.parse(obj.lock);
						const locked = JSON.parse(await browser.gm.getValue(lock.key, '{}'));
						if (locked.uuid === lock.uuid) {
							locked.timestamp = Date.now();
							await browser.gm.setValue(lock.key, JSON.stringify(locked));
						}
						resolve();
						break;
					}
					case 'do_unlock': {
						const lock = JSON.parse(obj.lock);
						await browser.gm.setValue(lock.key, '{}');
						resolve();
						break;
					}
					case 'fetch': {
						const parameters = JSON.parse(obj.parameters);
						if (parameters.credentials === 'omit') {
							parameters.headers['Esgst-Cookie'] = '';
						}
						browser.gm.xmlHttpRequest({
							binary: !!obj.fileName,
							data: obj.fileName
								? await Shared.common.getZip(parameters.body, obj.fileName, 'binarystring')
								: parameters.body,
							headers: parameters.headers,
							method: parameters.method,
							overrideMimeType: obj.blob ? `text/plain; charset=x-user-defined` : '',
							url: obj.url,
							onload: async (response) => {
								if (obj.blob) {
									response.responseText = (
										await Shared.common.readZip(response.responseText)
									)[0].value;
								}
								resolve({
									status: response.status,
									url: response.finalUrl,
									redirected:
										typeof response.finalUrl !== 'undefined' && response.finalUrl !== obj.url,
									text: response.responseText,
								});
							},
							onerror: (response) => resolve({ error: response.responseText }),
						});
						break;
					}
					case 'open_tab': {
						browser.gm.openInTab(obj.url, false);
						resolve();
						break;
					}
					case 'register_tab': {
						resolve();
						break;
					}
					case 'update_adareqlim': {
						await RequestQueue.loadRequestThreshold();
						resolve();
						break;
					}
				}
			});
		},
	},
	storage: {
		local: {
			get: async () => {
				const keys = await browser.gm.listValues();
				const promises = [];
				const storage = {};
				for (const key of keys) {
					const promise = browser.gm.getValue(key);
					promise.then((value) => (storage[key] = value));
					promises.push(promise);
				}
				await Promise.all(promises);

				return storage;
			},
			remove: async (keys) => {
				const promises = [];
				for (const key of keys) {
					promises.push(browser.gm.deleteValue(key));
				}
				await Promise.all(promises);
				await browser.gm.setValue('storageChanged', JSON.stringify(Date.now()));
			},
			set: async (values) => {
				const promises = [];
				for (const key in values) {
					if (values.hasOwnProperty(key)) {
						promises.push(browser.gm.setValue(key, values[key]));
					}
				}
				await Promise.all(promises);
				await browser.gm.setValue('storageChanged', JSON.stringify(Date.now()));
			},
		},
		onChanged: {
			addListener: () => {},
		},
	},
};

browser.gm = GM;
browser.gm.lastUpdate = 0;

if (!browser.gm.addValueChangeListener) {
	browser.gm.hasValueChanged = async (key, oldValue, callback) => {
		const newValue = await browser.gm.getValue(key);
		if (newValue !== oldValue) {
			callback(key, oldValue, newValue, true);
			oldValue = newValue;
		}
		window.setTimeout(browser.gm.hasValueChanged, 5000, key, oldValue, callback);
	};
	browser.gm.addValueChangeListener = async (key, callback) => {
		const oldValue = await browser.gm.getValue(key);
		browser.gm.hasValueChanged(key, oldValue, callback);
	};
}

browser.gm.addValueChangeListener('storageChanged', async (name, oldValue, newValue, remote) => {
	if (!remote || !newValue || newValue === 'undefined') {
		return;
	}
	const lastUpdate = JSON.parse(newValue);
	if (lastUpdate > browser.gm.lastUpdate) {
		browser.gm.lastUpdate = lastUpdate;

		const storage = await browser.storage.local.get(null);
		const changes = {};
		for (const key in storage) {
			changes[key] = {
				newValue: storage[key],
			};
		}
		browser.gm.listener(
			JSON.stringify({
				action: 'storageChanged',
				values: { changes, areaName: 'local' },
			})
		);
	}
});

browser.gm.doLock = async (lock) => {
	let locked = JSON.parse(await browser.gm.getValue(lock.key, '{}'));
	if (!locked || !locked.uuid || locked.timestamp < Date.now() - (lock.threshold + lock.timeout)) {
		await browser.gm.setValue(
			lock.key,
			JSON.stringify({
				timestamp: Date.now(),
				uuid: lock.uuid,
			})
		);
		await Shared.common.timeout(lock.threshold / 2);
		locked = JSON.parse(await browser.gm.getValue(lock.key, '{}'));
		if (!locked || locked.uuid !== lock.uuid) {
			if (!lock.tryOnce) {
				return browser.gm.doLock(lock);
			}

			return 'false';
		}

		return 'true';
	}

	if (!lock.tryOnce) {
		await Shared.common.timeout(lock.threshold / 3);
		return browser.gm.doLock(lock);
	}

	return 'false';
};

setBrowser(browser);
