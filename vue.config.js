const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  
  chainWebpack: config => {
    // 设置路径路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('pages', resolve('src/pages'))
      .set('components', resolve('src/components'))
      .set('plugins', resolve('src/plugins'))
      .set('@css', resolve('src/assets/css'))
      .set('js', resolve('src/assets/js'))
  },

  presets: [
    '@vue/cli-plugin-babel/preset'
  ],

  productionSourceMap: false,
  publicPath: './'
}
