import { getMimeType } from '@core'
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
