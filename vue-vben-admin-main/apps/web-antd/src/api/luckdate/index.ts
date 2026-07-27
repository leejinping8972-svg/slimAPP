import type {
  AdminRecord,
  ConfigRecord,
  CouponRecord,
  ProductRecord,
} from '#/views/luckdate/_mock/types';

import {
  deleteCoupon as deleteCouponStore,
  getDashboardStats as getDashboardStatsStore,
  getOrderById as getOrderByIdStore,
  getProductById as getProductByIdStore,
  getUserById as getUserByIdStore,
  linkOrderToUser as linkOrderToUserStore,
  previewOrdersForLink as previewOrdersForLinkStore,
  queryAdmins as queryAdminsStore,
  queryConfigs as queryConfigsStore,
  queryCouponBatches as queryCouponBatchesStore,
  queryCoupons as queryCouponsStore,
  queryOrders as queryOrdersStore,
  queryProducts as queryProductsStore,
  queryUsers as queryUsersStore,
  saveCoupon as saveCouponStore,
  saveProduct as saveProductStore,
  updateConfig as updateConfigStore,
  updateUserRemark as updateUserRemarkStore,
  type QueryOrdersParams,
  type QueryProductsParams,
  type QueryUsersParams,
} from '#/views/luckdate/_mock/store';

export async function queryUsers(params?: QueryUsersParams) {
  return queryUsersStore(params);
}

export async function getUserById(id: string) {
  return getUserByIdStore(id);
}

export async function updateUserRemark(id: string, remark: string) {
  return updateUserRemarkStore(id, remark);
}

export async function linkOrderToUser(userId: string, orderId: string) {
  return linkOrderToUserStore(userId, orderId);
}

export async function queryOrders(params?: QueryOrdersParams) {
  return queryOrdersStore(params);
}

export async function getOrderById(id: string) {
  return getOrderByIdStore(id);
}

export async function queryProducts(params?: QueryProductsParams) {
  return queryProductsStore(params);
}

export async function getProductById(id: string) {
  return getProductByIdStore(id);
}

export async function saveProduct(product: ProductRecord) {
  return saveProductStore(product);
}

export async function queryCoupons() {
  return queryCouponsStore();
}

export async function saveCoupon(coupon: CouponRecord) {
  return saveCouponStore(coupon);
}

export async function deleteCoupon(id: string) {
  return deleteCouponStore(id);
}

export async function queryCouponBatches() {
  return queryCouponBatchesStore();
}

export async function queryConfigs() {
  return queryConfigsStore();
}

export async function updateConfig(code: string, value: string) {
  return updateConfigStore(code, value);
}

export async function queryAdmins() {
  return queryAdminsStore();
}

export async function getDashboardStats() {
  return getDashboardStatsStore();
}

export async function previewOrdersForLink(name: string, phoneLast4: string) {
  return previewOrdersForLinkStore(name, phoneLast4);
}

export type { AdminRecord, ConfigRecord, CouponRecord, ProductRecord };
