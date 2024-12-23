import { getType } from '@core'
import { expect, it } from 'vitest'

it('getType test.jpg', () => {
  expect(getType('test.jpg')).toBe('image')
})

it('getType test.JPG', () => {
  expect(getType('test.jpg')).toBe('image')
})

it('getType test.mp4', () => {
  expect(getType('test.MP4')).toBe('video')
})

it('getType test.MP3', () => {
  expect(getType('test.MP3')).toBe('audio')
})

it('getType test.docx', () => {
  expect(getType('test.docx')).toBe('file')
})

it('getType test.test', () => {
  expect(getType('test.test')).toBe('')
})
