import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    {
        plugins: {
            next: nextPlugin,
        },
        extends: compat.extends(
            "next/core-web-vitals",
            //"react-hooks/exhaustive-deps",
            "next/typescript"
        ),
    },
    globalIgnores(["node_modules/*", ".next/*", "dist/*", "src/generated/*"]),
]);
