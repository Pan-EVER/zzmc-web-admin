<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? '编辑产品' : '新建产品'"
    width="1000px"
    :ok-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="保存"
    cancel-text="取消"
  >
    <a-form
      :model="form"
      :label-col="labelWidth"
      :wrapper-col="{ span: 20 }"
      layout="horizontal"
      :rules="rules"
      ref="formRef"
    >
      <!-- 基本信息 -->
      <a-divider orientation="center" style="font-size: 16px">基本信息</a-divider>
      <a-form-item label="产品名称" name="name">
        <a-input v-model:value="form.name" placeholder="请输入产品名称" />
      </a-form-item>
      <a-form-item label="产品描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入文本"
        />
      </a-form-item>

      <!-- 概览信息 -->
      <a-divider orientation="center" style="font-size: 16px">概览信息</a-divider>
      <a-form-item label="标题" name="title">
        <a-input v-model:value="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item
        label="标题描述"
        name="titleDescriptions"
        :wrapper-col="wrapperCol"
        class="titleDescriptions-item"
      >
        <a-input v-model:value="form.titleDescriptions[0]" placeholder="请输入文本" />
      </a-form-item>
      <a-form-item
        name="titleDescriptions"
        :wrapper-col="wrapperCol"
        class="titleDescriptions-item"
      >
        <a-input v-model:value="form.titleDescriptions[1]" placeholder="请输入文本" />
      </a-form-item>
      <a-form-item
        name="titleDescriptions"
        :wrapper-col="wrapperCol"
        class="titleDescriptions-item"
      >
        <a-input v-model:value="form.titleDescriptions[2]" placeholder="请输入文本" />
      </a-form-item>
      <a-form-item
        :label="`内容区域${index + 1}`"
        v-for="(item, index) in form.contentAreas"
        :key="index"
        :name="['contentAreas', index, 'content']"
        :rules="index === 0 ? [{ required: true, message: `内容区域${index + 1}不能为空` }] : []"
        :validateTrigger="['onBlur']"
      >
        <a-row :gutter="48">
          <a-col :span="12">
            <a-textarea
              v-model:value="item.content"
              :auto-size="{ minRows: 2, maxRows: 5 }"
              placeholder="请输入文本"
            />
          </a-col>
          <a-col :span="12" class="d-flex align-items-center">
            <!-- <span style="margin-right: 8px">内容区域{{ index + 1 }}图片</span> -->
            <!--  -->
            <a-form-item
              :name="`advantages[${index}].title`"
              :label-col="labelWidth"
              :wrapper-col="{ span: 20 }"
              :label="`内容区域${index + 1}图片:`"
              no-style
            >
              <a-upload
                list-type="picture-card"
                v-model:fileList="item.image"
                :before-upload="(file: UploadFile) => beforeUpload(file)"
                :on-remove="(file: UploadFile) => onRemove(file, item)"
                class="content-area-img"
                :maxCount="1"
                @preview="(file: UploadFile) => handlePreview(file)"
                @change="(file: UploadFile) => handleFileChange(file, item)"
              >
                <div>
                  <PlusOutlined />
                  <div style="margin-top: 8px">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        v-for="(item, index) in form.advantages"
        :key="index"
        :label="`优点${index + 1}`"
        :name="['advantages', index, 'description']"
        :rules="index === 0 ? [{ required: true, message: `优点${index + 1}不能为空` }] : []"
      >
        <a-row :gutter="48">
          <a-col :span="12">
            <a-input v-model:value="item.description" placeholder="请输入文本" />
          </a-col>
          <a-col :span="12" class="d-flex align-items-center">
            <a-form-item
              :name="['advantages', index, 'title']"
              :label-col="labelWidth"
              :wrapper-col="{ span: 20 }"
              :rules="
                index === 0 ? [{ required: true, message: `优点${index + 1}的标题不能为空` }] : []
              "
              :label="`优点${index + 1}描述:`"
              class="advantage-title"
            >
              <a-textarea
                v-model:value="item.title"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入优点描述"
                class="custom-textarea"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-image
    :width="200"
    :style="{ display: 'none' }"
    :preview="{
      visible: previewVisible,
      src: previewSrc,
      onVisibleChange: (visible) => (previewVisible = visible),
    }"
  />
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadFile as AntUploadFile } from 'ant-design-vue'
import type { ContentItem } from '../types'

import { uploadFile } from '@/api/upload'

import { addProducts, updateProducts } from '@/api/product/productList'

const labelWidth = { style: { width: '100px' } }
const wrapperCol = { span: 0 }

const rules = {
  name: [{ required: true, message: '请输入产品名称' }],
  description: [{ required: true, message: '请输入产品描述' }],
}

interface UploadFile extends AntUploadFile {
  imageId?: string
}

type Contents = ContentItem[]

