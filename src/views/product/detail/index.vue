<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { UploadFile as AntUploadFile } from 'ant-design-vue';

import { useRoute } from 'vue-router'

const route = useRoute()

import type { Model } from '../types'

import { addModels, getModelDetailById } from '@/api/product/models'

import BasicModelInformation from '../component/BasicModelInformation.vue'
import BaseImageUpload from '../component/BaseImageUpload.vue'
import BaseFileListUpload from '../component/BaseFileListUpload.vue'
import { tabsList } from '../constant/index'

import FormGenerator from '../component/FormGenerator.vue'

interface tabItem {
    key: string;
    tab: string;
}
interface UploadFile extends AntUploadFile {
    imageId?: string;
}

const detailForm = ref<Model>()
const activeKey = ref<string>(tabsList[1].key)
const tabs = ref<tabItem[]>(tabsList)



const handleImageChange = (list: Array<UploadFile>) => {
    console.log('list', list);

}

onMounted(() => {
    tabs.value = tabs.value.map(item => {

        return item
    })
})
onBeforeMount(() => {
    const id = route.params.id
    console.log('//', id);


})

</script>










<template>
    <div class="details-page">
        <div class="basic-container">
            <BasicModelInformation :formData="detailForm" ref="formRef" :wrapper-col="{ span: 10 }">
            </BasicModelInformation>
            <div class="custom-button">
                <a-button type="primary">保存基本信息</a-button>
            </div>
        </div>
        <div class="tabs">
            <a-tabs v-model:activeKey="activeKey" size="large" :tabBarGutter="200">
                <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab">
                    <FormGenerator :modelValue="item.formValue" :fields="item.fields"
                        :componentAttrs="item.componentAttrs">
                        <template #installationImage-img-upload="props">
                            <BaseImageUpload :imageList="item.formValue.installationImage" :maxCount="1"
                                @on-change="handleImageChange"></BaseImageUpload>
                        </template>
                        <template #installationAttachments-file-upload="props">
                            <BaseFileListUpload :fileList="item.formValue.installationAttachments"></BaseFileListUpload>
                        </template>
                        <template #performanceImage-img-upload="props">
                            <BaseImageUpload :imageList="item.formValue.performanceImage" :maxCount="1"
                                @on-change="handleImageChange"></BaseImageUpload>
                        </template>
                        <template #performanceAttachments-file-upload="props">
                            <BaseFileListUpload :fileList="item.formValue.performanceAttachments"></BaseFileListUpload>
                        </template>
                        <template #engineeringImage-img-upload="props">
                            <BaseImageUpload :imageList="item.formValue.engineeringImage" :maxCount="1"
                                @on-change="handleImageChange"></BaseImageUpload>
                        </template>
                        <template #engineeringAttachments-file-upload="props">
                            <BaseFileListUpload :fileList="item.formValue.engineeringAttachments"></BaseFileListUpload>
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
}
</style>
