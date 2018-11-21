/**
 * Created by gewangjie on 2017/5/9.
 */
import base from '../../common/baseModule'
import WaterFall from '../../components/WaterFall/WaterFall'

base.headerChange('white')
base.channel(1)

renderWF(tagId)
$('.select-style').on('click', 'li', function () {
  let $this = $(this),
    style = $this.data('style')
  $this.siblings().removeClass('current').end().addClass('current')
  renderWF(tagId, style)
})
function renderWF(tagId, style = 0) {
  let dataUrl = `/blog/classify-data?tagId=${tagId}&style=${style}`
  ReactDOM.render(<WaterFall key="waterWall"
    wfType="classify"
    noFilter={true}
    noBottom={true}
    dataUrl={dataUrl}
  />, document.getElementById('water-fall-panel'))
}