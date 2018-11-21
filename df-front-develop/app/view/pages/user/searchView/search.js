import WaterFall from '../../../components/WaterFall/WaterFall'
import base from '../../../common/baseModule'
import { SearchInputWrapper, SearchBloggerInputNull, SearchFashionInputNull } from '../../../components/SearchInput/SearchInput'

let headerEl = document.getElementById('header')
let hashObj = base.hashManage._get()
let _searchValue = hashObj.searchValue || '' // 搜索字段
let _searchType = hashObj.searchType || 'owner' // 搜索类型，默认博主
let _oldValue = '靠'
let _oldType = _searchType

let btnSearchEl = document.getElementById('btn-global-search')
btnSearchEl && btnSearchEl.parentNode.removeChild(btnSearchEl)

// 首页动画
document.addEventListener('scroll', () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop < 45) {
    // 减少回流重绘
    headerEl.classList.contains('white') && base.headerChange()
  } else {
    // 减少回流重绘
    headerEl.classList.contains('white') || base.headerChange('white')
  }
})

ReactDOM.render(
  <SearchInputWrapper type={_searchType === 'blog' ? 0 : 1}
    q={_searchValue}
    query={query}
  />,
  document.getElementById('search-wrapper')
)

// 锚点内数据先查询
query(_searchType, _searchValue)

function query(searchType, newText) {
  // 无修改跳出
  if (newText === _oldValue && searchType === _oldType) {
    return
  }

  // 修改锚点
  base.hashManage._edit('searchType', searchType)
  base.hashManage._edit('searchValue', newText)

  _oldValue = newText
  _oldType = searchType

  let _q = newText.trim()
  let _w
  let pointContent = {
    source_page: 'blogger_search_result',
    source_type: 'search_result'
  }
  let seeBlogger = {
    source_page: 'blogger_search_result',
    source_type: 'recommended_blogger'
  }
  let bloggerSearchContent = {
    source_page: 'blogger_search_result',
    search_type: 'blogger'
  }
  // 输入文本为空
  if (searchType === 'blog' && !_q) {
    _w = <SearchFashionInputNull />
  }

  if (searchType === 'owner' && !_q) {
    _w = (<SearchBloggerInputNull seeBlogger={seeBlogger}
      followBlogger={seeBlogger}
      recommendContent={{
        source_page: 'search_blogger',
        recommend_type: 'blogger'
      }}
    />)
  }

  // 输入文本不为空
  if (searchType === 'blog' && _q) {
    _w = (<WaterFall key="waterWall"
      wfType="blog"
      q={_q}
      dataUrl="/blog/query"
      pointContent={pointContent}
    />)
    sendHistory(_q)
  }

  if (searchType === 'owner' && _q) {
    seeBlogger.source_type = 'search_result'
    _w = (<WaterFall key="waterWall"
      wfType="owner"
      oneGetData={true}
      q={_q}
      subscribePos="bottom"
      dataUrl="/owner/query"
      pointContent={pointContent}
      seeBlogger={seeBlogger}
      followBlogger={pointContent}
      bloggerSearchContent={bloggerSearchContent}
    />)
  }


  document.title = _q ? `${_q}-搜索你的时尚-DeepFashion` : 'DeepFashion-每天都想刷的时尚'

  ReactDOM.render(_w, document.getElementById('water-fall-panel'))
}

// 传查询历史记录
function sendHistory(q) {
  $.ajax({
    url: `${base.baseUrl}/search/history-set?q=${q}`,
    type: 'GET'
  })
}

