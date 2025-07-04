<template>
  <div class="case-detail-container">
    <a-row justify="end" class="action-row">
      <a-col>
        <a-space>
          <a-button @click="handleBack">返回</a-button>
          <a-button type="primary" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      layout="vertical"
      :label-col="{ span: 24 }"
      :wrapper-col="{ span: 24 }"
    >
      <a-row :gutter="24">
        <!-- 左侧表单 -->
        <a-col :span="16" class="basic-info-col">
          <a-card title="基本信息">
            <a-form-item label="案例标题" name="title">
              <a-input
                v-model:value="formData.title"
                placeholder="请输入案例标题"
                :maxlength="100"
                show-count
              />
            </a-form-item>

            <a-form-item label="案例分类" name="category">
              <a-select
                v-model:value="formData.category"
                placeholder="请选择案例分类"
                style="width: 100%"
              >
                <a-select-option
                  v-for="(label, value) in categoryOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="案例概述" name="summary">
              <a-textarea
                v-model:value="formData.summary"
                placeholder="请输入案例概述"
                :rows="4"
                :maxlength="500"
                show-count
              />
            </a-form-item>
          </a-card>
        </a-col>

        <!-- 右侧配置 -->
        <a-col :span="8">
          <a-card title="封面设置">
            <a-form-item label="封面图片" name="coverImageUrl">
              <div class="cover-upload">
                <a-upload
                  v-model:file-list="fileList"
                  name="file"
                  list-type="picture-card"
                  class="cover-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :custom-request="handleUpload"
                >
                  <div v-if="formData.coverImage?.url">
                    <img
                      :src="formData.coverImage.url"
                      alt="cover"
                      style="width: 100%; height: 100%; object-fit: cover"
                    />
                  </div>
                  <div v-else class="upload-placeholder">
                    <PlusOutlined />
                    <div style="margin-top: 8px">上传封面</div>
                  </div>
                </a-upload>
                <div class="upload-tips">
                  <!-- <p>建议尺寸：16:9</p> -->
                  <p>支持格式：JPG、PNG</p>
                  <p>文件大小：不超过2MB</p>
                </div>
              </div>
            </a-form-item>
          </a-card>

          <!-- <a-form-item label="显示设置">
            <a-space direction="vertical" style="width: 100%">
              <div>
                <span>是否发布案例：</span>
                <a-switch v-model:checked="formData.isActive" />
              </div>
              <div>
                <span>排序权重：</span>
                <a-input-number
                  v-model:value="formData.sortOrder"
                  :min="0"
                  :max="9999"
                  style="width: 100%"
                  placeholder="数值越大排序越靠前"
                />
              </div>
            </a-space>
          </a-form-item> -->
        </a-col>
        <a-col :span="24">
          <a-card title="案例内容">
            <a-form-item name="content">
              <RichTextEditor v-model:content="formData.content" />
            </a-form-item>
          </a-card>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, type FormInstance } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { PlusOutlined } from '@ant-design/icons-vue'
import RichTextEditor from '@/components/RichTextEditor/index.vue'
import {
  getCaseDetailApi,
  createCaseApi,
  updateCaseApi,
  CaseCategory,
  type CreateCaseDto,
  type UpdateCaseDto,
  type FileInfo,
} from '@/api/case'
import { uploadFile } from '@/api/upload'

const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref<FormInstance>()

// 文件列表
const fileList = ref([])

// 是否为编辑模式
const isEdit = ref(false)
const caseId = ref<number | null>(null)

// 分类选项
const categoryOptions = {
  [CaseCategory.SEMICONDUCTOR_EQUIPMENT]: '半导体设备',
  [CaseCategory.PRECISION_INSTRUMENT]: '精密仪器',
  [CaseCategory.PRECISION_MACHINE_TOOL]: '精密机床',
  [CaseCategory.LASER_PROCESSING]: '激光加工',
  [CaseCategory.NEW_ENERGY_BATTERY]: '新能源电池',
  [CaseCategory.DISPLAY_PANEL]: '显示面板',
}

// 表单数据
const formData = reactive({
  title: '',
  category: undefined as CaseCategory | undefined,
  summary: '',
  content: '',
  coverImage: undefined as FileInfo | undefined,
  isActive: true,
  sortOrder: 0,
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入案例标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2-100个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择案例分类', trigger: 'change' }],
  summary: [
    { required: true, message: '请输入案例概述', trigger: 'blur' },
    { min: 10, max: 500, message: '概述长度在10-500个字符', trigger: 'blur' },
  ],
  content: [{ required: true, message: '请输入案例内容', trigger: 'blur' }],
}

// 获取案例详情
const getCaseDetailRequest = useRequest(
  async (id: number) => {
    const result = await getCaseDetailApi(id)

    // 填充表单数据
    Object.assign(formData, {
      title: result.title,
      category: result.category,
      summary: result.summary,
      content: result.content,
      coverImage: result.coverImage,
      isActive: result.isActive,
      sortOrder: result.sortOrder,
    })

    return result
  },
  {
    manual: true,
    onError: (error) => {
      message.error('获取案例详情失败')
      console.error('获取案例详情失败:', error)
    },
  },
)

// 提交表单
const submitRequest = useRequest(
  async () => {
    await formRef.value?.validate()

    const submitData = {
      title: formData.title,
      category: formData.category!,
      summary: formData.summary,
      content: formData.content,
      coverImage: formData.coverImage,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
    }

    if (isEdit.value && caseId.value) {
      await updateCaseApi(caseId.value, submitData as UpdateCaseDto)
      message.success('案例更新成功')
    } else {
      await createCaseApi(submitData as CreateCaseDto)
      message.success('案例创建成功')
    }

    router.push('/case')
  },
  {
    manual: true,
    onError: (error) => {
      message.error(isEdit.value ? '案例更新失败' : '案例创建失败')
      console.error('提交失败:', error)
    },
  },
)

// 文件上传前验证
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 自定义上传
const handleUpload = async (options: any) => {
  try {
    const result = await uploadFile(options.file)
    formData.coverImage = {
      id: result.id,
      filename: result.originalName,
      url: result.url,
    }

    message.success('封面上传成功')
  } catch (error) {
    message.error('封面上传失败')
    console.error('封面上传失败:', error)
  }
}

// 返回列表
const handleBack = () => {
  router.push('/case')
}

// 提交表单
const handleSubmit = () => {
  submitRequest.run()
}

// 初始化
onMounted(() => {
  const id = route.params.id as string
  if (id && id !== 'undefined') {
    isEdit.value = true
    caseId.value = parseInt(id, 10)
    getCaseDetailRequest.run(caseId.value)
  }
})
</script>

<style scoped>
.case-detail-container {
  padding: 24px;
}
.action-row {
  margin-bottom: 16px;
}
.basic-info-col {
  margin-bottom: 16px;
}
.cover-upload {
  text-align: center;
}

.cover-uploader {
  width: 100%;
}

:deep(.ant-upload-select-picture-card) {
  width: 100%;
  height: 120px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.upload-tips {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: left;
}

.upload-tips p {
  margin: 2px 0;
}
</style>
