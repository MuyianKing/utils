# dom.ts — DOM 操作

包含全屏控制、元素溢出判断、图片尺寸获取、DPI 获取及单位转换。

## 导出

### openFullScreen(el)

```typescript
function openFullScreen(el: HTMLElement): void
```

进入全屏模式（含 vendor prefix 兼容）。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| el | `HTMLElement` | 要全屏显示的元素 |

**示例**

```typescript
openFullScreen(document.getElementById('myDiv')!)
```

---

### exitFullScreen()

```typescript
function exitFullScreen(): void
```

退出全屏模式。

**示例**

```typescript
exitFullScreen()
```

---

### isOverflow(el)

```typescript
function isOverflow(el: HTMLElement): boolean
```

判断元素内容是否溢出。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| el | `HTMLElement` | DOM 元素 |

**返回**: `boolean` — 内容溢出返回 `true`

**示例**

```typescript
isOverflow(document.querySelector('.text-box')!)
```

---

### getImgSize(src)

```typescript
function getImgSize(src: string): Promise<{ width: number; height: number }>
```

获取图片的原始宽高。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| src | `string` | 图片资源 URL |

**返回**: `Promise<{ width: number; height: number }>`

**示例**

```typescript
const { width, height } = await getImgSize('https://example.com/image.jpg')
```

---

### getDpi()

```typescript
function getDpi(): number
```

获取当前设备的 DPI。

**返回**: `number`

**算法**: 优先使用 `window.devicePixelRatio * 96` 估算，退回到二分查找。

**示例**

```typescript
getDpi() // 96 (标准屏幕) 或 192 (Retina 屏幕)
```

---

### getPxBymm(num)

```typescript
function getPxBymm(num: number): number
```

毫米 → 像素。

| 参数 | 类型 | 说明 |
|------|------|------|
| num | `number` | 毫米值 |

**返回**: `number` — 像素值

**公式**: `getDpi() / 25.4 * num`

```typescript
getPxBymm(25.4) // ≈ getDpi()
```

---

### getPtByPx(num)

```typescript
function getPtByPx(num: number): number
```

像素 → 点。

| 参数 | 类型 | 说明 |
|------|------|------|
| num | `number` | 像素值 |

**返回**: `number` — 点值

**公式**: `num / (getDpi() / 72)`

```typescript
getPtByPx(96) // 72 (在 96dpi 下)
```

---

### getPtBymm(num)

```typescript
function getPtBymm(num: number): number
```

毫米 → 点。

| 参数 | 类型 | 说明 |
|------|------|------|
| num | `number` | 毫米值 |

**返回**: `number` — 点值

**公式**: `getPtByPx(getPxBymm(num))`

```typescript
getPtBymm(25.4) // 72 (在 96dpi 下)
```

---

### getMmByPx(num)

```typescript
function getMmByPx(num: number): number
```

像素 → 毫米。

| 参数 | 类型 | 说明 |
|------|------|------|
| num | `number` | 像素值 |

**返回**: `number` — 毫米值

**公式**: `num / (getDpi() / 25.4)`

```typescript
getMmByPx(96) // 25.4 (在 96dpi 下)
```

---

### translateUnit(num, from, to)

```typescript
function translateUnit(num: number, from: string, to: string): number
```

单位转换，支持 `px`、`pt`、`mm` 之间的互转。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| num | `number` | 转换的值 |
| from | `string` | 源单位：`px`、`pt`、`mm` |
| to | `string` | 目标单位：`px`、`pt`、`mm` |

**返回**: `number`

**示例**

```typescript
translateUnit(25.4, 'mm', 'px') // ≈ getDpi()
translateUnit(96, 'px', 'pt')   // 72
translateUnit(96, 'px', 'mm')   // 25.4
```
