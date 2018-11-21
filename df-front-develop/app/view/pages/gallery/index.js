import base from '../../common/baseModule'
import TagFilter from '../../components/TagFilter/TagFilter'
import WaterFall from '../../components/WaterFall/WaterFall'
import {Pinterestsearch} from '../../components/SearchBar/index'
import {TwoLevelNavigation} from '../../components/Navigation/SecondNavigation'

base.channel(0)

ReactDOM.render(<TwoLevelNavigation channel={1}/>, document.getElementsByClassName('header-labs')[0])
base.request({
  'type': 'GET',
  'url': `${base.baseUrl}/v1/gallery/editor-auth-check`
}).done((d) => {
  base.LS.set({ isEditor: d.result })
}).fail()

let searchText = [] // 当前筛选组合
// 筛选器回调
function outFilterResult(search) {
  console.log(search)
  // 记录筛选器内容
  searchText = search
  renderWF()
}

// 渲染瀑布流
function renderWF() {
  let dataUrl = `/v1/gallery/post/list${`?${searchText.join('&')}`}`
  let pointContent = {
    source_page: 'pic_classify_result',
    source_type: 'search_result',
    pic_type: 1
  }
  let seeBlogger = {
    source_page: 'pic_classify_result',
    source_type: 'recommended_pic_blogger',
  }
  ReactDOM.render(<WaterFall key="waterWall"
    wfType="classify"
    noBottom={true}
    noResultTip="没有查询的内容"
    dataUrl={dataUrl}
    pointContent={pointContent}
    recommendContent={pointContent}
    seeBlogger={seeBlogger}
  />, document.getElementById('water-fall-panel'))
}

// 渲染筛选器
ReactDOM.render(<TagFilter
  filterChange={outFilterResult}
/>, document.getElementsByClassName('category-filter-panel')[0])
ReactDOM.render(<Pinterestsearch />, document.querySelector('#pinterest_search'))