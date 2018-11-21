import base from '../../common/baseModule'
import {SendCodeBtn} from '../../components/Login/LoginBase'

// $('#app').append('<div id="bind-phone-pop-wrapper"></div>')

// 绑定手机号
class BindPhone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      vCode: '',
      password: '',
      closeBody: false,
      bindTip: false
    }
  }

  componentWillMount() {
    // 锁定浮层下层
    this.state.closeBody = window.isBodyScroll
    window.isBodyScroll && base.bodyScroll(false)
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

  // 获取验证码
  handleSend(success, error) {
    let self = this
    if (!self.state.phone) {
      new base.warningTip(self.refs.phone, '请输入手机号码')
      error && error()
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      new base.warningTip(self.refs.phone, '请输入正确的手机号码')
      error && error()
      return
    }
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/auth/send-bind-code`,
      'data': {
        'mobile': self.state.phone
      }
    }).done((d) => {
      if (d.success) {
        this.setState({bindTip: false})
        success && success()
      }

      // 手机号已绑定微信账号
      if (d.errorCode === 'D11') {
        this.setState({bindTip: false})
        new base.warningTip(self.refs.phone, '该手机号已被使用并且已绑定微信账号，无法继续绑定')
        error && error()
      }

      // 手机号已注册，但未绑定微信号
      if (d.errorCode === 'D07') {
        this.setState({bindTip: true})
        success && success()
      }

      // 验证码发送失败
      if (d.errorCode === 'L12') {
        this.setState({bindTip: false})
        error && error()
      }
    }).fail((d) => {
      error && error()
      console.log(d.errorDesc)
    })
  }

  // 输入验证码
  handleInputCode(e) {
    let val = e.target.value
    this.setState({
      vCode: val
    })
  }

  // 输入密码
  handleInputPW(e) {
    let val = e.target.value
    this.setState({
      password: val
    })
  }

  // 提交手机号
  handlePost() {
    let self = this
    if (!self.state.phone) {
      new base.warningTip(self.refs.phone, '请输入手机号码')
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      new base.warningTip(self.refs.phone, '请输入正确的手机号码')
      return
    }
    if (!self.state.vCode) {
      new base.warningTip(self.refs.vCode, '请输入验证码')
      return
    }
    if (self.state.vCode.length !== 6) {
      new base.warningTip(self.refs.vCode, '请输入正确的验证码')
      return
    }
    if (!self.state.password) {
      new base.warningTip(self.refs.password, '请输入密码')
      return
    }
    if (self.state.password.length < 6 || self.state.password.length > 16) {
      new base.warningTip(self.refs.password, '密码长度应为6-16字符')
      return
    }

    $.ajax({
      'type': 'POST',
      'url': `${base.baseUrl}/auth/bind-mobile`,
      'data': {
        'mobile': self.state.phone,
        'code': self.state.vCode,
        'password': self.state.password
      }
    }).done((d) => {
      if (d.success) {
        self.props.success && self.props.success(self.state.phone)
        self.handleClose()
      }
      // 验证码错误
      if (d.errorCode === 'L14') {
        new base.warningTip(self.refs.vCode, d.errorDesc)
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  // 关闭,销毁
  handleClose() {
    let el = ReactDOM.findDOMNode(this)
    this.state.closeBody && base.bodyScroll(true)
    el.parentNode.removeChild(el)
    delete this
  }

  render() {
    return (<div id="bind-phone-pop-panel">
      <div className="bind-phone-pop-panel">
        <i className="iconfont cancel-pop"
          onClick={this.handleClose.bind(this)}
        />
        <div className="panel-title">绑定手机号</div>
        <div>
          <div className="login-input">
            <div>
              <input ref="phone"
                type="phone"
                maxLength="11"
                onChange={this.handleInputPhone.bind(this)}
                value={this.state.phone}
                placeholder="请输入手机号"
              />
            </div>
            <div className="v-code margin-t-10">
              <div className="v-code-input">
                <input ref="vCode"
                  type="tel"
                  maxLength="6"
                  onChange={this.handleInputCode.bind(this)}
                  value={this.state.vCode}
                  placeholder="请输入验证码"
                />
              </div>
              <SendCodeBtn handleClick={this.handleSend.bind(this)}/>
            </div>
            <div className="margin-t-10">
              <input ref="password"
                type="password"
                onChange={this.handleInputPW.bind(this)}
                autoComplete="on"
                value={this.state.password}
                placeholder="输入密码(6-16字符)"
              />
            </div>
          </div>
          <div className="login-footer">
            {
                            this.state.bindTip &&
                            <div className='bind-tip'>
                                * 该手机号已注册，<br/>若继续绑定将丢失手机账号信息，确定继续？
                            </div>
                        }
            <button className="btn-login black"
              onClick={this.handlePost.bind(this)}
            >确定
            </button>
          </div>
        </div>
      </div>
    </div>)
  }
}

export {BindPhone}