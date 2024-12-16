import { someInArray } from '@core'
import { expect, it } from 'vitest'

it('arrayUnion [1, 2, 3, 3], [1, 2] to true', () => {
  expect(someInArray([1, 2, 3, 3], [1, 2])).toBe(true)
})

it(`arrayUnion [3, '3'], ['3'] to be true`, () => {
  expect(someInArray([3, '3'], ['3'])).toBe(true)
})

it(`arrayUnion [3, '3'] ['2'] to be false`, () => {
  expect(someInArray([3, '3'], ['2'])).toBe(false)
})
