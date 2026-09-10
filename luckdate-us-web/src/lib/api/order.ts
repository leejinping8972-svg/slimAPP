/**
 * 订单模块
 */

import { authRequest, publicRequest } from './request';
import type { ApiResponse } from './types';

interface TrackCheckpoint {
  status: string;
  time: string;
  location?: string;
  description?: string;
}

const NOT_IMPLEMENTED = '接口 URL 未填写，待后端补充';

/** 订单查询结果 - GET，URL 未填写 */
export function getOrderQueryResult(_params?: Record<string, unknown>) {
  return Promise.reject(new Error(`订单查询结果: ${NOT_IMPLEMENTED}`));
}

/** 购物车列表 - GET，URL 未填写 */
export function getCartList(_params?: Record<string, unknown>) {
  return Promise.reject(new Error(`购物车列表: ${NOT_IMPLEMENTED}`));
}

/** 确认订单 - GET，URL 未填写 */
export function confirmOrder(_params?: Record<string, unknown>) {
  return Promise.reject(new Error(`确认订单: ${NOT_IMPLEMENTED}`));
}

/** 下单 - GET，URL 未填写 */
export function createOrder(_params?: Record<string, unknown>) {
  return Promise.reject(new Error(`下单: ${NOT_IMPLEMENTED}`));
}

/** 下单返回 - 支持两种 Stripe 模式 */
export interface AddOrderResult {
  /** Hosted 模式：跳转 URL，优先使用 */
  url?: string;
  /** Embedded 模式：内嵌结账用 client_secret */
  client_secret?: string;
  order_id?: number;
  order_sn?: string;
  out_trade_no?: string;
}

/** 新增订单 - POST api/add-order。返回 url 时跳转 Hosted 结账页；返回 client_secret 时跳转全屏支付页 `/checkout/pay`（sessionStorage 传递 secret） */
export function addOrder(data: {
  goods: Array<{ id: number; quantity: number }>;
  source?: string;
  create_channel?: number;
  ad_source?: number;
  ad_extra?: {
    ttclid?: string;
    fbc?: string;
    fbp?: string;
  };
  /** 用户优惠券ID，用于下单时应用优惠券折扣 */
  user_coupon_id?: number;
}) {
  return authRequest.post<ApiResponse<AddOrderResult>>('api/add-order', data);
}

/** 落地页下单 - POST api/add-order-landing。无需登录，有登录态则自动绑定用户 */
export function addOrderLanding(data: {
  goods: Array<{ id: number; quantity: number }>;
  source?: string;
  create_channel?: number;
  ad_source?: number;
  ad_extra?: {
    ttclid?: string;
    fbc?: string;
    fbp?: string;
  };
  /** 用户优惠券ID，仅登录用户传值 */
  user_coupon_id?: number;
}) {
  return publicRequest.post<ApiResponse<AddOrderResult>>('api/add-order-landing', data);
}

/**
 * 用户订单列表接口
 * GET api/user/order-list?page=1&pageSize=10&status=1&usertest=2
 *
 * 使用 userOrderList 接口（新版），返回完整的 status + status_text 字段
 */
export interface OrderGoodsItem {
  goods_id: string | number;
  goods_sn: string;
  name: string;
  image: string;
  quantity: number;
  sale_price?: number;   // 单价（分）
  total_price?: number; // 小计（分）
}

export interface OrderItem {
  order_id: string | number;
  order_sn: string;
  // 订单号别名，与匿名查单 orderNo 对齐
  orderNo?: string;
  status: number;        // 数字类型：0=待支付, 1=已支付, etc.
  status_text: string;   // 状态文字："待付款"、"已发货" 等
  // 字符串态状态，与匿名查单 status 对齐（delivered/shipped/pending/cancelled/processing）
  status_str?: string;
  order_amount: number;  // 订单总金额（单位：分）
  goods_amount?: number; // 商品金额（单位：分）
  express_amount?: number; // 运费（单位：分）
  created_at: string | number; // 下单时间
  // 格式化时间字符串，与匿名查单 createTime 对齐
  createTime?: string;
  pay_at?: string | number;    // 支付时间
  shipments_at?: string | number; // 发货时间
  tracking_no?: string;       // 物流单号
  // 物流单号别名，与匿名查单 tracking_number 对齐
  tracking_number?: string;
  track_info?: TrackCheckpoint[] | string;
  goods: OrderGoodsItem[];
  // 续付相关字段 - 待支付订单续付功能
  can_continue_pay?: boolean;              // 是否可续付
  continue_pay_remaining_ms?: number;      // 距支付截止剩余毫秒数
  continue_pay_deadline_ms?: number;       // 支付截止毫秒时间戳
}

export interface OrderListResponse {
  data: OrderItem[];
  current_page: number; // 当前页码
  per_page: number;     // 每页数量
  last_page?: number;   // 总页数（Laravel 分页）
  total?: number;       // 总记录数
}

