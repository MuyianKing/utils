// 上传文件最大大小
export const UPLOAD_FILE_MAX_SIZE = 10
// 上传视频最大大小
export const UPLOAD_VIDEO_MAX_SIZE = 500
// 附件格式
export const FILE_SUFFIX = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip']
// 视频格式
export const VIDEO_SUFFIX = ['mp4', 'm3u8', 'avi']
// 图片格式
export const IMAGE_SUFFIX = ['jpg', 'jpeg', 'png', 'gif']
// 音频格式
export const AUDIO_SUFFIX = ['mp3', 'wav', 'm4a']

/**
 * 获取后缀
 * @param fileName 文件名
 * @returns 小写后缀，无后缀或文件名为空时返回空字符串
 * @example getSuffix('test.mp4') // 'mp4'
 * @example getSuffix('test.2.MP4') // 'mp4'
 * @example getSuffix('test') // ''
 * @example getSuffix('') // ''
 */
export function getSuffix(fileName: string): string {
  if (fileName === '') {
    return ''
  }

  const name_array = fileName.split('.')
  if (name_array.length < 2) {
    return ''
  }
  return name_array[name_array.length - 1].toLowerCase()
}

/**
 * 获取指定文件类型的MIME类型
 * @param types 单个后缀或后缀数组
 * @returns 入参为字符串时返回字符串（查不到返回空字符串），入参为数组时返回 MIME 类型数组
 * @example getMimeType('jpg') // 'image/jpeg'
 * @example getMimeType(['jpg', 'png']) // ['image/jpeg', 'image/png']
 * @example getMimeType('unknown') // ''
 */
export function getMimeType<T extends string[] | string>(types: T): T extends string[] ? string[] : string {
  type return_type = T extends string[] ? string[] : string

  if (!(Array.isArray(types))) {
    return (mime_type.find(item => types === item.suffix)?.mime_type || '') as return_type
  }

  return mime_type.filter(item => types.includes(item.suffix)).map(item => item.mime_type) as return_type
}

/**
 * 根据文件名获取文件类型
 * @param file_name 文件名，不区分大小写
 * @returns 'image'、'video'、'audio'、'file' 或 ''（无法识别）
 * @example getType('test.jpg') // 'image'
 * @example getType('test.mp4') // 'video'
 * @example getType('test.mp3') // 'audio'
 * @example getType('test.pdf') // 'file'
 * @example getType('test.xyz') // ''
 */
export function getType(file_name: string) {
  if (!file_name) {
    return ''
  }

  file_name = file_name.toLowerCase()

  const suffix = getSuffix(file_name)
  if (IMAGE_SUFFIX.includes(suffix)) {
    return 'image'
  }

  if (VIDEO_SUFFIX.includes(suffix)) {
    return 'video'
  }

  if (AUDIO_SUFFIX.includes(suffix)) {
    return 'audio'
  }

  if (FILE_SUFFIX.includes(suffix)) {
    return 'file'
  }

  return ''
}

/**
 * 下载文件
 * @param url 下载地址，blob: 开头的地址会在下载后释放
 * @param name 下载保存的文件名
 * @example download('https://example.com/file.pdf', 'report.pdf')
 * @example download('blob:http://example.com/uuid', 'image.png')
 */
export function download(url: string, name: string): void {
  const link = document.createElement('a')
  name && (link.download = name)
  link.style.display = 'none'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  if (url.startsWith('blob:')) {
    window.URL.revokeObjectURL(url)
  }
}

/**
 * 文件地址转Blob对象
 * @param url 文件地址
 * @returns Blob 对象，请求失败时 reject
 * @example const blob = await getBlobFromUrl('https://example.com/file.pdf')
 */
export async function getBlobFromUrl(url: string) {
  const response = await fetch(url)
  return await response.blob()
}

/**
 * File转blob
 * @param file File 对象
 * @param type 文件的mime_type,如text/plain
 * @returns Blob 对象，读取结果为空时 reject Error('转换失败')
 * @example const blob = await fileToBlob(file, 'text/plain')
 */
export function fileToBlob(file: File, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (evt) {
      if (!evt || !evt.target || !evt.target.result) {
        reject(new Error('转换失败'))
      } else {
        const blob = new Blob([evt.target.result], { type })
        resolve(blob)
      }
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 将blob转为json
 * @param blob blob数据
 * @returns 解析结果，读取失败或内容不是合法 JSON 时 reject
 * @example const data = await readBlobAsJSON(blob)
 * @example const user = await readBlobAsJSON<User>(blob) // 泛型指定解析结果类型
 */
export function readBlobAsJSON<T = any>(blob: Blob): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function () {
      try {
        resolve(JSON.parse(reader.result as string))
      } catch (e) {
        reject(new Error(`JSON 解析失败：${(e as Error).message}`))
      }
    }
    reader.onerror = function () {
      reject(reader.error || new Error('文件读取失败'))
    }
    reader.readAsText(blob)
  })
}

