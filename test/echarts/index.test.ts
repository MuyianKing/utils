import { echartsUtil } from '@core'
import { useEventListener } from '@vueuse/core'
// @vitest-environment jsdom
import * as echartsCore from 'echarts/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock echarts/core 和 @vueuse/core 防止模块加载失败
vi.mock('echarts/core', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
  registerMap: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useDebounceFn: (fn: any) => fn,
  useEventListener: vi.fn(() => vi.fn()),
}))

const initMock = vi.mocked(echartsCore.init)
const registerMapMock = vi.mocked(echartsCore.registerMap)
const useEventListenerMock = vi.mocked(useEventListener)

beforeEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('assignConfig', () => {
  it('无参数使用默认值', () => {
    expect(echartsUtil.assignConfig({})).toEqual({
      resize: true,
      overflow: 'hidden',
    })
  })

  it('resize: false', () => {
    expect(echartsUtil.assignConfig({ resize: false })).toEqual({
      resize: false,
      overflow: 'hidden',
    })
  })

  it('自定义 overflow', () => {
    expect(echartsUtil.assignConfig({ overflow: 'auto' })).toEqual({
      resize: true,
      overflow: 'auto',
    })
  })

  it('所有参数自定义', () => {
    expect(echartsUtil.assignConfig({ resize: false, overflow: 'scroll' })).toEqual({
      resize: false,
      overflow: 'scroll',
    })
  })
})

describe('init', () => {
  it('传入 dom 容器时初始化并设置 option', () => {
    const dom = document.createElement('div')
    const options = { series: [] }

    const chart = echartsUtil.init(dom, options)

    expect(initMock).toHaveBeenCalledWith(dom)
    expect(chart.setOption).toHaveBeenCalledWith(options)
  })

  it('传入容器 id 时按 id 查找', () => {
    const dom = document.createElement('div')
    dom.id = 'chart'
    document.body.appendChild(dom)

    echartsUtil.init('chart', {})

    expect(initMock).toHaveBeenCalledWith(dom)
  })

  it('未传容器时抛错', () => {
    expect(() => echartsUtil.init('', {})).toThrow('请设置容器')
  })

  it('容器不存在时抛错', () => {
    expect(() => echartsUtil.init('not-exist', {})).toThrow('请设置合法的容器')
  })

  it('默认注册 resize 监听并设置 overflow: hidden', () => {
    const dom = document.createElement('div')

    echartsUtil.init(dom, {})

    expect(useEventListenerMock).toHaveBeenCalledWith(window, 'resize', expect.any(Function))
    expect(dom.style.overflowX).toBe('hidden')
    expect(dom.style.overflowY).toBe('hidden')
  })

  it('resize: false 时不注册监听', () => {
    const dom = document.createElement('div')

    echartsUtil.init(dom, {}, { resize: false })

    expect(useEventListenerMock).not.toHaveBeenCalled()
  })

  it('容器已有 overflow 时保留原值', () => {
    const dom = document.createElement('div')
    dom.style.overflowX = 'auto'
    dom.style.overflowY = 'scroll'

    echartsUtil.init(dom, {})

    expect(dom.style.overflowX).toBe('auto')
    expect(dom.style.overflowY).toBe('scroll')
  })

  it('重复 init 同一个容器会先移除上一次的 resize 监听', () => {
    const dom = document.createElement('div')

    echartsUtil.init(dom, {})
    const firstStop = useEventListenerMock.mock.results[0].value as () => void

    echartsUtil.init(dom, {})

    expect(firstStop).toHaveBeenCalledOnce()
    expect(useEventListenerMock).toHaveBeenCalledTimes(2)
  })

  it('resize 监听回调调用 chart.resize', () => {
    const dom = document.createElement('div')
    const chart = echartsUtil.init(dom, {})
    const handler = useEventListenerMock.mock.calls[0][2] as () => void

    handler()

    expect(chart.resize).toHaveBeenCalledOnce()
  })
})

describe('registerMap', () => {
  it('透传给 echarts.registerMap', () => {
    const source = { type: 'FeatureCollection', features: [] } as never

    echartsUtil.registerMap('china', source)

    expect(registerMapMock).toHaveBeenCalledWith('china', source)
  })
})
