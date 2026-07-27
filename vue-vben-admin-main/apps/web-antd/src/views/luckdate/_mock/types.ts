export type OrderStatus = 'unpaid' | 'paid' | 'cancelled';
export type LogisticsStatus =
  | 'placed'
  | 'shipped'
  | 'arrived'
  | 'received'
  | 'problem';

export type CouponType = 'full_reduction' | 'discount' | 'no_threshold';
export type ValidityType = 'fixed_date' | 'days_after_claim';
export type ProductScope = 'all' | 'specified' | 'include_specified_order';

export interface UserRecord {
  id: string;
  nickname: string;
  email: string;
  phone: string;
  region: string;
  heightCm?: number;
  weightKg?: number;
  accountStatus: 'active' | 'disabled';
  registeredAt: string;
  reminderTime?: string;
  remark?: string;
  linkedOrderIds: string[];
}

export interface OrderRecord {
  id: string;
  orderNo: string;
  customerName: string;
  phone: string;
  productName: string;
  sku: string;
  orderStatus: OrderStatus;
  logisticsStatus: LogisticsStatus;
  orderedAt: string;
  region: string;
  receiverAddress?: string;
  amount: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  stock: number;
  onSale: boolean;
  specs: string;
  coverUrl?: string;
  description?: string;
}

export interface CouponRecord {
  id: string;
  name: string;
  type: CouponType;
  thresholdUsd: number;
  discountValue: number;
  validityType: ValidityType;
  startAt?: string;
  endAt?: string;
  daysAfterClaim?: number;
  totalQuantity: number;
  perUserLimit: number;
  productScope: ProductScope;
  productIds: string[];
  enabled: boolean;
}

export interface CouponBatchRecord {
  id: string;
  couponId: string;
  couponName: string;
  userCount: number;
  createdAt: string;
}

export interface ConfigRecord {
  code: string;
  description: string;
  value: string;
  unit?: string;
}

export interface AdminRecord {
  id: string;
  username: string;
  role: string;
  enabled: boolean;
}
