/**
 * 商品模块类型 - 依据 api/goods-detail、api/goods-list 响应示例
 * 金额字段 line_price、sale_price 为 number（单位：分）
 */
export interface GoodsDetail {
  id: string;
  goods_sn: string;
  name: string;
  image: string;
  line_price: number;
  sale_price: number;
  rich_content: string;
  tag: string;
  rating: string;
  description: string;
  images: string[];
}

/** 列表项与详情结构相同 */
export type GoodsItem = GoodsDetail;
