<template>
  <div class="file-download-container">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="files" tab="文件管理">
        <div class="action-bar">
          <a-button type="primary" @click="showAddFileModal">添加文件</a-button>
        </div>
        <a-table
          :columns="fileColumns"
          :data-source="fileList"
          :loading="loading"
          :pagination="{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
          }"
          rowKey="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'displayName'">
              <a :href="record.fileUrl" target="_blank">{{ record.fileName }}</a>
            </template>
            <template v-if="column.key === 'fileSize'">
              {{ formatFileSize(record.upload.size) }}
            </template>
            <template v-if="column.key === 'isEnabled'">
              <a-tag :color="record.isEnabled ? 'green' : 'red'">
                {{ record.isEnabled ? '启用' : '禁用' }}
              </a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" @click="editFile(record)">编辑</a-button>
                <a-button type="link" @click="toggleFileStatus(record)">
                  {{ record.isEnabled ? '禁用' : '启用' }}
                </a-button>
                <a-popconfirm
                  title="确定要删除这个文件吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="deleteFile(record.id)"
                >
                  <a-button type="link" danger>删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="categories" tab="分类管理">
        <div class="action-bar">
          <a-button type="primary" @click="showAddCategoryModal">添加分类</a-button>
        </div>
        <a-table
          :columns="categoryColumns"
          :data-source="categoryList"
          :loading="loading"
          :pagination="{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
          }"
          rowKey="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'fileCount'">
              {{ record.files?.length || 0 }}
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" @click="editCategory(record)">编辑</a-button>
                <a-popconfirm
                  title="确定要删除这个分类吗？分类下的文件也会被删除！"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="deleteCategory(record.id)"
                >
                  <a-button type="link" danger>删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <!-- 添加/编辑文件模态框 -->
    <a-modal
      v-model:open="fileModalVisible"
      :title="fileModalTitle"
      @ok="handleFileModalOk"
      @cancel="handleFileModalCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form
        :model="fileForm"
        :rules="fileRules"
        ref="fileFormRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="文件名称" name="displayName">
          <a-input v-model:value="fileForm.displayName" placeholder="请输入文件名称" />
        </a-form-item>
        <a-form-item label="文件分类" name="categoryId">
          <a-select
            v-model:value="fileForm.categoryId"
            placeholder="请选择文件分类"
            :options="categoryOptions"
          />
        </a-form-item>
        <a-form-item label="文件" name="uploadId" v-if="!isEdit">
          <a-upload
            v-model:file-list="uploadFileList"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            :maxCount="1"
          >
            <a-button> <upload-outlined /> 选择文件 </a-button>
          </a-upload>
        </a-form-item>
        <!-- <a-form-item label="排序" name="sortOrder">
          <a-input-number
            v-model:value="fileForm.sortOrder"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </a-form-item> -->
        <a-form-item label="状态" name="isEnabled">
          <a-switch v-model:checked="fileForm.isEnabled" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="fileForm.description" placeholder="请输入描述信息" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加/编辑分类模态框 -->
    <a-modal
      v-model:open="categoryModalVisible"
      :title="categoryModalTitle"
      @ok="handleCategoryModalOk"
      @cancel="handleCategoryModalCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form
        :model="categoryForm"
        :rules="categoryRules"
        ref="categoryFormRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="categoryForm.name" placeholder="请输入分类名称" />
        </a-form-item>
        <!-- <a-form-item label="排序" name="sortOrder">
          <a-input-number
            v-model:value="categoryForm.sortOrder"
            :min="0"
            :max="9999"
            style="width: 100%"
          />
        </a-form-item> -->
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="categoryForm.description"
            placeholder="请输入描述信息"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, type FormInstance, type TableColumnsType, type UploadProps } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import {
  getDownloadCategoriesApi,
  getDownloadFilesForAdminApi,
  createDownloadCategoryApi,
  updateDownloadCategoryApi,
  deleteDownloadCategoryApi,
  createDownloadFileApi,
  updateDownloadFileApi,
  deleteDownloadFileApi,
  toggleDownloadFileStatusApi,
  type DownloadCategory,
  type DownloadFile,
  type CreateDownloadCategoryDto,
  type UpdateDownloadCategoryDto,
  type CreateDownloadFileDto,
  type UpdateDownloadFileDto,
} from '@/api/download'
import { uploadFile, type Upload } from '@/api/upload'

