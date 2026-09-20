import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const changelog_path = path.resolve(rootDir, 'CHANGELOG.md')

// 直接用 node 跑 CLI，避免依赖 PATH 与 Windows 下的 .cmd
const changelog_cli = path.resolve(rootDir, 'node_modules/conventional-changelog/dist/cli/index.js')

const { version } = getObjectFromJson(path.resolve(rootDir, 'package.json'))

// -u：在输出开头带上当前版本段落，由本脚本截取并写入
const output = execFileSync(process.execPath, [changelog_cli, '-p', 'angular', '-u', '--stdout'], {
  cwd: rootDir,
  encoding: 'utf-8',
})

// CLI 会输出「首段 + 全量历史」，这里只取首段，否则每次发布都会把历史段落再写一遍。
// 首段有两种形态：package.json 版本已大于最新 tag 时（发布中）标题就是当前版本，
// 版本与最新 tag 一致时标题是 [Unreleased]，由下面的替换改成当前版本号
const headings = [...output.matchAll(/^#{1,2} /gm)]
const first_section = output.slice(0, headings[1]?.index ?? output.length).replace(/\s+$/, '')

// 只有标题、没有 ### 小节，说明没有可写入的提交
if (!/^### /m.test(first_section)) {
  console.log('changelog: 没有新的提交，跳过')
  process.exit(0)
}

const old_content = existsSync(changelog_path)
  ? readFileSync(changelog_path, 'utf-8').replace(/^\n+/, '')
  : ''

// 幂等：该版本段落已存在就不再重复插入
const version_regexp = version.replace(/\./g, '\\.')
if (new RegExp(`^#{1,2} \\[${version_regexp}\\]`, 'm').test(old_content)) {
  console.log(`changelog: ${version} 段落已存在，跳过`)
  process.exit(0)
}

// "# [Unreleased](…/compare/v0.1.3...<sha>) (日期)" → "# [0.2.0](…/compare/v0.1.3...v0.2.0) (日期)"
const section = first_section
  .replace(/^(#{1,2}) \[Unreleased\]\(([^)]+)\)/m, (match, hashes, url) => {
    const [prefix] = url.split('...')
    return `${hashes} [${version}](${prefix}...v${version})`
  })
  .replace(/\s+$/, '')

// 首段标题必须是当前版本，否则宁可不写：避免把 Unreleased 或旧版本段落提交进仓库
if (!new RegExp(`^#{1,2} \\[${version_regexp}\\]`, 'm').test(section)) {
  console.log(`changelog: 首段标题不是 ${version}，跳过写入`)
  process.exit(0)
}

writeFileSync(changelog_path, `${section}\n\n${old_content}`, 'utf-8')
console.log(`changelog: 已写入 ${version} 段落`)
