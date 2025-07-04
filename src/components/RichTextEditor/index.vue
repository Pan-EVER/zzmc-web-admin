<template>
  <div class="editor-container">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="content"
      :defaultConfig="editorConfig"
      mode="default"
      style="height: 600px; overflow-y: auto"
      @onCreated="handleCreated"
    />
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, shallowRef } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { type IDomEditor, type IEditorConfig, type IToolbarConfig } from '@wangeditor/editor'
import { uploadFile } from '@/api/upload'
import { message } from 'ant-design-vue'

defineOptions({ name: 'RichTextEditor' })

const content = defineModel<string>('content')
// 编辑器实例
const editorRef = shallowRef<IDomEditor>()

// 编辑器配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'fullScreen'], // 排除上传视频功能
}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入案例内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      customUpload: async (
        file: File,
        insertFn: (url: string, alt: string, href: string) => void,
      ) => {
        try {
          const result = await uploadFile(file)
          insertFn(result.url, result.originalName, '')
          message.success('图片上传成功')
        } catch (error) {
          message.error('图片上传失败')
          console.error('图片上传失败:', error)
        }
      },
    },
  },
}

// 编辑器创建回调
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<style scoped>
.editor-container {
  border: 1px solid #ccc;
  z-index: 100;
}
</style>
