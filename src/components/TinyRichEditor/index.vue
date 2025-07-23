<template>
  <div>
    <Editor
      :initial-value="''"
      v-model="content"
      api-key="no-api-key"
      tinymceScriptSrc="/admin/tinymce/tinymce.min.js"
      :init="editorConfig"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import { computed, watch } from 'vue'
import { uploadFile } from '@/api/upload'
import { allPlugins, allToolbar } from './constants'

const content = defineModel<string>('content')
const props = defineProps<{
  initValue?: string
}>()

// 处理图片URL，确保绝对路径
const processImageUrls = (htmlContent: string) => {
  if (!htmlContent) return htmlContent

  // 将相对路径转换为绝对路径
  return htmlContent.replace(
    /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi,
    (match, before, src, after) => {
      let processedSrc = src

      // 处理相对路径
      if (src && !src.startsWith('http') && !src.startsWith('/')) {
        // 移除 ../ 前缀
        processedSrc = src.replace(/^(\.\.\/)+/, '/')
      }

      return `<img${before}src="${processedSrc}"${after}>`
    },
  )
}

watch(
  [() => props.initValue, content],
  ([newInitVal, newContentVal]) => {
    if (newInitVal && !newContentVal) {
      // 处理初始值中的图片URL
      content.value = processImageUrls(newInitVal)
    }
  },
  {
    immediate: true,
  },
)

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
        // 确保返回的URL是绝对路径，避免相对路径被WAF拦截
        let imageUrl = response.url

        // 如果返回的是相对路径，转换为绝对路径
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          // 处理类似 "../../../uploads/xxx.jpg" 的相对路径
          imageUrl = imageUrl.replace(/^(\.\.\/)+/, '/')
        }

        console.log('图片上传成功，URL:', imageUrl)
        resolve(imageUrl)
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
  images_upload_handler: handleImageUpload,
  // 允许的图片格式
  images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
  // 图片上传时显示进度
  images_upload_credentials: false,
  // 自动调整图片大小
  automatic_uploads: true,
  // 防止TinyMCE将绝对路径转换为相对路径
  relative_urls: false,
  remove_script_host: false,
  convert_urls: false,
  // 自定义URL转换函数，确保图片路径始终为绝对路径
  urlconverter_callback: (url: string, node: any, on_save: boolean) => {
    // 如果是图片标签且URL是相对路径，转换为绝对路径
    if (node && node.nodeName === 'IMG' && url && !url.startsWith('http') && !url.startsWith('/')) {
      // 移除相对路径前缀
      let processedUrl = url.replace(/^(\.\.\/)+/, '/')
      return processedUrl
    }
    return url
  },
  // 设置内容处理回调
  setup: (editor: any) => {
    // 在编辑器获取内容时处理图片URL
    editor.on('GetContent', (e: any) => {
      if (e.content) {
        e.content = processImageUrls(e.content)
      }
    })

    // 在编辑器设置内容时处理图片URL
    editor.on('SetContent', (e: any) => {
      if (e.content) {
        e.content = processImageUrls(e.content)
      }
    })
  },
}))
</script>

<style scoped></style>
