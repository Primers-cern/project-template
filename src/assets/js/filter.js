import Vue from 'vue'

const zeroize = (value, length = 2) => {
  value += '';
  if (value.length >= length) return value

  value = '0'.repeat(length) + value
  return value.slice(-length)
}

const dateMap = new Map([
  ['d', date => date.getDate()],
  ['dd', date => zeroize(date.getDate())],
  ['ddd', date => ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()]],
  ['dddd', date => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]],
  ['M', date => date.getMonth() + 1],
  ['MM', date => zeroize(date.getMonth() + 1)],
  ['MMM', date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]],
  ['MMMM', date => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]],
  ['yy', date => new String(date.getFullYear()).substr(2)],
  ['yyyy', date => date.getFullYear()],
  ['h', date => date.getHours() % 12 || 12],
  ['hh', date => zeroize(date.getHours() % 12 || 12)],
  ['H', date => date.getHours()],
  ['HH', date => zeroize(date.getHours())],
  ['m', date => date.getMinutes()],
  ['mm', date => zeroize(date.getMinutes())],
  ['s', date => date.getSeconds()],
  ['ss', date => zeroize(date.getSeconds())],
  ['l', date => date.getMilliseconds()],
  ['ll', date => zeroize(date.getMilliseconds())],
  ['tt', date => date.getHours() < 12 ? 'am' : 'pm'],
  ['TT', date => date.getHours() < 12 ? 'AM' : 'PM'],
])

// 分转元
Vue.filter('fenToYuan', value => {
  let money = parseFloat(value) / 100
  return money
})

// 日期格式化
Vue.filter('date', (timestamp, formatStr = 'yyyy-MM-dd HH:mm') => {
  if (!timestamp || !/^\d+$/.test(timestamp)) return timestamp || '';

  const date = new Date();
  date.setTime(timestamp * 1000);

  return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, $0 => dateMap.get($0)(date))
})



