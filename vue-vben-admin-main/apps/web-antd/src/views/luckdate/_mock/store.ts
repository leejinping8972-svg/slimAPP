import type {
  AdminRecord,
  BindStatus,
  CheckInRecord,
  ConfigRecord,
  ExternalOrderRecord,
  PlanRecord,
  PlanStatus,
  RoleRecord,
  UserRecord,
} from './types';

export type { BindStatus, PlanStatus };

export const PLAN_STATUS_LABEL: Record<PlanStatus, string> = {
  active: '进行中',
  completed: '已完成',
  awaiting: '待收货',
};

export const BIND_STATUS_LABEL: Record<BindStatus, string> = {
  bound: '已绑定',
  unbound: '未绑定',
};

const roles: RoleRecord[] = [
  {
    id: 'r1',
    name: '超级管理员',
    description: '全部模块读写',
    permissions: ['全部'],
  },
  {
    id: 'r2',
    name: '运营',
    description: '用户、打卡、方案、基础设置',
    permissions: ['用户管理', '打卡记录', '方案列表', '基础设置'],
  },
  {
    id: 'r3',
    name: '客服',
    description: '用户查看与协助外部查单绑定',
    permissions: ['用户管理', '打卡记录', '方案列表（只读）'],
  },
];

const admins: AdminRecord[] = [
  { id: 'a1', username: 'superadmin', roleId: 'r1', enabled: true },
  { id: 'a2', username: 'ops', roleId: 'r2', enabled: true },
  { id: 'a3', username: 'cs', roleId: 'r3', enabled: true },
];

const users: UserRecord[] = [
  {
    id: 'u1001',
    nickname: 'Freya',
    email: 'freya@example.com',
    phone: '13812345678',
    region: 'CDMX',
    heightCm: 165,
    weightKg: 58,
    accountStatus: 'active',
    registeredAt: '2026-07-20T08:00:00.000Z',
    reminderTime: '21:00',
    bindStatus: 'bound',
    linkedProductId: 'solar_protein',
    linkedProductName: 'Solar Protein™ 28天装',
    linkedOrderNo: 'EXT-20260720-001',
    planDay: 12,
    planId: 'pl1',
  },
  {
    id: 'u1002',
    nickname: 'Maya',
    email: '',
    phone: '5512345678',
    region: 'Jalisco',
    accountStatus: 'active',
    registeredAt: '2026-07-22T10:30:00.000Z',
    reminderTime: '20:30',
    bindStatus: 'unbound',
    linkedProductId: null,
    linkedProductName: null,
    linkedOrderNo: null,
    planDay: null,
    planId: null,
  },
  {
    id: 'u1003',
    nickname: 'Leo',
    email: 'leo@example.com',
    phone: '5598765432',
    region: 'Nuevo León',
    heightCm: 178,
    weightKg: 82,
    accountStatus: 'disabled',
    registeredAt: '2026-07-18T14:00:00.000Z',
    remark: '测试停用',
    reminderTime: '22:00',
    bindStatus: 'bound',
    linkedProductId: 'solar_protein',
    linkedProductName: 'Solar Protein™ 28天装',
    linkedOrderNo: 'EXT-20260718-008',
    planDay: 28,
    planId: 'pl2',
  },
  {
    id: 'u1004',
    nickname: 'Sofia',
    email: 'sofia@example.com',
    phone: '5588990011',
    region: 'CDMX',
    heightCm: 160,
    weightKg: 55,
    accountStatus: 'active',
    registeredAt: '2026-07-28T09:00:00.000Z',
    reminderTime: '21:00',
    bindStatus: 'bound',
    linkedProductId: 'active_boost',
    linkedProductName: 'Active Boost 14天装',
    linkedOrderNo: 'EXT-20260728-020',
    planDay: null,
    planId: null,
  },
  {
    id: 'u1005',
    nickname: 'Diego',
    email: 'diego@example.com',
    phone: '5577001122',
    region: 'Puebla',
    heightCm: 172,
    weightKg: 70,
    accountStatus: 'active',
    registeredAt: '2026-07-25T16:20:00.000Z',
    reminderTime: '21:30',
    bindStatus: 'bound',
    linkedProductId: 'solar_protein',
    linkedProductName: 'Solar Protein™ 28天装',
    linkedOrderNo: 'EXT-20260725-011',
    planDay: 3,
    planId: 'pl3',
  },
];

