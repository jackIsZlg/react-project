import base from '../../common/module/baseModule'
import UploadImageButton from '../UploadImageButton/UploadImageButton'
import Search from '../../components/Search/Search'

class Trend extends React.Component {
  render() {
    return (
      <div className='channel-trend'>
        趋势beta
        <div className="channel-trend-down">
          <ul>
            <li className="channel-5">订货会</li>
            <li className="channel-6">品牌精选</li>
          </ul>
        </div>
      </div>
    )
  }
}

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      name: '',
      avatar: '',
      isLogin: 0
    }
  }

  componentDidMount() {
    let searchWrapper = document.getElementById('btn-search')
    ReactDOM.render(<Search/>, searchWrapper)
    this.judgeIsLogin()
  }
  onMenuMouseEnter() {
    const cssObjHidden = {
      'margin-top': '0',
      'max-height': '0',
      'overflow': 'hidden',
      'transition-timing-function': 'ease-in'
    }
    $('.notice-pop-panel').css({ 'visibility': 'visible', ...cssObjHidden })
  }

  // 获取用户信息
  getUserInfo() {
    let self = this
    base.ajaxList.getUserInfo((d) => {
      d.result.isGet = true
      d.result.isLogin = 2
      self.setState(d.result, () => {
        // 清除本地信息，并保存新用户信息
        base.LS.clear()
        base.LS.set({
          ...d.result,
          timeStamp: new Date().getTime() / 1000,
          version: base.version
        })
        self.ajaxZhuge()
        self.gio()
      })
    })
  }

  
  init() {
    const {name, userId, avatar, timeStamp, version} = base.LS()
    let currentTime = new Date().getTime() / 1000
    // 本地local有用户信息，优先显示本地信息（不考虑登录状态）
    if (userId && (version === base.version) && (currentTime - timeStamp * 1) < 1800) {
      this.setState({
        userId,
        name,
        avatar,
        isLogin: 2
      }, this.ajaxZhuge)
    } else {
      this.getUserInfo()
    }
    // 渲染右上角通知栏和搜索栏
    base.loadFunctionColumn()
    this.judgeIsWhiteList()
  }

  judgeIsWhiteList() {
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/market/auth-check`
    }).done((data) => {
      if (!data.result) {
        return
      }
      let channel = document.querySelector('#channel')
      let trend = document.querySelector('.channel-trend')
      if (!!trend) {
        return
      }
      let title = document.createElement('li')
      title.classList.add('channel-trend')
      ReactDOM.render(<Trend/>, title)
      channel.appendChild(title)
    })
  }

  judgeIsLogin() {
    let self = this
    base.request({
      'type': 'GET',
      'url': `${base.baseUrl}/users/check-login`
    }).done((d) => {
      d.result ? self.init() : self.setState({
        isLogin: 1
      })
    }).fail(() => {
      this.setState({
        isLogin: 1
      })
    })
  }


  // 诸葛IO添加用户信息
  ajaxZhuge() {
    const {name, userId} = this.state
    window.zhuge && zhuge.identify(userId, {
      name
    })
  }
  // GIO添加用户信息
  gio() {
    console.log('userId', this.state.userId)
    window.gio('setUserId', this.state.userId)
  }

  // 用户登陆
  login() {
    base.login(() => {
      this.init()
      base.loadFunctionColumn()
    })
    base.eventCount.add(1064)
  }

  logout() {
    base.ajaxList.logout()
  }

  openNewPage(url) {
    base.eventCount.add('1075', {
      '用户ID或IP': base.LS().userId
    })
    window.location.href = base.baseUrl + url
  }

  renderUploadBtn() {
    let {isLogin} = this.state
    let uploadWrapper = document.getElementById('upload-img')
    !!uploadWrapper && ReactDOM.render(<UploadImageButton isLogin={isLogin} loginSuccess={this.init.bind(this)}/>, uploadWrapper)
  }

  renderLoginContent() {
    let {avatar, name, isLogin} = this.state
    let bgAvatar = {backgroundImage: `url(${base.ossImg(avatar, 36)})`}

    if (isLogin === 1) {
      return (
        <div>
          <button id="btn-login" onClick={this.login.bind(this)}>登录/注册</button>
        </div>
      )
    }

    if (isLogin === 2) {
      return (
        <div className="person-menu" onMouseEnter={this.onMenuMouseEnter.bind(this)}>
          <div onClick={this.openNewPage.bind(this, '/users/favorite-view')} className="user-info">
            <div className="avatar"
              style={bgAvatar}
              alt={name}
            />
            {/* <div className="nickname one-line">{name}</div> */}
          </div>
          <div className="person-menu-down-layer">
            <ul className="">
              <li>
                <a href="/users/favorite-view" target="_blank">
                  我的主页
                </a>
              </li>
              <li>
                <a href="/users/follow-view" target="_blank">
                  我的订阅
                </a>
              </li>
              <li>
                <a href="/users/profile-view" target="_blank">个人设置</a>
              </li>
              <li id="logout">
                <a className="btn-logout" onClick={this.logout.bind(this)}>退出</a>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    return null
  }

  render() {
    return (
      <div>
        {this.renderUploadBtn()}
        {this.renderLoginContent()}
      </div>
    )
  }
}

export default HeaderMenu