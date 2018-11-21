const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    if (ctx.isMobile()) { ctx.redirect('/guide') }
    const folderresult = await ctx.jsonCurl(ctx, 'resource/manage/list?orderType=2&terminal=0&targetPage=1&targetType=1&start=0&pageSize=10')
    const result = await ctx.jsonCurl(ctx, 'v1/blog/hot?q=&pageSize=30&start=0&decrease=0')
    const insResult = await ctx.jsonCurl(ctx, 'owner/recommond-list?parentType=0&pageNo=1')
    const folderList = folderresult.data.success ? folderresult.data.result.resultList || [] : []
    const insList = insResult.data.success ? insResult.data.result.resultList || [] : []
    const resultList = result.data.success ? result.data.result.resultList || [] : []
    await ctx.render('pages/home/index', {component: 'home/index', resultList, folderList, insList})
  }
}
module.exports = HomeController