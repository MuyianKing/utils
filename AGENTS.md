# AGENTS.md · @muyianking/utils

本仓库的 AI Coding Agent 约束。第 0 节是跨项目通用约束，第 1~6 节是本项目的**既有事实与强约束**；两者冲突时以第 1~6 节为准。

## 0. 通用约束

以下为跨项目通用约束模板中适用于本项目的部分，已并入本文件。

### 修改原则

- 修改文件前先读取并理解现有实现，沿用所在模块的代码风格、命名和技术模式。
- 只做完成用户需求所需的最小修改，不进行无关重构。
- 新增依赖前先检查项目已有依赖、组件、插件和工具；能复用则不引入同类库。
- 不主动创建 README、CI、Docker、测试配置、类型声明或其他非用户要求文件。
- 修改多个关联文件时，保持接口、命名、数据结构和调用链一致。
- 先检查相关文件和既有调用方式，不仅凭文件名或常见框架习惯猜测实现。
- 注释与对外文案使用项目既有语言；格式化遵循项目现有配置，不引入新的格式化工具。

### 验证与 Git

- 较大代码修改后运行项目已有的静态检查或测试命令；没有对应脚本时，不假设或自行引入测试框架。
- 默认不执行 Git 提交，除非用户明确要求。
- 用户要求提交时，先检查 `git status`、`git diff` 和近期提交风格。
- 不泄露、输出或提交密钥、令牌、内部地址及其他敏感配置。
- 禁止执行 `git reset --hard`、`git clean -f`、强制推送等破坏性 Git 操作，除非用户明确要求。
- 输出项目文件引用时使用可跳转的绝对路径链接。

## 1. 项目边界

- 定位：通用工具函数库，发布为 npm 包 `@muyianking/utils`（当前版本 `0.1.3`），**纯 ESM**、`sideEffects: false`、支持 tree-shaking。
- 语言：TypeScript（`src/`、`test/` 全部 `.ts`），JavaScript 仅用于构建脚本 `script/*.js`；构建与 CI 环境为 Node 24。
- 包管理器：**pnpm 唯一**。CI 中 `pnpm/action-setup` 固定 `version: 12.5.1`，不要改成 `latest`（pnpm 大版本会改变 lockfile 校验规则，曾导致 `--frozen-lockfile` 失败）；本地安装用 `pnpm install --frozen-lockfile`，只有 lockfile 与 `package.json` 确实不一致时才用 `--no-frozen-lockfile`；覆盖依赖用 `pnpm.overrides`，不用 yarn 风格的 `resolutions`。仓库无 `.npmrc`、`.nvmrc`、`packageManager` 字段。
- 构建：`@rslib/core` `^0.22.0`，经 `script/build.js` 调用 `rslib build`；只输出 ESM（`output.target: web`、`syntax: chrome >= 60`），类型声明输出到 `dist/types/`。
- 运行时依赖固定为 5 个：`@vueuse/core` `^14.3.0`、`dayjs` `^1.11.21`、`echarts` `^6.1.0`、`lodash-es` `^4.18.1`、`nanoid` `^5.1.11`。
- 工具链：`eslint` 精确锁定 `10.4.1`（无 `^`，扁平化配置）、`@antfu/eslint-config` `^9.0.0`、`eslint-plugin-format` `^2.0.1`、`typescript` `^6.0.3`、`vitest` `^4.1.8` 与 `@vitest/coverage-v8` `^4.1.8`、`jsdom` `^29.1.1`、`husky` `^9.1.7`、`lint-staged` `^17.0.7`、`@commitlint/cli` `^21.0.2`、`cz-git` `^1.13.1`。
- 禁止引入：UI 框架与组件库、路由、状态管理、CSS 方案（Tailwind/Sass 等）、请求库（axios 等）、CommonJS 产物、Jest 等其它测试框架、Prettier。本项目没有页面、组件和样式层，不要为它们建目录或加配置。
- `validator` 依赖已移除，`src/core/validator.ts` 的校验规则是自实现的（`isDomain`、`isIPV6` 为私有辅助函数），**不要重新引入该依赖**；其中 `isInt`、`isPort`、`isEmail`、`isIP`、`isLatLong`、`isMobilePhone` 六个函数已作为**公开 API 导出**（2026-09-20 决定），`isMobilePhone` 有意只支持中国大陆 + 香港/澳门/台湾。
- `src/core/api.ts`（`import.meta.glob` 批量生成请求地址的 `generateApis`/`useURL`/`addPrefixToUrls`）已于 2026-09-20 按用户要求删除，`test/api/`、`doc/core/api.md` 一并移除；它在 git 历史里还有旧版本，**不要恢复或重写**。原先的 `v_*` 表单校验器（Element Plus / Vant 回调风格）也已移除，不要再新增。

