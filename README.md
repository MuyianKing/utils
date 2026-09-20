<h1 align="center">@muyianking/utils</h1>

<p align="center">
通用工具函数库，纯 ESM，支持 tree-shaking
</p>

<p align="center">
  <a target="_blank" href="https://www.npmjs.com/package/@muyianking/utils" style="text-decoration: none;"><img alt="npm version" src="https://img.shields.io/npm/v/%40muyianking%2Futils"/></a>
  <a target="_blank" href="https://www.npmjs.com/package/@muyianking/utils" style="text-decoration: none;"><img alt="npm downloads" src="https://img.shields.io/npm/dm/%40muyianking%2Futils"/></a>
  <a target="_blank" href="https://github.com/MuyianKing/utils/blob/main/LICENSE" style="text-decoration: none;"><img alt="license" src="https://img.shields.io/npm/l/%40muyianking%2Futils"/></a>
</p>

## 特性

- **纯 ESM**：只提供 ES Module 产物，`sideEffects: false`，按需引入即可被 tree-shaking
- **自带类型**：类型声明与源码同源，`moduleResolution` 为 `bundler` / `node16` / `nodenext` 均可正确解析
- **模块化**：通用判断与转换、DOM 与单位换算、文件处理、树结构转换、常用校验（整数/端口/邮箱/手机号/IP/经纬度/身份证）、颜色处理、带过期时间的 localStorage 缓存、ECharts 初始化

## 安装

```bash
# npm
npm i @muyianking/utils

# yarn
yarn add @muyianking/utils

# pnpm
pnpm i @muyianking/utils
```

## 使用

```ts
import {
  echartsUtil,
  flatTree,
  guid,
  isEmail,
  isIdNum,
  isMobilePhone,
  isTruth,
  jsonparse,
  makeTree,
  mix,
  storage,
  treeToTable,
} from '@muyianking/utils'

// 通用工具
guid() // 'aB3dEfGhIjKlMnOp'
isTruth('false') // false
jsonparse('{"a":1}', {}) // { a: 1 }

// 树结构
flatTree(treeData) // 树 → 一维数组
makeTree(list, { props: { label: 'name', value: 'id', parent: 'parentId' } }) // 一维数组 → 树
treeToTable(treeData) // 树 → 带 rowspan/colspan 的表格行，子节点字段名为 next

// 校验（纯函数，返回 boolean）
isIdNum('11010519491231002X') // true
isEmail('a@b.com') // true
isMobilePhone('13800138000') // true

// 颜色
mix('#ff0000', '#ffffff', 0.5) // '#ff8080'，支持 #abc 与 #aabbcc

// 缓存（键名原样存入 localStorage，默认 7 天过期）
storage.set('token', { value: 'x' }, { expire: 1 })
const token = storage.get<{ value: string }>('token')
storage.remove('token')
```

## 文档

完整的模块说明、参数表与示例见 [doc/index.md](./doc/index.md)：

| 模块                                         | 说明                                  |
| -------------------------------------------- | ------------------------------------- |
| [color](./doc/core/color.md)                 | 16 进制与 rgb 互转、亮暗判断、混色    |
| [common](./doc/core/common.md)               | 通用判断与转换                        |
| [dom](./doc/core/dom.md)                     | 全屏、溢出判断、mm/px/pt 单位换算     |
| [echarts.util](./doc/core/echarts.util.md)   | ECharts 初始化与地图注册              |
| [file](./doc/core/file.md)                   | 文件类型判断、下载、Blob 与 JSON 互转 |
| [storage](./doc/core/storage.md)             | 带过期时间的 localStorage 缓存        |
| [tree.flatTree](./doc/core/tree.flatTree.md) | 树扁平化                              |
| [tree.maketree](./doc/core/tree.maketree.md) | 一维数组构建树                        |
| [tree.to.table](./doc/core/tree.to.table.md) | 树转表格合并单元格数据                |
| [validator](./doc/core/validator.md)         | 常用校验                              |

> 部分模块（`dom`、`file`、`storage`、`echarts.util`）依赖浏览器环境，在 SSR / Node 中需要做环境判断后再调用。

## 开发

```bash
pnpm install
pnpm test        # 跑一次测试
pnpm test:watch  # 监听模式
pnpm coverage    # 覆盖率
pnpm typecheck   # 源码与测试的类型检查
pnpm lint        # ESLint（含文档与 CI 配置）
pnpm build       # 产物输出到 dist/
```

## Contributors

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/MuyianKing">
                    <img src="https://avatars.githubusercontent.com/u/44827414?v=4" width="100;" alt="MuyianKing"/>
                    <br />
                    <sub><b>MuyianKing</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->
