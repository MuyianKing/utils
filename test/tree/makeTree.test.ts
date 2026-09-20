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

it('makeTree 空数组返回 []', () => {
  expect(makeTree([])).toStrictEqual([])
})

it('makeTree 没有根节点时抛错', () => {
  expect(() => makeTree([
    { label: '1-1', value: '1-1', parent: '1' },
  ])).toThrow('未找到根节点')
})

it('makeTree 支持自定义 props', () => {
  expect(makeTree([
    { name: '子', id: '2', parentId: '1' },
    { name: '父', id: '1', parentId: '' },
  ], {
    props: { label: 'name', value: 'id', parent: 'parentId' },
  })).toStrictEqual([{
    name: '父',
    id: '1',
    parentId: '',
    children: [{
      name: '子',
      id: '2',
      parentId: '1',
    }],
  }])
})

it('makeTree 支持 extend_keys 保留额外字段', () => {
  expect(makeTree([
    { label: '父', value: '1', disabled: true },
    { label: '子', value: '2', parent: '1', disabled: false },
  ], {
    extend_keys: ['disabled'],
  })).toStrictEqual([{
    label: '父',
    value: '1',
    disabled: true,
    children: [{
      label: '子',
      value: '2',
      parent: '1',
      disabled: false,
    }],
  }])
})

it('makeTree 支持自定义 rootCheck', () => {
  const tree = makeTree([
    { label: '父', value: '1', root: true, parent: '0' },
    { label: '子', value: '2', parent: '1', root: false },
  ], {
    extend_keys: ['root'],
    rootCheck: item => !!item.root,
  })

  expect(tree).toStrictEqual([{
    label: '父',
    value: '1',
    root: true,
    parent: '0',
    children: [{
      label: '子',
      value: '2',
      parent: '1',
      root: false,
    }],
  }])
})
