import base from '../../../common/baseModule'
import {CategoryFilter} from '../../../components/RunWayFilter/RunWayFilter'
import WaterFall from '../../../components/WaterFall/WaterFall'

base.channel(4)
base.headerChange('black')


let $cascadeFilter = $('.btn-cascade-filter')
let $wordFilter = $('.btn-word-filter')
let $bannerRunwayImg = $('.banner-runway-img')
let q = ''
let url = `/show/search-shows?${q}`
// 默认指向级联筛选
changeFilter(1)

function changeFilter(filter) {
  if (filter === 1) {
    $cascadeFilter.addClass('current')
    $wordFilter.removeClass('current')
  } else {
    $cascadeFilter.removeClass('current')
    $wordFilter.addClass('current')
  }
  ReactDOM.render(<CategoryFilter filterChange={filterData => filterChange(filterData)} />, document.getElementById('filter-category-wrap'))
}
function filterChange(filterData) {
  q = formatParams(filterData)
  url = `/show/search-shows?${q}`
  let _w = (<WaterFall key="waterWall" wfType="runwayHomePage" noResultTip="该秀场无图片" dataUrl={url}/>)
  ReactDOM.render(_w, document.querySelector('#water-fall-panel'))
}
function formatParams(params) {
  let urlParams = ''
  Object.keys(params).forEach((key) => { 
    urlParams += `${key}=${encodeURIComponent(params[key])}&`
  })
  return urlParams
}
$cascadeFilter.click(() => {
  changeFilter(1)
})
$wordFilter.click(() => {
  changeFilter(2)
})
// 事件绑定
$bannerRunwayImg.on('click', 'a', () => {
  let _designer = $(this).data('designer')
  base.eventCount.add(1029, { '秀场品牌': _designer })
})

filterChange({})