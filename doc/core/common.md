# common.ts — 通用工具

包含类型判断、UUID 生成、JSON 解析、数组去重等通用工具函数。

## 导出

### isTruth(str)

```typescript
function isTruth(str: string | number | boolean | object | null | undefined): boolean
```

判断值是否为"真"。以下值返回 `false`：
`0`、`NaN`、`null`、`undefined`、`false`、`''`、`'false'`、`'null'`、`'NULL'`、`'undefined'`

**参数**

| 参数 | 类型                                                         | 说明       |
| ---- | ------------------------------------------------------------ | ---------- |
| str  | `string \| number \| boolean \| object \| null \| undefined` | 待判断的值 |

**返回**: `boolean`

**示例**

```typescript
isTruth(null) // false
isTruth('null') // false
isTruth('false') // false
isTruth(0) // false
isTruth('0') // true
isTruth('hello') // true
```

---

### someInArray(someArray, array)

```typescript
function someInArray<T>(someArray: T[], array: T[]): boolean
```

判断 `someArray` 中是否有元素存在于 `array` 中。

**参数**

| 参数      | 类型  | 说明       |
| --------- | ----- | ---------- |
| someArray | `T[]` | 待检查数组 |
| array     | `T[]` | 目标数组   |

**返回**: `boolean`

**示例**

```typescript
someInArray([1, 2, 3], [3, 4, 5]) // true
someInArray([1, 2], [3, 4, 5]) // false
```

---

### guid(len?)

```typescript
function guid(len?: number): string
```

生成 UUID（基于 nanoid）。

**参数**

| 参数 | 类型     | 默认值 | 说明      |
| ---- | -------- | ------ | --------- |
| len  | `number` | `16`   | UUID 长度 |

**返回**: `string`

**示例**

```typescript
guid() // 'aB3dEfGhIjKlMnOp'
guid(8) // 'aB3dEfGh'
```

---

### getLabelByVal(array, val, config?)

```typescript
function getLabelByVal<T>(array: T[], val: T[keyof T], config?: {
  label?: keyof T
  value?: keyof T
  obj?: boolean
}): T[keyof T] | T | null
```

在数组中查找匹配项，返回对应的标签值或对象。

**参数**

| 参数         | 类型         | 默认值    | 说明             |
| ------------ | ------------ | --------- | ---------------- |
| array        | `T[]`        | —         | 查询的数组       |
| val          | `T[keyof T]` | —         | 查询的值         |
| config.label | `keyof T`    | `'label'` | 返回的字段名     |
| config.value | `keyof T`    | `'value'` | 比较的字段名     |
| config.obj   | `boolean`    | `false`   | 是否返回整个对象 |

**返回**: 匹配项的标签值、整个对象，或 `null`

**示例**

```typescript
const list = [{ label: '苹果', value: 1 }, { label: '香蕉', value: 2 }]

getLabelByVal(list, 1) // '苹果'
getLabelByVal(list, 2, { obj: true }) // { label: '香蕉', value: 2 }
```

---

### jsonparse(str, def?)

```typescript
function jsonparse<T = any>(str: string, def?: T): T
```

安全地解析 JSON 字符串，解析失败返回默认值。

**参数**

| 参数 | 类型     | 默认值 | 说明                 |
| ---- | -------- | ------ | -------------------- |
| str  | `string` | —      | JSON 字符串          |
| def  | `T`      | `{}`   | 解析失败的默认返回值 |

**返回**: `T`

**示例**

```typescript
jsonparse('{"a":1}') // { a: 1 }
jsonparse('invalid') // {}
jsonparse('invalid', []) // []
```

---

### arrayUnion(arr)

```typescript
function arrayUnion<T>(arr: T[]): T[]
```

数组去重。

**参数**

| 参数 | 类型  | 说明       |
| ---- | ----- | ---------- |
| arr  | `T[]` | 待去重数组 |

**返回**: `T[]`

**示例**

```typescript
arrayUnion([1, 2, 2, 3, 3]) // [1, 2, 3]
```

---

### firstUpcase(str)

```typescript
function firstUpcase(str: string): string
```

首字母大写。

**参数**

| 参数 | 类型     | 说明       |
| ---- | -------- | ---------- |
| str  | `string` | 输入字符串 |

**返回**: `string`

**示例**

```typescript
firstUpcase('hello') // 'Hello'
```

---

### getCanUseValue(str)

```typescript
function getCanUseValue(str: string | number): string
```

将值转为可直接用于元素宽度设置的 CSS 值。数字自动加 `px`。

**参数**

| 参数 | 类型               | 说明   |
| ---- | ------------------ | ------ |
| str  | `string \| number` | 输入值 |

**返回**: `string`

**示例**

```typescript
getCanUseValue(100) // '100px'
getCanUseValue('100%') // '100%'
```

---

### getUrlParam(key)

```typescript
function getUrlParam(key: string): string
```

获取地址栏参数（支持 hash 模式）。

**参数**

| 参数 | 类型     | 说明   |
| ---- | -------- | ------ |
| key  | `string` | 参数名 |

**返回**: `string` — 参数值，取不到时返回空字符串；同名参数取**第一个**值

**依赖**: `@vueuse/core` — 需要 Vue 响应式环境

**示例**

```typescript
// URL: http://example.com#/?token=abc
getUrlParam('token') // 'abc'

// URL: http://example.com#/?tag=a&tag=b
getUrlParam('tag') // 'a'（同名参数取第一个）

// URL: http://example.com#/
getUrlParam('token') // ''
```
