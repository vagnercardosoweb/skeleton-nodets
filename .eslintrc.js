module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true
  },
  plugins: ['airbnb-base', 'prettier'],
  extends: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    // 'prettier/prettier': 'error',
    // 'class-methods-use-this': 'off',
    // 'no-param-reassign': 'off',
    // camelcase: 'off',
    // 'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    // 'no-underscore-dangle': 'off',
    // 'no-prototype-builtins': 'off',
    // 'array-callback-return': 'off',
  }
};
