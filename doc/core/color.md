# color.ts — 颜色处理

16 进制与 RGB 互转、颜色亮度判断、颜色混合。

## 导出

### normalizeHex(color)

```typescript
function normalizeHex(color: string): string | null
```

归一化 16 进制颜色：去除首尾空白、转小写，并把 3 位简写补成 6 位。

**参数**

| 参数  | 类型     | 说明                                                           |
| ----- | -------- | -------------------------------------------------------------- |
| color | `string` | 16 进制颜色，仅支持 `#abc` 与 `#aabbcc` 两种写法（必须有 `#`） |

**返回**: `string | null` — 小写的 6 位 16 进制颜色（**不含 `#`**），格式非法返回 `null`

**示例**

```typescript
normalizeHex('#abc') // 'aabbcc'
normalizeHex('#ABC') // 'aabbcc'
normalizeHex('#aabbcc') // 'aabbcc'
normalizeHex(' #aabbcc ') // 'aabbcc'（会 trim）
normalizeHex('abc') // null（没有 #）
normalizeHex('#abcd') // null（位数不合法）
```

---

### set16ToRgb(str)

```typescript
function set16ToRgb(str: string): number[] | null
```

16 进制颜色转 RGB 数组。

**参数**

| 参数 | 类型     | 说明                                                                 |
| ---- | -------- | -------------------------------------------------------------------- |
| str  | `string` | 16 进制颜色，支持 `#fff`、`#ffffff` 格式（必须有 `#`，不支持 `fff`） |

**返回**: `number[] | null` — `[r, g, b]` 数组，无效输入返回 `null`

**示例**

```typescript
set16ToRgb('#fff') // [255, 255, 255]
set16ToRgb('#ff0000') // [255, 0, 0]
set16ToRgb('fff') // null（没有 #）
set16ToRgb('invalid') // null
```

---

### isLight(color)

```typescript
function isLight(color: string | Array<number>): boolean
```

判断颜色是否为亮色。

**参数**

| 参数  | 类型                      | 说明                     |
| ----- | ------------------------- | ------------------------ |
| color | `string \| Array<number>` | 16 进制字符串或 RGB 数组 |

**返回**: `boolean` — 亮色返回 `true`，暗色返回 `false`；颜色不合法（字符串无法解析或数组长度不足 3）返回 `false`

**说明**: 判断公式为 `r * 0.299 + g * 0.587 + b * 0.114 > 192`。

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

混合两种颜色，支持 `#abc` 与 `#aabbcc` 两种写法。

**参数**

| 参数   | 类型     | 说明                                                    |
| ------ | -------- | ------------------------------------------------------- |
| color1 | `string` | 主色（16 进制，支持 3 位简写）                          |
| color2 | `string` | 辅色（16 进制，支持 3 位简写）                          |
| weight | `number` | 辅色混入权重，按 `0-1` 截断（小于 0 按 0、大于 1 按 1） |

**返回**: `string` — 混合后的 6 位 16 进制颜色字符串（含 `#`）

**异常**

- 颜色格式非法时抛出 `Error`：`mix: 颜色格式非法，仅支持 #abc 与 #aabbcc，收到 "..." / "..."`
- `weight` 不是有限数字时抛出 `TypeError`：`mix: weight 必须是 0-1 之间的数字，收到 ...`

**示例**

```typescript
mix('#ff0000', '#ffffff', 0) // '#ff0000'
mix('#ff0000', '#ffffff', 0.5) // '#ff8080'
mix('#ff0000', '#ffffff', 1) // '#ffffff'
mix('#f00', '#fff', 0.5) // '#ff8080'（3 位简写等价）
mix('red', '#ffffff', 0.5) // 抛 Error：颜色格式非法
mix('#ff0000', '#ffffff', Number.NaN) // 抛 TypeError：weight 必须是 0-1 之间的数字
```
