export type PlanStatus = 'active' | 'completed' | 'awaiting';
export type BindStatus = 'bound' | 'unbound';

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface AdminRecord {
  id: string;
  username: string;
  roleId: string;
  enabled: boolean;
}

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
  bindStatus: BindStatus;
  linkedProductId?: string | null;
  linkedProductName?: string | null;
  linkedOrderNo?: string | null;
  planDay?: number | null;
  planId?: string | null;
}

export interface CheckInRecord {
  id: string;
  userId: string;
  nickname: string;
  date: string;
  items: string[];
  vitalityScore: number;
}

export interface PlanRecord {
  id: string;
  userId: string;
  nickname: string;
  day: number;
  status: PlanStatus;
  startDate: string;
  productId: string;
  productName: string;
}

export interface ExternalOrderRecord {
  id: string;
  orderNo: string;
  customerName: string;
  phone: string;
  productId: string;
  productName: string;
}

export interface ConfigRecord {
  code: string;
  description: string;
  value: string;
  unit?: string;
}
