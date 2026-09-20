import { isLight } from '@core'
import { expect, it } from 'vitest'

it('#D32828 是暗色', () => {
  expect(isLight('#D32828')).toBe(false)
})

it('#8e8c8c 是暗色', () => {
  expect(isLight('#8e8c8c')).toBe(false)
})

it('#EFDDDD 是亮色', () => {
  expect(isLight('#EFDDDD')).toBe(true)
})

it('#fff 简写可用', () => {
  expect(isLight('#fff')).toBe(true)
})

it('数组入参可用', () => {
  expect(isLight([255, 255, 255])).toBe(true)
  expect(isLight([0, 0, 0])).toBe(false)
})

it('非法颜色返回 false', () => {
  expect(isLight('red')).toBe(false)
  expect(isLight('#ggg')).toBe(false)
})

it('数组长度不足 3 返回 false', () => {
  expect(isLight([255, 255])).toBe(false)
})
