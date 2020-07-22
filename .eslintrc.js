module.exports = {
	env: {
		browser: true,
		es2020: true,
		greasemonkey: true,
		jquery: true,
		node: true,
		webextensions: true,
	},
	rules: {},
	overrides: [
		{
			files: ['**/*.{js,jsx}'],
			parserOptions: {
				sourceType: 'module',
			},
			extends: [
				'eslint:recommended',
				'plugin:react/recommended',
				'plugin:prettier/recommended', // Displays Prettier errors as ESLint errors. **Make sure this is always the last configuration.**
			],
			rules: {
				quotes: [
					'error',
					'single',
					{
						avoidEscape: true,
						allowTemplateLiterals: false,
					},
				],
				'react/react-in-jsx-scope': 'off',
			},
		},
		{
			files: ['**/*.{ts,tsx}'],
			plugins: ['@rafaelgssa/local'],
			extends: [
				'eslint:recommended',
				'plugin:react/recommended',
				'plugin:@typescript-eslint/recommended',
				'prettier/@typescript-eslint', // Disables TypeScript rules that conflict with Prettier.
				'plugin:prettier/recommended', // Displays Prettier errors as ESLint errors. **Make sure this is always the last configuration.**
			],
			rules: {
				quotes: 'off',
				'@typescript-eslint/quotes': [
					'error',
					'single',
					{
						avoidEscape: true,
						allowTemplateLiterals: false,
					},
				],
				'@rafaelgssa/local/prefer-arrow-functions': [
					'error',
					{
						disallowPrototype: true,
						classPropertiesAllowed: true,
					},
				],
				'react/react-in-jsx-scope': 'off',
			},
		},
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
};
