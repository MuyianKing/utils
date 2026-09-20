/**
 * 进入全屏
 * @param el 进入全屏元素，不传时使用 document.body
 * @example openFullScreen(document.getElementById('myDiv')!) // 指定元素全屏
 * @example openFullScreen() // document.body 全屏
 */
export function openFullScreen(el?: HTMLElement) {
  const docElm = el || document.body
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
  } else if ((docElm as any).mozRequestFullScreen) {
    (docElm as any).mozRequestFullScreen()
  } else if ((docElm as any).webkitRequestFullScreen) {
    (docElm as any).webkitRequestFullScreen()
  } else if ((docElm as any).msRequestFullscreen) {
    (docElm as any).msRequestFullscreen()
  }
}

/**
 * 退出全屏
 * @example exitFullScreen()
 */
export function exitFullScreen() {
  const _document = document
  if (_document.exitFullscreen) {
    _document.exitFullscreen()
  } else if ((_document as any).mozCancelFullScreen) {
    (_document as any).mozCancelFullScreen()
  } else if ((_document as any).webkitCancelFullScreen) {
    (_document as any).webkitCancelFullScreen()
  } else if ((_document as any).msExitFullscreen) {
    (_document as any).msExitFullscreen()
  }
}

/**
 * 判断内容是否溢出
 * @param el 待判断的 DOM 元素
 * @returns 内容宽度或高度超出容器时返回 true，否则返回 false
 * @example isOverflow(document.querySelector('.text-box')!) // true（内容溢出）
 */
export function isOverflow(el: HTMLElement) {
  return el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight
}

/**
 * 获取图片宽高
 * @param src 图片资源地址
 * @returns 图片原始宽高，加载失败时 reject Error('图片加载失败')
 * @example const { width, height } = await getImgSize('https://example.com/image.jpg')
 */
export function getImgSize(src: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src

    // 获取宽高，并以传入的宽高为主
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }
  })
}

/**
 * 获取dpi
 * @returns 当前设备 dpi，优先用 devicePixelRatio 估算，取不到时用 matchMedia 二分查找
 * @example getDpi() // 96（标准屏幕）或 192（Retina 屏幕）
 */
export function getDpi(): number {
  // 优先使用 devicePixelRatio 估算，避免线性循环
  if (window.devicePixelRatio) {
    return Math.round(window.devicePixelRatio * 96)
  }
  // 退回到二分查找
  let low = 56
  let high = 2000
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (matchMedia(`(max-resolution: ${mid}dpi)`).matches) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  return low
}

/**
 * 将指定的长度转换为对应的像素值
 * @param num 长度，单位mm
 * @returns 像素值，公式为 getDpi() / 25.4 * num
 * @example getPxBymm(25.4) // 96（在 96dpi 下）
 */
export function getPxBymm(num: number): number {
  const dpi = getDpi()
  return dpi / 25.4 * num
}

/**
 * px=>pt
 * @param num 像素值
 * @returns 点值，公式为 num / (getDpi() / 72)
 * @example getPtByPx(96) // 72（在 96dpi 下）
 */
export function getPtByPx(num: number): number {
  return num / (getDpi() / 72)
}

/**
 * mm=>pt
 * @param num 毫米值
 * @returns 点值，公式为 getPtByPx(getPxBymm(num))
 * @example getPtBymm(25.4) // 72（在 96dpi 下）
 */
export function getPtBymm(num: number): number {
  return getPtByPx(getPxBymm(num))
}

/**
 * px=>mm
 * @param num 像素值
 * @returns 毫米值，公式为 num / (getDpi() / 25.4)
 * @example getMmByPx(96) // 25.4（在 96dpi 下）
 */
export function getMmByPx(num: number): number {
  return num / (getDpi() / 25.4)
}

/**
 * 单位转换
 * @param num 转换的值
 * @param from 源单位 px pt mm
 * @param to 目标单位 px pt mm
 * @returns 转换结果，未知组合返回 0
 * @example translateUnit(25.4, 'mm', 'px') // 96（在 96dpi 下）
 * @example translateUnit(96, 'px', 'pt') // 72
 * @example translateUnit(10, 'px', 'cm') // 0（不支持的组合）
 */
export function translateUnit(num: number, from: string, to: string): number {
  const translator = `${from}_${to}`

  switch (translator) {
    case 'mm_px':
      return getPxBymm(num)
    case 'mm_pt':
      return getPtBymm(num)
    case 'px_pt':
      return getPtByPx(num)
    case 'px_mm':
      return getMmByPx(num)
    default:
      return 0
  }
}
