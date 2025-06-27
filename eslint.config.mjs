import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

import nextPlugin from "@next/eslint-plugin-next";
import { fileURLToPath } from "url";
import path from "path";
import { FlatCompat } from "@eslint/eslintrc";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  // Base configuration for JavaScript and TypeScript files
  {
    files: ["**/*.{ js, mjs, cjs, ts, mts, cts, jsx, tsx }"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },

  // TypeScript specific configuration
  tseslint.configs.recommended,
  // React specific configuration
  pluginReact.configs.flat.recommended,
  // Next.js specific configuration
  {
    plugins: { next: nextPlugin },
    extends: compat.extends("next/core-web-vitals", "next/typescript")
  },
  // Global ignores for files and directories
  globalIgnores(["node_modules/*", ".next/*", "dist/*", "src/generated/*"]),
]);
