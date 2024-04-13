/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          [
            "^react",
            "^\\u0000",
            "^node:",
            "^@?\\w",
            "^",
            "^\\.",
            "^node:.*\\u0000$",
            "^@?\\w.*\\u0000$",
            "^[^.].*\\u0000$",
            "^\\..*\\u0000$",
          ],
        ],
      },
    ],
    "simple-import-sort/exports": "warn",
    "import/first": "warn",
    "import/no-duplicates": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "off",
  },
};

module.exports = config;
