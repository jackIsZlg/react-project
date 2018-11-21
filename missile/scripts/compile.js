/* eslint-disable no-console */

'use strict'

const path = require('path')
const url = require('url')
const fs = require('fs-extra')
const ip = require('dev-ip')
const glob = require('glob')
const yaml = require('js-yaml')
const execa = require('execa')
const webpack = require('webpack')
const Promise = require('bluebird')
const deploy = require('@wac/static-deploy')

Promise.promisifyAll(fs)

console.log('start compiling...')

const startTime = Date.now()
let env = process.env.NODE_ENV || 'development'

if (env === 'staging') {
  env = 'test'
}

console.log(`using ${env} config`)

const devIp = ip()[0]
const root = path.join(__dirname, '..')
const processPath = path.join(root, 'process.json')
const viewsPath = path.join(root, 'server/views')
const configPath = path.join(root, `config/webpack.config.${env}`)
const appConfigPath = path.join(root, 'config/app.yaml')

const config = require(configPath)
const processJson = require(processPath)
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath))
const serverConfig = appConfig.server

const buildPath = config.output.path
const publicPath = config.output.publicPath
const pkgName = process.env.npm_package_name

Promise.resolve()
  .then(() => {
    console.log('clean views and build path')

    // 清理 views && output.path
    return Promise.all([
      fs.removeAsync(viewsPath),
      fs.removeAsync(buildPath)
    ])
  })
  .then(() => {
    console.log('update process.json')

    const debugPort = serverConfig.debugPort

    // 更新 process.json
    processJson.apps.forEach((app) => {
      if (/development|test/.test(app.name)) {
        app.node_args = `${app.node_args || ''} --inspect=${debugPort}`
      }

      if (!app.name.startsWith(pkgName)) {
        app.name = `${pkgName}-${app.name}`
      }
    })

    return fs.writeJsonAsync(processPath, processJson)
  })
  .then(() => {
    console.log('babel transform server...')

    // babel 转码
    return execa.shell('babel server -d server').then((ret) => {
      console.log(ret.stdout)
    })
  })
  .then(() => {
    console.log('webpack building...')

    const devPort = serverConfig.devPort

    if (env === 'development') {
      config.output.publicPath = `http://${devIp}:${devPort}/build/`
    }

    // webpack 编译
    return new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.log(stats.toString({
            colors: true,
            timings: true,
            hash: true,
            version: true,
            errorDetails: true,
            assets: false,
            chunks: false,
            children: false,
            modules: false,
            chunkModules: false
          }))

          return reject(err)
        }

        const time = (stats.endTime - stats.startTime) / 1000

        console.log(`webpack build success in ${time.toFixed(2)} s`)

        resolve()
      })
    })
  })
  .then(() => {
    console.log('move views template')

    // 移动模版文件
    const templates = glob.sync('*.html', {
      cwd: buildPath
    })

    return Promise.map(templates, (template) => {
      const srcPath = path.join(buildPath, template)
      const distPath = path.join(viewsPath, template)

      return fs.moveAsync(srcPath, distPath, {
        clobber: true
      })
    })
  })
  .then(() => {
    // 非测试及生产环境
    if (!['test', 'production'].includes(env)) {
      return Promise.resolve()
    }

    console.log('publishing static assets...')

    // 发布静态资源
    const parsedUrl = url.parse(publicPath, true, true)
    const assetsPath = parsedUrl.pathname

    return deploy({
      env: env,
      cwd: buildPath,
      imagemin: true,
      path: assetsPath
    }).then((ret) => {
      if (ret.code !== 0) {
        return Promise.reject(ret.error)
      }

      console.log('publish success')
      console.log(JSON.stringify(ret, null, 4))
    })
  })
  .then(() => {
    const time = (Date.now() - startTime) / 1000
    console.log(`compile success in ${time.toFixed(2)} s`)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
