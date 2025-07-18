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
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { type IDomEditor, type IEditorConfig, type IToolbarConfig, Boot } from '@wangeditor/editor'
import { uploadFile } from '@/api/upload'
import { message } from 'ant-design-vue'
// import { registerCustomMenus } from './customMenus'

defineOptions({ name: 'RichTextEditor' })

const content = defineModel<string>('content')
// 编辑器实例
const editorRef = shallowRef<IDomEditor>()

// 在组件挂载时注册自定义菜单和HTML解析
onMounted(async () => {
  try {
    const { registerCustomMenus } = await import('./customMenus')
    registerCustomMenus()

    // 注册自定义HTML解析，用于保留图片浮动样式
    Boot.registerParseElemHtml({
      selector: 'p[class*="img-"], div[class*="img-"], p[style*="float"], div[style*="float"], p[style*="margin"], div[style*="margin"]',
      parseElemHtml: (domElem: Element) => {
        const tagName = domElem.tagName.toLowerCase()
        const className = domElem.getAttribute('class') || ''
        const style = domElem.getAttribute('style') || ''

        const result: any = {
          type: tagName === 'p' ? 'paragraph' : 'div',
          children: [{ text: '' }], // 临时子节点，会被实际内容替换
        }

        if (className) {
          result.className = className
        }
        if (style) {
          result.style = style
        }

        return result
      }
    })

    // 注册通用p标签解析，保留class和style属性
    Boot.registerParseElemHtml({
      selector: 'p[class], p[style]',
      parseElemHtml: (domElem: Element) => {
        const className = domElem.getAttribute('class') || ''
        const style = domElem.getAttribute('style') || ''

        const result: any = {
          type: 'paragraph',
          children: [{ text: '' }], // 临时子节点，会被实际内容替换
        }

        if (className) {
          result.className = className
        }
        if (style) {
          result.style = style
        }

        return result
      }
    })

    // 注册自定义HTML序列化器
    Boot.registerElemToHtml({
      type: 'paragraph',
      elemToHtml: (elem, childrenHtml) => {
        const { className, style } = elem as any

        if (className || style) {
          let attrs = ''
          if (className) attrs += ` class="${className}"`
          if (style) attrs += ` style="${style}"`

          return `<p${attrs}>${childrenHtml}</p>`
        }

        return childrenHtml // 使用默认序列化
      }
    })

    Boot.registerElemToHtml({
      type: 'div',
      elemToHtml: (elem, childrenHtml) => {
        const { className, style } = elem as any

        if (className || style) {
          let attrs = ''
          if (className) attrs += ` class="${className}"`
          if (style) attrs += ` style="${style}"`

          return `<div${attrs}>${childrenHtml}</div>`
        }

        return childrenHtml // 使用默认序列化
      }
    })
  } catch (error) {
    console.error('注册自定义菜单或HTML解析失败:', error)
  }
})
// 编辑器配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'fullScreen'], // 排除上传视频功能
}

const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  // 配置图片点击时的悬浮菜单
  hoverbarKeys: {
    image: {
      menuKeys: [
        // 'editImage',
        'imageWidth30',
        'imageWidth50',
        'imageWidth100',
        'customFloatLeftImage',
        'customCenterImage',
        'customFloatRightImage',
        'deleteImage',
      ], // 添加更多默认图片菜单项和自定义菜单
    },
  },
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

<style>
/* 图片浮动样式 - 全局样式，确保在编辑器内外都生效 */
.img-float-left {
  float: left !important;
  margin-right: 10px !important;
  margin-bottom: 10px !important;
  margin-left: 0 !important;
}

.img-float-right {
  float: right !important;
  margin-left: 10px !important;
  margin-bottom: 10px !important;
  margin-right: 0 !important;
}

.img-center {
  float: none !important;
  margin: 0 auto 10px auto !important;
  display: block !important;
}
</style>
