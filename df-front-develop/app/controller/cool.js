const Controller = require('egg').Controller

class CoolController extends Controller {
  async index() {
    const { ctx } = this
    const result = await ctx.curl('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', { dataType: 'json' })
    ctx.set('access-control-allow-origin', '*')
    ctx.body = `https://www.bing.com${result.data.images[0].url}`
  }
}

module.exports = CoolController
