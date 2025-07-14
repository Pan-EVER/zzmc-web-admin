<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? '编辑产品' : '新建产品'"
    width="1050px"
    :ok-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="保存"
    cancel-text="取消"
  >
    <a-form
      :model="form"
      :label-col="labelWidth"
      :wrapper-col="{ span: 22 }"
      layout="horizontal"
      :rules="rules"
      ref="formRef"
    >
      <!-- 基本信息 -->
      <a-divider orientation="center" style="font-size: 16px">基本信息</a-divider>
      <a-form-item label="产品名称" name="name">
        <!-- <a-input v-model:value="form.name" placeholder="请输入产品名称" /> -->
        <a-select ref="select" v-model:value="form.name" placeholder="请选择产品名称">
          <a-select-option :value="it.value" v-for="it in productNameOptions" :key="it.value">{{
            it.value
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="产品描述" name="description">
        <a-textarea
          v-model:value="form.description"
          :auto-size="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入文本"
        />
      </a-form-item>
      <a-form-item label="排序权重" name="order">
        <a-input-number id="inputNumber" v-model:value="form.order" :min="0" />
      </a-form-item>

      <!-- 概览信息 -->
      <a-divider orientation="center" style="font-size: 16px">概览信息</a-divider>
      <a-form-item name="overviewContent" :wrapper-col="{ span: 24 }">
        <RichTextEditor v-model:content="form.overviewContent" />
      </a-form-item>
      <!-- <a-form-item label="标题" name="title">
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
        :name="['contentAreas', index]"
        :rules="index === 0 ? contentAreasItemRules(index) : []"
        :validateTrigger="['onBlur', 'onChange']"
      >
        <a-row :gutter="48">
          <a-col :span="6">
            <a-form-item
              no-style
              :required="index === 0"
              :name="['contentAreas', index, 'title']"
              :rules="index === 0 ? contentAreasItemRules(index) : []"
            >
              <a-input v-model:value="item.title" :placeholder="`请输入内容区域${index + 1}标题`" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              no-style
              :required="index === 0"
              :name="['contentAreas', index, 'content']"
              :rules="index === 0 ? contentAreasItemRules(index) : []"
            >
              <a-textarea
                v-model:value="item.content"
                :auto-size="{ minRows: 2, maxRows: 5 }"
                placeholder="请输入文本"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" class="d-flex align-items-center">
            <a-form-item
              :name="`contentAreas[${index}].image`"
              :label-col="labelWidth"
              :wrapper-col="{ span: 20 }"
              :label="`内容区域${index + 1}图片:`"
              no-style
            >
              <BaseImageUpload
                :imageList="item.image"
                :maxCount="1"
                @on-change="(file) => handleImageChange(file,item)"
              />
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
      </a-form-item> -->
    </a-form>
  </a-modal>
  <!-- <a-image
    :width="200"
    :style="{ display: 'none' }"
    :preview="{
      visible: previewVisible,
      src: previewSrc,
      onVisibleChange: (visible) => (previewVisible = visible),
    }"
  /> -->
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
// import { PlusOutlined } from '@ant-design/icons-vue'
// import type { UploadFile as AntUploadFile } from 'ant-design-vue'
// import type { ContentItem } from '../types'

// import { uploadFile } from '@/api/upload'

import { addProducts, updateProducts } from '@/api/product/productList'

// import BaseImageUpload from '../component/BaseImageUpload.vue'
import RichTextEditor from '@/components/RichTextEditor/index.vue'

const labelWidth = { style: { width: '100px' } }
const wrapperCol = { span: 0 }

const rules = {
  name: [{ required: true, message: '请选择产品名称' }],
  description: [{ required: true, message: '请输入产品描述' }],
  order: [{ required: true, message: '请输入排序权重' }],
}

// interface UploadFile extends AntUploadFile {
//   imageId?: string
// }

// type Contents = ContentItem[]

type FormType = {
  name: undefined
  description: string
  order: number
  // title: string
  // titleDescriptions: string[]
  // contentAreas: Contents
  // advantages: {
  //   description: string
  //   title: string
  // }[]
  overviewContent: any
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

const productNameOptions = reactive([
  {
    value: '圆形止推气浮轴承',
  },
  {
    value: '矩形止推气浮轴承',
  },
  {
    value: '径向气浮轴承',
  },
  {
    value: '气浮运动台',
  },
  {
    value: '气浮转台',
  },
  {
    value: '气浮辊',
  },
])

// 表单数据
const form = reactive<FormType>({
  name: undefined,
  description: '',
  order: 0,
  overviewContent: '',
  // title: '',
  // titleDescriptions: ['', '', ''],
  // contentAreas: [
  //   {
  //     title: '',
  //     content: '',
  //     image: [],
  //   },
  //   {
  //     title: '',
  //     content: '',
  //     image: [],
  //   },
  //   {
  //     title: '',
  //     content: '',
  //     image: [],
  //   },
  // ],
  // // 优点1
  // advantages: [
  //   {
  //     description: '',
  //     title: '',
  //   },
  //   {
  //     description: '',
  //     title: '',
  //   },
  //   {
  //     description: '',
  //     title: '',
  //   },
  // ],
})

const formRef = ref()

// 图片预览相关
// const previewVisible = ref(false)
// const previewSrc = ref('')

// const contentAreasItemRules = computed(() => {
//   return (index: number) => {
//     return [
//       {
//         required: true,
//         message: '请输入内容区域内容',
//         validator: (_, val) => validateContentArea(val, index),
//       },
//     ]
//   }
// })
// const validateContentArea = (_, index) => {
//   const area = form.contentAreas[index]
//   if (!area.title && !area.content) {
//     return Promise.reject('标题和内容至少填写一项')
//   }
//   return Promise.resolve()
// }
const initailDataFromProps = () => {
  const editInfo = JSON.parse(JSON.stringify(props.editInfo))
  // const ensureArrayLength = (array, length, defaultValue, addImageField = false) => {
  //   return Array.from({ length }).map((_, index) => {
  //     const currentOne = array[index]
  //     if (currentOne) {
  //       if (addImageField && typeof currentOne === 'object') {
  //         return {
  //           ...currentOne,
  //           image: currentOne.image ? [{ ...currentOne.image,response:{...currentOne.image} }] : [],
  //         }
  //       }
  //       return currentOne
  //     }
  //     return defaultValue(index)
  //   })
  // }

  // editInfo.contentAreas = ensureArrayLength(
  //   editInfo.contentAreas || [],
  //   3,
  //   () => ({ title: '', content: '', image: [] }),
  //   true,
  // )
  // editInfo.advantages = ensureArrayLength(
  //   editInfo.advantages || [],
  //   3,
  //   () => ({ description: '', title: '' }),
  //   false,
  // )
  // editInfo.titleDescriptions = ensureArrayLength(
  //   editInfo.titleDescriptions || [],
  //   3,
  //   () => '',
  //   false,
  // )

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

// const handleImageChange = (list: Array<UploadFile>, currentInfo) => {
//   currentInfo.image = list
// }

// // // 控制 Loading
const loading = ref(false)

// const uploadImgs = async () => {
//   form.contentAreas = await Promise.all(
//     form.contentAreas.map(async (item) => {
//       const resolvedImages = await Promise.all(
//         item.image.map(async (img: any) => {
//           const imageInfo = await uploadFile(img.originFileObj)
//           return {
//             ...img,
//             ...imageInfo,
//           }
//         }),
//       )
//       return {
//         ...item,
//         image: resolvedImages,
//       }
//     }),
//   )
// }

const handleOk = async () => {
  let isPass: any
  try {
    isPass = await formRef.value.validate()
  } catch (error) {
    isPass = false
  }

  if (isPass) {
    // await uploadImgs()
    // const { name, title, description, titleDescriptions, contentAreas, advantages, order } = form
    // const params = {
    //   name,
    //   title,
    //   description,
    //   order,
    //   titleDescriptions,
    //   contentAreas: contentAreas
    //     .map((item) => {
    //       return {
    //         ...item,
    //         image:
    //           item.image.length > 0
    //             ? {
    //                 id: item.image[0]?.response?.id,
    //                 filename: item.image[0]?.response?.originalName || item.image[0]?.response?.filename,
    //                 url: item.image[0]?.response?.url,
    //               }
    //             : undefined,
    //       }
    //     })
    //     .filter((i) => i.content || i.title||i.image!==undefined),
    //   advantages: advantages.filter((it) => it.title && it.description),
    // }
    const params = { ...form }

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
  form.overviewContent = ''
  // form.contentAreas = Array.from([1, 2, 3], (_) => ({ title: '', content: '', image: [] }))
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

.custom-textarea {
  min-width: 260px;
}
</style>
