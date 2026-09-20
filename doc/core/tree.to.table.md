# tree.to.table.ts — 树转表格

将树形结构转换为用于渲染 HTML 表格的二维数组，自动计算 `rowspan` 和 `colspan`。

## 导出

### treeToTable(tree_data)

```typescript
function treeToTable(tree_data: TreeType[]): TreeType[][]
```

将树形数据转换为二维表格数组，适合生成带有合并单元格的表格。

**参数**

| 参数      | 类型         | 说明     |
| --------- | ------------ | -------- |
| tree_data | `TreeType[]` | 树形数据 |

**TreeType**

```typescript
interface TreeType {
  rowspan?: number
  colspan?: number
  append?: boolean
  next?: TreeType[]
  [x: string]: unknown
}
```

- `rowspan` — 行合并数（自动计算）
- `colspan` — 列合并数（自动计算）
- `append` — 内部去重标记，仅计算过程中使用，返回前会被删除
- `next` — 子节点，**只识别 `next` 字段**（写成 `children` 不会被当作子节点）

**返回**: `TreeType[][]` — 二维数组，每个内部数组代表表格的一行

**示例**

```typescript
const tree = [
  {
    name: 'A',
    next: [
      { name: 'A1' },
      { name: 'A2' },
    ],
  },
  {
    name: 'B',
    next: [
      { name: 'B1' },
    ],
  },
]

const table = treeToTable(tree)
// [
//   [{ name: 'A', rowspan: 2 }, { name: 'A1', rowspan: 1, colspan: 1 }],
//   [{ name: 'A2', rowspan: 1, colspan: 1 }],
//   [{ name: 'B', rowspan: 1 }, { name: 'B1', rowspan: 1, colspan: 1 }],
// ]
```

**算法**

- `rowspan`：有子节点时等于所有子节点 `rowspan` 之和，叶子节点为 `1`
- `colspan`：仅有叶子节点会被赋值，为 `最大深度 - 当前层级`
- 生成行时，每棵子树的**第一个**叶子会带上完整的父节点路径；同一父节点下的其他叶子单独成行（父节点单元格已由 `rowspan` 跨行覆盖）
- 内部先用 `cloneDeep` 复制入参，返回的节点是副本，不会修改原始数据；返回前会删除 `next` 与 `append` 字段
