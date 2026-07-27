<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Card, Col, Row, Statistic } from 'ant-design-vue';

import { getDashboardStats } from '#/api/luckdate';

interface DashboardStats {
  couponIssued: number;
  couponUsed: number;
  todayOrders: number;
  todayRegister: number;
}

type StatKey = keyof DashboardStats;

const router = useRouter();

const stats = ref<DashboardStats>({
  todayRegister: 0,
  todayOrders: 0,
  couponIssued: 0,
  couponUsed: 0,
});

const cards: Array<{ key: StatKey; path: string; title: string }> = [
  { key: 'todayRegister', title: '今日注册', path: '/user/list' },
  { key: 'todayOrders', title: '今日订单', path: '/order/list' },
  { key: 'couponIssued', title: '券发放', path: '/coupon/list' },
  { key: 'couponUsed', title: '券使用', path: '/coupon/list' },
];

function navigate(path: string) {
  router.push(path);
}

onMounted(async () => {
  stats.value = await getDashboardStats();
});
</script>

<template>
  <Page title="数据概览">
    <Row :gutter="[16, 16]">
      <Col v-for="card in cards" :key="card.key" :lg="6" :md="12" :xs="24">
        <Card
          class="cursor-pointer"
          hoverable
          @click="navigate(card.path)"
        >
          <Statistic :title="card.title" :value="stats[card.key]" />
        </Card>
      </Col>
    </Row>
  </Page>
</template>
