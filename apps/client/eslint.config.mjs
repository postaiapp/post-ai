import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends(
		"next/core-web-vitals",
		"next/typescript",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/recommended",
		"plugin:prettier/recommended"
	),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: ["@typescript-eslint", "import", "prettier"],
		rules: {
			"indent": ["error", 4],
			"react/jsx-indent": ["error", 4],
			"react/jsx-indent-props": ["error", 4],
			"prettier/prettier": [
				"error",
				{
					singleQuote: true,
					semi: true,
					trailingComma: "all",
					printWidth: 100,
					tabWidth: 4,
				},
			],
			"no-unused-vars": "warn",
			"@typescript-eslint/no-unused-vars": ["warn"],
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
					"newlines-between": "always",
					alphabetize: { order: "asc", caseInsensitive: true },
				},
			],
			"react/react-in-jsx-scope": "off",
			"react/jsx-props-no-spreading": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},
];

export default eslintConfig;
