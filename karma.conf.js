const webpackConfig = require('./webpack.config.js');

const browsers = [];
//browsers.push('Chrome');
browsers.push('Firefox');

module.exports = (config) => {
	const karmaConfig = {
		autoWatch: false,
		browsers,
		concurrency: 1,
		files: ['test/**/*.+(js|jsx|ts|tsx)'],
		frameworks: ['mocha', 'chai'],
		logLevel: config.LOG_DISABLE,
		plugins: [
			'karma-chai',
			'karma-chrome-launcher',
			'karma-coverage',
			'karma-firefox-launcher',
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-webpack',
		],
		preprocessors: {
			'test/**/*+(js|jsx|ts|tsx)': ['webpack'],
		},
		reporters: ['mocha', 'coverage'],
		singleRun: true,
		webpack: webpackConfig({ development: true, test: true }),
		webpackMiddleware: {
			logLevel: 'silent',
		},
	};
	config.set(karmaConfig);
};
