import { getLabelByVal } from '@core'
import { expect, it } from 'vitest'

const array = [
  {
    label: '测试1',
    value: 'test1',
  },
  {
    label: '测试2',
    value: 'test2',
  },
]

it(`getLabelByVal`, () => {
  expect(getLabelByVal(array, 'test2')).toBe('测试2')
})

it(`getLabelByVal obj`, () => {
  expect(getLabelByVal(array, 'test2', {
    obj: true,
  })).toStrictEqual({
    label: '测试2',
    value: 'test2',
  })
})

const array2 = [
  {
    id: 1,
    name: 'name1',
  },
  {
    id: 2,
    name: 'name2',
  },
]

it(`getLabelByVal label value`, () => {
  expect(getLabelByVal(array2, 2, {
    label: 'name',
    value: 'id',
  })).toBe('name2')
})

it(`getLabelByVal label value obj`, () => {
  expect(getLabelByVal(array2, 2, {
    label: 'name',
    value: 'id',
    obj: true,
  })).toStrictEqual({
    id: 2,
    name: 'name2',
  })
})

it('getLabelByVal 查不到返回 null', () => {
  expect(getLabelByVal(array, 'not-exist')).toBeNull()
  expect(getLabelByVal(array2, 99, { label: 'name', value: 'id' })).toBeNull()
})

it('getLabelByVal 空数组返回 null', () => {
  const empty: { label: string, value: string }[] = []
  expect(getLabelByVal(empty, 'test')).toBeNull()
})

it('getLabelByVal 值为 0 时能命中', () => {
  expect(getLabelByVal([{ label: '零', value: 0 }], 0)).toBe('零')
})
