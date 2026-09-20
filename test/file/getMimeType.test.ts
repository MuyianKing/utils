import { getMimeType, mime_type } from '@core'
import { expect, it } from 'vitest'

it('getMimeType apk', () => {
  expect(getMimeType('apk')).toStrictEqual('application/vnd.android.package-archive')
})

it('getMimeType test empty', () => {
  expect(getMimeType('test empty')).toStrictEqual('')
})

it('getMimeType ["apk", "asf"]', () => {
  expect(getMimeType(['apk', 'asf'])).toStrictEqual(['application/vnd.android.package-archive', 'video/x-ms-asf'])
})

it('getMimeType ["test empty array"]', () => {
  expect(getMimeType(['test empty array'])).toStrictEqual([])
})

it('getMimeType 空数组返回空数组', () => {
  expect(getMimeType([])).toStrictEqual([])
})

it('mime_type 每项都包含 suffix 与 mime_type', () => {
  expect(mime_type.length).toBeGreaterThan(0)
  mime_type.forEach((item) => {
    expect(typeof item.suffix).toBe('string')
    expect(item.suffix.length).toBeGreaterThan(0)
    expect(typeof item.mime_type).toBe('string')
  })
})

it('mime_type 中常见类型正确', () => {
  expect(mime_type.find(item => item.suffix === 'jpg')?.mime_type).toBe('image/jpeg')
  expect(mime_type.find(item => item.suffix === 'pdf')?.mime_type).toBe('application/pdf')
  expect(mime_type.find(item => item.suffix === 'mp4')?.mime_type).toBe('video/mp4')
})

it('getMimeType 结果来自 mime_type 表', () => {
  expect(getMimeType('png')).toBe(mime_type.find(item => item.suffix === 'png')?.mime_type)
})
