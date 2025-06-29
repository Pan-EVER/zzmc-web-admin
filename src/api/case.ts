// 案例模块前端接口定义

import { request } from '@/utils'

// 类型定义
export enum CaseCategory {
  SEMICONDUCTOR_EQUIPMENT = 'semiconductor_equipment', // 半导体设备
  PRECISION_INSTRUMENT = 'precision_instrument', // 精密仪器
  PRECISION_MACHINE_TOOL = 'precision_machine_tool', // 精密机床
  LASER_PROCESSING = 'laser_processing', // 激光加工
  NEW_ENERGY_BATTERY = 'new_energy_battery', // 新能源电池
  DISPLAY_PANEL = 'display_panel', // 显示面板
}

export interface FileInfo {
  id: number
  filename: string
  url: string
}

export interface Case {
  id: number
  title: string
  category: CaseCategory
  summary: string
  coverImage?: FileInfo
  content: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateCaseDto {
  title: string
  category: CaseCategory
  summary: string
  coverImage?: FileInfo
  content: string
  isActive?: boolean
  sortOrder?: number
}

export interface UpdateCaseDto {
  title?: string
  category?: CaseCategory
  summary?: string
  coverImage?: FileInfo
  content?: string
  isActive?: boolean
  sortOrder?: number
}

export interface QueryCaseDto {
  category?: CaseCategory
  page?: string
  limit?: string
  keyword?: string
}

export interface PaginatedCaseResponse {
  data: Case[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CaseStatistics {
  total: number
  activeCount: number
  categoryStats: Record<CaseCategory, number>
}

// API接口定义

/**
 * 创建案例
 */
export const createCaseApi = (data: CreateCaseDto) => {
  return request<Case>({
    url: '/cases',
    method: 'post',
    data,
  })
}

/**
 * 获取案例列表（分页）
 */
export const getCasesApi = (params?: QueryCaseDto) => {
  return request<PaginatedCaseResponse>({
    url: '/cases',
    method: 'get',
    params,
  })
}

/**
 * 获取案例详情
 */
export const getCaseDetailApi = (id: number) => {
  return request<Case>({
    url: `/cases/${id}`,
    method: 'get',
  })
}

/**
 * 更新案例
 */
export const updateCaseApi = (id: number, data: UpdateCaseDto) => {
  return request<Case>({
    url: `/cases/${id}`,
    method: 'patch',
    data,
  })
}

/**
 * 删除案例
 */
export const deleteCaseApi = (id: number) => {
  return request<void>({
    url: `/cases/${id}`,
    method: 'delete',
  })
}

/**
 * 获取案例统计信息
 */
export const getCaseStatisticsApi = () => {
  return request<CaseStatistics>({
    url: '/cases/statistics',
    method: 'get',
  })
}

/**
 * 获取启用的案例列表（公开接口）
 */
export const getActiveCasesApi = (params?: {
  category?: CaseCategory
  page?: string
  limit?: string
}) => {
  return request<PaginatedCaseResponse>({
    url: '/cases/active',
    method: 'get',
    params,
  })
}
