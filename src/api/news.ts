// 新闻模块前端接口定义

import { request } from '@/utils'

// 类型定义
export enum NewsCategory {
  COMPANY = 'company', // 公司新闻
  INDUSTRY = 'industry', // 行业资讯
}

export interface News {
  id: number
  title: string
  summary: string
  content: string
  category: NewsCategory
  coverImageUrl?: string
  coverImageId?: number
  isPublished: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateNewsDto {
  title: string
  summary: string
  content: string
  category?: NewsCategory
  coverImageUrl?: string
  coverImageId?: number
  isPublished?: boolean
}

export interface UpdateNewsDto {
  title?: string
  summary?: string
  content?: string
  category?: NewsCategory
  coverImageUrl?: string
  coverImageId?: number
  isPublished?: boolean
}

export interface QueryNewsDto {
  category?: NewsCategory
  isPublished?: boolean
  page?: number
  limit?: number
}

export interface PaginatedNewsResponse {
  data: News[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface NewsStatistics {
  total: number
  published: number
  draft: number
  totalViews: number
  categoryStats: Record<NewsCategory, number>
  recentNews: News[]
}

// API接口定义

/**
 * 创建新闻
 */
export const createNewsApi = (data: CreateNewsDto) => {
  return request<News>({
    url: '/news',
    method: 'post',
    data,
  })
}

/**
 * 获取新闻列表（分页）
 */
export const getNewsApi = (params?: QueryNewsDto) => {
  return request<PaginatedNewsResponse>({
    url: '/news',
    method: 'get',
    params,
  })
}

/**
 * 获取新闻详情-管理端
 */
export const getNewsDetailApi = (id: number) => {
  return request<News>({
    url: `/news/${id}`,
    method: 'get',
  })
}

/**
 * 更新新闻
 */
export const updateNewsApi = (id: number, data: UpdateNewsDto) => {
  return request<News>({
    url: `/news/${id}`,
    method: 'patch',
    data,
  })
}

/**
 * 删除新闻
 */
export const deleteNewsApi = (id: number) => {
  return request<void>({
    url: `/news/${id}`,
    method: 'delete',
  })
}
