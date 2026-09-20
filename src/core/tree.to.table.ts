import { cloneDeep } from 'lodash-es'

interface TreeType {
  rowspan?: number
  colspan?: number
  append?: boolean
  next?: TreeType[]
  [x: string]: unknown
}

/**
 * 将树形结构转为渲染表格用的二维数组，自动计算 rowspan 与 colspan
 * @param tree_data 树形数据，子节点字段为 next
 * @returns 二维数组，每个内部数组代表表格的一行；内部会先深拷贝，不会修改入参
 * @example treeToTable([{ label: 'A', next: [{ label: 'A1' }] }]) // [[{ label: 'A', rowspan: 1 }, { label: 'A1', rowspan: 1, colspan: 1 }]]
 * @example treeToTable([]) // []
 */
export function treeToTable(tree_data: TreeType[]) {
  tree_data = cloneDeep(tree_data)

  /**
   * 计算rowspan：有子节点时为所有子节点 rowspan 之和，叶子节点为 1
   * @param data 待计算的树形数据
   */
  function compRow(data: TreeType[]) {
    data.forEach((item) => {
      if (item.next && item.next.length > 0) {
        compRow(item.next)
        let rowspan = 0
        item.next.forEach((row) => {
          rowspan += row.rowspan || 0
        })
        item.rowspan = rowspan
      } else {
        item.rowspan = 1
      }
    })
  }

  /**
   * 计算树的最大深度
   * @param t_data 待计算的树形数据
   * @returns 最大深度，空数组返回 0
   */
  function compDepth(t_data: TreeType[]) {
    let max_depth = 0
    /**
     * 递归累计深度
     * @param data 当前层数据
     * @param depth 当前层级，从 1 开始
     */
    function fn(data: TreeType[], depth: number = 1) {
      data.forEach((item) => {
        if (item.next && item.next.length) {
          fn(item.next, depth + 1)
        }

        if (max_depth < depth) {
          max_depth = depth
        }
      })
    }

    fn(t_data)

    return max_depth
  }

  /**
   * 计算colspan：仅叶子节点会被赋值，为最大深度减去当前层级
   * @param data 待计算的树形数据
   * @param level 当前层级，从 0 开始
   * @param max_depth 树的最大深度
   */
  function compCol(data: TreeType[], level = 0, max_depth = 3) {
    data.forEach((item) => {
      if (!item.next || item.next.length === 0) {
        item.colspan = max_depth - level
      } else {
        compCol(item.next, level + 1, max_depth)
      }
    })
  }

  /**
   * 树形结构转table：每棵子树的第一个叶子带上完整父节点路径，其余叶子单独成行
   * @param tree 待转换的树形数据
   * @returns 二维数组，每个内部数组代表表格的一行
   */
  function getAllPath(tree: TreeType[]): TreeType[][] {
    const paths: TreeType[][] = []
    for (let i = 0; i < tree.length; i++) {
      const next = tree[i].next
      if (next && next.length > 0) {
        // 如果有子节点便继续深入，直到到达叶子节点
        const res = getAllPath(next)

        // 遍历最后一层的节点，生成路径
        for (let j = 0; j < res.length; j++) {
          const arr = [...res[j]]

          // 如果没有添加过
          if (!tree[i].append) {
            // 添加已添加标识
            tree[i].append = true
            arr.unshift(tree[i])
          }
          paths.push(arr) // 子节点返回后将其返回的路径与自身拼接
        }
      } else {
        // 没有子节点的话，直接将自身拼接到paths中
        paths.push([tree[i]])
      }
    }
    return paths
  }

  compRow(tree_data)
  const max_depth = compDepth(tree_data)
  compCol(tree_data, 0, max_depth)

  const new_arr = getAllPath(tree_data)

  new_arr.forEach((tr) => {
    tr.forEach((td) => {
      delete td.next
      delete td.append
    })
  })

  return new_arr
}
