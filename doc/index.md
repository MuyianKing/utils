# @muyianking/utils — API 文档

通用工具函数库，纯 ESM 模块。

## 目录结构

```
src/
├── core/
│   ├── color.ts            # 颜色处理
│   ├── common.ts           # 通用工具
│   ├── dom.ts              # DOM 操作
│   ├── echarts.util.ts     # ECharts 工具
│   ├── file.ts             # 文件处理
│   ├── storage.ts          # 缓存管理
│   ├── tree.flatTree.ts    # 树扁平化
│   ├── tree.maketree.ts    # 构建树
│   ├── tree.to.table.ts    # 树转表格
│   └── validator.ts        # 校验器
└── index.ts                # barrel 导出
```

## 模块索引

| 模块                                   | 说明               | 导出函数数      | 文档                        |
| -------------------------------------- | ------------------ | --------------- | --------------------------- |
| [color](core/color.md)                 | 颜色转换与混合     | 4               | [📄](core/color.md)         |
| [common](core/common.md)               | 通用工具函数       | 9               | [📄](core/common.md)        |
| [dom](core/dom.md)                     | DOM 操作与单位转换 | 10              | [📄](core/dom.md)           |
| [echarts.util](core/echarts.util.md)   | ECharts 图表初始化 | 3 方法          | [📄](core/echarts.util.md)  |
| [file](core/file.md)                   | 文件类型判断与下载 | 7 函数 + 7 常量 | [📄](core/file.md)          |
| [storage](core/storage.md)             | localStorage 缓存  | 3 方法          | [📄](core/storage.md)       |
| [tree.flatTree](core/tree.flatTree.md) | 树扁平化           | 1               | [📄](core/tree.flatTree.md) |
| [tree.maketree](core/tree.maketree.md) | 构建树             | 1               | [📄](core/tree.maketree.md) |
| [tree.to.table](core/tree.to.table.md) | 树转表格           | 1               | [📄](core/tree.to.table.md) |
| [validator](core/validator.md)         | 常用校验           | 13              | [📄](core/validator.md)     |

## 总计

- **导出函数**: 46（color 4、common 9、dom 10、file 7、tree.flatTree 1、tree.maketree 1、tree.to.table 1、validator 13）
- **导出常量**: 7（file.ts 中的 6 个后缀/大小常量 + `mime_type`）
- **默认导出对象**: 2（`storage` 3 个方法、`echartsUtil` 3 个方法）
- **测试**: 24 个测试文件、231 个用例（`pnpm test`）
- **测试覆盖**: 语句 95.67%、分支 89.55%、函数 99.08%、行 95.49%（`pnpm coverage` 实测）

## 安装

```bash
pnpm add @muyianking/utils
```

## 使用

```typescript
import { flatTree, guid, isEmail, isIdNum, storage } from '@muyianking/utils'

guid() // 'aB3dEfGhIjKlMnOp'
storage.set('token', 'abc123')
storage.get('token') // 'abc123'
flatTree(treeData)
isIdNum('11010519491231002X') // true
isEmail('a@b.com') // true
```
