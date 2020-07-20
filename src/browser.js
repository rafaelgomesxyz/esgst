let _browser;

const setBrowser = (browser) => {
	_browser = browser;
};

export {
	setBrowser,
	_browser as browser,
};