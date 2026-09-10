import { AGENTIC_DISCOVERY_URLS } from '@/lib/seo/metadata';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luckdate.com').replace(/\/$/, '');

export async function GET() {
  const now = new Date().toISOString();
  const urls = AGENTIC_DISCOVERY_URLS.map((url) => ({
    loc: url,
    lastmod: now,
    changefreq: 'weekly',
    priority: url === BASE_URL ? '1.0' : '0.8',
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