type FormType = {
  name: string
  description: string
  title: string
  titleDescriptions: string[]
  contentAreas: Contents
  advantages: {
    description: string
    title: string
  }[]
}

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  editInfo: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits<{
  (e: 'on-cancel', v: boolean): void
  (e: 'on-save', data: any): void
}>()

const visible = ref(false)

// 表单数据
let form = reactive<FormType>({
  name: '',
  description: '',
  title: '',
  titleDescriptions: ['', '', ''],
  contentAreas: [
    {
      content: '',
      image: [],
    },
    {
      content: '',
      image: [],
    },
    {
      content: '',
      image: [],
    },
  ],
  // 优点1
  advantages: [
    {
      description: '',
      title: '',
    },
    {
      description: '',
      title: '',
    },
    {
      description: '',
      title: '',
    },
  ],
})

const formRef = ref()

// 图片预览相关
const previewVisible = ref(false)
const previewSrc = ref('')
const initailDataFromProps = () => {
  const editInfo = JSON.parse(JSON.stringify(props.editInfo))
  const ensureArrayLength = (array, length, defaultValue, addImageField = false) => {
    return Array.from({ length }).map((_, index) => {
      const currentOne = array[index]
      if (currentOne) {
        if (addImageField && typeof currentOne === 'object') {
          return {
            ...currentOne,
            image: currentOne.image ? [{ ...currentOne.image }] : [],
          }
        }
        return currentOne
      }
      return defaultValue(index)
    })
  }

  editInfo.contentAreas = ensureArrayLength(
    editInfo.contentAreas || [],
    3,
    () => ({ content: '', image: [] }),
    true,
  )
  editInfo.advantages = ensureArrayLength(
    editInfo.advantages || [],
    3,
    () => ({ description: '', title: [] }),
    false,
  )
  editInfo.titleDescriptions = ensureArrayLength(
    editInfo.titleDescriptions || [],
    3,
    () => '',
    false,
  )

  // Merge data from editInfo into form if key exists
  Object.keys(editInfo).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(form, key)) {
      form[key] = editInfo[key]
    }
  })
}

const showModel = () => {
  visible.value = true
  nextTick(() => {
    resetForm()
    if (props.isEdit) {
      initailDataFromProps()
    }
  })
}

const beforeUpload = (file: UploadFile) => {
  // 限制大小或格式
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('仅支持 JPG/PNG 格式！')
    return false
  }
  return false
}

const onRemove = (file: UploadFile, currentInfo: ContentItem) => {
  currentInfo.image = currentInfo.image.filter((item) => item.uid !== file.uid)
}

const handleFileChange = async (info: any, currentInfo: ContentItem) => {
  const res = await uploadFile(info.file)
  currentInfo.image = currentInfo.image.map((item) => {
    if (item.uid === info.file?.uid) {
      item = {
        ...item,
        ...res,
      }
    }
    return item
  })
}

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewSrc.value = file.url || file.preview
  previewVisible.value = true
}

// 转换为base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// // 控制 Loading
const loading = ref(false)

const uploadImgs = async () => {
  form.contentAreas = await Promise.all(
    form.contentAreas.map(async (item) => {
      const resolvedImages = await Promise.all(
        item.image.map(async (img: any) => {
          const imageInfo = await uploadFile(img.originFileObj)
          return {
            ...img,
            ...imageInfo,
          }
        }),
      )
      return {
        ...item,
        image: resolvedImages,
      }
    }),
  )
}

const handleOk = async () => {
  const isPass = await formRef.value.validate()
  if (isPass) {
    // await uploadImgs()
    let { name, description, titleDescriptions, contentAreas, advantages } = form
    const params = {
      name,
      description,
      titleDescriptions,
      contentAreas: contentAreas
        .map((item) => {
          return {
            ...item,
            image: {
              id: item.image[0]?.id,
              filename: item.image[0]?.originalName || item.image[0]?.filename,
              url: item.image[0]?.url,
            },
          }
        })
        .filter((i) => i.content),
      advantages: advantages.filter((it) => it.title && it.description),
    }

    if (props.isEdit) {
      await updateProducts(props.editInfo?.id, params)
    } else {
      await addProducts(params)
    }
    message.success('保存成功')
    setTimeout(() => {
      emit('on-save', params)
      visible.value = false
    }, 1000)
  }
  // emit('on-save', form)
  // visible.value = false;
}

const handleCancel = () => {
  visible.value = false
  emit('on-cancel', visible.value)
}

const resetForm = () => {
  formRef.value.resetFields()
  form.contentAreas = Array.from([1, 2, 3], (_) => ({ content: '', image: [] }))
}

defineExpose({ showModel })
</script>

<style scoped>
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.content-area-img {
  width: auto;
}

:deep(.ant-row) {
  align-items: center;
}

.titleDescriptions-item {
  display: inline-block;
  margin-right: 10px;
}

.advantage-title {
  margin-bottom: 0;
}

.custom-textarea{
  min-width: 260px;
}
</style>
