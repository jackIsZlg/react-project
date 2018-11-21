const {
  baseURI,
  appCode,
  apiPrefix,
  pageTitle = '暂无标题'
} = require('lib/config')

module.exports = async ctx => {
  const initState = getInitState(ctx)
  const config = await getConfig(ctx)

  await ctx.render('index', {
    pageTitle,
    config: JSON.stringify(config),
    initState: JSON.stringify(initState)
  })
}

// 提供给前台 redux 作为初始化 state
function getInitState (ctx) {
  return {}
}

// 获取全局配置
async function getConfig (ctx) {
  const authData = await ctx.authService.getAuthData()
  const { userAuth: { resourceList, userInfo }, navItems } = authData

  return {
    // 基础 URI
    baseURI,
    // ajax 请求前缀
    apiPrefix,
    // 系统编号
    appCode,
    // 用户资源列表
    resourceList,
    // 用户信息
    userInfo,
    // 菜单项
    navItems
  }
}
