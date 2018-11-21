const utils = require('./webpack.util.js')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')
const os = require('os')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const {version} = require('./config/config.default')({name: 'df'})

const extractSass = new ExtractTextPlugin({
  filename: '[name]',
})
module.exports = {
  entry: utils.getEntry('./app/view/pages'),
  // mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader?minimize',
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'happypack/loader?id=cssLoader',
          }, {
            loader: 'happypack/loader?id=scssLoader',
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'happypack/loader?id=js',
      },
      {
        test: /\.(jpg|jpeg|png|svg)$/,
        loader: 'file-loader'
      },
    ]  
  },
  plugins: [
    extractSass,
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [{
        loader: 'babel-loader',
        query: {  
          presets: [
            require.resolve('babel-preset-react'),
            [require.resolve('babel-preset-es2015')],
            require.resolve('babel-preset-stage-3')
          ],
          cacheDirectory: './webpack_cache/',
        },
      }]
    }),
    new HappyPack({ id: 'scssLoader', threadPool: happyThreadPool, loaders: ['fast-sass-loader']}),
    new HappyPack({ id: 'cssLoader', threadPool: happyThreadPool, loaders: ['css-loader?minimize'] }),
    new ParallelUglifyPlugin({
      cacheDir: './webpack_cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    }),
    new CopyWebpackPlugin([
      { from: `${__dirname}/app/view/img`, to: `${__dirname}/app/public/resource` }
    ]), 
    // new BundleAnalyzerPlugin()
  ],
  performance: {
    hints: false
  },
  watchOptions: {
    aggregateTimeout: 100,
    poll: 100
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      minChunks: 2,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        common: {
          test: /\.js(x)$/,
          chunks: 'initial',
          name: 'common/common.js',
          minChunks: 10,
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'common/vendor.js',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  output: {
    path: `${__dirname}/app/public/${version}`, // 打包路径
    publicPath: 'public', // 静态资源相对路径
    filename: '[name]' // 打包后的文件名，[name]是指对应的入口文件的名字
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
}