/* eslint-env node */
module.exports = {
  extends: [
    'plugin:cypress/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'func-names': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'prefer-const': 2,
    'prefer-template': 2,
  },
};
