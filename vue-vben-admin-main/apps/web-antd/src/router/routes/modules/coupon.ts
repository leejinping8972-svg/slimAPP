import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:ticket', order: 30, title: '优惠券管理' },
    name: 'Coupon',
    path: '/coupon',
    children: [
      {
        name: 'CouponList',
        path: 'list',
        component: () => import('#/views/luckdate/coupon/list.vue'),
        meta: { title: '优惠券列表' },
      },
      {
        name: 'CouponBatches',
        path: 'batches',
        component: () => import('#/views/luckdate/coupon/batches.vue'),
        meta: { title: '批量发放列表' },
      },
    ],
  },
];

export default routes;
