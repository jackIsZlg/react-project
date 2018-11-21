/**
 * Created by gewangjie on 2017/7/3.
 * 待优化，引入设计模式
 */
import base from './baseModule'

const ajaxList = {
  // 基础格式
  basic(option, success, fail) {
    $.ajax({cache: option.type !== 'get', ...option}).done((d) => {
      if (!d.success) {
        fail && fail(d)
        return
      }
      success && success(d)
    }).fail((d) => {
      fail && fail(d)
    })
  },

  // 基础格式--登录验证
  basicLogin(option, success, fail) {
    base.request(option).done((d) => {
      if (!d.success) {
        fail && fail(d)
        return
      }
      success && success(d)
    }).fail((d) => {
      fail && fail(d)
    })
  },

  basicFetch(url, options) {
    return new Promise((resolve, reject) => {
      fetch(`${url}`, options)
        .then(response => response.json())
        .then((d) => {
          if (d.success) {
            resolve && resolve(d.result)
            return
          }
          reject && reject(d)
        })
    })
  },

  // 订阅博主
  followOwner(id, success, fail) {
    // 不传id跳出
    if (!id || id === 'null') {
      return
    }
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/owner/follow/${id}`
    }, success, fail)
  },

  // 取关博主
  unFollowOwner(followId, success, fail) {
    if (!followId || followId === 'null') {
      return
    }
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/owner/unFollow/${followId}`
    }, success, fail)
  },

  // 非库内博主，订阅
  subscribeOwner(data, success, fail) {
    // 不传id跳出
    if (!data.nickname) {
      return
    }
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/owner/subscribe`,
      data
    }, success, fail)
  },

  // ins关注列表，订阅
  subscribeInsOwner(bloggerId, success, fail) {
    // 不传id跳出
    if (!bloggerId) {
      return
    }
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/follow/subscribe/ins/blogger?bloggerId=${bloggerId}`
    }, success, fail)
  },

  // 获取ins账号
  getInsAccount(success, fail) {
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/users/ins-account`,
    }, success, fail)
  },

  // 获取用户基本信息
  getUserInfo(success, fail) {
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/users/info`
    }, success, fail)
  },

  // 获取精选集详情
  getFolderInfo(id, success, fail) {
    this.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/detail/${id}?_=${new Date().getTime()}`,
      cache: false
    }, success, fail)
  },

  // 获取精选集4张图
  getFolderImg(id, success, fail) {
    this.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/post?folderId=${id}`
    }, success, fail)
  },

  // 接受邀请
  agreeInvite(id, success, fail) {
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/folder/invite/agree?inviteId=${id}`
    }, success, fail)
  },

  // 拒绝邀请
  refuseInvite(id, success, fail) {
    this.basicLogin({
      type: 'GET',
      url: `${base.baseUrl}/folder/invite/refuse?inviteId=${id}`
    }, success, fail)
  },

  // 退出登录
  logout() {
    ajaxList.basic({
      url: `${base.baseUrl}/logout`,
      type: 'GET',
    }, (data) => {
      console.log('logout', data)
      // GIO清除登录用户 ID
      window.gio('clearUserId')
      base.LS.clear()
      window.location.href = '/'
    })
  },

  // 获取Ins图片详情
  getInsImgDetail(id, folderId, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/blog/${id}?folderId=${folderId}`,
    }, success, fail)
  },

  // 获取订货会图片详情
  getOrderDetail(id, success, fail) {
    ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/ordering/imageDetail?orderingId=${id}`,
    }, success, fail)
  },

  // 获取品牌精选图片详情
  getMarketDetail(id, success, fail) {
    ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/market/image-detail?id=${id}`,
    }, success, fail)
  },

  // 获取秀场图片详情
  getRunwayImgDetail(id, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/show/img/${id}`,
    }, success, fail)
  },

  // 获取博主详情
  getBloggerDetail(id, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/detail/${id}`,
    }, success, fail)
  },

  // 获取推荐博主
  getRecomBlogger(num, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/owner/recom/user-mode?number=${num}`
    }, success, fail)
  },

  // 获取新手指引标识
  // page:1-新用户引导，2-图片详情页精选引导，3-博主主页，订阅引导，4-博主搜索，5-关注ins列表 6-搜索
  getNewGuide(page, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/user/guide/state?type=${page}`
    }, success, fail)
  },

  // 精选集收藏
  folderCollected(id, success, fail) {
    ajaxList.basic({
      type: 'POST',
      url: `${base.baseUrl}/folder/collect`,
      data: {
        folderId: id
      }
    }, success, fail)
  },

  // 取消精选集收藏
  folderCollectedCencel(id, success, fail) {
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/folder/collect/cancel`,
      data: {
        folderId: id
      }
    }, success, fail)
  },

  // 后端埋点
  addPoint(code, content) {
    content.client = 'web'
    ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/track-log?code=${code}&content=${encodeURIComponent(JSON.stringify(content))}`,
    }, () => {
      console.log('success')
    }, () => {
      console.log('failure', code)
    })
  }

}

export default ajaxList