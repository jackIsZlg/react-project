'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const entry = {}
const plugins = []
const root = path.join(__dirname, '../')
const srcPath = path.join(root, 'app')
const buildPath = path.join(root, 'build')
const env = process.env.NODE_ENV || 'development'

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
  devtool: 'cheap-module-source-map',
  output: {
    pathinfo: true,
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].js'
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
              name: '[path][name].[ext]'
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
      loaders: ['babel-loader'],
      verbose: true,
      verboseWhenProfiling: true
    }),
    new HappyPack({
      id: 'less',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true
          }
        }
      ],
      verbose: true,
      verboseWhenProfiling: true,
      cache: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      filename: 'app.js',
      minChunks: 4
    })
  ].concat(plugins)
}

module.exports = config
