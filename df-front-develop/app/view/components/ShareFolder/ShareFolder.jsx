/**
 * Created by gewangjie on 2017/6/22.
 */
import base from '../../common/baseModule'
import {Icon} from '../../components/base/baseComponents'
import classNames from 'classnames'

$('#app').append('<div id="share-folder-pop-wrapper"></div>')

class ShareFolder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchUserData: [],
      seasonUserText: '',
      folderUserData: [],
      ajaxHandler: $.ajax(),
      showSearchUser: false,
      closeBody: false
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    this.init()
  }

  // 第一次渲染后调用
  componentDidMount() {
    // 记录容器节点
    this.ajaxFolderUser()
  }

  init() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
  }

  closePop() {
    this.state.closeBody && base.bodyScroll(true)
    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
  }

  showSearchUser() {
    this.setState({
      showSearchUser: true
    }, () => {
      $(this.refs['search-input']).focus()
    })
  }

  hideSearchUser() {
    this.showSearchUser && this.setState({
      seasonUserText: '',
      searchUserData: [],
      showSearchUser: false,
    })
  }

  handleInput(e) {
    let text = e.target.value
    this.setState({
      seasonUserText: text
    })
    this.ajaxSearchUser(text)
  }

  // 搜索
  ajaxSearchUser(name) {
    let self = this
    if (!name) {
      self.setState({
        searchUserData: []
      })
      return
    }
    self.state.ajaxHandler.abort()
    self.state.ajaxHandler = $.ajax({
      url: `${base.baseUrl}/users/auto`,
      type: 'GET',
      data: {
        'name': name,
        'pageSize': 5
      }
    }).done((d) => {
      if (d.success) {
        self.setState({
          searchUserData: d.result
        })
      } else {
        console.log('系统异常')
      }
    }).fail(() => {
      console.log('系统异常')
    })
  }

  // 加入共享精选集
  addToFolder(user) {
    let self = this
    base.request({
      url: `${base.baseUrl}/folder/invite/user`,
      type: 'GET',
      data: {
        'folderId': self.props.folderId,
        'userId': user.id
      }
    }).done((d) => {
      if (d.success) {
        self.updateFolderUser({
          'inviteUserId': self.props.userId,
          'inviteId': d.result,
          'userAvatar': user.avatar,
          'userName': user.name,
          'userId': user.id,
          'inviteUserName': self.props.userName,
          'inviteUserAvatar': self.props.userAvatar,
          'status': 5 // 新加入为待同意状态
        })
        df_alert({
          tipImg: user.avatar,
          mainText: '成功邀请精选集协作者',
          subText: user.name
        })
        self.hideSearchUser()
      } else {
        if (d.errorCode === 'D05') {
          new base.warningTip(self.refs['search-input'], '该用户已被邀请')
        } else {
          new base.warningTip(self.refs['search-input'], d.errorDesc)
        }
        console.log(d.errorDesc)
      }
    }).fail(() => {
      console.log('系统异常')
    })
  }

  updateFolderUser(user) {
    let _array = this.state.folderUserData
    user.userFlag = this.recogniseUser(user)

    _array.push(user)
    this.setState({
      folderUserData: _array
    })
  }

  renderSearchList() {
    return this.state.searchUserData.map((item) => {
      let _key = `search_result_${item.id}`,
        _avatarStyle = {
          'backgroundImage': `url(${item.avatar})`
        }
      return (<li key={_key}
        onClick={this.addToFolder.bind(this, item)}
        className="one-line"
      >
        <div className="avatar search-user-avatar" style={_avatarStyle}/>
        {item.name}
      </li>)
    })
  }

  // 获取精选集用户数据
  ajaxFolderUser() {
    let self = this
    base.request({
      url: `${base.baseUrl}/folder/invite/detail/${self.props.folderId}`,
      type: 'GET',
    }).done((d) => {
      if (d.success) {
        self.setState({
          folderUserData: self.reordering(d.result)
        })
      } else {
        console.log('系统异常')
      }
    }).fail(() => {
      console.log('系统异常')
    })
  }

  // 关闭当前页面
  closeCurrentPage() {
    let reloadFlag = false
    if (window.opener && (/\/users\/favorite-view/).test(window.opener.location.pathname)) {
      window.opener.location.reload()
      reloadFlag = true
    }
    df_alert({
      mainText: '已离开该共享精选集',
      cb: () => {
        if (reloadFlag) {
          window.close()
        } else {
          location.href = '/users/favorite-view'
        }
      }
    })
  }

  // 移除or离开
  deleteUser(id, index, userFlag) {
    let self = this
    if (userFlag === 2) {
      df_confirm({
        header: '离开精选集',
        content: '一旦离开该共享精选集，您将不能进入该精选集内？',
        success: () => {
          self.ajaxDeleteUser(id, index, self.closeCurrentPage)
        }
      })
    }
    if (userFlag === 3) {
      df_confirm({
        header: '移除协助者',
        content: '一旦移除协助者，他将不能进入该精选集内',
        success: () => {
          self.ajaxDeleteUser(id, index)
        }
      })
    }
  }

  ajaxDeleteUser(id, index, cb) {
    let self = this
    base.request({
      url: `${base.baseUrl}/folder/invite/remove`,
      type: 'GET',
      data: {
        'folderId': self.props.folderId,
        'inviteId': id
      }
    }).done((d) => {
      if (d.success) {
        let _array = this.state.folderUserData
        _array.splice(index, 1)
        this.setState({
          folderUserData: _array
        })
        cb && cb()
      } else {
        console.log(d.errorDesc)
      }
    }).fail(() => {
      console.log('系统异常')
    })
  }

  // 判断身份
  recogniseUser(item) {
    // 创建者
    if (!item.inviteId) {
      return 1
    }

    // 协作者本人
    if (item.userId === this.props.userId && item.inviteId) {
      return 2
    }

    // 创建者打开，其他协作者
    if (this.props.userType === 1) {
      return 3
    }

    // 协作者打开，其他协作者
    return 4
  }

  // 重新排序
  reordering(data) {
    let _array = [],
      len = data.length
    for (let i = 0; i < len; i++) {
      let item = data[i]
      item.userFlag = this.recogniseUser(item)
      // 身份为协作者自己则排在第二位
      if (item.userFlag === 2) {
        _array.splice(1, 0, item)
      } else {
        _array.push(item)
      }
    }
    return _array
  }

  renderUserList() {
    return this.state.folderUserData.map((item, i) => {
      let _key = `folder_user_${item.userId}`,
        _avatarUserStyle = {
          'backgroundImage': `url(${item.userAvatar})`
        },
        _avatarInviteStyle = {
          'backgroundImage': `url(${item.inviteUserAvatar})`
        },
        userFlag = item.userFlag
      return (<li key={_key}>
        <div className="avatar folder-user-avatar" style={_avatarUserStyle}/>
        {userFlag === 1 && <div className="creator">创建</div>}
        {userFlag === 2 && <div className="myself">自己</div>}
        {item.status === 5 && <div className="wait-agree">待同意</div>}

        <div className="one-line uname">{item.userName}</div>
        {
                    userFlag !== 1 &&
                    <div className="item-hover">
                      <div className="user-from">
                            由
                        <div className="avatar folder-from-user-avatar"
                          style={_avatarInviteStyle}
                        />
                            邀请
                      </div>

                        {userFlag === 2 &&
                        <button onClick={this.deleteUser.bind(this, item.inviteId, i, userFlag)}
                          className="btn btn-round btn-block btn-red"
                        >退出
                        </button>}

                        {userFlag === 3 &&
                        <button onClick={this.deleteUser.bind(this, item.inviteId, i, userFlag)}
                          className="btn btn-round btn-block btn-default"
                        >移除
                        </button>}

                    </div>
                }

      </li>)
    })
  }

  // 搜索模块
  renderSearchPanel() {
    return (<div className="add-user"
      onClick={(e) => {
            e.stopPropagation()
        }}
    >
      <button className="btn-add-user" onClick={this.showSearchUser.bind(this)}>
        <Icon type="follow-blogger"/>邀请用户
      </button>
      <div className={classNames('search-user-panel', {
                'hidden': !this.state.showSearchUser
            })}
      >
        <div className="search-input">
          <Icon type="search"/>
          <div className="search-input-wrapper">
            <input type="search"
              ref='search-input'
              value={this.state.seasonUserText}
              onChange={this.handleInput.bind(this)}
              placeholder="请输入用户名或手机号"
            />
          </div>
        </div>
        <ul className="search-user-list">
          {this.renderSearchList()}
        </ul>
      </div>
            </div>)
  }

  render() {
    return (<div id="share-folder-pop-panel" onClick={this.hideSearchUser.bind(this)}>
      <div className="share-folder-pop-panel">
        <i className="iconfont cancel-pop" onClick={this.closePop.bind(this)}/>
        <div className="share-folder-pop-header">
                    共享精选集管理
        </div>
        <div className="share-folder-operate">
                    协作者
          {this.props.needSearch !== false && this.renderSearchPanel()}
        </div>
        <div className="share-folder-pop-content">
          <ul className="folder-user-list">
            {this.renderUserList()}
            <li className="clearfix"/>
          </ul>
        </div>
      </div>
    </div>)
  }
}

export default ShareFolder