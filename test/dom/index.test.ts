// @vitest-environment jsdom
import { exitFullScreen, getDpi, getImgSize, getMmByPx, getPtBymm, getPtByPx, getPxBymm, isOverflow, openFullScreen, translateUnit } from '@core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.restoreAllMocks()
})

// isOverflow
it('isOverflow 内容未溢出', () => {
  const el = document.createElement('div')
  Object.defineProperties(el, {
    clientWidth: { value: 200, configurable: true },
    scrollWidth: { value: 200, configurable: true },
    clientHeight: { value: 100, configurable: true },
    scrollHeight: { value: 100, configurable: true },
  })
  expect(isOverflow(el)).toBe(false)
})

it('isOverflow 内容溢出（宽）', () => {
  const el = document.createElement('div')
  Object.defineProperties(el, {
    clientWidth: { value: 200, configurable: true },
    scrollWidth: { value: 300, configurable: true },
    clientHeight: { value: 100, configurable: true },
    scrollHeight: { value: 100, configurable: true },
  })
  expect(isOverflow(el)).toBe(true)
})

it('isOverflow 内容溢出（高）', () => {
  const el = document.createElement('div')
  Object.defineProperties(el, {
    clientWidth: { value: 200, configurable: true },
    scrollWidth: { value: 200, configurable: true },
    clientHeight: { value: 100, configurable: true },
    scrollHeight: { value: 200, configurable: true },
  })
  expect(isOverflow(el)).toBe(true)
})

// openFullScreen
it('openFullScreen 调用 requestFullscreen', () => {
  const el = document.createElement('div')
  const fn = vi.fn()
  el.requestFullscreen = fn
  openFullScreen(el)
  expect(fn).toHaveBeenCalledOnce()
})

it('openFullScreen 不传元素时使用 document.body', () => {
  const fn = vi.fn()
  const orig = document.body.requestFullscreen
  document.body.requestFullscreen = fn
  openFullScreen()
  expect(fn).toHaveBeenCalledOnce()
  document.body.requestFullscreen = orig
})

describe('openFullScreen 厂商前缀回退', () => {
  it('webkitRequestFullScreen', () => {
    const el = { webkitRequestFullScreen: vi.fn() } as unknown as HTMLElement
    openFullScreen(el)
    expect((el as unknown as { webkitRequestFullScreen: () => void }).webkitRequestFullScreen).toHaveBeenCalledOnce()
  })

  it('mozRequestFullScreen', () => {
    const el = { mozRequestFullScreen: vi.fn() } as unknown as HTMLElement
    openFullScreen(el)
    expect((el as unknown as { mozRequestFullScreen: () => void }).mozRequestFullScreen).toHaveBeenCalledOnce()
  })

  it('msRequestFullscreen', () => {
    const el = { msRequestFullscreen: vi.fn() } as unknown as HTMLElement
    openFullScreen(el)
    expect((el as unknown as { msRequestFullscreen: () => void }).msRequestFullscreen).toHaveBeenCalledOnce()
  })
})

// exitFullScreen
it('exitFullScreen 调用 exitFullscreen', () => {
  const fn = vi.fn()
  const orig = document.exitFullscreen
  document.exitFullscreen = fn
  exitFullScreen()
  expect(fn).toHaveBeenCalledOnce()
  document.exitFullscreen = orig
})

describe('exitFullScreen 厂商前缀回退', () => {
  it('webkitCancelFullScreen', () => {
    const orig = document.exitFullscreen
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: undefined })
    const fn = vi.fn()
    ;(document as any).webkitCancelFullScreen = fn

    exitFullScreen()

    expect(fn).toHaveBeenCalledOnce()
    delete (document as any).webkitCancelFullScreen
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: orig })
  })
})

// getDpi
it('getDpi 通过 devicePixelRatio 计算', () => {
  const orig = window.devicePixelRatio
  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 })

  expect(getDpi()).toBe(192)

  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: orig })
})

it('getDpi devicePixelRatio 不可用时用 matchMedia 二分查找', () => {
  const origDpr = window.devicePixelRatio
  const origMatchMedia = window.matchMedia

  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 0 })
  window.matchMedia = ((query: string) => {
    const dpi = Number(/max-resolution:\s*(\d+)dpi/.exec(query)?.[1] ?? 0)
    return { matches: dpi >= 96, media: query } as MediaQueryList
  }) as typeof window.matchMedia

  expect(getDpi()).toBe(96)

  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: origDpr })
  window.matchMedia = origMatchMedia
})

// 单位转换
it('getPxBymm 25.4mm = 96px (96dpi下)', () => {
  expect(getPxBymm(25.4)).toBe(96)
})

it('getPtByPx 96px = 72pt (96dpi下)', () => {
  expect(getPtByPx(96)).toBe(72)
})

it('getMmByPx 96px = 25.4mm (96dpi下)', () => {
  expect(getMmByPx(96)).toBe(25.4)
})

it('getPtBymm 25.4mm = 72pt (96dpi下)', () => {
  expect(getPtBymm(25.4)).toBe(72)
})

describe('translateUnit 单位转换', () => {
  it('mm_px', () => {
    expect(translateUnit(25.4, 'mm', 'px')).toBe(96)
  })
  it('mm_pt', () => {
    expect(translateUnit(25.4, 'mm', 'pt')).toBe(72)
  })
  it('px_pt', () => {
    expect(translateUnit(96, 'px', 'pt')).toBe(72)
  })
  it('px_mm', () => {
    expect(translateUnit(96, 'px', 'mm')).toBe(25.4)
  })
  it('未知组合返回0', () => {
    expect(translateUnit(10, 'px', 'cm')).toBe(0)
  })
})

// getImgSize
it('getImgSize 返回图片宽高', async () => {
  const origImage = globalThis.Image
  const imageMock = vi.fn()
  ;(globalThis as any).Image = imageMock

  const promise = getImgSize('test.jpg')
  const imgInstance = imageMock.mock.instances[0] as any
  // 同步触发 onload
  imgInstance.width = 800
  imgInstance.height = 600
  imgInstance.onload()

  await expect(promise).resolves.toEqual({ width: 800, height: 600 })
  expect(imgInstance.src).toContain('test.jpg')
  globalThis.Image = origImage
})

it('getImgSize 图片加载失败', async () => {
  const origImage = globalThis.Image
  const imageMock = vi.fn()
  ;(globalThis as any).Image = imageMock

  const promise = getImgSize('bad.jpg')
  const imgInstance = imageMock.mock.instances[0] as any
  // 同步触发 onerror
  imgInstance.onerror(new Error('图片加载失败'))

  await expect(promise).rejects.toThrow('图片加载失败')
  globalThis.Image = origImage
})