// 状态变量
const activeTab = ref<string>('files')
const loading = ref<boolean>(false)
const fileList = ref<DownloadFile[]>([])
const categoryList = ref<DownloadCategory[]>([])
const fileModalVisible = ref<boolean>(false)
const categoryModalVisible = ref<boolean>(false)
const confirmLoading = ref<boolean>(false)
const isEdit = ref<boolean>(false)
const fileModalTitle = computed(() => (isEdit.value ? '编辑文件' : '添加文件'))
const categoryModalTitle = computed(() => (isEdit.value ? '编辑分类' : '添加分类'))
const uploadFileList = ref<any[]>([])

// 表单引用
const fileFormRef = ref<FormInstance>()
const categoryFormRef = ref<FormInstance>()

// 表单数据
const fileForm = reactive<CreateDownloadFileDto & UpdateDownloadFileDto & { id?: number }>({
  displayName: '',
  description: '',
  uploadId: undefined,
  categoryId: undefined,
  isEnabled: true,
  sortOrder: 0,
})

const categoryForm = reactive<
  CreateDownloadCategoryDto & UpdateDownloadCategoryDto & { id?: number }
>({
  name: '',
  description: '',
  sortOrder: 0,
})

// 表单验证规则
const fileRules = {
  displayName: [{ required: true, message: '请输入文件名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择文件分类', trigger: 'change' }],
  uploadId: [{ required: true, message: '请上传文件', trigger: 'change' }],
}

const categoryRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

// 表格列定义
const fileColumns = ref<TableColumnsType>([
  {
    title: '文件名',
    dataIndex: 'displayName',
    key: 'fileName',
    width: '20%',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: '10%',
  },
  {
    title: '文件类型',
    dataIndex: ['upload', 'mimeType'],
    key: 'upload.mimeType',
    width: '10%',
  },
  {
    title: '分类',
    dataIndex: ['category', 'name'],
    key: 'category',
    width: '10%',
  },
  {
    title: '上传时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '15%',
    customRender: ({ text }: { text: string }) => {
      return new Date(text).toLocaleString('zh-CN')
    },
  },
  {
    title: '状态',
    dataIndex: 'isEnabled',
    key: 'isEnabled',
    width: '10%',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
  },
])

const categoryColumns = ref<TableColumnsType>([
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '40%',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
  },
])

// 计算属性
const categoryOptions = computed(() => {
  return categoryList.value.map((category) => ({
    value: category.id,
    label: category.name,
  }))
})

// 生命周期钩子
onMounted(() => {
  fetchData()
})

