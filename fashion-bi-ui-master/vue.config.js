module.exports = {
  baseUrl: '/', // process.env.NODE_ENV === 'production' ? '/web/' : '/',
  lintOnSave: undefined,
  devServer: {
    proxy: 'http://dev.fashion-bi.zhiyitech.cn'
    // proxy: {
    //   '/api': {
    //     target: 'http://df-gray.zhiyitech.cn'
    //   },
    //   '/sso-api': {
    //     target: 'http://df-gray.zhiyitech.cn'
    //   },
    //   '/bi-api': {
    //     target: 'http://dev.fashion-bi.zhiyitech.cn'
    //   }
    // }
  }
}
