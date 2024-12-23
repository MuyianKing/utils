import { makeTree } from '@core'
import { expect, it } from 'vitest'

it('makeTree', () => {
  const tree = makeTree([
    {
      label: '1-1',
      value: '1-1',
      parent: '0',
    },
    {
      label: '1',
      value: '0',
      parent: '',
    },
  ])

  const tree_data: {
    label: string
    value: string
    parent: string
    children: any[]
  }[] = [{
    label: '1',
    value: '0',
    parent: '',
    children: [{
      label: '1-1',
      value: '1-1',
      parent: '0',
    }],
  }]

  expect(tree).toStrictEqual(tree_data)

  const tree2 = makeTree([
    {
      label: '1-1',
      value: '1-1',
      parent: '1',
    },
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
  ])

  const tree_data2: {
    label: string
    value: string
    parent?: string
    children?: any[]
  }[] = [{
    label: '1',
    value: '1',
    children: [{
      label: '1-1',
      value: '1-1',
      parent: '1',
    }],
  }, {
    label: '2',
    value: '2',
  }]

  expect(tree2).toStrictEqual(tree_data2)
})
