/*
 * @Author: zhaozhuo
 * @Date: 2022-07-14 14:24:12
 * @LastEditors: zhaozhuo
 * @LastEditTime: 2022-07-14 14:36:21
 * @Description: ...
 */
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}
