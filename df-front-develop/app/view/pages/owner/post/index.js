import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'
import {PageIntro} from '../../../components/PageIntro/PageIntro'
import NewTipGuide from '../../../components/NewTipGuide/NewTipGuide'

let guideEl
let tipInfo = [
  ' 在DF订阅博主的图片都在这里展示',
  ' Instagram中的热门图片、博主，以及分类查询在这里',
  ' 最新、最快的秀场图和品牌大片',
  ' 你精选图片、订阅的博主在这里'
]
let targetElInfo = [
  {targetEl: document.querySelector('.channel-2'), position: 'top left'},
  {targetEl: document.querySelector('.channel-0'), position: 'top left'},
  {targetEl: document.querySelector('.channel-4'), position: 'top left'},
  {targetEl: document.querySelector('#login'), position: 'top right'}
]
let postViewGuide = 'postViewGuide1'

base.channel(2)
base.headerChange('white')

// 页面介绍
ReactDOM.render(
  <PageIntro page='postView'
    intro="展示您通过DeepFashion订阅的所有内容"
  />,
  document.getElementById('page-intro')
)

let userInfo = {
  // 0: {
  //     id: 'userInfo',
  //     wfItemType: `userInfo`,
  //     isBlogCover: false
  // }
  0: {
    id: 'recommendOwner',
    wfItemType: 'recommendOwner',
    isBlogCover: false
  }
}
let pointContent = {
  source_page: 'followed_index',
  source_type: 'recommended',
  pic_type: 1
}
let seeBlogger = {
  source_page: 'followed_index',
  source_type: 'recommended_pic_blogger',
}
let recommendContent = {
  source_page: 'followed_index',
  recommend_type: 'picture'
}
let _w = (<WaterFall key="waterWall"
  wfType="followBlog"
  noFilter={true}
  extraData={userInfo}
        // timeLine='followBlog'
  dataUrl="/blog/query/follow"
  pointContent={pointContent}
  seeBlogger={seeBlogger}
  followBlogger={seeBlogger}
  recommendContent={recommendContent}
/>)

ReactDOM.render(_w, document.getElementById('water-fall-panel'))


// 获取新老用户标识
function getIdentification() {
  if (base.LS()[postViewGuide]) {
    return
  }
  base.ajaxList.getNewGuide(1, (d) => {
    // d.result(0:需要指引；1:不需要指引)
    if (d.result) {
      let store = {}
      store[postViewGuide] = 1
      base.LS.set(store)
      return
    }

    // 禁止遮罩层后面页面滚动
    base.bodyScroll(false)
    tipGuide()
  })
}

getIdentification()

// 用户指引
function tipGuide() {
  guideEl = document.createElement('div')
  guideEl.id = 'guide-wrapper1'

  document.body.appendChild(guideEl)

  renderGuide()

  window.onresize = () => {
    renderGuide()
  }
}

// 将指引组件渲染到guide-wrapper节点中
function renderGuide() {
  let tipMessage = {
    targetElInfo,
    tip: tipInfo,
    total: tipInfo.length,
    renderGuideFun: renderGuide,
    wrapper: guideEl,
    bodyScroll: true,
    localName: postViewGuide
  }
  ReactDOM.render(<NewTipGuide {...tipMessage}/>, guideEl)
}

