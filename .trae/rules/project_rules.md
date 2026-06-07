# 项目约束文件 - @muyianking/utils

## 项目概述
通用工具函数库，发布为 npm 包 `@muyianking/utils`，纯 ESM 模块。

## 技术栈

### 核心语言
- **TypeScript** (主语言，所有 `src/` 和 `test/` 代码)
- **JavaScript** (仅构建脚本 `script/*.js`)
- **Node.js** (v24+, 构建/CI 环境)

### 包管理器
- **pnpm** (必需，不得使用 npm/yarn)
- 项目根目录有 `.npmrc` 配置

### 构建工具
- **Rslib** (`@rslib/core` v0.22+) - 基于 Rsbuild/Rspack 的库打包器
- 构建方式: `rslib build` CLI（通过 build.js 脚本调用）
- 输出格式: ESM
- 输出目标: `chrome >= 60` (web)
- 类型声明: 输出到 `dist/types/`
- `package.json` 中 `sideEffects: false`，支持 tree-shaking

### 测试框架
- **Vitest** (v4.1.8+)
- 运行方式: `pnpm vitest --run` (非 watch 模式)
- 路径别名: `@core` → `src/index.ts`
- 测试文件位置: `test/` 目录，文件名格式 `*.test.ts`
- 测试环境: 默认 Node，如需 DOM 使用 `// @vitest-environment jsdom`
- 全局 setup 文件: `vitest.setup.ts`（提供 localStorage polyfill）
- 覆盖率: 公共 API 约 95%（138 tests, 25 test files）
- 验证器、DOM、文件模块另有专用测试文件

### 代码规范
- **ESLint** (v9, 扁平化配置) + **@antfu/eslint-config** (v3.12+)
- **Prettier**: 已禁用，所有格式化由 ESLint 处理
- 缩进: 2 空格
- 引号: **双引号**
- 分号: **始终使用**
- 尾逗号: 多行对象/数组使用
- 大括号风格: `1tbs` (One True Brace Style)

### Git 提交规范
- **约定**: Conventional Commits (Angular 规范)
- **工具**: cz-git (`pnpm commit`)
- **类型枚举**: feat, fix, docs, style, refactor, perf, test, build, ci, revert, chore
- **subject-case**: 不校验
- 提交前自动运行 lint-staged (`husky`)

## 代码约定

### 命名规范
- 函数/变量: **camelCase**
- 类型/接口: **PascalCase**
- 校验函数: `v_` 前缀 (如 `v_int`, `v_email`)
- 文件名: 小写 + 点分隔 (如 `tree.flatTree.ts`, `echarts.util.ts`)

### 导出规范
- 优先使用**命名导出** (`export function` / `export const`)
- 默认导出仅用于 `storage` 和 `echartsUtil`
- barrel 文件: `src/index.ts` 统一重新导出所有模块

### 注释规范
- 导出函数使用 JSDoc 格式 `/** */` 注释
- 注释语言: **中文**

### 文档规范
- 文档位置: `doc/core/<module>.md`，对应 `src/core/<module>.ts`
- 文档格式: Markdown，包含模块描述、类型签名、参数表、返回值、使用示例
- **AI 约束**: 每次修改 `src/` 下的代码后，必须同步更新 `doc/` 下对应的文档文件，确保文档与代码保持一致

### 模块组织
```
src/
├── core/        # 所有功能模块
│   ├── api.ts
│   ├── color.ts
│   ├── common.ts
│   ├── dom.ts
│   ├── echarts.util.ts
│   ├── file.ts
│   ├── storage.ts
│   ├── tree.flatTree.ts
│   ├── tree.maketree.ts
│   ├── tree.to.table.ts
│   └── validator.ts
└── index.ts     # barrel 导出
```

### 路径别名
- `@core` → `src/index.ts` (用于测试导入)

### 运行时依赖 (关键)
| 包 | 版本 | 用途 |
|---|---|---|
| @vueuse/core | ^14.3.0 | Vue 工具函数 (useUrlSearchParams, useDebounceFn, useEventListener) |
| dayjs | ^1.11.21 | 日期处理 |
| echarts | ^6.1.0 | 图表库 (仅 echarts.util.ts) |
| lodash-es | ^4.18.1 | merge, cloneDeep |
| nanoid | ^5.1.11 | UUID 生成 |
| validator | ^13.15.35 | 服务端校验函数 |

## TypeScript 配置
- `target`: ESNext
- `lib`: `["ES2024", "DOM"]`
- `moduleResolution`: `bundler`
- `strict`: true
- `strictNullChecks`: true
- `skipLibCheck`: true
- 不生成编译产物 (`noEmit: true`，由 Rslib 处理)

## CI/CD
- GitHub Actions: 标签推送 (`v*`) 时自动发布到 npm
- 发布流程: `npm i && npm run build`，产物在 `dist/`

## VS Code 设置
- 推荐扩展: ESLint (dbaeumer.vscode-eslint), TODO Highlight
- ESLint 扁平化配置已启用
- 保存时自动修复 ESLint 问题
- `source.organizeImports`: 从不执行
