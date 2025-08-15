import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginGitignore from "eslint-config-flat-gitignore";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import { tailwind4 } from "tailwind-csstree";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
    tseslint.configs.recommended,
    pluginGitignore(),
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        languageOptions: { customSyntax: tailwind4 },
        rules: { "css/no-invalid-properties": "off" },

        // full tailwind support doesn't exist for theme() :(
        // https://eslint.org/blog/2025/02/eslint-css-support/#custom-syntax-support
        ignores: ["src/styles/globals.css"]
    }
]);
