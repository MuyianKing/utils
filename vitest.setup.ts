import { vi } from 'vitest'

// 在 jsdom 或 Node 环境下提供 localStorage polyfill
// 解决 jsdom 29 opaque origin + Node.js 25 实验性 localStorage 的兼容问题
if (typeof globalThis.localStorage === 'undefined'
  || typeof globalThis.localStorage.getItem !== 'function') {
  const storage = new Map<string, string>()

  Object.defineProperty(globalThis, 'localStorage', {
    writable: false,
    configurable: true,
    value: {
      getItem: (key: string): string | null => storage.get(key) ?? null,
      setItem: (key: string, value: string): void => {
        storage.set(key, value)
      },
      removeItem: (key: string): void => {
        storage.delete(key)
      },
      clear: (): void => {
        storage.clear()
      },
      get length(): number {
        return storage.size
      },
      key: (index: number): string | null => {
        const keys = [...storage.keys()]
        return keys[index] ?? null
      },
    },
  })
} else {
  // Node.js 25 内置 localStorage 可能导致警告，抹掉以确保一致性
  vi.stubGlobal('localStorage', globalThis.localStorage)
}
