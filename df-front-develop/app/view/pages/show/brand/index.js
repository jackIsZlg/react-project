import base from '../../../common/baseModule'
import BrandFilter from '../../../components/BrandFilter/index'
import WaterFall from '../../../components/WaterFall/WaterFall'

base.headerChange('white')
base.channel(4)

let searchText = ''// 当前筛选组合
base.eventCount.add(4021, {
  '品牌ID': base.getUrlStringId()
})
outFilterResult({queryType: 1, orderType: 0, bloggerId: base.getUrlStringId()})
// 筛选器回调
function outFilterResult(search) {
  searchText = formatParams(search)
  renderWF(search)
}
function formatParams(params) {
  let urlParams = ''
  Object.keys(params).forEach((key) => {
    urlParams += `${key}=${params[key]}&`
  })
  return urlParams
}
// // 渲染瀑布流
function renderWF(search) {
  let dataUrl = `/show/img/list-show-or-img?${searchText}`
  let pointContent = {
    source_page: 'brand_detail',
    source_type: 'recommended',
    pic_type: 2,
    tag: '秀场图'
  }
  let _w = (<WaterFall key="waterWall"
    wfType={search.queryType === 1 ? 'brandShow' : 'runwayDetail'}
    noResultTip="没有查询的内容"
    trackMarker='brandImg'
    noBottom={true}
    designerId={base.getUrlStringId()}
    showId={base.queryString('showId')}
    dataUrl={dataUrl}
    pointContent={pointContent}
  />)
  ReactDOM.render(_w, document.querySelector('#water-fall-panel'))
}
// 渲染筛选器
ReactDOM.render(<BrandFilter
  followId={followId}
  source='orderMeeting'
  filterChange={outFilterResult}
/>, document.getElementsByClassName('brand-filter-selection')[0])
