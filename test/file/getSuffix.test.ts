import { getSuffix } from '@core'
import { expect, it } from 'vitest'

it('getSuffix test.mp4', () => {
  expect(getSuffix('test.mp4')).toBe('mp4')
})

it('getSuffix test.2.mp4 取最后一个后缀', () => {
  expect(getSuffix('test.2.mp4')).toBe('mp4')
})

it('getSuffix test.MP4 转小写', () => {
  expect(getSuffix('test.MP4')).toBe('mp4')
})

it('getSuffix 以 . 结尾返回空字符串', () => {
  expect(getSuffix('test.')).toBe('')
})

it('getSuffix 没有后缀返回空字符串', () => {
  expect(getSuffix('test')).toBe('')
})

it('getSuffix 空字符串返回空字符串', () => {
  expect(getSuffix('')).toBe('')
})

it('getSuffix 路径形式的文件名', () => {
  expect(getSuffix('/a/b/test.PDF')).toBe('pdf')
})