## 2. 文件落位

- 功能模块：`src/core/<module>.ts`，一个模块一个文件（如 `tree.flatTree.ts`、`echarts.util.ts`）。
- 出口：`src/index.ts` 是唯一 barrel —— 各功能模块统一 `export *`，`storage`、`echartsUtil` 两个默认导出对象以具名方式再导出；新增模块必须在此登记。
- 文档：`doc/core/<module>.md` 与 `src/core/<module>.ts` 一一对应，总索引为 `doc/index.md`。
- 测试：`test/<域>/<名称>.test.ts`，域目录与 `src/core` 的模块对应（`tree` 域下按 3 个树模块分文件，`echarts` 域对应 `echarts.util`）；测试统一用 `@core` 别名导入被测代码。
- 脚本：`script/build.js`（打包 + 生成裁剪版 `dist/package.json`）、`script/publish.js`（发布）、`script/utils/*.js`（脚本共用小工具，ESM）。
- 产物：`dist/`、`coverage/` 由构建与测试生成且已在 `.gitignore` 中，不要手工修改。

## 3. 编码规范

- 命名：函数与变量 camelCase，类型与接口 PascalCase，判断/校验类函数用 `is` 前缀（`isTruth`、`isEmail`、`isInt` 等，不要用 `v_` 前缀），仅模块内部使用的辅助函数不导出（如 `validator.ts` 中的 `isDomain`、`isIPV6`），文件名小写并用 `.` 分段。
- 导出：优先命名导出；默认导出仅 `storage`、`echartsUtil` 两个对象；默认导出对象的公开方法**不使用 `this`**，必须支持 `const { set } = storage` 式解构调用。
- 注释：导出函数写 JSDoc `/** */`，注释语言为中文。
- 代码风格（由 ESLint `@antfu/eslint-config` 统一，也是全仓现状）：2 空格缩进、单引号、不写分号、多行尾逗号、`1tbs` 大括号风格。
- 相对导入：从无扩展名迁移到显式扩展名（`tsconfig.json` 已开 `allowImportingTsExtensions`），现多数文件用 `.ts`、仅 `src/core/storage.ts` 残留 1 处 `./common.js`；`.ts` 与 `.js` 两种写法都已验证可被消费者正确解析，改文件时与所在文件的写法保持一致，不要新增无扩展名写法。
- 产物约束：README 承诺类型声明在 `bundler` / `node16` / `nodenext` 下均可解析，已实测成立（`dist/types/*.d.ts` 中的 `.ts` 说明符会被解析到同名 `.d.ts`；`node10` 在 TypeScript 6 下需 `ignoreDeprecations`，且该选项 TS 7 将停止支持）；改动相对导入扩展名或 rslib `dts` 配置后，重新构建并抽查 `dist/types/index.d.ts`。
- 类型：`tsconfig.json` 为 `target: ESNext`、`lib: ["ES2024", "DOM"]`、`strict: true`、`noEmit: true`（产物由 Rslib 输出，不要改成 `tsc` 出包）；测试文件也参与 `pnpm typecheck`；不要用 `any` 绕类型（必要时用 `as never` / `as unknown as X` 并说明原因）。
- ESLint 显式覆盖（`eslint.config.js`）：`no-console`、`no-eval`、`no-use-before-define`、`no-new-func`、`no-new`、`curly` 为关闭状态，`brace-style` 固定为 `1tbs`，`ignores` 排除 `package.json` 与 `**/public/**`；不要在这些已有关闭项上叠加新规则。

