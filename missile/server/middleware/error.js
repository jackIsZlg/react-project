const { baseURI } = require('lib/config')

// 判断是否是异步请求
const isXmlHttpReq = ctx => {
  return ctx.header['x-requested-with'] === 'XMLHttpRequest'
}

// 统一错误处理
// 本地开发环境下不捕获错误
module.exports = app => {
  const isDev = app.env === 'development'

  if (!isDev) {
    app.on('error', function (err, ctx) {
      const message = `
unCaughtException loginUser:${ctx.session.userName}
${ctx.method} ${ctx.url} ${ctx.status} ${ctx.message}
${err}`

      ctx.log.error(message)
    })
  }

  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      // TODO: 如何剥离预期的异常和非预期的异常？

      // 使用上文的方法处理error
      ctx.app.emit('error', error, ctx)

      if (isXmlHttpReq(ctx)) {
        ctx.body = {
          code: 1,
          error: error.message
        }
      } else {
        await ctx.render('error', {
          pageTitle: '服务器错误',
          error,
          baseURI
        })
      }
    }
  }
}
