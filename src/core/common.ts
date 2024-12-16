import { useUrlSearchParams } from '@vueuse/core'
import { nanoid } from 'nanoid'

/**
 * 判断字符串是否合法：0、null、false、''、'false'、'null'、'NULL'、'undefined'返回false，否则返回true
 */
export function isTruth(str: string | number | boolean): boolean {
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
 * @param someArray
 * @param array
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
 * @param len uuid长度
 * @returns uuid
 */
export function guid(len: number = 16): string {
  return nanoid(len).replace(/-|_/g, (match) => {
    return match === '_' ? 'a' : (match === '-' ? 'b' : match)
  })
}

/**
 * @param array 查询的数组
 * @param val 查询的值
 * @param config
 * @param config.label 返回的对象的key,默认label
 * @param config.value 比较的对象的key，默认value
 * @param config.obj 是否返回对象
 * @returns 返回查找到的数据
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
 *
 * @param {string} str
 * @param {any} def
 */

/**
 * JSON 解析
 * @param str
 * @param def 解析失败返回值
 * @returns 解析结果
 */
export function jsonparse(str: string, def: any = {}): any {
  try {
    return JSON.parse(str)
  } catch {
    return def
  }
}

/**
 * 数组去重
 * @param arr 去重数组
 */
export function arrayUnion<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 首字母大写
 * @param str
 */
export function firstUpcase(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 将传入的字符串或数字转成可以直接使用到设置元素宽度是值
 * @param  str
 */
export function getCanUseValue(str: string | number): string {
  if (Number.isNaN(+str)) {
    return str as string
  }
  return `${str}px`
}

/**
 * 获取地址栏参数
 * @param {string} key 参数名
 */
export function getUrlParam(key: string): string | number {
  const params = useUrlSearchParams('history')

  let value = params[key] as string
  if (!value) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
    value = window.location.hash.split('?')[1]?.match(reg)?.[2] || ''
  }

  return value || ''
}
