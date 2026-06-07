/**
 * 进入全屏
 * @param el 进入全屏元素
 */
export function openFullScreen(el: HTMLElement) {
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
 * @param {Dom} el
 */
export function isOverflow(el: HTMLElement) {
  return el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight
}

/**
 * 获取图片宽高
 * @param src 图片资源
 * @returns 宽高
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
 * @returns dpi
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
 * @returns 像素
 */
export function getPxBymm(num: number): number {
  const dpi = getDpi()
  return dpi / 25.4 * num
}

/**
 * px=>pt
 * @param num
 */
export function getPtByPx(num: number): number {
  return num / (getDpi() / 72)
}

/**
 * mm=>pt
 * @param num
 */
export function getPtBymm(num: number): number {
  return getPtByPx(getPxBymm(num))
}

/**
 * px=>mm
 * @param num
 */
export function getMmByPx(num: number): number {
  return num / (getDpi() / 25.4)
}

/**
 * 单位转换
 * @param num 转换的值
 * @param from px pt mm
 * @param to px pt mm
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
