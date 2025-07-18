<template>
  <div>
    <div class="parammeter-rich-editor">
      <TinyRichEditor v-model:content="formValue.parameterTable" />
    </div>
    <BaseFileListUpload
      :fileList="formValue.attachments"
      @on-change="(file) => handleFileChange(file)"
      :accept="''"
    ></BaseFileListUpload>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, reactive } from 'vue'
import type { UploadFile as AntUploadFile } from 'ant-design-vue'
import BaseFileListUpload from '../component/BaseFileListUpload.vue'
import { TinyRichEditor } from '@/components'
import { getModelDetailById } from '@/api/product/models'
import { useRoute } from 'vue-router'

interface UploadFile extends AntUploadFile {
  imageId?: string
}
const route = useRoute()
const id = route.params.id

const formValue = reactive({ parameterTable: '', attachments: [] })

onBeforeMount(async () => {
  const id = route.params.id as string
  if (id) {
    const res = await getModelDetailById(id)
    formValue.parameterTable = res.parameterTable
  }
})
const handleFileChange = (list: Array<UploadFile>) => {
  formValue.attachments = list
}
</script>
<style scoped>
.parammeter-rich-editor {
  margin-bottom: 12px;
}
</style>
