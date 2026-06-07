# @muyianking/utils — API 文档

通用工具函数库，纯 ESM 模块。

## 目录结构

```
src/
├── core/
│   ├── api.ts              # API 管理
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

| 模块 | 说明 | 导出函数数 | 文档 |
|------|------|-----------|------|
| [api](core/api.md) | API 生成与管理 | 3 | [📄](core/api.md) |
| [color](core/color.md) | 颜色转换与混合 | 3 | [📄](core/color.md) |
| [common](core/common.md) | 通用工具函数 | 9 | [📄](core/common.md) |
| [dom](core/dom.md) | DOM 操作与单位转换 | 10 | [📄](core/dom.md) |
| [echarts.util](core/echarts.util.md) | ECharts 图表初始化 | 3 方法 | [📄](core/echarts.util.md) |
| [file](core/file.md) | 文件类型判断与下载 | 8 函数 + 7 常量 | [📄](core/file.md) |
| [storage](core/storage.md) | localStorage 缓存 | 3 方法 | [📄](core/storage.md) |
| [tree.flatTree](core/tree.flatTree.md) | 树扁平化 | 1 | [📄](core/tree.flatTree.md) |
| [tree.maketree](core/tree.maketree.md) | 构建树 | 1 | [📄](core/tree.maketree.md) |
| [tree.to.table](core/tree.to.table.md) | 树转表格 | 1 | [📄](core/tree.to.table.md) |
| [validator](core/validator.md) | 表单校验 | 16 | [📄](core/validator.md) |

## 总计

- **导出函数**: 55+
- **导出常量**: 7
- **默认导出对象**: 2（`storage`、`echartsUtil`）
- **测试覆盖**: 约 95%（138 tests, 25 test files）

## 安装

```bash
pnpm add @muyianking/utils
```

## 使用

```typescript
import { guid, storage, flatTree, isIdNum } from '@muyianking/utils'

guid()                    // 'aB3dEfGhIjKlMnOp'
storage.set('token', value)
flatTree(treeData)
isIdNum('11010519491231002X') // true
```
