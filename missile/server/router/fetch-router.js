const Router = require('koa-router')
const appConfig = require('lib/config')

const { baseURI, apiPrefix } = appConfig

// fetch 请求
const fetchRouter = new Router({ prefix: baseURI + apiPrefix })

fetchRouter.post('/app/update', require('controller/app/update'))

module.exports = fetchRouter
