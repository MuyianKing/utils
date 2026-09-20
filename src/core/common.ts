import { useUrlSearchParams } from '@vueuse/core'
import { nanoid } from 'nanoid'

/**
 * 判断字符串是否合法：0、null、undefined、false、''、'false'、'null'、'NULL'、'undefined'返回false，否则返回true
 * @param str 待判断的值，支持字符串、数字、布尔、对象、null、undefined
 * @returns 上述假值返回 false，其余返回 true
 * @example isTruth(null) // false
 * @example isTruth('null') // false
 * @example isTruth(0) // false
 * @example isTruth(Number.NaN) // false
 * @example isTruth('0') // true
 * @example isTruth('hello') // true
 */
export function isTruth(str: string | number | boolean | object | null | undefined): boolean {
  return !(
    !str
    || str === 'null'
    || str === 'NULL'
    || str === 'undefined'
    || str === 'false'
  )
}

/**
 * 判断someArray里面是否有元素在arr里面
 * @param someArray 待检查的数组
 * @param array 目标数组
 * @returns someArray 中有任一元素存在于 array 中返回 true，否则返回 false
 * @example someInArray([1, 2, 3], [3, 4, 5]) // true
 * @example someInArray([1, 2], [3, 4, 5]) // false
 * @example someInArray([], [1, 2]) // false
 */
export function someInArray<T>(someArray: T[], array: T[]): boolean {
  let i = 0
  const len = someArray.length
  for (; i < len; i++) {
    if (array.includes(someArray[i])) {
      break
    }
  }

  return i < len
}

/**
 * 生成UUID
 * @param len uuid长度，默认 16
 * @returns uuid，只包含字母数字，不出现 - 与 _
 * @example guid() // 'V1StGXR8Z5jdHi6B'（长度 16）
 * @example guid(8) // 'V1StGXR8'（长度 8）
 */
export function guid(len: number = 16): string {
  return nanoid(len).replace(/-|_/g, (match) => {
    return match === '_' ? 'a' : (match === '-' ? 'b' : match)
  })
}

/**
 * 在数组中查找匹配项，返回对应的标签值或对象
 * @param array 查询的数组
 * @param val 查询的值
 * @param config 配置
 * @param config.label 返回的对象的key,默认label
 * @param config.value 比较的对象的key，默认value
 * @param config.obj 是否返回对象，默认 false
 * @returns 返回查找到的数据，查不到返回 null
 * @example getLabelByVal([{ label: '苹果', value: 1 }], 1) // '苹果'
 * @example getLabelByVal([{ label: '苹果', value: 1 }], 2) // null
 * @example getLabelByVal([{ name: '张三', id: 1 }], 1, { label: 'name', value: 'id' }) // '张三'
 * @example getLabelByVal([{ name: '张三', id: 1 }], 1, { label: 'name', value: 'id', obj: true }) // { name: '张三', id: 1 }
 */
export function getLabelByVal<T>(array: T[], val: T[keyof T], config?: {
  label?: keyof T
  value?: keyof T
  obj?: boolean
}) {
  const label = (config?.label || 'label') as keyof T
  const value = (config?.value || 'value') as keyof T
  const obj = config?.obj || false

  for (let i = 0; i < array.length; i++) {
    if (val === array[i][value]) {
      if (obj) {
        return array[i]
      }
      return array[i][label]
    }
  }
  return null
}

/**
 * JSON 解析
 * @param str 待解析的 JSON 字符串
 * @param def 解析失败返回值，默认 {}
 * @returns 解析结果，解析失败时返回 def
 * @example jsonparse('{"a":1}') // { a: 1 }
 * @example jsonparse('invalid') // {}
 * @example jsonparse('invalid', []) // []
 */
export function jsonparse<T = any>(str: string, def: T = {} as T): T {
  try {
    return JSON.parse(str)
  } catch {
    return def
  }
}

/**
 * 数组去重
 * @param arr 去重数组
 * @returns 去重后的新数组，不修改原数组
 * @example arrayUnion([1, 2, 2, 3, 3]) // [1, 2, 3]
 */
export function arrayUnion<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 首字母大写
 * @param str 输入字符串
 * @returns 首字母大写后的字符串
 * @example firstUpcase('hello') // 'Hello'
 * @example firstUpcase('') // ''
 */
export function firstUpcase(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 将传入的字符串或数字转成可以直接使用到设置元素宽度是值
 * @param str 输入值，数字与数字字符串会自动补 px，其余原样返回
 * @returns 可直接用于元素宽度设置的 CSS 值
 * @example getCanUseValue(100) // '100px'
 * @example getCanUseValue('12') // '12px'
 * @example getCanUseValue('100%') // '100%'
 * @example getCanUseValue('calc(100vh - 100px)') // 'calc(100vh - 100px)'
 */
export function getCanUseValue(str: string | number): string {
  if (Number.isNaN(+str)) {
    return str as string
  }
  return `${str}px`
}

/**
 * 获取地址栏参数
 * @param key 参数名
 * @returns 参数值，取不到时返回空字符串；同名参数取第一个值
 * @example getUrlParam('token') // 'abc'（地址栏为 #/?token=abc）
 * @example getUrlParam('not-exist') // ''
 */
export function getUrlParam(key: string): string {
  const params = useUrlSearchParams('history')

  const value = params[key]
  if (Array.isArray(value)) {
    return value[0] || ''
  }

  if (value) {
    return value
  }

  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
  return window.location.hash.split('?')[1]?.match(reg)?.[2] || ''
}
