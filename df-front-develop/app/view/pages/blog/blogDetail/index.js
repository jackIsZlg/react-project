import base from '../../../common/baseModule'
import {Blog} from '../../../components/Blog/Blog'

$('#header').addClass('white')

let wfItemData = {
  wfItemType: 'ins'
}
let detailId = base.getUrlStringId()
document.oncontextmenu = () => { return false }

$('#header').css('zIndex', 101)
$('#content').append('<div class="blog-cover-page"></div>')
$('.blog-cover-page').css('paddingTop', '80px')
const content = {
  source_page: 'pic_detail',
}
function render(id) {
  ReactDOM.render(<Blog blogId={id}
    wfType='imgDetail'
    wfItemData={wfItemData}
    hidden={false}
    pointContent={content}
    handleAddFolder={() => {
                          }}
  />, document.getElementsByClassName('blog-cover-page')[0])
}

window.onpopstate = () => {
  window.location.reload()
}

render(detailId)

