import classNames from 'classnames'
import base from '../../common/module/baseModule'
import { Icon } from '../../components/base/baseComponents'
import MessageContent from '../../components/Message/content'
import {
  NoticeNull,
  NoticeFolder,
  NoticeHref,
  NoticeText,
  NoticeItem,
  NoticeEnd,
  NoticeTime,
  NoticeLoading
} from './NoticationItem'

const defaultImg = 'https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/notice-office-icon.jpg'
class Notification extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msgs: [],
      activities: [],
      filterType: 'notice',
      today: '', // 今日时间时间戳
      unReadNum: 0, // 未读数量(后台)
      unReadNumInList: 0, // 未读数量(列表内)
      unReadList: [], // 未读消息id列表
      noticeMsg: {}, // 消息列表
      noticeStatus: 0, // 消息加载状态，1：加载中，2：加载到最底端，3：无数据，0：加载完成\
      isLogin: false,
      isChangeFilterType: true // 是否改变消息类型
    }
    this.connectionUrl = this.props.connectionUrl || '' // 轮询 or websocket链接
    this.timer = 0
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.init()
  }
  componentDidMount() {
    $(document).click((event) => {
      const cssObjShow = {
        'margin-top': '11px',
        'max-height': '500px',
        'overflow': 'hidden',
        'transition-timing-function': 'ease-in'
      }
      const cssObjHidden = {
        'margin-top': '0',
        'max-height': '0',
        'overflow': 'hidden',
        'transition-timing-function': 'ease-in'
      }
      const isParent = this.isParent(event.target, $('.notice-pop-panel')[0])
      if (!isParent) {
        if (event.target.id === 'notice-pop-hover' || $(event.target).hasClass('icon-notification')) {
          $('.notice-pop-panel').css({ 'visibility': 'visible', ...cssObjShow })
        } else {
          let {filterType, msgs, activities} = this.state
          this.state.isChangeFilterType = true
          // !window.isBodyScroll && base.bodyScroll()
          this.getDotReadIdList(filterType === 'notice' ? msgs : activities)
          $('.notice-pop-panel').css({ 'visibility': 'hidden', ...cssObjHidden })
        }
      } else {
        $('.notice-pop-panel').css({ 'visibility': 'visible', ...cssObjShow })
      }
    })
  }

  getDotReadIdList(toReadData) {
    let idList = []
    if (!toReadData.length) {
      return
    }
    toReadData.forEach(item => item.status * 1 === 1 && idList.push(item.id))
    if (!idList.length) {
      return
    }
    this.ajaxToRead(idList.join(','), this.openHttpTimeOut.bind(this))
  }
  isParent(obj, parentObj) {
    while (obj !== undefined && obj != null && obj.tagName !== undefined && obj.tagName !== null && obj.tagName.toUpperCase() !== 'BODY') {
      if (obj === parentObj) {
        return true
      }
      obj = obj.parentNode
    }
    return false
  }
  // 初始化
  init() {
    // 添加今日板块
    let today = new Date()
    this.state.today = new Date(today.getTime())

    this.openHttpTimeOut()
    // this.createConnection();
  }

  // 建立WebSocket连接
  createConnection() {
    let self = this
    self.ws = new WebSocket(`ws://${self.connectionUrl}`)
    // 监听打开连接
    self.ws.onopen = () => {
      console.log('Connection to server opened')
    }
    // 监听断开连接
    self.ws.onclose = (e) => {
      console.log('Connection closed', e)
    }
    // 处理受到的消息
    self.ws.onmessage = (e) => {
      let data = e.data
      self.dealMsg(data)
    }
  }

  // 获取未读数量
  ajaxUnreadNum() {
    console.log('获取未读数量')
    let self = this
    let {filterType, isChangeFilterType} = self.state
    base.ajaxList.basic({
      type: 'GET',
      url: `${self.connectionUrl}`
    }, (d) => {
      let {num, type} = d.result
      if (isChangeFilterType) {
        filterType = type * 1 === 8 ? 'activity' : 'notice'
      }
      self.setState({
        filterType,
        unReadNum: num * 1,
        isLogin: true
      }, () => {
      })
      self.httpTimeOut()
    }, () => {
      self.setState({
        isLogin: false
      })
    })
  }
  // 开启http轮询
  openHttpTimeOut() {
    this.timer = 0
    this.ajaxUnreadNum()
    this.httpTimeOut()
  }
  // http轮询
  httpTimeOut() {
    let self = this
    // timer为-1时停止轮询
    if (self.timer === -1) {
      return
    }

    // 进入下一帧
    if (self.timer < 1200) {
      self.timer++
      requestAnimationFrame(() => {
        self.httpTimeOut()
      })
      return
    }
    // 600/60HZ，20s后触发查询
    self.timer = 0
    self.ajaxUnreadNum()
  }

  // 获取通知消息
  ajaxNoticeMsg(type) {
    let {filterType, activities, msgs} = this.state
    let toReadData = filterType === 'notice' ? activities : msgs
    this.getDotReadIdList(toReadData)
    base.ajaxList.basicLogin({
      'type': 'GET',
      'url': `${base.baseUrl}/v4/user/notify/list?type=${type === 'notice' ? 4 : 8}`,
      'data': {
        pageSize: 10
      }
    }, (data) => {
      let {resultList} = data.result
      type === 'notice'
        ? this.setState({ msgs: resultList })
        : this.setState({ activities: resultList })
    })
  }

  jumpToLand(content, id, type) {
    this.ajaxToRead(id, this.ajaxNoticeMsg(this.state.filterType))
    // 通知
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
      return window.open(href, '_target')
    } 
    return false
  }

  // 时间对比，与今天
  compareToday(time) {
    let timestamp = new Date(time.split('.')[0].replace(/-/g, '/'))
    let diff = (this.state.today - timestamp.getTime()) / 1000
    let _text = ''

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

  // 全部标记已读
  handleAllRead() {
    let self = this
    // 不可点击状态
    if (!this.boolAllReadClick()) {
      return
    }
    base.ajaxList.basicLogin({
      'url': `${base.baseUrl}/v1/user/notify/set-all-read`,
      'type': 'POST'
    }, () => {
      let {noticeMsg} = self.state
      for (let time in noticeMsg) {
        noticeMsg[time].forEach((msg) => {
          msg.status = 2
        })
      }
      self.setState({
        noticeMsg,
        unReadList: [],
        unReadNumInList: 0,
        unReadNum: 0
      })
    })
  }

  // 全部标记是否可点击
  boolAllReadClick() {
    return this.state.noticeMsg !== 4 && this.state.unReadNumInList > 0
  }

  // 标记已读消息
  ajaxToRead(id, cb) {
    base.ajaxList.basic({
      'dataType': 'json',
      'type': 'POST',
      'url': `${base.baseUrl}/v4/user/notify/set-read`,
      'data': {
        idList: id
      }
    }, (data) => {
      data.success && cb && cb()
    })
  }
  
  // 消息列表无数据则先获取数据
  isNoticeNull() {
    return JSON.stringify(this.state.noticeMsg) === '{}'
  }
  // 鼠标移动到icon就获取数据
  handleMouseEnter() {
    this.state.isChangeFilterType = false
    // window.isBodyScroll && base.bodyScroll(false)
    if (this.isNoticeNull()) {
      this.ajaxNoticeMsg(this.state.filterType)
      return
    }

    // 后台返回未读数大于本地未读数，获取新数据
    if (this.state.unReadNum > this.state.unReadNumInList) {
      this.ajaxUnreadNoticeMsg()
    }
  }

  changeFilterType(filterType) {
    this.setState({filterType}, () => this.ajaxNoticeMsg(filterType))
  }
  renderEmpty() {
    return (
      <div className='empty-content'>暂无{this.state.filterType === 'notice' ? '通知' : '动态'}</div>
    )
  }
  renderNoticeContent() {
    const { msgs } = this.state
    if (!msgs.length) {
      return this.renderEmpty()
    }
    return (
      msgs.map((msg, index) => {
        let {text} = this.compareToday(msg.sendTime || msg.createdTime)
        return (
          <div key={index} className='item' onClick={this.jumpToLand.bind(this, msg.content, msg.id, msg.type)}>
            <div className='item-wrap'>
              <div style={{ position: 'relative'}}>
                {msg.status === 1 ? <div className='dot-unread' /> : null}
                <img src={msg.userAvatar || defaultImg} alt='img' className='item-avar' />
              </div>
              <div className='item-content'>
                <div className='notice-top-wrap'>
                  <div className='item-name'>{msg.userName || 'DeepFashion'}</div>
                  <div className='item-date'>{text}</div>
                </div>
                <div className='item-msg'>
                  <MessageContent content={msg.content} type={msg.type} />
                </div>
              </div>
            </div>
            <div className='item-img-wrap'>
              {msg.content.imgUrl ?
                <img src={msg.content.imgUrl} alt='img' className='item-img' />
                : null
              }
            </div>
            {index === msgs.length - 1 ? null : <div className='line' /> }
          </div>
        )
      })
    )
  }
  renderActivityContent() {
    const { activities } = this.state
    if (!activities.length) {
      return this.renderEmpty()
    }
    return (
      activities.map((msg, index) => {
        let {text} = this.compareToday(msg.sendTime || msg.createdTime)
        return (
          <div key={`activity-${index}`} className='item' onClick={this.jumpToLand.bind(this, msg.content, msg.id, msg.type)}>
            <div className='item-activity-wrap'>
              <div className='item-son-wrap'>
                <div style={{ position: 'relative'}}>
                  {msg.status === 1 ? <div className='dot-unread' /> : null}
                  <img src={msg.userAvatar || defaultImg} alt='img' className='item-avar' />
                </div>
                <div className='item-content'>
                  <div className='item-msg'><MessageContent content={msg.content} type={msg.type} /></div>
                </div>
                {msg.content.imgUrl ? <div className='item-activity-img'><img src={msg.content.imgUrl} alt='img' className='item-img' />  </div> : null}
              </div>
              <div className='item-activity-date'>
                {text}
              </div>
            </div>
            {index === activities.length - 1 ? null : <div className='line'/> }
          </div>
        )
      })
    )
  }
  renderContent() {
    const { filterType } = this.state
    return filterType === 'notice' ? this.renderNoticeContent() : this.renderActivityContent()
  }

  seeAll() {
    let {filterType, msgs, activities} = this.state
    this.getDotReadIdList(filterType === 'notice' ? msgs : activities)
    window.location.href = `/message/index?type=${filterType}`
  }
  render() {
    let { unReadNum, isLogin, filterType} = this.state
    return (
      isLogin &&
      <div className="notice-pop-hover">
        <div id='notice-pop-hover' className={classNames('notice-pop-icon header-icon', {'show': unReadNum})} onClick={this.handleMouseEnter.bind(this)}>
          <Icon id='notice-pop-hover' type="notification" title='通知'/><span id='notice-pop-hover'>{unReadNum > 99 ? '99+' : unReadNum}</span>
        </div>
        <div className="notice-pop-panel" id='notice-pop-panel'>
          <div className='tab-filter'>
            <li className={filterType === 'notice' ? 'active' : 'notice'} onClick={this.changeFilterType.bind(this, 'notice')}>通知</li>
            <li className={filterType === 'activity' ? 'active' : 'activity'} onClick={this.changeFilterType.bind(this, 'activity')}>动态</li>
          </div>
          <div className="notice-pop-hd"/>
          <div ref="notice-list" className="notice-pop-list" >
            {this.renderContent()}
          </div>
          <div className="notice-pop-ft" onClick={this.seeAll.bind(this)}>查看全部</div>
        </div>
      </div>
    )
  }
}

export default Notification

