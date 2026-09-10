'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { ORDER_AD_SOURCE, resolveAdSourceByQuerySource } from '@/lib/order-tracking'
import {
  TIKTOK_PIXEL_ID_HOME,
  TIKTOK_PIXEL_ID_SHILAJIT,
  TIKTOK_PIXEL_ID_GUMMIES,
  TIKTOK_PIXEL_ID_BODY_PURIFICATION,
} from '@/lib/meta-pixel'

const TRACK_PATHS = new Set(['/', '/shilajit_1', '/disc_shilajit_1', '/gummies_1', '/body_purification'])

function pixelIdForPath(pathname: string): string {
  if (pathname === '/shilajit_1' || pathname === '/disc_shilajit_1') return TIKTOK_PIXEL_ID_SHILAJIT
  if (pathname === '/gummies_1') return TIKTOK_PIXEL_ID_GUMMIES
  if (pathname === '/body_purification') return TIKTOK_PIXEL_ID_BODY_PURIFICATION
  if (pathname === '/') return TIKTOK_PIXEL_ID_HOME
  return ''
}

function shouldTrackTikTok(pathname: string, sourceQuery: string | null): boolean {
  if (!TRACK_PATHS.has(pathname)) return false
  if (pathname === '/shilajit_1' || pathname === '/disc_shilajit_1' || pathname === '/body_purification') {
    return resolveAdSourceByQuerySource(sourceQuery) === ORDER_AD_SOURCE.tk
  }
  return true
}

declare global {
  interface Window {
    ttq?: { page?: () => void; track?: (...args: unknown[]) => void; identify?: (...args: unknown[]) => void }
    tiktokClickId?: string
  }
}

/** 从URL中获取TikTok点击ID (ttclid) */
export function getTikTokClickId(): string | null {
  if (typeof window === 'undefined') return null
  if (window.tiktokClickId) return window.tiktokClickId
  
  const urlParams = new URLSearchParams(window.location.search)
  const ttclid = urlParams.get('ttclid')
  
  if (ttclid) {
    window.tiktokClickId = ttclid
  }
  
  return ttclid
}

export function TikTokPixel() {
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()
  const sourceQuery = searchParams.get('source')
  const trackHere = shouldTrackTikTok(pathname, sourceQuery)
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => { 
    if (!trackHere) {
      prevPathRef.current = pathname
      return
    }

    // 获取并存储ttclid
    getTikTokClickId()

    const prev = prevPathRef.current

    if (prev === null) {
      prevPathRef.current = pathname
      return
    }

    if (prev === pathname) {
      return
    }

    if (typeof window.ttq?.page === 'function') {
      window.ttq.page()
    }

    prevPathRef.current = pathname
  }, [pathname, trackHere, sourceQuery])

  const pixelNow = pixelIdForPath(pathname)

  if (!pixelNow || !trackHere) {
    return null
  }

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${pixelNow}');
  ttq.page();
}(window, document, 'ttq');

// 存储ttclid
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  const ttclid = urlParams.get('ttclid');
  if (ttclid) {
    window.tiktokClickId = ttclid;
  }
}
`,
      }}
    />
  )
}
