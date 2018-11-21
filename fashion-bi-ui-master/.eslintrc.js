module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/attribute-hyphenation': 'error',
    'vue/html-end-tags': 'error',
    'vue/html-indent': 'error',
    'vue/html-self-closing': 'error',
    'vue/mustache-interpolation-spacing': 'error',
    'vue/name-property-casing': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/require-prop-types': 'error',
    'vue/v-bind-style': 'error',
    'vue/v-on-style': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
