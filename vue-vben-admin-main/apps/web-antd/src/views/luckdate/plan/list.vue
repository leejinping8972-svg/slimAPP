<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { PlanRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Col, Input, Row, Select, Space, Statistic, Table, Tag } from 'ant-design-vue';

import { getPlanDashboardStats, queryPlans } from '#/api/luckdate';
import { PLAN_STATUS_LABEL, getUserById } from '#/views/luckdate/_mock/store';

const router = useRouter();
const loading = ref(false);
const plans = ref<PlanRecord[]>([]);
const stats = ref({
  active: 0,
  awaiting: 0,
  completed: 0,
  checkInsToday: 0,
  completionRate: 0,
});
const filters = ref<{
  nickname?: string;
  status?: PlanRecord['status'];
  startFrom?: string;
}>({});

const statusColor: Record<PlanRecord['status'], string> = {
  active: 'green',
  completed: 'blue',
  awaiting: 'orange',
};

const columns: TableColumnsType<PlanRecord> = [
  { title: '方案 ID', dataIndex: 'id', width: 120 },
  { title: '用户', key: 'user' },
  { title: '当前天数', key: 'day', width: 100 },
  { title: '状态', key: 'status', width: 100 },
  { title: '开始日期', dataIndex: 'startDate', width: 120 },
  { title: '关联产品', key: 'product' },
  { title: '操作', key: 'action', width: 90 },
];

function hasUser(userId: string) {
  return Boolean(getUserById(userId));
}

async function loadData() {
  loading.value = true;
  try {
    stats.value = await getPlanDashboardStats();
    const { items } = await queryPlans({ ...filters.value });
    plans.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {};
  void loadData();
}

onMounted(() => void loadData());
</script>

<template>
  <Page title="28 天方案看板">
    <Row :gutter="16" class="mb-5">
      <Col :md="6" :sm="12" :xs="24">
        <Card><Statistic title="进行中方案" :value="stats.active" /></Card>
      </Col>
      <Col :md="6" :sm="12" :xs="24">
        <Card><Statistic title="待收货" :value="stats.awaiting" /></Card>
      </Col>
      <Col :md="6" :sm="12" :xs="24">
        <Card><Statistic title="今日打卡" :value="stats.checkInsToday" /></Card>
      </Col>
      <Col :md="6" :sm="12" :xs="24">
        <Card>
          <Statistic title="完成率" :value="stats.completionRate" suffix="%" />
        </Card>
      </Col>
    </Row>

    <Card title="方案实例">
      <template #extra>
        <span class="text-secondary">已完成 {{ stats.completed }} · 合计 {{ plans.length }}</span>
      </template>
      <Space class="mb-4" wrap>
        <Input
          v-model:value="filters.nickname"
          allow-clear
          placeholder="用户昵称"
          style="width: 160px"
        />
        <Select
          v-model:value="filters.status"
          allow-clear
          placeholder="方案状态"
          style="width: 140px"
        >
          <Select.Option value="active">进行中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="awaiting">待收货</Select.Option>
        </Select>
        <Input
          v-model:value="filters.startFrom"
          allow-clear
          placeholder="开始日期起 YYYY-MM-DD"
          style="width: 200px"
        />
        <Button type="primary" @click="loadData">查询</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>

      <Table
        :columns="columns"
        :data-source="plans"
        :loading="loading"
        :locale="{ emptyText: '无匹配方案' }"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div>{{ record.nickname }}</div>
            <div class="text-secondary">{{ record.userId }}</div>
          </template>
          <template v-else-if="column.key === 'day'">Day {{ record.day }}</template>
          <Tag v-else-if="column.key === 'status'" :color="statusColor[record.status]">
            {{ PLAN_STATUS_LABEL[record.status] }}
          </Tag>
          <template v-else-if="column.key === 'product'">
            {{ record.productName }}
            <code class="ml-1">{{ record.productId }}</code>
          </template>
          <Button
            v-else-if="column.key === 'action' && hasUser(record.userId)"
            type="link"
            @click="router.push(`/user/detail/${record.userId}`)"
          >
            用户
          </Button>
          <span v-else-if="column.key === 'action'" class="text-secondary">—</span>
        </template>
      </Table>
    </Card>
  </Page>
</template>
