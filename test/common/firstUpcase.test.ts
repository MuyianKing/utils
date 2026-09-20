import { firstUpcase } from '@core'
import { expect, it } from 'vitest'

it('firstUpcase', () => {
  expect(firstUpcase('helloWorld')).toBe('HelloWorld')
})

it('firstUpcase 已经是首字母大写时不变', () => {
  expect(firstUpcase('Hello')).toBe('Hello')
})

it('firstUpcase 单个字符', () => {
  expect(firstUpcase('a')).toBe('A')
})

it('firstUpcase 空字符串', () => {
  expect(firstUpcase('')).toBe('')
})

it('firstUpcase 非字母开头保持不变', () => {
  expect(firstUpcase('1abc')).toBe('1abc')
})
