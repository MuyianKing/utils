import { jsonparse } from '@core'
import { expect, it } from 'vitest'

const obj = {
  name: 'muyian',
}

it('jsonparse', () => {
  expect(jsonparse(JSON.stringify(obj))).toStrictEqual(obj)
})

it('jsonparse string', () => {
  expect(jsonparse('test')).toStrictEqual({})
})

it('jsonparse string null', () => {
  expect(jsonparse('test', null)).toBeNull()
})

it('jsonparse 解析数组与原始值', () => {
  expect(jsonparse('[1,2]')).toStrictEqual([1, 2])
  expect(jsonparse('123')).toBe(123)
  expect(jsonparse('true')).toBe(true)
})

it('jsonparse 解析失败返回自定义默认值', () => {
  expect(jsonparse('not json', { def: true })).toStrictEqual({ def: true })
})

it('jsonparse 空字符串返回默认值', () => {
  expect(jsonparse('')).toStrictEqual({})
})
