module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: [],
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["ux"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "semi": ["error", "always"]
  },
  overrides: [
    {
      files: ["*.ux"],
      plugins: ["ux"],
      extends: ["plugin:ux/recommended"],
      globals: {
        $app_define: "readonly",
        $app_require: "readonly",
        $app_bootstrap: "readonly",
        $app_process_file: "readonly",
        require: "readonly",
        module: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Promise: "readonly",
        fetch: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
        XMLHttpRequest: "readonly",
      },
      rules: {
        "no-undef": "off",  // 在UX文件中禁用未定义变量检查
        "no-unused-vars": "warn",
        "semi": ["error", "always"]
      }
    }
  ]
};