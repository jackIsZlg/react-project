import base from '../../common/baseModule'
import OrderingFilter from '../../components/OrderingFilter/OrderingFilter'
import WaterFall from '../../components/WaterFall/WaterFall'

base.headerChange('white')
base.channel(5)

let searchText = [] // 当前筛选组合


// 筛选器回调
function outFilterResult(search) {
  // 记录筛选器内容
  searchText = search

  renderWF()
}

// // 渲染瀑布流
function renderWF() {
  // let search = searchText.concat([`sort=${sortType}`]);
  let dataUrl = `/ordering/getOrderingCollections?${searchText}`
  ReactDOM.render(<WaterFall key="waterWall"
    wfType="orderFolder"
    noBottom={true}
    noResultTip="没有查询的内容"
    loadType={2}
    dataUrl={dataUrl}
  />, document.getElementById('water-fall-panel'))
}

// 渲染筛选器
ReactDOM.render(<OrderingFilter
  outFilterResult={outFilterResult}
/>, document.getElementsByClassName('category-filter-selection')[0])