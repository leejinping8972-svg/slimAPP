import path from 'node:path'
import type { NextConfig } from 'next'

const isGithubPages = process.env.GITHUB_PAGES === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1] || 'slimAPP'
const basePath = isGithubPages ? `/${repoName}/us` : ''

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(isGithubPages
    ? {
        output: 'export' as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
      }
    : {}),
  ...(!isGithubPages
    ? {
        async redirects() {
          return [
            {
              source: '/microneedle_1',
              destination: '/chatviva_patches',
              permanent: true,
            },
            {
              source: '/microneedle',
              destination: '/chatviva_patches',
              permanent: true,
            },
            {
              source: '/:path*',
              has: [{ type: 'host', value: 'luckdate.com' }],
              destination: 'https://www.luckdate.com/:path*',
              permanent: true,
            },
          ]
        },
        async headers() {
          return [
            {
              source: '/sitemap.xml',
              headers: [{ key: 'Content-Type', value: 'application/xml; charset=utf-8' }],
            },
          ]
        },
      }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
}

export default nextConfig
