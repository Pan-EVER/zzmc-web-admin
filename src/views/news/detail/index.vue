<template>
  <div class="news-detail-container">
    <a-row justify="end" class="header-section">
      <a-col>
        <a-space>
          <a-button @click="handleBack">返回</a-button>
          <a-button type="primary" :loading="submitRequest.loading.value" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
      <a-row :gutter="24">
        <a-col :span="16">
          <!-- 基本信息 -->
          <a-card title="基本信息" style="margin-bottom: 16px">
            <a-form-item label="新闻标题" name="title">
              <a-input
                v-model:value="formData.title"
                placeholder="请输入新闻标题"
                :maxlength="100"
                show-count
              />
            </a-form-item>

            <a-form-item label="新闻概述" name="summary">
              <a-textarea
                v-model:value="formData.summary"
                placeholder="请输入新闻概述"
                :rows="3"
                :maxlength="200"
                show-count
              />
            </a-form-item>

            <a-form-item label="新闻分类" name="category">
              <a-select v-model:value="formData.category" placeholder="请选择新闻分类">
                <a-select-option value="company">公司新闻</a-select-option>
                <a-select-option value="industry">行业资讯</a-select-option>
              </a-select>
            </a-form-item>
          </a-card>
        </a-col>
        <a-col :span="8">
          <!-- 封面设置 -->
          <a-card title="封面设置" style="margin-bottom: 16px">
            <a-form-item label="封面图片">
              <div class="cover-upload-area">
                <a-upload
                  v-model:file-list="coverFileList"
                  name="file"
                  list-type="picture-card"
                  class="cover-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :custom-request="handleUpload"
                >
                  <div v-if="formData.coverImageUrl" class="cover-preview">
                    <img :src="formData.coverImageUrl" alt="封面" />
                    <div class="cover-overlay">
                      <EyeOutlined @click.stop="previewCover" />
                      <DeleteOutlined @click.stop="removeCover" />
                    </div>
                  </div>
                  <div v-else class="upload-placeholder">
                    <PlusOutlined />
                    <div>上传封面</div>
                  </div>
                </a-upload>
              </div>
              <div class="upload-tips">
                <!-- <p>• 建议尺寸：800x450px</p> -->
                <p>• 支持格式：JPG、PNG</p>
                <p>• 文件大小：不超过2MB</p>
              </div>
            </a-form-item>
          </a-card>
          <!-- 发布设置 -->
          <!-- <a-card title="发布设置">
            <a-form-item label="发布状态" name="isPublished">
              <a-switch
                v-model:checked="formData.isPublished"
                checked-children="已发布"
                un-checked-children="草稿"
              />
            </a-form-item>

            <a-form-item label="发布时间" name="publishedAt" v-if="formData.isPublished">
              <a-date-picker
                v-model:value="formData.publishedAt"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择发布时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-card> -->
        </a-col>
        <a-col :span="24">
          <!-- 新闻内容 -->
          <a-card title="新闻内容">
            <a-form-item name="content">
              <RichTextEditor v-model:content="formData.content" />
            </a-form-item>
          </a-card>
        </a-col>
      </a-row>
    </a-form>

    <!-- 封面预览 -->
    <a-modal v-model:open="previewVisible" title="封面预览" :footer="null" centered>
      <img :src="formData.coverImageUrl" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import RichTextEditor from '@/components/RichTextEditor/index.vue'
import {
  createNewsApi,
  updateNewsApi,
  getNewsDetailApi,
  type CreateNewsDto,
  type UpdateNewsDto,
} from '@/api/news'
import { uploadFile } from '@/api/upload'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)
const newsId = computed(() => Number(route.params.id))

// 表单引用
const formRef = ref()

// 封面预览
const previewVisible = ref(false)
const coverFileList = ref([])

// 表单数据
interface FormData {
  title: string
  summary: string
  content: string
  category: string | undefined
  coverImageUrl: string
  coverImageId?: number
  isPublished: boolean
}

const formData = reactive<FormData>({
  title: '',
  summary: '',
  content: '',
  category: undefined,
  coverImageUrl: '',
  coverImageId: undefined,
  isPublished: true,
  // publishedAt: null,
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  summary: [
    { required: true, message: '请输入新闻概述', trigger: 'blur' },
    { min: 10, max: 200, message: '概述长度在 10 到 200 个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' },
    { min: 50, message: '内容不能少于50个字符', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择新闻分类', trigger: 'change' }],
}

// 获取新闻详情（编辑模式）
const newsDetailRequest = useRequest(() => getNewsDetailApi(newsId.value), {
  manual: true,
  onSuccess: (data) => {
    const news = data
    console.log(news)
    Object.assign(formData, {
      title: news.title,
      summary: news.summary,
      content: news.content,
      category: news.category,
      coverImageUrl: news.coverImageUrl || '',
      isPublished: news.isPublished,
    })
  },
  onError: (error) => {
    console.log(error)
    message.error('获取新闻详情失败')
  },
})

// 提交表单
const submitRequest = useRequest(
  async () => {
    const submitData = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      category: formData.category!,
      coverImageId: formData.coverImageId,
      isPublished: formData.isPublished,
    }

    if (isEdit.value) {
      return updateNewsApi(newsId.value, submitData as UpdateNewsDto)
    } else {
      return createNewsApi(submitData as CreateNewsDto)
    }
  },
  {
    manual: true,
    onSuccess: () => {
      message.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/news')
    },
    onError: () => {
      message.error(isEdit.value ? '更新失败' : '创建失败')
    },
  },
)

// 处理函数
const handleBack = () => {
  router.back()
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitRequest.run()
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

// 封面上传相关
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

const handleUpload = async (options: any) => {
  try {
    const result = await uploadFile(options.file)
    formData.coverImageUrl = result.url
    formData.coverImageId = result.id
    message.success('封面上传成功')
  } catch (error) {
    message.error('封面上传失败')
    console.error('封面上传失败:', error)
  }
}

const previewCover = () => {
  previewVisible.value = true
}

const removeCover = () => {
  formData.coverImageUrl = ''
  coverFileList.value = []
}

// 生命周期
onMounted(() => {
  if (isEdit.value) {
    newsDetailRequest.run()
  }
})
</script>

<style scoped>
.news-detail-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.cover-upload-area {
  margin-bottom: 12px;
}

.cover-uploader {
  width: 100%;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

.cover-overlay .anticon {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cover-overlay .anticon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-placeholder:hover {
  border-color: #1890ff;
}

.upload-tips {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.upload-tips p {
  margin: 0;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100%;
  height: 120px;
  margin: 0;
}

:deep(.w-e-text-container) {
  font-size: 14px;
  line-height: 1.6;
}

:deep(.w-e-text-placeholder) {
  font-style: normal;
  color: #bfbfbf;
}
</style>
