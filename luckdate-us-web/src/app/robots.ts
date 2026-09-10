import type { MetadataRoute } from 'next';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luckdate.com').replace(/\/$/, '');

const PRIVATE_PATHS = [
  '/login',
  '/profile',
  '/checkout',
  '/success',
  '/cancel',
  '/order/success',
];

/** AI training crawlers — allow search bots, restrict bulk training crawlers */
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      ...AI_TRAINING_BOTS.map((userAgent) => ({
        userAgent,
        disallow: '/',
      })),
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-agentic.xml`,
    ],
  };
}
