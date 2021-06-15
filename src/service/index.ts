import Taro from '@tarojs/taro'
import { base } from './base'
import { logError, logMsg } from './error'

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
    url: base + url,
    data: method === 'GET' || method === 'POST' && contentType === 'application/x-www-form-urlencoded' ? data : JSON.stringify(data),
    method: method,
    header: {
      'content-type': contentType,
      authorization: Taro.getStorageSync('token')
    },
    fail(err) {
      logError(url, err.errMsg)
    }
  }

  return Taro.request<T>(option)
}

const ossOptions = function<T>(params, method){
  let {url, data, contentType} = params;

  const option = {
    url,
    data,
    method,
    header: {
      'content-type': contentType,
    },
    success(res){
      logMsg(url, res.data);
    },
    fail(err){
      logError(url, err.errMsg);
    }
  }

  return Taro.request<T>(option);
}

const loginOptions = function<T>(params, method){
  let {url, data } = params;

  let contentType = 'application/x-www-form-urlencoded'
  contentType = params.contentType || contentType
  const option = {
    url,
    data,
    method,
    header: {
      'content-type': contentType,
      authorization: Taro.getStorageSync('token')
    },
    success(res) {
      console.log(res);
      if (res.header.authorization) {
        try {
          Taro.setStorageSync('token', res.header.authorization)
        } catch (error) {
          console.log(error);
        }
      }
      if (res.statusCode === 404) {
        return logError(url, '请求资源不存在')
      } else if (res.statusCode === 502) {
        return logError(url, '服务端出现了问题')
      } else if (res.statusCode === 403) {
        return logError(url, '没有权限访问')
      } else if (res.statusCode === 444) {
        return logError(url, '没有登陆，无权限')
      } else if (res.statusCode === 200) {
        return res.data
      }else{
        logError(url, res.statusCode);
      }
    },
    fail(err){
      logError(url, err.errMsg);
    }
  }

  return Taro.request<T>(option);
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
  },
  oss<T>(url, data, contentType){
    let params = {url, data, contentType}
    return ossOptions<T>(params, 'PUT')
  },
  login<T>(url, data, contentType, method){
    let params = {url, data, contentType}
    return loginOptions<T>(params, method)
  }
}
