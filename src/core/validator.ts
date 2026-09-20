/**
 * 判断身份证号是否合法
 * @param code 身份证号，支持 15 位与 18 位（18 位会校验最后一位校验码）
 * @returns 合法返回 true，否则返回 false
 * @example isIdNum('11010519491231002X') // true
 * @example isIdNum('110105194912310020') // false（校验位错误）
 * @example isIdNum('123') // false
 */
export function isIdNum(code: string) {
  const city: {
    [x: string]: string
  } = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  }
  let pass = true
  if (!code || !/^\d{6}(?:18|19|20)?\d{2}(?:0[1-9]|1[120])(?:0[1-9]|[12]\d|3[01])\d{3}(?:\d|X)$/i.test(code)) {
    pass = false
  } else if (!city[code.substring(0, 2)]) {
    pass = false
  } else if (code.length === 18) {
    const code_arraya = code.split('')
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    let ai = 0
    let wi = 0
    for (let i = 0; i < 17; i++) {
      ai = +code_arraya[i]
      wi = factor[i]
      sum += ai * wi
    }

    if (parity[sum % 11].toString() !== code_arraya[17].toString()) {
      pass = false
    }
  }
  return pass
}

/**
 * 判断对象给定的字段是否存在空值、null、undefined、0
 * @param obj 待检查的对象
 * @param keys 需要检查的字段名数组
 * @returns 任一字段为空值返回 true，所有字段都有值返回 false
 * @example isObjectEmpty({ a: '', b: 'hello' }, ['a']) // true
 * @example isObjectEmpty({ a: 'hello', b: 'world' }, ['a', 'b']) // false
 */
export function isObjectEmpty<T>(obj: T, keys: (keyof T)[]): boolean {
  for (let i = 0; i < keys.length; i++) {
    if (!obj[keys[i]]) {
      return true
    }
  }
  return false
}

/**
 * 检查是否是json字符串
 * @param str 待检查的字符串
 * @returns 是合法 JSON 返回 true，否则返回 false
 * @example isJson('{"a":1}') // true
 * @example isJson('[]') // true
 * @example isJson('abc') // false
 */
export function isJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * 校验是否是电话号码（座机号码，5 位以上纯数字）
 * @param val 待校验的字符串
 * @returns 合法返回 true，否则返回 false
 * @example isTelphone('12345') // true
 * @example isTelphone('07551234567') // true
 * @example isTelphone('123') // false
 */
export function isTelphone(val: string): boolean {
  const testFixedPhone = /^\d{5,}$/
  return testFixedPhone.test(val)
}

/**
 * 验证大陆身份证号或者港澳台身份证号或者护照
 * @param value 待校验的字符串
 * @returns 任一格式匹配或为空字符串返回 true，否则返回 false
 * @example isIdcardAll('11010519491231002X') // true（大陆）
 * @example isIdcardAll('A123456') // true（港澳）
 * @example isIdcardAll('') // true（空值）
 * @example isIdcardAll('abc') // false
 */
export function isIdcardAll(value: string): boolean {
  return isGangAo(value) || isTaiwan(value) || isIdNum(value) || value === ''
}

/**
 * 校验是否为合法港澳身份证
 * @param value 待校验的字符串，格式为 1 位大写字母 + 6-10 位数字，可选 `(字母)` 后缀
 * @returns 合法返回 true，否则返回 false
 * @example isGangAo('A123456') // true
 * @example isGangAo('A123456(8)') // true
 * @example isGangAo('123') // false
 */
export function isGangAo(value: string): boolean {
  const testHongKong = /^[A-Z]\d{6,10}(?:\(\w\))?$/
  return testHongKong.test(value)
}

/**
 * 校验是否为合法台湾身份证
 * @param value 待校验的字符串，格式为 1-2 位大写字母 + 8 位数字，可选 2 位数字后缀
 * @returns 合法返回 true，否则返回 false
 * @example isTaiwan('AB12345678') // true
 * @example isTaiwan('A1234567890') // true
 * @example isTaiwan('123') // false
 */
