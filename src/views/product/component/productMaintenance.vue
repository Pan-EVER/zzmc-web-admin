<template>
    <a-modal v-model:open="visible" :title="isEdit?'编辑产品' : '新建产品'" width="1000px" :ok-loading="loading" @ok="handleOk"
        @cancel="handleCancel" ok-text="保存" cancel-text="取消">
        <a-form :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" layout="horizontal" :rules="rules" ref="formRef">
            <!-- 基本信息 -->
            <a-divider orientation="center" style="font-size: 16px;">基本信息</a-divider>
            <a-form-item label="产品名称" name="productName" >
                <a-input v-model:value="form.productName" placeholder="请输入产品名称" />
            </a-form-item>
            <a-form-item label="产品描述" name="description">
                <a-textarea v-model:value="form.description" :auto-size="{ minRows: 2, maxRows: 5 }" placeholder="请输入文本" />
            </a-form-item>

            <!-- 概览信息 -->
            <a-divider orientation="center" style="font-size: 16px;">概览信息</a-divider>
            <a-form-item label="标题" name="title">
                <a-input v-model:value="form.title" placeholder="请输入标题" />
            </a-form-item>

            <a-form-item label="标题描述" name="titleDesc">
                <a-row :gutter="16">
                    <a-col :span="8">
                        <a-input v-model:value="form.titleDesc[0]" placeholder="请输入文本" />
                    </a-col>
                    <a-col :span="8">
                        <a-input v-model:value="form.titleDesc[1]" placeholder="请输入文本" />
                    </a-col>
                    <a-col :span="8">
                        <a-input v-model:value="form.titleDesc[2]" placeholder="请输入文本" />
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item :label="`内容区域${index + 1}`" v-for="(item, index) in form.contents" :key="index" name="contents">
                <a-row :gutter="48">
                    <a-col :span="12">
                        <a-textarea v-model:value="item.content" :auto-size="{ minRows: 2, maxRows: 5 }" placeholder="请输入文本" />
                    </a-col>
                    <a-col :span="12" class="d-flex align-items-center">
                        <span style="margin-right: 8px">内容区域{{ index + 1 }}图片</span>
                        <a-upload list-type="picture-card" v-model:fileList="item.image"
                            :before-upload="(file: UploadFile) => beforeUpload(file, item)" :on-remove="(file: UploadFile) => onRemove(file, item)"
                            class="content-area-img" :maxCount="1">
                            <div>
                                <PlusOutlined />
                                <div style="margin-top: 8px">上传</div>
                            </div>
                        </a-upload>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item  v-for="(item, index) in form.advantage" :key="index" :label="`优点${index + 1}`">
                <a-row :gutter="48">
                    <a-col :span="12">
                        <a-input v-model:value="item.advantageDesc" placeholder="请输入文本" />
                    </a-col>
                    <a-col :span="12"  class="d-flex align-items-center">
                        <span style="margin-right: 8px;width: 90px;">优点{{ index + 1 }}描述:</span>
                        <a-textarea v-model:value="item.desc" :auto-size="{ minRows: 2, maxRows: 5 }" placeholder="请输入优点描述" />
                    </a-col>
                </a-row>
            </a-form-item>


        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue';
import type {ContentItem} from '../types'

const rules ={
    productName: [{ required: true, message: '请输入产品名称' }],
    description: [{ required: true, message: '请输入产品描述' }],
}

type Contents = ContentItem[];

type FormType = {
  productName: string;
  description: string;
  title: string;
  titleDesc: string[];
  contents: Contents;
  advantage: {
    advantageDesc: string;
    desc: string;
  }[];
};


const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    editInfo: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits<{
    (e: 'on-cancel', v: boolean): void
    (e: 'on-save', data: any): void
}>()

const visible = ref(false)


// 表单数据
let form = reactive<FormType>({
    productName: '',
    description: '',
    title: '',
    titleDesc: ['', '', ''],
    contents: [
        {
            content: '',
            image: [],
        },
        {
            content: '',
            image:[],
        },
        {
            content: '',
            image:[],
        }
    ],
    // 优点1
    advantage: [
        {
            advantageDesc: '',
            desc: ''
        },
        {
            advantageDesc: '',
            desc: ''
        },
        {
            advantageDesc: '',
            desc: ''
        },

    ]
})


const formRef = ref()

const showModel = () => {
    visible.value = true
    nextTick(() => {
        resetForm()
        if(props.isEdit){
            form = Object.assign(form,props.editInfo)
        }
    })
}


function beforeUpload(file: UploadFile, currentInfo:ContentItem) {
    // 限制大小或格式
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('仅支持 JPG/PNG 格式！')
        return false
    }
    return false
}

function onRemove(file: UploadFile, currentInfo:ContentItem) {
    currentInfo.image = currentInfo.image.filter(item => item.uid !== file.uid)
}

// 控制 Loading
const loading = ref(false)

const  handleOk = async () =>{
    // loading.value = true
    const isPass = await formRef.value.validate()
    if(isPass){
        emit('on-save',form)
        visible.value = false;
    }
}

const  handleCancel = () =>{
    visible.value = false;
    emit('on-cancel', visible.value)
}

const resetForm = () =>{
    formRef.value.resetFields()
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

:deep(.ant-row){
    align-items: center;

}
.label{
    /* width: 50px; */
}
</style>
