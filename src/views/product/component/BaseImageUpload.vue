<script setup lang="ts" name="BaseImageUpload">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadFile as AntUploadFile, UploadChangeParam } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { uploadFile } from '@/api/upload'

interface UploadFile extends AntUploadFile {
  imageId?: string
  response?: any
}

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1,
  },
  imageList: {
    type: Array as () => UploadFile[],
    default: () => [],
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/gif,image/webp',
  },
  controlUploadDisplay: {
    type: Function,
    default: () => true,
  },
})

const emit = defineEmits(['on-change', 'on-remove'])

const fileList = ref<UploadFile[]>([])
const previewVisible = ref(false)
const previewSrc = ref('')
const uploading = ref(false)

// 监听传入的图片列表变化
watch(
  () => props.imageList,
  (newVal) => {
    fileList.value = [...newVal]
  },
  { immediate: true },
)

// 验证图片类型
const isValidImageType = (file: File) => {
  const acceptTypes = props.accept.split(',')
  return acceptTypes.includes(file.type)
}

// 自定义上传实现
const customRequest = async (options: any) => {
  const { file, onSuccess, onError } = options

  // 验证图片类型
  if (!isValidImageType(file)) {
    onRemove(file)
    message.error('不支持该图片格式！')
    onError(new Error('不支持的文件类型'))
    return
  }

  // 验证图片大小
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    onRemove(file)
    message.error('图片大小不能超过5MB!')
    onError(new Error('文件过大'))
    return
  }

  try {
    uploading.value = true
    // 上传图片
    const res = await uploadFile(file)

    // 更新文件状态
    onSuccess(res, file)

    // 更新文件列表
    fileList.value = fileList.value.map((item) => {
      if (item.uid === file.uid) {
        return {
          ...item,
          status: 'done',
          response: res,
        }
      }
      return item
    })

    // 通知父组件
    emit('on-change', fileList.value)
  } catch (error) {
    console.error('上传失败:', error)
    onError(error)
    message.error('图片上传失败')

    // 更新文件状态为错误
    fileList.value = fileList.value.map((item) => {
      if (item.uid === file.uid) {
        return { ...item, status: 'error' }
      }
      return item
    })
  } finally {
    uploading.value = false
  }
}

// 文件变化处理
const handleChange = (info: UploadChangeParam) => {
  // 过滤掉不合格文件
  fileList.value = info.fileList.filter((file) => {
    // 只保留合格文件或已存在文件
    return file.status !== 'error' || props.imageList.some((f) => f.uid === file.uid)
  })
}

// 移除图片
const onRemove = (file: UploadFile) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
  emit('on-change', fileList.value)
}

const handlePreview = async (file: UploadFile) => {
  console.log('handlePreview', file)
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewSrc.value = file.url || file.preview
  previewVisible.value = true
}
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const handleFileChange = async (info: any) => {
  const res = await uploadFile(info.file)
  fileList.value = fileList.value.map((item) => {
    if (item.uid === info.file?.uid) {
      item = {
        ...item,
        ...res,
      }
    }
    return item
  })
  emit('on-change', fileList.value)
}
</script>

<template>
  <div class="upload-container">
    <a-upload
      list-type="picture-card"
      v-model:file-list="fileList"
      :custom-request="customRequest"
      :on-remove="onRemove"
      @change="handleChange"
      @preview="handlePreview"
      :max-count="maxCount"
      :accept="props.accept"
      :disabled="uploading"
    >
      <div v-if="fileList.length < maxCount">
        <PlusOutlined />
        <div style="margin-top: 8px">上传</div>
      </div>
    </a-upload>

    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: previewVisible,
        src: previewSrc,
        onVisibleChange: (visible) => (previewVisible = visible),
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.upload-container {
}
</style>
