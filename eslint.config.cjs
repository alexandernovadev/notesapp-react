const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat();

module.exports = [
  ...compat.extends('airbnb'),
  ...compat.extends('airbnb/hooks'),
  ...compat.extends('prettier'),
  {
    files: ["**/*.{js,jsx,ts,tsx}", "!node_modules"],
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        jest: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
      "react/react-in-jsx-scope": "off",
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      "react/prop-types": "off"
    }
  }
]; 