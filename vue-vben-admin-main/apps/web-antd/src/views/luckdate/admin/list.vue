<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { AdminRecord } from '#/api/luckdate';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Switch, Table, message } from 'ant-design-vue';

import { queryAdmins, setAdminEnabled } from '#/api/luckdate';
import { getRoleName } from '#/views/luckdate/_mock/store';

const loading = ref(false);
const admins = ref<AdminRecord[]>([]);

const columns: TableColumnsType<AdminRecord> = [
  { title: '用户名', dataIndex: 'username' },
  { title: '角色', key: 'role' },
  { title: '启用', key: 'enabled', width: 100 },
  { title: '操作', key: 'action', width: 100 },
];

async function loadAdmins() {
  loading.value = true;
  try {
    const { items } = await queryAdmins();
    admins.value = items;
  } finally {
    loading.value = false;
  }
}

async function toggleEnabled(record: AdminRecord, enabled: boolean) {
  const updated = await setAdminEnabled(record.id, enabled);
  if (!updated) {
    message.error('管理员不存在，更新失败');
    await loadAdmins();
    return;
  }
  record.enabled = enabled;
  message.success(enabled ? '账号已启用' : '账号已停用');
}

onMounted(() => void loadAdmins());
</script>

<template>
  <Page title="管理员列表">
    <Card>
      <Table
        :columns="columns"
        :data-source="admins"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            {{ getRoleName(record.roleId) }}
          </template>
          <Switch
            v-else-if="column.key === 'enabled'"
            :checked="record.enabled"
            checked-children="启用"
            un-checked-children="停用"
            @change="(checked) => toggleEnabled(record, Boolean(checked))"
          />
          <span v-else-if="column.key === 'action'" class="text-secondary">—</span>
        </template>
      </Table>
    </Card>
  </Page>
</template>
