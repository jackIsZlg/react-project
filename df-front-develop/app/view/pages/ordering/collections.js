import base from '../../common/baseModule'
import {CommonFilter} from '../../components/CommonFilter'
import WaterFall from '../../components/WaterFall/WaterFall'
import {TrendNavigation} from '../../components/Navigation/SecondNavigation'

base.headerChange('white')
base.channel(5)
base.channel('trend')

let searchText = '' // 当前筛选组合
outFilterResult({order: 'time'})
// 筛选器回调
function outFilterResult(search) {
  searchText = formatParams(search)
  renderWF()
}
function formatParams(params) {
  let urlParams = ''
  Object.keys(params).forEach((key) => {
    urlParams += `${key}=${params[key] || ''}&`
  })
  return urlParams
}
// // 渲染瀑布流
function renderWF() {
  let dataUrl = `/ordering/getOrderingCollections?${searchText}`
  ReactDOM.render(<WaterFall key="waterWall"
    wfType="orderFolder"
    noBottom={true}
    noResultTip="没有查询的内容"
    loadType={2}
    dataUrl={dataUrl}
  />, document.getElementById('water-fall-panel'))
}

ReactDOM.render(<TrendNavigation channel={5}/>, document.getElementsByClassName('common-title')[0])

// 渲染筛选器
ReactDOM.render(<CommonFilter
  source='ordering'
  tagsUrl='/ordering/list-season-and-brand'
  filterChange={outFilterResult}
/>, document.getElementsByClassName('common-filter-selection')[0])
