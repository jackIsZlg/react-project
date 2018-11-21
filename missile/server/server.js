require('app-module-path/register')

const Promise = require('bluebird')

Promise.config({
  warnings: false,
  longStackTraces: true
})

global.Promise = Promise

require('babel-runtime/core-js/promise').default = Promise

const Koa = require('koa')
const path = require('path')

const nunjucks = require('koa-nunjucks-2')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session-redis')
const favicon = require('koa-favicon')

const logger = require('@wac/koa-logger')
const papayaRequest = require('@wac/papaya-request')
const papayaProxy = require('@wac/papaya-proxy')
const papayaAuth = require('@wac/papaya-auth')
const papayaCas = require('@wac/papaya-cas')

const error = require('./middleware/error')

const apiMap = require('./lib/api-map')
const config = require('./lib/config')
const router = require('./router')

const app = new Koa()
const isDev = app.env === 'development'
const port = config.server.port
const redis = getRedis()

app.name = config.appCode.toLowerCase()
app.keys = [`loan-${app.name}`]

app.use(logger(app))
app.use(bodyParser())
app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(
  session({
    key: `koa:sess-loan-${app.name}`,
    store: {
      host: redis.host,
      port: redis.port,
      ttl: 60 * 60 * 1
    }
  })
)

app.use(
  papayaRequest(
    {},
    {
      formatRes (res) {
        const statusCode = res.statusCode || res.status
        const data = res.data

        let body = '[response body]'
        if (data == null || data.code === 1) {
          body = data
        }

        return {
          res_statusCode: statusCode,
          res_body: body
        }
      }
    }
  )
)

app.use(
  nunjucks({
    ext: 'html',
    path: path.join(__dirname, 'views'),
    nunjucksConfig: {
      noCache: isDev,
      autoescape: true
    }
  })
)

// 统一错误处理
app.use(error(app))

// 外包 需要开启 静态资源
if (config.out) {
  const staticServer = require('koa-static-cache')
  app.use(
    staticServer(path.join(__dirname, '../build'), {
      maxage: 3600 * 24 * 30,
      gzip: true
    })
  )
}

// cas登录控制
// app.use(
//   papayaCas({
//     casUrl: config.casUrl,
//     out: config.out,
//     logoutUrl: '/logout',
//     baseURI: config.baseURI
//   })
// )

// 权限控制
app.use(
  papayaAuth({
    baseURI: config.baseURI,
    apiPrefix: config.apiPrefix,
    authWhiteList: config.authWhiteList,
    appCode: config.appCode,
    authUrl: config.authMap[app.env],
    userName (ctx) {
      return ctx.session.userName
    }
  })
)

// 路由配置
app.use(router.routes(), router.allowedMethods())

// 代理中间件
app.use(
  papayaProxy({
    map: apiMap
  })
)

app.listen(port, () => {
  app.log.info(`server started at localhost:${port}`)
})

function getRedis () {
  const { redisMap } = config
  const env = app.env
  const url = redisMap && redisMap[env]
  if (!url) {
    throw new Error(`config app.yaml redisMap.${env} is required!`)
  }
  return url
}
