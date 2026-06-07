# api.ts — API 管理

生成请求路径集合，为 URL 添加统一前缀。

## 导出

### generateApis(globModules)

```typescript
function generateApis(globModules: GlobModules): UrlMap
```

生成所有的请求路径，适用于 `import.meta.glob` 批量导入 API 模块的场景。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| globModules | `GlobModules` | 所有 API 文件的 export，每个模块需包含 `default.urls` 和 `default.config` |

**返回**: `UrlMap` — 嵌套的 URL 地址集合

**示例**

```typescript
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const apis = generateApis(modules)
// { user: { list: '/api/user/list', detail: '/api/user/detail' } }
```

---

### useURL(urls, config?)

```typescript
function useURL(urls: UrlMap, config?: UseURLConfig): UrlMap
```

为 URL 集合生成带前缀/关键字的最终映射。

**参数**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| urls | `UrlMap` | — | 所有的 URL 映射 |
| config.prefix | `string` | `''` | URL 前缀 |
| config.keyword | `string` | `''` | 关键字，会在外层包一层对象 |

**返回**: `UrlMap`

**示例**

```typescript
useURL({ list: '/api/list' }, { prefix: '/v1' })
// { list: '/v1/api/list' }

useURL({ list: '/api/list' }, { keyword: 'user' })
// { user: { list: '/api/list' } }
```

---

### addPrefixToUrls(prefix, urls)

```typescript
function addPrefixToUrls(prefix: string, urls: UrlMap): UrlMap
```

为 URLs 对象中的所有字符串值添加前缀。

**参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| prefix | `string` | 前缀 |
| urls | `UrlMap` | 地址映射 |

**返回**: `UrlMap`

**示例**

```typescript
addPrefixToUrls('/api', { list: '/list', detail: '/detail' })
// { list: '/api/list', detail: '/api/detail' }
```
