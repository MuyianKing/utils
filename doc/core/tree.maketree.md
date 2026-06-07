# tree.maketree.ts — 构建树

将扁平数组转为树形结构。

## 导出

### makeTree(list, config?)

```typescript
function makeTree<T>(list: T[], config?: ConfigType): T[]
```

将平面结构变为树形结构。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| list | `T[]` | — | 扁平数组 |
| config.rootCheck | `(item: any) => boolean` | 自动检测 | 自定义根节点判断函数 |
| config.extend_keys | `string[]` | — | 需要保留的额外字段名 |
| config.props.label | `string` | `'label'` | 标签字段名 |
| config.props.children | `string` | `'children'` | 子节点字段名 |
| config.props.value | `string` | `'value'` | 值字段名 |
| config.props.parent | `string` | `'parent'` | 父节点 ID 字段名 |

**返回**: `T[]` — 树形结构

**异常**

- 未找到根节点时抛出 `Error('未找到根节点')`

**示例**

```typescript
const list = [
  { id: 1, name: '根节点', parent: null },
  { id: 2, name: '子节点', parent: 1 },
  { id: 3, name: '孙节点', parent: 2 },
]

makeTree(list, {
  props: { value: 'id', parent: 'parent' },
})
// [
//   {
//     id: 1, name: '根节点',
//     children: [
//       {
//         id: 2, name: '子节点',
//         children: [
//           { id: 3, name: '孙节点', children: [] },
//         ],
//       },
//     ],
//   },
// ]
```
