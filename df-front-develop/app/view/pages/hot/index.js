import className from 'classnames'
import WaterFall from '../../components/WaterFall/WaterFall'
import {Pinterestsearch} from '../../components/SearchBar/index'
import {TwoLevelNavigation} from '../../components/Navigation/SecondNavigation'
import base from '../../common/baseModule'

base.channel('0')
let filterContent = ['今日最热', '本周最热', '本月最热']
let pointContent = {
  source_page: 'hot_pic',
  source_type: 'recommended',
  pic_type: 1
}
let seeBlogger = {
  source_page: 'hot_pic',
  source_type: 'recommended_pic_blogger'
}

class Filter extends React.Component {
  constructor() {
    super()
    this.state = {
      selected: 0
    }
  }

  componentDidMount() {
    this.renderWaterFall()
  }

  changeChoose(index) {
    this.setState({
      selected: index
    }, () => {
      this.renderWaterFall()
    })
  }

  renderWaterFall() {
    let {selected} = this.state
    ReactDOM.render(<WaterFall key="waterWall"
      wfType="index"
      reset={true}
      dataUrl={`/v1/blog/ins-trend?trendFilder=${selected + 1}`}
      pointContent={pointContent}
      recommendContent={pointContent}
      seeBlogger={seeBlogger}
    />, document.getElementById('water-fall-panel'))
  }

  renderTipMessage() {
    let {selected} = this.state
    pointContent.tag = filterContent[selected]
    switch (selected) {
      case 0:
        return '过去24小时内最受设计师们关注的ins好图，每日更新'
      case 1:
        return '过去7天内最受设计师们关注的INS好图，每日更新'
      case 2:
        return '过去30天内最受设计师们关注的INS好图，每日更新'
      default:
        return null
    }
  }

  render() {
    let {selected} = this.state
    return (
      <div className='filter-title'>
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
        {this.renderTipMessage()}
      </div>
    )
  }
}


// pinterest搜索
ReactDOM.render(<Pinterestsearch />, document.querySelector('#pinterest_search'))
ReactDOM.render(<TwoLevelNavigation channel={5}/>, document.getElementsByClassName('header-labs')[0])
ReactDOM.render(<Filter/>, document.getElementsByClassName('water-fall-filter')[0])

