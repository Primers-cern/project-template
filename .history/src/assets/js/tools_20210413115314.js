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
    policyType: {
      1: {
        name: "科技政策",
        color: "primary"
      },
      2: {
        name: "工业政策",
        color: "warning"
      },
      3: {
        name: "商务政策",
        color: "success"
      },
      4: {
        name: "中小企政策",
        color: "danger"
      },
      5: {
        name: "其他政策",
        color: "info"
      }
    },
    enterpriseTab: ["企业介绍", "线上展厅", "企业风采", "联系企业"],
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

/*
 函数：格式化日期
 参数：formatStr-格式化字符串
 d：将日显示为不带前导零的数字，如1
 dd：将日显示为带前导零的数字，如01
 ddd：将日显示为缩写形式，如Sun
 dddd：将日显示为全名，如Sunday
 M：将月份显示为不带前导零的数字，如一月显示为1
 MM：将月份显示为带前导零的数字，如01
 MMM：将月份显示为缩写形式，如Jan
 MMMM：将月份显示为完整月份名，如January
 yy：以两位数字格式显示年份
 yyyy：以四位数字格式显示年份
 h：使用12小时制将小时显示为不带前导零的数字，注意||的用法
 hh：使用12小时制将小时显示为带前导零的数字
 H：使用24小时制将小时显示为不带前导零的数字
 HH：使用24小时制将小时显示为带前导零的数字
 m：将分钟显示为不带前导零的数字
 mm：将分钟显示为带前导零的数字
 s：将秒显示为不带前导零的数字
 ss：将秒显示为带前导零的数字
 l：将毫秒显示为不带前导零的数字
 ll：将毫秒显示为带前导零的数字
 tt：显示am/pm
 TT：显示AM/PM
 返回：格式化后的日期
 */
toolsApp.date = function (formatStr, timestamp) {
  if (!timestamp) {
    timestamp = formatStr
    formatStr = 'yyyy-MM-dd HH:mm'
  }
  var date = new Date()
  date.setTime(timestamp * 1000)
  if (!timestamp) return ''
  /*
   函数：填充0字符
   参数：value-需要填充的字符串, length-总长度
   返回：填充后的字符串
   */
  var zeroize = function (value, length) {
    if (!length) {
      length = 2
    }
    value = new String(value)
    for (var i = 0, zeros = ''; i < length - value.length; i++) zeros += '0'
    return zeros + value
  }

  return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function ($0) {
    switch ($0) {
      case 'd':
        return date.getDate()
      case 'dd':
        return zeroize(date.getDate())
      case 'ddd':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()]
      case 'dddd':
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
      case 'M':
        return date.getMonth() + 1
      case 'MM':
        return zeroize(date.getMonth() + 1)
      case 'MMM':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
      case 'MMMM':
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
      case 'yy':
        return new String(date.getFullYear()).substr(2)
      case 'yyyy':
        return date.getFullYear()
      case 'h':
        return date.getHours() % 12 || 12
      case 'hh':
        return zeroize(date.getHours() % 12 || 12)
      case 'H':
        return date.getHours()
      case 'HH':
        return zeroize(date.getHours())
      case 'm':
        return date.getMinutes()
      case 'mm':
        return zeroize(date.getMinutes())
      case 's':
        return date.getSeconds()
      case 'ss':
        return zeroize(date.getSeconds())
      case 'l':
        return date.getMilliseconds()
      case 'll':
        return zeroize(date.getMilliseconds())
      case 'tt':
        return date.getHours() < 12 ? 'am' : 'pm'
      case 'TT':
        return date.getHours() < 12 ? 'AM' : 'PM'
    }
  })
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

  // 原handleParams
  // toolsApp.handleParams = ({ args = {}, filter = {} }) => {
  //   // 处理分页数据，进行深拷贝，不影响原数据
  //   let dealFil = JSON.parse(JSON.stringify(filter))

  //   // 处理筛选数据
  //   if (dealFil) for (let i in dealFil) dealFil[i] === '' && delete dealFil[i]
  //   if (args) for (let i in args) args[i] === '' && delete args[i]

  //   return Object.assign(args, dealFil)
  // };

  // el组件，时间范围查询参数返回
  ; (toolsApp.timeRangeOpt = function (length) {
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
  }),
    // 数字转化为万单位
    (toolsApp.toWan = function (num) {
      num = +num // 转数字

      if (typeof num != 'number') return ''

      return parseInt(num / 1000) / 10 + '万' // 防止出现 11.0的情况
    })

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

// 分转元
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
