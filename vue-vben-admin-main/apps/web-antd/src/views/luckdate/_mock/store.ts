import type {
  AdminRecord,
  ConfigRecord,
  CouponBatchRecord,
  CouponRecord,
  LogisticsStatus,
  OrderRecord,
  OrderStatus,
  ProductRecord,
  UserRecord,
} from './types';

export type { OrderStatus, LogisticsStatus };

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  unpaid: '未支付',
  paid: '已付款',
  cancelled: '已取消',
};

export const LOGISTICS_STATUS_LABEL: Record<LogisticsStatus, string> = {
  placed: '已下单',
  shipped: '已发货',
  arrived: '到达待取',
  received: '客户已收',
  problem: '问题件',
};

const users: UserRecord[] = [
  {
    id: 'u1',
    nickname: 'Alice',
    email: 'alice@example.com',
    phone: '13812345678',
    region: 'California',
    heightCm: 165,
    weightKg: 58,
    accountStatus: 'active',
    registeredAt: '2026-07-27T08:00:00.000Z',
    linkedOrderIds: ['o1'],
  },
  {
    id: 'u2',
    nickname: 'Bob',
    email: 'bob@example.com',
    phone: '13987654321',
    region: 'Texas',
    heightCm: 178,
    weightKg: 75,
    accountStatus: 'active',
    registeredAt: '2026-07-20T10:30:00.000Z',
    linkedOrderIds: [],
  },
  {
    id: 'u3',
    nickname: 'Carol',
    email: 'carol@example.com',
    phone: '13611112222',
    region: 'New York',
    accountStatus: 'disabled',
    registeredAt: '2026-06-15T14:00:00.000Z',
    remark: 'VIP customer',
    linkedOrderIds: ['o3'],
  },
];

const orders: OrderRecord[] = [
  {
    id: 'o1',
    orderNo: 'LD202607270001',
    customerName: 'Alice',
    phone: '13812345678',
    productName: 'Slim Shake Vanilla',
    sku: 'SS-VAN-30',
    orderStatus: 'paid',
    logisticsStatus: 'shipped',
    orderedAt: '2026-07-27T09:00:00.000Z',
    region: 'California',
    receiverAddress: '123 Main St, Los Angeles, CA',
    amount: 49.99,
  },
  {
    id: 'o2',
    orderNo: 'LD202607260002',
    customerName: 'David',
    phone: '13755556666',
    productName: 'Slim Shake Chocolate',
    sku: 'SS-CHO-30',
    orderStatus: 'unpaid',
    logisticsStatus: 'placed',
    orderedAt: '2026-07-26T15:30:00.000Z',
    region: 'Florida',
    amount: 49.99,
  },
  {
    id: 'o3',
    orderNo: 'LD202607250003',
    customerName: 'Carol',
    phone: '13611112222',
    productName: 'Slim Shake Vanilla',
    sku: 'SS-VAN-30',
    orderStatus: 'paid',
    logisticsStatus: 'received',
    orderedAt: '2026-07-25T11:00:00.000Z',
    region: 'New York',
    receiverAddress: '456 Park Ave, New York, NY',
    amount: 49.99,
  },
  {
    id: 'o4',
    orderNo: 'LD202607240004',
    customerName: 'Eve',
    phone: '13599998888',
    productName: 'Slim Shake Chocolate',
    sku: 'SS-CHO-30',
    orderStatus: 'cancelled',
    logisticsStatus: 'problem',
    orderedAt: '2026-07-24T08:45:00.000Z',
    region: 'Washington',
    amount: 49.99,
  },
  {
    id: 'o5',
    orderNo: 'LD202607230005',
    customerName: 'Frank',
    phone: '13477778888',
    productName: 'Slim Shake Vanilla',
    sku: 'SS-VAN-30',
    orderStatus: 'paid',
    logisticsStatus: 'arrived',
    orderedAt: '2026-07-23T16:20:00.000Z',
    region: 'Oregon',
    amount: 49.99,
  },
];

const products: ProductRecord[] = [
  {
    id: 'p1',
    name: 'Slim Shake Vanilla',
    price: 49.99,
    stock: 200,
    onSale: true,
    specs: '30 servings',
    coverUrl: 'https://example.com/vanilla.jpg',
    description: 'Vanilla meal replacement shake',
  },
  {
    id: 'p2',
    name: 'Slim Shake Chocolate',
    price: 49.99,
    stock: 150,
    onSale: true,
    specs: '30 servings',
    coverUrl: 'https://example.com/chocolate.jpg',
    description: 'Chocolate meal replacement shake',
  },
];

const coupons: CouponRecord[] = [
  {
    id: 'c1',
    name: 'Welcome $10 Off',
    type: 'full_reduction',
    thresholdUsd: 30,
    discountValue: 10,
    validityType: 'days_after_claim',
    daysAfterClaim: 30,
    totalQuantity: 1000,
    perUserLimit: 1,
    productScope: 'all',
    productIds: [],
    enabled: true,
  },
  {
    id: 'c2',
    name: 'Summer 20% Off',
    type: 'discount',
    thresholdUsd: 50,
    discountValue: 0.8,
    validityType: 'fixed_date',
    startAt: '2026-07-01T00:00:00.000Z',
    endAt: '2026-08-31T23:59:59.000Z',
    totalQuantity: 500,
    perUserLimit: 2,
    productScope: 'specified',
    productIds: ['p1', 'p2'],
    enabled: true,
  },
];

const couponBatches: CouponBatchRecord[] = [
  {
    id: 'b1',
    couponId: 'c1',
    couponName: 'Welcome $10 Off',
    userCount: 120,
    createdAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'b2',
    couponId: 'c2',
    couponName: 'Summer 20% Off',
    userCount: 85,
    createdAt: '2026-07-15T14:30:00.000Z',
  },
];

