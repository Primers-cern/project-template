import Vue from 'vue'

var toolsApp = {}

// 定义常量
toolsApp.CONSTANT = (function () {
  return {
    token_name: 'jktoken',
    role_name: {
      a002: '管理员',
      a001: '用户',
    },
  }
})()

/**
 * md5
 */
toolsApp.md5 = require('md5')

/**
 * cookie 操作
 */
toolsApp.handleCookie = (function () {
  return {
    // 设置 (名称， 值， 有效时间， 时间类型)
    set(name, value, Days = 30, type = 1) {
      var exp = new Date(),
        timeCon = type == 2 ? 1000 : 24 * 60 * 60 * 1000,
        timeSet = exp.getTime() + Days * timeCon

      exp.setTime(timeSet)
      document.cookie = name + '=' + value + ';expires=' + exp.toGMTString()
    },
    // 获取
    get(name) {
      var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
        arr = document.cookie.match(reg)
      return arr ? decodeURIComponent(arr[2]) : null
    },
    // 清除
    delete(name) {
      var exp = new Date(0).toUTCString(),
        deletedList = []

      if (name === undefined) {
        // 删除所有
        let list = document.cookie.split('; ') // 空格很重要

        for (var i = 0; i < list.length; i++) {
          var item = list[i],
            eqPos = item.indexOf('='),
            key = eqPos > -1 ? item.substr(0, eqPos) : item

          deletedList.push(key)
          document.cookie = key + '=0;expires=' + exp
        }
      } else {
        // 删除某个
        var val = this.get(name)
        if (val != null) {
          document.cookie = name + '=' + val + ';expires=' + exp
          deletedList.push(name)
        }
      }
      return deletedList // 返回已删除的 cookie 列表
    },
  }
})()

/**
 * 当前时间戳,秒
 * @returns {number}
 */
toolsApp.current_time = function () {
  return Date.parse(new Date()) / 1000 //当前时间戳,秒
}

/**
 * 签名
 * @param param URL参数对象或数组
 * @returns {string|*}
 */
toolsApp.makeSign = function (params = {}) {
  var _sign_nonce_str = this.randomStn(6),
    _sign_time = this.current_time(),
    secret = 'r2n2uyactaw9tiniyk' // 前后端对应密钥

  params.session_id = this.handleCookie.get(this.CONSTANT.token_name) || ''
  params._sign = '' + _sign_nonce_str + _sign_time + this.md5(_sign_nonce_str + secret + _sign_time)

  return params
}

/*
 * 产生任意长度随机字母数字组合
 */
toolsApp.randomStn = function (len = 32) {
  var $chars = 'ABCDEFGHJKMNPQROSTWXYLZabcdefhijkOlmnprstwxyz12345678',
    maxPos = $chars.length,
    pwd = ''

  for (let i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(Math.random() * maxPos))

  return pwd
}

/**
 * 日期转时间戳
 * @param  datetime
 * @return {[unix]}
 */
toolsApp.datetimeToUnix = function (datetime) {
  if (!datetime) return ''
  var tmp_datetime = datetime.replace(/:/g, '-')
  tmp_datetime = tmp_datetime.replace(/ /g, '-')
  var arr = tmp_datetime.split('-')
  var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4]))
  return parseInt(now.getTime() / 1000)
}

// 列表页面筛选数据处理方法
toolsApp.handleParams = (filter = {}, pageInfo = {}, others = {}) => {
  // 处理分页数据，进行深拷贝，不影响原数据
  let dealFilter = JSON.parse(JSON.stringify(filter)),
    obj = {
      page: pageInfo.current,
      limit: pageInfo.limit,
    }

  // 处理筛选数据
  for (let i in dealFilter) dealFilter[i] === '' && delete dealFilter[i]
  for (let j in others) {
    let val = others[j]
    if (typeof val == 'undefined' || val === '') delete others[j]
  }

  return Object.assign(obj, dealFilter, others)
}

// el组件，时间范围查询参数返回
toolsApp.timeRangeOpt = function (length) {
  let origin = [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      },
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      },
    },
  ]

  return { shortcuts: origin.slice(0, length) }
}

// 数字转化为万单位
toolsApp.toWan = function (num) {
  num = +num // 转数字

  if (typeof num != 'number') return ''

  return parseInt(num / 1000) / 10 + '万' // 防止出现 11.0的情况
}

// 分转元
toolsApp.fenToYuan = function (money) {
  if (!money) return 0
  money = money || 0
  money = parseFloat(money) / 100
  return money
}

/**
 * 复制内容
 * @param text
 */
toolsApp.copyText = function (text, success) {
  let textArea = document.createElement('textarea')

  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.value = text

  document.body.appendChild(textArea)
  textArea.select()

  try {
    var msg = document.execCommand('copy') ? '成功' : '失败'
    success ? success() : Vue.prototype.$message.success('复制' + msg)
  } catch (err) {
    Vue.prototype.$message.fail('抱歉，复制失败')
  }

  document.body.removeChild(textArea)
}

toolsApp.toggleLabel = function (str, label) {
  let currentLabel = str ? str.split(',') : [],
    labelIndex = currentLabel.indexOf(label)

  if (labelIndex >= 0) currentLabel.splice(labelIndex, 1)
  else currentLabel.push(label)

  return currentLabel.join(',')
}

toolsApp.getScrollTop = (selector = '#mainScrollbar .el-scrollbar__wrap') => {
  let $query = document.querySelector(selector)
  return $query ? $query.scrollTop || 0 : 0
}

toolsApp.setScrollTop = ({ selector = '#mainScrollbar .el-scrollbar__wrap', value = 0 }) => {
  let $query = document.querySelector(selector)
  $query.scrollTop = value
}

toolsApp.printLog = (title, content) => {
  let
    url = 'Index/Index/addLog',
    params = {
      log_remark: title,
      log_content: content
    }

  Vue.prototype.$http(url, { params })
}

toolsApp.rinseUrl = url => {
  if (typeof url !== 'string') url = "";
  return decodeURI(url.replace("\uFEFF", ""));
}

Vue.prototype.$tools = toolsApp

export default toolsApp
