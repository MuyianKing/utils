import { execSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 打包输出路径
const outputDir = path.resolve(__dirname, '../dist')
// 项目根目录
const rootDir = path.resolve(__dirname, '..')

async function buildLib() {
  // rslib打包（使用CLI），rslib 会先清空输出目录
  execSync('npx rslib build', { stdio: 'inherit', cwd: rootDir })

  // 拷贝 README / LICENSE
  for (const file of ['README.md', 'LICENSE']) {
    const from = path.resolve(rootDir, file)
    if (existsSync(from)) {
      copyFileSync(from, path.resolve(outputDir, file))
    }
  }

  // 生成package.json
  const package_json = getObjectFromJson(path.resolve(rootDir, 'package.json'))
  for (const key of ['scripts', 'devDependencies', 'config', 'lint-staged', 'pnpm', 'packageManager']) {
    delete package_json[key]
  }
  fsExtra.outputFile(
    path.resolve(outputDir, `package.json`),
    JSON.stringify(package_json, '', '\t'),
    'utf-8',
  )
}

buildLib()
