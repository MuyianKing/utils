interface ConfigType {
  extend_keys?: string[]
  rootCheck: (value: any) => boolean
  props?: {
    label?: string
    value?: string
    children?: string
    parent?: string
  }
}

/**
 * 将一维平面数据转换为树形结构
 * @param list 平面数据
 * @param config 配置
 * @param config.rootCheck 判断是否为根节点，默认值为falsity则为根节点
 * @param config.extend_keys 除了props设置的属性外，需要额外添加到树上的属性
 * @param config.props 数据字段配置
 * @param config.props.label
 * @param config.props.children
 * @param config.props.value
 */
export function makeTree(list: any[], config?: ConfigType) {
  const tree_map: any = {}

  const _config = config || null
  const props = _config?.props || {}
  const label = props.label || 'label'
  const value = props.value || 'value'
  const children = props.children || 'children'
  const parent = props.parent || 'parent'

  list.forEach((item) => {
    const key = item[value]

    if (!tree_map[key]) {
      tree_map[item[value]] = {}
    }

    tree_map[key][label] = item[label]
    tree_map[key][value] = key

    if (item[children]) {
      tree_map[key][children] = item[children]
    }

    if (item[parent] !== undefined) {
      tree_map[key][parent] = item[parent]
    }

    // 添加额外的字段
    if (config?.extend_keys) {
      config.extend_keys.forEach((extends_key) => {
        tree_map[key] = item[extends_key]
      })
    }

    // 寻找父子关系
    const p_key = item[parent]
    if (p_key) {
      // 当前没有父亲，生成父亲对象
      if (!tree_map[p_key]) {
        tree_map[p_key] = {}
      }

      // 父亲没有children属性：生成空数组
      if (!tree_map[p_key][children]) {
        tree_map[p_key][children] = []
      }

      // 放入父亲的下级
      tree_map[p_key][children].push(tree_map[key])
    }
  })

  // 判断是否为根节点的方式
  let rootCheck = null
  if (config?.rootCheck) {
    rootCheck = config.rootCheck
  } else {
    // 默认值为falsity则为根节点
    rootCheck = (item: any) => !item[parent]
  }

  // 寻找根节点
  const keys = Object.keys(tree_map)

  const root_tree = []
  for (let i = 0; i < keys.length; i++) {
    if (rootCheck(tree_map[keys[i]])) {
      root_tree.push(tree_map[keys[i]])
    }
  }

  if (root_tree.length > 0) {
    return root_tree
  }

  if (keys.length > 0) {
    throw new Error('未找到根节点')
  }

  return []
}

/**
 * 将树扁平化
 * @param tree_data 树形数据
 * @param config 配置
 * @param config.children 子节点
 */
export function flatTree(tree_data: any[], config?: {
  children?: string
}) {
  const children_key = config?.children || 'children'

  const new_arr: any[] = []
  if (!tree_data) {
    return []
  }

  tree_data.forEach((item) => {
    if (item[children_key] && item[children_key].length > 0) {
      flatTree(item[children_key], config).forEach((_item) => {
        new_arr.push(_item)
      })
    }

    delete item[children_key]

    new_arr.push(item)
  })

  return new_arr
}

// interface TreeType {
//   rowspan?: number
//   colspan?: number
//   append?: boolean
//   next?: TreeType[]
//   [x: string]: any
// }
// export function treeToTable(tree_data: TreeType[]) {
//   tree_data = cloneDeep(tree_data)

//   // 计算rowspan
//   function compRow(data: TreeType[]) {
//     data.forEach((item) => {
//       if (item.next) {
//         compRow(item.next)
//         item.rowspan = 0
//         item.next.forEach((row) => {
//           if (!item.rowspan) {
//             item.rowspan = 0
//           }
//           item.rowspan += row.rowspan || 0
//         })
//       } else {
//         item.rowspan = 1
//       }
//     })
//   }

//   // 计算树的最大深度
//   function compDepth(t_data: TreeType[]) {
//     let max_depth = 0
//     function fn(data: TreeType[], depth: number = 1) {
//       data.forEach((item) => {
//         if (item.next && item.next.length) {
//           fn(item.next, depth + 1)
//         }

//         if (max_depth < depth) {
//           max_depth = depth
//         }
//       })
//     }

//     fn(t_data)

//     return max_depth
//   }

//   // 计算colspan
//   function compCol(data: TreeType[], level = 0, max_depth = 3) {
//     data.forEach((item) => {
//       if (!item.next || item.next.length === 0) {
//         item.colspan = max_depth - level
//       } else {
//         compCol(item.next, level + 1, max_depth)
//       }
//     })
//   }

//   // 树形结构转table
//   function getAllPath(tree: TreeType[]): TreeType[][] {
//     const paths = []
//     for (let i = 0; i < tree.length; i++) {
//       if (tree[i].next) {
//         // 如果有子节点便继续深入，直到到达叶子节点
//         const res = getAllPath(tree[i].next as TreeType[])

//         // 遍历最后一层的节点，生成路径
//         for (let j = 0; j < res.length; j++) {
//           const arr = [...res[j]]

//           // 如果没有添加过
//           if (!tree[i].append) {
//             // 添加已添加标识
//             tree[i].append = true
//             arr.unshift(tree[i])
//           }
//           paths.push(arr) // 子节点返回后将其返回的路径与自身拼接
//         }
//       } else {
//         // 没有子节点的话，直接将自身拼接到paths中
//         paths.push([tree[i]])
//       }
//     }
//     return paths
//   }

//   compRow(tree_data)
//   const max_depth = compDepth(tree_data)
//   compCol(tree_data, 0, max_depth)

//   return getAllPath(tree_data)
// }
