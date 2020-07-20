class _LocalStorage {
	set(key, value) {
		window.localStorage.setItem(`esgst_${key}`, value);
	}

	get(key, value = undefined) {
		return window.localStorage.getItem(`esgst_${key}`) || value;
	}

	delete(key) {
		window.localStorage.removeItem(`esgst_${key}`);
	}
}

const LocalStorage = new _LocalStorage();

export { LocalStorage };
