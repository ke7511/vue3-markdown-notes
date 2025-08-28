// eslint.config.js
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'
// ✅ 正确引入 parser 模块
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '.DS_Store']
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser, // ✅ 这里是模块，不是字符串
      parserOptions: {
        parser: tseslint.parser, // vue-eslint-parser 内部交给 TS parser
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 80,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ]
    }
  },

  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off'
    }
  }
)
