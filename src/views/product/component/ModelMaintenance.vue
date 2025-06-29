<script lang="ts" setup>
import { nextTick, reactive, ref, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

import router from '@/router'

import { modelColumns } from '../constant'
import type { Model } from '../types'

import { getModelsByProductId } from '@/api/product/productList'
import { addModels, deleteModelApi } from '@/api/product/models'

import BasicModelInformation from './BasicModelInformation.vue'

const rules = {
  sku: [{ required: true, message: '请输入型号SKU' }],
  name: [{ required: true, message: '请输入型号名称' }],
  description: [{ required: true, message: '请输入型号描述' }],
}

const props = defineProps({
  currentRowInfo: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits<{
  (e: 'on-cancel', v: boolean): void
  (e: 'on-save', data: any): void
}>()
const visible = ref(false)
const loading = ref(false)
const columns = ref(modelColumns)
const modelData = ref<Model[]>([])
const addLoading = ref(false)
const newModelsVisible = ref(false)
const currentRowInfo = ref(props.currentRowInfo)
const newModelForm = reactive({
  sku: '',
  name: '',
  description: '',
})
const formRef = ref()

const showModel = async (_currentRowInfo) => {
  visible.value = true
  modelData.value = []
  currentRowInfo.value = _currentRowInfo
  modelData.value = await getModelsByProductId(currentRowInfo.value?.id)
}

const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要删除该型号吗？此操作不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await deleteModel(String(record.id))
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    },
  })
}

const deleteModel = async (id) => {
  await deleteModelApi(id)
  modelData.value = await getModelsByProductId(currentRowInfo.value?.id)
  message.success('删除成功')
}

const maintainModelDetail = (record) => {
  router.push({ name: 'product-detail', params: { id: record.id } })
}

const showNewModels = () => {
  newModelsVisible.value = true
  nextTick(() => {
    formRef.value.resetFields()
  })
}

const handleTableChange = () => {}

const handleSave = async () => {
  const isPass = await formRef.value.validate()
  if (isPass) {
    addLoading.value = true
    await addModels(currentRowInfo.value.id, {
      ...newModelForm,
      productId: currentRowInfo.value.id,
    })
    addLoading.value = false
    newModelsVisible.value = false
    modelData.value = await getModelsByProductId(currentRowInfo.value?.id)
  }
}

defineExpose({ showModel })
</script>

<template>
  <a-modal
    v-model:open="visible"
    :title="`${currentRowInfo.name}-型号系列管理`"
    width="800px"
    :footer="null"
  >
    <a-button type="primary" @click="showNewModels" class="custom-button">新增型号</a-button>
    <div class="table-container">
      <a-table
        :columns="columns"
        :data-source="modelData"
        rowKey="id"
        @change="handleTableChange"
        :scroll="{ y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button type="link" @click="(_) => maintainModelDetail(record)">编辑</a-button>
            <a-button type="link" danger @click="(_) => handleDelete(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
  <div class="new-model-container">
    <a-modal
      v-model:open="newModelsVisible"
      title="新增型号"
      width="500px"
      :ok-loading="addLoading"
      @ok="handleSave"
      @cancel="() => (newModelsVisible = false)"
      ok-text="保存"
      cancel-text="取消"
    >
      <BasicModelInformation :formData="newModelForm" ref="formRef"></BasicModelInformation>
    </a-modal>
  </div>
</template>

<style scoped>
.custom-button {
  margin-bottom: 10px;
}
</style>
