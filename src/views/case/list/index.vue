<template>
  <div class="case-list-container">
    <!-- 搜索和操作区域 -->
    <div class="search-section">
      <a-row>
        <!--  <a-col :span="6">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="搜索案例标题"
            allow-clear
            @press-enter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
        </a-col>
        <a-col :span="6">
          <a-select
            v-model:value="searchForm.category"
            placeholder="选择分类"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option v-for="(label, value) in categoryOptions" :key="value" :value="value">
              {{ label }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="handleSearch"> <SearchOutlined /> 搜索 </a-button>
        </a-col> -->
        <a-col>
          <a-button type="primary" @click="handleCreate">新增案例</a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 表格区域 -->
    <a-table
      :columns="columns"
      :data-source="caseListRequest.data.value?.data || []"
      :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: caseListRequest.data.value?.total || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
      }"
      row-key="id"
    >
      <!-- 封面图片 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'coverImage'">
          <a-image
            v-if="record.coverImage?.url"
            :src="record.coverImage.url"
            :width="60"
            :height="40"
            :preview="false"
            style="object-fit: cover; border-radius: 4px"
          />
          <span v-else class="no-image">暂无封面</span>
        </template>

        <!-- 分类 -->
        <template v-else-if="column.key === 'category'">
          <a-tag :color="getCategoryColor(record.category)">
            {{ categoryOptions[record.category] }}
          </a-tag>
        </template>

        <!-- 状态 -->
        <!-- <template v-else-if="column.key === 'isActive'">
          <a-switch :checked="record.isActive" />
        </template> -->

        <!-- 操作 -->
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record.id)">
              <EditOutlined /> 编辑
            </a-button>
            <a-popconfirm
              title="确定要删除这个案例吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" size="small" danger> <DeleteOutlined /> 删除 </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getCasesApi, deleteCaseApi, CaseCategory, type QueryCaseDto } from '@/api/case'

const router = useRouter()

// 分类选项
const categoryOptions = {
  [CaseCategory.SEMICONDUCTOR_EQUIPMENT]: '半导体设备',
  [CaseCategory.PRECISION_INSTRUMENT]: '精密仪器',
  [CaseCategory.PRECISION_MACHINE_TOOL]: '精密机床',
  [CaseCategory.LASER_PROCESSING]: '激光加工',
  [CaseCategory.NEW_ENERGY_BATTERY]: '新能源电池',
  [CaseCategory.DISPLAY_PANEL]: '显示面板',
}

// 搜索表单
const searchForm = reactive({
  keyword: '',
  category: undefined as CaseCategory | undefined,
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
})

// 表格列配置
const columns = [
  {
    title: '封面',
    key: 'coverImage',
    width: 80,
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
  },
  {
    title: '分类',
    key: 'category',
    width: 120,
  },
  {
    title: '概述',
    dataIndex: 'summary',
    key: 'summary',
    ellipsis: true,
    width: 250,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
    customRender: ({ text }: { text: string }) => {
      return new Date(text).toLocaleString('zh-CN')
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right' as const,
  },
]

// 获取案例列表
const caseListRequest = useRequest(
  async () => {
    const params: QueryCaseDto = {
      page: pagination.current.toString(),
      limit: pagination.pageSize.toString(),
      keyword: searchForm.keyword || undefined,
      category: searchForm.category || undefined,
    }
    return await getCasesApi(params)
  },
  {
    manual: false,
    onError: (error) => {
      message.error('获取案例列表失败')
      console.error('获取案例列表失败:', error)
    },
  },
)

// 删除案例
const deleteRequest = useRequest(
  async (id: number) => {
    await deleteCaseApi(id)
    message.success('删除成功')
    caseListRequest.run()
  },
  {
    manual: true,
    onError: (error) => {
      message.error('删除失败')
      console.error('删除失败:', error)
    },
  },
)

// 获取分类颜色
const getCategoryColor = (category: CaseCategory) => {
  const colorMap = {
    [CaseCategory.SEMICONDUCTOR_EQUIPMENT]: 'blue',
    [CaseCategory.PRECISION_INSTRUMENT]: 'green',
    [CaseCategory.PRECISION_MACHINE_TOOL]: 'orange',
    [CaseCategory.LASER_PROCESSING]: 'red',
    [CaseCategory.NEW_ENERGY_BATTERY]: 'purple',
    [CaseCategory.DISPLAY_PANEL]: 'cyan',
  }
  return colorMap[category] || 'default'
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  caseListRequest.run()
}

// 分页变化
const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page
  pagination.pageSize = pageSize
  caseListRequest.run()
}

// 页面大小变化
const handlePageSizeChange = (current: number, size: number) => {
  pagination.current = 1
  pagination.pageSize = size
  caseListRequest.run()
}

// 新增案例
const handleCreate = () => {
  router.push('/case/detail')
}

// 编辑案例
const handleEdit = (id: number) => {
  router.push(`/case/detail/${id}`)
}

// 删除案例
const handleDelete = (id: number) => {
  deleteRequest.run(id)
}
</script>

<style scoped>
.search-section {
  margin-bottom: 16px;
}

.no-image {
  color: #999;
  font-size: 12px;
}

:deep(.ant-table-cell) {
  vertical-align: middle;
}
</style>
