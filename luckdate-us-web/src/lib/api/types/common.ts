/** 后端通用响应结构（保留原始 status / data / list） */
export interface ApiResponse<T = unknown> {
  status: boolean;
  error_msg: string;
  error_code: string;
  request_id: string;
  debug?: { run_time: string };
  data: T;
  list?: ListData<unknown>;
}

/** 列表分页结构 */
export interface ListData<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total_pages: number;
  screen_per_page: number | null;
  total: number;
}
