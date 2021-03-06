module.exports = {
	env: {
		es2020: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		'class-methods-use-this': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				js: 'never',
			},
		],
		indent: [
			'error',
			'tab',
		],
		'linebreak-style': 'off',
		'max-len': 'off',
		'no-await-in-loop': 'off',
		'no-plusplus': 'off',
		'no-param-reassign': 'off',
		'no-restricted-syntax': [
			'error',
			'WithStatement',
		],
		'no-shadow': 'off',
		'no-tabs': 'off',
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.ts',
				],
			},
		},
	},
};
