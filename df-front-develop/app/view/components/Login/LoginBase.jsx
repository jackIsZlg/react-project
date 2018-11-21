import classNames from 'classnames'
import base from '../../common/baseModule'
import { Icon } from '../../components/base/baseComponents'

// login + title
class LoginHeader extends React.Component {
  render() {
    return (
      <div className="login-header">
        <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/logo-round-50.png" alt='' />
        <div className="title">{this.props.title || '欢迎回到 DeepFashion'}</div>
        <div className="title-sub">每天都想刷的时尚</div>
      </div>)
  }
}

class Button extends React.Component {
  render() {
    let { type, handleClick, children } = this.props
    return (
      <button className={`btn-login ${type}`} onClick={handleClick}>
        {
          React.Children.map(children, (child) => {
            return child
          })
        }
      </button>
    )
  }
}

class LoginType extends React.Component {
  changeLoginType(value) {
    let { current, changeStep } = this.props
    if (current === value) {
      return
    }
    changeStep && changeStep(value)
  }

  render() {
    let { current, title, style } = this.props

    if (!current) {
      return (
        <div className="panel-title" style={style}>{title}</div>
      )
    }

    return (
      <ul className='login-type'>
        <li className={classNames('login-type-item', { 'current': current === 3 })} onClick={this.changeLoginType.bind(this, 3)}>手机登录</li>
        <li className={classNames('login-type-item', { 'current': current === 1 })} onClick={this.changeLoginType.bind(this, 1)}>账号密码登录</li>
      </ul>
    )
  }
}

class LoginFooter extends React.Component {
  render() {
    let { sendRegister, toWXLogin, operable } = this.props
    return (
      <div>
        <Button type={operable ? 'black' : 'forbid'} handleClick={() => operable && sendRegister()}>
          登录
        </Button>
        <div className="agree-protocol">
          登录即表示同意<a href="/register/agreement" target="_blank">《DeepFashion用户使用协议》</a>
        </div>
        <div className='wechat-login'>
          <Button type='wechat-btn' handleClick={() => toWXLogin()}>
            <Icon type='wechat' />
          </Button>
          <div className="wechat-text">
            微信登录
          </div>
        </div>
      </div>
    )
  }
}

class LoginInput extends React.Component {
  render() {
    let { errorTip, phone, vCode, handleInputPhone, handleInputCode, handleSend, bindTip } = this.props
    return (
      <div className="login-input">
        <div className='login-input-phone'>
          <input ref="phone"
            type="phone"
            maxLength="11"
            onChange={handleInputPhone}
            autoComplete="on"
            value={phone}
            placeholder="请输入手机号"
          />
          {
            errorTip.status === 1 && <div className='login-input-tip'>{errorTip.tip}</div>
          }
        </div>
        {
          bindTip && <div className='bind-message'>该手机号已被注册，若继续绑定将丢失该手机账号信息</div>
        }
        <div className="margin-t-10 login-input-phone v-code">
          <div className="v-code">
            <input ref="vCode"
              type="tel"
              maxLength="6"
              onChange={handleInputCode}
              autoComplete="off"
              value={vCode}
              placeholder="请输入验证码"
            />
            {
              errorTip.status === 2 && <div className='login-input-tip'>{errorTip.tip}</div>
            }
          </div>
          <SendCodeBtn operable={!!phone} handleClick={handleSend} />
        </div>
      </div>
    )
  }
}

// 发送验证码
class SendCodeBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 0, // 倒计时
      isFirst: true, // 第一次获取验证码
      startTimeOut: false
    }
  }

  // 组件移除时，清空定时器
  componentWillUnmount() {
    // clearTimeout(this.state.timeOut);
  }

  // 获取验证码
  handleSendCode() {
    let { startTimeOut } = this.state
    if (startTimeOut) {
      return
    }

    this.state.startTimeOut = true

    this.props.handleClick(() => {
      base.eventCount.add(1002)
      this.setState({
        isFirst: false,
        time: 60
      }, this.vCodeTimeout)
    }, () => {
      this.state.startTimeOut = false
    })
  }

  // 倒计时
  vCodeTimeout() {
    let self = this
    if (self.state.time <= 0) {
      self.setState({
        time: 0,
        startTimeOut: false
      })
      return
    }
    this.state.timeOut = setTimeout(() => {
      self.setState({
        time: --self.state.time
      }, self.vCodeTimeout)
    }, 1000)
  }

  // 修改发送验证码按钮文案
  renderCodeBtn() {
    if (this.state.isFirst) {
      return '发送验证码'
    }
    if (this.state.time === 0) {
      return '再次发送'
    }
    return `${this.state.time}秒`
  }

  render() {
    let { operable } = this.props
    let { startTimeOut } = this.state
    return (
      <button className={classNames('btn-send-v-code', {
        'forbid': !operable || startTimeOut
      })}
        onClick={operable && !startTimeOut && this.handleSendCode.bind(this)}
      >{this.renderCodeBtn()}
      </button>
    )
  }
}

export { LoginHeader, SendCodeBtn, LoginType, LoginFooter, LoginInput, Button }