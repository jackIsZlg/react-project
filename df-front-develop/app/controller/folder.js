const Controller = require('egg').Controller

class FolderController extends Controller {
  async work() {
    const {ctx} = this
    const result = await ctx.curl(`${ctx.app.config.targetUrl}folder/work/get-folder?folderId=${ctx.params.id}`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
    if (result.data.result && !!result.data.result.redirectUrl) {
      ctx.redirect(result.data.result.redirectUrl)
    } else {
      await ctx.render('pages/folder/work', {component: 'folder/work'})
    }
  }

  async public() {
    const {ctx} = this
    const folderId = ctx.params.id
    // 校验是否为请求接口
    if (ctx.isAjax(ctx)) return
    // 校验是否在移动端
    if (ctx.isMobile()) {
      ctx.redirect(`/mobile/folder/public/${folderId}`)
    }
    // 判断渲染哪个页面
    const redirectArray = ctx.request.url.split('/')
    switch (redirectArray[redirectArray.length - 1]) {
      case 'index':
        await ctx.render('pages/folder/public/index', {component: 'folder/public/index'})
        break
      case 'rank':
        await ctx.render('pages/folder/public/rank', {component: 'folder/public/rank'})
        break
      case 'error':
        break
      default: {
        const result = await ctx.jsonCurl(ctx, `folder/public/get-folder?folderId=${folderId}`)
        console.log('result.data.result', result.data.result)
        if (result.data.result && !!result.data.result.redirectUrl) {
          ctx.redirect(`/${result.data.result.redirectUrl}?id=${folderId}`)
        } else {
          await ctx.render('pages/folder/public.jsp', {component: 'folder/public'})
        }
        break
      }
    }
  }

  async error() {
    const { ctx } = this
    await ctx.render('pages/folder/error')
  }
  async download() {
    const { ctx } = this
    const { fileName } = ctx.queries
    ctx.set('content-type', 'application/octet-stream')
    ctx.set('content-disposition', `attachment; filename=${encodeURIComponent(fileName)}.zip;filename*=utf-8''${encodeURIComponent(fileName)}.zip`)
    const result = await ctx.curl(ctx.app.config.targetUrl + ctx.request.url, {
      headers: { Cookie: ctx.request.headers.cookie || '' },
      timeout: 100000000
    })
    ctx.body = result.data
  }
  async detail() {
    const {ctx} = this
    await ctx.render('pages/user/public/folderList', {component: 'user/public/folderList'})
  }

  async foller() {
    const {ctx} = this
    await ctx.render('pages/user/public/followList', {component: 'user/public/followList'})
  }

  async otherImg() {
    const {ctx} = this
    await ctx.render('pages/user/favoriteImgView/index', {component: 'user/favoriteImgView/index'})
  }

  async invite() {
    const {ctx} = this
    const inviteId = ctx.params.id
    const result = await ctx.curl(`${ctx.app.config.targetUrl}folder/invite/confirm/getInfo?inviter=${ctx.query.inviter}&inviteId=${inviteId}`, {
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })

    const { folderId, inviter, status } = result.data.result
    const {name, avator} = inviter
    await ctx.render('pages/folder/inviteConfirm', {folderId, inviterName: name, inviterAvatar: avator, inviteId, status, component: 'folder/inviteConfirm'})
  }

  async accessDeny() {
    const {ctx} = this
    await ctx.render('pages/folder/accessDeny', {component: 'folder/accessDeny'})
  }

  async postRecord() {
    const { ctx } = this
    await ctx.render('pages/folder/postRecord', {component: 'folder/postRecord'})
  }

  async collect() {
    const {ctx} = this
    await ctx.render('pages/folder/collect/fansList', {component: 'folder/collect/fansList'})
  }
}

module.exports = FolderController
