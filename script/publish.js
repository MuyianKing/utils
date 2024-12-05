import child_process from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = fileURLToPath(import.meta.url)

async function publish() {
  const _path = `../../package.json`
  const package_path = path.resolve(__dirname, _path)
  const _config = getObjectFromJson(package_path)

  const version = `v${_config.version}`

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

publish()
