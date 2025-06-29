// 下载模块前端接口定义

import { request } from '@/utils'

// 类型定义
export interface Upload {
  id: number
  originalName: string
  path: string
  mimeType: string
  size: number
  url: string
  createdAt: string
  updatedAt: string
}

export interface DownloadCategory {
  id: number
  name: string
  description?: string
  sortOrder: number
  files: DownloadFile[]
  createdAt: string
  updatedAt: string
}

export interface DownloadFile {
  id: number
  displayName: string
  description?: string
  uploadId: number
  categoryId: number
  downloadCount: number
  isEnabled: boolean
  sortOrder: number
  upload: Upload
  category: DownloadCategory
  createdAt: string
  updatedAt: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadTime: string
}

export interface CreateDownloadCategoryDto {
  name: string
  description?: string
  sortOrder?: number
}

export interface UpdateDownloadCategoryDto {
  name?: string
  description?: string
  sortOrder?: number
}

export interface CreateDownloadFileDto {
  displayName: string
  description?: string
  uploadId: number
  categoryId: number
  isEnabled?: boolean
  sortOrder?: number
}

export interface UpdateDownloadFileDto {
  displayName?: string
  description?: string
  uploadId?: number
  categoryId?: number
  isEnabled?: boolean
  sortOrder?: number
}

export interface DownloadCategoryStatistics {
  totalCategories: number
  totalFiles: number
  totalDownloads: number
  categoryDetails: Array<{
    id: number
    name: string
    fileCount: number
    downloadCount: number
  }>
}

export interface DownloadFileStatistics {
  totalFiles: number
  enabledFiles: number
  totalDownloads: number
  topDownloads: Array<{
    id: number
    displayName: string
    downloadCount: number
  }>
}

// 下载分类 API 接口定义

/**
 * 创建下载分类
 */
export const createDownloadCategoryApi = (data: CreateDownloadCategoryDto) => {
  return request<DownloadCategory>({
    url: '/download/categories',
    method: 'post',
    data,
  })
}

/**
 * 获取所有下载分类
 */
export const getDownloadCategoriesApi = () => {
  return request<DownloadCategory[]>({
    url: '/download/categories',
    method: 'get',
  })
}

/**
 * 根据ID获取文件分类详情
 */
export const getDownloadCategoryDetailApi = (id: number) => {
  return request<DownloadCategory>({
    url: `/download/categories/${id}`,
    method: 'get',
  })
}

/**
 * 更新文件分类
 */
export const updateDownloadCategoryApi = (id: number, data: UpdateDownloadCategoryDto) => {
  return request<DownloadCategory>({
    url: `/download/categories/${id}`,
    method: 'patch',
    data,
  })
}

/**
 * 删除文件分类
 */
export const deleteDownloadCategoryApi = (id: number) => {
  return request<void>({
    url: `/download/categories/${id}`,
    method: 'delete',
  })
}

// 下载文件 API 接口定义

/**
 * 创建可下载文件
 */
export const createDownloadFileApi = (data: CreateDownloadFileDto) => {
  return request<DownloadFile>({
    url: '/download/files',
    method: 'post',
    data,
  })
}

/**
 * 获取可下载文件列表（前端用户）
 */
export const getDownloadFilesApi = () => {
  return request<DownloadFile[]>({
    url: '/download/files',
    method: 'get',
  })
}

/**
 * 获取所有文件列表（管理端）
 */
export const getDownloadFilesForAdminApi = () => {
  return request<DownloadFile[]>({
    url: '/download/files/admin',
    method: 'get',
  })
}

/**
 * 根据分类获取可下载文件列表
 */
export const getDownloadFilesByCategoryApi = (categoryId: number) => {
  return request<DownloadFile[]>({
    url: `/download/files/category/${categoryId}`,
    method: 'get',
  })
}

/**
 * 根据ID获取可下载文件详情
 */
export const getDownloadFileDetailApi = (id: number) => {
  return request<DownloadFile>({
    url: `/download/files/${id}`,
    method: 'get',
  })
}

/**
 * 更新可下载文件
 */
export const updateDownloadFileApi = (id: number, data: UpdateDownloadFileDto) => {
  return request<DownloadFile>({
    url: `/download/files/${id}`,
    method: 'patch',
    data,
  })
}

/**
 * 删除可下载文件
 */
export const deleteDownloadFileApi = (id: number) => {
  return request<void>({
    url: `/download/files/${id}`,
    method: 'delete',
  })
}

/**
 * 记录文件下载（增加下载次数）
 */
export const recordDownloadApi = (id: number) => {
  return request<{ downloadCount: number }>({
    url: `/download/files/${id}/download`,
    method: 'post',
  })
}

/**
 * 启用/禁用文件
 */
export const toggleDownloadFileStatusApi = (id: number) => {
  return request<DownloadFile>({
    url: `/download/files/${id}/toggle-enabled`,
    method: 'patch',
  })
}

