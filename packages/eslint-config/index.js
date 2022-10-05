require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ["next"],
	overrides: [
		{
			files: ["*.json", "*.jsonc"],
			parser: "jsonc-eslint-parser",
		},
		{
			extends: "plugin:mdx/recommended",
			files: ["*.md", "*.mdx"],
			settings: {
				"mdx/code-blocks": true,
				"mdx/language-mapper": {},
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		sourceType: "module",
	},
	plugins: [
		"@tangramdotdev",
		"@typescript-eslint",
		"jsonc",
		"react-hooks",
		"react",
	],
	root: true,
	rules: {
		"@next/next/no-html-link-for-pages": "off",
		"@tangramdotdev/no-const": "error",
		"@tangramdotdev/sort-imports": "error",
		"@tangramdotdev/sort-keys": "error",
		"@typescript-eslint/array-type": ["error", { default: "generic" }],
		"@typescript-eslint/no-non-null-assertion": "error",
		"import/no-anonymous-default-export": "off",
		"jsonc/sort-keys": "error",
		"no-duplicate-imports": "error",
		"no-restricted-syntax": [
			"error",
			"BinaryExpression[operator='in']",
			"WithStatement",
		],
		"object-shorthand": "error",
		"react-hooks/exhaustive-deps": "warn",
		"react-hooks/rules-of-hooks": "error",
		"react/jsx-boolean-value": ["error", "always"],
		"react/display-name": ["off"],
		"react/jsx-curly-brace-presence": [
			"error",
			{ children: "always", props: "never" },
		],
		"react/jsx-handler-names": "error",
		"react/jsx-key": "warn",
		"react/jsx-max-depth": ["error", { max: 10 }],
		"react/jsx-pascal-case": "error",
		"react/jsx-sort-props": "error",
		"sort-imports": ["error", { ignoreDeclarationSort: true }],
	},
};
