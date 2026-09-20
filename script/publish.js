import child_process from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import ora from 'ora'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function publish() {
  const spinner = ora(`create package.json`).start()

  const package_path = path.resolve(__dirname, '../package.json')
  const _config = getObjectFromJson(package_path)

  let version = `v${_config.version}`
  const params = getParams()

  // 如果外部传入版本号则以外部为准
  if (params.v) {
    if (!/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(params.v)) {
      spinner.fail(`版本号格式非法：${params.v}，应形如 0.1.4`)
      process.exit(1)
    }

    version = `v${params.v}`
    _config.version = params.v

    fsExtra.outputFile(
      package_path,
      JSON.stringify(_config, '', '\t'),
      'utf-8',
    )
  }

  try {
    spinner.succeed('create package.json')
    showLog(spinner, 'create log')
    await exec('pnpm log')
    spinner.succeed('create log')
    showLog(spinner, 'git add .')
    await exec('git add .')
    spinner.succeed('git add .')
    showLog(spinner, 'git commit')
    await exec(`git commit -m"release: :package: ${version}"`)
    spinner.succeed('git commit')
    showLog(spinner, 'git push && git tag && git push')
    await exec(`git push && git tag ${version} && git push origin ${version}`)
    spinner.succeed('git push && git tag && git push')
    spinner.succeed('publish successful, waiting for GitHub to automatically Release it to npm')
  } catch (error) {
    spinner.fail('spinner')
    console.log(error)
    process.exitCode = 1
  }
}

function showLog(instance, text) {
  instance.text = text
  instance.start()
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

// 获取参数，支持 v=0.1.4 与 --v=0.1.4 两种写法
function getParams() {
  const params = {}
  process.argv.forEach((item) => {
    const [key, value] = item.split('=')

    if (value !== undefined) {
      params[key.replace(/^-+/, '')] = value
    }
  })

  return params
}

publish()
