import { getSuffix } from '@core'
import { expect, it } from 'vitest'

it('getSuffix test.mp4', () => {
  expect(getSuffix('test.mp4')).toBe('mp4')
})

it('getSuffix test.2.mp4', () => {
  expect(getSuffix('test.2.mp4')).toBe('mp4')
})

it('getSuffix test.MP4', () => {
  expect(getSuffix('test.MP4')).toBe('mp4')
})

it('getSuffix test no suffix', () => {
  expect(getSuffix('test.')).toBe('')
})

it('getSuffix test end width .', () => {
  expect(getSuffix('test.')).toBe('')
})
