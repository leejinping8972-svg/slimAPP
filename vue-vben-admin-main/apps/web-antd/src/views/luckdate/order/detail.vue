<script lang="ts" setup>
import type { OrderRecord } from '#/views/luckdate/_mock/types';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Descriptions, Result, Tag } from 'ant-design-vue';

import { getOrderById } from '#/api/luckdate';
import {
  LOGISTICS_STATUS_LABEL,
  maskPhone,
  ORDER_STATUS_LABEL,
} from '#/views/luckdate/_mock/store';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const order = ref<OrderRecord>();

const orderId = computed(() => String(route.params.id ?? ''));

async function loadOrder() {
  loading.value = true;
  try {
    order.value = await getOrderById(orderId.value);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  void router.push('/order/list');
}

onMounted(() => void loadOrder());
</script>

<template>
  <Page title="订单详情">
    <Card :loading="loading">
      <template #extra>
        <Button @click="goBack">返回列表</Button>
      </template>

      <Result v-if="!loading && !order" status="404" title="订单不存在">
        <template #extra>
          <Button type="primary" @click="goBack">返回订单列表</Button>
        </template>
      </Result>

      <template v-else-if="order">
        <Descriptions bordered :column="{ lg: 2, md: 2, sm: 1, xs: 1 }" title="订单信息">
          <Descriptions.Item label="订单号">{{ order.orderNo }}</Descriptions.Item>
          <Descriptions.Item label="下单时间">
            {{ new Date(order.orderedAt).toLocaleString() }}
          </Descriptions.Item>
          <Descriptions.Item label="订单状态">
            <Tag :color="order.orderStatus === 'paid' ? 'green' : 'default'">
              {{ ORDER_STATUS_LABEL[order.orderStatus] }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="物流状态">
            <Tag :color="order.logisticsStatus === 'problem' ? 'red' : 'blue'">
              {{ LOGISTICS_STATUS_LABEL[order.logisticsStatus] }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">${{ order.amount.toFixed(2) }}</Descriptions.Item>
          <Descriptions.Item label="地区">{{ order.region }}</Descriptions.Item>
        </Descriptions>

        <Card class="mt-5" title="商品信息">
          <Descriptions bordered :column="1">
            <Descriptions.Item label="商品名称">{{ order.productName }}</Descriptions.Item>
            <Descriptions.Item label="SKU">{{ order.sku }}</Descriptions.Item>
            <Descriptions.Item label="金额">${{ order.amount.toFixed(2) }}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card class="mt-5" title="收件信息">
          <Descriptions bordered :column="1">
            <Descriptions.Item label="收件人">{{ order.customerName }}</Descriptions.Item>
            <Descriptions.Item label="手机">{{ maskPhone(order.phone) }}</Descriptions.Item>
            <Descriptions.Item label="地区">{{ order.region }}</Descriptions.Item>
            <Descriptions.Item label="收件地址">
              {{ order.receiverAddress || '暂无收件地址' }}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </template>
    </Card>
  </Page>
</template>
