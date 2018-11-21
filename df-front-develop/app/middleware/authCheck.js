const { base64encode } = require('nodejs-base64')

module.exports = (app) => {
  console.log('app.config.env', app.config.env)
  return async (ctx, next) => {
    let hasCookie = false
    ctx.request.headers.cookie && ctx.request.headers.cookie.split(';').forEach((Cookie) => {
      if ((app.config.env !== 'prod' && Cookie.split('=')[0].trim() === 'gray_DF_TOKEN') ||
          (app.config.env === 'prod' && Cookie.split('=')[0].trim() === 'prod_DF_TOKEN')) {
        hasCookie = true
      } 
    })
    hasCookie
      ? await next()
      : ctx.redirect(`/login?forwardStr=${base64encode(ctx.request.url)}`)
  }
}