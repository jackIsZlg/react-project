const Controller = require('egg').Controller

class LoginController extends Controller {
  async index() {
    const { ctx } = this
    await ctx.render('login/index.nj', { component: 'login' })
  }
  async loginOut() {
    const { ctx } = this
    await this.ctx.curl('http://df-gray.zhiyitech.cn/logout')
    ctx.cookies.set('PRODJSESSIONID', null)
    ctx.cookies.set('gray_DF_TOKEN', null)
    return ctx.body = {success: true}
  }
  async login() {
    const { ctx } = this
    const result = await this.ctx.curl('http://df-gray.zhiyitech.cn/auth/phone-login', {
      method: 'POST',
      contentType: 'json',
      data: {
        mobile: ctx.request.body.mobile,
        password: ctx.request.body.password
      },
      dataType: 'json',
    })
    const cookies = result.res.headers['set-cookie']
    if (result.data.success) {
      ctx.cookies.set('PRODJSESSIONID', cookies[0].split(';')[0].split('=')[1])
      ctx.cookies.set('gray_DF_TOKEN', cookies[1].split(';')[0].split('=')[1])
    }
    return ctx.body = {result: result.data.result, success: result.data.success}
  }
}

module.exports = LoginController
