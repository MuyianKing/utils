/**
 * 进入全屏
 * @param el 进入全屏元素
 */
export function openFullScreen(el: HTMLElement) {
  const docElm = (el || document.body) as any
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen()
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen()
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen()
  }
}

/**
 * 退出全屏
 */
export function exitFullScreen() {
  const _document = document as any
  if (_document.exitFullscreen) {
    _document.exitFullscreen()
  } else if (_document.mozCancelFullScreen) {
    _document.mozCancelFullScreen()
  } else if (_document.webkitCancelFullScreen) {
    _document.webkitCancelFullScreen()
  } else if (_document.msExitFullscreen) {
    _document.msExitFullscreen()
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
  for (let i = 56; i < 2000; i++) {
    if (matchMedia(`(max-resolution: ${i}dpi)`).matches === true) {
      return i
    }
  }
  return 0
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
