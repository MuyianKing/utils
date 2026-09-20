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

it('treeToTable 三层结构按最大深度设置 colspan', () => {
  const table = treeToTable([{
    label: '1',
    next: [{
      label: '1-1',
      next: [{ label: '1-1-1' }],
    }],
  }])

  expect(table).toStrictEqual([
    [
      { label: '1', rowspan: 1 },
      { label: '1-1', rowspan: 1 },
      { label: '1-1-1', rowspan: 1, colspan: 1 },
    ],
  ])
})

it('treeToTable 多个根节点', () => {
  const table = treeToTable([
    { label: '1', next: [{ label: '1-1' }] },
    { label: '2', next: [{ label: '2-1' }] },
  ])

  expect(table).toStrictEqual([
    [
      { label: '1', rowspan: 1 },
      { label: '1-1', rowspan: 1, colspan: 1 },
    ],
    [
      { label: '2', rowspan: 1 },
      { label: '2-1', rowspan: 1, colspan: 1 },
    ],
  ])
})

it('treeToTable 空数组返回 []', () => {
  expect(treeToTable([])).toStrictEqual([])
})

it('treeToTable 不修改入参', () => {
  const tree_data = [{
    label: '1',
    next: [{ label: '1-1', next: [] }],
  }]

  treeToTable(tree_data)

  expect(tree_data).toStrictEqual([{
    label: '1',
    next: [{ label: '1-1', next: [] }],
  }])
})

it('treeToTable 空 next 数组按叶子节点处理', () => {
  const table = treeToTable([{ label: '1', next: [] }])

  expect(table).toStrictEqual([
    [{ label: '1', rowspan: 1, colspan: 1 }],
  ])
})
