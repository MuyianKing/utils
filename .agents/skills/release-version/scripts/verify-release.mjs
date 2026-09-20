// 发布后校验：node verify-release.mjs [version]
// 不传版本号时用 package.json 里的版本
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root_dir = path.resolve(__dirname, '../../../../')
const is_windows = process.platform === 'win32'

const pkg = JSON.parse(readFileSync(path.join(root_dir, 'package.json'), 'utf-8'))
const version = process.argv[2] || pkg.version

let failed = 0

function report(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) {
    failed++
  }
}

function skip(name, detail) {
  console.log(`SKIP  ${name} — ${detail}`)
}

// 命令不存在或非零退出时返回空字符串，由调用方判断
function run(cmd, args) {
  try {
    return execFileSync(cmd, args, {
      cwd: root_dir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      shell: is_windows,
    }).trim()
  } catch {
    return ''
  }
}

console.log(`校验 ${pkg.name}@${version}\n`)

// 1. package.json 版本
report('package.json 版本', pkg.version === version, `package.json = ${pkg.version}`)

// 2. CHANGELOG 首段
const changelog = readFileSync(path.join(root_dir, 'CHANGELOG.md'), 'utf-8')
const first_heading = changelog.match(/^#{1,2} .*$/m)?.[0] || '(空)'
report('CHANGELOG 首段是本次版本', first_heading.includes(`[${version}]`), `首段 = ${first_heading}`)

// 3. tag 存在且与远端一致
const tag = `v${version}`
const local_tag = run('git', ['rev-list', '-n', '1', tag])
const remote_tag = run('git', ['ls-remote', '--tags', 'origin', tag]).split(/\s+/)[0] || ''
report('本地 tag 存在', !!local_tag, `${tag} = ${local_tag || '未找到'}`)
report('远端 tag 与本地一致', !!local_tag && local_tag === remote_tag, `远端 = ${remote_tag || '未找到'}`)

// 4. npm 上的版本
const npm_version = run('npm', ['view', pkg.name, 'version'])
if (npm_version) {
  report('npm 上的版本', npm_version === version, `npm = ${npm_version}`)
} else {
  skip('npm 上的版本', `无法访问 registry，可手动执行 npm view ${pkg.name} version`)
}

// 5. 发布提交：按提交信息定位，不假设它在 HEAD（发布后可能又追加了提交）
const subject = `release: :package: v${version}`
const commits = run('git', ['log', '--format=%H%x09%s', '-n', '100']).split('\n')
const release_sha = commits.map(line => line.split('\t')).find(([, text]) => text === subject)?.[0] || ''
report('存在发布提交', !!release_sha, release_sha || `未找到「${subject}」`)

if (release_sha) {
  const branches = run('git', ['branch', '-r', '--contains', release_sha])
  report('发布提交已推送到 origin/main', /origin\/main/.test(branches), branches.split('\n').join(' / ') || '未推送到任何远端分支')
  report('tag 指向发布提交', local_tag === release_sha, `tag = ${local_tag || '未找到'}`)

  // 6. 发布提交只应包含版本号与 CHANGELOG（git add . 会把工作区所有改动卷进来）
  const allowed = ['package.json', 'CHANGELOG.md']
  const files = run('git', ['show', '--name-only', '--format=', release_sha]).split('\n').filter(Boolean)
  const unexpected = files.filter(file => !allowed.includes(file))
  report(
    '发布提交只含 package.json / CHANGELOG.md',
    unexpected.length === 0,
    unexpected.length ? `多出：${unexpected.join(', ')}` : files.join(', ') || '(无改动文件)',
  )

  if (!files.includes('CHANGELOG.md')) {
    console.log('NOTE  发布提交里没有 CHANGELOG.md：本次没有可写入的 conventional 提交，补救方式见 SKILL.md')
  }
}

console.log(failed ? `\n${failed} 项未通过` : '\n全部通过')
process.exit(failed ? 1 : 0)
