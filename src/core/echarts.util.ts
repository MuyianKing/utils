import type { EChartsOption } from 'echarts'
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes.js'
import { useDebounceFn, useEventListener } from '@vueuse/core'
import * as echarts from 'echarts/core'

interface RequiredConfig {
  resize: boolean
  overflow: string
}

type ParamsDefault<T> = {
  [k in keyof T]+?: T[k]
}

type Config = ParamsDefault<RequiredConfig>

// 记录每个容器上注册的 resize 监听，重复 init 同一个容器时先移除旧的，避免监听泄漏
const resizeListeners = new WeakMap<HTMLElement, () => void>()

/**
 * 处理参数默认值
 */
function assignConfig(params: Config): RequiredConfig {
  return {
    resize: params.resize === undefined ? true : params.resize,
    overflow: params.overflow === undefined ? 'hidden' : params.overflow,
  }
}

/**
 * 初始化echarts
 * @param container 容器ID||容器dom
 * @param options echarts配置
 * @param {object} params 其他配置(默认配置中的配置)
 */
function init(container: string | HTMLElement, options: EChartsOption, params: Config = {}) {
  if (!container) {
    throw new Error('请设置容器')
  }

  let dom: HTMLElement | null = null
  if (typeof HTMLElement !== 'undefined' && container instanceof HTMLElement) {
    dom = container
  } else if (typeof document !== 'undefined') {
    dom = document.getElementById(container as string)
  }

  if (!dom) {
    throw new Error('请设置合法的容器')
  }

  const prev_stop = resizeListeners.get(dom)
  if (prev_stop) {
    prev_stop()
    resizeListeners.delete(dom)
  }

  dom.removeAttribute('_echarts_instance_')
  const chart = echarts.init(dom)

  if (options) {
    chart.setOption(options)
  }

  const _params = assignConfig(params)

  // 设置resize事件
  if (_params.resize) {
    const stop = useEventListener(window, 'resize', useDebounceFn(() => {
      chart.resize()
    }, 200))
    resizeListeners.set(dom, stop)
  }

  // 设置容器overflow
  if (dom.style.overflowX === '') {
    dom.style.overflowX = _params.overflow
  }
  if (dom.style.overflowY === '') {
    dom.style.overflowY = _params.overflow
  }

  return chart
}

/**
 * 注册地图
 */
function registerMap(name: string, source: GeoJSON) {
  echarts.registerMap(name, source)
}

export default {
  assignConfig,
  init,
  registerMap,
}
