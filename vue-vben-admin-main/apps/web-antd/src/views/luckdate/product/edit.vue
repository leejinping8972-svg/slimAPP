<script lang="ts" setup>
import type { FormInstance, Rule } from 'ant-design-vue';
import type { ProductRecord } from '#/api/luckdate';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Switch,
} from 'ant-design-vue';

import { getProductById, saveProduct } from '#/api/luckdate';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();
const saving = ref(false);
const productId = computed(() => route.params.id as string | undefined);
const form = reactive<ProductRecord>({
  id: '',
  name: '',
  price: 0,
  stock: 0,
  onSale: true,
  specs: '',
  coverUrl: '',
  description: '',
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入商品名称' }],
  price: [{ required: true, type: 'number', min: 0, message: '价格不能小于 0' }],
  stock: [{ required: true, type: 'number', min: 0, message: '库存不能小于 0' }],
  specs: [{ required: true, message: '请输入商品规格' }],
};

async function loadProduct() {
  if (!productId.value) {
    return;
  }
  const product = await getProductById(productId.value);
  if (!product) {
    message.error('商品不存在');
    void router.replace('/product/list');
    return;
  }
  Object.assign(form, product);
}

async function submit() {
  await formRef.value?.validate();
  saving.value = true;
  try {
    await saveProduct({
      ...form,
      id: form.id || `p${Date.now()}`,
      coverUrl: form.coverUrl || undefined,
      description: form.description || undefined,
    });
    message.success('商品保存成功');
    void router.push('/product/list');
  } finally {
    saving.value = false;
  }
}

function goBack() {
  void router.push('/product/list');
}

onMounted(() => void loadProduct());
</script>

<template>
  <Page :title="productId ? '编辑商品' : '新增商品'">
    <Card style="max-width: 760px">
      <Form ref="formRef" :label-col="{ span: 4 }" :model="form" :rules="rules">
        <Form.Item label="名称" name="name">
          <Input v-model:value="form.name" placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item label="价格" name="price">
          <InputNumber
            v-model:value="form.price"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </Form.Item>
        <Form.Item label="库存" name="stock">
          <InputNumber v-model:value="form.stock" :min="0" :precision="0" style="width: 100%" />
        </Form.Item>
        <Form.Item label="规格" name="specs">
          <Input v-model:value="form.specs" placeholder="例如：30 servings" />
        </Form.Item>
        <Form.Item label="上下架" name="onSale">
          <Switch v-model:checked="form.onSale" checked-children="上架" un-checked-children="下架" />
        </Form.Item>
        <Form.Item label="封面图片 URL" name="coverUrl">
          <Input v-model:value="form.coverUrl" placeholder="请输入图片 URL（可选）" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea
            v-model:value="form.description"
            :rows="5"
            placeholder="请输入商品图文描述或图片 URL（可选）"
          />
        </Form.Item>
        <Form.Item :wrapper-col="{ offset: 4 }">
          <Space>
            <Button type="primary" :loading="saving" @click="submit">保存</Button>
            <Button @click="goBack">取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  </Page>
</template>
