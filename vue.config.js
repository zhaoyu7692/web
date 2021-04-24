const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
  configureWebpack: {
    plugins: [
      // new MonacoWebpackPlugin()
    ],
    externals: {
      // 'element-ui': 'ELEMENT',
      // vue: 'Vue',
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8887',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin())
  }
}



// module.exports = {
//   chainWebpack(config) {
//     config.plugin('monaco').use(new MonacoWebpackPlugin())
//   },
// }