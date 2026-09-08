// ABOUTME: Applies the recommended type-aware TypeScript checks to owned source.
// ABOUTME: Host APIs and test expectations remain explicit at their boundaries.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["main.js", "node_modules/**", "docs/archive/**"] },
  {
    files: ["*.mjs", "scripts/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
