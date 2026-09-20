interface ConfigType {
  rootCheck?: (item: any) => boolean
  extend_keys?: string[]
  props?: {
    label?: string
    children?: string
    value?: string
    parent?: string
  }
}

/**
 * 将平面结构变为树形结构
 * @param list 扁平数组
 * @param config 配置
 * @param config.rootCheck 自定义根节点判断函数，默认 parent 为假值且该节点在 list 中真实出现过
 * @param config.extend_keys 需要保留到结果节点上的额外字段名
 * @param config.props 字段名映射
 * @param config.props.label 标签字段名，默认 'label'
 * @param config.props.children 子节点字段名，默认 'children'
 * @param config.props.value 值字段名，默认 'value'
 * @param config.props.parent 父节点字段名，默认 'parent'
 * @returns 树形结构，list 为空数组时返回 []
 * @throws 入参非空但找不到根节点时抛 Error('未找到根节点')
 * @example makeTree([{ label: '根节点', value: 1 }, { label: '子节点', value: 2, parent: 1 }])
 * @example makeTree(list, { props: { label: 'name', value: 'id', parent: 'parentId' } }) // 自定义字段名
 * @example makeTree(list, { extend_keys: ['disabled'], rootCheck: item => !!item.root }) // 保留额外字段并自定义根节点规则
 */
export function makeTree<T>(list: T[], config?: ConfigType): T[] {
  const tree_map: Record<string, any> = {}
  // 入参里真实出现过的节点，用于区分"父节点不在列表里"时生成的占位对象
  const real_keys = new Set<string>()

  const _config = config || {}
  const props = _config.props || {}
  const label = props.label || 'label'
  const value = props.value || 'value'
  const children = props.children || 'children'
  const parent = props.parent || 'parent'

  list.forEach((item) => {
    const key = (item as any)[value]
    real_keys.add(String(key))

    if (!tree_map[key]) {
      tree_map[key] = {}
    }

    tree_map[key][label] = (item as any)[label]
    tree_map[key][value] = key

    if ((item as any)[children]) {
      tree_map[key][children] = (item as any)[children]
    }

    if ((item as any)[parent] !== undefined) {
      tree_map[key][parent] = (item as any)[parent]
    }

    // 添加额外的字段
    if (config?.extend_keys) {
      config.extend_keys.forEach((extends_key) => {
        tree_map[key][extends_key] = (item as any)[extends_key]
      })
    }

    // 寻找父子关系
    const p_key = (item as any)[parent]
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
  let rootCheck: (item: any) => boolean
  if (config?.rootCheck) {
    rootCheck = config.rootCheck
  } else {
    // 默认值为falsity则为根节点，且必须是入参里真实出现过的节点
    // （否则子节点引用了不存在的父节点时，占位对象会被当成根节点，返回空节点）
    rootCheck = (item: any) => !item[parent] && real_keys.has(String(item[value]))
  }

  // 寻找根节点
  const keys = Object.keys(tree_map)

  const root_tree: T[] = []
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
