import md5 from 'md5'
import http from 'js/http'
import sysConfig from '../../../package.json'
import { ElMessage, ElMessageBox } from 'element-plus';

export var CONSTANT = {
  tokenName: "jktoken",
  projectName: sysConfig.projectAlias,
  version: sysConfig.version,
  copyright: "© 2013-2021 版权所有",
  icp: '粤ICP备1111111111号-7'
}

export default {
  CONSTANT,
  md5: md5,
  http: http,
  msgBox: ElMessageBox,
  message: (() => {
    const result = {},
      typeList = ['success', 'warning', 'info', 'error', 'default']

    typeList.forEach(type => result[type] = (attr, onClose) => {
      const options = {
        offset: -8,
        ...(typeof attr === 'object' ? attr : { message: attr + '' })
      }

      if (onClose) {
        options.duration = 1000
        options.onClose = onClose
      }

      type === 'default' ? ElMessage(options) : ElMessage[type](options)
    })

    return result
  })(),

  currentTime: () => Date.parse(new Date()) / 1000,

  handleCookie: (function () {
    return {
      // 设置 (名称， 值， 有效时间， 时间类型)
      set(name, value, Days = 30, type = 1) {
        let exp = new Date(),
          timeCon = type == 2 ? 1000 : 24 * 60 * 60 * 1000,
          timeSet = exp.getTime() + Days * timeCon

        exp.setTime(timeSet)
        document.cookie = name + '=' + value + ';expires=' + exp.toGMTString()
      },
      // 获取
      get(name) {
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
          arr = document.cookie.match(reg)
        return arr ? decodeURIComponent(arr[2]) : null
      },
      // 清除
      delete(name) {
        let exp = new Date(0).toUTCString(),
          deletedList = []

        if (name === undefined) {
          // 删除所有
          let list = document.cookie.split('; ') // 空格很重要

          for (let i = 0; i < list.length; i++) {
            let item = list[i],
              eqPos = item.indexOf('='),
              key = eqPos > -1 ? item.substr(0, eqPos) : item

            deletedList.push(key)
            document.cookie = key + '=0;expires=' + exp
          }
        } else {
          // 删除某个
          let val = this.get(name)
          if (val != null) {
            document.cookie = name + '=' + val + ';expires=' + exp
            deletedList.push(name)
          }
        }
        return deletedList // 返回已删除的 cookie 列表
      },
    }
  })(),

  makeSign: function (params = {}) {
    const { randomStr, currentTime, handleCookie, md5 } = this
    let _sign_nonce_str = randomStr(6),
      _sign_time = currentTime(),
      secret = 'xxxxxxxxx' // 前后端对应密钥

    params.session_id = handleCookie.get(this.CONSTANT.tokenName) || ''
    params._sign = '' + _sign_nonce_str + _sign_time + md5(_sign_nonce_str + secret + _sign_time)

    return params
  },

  randomStr: function (len = 32) {
    let $chars = 'ABCDEFGHJKMNPQROSTWXYLZabcdefhijkOlmnprstwxyz12345678',
      maxPos = $chars.length,
      pwd = ''

    for (let i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos))

    return pwd
  },

  handleParams: function ({ filter, args }) {
    let argsInfo = { ...filter, ...args }
    for (var key in argsInfo) {
      if (argsInfo[key] == null || argsInfo[key] == undefined || argsInfo[key] === "") delete argsInfo[key]
    }

    return { ...argsInfo }
  },

  getScrollTop: (selector = '#content-wrapper') => {
    let $query = document.querySelector(selector)
    return $query ? $query.scrollTop || 0 : 0
  },

  setScrollTop: ({ selector = '#content-wrapper', value = 0 }) => {
    let $query = document.querySelector(selector)
    $query.scrollTop = value
  }
}
