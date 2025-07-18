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
        <TinyRichEditor v-model:content="form.overviewContent" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addProducts, updateProducts } from '@/api/product/productList'
import { TinyRichEditor } from '@/components'

const labelWidth = { style: { width: '100px' } }

const rules = {
  name: [{ required: true, message: '请选择产品名称' }],
  description: [{ required: true, message: '请输入产品描述' }],
  order: [{ required: true, message: '请输入排序权重' }],
}

type FormType = {
  name: undefined
  description: string
  order: number
  overviewContent: string
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
  (e: 'on-save'): void
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
})

const formRef = ref()

const initailDataFromProps = () => {
  const editInfo = JSON.parse(JSON.stringify(props.editInfo))
  // Merge data from editInfo into form if key exists
  Object.keys(editInfo).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(form, key)) {
      if (key === 'overviewContent') {
        form[key] = editInfo[key] || ''
      } else {
        form[key] = editInfo[key]
      }
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

const loading = ref(false)

const handleOk = async () => {
  let isPass: any
  try {
    isPass = await formRef.value.validate()
  } catch (error) {
    isPass = false
  }

  if (isPass) {
    const params = { ...form }

    if (props.isEdit) {
      await updateProducts(props.editInfo?.id, params)
    } else {
      await addProducts(params)
    }
    message.success('保存成功')
    setTimeout(() => {
      emit('on-save')
      visible.value = false
    }, 1000)
  }
}

const handleCancel = () => {
  visible.value = false
  emit('on-cancel', visible.value)
}

const resetForm = () => {
  formRef.value.resetFields()
  form.overviewContent = ''
}

watch(
  () => form.overviewContent,
  (val) => {
    console.log('---', (form.overviewContent = val))
  },
)

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
