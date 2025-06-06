module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    "import/ignore": "node_modules",
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".js", ".vue"],
      },
    },
  },
  plugins: ["@typescript-eslint", "vue"],
  extends: [
    "airbnb-base",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:sonarjs/recommended",
    "plugin:security/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description", // Allows usage if accompanied by a description
        "ts-ignore": "allow-with-description",
        "ts-nocheck": true,
        "ts-check": false,
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
        vue: "never",
      },
    ],
    "no-nested-ternary": "off",
    "import/prefer-default-export": "off",
  },
};