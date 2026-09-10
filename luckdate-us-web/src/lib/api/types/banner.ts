/**
 * 首页轮播图 - api/banner-list
 */
export interface BannerItem {
  id: number;
  name: string;
  image_h5: string;
  image_pc: string;
  jump_type: number;
  jump_type_text: string;
  jump_target_id: number;
  jump_url: string;
  jump_path: string;
  sort: number;
}
