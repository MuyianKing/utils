import { normalizeHex } from '@core'
import { expect, it } from 'vitest'

it('normalizeHex 6位颜色转小写并去掉 #', () => {
  expect(normalizeHex('#AABBCC')).toBe('aabbcc')
})

it('normalizeHex 3位颜色展开为6位', () => {
  expect(normalizeHex('#abc')).toBe('aabbcc')
  expect(normalizeHex('#fff')).toBe('ffffff')
})

it('normalizeHex 容忍前后空格', () => {
  expect(normalizeHex('  #123456 ')).toBe('123456')
})

it('normalizeHex 非法输入返回 null', () => {
  expect(normalizeHex('abc')).toBeNull()
  expect(normalizeHex('#abcd')).toBeNull()
  expect(normalizeHex('#xyzxyz')).toBeNull()
  expect(normalizeHex('')).toBeNull()
})
