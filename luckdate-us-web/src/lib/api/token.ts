import { publicRequest } from './request';

/** api/init 响应结构 */
export interface InitResponse {
  result: boolean;
  token: string;
  sk: string;
  is_sign: number;
  expires_time: number;
}

/** 获取 token - GET api/init，应用启动时调用，无需 Authorization */
export function getInit() {
  return publicRequest.get<InitResponse>('api/init', {
    params: process.env.NEXT_PUBLIC_USERTEST ? { usertest: process.env.NEXT_PUBLIC_USERTEST } : undefined,
  });
}
