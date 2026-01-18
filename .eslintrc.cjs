/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    './node_modules/eslint-plugin-vue/lib/configs/vue3-essential.js',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  ignorePatterns: ['node_modules/**', '/dist/**'],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
