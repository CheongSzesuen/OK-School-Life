import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        allowImportExportEverywhere: true,
        babelOptions: {
          presets: ["@babel/preset-react"], // 如果需要React支持
        }
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  },
  {
    files: ["**/*.ux"],
    languageOptions: {
      globals: {
        ...globals.browser,
        // 添加快应用框架相关的全局变量
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
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        allowImportExportEverywhere: true,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: [], // 对于UX文件，我们不需要特定的preset
        }
      }
    },
    rules: {
      "no-undef": "off",  // 在UX文件中禁用未定义变量检查，因为可能引用的是框架全局变量
      "no-unused-vars": "warn",
      "semi": ["error", "always"]
    }
  }
]);