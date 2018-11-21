import base from '../../common/baseModule'
import OrderingFilter from '../../components/OrderingFilter/OrderingFilter'
import WaterFall from '../../components/WaterFall/WaterFall'

base.headerChange('white')
base.channel(5)
document.oncontextmenu = () => { return false }

let searchText = [] // 当前筛选组合
let pointContent = {
  source_page: 'order_conference_detail',
  source_type: 'search_result',
  pic_type: 3
}

// 排序方式
// let sortType = 1,
//     sortEl = `<div class="btn btn-wf-sort hidden" data-sort="1" data-change-sort="2">
//          <div class="move-pane">
//             <div class="white-text">默认</div>
//             <div class="red-text">默认</div>
//           </div>
//     </div>
//     <div class="btn btn-wf-sort hidden" data-sort="2" data-change-sort="1">
//         <div class="move-pane">
//             <div class="white-text">时间</div>
//             <div class="red-text">时间</div>
//           </div>
//     </div>`;
//
// $('#df-side-wrapper').append(sortEl);

// changeSort();

// 选择排序方式
// function changeSort(sort = 1) {
//     sortType = sort;
//     $('.btn-wf-sort').addClass('hidden');
//     $(`[data-sort="${sortType}"]`).removeClass('hidden');
// }

// $('.btn-wf-sort').click(function () {
//     let $this = $(this),
//         sort = $this.data('change-sort');
//
//     changeSort(sort);
//
//     renderWF();
// });

// 筛选器回调
function outFilterResult(search) {
  // console.log(search);
  pointContent.tag = search.order === 'time' ? '最新' : '浏览'

  // 记录筛选器内容
  searchText = base.objToSearch(search)

  // 默认排序方式
  // changeSort();

  renderWF()
}

// // 渲染瀑布流
function renderWF() {
  // let search = searchText.concat([`sort=${sortType}`]);
  let dataUrl = `/ordering/getOrderingImage?${searchText}`
  // let dataUrl = `/ordering/getOrderingImage?season=2019春夏&brand=PRADA`;
  ReactDOM.render(<WaterFall key="waterWall"
    wfType="orderMeeting"
    noBottom={true}
    noResultTip="没有查询的内容"
    loadType={2}
    dataUrl={dataUrl}
    pointContent={pointContent}
  />, document.getElementById('water-fall-panel'))
}

// 渲染筛选器
ReactDOM.render(<OrderingFilter
  source='orderMeeting'
  pointContent={pointContent}
  outFilterResult={outFilterResult}
/>, document.getElementsByClassName('category-filter-selection')[0])
