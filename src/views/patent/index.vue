<template>
  <div class="patent-container">
    <div class="patent-header">
      <a-button type="primary" @click="showAddModal">添加专利</a-button>
    </div>

    <a-table
      :dataSource="patentList"
      :columns="columns"
      rowKey="id"
      :pagination="false"
      :loading="loading"
    >
      <template #bodyCell="{ column, record }">
        <!-- 序号列 -->
        <template v-if="column.dataIndex === 'index'">
          <span>{{ patentList.indexOf(record) + 1 }}</span>
        </template>

        <!-- 图片列 -->
        <template v-if="column.dataIndex === 'imageUrl'">
          <div class="image-preview" @click="previewImage(record.imageUrl)">
            <img :src="`${record.imageUrl}`" alt="专利图片" />
          </div>
        </template>

        <!-- 类型列 -->
        <template v-if="column.dataIndex === 'type'">
          <span>{{ getPatentTypeName(record.type) }}</span>
        </template>

        <!-- 操作列 -->
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 图片预览 -->
    <a-image
      :style="{ display: 'none' }"
      :preview="{
        visible: previewVisible,
        src: previewSrc,
        onVisibleChange: (visible) => (previewVisible = visible),
      }"
    />

    <!-- 专利表单组件 -->
    <PatentForm
      v-model:open="modalVisible"
      :is-edit="isEdit"
      :patent-data="currentPatent"
      @success="fetchPatentList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getPatentList, deletePatent } from '@/api/patent'
import type { Patent } from '@/api/patent'
import PatentForm from './components/PatentForm.vue'
import { useRequest } from 'vue-request'

// 专利列表数据
const { data: patentList, run: fetchPatentList, loading } = useRequest(getPatentList)

// 表格列定义
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
  },
  {
    title: '专利图片',
    dataIndex: 'imageUrl',
    width: 120,
  },
  {
    title: '专利名称',
    dataIndex: 'name',
  },
  {
    title: '专利类型',
    dataIndex: 'type',
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
  },
]

// 专利类型映射
const patentTypeMap = {
  1: '气浮轴承',
  2: '气浮辊',
  3: '气浮运动平台',
}

// 获取专利类型名称
const getPatentTypeName = (type: number) => {
  return patentTypeMap[type as keyof typeof patentTypeMap] || '未知类型'
}

// 图片预览相关
const previewVisible = ref(false)
const previewSrc = ref('')

// 预览图片
const previewImage = (url: string) => {
  previewSrc.value = url
  previewVisible.value = true
}

// 弹窗相关
const modalVisible = ref(false)
const isEdit = ref(false)
const currentPatent = ref<Patent | undefined>(undefined)

// 获取专利列表
// const fetchPatentList = async () => {
//   loading.value = true
//   try {
//     const resData = await getPatentList()
//     console.log('res', resData)

//     patentList.value = resData
//   } catch (error) {
//     console.error('获取专利列表失败:', error)
//     message.error('获取专利列表失败')
//   } finally {
//     loading.value = false
//   }
// }

// 显示添加弹窗
const showAddModal = () => {
  isEdit.value = false
  currentPatent.value = undefined
  modalVisible.value = true
}

// 处理编辑
const handleEdit = (record: Patent) => {
  isEdit.value = true
  currentPatent.value = record
  modalVisible.value = true
}

// 处理删除
const handleDelete = (record: Patent) => {
  Modal.confirm({
    title: '确认删除',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要删除该专利吗？此操作不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await deletePatent(String(record.id))
        message.success('删除成功')
        fetchPatentList()
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    },
  })
}
</script>

<style scoped>
.patent-header {
  margin-bottom: 16px;
}

.image-preview {
  width: 60px;
  height: 60px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
