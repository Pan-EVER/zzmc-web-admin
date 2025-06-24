<script lang="ts" setup>
import { nextTick, reactive, ref,h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import {  modelColumns } from '../constant'
import type { Model} from '../types'

const rules ={
    modelId: [{ required: true, message: '请输入型号SKU' }],
    modelName: [{ required: true, message: '请输入型号名称' }],
    modelDesc:[{required: true, message: '请输入型号描述' }]
}

const props = defineProps({
        currentRowInfo:{
            type: Object,
            default: ()=>({})
        } 
})
const emit = defineEmits<{
    (e: 'on-cancel', v: boolean): void
    (e: 'on-save', data: any): void
}>()
const visible = ref(false)
const loading = ref(false)
const columns = ref(modelColumns)
const modelData = ref<Model[]>([])
const addLoading = ref(false)
const newModelsVisible = ref(false)
const newModelForm = reactive({
    modelId:'',
    modelName:"",
    modelDesc:""
})
const formRef = ref()
const showModel = () => {
    visible.value = true
    modelData.value = []
}


const handleOk = async ()=>{
    const isPass = await formRef.value.validate()
    if (isPass) {
        emit('on-save', form)
        visible.value = false;
    }

}

const handleCancel = ()=>{
    visible.value = false;
    emit('on-cancel', visible.value)
}

const handleDelete = (record)=>{
    
    Modal.confirm({
    title: '确认删除',
    icon: () => h(ExclamationCircleOutlined),
    content: '确定要删除该型号吗？此操作不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await deleteModel(String(record.id))
        message.success('删除成功')
        
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    },
  })
}

const deleteModel = async (id)=>{

}



const showNewModels = ()=>{
    newModelsVisible.value = true;
    nextTick(()=>{
        formRef.value.resetFields()
    })

}


const handleTableChange = ()=>{

}

const handleSave = async ()=>{
    const isPass =await formRef.value.validate()
    if(isPass){
        modelData.value.push({
            ...newModelForm
        })
         newModelsVisible.value = false;
    }
}




defineExpose({ showModel })

</script>














<template> 
    <a-modal v-model:open="visible" :title="`${currentRowInfo.productName}-型号系列管理`" width="600px" :ok-loading="loading" @ok="handleOk"  @cancel="handleCancel" ok-text="保存" cancel-text="取消">
        <a-button type="primary" @click="showNewModels" class="custom-button">新增型号</a-button>
        <div class="table-container">
            <a-table :columns="columns" :data-source="modelData" rowKey="id"
                @change="handleTableChange" :scroll="{y:400}">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button type="text">编辑</a-button>
                        <a-button type="text" danger @click="handleDelete(record)">删除</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </a-modal>
    <div class="new-model-container">
            <a-modal v-model:open="newModelsVisible" title="新增型号`" width="500px" :ok-loading="addLoading" @ok="handleSave"  @cancel="()=>newModelsVisible=false" ok-text="保存" cancel-text="取消">
                  <a-form :model="newModelForm" :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 20 }" layout="horizontal" :rules="rules" ref="formRef">
                        <a-form-item label="型号名称" name="modelName" >
                            <a-input v-model:value="newModelForm.modelName" placeholder="请输入型号名称" />
                        </a-form-item>
                         <a-form-item label="型号描述" name="modelDesc" >
                            <a-textarea v-model:value="newModelForm.modelDesc" placeholder="请输入型号描述" :auto-size="{ minRows: 2, maxRows: 5 }"/>
                        </a-form-item>
                         <a-form-item label="SKU" name="modelId" >
                            <a-input v-model:value="newModelForm.modelId" placeholder="请输入型号SKU"  />
                        </a-form-item>
                  </a-form>
            </a-modal>
    </div>

</template>




<style scoped>
.custom-button{
    margin-bottom:10px
}
</style>