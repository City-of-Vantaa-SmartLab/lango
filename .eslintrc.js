module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    'browser': true,
    'node': true,
    'jest': true,
    'es6': true
  },
  plugins: [
    'redux-saga',
    'react',
    'jsx-a11y',
    'import'
  ],
  parserOptions: {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  rules: {
    'arrow-body-style': [
      2,
      'as-needed'
    ],
    'comma-dangle': [
      2,
      'always-multiline'
    ],
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,
    'import/no-unused-modules': [
      2,
      {
        'unusedExports': true
      }
    ],
    'import/prefer-default-export': 0,
    'indent': [
      2,
      2,
      {
        'SwitchCase': 1
      }
    ],
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/label-has-for': 2,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'max-len': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement'
    ],
    'no-use-before-define': 0,
    'object-curly-newline': 0,
    'prefer-template': 2,
    'quotes': [
      'error',
      'single'
    ],
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [
      2,
      'multiline'
    ],
    'react/jsx-filename-extension': 0,
    'react/no-unused-prop-types': 2,
    'react/prop-types': 2,
    'react/require-default-props': 2,
    'redux-saga/no-yield-in-race': 2,
    'redux-saga/yield-effects': 2,
    'require-yield': 0,
    // The following rules are disabled after eslint update as these are not
    // enforced before. These should be reviewed and reactivated if deemed useful.
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unused-state': 0,
    'react/sort-comp': 0,
  },
  settings: {
    'import/resolver': 'webpack',
  },
}