## 4. 文档同步

- 修改 `src/core/*.ts` 后必须同步更新 `doc/core/*.md`（签名、参数表、返回值、示例）。
- `doc/index.md` 的模块索引与统计数字（导出函数与常量、默认导出对象、测试文件与用例数、覆盖率）必须以 `pnpm test`、`pnpm coverage` 的实测结果更新，不要沿用旧值或凭印象填写；`doc/index.md` 是这些数字的唯一权威来源。
- `pnpm lint` 会检查 `doc/**/*.md` 中的代码块，文档里的 ```typescript 代码块必须是能通过解析的合法 TypeScript，否则报 `Parsing error`。
- README 的模块表格与功能描述要和 `doc/` 保持一致。

## 5. 构建、发布与 CI

- 发布：`pnpm pub --v=0.1.4`（也接受 `v=0.1.4`）会校验 semver、写入 `package.json` 版本、用 `pnpm log` 生成 CHANGELOG、`git add .` 后以 `release: :package: vX.Y.Z` 提交、推送并打 tag，随后由 GitHub Action 发布 npm 并创建 Release。注意 `git add .` 会提交工作区**全部**改动，发布前先清理。
- 构建产物：`script/build.js` 会把 README、LICENSE 复制进 `dist/`，并生成裁剪字段的 `dist/package.json`（去掉 `scripts`、`devDependencies`、`config`、`lint-staged`、`pnpm`、`packageManager`）；`main` / `module` / `types` / `exports` 改动后要验证发布产物入口。
- CI 门禁：`.github/workflows/test.yml`（push main 与 PR：lint → typecheck → coverage → build）、`.github/workflows/publish.yml`（tag `v*` 或手动触发：typecheck → test → build → 从 `dist/` 发布 → GitHub Release）、`.github/workflows/reademe-contributors.yml`（push main 自动重写 README 的贡献者表格，标记区间内的表格不要手改）。
- 提交规范：Conventional Commits，交互式提交用 `pnpm commit`（cz-git）；type 枚举见 `commitlint.config.js`（`feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`revert`、`chore`），subject 大小写不校验。husky 只挂了 `pre-commit`（执行 `pnpm exec lint-staged`，对 `*.{js,ts,vue}` 跑 `eslint --fix`），没有 `commit-msg` 钩子，所以 commitlint 的 type 枚举不是强制门禁。
- CHANGELOG：`CHANGELOG.md` 由 `pnpm log`（conventional-changelog 的 angular 预设）在发布时生成，不要手工编排历史条目。
- `.gitattributes` 把 `.husky/*` 固定为 LF，不要修改（CRLF 会导致钩子执行失败）。

## 6. Agent 操作与验证

- 可用脚本：`pnpm lint` / `pnpm lint:fix`、`pnpm typecheck`、`pnpm test`（= `vitest --run`）、`pnpm test:watch`、`pnpm coverage`（v8 provider，只统计 `src/**/*.ts`，报告输出到 `coverage/`）、`pnpm build`、`pnpm dev`。
- 改动 `src/` 代码后至少跑 `pnpm lint` + `pnpm typecheck` + `pnpm test`；只改文档跑 `pnpm lint`。
- 不要执行 `pnpm pub`、`pnpm commit`、`pnpm update-dep`，除非用户明确要求（`pub` 会提交工作区全部改动并推送 tag）。
- 测试环境默认 Node；需要 DOM 时在测试文件首行加 `// @vitest-environment jsdom`，`vitest.setup.ts` 已提供 localStorage polyfill，不要重复实现。
- 编辑器侧已固定：`prettier.enable` 为 false、`editor.formatOnSave` 为 false、保存时只跑 `source.fixAll.eslint`、`source.organizeImports` 为 never；不要在仓库里新增格式化工具或改这套设置。
