<template>
  <div class="news-list-container">
    <div class="search-section">
      <a-button type="primary" @click="handleCreate">发布新闻</a-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <a-table
        :columns="columns"
        :data-source="newsListRequest.data.value?.data || []"
        :loading="newsListRequest.loading.value"
        :pagination="{
          current: pagination.page,
          pageSize: pagination.limit,
          total: newsListRequest.data.value?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
        }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'coverImage'">
            <a-image
              v-if="record.coverImageUrl"
              :src="record.coverImageUrl"
              :width="60"
              :height="40"
              style="object-fit: cover; border-radius: 4px"
              :preview="false"
            />
            <span v-else class="no-image">暂无封面</span>
          </template>

          <template v-else-if="column.key === 'category'">
            <a-tag :color="getCategoryColor(record.category)">
              {{ getCategoryText(record.category) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'summary'">
            <div class="summary-text">
              {{ record.summary }}
            </div>
          </template>

          <template v-else-if="column.key === 'viewCount'">
            <a-statistic :value="record.viewCount" :value-style="{ fontSize: '14px' }" />
          </template>

          <template v-else-if="column.key === 'updatedAt'">
            {{ formatDate(record.updatedAt) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这条新闻吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" size="small" danger>
                  <template #icon><DeleteOutlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getNewsApi, deleteNewsApi, type QueryNewsDto } from '@/api/news'

const router = useRouter()

// 搜索表单
const searchForm = reactive<QueryNewsDto>({
  category: undefined,
  isPublished: undefined,
})

// 分页参数
const pagination = reactive({
  page: 1,
  limit: 10,
})

// 表格列定义
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
    width: 200,
    ellipsis: true,
  },
  {
    title: '概述',
    key: 'summary',
    width: 250,
    ellipsis: true,
  },
  {
    title: '分类',
    key: 'category',
    width: 100,
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    width: 150,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
]

// 获取新闻列表
const newsListRequest = useRequest(
  () => {
    const params = {
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit,
    }
    // 过滤空值
    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })
    return getNewsApi(params)
  },
  {
    refreshDeps: [() => pagination.page, () => pagination.limit],
  },
)

// 删除新闻
const deleteNewsRequest = useRequest((id: number) => deleteNewsApi(id), {
  manual: true,
  onSuccess: () => {
    message.success('删除成功')
    newsListRequest.refresh()
  },
  onError: () => {
    message.error('删除失败')
  },
})

// 处理函数
const handleCreate = () => {
  router.push('/news/detail')
}

const handleEdit = (record: any) => {
  router.push(`/news/detail/${record.id}`)
}

const handleDelete = (id: number) => {
  deleteNewsRequest.run(id)
}

const handlePageChange = (page: number) => {
  pagination.page = page
}

const handlePageSizeChange = (current: number, size: number) => {
  pagination.page = 1
  pagination.limit = size
}

// 工具函数
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    company: 'blue',
    industry: 'green',
  }
  return colorMap[category] || 'default'
}

const getCategoryText = (category: string) => {
  const textMap: Record<string, string> = {
    company: '公司新闻',
    industry: '行业资讯',
  }
  return textMap[category] || category
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.search-section {
  margin-bottom: 16px;
}

.table-section {
  margin-top: 16px;
}

.summary-text {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-image {
  color: #999;
  font-size: 12px;
}

:deep(.ant-table-tbody > tr > td) {
  vertical-align: middle;
}

:deep(.ant-image) {
  border-radius: 4px;
}
</style>
