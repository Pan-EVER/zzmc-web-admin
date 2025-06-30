<script setup lang="ts" name="BaseFileListUpload">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { UploadFile as AntUploadFile, UploadChangeParam } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { uploadFile } from '@/api/upload'

interface UploadFile extends AntUploadFile {
  imageId?: string
  response?: any // 添加响应类型
}

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true,
  },
  fileList: {
    type: Array as () => UploadFile[],
    default: () => [],
  },
  accept: {
    type: String,
    default: '.doc,.docx,.xml,.pdf,.xls,.xlsx',
  },
})

const emit = defineEmits(['on-change'])

const _fileList = ref<UploadFile[]>([])
const uploading = ref(false)

// 监听传入的 fileList 变化
watch(
  () => props.fileList,
  (newVal) => {
    _fileList.value = [...newVal]
  },
  { immediate: true },
)

// 验证文件类型
const isValidFileType = (file: File) => {
  const acceptTypes = props.accept.split(',')
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

  // 1. 检查文件扩展名
  if (acceptTypes.includes(fileExtension)) {
    return true
  }

  // 2. 检查 MIME 类型
  return acceptTypes.includes(file.type)
}

// 自定义上传实现
const customRequest = async (options: any) => {
  const { file, onSuccess, onError } = options

  // 验证文件类型
  if (!isValidFileType(file)) {
    onRemove(file)
    message.error('不支持的文件类型!')
    onError(new Error('不支持的文件类型'))
    return
  }

  try {
    uploading.value = true
    // 上传文件
    const res = await uploadFile(file)

    // 更新文件状态
    onSuccess(res, file)

    // 更新文件列表
    _fileList.value = _fileList.value.map((item) => {
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
    emit('on-change', _fileList.value)
  } catch (error) {
    console.error('上传失败:', error)
    onError(error)
    message.error('文件上传失败')

    // 更新文件状态为错误
    _fileList.value = _fileList.value.map((item) => {
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
  _fileList.value = info.fileList.filter((file) => {
    // 只保留合格文件或已存在文件
    return file.status !== 'error' || props.fileList.some((f) => f.uid === file.uid)
  })
}

// 移除文件
const onRemove = (file: UploadFile) => {
  _fileList.value = _fileList.value.filter((item) => item.uid !== file.uid)
  emit('on-change', _fileList.value)
}

// 预览文件
const handlePreview = async (file: UploadFile) => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else if (file.response?.url) {
    window.open(file.response.url, '_blank')
  } else {
    message.warning('该文件暂无预览地址')
  }
}
</script>

<template>
  <div class="upload-container">
    <a-upload
      v-model:file-list="_fileList"
      :custom-request="customRequest"
      :on-remove="onRemove"
      @change="handleChange"
      @preview="handlePreview"
      :multiple="multiple"
      :accept="accept"
      :disabled="uploading"
      list-type="text"
    >
      <a-button :loading="uploading">
        <UploadOutlined />
        选择文件
      </a-button>
    </a-upload>
  </div>
</template>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
}
</style>
