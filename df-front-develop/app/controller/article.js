const Controller = require('egg').Controller

class ArticleController extends Controller {
  async detail() {
    const { ctx } = this
    const result = await ctx.jsonCurl(ctx, `article/detail?articleId=${ctx.params.id}`)
    const content = result.data.result.content
    await ctx.render('pages/article/detail/index', {content, component: 'article/detail/index'})
  }
  async list() {
    const { ctx } = this
    await ctx.render('pages/article/list/index', {component: 'article/list/index'})
  }
}


module.exports = ArticleController
