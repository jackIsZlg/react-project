const sendEmail = require('../utils/email')

const Controller = require('egg').Controller

class ErrorController extends Controller {
  async notfound() {
    const { ctx } = this
    await ctx.render('pages/error/404', {component: 'error/error_404'})
  }

  async orderUnauth() {
    const {ctx} = this
    await ctx.render('pages/error/order-unauth', {component: 'error/order-unauth'})
  }

  async marketUnauth() {
    const {ctx} = this
    await ctx.render('pages/error/market-unauth', {component: 'error/market-unauth'})
  }

  async stay() {
    const {ctx} = this
    await ctx.render('pages/error/stay-tuned', {component: 'error/error_404'})
  }
  catch() {
    const { ctx } = this
    const params = (ctx.request.body.source || ctx.request.body.message)
      ? ctx.request.body
      : JSON.parse(Object.keys(ctx.request.body)[0])
    sendEmail(params, ctx)
    ctx.set('access-control-allow-origin', '*')
    ctx.body = { success: true, code: 200}
  }
}

module.exports = ErrorController
