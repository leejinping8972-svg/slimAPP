import { API_BASE_URL } from '../config';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new Error(`API Request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 订单查询接口返回格式：{ status, data, list: { current_page, per_page, total, total_pages, screen_per_page, data } }
 */
const TOKEN_KEY = 'token';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export const orderApi = {
  queryOrders: async (name: string, phoneLast4: string, page = 1, pageSize = 10) => {
    try {
      const token = getToken();
      const res = await fetchApi('/api/order/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({ name, phoneLast4, page, pageSize }),
      });
      const list = res.list ?? null;
      const items = Array.isArray(list?.data) ? list.data : [];
      const pagination = list
        ? {
            page: list.current_page ?? page,
            pageSize: list.per_page ?? pageSize,
            total: list.total ?? 0,
            totalPages: list.total_pages ?? 1,
          }
        : null;
      return {
        success: res.status === true,
        result: items,
        pagination,
      };
    } catch (error) {
      return { success: false, result: [], pagination: null };
    }
  },
};

