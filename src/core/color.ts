// 16进制颜色，#abc 与 #aabbcc 两种写法
const HEX_REG = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * 归一化16进制颜色
 * @param color 颜色字符串，支持 #abc 与 #aabbcc
 * @returns 小写的6位16进制颜色（不含#），格式非法返回null
 */
export function normalizeHex(color: string): string | null {
  if (typeof color !== 'string') {
    return null
  }

  const str = color.trim()
  if (!HEX_REG.test(str)) {
    return null
  }

  const hex = str.slice(1).toLowerCase()
  if (hex.length === 3) {
    return hex.split('').map(char => char + char).join('')
  }

  return hex
}

/**
 * 6位16进制颜色转rgb
 */
function hexToRgb(hex: string): number[] {
  const arr: number[] = []
  for (let i = 0; i < 6; i += 2) {
    arr.push(Number.parseInt(hex.slice(i, i + 2), 16))
  }
  return arr
}

/**
 * 16进制颜色转rgb
 * @param str
 * @return rgb
 */
export function set16ToRgb(str: string): number[] | null {
  const hex = normalizeHex(str)
  if (hex === null) {
    return null
  }

  return hexToRgb(hex)
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
 * @throws 颜色格式非法或权重不是有效数字时抛错
 */
export function mix(color1: string, color2: string, weight: number): string {
  const hex1 = normalizeHex(color1)
  const hex2 = normalizeHex(color2)

  if (hex1 === null || hex2 === null) {
    throw new Error(`mix: 颜色格式非法，仅支持 #abc 与 #aabbcc，收到 ${JSON.stringify(color1)} / ${JSON.stringify(color2)}`)
  }

  if (typeof weight !== 'number' || !Number.isFinite(weight)) {
    throw new TypeError(`mix: weight 必须是 0-1 之间的数字，收到 ${JSON.stringify(weight)}`)
  }

  const _weight = Math.max(Math.min(weight, 1), 0)
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)

  const channel = (index: number) => {
    return Math.round(rgb1[index] * (1 - _weight) + rgb2[index] * _weight)
      .toString(16)
      .padStart(2, '0')
  }

  return `#${channel(0)}${channel(1)}${channel(2)}`
}
