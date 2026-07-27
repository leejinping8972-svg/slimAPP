import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:package', order: 10, title: '商品管理' },
    name: 'Product',
    path: '/product',
    children: [
      {
        name: 'ProductList',
        path: 'list',
        component: () => import('#/views/luckdate/product/list.vue'),
        meta: { title: '商品列表' },
      },
      {
        name: 'ProductEdit',
        path: 'edit/:id?',
        component: () => import('#/views/luckdate/product/edit.vue'),
        meta: { hideInMenu: true, title: '商品编辑' },
      },
    ],
  },
];

export default routes;
