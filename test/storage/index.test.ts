// @vitest-environment jsdom

import { storage } from '@core'
import { expect, it } from 'vitest'

it('storage set get', () => {
  storage.set('test', 'test')
  expect(storage.get('test')).toBe('test')
})

it('storage set remove', () => {
  storage.set('test', 'test')
  storage.remove('test')
  expect(storage.get('test')).toBe('')
})
