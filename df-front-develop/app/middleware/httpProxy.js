const httpProxy = require('http-proxy-middleware')
const k2c = require('koa2-connect')
const pathToRegexp = require('path-to-regexp')

module.exports = (options, app) => {
  const whiteList = [
    '/error/catch',
    '/get/bing/img'
  ]
  const targetUrl = app.config.targetUrl
  const optsProxy = k2c(httpProxy({
    target: targetUrl,
    changeOrigin: true,
    onError: (err, req, res) => {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      })
      res.end('error', 'Something went wrong. And we are reporting a custom error message.')
    },
  }))
  return async (ctx, next) => {
    console.log('ctx.request', ctx.request)
    const isAjax = ctx.request.headers['x-requested-with'] && ctx.request.headers['x-requested-with'].toLowerCase() === 'xmlhttprequest' 
    if (isAjax && !pathToRegexp(/^\/public\/*/).exec(ctx.request.url) && !whiteList.includes(ctx.request.url)) {
      optsProxy(ctx, next)
    }
    await next()
  }
}