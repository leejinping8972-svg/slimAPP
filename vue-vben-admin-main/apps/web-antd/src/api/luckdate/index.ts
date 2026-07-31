import type {
  AdminRecord,
  ConfigRecord,
} from '#/views/luckdate/_mock/types';

import {
  bindExternalOrderToUser as bindExternalOrderToUserStore,
  getPlanDashboardStats as getPlanDashboardStatsStore,
  getUserById as getUserByIdStore,
  previewExternalOrders as previewExternalOrdersStore,
  queryAdmins as queryAdminsStore,
  queryCheckIns as queryCheckInsStore,
  queryConfigs as queryConfigsStore,
  queryPlans as queryPlansStore,
  queryRoles as queryRolesStore,
  queryUsers as queryUsersStore,
  setAdminEnabled as setAdminEnabledStore,
  updateConfig as updateConfigStore,
  updateUserRemark as updateUserRemarkStore,
  type QueryCheckInsParams,
  type QueryPlansParams,
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

export async function queryCheckIns(params?: QueryCheckInsParams) {
  return queryCheckInsStore(params);
}

export async function queryPlans(params?: QueryPlansParams) {
  return queryPlansStore(params);
}

export async function getPlanDashboardStats() {
  return getPlanDashboardStatsStore();
}

export async function previewExternalOrders(name: string, phoneLast4: string) {
  return previewExternalOrdersStore(name, phoneLast4);
}

export async function bindExternalOrderToUser(
  userId: string,
  externalOrderId: string,
) {
  return bindExternalOrderToUserStore(userId, externalOrderId);
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

export async function setAdminEnabled(id: string, enabled: boolean) {
  return setAdminEnabledStore(id, enabled);
}

export async function queryRoles() {
  return queryRolesStore();
}

export type { AdminRecord, ConfigRecord };
