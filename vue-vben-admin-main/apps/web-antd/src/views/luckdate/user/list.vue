<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { UserRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, Select, Space, Table, Tag } from 'ant-design-vue';

import { queryUsers } from '#/api/luckdate';
import {
  BIND_STATUS_LABEL,
  maskPhone,
} from '#/views/luckdate/_mock/store';

const router = useRouter();
const loading = ref(false);
const users = ref<UserRecord[]>([]);
const filters = ref<{
  accountStatus?: UserRecord['accountStatus'];
  bindStatus?: UserRecord['bindStatus'];
  region?: string;
}>({});

const columns: TableColumnsType<UserRecord> = [
  { title: '用户 ID', dataIndex: 'id' },
  { title: '昵称 / 联系方式', key: 'contact' },
  { title: '地区', dataIndex: 'region' },
  { title: '身高 / 体重', key: 'bodyMetrics' },
  { title: '绑定', key: 'bindStatus', width: 100 },
  { title: '方案天数', key: 'planDay', width: 100 },
  { title: '注册时间', dataIndex: 'registeredAt', key: 'registeredAt' },
  { title: '操作', key: 'action', width: 100 },
];

async function loadUsers() {
  loading.value = true;
  try {
    const { items } = await queryUsers({ ...filters.value });
    users.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {};
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
        <Input
          v-model:value="filters.region"
          allow-clear
          placeholder="地区"
          style="width: 140px"
        />
        <Select
          v-model:value="filters.accountStatus"
          allow-clear
          placeholder="账号状态"
          style="width: 130px"
        >
          <Select.Option value="active">启用</Select.Option>
          <Select.Option value="disabled">停用</Select.Option>
        </Select>
        <Select
          v-model:value="filters.bindStatus"
          allow-clear
          placeholder="绑定状态"
          style="width: 130px"
        >
          <Select.Option value="bound">已绑定</Select.Option>
          <Select.Option value="unbound">未绑定</Select.Option>
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
            <div>{{ record.nickname }}</div>
            <div class="text-secondary">{{ record.email || maskPhone(record.phone) }}</div>
          </template>
          <template v-else-if="column.key === 'bodyMetrics'">
            {{ record.heightCm ? `${record.heightCm} cm` : '—' }}
            /
            {{ record.weightKg ? `${record.weightKg} kg` : '—' }}
          </template>
          <Tag
            v-else-if="column.key === 'bindStatus'"
            :color="record.bindStatus === 'bound' ? 'green' : 'default'"
          >
            {{ BIND_STATUS_LABEL[record.bindStatus] }}
          </Tag>
          <template v-else-if="column.key === 'planDay'">
            {{ record.planDay != null ? `Day ${record.planDay}` : '—' }}
          </template>
          <template v-else-if="column.key === 'registeredAt'">
            {{ record.registeredAt.slice(0, 10) }}
          </template>
          <Button v-else-if="column.key === 'action'" type="link" @click="goToDetail(record.id)">
            查看详情
          </Button>
        </template>
      </Table>
    </Card>
  </Page>
</template>
