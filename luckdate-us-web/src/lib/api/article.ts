import { authRequest } from './request';
import type { ApiResponse, ListData, ArticleItem } from './types';

/** 文章详情 - GET api/article-detail/{id} */
export function getArticleDetail(id: string | number) {
  return authRequest.get<ApiResponse<ArticleItem>>(`api/article-detail/${id}`);
}

/** 文章列表 - GET api/article-list，首页可传 is_index=1 */
export function getArticleList(params?: { is_index?: string }) {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<ArticleItem> }
  >('api/article-list', { params });
}
