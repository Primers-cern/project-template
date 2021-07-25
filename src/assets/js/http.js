import Axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import tools from 'js/tools'
import { ElMessage } from 'element-plus'

// 根据开发/生产环境，切换请求接口
const NODE_ENV = process.env.NODE_ENV

let
  baseURL = "",
  baseHREF = ""

if (NODE_ENV === 'development') {
  baseURL = "api" // 开发及测试环境接口
  baseHREF = "pageUrl"
}
else if (NODE_ENV === 'production') {
  baseURL = "api" // 生产环境
  baseHREF = "pageUrl"
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status = '', other) => {
  const options = {
    offset: -8,
    type: "error"
  }

  // 状态码判断
  switch (status) {
    case 200:
      options.message = other
      break
    case 404:
      options.message = '资源不存在'
      break
    case 999:
      options.message = other
      break
    default:
      options.message = '未知错误' + status
  }
  ElMessage(options)
}

// 创建axios实例
var instance = Axios.create();
// 配置
instance.defaults.timeout = 10 * 1000 // 10秒超时
// 默认公共链接
instance.defaults.baseURL = baseURL  // 公共接口
/** 
 * 请求拦截器 
 * 序列化参数，增加签名，拦截mock请求
 */
instance.interceptors.request.use(config => {
  let params = config.params || {},
    data = { ...config.data },
    sign_data = tools.makeSign(data)

  // 把签名放到URL后
  params._sign = sign_data._sign
  params.session_id = sign_data.session_id

  config.params = params

  const contentType = config.headers['Content-Type'] || ""
  if (!~contentType.indexOf('form')) config.data = qs.stringify(sign_data)
  return config
}, error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    const status = res.status, data = res.data;

    if (status === 200) {
      if (data.code === 0) return data

      errorHandle(status, data.msg);
      if (data.code === 500000) {
        store.updateToken('', -1)
        return router.replace('login')
      }
      return Promise.reject(res);
    }
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
  }
);

export default {
  default: Axios,
  baseURL,
  baseHREF,
  get: instance.get,
  post: instance.post,
}
