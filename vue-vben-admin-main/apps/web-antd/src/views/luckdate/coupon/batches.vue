<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { CouponBatchRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Table } from 'ant-design-vue';
import dayjs from 'dayjs';

import { queryCouponBatches } from '#/api/luckdate';

const loading = ref(false);
const batches = ref<CouponBatchRecord[]>([]);
const columns: TableColumnsType<CouponBatchRecord> = [
  { title: '批次 ID', dataIndex: 'id' },
  { title: '券名', dataIndex: 'couponName' },
  { title: '发放人数', dataIndex: 'userCount' },
  { title: '发放时间', key: 'createdAt' },
];

async function loadBatches() {
  loading.value = true;
  try {
    const { items } = await queryCouponBatches();
    batches.value = items;
  } finally {
    loading.value = false;
  }
}

onMounted(() => void loadBatches());
</script>

<template>
  <Page title="批量发放列表">
    <Card>
      <Table
        :columns="columns"
        :data-source="batches"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'createdAt'">
            {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm') }}
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>
