module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 200],
    'type-enum': [
      2,
      'always',
      ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'wip', 'chore'],
    ],
    'scope-enum': [2, 'always', ['api', 'auth', 'common', 'dep', 'livesync', 'module', 'multitool', 'store', 'system']],
  },
};
