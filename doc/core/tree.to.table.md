# tree.to.table.ts — 树转表格

将树形结构转换为用于渲染 HTML 表格的二维数组，自动计算 `rowspan` 和 `colspan`。

## 导出

### treeToTable(tree_data)

```typescript
function treeToTable(tree_data: TreeType[]): TreeType[][]
```

将树形数据转换为二维表格数组，适合生成带有合并单元格的表格。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
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
- `append` — 是否是追加的占位列
- `next` — 子节点

**返回**: `TreeType[][]` — 二维数组，每个内部数组代表表格的一行

**示例**

```typescript
const tree = [
  {
    name: 'A',
    children: [
      { name: 'A1' },
      { name: 'A2' },
    ],
  },
  {
    name: 'B',
    children: [
      { name: 'B1' },
    ],
  },
]

const table = treeToTable(tree)
// 输出适合渲染 HTML 表格的二维数组
```

**算法**: 递归遍历树形结构，向下传递当前未闭合的节点，计算每个节点在每一层级的 `rowspan`，通过 `colspan` 参数追踪列位置。
