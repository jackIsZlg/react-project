import base from '../../../common/baseModule'
import WaterFall from '../../../components/WaterFall/WaterFall'

base.headerChange('white')

ReactDOM.render(<WaterFall key="waterWall"
  wfType="article"
  dataUrl="/article/list-data"
/>, document.querySelector('.blog-list-wrapper'))
