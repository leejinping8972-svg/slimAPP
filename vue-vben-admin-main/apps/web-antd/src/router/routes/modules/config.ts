import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:settings', order: 40, title: '系统设置' },
    name: 'Config',
    path: '/config',
    children: [
      {
        name: 'ConfigList',
        path: 'list',
        component: () => import('#/views/luckdate/config/index.vue'),
        meta: { title: '基础设置' },
      },
    ],
  },
];

export default routes;
