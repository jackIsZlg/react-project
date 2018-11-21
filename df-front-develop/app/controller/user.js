const Controller = require('egg').Controller

class UserController extends Controller {
  async authView() {
    const {ctx} = this
    await ctx.render('pages/user/authView/index', {component: 'user/authView/index'})
  }

  async list() {
    const {ctx} = this
    await ctx.render('pages/user/ins/list', {component: 'user/ins/list'})
  }

  async invite() {
    const {ctx} = this
    await ctx.render('pages/user/invite/view', {component: 'user/invite/view'})
  }

  async follow() {
    const {ctx} = this
    await ctx.render('pages/user/followView/index', {component: 'user/followView/index'})
  }

  async profile() {
    const { ctx } = this
    await ctx.render('pages/user/profile/index', {component: 'user/profile/index'})
  }

  async favoriteView() {
    const {ctx} = this
    await ctx.render('pages/user/favoriteView/index', {component: 'user/favoriteView/index-react'})
  }

  async favoriteImgView() {
    const {ctx} = this
    await ctx.render('pages/user/favoriteImgView/index', {component: 'user/favoriteImgView/index'})
  }

  async agreement() {
    const {ctx} = this
    await ctx.render('pages/user/agreement/index', {component: 'user/agreement/index'})
  }

  async favoriteContent() {
    const {ctx} = this
    const result = await ctx.jsonCurl(ctx, `users/favorite-content/info?folderId=${ctx.params.id}`)
    if (result.data.result && !!result.data.result.redirectUrl) {
      ctx.redirect(result.data.result.redirectUrl)
    } else {
      await ctx.render('pages/user/favoriteContent', {component: 'user/favoriteContent'})
    }
  }
}

module.exports = UserController
