import { authRequest } from './request';

/** 通用 API 响应结构 (带 status) */
export interface ApiResponse<T = any> {
  status: boolean;
  error_msg: string;
  error_code: string;
  data: T;
  list?: any[];
  request_id: string;
}

/** api/login-status 响应数据
 * 返回结构：
 * {
 *   "status": true,
 *   "data": {
 *     "is_login": true,
 *     "id": "4",
 *     "email": "...",
 *     "name": "...",
 *     "avatar": "",
 *     "created_at": ...
 *   }
 * }
 */
export interface LoginStatusData {
  is_login: boolean | number;
  id?: string;
  email: string;
  name: string;
  avatar: string;
  created_at?: number;
}

/** api/login 响应数据
 * 实际返回结构（和文档不一致）：
 * {
 *   "status": true,
 *   "error_msg": "ok",
 *   "data": {
 *     "id": "5",
 *     "email": "...",
 *     "name": "...",
 *     "avatar": "",
 *     "created_at": ...
 *   }
 * }
 */
export interface LoginData {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: number;
}

/** api/register 响应数据
 * 返回结构：
 * {
 *   "status": true,
 *   "data": {
 *     "id": "2",
 *     "email": "...",
 *     "name": "...",
 *     "avatar": "...",
 *     "created_at": ...
 *   }
 * }
 */
export interface RegisterData {
  is_new_user?: boolean;
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: number;
}

/** api/send-code 响应数据（可能为 null） */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SendCodeData {
  // 可能为 null
}

/** api/logout 响应数据（可能为 null） */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LogoutData {
  // 可能为 null
}

/** api/check-email 响应数据
 * 返回结构：
 * {
 *   "status": true,
 *   "data": {
 *     "email": "...",
 *     "is_registered": true/false
 *   }
 * }
 */
export interface CheckEmailData {
  email: string;
  is_registered: boolean;
}

/**
 * 检查邮箱是否已注册 - POST /api/check-email
 * 用途：前端弹窗判断走注册还是登录流程
 * @param body { email }
 */
export function checkEmailApi(body: { email: string }) {
  return authRequest.post<ApiResponse<CheckEmailData>>('api/check-email', body);
}

/**
 * 获取登录状态 - GET api/login-status
 * 如果请求错误/失败，需要重新请求 api/init
 */
export function getLoginStatus() {
  return authRequest.get<ApiResponse<LoginStatusData>>('api/login-status');
}

/**
 * 用户登录 - POST api/login
 * @param body { email, code }
 * 注意：实际返回和文档不一致，使用 status 判断成功
 */
export function loginApi(body: { email: string; code: string }) {
  return authRequest.post<ApiResponse<LoginData>>('api/login', body);
}

/**
 * 用户注册 - POST api/register
 * @param body { email, code, name, avatar, password }
 */
export function registerApi(body: {
  email: string;
  code?: string;
  name?: string;
  avatar?: string;
  password?: string;
}) {
  return authRequest.post<ApiResponse<RegisterData>>('api/register', body);
}

/**
 * 发送验证码 - POST api/send-code
 * @param body { email, type } - type: 'login' 或 'register'
 */
export function sendCode(body: { email: string; type: 'login' | 'register' }) {
  return authRequest.post<ApiResponse<SendCodeData>>('api/send-code', body);
}

/** api/user-info 响应数据 */
export interface UserInfoData {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  created_at: number;
}

/**
 * 获取用户信息 - GET api/user-info
 */
export function getUserInfo() {
  return authRequest.get<ApiResponse<UserInfoData>>('api/user-info');
}

/** api/user/update-profile 响应数据 */
export interface UpdateProfileData {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at?: number;
}

/**
 * 更新用户资料 - POST api/user/update-profile
 * @param body { email, name, avatar, password } - 可单独修改任一字段
 */
export function updateProfileApi(body: {
  email?: string;
  name?: string;
  avatar?: string;
  password?: string;
}) {
  return authRequest.post<ApiResponse<UpdateProfileData>>('api/user/update-profile', body);
}

/**
 * 退出登录 - POST api/logout
 */
export function logoutApi() {
  return authRequest.post<ApiResponse<LogoutData>>('api/logout');
}
