import { AUDIO_SUFFIX, download, FILE_SUFFIX, fileToBlob, getBlobFromUrl, IMAGE_SUFFIX, readBlobAsJSON, UPLOAD_FILE_MAX_SIZE, UPLOAD_VIDEO_MAX_SIZE, VIDEO_SUFFIX } from '@core'
// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.restoreAllMocks()
})

// 常量
it('uPLOAD_FILE_MAX_SIZE = 10', () => {
  expect(UPLOAD_FILE_MAX_SIZE).toBe(10)
})

it('uPLOAD_VIDEO_MAX_SIZE = 500', () => {
  expect(UPLOAD_VIDEO_MAX_SIZE).toBe(500)
})

it('fILE_SUFFIX 附件格式', () => {
  expect(FILE_SUFFIX).toContain('doc')
  expect(FILE_SUFFIX).toContain('pdf')
  expect(FILE_SUFFIX).toContain('zip')
})

it('vIDEO_SUFFIX 视频格式', () => {
  expect(VIDEO_SUFFIX).toContain('mp4')
  expect(VIDEO_SUFFIX).toContain('m3u8')
  expect(VIDEO_SUFFIX).toContain('avi')
})

it('iMAGE_SUFFIX 图片格式', () => {
  expect(IMAGE_SUFFIX).toContain('jpg')
  expect(IMAGE_SUFFIX).toContain('png')
  expect(IMAGE_SUFFIX).toContain('gif')
})

it('aUDIO_SUFFIX 音频格式', () => {
  expect(AUDIO_SUFFIX).toContain('mp3')
  expect(AUDIO_SUFFIX).toContain('wav')
  expect(AUDIO_SUFFIX).toContain('m4a')
})

// download
it('download 创建并点击a标签', () => {
  const linkMock = {
    download: '',
    href: '',
    style: { display: '' },
    click: vi.fn(),
  }
  const createElement = vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any)
  const appendChild = vi.spyOn(document.body, 'appendChild').mockReturnValue(linkMock as any)
  const removeChild = vi.spyOn(document.body, 'removeChild').mockReturnValue(linkMock as any)
  const revokeObjectURL = vi.spyOn(window.URL, 'revokeObjectURL').mockReturnValue()

  download('http://example.com/file.pdf', 'myfile.pdf')

  expect(createElement).toHaveBeenCalledWith('a')
  expect(linkMock.download).toBe('myfile.pdf')
  expect(linkMock.href).toBe('http://example.com/file.pdf')
  expect(appendChild).toHaveBeenCalled()
  expect(linkMock.click).toHaveBeenCalledOnce()
  expect(removeChild).toHaveBeenCalled()
  // 非 blob: URL 不触发 revokeObjectURL
  expect(revokeObjectURL).not.toHaveBeenCalled()
})

it('download blob URL 调用 revokeObjectURL', () => {
  const linkMock = {
    download: '',
    href: '',
    style: { display: '' },
    click: vi.fn(),
  }
  vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any)
  vi.spyOn(document.body, 'appendChild').mockReturnValue(linkMock as any)
  vi.spyOn(document.body, 'removeChild').mockReturnValue(linkMock as any)
  const revokeObjectURL = vi.spyOn(window.URL, 'revokeObjectURL').mockReturnValue()

  download('blob:http://example.com/uuid', 'file.pdf')

  expect(revokeObjectURL).toHaveBeenCalledWith('blob:http://example.com/uuid')
})

it('download 无 name 时不设置 download 属性', () => {
  const linkMock = {
    download: '',
    href: '',
    style: { display: '' },
    click: vi.fn(),
  }
  vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any)
  vi.spyOn(document.body, 'appendChild').mockReturnValue(linkMock as any)
  vi.spyOn(document.body, 'removeChild').mockReturnValue(linkMock as any)

  download('http://example.com/file.pdf', '')

  expect(linkMock.download).toBe('')
})

// readBlobAsJSON
it('readBlobAsJSON 读取Blob中的JSON', async () => {
  const data = { a: 1, b: 'hello' }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  await expect(readBlobAsJSON(blob)).resolves.toEqual(data)
})

it('readBlobAsJSON 读取数组JSON', async () => {
  const data = [1, 2, 3]
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  await expect(readBlobAsJSON(blob)).resolves.toEqual(data)
})

it('readBlobAsJSON 内容不是合法 JSON 时 reject，而不是一直 pending', async () => {
  const blob = new Blob(['not json'], { type: 'application/json' })
  await expect(readBlobAsJSON(blob)).rejects.toThrow('JSON 解析失败')
})

it('readBlobAsJSON 支持泛型指定返回类型', async () => {
  const blob = new Blob([JSON.stringify({ a: 1 })], { type: 'application/json' })
  await expect(readBlobAsJSON<{ a: number }>(blob)).resolves.toEqual({ a: 1 })
})

// getBlobFromUrl
it('getBlobFromUrl fetch 获取 Blob', async () => {
  const fakeBlob = new Blob(['test'], { type: 'text/plain' })
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    blob: () => Promise.resolve(fakeBlob),
  } as Response)

  const result = await getBlobFromUrl('http://example.com/file.txt')
  expect(result).toBe(fakeBlob)
  expect(fetchMock).toHaveBeenCalledWith('http://example.com/file.txt')
})

// fileToBlob
it('fileToBlob File 转 Blob', async () => {
  const content = 'hello world'
  const file = new File([content], 'test.txt', { type: 'text/plain' })
  const blob = await fileToBlob(file, 'text/plain')
  expect(blob).toBeInstanceOf(Blob)
  expect(blob.type).toBe('text/plain')
})
