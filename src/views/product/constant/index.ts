export const productListColumn = [
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

export const _operationButtons = [
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

export const modelColumns = [
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

export const tabsList = [
  {
    key: 'specifications',
    tab: '规格',
    componentAttrs: {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 20 },
    },
    buttonContent: '保存规格',
    formValue: {
      parameterTable: '',
      specificationAttachments: [],
    },
    fields: [
      {
        label: '参数表格',
        name: 'parameterTable',
        type: 'textarea',
        slot: true,
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
      wrapperCol: { span: 20 },
    },
    buttonContent: '保存安装细节',
    formValue: {
      installationTitle: '',
      installationDescription: '',
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
      wrapperCol: { span: 20 },
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
        slot: true,
        type: 'textarea',
        attrs: {
          placeholder: '请输入性能说明',
        },
      },
      // {
      //   label: '上传性能图片',
      //   name: 'performanceImage',
      //   type: 'img-upload',
      //   slot: true,
      // },
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
      wrapperCol: { span: 20 },
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
        slot: true,
      },
      // {
      //   label: '上传工程图片',
      //   name: 'engineeringImage',
      //   type: 'img-upload',
      //   slot: true,
      // },
      {
        label: '上传工程附件',
        name: 'engineeringAttachments',
        type: 'file-upload',
        slot: true,
      },
    ],
  },
]

export const defaultParameterTable = `<table style="border-collapse: collapse; width: 99.9566%;" border="1"><colgroup><col style="width: 16.7173%;"><col style="width: 16.7173%;"><col style="width: 16.7173%;"><col style="width: 16.7173%;"><col style="width: 16.7173%;"><col style="width: 16.5002%;"></colgroup>
<tbody>
<tr>
<td>尺寸</td>
<td>--毫米</td>
<td>进气压力</td>
<td>--MPa</td>
<td>理想负载</td>
<td>--牛</td>
</tr>
<tr>
<td>刚度</td>
<td>--牛/微米</td>
<td>空载流量</td>
<td>--NLPM</td>
<td>悬浮高度</td>
<td>--微米</td>
</tr>
<tr>
<td>高度</td>
<td>--毫米</td>
<td>重量</td>
<td>--克</td>
<td>外壳材料/表面处理</td>
<td>--</td>
</tr>
<tr>
<td>节流器材料</td>
<td>--</td>
<td>气浮面尺寸</td>
<td>--毫米</td>
<td>平面度</td>
<td>--毫米</td>
</tr>
<tr>
<td>球窝尺寸</td>
<td>--毫米</td>
<td>进气口螺纹</td>
<td>--</td>
<td>可行的进气压力范围</td>
<td>--MPa</td>
</tr>
<tr>
<td>最大允许进气压力</td>
<td>--MPa</td>
<td>分辨率</td>
<td>--</td>
<td>最大速度</td>
<td>--米/秒</td>
</tr>
<tr>
<td>导轨面</td>
<td>--</td>
<td>建议的导轨表面光洁度</td>
<td colspan="3">--RMS</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>`
