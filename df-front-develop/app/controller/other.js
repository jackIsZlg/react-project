const Controller = require('egg').Controller

class OtherController extends Controller {
  async hot() {
    const {ctx} = this
    if (ctx.isMobile()) {
      ctx.redirect('/guide')
    } else {
      // const result = await ctx.jsonCurl(ctx, 'v1/blog/ins-trend?trendFilder=1&q=&pageSize=30&start=0&decrease=0')
      // console.log('result', result)
      // const resultList = result.data.success ? result.data.result.resultList || [] : []
      await ctx.render('pages/hot/index', {component: 'hot/index'})
    }
  }
  async index() {
    const {ctx} = this
    await ctx.render('pages/index/index', {component: 'index/index'})
  }
  async login() {
    const {ctx} = this
    await ctx.render('pages/login/index', {component: 'login/index'})
  }

  async guide() {
    const {ctx} = this
    await ctx.render('pages/mobile/guide/index', {component: 'mobile/guide/index'})
  }

  async share() {
    const {ctx} = this
    await ctx.render('pages/platform/shareJump', {component: 'platform/shareJump'})
  }

  async tag() {
    const {ctx} = this
    await ctx.render('pages/tag/index', {component: 'tag/index'})
  }

  async search() {
    const {ctx} = this
    await ctx.render('pages/search/user/index', {component: 'search/user/index'})
  }

  async pinterest() {
    const {ctx} = this
    await ctx.render('pages/search/pinterest/index', {component: 'search/pinterest/index'})
  }

  async gallery() {
    const {ctx} = this
    await ctx.render('pages/gallery/index', {component: 'gallery/index'})
  }

  async error() {
    const {ctx} = this
    await ctx.render('pages/error/404', {component: 'error/error_404'})
  }

  async blogDetail() {
    const {ctx} = this
    const blogId = ctx.params.id
    const result = await ctx.jsonCurl(ctx, `blog/detail/check-blog?blogId=${blogId}`)
    if (result.data.result) {
      ctx.isMobile()
        ? await ctx.render('pages/mobile/blog/index', {blogId, component: 'mobile/blog/index'})
        : await ctx.render('pages/blog/blogDetail/index', {blogId, component: 'blog/blogDetail/index'})
    } else {
      await ctx.render('pages/error/404', {component: 'error/error_404'})
    } 
  }

  async searchView() {
    const {ctx} = this
    await ctx.render('pages/user/searchView/search', {component: 'user/searchView/search'})
  }
}

module.exports = OtherController