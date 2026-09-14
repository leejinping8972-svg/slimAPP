import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { Providers } from '@/components/providers'
import { MetaPixel } from '@/components/MetaPixel'
import { TikTokPixel } from '@/components/TikTokPixel'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { GoogleTagManager } from '@/components/GoogleTagManager'
import JsonLd from '@/components/JsonLd'
import { SilentConsole } from '@/components/SilentConsole'
import { buildWebSiteSchema, buildOrganizationSchema, SITE_NAME } from '@/lib/seo/home-schemas'
import icon from '@/assets/icon.png'
import appleIcon from '@/assets/apple-icon.png'

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: 'luckdate – Daily Nutrition & Gut Wellness Rituals',
    template: '%s | luckdate',
  },
  description:
    'Science-backed daily wellness from luckdate — nutrition rituals, gut management, app tracking, and guidance you can keep.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://leejinping8972-svg.github.io/slimAPP/us',
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'luckdate',
    title: 'luckdate – Daily Nutrition & Gut Wellness Rituals',
    description:
      'Science-backed daily wellness — nutrition rituals, gut management, and routines you can keep.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'luckdate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'luckdate – Daily Nutrition & Gut Wellness Rituals',
    description: 'Science-backed daily wellness rituals you can keep.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: icon.src, sizes: '32x32', type: 'image/png' }],
    apple: [{ url: appleIcon.src, sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = 'en'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <JsonLd data={buildWebSiteSchema()} />
        <JsonLd data={buildOrganizationSchema()} />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <meta property="og:site_name" content={SITE_NAME} />
      </head>
      <body suppressHydrationWarning>
        <SilentConsole />
        <Providers initialLocale={locale}>
          <GoogleAnalytics />
          <Suspense fallback={null}>
            <MetaPixel />
            <TikTokPixel />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  )
}
