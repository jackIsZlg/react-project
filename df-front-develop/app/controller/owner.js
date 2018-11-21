const Controller = require('egg').Controller

class OwnerController extends Controller {
  async post() {
    const { ctx } = this
    await ctx.render('pages/owner/post/index', {component: 'owner/post/index'})
  }
  async recom() {
    const {ctx} = this
    await ctx.render('pages/owner/recom/index', {component: 'owner/recom/index'})
  }

  async detail() {
    const {ctx} = this
    const owner = ctx.params.id
    
    if (ctx.isAjax(ctx)) return
    const result = await ctx.jsonCurl(ctx, `owner/check-blogger?bloggerId=${owner}`)
    if (owner == 89855) {
      await ctx.render('pages/error/404', {component: 'error/error_404'})
      return
    }
    if (result.data.result && result.data.result.redirectUrl) {
      ctx.redirect(`/${result.data.result.redirectUrl}`)
    } else {
      await ctx.render('pages/owner/home/ownerHome', {component: 'owner/home/ownerHome'})
    }
  }
}

module.exports = OwnerController
