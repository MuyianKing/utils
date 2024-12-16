import { useURL } from '@core'
import { expect, it } from 'vitest'

it('useURL', () => {
  expect(useURL({
    upload: '/file',
  }, {
    prefix: '/test',
  })).toStrictEqual({
    upload: '/test/file',
  })
})

it('useURL with keyword', () => {
  expect(useURL({
    upload: '/file',
  }, {
    prefix: '/test',
    keyword: 'test',
  })).toStrictEqual({
    test: {
      upload: '/test/file',
    },
  })
})

it('useURL with keyword ""', () => {
  expect(useURL({
    upload: '/file',
  }, {
    prefix: '/test',
    keyword: '',
  })).toStrictEqual({
    upload: '/test/file',
  })
})
