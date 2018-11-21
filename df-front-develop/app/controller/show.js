const Controller = require('egg').Controller

class ShowController extends Controller {
  async runway() {
    const { ctx } = this
    await ctx.render('pages/show/runway/index', { component: 'show/runway/index'})
  }
  async designer() {
    const { ctx } = this
    const result = await ctx.jsonCurl(ctx, `show/designer/info?designerId=${ctx.params.id}`)
    const {name, followId, designerId, showId} = result.data.result
    await ctx.render('pages/show/designer/index', { name, followId, designerId, showId, component: 'show/designer/index' })
  }
  async brand() {
    const { ctx } = this
    const bloggerId = ctx.params.id
    const { showId } = ctx.query
    const result = await ctx.jsonCurl(ctx, `show/designer/info?designerId=${ctx.params.id}`)
    const {name, followId} = result.data.result
    await ctx.render('pages/show/brand/index', { component: 'show/brand/index', name, followId, bloggerId, showId})
  }
  async detail() {
    const { ctx } = this
    await ctx.render('pages/show/detail/index', { component: 'show/detail/index'})
  }
  async download() {
    const { ctx } = this
    const { fileName } = ctx.queries
    ctx.set('content-type', 'application/octet-stream')
    ctx.set('content-disposition', `attachment; filename=${encodeURIComponent(fileName)}.zip`)
    const result = await ctx.curl(ctx.app.config.targetUrl + ctx.request.url, {
      headers: { Cookie: ctx.request.headers.cookie || '' },
      timeout: 100000000
    })
    ctx.body = result.data
  }
}

module.exports = ShowController
