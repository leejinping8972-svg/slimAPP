import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/sitemap';
export const dynamic = 'force-dynamic'

/**
 * Next.js 内置 Sitemap API
 * @see https://nextjs.org/docs/15/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return entries.map((e) => ({
    url: e.url,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
