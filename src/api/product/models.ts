import { request } from '@/utils'
/**
 * CreateProductModelDto
 */
export interface Request {
  /**
   * 球窝尺寸
   */
  ballSocketSize?: string
  /**
   * 高度
   */
  bearingHeight?: string
  /**
   * 尺寸
   */
  bearingSize?: string
  /**
   * 轴承面表面尺寸
   */
  bearingSurfaceSize?: string
  /**
   * 重量
   */
  bearingWeight?: string
  /**
   * 导轨面
   */
  commonGuideSurface?: string
  /**
   * 型号描述
   */
  description: string
  /**
   * 工程图纸附件列表
   */
  engineeringAttachments?: CreateFileInfoDto[]
  /**
   * 工程图纸描述
   */
  engineeringDescription?: string
  /**
   * 工程图纸图片
   */
  engineeringImage?: CreateFileInfoDto
  /**
   * 工程图纸标题
   */
  engineeringTitle?: string
  /**
   * 平整度
   */
  flatness?: string
  /**
   * 理想负载
   */
  idealLoad?: string
  /**
   * 进气压力
   */
  inputPressure?: string
  /**
   * 安装细节附件列表
   */
  installationAttachments?: CreateFileInfoDto[]
  /**
   * 安装细节描述
   */
  installationDescription?: string
  /**
   * 安装细节标题
   */
  installationTitle?: string
  /**
   * 最大允许进气压力
   */
  maxAllowablePressureSupply?: string
  /**
   * 最大速度
   */
  maxSpeed?: string
  /**
   * 型号名称
   */
  name: string
  /**
   * 空载流量
   */
  noLoadFlow?: string
  /**
   * 性能数据附件列表
   */
  performanceAttachments?: CreateFileInfoDto[]
  /**
   * 性能数据描述
   */
  performanceDescription?: string
  /**
   * 性能数据图片
   */
  performanceImage?: CreateFileInfoDto
  /**
   * 性能数据标题
   */
  performanceTitle?: string
  /**
   * 节流器材料
   */
  porousMediumMaterial?: string
  /**
   * 进气口螺纹
   */
  pressureInputThread?: string
  /**
   * 产品ID
   */
  productId: number
  /**
   * 建议的导轨表面光洁度
   */
  recommendedGuideSurfaceFinish?: string
  /**
   * 分辨率
   */
  resolution?: string
  /**
   * 外壳材料/表面处理
   */
  shellMaterialSurfaceTreatment?: string
  /**
   * SKU编码
   */
  sku: string
  /**
   * 规格附件列表
   */
  specificationAttachments?: CreateFileInfoDto[]
  /**
   * 刚度
   */
  stiffness?: string
  /**
   * 悬浮高度
   */
  thresholdHeight?: string
  /**
   * 可行的进气压力范围
   */
  viablePressureRange?: string
  [property: string]: any
}

/**
 * CreateFileInfoDto
 *
 * 工程图纸图片
 *
 * 安装细节图片
 *
 * 性能数据图片
 */
export interface CreateFileInfoDto {
  /**
   * 文件名
   */
  filename: string
  /**
   * 文件ID
   */
  id?: number
  /**
   * 文件URL
   */
  url: string
  [property: string]: any
}

export const addModels = (productId: number, data: Request) => {
  return request({
    url: `/products/${productId}/models`,
    method: 'post',
    data,
  })
}

export const getModelDetailById = (id: string | number) => {
  return request({
    url: `/products/models/${id}`,
    method: 'get',
  })
}

export const updateCurrentModel = (id: number, data: Request) => {
  return request({
    url: `/products/models/${id}`,
    method: 'patch',
    data,
  })
}

export const deleteModelApi = (id: number) => {
  return request({
    url: `/products/models/${id}`,
    method: 'delete',
  })
}
