# color.ts — 颜色处理

16 进制与 RGB 互转、颜色亮度判断、颜色混合。

## 导出

### set16ToRgb(str)

```typescript
function set16ToRgb(str: string): number[] | null
```

16 进制颜色转 RGB 数组。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| str | `string` | 16 进制颜色，支持 `#fff`、`#ffffff`、`fff` 格式 |

**返回**: `number[] | null` — `[r, g, b]` 数组，无效输入返回 `null`

**示例**

```typescript
set16ToRgb('#fff')    // [255, 255, 255]
set16ToRgb('#ff0000') // [255, 0, 0]
set16ToRgb('invalid') // null
```

---

### isLight(color)

```typescript
function isLight(color: string | Array<number>): boolean
```

判断颜色是否为亮色。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| color | `string \| Array<number>` | 16 进制字符串或 RGB 数组 |

**返回**: `boolean` — 亮色返回 `true`，暗色返回 `false`

**示例**

```typescript
isLight('#ffffff') // true
isLight('#000000') // false
isLight([255, 255, 255]) // true
```

---

### mix(color1, color2, weight)

```typescript
function mix(color1: string, color2: string, weight: number): string
```

混合两种颜色。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| color1 | `string` | 主色（16 进制） |
| color2 | `string` | 辅色（16 进制） |
| weight | `number` | 辅色混入权重，范围 `0-1` |

**返回**: `string` — 混合后的 16 进制颜色

**示例**

```typescript
mix('#ff0000', '#ffffff', 0)   // '#ff0000'
mix('#ff0000', '#ffffff', 0.5) // '#ff8080'
mix('#ff0000', '#ffffff', 1)   // '#ffffff'
```
