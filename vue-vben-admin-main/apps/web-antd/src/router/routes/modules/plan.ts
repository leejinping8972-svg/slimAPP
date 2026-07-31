import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: { icon: 'lucide:calendar-range', order: 30, title: '方案列表' },
    name: 'Plan',
    path: '/plan',
    children: [
      {
        name: 'PlanBoard',
        path: 'list',
        component: () => import('#/views/luckdate/plan/list.vue'),
        meta: { title: '方案看板' },
      },
    ],
  },
];

export default routes;
