<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import type { FormInstance, Rule, TableColumnsType } from 'ant-design-vue';
import type { CouponRecord, ProductRecord } from '#/api/luckdate';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  deleteCoupon,
  queryCoupons,
  queryProducts,
  saveCoupon,
} from '#/api/luckdate';

interface CouponForm extends CouponRecord {
  dateRange?: [Dayjs, Dayjs];
}

const formRef = ref<FormInstance>();
const loading = ref(false);
const saving = ref(false);
const modalOpen = ref(false);
const coupons = ref<CouponRecord[]>([]);
const products = ref<ProductRecord[]>([]);
const form = reactive<CouponForm>(createEmptyForm());

const columns: TableColumnsType<CouponRecord> = [
  { title: '名称', dataIndex: 'name' },
  { title: '类型', key: 'type' },
  { title: '优惠', key: 'benefit' },
  { title: '有效期', key: 'validity' },
  { title: '发放总量', dataIndex: 'totalQuantity' },
  { title: '单人限领', dataIndex: 'perUserLimit' },
  { title: '状态', key: 'enabled' },
  { title: '操作', key: 'action', width: 130 },
];

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入优惠券名称' }],
  type: [{ required: true, message: '请选择优惠券类型' }],
  discountValue: [{ required: true, type: 'number', min: 0, message: '请输入优惠值' }],
  totalQuantity: [{ required: true, type: 'number', min: 1, message: '发放总量至少为 1' }],
  perUserLimit: [{ required: true, type: 'number', min: 1, message: '单人限领至少为 1' }],
};

function createEmptyForm(): CouponForm {
  return {
    id: '',
    name: '',
    type: 'full_reduction',
    thresholdUsd: 0,
    discountValue: 0,
    validityType: 'days_after_claim',
    daysAfterClaim: 30,
    totalQuantity: 100,
    perUserLimit: 1,
    productScope: 'all',
    productIds: [],
    enabled: true,
  };
}

