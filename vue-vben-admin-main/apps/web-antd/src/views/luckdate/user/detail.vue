<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { OrderRecord, UserRecord } from '#/views/luckdate/_mock/types';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Result,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';

import {
  getOrderById,
  getUserById,
  linkOrderToUser,
  previewOrdersForLink,
  updateUserRemark,
} from '#/api/luckdate';
import { LOGISTICS_STATUS_LABEL, maskPhone } from '#/views/luckdate/_mock/store';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const user = ref<UserRecord>();
const linkedOrders = ref<OrderRecord[]>([]);
const remark = ref('');
const linkModalOpen = ref(false);
const previewLoading = ref(false);
const linking = ref(false);
const linkName = ref('');
const phoneLast4 = ref('');
const previewOrders = ref<OrderRecord[]>([]);
const selectedOrderIds = ref<string[]>([]);

const userId = computed(() => String(route.params.id ?? ''));
const linkedOrderColumns: TableColumnsType<OrderRecord> = [
  { title: '订单号', dataIndex: 'orderNo' },
  { title: '商品', dataIndex: 'productName' },
  { title: '下单时间', dataIndex: 'orderedAt', key: 'orderedAt' },
  { title: '物流状态', dataIndex: 'logisticsStatus', key: 'logisticsStatus' },
];
const previewOrderColumns: TableColumnsType<OrderRecord> = [
  { title: '订单号', dataIndex: 'orderNo' },
  { title: '商品', dataIndex: 'productName' },
  { title: '下单时间', dataIndex: 'orderedAt', key: 'orderedAt' },
  { title: '物流状态', dataIndex: 'logisticsStatus', key: 'logisticsStatus' },
];
const linkRowSelection = computed(() => ({
  type: 'radio' as const,
  selectedRowKeys: selectedOrderIds.value,
  onChange: (keys: (number | string)[]) => {
    selectedOrderIds.value = keys.map(String);
  },
}));

async function loadUser() {
  loading.value = true;
  try {
    const currentUser = await getUserById(userId.value);
    user.value = currentUser;
    remark.value = currentUser?.remark ?? '';
    linkedOrders.value = (
      await Promise.all(
        (currentUser?.linkedOrderIds ?? []).map((id) => getOrderById(id)),
      )
    ).filter((order): order is OrderRecord => Boolean(order));
  } finally {
    loading.value = false;
  }
}

function goBack() {
  void router.push('/user/list');
}

async function saveRemark() {
  const updatedUser = await updateUserRemark(userId.value, remark.value.trim());
  if (!updatedUser) {
    message.error('用户不存在，保存失败');
    return;
  }
  user.value = updatedUser;
  message.success('备注已保存');
}

function openLinkModal() {
  linkName.value = '';
  phoneLast4.value = '';
  previewOrders.value = [];
  selectedOrderIds.value = [];
  linkModalOpen.value = true;
}

async function previewLinkOrders() {
  if (!linkName.value.trim() || phoneLast4.value.length !== 4) {
    message.warning('请输入姓名和 4 位手机尾号');
    return;
  }
  previewLoading.value = true;
  try {
    const { items } = await previewOrdersForLink(linkName.value.trim(), phoneLast4.value);
    previewOrders.value = items;
    selectedOrderIds.value = [];
    if (items.length === 0) {
      message.info('未找到可关联订单');
    }
  } finally {
    previewLoading.value = false;
  }
}

async function confirmLink() {
  const orderId = selectedOrderIds.value[0];
  if (!orderId) {
    message.warning('请选择一笔订单');
    return;
  }
  linking.value = true;
  try {
    const success = await linkOrderToUser(userId.value, orderId);
    if (!success) {
      message.error('关联失败，用户不存在');
      return;
    }
    message.success('订单关联成功');
    linkModalOpen.value = false;
    await loadUser();
  } finally {
    linking.value = false;
  }
}

onMounted(() => void loadUser());
</script>

<template>
  <Page title="用户详情">
    <Card :loading="loading">
      <template #extra>
        <Space>
          <Button type="primary" @click="openLinkModal">协助关联订单</Button>
          <Button @click="goBack">返回列表</Button>
        </Space>
      </template>

      <Result v-if="!loading && !user" status="404" title="用户不存在">
        <template #extra>
          <Button type="primary" @click="goBack">返回用户列表</Button>
        </template>
      </Result>

      <template v-else-if="user">
        <Descriptions bordered :column="{ lg: 2, md: 2, sm: 1, xs: 1 }" title="基本信息">
          <Descriptions.Item label="用户 ID">{{ user.id }}</Descriptions.Item>
          <Descriptions.Item label="账号状态">
            <Tag :color="user.accountStatus === 'active' ? 'green' : 'default'">
              {{ user.accountStatus === 'active' ? '正常' : '已停用' }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="昵称">{{ user.nickname || '-' }}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{{ user.email || '-' }}</Descriptions.Item>
          <Descriptions.Item label="手机">{{ maskPhone(user.phone) }}</Descriptions.Item>
          <Descriptions.Item label="地区">{{ user.region }}</Descriptions.Item>
          <Descriptions.Item label="身高 / 体重">
            {{ user.heightCm ?? '-' }} cm / {{ user.weightKg ?? '-' }} kg
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {{ new Date(user.registeredAt).toLocaleString() }}
          </Descriptions.Item>
        </Descriptions>

        <Card class="mt-5" title="已关联订单">
          <Table
            :columns="linkedOrderColumns"
            :data-source="linkedOrders"
            :pagination="false"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'orderedAt'">
                {{ new Date(record.orderedAt).toLocaleString() }}
              </template>
              <Tag v-else-if="column.key === 'logisticsStatus'">
                {{ LOGISTICS_STATUS_LABEL[record.logisticsStatus] }}
              </Tag>
            </template>
          </Table>
        </Card>

        <Card class="mt-5" title="近 7 日打卡摘要">
          暂无可展示的打卡记录。
        </Card>

        <Card class="mt-5" title="备注">
          <Space direction="vertical" style="width: 100%">
            <Input.TextArea v-model:value="remark" :rows="3" placeholder="添加用户备注" />
            <Button style="align-self: flex-start" type="primary" @click="saveRemark">保存备注</Button>
          </Space>
        </Card>
      </template>
    </Card>

    <Modal
      v-model:open="linkModalOpen"
      :confirm-loading="linking"
      :ok-button-props="{ disabled: selectedOrderIds.length !== 1 }"
      ok-text="确认关联"
      title="协助关联订单"
      @ok="confirmLink"
    >
      <Space class="mb-4" wrap>
        <Input v-model:value="linkName" allow-clear placeholder="订单姓名" style="width: 180px" />
        <Input
          v-model:value="phoneLast4"
          allow-clear
          maxlength="4"
          placeholder="手机后四位"
          style="width: 140px"
          @press-enter="previewLinkOrders"
        />
        <Button :loading="previewLoading" type="primary" @click="previewLinkOrders">查询订单</Button>
      </Space>
      <Table
        :columns="previewOrderColumns"
        :data-source="previewOrders"
        :loading="previewLoading"
        :pagination="false"
        :row-selection="linkRowSelection"
        row-key="id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderedAt'">
            {{ new Date(record.orderedAt).toLocaleString() }}
          </template>
          <Tag v-else-if="column.key === 'logisticsStatus'">
            {{ LOGISTICS_STATUS_LABEL[record.logisticsStatus] }}
          </Tag>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
