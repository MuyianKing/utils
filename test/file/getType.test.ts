import { getType } from '@core'
import { expect, it } from 'vitest'

it('getType test.jpg', () => {
  expect(getType('test.jpg')).toBe('image')
})

it('getType test.JPG 大写后缀', () => {
  expect(getType('test.JPG')).toBe('image')
})

it('getType test.MP4', () => {
  expect(getType('test.MP4')).toBe('video')
})

it('getType test.MP3', () => {
  expect(getType('test.MP3')).toBe('audio')
})

it('getType test.docx', () => {
  expect(getType('test.docx')).toBe('file')
})

it('getType test.test 未知类型返回空字符串', () => {
  expect(getType('test.test')).toBe('')
})

it('getType 空字符串返回空字符串', () => {
  expect(getType('')).toBe('')
})

it('getType 没有后缀返回空字符串', () => {
  expect(getType('test')).toBe('')
})
