# file.ts — 文件处理

文件类型判断、MIME 类型获取、下载、Blob 转换。

## 导出常量

| 常量                    | 值                                                            | 说明                                               |
| ----------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| `UPLOAD_FILE_MAX_SIZE`  | `10`                                                          | 上传文件最大大小（MB）                             |
| `UPLOAD_VIDEO_MAX_SIZE` | `500`                                                         | 上传视频最大大小（MB）                             |
| `FILE_SUFFIX`           | `['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip']` | 附件允许的格式                                     |
| `VIDEO_SUFFIX`          | `['mp4', 'm3u8', 'avi']`                                      | 视频格式                                           |
| `IMAGE_SUFFIX`          | `['jpg', 'jpeg', 'png', 'gif']`                               | 图片格式                                           |
| `AUDIO_SUFFIX`          | `['mp3', 'wav', 'm4a']`                                       | 音频格式                                           |
| `mime_type`             | `Array<{ suffix: string, mime_type: string }>`                | 后缀名到 MIME 类型的映射表，包含 64 项常见文件类型 |

---

## 导出函数

### getSuffix(fileName)

```typescript
function getSuffix(fileName: string): string
```

获取文件后缀（小写）。

**参数**

| 参数     | 类型     | 说明   |
| -------- | -------- | ------ |
| fileName | `string` | 文件名 |

**返回**: `string` — 小写后缀，无后缀返回空字符串

**示例**

```typescript
getSuffix('test.mp4') // 'mp4'
getSuffix('test.2.MP4') // 'mp4'
getSuffix('test') // ''
getSuffix('test.') // ''
getSuffix('') // ''
```

---

### getMimeType(types)

```typescript
function getMimeType<T extends string[] | string>(types: T): T extends string[] ? string[] : string
```

根据文件后缀获取对应的 MIME 类型。

**参数**

| 参数  | 类型                 | 说明               |
| ----- | -------------------- | ------------------ |
| types | `string \| string[]` | 单个后缀或后缀数组 |

**返回**: `string | string[]` — 输入为字符串返回字符串（查不到返回 `''`），输入为数组返回数组

**示例**

```typescript
getMimeType('jpg') // 'image/jpeg'
getMimeType(['jpg', 'png']) // ['image/jpeg', 'image/png']
getMimeType('unknown') // ''
```

---

### getType(file_name)

```typescript
function getType(file_name: string): string
```

根据文件名判断文件类型分类。

**参数**

| 参数      | 类型     | 说明   |
| --------- | -------- | ------ |
| file_name | `string` | 文件名 |

**返回**: `string` — `'image'`、`'video'`、`'audio'`、`'file'` 或 `''`

**示例**

```typescript
getType('test.jpg') // 'image'
getType('test.mp4') // 'video'
getType('test.mp3') // 'audio'
getType('test.pdf') // 'file'
getType('test.xyz') // ''
```

---

### download(url, name)

```typescript
function download(url: string, name: string): void
```

下载文件。通过动态创建 `<a>` 标签触发下载；地址是 `blob:` 开头时会在下载后释放该 URL。

**参数**

| 参数 | 类型     | 说明             |
| ---- | -------- | ---------------- |
| url  | `string` | 下载地址         |
| name | `string` | 下载保存的文件名 |

**示例**

```typescript
download('https://example.com/file.pdf', 'report.pdf')
download('blob:http://example.com/uuid', 'image.png')
```

---

### getBlobFromUrl(url)

```typescript
async function getBlobFromUrl(url: string): Promise<Blob>
```

从文件地址获取 Blob 对象。

**参数**

| 参数 | 类型     | 说明     |
| ---- | -------- | -------- |
| url  | `string` | 文件 URL |

**返回**: `Promise<Blob>`

**示例**

```typescript
const blob = await getBlobFromUrl('https://example.com/file.pdf')
```

---

### fileToBlob(file, type)

```typescript
function fileToBlob(file: File, type: string): Promise<Blob>
```

将 `File` 对象转换为 `Blob` 对象。

**参数**

| 参数 | 类型     | 说明                           |
| ---- | -------- | ------------------------------ |
| file | `File`   | File 对象                      |
| type | `string` | MIME 类型（如 `'text/plain'`） |

**返回**: `Promise<Blob>` — 读取结果为空时 reject `Error('转换失败')`

**示例**

```typescript
const blob = await fileToBlob(file, 'text/plain')
```

---

### readBlobAsJSON(blob)

```typescript
function readBlobAsJSON<T = any>(blob: Blob): Promise<T>
```

将 Blob 对象读取为 JSON（支持泛型指定解析结果的类型）。

**参数**

| 参数 | 类型   | 说明      |
| ---- | ------ | --------- |
| blob | `Blob` | Blob 数据 |

**返回**: `Promise<T>`

**异常**: 内容不是合法 JSON 时 reject `Error('JSON 解析失败：...')`；读取失败时 reject `reader.error` 或 `Error('文件读取失败')`

**示例**

```typescript
const data = await readBlobAsJSON(blob)
console.log(data) // 解析后的 JSON 对象

interface User {
  name: string
}
const user = await readBlobAsJSON<User>(blob) // user.name
```
