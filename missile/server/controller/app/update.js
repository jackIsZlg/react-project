module.exports = async ctx => {
  ctx.body = {
    code: 1,
    error: '测试拦截',
    body: ctx.request.body,
    query: ctx.query
  }
}
