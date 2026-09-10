/**
 * 文章模块类型 - 依据 api/article-detail、api/article-list 响应示例
 */
export interface ArticleDetail {
  id: number;
  cover_image: string;
  title: string;
  content_html: string;
}

/** 列表项与详情结构相同 */
export type ArticleItem = ArticleDetail;
