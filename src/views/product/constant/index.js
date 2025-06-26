const productListColumn = [
    {
        title:'产品名称',
        dataIndex:'name',
        width:200
    },
    {       
        title:'产品描述',
        dataIndex:'description',
        ellipsis: true,

    },
    {
        title:'操作',
        dataIndex:'operation',
        width:300,
    }
]

const _operationButtons = [{
    label:'编辑',
    event:null,
    prop:'edit'
},{
    label:'型号系列管理',
    event:null,
    prop:'modelManage'
},{
    label:'删除产品',
    event:null,
    danger:true,
    prop:'delete'
}
]

const modelColumns = [
    {
        title:'型号名称',
        dataIndex:'modelName',
        width:100,
        ellipsis: true,
    },
    {

        title:'SKU',
        dataIndex:'modelId',
        width:100
    },
    {
        title:'操作',
        dataIndex:'operation',
         width:300
    }
]


export {
    productListColumn,
    _operationButtons,
    modelColumns
}