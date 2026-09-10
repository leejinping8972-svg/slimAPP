/**
 * 自定义 fixed 叠层弹窗（未支付订单、订单详情等）在 DOM 上位于 Radix Dialog/Sheet Portal 之外，
 * Radix 会将点击这些区域视为 outside 并关闭底层弹窗。在叠层根节点加 data-stack-overlay，
 * 并在 DialogContent / SheetContent 的 outside 回调里调用本方法 preventDefault。
 */
export const STACK_OVERLAY_ATTR = 'data-stack-overlay';

export function preventDismissWhenStackOverlayOutside(event: Event): void {
  const target = event.target;
  if (target instanceof Element && target.closest(`[${STACK_OVERLAY_ATTR}]`)) {
    event.preventDefault();
  }
}
