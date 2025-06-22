import { request } from '@/utils'

// 首页内容类型定义
export interface HomepageItem {
  id: number
  /** 内容类型 company、why_us、thanks*/
  type: string
  title?: string
  content: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 更新首页内容DTO类型定义
export interface UpdateHomepageDto {
  /** 内容类型 */
  type?: string
  title?: string
  content?: string
  order?: number
  isActive?: boolean
}

/**
 * 获取所有首页内容
 * @param type 可选的内容类型过滤
 */
export const getAllHomepageContent = (type?: string) => {
  return request<HomepageItem[]>({
    url: '/homepage',
    method: 'get',
    params: {
      type,
    },
  })
}

/**
 * 更新首页内容
 * @param id 内容ID
 * @param updateData 更新的数据
 */
export const updateHomepageContent = (
  id: number,
  updateData: UpdateHomepageDto,
) => {
  return request<HomepageItem>({
    url: `/homepage/${id}`,
    method: 'patch',
    data: updateData,
  })
}
