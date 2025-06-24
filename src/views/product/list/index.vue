<template>
    <div class="product-list-container">
        <div class="btn-list">
            <a-button type="primary" @click="handleAddProduct(false)">新增产品</a-button>
        </div>
        <div class="table-container">
            <!-- :scroll="{ y: maxHeight }" :style="{ height: maxHeight +'px'}"-->
            <a-table :columns="columns" :data-source="productData" rowKey="id" 
                @change="handleTableChange" >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <div class="operation-buttons">
                            <a-button type="link" v-for="item in operationButtons" :key="item.prop"
                                :danger="item.danger" @click="_ => item.event && item.event({ ...record, ...item })">{{
                                    item.label }}</a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </div>
        <product-maintenance ref="productMaintenanceRef" :is-edit="isEdit" :editInfo="editFormInfo"
            @on-save="maintainProductList" />
        <model-maintenance ref="modelMaintenanceRef" :currentRowInfo="editFormInfo"/>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

import type { Product, listColumn, FormState, Model, ContentItem } from '../types'
import { productListColumn, _operationButtons, modelColumns } from '../constant'

import productMaintenance from '../component/productMaintenance.vue';
import ModelMaintenance from '../component/ModelMaintenance.vue';

const defaultHeight = document.body.clientHeight - 300
let maxHeight = ref(defaultHeight)

const productData = ref<Product[]>([{
    id: Date.now(),
    productName: '产品1',
    key: 1,
    description: '这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述',
    models: [
        {
            modelId: Date.now(),
            modelName: '型号1',
            isEdit: false,
            description: '这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述',
        },
        {
            modelId: Date.now() + 2,
            modelName: '型号2',
            description: '这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述',
            isEdit: false
        }
    ]
}, {
    id: Date.now() + Date.now(),
    productName: '产品2',
    key: 1,
    description: '这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述',
    models: [
        {
            modelId: Date.now(),
            modelName: '型号1',
            description: '这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述',
            isEdit: false

        },
        {
            modelId: Date.now() + 2,
            modelName: '型号2',
            description: '这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述,这是一个型号的描述',
            isEdit: false
        }
    ]
}])
const columns = ref<listColumn[]>(productListColumn)
const operationButtons = ref(_operationButtons)
const productMaintenanceRef = ref<InstanceType<typeof productMaintenance> | null>(null)
const isEdit = ref(false)
const editFormInfo = ref({})
const modelMaintenanceRef = ref()
const handleAddProduct = (flag: boolean) => {
    isEdit.value = flag
    !flag&&(editFormInfo.value = {})
    productMaintenanceRef.value?.showModel()
}

const handleTableChange = (pagination, filters, sorter, { action, currentDataSource }) => {

}

const handleButtonEvent = (prop: string, currentRowInfos: ContentItem) => {
    editFormInfo.value = currentRowInfos
    switch (prop) {
        case 'edit':
            handleAddProduct(true)
            break;
        case 'modelManage':
            modelMaintenanceRef.value?.showModel()
            break;
        case 'delete':
            break;
        default:
            break;
    }

}
const setEvent = () => {
    operationButtons.value = operationButtons.value.map(item => {
        return {
            ...item,
            event: (currentRowInfos: ContentItem) => handleButtonEvent(item.prop, currentRowInfos)
        }
    })
}


const maintainProductList = (newInfo: FormState & Product) => {
    if (isEdit.value) {
        const { id } = newInfo;
        productData.value = productData.value.map(item => {
            if (item.id === id) {
                item = {
                    ...item,
                    ...newInfo
                }
            }
            return item
        })
    } else {
        productData.value.push({
            ...newInfo,
            id: Date.now(),
            models: [],
        })
    }
}

const resize = () => {
    maxHeight.value = defaultHeight
}


onBeforeMount(() => {
    setEvent()
})
onMounted(() => {
    addEventListener('resize', resize)
})
onUnmounted(() => {
    removeEventListener('resize', resize)
})
</script>




<style lang="scss" scoped>
.product-list-container {
    display: flex;
    flex-direction: column;

    .btn-list {
        margin-bottom: 20px;

    }

    .table-container {
        // height: calc(100vh - 200px);

    }

    .operation-buttons {
        // margin-right: 10px;
    }
}
</style>