export function isTaiwan(value: string): boolean {
  const testTaiwan = /^[A-Z]{1,2}\d{8}(?:\d{2})?$/
  return testTaiwan.test(value)
}

/**
 * 校验是否为整数（允许正负号与前导零）
 * @param value 待校验的字符串
 * @returns 合法返回 true，否则返回 false
 * @example isInt('123') // true
 * @example isInt('-123') // true
 * @example isInt('12.5') // false
 */
export function isInt(value: string): boolean {
  return intReg.test(value)
}

/**
 * 校验是否为合法端口号（0 - 65535，不允许前导零）
 * @param value 待校验的字符串
 * @returns 合法返回 true，否则返回 false
 * @example isPort('443') // true
 * @example isPort('0') // true
 * @example isPort('080') // false（前导零）
 * @example isPort('70000') // false
 */
export function isPort(value: string): boolean {
  return portReg.test(value) && Number(value) >= 0 && Number(value) <= 65535
}

/**
 * 校验是否为合法邮箱（校验总长度、本地部分与域名分段）
 * @param value 待校验的字符串，本地部分允许 UTF-8 字符或整体用引号包裹
 * @returns 合法返回 true，否则返回 false
 * @example isEmail('test@example.com') // true
 * @example isEmail('"john..doe"@example.com') // true
 * @example isEmail('not-email') // false
 * @example isEmail('a@b') // false（域名需要至少两段）
 */
export function isEmail(value: string): boolean {
  if (value.length > 254) {
    return false
  }

  const atIndex = value.lastIndexOf('@')
  if (atIndex <= 0) {
    return false
  }

  const user = value.slice(0, atIndex)
  const domain = value.slice(atIndex + 1)
  if (user.length > 64 || !isDomain(domain)) {
    return false
  }

  if (quotedEmailUserReg.test(user)) {
    return true
  }

  return user.split('.').every(part => emailUserReg.test(part))
}

/**
 * 校验是否为合法 IP，支持 IPv4 与 IPv6（`::` 压缩、IPv4 结尾、`%` 区域标识）
 * @param value 待校验的字符串
 * @returns 合法返回 true，否则返回 false
 * @example isIP('192.168.1.1') // true
 * @example isIP('2001:db8::1') // true
 * @example isIP('fe80::1%eth0') // true
 * @example isIP('999.999.999.999') // false
 */
export function isIP(value: string): boolean {
  return ipv4Reg.test(value) || isIPV6(value)
}

/**
 * 校验是否为合法经纬度，格式为 "纬度,经度"（纬度 ±90 以内、经度 ±180 以内）
 * @param value 待校验的字符串，纬度与经度以英文逗号分隔，可带括号
 * @returns 合法返回 true，否则返回 false
 * @example isLatLong('39.9042,116.4074') // true
 * @example isLatLong('90,180') // true
 * @example isLatLong('91,0') // false
 * @example isLatLong('39.9') // false（缺少逗号）
 */
export function isLatLong(value: string): boolean {
  if (!value.includes(',')) {
    return false
  }

  const [lat, long] = value.split(',')
  if ((lat.startsWith('(') && !long.endsWith(')')) || (long.endsWith(')') && !lat.startsWith('('))) {
    return false
  }

  return latReg.test(lat) && longReg.test(long)
}

/**
 * 校验是否为合法手机号，支持中国大陆、香港、澳门、台湾
 * @param value 待校验的字符串，可带 `+86`、`+852` 等国际区号
 * @returns 合法返回 true，否则返回 false
 * @example isMobilePhone('13800138000') // true
 * @example isMobilePhone('+8613800138000') // true
 * @example isMobilePhone('+85251234567') // true（香港）
 * @example isMobilePhone('1234') // false
 */
export function isMobilePhone(value: string): boolean {
  return mobileRegs.some(reg => reg.test(value))
}

