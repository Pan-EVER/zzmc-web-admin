import type { UploadFile } from 'ant-design-vue'
export interface Model {
  sku: string
  name: string
  description: string
  modelId?: number | null
  coverImage?: UploadFile[]
}
export interface Product {
  id: number
  productName: string
  key: number
  models: Model[]
  description: string
}

export interface listColumn {
  title: string
  dataIndex: string
}

export interface FormState {
  productName: string
  description: string
  title: string
  titleDesc: string
}

export interface ContentItem {
  title: string
  content: string
  image: UploadFile[]
}
