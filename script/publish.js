import child_process from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = fileURLToPath(import.meta.url)

async function publish() {
  const _path = `../../package.json`
  const package_path = path.resolve(__dirname, _path)
  const _config = getObjectFromJson(package_path)

  let version = `v${_config.version}`
  const params = getParams()

  // 如果外部传入版本号则以外部为准
  if (params.v) {
    version = `v${params.v}`
    _config.version = params.v

    fsExtra.outputFile(
      package_path,
      JSON.stringify(_config, '', '\t'),
      'utf-8',
    )
  }

  try {
    await exec('pnpm log')
    await exec('git add .')
    await exec(`git commit -m"release: :package: ${version}"`)
    await exec(`git push && git tag ${version} && git push origin ${version}`)
    console.log('\x1B[32m%s\x1B[0m', 'publish success')
  } catch (error) {
    console.log('=======================publish error=======================')
    console.log(error)
  }
}

function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error) => {
      if (!error) {
        resolve('ok')
      } else {
        reject(error)
      }
    })
  })
}

// 获取参数
function getParams() {
  const params = {}
  process.argv.forEach((item) => {
    item = item.split('=')

    if (item.length === 2) {
      params[item[0]] = item[1]
    }
  })

  return params
}

publish()
