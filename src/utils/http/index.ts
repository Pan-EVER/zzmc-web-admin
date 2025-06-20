import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'
// import { useUserStore } from '@/store/modules/user'
import { ApiStatus } from './status'
import { HttpError, handleError, httpMsg, showError } from './error'

// 常量定义
const REQUEST_TIMEOUT = 15000 // 请求超时时间(毫秒)
const LOGOUT_DELAY = 1000 // 退出登录延迟时间(毫秒)
const MAX_RETRIES = 2 // 最大重试次数
const RETRY_DELAY = 1000 // 重试延迟时间(毫秒)

// 扩展 AxiosRequestConfig 类型
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
}

const axiosInstance = axios.create({
  timeout: REQUEST_TIMEOUT, // 请求超时时间(毫秒)
  baseURL: '/api',
  // baseURL: import.meta.env.VITE_API_URL, // API地址
  withCredentials: true, // 异步请求携带cookie
  validateStatus: (status) => status >= 200 && status < 300, // 只接受 2xx 的状态码
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // const { accessToken } = useUserStore()

    // 设置 token 和 请求头
    // if (accessToken) {
    //   request.headers.set('Authorization', accessToken)
    //   request.headers.set('Content-Type', 'application/json')
    // }

    return request
  },
  (error) => {
    showError(new HttpError(httpMsg.requestConfigError, ApiStatus.error))
    return Promise.reject(error)
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<Api.Http.BaseResponse>) => {
    const { code, msg } = response.data

    return response
    // switch (code) {
    //   case ApiStatus.success:
    //     return response
    //   case ApiStatus.unauthorized:
    //     logOut()
    //     throw new HttpError(msg || httpMsg.unauthorized, ApiStatus.unauthorized)
    //   default:
    //     throw new HttpError(msg || httpMsg.requestFailed, code)
    // }
  },
  (error) => {
    return Promise.reject(handleError(error))
  },
)

// 请求函数
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
  // 对 POST | PUT 请求特殊处理
  if (config.method?.toUpperCase() === 'POST' || config.method?.toUpperCase() === 'PUT') {
    if (config.params && !config.data) {
      config.data = config.params
      config.params = undefined
    }
  }

  try {
    const res = await axiosInstance.request<Api.Http.BaseResponse<T>>(config)
    return res.data.data as T
  } catch (error) {
    if (error instanceof HttpError) {
      // 根据配置决定是否显示错误消息
      const showErrorMessage = config.showErrorMessage !== false
      showError(error, showErrorMessage)
    }
    return Promise.reject(error)
  }
}

// API 方法集合
const serverApi = {
  get<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return request<T>({ ...config, method: 'GET' })
  },
  post<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return request<T>({ ...config, method: 'POST' })
  },
  put<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return request<T>({ ...config, method: 'PUT' })
  },
  del<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return request<T>({ ...config, method: 'DELETE' })
  },
  request<T>(config: ExtendedAxiosRequestConfig): Promise<T> {
    return request<T>({ ...config })
  },
}

// 退出登录函数
const logOut = (): void => {
  // setTimeout(() => {
  //   useUserStore().logOut()
  // }, LOGOUT_DELAY)
}

export { serverApi }
