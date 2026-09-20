import { set16ToRgb } from '@core'
import { expect, it } from 'vitest'

it('set16ToRgb("#ff0000") 是 [255, 0, 0]', () => {
  expect(set16ToRgb('#ff0000')).toEqual([255, 0, 0])
})

it('set16ToRgb("#fff") 展开为 [255, 255, 255]', () => {
  expect(set16ToRgb('#fff')).toEqual([255, 255, 255])
})

it('set16ToRgb("#0F0") 展开为 [0, 255, 0]', () => {
  expect(set16ToRgb('#0F0')).toEqual([0, 255, 0])
})

it('set16ToRgb 大小写不敏感', () => {
  expect(set16ToRgb('#AABBCC')).toEqual([170, 187, 204])
})

it('set16ToRgb 前后空格可容忍', () => {
  expect(set16ToRgb('  #123456  ')).toEqual([18, 52, 86])
})

it('set16ToRgb 非法输入返回 null', () => {
  expect(set16ToRgb('fff')).toBeNull()
  expect(set16ToRgb('#ffff')).toBeNull()
  expect(set16ToRgb('#gggggg')).toBeNull()
  expect(set16ToRgb('')).toBeNull()
})
