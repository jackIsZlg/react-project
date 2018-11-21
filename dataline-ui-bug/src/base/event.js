import request from './request'

const pageUrl = {
  '/page/dataline/recommend': 'hot_item_recommend', // 爆款推荐
  '/page/dataline/dataexpress': 'new_item_report', // 上新日报
  '/page/dataline/Inventory': 'item_detail', // 商品详情
  '/page/dataline/storedata': 'shop_list', // 店铺列表
  '/page/dataline/shopDetail': 'shop_detail' // 店铺详情
}

const eventId = [
    { id: 5000001, name: '进入商品详情', type: 'page', pathname: '/page/dataline/Inventory' },
    { id: 5000001, name: '进入商品淘宝页', type: 'page' },
    { id: 5000001, name: '进入店铺淘宝页', type: 'page' },
    { id: 5000001, name: '进入店铺详情', type: 'page', pathname: '/page/dataline/shopDetail' },
    { id: 5000000, name: '切换目录-上新日报', type: 'page', pathname: '/page/dataline/dataexpress' },
    { id: 5000000, name: '切换目录-爆款推荐', type: 'page', pathname: '/page/dataline/recommend' },
    { id: 5000000, name: '切换目录-店铺列表', type: 'page', pathname: '/page/dataline/storedata' },
    { id: 2200004, name: '展开上新商品', type: 'api', url: '/api/daily/new-sale-items' },
    { id: 2200002, name: '监控店铺', type: 'api', url: '/api/shop/follow' },
    { id: 4100002, name: '店铺翻页-上新日报', type: 'api', url: '/api/daily/new-sale-shop' },
    { id: 4100003, name: '店铺翻页-店铺列表', type: 'api', url: '/api/shop/shop-list' },
    // { id: 4200001, name: '展示商品', type: 'api', url: "/api/item/hot-item-list" },
    { id: 4200002, name: '商品翻页', type: 'api', url: '/api/item/hot-item-list' }
]

const sendPoint = function (code, content) {
  fetch(`${request.baseUrl}user/track-log`, {
    method: 'POST',
    body: JSON.stringify({ code: code, content: content }),
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  }).then(() => console.log('成功')).catch(() => console.log('失败'))
}
// 后端埋点
export default function addPoint (url, type = 'api', target_page) {
  let code
  let content = {}
  eventId.forEach(item => {
        // 接口类型埋点
    if (type === 'api') {
      if (url.split('?')[0] === item.url) {
        code = item.id
        content.name = item.name
        content.source_page = pageUrl[window.location.pathname]
      }
            // 解析参数
      const paramsArr = url.split('?')[1] ? url.split('?')[1].split('&') : []
      paramsArr.forEach(item => { content[item.split('=')[0]] = item.split('=')[1] })
    }
        // 页面类型埋点
    else {
      if (target_page === item.pathname) {
        code = item.id
        content.name = item.name
        content.source_page = pageUrl[url]
        content.target_page = pageUrl[target_page]
      }
    }
  })
  if (!code) return
  content.client = 'web'
  sendPoint(code, content)
}
