const pathName = [
  {
    url: '/gallery/styles',
  },
  {
    url: '/users/profile-view',
  },
  {
    url: '/users/folder/detail/',
  },
  {
    url: '/show/designer/',
  },
  {
    url: '/show/runway',
  },
  {
    url: '/blog/classify/',
  },
  {
    url: '/tag/classify',
  },
  {
    url: '/users/favorite-view',
  },
  {
    url: '/users/favorite-content',
  },
  {
    url: '/users/footprint',
  },
  {
    url: '/users/follow-view',
  },
  {
    url: '/owner/follow/postView',
  },
  {
    url: '/owner/',
  },
  {
    url: '/search-view',
  },
  {
    url: '/login',
  },
  {
    url: '/',
  }]

const wfTypeData = {
  collectPic: {
    name: '精选图片',
    source: 13,
  },
  pinterest: {
    name: '站外搜索',
    source: 12,
  },
  index: {
    name: '最新',
    source: 11,
  },
  blog: {
    name: '搜索图片',
    source: 1,
  },
  ownerId: {
    name: '博主主页',
    source: 2,
  },
  recommendBlog: {
    name: '图片详情页（单图推荐）',
    source: 1,
  },
  followBlog: {
    name: '订阅',
    source: 3,
  },
  folder: {
    name: '精选集内',
    source: 4,
  },
  folderSelect: {
    name: '精选集内',
    source: 4,
  },
  history: {
    name: '足迹',
    source: 5,
  },
  runwayDetail: {
    name: '秀场品牌',
    source: 6,
  },
  classify: {
    name: '分类',
    source: 7,
  },
  imgDetail: {
    name: '图片详情',
    source: 16,
  },
  wxArticle: {
    name: '微信文章',
    source: 17,
  },
  folderShare: {
    name: '精选集内（协作）',
    source: 4,
  },
  folderPublic: {
    name: '精选集内（分享）',
    source: 4,
  },
  customSearch: {
    name: '定制搜素',
    source: 4,
  },
  orderFolder: {
    name: '订货会封面',
    source: 4
  },
  orderMeeting: {
    name: '订货会',
    source: 4
  },
  brandSelected: {
    name: '品牌精选',
    source: 4
  },
  brandImage: {
    name: '品牌精选单图',
    source: 4
  },
  runwayHomePage: {
    name: '秀场首页',
    source: 4
  },
  brandShow: {
    name: '品牌详情',
    source: 4
  },
  runwaySelect: {
    name: '秀场详情',
    source: 4,
  },
  popularity: {
    name: 'TOP100',
    source: 4,
  },
  owner: {}, // 博主搜索
  followOwner: {}, // 我的订阅(博主)
  insOwner: {}, // 我的ins关注列表
}

const sourcePage = {
  // 首页-推荐
  index: {
    source: 'index'
  },
  // 图库-筛选
  classify: {
    source: 'pic_classify_result'
  },
  // 订阅
  subscribe: {
    source: 'followed_index'
  },
  // 精选集详情
  collectionDetails: {
    source: 'album_detail'
  },
  // 订货会
  ordering: {
    cource: 'order_conference_detail'
  },
  // 品牌精选合集
  brandSelection: {
    cource: 'brands_selected_detail'
  },
  // 图片详情
  imageDetails: {
    cource: 'pic_detail'
  },
  // 博主详情
  bloogerDetails: {
    cource: 'blogger_detail'
  },
  // 秀场详情
  runwayDetails: {
    cource: 'runway_detail'
  },
  // 品牌详情
  brandDetails: {
    cource: 'brand_detail'
  },
  // 图片搜索
  picSearch: {
    cource: 'pic_search_result'
  },
  // 首页-精选集(精选)
  albumIndex: {
    cource: 'album_index'
  },
  // 个人主页-精选集
  userAlbums: {
    cource: 'user_albums'
  },
  // 个人主页-订阅列表
  userFollowed: {
    cource: 'user_followed_bloggers'
  },
  // 推荐博主
  ecommendBlogger: {
    cource: 'recommend_blogger'
  },
  // 博主搜索
  bloggerSearch: {
    cource: 'blogger_search_result'
  },
  // 我的Ins关注列表
  myIns: {
    cource: 'my_ins_blogger'
  },
  // 注册时推荐博主
  firstSign: {
    cource: 'first_sign_in'
  },
  // 搜索博主
  searchBlogger: {
    cource: 'search_blogger'
  },
}

export {pathName, wfTypeData, sourcePage}