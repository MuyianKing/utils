/**
 * 16进制颜色转rgb
 * @param str
 * @return rgb
 */
export function set16ToRgb(str: string): number[] | null {
  const reg = /^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i
  if (!reg.test(str)) {
    return null
  }
  let newStr = str.toLowerCase().replace(/#/g, '')
  const len = newStr.length
  if (len === 3) {
    let t = ''
    for (let i = 0; i < len; i++) {
      t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
    }
    newStr = t
  }
  const arr = [] // 将字符串分隔，两个两个的分隔
  for (let i = 0; i < 6; i += 2) {
    const s = newStr.slice(i, i + 2)
    arr.push(Number.parseInt(`0x${s}`, 16))
  }
  return arr
}

/**
 * 判断所给的颜色是不是亮色
 * @param color
 * @return true-亮色 false-暗色
 */
export function isLight(color: string | Array<number>): boolean {
  const _color = Array.isArray(color) ? color : set16ToRgb(color)

  if (_color === null || _color.length < 3) {
    return false
  }
  return _color[0] * 0.299 + _color[1] * 0.587 + _color[2] * 0.114 > 192
}

/**
 * 混色
 * @param color1 主色
 * @param color2 辅色
 * @param weight 混入的权重 0-1
 * @returns 16进制的颜色字符出啊
 */
export function mix(color1: string, color2: string, weight: number): string {
  weight = Math.max(Math.min(weight, 1), 0)
  const r1 = Number.parseInt(color1.substring(1, 3), 16)
  const g1 = Number.parseInt(color1.substring(3, 5), 16)
  const b1 = Number.parseInt(color1.substring(5, 7), 16)
  const r2 = Number.parseInt(color2.substring(1, 3), 16)
  const g2 = Number.parseInt(color2.substring(3, 5), 16)
  const b2 = Number.parseInt(color2.substring(5, 7), 16)
  let r = Math.round(r1 * (1 - weight) + r2 * weight).toString(16)
  let g = Math.round(g1 * (1 - weight) + g2 * weight).toString(16)
  let b = Math.round(b1 * (1 - weight) + b2 * weight).toString(16)
  r = `0${(r || 0).toString(16)}`.slice(-2)
  g = `0${(g || 0).toString(16)}`.slice(-2)
  b = `0${(b || 0).toString(16)}`.slice(-2)
  return `#${r}${g}${b}`
}
