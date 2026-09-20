// @vitest-environment jsdom

import { storage } from '@core'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

it('storage set get', () => {
  storage.set('test', 'test')
  expect(storage.get('test')).toBe('test')
})

it('storage set remove', () => {
  storage.set('test', 'test')
  storage.remove('test')
  expect(storage.get('test')).toBe('')
})

it('key 原样存入 localStorage，不加前缀', () => {
  storage.set('token', 'abc')
  expect(localStorage.getItem('token')).not.toBeNull()
})

it('解构调用不会丢失上下文', () => {
  const { set, get, remove } = storage
  set('destructured', 'value')
  expect(get('destructured')).toBe('value')
  remove('destructured')
  expect(get('destructured')).toBe('')
})

it('支持对象类型', () => {
  storage.set('obj', { a: 1, b: [1, 2] })
  expect(storage.get('obj')).toEqual({ a: 1, b: [1, 2] })
})

it('取不到时返回默认值', () => {
  expect(storage.get('missing')).toBe('')
  expect(storage.get('missing', { def: 'def' })).toBe('def')
})

it('默认有效期 7 天', () => {
  const now = Date.now()
  storage.set('expire_default', 'x')

  const raw = JSON.parse(localStorage.getItem('expire_default') as string)
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  expect(raw.time).toBeGreaterThanOrEqual(now + sevenDays - 1000)
  expect(raw.time).toBeLessThanOrEqual(now + sevenDays + 1000)
})

it('自定义有效期', () => {
  const now = Date.now()
  storage.set('expire_custom', 'x', { expire: 1 })

  const raw = JSON.parse(localStorage.getItem('expire_custom') as string)
  const oneDay = 24 * 60 * 60 * 1000

  expect(raw.time).toBeGreaterThanOrEqual(now + oneDay - 1000)
  expect(raw.time).toBeLessThanOrEqual(now + oneDay + 1000)
})

it('传入空 options 时也使用默认有效期，而不是永不过期', () => {
  const now = Date.now()
  storage.set('expire_empty_options', 'x', {})

  const raw = JSON.parse(localStorage.getItem('expire_empty_options') as string)

  expect(Number.isNaN(raw.time)).toBe(false)
  expect(raw.time).toBeGreaterThan(now)
})

it('过期后读不到并自动删除', () => {
  storage.set('expired', 'x', { expire: -1 })
  expect(localStorage.getItem('expired')).not.toBeNull()

  expect(storage.get('expired')).toBe('')
  expect(localStorage.getItem('expired')).toBeNull()
})

it('空 key 不写入', () => {
  storage.set('', 'x')
  expect(localStorage.length).toBe(0)
})

it('登记表记录写入的 key', () => {
  storage.set('a', '1')
  storage.set('b', '2')

  expect(JSON.parse(localStorage.getItem('MU_KEYS') as string)).toEqual(['a', 'b'])
})

it('remove 同时从登记表移除', () => {
  storage.set('a', '1')
  storage.set('b', '2')
  storage.remove('a')

  expect(JSON.parse(localStorage.getItem('MU_KEYS') as string)).toEqual(['b'])
})

/**
 * 用 Map 实现的假 localStorage，可以指定前几次 setItem 抛配额错误
 */
function useFakeStorage(fail_times: number) {
  const real = globalThis.localStorage
  const map = new Map<string, string>()

  for (let i = 0; i < real.length; i++) {
    const key = real.key(i)
    if (key) {
      map.set(key, real.getItem(key) as string)
    }
  }

  let failures = fail_times

  const fake = {
    get length() {
      return map.size
    },
    key: (index: number) => [...map.keys()][index] ?? null,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (failures > 0) {
        failures -= 1
        throw new DOMException('quota exceeded', 'QuotaExceededError')
      }
      map.set(key, value)
    },
    removeItem: (key: string) => {
      map.delete(key)
    },
    clear: () => map.clear(),
  }

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: fake })

  return {
    map,
    restore: () => Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: real }),
  }
}

it('空间不足时先清理过期缓存再重试', () => {
  storage.set('expired', 'x', { expire: -1 })
  storage.set('alive', 'y')

  const fake = useFakeStorage(1)
  try {
    storage.set('fresh', 'z')

    expect(storage.get('fresh')).toBe('z')
    // 过期项被清掉，未过期的保留
    expect(localStorage.getItem('expired')).toBeNull()
    expect(localStorage.getItem('alive')).not.toBeNull()
  } finally {
    fake.restore()
  }
})

it('清理过期项后仍然不足时按时间删掉一半旧数据', () => {
  storage.set('old', 'v1', { expire: 100 })
  storage.set('new', 'v2', { expire: 100 })
  // 让 old 的写入时间更早
  localStorage.setItem('old', JSON.stringify({ value: 'v1', time: Date.now() + 100000 }))

  // 首次写入失败 + 清理过期项后的重试也失败，触发按时间删除
  const fake = useFakeStorage(2)
  try {
    storage.set('fresh', 'v3')

    expect(storage.get('fresh')).toBe('v3')
    expect(localStorage.getItem('old')).toBeNull()
    // 较新的数据保留
    expect(storage.get('new')).toBe('v2')
  } finally {
    fake.restore()
  }
})

it('登记表里遗留的旧前缀 key 仍会被清理', () => {
  // 旧版本写入的数据（带 MU_ 前缀），登记表里还留着记录
  localStorage.setItem('MU_KEYS', JSON.stringify(['MU_legacy']))
  localStorage.setItem('MU_legacy', JSON.stringify({ value: 'legacy', time: Date.now() - 1000 }))

  const fake = useFakeStorage(1)
  try {
    storage.set('fresh', 'v')
    expect(localStorage.getItem('MU_legacy')).toBeNull()
  } finally {
    fake.restore()
  }
})
