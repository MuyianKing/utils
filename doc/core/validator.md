# validator.ts — 校验器

常用校验函数集合：整数、端口号、邮箱、手机号、IP（含 IPv6）、经纬度、身份证号、JSON、空值判断等。

全部为纯函数，返回 `boolean`，不依赖任何第三方校验库。

## 导出函数

### isInt(value)

```typescript
function isInt(value: string): boolean
```

校验是否为整数（允许正负号与前导零）。

```typescript
isInt('123') // true
isInt('-123') // true
isInt('0123') // true
isInt('12.5') // false
```

---

### isPort(value)

```typescript
function isPort(value: string): boolean
```

校验是否为合法端口号（`0` - `65535`，不允许前导零）。

```typescript
isPort('443') // true
isPort('0') // true
isPort('70000') // false
isPort('080') // false
```

---

### isEmail(value)

```typescript
function isEmail(value: string): boolean
```

校验是否为合法邮箱：总长度不超过 254、本地部分不超过 64、域名至少两段且顶级域不得为纯数字，本地部分允许 UTF-8 字符或整体用引号包裹。

```typescript
isEmail('test@example.com') // true
isEmail('a@b.cn') // true
isEmail('"john..doe"@example.com') // true
isEmail('not-email') // false
isEmail('a@b') // false（域名需要至少两段）
```

---

### isIP(value)

```typescript
function isIP(value: string): boolean
```

校验是否为合法 IP，支持 IPv4 与 IPv6（`::` 压缩、IPv4 结尾、`%` 区域标识）。

```typescript
isIP('192.168.1.1') // true
isIP('::1') // true
isIP('2001:db8::1') // true
isIP('::ffff:192.168.1.1') // true
isIP('fe80::1%eth0') // true
isIP('999.999.999.999') // false
```

---

### isLatLong(value)

```typescript
function isLatLong(value: string): boolean
```

校验是否为合法经纬度，格式为 `"纬度,经度"`（纬度 ±90 以内、经度 ±180 以内，可带括号）。

```typescript
isLatLong('39.9042,116.4074') // true
isLatLong('90,180') // true
isLatLong('91,0') // false
isLatLong('39.9') // false（缺少逗号）
```

---

### isMobilePhone(value)

```typescript
function isMobilePhone(value: string): boolean
```

校验是否为合法手机号，支持中国大陆、香港、澳门、台湾。国际号码需要往内部 `mobileRegs` 数组里补充正则。

```typescript
isMobilePhone('13800138000') // true
isMobilePhone('+8613800138000') // true
isMobilePhone('+85251234567') // true（香港）
isMobilePhone('0912345678') // true（台湾）
isMobilePhone('1234') // false
```

---

### isTelphone(val)

```typescript
function isTelphone(val: string): boolean
```

校验是否为座机号码（5 位以上纯数字）。

```typescript
isTelphone('12345') // true
isTelphone('07551234567') // true
isTelphone('123') // false
```

---

### isIdNum(code)

```typescript
function isIdNum(code: string): boolean
```

判断身份证号是否合法（含 18 位校验码验证）。

**参数**

| 参数 | 类型     | 说明     |
| ---- | -------- | -------- |
| code | `string` | 身份证号 |

**返回**: `boolean`

```typescript
isIdNum('11010519491231002X') // true
isIdNum('110105194912310020') // false（校验位错误）
isIdNum('123') // false
```

---

### isIdcardAll(value)

```typescript
function isIdcardAll(value: string): boolean
```

验证大陆身份证号、港澳身份证号、台湾身份证号，或空字符串。

```typescript
isIdcardAll('11010519491231002X') // true（大陆）
isIdcardAll('A123456') // true（港澳）
isIdcardAll('AB12345678') // true（台湾）
isIdcardAll('') // true（空值）
isIdcardAll('abc') // false
```

---

### isGangAo(value)

```typescript
function isGangAo(value: string): boolean
```

校验是否为合法港澳身份证，格式为 `1 位大写字母 + 6-10 位数字`，可选 `(字母)` 后缀。

```typescript
isGangAo('A123456') // true
isGangAo('A123456(8)') // true
isGangAo('123') // false
```

---

### isTaiwan(value)

```typescript
function isTaiwan(value: string): boolean
```

校验是否为合法台湾身份证，格式为 `1-2 位大写字母 + 8 位数字`，可选 `2 位数字` 后缀。

```typescript
isTaiwan('AB12345678') // true
isTaiwan('A1234567890') // true
isTaiwan('123') // false
```

---

### isJson(str)

```typescript
function isJson(str: string): boolean
```

检查字符串是否为有效的 JSON 格式。

```typescript
isJson('{"a":1}') // true
isJson('[]') // true
isJson('abc') // false
```

---

### isObjectEmpty(obj, keys)

```typescript
function isObjectEmpty<T>(obj: T, keys: (keyof T)[]): boolean
```

判断对象中指定字段是否为空值（`0`、`null`、`undefined`、`''`）。

**参数**

| 参数 | 类型          | 说明               |
| ---- | ------------- | ------------------ |
| obj  | `T`           | 待检查的对象       |
| keys | `(keyof T)[]` | 要检查的字段名数组 |

**返回**: `boolean` — 任一字段为空值返回 `true`

```typescript
isObjectEmpty({ a: '', b: 'hello' }, ['a']) // true
isObjectEmpty({ a: 'hello', b: 'world' }, ['a', 'b']) // false
```

---

## 内部实现

模块内部还包含域名分段校验（`isDomain`）与 IPv6 解析（`isIPV6`）两个私有函数，以及各校验规则用到的正则常量，均**未对外导出**。
