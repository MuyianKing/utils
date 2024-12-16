import { guid } from '@core'
import { expect, it } from 'vitest'

expect.extend({
  toLength: (received, expected) => {
    if (received.length !== expected) {
      return {
        message: () => `expected:${expected}，received：${received.length} `,
        pass: false,
      }
    }

    return {
      pass: true,
    }
  },
})

it('guid default length', () => {
  expect(guid()).toBeTypeOf('string').toLength(16)
})

it('guid(8)', () => {
  expect(guid(8)).toBeTypeOf('string').toLength(8)
})
