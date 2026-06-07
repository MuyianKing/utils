// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

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
  useEventListener: vi.fn(),
}))

import { echartsUtil } from '@core'

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
