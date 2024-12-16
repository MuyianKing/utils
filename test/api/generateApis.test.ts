import { generateApis } from '@core'
import { expect, it } from 'vitest'

const api = generateApis({
  './index.js': {
    default: {
      config: {
        prefix: '/file',
      },
      // 请求路径
      urls: {
        upload: '/upload',
      },
    },
  },
  './icon.js': {
    default: {
      config: {
        prefix: '/json',
      },
      // 请求路径
      urls: {
        search: '/query',
      },
    },
  },

})

it('generateApis', () => {
  expect(api).toStrictEqual({
    upload: '/file/upload',
    icon: {
      search: '/json/query',
    },
  })
})
