
module.exports = {
  // 判断是否是移动端
  isMobile() {
    const ua = this.request.header['user-agent'] || ''
    let isMobile = false
    const agent = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone', 'MQQBrowser']
    if (ua.indexOf('Windows NT') === -1 || (ua.indexOf('Windows NT') > -1 && ua.indexOf('compatible; MSIE 9.0;') > -1)) {
      if (ua.indexOf('Windows NT') === -1 && ua.indexOf('Macintosh') === -1) {
        for (let i = 0; i < agent.length; i++) {
          if (ua.indexOf(agent[i]) !== -1) {
            isMobile = true; break
          }
        }
      }
    }
    return isMobile
  },
  // 判断是否是ajax请求
  isAjax(ctx) {
    return ctx.request.headers['x-requested-with'] && ctx.request.headers['x-requested-with'].toLowerCase() === 'xmlhttprequest' 
  },
  jsonCurl(ctx, url) {
    return ctx.curl(`${ctx.app.config.targetUrl + url}`, { 
      headers: {Cookie: ctx.request.headers.cookie || ''},
      dataType: 'json'
    })
  }
}