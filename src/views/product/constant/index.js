const productListColumn = [
  {
    title: '产品名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '产品描述',
    dataIndex: 'description',
    ellipsis: true,
  },
  {
    title: '排序权重',
    dataIndex: 'order',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 300,
  },
]

const _operationButtons = [
  {
    label: '编辑',
    event: null,
    prop: 'edit',
  },
  {
    label: '型号系列管理',
    event: null,
    prop: 'modelManage',
  },
  {
    label: '删除产品',
    event: null,
    danger: true,
    prop: 'delete',
  },
]

const modelColumns = [
  {
    title: '型号名称',
    dataIndex: 'name',
    // width: 200,
    ellipsis: true,
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
  },
]

const tabsList = [
  {
    key: 'specifications',
    tab: '规格',
    componentAttrs: {
      labelCol: { style: { width: '160px' } },
      wrapperCol: { span: 10 },
      layout: 'inline',
    },
    className: 'specifi-cations-form',
    buttonContent: '保存规格',
    formValue: {
      bearingSize: '',
      inputPressure: '',
      idealLoad: '',
      stiffness: '',
      noLoadFlow: '',
      thresholdHeight: '',
      bearingHeight: '',
      bearingWeight: '',
      shellMaterialSurfaceTreatment: '',
      porousMediumMaterial: '',
      bearingSurfaceSize: '',
      flatness: '',
      ballSocketSize: '',
      pressureInputThread: '',
      viablePressureRange: '',
      maxAllowablePressureSupply: '',
      resolution: '',
      maxSpeed: '',
      commonGuideSurface: '',
      recommendedGuideSurfaceFinish: '',
      specificationAttachments: [],
    },
    fields: [
      {
        name: 'bearingSize',
        label: '轴承尺寸',
        type: 'input',
        attrs: {
          placeholder: '请输入轴承尺寸',
          addonAfter: '毫米',
        },
      },
      {
        name: 'inputPressure',
        label: '输入压力',
        type: 'input',
        attrs: {
          placeholder: '请输入输入压力',
          addonAfter: 'MPa',
        },
      },
      {
        name: 'idealLoad',
        label: '理想负载',
        type: 'input',
        attrs: {
          placeholder: '请输入理想负载',
          addonAfter: '牛',
        },
      },
      {
        name: 'stiffness',
        label: '刚度',
        type: 'input',
        attrs: {
          placeholder: '请输入刚度',
          addonAfter: '牛 N/微米',
        },
      },
      {
        name: 'noLoadFlow',
        label: '无负载流',
        type: 'input',
        attrs: {
          placeholder: '请输入无负载流',
          addonAfter: 'NLPM',
        },
      },
      {
        name: 'thresholdHeight',
        label: '门槛高度',
        type: 'input',
        attrs: {
          placeholder: '请输入门槛高度',
          addonAfter: '微米',
        },
      },
      {
        name: 'bearingHeight',
        label: '轴承高度',
        type: 'input',
        attrs: {
          placeholder: '请输入轴承高度',
          addonAfter: '毫米',
        },
      },
      {
        name: 'bearingWeight',
        label: '轴承重量',
        type: 'input',
        attrs: {
          placeholder: '请输入轴承重量',
          addonAfter: '克',
        },
      },
      {
        name: 'shellMaterialSurfaceTreatment',
        label: '外壳材料/表面处理',
        type: 'input',
        attrs: {
          placeholder: '请输入外壳材料/表面处理',
        },
      },
      {
        name: 'porousMediumMaterial',
        label: '多孔介质材料',
        type: 'input',
        attrs: {
          placeholder: '请输入多孔介质材料',
        },
      },
      {
        name: 'bearingSurfaceSize',
        label: '轴承表面尺寸-碳',
        type: 'input',
        attrs: {
          placeholder: '请输入轴承表面尺寸',
          addonAfter: '毫米',
        },
      },
      {
        name: 'flatness',
        label: '平面度',
        type: 'input',
        attrs: {
          placeholder: '请输入平面度',
          addonAfter: '毫米',
        },
      },
      {
        name: 'ballSocketSize',
        label: '球窝尺寸',
        type: 'input',
        attrs: {
          placeholder: '请输入球窝尺寸',
          addonAfter: '毫米',
        },
      },
      {
        name: 'pressureInputThread',
        label: '压力输口螺纹',
        type: 'input',
        attrs: {
          placeholder: '请输入压力输口螺纹',
        },
      },
      {
        name: 'viablePressureRange',
        label: '可行的压力范围',
        type: 'input',
        attrs: {
          placeholder: '请输入可行的压力范围',
          addonAfter: 'MPa',
        },
      },
      {
        name: 'maxAllowablePressureSupply',
        label: '最大允许压力供应',
        type: 'input',
        attrs: {
          placeholder: '请输入最大允许压力供应',
          addonAfter: 'MPa',
        },
      },
      {
        name: 'resolution',
        label: '分辨率',
        type: 'input',
        attrs: {
          placeholder: '请输入分辨率',
        },
      },
      {
        name: 'maxSpeed',
        label: '最大速度',
        type: 'input',
        attrs: {
          placeholder: '请输入最大速度',
          addonAfter: '米/秒',
        },
      },
      {
        name: 'commonGuideSurface',
        label: '公共导向面',
        type: 'input',
        attrs: {
          placeholder: '请输入公共导向面',
        },
      },
      {
        name: 'recommendedGuideSurfaceFinish',
        label: '建议的导轨表面光洁度',
        type: 'input',
        attrs: {
          placeholder: '请输入建议的导轨表面光洁度',
          addonAfter: 'RMS',
        },
      },
      {
        label: '上传规格附件',
        name: 'specificationAttachments',
        type: 'file-upload',
        slot: true,
      },
    ],
  },
  {
    key: 'installationDetails',
    tab: '安装细节',
    componentAttrs: {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 16 },
    },
    buttonContent: '保存安装细节',
    formValue: {
      installationTitle: '',
      installationDescription: '',
      installationImage: [],
      installationAttachments: [],
    },
    fields: [
      {
        label: '标题',
        name: 'installationTitle',
        type: 'input',
        attrs: {
          placeholder: '请输入标题',
        },
      },
      {
        label: '安装说明',
        name: 'installationDescription',
        type: 'textarea',
        attrs: {
          placeholder: '请输入安装说明',
        },
        slot: true,
      },
      {
        label: '上传安装图片',
        name: 'installationImage',
        type: 'img-upload',
        slot: true,
      },
      {
        label: '上传安装附件',
        name: 'installationAttachments',
        type: 'file-upload',
        slot: true,
      },
    ],
  },
  {
    key: 'performanceData',
    tab: '性能数据',
    componentAttrs: {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 16 },
    },
    buttonContent: '保存性能数据',
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
          placeholder: '请输入标题',
        },
      },
      {
        label: '性能说明',
        name: 'performanceDescription',

        type: 'textarea',
        attrs: {
          placeholder: '请输入性能说明',
        },
      },
      {
        label: '上传性能图片',
        name: 'performanceImage',
        type: 'img-upload',
        slot: true,
      },
      {
        label: '上传性能附件',
        name: 'performanceAttachments',
        type: 'file-upload',
        slot: true,
      },
    ],
  },
  {
    key: 'engineeringDrawings',
    tab: '工程图纸',
    componentAttrs: {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 16 },
    },
    buttonContent: '保存工程图纸',
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
          placeholder: '请输入标题',
        },
      },
      {
        label: '工程说明',
        name: 'engineeringDescription',
        type: 'textarea',
        attrs: {
          placeholder: '请输入工程说明',
        },
      },
      {
        label: '上传工程图片',
        name: 'engineeringImage',
        type: 'img-upload',
        slot: true,
      },
      {
        label: '上传工程附件',
        name: 'engineeringAttachments',
        type: 'file-upload',
        slot: true,
      },
    ],
  },
]

export { productListColumn, _operationButtons, modelColumns, tabsList }
