import type { RouteRecordRaw } from 'vue-router';

/** 默认落地到方案看板（无电商首页） */
const routes: RouteRecordRaw[] = [
  {
    meta: {
      hideInMenu: true,
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: '首页',
    },
    name: 'Dashboard',
    path: '/dashboard',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        redirect: '/plan/list',
        meta: { affixTab: true, title: '概览' },
      },
    ],
  },
];

export default routes;
