<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Model } from '../types'
const rules = {
  sku: [{ required: true, message: '请输入型号SKU' }],
  name: [{ required: true, message: '请输入型号名称' }],
  description: [{ required: true, message: '请输入型号描述' }],
}

const formData = defineModel<Model>('formData', {
  type: Object as () => Model,
  default: () => ({} as Model),
})

const formRef = ref()

const validate = async () => {
  return await formRef.value.validate()
}

const resetFields = async () => {
  formRef.value.resetFields()
}

defineExpose({
  validate,
  resetFields,
})
</script>

<template>
  <a-form
    :model="formData"
    :label-col="{ style: { width: '100px' } }"
    :wrapper-col="{ span: 20 }"
    layout="horizontal"
    :rules="rules"
    ref="formRef"
    v-bind="$attrs"
  >
    <a-form-item label="型号名称" name="name">
      <a-input v-model:value="formData.name" placeholder="请输入型号名称" />
    </a-form-item>
    <a-form-item label="型号描述" name="description">
      <a-textarea
        v-model:value="formData.description"
        placeholder="请输入型号描述"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
    </a-form-item>
    <a-form-item label="SKU" name="sku">
      <a-input v-model:value="formData.sku" placeholder="请输入型号SKU" />
    </a-form-item>
  </a-form>
</template>
