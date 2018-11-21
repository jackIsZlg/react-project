import NProgress from 'nprogress'

// 基于 webpack 的 code split 方案
export default function lazyLoad (path) {
  return (location, callback) => {
    NProgress.start()

    // https://webpack.js.org/guides/code-splitting/#dynamic-imports
    import(/* webpackChunkName: "router-[request]" */ `../page/${path}/index.js`).then(
      module => callback(null, module.default)
    )
  }
}
