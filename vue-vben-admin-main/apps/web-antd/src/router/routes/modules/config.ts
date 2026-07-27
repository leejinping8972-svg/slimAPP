import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:settings', order: 40, title: '基础设置' },
    name: 'SystemConfig',
    path: '/system',
    children: [
      {
        name: 'SystemConfigIndex',
        path: 'config',
        component: () => import('#/views/luckdate/config/index.vue'),
        meta: { title: '系统配置' },
      },
    ],
  },
];

export default routes;
