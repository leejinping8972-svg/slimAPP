import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:shield-check', order: 10, title: '管理员配置' },
    name: 'Admin',
    path: '/admin',
    children: [
      {
        name: 'AdminList',
        path: 'list',
        component: () => import('#/views/luckdate/admin/list.vue'),
        meta: { title: '管理员列表' },
      },
      {
        name: 'RoleList',
        path: 'roles',
        component: () => import('#/views/luckdate/admin/roles.vue'),
        meta: { title: '角色列表' },
      },
    ],
  },
];

export default routes;
