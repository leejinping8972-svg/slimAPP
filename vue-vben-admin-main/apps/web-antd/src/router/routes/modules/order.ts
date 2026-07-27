import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:shopping-cart', order: 20, title: '订单管理' },
    name: 'Order',
    path: '/order',
    children: [
      {
        name: 'OrderList',
        path: 'list',
        component: () => import('#/views/luckdate/order/list.vue'),
        meta: { title: '订单列表' },
      },
      {
        name: 'OrderDetail',
        path: 'detail/:id',
        component: () => import('#/views/luckdate/order/detail.vue'),
        meta: { hideInMenu: true, title: '订单详情' },
      },
    ],
  },
];

export default routes;
