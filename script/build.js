import { constants, copyFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '@rslib/core'
import fsExtra from 'fs-extra'
import config from '../rslib.config.js'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = fileURLToPath(import.meta.url)

// 打包输出路径
const outputDir = path.resolve(__dirname, '../../dist')

async function buildLib() {
  // rslib打包
  await build(config)

  // 拷贝READMER.md
  const package_path = path.resolve(__dirname, `../../README.md`)
  copyFileSync(package_path, path.resolve(outputDir, `README.md`), constants.COPYFILE_EXCL)

  // 生成package.json
  const package_json = getObjectFromJson(path.resolve(__dirname, `../../package.json`))
  delete package_json.scripts
  delete package_json.devDependencies
  delete package_json.config
  delete package_json.resolutions
  delete package_json['lint-staged']
  fsExtra.outputFile(
    path.resolve(outputDir, `package.json`),
    JSON.stringify(package_json, '', '\t'),
    'utf-8',
  )
}

buildLib()
