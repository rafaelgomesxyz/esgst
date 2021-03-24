let _browser: typeof browser;

const setBrowser = (__browser: typeof browser) => {
	_browser = __browser;
};

export { setBrowser, _browser as browser };
