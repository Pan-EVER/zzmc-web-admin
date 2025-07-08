<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { UploadFile as AntUploadFile } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import type { Model } from '../types'
import { updateCurrentModel, getModelDetailById } from '@/api/product/models'
import BasicModelInformation from '../component/BasicModelInformation.vue'
import BaseImageUpload from '../component/BaseImageUpload.vue'
import BaseFileListUpload from '../component/BaseFileListUpload.vue'
import { tabsList } from '../constant/index'
import FormGenerator from '../component/FormGenerator.vue'

type ComponentAttrs = {
  labelCol?: { style?: Record<string, any> }
  wrapperCol?: { span?: number }
  [key: string]: any
}

type FormValue = {
  [key: string]: any
}

type FieldItem = {
  label: string
  name: string
  type: 'input' | 'textarea' | 'img-upload' | 'file-upload'
  attrs?: Record<string, any>
  slot?: boolean
}

interface tabItem {
  key: string
  tab: string
  buttonContent: string
  componentAttrs: ComponentAttrs
  formValue: FormValue
  fields: FieldItem[]
  className: string
}
interface UploadFile extends AntUploadFile {
  imageId?: string
}

const route = useRoute()
const router = useRouter()

const detailForm = ref<Model>({
  name: '',
  sku: '',
  description: '',
  modelId: null,
  coverImage: [],
})
const activeKey = ref<string>(tabsList[0].key)
const tabs = ref<tabItem[]>(tabsList)
const formRef = ref()
const loading = ref(false)
const saveBasicInfo = async (otherData = {}) => {
  const isPass = await formRef.value.validate()
  if (isPass) {
    loading.value = true
    const params = {
      name: detailForm.value.name,
      sku: detailForm.value.sku,
      description: detailForm.value.description,
      coverImage:
        detailForm.value.coverImage.length > 0
          ? {
              id: detailForm.value.coverImage[0]?.response?.id,
              filename:
                detailForm.value.coverImage[0]?.response?.originalName ||
                detailForm.value.coverImage[0]?.response?.filename,
              url: detailForm.value.coverImage[0]?.response?.url,
            }
          : undefined,
      ...otherData,
    }
    await updateCurrentModel(detailForm.value.modelId, params)
    loading.value = false
    message.success('操作成功！')
    _getModelDetailById()
  }
}
const handleImageChange = (list: Array<UploadFile>, currentInfo, props) => {
  currentInfo.formValue[props.item.name] = list
}

const handleFileChange = (list: Array<UploadFile>, currentInfo, props) => {
  currentInfo.formValue[props.item.name] = list
}

const saveFormValue = (newValue: any, currentInfo: any) => {
  for (const key in newValue) {
    if (Object.prototype.hasOwnProperty.call(currentInfo.formValue, key)) {
      currentInfo.formValue[key] = newValue[key]
    }
  }
  const otherData = {}
  Object.entries(currentInfo.formValue).forEach(([key, value]) => {
    if (key.endsWith('Attachments') && Array.isArray(value)) {
      value = value.map((i) => ({
        id: i.response?.id,
        filename: i.response?.originalName,
        url: i.response?.url,
      }))
    } else if (key.endsWith('Image') && Array.isArray(value)) {
      const currentImg = value[0]
      value = currentImg
        ? {
            id: currentImg?.response.id,
            filename: currentImg?.response?.originalName,
            url: currentImg?.response?.url,
          }
        : undefined
    }
    otherData[key] = value
  })
  saveBasicInfo(otherData)
}

