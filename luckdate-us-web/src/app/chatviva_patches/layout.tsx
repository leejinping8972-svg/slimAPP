import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { buildLandingProductJsonLd } from '@/lib/seo/landing-schemas'

export const metadata: Metadata = {
  title: 'CHATVIVA NMN Micro-Point Patches | Executive Vitality System',
  description:
    'Clinical-grade Uthever NMN transdermal patches with Resveratrol, TMG and Apigenin. Free US shipping over $59. 60-day money-back guarantee.',
  alternates: { canonical: '/chatviva_patches' },
}

const productJsonLd = buildLandingProductJsonLd({
  path: '/chatviva_patches',
  name: 'CHATVIVA NMN Micro-Point Patches',
  description: 'Clinical-grade Uthever NMN transdermal patches for executive vitality support.',
  image: '/og-image.png',
})

export default function ChatvivaPatchesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      {children}
    </>
  )
}
