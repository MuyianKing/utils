# validator.ts — 校验器

表单校验函数集合，兼容 Element Plus 和 Vant UI 校验模式。

## 通用参数说明

所有 `v_*` 校验函数使用相同的调用约定：

| 参数 | 类型 | 说明 |
|------|------|------|
| rule | `any` | Element Plus 模式：校验规则对象；Vant 模式：待校验的值 |
| value | `any` | Element Plus 模式：待校验的值；Vant 模式：传 `undefined` |
| callback | `(data?: Error \| string) => string \| boolean` | 校验回调，成功返回空字符串，失败返回错误信息 |

**返回**: `string | boolean` — 校验通过返回 `''`，失败返回错误信息

---

## 导出函数

### v_int(rule, value, callback)

```typescript
function v_int(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为整数。

**示例**

```typescript
const cb = (err?: Error | string) => err instanceof Error ? err.message : ''
v_int(null, 123, cb)   // ''
v_int(null, 'abc', cb) // '只能是整数'
v_int(null, 12.5, cb)  // '只能是整数'
```

---

### v_carnum(rule, value, callback)

```typescript
function v_carnum(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效车牌号（支持新能源车牌）。

**示例**

```typescript
v_carnum(null, '粤B12345', cb) // ''
v_carnum(null, 'abc', cb)      // '车牌格式错误'
```

---

### v_port(rule, value, callback)

```typescript
function v_port(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效端口号（0-65535）。

**示例**

```typescript
v_port(null, 80, cb)    // ''
v_port(null, 70000, cb) // '端口号格式错误'
```

---

### v_email(rule, value, callback)

```typescript
function v_email(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效邮箱地址。

**示例**

```typescript
v_email(null, 'test@example.com', cb) // ''
v_email(null, 'not-email', cb)        // '邮箱地址格式错误'
```

---

### v_phone(rule, value, callback)

```typescript
function v_phone(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效手机号。

**示例**

```typescript
v_phone(null, '13800138000', cb) // ''
v_phone(null, '1234', cb)        // '手机号码格式错误'
```

---

### v_tel(rule, value, callback)

```typescript
function v_tel(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效座机号。

**示例**

```typescript
v_tel(null, '07551234567', cb) // ''
v_tel(null, '123', cb)         // '电话号码格式错误'
```

---

### v_ip(rule, value, callback)

```typescript
function v_ip(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效 IP 地址。

**示例**

```typescript
v_ip(null, '192.168.1.1', cb) // ''
v_ip(null, '999.999.999.999', cb) // 'IP格式错误'
```

---

### v_latlong(lat, lon, callback)

```typescript
function v_latlong(lat: number | string, lon: number | string, callback: CallbackFun): string | boolean
```

验证经纬度。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| lat | `number \| string` | 纬度 |
| lon | `number \| string` | 经度 |
| callback | `CallbackFun` | 校验回调 |

**示例**

```typescript
v_latlong('22.5431', '114.0579', cb) // ''
v_latlong('abc', 'def', cb)          // '经纬度格式错误'
```

---

### v_id_num(rule, value, callback)

```typescript
function v_id_num(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证是否为有效身份证号。

**示例**

```typescript
v_id_num(null, '11010519491231002X', cb) // ''
v_id_num(null, '123', cb)               // '身份证格式错误'
```

---

### v_phoneOrTel(rule, value, callback)

```typescript
function v_phoneOrTel(rule: any, value: any, callback: CallbackFun): string | boolean
```

验证手机号或座机号（任一格式正确即可）。

**示例**

```typescript
v_phoneOrTel(null, '13800138000', cb) // ''
v_phoneOrTel(null, '07551234567', cb) // ''
v_phoneOrTel(null, 'abc', cb)         // '电话号码格式错误'
```

---

### isIdNum(code)

```typescript
function isIdNum(code: string): boolean
```

判断身份证号是否合法（含 18 位校验码验证）。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | `string` | 身份证号 |

**返回**: `boolean`

**示例**

```typescript
isIdNum('11010519491231002X') // true
isIdNum('110105194912310020') // false（校验位错误）
isIdNum('123')               // false
```

---

### isObjectEmpty(obj, keys)

```typescript
function isObjectEmpty<T>(obj: T, keys: (keyof T)[]): boolean
```

判断对象中指定字段是否为空值（`0`、`null`、`undefined`、`''`）。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| obj | `T` | 待检查的对象 |
| keys | `(keyof T)[]` | 要检查的字段名数组 |

**返回**: `boolean` — 任一字段为空值返回 `true`

**示例**

```typescript
isObjectEmpty({ a: '', b: 'hello' }, ['a']) // true
isObjectEmpty({ a: 'hello', b: 'world' }, ['a', 'b']) // false
```

---

### isJson(str)

```typescript
function isJson(str: string): boolean
```

检查字符串是否为有效的 JSON 格式。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| str | `string` | 输入字符串 |

**返回**: `boolean`

**示例**

```typescript
isJson('{"a":1}') // true
isJson('[]')     // true
isJson('abc')    // false
```

---

### isTelphone(val)

```typescript
function isTelphone(val: string): boolean
```

校验是否为电话号码（5 位以上纯数字）。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| val | `string` | 输入值 |

**返回**: `boolean`

**示例**

```typescript
isTelphone('12345')      // true
isTelphone('07551234567') // true
isTelphone('123')        // false
```

---

### isIdcardAll(value)

```typescript
function isIdcardAll(value: string): boolean
```

验证大陆身份证号、港澳身份证号、台湾身份证号，或空字符串。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| value | `string` | 输入值 |

**返回**: `boolean`

**示例**

```typescript
isIdcardAll('11010519491231002X') // true（大陆）
isIdcardAll('A123456')           // true（港澳）
isIdcardAll('AB12345678')        // true（台湾）
isIdcardAll('')                  // true（空值）
isIdcardAll('abc')               // false
```

---

### isGangAo(value)

```typescript
function isGangAo(value: string): boolean
```

校验是否为合法港澳身份证。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| value | `string` | 输入值 |

**返回**: `boolean`

**格式**: `1 位大写字母 + 6-10 位数字`，可选 `(字母)` 后缀。

```typescript
isGangAo('A123456')  // true
isGangAo('A123456(8)') // true
isGangAo('123')      // false
```

---

### isTaiwan(value)

```typescript
function isTaiwan(value: string): boolean
```

校验是否为合法台湾身份证。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| value | `string` | 输入值 |

**返回**: `boolean`

**格式**: `1-2 位大写字母 + 8 位数字`，可选 `2 位数字` 后缀。

```typescript
isTaiwan('AB12345678')  // true
isTaiwan('A1234567890') // true
isTaiwan('123')         // false
```
