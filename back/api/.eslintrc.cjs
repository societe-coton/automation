// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.eslint.json",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "warn",

    "linebreak-style": ["warn", "unix"],
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/no-misused-promises": "off",

    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/restrict-template-expressions": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/no-unsafe-call": "error",

    // Note: you must disable the base rule as it can report incorrect errors
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "error",

    // Note: you must disable the base rule as it can report incorrect errors
    "require-await": "off",
    "@typescript-eslint/require-await": "error",

    // Note: you must disable the base rule as it can report incorrect errors
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};
