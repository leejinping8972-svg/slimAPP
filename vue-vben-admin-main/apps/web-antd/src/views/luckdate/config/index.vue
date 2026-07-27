<script lang="ts" setup>
import type { FormInstance, Rule, TableColumnsType } from 'ant-design-vue';
import type { ConfigRecord } from '#/api/luckdate';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Form, Input, Modal, Table, message } from 'ant-design-vue';

import { queryConfigs, updateConfig } from '#/api/luckdate';

const REQUIRED_CODES = [
  'slim_plan_product_ids',
  'repurchase_recommend_product_ids',
  'register_gift_coupon_ids',
] as const;

const formRef = ref<FormInstance>();
const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const configs = ref<ConfigRecord[]>([]);
const form = reactive({ code: '', description: '', value: '', unit: '' });

const columns: TableColumnsType<ConfigRecord> = [
  { title: '编码', dataIndex: 'code' },
  { title: '说明', dataIndex: 'description' },
  { title: '值', dataIndex: 'value' },
  { title: '单位', dataIndex: 'unit', key: 'unit' },
  { title: '操作', key: 'action', width: 100 },
];

const rules: Record<string, Rule[]> = {
  value: [{ required: true, message: '请输入配置值' }],
};

function normalizeCommaValue(value: string): string {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(',');
}

async function loadData() {
  loading.value = true;
  try {
    const { items } = await queryConfigs();
    const order = new Map(REQUIRED_CODES.map((code, index) => [code, index]));
    configs.value = items
      .sort(
        (a, b) =>
          (order.get(a.code as (typeof REQUIRED_CODES)[number]) ??
            REQUIRED_CODES.length) -
          (order.get(b.code as (typeof REQUIRED_CODES)[number]) ??
            REQUIRED_CODES.length),
      );
  } finally {
    loading.value = false;
  }
}

function openEdit(config: ConfigRecord) {
  Object.assign(form, {
    code: config.code,
    description: config.description,
    value: config.value,
    unit: config.unit ?? '',
  });
  modalOpen.value = true;
}

async function submit() {
  await formRef.value?.validate();
  saving.value = true;
  try {
    const normalizedValue = normalizeCommaValue(form.value);
    const updated = await updateConfig(form.code, normalizedValue);
    if (!updated) {
      message.error('配置不存在，保存失败');
      return;
    }
    message.success('配置已保存');
    modalOpen.value = false;
    await loadData();
  } finally {
    saving.value = false;
  }
}

onMounted(() => void loadData());
</script>

<template>
  <Page title="系统配置">
    <Card>
      <Table
        :columns="columns"
        :data-source="configs"
        :loading="loading"
        :pagination="false"
        row-key="code"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'unit'">{{ record.unit || '-' }}</template>
          <Button v-else-if="column.key === 'action'" type="link" @click="openEdit(record)">
            编辑
          </Button>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      title="编辑配置"
      width="560px"
      @ok="submit"
    >
      <Form ref="formRef" :label-col="{ span: 5 }" :model="form" :rules="rules">
        <Form.Item label="编码">
          <Input :value="form.code" disabled />
        </Form.Item>
        <Form.Item label="说明">
          <Input :value="form.description" disabled />
        </Form.Item>
        <Form.Item label="值" name="value">
          <Input
            v-model:value="form.value"
            placeholder="多个 ID 用英文逗号分隔，如 p1,p2"
          />
        </Form.Item>
        <Form.Item label="单位">
          <Input :value="form.unit || '-'" disabled />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
