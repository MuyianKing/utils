import { mix } from '@core'
import { expect, it } from 'vitest'

it(`mix("#ff0000", "#ffffff", 0)`, () => {
  expect(mix('#ff0000', '#ffffff', 0)).toBe('#ff0000')
})

it(`mix("#ff0000", "#ffffff", 0.5)`, () => {
  expect(mix('#ff0000', '#ffffff', 0.5)).toBe('#ff8080')
})

it(`mix("#ff0000", "#ffffff", 1)`, () => {
  expect(mix('#ff0000', '#ffffff', 1)).toBe('#ffffff')
})

it('weight 超过 1 按 1 处理', () => {
  expect(mix('#ff0000', '#ffffff', 2)).toBe('#ffffff')
})

it('weight 小于 0 按 0 处理', () => {
  expect(mix('#ff0000', '#ffffff', -1)).toBe('#ff0000')
})

it('支持 3 位简写色', () => {
  expect(mix('#fff', '#000', 0.5)).toBe('#808080')
  expect(mix('#f00', '#ffffff', 0.5)).toBe('#ff8080')
})

it('混合结果与 6 位写法一致', () => {
  expect(mix('#fff', '#000', 0.25)).toBe(mix('#ffffff', '#000000', 0.25))
})

it('颜色非法时抛错，不返回非法颜色值', () => {
  expect(() => mix('red', '#000000', 0.5)).toThrow('颜色格式非法')
  expect(() => mix('#000000', '#ffff', 0.5)).toThrow('颜色格式非法')
})

it('weight 非数字时抛错', () => {
  expect(() => mix('#000000', '#ffffff', Number.NaN)).toThrow('weight')
  expect(() => mix('#000000', '#ffffff', undefined as unknown as number)).toThrow('weight')
})
