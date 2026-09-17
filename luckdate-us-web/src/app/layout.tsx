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

const SUPPORTED_LOCALES = ['en', 'zh', 'th', 'fr', 'de', 'es', 'pt', 'vi', 'id'] as const

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: 'LUCKDATE – Premium NAD+, NMN, Collagen & Longevity Supplements | Shop Now',
    template: '%s | LUCKDATE',
  },
  description: 'Discover LUCKDATE\'s science-backed premium supplements: NAD+ boosters, NMN anti-aging formulas, collagen peptides, probiotics, Shilajit gummies & omega-3 fish oil. Trusted by 1M+ customers worldwide. Free shipping on orders $50+. 30-day money-back guarantee.',
  keywords: ['LUCKDATE', 'NAD+ supplements', 'NMN anti-aging', 'collagen peptides', 'probiotics', 'Shilajit gummies', 'omega-3 fish oil', 'men\'s health supplements', 'women\'s wellness vitamins', 'premium supplements for longevity', 'cellular health', 'energy supplements', 'sleep support', 'immune system booster', 'natural detox'],
  authors: [{ name: 'LUCKDATE Wellness Team' }],
  creator: 'LUCKDATE',
  publisher: 'LUCKDATE',
  metadataBase: new URL('https://www.luckdate.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.luckdate.com',
    siteName: 'LUCKDATE',
    title: 'LUCKDATE – Premium NAD+, NMN, Collagen & Longevity Supplements',
    description: 'Shop premium, science-backed supplements trusted by 1M+ customers. NAD+, collagen, probiotics, Shilajit & more. Free shipping $50+. 30-day guarantee.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LUCKDATE - Premium Supplements for Longevity and Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@luckdate_official',
    title: 'LUCKDATE – Premium NAD+, NMN & Longevity Supplements',
    description: 'Science-backed supplements for cellular health, energy & longevity. Shop now with free shipping on $50+.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: icon.src, sizes: '32x32', type: 'image/png' }],
    apple: [{ url: appleIcon.src, sizes: '180x180', type: 'image/png' }],
  },
}

export default async function RootLayout({
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
