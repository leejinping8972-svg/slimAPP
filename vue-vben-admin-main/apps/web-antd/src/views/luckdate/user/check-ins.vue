<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { CheckInRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, Space, Table, Tag } from 'ant-design-vue';

import { queryCheckIns } from '#/api/luckdate';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const records = ref<CheckInRecord[]>([]);
const filters = ref({
  nickname: '',
  date: '',
  userId: String(route.query.userId ?? ''),
});

const columns: TableColumnsType<CheckInRecord> = [
  { title: '用户', key: 'user' },
  { title: '日期', dataIndex: 'date', width: 120 },
  { title: '记录项', key: 'items' },
  { title: '活力分', dataIndex: 'vitalityScore', width: 90 },
  { title: '操作', key: 'action', width: 100 },
];

async function loadData() {
  loading.value = true;
  try {
    const { items } = await queryCheckIns({
      nickname: filters.value.nickname || undefined,
      date: filters.value.date || undefined,
      userId: filters.value.userId || undefined,
    });
    records.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { nickname: '', date: '', userId: '' };
  void loadData();
}

watch(
  () => route.query.userId,
  (v) => {
    filters.value.userId = String(v ?? '');
    void loadData();
  },
);

onMounted(() => void loadData());
</script>

<template>
  <Page title="用户打卡记录">
    <Card class="mb-5">
      <Space wrap>
        <Input
          v-model:value="filters.nickname"
          allow-clear
          placeholder="用户昵称"
          style="width: 160px"
        />
        <Input
          v-model:value="filters.date"
          allow-clear
          placeholder="日期 YYYY-MM-DD"
          style="width: 160px"
        />
        <Input
          v-model:value="filters.userId"
          allow-clear
          placeholder="用户 ID"
          style="width: 140px"
        />
        <Button type="primary" @click="loadData">查询</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="records"
        :loading="loading"
        :locale="{ emptyText: '无匹配打卡记录' }"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div>{{ record.nickname }}</div>
            <div class="text-secondary">{{ record.userId }}</div>
          </template>
          <template v-else-if="column.key === 'items'">
            <Tag v-for="item in record.items" :key="item" class="mb-1 mr-1">
              {{ item }}
            </Tag>
          </template>
          <Button
            v-else-if="column.key === 'action'"
            type="link"
            @click="router.push(`/user/detail/${record.userId}`)"
          >
            用户详情
          </Button>
        </template>
      </Table>
    </Card>
  </Page>
</template>
