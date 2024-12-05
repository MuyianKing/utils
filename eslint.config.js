import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    isInEditor: false,
    formatters: true,
    ignores: [
      '**/public/**',
      'package.json',
    ],
  },
  {
    rules: {
      'no-console': 0,
      'no-eval': 0,
      'no-use-before-define': 0,
      'ts/no-use-before-define': 0,
      'no-new-func': 0,
      'no-new': 0,
      // http://eslint.cn/docs/rules/curly
      'curly': 0,
      // https://eslint.cn/docs/rules/brace-style
      'brace-style': ['error', '1tbs'],
      'style/brace-style': 0,
      // 组件名称中横线连接
      'vue/component-name-in-template-casing': ['error', 'kebab-case', {
        ignores: [],
      }],
      'no-template-curly-in-string': 0,
      // https://eslint.vuejs.org/rules/custom-event-name-casing.html
      'vue/custom-event-name-casing': 0,
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'ignore',
        multiline: 'beside',
      }],
      'ts/no-unused-expressions': 0,
    },
    languageOptions: {
      globals: {

      },
    },
  },
)
