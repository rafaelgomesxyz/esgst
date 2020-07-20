// @ts-nocheck

const preferArrow = require('./local-eslint-plugins/eslint-plugin-prefer-arrow');

module.exports = {
	rules: {
		'prefer-arrow-functions': preferArrow,
	},
};
