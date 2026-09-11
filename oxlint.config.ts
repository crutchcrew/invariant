import { defineConfig } from "oxlint"

export default defineConfig({
	plugins: ["unicorn", "typescript", "oxc", "import"],
	categories: {
		correctness: "error",
		suspicious: "warn",
		perf: "warn",
	},
	rules: {
		"no-console": "warn",
		"no-unused-vars": "error",
		eqeqeq: "error",
		"no-var": "error",
		"prefer-const": "warn",
		"unicorn/no-null": "off",
		"typescript/no-unsafe-type-assertion": "off",
	},
	ignorePatterns: ["dist", "node_modules"],
	options: {
		typeAware: true,
	},
})
