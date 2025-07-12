// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    ignores: ['**/dist', '**/lib'],
  },
  {
    rules: {
      'ts/no-unused-expressions': 'off',
    },
  },
)
