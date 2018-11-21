/**
 * Created by gewangjie on 2017/9/5
 */
import base from '../../common/baseModule'
import {RBFromTag} from '../../components/RecomBlogger/RecomBlogger'

/*
 * 搜索博主，空模块
 */
class SearchOwnerNull extends React.Component {
  render() {
    return (
      <div className="search-owner-null-panel">
        <span>没找到想要的博主？试试<BtnSubscribe eventId={1209} query={this.props.q}/>功能</span>
      </div>
    )
  }
}

/*
 * 搜索结果为空
 */
class SearchResultNull extends React.Component {
  render() {
    return (
      <div className="search-result-null-panel">
        <div className="tip-1">未查到找任何内容</div>
        <div className="tip-2">请确保您的输入正确或尝试输入其他关键字</div>
      </div>
    )
  }
}

/*
 * 精选列表，空模块
 */
class FolderNull extends React.Component {
  folderBottom() {
    let html = []
    let width = 288
    let text = '你精选的时尚会保存在这里'

    for (let i = 0; i < this.props.columnNum; i++) {
      let _style = {
        'paddingTop': `${width * (i % 2 === 1 ? 1.3 : 1)}px`
      }
      let _key = `no-result-${i}`
      let item = (
        <div className="water-fall-no-result-item" key={_key} style={_style}>
          <div>{text}</div>
        </div>
      )
      html.push(item)
      i === 0 && (text = '')// 首次赋值
    }
    return html
  }

  render() {
    return (
      <div className="folder-null-panel">
        {this.folderBottom()}
      </div>
    )
  }
}

/*
 * 订阅列表，空模块,(动态)
 */
class FollowBlogNull extends React.Component {
  handelClick(type) {
    let self = this
    if (type === 'import') {
      base.eventCount.add(1023, {
        '来源页面': self.props.source || '动态'
      })
      window.open('/users/ins/list')
      // location.href = '/users/ins/list';
    } else if (type === 'search') {
      base.eventCount.add(1013, {
        '来源页面': self.props.source || '动态'
      })
      window.location.href = '/search-view#/=&searchType=owner&searchValue='
    }
  }

  render() {
    return (
      <div className="follow-blog-null-panel">
        <div className="tip-panel">您暂未订阅博主</div>
        <div className="operate-panel">
          <span className="tip">您可以选择以下2种方式来增加订阅</span>
          <div className="btn-group">
            <div className="btn-item" onClick={this.handelClick.bind(this, 'import')}>
                        我的Ins关注列表
              <span>
                           读取您在instagram上的关注列表
              </span>
            </div>
            <div className="btn-item" onClick={this.handelClick.bind(this, 'search')}>
                        查找博主
              <span>
                            从instagram上寻找自己喜欢的博主
              </span>
            </div>
          </div>
        </div>
        <RBFromTag source={this.props.source} recommendContent={this.props.followBlogger} followBlogger={this.props.followBlogger} seeBlogger={this.props.seeBlogger}/>
      </div>
    )
  }
}

export {
  SearchOwnerNull,
  SearchResultNull,
  FolderNull,
  FollowBlogNull
}