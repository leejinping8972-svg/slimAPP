import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config';
import i18next from 'i18next';
import { getInit } from './token';

const TOKEN_KEY = 'token';

/** 获取 token，可由应用层注入（如从 localStorage / context） */
let getToken: () => string | null = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export function setTokenGetter(fn: () => string | null) {
  getToken = fn;
}

/** 判断是否为 token 过期（AUTHORIZATION验证失败）- 业务层返回 code 401，HTTP 仍为 200 */
function isAuthFailure(data: { code?: number } | undefined) {
  return data?.code === 401;
}

/** 调用 api/init 获取新 token */
async function refreshToken(): Promise<string> {
  const res = await getInit();
  const token = res.data?.token;
  if (!token) throw new Error('No token in init response');
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

/** 需要 Authorization 的请求实例（独立站：商品、文章、订单、获取 token） */
export const authRequest: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

authRequest.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  // 添加 X-language 请求头
  config.headers['X-language'] = i18next.language;
  config.headers['X-isapi'] = 1;
  // 独立站目录必填 usertest
  const usertest = process.env.NEXT_PUBLIC_USERTEST;
  if (usertest) {
    config.params = { ...config.params, usertest };
  }
  return config;
});

// 刷新锁，防止并发刷新
let isRefreshing = false;
type RefreshSubscriber = { resolve: (token: string) => void; reject: (err: unknown) => void };
let refreshSubscribers: RefreshSubscriber[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(err: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
}

// 响应拦截器：业务层返回 code 401 时自动刷新 token 并重试（接口 HTTP 200，body 中 code 401）
authRequest.interceptors.response.use(
  async (response) => {
    if (!isAuthFailure(response.data)) {
      return response;
    }

    const originalRequest = response.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (originalRequest._retry) {
      return Promise.reject(response);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = token;
            authRequest(originalRequest).then(resolve).catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const newToken = await refreshToken();
      onRefreshed(newToken);
      originalRequest.headers.Authorization = newToken;
      return authRequest(originalRequest);
    } catch (refreshError) {
      onRefreshFailed(refreshError);
      return Promise.reject(response);
    } finally {
      isRefreshing = false;
    }
  },
  (error) => Promise.reject(error)
);

/** 无需 Authorization 的请求实例（常见问题） */
export const publicRequest: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

publicRequest.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  // 添加 X-language 请求头
  config.headers['X-language'] = i18next.language;
  config.headers['X-isapi'] = 1;
  // 独立站目录必填 usertest
  const usertest = process.env.NEXT_PUBLIC_USERTEST;
  if (usertest) {
    config.params = { ...config.params, usertest };
  }
  return config;
});

// 响应拦截器：业务层返回 code 401 时自动刷新 token 并重试（接口 HTTP 200，body 中 code 401）
publicRequest.interceptors.response.use(
  async (response) => {
    if (!isAuthFailure(response.data)) {
      return response;
    }

    const originalRequest = response.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (originalRequest._retry) {
      return Promise.reject(response);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = token;
            publicRequest(originalRequest).then(resolve).catch(reject);
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const newToken = await refreshToken();
      onRefreshed(newToken);
      originalRequest.headers.Authorization = newToken;
      return publicRequest(originalRequest);
    } catch (refreshError) {
      onRefreshFailed(refreshError);
      return Promise.reject(response);
    } finally {
      isRefreshing = false;
    }
  },
  (error) => Promise.reject(error)
);
