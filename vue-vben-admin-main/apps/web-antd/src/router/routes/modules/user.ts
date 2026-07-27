import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:users', order: 50, title: '用户管理' },
    name: 'User',
    path: '/user',
    children: [
      {
        name: 'UserList',
        path: 'list',
        component: () => import('#/views/luckdate/user/list.vue'),
        meta: { title: '用户列表' },
      },
      {
        name: 'UserDetail',
        path: 'detail/:id',
        component: () => import('#/views/luckdate/user/detail.vue'),
        meta: { hideInMenu: true, title: '用户详情' },
      },
    ],
  },
];

export default routes;
