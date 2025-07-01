<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { Model } from '../types'
import type { UploadFile as AntUploadFile } from 'ant-design-vue'

import BaseImageUpload from '../component/BaseImageUpload.vue'

const rules = {
  sku: [{ required: true, message: '请输入型号SKU' }],
  name: [{ required: true, message: '请输入型号名称' }],
  description: [{ required: true, message: '请输入型号描述' }],
  coverImage: [{ required: true, message: '请上传型号封面图' }],
}

interface UploadFile extends AntUploadFile {
  imageId?: string
}

const formData = defineModel<Model>('formData', {
  type: Object as () => Model,
  // default: () => ({} as Model),
})

const formRef = ref()

const validate = async () => {
  return await formRef.value.validate()
}

const resetFields = async () => {
  formRef.value.resetFields()
}

const handleImageChange = (list: Array<UploadFile>) => {
  formData.value.coverImage = list
}

defineExpose({
  validate,
  resetFields,
})
</script>

<template>
  <a-form :model="formData" layout="horizontal" :rules="rules" ref="formRef" v-bind="$attrs">
    <a-row gutter="24">
      <!-- 左侧：三个输入项 -->
      <a-col :span="14">
        <a-form-item
          label="型号名称"
          name="name"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 20 }"
          class="model-name"
        >
          <a-input v-model:value="formData.name" placeholder="请输入型号名称" />
        </a-form-item>
        <a-form-item
          label="型号描述"
          name="description"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 20 }"
          class="model-description"
        >
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入型号描述"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item
          label="SKU"
          name="sku"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 20 }"
          class="model-sku"
        >
          <a-input v-model:value="formData.sku" placeholder="请输入型号SKU" />
        </a-form-item>
      </a-col>

      <!-- 右侧：封面图上传 -->
      <a-col :span="8">
        <a-form-item
          label="型号封面图"
          name="coverImage"
          :label-col="{ span: 10 }"
          :wrapper-col="{ span: 16 }"
        >
          <BaseImageUpload
            :imageList="formData.coverImage"
            :maxCount="1"
            @on-change="(file) => handleImageChange(file)"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<style scoped></style>
