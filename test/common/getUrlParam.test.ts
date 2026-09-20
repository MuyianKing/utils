// @vitest-environment jsdom
import { getUrlParam } from '@core'
import { beforeEach, expect, it } from 'vitest'

beforeEach(() => {
  window.history.replaceState({}, '', '/')
})

it('读取 query 中的参数', () => {
  window.history.replaceState({}, '', '/?token=abc&id=7')
  expect(getUrlParam('token')).toBe('abc')
  expect(getUrlParam('id')).toBe('7')
})

it('参数不存在返回空字符串', () => {
  window.history.replaceState({}, '', '/?token=abc')
  expect(getUrlParam('missing')).toBe('')
})

it('没有 query 时返回空字符串', () => {
  expect(getUrlParam('token')).toBe('')
})

it('回退读取 hash 中的参数', () => {
  window.history.replaceState({}, '', '/#/page?token=hash-token&a=1')
  expect(getUrlParam('token')).toBe('hash-token')
  expect(getUrlParam('a')).toBe('1')
})

it('同名参数取第一个值', () => {
  window.history.replaceState({}, '', '/?tag=a&tag=b')
  expect(getUrlParam('tag')).toBe('a')
})
