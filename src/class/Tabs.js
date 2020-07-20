import { browser } from '../browser';

class _Tabs {
	open(url) {
		return browser.runtime.sendMessage({
			action: 'open_tab',
			url,
		});
	};
}

export const Tabs = new _Tabs();