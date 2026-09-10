/** Facebook Pixel ID，与 `MetaPixel` 按路由选择的一致 */

export const FB_PIXEL_ID_HOME = '2281167752409164'

export const FB_PIXEL_ID_SHILAJIT = '2006054856790991'

export const FB_PIXEL_ID_GUMMIES = '1998740994324314'

export const FB_PIXEL_ID_BODY_PURIFICATION = '989971676704789'

/** TikTok Pixel ID，与 `TikTokPixel` 按路由选择的一致 */

export const TIKTOK_PIXEL_ID_HOME = ''

export const TIKTOK_PIXEL_ID_SHILAJIT = 'D735GJBC77UD2NQV6200'

export const TIKTOK_PIXEL_ID_GUMMIES = ''

export const TIKTOK_PIXEL_ID_BODY_PURIFICATION = 'D7K84ORC77UAJ1RPS180'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: { page?: () => void; track?: (...args: unknown[]) => void; identify?: (...args: unknown[]) => void }
    tiktokClickId?: string
  }
}

/** 在已挂载 fbq 时上报（未加载时由官方 stub 入队） */
export function fbqTrackSingle(
  pixelId: string,
  eventName: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return
  const fbq = window.fbq
  if (typeof fbq !== 'function') {
    return
  }
  if (params !== undefined) {
    fbq('trackSingle', pixelId, eventName, params)
  } else {
    fbq('trackSingle', pixelId, eventName)
  }
}

/** 从URL或cookie中获取TikTok点击ID (ttclid) */
export function getTikTokClickId(): string | null {
  if (typeof window === 'undefined') return null
  if (window.tiktokClickId) return window.tiktokClickId
  
  // 从URL中获取
  const urlParams = new URLSearchParams(window.location.search)
  let ttclid = urlParams.get('ttclid')
  
  // 如果URL中没有，从cookie中获取
  if (!ttclid && typeof document !== 'undefined') {
    const cookieMatch = document.cookie.match(/ttclid=([^;]+)/)
    if (cookieMatch) {
      ttclid = cookieMatch[1]
    }
  }
  
  if (ttclid) {
    window.tiktokClickId = ttclid
    // 将ttclid存储到cookie中，有效期30天
    if (typeof document !== 'undefined') {
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)
      document.cookie = `ttclid=${ttclid}; expires=${expirationDate.toUTCString()}; path=/`
    }
  }
  
  return ttclid
}

/** 从URL或cookie中获取Facebook ClickID (fbc) */
export function getFacebookClickId(): string | null {
  if (typeof window === 'undefined') return null
  
  // 从cookie中获取
  if (typeof document !== 'undefined') {
    const cookieMatch = document.cookie.match(/_fbc=([^;]+)/)
    if (cookieMatch) {
      return cookieMatch[1]
    }
    
    // 如果cookie中没有，从URL中获取fbclid并生成fbc
    const urlParams = new URLSearchParams(window.location.search)
    const fbclid = urlParams.get('fbclid')
    if (fbclid) {
      // 计算subdomainIndex：表示cookie域级别
      // 1 = 主域名（如 luckdate.com），最常用
      // 2 = 子域名（如 www.luckdate.com）
      let subdomainIndex = 1 // 默认使用主域名级别
      if (typeof window !== 'undefined' && window.location.hostname) {
        const hostnameParts = window.location.hostname.split('.').filter(part => part.length > 0)
        if (hostnameParts.length > 2) {
          subdomainIndex = 2
        } else {
          subdomainIndex = 1
        }
      }
      // 生成fbc格式: fb.${subdomain_index}.${creation_time}.${fbclid}
      const creationTime = Math.floor(Date.now() / 1000) //  Unix时间戳
      const fbc = `fb.${subdomainIndex}.${creationTime}.${fbclid}`
      
      // 存储到cookie中，有效期90天
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 90)
      document.cookie = `_fbc=${fbc}; expires=${expirationDate.toUTCString()}; path=/`
      
      return fbc
    }
  }
  
  return null
}

/** 从cookie中获取Facebook Browser ID (fbp) */
export function getFacebookBrowserId(): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null
  
  // 从cookie中获取
  const cookieMatch = document.cookie.match(/_fbp=([^;]+)/)
  if (cookieMatch) {
    return cookieMatch[1]
  }
  
  return null
}

/** 在已挂载 ttq 时上报事件 */
export function ttqTrack(
  eventName: string,
  params?: Record<string, unknown>,
  ttclid?: string | null,
): void {
  if (typeof window === 'undefined') return
  const ttq = window.ttq
  if (typeof ttq?.track !== 'function') {
    return
  }
  
  // 添加ttclid到参数中
  const eventParams = { ...params }
  if (ttclid) {
    eventParams.ttclid = ttclid
  }

  ttq.track(eventName, eventParams)
}

/** 在已挂载 ttq 时识别用户 */
export function ttqIdentify(
  userData: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return
  const ttq = window.ttq
  if (typeof ttq?.identify !== 'function') {
    return
  }

  ttq.identify(userData)
}
