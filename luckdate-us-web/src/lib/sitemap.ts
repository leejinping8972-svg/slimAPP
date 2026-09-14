/**
 * Sitemap 数据生成 - 供 app/sitemap.ts 使用
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.luckdate.com';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function getToken(): Promise<string> {
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const usertest = process.env.NEXT_PUBLIC_USERTEST || '';
    if (!apiBase) return '';

    const url = new URL('api/init', apiBase);
    if (usertest) url.searchParams.set('usertest', usertest);

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return '';
    const json = await res.json();
    return json?.token || '';
  } catch {
    return '';
  }
}

async function fetchProductIds(): Promise<string[]> {
  try {
    const token = await getToken();
    if (!token) return [];

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const usertest = process.env.NEXT_PUBLIC_USERTEST || '';
    const allIds: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = new URL('api/goods-list', apiBase);
      url.searchParams.set('page', String(page));
      if (usertest) url.searchParams.set('usertest', usertest);

      const res = await fetch(url.toString(), {
        headers: { Authorization: token },
        next: { revalidate: 300 },
      });
      if (!res.ok) break;

      const json = await res.json();
      const data = json?.list?.data;
      if (!Array.isArray(data)) break;

      const ids = data
        .map((item: { id?: string | number }) => String(item?.id ?? ''))
        .filter((id): id is string => id.length > 0);

      allIds.push(...ids);

      // 检查是否还有下一页
      const totalPages = json?.list?.total_pages || 1;
      hasMore = page < totalPages && data.length > 0;
      page++;
    }

    return allIds;
  } catch {
    return [];
  }
}

async function fetchArticleIds(): Promise<string[]> {
  try {
    const token = await getToken();
    if (!token) return [];

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const usertest = process.env.NEXT_PUBLIC_USERTEST || '';
    const allIds: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = new URL('api/article-list', apiBase);
      url.searchParams.set('is_index', '1');
      url.searchParams.set('page', String(page));
      if (usertest) url.searchParams.set('usertest', usertest);

      const res = await fetch(url.toString(), {
        headers: { Authorization: token },
        next: { revalidate: 300 },
      });
      if (!res.ok) break;

      const json = await res.json();
      const data = json?.list?.data;
      if (!Array.isArray(data)) break;

      const ids = data
        .map((item: { id?: string | number }) => String(item?.id ?? ''))
        .filter((id): id is string => id.length > 0);

      allIds.push(...ids);

      // 检查是否还有下一页
      const totalPages = json?.list?.total_pages || 1;
      hasMore = page < totalPages && data.length > 0;
      page++;
    }

    return allIds;
  } catch {
    return [];
  }
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const now = new Date();

  const staticPages: SitemapEntry[] = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/order-inquiry`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/track-order`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/shilajit_1`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/gummies_1`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/body_purification`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/disc_shilajit_1`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/shop/nutrition-28-day`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/shop/nutrition-7-day`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/shop/fruit-vegetable-powder`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/shop/gut-balance-probiotics`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    // { url: `${BASE_URL}/order/success`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    // { url: `${BASE_URL}/success`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
    // { url: `${BASE_URL}/cancel`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
  ];

  const [productIds, articleIds] = await Promise.all([fetchProductIds(), fetchArticleIds()]);

  const productPages: SitemapEntry[] = productIds.map((id) => ({
    url: `${BASE_URL}/product/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const articlePages: SitemapEntry[] = articleIds.map((id) => ({
    url: `${BASE_URL}/blog/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...articlePages];
}
