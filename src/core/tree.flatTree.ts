/**
 * 将树扁平化
 * @param tree_data 树形数据
 * @param config 配置
 * @param config.children 子节点
 */
export function flatTree<T>(tree_data: T[], config?: {
  children?: string
}): T[] {
  const children_key = config?.children || 'children'

  const new_arr: any[] = []
  if (!tree_data) {
    return []
  }

  tree_data.forEach((item) => {
    const _item = item as any
    if (_item[children_key] && _item[children_key].length > 0) {
      flatTree(_item[children_key], config).forEach((_item) => {
        new_arr.push(_item)
      })
    }

    delete _item[children_key]

    new_arr.push(item)
  })

  return new_arr
}
