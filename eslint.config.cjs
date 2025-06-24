const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const nextPlugin = require("@next/eslint-plugin-next");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {
        plugins: {
            next: nextPlugin,
        },
        extends: compat.extends(
            "next/core-web-vitals",
            "next/typescript"
        ),
    },
    globalIgnores(["node_modules/*", ".next/*", "dist/*", "src/generated/*","eslint.config.cjs"]),
]);
