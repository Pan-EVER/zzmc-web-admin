<template>
    <div class="product-list-container">
        <div class="btn-list">
            <a-button type="primary" @click="handleAddProduct">新增产品</a-button>
        </div>
        <div class="table-container">
            <a-table :columns="columns" :data-source="productData" 
                rowKey="id" >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <div class="operation-buttons">
                            <a-button type="text" v-for="item in operationButtons" :key="item.prop"
                                :danger="item.danger" @click="_ => item.evnet && item.evnet({ ...record, ...item })">{{
                                    item.label }}</a-button>
                        </div>
                    </template>
                </template>
                <!-- <template #expandIcon="props">
                    <div @click="_ => handleExpandedRowsChange(props.record)">
                        <CaretDownOutlined v-if="props.expanded" :style="{ fontSize: '18px' }" />
                        <CaretUpOutlined v-else :style="{ fontSize: '18px' }" />
                    </div>
                </template> -->
                <!-- <template #expandedRowRender="{ record }">
                    <div class="expanded-row-item">
                        <a-table :showHeader="false" :data-source="record.models" :columns="modelColumns"
                            :pagination="false">
                            <template #bodyCell="{ column, record: item }">
                                <template v-if="column.dataIndex === 'modelName'">
                                    <span v-if="!item.isEdit">{{ item.modelName }}</span>
                                    <a-input v-model:value="item.modelName" v-else @blur="item.isEdit = false"></a-input>
                                </template>
                                <template v-else-if="column.dataIndex === 'operation'">
                                    <div>
                                        <a key="list-loadmore-edit" class="operation-buttons"
                                            @click="_ => handleModel({ ...item, ...record }, 'edit')">编辑</a>
                                        <a key="list-loadmore-more" class="operation-buttons"
                                            @click="_ => handleModel({ ...item, ...record }, 'delete')">删除</a>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </template> -->
            </a-table>
        </div>
        <product-maintenance ref="productMaintenanceRef" />
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Product, listColumn, FormState, Model } from '../types'
import { productListColumn, _operationButtons, modelColumns } from '../constant'
import {
    CaretUpOutlined,
    CaretDownOutlined
} from '@ant-design/icons-vue';
import productMaintenance from '../component/productMaintenance.vue';

const productData = ref<Product[]>([{
    id: Date.now(),
    productName: '产品1',
    key: 1,
    productDesc:'这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述',
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
    productDesc:'这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述,这是一个产品的描述',
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
const expandedRowKeys = ref<Number[]>([])
const operationButtons = ref(_operationButtons)
const productMaintenanceRef = ref<InstanceType<typeof productMaintenance> | null>(null)

const handleAddProduct = () => {
    productMaintenanceRef.value?.showModel()
}

const handleExpandedRowsChange = (expanded: Product) => {
    if (!expandedRowKeys.value.includes(expanded.id)) {
        expandedRowKeys.value = []
        expandedRowKeys.value.push(expanded.id)
    } else {
        expandedRowKeys.value = expandedRowKeys.value.filter(item => item !== expanded.id)
    }
}


const addProductList = (newInfo: FormState) => {
    productData.value.push({
        id: Date.now(),
        key: Date.now(),
        ...newInfo,
        models: [],
        productDesc:''
    })
}

const handleModel = (current: Model & Product, flag: string) => {
    const _productList = JSON.parse(JSON.stringify(productData.value));
    _productList.forEach((item: Product) => {
        if (item.id === current.id) {
            flag==='delete' && (item.models = item.models.filter((model: Model) => model.modelId !== current.modelId))
            flag ==='edit'&&item.models.forEach((model:Model)=>{
                if(model.modelId === current.modelId){
                   model.isEdit = true
                }
            })
        }
           
    })
    console.log('_productList', _productList);

    productData.value = _productList;
}
</script>




<style lang="scss" scoped>
.product-list-container {
    display: flex;
    flex-direction: column;

    .btn-list {
        margin-bottom: 20px;

    }

    .expanded-row-item {
        // width: 100%;
        // padding: 20px;
        // box-sizing: border-box;
        // background: red;
    }

    .operation-buttons {
        margin-right: 10px;
    }

}
</style>
