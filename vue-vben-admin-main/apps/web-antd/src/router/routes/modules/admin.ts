import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:shield-check', order: 60, title: '管理员管理' },
    name: 'Admin',
    path: '/admin',
    children: [
      {
        name: 'AdminList',
        path: 'list',
        component: () => import('#/views/luckdate/admin/list.vue'),
        meta: { title: '账号与权限' },
      },
    ],
  },
];

export default routes;
