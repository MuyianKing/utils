---
name: "release-version"
version: "0.1.0"
description: "本仓库（@muyianking/utils）的版本发布流程：发布前预检、执行 pnpm pub 发版、校验 CHANGELOG 与 tag、确认 npm 产物。当用户说\"发布0.2.2\"、\"发版\"、\"发个新版本\"、\"发布到 npm\"、\"release\"、\"打个 tag 发布\"等类似意图时立即触发。"
---

# Release Version（发布版本）

`@muyianking/utils` 的发布链路：本地 `pnpm pub` 改版本号、写 CHANGELOG、提交、打 tag，GitHub Action 接手构建并发布到 npm、创建 Release。本 Skill 固化这条链路，以及 2026-09-20 发布 0.2.1 时踩到的坑。

## 触发条件

- "发布0.2.2"、"发版"、"发个新版本"、"发布到 npm"
- "release"、"publish 到 npm"、"打个 tag 发布"

## 硬约束（先读）

- `pnpm pub` 会 `git add .` 提交工作区**全部**改动并推送 tag，只在用户明确要求发布时执行。
- 已推送的 tag 不可修改。不要用 `git reset --hard`、强制推送补救，只能追加提交。
- npm 上线的版本无法撤回（只能 `deprecate`），发布前把预检做完。

## Step 1 · 发布前预检

逐条确认，任一不通过就先解决再发：

1. **工作区干净**：`git status --short` 无输出。`pnpm pub` 的 `git add .` 会把所有改动卷进发布提交。
2. **门禁全绿**：`pnpm lint`、`pnpm typecheck`、`pnpm test`；CI 发布流程同样跑 typecheck/test/build。
3. **版本号**：`node -p "require('./package.json').version"` 确认当前版本；目标 `vX.Y.Z` 在本地与远端都不存在（`git tag --list 'vX.Y.Z'`、`git ls-remote --tags origin 'vX.Y.Z'`）。
4. **lockfile 与 package.json 一致**：CI 用 `pnpm install --frozen-lockfile`，依赖改了却没更新 lockfile 会让发布 Action 直接失败。
5. **提交信息是 conventional**：待发布内容若希望出现在本次 CHANGELOG 段落里，提交信息必须是 `feat`/`fix`/`docs`/`perf`/`refactor`/`test`/`build`/`ci`/`chore` 等前缀；非 conventional 提交（例如 `晚上JSDoc`）会被 angular 预设忽略，只发版不进 CHANGELOG。
6. **文档统计**：`doc/index.md` 的导出数量、测试文件与用例数、覆盖率必须用 `pnpm test`、`pnpm coverage` 的实测值更新（AGENTS.md 第 4 节）。

## Step 2 · 执行发布

```bash
pnpm pub --v=0.2.2      # 也接受 v=0.2.2
```

`script/publish.js` 依次做：

1. 校验 semver（`^\d+\.\d+\.\d+(?:-[\w.]+)?$`，非法则退出），把版本号写进 `package.json`（tab 缩进）
2. `pnpm log` → `script/changelog.js` 生成 CHANGELOG 段落
3. `git add .` → `git commit -m"release: :package: v0.2.2"`
4. `git push && git tag v0.2.2 && git push origin v0.2.2`

随后 `.github/workflows/publish.yml` 由 tag 触发：typecheck → test → build → 从 `dist/` 发布 npm → 创建 GitHub Release。该 workflow 带 `if: github.event.repository.owner.id == github.event.sender.id`，推 tag 的人不是仓库 owner 时不会执行。

## Step 3 · 发布后校验

```bash
node .agents/skills/release-version/scripts/verify-release.mjs 0.2.2
```

脚本逐项核对：`package.json` 版本、CHANGELOG 首段、本地与远端 tag 是否一致、npm 上的版本、发布提交是否存在且已推送到 `origin/main`、tag 是否指向发布提交、发布提交是否只动了 `package.json` 与 `CHANGELOG.md`。任一项 FAIL 按输出定位；npm 查询不到会显示 SKIP 而不是 FAIL（离线时手动跑 `npm view @muyianking/utils version`）。发布提交里没有 `CHANGELOG.md` 时会额外提示 NOTE，说明本次没有可写入的 conventional 提交。

本机没有 `gh` CLI，判断 Action 是否成功看 npm：`npm view @muyianking/utils version` 返回目标版本即已上线（Release 由同一个 Action 创建）。

产物抽查，确认发出去的是最新代码而不是旧构建：

```bash
cd /tmp && npm pack @muyianking/utils@0.2.2 && tar -xzf muyianking-utils-0.2.2.tgz
grep -A 3 "校验是否为整数" package/types/core/validator.d.ts
```

## CHANGELOG 生成机制与已知坑

`script/changelog.js` 调 conventional-changelog CLI（angular 预设，`-u`）：

- CLI 输出「首段 + 全量历史」，脚本**只取首段**，否则每次发布都会把历史段落再写一遍（0.2.0 发布时就是这样把 0.1.x 段落写重了的）。
- 首段标题有两种形态：`package.json` 版本已大于最新 tag（发布进行中）时标题直接是当前版本 `## [0.2.2]`；版本与最新 tag 一致时标题是 `# [Unreleased](…)`，脚本再替换成版本号。
- 首段没有 `### ` 小节（没有可写入的提交）时脚本跳过写入，此时发布提交里**只有 `package.json`**、CHANGELOG 不含本次版本 —— 属正常行为，不是发布失败。
- 幂等：该版本段落已存在则跳过，不会重复插入。
- **漏写 CHANGELOG 的补救**（不要手工编排条目）：临时删掉本地 tag，让首段回到「当前版本」形态重新生成，再把 tag 取回：

```bash
git tag -d v0.2.2 && node ./script/changelog.js && git fetch --tags
git tag --list 'v0.2.2' --format='%(refname:short) %(objectname)'   # 确认仍指向发布提交
```

- `CHANGELOG.md` 里 0.1.3～0.0.1 的段落重复着两份，是旧脚本把全量历史整体前置写入的遗留。按 AGENTS.md 不手工改历史条目，除非用户明确要求清理。
- 发布后新增的提交会进入下一个版本的段落，这是预期行为。

## 参考

- `script/publish.js`、`script/changelog.js`、`.github/workflows/publish.yml`
- `AGENTS.md` 第 5 节（构建、发布与 CI）、第 6 节（`pnpm pub` 只在用户明确要求时执行）
