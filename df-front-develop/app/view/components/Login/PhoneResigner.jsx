import base from '../../common/baseModule'
import { LoginType, LoginFooter, LoginInput } from './LoginBase'

// 手机注册
class PhoneResigner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '', // 手机号
      vCode: '', // 验证码
      errorTip: {
        status: 1,
        tip: ''
      },
      isAgree: false
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

  // 输入验证码
  handleInputCode(e) {
    let val = e.target.value
    this.setState({
      vCode: val
    })
  }

  changeErrorTip(status, tip) {
    let { errorTip } = this.state
    errorTip.status = status
    errorTip.tip = tip
    this.setState({ errorTip })
  }

  // 发送验证码
  handleSend(success, error) {
    let self = this
    if (!self.state.phone) {
      self.changeErrorTip(1, '请输入手机号码')
      error && error()
      return
    }
    if (!base.regExpPhone(this.state.phone)) {
      self.changeErrorTip(1, '请输入正确的手机号码')
      error && error()
      return
    }
    self.changeErrorTip(1, '')
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/auth/send-code`,
      'data': {
        'mobile': self.state.phone
      }
    }).done((d) => {
      if (d.success) {
        success && success()
      }
      // 用户已注册
      if (d.errorCode === 'L13') {
        self.changeErrorTip(1, d.errorDesc)
        error && error()
      }

      // 验证码发送失败
      if (d.errorCode === 'L12') {
        error && error()
      }
    }).fail((d) => {
      error && error()
      console.log(d.errorDesc)
    })

    console.log('发送验证码')
  }

  // 同意使用协议
  agreeProtocol() {
    this.setState({
      'isAgree': !this.state.isAgree
    })
  }

  // 发送注册信息
  sendRegister() {
    let self = this
    if (!self.state.phone) {
      self.changeErrorTip(1, '请输入手机号码')
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      self.changeErrorTip(1, '请输入正确的手机号码')
      return
    }
    if (!self.state.vCode) {
      self.changeErrorTip(2, '请输入验证码')
      return
    }
    if (self.state.vCode.length !== 6) {
      self.changeErrorTip(2, '请输入正确的验证码')
      return
    }
    self.changeErrorTip(2, '')
    $.ajax({
      'type': 'POST',
      'url': `${base.baseUrl}/auth/phone-code-login`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify({
        mobile: self.state.phone,
        code: self.state.vCode
      })
    }).done((d) => {
      if (d.success) {
        let {users} = d.result
        let userInfo = users.type === '0' ? {
          phone: this.state.phone,
          nickname: users.name || this.state.phone.substring(this.state.phone.length - 4),
          avatar: users.avatar,
          sex: 1
        } : {
          phone: this.state.phone,
          nickname: this.state.phone.substring(this.state.phone.length - 4),
          avatar: 'https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1530244007170_431.png',
          sex: 1
        }
        // let step = users.type === '0' ? 7 : 4
        let step = 7
        self.props.synchroData(userInfo, () => {
          base.eventCount.add(1003)
          self.changeStep(step)
        })
      } else {
        console.log(d.errorDesc)
      }

      // 用户已注册
      if (d.errorCode === 'L13') {
        self.changeErrorTip(1, d.errorDesc)
      }

      // 验证码错误
      if (d.errorCode === 'L14') {
        self.changeErrorTip(2, d.errorDesc)
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  // 微信登陆
  toWXLogin() {
    base.eventCount.add(1004)
    this.changeStep(2)
  }

  render() {
    let { data } = this.props
    let { errorTip, phone, vCode } = this.state
    return (
      <div className="login-panel login-panel-3">
        <LoginType current={data.step} changeStep={this.changeStep.bind(this)} />
        <LoginInput errorTip={errorTip}
          phone={phone}
          vCode={vCode}
          handleInputPhone={this.handleInputPhone.bind(this)}
          handleInputCode={this.handleInputCode.bind(this)}
          handleSend={this.handleSend.bind(this)}
        />
        <div className="login-footer">        
          <LoginFooter operable={!!phone && vCode.length === 6} sendRegister={this.sendRegister.bind(this)} toWXLogin={this.toWXLogin.bind(this)} />
        </div>
      </div>
    )
  }
}

export default PhoneResigner