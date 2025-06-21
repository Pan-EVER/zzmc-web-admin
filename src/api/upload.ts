import { request } from '@/utils'

// 定义 Upload 实体接口，与后端 Upload 实体对应
export interface Upload {
  id: number
  originalName: string
  path: string
  mimeType: string
  size: number
  url: string
  createdAt: string // 日期通常作为字符串传输，前端再进行格式化
  updatedAt: string
}

// 定义文件上传的响应数据接口
export interface UploadFileResponse extends Upload {}

// 定义获取所有文件信息的响应数据接口
export type FindAllUploadsResponse = Upload[]

// 定义获取单个文件信息的响应数据接口
export interface FindOneUploadResponse extends Upload {}

// 定义删除文件信息的响应数据接口 (通常删除操作返回空或成功状态)
export type RemoveUploadResponse = void

/**
 * 上传文件
 * @param file 要上传的文件对象
 * @returns Promise<UploadFileResponse>
 */
export const uploadFile = (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return request<UploadFileResponse>({
    url: '/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data', // 确保设置正确的 Content-Type
    },
  })
}

/**
 * 获取所有文件信息
 * @returns Promise<FindAllUploadsResponse>
 */
export const findAllUploads = (): Promise<FindAllUploadsResponse> => {
  return request<FindAllUploadsResponse>({
    url: '/upload',
    method: 'get',
  })
}

/**
 * 获取指定文件信息
 * @param id 文件ID
 * @returns Promise<FindOneUploadResponse>
 */
export const findOneUpload = (id: number): Promise<FindOneUploadResponse> => {
  return request<FindOneUploadResponse>({
    url: `/upload/${id}`,
    method: 'get',
  })
}

/**
 * 删除文件
 * @param id 文件ID
 * @returns Promise<RemoveUploadResponse>
 */
export const removeUpload = (id: number): Promise<RemoveUploadResponse> => {
  return request<RemoveUploadResponse>({
    url: `/upload/${id}`,
    method: 'delete',
  })
}
