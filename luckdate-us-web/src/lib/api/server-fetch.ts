/**
 * 服务端数据获取 - 用于 SSR/SSG，确保 JSON-LD 等 SEO 内容在首次 HTML 中即包含接口数据
 * 使用 fetch 避免 axios 的 localStorage 依赖
 */

import type { GoodsItem, ArticleItem, FaqItem, BannerItem } from './types';
import type { Product } from '@/sections/Products';
import type { ArticleDisplay } from './mappers';
import { mapGoodsToProduct, mapArticleToDisplay, isValidProduct } from './mappers';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
const USERTEST = process.env.NEXT_PUBLIC_USERTEST || '';

function buildUrl(path: string): string {
  const base = API_BASE_URL || 'http://localhost';
  const url = path.startsWith('http') ? path : `${base}/${path.replace(/^\//, '')}`;
  const parsed = new URL(url);
  if (USERTEST) parsed.searchParams.set('usertest', USERTEST);
  return parsed.toString();
}

async function fetchWithToken<T>(path: string, token: string): Promise<T> {
  const res = await fetch(buildUrl(path), {
    headers: { Authorization: token },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

async function fetchPublic<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

export interface HomePageData {
  products: Product[];
  articles: ArticleDisplay[];
  faqs: FaqItem[];
  banners: BannerItem[];
}

export interface BlogPaginationData {
    articles: ArticleDisplay[];
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
}

async function fetchArticleListServer(token: string, isIndex?: string, page: number = 1): Promise<{ data: ArticleItem[]; pagination: { current_page: number; per_page: number; total_pages: number; total: number } }> {
    const query = new URLSearchParams();
    if (isIndex) {
        query.set('is_index', isIndex);
    }
    query.set('page', String(page));

    const path = query.toString() ? `api/article-list?${query.toString()}` : `api/article-list?page=${page}`;
    const articleRes = await fetchWithToken<{ status?: boolean; list?: { data?: ArticleItem[]; current_page?: number; per_page?: number; total_pages?: number; total?: number } }>(path, token);

    if (articleRes?.status && articleRes?.list?.data) {
        return {
            data: articleRes.list.data as ArticleItem[],
            pagination: {
                current_page: articleRes.list.current_page || page,
                per_page: articleRes.list.per_page || 15,
                total_pages: articleRes.list.total_pages || 1,
                total: articleRes.list.total || 0,
            },
        };
    }

    return { data: [], pagination: { current_page: 1, per_page: 15, total_pages: 1, total: 0 } };
}

/** 服务端获取首页所需数据（商品、文章、FAQ） */
export async function fetchHomePageData(): Promise<HomePageData> {
  if (!API_BASE_URL) {
    return { products: [], articles: [], faqs: [], banners: [] };
  }

  let token = '';
  try {
    const initRes = await fetchPublic<{ token?: string }>('api/init');
    token = initRes?.token || '';
  } catch {
    return { products: [], articles: [], faqs: [], banners: [] };
  }

  if (!token) {
    return { products: [], articles: [], faqs: [], banners: [] };
  }

    const [goodsRes, articleRes, faqRes, bannerRes] = await Promise.allSettled([
        fetchWithToken<{ status?: boolean; list?: { data?: GoodsItem[] } }>('api/goods-list', token),
        fetchArticleListServer(token, '1'),
        fetchWithToken<{ status?: boolean; list?: { data?: FaqItem[] } }>('api/faq-list', token),
        fetchWithToken<{ status?: boolean; list?: { data?: BannerItem[] } }>('api/banner-list', token),
    ]);

    const products: Product[] =
        goodsRes.status === 'fulfilled' && goodsRes.value?.status && goodsRes.value?.list?.data
            ? (goodsRes.value.list.data as GoodsItem[]).map(mapGoodsToProduct).filter(isValidProduct)
            : [];

    const articles: ArticleDisplay[] =
        articleRes.status === 'fulfilled'
            ? (articleRes.value as { data: ArticleItem[]; pagination: any }).data.slice(0, 3).map(mapArticleToDisplay)
            : [];

    const faqs: FaqItem[] =
        faqRes.status === 'fulfilled' && faqRes.value?.status && faqRes.value?.list?.data
            ? faqRes.value.list.data
            : [];

    const banners: BannerItem[] =
        bannerRes.status === 'fulfilled' && bannerRes.value?.status && bannerRes.value?.list?.data
            ? bannerRes.value.list.data
            : [];

  return { products, articles, faqs, banners };
}

/** 服务端获取 blog 列表数据（支持分页） */
export async function fetchBlogPageArticles(page: number = 1): Promise<BlogPaginationData> {
    if (!API_BASE_URL) return { articles: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };

    let token = '';
    try {
        const initRes = await fetchPublic<{ token?: string }>('api/init');
        token = initRes?.token || '';
    } catch {
        return { articles: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };
    }

    if (!token) return { articles: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };

    try {
        const result = await fetchArticleListServer(token, undefined, page);
        return {
            articles: result.data.map(mapArticleToDisplay),
            currentPage: result.pagination.current_page,
            totalPages: result.pagination.total_pages,
            total: result.pagination.total,
            perPage: result.pagination.per_page,
        };
    } catch {
        return { articles: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };
    }
}

/** 服务端获取单篇文章详情（用于 /blog/[id] SSR） */
export async function fetchArticleServer(id: string): Promise<ArticleDisplay | null> {
  if (!API_BASE_URL) return null;

  let token = '';
  try {
    const initRes = await fetchPublic<{ token?: string }>('api/init');
    token = initRes?.token || '';
  } catch {
    return null;
  }
  if (!token) return null;

  try {
    const res = await fetchWithToken<ApiResponse<ArticleItem>>(`api/article-detail/${id}`, token);
    if (res?.status && res?.data) {
      return mapArticleToDisplay(res.data);
    }
    return null;
  } catch {
    return null;
  }
}

/** 服务端获取单个商品详情（用于 /product/[id] SSR + generateMetadata） */
export async function fetchProductServer(id: string): Promise<Product | null> {
  if (!API_BASE_URL) return null;

  let token = '';
  try {
    const initRes = await fetchPublic<{ token?: string }>('api/init');
    token = initRes?.token || '';
  } catch {
    return null;
  }
  if (!token) return null;

  try {
    const res = await fetchWithToken<ApiResponse<GoodsItem>>(`api/goods-detail/${id}`, token);
    if (res?.status && res?.data) {
      const product = mapGoodsToProduct(res.data);
      if (isValidProduct(product)) return product;
    }
    return null;
  } catch {
    return null;
  }
}

export interface ProductsPaginationData {
    products: Product[];
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
}

/** 服务端获取产品列表数据（支持分页） */
export async function fetchProductsPage(page: number = 1): Promise<ProductsPaginationData> {
    if (!API_BASE_URL) return { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };

    let token = '';
    try {
        const initRes = await fetchPublic<{ token?: string }>('api/init');
        token = initRes?.token || '';
    } catch {
        return { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };
    }

    if (!token) return { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };

    try {
        const query = new URLSearchParams();
        query.set('page', String(page));
        const path = `api/goods-list?${query.toString()}`;

        const res = await fetchWithToken<{
            status?: boolean;
            list?: {
                data?: GoodsItem[];
                current_page?: number;
                per_page?: number;
                total_pages?: number;
                total?: number;
            };
        }>(path, token);

        if (res?.status && res?.list?.data) {
            return {
                products: res.list.data.map(mapGoodsToProduct).filter(isValidProduct),
                currentPage: res.list.current_page || page,
                totalPages: res.list.total_pages || 1,
                total: res.list.total || 0,
                perPage: res.list.per_page || 15,
            };
        }

        return { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };
    } catch {
        return { products: [], currentPage: 1, totalPages: 1, total: 0, perPage: 15 };
    }
}

interface ApiResponse<T> { status?: boolean; data?: T }
