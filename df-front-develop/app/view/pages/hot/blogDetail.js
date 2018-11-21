import base from '../../common/baseModule'
import {Blog} from '../../components/Blog/Blog'

$('#header').addClass('white')

let wfItemData = {
  wfItemType: type
}
let detailId = base.getUrlStringId()


$('#header').css('zIndex', 999)
$('#content').append('<div class="blog-cover"></div>')
// $('.blog-cover').css('top', '80px')

function render(id) {
  ReactDOM.render(<Blog blogId={id}
    wfType='imgDetail'
    wfItemData={wfItemData}
    hidden={false}
    handleAddFolder={() => {
                          }}
  />, document.getElementsByClassName('blog-cover')[0])
}

window.onpopstate = function (e) {
  // 后退刷新
  console.log('锚点修改')
  if (e.state && e.state.blogId) {
    render(e.state.blogId)
  } else {
    location.reload()
  }
}

render(detailId)

