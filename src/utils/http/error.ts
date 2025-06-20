import { AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { ApiStatus } from './status'

export const httpMsg = {
  unauthorized: '未授权访问，请重新登录',
  forbidden: '禁止访问该资源',
  notFound: '请求的资源不存在',
  methodNotAllowed: '请求方法不允许',
  requestTimeout: '请求超时，请稍后重试',
  internalServerError: '服务器内部错误，请稍后重试',
  badGateway: '网关错误，请稍后重试',
  serviceUnavailable: '服务暂时不可用，请稍后重试',
  gatewayTimeout: '网关超时，请稍后重试',
  requestCancelled: '请求已取消',
  networkError: '网络连接异常，请检查网络连接',
  requestFailed: '请求失败',
  requestConfigError: '请求配置错误',
}
// 错误响应接口
export interface ErrorResponse {
  code: number
  msg: string
  data?: unknown
}

// 错误日志数据接口
export interface ErrorLogData {
  code: number
  message: string
  data?: unknown
  timestamp: string
  url?: string
  method?: string
  stack?: string
}

// 自定义 HttpError 类
export class HttpError extends Error {
  public readonly code: number
  public readonly data?: unknown
  public readonly timestamp: string
  public readonly url?: string
  public readonly method?: string

  constructor(
    message: string,
    code: number,
    options?: {
      data?: unknown
      url?: string
      method?: string
    },
  ) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.data = options?.data
    this.timestamp = new Date().toISOString()
    this.url = options?.url
    this.method = options?.method
  }

  public toLogData(): ErrorLogData {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      url: this.url,
      method: this.method,
      stack: this.stack,
    }
  }
}

/**
 * 获取错误消息
 * @param status 错误状态码
 * @returns 错误消息
 */
const getErrorMessage = (status: number): string => {
  const errorMap: Record<number, string> = {
    [ApiStatus.unauthorized]: httpMsg.unauthorized,
    [ApiStatus.forbidden]: httpMsg.forbidden,
    [ApiStatus.notFound]: httpMsg.notFound,
    [ApiStatus.methodNotAllowed]: httpMsg.methodNotAllowed,
    [ApiStatus.requestTimeout]: httpMsg.requestTimeout,
    [ApiStatus.internalServerError]: httpMsg.internalServerError,
    [ApiStatus.badGateway]: httpMsg.badGateway,
    [ApiStatus.serviceUnavailable]: httpMsg.serviceUnavailable,
    [ApiStatus.gatewayTimeout]: httpMsg.gatewayTimeout,
  }

  return errorMap[status] || httpMsg.internalServerError
}

/**
 * 处理错误
 * @param error 错误对象
 * @returns 错误对象
 */
export function handleError(error: AxiosError<ErrorResponse>): never {
  // 处理取消的请求
  if (error.code === 'ERR_CANCELED') {
    console.warn('Request cancelled:', error.message)
    throw new HttpError(httpMsg.requestCancelled, ApiStatus.error)
  }

  const statusCode = error.response?.status
  const errorMessage = error.response?.data?.msg || error.message
  const requestConfig = error.config

  // 处理网络错误
  if (!error.response) {
    throw new HttpError(httpMsg.networkError, ApiStatus.error, {
      url: requestConfig?.url,
      method: requestConfig?.method?.toUpperCase(),
    })
  }

  // 处理 HTTP 状态码错误
  const message = statusCode ? getErrorMessage(statusCode) : errorMessage || httpMsg.requestFailed
  throw new HttpError(message, statusCode || ApiStatus.error, {
    data: error.response.data,
    url: requestConfig?.url,
    method: requestConfig?.method?.toUpperCase(),
  })
}

/**
 * 显示错误消息
 * @param error 错误对象
 * @param showMessage 是否显示错误消息
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
  if (showMessage) {
    message.error(error.message)
  }
  // 记录错误日志
  console.error('[HTTP Error]', error.toLogData())
}

/**
 * 判断是否为 HttpError 类型
 * @param error 错误对象
 * @returns 是否为 HttpError 类型
 */
export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof HttpError
}
