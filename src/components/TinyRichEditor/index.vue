<template>
  <div>
    <Editor
      :initial-value="''"
      v-model="content"
      api-key="no-api-key"
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      :init="editorConfig"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import { computed } from 'vue'
import { uploadFile } from '@/api/upload'
import { allPlugins, allToolbar } from './constants'

const content = defineModel<string>('content')

// 自定义图片上传处理函数
const handleImageUpload = (blobInfo: any, progress: (percent: number) => void) => {
  return new Promise<string>((resolve, reject) => {
    // 将 blob 转换为 File 对象
    const file = new File([blobInfo.blob()], blobInfo.filename(), {
      type: blobInfo.blob().type,
    })

    // 调用上传接口
    uploadFile(file)
      .then((response) => {
        // 返回图片的 URL
        resolve(response.url)
      })
      .catch((error) => {
        console.error('图片上传失败:', error)
        reject('图片上传失败')
      })
  })
}

// TinyMCE 配置
const editorConfig = computed(() => ({
  selector: 'textarea#open-source-plugins',
  license_key: 'gpl',
  promotion: false,
  branding: false,
  language: 'zh_CN',
  height: 800,
  plugins: allPlugins,
  editimage_cors_hosts: ['picsum.photos'],
  menubar: false,
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough superscript subscript | align numlist bullist | link image table hr | lineheight outdent indent| forecolor backcolor removeformat |  emoticons | code | codesample',
  // toolbar: allToolbar,
  toolbar_mode: 'sliding',

  // 自定义图片上传处理
  // images_upload_handler: handleImageUpload,
  // // 允许的图片格式
  // images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
  // // 图片上传时显示进度
  // images_upload_credentials: false,
  // 自动调整图片大小
  automatic_uploads: true,
}))
</script>

<style scoped></style>
