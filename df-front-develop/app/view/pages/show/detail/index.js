import base from '../../../common/baseModule'
import {Blog} from '../../../components/Blog/Blog'

$('#header').addClass('white')

const wfItemData = {
  wfItemType: 'runway'
}
const detailId = base.getUrlStringId()
document.oncontextmenu = () => { return false }

$('#header').css('zIndex', 999)
$('#content').append('<div class="blog-cover"></div>')
$('.blog-cover').css('paddingTop', '80px')

function render(id) {
  ReactDOM.render(<Blog blogId={id}
    wfType='imgDetail'
    wfItemData={wfItemData}
    hidden={false}
    // runwayPoint={{
    //   pic_type: 2
    // }}
    handleAddFolder={() => {
                          }}
  />, document.getElementsByClassName('blog-cover')[0])
}

window.onpopstate = (e) => {
  // 后退刷新
  console.log('锚点修改')
  if (e.state && e.state.blogId) {
    render(e.state.blogId)
  } else {
    window.location.reload()
  }
}

render(detailId)
