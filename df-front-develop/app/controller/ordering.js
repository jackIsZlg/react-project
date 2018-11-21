const Controller = require('egg').Controller

class OrderingController extends Controller {
  async index() {
    const {ctx} = this
    const result = await ctx.curl(`${ctx.app.config.targetUrl}ordering/auth-check`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
    if (result && !result.data.result) {
      ctx.redirect('/error/stay-tuned')
    } else {
      await ctx.render('pages/ordering/index', {component: 'ordering/index'})
    }
  }

  async collections() {
    const {ctx} = this
    const result = await ctx.curl(`${ctx.app.config.targetUrl}ordering/auth-check`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
    if (result && !result.data.result) {
      console.log('result', result)
      ctx.redirect('/error/stay-tuned')
    } else {
      await ctx.render('pages/ordering/collections', {component: 'ordering/collections'})
    }
  }

  async detail() {
    const {ctx} = this
    // const result = await ctx.curl(`${ctx.app.config.targetUrl}users/info`, {dataType: 'json'})
    // if (result.data.result.redirectUrl) {
    //     ctx.redirect('/' + result.data.result.redirectUrl)
    // }
    // else {
    await ctx.render('pages/error/stay-tuned', {component: 'error/error_404'})
    // }
  }
}

module.exports = OrderingController