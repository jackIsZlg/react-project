import base from '../../common/baseModule'
import { LoginInput, LoginType, Button } from './LoginBase'

// 重置密码
class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: this.props.data.phone || '',
      vCode: '',
      password: '',
      step: 1,
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

  // 获取验证码
  handleSend(cb) {
    let self = this
    if (!self.state.phone) {
      self.changeErrorTip(1, '请输入手机号码')
      return
    }
    if (!base.regExpPhone(self.state.phone)) {
      self.changeErrorTip(1, '请输入正确的手机号码')
      return
    }
    $.ajax({
      'type': 'GET',
      'url': `${base.baseUrl}/auth/send-reset-code`,
      'data': {
        'mobile': self.state.phone
      }
    }).done((d) => {
      if (d.success) {
        cb && cb()
      }
      // 用户未注册
      if (d.errorCode === 'L06') {
        self.changeErrorTip(1, '没有该用户，请注册')
      }

      // 验证码发送失败
      if (d.errorCode === 'L12') {
        cb && cb()
      }
    }).fail((d) => {
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

  // 切换状态
  handleChange() {
    let self = this
    let { step, phone, vCode } = self.state
    if (step === 1) { // 第一步
      if (!phone) {
        self.changeErrorTip(1, '请输入手机号码')
        return
      }
      if (!base.regExpPhone(phone)) {
        self.changeErrorTip(1, '请输入正确的手机号码')
        return
      }
      if (!vCode) {
        self.changeErrorTip(2, '请输入验证码')
        return
      }
      if (vCode.length !== 6) {
        self.changeErrorTip(2, '请输入正确的验证码')
        return
      }
      $.ajax({
        'type': 'POST',
        'url': `${base.baseUrl}/auth/check-pwd-reset`,
        'contentType': 'application/json',
        'dataType': 'json',
        'data': JSON.stringify({
          'mobile': phone,
          'action': 'validate',
          'code': vCode
        })
      }).done((d) => {
        if (d.success) {
          this.setState({
            'step': 2
          })
        }

        // 用户未注册
        if (d.errorCode === 'L06') {
          self.changeErrorTip(1, '没有该用户，请注册')
        }

        // 验证码错误
        if (d.errorCode === 'L14') {
          self.changeErrorTip(2, d.errorDesc)
        }
      }).fail((d) => {
        console.log(d.errorDesc)
      })
    } else { // 第二步
      this.setState({
        'step': 1
      })
    }
  }

  changeErrorTip(status, tip) {
    let { errorTip } = this.state
    errorTip.status = status
    errorTip.tip = tip
    this.setState({ errorTip })
  }

  // 提交新密码
  handleCheck() {
    let self = this
    let { password, phone, vCode } = self.state
    if (!password) {
      self.changeErrorTip(3, '请输入密码')
      return
    }
    if (password.length < 6 || password.length > 16) {
      self.changeErrorTip(3, '密码长度应为6-16字符')
      return
    }
    $.ajax({
      'type': 'POST',
      'url': `${base.baseUrl}/auth/check-pwd-reset`,
      'contentType': 'application/json',
      'dataType': 'json',
      'data': JSON.stringify({
        'mobile': phone,
        'action': 'confirmed',
        'code': vCode,
        'password': password
      })
    }).done((d) => {
      if (d.success) {
        self.changeStep(11)
      } else {
        console.log(d.errorDesc)
      }
    }).fail((d) => {
      console.log(d.errorDesc)
    })
  }

  renderStep1() {
    let { errorTip, phone, vCode, step, password } = this.state
    switch (step) {
      case 1:
        return (
          <div>
            <LoginInput errorTip={errorTip}
              phone={phone}
              vCode={vCode}
              handleInputPhone={this.handleInputPhone.bind(this)}
              handleInputCode={this.handleInputCode.bind(this)}
              handleSend={this.handleSend.bind(this)}
            />
            <div className="login-footer">
              <Button type={(!!phone && vCode.length === 6) ? 'black' : 'forbid'} handleClick={!!phone && vCode.length === 6 && this.handleChange.bind(this)}>下一步</Button>
              <Button type='default' handleClick={this.changeStep.bind(this, 1)}>返回</Button>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <div className="login-input">
              <div className='login-input-phone'>
                <input ref="password"
                  type="password"
                  onChange={this.handleInputPW.bind(this)}
                  value={password}
                  placeholder="请输入您的新密码"
                />
                {
                  errorTip.status === 3 && <div className='login-input-tip'>{errorTip.tip}</div>
                }
              </div>
            </div>
            <div className="login-footer">
              <Button type={password.length >= 6 ? 'black' : 'forbid'} handleClick={password.length >= 6 && this.handleCheck.bind(this)}>确定</Button>
              <Button type='default' handleClick={this.handleChange.bind(this)}>返回</Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="login-panel login-panel-6">
        <LoginType title='密码重置' />
        {this.renderStep1()}
      </div>
    )
  }
}

export default ResetPassword
