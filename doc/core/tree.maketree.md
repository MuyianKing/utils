# tree.maketree.ts — 构建树

将扁平数组转为树形结构。

## 导出

### makeTree(list, config?)

```typescript
function makeTree<T>(list: T[], config?: ConfigType): T[]
```

将平面结构变为树形结构。

**ConfigType**

```typescript
interface ConfigType {
  rootCheck?: (item: any) => boolean
  extend_keys?: string[]
  props?: {
    label?: string
    children?: string
    value?: string
    parent?: string
  }
}
```

**参数**

| 参数                  | 类型                     | 默认值       | 说明                                          |
| --------------------- | ------------------------ | ------------ | --------------------------------------------- |
| list                  | `T[]`                    | —            | 扁平数组                                      |
| config.rootCheck      | `(item: any) => boolean` | 自动检测     | 自定义根节点判断函数；默认规则见下            |
| config.extend_keys    | `string[]`               | —            | 需要保留的额外字段名                          |
| config.props.label    | `string`                 | `'label'`    | 标签字段名（**默认取 `label`，不是 `name`**） |
| config.props.children | `string`                 | `'children'` | 子节点字段名                                  |
| config.props.value    | `string`                 | `'value'`    | 值字段名                                      |
| config.props.parent   | `string`                 | `'parent'`   | 父节点 ID 字段名                              |

**返回**: `T[]` — 树形结构；`list` 为空数组时返回 `[]`

**异常**

- 入参非空但找不到根节点时抛出 `Error('未找到根节点')`

**说明**

- 结果节点固定包含 `label`、`value` 两个字段（字段名可配置）；入参里没有 `label` 字段时该值为 `undefined`
- `parent` 字段只要不是 `undefined` 就会被复制进结果，例如 `parent: null` 会保留
- 默认根节点规则：`parent` 为假值，**且该节点必须是入参里真实出现过的节点**；因此子节点引用了不在入参中的父节点时，生成的占位父对象不会被当成根节点（旧版会把占位对象当根节点并返回 `[{}]`）
- `extend_keys` 中列出的字段会原样复制到对应节点上

**示例 1：默认字段名**

```typescript
const list = [
  { value: 1, label: '根节点' },
  { value: 2, label: '子节点', parent: 1 },
  { value: 3, label: '孙节点', parent: 2 },
]

makeTree(list)
// [
//   {
//     label: '根节点',
//     value: 1,
//     children: [
//       {
//         label: '子节点',
//         value: 2,
//         parent: 1,
//         children: [
//           { label: '孙节点', value: 3, parent: 2 },
//         ],
//       },
//     ],
//   },
// ]
```

**示例 2：自定义字段名**

```typescript
const list = [
  { id: 1, name: '根节点', parent: null },
  { id: 2, name: '子节点', parent: 1 },
  { id: 3, name: '孙节点', parent: 2 },
]

makeTree(list, {
  props: { label: 'name', value: 'id', parent: 'parent' },
})
// [
//   {
//     name: '根节点',
//     id: 1,
//     parent: null,
//     children: [
//       {
//         name: '子节点',
//         id: 2,
//         parent: 1,
//         children: [
//           { name: '孙节点', id: 3, parent: 2 },
//         ],
//       },
//     ],
//   },
// ]

// 若不配置 props.label，'name' 不会被当作标签字段，结果的 label 为 undefined
makeTree(list, { props: { value: 'id', parent: 'parent' } })
// [{ label: undefined, id: 1, parent: null }]
```
