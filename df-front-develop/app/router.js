module.exports = (app) => {
  const authCheck = app.middleware.authCheck(app)
  const { router, controller } = app
  const { home, other, message, cool, error, mobile, market, owner, show, ordering, folder, user, article } = controller
  /** *************************页面级别路由start************************* */
  // 页面重定向
  app.redirect('/', '/index')

  /** *****首页Instagram********** */
  router.get('/index', authCheck, other.index)
  router.get('/hot', authCheck, other.hot)

  /** *****杂项other********** */
  router.get('/discover', authCheck, home.index)
  router.get('/login', other.login)
  router.get('/guide', other.guide)
  router.get('/share-jump', authCheck, other.share)
  router.get('/tag/classify', authCheck, other.tag)
  router.get('/error/404', other.error)
  router.get('/search/user/image', authCheck, other.search)
  router.get('/search/pinterest', authCheck, other.pinterest)
  router.get('/gallery/styles', authCheck, other.gallery)
  router.get('/blog/detail/:id', authCheck, other.blogDetail)
  router.get('/search-view', authCheck, other.searchView)

  /** *****专栏模块******** */
  router.get('/article/list', authCheck, article.list)
  router.get('/article/detail/:id', authCheck, article.detail)

  /** *****订阅模块******** */
  router.get('/owner/:id', authCheck, owner.detail)
  router.get('/owner/follow/postView', authCheck, owner.post)
  router.get('/owner/recom/home', authCheck, owner.recom)

  /** *****电商模块******* */
  router.get('/market/index', authCheck, market.index)
  router.get('/market/collections', authCheck, market.collections)

  /** *****订货会模块****** */
  router.get('/ordering/index', authCheck, ordering.index)
  router.get('/ordering/collections', authCheck, ordering.collections)
  router.get('/ordering/detail/:orderingId', authCheck, ordering.detail)

  /** *****精选集模块****** */
  router.get('/folder/work/:id', authCheck, folder.work)
  router.get('/folder/public/:id', authCheck, folder.public)
  router.get('/folder/public/error', authCheck, folder.public)
  router.get('/folder/public/index', authCheck, folder.public)
  router.get('/folder/public/rank', authCheck, folder.public)
  router.get('/folder/error', authCheck, folder.error)
  router.get('/folder/download', authCheck, folder.download)
  router.get('/users/folder/detail/:id', authCheck, folder.detail)
  router.get('/users/foller/detail/:id', authCheck, folder.foller)
  router.get('/folder/inviteConfirm/:id', authCheck, folder.invite)
  router.get('/folder/collect/fans', authCheck, folder.collect)
  router.get('/folder/accessDeny', authCheck, folder.accessDeny)
  router.get('/folder/post-record', authCheck, folder.postRecord)
  router.get('/ios/folder/collect/fans', authCheck, folder.collect)
  router.get('/android/folder/collect/fans', authCheck, folder.collect)

  router.get('/folder/invite/confirm/:id', authCheck, folder.invite)
  router.get('/users/other-favorite-img/:id', authCheck, folder.otherImg)


  /** *****秀场模块******** */
  router.get('/show/runway', authCheck, show.runway)
  router.get('/show/designer/:id', authCheck, show.designer)
  router.get('/show/brand/:id', authCheck, show.brand)
  router.get('/show/img/detail/:showImgId', authCheck, show.detail)
  router.get('/show/download', authCheck, show.download)

  /** *****用户模块******** */
  router.get('/user/auth/view', authCheck, user.authView)
  router.get('/user/ins/list', authCheck, user.list)
  router.get('/user/invite/view', authCheck, user.invite)
  router.get('/user/follow-view', authCheck, user.follow)
  router.get('/user/profile-view', authCheck, user.profile)
  router.get('/register/agreement', user.agreement)
  router.get('/user/favorite-view', authCheck, user.favoriteView)
  router.get('/user/favorite-content/:id', authCheck, user.favoriteContent)

  router.get('/user/favorite-img-view', authCheck, user.favoriteImgView)

  router.get('/users/auth/view', authCheck, user.authView)
  router.get('/users/ins/list', authCheck, user.list)
  router.get('/users/invite/view', authCheck, user.invite)
  router.get('/users/follow-view', authCheck, user.follow)
  router.get('/users/profile-view', authCheck, user.profile)
  router.get('/users/favorite-view', authCheck, user.favoriteView)
  router.get('/users/favorite-content/:id', authCheck, user.favoriteContent)

  router.get('/users/favorite-img-view', authCheck, user.favoriteImgView)

  /** *****消息模块******** */
  router.get('/message/index', authCheck, message.index)

  /** *****错误页面******** */
  router.get('/error/404', error.notfound)
  router.get('/error/order-unauth', authCheck, error.orderUnauth)
  router.get('/error/market-unauth', authCheck, error.marketUnauth)
  router.get('/error/stay-tuned', authCheck, error.stay)


  /** *****移动端模块****** */
  router.get('/wechat/qrcode', mobile.qrcode)
  router.get('/wechat/oauth', mobile.oauth)
  router.get('/ios/download', mobile.download)
  router.get('/mobile/wechat/auth', mobile.wechatAuth)
  router.get('/mobile/activity/vogue', mobile.activity)
  router.get('/mobile/folder/error', mobile.folderError)
  router.get('/mobile/blog/share/:id', mobile.blogShare)
  router.get('/mobile/folder/public/:id', mobile.folder)
  router.get('/mobile/show/share/:id', mobile.showShare)
  router.get('/mobile/owner/share/:id', mobile.ownerShare)
  router.get('/bindWechatFailed', mobile.bindWechatFailed)
  router.get('/bindWechatSuccess', mobile.bindWechatSuccess)
  router.get('/wechat/successLogin', mobile.bindWechatSuccess) // 后台给的是这个地址上面那个不知道有没有人
  router.get('/wechat/bind', mobile.wechatBind)
  router.get('/mobile/folder/accessDeny', mobile.accessDeny)
  router.get('/mobile/ios/notify/auth', mobile.appUrl)
  router.get('//wechat/invite/page/:inviteCode', mobile.invite)
  router.get('/wechat/invite/page/:inviteCode', mobile.invite)
  /** ***************************页面级别路由end******************************* */
  // router.get('/logout', login.loginOut)
  
  router.all('/error/catch', error.catch)
  router.get('/get/bing/img', cool.index)
}