// ---------------------------------------------------------------------------
// 以下为内部实现，不对外导出
// ---------------------------------------------------------------------------

// 整数：允许正负号与前导零
const intReg = /^[-+]?\d+$/
// 端口号额外要求：不允许前导零
const portReg = /^[-+]?(?:0|[1-9]\d*)$/

/**
 * 域名：至少两段，顶级域不得为纯数字，不允许下划线、首尾连字符、全角字符
 * @param value 待校验的域名
 * @returns 合法返回 true，否则返回 false
 */
function isDomain(value: string): boolean {
  const parts = value.split('.')
  if (parts.length < 2) {
    return false
  }

  const tld = parts[parts.length - 1]
  if (!/^(?:[a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld) || /\s/.test(tld)) {
    return false
  }

  return parts.every((part) => {
    return part.length <= 63
      && /^[a-z\u00A1-\uFFFF\d-]+$/i.test(part)
      && !/[\uFF01-\uFF5E]/.test(part)
      && !/^-|-$/.test(part)
  })
}

// 邮箱本地部分：允许 UTF-8 字符，或整体用引号包裹（如 "john..doe"@example.com）
const emailUserReg = /^[-\w!#$%&'*+/=?^`{|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/
const quotedEmailUserReg = /^"(?:[^"\\]|\\.)*"$/

// IPv4
const ipv4Reg = /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/

// IPv6：支持 :: 压缩、IPv4 结尾以及 % 区域标识
const ipv6GroupReg = /^[0-9a-f]{1,4}$/i
const ipv6ZoneReg = /^[0-9a-z.]+$/i

/**
 * 校验是否为合法 IPv6 地址，支持 :: 压缩、IPv4 结尾以及 % 区域标识
 * @param value 待校验的字符串
 * @returns 合法返回 true，否则返回 false
 */
function isIPV6(value: string): boolean {
  const zoneIndex = value.indexOf('%')
  if (zoneIndex !== -1) {
    if (!ipv6ZoneReg.test(value.slice(zoneIndex + 1))) {
      return false
    }
    value = value.slice(0, zoneIndex)
  }

  const compressedIndex = value.indexOf('::')
  if (compressedIndex !== value.lastIndexOf('::')) {
    return false
  }

  const compressed = compressedIndex !== -1
  const head = compressed ? value.slice(0, compressedIndex) : value
  const tail = compressed ? value.slice(compressedIndex + 2) : ''
  const groups = [...(head ? head.split(':') : []), ...(tail ? tail.split(':') : [])]
  if (!groups.length) {
    return compressed
  }

  const lastGroup = groups[groups.length - 1]
  // 末组允许是 IPv4，此时它占两组
  const isV4Tail = ipv4Reg.test(lastGroup)
  if (!(isV4Tail || ipv6GroupReg.test(lastGroup)) || !groups.slice(0, -1).every(group => ipv6GroupReg.test(group))) {
    return false
  }

  const size = groups.length + (isV4Tail ? 1 : 0)
  return compressed ? size <= 7 : size === 8
}

// 经纬度：纬度 ±90 以内、经度 ±180 以内，两者以英文逗号分隔
const latReg = /^\(?[+-]?(?:90(?:\.0+)?|[1-8]?\d(?:\.\d+)?)$/
const longReg = /^\s?[+-]?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|\d{1,2}(?:\.\d+)?)\)?$/

// 手机号：中国大陆、香港、澳门、台湾
const mobileRegs = [
  /^(?:(?:\+|00)86)?(?:1[3-9]|9[28])\d{9}$/, // 中国大陆
  /^(?:\+?852[-\s]?)?[4-9]\d{3}[-\s]?\d{4}$/, // 香港
  /^(?:\+?853[-\s]?)?6\d{3}[-\s]?\d{4}$/, // 澳门
  /^(?:\+?886[-\s]?|0)?9\d{8}$/, // 台湾
]
