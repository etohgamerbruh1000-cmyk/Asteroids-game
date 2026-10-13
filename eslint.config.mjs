// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    // Ignore generated files and installed dependencies.
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    // Only lint JavaScript and TypeScript source files.
    files: ["src/**/*.{js,ts}"],

    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],

    rules: {
      // Catch unused variables, imports, and parameters.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Treat explicit `any` as an error.
      "@typescript-eslint/no-explicit-any": "error",

      // Require explicit handling of potentially unsafe promises.
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
);
