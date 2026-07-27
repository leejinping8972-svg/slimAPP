<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import type { TableColumnsType } from 'ant-design-vue';
import type { OrderRecord } from '#/views/luckdate/_mock/types';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, DatePicker, Input, Select, Space, Table, Tag } from 'ant-design-vue';

import { queryOrders } from '#/api/luckdate';
import {
  LOGISTICS_STATUS_LABEL,
  maskPhone,
  ORDER_STATUS_LABEL,
  type LogisticsStatus,
  type OrderStatus,
} from '#/views/luckdate/_mock/store';

const router = useRouter();
const loading = ref(false);
const orders = ref<OrderRecord[]>([]);
const dateRange = ref<[Dayjs, Dayjs]>();
const filters = ref<{
  customerName?: string;
  logisticsStatus?: LogisticsStatus;
  orderNo?: string;
  orderStatus?: OrderStatus;
  phoneLast4?: string;
  region?: string;
}>({});

const columns: TableColumnsType<OrderRecord> = [
  { title: '订单号', dataIndex: 'orderNo' },
  { title: '客户姓名', dataIndex: 'customerName' },
  { title: '手机', dataIndex: 'phone', key: 'phone' },
  { title: '商品', dataIndex: 'productName' },
  { title: '订单状态', dataIndex: 'orderStatus', key: 'orderStatus' },
  { title: '物流状态', dataIndex: 'logisticsStatus', key: 'logisticsStatus' },
  { title: '下单时间', dataIndex: 'orderedAt', key: 'orderedAt' },
  { title: '地区', dataIndex: 'region' },
  { title: '操作', key: 'action', width: 100 },
];

async function loadOrders() {
  loading.value = true;
  try {
    const { items } = await queryOrders({
      ...filters.value,
      orderedFrom: dateRange.value?.[0]?.startOf('day').toISOString(),
      orderedTo: dateRange.value?.[1]?.endOf('day').toISOString(),
    });
    orders.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {};
  dateRange.value = undefined;
  void loadOrders();
}

function goToDetail(id: string) {
  void router.push(`/order/detail/${id}`);
}

onMounted(() => void loadOrders());
</script>

<template>
  <Page title="订单列表">
    <Card class="mb-5">
      <Space wrap>
        <DatePicker.RangePicker v-model:value="dateRange" style="width: 250px" />
        <Select
          v-model:value="filters.orderStatus"
          allow-clear
          placeholder="订单状态"
          style="width: 120px"
        >
          <Select.Option value="unpaid">未支付</Select.Option>
          <Select.Option value="paid">已付款</Select.Option>
          <Select.Option value="cancelled">已取消</Select.Option>
        </Select>
        <Select
          v-model:value="filters.logisticsStatus"
          allow-clear
          placeholder="物流状态"
          style="width: 130px"
        >
          <Select.Option value="placed">已下单</Select.Option>
          <Select.Option value="shipped">已发货</Select.Option>
          <Select.Option value="arrived">到达待取</Select.Option>
          <Select.Option value="received">客户已收</Select.Option>
          <Select.Option value="problem">问题件</Select.Option>
        </Select>
        <Input v-model:value="filters.region" allow-clear placeholder="地区" style="width: 130px" />
        <Input v-model:value="filters.orderNo" allow-clear placeholder="订单号" style="width: 180px" />
        <Input v-model:value="filters.customerName" allow-clear placeholder="客户姓名" style="width: 130px" />
        <Input
          v-model:value="filters.phoneLast4"
          allow-clear
          maxlength="4"
          placeholder="手机后四位"
          style="width: 130px"
          @press-enter="loadOrders"
        />
        <Button type="primary" @click="loadOrders">查询</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="orders"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'phone'">{{ maskPhone(record.phone) }}</template>
          <template v-else-if="column.key === 'orderStatus'">
            <Tag :color="record.orderStatus === 'paid' ? 'green' : 'default'">
              {{ ORDER_STATUS_LABEL[record.orderStatus] }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'logisticsStatus'">
            <Tag :color="record.logisticsStatus === 'problem' ? 'red' : 'blue'">
              {{ LOGISTICS_STATUS_LABEL[record.logisticsStatus] }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'orderedAt'">
            {{ new Date(record.orderedAt).toLocaleString() }}
          </template>
          <Button v-else-if="column.key === 'action'" type="link" @click="goToDetail(record.id)">
            查看详情
          </Button>
        </template>
      </Table>
    </Card>
  </Page>
</template>
