import { addPrefixToUrls } from '@core'
import { expect, it } from 'vitest'

const urls = addPrefixToUrls('/test', {
  '/upload': '/file',
})

it('addPrefixToUrls', () => {
  expect(urls).toStrictEqual({
    '/upload': '/test/file',
  })
})
