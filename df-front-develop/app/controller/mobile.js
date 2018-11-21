const Controller = require('egg').Controller
const { base64decode } = require('nodejs-base64')

class MobileController extends Controller {
  async oauth() {
    const { ctx } = this
    const {code, state, forwardStr} = ctx.query
    const result = await ctx.jsonCurl(ctx, `wechat/oauth-api?code=${code}&state=${state}&forwardStr=${forwardStr}`)
    result.data.success ? ctx.redirect(base64decode(forwardStr)) : ctx.body = '登陆失败'
  }
  async appUrl() {
    const { ctx } = this
    const { forwardStr } = ctx.query
    ctx.redirect(base64decode(forwardStr)) 
  }
  async qrcode() {    
    const { ctx } = this
    await ctx.render('pages/mobile/weChat/loginSuccess/index', { component: 'mobile/weChat/loginSuccess/index'})
  }
  async download() {
    const { ctx } = this
    await ctx.render('pages/mobile/ios/download/index')
  }
  async wechatAuth() {
    const { ctx } = this
    const result = await ctx.jsonCurl(ctx, 'mobile/wechat/check-auth')
    result.data.result.redirectUrl
      ? ctx.redirect(result.data.result.redirectUrl)
      : await ctx.render('pages/mobile/authSuccess/index')
  }
  async activity() {
    const { ctx } = this
    const result = await ctx.jsonCurl(ctx, 'mobile/activity/vogue-info')
    result.data.result.redirectUrl
      ? ctx.redirect(result.data.result.redirectUrl)
      : await ctx.render('pages/mobile/activity/index', { component: 'mobile/activity/index'})
  }
  async folderError() {
    const { ctx } = this
    await ctx.render('pages/mobile/folder/error/index', { component: 'mobile/folder/error/index'})
  }
  async blogShare() {
    const { ctx } = this
    const blogId = ctx.params.id
    if (!ctx.isMobile()) {
      ctx.redirect(`/blog/detail/${blogId}`)
    }
    await ctx.render('pages/mobile/blog/index', {blogId, component: 'mobile/blog/index'})
  }
  async folder() {
    const { ctx } = this
    const folderId = ctx.params.id
    if (!ctx.isMobile()) {
      ctx.redirect(`/folder/public/${folderId}`)
    }
    // const result = await ctx.curl(`${ctx.app.config.targetUrl}mobile/folder/public/check-folder?folderId=${folderId}`, {
    //   headers: {Cookie: ctx.request.headers.cookie || ''},
    //   dataType: 'json'
    // })
    // if (result.data.result && !!result.data.result.redirectUrl) {
    //   ctx.redirect(`/${result.data.result.redirectUrl}?id=${folderId}`)
    // } else {
    await ctx.render('pages/mobile/folder/public/index', { folderId, component: 'mobile/folder/public/index'})
    // }
  }
  async showShare() {
    const { ctx } = this
    const imgId = ctx.params.id
    const result = await ctx.jsonCurl(ctx, `mobile/show/share/getImage?imgId=${imgId}`)
    const {mediaUrl, city, season, designerName, id} = result.data.result
    await ctx.render('pages/mobile/show/index', { mediaUrl, city, season, designerName, id, component: 'mobile/show/index'})
  }
  async wechatBind() {
    const { ctx } = this
    const { code, state, sessionId } = ctx.query
    const result = await ctx.jsonCurl(ctx, `wechat/bind-api?code=${code}&state=${state}&sessionId=${sessionId}`)
    console.log('wechat bind result', result)
    result.data.result && result.data.result.redirectUrl
      ? ctx.redirect(result.data.result.redirectUrl)
      : await ctx.render('pages/failedLogin/index')
  }
  async ownerShare() {
    const { ctx } = this
    const id = ctx.params.id
    const blogId = id.split('-')[1]
    const bloggerId = id.split('-')[0]
    const isMobile = ctx.isMobile()
    if (!isMobile) {
      ctx.redirect(`/owner/${bloggerId}`)
    }
    await ctx.render('pages/mobile/owner/index', { blogId, bloggerId, component: 'mobile/owner/index'})
  }
  async bindWechatSuccess() {
    const { ctx } = this
    await ctx.render('pages/successLogin/index')
  }
  async bindWechatFailed() {
    const { ctx } = this
    await ctx.render('pages/failedLogin/index')
  }
  async accessDeny() {
    const { ctx } = this
    await ctx.render('pages/mobile/folder/accessDeny/index', { component: 'mobile/folder/accessDeny/index'})
  }
  async invite() {
    const { ctx } = this
    const inviteCode = ctx.params.inviteCode
    await ctx.render('pages/mobile/invite/index', { inviteCode, component: 'mobile/invite/index'})
  }
}

module.exports = MobileController
