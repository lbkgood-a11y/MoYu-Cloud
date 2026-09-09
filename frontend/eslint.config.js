import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

/** 前端统一 ESLint 规则。 */
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '**/*.js', '**/*.vue.js'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: { 'vue/multi-word-component-names': 'off', '@typescript-eslint/no-explicit-any': 'warn', 'no-empty': 'off' },
  },
  eslintConfigPrettier,
);
