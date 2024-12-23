import { flatTree } from '@core'
import { expect, it } from 'vitest'

const tree_data: {
  label: string
  value: string
  children: any[]
}[] = [{
  label: '1',
  value: '1',
  children: [{
    label: '1-1',
    value: '1-1',
  }],
}]

it('flatTree', () => {
  expect(flatTree(tree_data)).toStrictEqual([
    {
      label: '1-1',
      value: '1-1',
    },
    {
      label: '1',
      value: '1',
    },
  ])
})
