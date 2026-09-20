# storage.ts — 缓存管理

基于 `localStorage` 的缓存工具，支持过期时间，并在写入时遇到空间不足自动清理。

## 导出

对象 `storage`（默认导出，在 `index.ts` 中以命名导出暴露），共 3 个方法：

```typescript
declare const storage: {
  set: (key: string, value: string | object, options?: { expire?: number }) => void
  get: <T extends string | object = string | object>(key: string, options?: { def?: T }) => T
  remove: (key: string) => void
}
```

缓存键按传入的 `key` 原样存入 `localStorage`（不加任何前缀），公开方法内部都不使用 `this`，所以解构调用（如 `const { set, get } = storage`）是安全的。

### storage.set(key, value, options?)

```typescript
function set(key: string, value: string | object, options?: { expire?: number }): void
```

设置缓存。同 key 会被覆盖，并登记到内部 key 列表。

**参数**

| 参数           | 类型               | 默认值 | 说明                           |
| -------------- | ------------------ | ------ | ------------------------------ |
| key            | `string`           | —      | 缓存的键名（空字符串不写入）   |
| value          | `string \| object` | —      | 缓存的值（`undefined` 不写入） |
| options.expire | `number`           | `7`    | 有效期（天）                   |

**说明**: 第三个参数不传、传 `{}` 都会使用默认的 7 天有效期。

**示例**

```typescript
storage.set('token', 'abc123')
storage.set('user', { name: '张三' }, { expire: 30 })
storage.set('temp', 'value', {}) // 同样使用默认 7 天
storage.set('', 'value') // 不写入
```

---

### storage.get(key, options?)

```typescript
function get<T extends string | object = string | object>(key: string, options?: { def?: T }): T
```

获取缓存。已过期的缓存会被删除并返回默认值；取不到时返回 `options.def`，未传 `def` 时返回 `''`。

**参数**

| 参数        | 类型     | 默认值 | 说明             |
| ----------- | -------- | ------ | ---------------- |
| key         | `string` | —      | 缓存的键名       |
| options.def | `T`      | `''`   | 取不到时的默认值 |

**返回**: `T`

**示例**

```typescript
storage.get('token') // 'abc123'
storage.get('not-exist') // ''
storage.get('not-exist', { def: 'default' }) // 'default'

// 泛型：指定取到的值类型
storage.get<{ token: string }>('token') // { token: string }
```

---

### storage.remove(key)

```typescript
function remove(key: string): void
```

删除缓存，并同步从内部 key 列表中移除。

**参数**

| 参数 | 类型     | 说明       |
| ---- | -------- | ---------- |
| key  | `string` | 缓存的键名 |

**示例**

```typescript
storage.remove('token')
```

---

### 解构用法

```typescript
const { set, get, remove } = storage

set('token', 'abc123')
get('token') // 'abc123'
remove('token')
```

---

### 内部机制

- 缓存键就是传入的 `key`，不做前缀处理；值存储格式为 `{ value: any, time: number }`，其中 `time` 为过期时间戳（毫秒）
- key 登记表使用 `MU_KEYS` 这个 key（模块内部维护，不是公开 API）；登记表里可能残留旧版本（带 `MU_` 前缀的键）记录，清理时同样会被处理
- `get` 只处理自己这一条缓存：过期则删除并返回默认值，**不会**每次全量扫描清理
- 空间不足时的清理由模块内部函数完成（未导出）：`set` 写入或登记遇到 `QuotaExceededError` 时，先删除登记表中已过期的缓存；如果仍然不足，再按写入时间从旧到新删掉一半旧数据，然后重试一次
