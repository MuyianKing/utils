import dayjs from 'dayjs'
import { jsonparse } from './common.js'

// 默认有效期（天）
const DEFAULT_EXPIRE = 7

interface StorageItem<T = string | object> {
  value: T
  time: number
}

/**
 * 设置缓存
 * @param key 缓存的键名，空字符串不写入
 * @param value 缓存的值，undefined 不写入
 * @param options 配置
 * @param options.expire 有效期 单位天，默认7天
 * @example storage.set('token', 'abc123')
 * @example storage.set('user', { name: '张三' }, { expire: 30 })
 */
function set(key: string, value: string | object, options: { expire?: number } = {}): void {
  if (!key) {
    return
  }

  const { expire = DEFAULT_EXPIRE } = options
  storeSet(key, value, expire)
}

/**
 * 获取缓存
 * @param key 缓存的键名
 * @param options 配置
 * @param options.def 取不到时的默认值，未传时返回空字符串
 * @returns 缓存值或默认值，已过期的缓存会被删除并返回默认值
 * @example storage.get('token') // 'abc123'
 * @example storage.get('not-exist') // ''
 * @example storage.get('not-exist', { def: 'default' }) // 'default'
 */
function get<T extends string | object = string | object>(key: string, options?: { def?: T }): T {
  return storeGet(key, options?.def ?? '') as T
}

/**
 * 删除缓存
 * @param key 缓存的键名
 * @example storage.remove('token')
 */
function remove(key: string): void {
  storeRemove(key)
}

/**
 * 判断是否 localStorage 空间不足
 * @param e 捕获到的异常
 * @returns 是空间不足错误返回 true，否则返回 false
 */
function isQuotaExceededError(e: unknown): boolean {
  if (typeof DOMException !== 'undefined' && e instanceof DOMException) {
    return (
      e.name === 'QuotaExceededError'
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      || e.code === 22
      || e.code === 1014
    )
  }

  return e instanceof Error && /quota/i.test(e.message)
}

/**
 * 读取登记表：记录写入过的 key，空间不足时按它清理
 * 登记表自身的 key 是模块内部约定，不是公开 API
 * @returns 已登记的 key 数组，登记表缺失或格式非法时返回空数组
 */
function readRegisteredKeys(): string[] {
  const keys = jsonparse<string[]>(localStorage.getItem('MU_KEYS') || '', [])

  return Array.isArray(keys) ? keys : []
}

/**
 * 写入登记表
 * @param keys 完整的 key 数组
 */
function writeRegisteredKeys(keys: string[]): void {
  localStorage.setItem('MU_KEYS', JSON.stringify(keys))
}

/**
 * 登记key
 * @param key 需要登记的 key，已登记过时不重复写入
 */
function registerKey(key: string): void {
  const keys = readRegisteredKeys()
  if (!keys.includes(key)) {
    keys.push(key)
  }
  writeRegisteredKeys(keys)
}

/**
 * 读取单条缓存原始结构
 * @param key 缓存的键名
 * @returns { value, time } 结构，取不到或格式非法时返回 null
 */
function readItem(key: string): StorageItem | null {
  const raw = localStorage.getItem(key)
  if (!raw) {
    return null
  }

  try {
    const item = JSON.parse(raw) as StorageItem
    if (!item || typeof item !== 'object') {
      return null
    }
    return item
  } catch {
    return null
  }
}

/**
 * 批量删除缓存并同步登记表
 * @param keys 需要删除的 key 数组，为空时不做任何操作
 */
function removeKeys(keys: string[]): void {
  if (keys.length === 0) {
    return
  }

  keys.forEach(key => localStorage.removeItem(key))

  const removed = new Set(keys)
  writeRegisteredKeys(readRegisteredKeys().filter(item => !removed.has(item)))
}

/**
 * 删除缓存并同步登记表
 * @param key 缓存的键名
 */
function storeRemove(key: string): void {
  removeKeys([key])
}

/**
 * 存入
 * @param key 缓存的键名
 * @param value 缓存的值
 * @param expire 有效期，单位天
 */
function storeSetItem(key: string, value: string | object, expire: number): void {
  localStorage.setItem(key, JSON.stringify({
    value,
    time: dayjs().add(expire, 'day').valueOf(),
  }))
}

/**
 * 设置缓存，空间不足时清理后重试
 * @param key 缓存的键名，空字符串不写入
 * @param value 缓存的值，undefined 不写入
 * @param expire 有效期，单位天
 */
function storeSet(key: string, value: string | object, expire: number): void {
  if (!key || value === undefined) {
    return
  }

  // 登记表写入也可能触发空间不足，所以放在同一个重试单元里
  const write = () => {
    storeSetItem(key, value, expire)
    registerKey(key)
  }

  try {
    write()
  } catch (e) {
    if (isQuotaExceededError(e)) {
      purgeForQuota(write)
    } else {
      console.log('set storage', e)
    }
  }
}

/**
 * 空间不足时清理缓存：先删已过期的，仍然不足则按写入时间删掉一半旧数据
 * @param callback 清理后的重试操作
 */
function purgeForQuota(callback: () => void): void {
  const expired_keys = readRegisteredKeys().filter((key) => {
    const item = readItem(key)
    return !item || (!!item.time && dayjs().valueOf() - item.time > 0)
  })
  removeKeys(expired_keys)

  try {
    callback()
    return
  } catch (e) {
    if (!isQuotaExceededError(e)) {
      console.log('set storage', e)
      return
    }
  }

  const items = readRegisteredKeys()
    .map(key => ({ key, item: readItem(key) }))
    .filter((entry): entry is { key: string, item: StorageItem } => !!entry.item && !!entry.item.time)
    .sort((a, b) => a.item.time - b.item.time)

  removeKeys(items.slice(0, Math.ceil(items.length / 2)).map(entry => entry.key))

  try {
    callback()
  } catch (e) {
    console.log('set storage', e)
  }
}

/**
 * 获取缓存
 * @param key 缓存的键名
 * @param def 取不到或已过期时的默认值
 * @returns 缓存值或默认值
 */
function storeGet(key: string, def: string | object): string | object {
  const item = localStorage.getItem(key)

  if (!item) {
    return def || ''
  }

  try {
    const v = JSON.parse(item) as StorageItem
    if (v.time && dayjs().valueOf() - v.time > 0) {
      storeRemove(key)
      return def
    }

    return jsonparse(v.value as string, v.value)
  } catch (error) {
    console.log('get storage', error)
    return item
  }
}

// 公开 API 全部指向模块内的函数，不使用 this，保证解构调用（const { set } = storage）也能正常工作
export default {
  set,
  get,
  remove,
}
