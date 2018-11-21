const Controller = require('egg').Controller

class ShowController extends Controller {
  async index() {
    const { ctx } = this
    await ctx.render('pages/message/index/index', { component: 'message/index/index'})
  }
}

module.exports = ShowController