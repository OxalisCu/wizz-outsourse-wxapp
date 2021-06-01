import Taro from '@tarojs/taro'
import { HTTP_STATUS } from './status'
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

// let token = Taro.getStorageSync('token');
// console.log('token-before', token);
// if (!token) login()
// console.log('params', params)

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
      authorization: Taro.getStorageSync('token')
    },
    success(res) {
      if (res.header.authorization) {
        try {
          // token
          // console.log('token', res.header.authorization);
          // console.log('demo', res);   // id
          Taro.setStorageSync('token', res.header.authorization)
        } catch (error) {
          console.log(error);
        }
      }
      if (res.header.Authorization) {
        try {
          Taro.setStorageSync('token', res.header.Authorization)
        } catch (error) {
          console.log(error);
        }
      }
      if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
        return logError(url, '请求资源不存在')
      } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
        return logError(url, '服务端出现了问题')
      } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
        return logError(url, '没有权限访问')
      } else if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
        return logError(url, '没有登陆，无权限')
      } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
        return res.data
      }
    },
    fail(err) {
      let error = logError(url, '错误是' + err.errMsg)
      return error
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
  }
}
