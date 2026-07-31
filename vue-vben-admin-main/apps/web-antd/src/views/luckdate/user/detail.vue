<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type {
  CheckInRecord,
  ExternalOrderRecord,
  UserRecord,
} from '#/views/luckdate/_mock/types';

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
  bindExternalOrderToUser,
  getUserById,
  previewExternalOrders,
  queryCheckIns,
  updateUserRemark,
} from '#/api/luckdate';
import {
  BIND_STATUS_LABEL,
  maskPhone,
} from '#/views/luckdate/_mock/store';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const user = ref<UserRecord>();
const remark = ref('');
const recentCheckIns = ref<CheckInRecord[]>([]);
const linkModalOpen = ref(false);
const previewLoading = ref(false);
const linking = ref(false);
const linkName = ref('');
const phoneLast4 = ref('');
const previewOrders = ref<ExternalOrderRecord[]>([]);
const selectedOrderIds = ref<string[]>([]);

const userId = computed(() => String(route.params.id ?? ''));

const previewColumns: TableColumnsType<ExternalOrderRecord> = [
  { title: '外部单号', dataIndex: 'orderNo' },
  { title: '客户', dataIndex: 'customerName' },
  { title: '产品', dataIndex: 'productName' },
  { title: '产品 ID', dataIndex: 'productId' },
];

const checkInColumns: TableColumnsType<CheckInRecord> = [
  { title: '日期', dataIndex: 'date' },
  { title: '记录项', key: 'items' },
  { title: '活力分', dataIndex: 'vitalityScore', width: 90 },
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
    const { items } = await queryCheckIns({ userId: userId.value });
    recentCheckIns.value = items.slice(0, 5);
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
    const { items } = await previewExternalOrders(
      linkName.value.trim(),
      phoneLast4.value,
    );
    previewOrders.value = items;
    selectedOrderIds.value = [];
    if (items.length === 0) {
      message.info('未命中外部订单');
    }
  } finally {
    previewLoading.value = false;
  }
}

async function confirmLink() {
  const orderId = selectedOrderIds.value[0];
  if (!orderId) {
    message.warning('请选择一笔外部订单');
    return;
  }
  linking.value = true;
  try {
    const result = await bindExternalOrderToUser(userId.value, orderId);
    if (!result.ok) {
      message.error(result.message);
      return;
    }
    message.success(result.message);
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
          <Button type="primary" @click="openLinkModal">协助外部查单绑定</Button>
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
              {{ user.accountStatus === 'active' ? '启用' : '停用' }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="昵称">{{ user.nickname || '-' }}</Descriptions.Item>
          <Descriptions.Item label="账号">
            {{ user.email || maskPhone(user.phone) }}
          </Descriptions.Item>
          <Descriptions.Item label="地区">{{ user.region }}</Descriptions.Item>
          <Descriptions.Item label="身高 / 体重">
            {{ user.heightCm ?? '—' }} / {{ user.weightKg ?? '—' }}
          </Descriptions.Item>
          <Descriptions.Item label="提醒时间">{{ user.reminderTime || '—' }}</Descriptions.Item>
          <Descriptions.Item label="绑定状态">
            <Tag :color="user.bindStatus === 'bound' ? 'green' : 'default'">
              {{ BIND_STATUS_LABEL[user.bindStatus] }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="方案进度">
            {{ user.planDay != null ? `Day ${user.planDay}` : '未开通' }}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {{ user.registeredAt.slice(0, 10) }}
          </Descriptions.Item>
        </Descriptions>

        <Card class="mt-5" title="已绑定产品">
          <template v-if="user.bindStatus === 'bound'">
            <Descriptions bordered :column="2" size="small">
              <Descriptions.Item label="外部单号">
                {{ user.linkedOrderNo || '—' }}
              </Descriptions.Item>
              <Descriptions.Item label="产品 ID">
                {{ user.linkedProductId }}
              </Descriptions.Item>
              <Descriptions.Item label="产品名称" :span="2">
                {{ user.linkedProductName }}
              </Descriptions.Item>
              <Descriptions.Item label="方案" :span="2">
                <Tag :color="user.planId ? 'green' : 'default'">
                  {{
                    user.planId
                      ? '已开通'
                      : '未开通（产品不在方案配置内）'
                  }}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </template>
          <div v-else class="text-secondary">
            暂无绑定产品。可通过「协助外部查单绑定」写入关联产品。
          </div>
        </Card>

        <Card class="mt-5" title="近期打卡">
          <template #extra>
            <Button type="link" @click="router.push(`/user/check-ins?userId=${userId}`)">
              查看全部
            </Button>
          </template>
          <Table
            :columns="checkInColumns"
            :data-source="recentCheckIns"
            :locale="{ emptyText: '暂无打卡记录' }"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'items'">
                {{ record.items.join('、') }}
              </template>
            </template>
          </Table>
        </Card>

        <Card class="mt-5" title="备注">
          <Space direction="vertical" style="width: 100%">
            <Input.TextArea v-model:value="remark" :rows="3" placeholder="添加用户备注" />
            <Button style="align-self: flex-start" type="primary" @click="saveRemark">
              保存备注
            </Button>
          </Space>
        </Card>
      </template>
    </Card>

    <Modal
      v-model:open="linkModalOpen"
      :confirm-loading="linking"
      :ok-button-props="{ disabled: selectedOrderIds.length !== 1 }"
      ok-text="确认绑定"
      title="协助外部查单绑定"
      width="640px"
      @ok="confirmLink"
    >
      <p class="text-secondary mb-3">
        按客户姓名 + 手机后四位预览外部订单；确认后写入用户关联产品。若产品 ID 属于
        slim_plan_product_ids，则开通 28 天方案。
      </p>
      <Space class="mb-4" wrap>
        <Input v-model:value="linkName" allow-clear placeholder="客户姓名" style="width: 180px" />
        <Input
          v-model:value="phoneLast4"
          allow-clear
          maxlength="4"
          placeholder="手机后四位"
          style="width: 140px"
          @press-enter="previewLinkOrders"
        />
        <Button :loading="previewLoading" type="primary" @click="previewLinkOrders">
          预览命中订单
        </Button>
      </Space>
      <Table
        :columns="previewColumns"
        :data-source="previewOrders"
        :loading="previewLoading"
        :pagination="false"
        :row-selection="linkRowSelection"
        row-key="id"
        size="small"
      />
    </Modal>
  </Page>
</template>
