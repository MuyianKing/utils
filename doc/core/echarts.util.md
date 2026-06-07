# echarts.util.ts — ECharts 工具

ECharts 图表初始化、配置默认值、地图注册。

## 导出

对象 `echartsUtil`（默认导出，在 `index.ts` 中以命名导出暴露）。

### assignConfig(params)

```typescript
assignConfig(params: Config): RequiredConfig

interface Config {
  resize?: boolean
  overflow?: string
}

interface RequiredConfig {
  resize: boolean
  overflow: string
}
```

处理参数的默认值。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| params.resize | `boolean` | 是否启用 resize 监听（默认 `true`） |
| params.overflow | `string` | 容器 overflow 样式（默认 `'hidden'`） |

**返回**: `RequiredConfig` — 补全默认值后的完整配置

**示例**

```typescript
echartsUtil.assignConfig({})                 // { resize: true, overflow: 'hidden' }
echartsUtil.assignConfig({ resize: false })  // { resize: false, overflow: 'hidden' }
```

---

### init(container, options, params?)

```typescript
init(
  container: string | HTMLElement,
  options: EChartsOption,
  params?: Config
): echarts.ECharts
```

初始化 ECharts 图表实例。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| container | `string \| HTMLElement` | 容器 ID 或 DOM 元素 |
| options | `EChartsOption` | ECharts 配置 |
| params | `Config` | 可选配置（见 `assignConfig`） |

**返回**: `echarts.ECharts` 实例

**功能**
- 自动创建图表实例并设置配置
- 自动绑定 `window.resize` 事件（可禁用）
- 自动设置容器 overflow 样式

**示例**

```typescript
const chart = echartsUtil.init('myChart', {
  xAxis: { data: ['A', 'B', 'C'] },
  yAxis: {},
  series: [{ type: 'bar', data: [10, 20, 30] }],
})
```

---

### registerMap(name, source)

```typescript
registerMap(name: string, source: GeoJSON): void
```

注册地图数据。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| name | `string` | 地图名称 |
| source | `GeoJSON` | GeoJSON 数据 |

**示例**

```typescript
import chinaMap from 'china.json'
echartsUtil.registerMap('china', chinaMap)
```
