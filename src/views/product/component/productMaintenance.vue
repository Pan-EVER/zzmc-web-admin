<!-- NewProductModal.vue -->
<template>
    <a-modal v-model:open="visible" title="新建产品" width="1000px" :ok-loading="loading" @ok="handleOk"
        @cancel="handleCancel" ok-text="保存" cancel-text="取消">
        <a-form :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" layout="horizontal" :rules="rules">
            <!-- 基本信息 -->
            <a-divider orientation="left" style="font-size: 16px;">基本信息</a-divider>
            <a-form-item label="产品名称" name="productName" >
                <a-input v-model:value="form.productName" placeholder="请输入产品名称" />
            </a-form-item>
            <a-form-item label="产品描述" name="description">
                <a-textarea v-model:value="form.description" rows="2" placeholder="请输入文本" />
            </a-form-item>

            <!-- 概览信息 -->
            <a-divider orientation="left" style="font-size: 16px;">概览信息</a-divider>
            <a-form-item label="标题" name="title">
                <a-input v-model:value="form.title" placeholder="请输入标题" />
            </a-form-item>

            <a-form-item label="标题描述" prop="titleDesc">
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
            <a-form-item :label="`内容区域${index + 1}`" v-for="(item, index) in form.contents" :key="index" prop="contents">
                <a-row :gutter="48">
                    <a-col :span="12">
                        <a-textarea v-model:value="item.content" rows="2" placeholder="请输入文本" />
                    </a-col>
                    <a-col :span="12" class="d-flex align-items-center">
                        <span style="margin-right: 8px">内容区域{{ index + 1 }}图片</span>
                        <a-upload list-type="picture-card" :file-list="fileList"
                            :before-upload="file => beforeUpload(file, item)" :on-remove="onRemove"
                            class="content-area-img">
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
                        <a-textarea v-model:value="item.desc" rows="2" placeholder="请输入优点描述" />
                    </a-col>
                </a-row>
            </a-form-item>


        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'


const props = defineProps()
const emit = defineEmits<{
    (e: 'update:visible', v: boolean): void
    (e: 'save', data: any): void
}>()

const visible = defineModel<boolean>('visible')

const rules ={
    productName: [{ required: true, message: '请输入产品名称' }],
    description: [{ required: true, message: '请输入产品描述' }],
    title: [{ required: true, message: '请输入标题' }],
    titleDesc: [{ required: true, message: '请输入标题描述' }],
    contents: [{ required: true, message: '请填写内容区域' }],
    advantage: [{ required: true, message: '请填写优点信息' }]
}

// 表单数据
const form = reactive({
    productName: '',
    description: '',
    title: '',
    titleDesc: ['', '', ''] as string[],
    contents: [
        {
            content: '',
            image: null as File | null,
        },
        {
            content: '',
            image: null as File | null,
        },
        {
            content: '',
            image: null as File | null,
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

const showModel = () => {
    visible.value = true
}

// 上传图片
const fileList = ref<any[]>([])

function beforeUpload(file: File, currentInfo) {
    // 限制大小或格式
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('仅支持 JPG/PNG 格式！')
        return false
    }
    fileList.value = [file]
    return false
}

function onRemove() {
    fileList.value = []
}

// 控制 Loading
const loading = ref(false)

function handleOk() {
    loading.value = true
    // 模拟接口请求
    setTimeout(() => {
        loading.value = false
        message.success('保存成功')
        emit('save', { ...form, image: fileList.value[0] })
        emit('update:visible', false)
    }, 1000)
}

function handleCancel() {
    emit('update:visible', false)
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
