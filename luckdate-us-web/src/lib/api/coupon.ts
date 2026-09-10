import { authRequest } from './request';
import type { ApiResponse } from './types/common';

/**
 * 弹窗优惠券信息
 * GET /api/popup-coupon 返回数据
 */
export interface PopupCouponData {
  /** 券模板 ID */
  coupon_id: number;
  /** 券名称 */
  name: string;
  /** 券类型枚举值 (1=满减, 2=折扣, 3=无门槛) */
  coupon_type: number;
  /** 券类型文案 */
  coupon_type_text: string;
  /** 使用规则文本（如「满 500 减 50」「8.5 折，最高减 200」「无门槛减 30」） */
  rule_text: string;
  /** 满减门槛金额（分） */
  threshold_amount: number;
  /** 满减金额（分） */
  reduce_amount: number;
  /** 折扣值（如 8.5 表示 8.5 折） */
  discount_rate: number;
  /** 折扣最大优惠金额（分） */
  discount_max_amount: number;
  /** 无门槛面额（分） */
  no_threshold_amount: number;
  /** 有效期类型枚举值 (1=固定日期, 2=相对天数) */
  valid_type: number;
  /** 有效期类型文案 */
  valid_type_text: string;
  /** 固定有效期开始时间（秒级时间戳） */
  valid_start_at: number;
  /** 固定有效期结束时间（秒级时间戳） */
  valid_end_at: number;
  /** 领取后有效天数 */
  valid_days: number;
  /** 商品范围枚举值 (1=全场, 2=指定商品, 3=含指定商品) */
  scope_type: number;
  /** 商品范围文案 */
  scope_type_text: string;
  /** 当前用户是否已领取 */
  claimed: boolean;
  /** 当前用户是否可领取 */
  can_claim: boolean;
}

/**
 * 领取优惠券结果
 * POST /api/user/claim-coupon 返回数据
 */
export interface ClaimCouponData {
  /** 用户券 ID */
  user_coupon_id: number;
  /** 券模板 ID */
  coupon_id: number;
  /** 券名称 */
  coupon_name: string;
}

/**
 * 弹窗优惠券领取状态
 * GET /api/user/coupon-claim-status 返回数据
 */
export interface CouponClaimStatusData {
  /** 是否已领取 */
  claimed: boolean;
  /** 已领取的券模板 ID（未领取时为 null） */
  coupon_id: number | null;
}

/**
 * 用户优惠券列表项
 * GET /api/user/coupons 返回数据项
 */
export interface UserCouponData {
  /** 用户券 ID */
  id: string;
  /** 券模板 ID */
  coupon_id: string;
  /** 券名称 */
  name: string;
  /** 券状态枚举值 */
  status: number;
  /** 券状态文案 */
  status_text: string;
  /** 券类型枚举值 */
  coupon_type: number;
  /** 券类型文案 */
  coupon_type_text: string;
  /** 使用规则文本 */
  rule_text: string;
  /** 满减门槛金额（分） */
  threshold_amount: number;
  /** 满减金额（分） */
  reduce_amount: number;
  /** 折扣值 */
  discount_rate: number;
  /** 折扣最大优惠金额（分） */
  discount_max_amount: number;
  /** 无门槛面额（分） */
  no_threshold_amount: number;
  /** 有效期类型枚举值 */
  valid_type: number;
  /** 有效期类型文案 */
  valid_type_text: string;
  /** 有效期文案 */
  validity_text: string;
  /** 固定有效期开始时间（秒级时间戳） */
  valid_start_at: number;
  /** 固定有效期结束时间（秒级时间戳） */
  valid_end_at: number;
  /** 领取后有效天数 */
  valid_days: number;
  /** 商品范围枚举值 */
  scope_type: number;
  /** 商品范围文案 */
  scope_type_text: string;
  /** 适用商品 ID 列表 */
  scope_goods_ids: number[];
  /** 获取渠道枚举值 */
  receive_channel: number;
  /** 获取渠道文案 */
  receive_channel_text: string;
  /** 领取时间（秒级时间戳） */
  created_at: number;
}

/**
 * 购物车商品项（用于优惠券评估）
 */
