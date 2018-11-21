const Controller = require('egg').Controller

class MarketController extends Controller {
  async index() {
    const {ctx} = this
    const result = await ctx.curl(`${ctx.app.config.targetUrl}market/auth-check`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
    if (result && !result.data.result) {
      ctx.redirect('/error/stay-tuned')
    } else {
      await ctx.render('pages/market/index', {component: 'market/index'})
    }
  }

  async collections() {
    const {ctx} = this
    const result = await ctx.curl(`${ctx.app.config.targetUrl}market/auth-check`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
    if (result && !result.data.result) {
      ctx.redirect('/error/stay-tuned')
    } else {
      await ctx.render('pages/market/collections', {component: 'market/collections'})
    }
  }
}


module.exports = MarketController