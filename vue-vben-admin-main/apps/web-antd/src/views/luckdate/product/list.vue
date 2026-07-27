<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
import type { ProductRecord } from '#/api/luckdate';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, Select, Space, Table, Tag } from 'ant-design-vue';

import { queryProducts } from '#/api/luckdate';

const router = useRouter();
const loading = ref(false);
const products = ref<ProductRecord[]>([]);
const filters = ref<{ name?: string; onSale?: boolean }>({});

const columns: TableColumnsType<ProductRecord> = [
  { title: '名称', dataIndex: 'name' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '库存', dataIndex: 'stock', key: 'stock' },
  { title: '上下架', dataIndex: 'onSale', key: 'onSale' },
  { title: '操作', key: 'action', width: 100 },
];

async function loadProducts() {
  loading.value = true;
  try {
    const { items } = await queryProducts(filters.value);
    products.value = items;
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = {};
  void loadProducts();
}

function goToEdit(id?: string) {
  void router.push(id ? `/product/edit/${id}` : '/product/edit');
}

onMounted(() => void loadProducts());
</script>

<template>
  <Page title="商品列表">
    <Card class="mb-5">
      <Space wrap>
        <Input
          v-model:value="filters.name"
          allow-clear
          placeholder="按名称筛选"
          style="width: 220px"
          @press-enter="loadProducts"
        />
        <Select
          v-model:value="filters.onSale"
          allow-clear
          placeholder="上下架"
          style="width: 140px"
        >
          <Select.Option :value="true">上架</Select.Option>
          <Select.Option :value="false">下架</Select.Option>
        </Select>
        <Button type="primary" @click="loadProducts">查询</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>

    <Card>
      <template #title>商品列表</template>
      <template #extra>
        <Button type="primary" @click="goToEdit()">新增商品</Button>
      </template>
      <Table
        :columns="columns"
        :data-source="products"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'price'">${{ record.price.toFixed(2) }}</template>
          <template v-else-if="column.key === 'onSale'">
            <Tag :color="record.onSale ? 'green' : 'default'">
              {{ record.onSale ? '上架' : '下架' }}
            </Tag>
          </template>
          <Button
            v-else-if="column.key === 'action'"
            type="link"
            @click="goToEdit(record.id)"
          >
            编辑
          </Button>
        </template>
      </Table>
    </Card>
  </Page>
</template>
