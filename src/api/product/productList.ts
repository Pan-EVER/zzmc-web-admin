import { request } from '@/utils'

/**
 * CreateProductDto
 */
export interface Request {
    /**
     * 优点列表
     */
    advantages?: CreateAdvantageDto[];
    /**
     * 内容区域列表
     */
    contentAreas?: CreateContentAreaDto[];
    /**
     * 产品描述
     */
    description: string;
    /**
     * 产品名称
     */
    name: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 标题描述列表
     */
    titleDescriptions?: string[];
    [property: string]: any;
}

/**
 * CreateAdvantageDto
 */
export interface CreateAdvantageDto {
    /**
     * 优点描述
     */
    description: string;
    /**
     * 优点标题
     */
    title: string;
    [property: string]: any;
}

/**
 * CreateContentAreaDto
 */
export interface CreateContentAreaDto {
    /**
     * 内容
     */
    content: string;
    /**
     * 图片信息
     */
    image?: { [key: string]: any,filename:string,url:string };
    [property: string]: any;
}



export const getProductList = () => {
    return request({
        url: '/products',
        method: 'get',
    })
}


export const addProducts = (data:Request)=>{
    return request({
        url: '/products',
        method: 'post',
        data
    })
}


export const updateProducts = (
    id: number,
    data: Request,
  ) => {
    return request({
      url: `/products/${id}`,
      method: 'patch',
      data,
    })
  }


  export const getModelsByProductId = (id:number)=>{
    return request({
        url: `/products/${id}/models`,
        method: 'get',
    })
  }

export const deleteProductApi = (id:number)=>{
    return request({
        url: `/products/${id}`,
        method: 'delete',
    })
  }
