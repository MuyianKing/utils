// @vitest-environment jsdom
import { expect, it } from 'vitest'

// getUrlParam 依赖 @vueuse/core → Vue 响应式系统
// 在无 Vue 的环境下，仅测试 hash 回退逻辑
it.todo('getUrlParam 读取 hash 参数（需 Vue 环境）')
