import dayjs from 'dayjs'
import { jsonparse } from './common'

export default {
  setKey(key: string): string {
    key = `HL_${key}`
    return key
  },

  /**
   * 设置缓存
   * @param key
   * @param value
   * @param options
   * @param options.expire 有效期 单位天
   */
  set(key: string, value: string | object, { expire }: {
    expire: number
  } = { expire: 7 }) {
    key = this.setKey(key)
    store.set(key, value, expire)
  },

  /**
   * 获取缓存
   * @param key
   * @param options
   * @param options.def 取不到时的默认值
   */
  get(key: string, options?: { def: string | object }): string | object {
    key = this.setKey(key)
    return store.get(key, options?.def || '')
  },

  /**
   * 删除缓存
   * @param {string} key
   */
  remove(key: string) {
    key = this.setKey(key)
    store.remove(key)
  },
}

// localStorage
const store = {
  /**
   * 设置缓存
   * @param key
   * @param value
   * @param expire 有效期
   */
  set(key: string, value: string | object, expire = 7) {
    if (!key || value === undefined) {
      return
    }

    try {
      this.setItem(key, value, expire)
      const keys = jsonparse(localStorage.getItem('HL_KEYS') || '', []) || []
      if (!keys.includes(key)) {
        keys.push(key)
      }
      localStorage.setItem('HL_KEYS', JSON.stringify(keys))
    } catch (e) {
      if (e instanceof Error && e.message.includes('exceeded the quota')) {
        console.log('set storage 超出')
        this.clearInvalid(() => this.setItem(key, value, expire))
      }
    }
  },

  // 存入
  setItem(key: string, value: string | object, expire: number) {
    localStorage.setItem(key, JSON.stringify({
      value,
      time: dayjs().add(expire, 'day').valueOf(),
    }))
  },

  /**
   * 清除已过期的缓存、
   * @param callback 清除成功回调
   */
  clearInvalid(callback: (() => void) | undefined) {
    const keys: string[] = jsonparse(localStorage.getItem('keys') || '', []) || []
    let objs: Array<{
      key: string
      value: {
        value: string | object
        time: number
      }
    }> = []

    keys.forEach((key) => {
      objs.push({
        key,
        value: jsonparse(localStorage.getItem(key) || '', null),
      })
    })

    if (!callback) {
      return
    }

    try {
      callback()
    } catch (e) {
      // 依旧空间不够
      if (e instanceof Error && e.message.includes('exceeded the quota')) {
        // 按照存入时间删掉一半
        objs = objs.filter(item => item.value).sort((a, b) => a.value.time - b.value.time)
        objs.splice(0, Math.ceil(objs.length / 2)).forEach((item) => {
          this.remove(item.key)
          callback()
        })
      }
    }
  },

  /**
   * 获取缓存
   * @param key
   * @param def
   */
  get(key: string, def: any): string | object {
    const item = localStorage.getItem(key)

    if (!item) {
      return def || ''
    }

    try {
      const v: {
        value: string
        time: number
      } = JSON.parse(item)
      if (v.time) {
        if (dayjs().valueOf() - v.time > 0) {
          this.remove(key)
          return def
        }
      }

      return jsonparse(v.value, v.value)
    } catch (error) {
      console.log('get storage', error)
      return item
    }
  },

  /**
   * 删除缓存
   * @param {string} key
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  },
}
