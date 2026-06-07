// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDpi, getImgSize, getMmByPx, getPtBymm, getPtByPx, getPxBymm, isOverflow, openFullScreen, exitFullScreen, translateUnit } from '@core'

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

it('openFullScreen 默认使用 document.body', () => {
  const fn = vi.fn()
  const orig = document.body.requestFullscreen
  document.body.requestFullscreen = fn
  openFullScreen(document.body)
  expect(fn).toHaveBeenCalledOnce()
  document.body.requestFullscreen = orig
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

// getDpi
it('getDpi 通过 devicePixelRatio 计算', () => {
  expect(getDpi()).toBe(Math.round(window.devicePixelRatio * 96))
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

  let imgInstance: any = null
  ;(globalThis as any).Image = vi.fn().mockImplementation(function (this: any) {
    imgInstance = this
    this.width = 0
    this.height = 0
    return this
  })

  const promise = getImgSize('test.jpg')
  // 同步触发 onload
  imgInstance.width = 800
  imgInstance.height = 600
  imgInstance.onload()

  await expect(promise).resolves.toEqual({ width: 800, height: 600 })
  globalThis.Image = origImage
})

it('getImgSize 图片加载失败', async () => {
  const origImage = globalThis.Image

  let imgInstance: any = null
  ;(globalThis as any).Image = vi.fn().mockImplementation(function (this: any) {
    imgInstance = this
    this.width = 0
    this.height = 0
    return this
  })

  const promise = getImgSize('bad.jpg')
  // 同步触发 onerror
  imgInstance.onerror(new Error('图片加载失败'))

  await expect(promise).rejects.toThrow('图片加载失败')
  globalThis.Image = origImage
})
