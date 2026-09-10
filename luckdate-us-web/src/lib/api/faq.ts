import { publicRequest } from './request';
import type { ApiResponse, ListData, FaqItem } from './types';

/** 常见问题列表 - GET api/faq-list，无需 Authorization */
export function getFaqList(params?: Record<string, unknown>) {
  return publicRequest.get<
    ApiResponse<[]> & { list?: ListData<FaqItem> }
  >('api/faq-list', { params });
}