const checkIns: CheckInRecord[] = [
  {
    id: 'ck1',
    userId: 'u1001',
    nickname: 'Freya',
    date: '2026-07-31',
    items: ['体重', '饮水', '睡眠', '代餐'],
    vitalityScore: 86,
  },
  {
    id: 'ck2',
    userId: 'u1005',
    nickname: 'Diego',
    date: '2026-07-31',
    items: ['体重', '饮水', '运动'],
    vitalityScore: 72,
  },
  {
    id: 'ck3',
    userId: 'u1001',
    nickname: 'Freya',
    date: '2026-07-30',
    items: ['体重', '饮水', '睡眠'],
    vitalityScore: 78,
  },
  {
    id: 'ck4',
    userId: 'u1003',
    nickname: 'Leo',
    date: '2026-07-29',
    items: ['体重', '代餐', '睡眠', '饮水', '心情'],
    vitalityScore: 91,
  },
  {
    id: 'ck5',
    userId: 'u1005',
    nickname: 'Diego',
    date: '2026-07-30',
    items: ['体重', '饮水'],
    vitalityScore: 65,
  },
];

const plans: PlanRecord[] = [
  {
    id: 'pl1',
    userId: 'u1001',
    nickname: 'Freya',
    day: 12,
    status: 'active',
    startDate: '2026-07-20',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'pl2',
    userId: 'u1003',
    nickname: 'Leo',
    day: 28,
    status: 'completed',
    startDate: '2026-07-01',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'pl3',
    userId: 'u1005',
    nickname: 'Diego',
    day: 3,
    status: 'active',
    startDate: '2026-07-29',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'pl4',
    userId: 'u1006',
    nickname: 'Ana',
    day: 0,
    status: 'awaiting',
    startDate: '2026-07-30',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
];

const externalOrders: ExternalOrderRecord[] = [
  {
    id: 'ext1',
    orderNo: 'EXT-20260720-001',
    customerName: 'Freya Lopez',
    phone: '13812345678',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'ext2',
    orderNo: 'EXT-20260722-014',
    customerName: 'Maya Ruiz',
    phone: '5512345678',
    productId: 'youth_solar',
    productName: 'Youth Solar 维稳装',
  },
  {
    id: 'ext3',
    orderNo: 'EXT-20260718-008',
    customerName: 'Leo Cruz',
    phone: '5598765432',
    productId: 'solar_protein',
    productName: 'Solar Protein™ 28天装',
  },
  {
    id: 'ext4',
    orderNo: 'EXT-20260728-020',
    customerName: 'Sofia Diaz',
    phone: '5588990011',
    productId: 'active_boost',
    productName: 'Active Boost 14天装',
  },
];

const configs: ConfigRecord[] = [
  {
    code: 'slim_plan_product_ids',
    description: '28 天方案关联产品',
    value: 'solar_protein,LD-SLIM-28D',
  },
];

export function maskPhone(phone: string): string {
  if (phone.length < 7) {
    return phone;
  }
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export function getRoleName(roleId: string): string {
  return roles.find((r) => r.id === roleId)?.name ?? roleId;
}

export function slimPlanProductIds(): string[] {
  const cfg = configs.find((c) => c.code === 'slim_plan_product_ids');
  if (!cfg?.value) return [];
  return cfg.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface QueryUsersParams {
  region?: string;
  accountStatus?: UserRecord['accountStatus'];
  bindStatus?: BindStatus;
  registeredFrom?: string;
  registeredTo?: string;
}

export function queryUsers(params: QueryUsersParams = {}) {
  let items = [...users];
  if (params.region) {
    items = items.filter((u) =>
      u.region.toLowerCase().includes(params.region!.toLowerCase()),
    );
  }
  if (params.accountStatus) {
    items = items.filter((u) => u.accountStatus === params.accountStatus);
  }
  if (params.bindStatus) {
    items = items.filter((u) => u.bindStatus === params.bindStatus);
  }
  if (params.registeredFrom) {
    items = items.filter((u) => u.registeredAt >= params.registeredFrom!);
  }
  if (params.registeredTo) {
    items = items.filter((u) => u.registeredAt <= params.registeredTo!);
  }
  return { items, total: items.length };
}

export function getUserById(id: string): UserRecord | undefined {
  return users.find((u) => u.id === id);
}

export function updateUserRemark(
  id: string,
  remark: string,
): UserRecord | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  user.remark = remark;
  return user;
}

export interface QueryCheckInsParams {
  userId?: string;
  nickname?: string;
  date?: string;
}

export function queryCheckIns(params: QueryCheckInsParams = {}) {
  let items = [...checkIns];
  if (params.userId) {
    items = items.filter((c) => c.userId === params.userId);
  }
  if (params.nickname) {
    items = items.filter((c) =>
      c.nickname.toLowerCase().includes(params.nickname!.toLowerCase()),
    );
  }
  if (params.date) {
    items = items.filter((c) => c.date === params.date);
  }
  return { items, total: items.length };
}

export interface QueryPlansParams {
  nickname?: string;
  status?: PlanStatus;
  startFrom?: string;
}

export function queryPlans(params: QueryPlansParams = {}) {
  let items = [...plans];
  if (params.nickname) {
    items = items.filter((p) =>
      p.nickname.toLowerCase().includes(params.nickname!.toLowerCase()),
    );
  }
  if (params.status) {
    items = items.filter((p) => p.status === params.status);
  }
  if (params.startFrom) {
    items = items.filter((p) => p.startDate >= params.startFrom!);
  }
  return { items, total: items.length };
}

export function getPlanDashboardStats() {
  const today = '2026-07-31';
  const active = plans.filter((p) => p.status === 'active').length;
  const awaiting = plans.filter((p) => p.status === 'awaiting').length;
  const completed = plans.filter((p) => p.status === 'completed').length;
  const checkInsToday = checkIns.filter((c) => c.date === today).length;
  const total = plans.length || 1;
  const completionRate = Math.round((completed / total) * 100);
  return { active, awaiting, completed, checkInsToday, completionRate };
}

export function previewExternalOrders(name: string, phoneLast4: string) {
  const items = externalOrders.filter(
    (o) =>
      o.customerName.toLowerCase() === name.trim().toLowerCase() &&
      o.phone.endsWith(phoneLast4),
  );
  return { items, total: items.length };
}

export function bindExternalOrderToUser(
  userId: string,
  externalOrderId: string,
): { ok: boolean; planOpened: boolean; message: string } {
  const user = users.find((u) => u.id === userId);
  const order = externalOrders.find((o) => o.id === externalOrderId);
  if (!user || !order) {
    return { ok: false, planOpened: false, message: '用户或订单不存在' };
  }

  user.bindStatus = 'bound';
  user.linkedProductId = order.productId;
  user.linkedProductName = order.productName;
  user.linkedOrderNo = order.orderNo;

  const eligible = slimPlanProductIds().includes(order.productId);
  if (!eligible) {
    user.planId = null;
    user.planDay = null;
    return {
      ok: true,
      planOpened: false,
      message: '绑定成功（产品不在方案配置内，未开通方案）',
    };
  }

  let plan = plans.find((p) => p.userId === user.id && p.status !== 'completed');
  if (!plan) {
    plan = {
      id: `pl${Date.now()}`,
      userId: user.id,
      nickname: user.nickname,
      day: 0,
      status: 'awaiting',
      startDate: '2026-07-31',
      productId: order.productId,
      productName: order.productName,
    };
    plans.push(plan);
  } else {
    plan.productId = order.productId;
    plan.productName = order.productName;
  }
  user.planId = plan.id;
  user.planDay = plan.day;
  return { ok: true, planOpened: true, message: '绑定成功，已开通 / 关联 28 天方案' };
}

export function queryConfigs() {
  return { items: [...configs], total: configs.length };
}

export function updateConfig(
  code: string,
  value: string,
): ConfigRecord | undefined {
  const config = configs.find((c) => c.code === code);
  if (!config) return undefined;
  config.value = value;
  return config;
}

export function queryAdmins() {
  return { items: [...admins], total: admins.length };
}

export function setAdminEnabled(
  id: string,
  enabled: boolean,
): AdminRecord | undefined {
  const admin = admins.find((a) => a.id === id);
  if (!admin) return undefined;
  admin.enabled = enabled;
  return admin;
}

export function queryRoles() {
  return {
    items: roles.map((r) => ({
      ...r,
      adminCount: admins.filter((a) => a.roleId === r.id).length,
    })),
    total: roles.length,
  };
}
