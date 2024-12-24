import { treeToTable } from '@core'
import { expect, it } from 'vitest'

it('treeToTable', () => {
  const tree_data = [{
    label: '1',
    value: '1',
    next: [
      {
        label: '1-1',
        value: '1-1',
      },
      {
        label: '1-2',
        value: '1-2',
      },
    ],
  }]

  const table = [
    [
      {
        label: '1',
        value: '1',
        rowspan: 2,
      },
      {
        label: '1-1',
        value: '1-1',
        rowspan: 1,
        colspan: 1,
      },
    ],
    [
      {
        label: '1-2',
        value: '1-2',
        rowspan: 1,
        colspan: 1,
      },
    ],
  ]

  expect(treeToTable(tree_data)).toStrictEqual(table)
})
