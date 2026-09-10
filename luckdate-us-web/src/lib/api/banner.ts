import { authRequest } from './request';
import type { ApiResponse, ListData } from './types';
import type { BannerItem } from './types/banner';

/** 首页轮播列表 - GET api/banner-list */
export function getBannerList() {
  return authRequest.get<
    ApiResponse<[]> & { list?: ListData<BannerItem> }
  >('api/banner-list');
}
