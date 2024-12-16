import { merge } from 'lodash-es'
import { isTruth } from './common'

interface GlobModules {
  [x: string]: {
    default: {
      urls: UrlMap
      config: UseURLConfig
    }
  }
}

interface UseURLConfig {
  // 前缀
  prefix?: string
  // 属性名
  keyword?: string
}

interface UrlMap {
  [x: string]: any
}

/**
 * 生成所有的请求路径
 * @param {object} globModules 所有api文件的export
 * @returns 地址
 */
export function generateApis(globModules: GlobModules) {
  if (!isTruth(globModules)) {
    return {}
  }

  let apis = {}
  for (const key in globModules) {
    // 取文件名
    const name = /.\/(?<name>.*).js/.exec(key)!.groups!.name.split('/')
    const _name = name[name.length - 1]

    apis = merge(apis, useURL(globModules[key].default.urls, {
      keyword: _name === 'index' ? '' : _name,
      ...globModules[key].default.config,
    }))
  }

  return apis
}

/**
 * 生成url
 * @param {object} urls 所有的url
 * @param {object} config 配置
 * @param {object} config.prefix 前缀
 * @param {object} config.keyword hl.api.keyword
 */
export function useURL(urls: UrlMap, config: UseURLConfig = {}): UrlMap {
  const prefix = config.prefix || ''
  const url_map = addPrefixToUrls(prefix, urls)

  // 设置了keyword，以keyword作为整个对象属性名
  const keyword = config.keyword || ''
  if (keyword) {
    const url_map_key: UrlMap = {}
    url_map_key[keyword] = url_map
    return url_map_key
  }

  return url_map
}

/**
 * 为urls加上前缀prefix
 * @param {string} prefix 前缀
 * @param {object} urls 地址
 * @returns 地址
 */
export function addPrefixToUrls(prefix: string, urls: UrlMap) {
  const new_urls: UrlMap = {}
  for (const key in urls) {
    new_urls[key] = prefix + urls[key]
  }

  return new_urls
}
