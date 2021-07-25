
/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

import Vue from 'vue'
import Axios from 'axios'
import qs from 'qs'

let VuePro = Vue.prototype

// 根据开发/生产环境，切换请求接口
const NODE_ENV = process.env.NODE_ENV
let baseURL = ""
if (NODE_ENV === 'development') baseURL = "https://api.xcms.i-jk.online/" // 测试服接口
else if (NODE_ENV === 'production') baseURL = 'https://api.xcms.i-jk.online/' // 生产环境正式服接口


// 原始的（兼容旧方法）
Axios.defaults.baseURL = baseURL
VuePro.$axios = Axios


// 新的 http 请求处理
// 错误提示
const httpError = msg => {
  VuePro.$message.error(msg);
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status = '', other) => {
  // 状态码判断
  switch (status) {
    case 200:
      httpError(other)
      break;
    case 404:
      httpError('资源不存在');
      break;
    case 999:
      httpError(other)
      break;
    default:
      httpError('未知错误' + status)
  }
}

// 创建axios实例
var instance = Axios.create();
// 配置
instance.defaults.timeout = 15 * 1000 // 10秒超时
// 默认公共链接
instance.defaults.baseURL = baseURL  // 公共接口
/** 
 * 请求拦截器 
 * 序列化参数，增加签名，拦截mock请求
 */
instance.interceptors.request.use(function (config) {
  let params = config.params || {},
    data = config.data,
    sign_data = VuePro.$tools.makeSign(data)

  // 把签名放到URL后
  params._sign = sign_data._sign
  params.session_id = sign_data.session_id

  config.params = params
  config.data = qs.stringify(sign_data)

  return config
}, error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    const
      status = res.status,
      data = res.data

    if (status === 200 && data.code === 0) return data
    else {
      errorHandle(status, data.msg);
      return Promise.reject(res);
    }
  },
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg);
      return Promise.reject(response);
    } else {
      // 处理断网的情况或请求超时
      errorHandle(999, '请求超时')
      return Promise.reject(error);
    }
  });

VuePro.$http = instance;

