import base from '../../common/baseModule'
import { CommonFilter } from '../../components/CommonFilter'
import WaterFall from '../../components/WaterFall/WaterFall'
import {TrendNavigation} from '../../components/Navigation/SecondNavigation'

base.headerChange('white')
base.channel(6)
base.channel('trend')
outFilterResult({order: 'time'})
function formatParams(params) {
  let urlParams = ''
  Object.keys(params).forEach((key) => {
    urlParams += `${key}=${params[key] || ''}&`
  })
  return urlParams
}
// 筛选器回调
function outFilterResult(search = '', flag = false) {
  const searchUrl = formatParams(search)
  // 记录筛选器内容
  let url = flag ? `/market/get-images?${searchUrl}` : `/market/get-collections?${searchUrl}`
  let wfType = flag ? 'brandImage' : 'brandSelected'
  ReactDOM.render(<WaterFall key="waterWall"
    wfType={wfType}
    noBottom={true}
    noResultTip="没有查询的内容"
    loadType={2}
    dataUrl={url}
  />, document.getElementById('water-fall-panel'))
}
ReactDOM.render(<TrendNavigation channel={6}/>, document.getElementsByClassName('common-title')[0])

// 渲染筛选器
ReactDOM.render(<CommonFilter
  source='market'
  tagsUrl='/market/get-filter-conditions'
  filterChange={outFilterResult}
/>, document.getElementsByClassName('common-filter-selection')[0])