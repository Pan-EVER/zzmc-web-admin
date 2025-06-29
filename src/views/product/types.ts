import type { UploadFile } from 'ant-design-vue';
export interface Model{
    sku: string;
    name: string;
    description: string;
    productId?:number | null
}
export interface Product {
  id: number
  productName: string
  key: Number,
  models: Model[],
  description:string
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



export interface ContentItem  {
  content: string;
  image: UploadFile[];
};
