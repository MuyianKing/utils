# storage.ts — 缓存管理

基于 `localStorage` 的缓存工具，支持过期时间、自动清理无效缓存。

## 导出

对象 `storage`（默认导出，在 `index.ts` 中以命名导出暴露）。

### storage.set(key, value, options?)

```typescript
storage.set(key: string, value: string | object, options?: { expire: number }): void
```

设置缓存。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | `string` | — | 缓存的键名（自动添加 `MU_` 前缀） |
| value | `string \| object` | — | 缓存的值 |
| options.expire | `number` | `7` | 有效期（天） |

**示例**

```typescript
storage.set('token', 'abc123')
storage.set('user', { name: '张三' }, { expire: 30 })
```

---

### storage.get(key, options?)

```typescript
storage.get(key: string, options?: { def: string | object }): string | object
```

获取缓存。已过期的缓存会自动删除并返回默认值。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | `string` | — | 缓存的键名 |
| options.def | `string \| object` | `''` | 取不到时的默认值 |

**返回**: `string | object`

**示例**

```typescript
storage.get('token')          // 'abc123'
storage.get('not-exist')       // ''
storage.get('not-exist', { def: 'default' }) // 'default'
```

---

### storage.remove(key)

```typescript
storage.remove(key: string): void
```

删除缓存。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| key | `string` | 缓存的键名 |

**示例**

```typescript
storage.remove('token')
```

---

### 内部机制

- 所有缓存键自动添加 `MU_` 前缀，避免与其他应用冲突
- 值存储格式：`{ value: any, time: number }`，其中 `time` 为过期时间戳
- 使用 `HL_KEYS` 维护所有活跃的缓存键列表，`clearInvalid()` 在每次 `get` 时自动清理过期项