const _getModelDetailById = async () => {
  const id = route.params.id
  const res = await getModelDetailById(id)
  const { name, sku, description, id: modelId, coverImage } = res
  detailForm.value = {
    name,
    sku,
    description,
    modelId,
    coverImage: coverImage
      ? [
          {
            ...coverImage,
            response: { ...coverImage },
          },
        ]
      : undefined,
  }
  tabs.value = tabs.value.map((item: any) => {
    for (const key in res) {
      if (Object.prototype.hasOwnProperty.call(item.formValue, key)) {
        if (key.endsWith('Image') && res[key]) {
          res[key] = [
            {
              ...res[key],
              name: res[key]?.filename,
              response: { ...res[key], originalName: res[key]?.filename },
            },
          ]
        } else if (key.endsWith('Attachments') && Array.isArray(res[key])) {
          res[key] = res[key].map((r) => ({
            ...r,
            name: r.filename,
            response: { ...r, originalName: r.filename },
          }))
        }
        item.formValue[key] = res[key]
          ? res[key]
          : key.endsWith('Image') || key.endsWith('Attachments')
            ? []
            : ''
      }
    }
    return item
  })
}

const backToList = () => {
  router.push({ path: '/product' })
}
onMounted(() => {})
onBeforeMount(() => {
  _getModelDetailById()
})
</script>

<template>
  <div class="details-page">
    <div class="go-back-to-list">
      <a-button type="primary" @click="backToList">返回列表页</a-button>
    </div>
    <div class="basic-container">
      <BasicModelInformation :formData="detailForm" ref="formRef" :wrapper-col="{ span: 10 }">
      </BasicModelInformation>
      <div class="custom-button">
        <a-button type="primary" @click="saveBasicInfo()" :loading="loading">保存基本信息</a-button>
      </div>
    </div>
    <div class="tabs">
      <a-tabs v-model:activeKey="activeKey" size="large" :tabBarGutter="200">
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab">
          <FormGenerator
            :modelValue="item.formValue"
            :fields="item.fields"
            :componentAttrs="item.componentAttrs"
            :className="item.className"
            :buttonContent="item.buttonContent"
            @on-finish="(newFormValue) => saveFormValue(newFormValue, item)"
          >
            <template #specificationAttachments-file-upload="props">
              <BaseFileListUpload
                :fileList="item.formValue.specificationAttachments"
                @on-change="(file) => handleFileChange(file, item, props)"
                :accept="''"
              ></BaseFileListUpload>
            </template>
            <template #installationImage-img-upload="props">
              <BaseImageUpload
                :imageList="item.formValue.installationImage"
                :maxCount="1"
                @on-change="(file) => handleImageChange(file, item, props)"
              ></BaseImageUpload>
            </template>
            <template #installationAttachments-file-upload="props">
              <BaseFileListUpload
                :fileList="item.formValue.installationAttachments"
                @on-change="(file) => handleFileChange(file, item, props)"
                :accept="''"
              ></BaseFileListUpload>
            </template>
            <template #performanceImage-img-upload="props">
              <BaseImageUpload
                :imageList="item.formValue.performanceImage"
                :maxCount="1"
                @on-change="(file) => handleImageChange(file, item, props)"
              ></BaseImageUpload>
            </template>
            <template #performanceAttachments-file-upload="props">
              <BaseFileListUpload
                :fileList="item.formValue.performanceAttachments"
                @on-change="(file) => handleFileChange(file, item, props)"
                :accept="''"
              ></BaseFileListUpload>
            </template>
            <template #engineeringImage-img-upload="props">
              <BaseImageUpload
                :imageList="item.formValue.engineeringImage"
                :maxCount="1"
                @on-change="(file) => handleImageChange(file, item, props)"
              ></BaseImageUpload>
            </template>
            <template #engineeringAttachments-file-upload="props">
              <BaseFileListUpload
                :fileList="item.formValue.engineeringAttachments"
                @on-change="(file) => handleFileChange(file, item, props)"
                :accept="''"
              ></BaseFileListUpload>
            </template>
          </FormGenerator>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.details-page {
  padding: 0 50px;

  .basic-container {
    width: 100%;
    box-sizing: border-box;

    .custom-button {
      width: 50%;
      text-align: right;
    }
  }

  :deep(.specifi-cations-form) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .ant-form-item {
      margin-bottom: 20px;
    }
  }
  .go-back-to-list {
    text-align: right;
  }
}
</style>
