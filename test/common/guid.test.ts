import { guid } from '@core'
import { expect, it } from 'vitest'

it('guid 默认长度 16', () => {
  const id = guid()
  expect(id).toBeTypeOf('string')
  expect(id).toHaveLength(16)
})

it('guid(8) 长度为 8', () => {
  const id = guid(8)
  expect(id).toBeTypeOf('string')
  expect(id).toHaveLength(8)
})

it('guid 只包含字母数字，不出现 - 与 _', () => {
  expect(guid(64)).toMatch(/^[A-Z0-9]+$/i)
})

it('guid 多次调用不重复', () => {
  const ids = new Set(Array.from({ length: 100 }, () => guid()))
  expect(ids.size).toBe(100)
})
