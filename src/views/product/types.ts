export interface Model{
    modelId: number
    modelName: string,
    description: string,
    isEdit:boolean
}
export interface Product {
  id: number
  productName: string
  key: Number,
  models: Model[],
  productDesc:string
}

export interface listColumn {
  title: string
  dataIndex: string
}

export interface FormState {
  productName: string
  description: string,
  title: string,
  titleDesc: string,
}
