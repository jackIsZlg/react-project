/**
 * Created by gewangjie on 2018/3/7
 */

import axios from 'axios'
import addPoint from './event'

// 客户端检测运行环境
let baseUrl = '/api/'
let ssoUrl
let taobaoUrlHost = 'https://item.taobao.com/item.htm?id='
switch (window.location.host) {
  case 'www.zhiyitech.cn':
    baseUrl = '//www.zhiyitech.cn/api/'
    ssoUrl = '//sso-prod.zhiyitech.cn/'
    break

  // 线上
  case 'bi.deepfashion.cn':
    baseUrl = '//bi.deepfashion.cn/api/'
    ssoUrl = '//sso-prod.zhiyitech.cn/'
    break

  // 新灰度
  case 'bi-gray.zhiyitech.cn':
    baseUrl = '/api/'
    ssoUrl = '//sso-gray.zhiyitech.cn/'
    break

  // 新测试
  case 'bi-dev.deepfashion.cn':
    baseUrl = '//bi-dev.deepfashion.cn/api/'
    ssoUrl = '//47.98.247.133:8083/'
    break

  default:
    // baseUrl = "//bi-dev.deepfashion.cn/api/";
    // ssoUrl = "//develop.deepfashion.cn:8083/";
    baseUrl = '/api/'
    ssoUrl = '//sso-gray.zhiyitech.cn/'
    // baseUrl = "//www.zhiyitech.cn/api/";
    // ssoUrl = "//sso.deepfashion.cn/";
    break
}
axios.interceptors.response.use(function (response) {
  // Do something with response data
  let data = response.data
  if (data.success) {
    return data.result
  }
  if (data.errorCode === 'UP1') {
    localStorage.setItem('serviceId', data.serviceId)
    return
  }
  return Promise.reject(new Error(data.errorDesc))
}, function (error) {
  // Do something with response error
  console.error(error)
  return Promise.reject(new Error('网络错误'))
})
const basic = (url, options = {}) => {
  url = encodeURI(url)
  return new Promise((resolve, reject) => {
    options.headers = { ...options.headers, 'X-Requested-With': 'XMLHttpRequest' }
    options.credentials = 'include'
    options.mode = 'cors'

    // 支持api携带域名，默认baseUrl
    if (!/^http|^https|^\/\//.test(url)) {
      url = `${baseUrl}${url}`
    }

    fetch(url, options)
      .then(response => response.json())
      .then((d) => {
        // 埋点
        addPoint(url)
        // 兼容两种后端返回格式
        if (d.code === 10000) {
          if (d.data === null) {
            resolve && resolve([])
            return
          }
          resolve && resolve(d.data)
          return
        }

        if (d.success) {
          if (d.result === null) {
            resolve && resolve([])
            return
          }
          resolve && resolve(d.result)
          return
        }

        // 未登录逻辑
        if (d.errorCode === 'L09' || d.errorCode === 'L16') {
          console.log(d.errorDesc)
          return
        }

        // 未购买套餐逻辑
        if (d.errorCode === 'UP1') {
          // 显示购买服务
          localStorage.setItem('serviceId', d.serviceId)
          resolve && resolve()
          return
        }
        reject(d)
      }).catch(e => console.log('Oops, error', e))
  })
}

// 所有API语义化封装
export default {
  basic,
  ssoUrl,
  baseUrl,
  taobaoUrlHost,
  get: axios.get,
  post: axios.post,
  toFormData (data) {
    let searchParams = new URLSearchParams()
    for (let o in data) {
      searchParams.set(o, data[o])
    }
    return searchParams
  },

  // 登录校验
  isLogin: () => basic('auth/login/state'),

  // 获取用户信息
  getUserInfo: () => basic('user/info'),

  // 获取上新日报数据
  getShopList: (params) => basic('daily/new-sale-shop?' + params),

  // 获取某店铺下的上新商品
  getNewProductList: (params) => basic('daily/new-sale-items?' + params),

  // 监控店铺
  addShopFollow: (shopName = '', sellerName = '', options) => basic(`shop/follow?inputShopName=${shopName}&inputSellerName=${sellerName}`, options),

  // 获取商铺名称和商品品类
  getshopNameAndTags: (name = '') => basic('shop/all_shop_name?name=' + name),

  // 获取时间段内的销量和累计销量
  getSalesCount: (id, dayRange, startDate, endDate) => basic('item/item_detail?itemId=' + id + '&dayRange=' + dayRange + '&startDate=' + startDate + '&endDate=' + endDate),
  /// /bi-gray.deepfashion.cn/api/daily/items-info?itemIdList=1240142800,1327889252
  // getSalesCount: (id) => basic('daily/items-info?itemIdList=' + id),

  // 图片收藏
  getCollect: (coatId, coatType = '') => basic('selectedCoats/like?coatId=' + coatId + '&coatType=' + coatType),

  // 取消图片收藏
  getCancelCollect: (coatId, coatType = '') => basic('selectedCoats/like_cancel?coatId=' + coatId + '&coatType=' + coatType),

  // 获取店铺列表
  getShops: (params) => basic('shop/shop-list?' + params),

  exportShops ({ startDate, endDate }) {
    return basic(`/api/api/file/shop-list-stat?startDate=${startDate}&endDate=${endDate}`)
  },
  cancelFollow (id) {
    return basic(`/shop/follow_cancel?shopId=${id}`)
  },
  // 获取监控店铺数
  getFollowShops () {
    return basic(`shop/followed-count`)
  },
  getEmailList () {
    return basic(`user/email-history`)
  },

  // 收藏商品列表
  getCollectItemList: (params) => basic(`account/collect-item-list?` + params),

  // 获取爆款推荐列表
  getRecommends: (params) => basic('item/hot-item-list?' + params),

  // 切换商品收藏 （添加/取消）
  changeItemCollect: (type, itemId) => type ? basic('account/item-collect-cancel?itemId=' + itemId) : basic('account/item-collect-add?itemId=' + itemId),

  // 切换商品对比
  changeItemDiff: (type, itemId) => type ? basic('account/compare-item-cancel?itemId=' + itemId) : basic('account/compare-item-add?itemId=' + itemId),

  // 切换店铺对比
  changeShopDiff: (type, shopId) => type ? basic('account/compare-shop-cancel?shopId=' + shopId) : basic('account/compare-shop-add?shopId=' + shopId)

}
