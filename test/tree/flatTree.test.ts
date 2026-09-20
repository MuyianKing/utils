import { flatTree } from '@core'
import { expect, it } from 'vitest'

interface TreeData {
  label: string
  value: string
  children?: TreeData[]
}

const tree_data: TreeData[] = [{
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

it('flatTree 会去掉 children 字段', () => {
  const result = flatTree(tree_data)
  result.forEach((item) => {
    expect(item).not.toHaveProperty('children')
  })
})

it('flatTree 多层嵌套按叶子优先展开', () => {
  expect(flatTree([{
    label: '1',
    value: '1',
    children: [{
      label: '1-1',
      value: '1-1',
      children: [{ label: '1-1-1', value: '1-1-1' }],
    }],
  }])).toStrictEqual([
    { label: '1-1-1', value: '1-1-1' },
    { label: '1-1', value: '1-1' },
    { label: '1', value: '1' },
  ])
})

it('flatTree 空数组返回 []', () => {
  expect(flatTree([])).toStrictEqual([])
})

it('flatTree 入参为 null 时返回 []', () => {
  expect(flatTree(null as never)).toStrictEqual([])
})

it('flatTree 支持自定义 children 字段', () => {
  const data = [{
    label: '1',
    child: [{ label: '1-1' }],
  }]

  expect(flatTree(data as never, { children: 'child' })).toStrictEqual([
    { label: '1-1' },
    { label: '1' },
  ])
})

it('flatTree 不修改原数据', () => {
  const data: TreeData[] = [{ label: '1', value: '1', children: [{ label: '1-1', value: '1-1' }] }]
  flatTree(data)
  expect(data[0].children).toHaveLength(1)
})
