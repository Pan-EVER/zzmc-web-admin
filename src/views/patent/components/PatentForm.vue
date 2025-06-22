<template>
  <a-modal
    :title="isEdit ? '编辑专利' : '添加专利'"
    :open="open"
    @cancel="handleCancel"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ disabled: !isFormValid }"
  >
    <a-form :model="formState" layout="vertical">
      <a-form-item label="专利名称" required>
        <a-input v-model:value="formState.name" placeholder="请输入专利名称" />
      </a-form-item>

      <a-form-item label="专利类型" required>
        <a-select v-model:value="formState.type" placeholder="请选择专利类型">
          <a-select-option :value="1">气浮轴承</a-select-option>
          <a-select-option :value="2">气浮辊</a-select-option>
          <a-select-option :value="3">气浮运动平台</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="专利图片" required>
        <a-upload
          v-model:fileList="fileList"
          list-type="picture-card"
          :beforeUpload="beforeUpload"
          :maxCount="1"
          @preview="handlePreview"
          @change="handleFileChange"
        >
          <div v-if="fileList.length < 1">
            <upload-outlined />
            <div style="margin-top: 8px">上传</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>

    <!-- 图片预览 -->
    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: previewVisible,
        src: previewSrc,
        onVisibleChange: (visible) => (previewVisible = visible),
      }"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'
import { createPatent, updatePatent } from '@/api/patent'
import { uploadFile } from '@/api/upload'
import type { Patent, CreatePatentDto } from '@/api/patent'

interface Props {
  isEdit: boolean
  patentData?: Patent
}

const open = defineModel<boolean>('open')
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

// 表单状态
const formState = reactive<{
  name: string
  type: number | null
  imageId: number | null
}>({
  name: '',
  type: null,
  imageId: null,
})

// 文件上传相关
const fileList = ref<any[]>([])
const confirmLoading = ref(false)

// 图片预览相关
const previewVisible = ref(false)
const previewSrc = ref('')

// 表单验证
const isFormValid = computed(() => {
  return !!formState.name && !!formState.type && (!!formState.imageId || fileList.value.length > 0)
})

// 监听专利数据变化，回显数据
watch(
  [() => props.patentData, open],
  ([newVal, newOpenVal]) => {
    if (newVal && props.isEdit && newOpenVal) {
      formState.name = newVal.name
      formState.type = newVal.type
      formState.imageId = newVal.imageId

      // 回显图片
      fileList.value = [
        {
          uid: '-1',
          name: '专利图片',
          status: 'done',
          url: newVal.imageUrl,
        },
      ]
    }
  },
  { immediate: true },
)

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 阻止自动上传
  return false
}

// 处理文件变化
const handleFileChange = (info: any) => {
  // 当上传了新文件且专利名称为空时，自动填充文件名
  if (info.fileList.length > 0 && info.fileList[0].originFileObj && !formState.name) {
    // 获取文件名（去除扩展名）
    const fileName = info.fileList[0].name.split('.').slice(0, -1).join('.')
    formState.name = fileName
  }
}

// 预览上传的图片
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

// 取消弹窗
const handleCancel = () => {
  open.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formState.name = ''
  formState.type = null
  formState.imageId = null
  fileList.value = []
}

// 提交表单
const handleOk = async () => {
  if (!isFormValid.value) return

  confirmLoading.value = true
  try {
    // 如果有新上传的文件，先上传文件
    if (fileList.value.length > 0 && fileList.value[0].originFileObj) {
      const file = fileList.value[0].originFileObj
      const uploadRes = await uploadFile(file)
      formState.imageId = uploadRes.id
    }

    const data: CreatePatentDto = {
      name: formState.name,
      type: formState.type as number,
      imageId: formState.imageId,
    }

    if (props.isEdit && props.patentData) {
      await updatePatent(props.patentData.id, data)
      message.success('更新成功')
    } else {
      await createPatent(data)
      message.success('添加成功')
    }

    open.value = false
    emit('success')
    resetForm()
  } catch (error) {
    console.error('操作失败:', error)
    message.error('操作失败')
  } finally {
    confirmLoading.value = false
  }
}
</script>
