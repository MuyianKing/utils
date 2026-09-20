import { arrayUnion } from '@core'
import { expect, it } from 'vitest'

it('arrayUnion', () => {
  expect(arrayUnion([1, 2, 3, 3])).toStrictEqual([1, 2, 3])
})

it('arrayUnion 3 "3"', () => {
  expect(arrayUnion([3, '3'])).toStrictEqual([3, '3'])
})

it('arrayUnion 空数组', () => {
  expect(arrayUnion([])).toStrictEqual([])
})

it('arrayUnion 去重后保持首次出现的顺序', () => {
  expect(arrayUnion([2, 1, 2, 3, 1])).toStrictEqual([2, 1, 3])
})

it('arrayUnion 对象按引用去重', () => {
  const a = { id: 1 }
  expect(arrayUnion([a, a, { id: 1 }])).toStrictEqual([a, { id: 1 }])
})