export const mime_type: Array<{ suffix: string, mime_type: string }> = [{
  suffix: 'apk',
  mime_type: 'application/vnd.android.package-archive',
}, {
  suffix: 'asf',
  mime_type: 'video/x-ms-asf',
}, {
  suffix: 'avi',
  mime_type: 'video/x-msvideo',
}, {
  suffix: 'bin',
  mime_type: 'application/octet - stream',
}, {
  suffix: 'bmp',
  mime_type: 'image/bmp',
}, {
  suffix: 'c',
  mime_type: 'text/plain',
}, {
  suffix: 'class',
  mime_type: 'application/octet-stream',
}, {
  suffix: 'conf',
  mime_type: 'text/plain',
}, {
  suffix: 'cpp',
  mime_type: 'text/plain',
}, {
  suffix: 'doc',
  mime_type: 'application/msword',
}, {
  suffix: 'docx',
  mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}, {
  suffix: 'xls',
  mime_type: 'application/vnd.ms-excel',
}, {
  suffix: 'xlsx',
  mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}, {
  suffix: 'exe',
  mime_type: 'application/octet-stream',
}, {
  suffix: 'gif',
  mime_type: 'image/gif',
}, {
  suffix: 'gtar',
  mime_type: 'application/x-gtar',
}, {
  suffix: 'gz',
  mime_type: 'application/x-gzip',
}, {
  suffix: 'h',
  mime_type: 'text/plain',
}, {
  suffix: 'htm',
  mime_type: 'text/html',
}, {
  suffix: 'html',
  mime_type: 'text/html',
}, {
  suffix: 'jar',
  mime_type: 'application/java-archive',
}, {
  suffix: 'java',
  mime_type: 'text/plain',
}, {
  suffix: 'jpeg',
  mime_type: 'image/jpeg',
}, {
  suffix: 'jpg',
  mime_type: 'image/jpeg',
}, {
  suffix: 'js',
  mime_type: 'application/x-javascript',
}, {
  suffix: 'log',
  mime_type: 'text/plain',
}, {
  suffix: 'm3u8',
  mime_type: 'audio/x-mpegurl',
}, {
  suffix: 'm4a',
  mime_type: 'audio/mp4a-latm',
}, {
  suffix: 'm4b',
  mime_type: 'audio/mp4a-latm',
}, {
  suffix: 'm4p',
  mime_type: 'audio/mp4a-latm',
}, {
  suffix: 'm4u',
  mime_type: 'video/vnd.mpegurl',
}, {
  suffix: 'm4v',
  mime_type: 'video/x-m4v',
}, {
  suffix: 'mov',
  mime_type: 'video/quicktime',
}, {
  suffix: 'mp2',
  mime_type: 'audio/x-mpeg',
}, {
  suffix: 'mp3',
  mime_type: 'audio/x-mpeg',
}, {
  suffix: 'mp4',
  mime_type: 'video/mp4',
}, {
  suffix: 'mpc',
  mime_type: 'application/vnd.mpohun.certificate',
}, {
  suffix: 'mpe',
  mime_type: 'video/mpeg',
}, {
  suffix: 'mpeg',
  mime_type: 'video/mpeg',
}, {
  suffix: 'mpg',
  mime_type: 'video/mpeg',
}, {
  suffix: 'mpg4',
  mime_type: 'video/mp4',
}, {
  suffix: 'mpga',
  mime_type: 'audio/mpeg',
}, {
  suffix: 'msg',
  mime_type: 'application/vnd.ms-outlook',
}, {
  suffix: 'ogg',
  mime_type: 'audio/ogg',
}, {
  suffix: 'pdf',
  mime_type: 'application/pdf',
}, {
  suffix: 'png',
  mime_type: 'image/png',
}, {
  suffix: 'pps',
  mime_type: 'application/vnd.ms-powerpoint',
}, {
  suffix: 'ppt',
  mime_type: 'application/vnd.ms-powerpoint',
}, {
  suffix: 'pptx',
  mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}, {
  suffix: 'prop',
  mime_type: 'text/plain',
}, {
  suffix: 'rc',
  mime_type: 'text/plain',
}, {
  suffix: 'rmvb',
  mime_type: 'audio/x-pn-realaudio',
}, {
  suffix: 'rtf',
  mime_type: 'application/rtf',
}, {
  suffix: 'sh',
  mime_type: 'text/plain',
}, {
  suffix: 'tar',
  mime_type: 'application/x-tar',
}, {
  suffix: 'tgz',
  mime_type: 'application/x-compressed',
}, {
  suffix: 'txt',
  mime_type: 'text/plain',
}, {
  suffix: 'wav',
  mime_type: 'audio/x-wav',
}, {
  suffix: 'wma',
  mime_type: 'audio/x-ms-wma',
}, {
  suffix: 'wmv',
  mime_type: 'audio/x-ms-wmv',
}, {
  suffix: 'wps',
  mime_type: 'application/vnd.ms-works',
}, {
  suffix: 'xml',
  mime_type: 'text/plain',
}, {
  suffix: 'z',
  mime_type: 'application/x-compress',
}, {
  suffix: 'zip',
  mime_type: 'application/x-zip-compressed',
}]
