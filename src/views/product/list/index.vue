<template>
    <div class="product-list-container">
        <div class="btn-list">
            <a-button type="primary" @click="handleAddProduct">新增产品</a-button>
        </div>
        <div class="table-container">
            <a-table :columns="columns" :data-source="productData" expandRowByClick :expandedRowKeys="expandedRowKeys"
                rowKey="id" :pagination="false">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <div class="operation-buttons">
                            <a-button type="text" v-for="item in operationButtons" :key="item.prop"
                                :danger="item.danger" @click="_ => item.evnet && item.evnet({ ...record, ...item })">{{
                                    item.label }}</a-button>
                        </div>
                    </template>
                </template>
                <template #expandIcon="props">
                    <div @click="_ => handleExpandedRowsChange(props.record)">
                        <CaretDownOutlined v-if="props.expanded" :style="{ fontSize: '18px' }" />
                        <CaretUpOutlined v-else :style="{ fontSize: '18px' }" />
                    </div>
                </template>
                <template #expandedRowRender="{ record }">
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
                </template>
            </a-table>
        </div>
        <template>
            <a-modal v-model:open="visible" title="新建产品" @ok="handleSave" @cancel="resetForm" cancelText="取消"
                okText="保存">
                <a-form :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
                    :rules="rules" ref="formRef">
                    <a-form-item label="产品名称" name="productName">
                        <a-input v-model:value="formState.productName" placeholder="输入产品名称" />
                    </a-form-item>
                    <a-form-item label="描述" name="description">
                        <a-textarea v-model:value="formState.description" placeholder="输入产品描述"
                            :auto-size="{ minRows: 5, maxRows: 10 }" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </template>
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


const rules = {
    productName: [{ required: true, message: '请输入产品名称!' }],
    description: [{ required: true, message: '请输入产品描述!' }]


}

const productData = ref<Product[]>([{
    id: Date.now(),
    productName: '产品1',
    key: 1,
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
const visible = ref<boolean>(false);
const formState = reactive<FormState>({
    productName: '',
    description: '',
});

const formRef = ref(null);

const handleAddProduct = () => {
    visible.value = true;
}

const handleExpandedRowsChange = (expanded: Product) => {
    if (!expandedRowKeys.value.includes(expanded.id)) {
        expandedRowKeys.value = []
        expandedRowKeys.value.push(expanded.id)
    } else {
        expandedRowKeys.value = expandedRowKeys.value.filter(item => item !== expanded.id)
    }
}

const handleSave = async () => {
    const isPass = await formRef.value.validate()
    if (isPass) {
        addProductList(formState)
        resetForm()
    }
}
const resetForm = () => {
    formRef.value.resetFields()
    formRef.value.clearValidate()
    visible.value = false
}

const addProductList = (newInfo: FormState) => {
    productData.value.push({
        id: Date.now(),
        key: Date.now(),
        ...newInfo,
        models: []
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
