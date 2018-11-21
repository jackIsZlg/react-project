/**
 * LoginManage管理其余9个模块
 *
 * 1：手机登录，2：微信登录，3：手机注册，4：个人资料修改，
 * 5：选择喜欢的图片，6：重置密码，7：登录成功，8：微信注册绑定手机号
 * 9：选择推荐博主，10：选择标签 11：密码修改成功
 * -1：关闭窗口
 */
import classNames from 'classnames'
import base from '../../common/baseModule'
import HeaderMenu from '../../components/HeaderMenu/HeaderMenu'

// 分支模块
import PhoneLogin from './PhoneLogin'
import WeixinLogin from './WeixinLogin'
import PhoneResigner from './PhoneResigner'
import EditUserInfo from './EditUserInfo'
import FavImage from './FavImage'
import ResetPassword from './ResetPassword'
import SuccessLogin from './SuccessLogin'
import BindPhone from './BindPhone'
import RecommendBlogger from './RecommendBlogger'
import SelectTag from './SelectTag'
import ResetPasswordSuccess from './ResetPasswordSuccess'
import { Icon } from '../../components/base/baseComponents'

$('#app').append("<div id='login-pop-wrapper'></div>")

// 管理模块
class LoginManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: this.changeLoginMoudle(props.mode), // 默认手机号登陆 默认mode为undefined
      nickname: '',
      sex: 1,
      avatar: '',
      phone: '',
      password: '',
      reference: -1,
      closeBody: false, // 锁定浮层
      wrapperSize: 1, // 容器宽度 1.正常 2.宽400px 3.宽600px 4.设置最小宽高和最大宽高
      logoStatus: true, // 头部logo是否显示 true:隐藏 false:不隐藏
      closeStatus: true // 关闭按钮是否显示 true:隐藏 false:不隐藏
    }
  }

  componentWillMount() {
    // let { type } = this.props
    // type === 'register' && this.changeStep(3)

    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
    const initStep = base.queryString('step')
    if (initStep) {
      this.changeStep(initStep * 1)
    }
    this.updateWrapperStatus()
  }

  changeLoginMoudle(mode) {
    switch (mode) {
      case 'edit':
        return 10
      case 'bindPhone':
        return 8
      default:
        return 3
    }
  }

  // 修改步骤
  changeStep(step) {
    if (step === -1) {
      this.handleClose()
      return
    }
    this.setState({ step }, () => {
      this.updateWrapperStatus()
    })
  }

  updateWrapperStatus() {
    let { step, logoStatus, closeStatus, wrapperSize } = this.state
    let { mode, closable } = this.props
    console.log(this.props)
    switch (step) {
      case 1:
      case 2:
      case 3:
        logoStatus = false
        closeStatus = closable
        wrapperSize = 1
        break
      case 4:
        logoStatus = true
        closeStatus = true
        wrapperSize = 3
        break
      case 5:
      case 8:
        logoStatus = false
        closeStatus = !mode
        break
      case 9:
        closeStatus = true
        break
      case 7:
        logoStatus = true
        closeStatus = true
        wrapperSize = 2
        break
      case 10:
        wrapperSize = 4
        closeStatus = !mode
        break
      case 11:
        logoStatus = true
        break
      default:
        break
    }
    this.setState({ logoStatus, closeStatus, wrapperSize })
  }

  // 同步数据
  synchroData(options, cb) {
    let _data = this.state
    for (let i in options) {
      _data[i] = options[i]
      console.log(i, options[i])
    }
    this.setState(_data, () => {
      cb && cb()
    })
    base.eventCount.add(1062, {
      '用户ID': base.LS().id,
      '选择内容': _data
    })
  }

  // 阻止冒泡
  handleBubble(e) {
    e.stopPropagation()
  }

  // 关闭,销毁
  handleClose() {
    // 登录页，跳出，mask不可关闭
    if (/\/login/.test(window.location.pathname)) {
      return
    }

    if (this.props.mode !== 'edit' && this.state.step === 10) {
      return
    }

    if (this.props.mode === 'bindPhone') {
      this.closeComponent()
      return
    }

    // 特定步骤不允许关闭
    if (this.state.step === 4
      || this.state.step === 5
      || this.state.step === 8
      || this.state.step === 9) {
      return
    }

    this.closeComponent()
    this.props.onFinish && this.props.onFinish()
  }

  closeComponent() {
    this.state.closeBody && base.bodyScroll(true)

    let el = ReactDOM.findDOMNode(this)
    el.parentNode.removeChild(el)
    delete this
  }

  // 登陆成功
  successLogin() {
    let self = this
    base.LS.clear()
    if (!self.props.callback) {
      // 指向首页
      window.location.href = base.baseUrl
    } else if (typeof self.props.callback === 'string') {
      // 指向指定页面
      window.location.href = self.props.callback
    } else {
      // 执行回调
      self.props.callback()
      if (/\/folder\/public/.test(window.location.pathname)) {
        window.location.reload()
        return
      }
      let loginEl = document.getElementById('login')
      if (!!loginEl.innerHTML) {
        loginEl.innerHTML = ''
      }

      // 更新头部状态
      ReactDOM.render(<HeaderMenu init={true} />, loginEl)

      // 销毁
      self.handleClose()
    }
  }

  // 根据step选择相应模块
  renderModule() {
    let _module
    switch (this.state.step) {
      case 1:
        _module = (<PhoneLogin data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 2:
        _module = (<WeixinLogin data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 3:
        _module = (<PhoneResigner data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 4:
        _module = (<EditUserInfo data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 5:
        _module = (<FavImage data={this.state}
          changeStep={this.changeStep.bind(this)}
          successLogin={this.successLogin.bind(this)}
        />)
        break
      case 6:
        _module = (<ResetPassword data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
        break
      case 7:
        _module = (<SuccessLogin data={this.state}
          successLogin={this.successLogin.bind(this)}
        />)
        break
      case 8:
        _module = (<BindPhone data={this.state}
          mode={this.props.mode || 'login'}
          changeStep={this.changeStep.bind(this)}
          success={phone => this.props.success && this.props.success(phone)}
          synchroData={this.synchroData.bind(this)}
          onFinish={this.handleClose.bind(this)}
        />)
        break
      case 9:
        _module = <RecommendBlogger changeStep={this.changeStep.bind(this)} />
        break
      case 10:
        _module = (<SelectTag mode={this.props.mode || 'login'}
          hasSelect={this.props.hasSelect}
          changeStep={this.changeStep.bind(this)}
          onFinish={() => { !this.props.mode ? this.changeStep(7) : this.handleClose() }}
        />)
        break
      case 11:
        _module = (<ResetPasswordSuccess data={this.state}
          changeStep={this.changeStep.bind(this)}
        />)
        break
      default:
        _module = (<PhoneLogin data={this.state}
          changeStep={this.changeStep.bind(this)}
          synchroData={this.synchroData.bind(this)}
        />)
    }
    return _module
  }

  render() {
    let { step, logoStatus, closeStatus, wrapperSize } = this.state
    return (
      <div ref={el => this.loginWrapper = el} className={classNames('login-mask', { white: step === 9 })} onClick={this.handleClose.bind(this)}>
        <div className={classNames('login-wrapper', { 'login-success': wrapperSize === 2, 'personal': wrapperSize === 3, 'tag-list': wrapperSize === 4 })} onClick={this.handleBubble.bind(this)}>
          <div className={classNames('login-title', { 'hidden': logoStatus })}>
            <Icon type='new-logo' />
          </div>
          <div className={classNames('login-close', { 'hidden': closeStatus })} onClick={this.handleClose.bind(this)}>
            <Icon type='close-pop' />
          </div>
          {this.renderModule()}
        </div>
      </div>
    )
  }
}

export default LoginManage