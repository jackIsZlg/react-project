const Router = require('koa-router')
const home = require('controller/home')
const fetchRouter = require('./fetch-router')
const { baseURI, apiPrefix } = require('lib/config')

const router = new Router()

// 首页
router
  .get(baseURI || '/', home)
  // 健康检查
  .get('/check_backend_active.html', async ctx => {
    ctx.body = 'Success!'
  })
  // fetch 请求
  .use(fetchRouter.routes())
  // 自动代理到 java 和 首页渲染
  .all('*', async (ctx, next) => {
    const path = ctx.path.replace(new RegExp(`^${baseURI}`), '')

    // 如果路径以 apiPrefix 开头，认为是 ajax 请求
    if (path.startsWith(apiPrefix) && path !== apiPrefix) {
      await next()
    } else {
      // 其他请求 尝试使用首页渲染
      await home(ctx)
    }
  })

module.exports = router
