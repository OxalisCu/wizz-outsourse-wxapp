import Taro from '@tarojs/taro'
import { base } from './base'
import { logError } from './error'

type Method =
  | 'GET'
  | 'OPTIONS'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'
  | undefined

const baseOptions = function <T>(params, method = 'GET' as Method) {
  let { url, data } = params
  let contentType = 'application/x-www-form-urlencoded'

  contentType = params.contentType || contentType
  const option = {
    isShowLoading: false,
    loadingText: '正在加载',
    url: base + url,
    data: data,
    method: method,
    header: {
      'content-type': contentType,
      authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIsImV4cCI6MTgwMzE2NjQxNSwiaWF0IjoxNjIzMTY2NDE1fQ.J6VNcsq2GwXyu9wWshT9tqlF6Ga_yBKGGGsPHGnSwQo'
    },
    success(res) {
      if(!res.data.success){
        logError(url, res.data.message)
      }
    },
    fail(err) {
      logError(url, err.errMsg)
    }
  }

  return Taro.request<T>(option)
}

export default {
  get<T>(url, data = {}) {
    let params = { url, data }
    return baseOptions<T>(params)
  },
  post<T>(url, data, contentType) {
    let params = { url, data, contentType }
    return baseOptions<T>(params, 'POST')
  },
  put<T>(url, data, contentType) {
    let params = {url, data, contentType}
    return baseOptions<T>(params, 'PUT')
  },
  delete<T>(url, data, contentType){
    let params = {url, data, contentType}
    return baseOptions<T>(params, 'DELETE')
  }
}
