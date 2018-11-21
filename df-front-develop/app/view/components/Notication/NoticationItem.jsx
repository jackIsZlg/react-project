import classNames from 'classnames'
import base from '../../common/baseModule'

const defaultImg = 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/notice-office-icon.jpg'

// 系统默认图片
class NoticeImg extends React.Component {
  render() {
    let bgStyle = {
      'backgroundImage': `url(${base.ossImg(this.props.img || defaultImg, 60)})`
    }
    return <div className="notice-img" style={bgStyle}/>
  }
}

NoticeImg.defaultProps = {
  img: defaultImg
}

// 空数据
class NoticeNull extends React.Component {
  render() {
    return (<div className="notice-null">暂无消息 </div>)
  }
}

// 精选集操作
class NoticeFolder extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.props.data
  }

  noticeStatus() {
    let arrayBtn = []
    if (this.state.status === 1) {
      arrayBtn.push(<button className="btn-success" key="btn-success" onClick={this.handleAgree.bind(this)} >接受邀请 </button>)
      arrayBtn.push(<button className="btn-cancel" key="btn-cancel" onClick={this.handleRefuse.bind(this)} >取消 </button>)
      return arrayBtn
    }

    let obj = {
      8: '已接受',
      4: '已拒绝'
    }

    return obj[this.state.status]
  }

  // 接受邀请
  handleAgree() {
    let self = this
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/user/notify/agree?id=${self.state.id}`
    }).done((d) => {
      // 异常处理
      if (!d.success) {
        return
      }
      self.setState({
        status: 8
      })
    }).fail()
  }

  // 拒绝邀请
  handleRefuse() {
    let self = this
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/user/notify/refuse?id=${self.state.id}`
    }).done((d) => {
      // 异常处理
      if (!d.success) {
        return
      }
      self.setState({
        status: 4
      })
    }).fail()
  }

  render() {
    return (
      <div className="notice folder">
        <NoticeImg img={this.state.userAvatar}/>
        <div className="notice-r-pane">
          <div>{this.state.content}</div>
          <div className="btn-group">
            {this.noticeStatus()}
          </div>
        </div>
      </div>)
  }
}

// 带链接
class NoticeHref extends React.Component {
  createMarkup() {
    return {__html: this.props.data.content}
  }

  render() {
    return (
      <div className="notice notice-href">
        <NoticeImg/>
        <div className="notice-r-pane" dangerouslySetInnerHTML={this.createMarkup()}/>
      </div>)
  }
}

// 纯文本显示
class NoticeText extends React.Component {
  render() {
    return (
      <div className="notice text">
        <NoticeImg/>
        <div className="notice-r-pane">
          {this.props.data.content}
        </div>
      </div>)
  }
}

// 新版通知单元
class NoticeItem extends React.Component {
  createMarkup() {
    return {__html: this.props.data.content}
  }

  handleClick() {
    if (this.props.data.status !== 1) {
      return
    }
    this.props.handleToRead()
  }

  render() {
    return (
      <div className={classNames('notice notice-href', { 'un-read': this.props.data.status === 1 })}
        onClick={this.handleClick.bind(this)}
      >
        <NoticeImg img={this.props.data.userAvatar}/>
        <div className="notice-r-pane">
          <div className="outer">
            <div className="inner" dangerouslySetInnerHTML={this.createMarkup()}/>
          </div>
        </div>
      </div>)
  }
}

// 最后一条
class NoticeEnd extends React.Component {
  render() {
    return (<div className="notice-end">暂无更多消息 </div>)
  }
}

// 时间分割
class NoticeTime extends React.Component {
  render() {
    return (
      <div className="timeline">
        {this.props.data.content}
      </div>)
  }
}

// loading
class NoticeLoading extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="line"/>
        <div className="line"/>
        <div className="line"/>
      </div>)
  }
}


export {
  NoticeNull,
  NoticeFolder,
  NoticeHref,
  NoticeText,
  NoticeItem,
  NoticeEnd,
  NoticeTime,
  NoticeLoading
}