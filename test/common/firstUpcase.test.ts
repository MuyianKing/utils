import { firstUpcase } from '@core'
import { expect, it } from 'vitest'

it('firstUpcase', () => {
  expect(firstUpcase('helloWorld')).toBe('HelloWorld')
})
