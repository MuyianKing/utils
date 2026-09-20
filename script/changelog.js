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

// -u：输出未发布的提交（带 [Unreleased] 标题），由本脚本替换成当前版本号
const unreleased = execFileSync(process.execPath, [changelog_cli, '-p', 'angular', '-u', '--stdout'], {
  cwd: rootDir,
  encoding: 'utf-8',
})

if (!unreleased.trim()) {
  console.log('changelog: 没有新的提交，跳过')
  process.exit(0)
}

const old_content = existsSync(changelog_path)
  ? readFileSync(changelog_path, 'utf-8').replace(/^\n+/, '')
  : ''

// 幂等：该版本段落已存在就不再重复插入
if (new RegExp(`^#{1,2} \\[${version.replace(/\./g, '\\.')}\\]`, 'm').test(old_content)) {
  console.log(`changelog: ${version} 段落已存在，跳过`)
  process.exit(0)
}

// "# [Unreleased](…/compare/v0.1.3...<sha>) (日期)" → "# [0.2.0](…/compare/v0.1.3...v0.2.0) (日期)"
const section = unreleased
  .replace(/^(#{1,2}) \[Unreleased\]\(([^)]+)\)/m, (match, hashes, url) => {
    const [prefix] = url.split('...')
    return `${hashes} [${version}](${prefix}...v${version})`
  })
  .replace(/\s+$/, '')

writeFileSync(changelog_path, `${section}\n\n${old_content}`, 'utf-8')
console.log(`changelog: 已写入 ${version} 段落`)
