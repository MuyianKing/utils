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

// -u：在输出开头带上未发布段落（标题为 [Unreleased]），由本脚本替换成当前版本号
const output = execFileSync(process.execPath, [changelog_cli, '-p', 'angular', '-u', '--stdout'], {
  cwd: rootDir,
  encoding: 'utf-8',
})

// CLI 同时会输出全量历史，这里只取第一个已发布版本标题之前的部分，
// 否则每次发布都会把历史段落再写一遍
const first_release = output.search(/^#{1,2} \[?\d/m)
const unreleased = (first_release === -1 ? output : output.slice(0, first_release)).replace(/\s+$/, '')

// 只有标题、没有 ### 小节，说明没有可写入的提交
if (!/^### /m.test(unreleased)) {
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

// 标题形态与预期不符时宁可不写，避免把 Unreleased 标题提交进仓库
// 只匹配标题行，提交信息里出现 Unreleased 不算
if (/^#{1,2} .*Unreleased/m.test(section)) {
  console.log('changelog: 未识别到未发布标题，跳过写入')
  process.exit(0)
}

writeFileSync(changelog_path, `${section}\n\n${old_content}`, 'utf-8')
console.log(`changelog: 已写入 ${version} 段落`)