export interface CartItem {
  /** 商品 ID */
  goods_id: number;
  /** 数量 */
  quantity: number;
  /** 售价（分） */
  sale_price: number;
}

/**
 * 可用优惠券评估结果
 */
export interface AvailableCoupon {
  /** 用户券 ID */
  user_coupon_id: number;
  /** 券模板 ID */
  coupon_id: number;
  /** 券名称 */
  name: string;
  /** 券类型枚举值 */
  coupon_type: number;
  /** 券类型文案 */
  coupon_type_text: string;
  /** 使用规则文本 */
  rule_text: string;
  /** 满减门槛金额（分） */
  threshold_amount: number;
  /** 满减金额（分） */
  reduce_amount: number;
  /** 折扣值 */
  discount_rate: number;
  /** 折扣最大优惠金额（分） */
  discount_max_amount: number;
  /** 无门槛面额（分） */
  no_threshold_amount: number;
  /** 商品范围文案 */
  scope_type_text: string;
  /** 计算出的折扣金额（分） */
  discount_amount: number;
}

/**
 * 不可用优惠券评估结果
 */
export interface UnavailableCoupon {
  /** 用户券 ID */
  user_coupon_id: number;
  /** 券模板 ID */
  coupon_id: number;
  /** 券名称 */
  name: string;
  /** 券类型枚举值 */
  coupon_type: number;
  /** 券类型文案 */
  coupon_type_text: string;
  /** 使用规则文本 */
  rule_text: string;
  /** 商品范围文案 */
  scope_type_text: string;
  /** 不可用原因 */
  unavailable_reason: string;
}

/**
 * 购物车优惠券评估结果
 */
export interface CouponEvaluationData {
  /** 可用优惠券列表（按折扣金额降序） */
  available: AvailableCoupon[];
  /** 不可用优惠券列表 */
  unavailable: UnavailableCoupon[];
}

/**
 * 获取弹窗优惠券信息（无需登录）
 * GET /api/popup-coupon
 *
 * @returns 弹窗优惠券信息，不可用时返回 null
 */
export function getPopupCoupon() {
  return authRequest.get<ApiResponse<PopupCouponData | null>>('api/popup-coupon');
}

/**
 * 领取弹窗优惠券（需要登录）
 * POST /api/user/claim-coupon
 *
 * @returns 领取结果，包含 user_coupon_id、coupon_id、coupon_name
 */
export function claimCoupon() {
  return authRequest.post<ApiResponse<ClaimCouponData>>('api/user/claim-coupon');
}

/**
 * 通过邮箱领取弹窗优惠券（自动注册/登录）
 * POST /api/popup-coupon-claim
 *
 * 一站式接口：未注册用户自动创建+登录，已注册用户直接登录，然后领取优惠券
 *
 * @param body { email: string }
 * @returns 包含 JWT token、用户信息、领取结果
 */
export interface PopupCouponClaimWithEmailData {
  /** JWT Token */
  token: string;
  /** 用户ID */
  id: string;
  /** 邮箱 */
  email: string;
  /** 姓名 */
  name: string;
  /** 头像路径 */
  avatar: string;
  /** 注册时间（毫秒时间戳） */
  created_at: number;
  /** 是否本次领取成功 */
  claimed: boolean;
  /** 用户券ID（已领取过则为0） */
  user_coupon_id: number;
  /** 券模板ID（已领取过则为0） */
  coupon_id: number;
  /** 券名称（已领取过则为空） */
  coupon_name: string;
}

export function popupCouponClaimWithEmail(body: { email: string }) {
  return authRequest.post<ApiResponse<PopupCouponClaimWithEmailData>>('api/popup-coupon-claim', body);
}

/**
 * 检查弹窗优惠券领取状态（需要登录）
 * GET /api/user/coupon-claim-status
 *
 * @returns 领取状态，包含 claimed 和 coupon_id
 */
export function getCouponClaimStatus() {
  return authRequest.get<ApiResponse<CouponClaimStatusData>>('api/user/coupon-claim-status');
}

