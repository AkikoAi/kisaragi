import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      ...tseslint.configs.recommended.rules, // ambil semua rule default recommended
      "@typescript-eslint/no-explicit-any": "error", // override / tambah di sini
    }
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect", // 🟢 ini yang penting untuk menghilangkan warning
      },
    },
  },
  globalIgnores(["src/generated/*", "node_modules/*", ".next/*"]),
]);
