const productListColumn = [
    {
        title:'产品名称',
        dataIndex:'productName',
        width:300
    },{
        title:'操作',
        dataIndex:'operation',
    }
]

const _operationButtons = [{
    label:'查看详情',
    evnet:null
},{
    label:'添加型号',
    evnet:null
},{
    label:'上架',
    evnet:null
},{
    label:'下架',
    evnet:null
},{
    label:'删除产品',
    evnet:null,
    danger:true
}
]

const modelColumns = [
    {
        title:'型号名称',
        dataIndex:'modelName',
        width:100
    },{
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