/**
 * 获取用户订单列表（使用新版 userOrderList 接口）
 * @param params 查询参数
 */
export function getUserOrders(params: {
  page?: number;
  pageSize?: number;
  status?: number;
}) {
  return authRequest.get<{
    status: boolean;
    error_msg: string;
    list: OrderListResponse;
    data: OrderItem[];
  }>('api/user/order-list', { params });
}

/**
 * 取消订单（仅待支付状态可取消）
 * POST api/cancel-order/{id}
 *
 * 后端逻辑：
 * 1. 校验订单存在且属于当前用户
 * 2. 校验订单状态为待支付（ORDER_STATUS_WAIT_PAY = 0）
 * 3. 标记订单为已取消（ORDER_STATUS_CANCEL = 5）
 * 4. 返还优惠券：
 *    - 若优惠券未过期 → 恢复为可用（AVAILABLE）
 *    - 若优惠券已过期 → 标记为已过期（EXPIRED）
 * 5. 回滚商品库存
 *
 * @param orderId 订单ID
 * @returns 取消成功返回 { status: true }
 */
export function cancelOrder(orderId: number | string) {
  return authRequest.post<ApiResponse<null>>(`api/cancel-order/${orderId}`);
}

/** 订单详情 - 商品信息 */
export interface OrderDetailGoods {
  id: string;
  goods_sn: string;
  sku: string;
  name: string;
  image: string;
  sale_price: number;    // 售价（分）
  line_price: number;    // 划线价（分）
  quantity: number;
  description: string;
  rich_content: string;
  tag: string;
  rating: number;
  total_price: number;   // 小计（分）
}

/** 订单详情 - 收货地址 */
export interface OrderDetailAddress {
  id: string;
  order_id: string;
  consignee: string;     // 收货人姓名
  country_code: string;  // 国家区号
  phone: string;         // 收货人电话
  email: string;         // 收货人邮箱
  country: string;       // 国家名称
  state: string;         // 州/省名称
  province: string;      // 省份
  city: string;          // 城市
  district: string;      // 区/县
  town: string;          // 镇/街道
  address: string;       // 详细地址
  postcode: string;      // 邮编
}

/** 订单详情 - 支付流水 */
export interface OrderDetailPayment {
  id: string;
  order_id: string;
  order_sn: string;
  out_trade_no: string;          // 外部支付平台订单号
  transaction_id: string;        // 第三方交易流水号
  total_fee: number;             // 支付金额（分）
  payment_channel: number;       // 支付渠道枚举值
  payment_channel_text: string;  // 支付渠道文案
  status: number;                // 支付状态枚举值
  failed_reason: string;         // 支付失败原因
  finished_at: number;           // 支付完成时间
  created_at: number;            // 创建时间
  updated_at: number;            // 更新时间
}

/** 订单详情 - 基础信息 */
export interface OrderDetailInfo {
  id: string;
  order_sn: string;
  status: number;
  status_text: string;
  create_channel: number;
  create_channel_text: string;
  order_amount: number;          // 订单总金额（分）
  goods_amount: number;          // 商品金额（分）
  express_amount: number;        // 运费金额（分）
  created_at: number;            // 创建时间
  pay_at: number;                // 支付时间
  shipments_at: number;          // 发货时间
  received_at: number;           // 收货时间
  finish_at: number;             // 完成时间
  cancel_at: number;             // 取消时间
  updated_at: number;            // 更新时间
  tracking_no: string;           // 物流单号
  logistics_status_text: string; // 物流状态文案
  outbound_order_no: string;     // 出库单号
}

/** 订单详情完整响应 */
export interface OrderDetailData {
  order: OrderDetailInfo;
  order_goods: OrderDetailGoods[];
  order_address: OrderDetailAddress | null;
  order_payments: OrderDetailPayment[];
  track_info: TrackCheckpoint[];
}

/**
 * 获取订单详情
 * GET api/order-detail/{id}
 *
 * 返回完整订单信息：基础信息、商品列表、收货地址、支付流水、物流轨迹
 *
 * @param orderId 订单ID
 */
export function getOrderDetail(orderId: number | string) {
  return authRequest.get<ApiResponse<OrderDetailData>>(`api/order-detail/${orderId}`);
}

/**
 * 待支付订单续付 - POST api/order-continue-pay/{id}
 *
 * 返回首单下单时创建的 Stripe Checkout Session，不新建 Session
 * 与 add-order 返回结构相同（url / client_secret / order_id / order_sn / out_trade_no）
 *
 * 业务规则：
 * 1. 仅订单所属当前登录用户可调用
 * 2. 订单 status 必须为 0（待付款）
 * 3. 当前时间须 < order.pay_deadline_at
 * 4. 首单 pending 的 order_payment 存在，且 Stripe Session 状态为 open
 *
 * @param orderId 订单ID
 */
export function continuePay(orderId: number | string) {
  return authRequest.post<ApiResponse<AddOrderResult>>(`api/order-continue-pay/${orderId}`);
}
