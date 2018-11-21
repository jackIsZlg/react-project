/* eslint-disable no-console */
'use strict'

const path = require('path')
const fs = require('fs-extra')
const ip = require('dev-ip')
const yaml = require('js-yaml')
const Promise = require('bluebird')
const webpack = require('webpack')
const bodyParser = require('body-parser')
const WebpackDevServer = require('webpack-dev-server')

Promise.promisifyAll(fs)

const env = process.env.NODE_ENV || 'development'

const devIp = ip()[0]
const root = path.join(__dirname, '..')
const viewsPath = path.join(root, 'server/views')
const configPath = path.join(root, `config/webpack.config.${env}`)
const appConfigPath = path.join(root, 'config/app.yaml')

const config = require(configPath)
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath))

const entry = config.entry
const devPort = appConfig.server.devPort
const devClient = [`webpack-dev-server/client?http://${devIp}:${devPort}/`]
const publicPath = (config.output.publicPath = `http://${devIp}:${devPort}/build/`)

fs.removeSync(viewsPath)

Object.keys(entry).forEach(entryName => {
  entry[entryName] = devClient.concat(entry[entryName])
})

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
  quiet: true,
  noInfo: true,
  compress: true,
  disableHostCheck: true,
  publicPath: publicPath,
  watchOptions: {
    aggregateTimeout: 300
  },
  proxy: {
    '/build': {
      target: `http://${devIp}:${devPort}/`,
      rewrite: req => {
        req.url = '/webpack-dev-server'
      }
    }
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers':
      'x-requested-with, content-type, Authorization'
  },
  setup (app) {
    function requireUncached (module) {
      try {
        // 删除缓存，动态加载
        delete require.cache[require.resolve(module)]
        return require(module)
      } catch (e) {
        console.log(
          `can't load module in ${module}. at scripts/server.js requireUncached`
        )
      }
    }

    function sendValue (req, res, value) {
      if (typeof value === 'function') {
        value = value(req, res)
      }

      if (value.$$header) {
        Object.keys(value.$$header).forEach(key => {
          res.setHeader(key, value.$$header[key])
        })
      }

      const delay = value.$$delay || 0

      delete value.$$header
      delete value.$$delay

      Promise.delay(delay, value).then(result => {
        res.send(result)
      })
    }

    // 处理 restful mock 接口
    const mockMap = require(path.join(root, 'mock/mock-map'))

    Object.keys(mockMap).forEach(mockPath => {
      app.all(path.join('/mock', mockPath), function (req, res) {
        const value = requireUncached(
          path.join(root, 'mock', mockMap[mockPath])
        )

        sendValue(req, res, value)
      })
    })

    app.all('/mock/*', function (req, res) {
      const mockPath = path.join(root, req.path)

      const value = requireUncached(mockPath)
      if (value) {
        sendValue(req, res, value)
      } else {
        res.sendStatus(404)
      }
    })
  }
})

compiler.plugin('compile', () => {
  console.log('webpack building...')
})

compiler.plugin('done', stats => {
  const time = (stats.endTime - stats.startTime) / 1000

  if (stats.hasErrors()) {
    console.log('webpack build error')

    return console.log(
      stats.toString({
        colors: true,
        timings: false,
        hash: false,
        version: false,
        assets: false,
        reasons: false,
        chunks: false,
        children: false,
        chunkModules: false,
        modules: false
      })
    )
  }

  const outputPath = config.output.path
  const assets = stats.compilation.assets

  Promise.map(Object.keys(assets), file => {
    const asset = assets[file]
    const filePath = path.relative(outputPath, asset.existsAt)

    if (path.extname(filePath) === '.html') {
      const content = asset.source()
      const distPath = path.join(viewsPath, filePath)

      return fs.outputFileAsync(distPath, content)
    }
  }).then(() => {
    console.log(`webpack build success in ${time.toFixed(2)} s`)
  })
})

const app = server.app

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

server.listen(devPort, () => {
  console.log(`webpack-dev-server started at localhost:${devPort}`)
  console.log('webpack building...')
})
