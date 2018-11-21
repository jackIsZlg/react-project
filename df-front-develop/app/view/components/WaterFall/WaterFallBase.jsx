import className from 'classnames'
import base from '../../common/baseModule'
import { Icon } from '../../components/base/baseComponents'
import {
  SearchResultNull,
  FolderNull,
  FollowBlogNull
} from './WFNoResult'

/*
 * 数据请求动画组件
 */
class GetData extends React.Component {
  render() {
    return (
      <div className="water-fall-loading">
        <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/loading2.gif" alt=""/>
      </div>
    )
  }
}

/*
 * 瀑布流数据请求筛选
 */
class FilterPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: props.order,
      sortList: props.sortList || { 1: '最热', 0: '最新' }
    }
  }

  componentWillReceiveProps(nextProps) {
    let {order} = this.state 
    if (nextProps.order !== this.props.order) {
      order = nextProps.order || 0
      this.setState({
        order
      })
    }
  }

  handleClick(order) {
    this.setState({
      order
    })
    this.props.handleClick(order)
  }

  render() {
    let self = this
    let _filter_html = []
    let { sortList } = this.state
    for (let i in sortList) {
      let _item = sortList[i]
      let _key = `filter-${i}`
      let liHtml = (
        <li
          className={self.state.order * 1 === i * 1 ? 'current' : ''}
          onClick={self.handleClick.bind(self, i)}
          key={_key}
        >{_item}
        </li>
      )
      _filter_html.push(liHtml)
    }
    return (
      <ul className="filter-tab float-r">
        {_filter_html}
      </ul>
    )
  }
}

/*
 * 加载中
 */
class Loading extends React.Component {
  render() {
    return (
      <div className={className('water-fall-bottom', { 'white': this.props.wfType === 'runwayHomePage' })}>{this.props.title || '加载中...'}
      </div>
    )
  }
}

/*
 * 加载更多
 */
class LoadMore extends React.Component {
  render() {
    return (
      <div className="load-more" onClick={this.props.autoLoad}>
        加载更多
      </div>
    )
  }
}

/*
 * 瀑布流触底
 */
class ToBottom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wfType: {
        history: {
          text: ''
        },
        default: {
          text: <div className="water-fall-over">END</div>
        }
      }
    }
  }

  render() {
    let _text = this.state.wfType[this.props.wfType] ?
      this.state.wfType[this.props.wfType].text : this.state.wfType.default.text
    return <div className="water-fall-bottom">{_text}</div>
  }
}

/*
 * 置顶
 */
class ToTop extends React.Component {
  toTop() {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.props.callBack && this.props.callBack()
  }

  render() {
    let _className = `btn btn-to-top ${this.props.show ? 'show' : ''}`
    return (
      <div className={_className} onClick={this.toTop.bind(this)}>
        <div className="move-pane">
          <div className="white-text">
            <Icon type="to-top" />
          </div>
          <div className="red-text">
            <Icon type="to-top" />
          </div>
        </div>
      </div>
    )
  }
}

/*
 * 时间分割
 */
class TimeLine extends React.Component {
  dealTime() {
    let time = new Date(this.props.data.postTime.split('.')[0].replace(/\\-/g, '/'))
    let diff = (this.props.today - time.getTime()) / 1000
    let _className = ''
    if (diff < 0) {
      _className = 'time-line-today'
    } else if (diff < 86400) {
      _className = 'time-line-yesterday'
    } else if (diff < 604800) {
      _className = 'time-line-week'
    } else {
      _className = 'time-line-week-ago'
    }
    return _className
  }

  render() {
    let _className = `water-fall-item time-line-history ${this.dealTime()}`
    let _wfItemStyle = base.setDivStyle(this.props.data)
    if (this.props.type === 'followBlog') {
      return (
        <div className="water-fall-item time-line-follow"
          style={_wfItemStyle}
        >
          <span>{this.props.data.time}</span>
        </div>
      )
    }
    return (
      <div className={_className}
        style={_wfItemStyle}
        data-history-time={this.props.data.postTime.split(' ')[0]}
      >
        <span />{this.props.data.postTime.split(' ')[0]}
      </div>
    )
  }
}

/*
 * 足迹结束
 */
class FootTimeLine extends React.Component {
  render() {
    let _wfItemStyle = base.setDivStyle(this.props.data)
    return (
      <div className="water-fall-item time-line-history time-line-history-last"
        style={_wfItemStyle}
      >
        <span />已到最后，只保存最近1个月的时尚足迹
      </div>
    )
  }
}

/*
 * 瀑布流查询无数据
 */
class NoResult extends React.Component {
  constructor(props) {
    super(props)
    this.noResult = {
      blog: {
        text: <SearchResultNull />
      },
      owner: {
        text: <SearchResultNull />
      },
      folder: {
        text: <FolderNull columnNum={this.props.columnNum} />
      },
      followBlog: {
        text: <FollowBlogNull source="动态-空" followBlogger={props.followBlogger} seeBlogger={props.seeBlogger} />
      },
      followOwner: {
        text: <FollowBlogNull source="订阅列表-空" seeBlogger={props.seeBlogger} />
      }
    }
  }

  selectRender() {
    const { noResultTip, wfType } = this.props
    if (noResultTip) {
      return noResultTip
    }

    if (this.noResult.hasOwnProperty(wfType)) {
      return this.noResult[wfType].text
    }
    return '暂无数据'
  }

  render() {
    return <div className="water-fall-no-result">{this.selectRender()}</div>
  }
}

export {
  GetData,
  FilterPanel,
  LoadMore,
  NoResult,
  Loading,
  ToBottom,
  ToTop,
  TimeLine,
  FootTimeLine
}