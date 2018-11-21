import base from '../../common/baseModule'
import { LoginType, LoginInput, Button } from './LoginBase'

// 微信注册后绑定手机号
class BindPhone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
      vCode: '',
      bindTip: false,
      errorTip: {
        status: 1,
        tip: ''
      }
    }
  }

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

  changeInputTip(type, tip) {
    let { errorTip } = this.state
    errorTip.status = type
    errorTip.tip = tip
    this.setState({ errorTip })
  }

  // 获取验证码
  handleSend(success, error) {
    let self = this
    if (!self.state.phone) {
      self.changeInputTip(1, '请输入手机号码')
      error && error()
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      self.changeInputTip(1, '请输入正确的手机号码')
      error && error()
      return
    }
    self.changeInputTip(1, '')
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/auth/send-bind-code`,
      'data': {
        'mobile': self.state.phone
      }
    }).done((d) => {
      if (d.success) {
        self.setState({ bindTip: false })
        success && success()
      }

      // 已被绑定
      if (d.errorCode === 'D11') {
        self.changeInputTip(1, d.errorDesc)
        error && error()
      }

      // 用户未注册
      if (d.errorCode === 'D07') {
        self.setState({ bindTip: true })
        // self.changeInputTip(1, '该手机号已被注册，若继续绑定将丢失该手机账号信息')
        success && success()
      }

      // 验证码发送失败
      if (d.errorCode === 'L12') {
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

  // 提交手机号
  handlePost() {
    let self = this
    if (!self.state.phone) {
      self.changeInputTip(1, '请输入手机号码')
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      self.changeInputTip(1, '请输入正确的手机号码')
      return
    }
    if (!self.state.vCode) {
      self.changeInputTip(2, '请输入验证码')
      return
    }
    if (self.state.vCode.length !== 6) {
      self.changeInputTip(2, '请输入正确的验证码')
      return
    }
    self.changeInputTip(2, '')
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
        this.props.success && this.props.success(self.state.phone)
        this.props.mode === 'login' ? self.changeStep(7) : self.props.onFinish()
      }
      // 验证码错误
      if (d.errorCode === 'L14') {
        self.changeInputTip(2, d.errorDesc)
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  render() {
    let { errorTip, phone, vCode, bindTip } = this.state
    return (
      <div className="login-panel login-panel-6">
        <LoginType title='绑定手机号' />
        <LoginInput errorTip={errorTip}
          bindTip={bindTip}
          phone={phone}
          vCode={vCode}
          handleInputPhone={this.handleInputPhone.bind(this)}
          handleInputCode={this.handleInputCode.bind(this)}
          handleSend={this.handleSend.bind(this)}
        />
        <div className="bind-tip">
          绑定手机号成功后，即可使用该手机号快捷登录
        </div>
        <div className="login-footer">
          <Button type={(!!phone && vCode.length === 6) ? 'black' : 'forbid'} handleClick={!!phone && vCode.length === 6 && this.handlePost.bind(this)}>确定</Button>
          {
            this.props.mode === 'login' && <Button type='default' handleClick={this.changeStep.bind(this, 7)}>跳过</Button>
          }
        </div>
      </div>
    )
  }
}

export default BindPhone