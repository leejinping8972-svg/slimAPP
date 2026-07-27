<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import type { TableColumnsType } from 'ant-design-vue';
import type { UserRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, DatePicker, Select, Space, Table } from 'ant-design-vue';

import { queryUsers } from '#/api/luckdate';
import { maskPhone } from '#/views/luckdate/_mock/store';

const router = useRouter();
const loading = ref(false);
const users = ref<UserRecord[]>([]);
const dateRange = ref<[Dayjs, Dayjs]>();
const filters = ref<{
  accountStatus?: UserRecord['accountStatus'];
  region?: string;
}>({});

const regions = ['California', 'Texas', 'New York', 'Florida', 'Washington', 'Oregon'];
const columns: TableColumnsType<UserRecord> = [
  { title: '用户 ID', dataIndex: 'id' },
  { title: '昵称 / 联系方式', key: 'contact' },
  { title: '地区', dataIndex: 'region' },
  { title: '身高 / 体重', key: 'bodyMetrics' },
  { title: '注册时间', dataIndex: 'registeredAt', key: 'registeredAt' },
  { title: '操作', key: 'action', width: 100 },
];

async function loadUsers() {
  loading.value = true;
  try {
    const { items } = await queryUsers({
      ...filters.value,
      registeredFrom: dateRange.value?.[0]?.startOf('day').toISOString(),
      registeredTo: dateRange.value?.[1]?.endOf('day').toISOString(),
    });
    users.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {};
  dateRange.value = undefined;
  void loadUsers();
}

function goToDetail(id: string) {
  void router.push(`/user/detail/${id}`);
}

onMounted(() => void loadUsers());
</script>

<template>
  <Page title="用户列表">
    <Card class="mb-5">
      <Space wrap>
        <DatePicker.RangePicker v-model:value="dateRange" style="width: 250px" />
        <Select
          v-model:value="filters.region"
          allow-clear
          placeholder="地区"
          style="width: 140px"
        >
          <Select.Option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </Select.Option>
        </Select>
        <Select
          v-model:value="filters.accountStatus"
          allow-clear
          placeholder="账号状态"
          style="width: 130px"
        >
          <Select.Option value="active">正常</Select.Option>
          <Select.Option value="disabled">已停用</Select.Option>
        </Select>
        <Button type="primary" @click="loadUsers">查询</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'contact'">
            <div>{{ record.nickname || record.email }}</div>
            <div class="text-secondary">{{ record.email || maskPhone(record.phone) }}</div>
          </template>
          <template v-else-if="column.key === 'bodyMetrics'">
            {{ record.heightCm ?? '-' }} cm / {{ record.weightKg ?? '-' }} kg
          </template>
          <template v-else-if="column.key === 'registeredAt'">
            {{ new Date(record.registeredAt).toLocaleString() }}
          </template>
          <Button v-else-if="column.key === 'action'" type="link" @click="goToDetail(record.id)">
            查看详情
          </Button>
        </template>
      </Table>
    </Card>
  </Page>
</template>
