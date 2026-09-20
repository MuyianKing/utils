# echarts.util.ts — ECharts 工具

ECharts 图表初始化与地图注册。

## 导出

对象 `echartsUtil`（默认导出，在 `index.ts` 中以命名导出暴露），包含 `assignConfig`、`init`、`registerMap` 三个方法：

```typescript
declare const echartsUtil: {
  assignConfig: (params: Config) => RequiredConfig
  init: (
    container: string | HTMLElement,
    options: EChartsOption,
    params?: Config
  ) => echarts.ECharts
  registerMap: (name: string, source: GeoJSON) => void
}

interface Config {
  resize?: boolean
  overflow?: string
}

interface RequiredConfig {
  resize: boolean
  overflow: string
}
```

### assignConfig(params)

```typescript
function assignConfig(params: Config): RequiredConfig
```

补全默认值：`resize` 默认 `true`、`overflow` 默认 `'hidden'`。

**参数**

| 参数            | 类型      | 说明                                  |
| --------------- | --------- | ------------------------------------- |
| params.resize   | `boolean` | 是否注册 resize 监听（默认 `true`）   |
| params.overflow | `string`  | 容器 overflow 样式（默认 `'hidden'`） |

**返回**: `RequiredConfig`

**示例**

```typescript
echartsUtil.assignConfig({}) // { resize: true, overflow: 'hidden' }
echartsUtil.assignConfig({ resize: false }) // { resize: false, overflow: 'hidden' }
```

### init(container, options, params?)

```typescript
function init(
  container: string | HTMLElement,
  options: EChartsOption,
  params?: Config
): echarts.ECharts
```

初始化 ECharts 图表实例。

**参数**

| 参数            | 类型                    | 说明                                  |
| --------------- | ----------------------- | ------------------------------------- |
| container       | `string \| HTMLElement` | 容器 ID 或 DOM 元素                   |
| options         | `EChartsOption`         | ECharts 配置                          |
| params.resize   | `boolean`               | 是否注册 resize 监听（默认 `true`）   |
| params.overflow | `string`                | 容器 overflow 样式（默认 `'hidden'`） |

**返回**: `echarts.ECharts` 实例

**行为**

- 每次 init 会先移除容器上的 `_echarts_instance_` 属性再创建实例，并设置 `options`
- 重复 init 同一个容器时，会先移除上一次为该容器注册的 resize 监听，避免监听泄漏
- `resize: true`（默认）时注册 `window.resize` 防抖监听（200ms），回调中调用 `chart.resize()`
- 容器已有的 `overflow-x` / `overflow-y` 不会被覆盖，仅对空值写入 `params.overflow`
- 容器为空（`''`、`null`、`undefined`）时抛 `Error('请设置容器')`；按 ID 找不到元素时抛 `Error('请设置合法的容器')`

**示例**

```typescript
const chart = echartsUtil.init('myChart', {
  xAxis: { data: ['A', 'B', 'C'] },
  yAxis: {},
  series: [{ type: 'bar', data: [10, 20, 30] }],
})

// 关闭 resize 监听、自定义 overflow
echartsUtil.init(document.getElementById('myChart')!, {}, { resize: false, overflow: 'auto' })
```

### registerMap(name, source)

```typescript
function registerMap(name: string, source: GeoJSON): void
```

注册地图，透传给 `echarts.registerMap`。

**参数**

| 参数   | 类型      | 说明         |
| ------ | --------- | ------------ |
| name   | `string`  | 地图名称     |
| source | `GeoJSON` | 地图 GeoJSON |

**示例**

```typescript
echartsUtil.registerMap('china', chinaGeoJSON)
echartsUtil.init('mapChart', { geo: { map: 'china' } })
```
