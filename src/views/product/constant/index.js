const productListColumn = [
    {
        title: '产品名称',
        dataIndex: 'name',
        width: 200
    },
    {
        title: '产品描述',
        dataIndex: 'description',
        ellipsis: true,

    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 300,
    }
]

const _operationButtons = [{
    label: '编辑',
    event: null,
    prop: 'edit'
}, {
    label: '型号系列管理',
    event: null,
    prop: 'modelManage'
}, {
    label: '删除产品',
    event: null,
    danger: true,
    prop: 'delete'
}
]

const modelColumns = [
    {
        title: '型号名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
    },
    {

        title: 'SKU',
        dataIndex: 'sku',
        width: 100
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 300
    }
]

const tabsList = [
    {
        key: 'specifications',
        tab: '规格',
        formValue: {

        },
        fields: []

    },
    {
        key: 'installationDetails',
        tab: '安装细节',
        componentAttrs: {
            labelCol: { style: { width: '150px' } },
            wrapperCol: { span: 16 },
        },
        formValue: {
            installationTitle: '',
            installationDescription: '',
            installationImage: [],
            installationAttachments: [],
        },
        fields: [{
            label: '标题',
            name: 'installationTitle',
            type: 'input',
            attrs: {
                placeholder: '请输入标题'
            },
        }, {
            label: '安装说明',
            name: 'installationDescription',
            type: 'textarea',
            attrs: {
                placeholder: '请输入安装说明'
            }
        }, {
            label: '上传安装图片',
            name: 'installationImage',
            type: 'img-upload',
            slot: true,
        }, {
            label: '上传安装附件',
            name: 'installationAttachments',
            type: 'file-upload',
            slot: true,
        }
        ],
    },
    {
        key: 'performanceData',
        tab: '性能数据',
        componentAttrs: {
            labelCol: { style: { width: '150px' } },
            wrapperCol: { span: 16 },
        },
        formValue: {
            performanceTitle: '',
            performanceDescription: '',
            performanceImage: [],
            performanceAttachments: [],

        },
        fields: [
            {
                label: '标题',
                name: 'performanceTitle',
                type: 'input',
                attrs: {
                    placeholder: '请输入标题'
                },
            }, {
                label: '性能说明',
                name: 'performanceDescription',

                type: 'textarea',
                attrs: {
                    placeholder: '请输入性能说明'
                }
            }, {
                label: '上传性能图片',
                name: 'performanceImage',
                type: 'img-upload',
                slot: true,
            }, {
                label: '上传性能附件',
                name: 'performanceAttachments',
                type: 'file-upload',
                slot: true,
            }
        ]

    },
    {
        key: 'engineeringDrawings',
        tab: '工程图纸',
        componentAttrs: {
            labelCol: { style: { width: '150px' } },
            wrapperCol: { span: 16 },
        },
        formValue: {
            engineeringTitle: '',
            engineeringDescription: '',
            engineeringImage: [],
            engineeringAttachments: [],

        },
        fields: [
            {
                label: '标题',
                name: 'engineeringTitle',
                type: 'input',
                attrs: {
                    placeholder: '请输入标题'
                },
            },{
                label: '工程说明',
                name: 'engineeringDescription',
                type: 'textarea',
                attrs: {
                    placeholder: '请输入工程说明'
                },
            },{
                label: '上传工程图片',
                name: 'engineeringImage',
                type: 'img-upload',
                slot: true,
            },{
                label: '上传工程附件',
                name: 'engineeringAttachments',
                type: 'file-upload',
                slot: true,
            }
        ]
    },
]


export {
    productListColumn,
    _operationButtons,
    modelColumns,
    tabsList
}