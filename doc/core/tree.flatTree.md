# tree.flatTree.ts — 树扁平化

将树形结构数据转换为平铺数组（移除 children 属性）。

## 导出

### flatTree(tree_data, config?)

```typescript
function flatTree<T extends FlatTreeItem>(tree_data: T[], config?: {
  children?: string
}): T[]
```

将树扁平化，移除 `children` 属性。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tree_data | `T[]` | — | 树形数据 |
| config.children | `string` | `'children'` | 子节点字段名 |

**返回**: `T[]` — 扁平化后的数组（不含子节点字段）

**示例**

```typescript
const tree = [
  {
    id: 1,
    name: '父节点',
    children: [
      { id: 2, name: '子节点', children: [] },
    ],
  },
]

flatTree(tree)
// [
//   { id: 2, name: '子节点' },
//   { id: 1, name: '父节点' },
// ]
```

**注意**: 函数不会修改原始数据，通过解构复制创建新对象。
