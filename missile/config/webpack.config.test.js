'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackPluginHashOutput = require('webpack-plugin-hash-output')

const os = require('os')
const yaml = require('js-yaml')
const fs = require('fs-extra')

const entry = {}
const plugins = []
const root = path.join(__dirname, '../')
const appConfigPath = path.join(root, 'config/app.yaml')
const appConfig = yaml.safeLoad(fs.readFileSync(appConfigPath))
const srcPath = path.join(root, 'app')
const pkgJSON = require('../package.json')

let buildPath
let publicPath
if (appConfig.out) {
  // 外包资源放置到本地
  const appName = appConfig.appCode.toLowerCase()
  buildPath = path.join(root, `build/${appName}/static`)
  publicPath = `/${appName}/static/`
} else {
  buildPath = path.join(root, 'build')
  publicPath = `//test.wacdn.com/s/${pkgJSON.name}/`
}

const env = process.env.NODE_ENV || 'development'
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const homeDir = os.homedir()
const happyTempDir = path.join(
  homeDir,
  `.happypack/${pkgJSON.group}/${pkgJSON.name}`
)

// 入口文件
entry.app = './app'

// 模版文件
plugins.push(
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    chunks: ['app']
  })
)

plugins.push(
  new HtmlWebpackPlugin({
    inject: false,
    filename: 'error.html',
    template: 'error.html'
  })
)

const config = {
  context: srcPath,
  entry: entry,
  devtool: 'inline-source-map',
  output: {
    path: buildPath,
    publicPath: publicPath,
    filename: '[chunkhash].js',
    chunkFilename: '[chunkhash].js',
    hashDigestLength: 22
  },
  resolve: {
    alias: {
      common: path.join(srcPath, 'common'),
      store: path.join(srcPath, 'store'),
      component: path.join(srcPath, 'component'),
      page: path.join(srcPath, 'page')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'happypack/loader',
        options: {
          id: 'js'
        }
      },
      {
        test: /\.tpl$/,
        loader: 'dot-tpl-loader'
      },
      {
        oneOf: [
          {
            test: /\.html$/,
            resourceQuery: /\?.*/,
            use: ['nunjucks-loader', 'extract-loader', 'html-loader']
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          }
        ]
      },
      {
        oneOf: [
          {
            test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
            resourceQuery: /\?.*/,
            loader: 'url-loader'
          },
          {
            test: /\.(png|gif|jpg|jpeg|svg|woff|ttf|eot)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:22].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'happypack/loader',
              options: {
                id: 'less'
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      tempDir: happyTempDir,
      loaders: ['babel-loader']
    }),
    new HappyPack({
      id: 'less',
      threadPool: happyThreadPool,
      tempDir: happyTempDir,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'less-loader'
        }
      ],
      cache: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new ExtractTextPlugin({
      filename: '[contenthash:22].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      filename: '[chunkhash].js',
      minChunks: 4
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackPluginHashOutput()
  ].concat(plugins)
}

module.exports = config
