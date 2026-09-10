import type { GoodsItem, ArticleItem } from './types';
import type { Product } from '@/sections/Products';

/** 校验商品数据的有效性，过滤空标题、$0 价格等无效商品 */
export function isValidProduct(product: Product): boolean {
  return !!product.name?.trim() && product.price > 0;
}

/** 商品 API 字段 -> 页面 Product 格式，金额分转美元 */
export function mapGoodsToProduct(goods: GoodsItem): Product {
  return {
    id: Number(goods.id),
    name: goods.name,
    description: goods.description,
    fullDescription: goods.rich_content,
    price: goods.sale_price / 100,
    marketPrice: goods.line_price / 100,
    rating: parseFloat(goods.rating) || 0,
    reviews: 0,
    image: goods.image,
    images: goods.images || [],
    badge: goods.tag?.split(',')[0]?.trim() || undefined,
    benefits: [],
    ingredients: [],
    dosage: '',
  };
}

/** 文章 API 字段 -> 列表/详情通用格式 */
export interface ArticleDisplay {
  id: number;
  title: string;
  coverImage: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  content_char_length: number;
}

export function mapArticleToDisplay(article: ArticleItem): ArticleDisplay {
  const plain = (article.content_html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    id: article.id,
    title: article.title,
    coverImage: article.cover_image,
    content: article.content_html,
    excerpt: plain.slice(0, 150) + (plain.length > 150 ? '...' : ''),
    author: '',
    date: '',
    content_char_length: plain.length,
    category: '',
  };
}