const configs: ConfigRecord[] = [
  {
    code: 'slim_plan_product_ids',
    description: 'Slim plan product IDs',
    value: 'p1,p2',
  },
  {
    code: 'repurchase_recommend_product_ids',
    description: 'Repurchase recommend product IDs',
    value: 'p2',
  },
  {
    code: 'register_gift_coupon_ids',
    description: 'Register gift coupon IDs',
    value: 'c1',
  },
];

const admins: AdminRecord[] = [
  {
    id: 'a1',
    username: 'admin',
    role: 'Super Admin',
    enabled: true,
  },
  {
    id: 'a2',
    username: 'operator',
    role: 'Operator',
    enabled: true,
  },
];

export function maskPhone(phone: string): string {
  if (phone.length < 7) {
    return phone;
  }
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

export interface QueryUsersParams {
  region?: string;
  accountStatus?: UserRecord['accountStatus'];
  registeredFrom?: string;
  registeredTo?: string;
}

export function queryUsers(params: QueryUsersParams = {}) {
  let items = [...users];
  if (params.region) {
    items = items.filter((u) => u.region === params.region);
  }
  if (params.accountStatus) {
    items = items.filter((u) => u.accountStatus === params.accountStatus);
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
  if (!user) {
    return undefined;
  }
  user.remark = remark;
  return user;
}

export function linkOrderToUser(userId: string, orderId: string): boolean {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return false;
  }
  if (!user.linkedOrderIds.includes(orderId)) {
    user.linkedOrderIds.push(orderId);
  }
  return true;
}

export interface QueryOrdersParams {
  orderStatus?: OrderStatus;
  logisticsStatus?: LogisticsStatus;
  region?: string;
  orderNo?: string;
  customerName?: string;
  phoneLast4?: string;
  orderedFrom?: string;
  orderedTo?: string;
}

export function queryOrders(params: QueryOrdersParams = {}) {
  let items = [...orders];
  if (params.orderStatus) {
    items = items.filter((o) => o.orderStatus === params.orderStatus);
  }
  if (params.logisticsStatus) {
    items = items.filter((o) => o.logisticsStatus === params.logisticsStatus);
  }
  if (params.region) {
    items = items.filter((o) =>
      o.region.toLowerCase().includes(params.region!.toLowerCase()),
    );
  }
  if (params.orderNo) {
    items = items.filter((o) => o.orderNo.includes(params.orderNo!));
  }
  if (params.customerName) {
    items = items.filter((o) =>
      o.customerName
        .toLowerCase()
        .includes(params.customerName!.toLowerCase()),
    );
  }
  if (params.phoneLast4) {
    items = items.filter((o) => o.phone.endsWith(params.phoneLast4!));
  }
  if (params.orderedFrom) {
    items = items.filter((o) => o.orderedAt >= params.orderedFrom!);
  }
  if (params.orderedTo) {
    items = items.filter((o) => o.orderedAt <= params.orderedTo!);
  }
  return { items, total: items.length };
}

export function getOrderById(id: string): OrderRecord | undefined {
  return orders.find((o) => o.id === id);
}

export interface QueryProductsParams {
  name?: string;
  onSale?: boolean;
}

export function queryProducts(params: QueryProductsParams = {}) {
  let items = [...products];
  if (params.name) {
    items = items.filter((p) =>
      p.name.toLowerCase().includes(params.name!.toLowerCase()),
    );
  }
  if (params.onSale !== undefined) {
    items = items.filter((p) => p.onSale === params.onSale);
  }
  return { items, total: items.length };
}

export function getProductById(id: string): ProductRecord | undefined {
  return products.find((p) => p.id === id);
}

export function saveProduct(product: ProductRecord): ProductRecord {
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = { ...product };
    return products[index];
  }
  products.push({ ...product });
  return product;
}

export function queryCoupons() {
  return { items: [...coupons], total: coupons.length };
}

export function saveCoupon(coupon: CouponRecord): CouponRecord {
  const index = coupons.findIndex((c) => c.id === coupon.id);
  if (index >= 0) {
    coupons[index] = { ...coupon };
    return coupons[index];
  }
  coupons.push({ ...coupon });
  return coupon;
}

export function deleteCoupon(id: string): boolean {
  const index = coupons.findIndex((c) => c.id === id);
  if (index < 0) {
    return false;
  }
  coupons.splice(index, 1);
  return true;
}

export function queryCouponBatches() {
  return { items: [...couponBatches], total: couponBatches.length };
}

export function queryConfigs() {
  return { items: [...configs], total: configs.length };
}

export function updateConfig(code: string, value: string): ConfigRecord | undefined {
  const config = configs.find((c) => c.code === code);
  if (!config) {
    return undefined;
  }
  config.value = value;
  return config;
}

export function queryAdmins() {
  return { items: [...admins], total: admins.length };
}

export function setAdminEnabled(id: string, enabled: boolean): AdminRecord | undefined {
  const admin = admins.find((a) => a.id === id);
  if (!admin) {
    return undefined;
  }
  admin.enabled = enabled;
  return admin;
}

export function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const todayRegister = users.filter((u) =>
    u.registeredAt.startsWith(today),
  ).length;
  const todayOrders = orders.filter((o) =>
    o.orderedAt.startsWith(today),
  ).length;
  return {
    todayRegister,
    todayOrders,
    couponIssued: 205,
    couponUsed: 87,
  };
}

export function previewOrdersForLink(name: string, phoneLast4: string) {
  const items = orders.filter(
    (o) => o.customerName === name && o.phone.endsWith(phoneLast4),
  );
  return { items, total: items.length };
}
