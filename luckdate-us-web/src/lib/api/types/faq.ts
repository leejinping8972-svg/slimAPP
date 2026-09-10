/**
 * 常见问题模块类型 - 依据 api/faq-list 响应示例
 */
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}