async function loadData() {
  loading.value = true;
  try {
    const [{ items: couponItems }, { items: productItems }] = await Promise.all([
      queryCoupons(),
      queryProducts(),
    ]);
    coupons.value = couponItems;
    products.value = productItems;
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  Object.assign(form, createEmptyForm());
  modalOpen.value = true;
}

function openEdit(coupon: CouponRecord) {
  Object.assign(form, {
    ...coupon,
    productIds: [...coupon.productIds],
    dateRange:
      coupon.startAt && coupon.endAt
        ? [dayjs(coupon.startAt), dayjs(coupon.endAt)]
        : undefined,
  });
  modalOpen.value = true;
}

function typeLabel(type: CouponRecord['type']) {
  return {
    discount: '折扣',
    full_reduction: '满减',
    no_threshold: '无门槛',
  }[type];
}

function benefitLabel(coupon: CouponRecord) {
  const prefix =
    coupon.type === 'full_reduction' ? `满 $${coupon.thresholdUsd}，` : '';
  if (coupon.type === 'discount') {
    return `${prefix}${coupon.discountValue * 10} 折`;
  }
  return `${prefix}减 $${coupon.discountValue}`;
}

function validityLabel(coupon: CouponRecord) {
  if (coupon.validityType === 'days_after_claim') {
    return `领取后 ${coupon.daysAfterClaim ?? 0} 天`;
  }
  return coupon.startAt && coupon.endAt
    ? `${dayjs(coupon.startAt).format('YYYY-MM-DD')} 至 ${dayjs(coupon.endAt).format('YYYY-MM-DD')}`
    : '-';
}

async function submit() {
  await formRef.value?.validate();
  if (form.validityType === 'fixed_date' && !form.dateRange) {
    message.error('请选择固定有效期');
    return;
  }
  if (form.productScope === 'specified' && form.productIds.length === 0) {
    message.error('请选择适用商品');
    return;
  }

  saving.value = true;
  try {
    const { dateRange, ...coupon } = form;
    await saveCoupon({
      ...coupon,
      id: coupon.id || `c${Date.now()}`,
      productIds: coupon.productScope === 'specified' ? [...coupon.productIds] : [],
      startAt: dateRange?.[0]?.startOf('day').toISOString(),
      endAt: dateRange?.[1]?.endOf('day').toISOString(),
      daysAfterClaim:
        coupon.validityType === 'days_after_claim'
          ? coupon.daysAfterClaim
          : undefined,
    });
    message.success('优惠券保存成功');
    modalOpen.value = false;
    await loadData();
  } finally {
    saving.value = false;
  }
}

function confirmDelete(coupon: CouponRecord) {
  Modal.confirm({
    title: '确认删除优惠券？',
    content: `删除后不可恢复：“${coupon.name}”`,
    okType: 'danger',
    onOk: async () => {
      await deleteCoupon(coupon.id);
      message.success('优惠券已删除');
      await loadData();
    },
  });
}

onMounted(() => void loadData());
</script>

<template>
  <Page title="优惠券列表">
    <Card>
      <template #extra>
        <Button type="primary" @click="openCreate">新增优惠券</Button>
      </template>
      <Table
        :columns="columns"
        :data-source="coupons"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">{{ typeLabel(record.type) }}</template>
          <template v-else-if="column.key === 'benefit'">{{ benefitLabel(record) }}</template>
          <template v-else-if="column.key === 'validity'">{{ validityLabel(record) }}</template>
          <Tag v-else-if="column.key === 'enabled'" :color="record.enabled ? 'green' : 'default'">
            {{ record.enabled ? '启用' : '停用' }}
          </Tag>
          <Space v-else-if="column.key === 'action'">
            <Button type="link" @click="openEdit(record)">编辑</Button>
            <Button danger type="link" @click="confirmDelete(record)">删除</Button>
          </Space>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="modalOpen"
      :confirm-loading="saving"
      :title="form.id ? '编辑优惠券' : '新增优惠券'"
      width="680px"
      @ok="submit"
    >
      <Form ref="formRef" :label-col="{ span: 6 }" :model="form" :rules="rules">
        <Form.Item label="名称" name="name">
          <Input v-model:value="form.name" placeholder="请输入优惠券名称" />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Radio.Group v-model:value="form.type">
            <Radio value="full_reduction">满减</Radio>
            <Radio value="discount">折扣</Radio>
            <Radio value="no_threshold">无门槛</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item v-if="form.type === 'full_reduction'" label="使用门槛" name="thresholdUsd">
          <InputNumber v-model:value="form.thresholdUsd" :min="0" :precision="2" prefix="$" />
        </Form.Item>
        <Form.Item
          :label="form.type === 'discount' ? '折扣（如 8 折填 0.8）' : '减免金额'"
          name="discountValue"
        >
          <InputNumber
            v-model:value="form.discountValue"
            :max="form.type === 'discount' ? 1 : undefined"
            :min="0"
            :precision="2"
            :prefix="form.type === 'discount' ? undefined : '$'"
          />
        </Form.Item>
        <Form.Item label="有效期类型" name="validityType">
          <Radio.Group v-model:value="form.validityType">
            <Radio value="fixed_date">固定日期</Radio>
            <Radio value="days_after_claim">领取后天数</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item v-if="form.validityType === 'fixed_date'" label="有效期">
          <DatePicker.RangePicker v-model:value="form.dateRange" style="width: 100%" />
        </Form.Item>
        <Form.Item v-else label="领取后有效天数">
          <InputNumber v-model:value="form.daysAfterClaim" :min="1" :precision="0" />
        </Form.Item>
        <Form.Item label="发放总量" name="totalQuantity">
          <InputNumber v-model:value="form.totalQuantity" :min="1" :precision="0" />
        </Form.Item>
        <Form.Item label="单人限领" name="perUserLimit">
          <InputNumber v-model:value="form.perUserLimit" :min="1" :precision="0" />
        </Form.Item>
        <Form.Item label="商品范围" name="productScope">
          <Radio.Group v-model:value="form.productScope">
            <Radio value="all">全部商品</Radio>
            <Radio value="specified">指定商品</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item v-if="form.productScope === 'specified'" label="适用商品">
          <Select
            v-model:value="form.productIds"
            allow-clear
            mode="multiple"
            placeholder="请选择商品"
          >
            <Select.Option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}（{{ product.id }}）
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="启用" name="enabled">
          <Switch v-model:checked="form.enabled" checked-children="启用" un-checked-children="停用" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
