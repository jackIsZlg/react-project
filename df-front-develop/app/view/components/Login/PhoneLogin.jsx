import base from '../../common/baseModule'
import { LoginType, LoginFooter } from './LoginBase'

// 手机登录
class PhoneLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      password: '',
      errorTip: {
        status: 1,
        tip: ''
      }
    }
  }

  // 组件被移除
  componentWillUnmount() {
    this.props.synchroData({
      phone: this.state.phone
    })
  }

  changeStep(step) {
    this.props.changeStep(step)
  }

  // 输入手机号
  handleInputPhone(e) {
    let val = e.target.value
    this.setState({
      phone: val
    })
  }

  // 输入密码
  handleInputPW(e) {
    let val = e.target.value
    this.setState({
      password: val
    })
  }

  changeErrorTip(status, tip) {
    let { errorTip } = this.state
    errorTip.status = status
    errorTip.tip = tip
    this.setState({ errorTip })
  }

  // 登录
  handleLogin() {
    base.eventCount.add(1006)
    let self = this
    let { errorTip } = self.state
    if (!self.state.phone) {
      self.changeErrorTip(1, '请输入手机号码')
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      self.changeErrorTip(1, '请输入正确的手机号码')
      return
    }
    if (!self.state.password) {
      self.changeErrorTip(2, '请输入密码')
      return
    }
    if (self.state.password.length < 6 || self.state.password.length > 16) {
      self.changeErrorTip(2, '密码长度应为6-16字符')
      return
    }
    self.changeErrorTip(2, '')
    $.ajax({
      'type': 'POST',
      'url': `${base.baseUrl}/auth/phone-login`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify({
        mobile: self.state.phone,
        password: self.state.password,
      })
    }).done((d) => {
      if (d.success) {
        base.isLogin = true
        self.props.synchroData({
          'phone': self.state.phone,
          'nickname': d.result.users.name,
          'avatar': d.result.users.avatar
        }, () => {
          base.eventCount.add(1007)
          d.result.users.name ? self.changeStep(7) : self.changeStep(4)
        })
      }

      // 用户名密码错误
      if (d.errorCode === 'L04') {
        self.changeErrorTip(2, '密码错误，请重新输入')
      }

      // 用户未注册
      if (d.errorCode === 'L06') {
        errorTip.status = 1
        errorTip.tip = '没有该用户，请注册'
        self.changeErrorTip(1, '没有该用户，请注册')
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  // 回车登录
  handleDownLogin(e) {
    e.keyCode === 13 && this.handleLogin()
  }

  // 跳转手机号注册
  toPhoneResigner() {
    base.eventCount.add(1001)
    this.changeStep(3)
  }

  // 跳转微信登录
  toWXLogin() {
    base.eventCount.add(1004)
    this.changeStep(2)
  }

  render() {
    let { data } = this.props
    let { errorTip, phone, password } = this.state
    return (
      <div className='login-panel login-panel-1'>
        <LoginType current={data.step} changeStep={this.changeStep.bind(this)} />
        <div className='login-input'>
          <div className='login-input-phone'>
            <input ref='phone'
              type='phone'
              value={phone}
              onChange={this.handleInputPhone.bind(this)}
              maxLength='11'
              placeholder='请输入手机号'
            />
            {
              errorTip.status === 1 && <div className='login-input-tip'>{errorTip.tip}</div>
            }
          </div>
          <div className='margin-t-10 login-input-phone'>
            <input ref='password'
              type='password'
              value={password}
              maxLength={16}
              onChange={this.handleInputPW.bind(this)}
              onKeyDown={this.handleDownLogin.bind(this)}
              placeholder='请输入密码'
            />
            {
              errorTip.status === 2 && <div className='login-input-tip'>{errorTip.tip}</div>
            }
          </div>
          <span className="btn-forget-pw" onClick={this.changeStep.bind(this, 6)}>忘记密码</span>
        </div>
        <div className="login-footer">
          <LoginFooter operable={!!phone && password.length >= 6} sendRegister={this.handleLogin.bind(this)} toWXLogin={this.toWXLogin.bind(this)} />
        </div>
      </div>
    )
  }
}

export default PhoneLogin