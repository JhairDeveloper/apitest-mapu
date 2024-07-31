import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      quotes: ["error", "double"],
      semi: ["error", "always"],
      indent: ["error", 2],
      "no-console": "off",
      "no-unused-vars": ["warn"],
    },
  },
];
