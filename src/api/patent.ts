import { request } from '@/utils'

export interface Patent {
  /** 专利ID */
  id: number
  /** 专利名称 */
  name: string
  /** 专利类型 */
  type: number
  /** 专利图片URL */
  imageUrl: string
  /** 专利图片ID（关联上传文件ID） */
  imageId: number
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface CreatePatentDto {
  name: string
  type: number
  imageId: string
}
export const getPatentList = () => {
  return request<Patent[]>({
    url: '/patent',
    method: 'get',
  })
}

export const createPatent = (data: CreatePatentDto) => {
  return request({
    url: '/patent',
    method: 'post',
    data,
  })
}

export const getPatentDetail = (id: string) => {
  return request<Patent>({
    url: `/patent/${id}`,
    method: 'get',
  })
}

export const updatePatent = (id: string, data: CreatePatentDto) => {
  return request({
    url: `/patent/${id}`,
    method: 'patch',
    data,
  })
}

export const deletePatent = (id: string) => {
  return request({
    url: `/patent/${id}`,
    method: 'delete',
  })
}
