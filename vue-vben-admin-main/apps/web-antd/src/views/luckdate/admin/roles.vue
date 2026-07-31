<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Table, Tag } from 'ant-design-vue';

import { queryRoles } from '#/api/luckdate';

interface RoleRow {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  adminCount: number;
}

const loading = ref(false);
const roles = ref<RoleRow[]>([]);

const columns: TableColumnsType<RoleRow> = [
  { title: '角色', dataIndex: 'name', width: 140 },
  { title: '说明', dataIndex: 'description' },
  { title: '权限范围', key: 'permissions' },
  { title: '关联管理员数', dataIndex: 'adminCount', width: 120 },
];

async function loadRoles() {
  loading.value = true;
  try {
    const { items } = await queryRoles();
    roles.value = items;
  } finally {
    loading.value = false;
  }
}

onMounted(() => void loadRoles());
</script>

<template>
  <Page title="角色列表">
    <Card>
      <p class="text-secondary mb-4">演示级角色说明，正式环境可接入细粒度 RBAC。</p>
      <Table
        :columns="columns"
        :data-source="roles"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'permissions'">
            <Tag v-for="p in record.permissions" :key="p" class="mb-1 mr-1">{{ p }}</Tag>
          </template>
        </template>
      </Table>
    </Card>
  </Page>
</template>
