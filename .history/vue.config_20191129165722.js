module.exports = {
  // 公共路径
  publicPath: '/',
  // 不同环境下打包文件生成的文件名
  outputDir: process.env.NODE_ENV === "development" ? 'devdist' : 'dist',
  // 是否在构建生产包是生成sourceMap文件，false将提高构建速度,禁止生产版本可查看源码
  productionSourceMap: false,
  // 关闭eslint代码检查
  lintOnSave: false,
  // 请求端配置
  devServer: {
    proxy: {
      '': {
        target: process.env.VUE_APP_BASE_API,
        // 是否跨域
        changeOrigin: true,
        // 关闭因相关代理端不支持ws而导致报错
        ws: false,
        pathRewrite: {
          "": ""
        }
      }
    }
  },
  externals: {
    'AMap': 'AMap'
  },
}
