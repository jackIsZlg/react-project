import base from '../../../common/baseModule'
import MessageContent from '../../../components/Message/content'

base.channel(-1)
base.headerChange('white')
const defaultImg = 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/notice-office-icon.jpg'

class MessageIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      today: new Date(new Date().getTime()),
      liType: base.queryString('type') || 'notice',
      msgs: [],
      activities: []
    }
  }
  componentWillMount() {
    this.getMsg(this.state.liType)
  }
  getMsg(liType) {
    base.ajaxList.basic({
      type: 'GET',
      url: `${base.baseUrl}/v4/user/notify/list?pageSize=1000&type=${liType === 'notice' ? 4 : 8}`
    }, (data) => {
      if (data.success) {
        liType === 'notice'
          ? this.setState({ msgs: data.result.resultList })
          : this.setState({activities: data.result.resultList})
      }
    })
  }
  changeType(liType) {
    this.setState({ liType}, () => this.getMsg(liType))
  }
  // 时间对比，与今天
  compareToday(time) {
    let timestamp = new Date(time.split('.')[0].replace(/-/g, '/'))
    let diff = (this.state.today - timestamp.getTime()) / 1000
    let _text = ''
    console.log('diff', this.state.today.getHours(), this.state.today.getMinutes(), timestamp.getHours(), timestamp.getMinutes())
    if (diff < 120) {
      _text = '刚刚'
    } else if (diff < 3600) {
      _text = `${Math.floor(diff / 60)}分钟前`
    } else if (diff < 86400) {
      _text = `${Math.floor(diff / 3600)}小时前`
    } else {
      _text = timestamp.getFullYear() === this.state.today.getFullYear()
        ? `${timestamp.getMonth() + 1}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes() > 9 ? timestamp.getMinutes() : `0${timestamp.getMinutes()}`}`
        : `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}`
    }

    return {
      text: _text,
      key: time.split(' ')[0]
    }
  }
  jumpToLand(content, id, type) {
    base.ajaxList.basic({
      'dataType': 'json',
      'type': 'POST',
      'url': `${base.baseUrl}/v4/user/notify/set-read`,
      'data': {
        idList: id
      }
    }, (data) => {
      if (data.success) {
        this.getMsg(this.state.liType)
      }
    })
    // 公告
    const { landType, otherClickJson } = content
    if (type === 1) {
      let href = ''
      switch (landType) {
        case 1: href = `${base.baseUrl}/owner/${otherClickJson.bloggerId}`; break
        case 2: href = `${base.baseUrl}/folder/public/${otherClickJson.folderId}`; break
        case 3: href = `${base.baseUrl}/blog/detail/${otherClickJson.postId}`; break
        case 4: href = `${base.baseUrl}/show/designer/${otherClickJson.designerId}?showId=${otherClickJson.showId}`; break
        case 5: href = `${otherClickJson.url}`; break
        case 6: href = `${base.baseUrl}/ordering/index?season=${otherClickJson.season}&brand=${otherClickJson.brand}&category=${otherClickJson.category}`; break
        case 7: href = `${otherClickJson.url}`; break
        default: href = `${otherClickJson.url}`; break
      }
      return window.open(href, '_target')
    } 
    // 通知 
    if (type === 4) {
      let href = ''
      switch (landType) {
        case 31: href = `${base.baseUrl}/users/ins/list`; break
        case 32: href = `${base.baseUrl}/owner/${otherClickJson.bloggerId}`; break
        case 33: href = `${base.baseUrl}/users/invite/view`; break
        default: href = `${otherClickJson.url}`; break
      }
      return window.open(href, '_target')
    } 
    // 动态
    if (type === 8) {
      let href = ''
      switch (landType) {
        case 11: href = `${base.baseUrl}/folder/invite/confirm/${otherClickJson.inviteId}?messageType=event&eventId=2&showText=0&inviter=${otherClickJson.userId}`; break
        case 13: href = `${base.baseUrl}/folder/public/${otherClickJson.folderId}`; break
        default: href = `${base.baseUrl}/users/favorite-content/${otherClickJson.folderId}`; break
      }
      console.log('herf', href)
      return window.open(href, '_target')
    } 
    return false
  }
  renderContent() {
    const { msgs, activities, liType } = this.state
    const realMsg = liType === 'notice' ? msgs : activities
    if ((liType === 'notice' && !msgs.length) || (liType !== 'notice' && !activities.length)) {
      return this.renderEmpty()
    }
    return (
      realMsg.map((msg, index) => {
        let {text} = this.compareToday(msg.sendTime || msg.createdTime)
        console.log(index, msg.length)
        return (
          <div key={liType + index} className='item' onClick={this.jumpToLand.bind(this, msg.content, msg.id, msg.type)}>
            <div className='item-wrap'>
              <div style={{ position: 'relative'}}>
                {msg.status === 1 ? <div className='dot-unread' /> : null}
                <img src={msg.userAvatar || defaultImg} alt='img' className='item-avar' />
              </div>
              <div className='item-content'>
                <div className='item-name'>{msg.userName || 'DeepFashion'}</div>
                <div className='item-msg'>
                  <MessageContent content={msg.content} type={msg.type} />
                </div>
              </div>
              <div className='item-date'>
                {text}
              </div>
            </div>
            <div className='item-img-wrap'>
              {msg.content.imgUrl ?
                <img src={msg.content.imgUrl} alt='img' className='item-img' />
                : null
              }
            </div>
            {index === msgs.length - 1 ? null : <div className='line' style={{marginTop: msg.content.imgUrl ? '30px' : 0}} /> }
          </div>
        )
      })
    )
  }
  renderEmpty() {
    return (
      <div className='empty-text'>暂无{this.state.liType === 'notice' ? '通知' : '动态'}</div>
    )
  }
  render() {
    const {liType} = this.state
    return (
      <div className="container">
        <div className="msg-title">我的消息</div>
        <div className="msg-content">
          <div className="msg-left">
            <li className={liType === 'notice' ? 'active' : 'notice'} onClick={this.changeType.bind(this, 'notice')}>通知</li>
            <li className={liType === 'activity' ? 'active' : 'activity'} onClick={this.changeType.bind(this, 'activity')}>动态</li>
          </div>
          <div className="msg-right">
            {this.renderContent() }
          </div>
        </div>  
      </div> 
    )
  }
}


ReactDOM.render(
  <MessageIndex />,
  document.getElementById('msg-body')
)