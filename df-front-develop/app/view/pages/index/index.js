import className from 'classnames'
import base from '../../common/baseModule'
import {Pinterestsearch} from '../../components/SearchBar/index'
import WaterFall from '../../components/WaterFall/WaterFall'
import { TwoLevelNavigation } from '../../components/Navigation/SecondNavigation'

let filterContent = ['全部', '日系', '韩系', '欧美', '女装', '男装']

base.channel(0)
// 瀑布流
class WaterFallQuery extends React.Component {
  constructor() {
    super()
    this.state = {
      selected: 0,
      url: '/v1/blog/hot'
    }
  }

  changeChoose(index) {
    this.setState({
      selected: index
    }, () => {
      this.categoryFilter()
    })
  }

  // 热门筛选男女装
  categoryFilter() {
    let { url, selected } = this.state
    console.log(selected, filterContent[selected])
    if (selected === 0) {
      url = '/v1/blog/hot'
    } else if (selected === 1 || selected === 2 || selected === 3) {
      url = `/v1/blog/hot/search?clothingType=&region=${filterContent[selected]}`
    } else {
      url = `/v1/blog/hot/search?clothingType=${filterContent[selected]}&region=`
    }
    this.setState({ url })
  }

  render() {
    let { url, selected } = this.state
    let recommendContent = {
      source_page: 'index',
      recommend_type: 'picture'
    }
    let seeBlogger = {
      source_page: 'index',
      source_type: 'recommended_pic_blogger'
    }
    let pointContent = {
      source_page: 'index',
      source_type: 'recommended',
      tag: filterContent[selected]
    }
    return (
      <div>
        <div className="filter-title">
          <ul className="filter-type">
            {
            filterContent.map((item, index) => (
              <li className={className('filter-type-item', {
                'selected': selected === index
              })}
                onClick={this.changeChoose.bind(this, index)}
              >{item}
              </li>))
          }
          </ul>
        </div>
        <div id="water-fall-panel">
          <WaterFall key="waterWall"
            wfType="index"
            dataUrl={url}
            pointContent={pointContent}
            recommendContent={recommendContent}
            seeBlogger={seeBlogger}
          />
        </div>
      </div>
    )
  }
}
ReactDOM.render(<Pinterestsearch pointContent={{source_page: 'discover'}}/>, document.querySelector('#pinterest_search'))
ReactDOM.render(<TwoLevelNavigation channel={4}/>, document.getElementsByClassName('header-labs')[0])
ReactDOM.render(<WaterFallQuery />, document.querySelector('#index-waterfall-query'))