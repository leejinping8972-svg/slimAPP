'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ExternalLink, ChevronLeft, ChevronRight, Loader2, X, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getUserOrders, cancelOrder, getOrderDetail, continuePay, type OrderItem, type OrderDetailData } from '@/lib/api/order';
import { setEmbeddedCheckoutClientSecret } from '@/lib/stripe/embeddedCheckoutNavigate';
import OrderDetailModal, { PaymentCountdown } from '@/components/OrderDetailModal';
import CancelOrderConfirmModal from '@/components/CancelOrderConfirmModal';

/** 订单状态 Tab 类型 - 对齐后端全部枚举 */
type OrderStatusTab = 'all' | 'pending_payment' | 'pending_delivery' | 'pending_receive' | 'confirm_receive' | 'completed' | 'cancelled' | 'pay_confirming';

/** 后端订单状态码 */
const ORDER_STATUS = {
  WAIT_PAY: 0,
  WAIT_DELIVERY: 1,
  WAIT_TAKE: 2,
  CONFIRM_TAKE: 3,
  SUCCESS: 4,
  CANCEL: 5,
  PAY_CONFIRM: 6,
} as const;

export default function OrdersPage() {
  const { t } = useTranslation();

  /** Tab 配置 key（label 通过 t() 动态获取）- 对齐后端全部状态 */
  const TAB_KEYS: { key: OrderStatusTab; labelKey: string; status?: number[] }[] = [
    { key: 'all', labelKey: 'orders.tab.all' },
    { key: 'pending_payment', labelKey: 'orders.tab.pendingPayment', status: [ORDER_STATUS.WAIT_PAY] },
    { key: 'pending_delivery', labelKey: 'orders.tab.pendingDelivery', status: [ORDER_STATUS.WAIT_DELIVERY] },
    { key: 'pending_receive', labelKey: 'orders.tab.pendingReceive', status: [ORDER_STATUS.WAIT_TAKE] },
    { key: 'confirm_receive', labelKey: 'orders.tab.confirmReceive', status: [ORDER_STATUS.CONFIRM_TAKE] },
    { key: 'completed', labelKey: 'orders.tab.completed', status: [ORDER_STATUS.SUCCESS] },
    { key: 'cancelled', labelKey: 'orders.tab.cancelled', status: [ORDER_STATUS.CANCEL] },
    { key: 'pay_confirming', labelKey: 'orders.tab.payConfirming', status: [ORDER_STATUS.PAY_CONFIRM] },
  ];

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 状态筛选
  const [activeTab, setActiveTab] = useState<OrderStatusTab>('all');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  // 取消订单相关状态
  const [cancelingOrderId, setCancelingOrderId] = useState<number | string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<OrderItem | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<{ orderId: number | string; couponReturned: boolean; couponExpired: boolean } | null>(null);

  // 展开订单详情状态
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // 订单详情数据（从API获取）
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // 获取订单列表（支持状态筛选）
  const fetchOrders = useCallback(async (page: number, tab?: OrderStatusTab) => {
    setLoading(true);
    setError(null);

    const currentTab = tab || activeTab;
    const tabConfig = TAB_KEYS.find(t => t.key === currentTab);

    try {
      const params: { page: number; pageSize: number; status?: number } = {
        page,
        pageSize,
      };

      const needsBackendFilter = !!(tabConfig?.status && tabConfig.status.length === 1 && tabConfig.status[0] > 0);
      if (needsBackendFilter && tabConfig.status) {
        params.status = tabConfig.status[0];
      }

      const res = await getUserOrders(params);

      if (res.data?.status === true && res.data?.list) {
        let orderList = res.data.list.data || [];

        if (!needsBackendFilter && tabConfig?.status && currentTab !== 'all' && tabConfig.status.length > 0) {
          orderList = orderList.filter(order => tabConfig.status!.includes(order.status));
        }

        setOrders(orderList);
        setTotalPages(res.data.list.last_page || 0);
        setTotalRecords(res.data.list.total || 0);
        setCurrentPage(res.data.list.current_page || page);
      } else {
        setError(res.data?.error_msg || t('orders.error.loadFailed'));
        setOrders([]);
      }
    } catch (err: any) {
      setError(err?.message || t('orders.error.network'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, activeTab, t]);

  // 初始加载
  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  // 切换 Tab
  const handleTabChange = (tab: OrderStatusTab) => {
    setActiveTab(tab);
    fetchOrders(1, tab);
  };

  // 翻页处理
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchOrders(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 格式化金额（分转元）
  const formatAmount = (amountInCents: number) => {
    return (amountInCents / 100).toFixed(2);
  };

  // 格式化日期（支持字符串或 Unix 时间戳）
  const formatDate = (dateValue: string | number) => {
    try {
      let date: Date;
      if (typeof dateValue === 'number') {
        date = new Date(dateValue > 1e12 ? dateValue : dateValue * 1000);
      } else {
        date = new Date(dateValue);
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return String(dateValue);
    }
  };

  // 优先使用后端返回的格式化时间字符串 createTime，回退到时间戳格式化
  const getDisplayTime = (order: OrderItem) => {
    if (order.createTime) return order.createTime;
    return formatDate(order.created_at);
  };

  // 获取物流单号（优先新字段 tracking_number，回退 tracking_no）
  const getTrackingNo = (order: OrderItem) => {
    return order.tracking_number || order.tracking_no || '';
  };

  // 判断是否为待支付状态（可以取消）
  const isPendingPayment = (order: OrderItem) => {
    return order.status === ORDER_STATUS.WAIT_PAY;
  };

  // 判断是否可续付（待支付 + 未过期 + Session可用）
  const canContinuePay = (order: OrderItem) => {
    return order.can_continue_pay === true && order.continue_pay_remaining_ms && order.continue_pay_remaining_ms > 0;
  };

  // 续付状态
  const [payingOrderId, setPayingOrderId] = useState<number | string | null>(null);

  // 执行续付
  const handleContinuePay = async (orderId: number | string) => {
    setPayingOrderId(orderId);

    try {
      const res = await continuePay(orderId);
      if (res.data?.status === true && res.data?.data) {
        const payData = res.data.data;

        if (payData.url) {
          // Hosted Checkout 模式：整页跳转
          window.location.href = payData.url;
        } else if (payData.client_secret) {
          // Embedded Checkout 模式：使用项目统一的 sessionStorage key
          setEmbeddedCheckoutClientSecret(payData.client_secret);
          window.location.href = '/checkout/pay';
        }
      } else {
        setError(res.data?.error_msg || t('orders.error.payFailed', 'Payment failed'));
      }
    } catch (err: any) {
      console.error('Failed to continue pay:', err);
      setError(err?.response?.data?.error_msg || err?.message || t('orders.error.payRetry', 'Please try again'));
    } finally {
      setPayingOrderId(null);
    }
  };

  // 打开取消确认框
  const handleOpenCancelConfirm = (order: OrderItem) => {
    setOrderToCancel(order);
    setShowCancelConfirm(true);
  };

  // 关闭取消确认框
  const handleCloseCancelConfirm = () => {
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  };

  // 执行取消订单
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelingOrderId(orderToCancel.order_id);

    try {
      const res = await cancelOrder(orderToCancel.order_id);

      if (res.data?.status === true) {
        setCancelSuccess({
          orderId: orderToCancel.order_id,
          couponReturned: true,
          couponExpired: false,
        });

        setShowCancelConfirm(false);
        setOrderToCancel(null);
        setSelectedOrder(null);

        await fetchOrders(currentPage);

        setTimeout(() => {
          setCancelSuccess(null);
        }, 5000);
      } else {
        setError(res.data?.error_msg || t('orders.error.cancelFailed'));
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error_msg || err?.message || t('orders.error.cancelRetry');
      setError(errorMsg);
    } finally {
      setCancelingOrderId(null);
    }
  };

  // 从 OrderDetailModal 取消订单（已通过二次确认）
  const handleCancelFromDetail = async () => {
    if (!selectedOrder) return;

    setCancelingOrderId(selectedOrder.order_id);

    try {
      const res = await cancelOrder(selectedOrder.order_id);

      if (res.data?.status === true) {
        setCancelSuccess({
          orderId: selectedOrder.order_id,
          couponReturned: true,
          couponExpired: false,
        });
        setSelectedOrder(null);

        await fetchOrders(currentPage);

        setTimeout(() => {
          setCancelSuccess(null);
        }, 5000);
      } else {
        setError(res.data?.error_msg || t('orders.error.cancelFailed'));
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error_msg || err?.message || t('orders.error.cancelRetry');
      setError(errorMsg);
    } finally {
      setCancelingOrderId(null);
    }
  };

  // 获取订单详情
  const handleFetchOrderDetail = async (order: OrderItem) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    setDetailError(null);
    setOrderDetail(null);

    try {
      const res = await getOrderDetail(order.order_id);

      if (res.data?.status === true && res.data?.data) {
        setOrderDetail(res.data.data);
      } else {
        setDetailError(res.data?.error_msg || t('orders.error.loadFailed'));
      }
    } catch (err: any) {
      setDetailError(err?.message || t('orders.error.network'));
    } finally {
      setDetailLoading(false);
    }
  };

  // 关闭订单详情弹窗
  const handleCloseDetailModal = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
    setDetailError(null);
  };

  // 状态颜色映射
  const getStatusColor = (statusText: string) => {
    const statusLower = statusText.toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('待') || statusLower.includes('pay')) {
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    } else if (statusLower.includes('shipped') || statusLower.includes('发货') || statusLower.includes('process')) {
      return 'bg-blue-50 text-blue-600 border-blue-200';
    } else if (statusLower.includes('delivered') || statusLower.includes('完成') || statusLower.includes('success')) {
      return 'bg-green-50 text-green-600 border-green-200';
    } else if (statusLower.includes('cancelled') || statusLower.includes('取消')) {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold font-['Montserrat']">{t('orders.title')}</h2>
        <p className="text-sm text-gray-500">{totalRecords > 0 ? t('orders.count', { count: totalRecords }) : ''}</p>
      </div>

      {/* 成功提示 - 优惠券返还 */}
      {cancelSuccess && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-green-800 text-sm mb-1">{t('orders.cancel.successTitle')}</p>
            <p className="text-green-700 text-xs leading-relaxed">
              {t('orders.cancel.successMessage')}
              {cancelSuccess.couponExpired &&
                <span className="block mt-1 text-amber-600 font-medium">
                  {t('orders.cancel.couponExpired')}
                </span>
              }
            </p>
            <button
              onClick={() => setCancelSuccess(null)}
              className="mt-2 text-xs font-medium text-green-700 hover:text-green-900 underline"
            >
              {t('common.dismiss')}
            </button>
          </div>
          <button
            onClick={() => setCancelSuccess(null)}
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 状态筛选 Tabs - 支持横向滚动，带渐变提示 */}
      <div className="relative mb-6">
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max pr-8">
            {TAB_KEYS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                type="button"
                className={`flex-none sm:flex-initial px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-[#4E554B] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none rounded-r-xl" />
      </div>

      {/* Loading State */}
      {loading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#D8CBB8] animate-spin mb-4" />
          <p className="text-sm text-gray-500">{t('orders.loading')}</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchOrders(currentPage);
            }}
            className="px-4 py-2 bg-[#D8CBB8] text-white rounded-lg hover:bg-[#C4B5A0] transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center py-16 text-center">
           <Package className="w-8 h-8 text-gray-300 mb-4" />
           <h3 className="text-lg font-bold text-gray-700 mb-1">{t('orders.empty.title')}</h3>
           <p className="text-sm text-gray-500 max-w-xs">{t('orders.empty.description')}</p>
        </div>
      ) : (
        /* Orders List */
        <>
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.order_id} className={`border rounded-2xl overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                cancelSuccess?.orderId === order.order_id
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-gray-100 bg-white'
              }`}
                 onClick={() => handleFetchOrderDetail(order)}
                 role="button"
                 tabIndex={0}
                 aria-label={t('orders.viewOrder', { orderSn: order.order_sn })}
               >
                 <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-100 flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
                   <div className="min-w-0 flex-1 max-w-[35%] overflow-hidden">
                     <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold mb-0.5 truncate">{t('orders.orderNumber')}</p>
                     <p className="font-medium text-xs sm:text-sm truncate" title={order.order_sn}>{order.order_sn}</p>
                   </div>
                   <div className="shrink-0">
                     <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold mb-0.5">{t('orders.date')}</p>
                     <p className="font-medium text-xs sm:text-sm whitespace-nowrap">{getDisplayTime(order)}</p>
                   </div>
                   <div className="shrink-0">
                     <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold mb-0.5">{t('orders.total')}</p>
                     <p className="font-bold text-sm sm:text-base text-[#D8CBB8] whitespace-nowrap">${formatAmount(order.order_amount)}</p>
                   </div>
                   <div className="shrink-0">
                     <span className={`inline-flex items-center px-1.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusColor(order.status_text)}`}>
                       {order.status_text}
                     </span>
                   </div>
                 </div>

                 {/* 商品列表预览（显示前2个商品） - 严格约束，绝不超出 */}
                 <div className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      {order.goods.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3">
                          {/* 商品图片 - 固定尺寸，绝对不伸缩 */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={`${item.name} ${t('orders.productAltSuffix')}`}
                              className="w-full h-full object-contain p-1"
                              loading="lazy"
                            />
                          </div>

                          {/* 商品信息 - 占据剩余空间，最多显示2行 */}
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-xs sm:text-sm font-semibold text-[#4E554B] leading-snug line-clamp-2"
                              title={item.name}
                            >
                              {item.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                              {t('orders.qty', { qty: item.quantity })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.goods.length > 2 && (
                        <p className="text-[10px] sm:text-xs text-gray-400 py-1 pl-[52px] sm:pl-[60px]">
                          +{order.goods.length - 2} {t('orders.moreItems', 'more items')}
                        </p>
                      )}
                    </div>

                    {/* 待支付订单：倒计时 + 立即支付按钮 */}
                    {canContinuePay(order) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <PaymentCountdown
                          remainingMs={order.continue_pay_remaining_ms!}
                          deadlineMs={order.continue_pay_deadline_ms!}
                          showDetail={true}
                        />
                        <div className='flex flex-col sm:flex-row gap-2'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCancelConfirm(order);
                            }}
                            disabled={cancelingOrderId === order.order_id}
                            className="w-full sm:w-auto shrink-0 px-4 py-1.5 sm:px-4 py-1.5 border-2 border-red-500 text-red-500 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-0 sm:mr-4 flex items-center justify-center gap-2"
                          >
                            <X className="w-3.5 h-3.5" />
                            {t('orders.cancelOrder')}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinuePay(order.order_id);
                            }}
                            disabled={payingOrderId === order.order_id}
                            className="w-full sm:w-auto shrink-0 px-4 py-1.5 sm:px-4 py-1.5 bg-[#D8CBB8] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#D8CBB8]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-[#D8CBB8] flex items-center justify-center"
                          >
                            {payingOrderId === order.order_id ? (
                              <span className="inline-flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {t('orders.processing')}
                              </span>
                            ) : (
                              t('orders.continuePay', 'Pay Now')
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('orders.pagination.showing', {
                  showing: orders.length,
                  total: totalRecords,
                  page: currentPage,
                  totalPages,
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('orders.previousPage')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#D8CBB8] text-white'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('orders.nextPage')}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 取消订单确认弹窗 */}
      <CancelOrderConfirmModal
        order={orderToCancel!}
        open={showCancelConfirm && !!orderToCancel}
        canceling={cancelingOrderId !== null}
        onConfirm={handleCancelOrder}
        onClose={handleCloseCancelConfirm}
      />

      {/* 订单详情弹窗 */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          orderDetail={orderDetail}
          loading={detailLoading}
          error={detailError}
          onClose={handleCloseDetailModal}
          onCancel={isPendingPayment(selectedOrder) ? handleCancelFromDetail : undefined}
          onContinuePay={canContinuePay(selectedOrder) ? () => handleContinuePay(selectedOrder.order_id) : undefined}
          paying={payingOrderId === selectedOrder.order_id}
        />
      )}
    </div>
  );
}
