import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '首页',
    },
    name: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        name: 'DashboardOverview',
        path: '',
        component: () => import('#/views/luckdate/dashboard/index.vue'),
        meta: {
          affixTab: true,
          title: '数据概览',
        },
      },
    ],
  },
];

export default routes;
