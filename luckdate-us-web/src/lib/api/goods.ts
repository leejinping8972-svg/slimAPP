import { authRequest } from './request';
import type { ApiResponse, ListData, GoodsItem } from './types';

/** 商品详情 - GET api/goods-detail/{id} */
export function getGoodsDetail(id: string | number) {
  return authRequest.get<ApiResponse<GoodsItem>>(`api/goods-detail/${id}`);
}

/** 商品列表 - GET api/goods-list */
export function getGoodsList(params?: Record<string, unknown>) {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list', { params });
}

/** Gummies 落地页商品列表 - GET api/goods-list-gummies */
export function getGoodsListGummies() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-gummies');
}

/** Shilajit 落地页商品列表 - GET api/goods-list-shilajit */
export function getGoodsListShilajit() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-shilajit');
}

/** Disc Shilajit 落地页商品列表 - GET api/goods-list-disc-shilajit */
export function getGoodsListDiscShilajit() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-disc-shilajit');
}

/** 富文本详情 - GET api/rich-text-detail-by-code */
export function getRichTextDetailByCode(code: string) {
  return authRequest.get<
    ApiResponse<{ content: string; title?: string; code: string }>
  >('api/rich-text-detail-by-code', { params: { code } });
}
/** Body Purification 落地页商品列表 - GET api/goods-list-body-purification */
export function getGoodsListBodyPurification() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-body-purification');
}

/** 微针落地页商品列表 - GET api/goods-list-chatviva-patches */
export function getGoodsListChatvivaPatches() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-chatviva-patches');
}

/** Luckdate Slim 落地页商品列表 - GET api/goods-list-slim */
export function getGoodsListSlim() {
  return authRequest.get<
    ApiResponse<[]> & { list: ListData<GoodsItem> }
  >('api/goods-list-slim');
}
