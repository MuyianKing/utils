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

export default {
  // 处理参数默认值
  assignConfig(params: Config): RequiredConfig {
    return {
      resize: params.resize === undefined ? true : params.resize,
      overflow: params.overflow === undefined ? 'hidden' : params.overflow,
    }
  },

  /**
   * 初始化echarts
   * @param container 容器ID||容器dom
   * @param options echarts配置
   * @param {object} params 其他配置(默认配置中的配置)
   */
  init(container: string | HTMLElement, options: EChartsOption, params: Config = {}) {
    if (!container) {
      throw new Error('请设置容器')
    }

    let dom = null
    if (container instanceof HTMLElement) {
      dom = container
    } else {
      dom = document.getElementById(container)
    }

    if (!dom) {
      throw new Error('请设置合法的容器')
    }
    dom.removeAttribute('_echarts_instance_')
    const chart = echarts.init(dom)

    if (options) {
      chart.setOption(options)
    }

    const _params = this.assignConfig(params)

    // 设置resize事件
    if (_params.resize) {
      useEventListener(window, 'resize', useDebounceFn(() => {
        chart.resize()
      }, 200))
    }

    // 设置容器overflow
    if (dom.style.overflowX === '') {
      dom.style.overflowX = _params.overflow
    }
    if (dom.style.overflowY === '') {
      dom.style.overflowY = _params.overflow
    }

    return chart
  },

  registerMap(name: string, source: GeoJSON) {
    echarts.registerMap(name, source)
  },
}
