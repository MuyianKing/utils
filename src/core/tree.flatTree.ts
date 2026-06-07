interface FlatTreeItem {
  [key: string]: any
}

/**
 * 将树扁平化
 * @param tree_data 树形数据
 * @param config 配置
 * @param config.children 子节点
 */
export function flatTree<T extends FlatTreeItem>(tree_data: T[], config?: {
  children?: string
}): T[] {
  const children_key = config?.children || 'children'

  if (!tree_data) {
    return []
  }

  const new_arr: T[] = []

  tree_data.forEach((item) => {
    const children = item[children_key] as T[] | undefined
    if (children && children.length > 0) {
      flatTree(children, config).forEach(child => new_arr.push(child))
    }

    const { [children_key]: _childArr, ...rest } = item
    new_arr.push(rest as T)
  })

  return new_arr
}
