'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  FB_PIXEL_ID_BODY_PURIFICATION,
  FB_PIXEL_ID_GUMMIES,
  FB_PIXEL_ID_HOME,
  FB_PIXEL_ID_SHILAJIT,
} from '@/lib/meta-pixel'
import { ORDER_AD_SOURCE, resolveAdSourceByQuerySource } from '@/lib/order-tracking'

const TRACK_PATHS = new Set(['/', '/shilajit_1', '/disc_shilajit_1', '/gummies_1', '/body_purification'])

function pixelIdForPath(pathname: string): string {
  if (pathname === '/shilajit_1' || pathname === '/disc_shilajit_1') return FB_PIXEL_ID_SHILAJIT
  if (pathname === '/gummies_1') return FB_PIXEL_ID_GUMMIES
  if (pathname === '/body_purification') return FB_PIXEL_ID_BODY_PURIFICATION
  if (pathname === '/') return FB_PIXEL_ID_HOME
  return ''
}

function shouldTrackMeta(pathname: string, sourceQuery: string | null): boolean {
  if (!TRACK_PATHS.has(pathname)) return false
  const pixelId = pixelIdForPath(pathname)
  if (!pixelId) return false
  if (pathname === '/shilajit_1' || pathname === '/disc_shilajit_1' || pathname === '/body_purification') {
    return resolveAdSourceByQuerySource(sourceQuery) === ORDER_AD_SOURCE.fb
  }
  return true
}

export function MetaPixel() {
  const pathname = usePathname() ?? ''
  const searchParams = useSearchParams()
  const sourceQuery = searchParams.get('source')
  const pixelNow = pixelIdForPath(pathname)
  const trackHere = shouldTrackMeta(pathname, sourceQuery) && pixelNow.length > 0
  const prevPathRef = useRef<string | null>(null)
  const initedPixelsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!trackHere) {
      prevPathRef.current = pathname
      return
    }

    const pixel = pixelNow
    const prev = prevPathRef.current

    if (prev === null) {
      prevPathRef.current = pathname
      initedPixelsRef.current.add(pixel)
      return
    }

    if (prev === pathname) {
      return
    }

    if (typeof window.fbq === 'function') {
      if (!initedPixelsRef.current.has(pixel)) {
        window.fbq('init', pixel)
        initedPixelsRef.current.add(pixel)
      }
      window.fbq('trackSingle', pixel, 'PageView')
    }

    prevPathRef.current = pathname
  }, [pathname, trackHere, pixelNow, sourceQuery])

  if (!trackHere) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelNow}');
fbq('trackSingle', '${pixelNow}', 'PageView');
`,
        }}
      />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelNow}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