// 方法
const fetchData = async () => {
  loading.value = true
  try {
    const [categories, files] = await Promise.all([
      getDownloadCategoriesApi(),
      getDownloadFilesForAdminApi(),
    ])
    categoryList.value = categories
    fileList.value = files
  } catch (error) {
    console.error('获取数据失败:', error)
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 文件相关方法
const showAddFileModal = () => {
  isEdit.value = false
  resetFileForm()
  fileModalVisible.value = true
}

const editFile = (record: DownloadFile) => {
  isEdit.value = true
  resetFileForm()
  Object.assign(fileForm, {
    id: record.id,
    displayName: record.displayName,
    description: record.description,
    categoryId: record.categoryId,
    uploadId: record.uploadId,
    isEnabled: record.isEnabled,
    sortOrder: record.sortOrder,
  })
  fileModalVisible.value = true
}

const resetFileForm = () => {
  if (fileFormRef.value) {
    fileFormRef.value.resetFields()
  }
  Object.assign(fileForm, {
    id: undefined,
    displayName: '',
    description: '',
    uploadId: undefined,
    categoryId: undefined,
    isEnabled: true,
    sortOrder: 0,
  })
  uploadFileList.value = []
}

const handleFileModalOk = () => {
  fileFormRef.value?.validate().then(async () => {
    confirmLoading.value = true
    try {
      if (isEdit.value && fileForm.id) {
        // 编辑文件
        const updateData: UpdateDownloadFileDto = {
          displayName: fileForm.displayName,
          description: fileForm.description,
          categoryId: fileForm.categoryId,
          isEnabled: fileForm.isEnabled,
          sortOrder: fileForm.sortOrder,
        }
        await updateDownloadFileApi(fileForm.id, updateData)
        message.success('更新文件成功')
      } else {
        // 添加文件
        if (!fileForm.uploadId) {
          message.error('请上传文件')
          return
        }
        const createData: CreateDownloadFileDto = {
          displayName: fileForm.displayName,
          description: fileForm.description,
          uploadId: fileForm.uploadId,
          categoryId: fileForm.categoryId,
          isEnabled: fileForm.isEnabled,
          sortOrder: fileForm.sortOrder,
        }
        await createDownloadFileApi(createData)
        message.success('添加文件成功')
      }
      fileModalVisible.value = false
      fetchData()
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    } finally {
      confirmLoading.value = false
    }
  })
}

const handleFileModalCancel = () => {
  fileModalVisible.value = false
  resetFileForm()
}

const deleteFile = async (id: number) => {
  try {
    await deleteDownloadFileApi(id)
    message.success('删除文件成功')
    fetchData()
  } catch (error) {
    console.error('删除文件失败:', error)
    message.error('删除文件失败')
  }
}

const toggleFileStatus = async (record: DownloadFile) => {
  try {
    await toggleDownloadFileStatusApi(record.id)
    message.success(`${record.isEnabled ? '禁用' : '启用'}文件成功`)
    fetchData()
  } catch (error) {
    console.error('操作失败:', error)
    message.error('操作失败')
  }
}

// 分类相关方法
const showAddCategoryModal = () => {
  isEdit.value = false
  resetCategoryForm()
  categoryModalVisible.value = true
}

const editCategory = (record: DownloadCategory) => {
  isEdit.value = true
  resetCategoryForm()
  Object.assign(categoryForm, {
    id: record.id,
    name: record.name,
    description: record.description,
    sortOrder: record.sortOrder,
  })
  categoryModalVisible.value = true
}

const resetCategoryForm = () => {
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields()
  }
  Object.assign(categoryForm, {
    id: undefined,
    name: '',
    description: '',
    sortOrder: 0,
  })
}

const handleCategoryModalOk = () => {
  categoryFormRef.value?.validate().then(async () => {
    confirmLoading.value = true
    try {
      if (isEdit.value && categoryForm.id) {
        // 编辑分类
        const updateData: UpdateDownloadCategoryDto = {
          name: categoryForm.name,
          description: categoryForm.description,
          sortOrder: categoryForm.sortOrder,
        }
        await updateDownloadCategoryApi(categoryForm.id, updateData)
        message.success('更新分类成功')
      } else {
        // 添加分类
        const createData: CreateDownloadCategoryDto = {
          name: categoryForm.name,
          description: categoryForm.description,
          sortOrder: categoryForm.sortOrder,
        }
        await createDownloadCategoryApi(createData)
        message.success('添加分类成功')
      }
      categoryModalVisible.value = false
      fetchData()
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    } finally {
      confirmLoading.value = false
    }
  })
}

const handleCategoryModalCancel = () => {
  categoryModalVisible.value = false
  resetCategoryForm()
}

const deleteCategory = async (id: number) => {
  try {
    await deleteDownloadCategoryApi(id)
    message.success('删除分类成功')
    fetchData()
  } catch (error) {
    console.error('删除分类失败:', error)
    message.error('删除分类失败')
  }
}

// 文件上传相关方法
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 文件大小限制为 50MB
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    message.error('文件大小不能超过 50MB!')
  }
  return isLt50M || Upload.LIST_IGNORE
}

const handleUpload = async (options: any) => {
  try {
    const { file, onSuccess, onError } = options
    const result = await uploadFile(file)
    fileForm.uploadId = result.id
    onSuccess(result, file)
  } catch (error) {
    console.error('上传文件失败:', error)
    message.error('上传文件失败')
    options.onError(error)
  }
}

// 工具方法
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}
</script>

<style scoped>
.action-bar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