/**
 * 获取用户优惠券列表（需要登录）
 * GET /api/user/coupons
 *
 * @param params 查询参数
 * @param params.page 页码（可选，默认1）
 * @param params.pageSize 每页数量（可选，默认10）
 * @param params.status 状态筛选（可选）：1=未激活, 2=可用, 3=已使用, 4=已过期
 *
 * @returns 分页响应格式：{ status, list: { data: UserCouponData[], current_page, per_page, total_pages, total }, data: [] }
 */
export function getUserCoupons(params?: { page?: number; pageSize?: number; status?: number }) {
  return authRequest.get<ApiResponse<{
    data: UserCouponData[];
    current_page: number;
    per_page: number;
    total_pages: number;
    total: number;
  }>>('api/user/coupons', { params });
}

/**
 * 购物车可用优惠券评估（需要登录）
 * POST /api/user/coupons-available
 *
 * @param items 购物车商品列表
 * @returns 评估结果，包含可用和不可用的优惠券列表
 */
export function evaluateCouponsForCart(items: CartItem[]) {
  return authRequest.post<ApiResponse<CouponEvaluationData>>('api/user/coupons-available', { items });
}

// ==================== 落地页专用优惠券接口 ====================

export interface LandingCouponApiConfig {
  getPopupCoupon: () => Promise<any>;
  claimCoupon: () => Promise<any>;
  claimWithEmail: (body: { email: string }) => Promise<any>;
  getClaimStatus: () => Promise<any>;
  storageKeyPrefix: string;
}

/** Body Purification (叶绿素) 落地页 API 配置 */
export const BODY_PURIFICATION_COUPON_API: LandingCouponApiConfig = {
  getPopupCoupon: () => authRequest.get<ApiResponse<PopupCouponData | null>>('api/popup-coupon-body-purification'),
  claimCoupon: () => authRequest.post<ApiResponse<ClaimCouponData>>('api/user/claim-body-purification-coupon'),
  claimWithEmail: (body) => authRequest.post<ApiResponse<PopupCouponClaimWithEmailData>>('api/popup-coupon-body-purification-claim', body),
  getClaimStatus: () => authRequest.get<ApiResponse<CouponClaimStatusData>>('api/user/body-purification-coupon-claim-status'),
  storageKeyPrefix: 'bp_coupon',
};

/** Shilajit (喜来芝) 落地页 API 配置 */
export const SHILAJIT_COUPON_API: LandingCouponApiConfig = {
  getPopupCoupon: () => authRequest.get<ApiResponse<PopupCouponData | null>>('api/popup-coupon-shilajit'),
  claimCoupon: () => authRequest.post<ApiResponse<ClaimCouponData>>('api/user/claim-shilajit-coupon'),
  claimWithEmail: (body) => authRequest.post<ApiResponse<PopupCouponClaimWithEmailData>>('api/popup-coupon-shilajit-claim', body),
  getClaimStatus: () => authRequest.get<ApiResponse<CouponClaimStatusData>>('api/user/shilajit-coupon-claim-status'),
  storageKeyPrefix: 'shilajit_coupon',
};

/** Chatviva Patches (微针) 落地页 API 配置 */
export const CHATVIVA_PATCHES_COUPON_API: LandingCouponApiConfig = {
  getPopupCoupon: () => authRequest.get<ApiResponse<PopupCouponData | null>>('api/popup-coupon-chatviva-patches'),
  claimCoupon: () => authRequest.post<ApiResponse<ClaimCouponData>>('api/user/claim-chatviva-patches-coupon'),
  claimWithEmail: (body) => authRequest.post<ApiResponse<PopupCouponClaimWithEmailData>>('api/popup-coupon-chatviva-patches-claim', body),
  getClaimStatus: () => authRequest.get<ApiResponse<CouponClaimStatusData>>('api/user/chatviva-patches-coupon-claim-status'),
  storageKeyPrefix: 'chatviva_patches_coupon',
};

/** Global (通用) 优惠券 API 配置 */
export const GLOBAL_COUPON_API: LandingCouponApiConfig = {
  getPopupCoupon,
  claimCoupon,
  claimWithEmail: popupCouponClaimWithEmail,
  getClaimStatus: getCouponClaimStatus,
  storageKeyPrefix: 'global_coupon',
};
