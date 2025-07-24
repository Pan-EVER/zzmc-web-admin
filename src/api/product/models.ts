import { request } from '@/utils'

export interface CreateProductModelDto {
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
   * 安装细节附件列表
   */
  installationAttachments?: CreateFileInfoDto[]
  /**
   * 安装细节描述
   */
  installationDescription?: string
  /**
   * 型号名称
   */
  name: string
  /**
   * 性能数据附件列表
   */
  performanceAttachments?: CreateFileInfoDto[]
  /**
   * 性能数据描述
   */
  performanceDescription?: string
  /**
   * 产品ID
   */
  productId: number
  /**
   * SKU编码
   */
  sku: string
  // 规格表格
  parameterTable: string
  /**
   * 规格附件列表
   */
  specificationAttachments?: CreateFileInfoDto[]
  /**
   * 视频列表
   */
  videoList?: VideoInfo[]
}
export interface VideoInfo {
  id: number
  filename: string
  url: string
  title: string
  size: number
  mineType: string
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

export interface IModelDetail extends CreateProductModelDto {
  id: number
}

export const addModels = (productId: number, data: CreateProductModelDto) => {
  return request({
    url: `/products/${productId}/models`,
    method: 'post',
    data,
  })
}

export const getModelDetailById = (id: string | number) => {
  return request<IModelDetail>({
    url: `/products/models/${id}`,
    method: 'get',
  })
}

export const updateCurrentModel = (id: number, data: CreateProductModelDto) => {
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

export interface VideoInfoDto {
  /**
   * 视频文件ID
   */
  id: number
  /**
   * 视频标题
   */
  title: string
}

/**
 * 为产品型号添加视频
 */
export const addVideosToModelApi = (modelId: number, data: VideoInfoDto[]) => {
  return request({
    url: `/products/models/${modelId}/videos`,
    method: 'post',
    data: { videos: data },
  })
}

/**
 * 更新产品型号视频标题
 */
export const updateVideoTitleApi = (modelId: number, videoId: number, data: { title: string }) => {
  return request({
    url: `/products/models/${modelId}/videos/${videoId}/title`,
    method: 'patch',
    data,
  })
}

/**
 * 删除产品型号视频
 */
export const deleteVideoFromModelApi = (modelId: number, videoId: number) => {
  return request({
    url: `/products/models/${modelId}/videos/${videoId}`,
    method: 'delete',
  })
}
